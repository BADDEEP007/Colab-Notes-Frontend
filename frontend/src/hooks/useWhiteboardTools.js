import { useEffect, useRef } from 'react';
import { Rect, Circle, Line, IText, PencilBrush, EraserBrush } from 'fabric';

/**
 * Custom hook for managing whiteboard drawing tools
 * Handles tool-specific functionality for pen, eraser, shapes, text, and selection
 * 
 * @param {Object} fabricCanvas - Fabric.js canvas instance
 * @param {string} selectedTool - Currently selected tool
 * @param {Object} toolOptions - Tool options (color, strokeWidth)
 * @param {boolean} canEdit - Whether user can edit
 * @returns {Object} Tool management functions
 */
export default function useWhiteboardTools(
  fabricCanvas,
  selectedTool,
  toolOptions,
  canEdit
) {
  const isDrawingShape = useRef(false);
  const shapeStartPoint = useRef(null);
  const currentShape = useRef(null);

  // Setup pen tool
  const setupPenTool = () => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = true;
    fabricCanvas.freeDrawingBrush = new PencilBrush(fabricCanvas);
    fabricCanvas.freeDrawingBrush.color = toolOptions.color;
    fabricCanvas.freeDrawingBrush.width = toolOptions.strokeWidth;
  };

  // Setup eraser tool
  const setupEraserTool = () => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = true;
    
    // Create eraser brush (white color to "erase")
    const eraserBrush = new PencilBrush(fabricCanvas);
    eraserBrush.color = '#ffffff';
    eraserBrush.width = toolOptions.strokeWidth * 2; // Larger for erasing
    
    fabricCanvas.freeDrawingBrush = eraserBrush;
  };

  // Setup selection tool
  const setupSelectionTool = () => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = false;
    fabricCanvas.selection = true;
    
    // Make all objects selectable
    fabricCanvas.forEachObject((obj) => {
      obj.selectable = true;
      obj.evented = true;
    });
  };

  // Setup shape drawing (rectangle, circle, line, arrow)
  const setupShapeTool = () => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = false;
    fabricCanvas.selection = false;
    
    // Disable selection on existing objects
    fabricCanvas.forEachObject((obj) => {
      obj.selectable = false;
      obj.evented = false;
    });
  };

  // Setup text tool
  const setupTextTool = () => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = false;
    fabricCanvas.selection = false;
  };

  // Handle mouse down for shape drawing
  const handleShapeMouseDown = (event) => {
    if (!canEdit || !fabricCanvas) return;

    const pointer = fabricCanvas.getPointer(event.e);
    isDrawingShape.current = true;
    shapeStartPoint.current = pointer;

    // Create initial shape based on selected tool
    switch (selectedTool) {
      case 'rectangle':
        currentShape.current = new Rect({
          left: pointer.x,
          top: pointer.y,
          width: 0,
          height: 0,
          fill: 'transparent',
          stroke: toolOptions.color,
          strokeWidth: toolOptions.strokeWidth,
        });
        break;

      case 'circle':
        currentShape.current = new Circle({
          left: pointer.x,
          top: pointer.y,
          radius: 0,
          fill: 'transparent',
          stroke: toolOptions.color,
          strokeWidth: toolOptions.strokeWidth,
        });
        break;

      case 'line':
      case 'arrow':
        currentShape.current = new Line(
          [pointer.x, pointer.y, pointer.x, pointer.y],
          {
            stroke: toolOptions.color,
            strokeWidth: toolOptions.strokeWidth,
          }
        );
        break;

      default:
        return;
    }

    if (currentShape.current) {
      fabricCanvas.add(currentShape.current);
    }
  };

  // Handle mouse move for shape drawing
  const handleShapeMouseMove = (event) => {
    if (!isDrawingShape.current || !currentShape.current || !fabricCanvas) return;

    const pointer = fabricCanvas.getPointer(event.e);
    const startPoint = shapeStartPoint.current;

    switch (selectedTool) {
      case 'rectangle':
        currentShape.current.set({
          width: Math.abs(pointer.x - startPoint.x),
          height: Math.abs(pointer.y - startPoint.y),
          left: Math.min(pointer.x, startPoint.x),
          top: Math.min(pointer.y, startPoint.y),
        });
        break;

      case 'circle':
        const radius = Math.sqrt(
          Math.pow(pointer.x - startPoint.x, 2) +
          Math.pow(pointer.y - startPoint.y, 2)
        ) / 2;
        currentShape.current.set({
          radius: radius,
          left: startPoint.x,
          top: startPoint.y,
        });
        break;

      case 'line':
      case 'arrow':
        currentShape.current.set({
          x2: pointer.x,
          y2: pointer.y,
        });
        break;

      default:
        break;
    }

    fabricCanvas.renderAll();
  };

  // Handle mouse up for shape drawing
  const handleShapeMouseUp = () => {
    if (!isDrawingShape.current) return;

    isDrawingShape.current = false;
    shapeStartPoint.current = null;
    currentShape.current = null;
  };

  // Handle canvas click for text tool
  const handleTextClick = (event) => {
    if (!canEdit || !fabricCanvas || selectedTool !== 'text') return;

    const pointer = fabricCanvas.getPointer(event.e);

    const text = new IText('Type here...', {
      left: pointer.x,
      top: pointer.y,
      fill: toolOptions.color,
      fontSize: toolOptions.strokeWidth * 8, // Scale font size with stroke width
      fontFamily: 'Arial',
    });

    fabricCanvas.add(text);
    fabricCanvas.setActiveObject(text);
    text.enterEditing();
    text.selectAll();
  };

  // Setup tool based on selection
  useEffect(() => {
    if (!fabricCanvas || !canEdit) return;

    // Remove existing event listeners
    fabricCanvas.off('mouse:down');
    fabricCanvas.off('mouse:move');
    fabricCanvas.off('mouse:up');

    switch (selectedTool) {
      case 'pen':
        setupPenTool();
        break;

      case 'eraser':
        setupEraserTool();
        break;

      case 'select':
        setupSelectionTool();
        break;

      case 'rectangle':
      case 'circle':
      case 'line':
      case 'arrow':
        setupShapeTool();
        fabricCanvas.on('mouse:down', handleShapeMouseDown);
        fabricCanvas.on('mouse:move', handleShapeMouseMove);
        fabricCanvas.on('mouse:up', handleShapeMouseUp);
        break;

      case 'text':
        setupTextTool();
        fabricCanvas.on('mouse:down', handleTextClick);
        break;

      default:
        break;
    }

    return () => {
      if (fabricCanvas) {
        fabricCanvas.off('mouse:down');
        fabricCanvas.off('mouse:move');
        fabricCanvas.off('mouse:up');
      }
    };
  }, [fabricCanvas, selectedTool, toolOptions, canEdit]);

  return {
    setupPenTool,
    setupEraserTool,
    setupSelectionTool,
    setupShapeTool,
    setupTextTool,
  };
}
