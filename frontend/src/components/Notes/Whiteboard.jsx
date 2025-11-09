import { useEffect, useRef, useState } from 'react';
import { Canvas } from 'fabric';
import useWhiteboardTools from '../../hooks/useWhiteboardTools';
import useWhiteboardHistory from '../../hooks/useWhiteboardHistory';
import useWhiteboardSync from '../../hooks/useWhiteboardSync';
import useKeyboardShortcuts from '../../hooks/useKeyboardShortcuts';
import { exportWhiteboard } from '../../utils/whiteboardExport';

/**
 * Whiteboard component with Fabric.js canvas
 * Provides drawing capabilities with touch support and responsive behavior
 * Accessibility: Keyboard shortcuts for undo/redo, ARIA labels
 *
 * @param {Object} props
 * @param {string} props.noteId - Note ID for the whiteboard
 * @param {boolean} props.canEdit - Whether user can edit the whiteboard
 * @param {Function} props.onDrawingChange - Callback when drawing changes
 * @param {Object} props.initialData - Initial whiteboard data to load
 * @param {string} props.selectedTool - Currently selected drawing tool
 * @param {Object} props.toolOptions - Options for the selected tool (color, size, etc.)
 * @param {Function} props.onUndo - Callback for undo action
 * @param {Function} props.onRedo - Callback for redo action
 * @param {Function} props.onHistoryChange - Callback when history state changes
 * @param {Function} props.onExport - Callback for export action
 * @param {boolean} props.enableSync - Enable real-time synchronization (default: true)
 * @param {Function} props.onRemoteUpdate - Callback when remote update is received
 */
export default function Whiteboard({
  noteId,
  canEdit = true,
  onDrawingChange,
  initialData = null,
  selectedTool = 'pen',
  toolOptions = { color: '#000000', strokeWidth: 2 },
  onUndo,
  onRedo,
  onHistoryChange,
  onExport,
  enableSync = true,
  onRemoteUpdate,
}) {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  // Use whiteboard tools hook
  useWhiteboardTools(fabricCanvasRef.current, selectedTool, toolOptions, canEdit);

  // Use whiteboard history hook
  const { undo, redo, canUndo, canRedo } = useWhiteboardHistory(fabricCanvasRef.current);

  // Use whiteboard sync hook for real-time collaboration
  const { isRemoteUpdate } = useWhiteboardSync(
    fabricCanvasRef.current,
    enableSync ? noteId : null,
    onRemoteUpdate,
    100 // 100ms debounce
  );

  // Keyboard shortcuts for whiteboard
  useKeyboardShortcuts(
    {
      'ctrl+z': () => {
        if (canEdit && canUndo) {
          undo();
        }
      },
      'ctrl+y': () => {
        if (canEdit && canRedo) {
          redo();
        }
      },
      'ctrl+shift+z': () => {
        if (canEdit && canRedo) {
          redo();
        }
      },
    },
    canEdit && isReady
  );

  // Expose undo/redo functions to parent
  useEffect(() => {
    if (onUndo) {
      onUndo.current = undo;
    }
    if (onRedo) {
      onRedo.current = redo;
    }
  }, [undo, redo, onUndo, onRedo]);

  // Notify parent of history state changes
  useEffect(() => {
    if (onHistoryChange) {
      onHistoryChange({ canUndo, canRedo });
    }
  }, [canUndo, canRedo, onHistoryChange]);

  // Expose export function to parent
  useEffect(() => {
    if (onExport) {
      onExport.current = async (format) => {
        if (fabricCanvasRef.current) {
          await exportWhiteboard(fabricCanvasRef.current, format);
        }
      };
    }
  }, [onExport]);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current || fabricCanvasRef.current) return;

    // Create Fabric canvas
    const fabricCanvas = new Canvas(canvasRef.current, {
      width: containerRef.current?.offsetWidth || 800,
      height: containerRef.current?.offsetHeight || 600,
      backgroundColor: '#ffffff',
      isDrawingMode: canEdit && selectedTool === 'pen',
      selection: selectedTool === 'select',
    });

    // Enable touch support for mobile devices
    fabricCanvas.allowTouchScrolling = false;
    fabricCanvas.enableRetinaScaling = true;

    // Store reference
    fabricCanvasRef.current = fabricCanvas;
    setIsReady(true);

    // Load initial data if provided
    if (initialData) {
      try {
        fabricCanvas.loadFromJSON(initialData, () => {
          fabricCanvas.renderAll();
        });
      } catch (error) {
        console.error('Failed to load whiteboard data:', error);
      }
    }

    // Cleanup on unmount
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, []);

  // Handle canvas resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (!fabricCanvasRef.current || !containerRef.current) return;

      const container = containerRef.current;
      const canvas = fabricCanvasRef.current;

      // Update canvas dimensions
      canvas.setDimensions({
        width: container.offsetWidth,
        height: container.offsetHeight,
      });

      canvas.renderAll();
    };

    // Initial resize
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isReady]);

  // Handle drawing mode and tool changes
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;

    // Update drawing mode based on tool
    canvas.isDrawingMode = canEdit && selectedTool === 'pen';
    canvas.selection = selectedTool === 'select';

    // Update brush settings for pen tool
    if (selectedTool === 'pen' && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = toolOptions.color;
      canvas.freeDrawingBrush.width = toolOptions.strokeWidth;
    }

    // Disable selection for non-select tools
    if (selectedTool !== 'select') {
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  }, [selectedTool, toolOptions, canEdit]);

  // Handle canvas modifications and trigger callback with auto-save
  useEffect(() => {
    if (!fabricCanvasRef.current || !onDrawingChange) return;

    const canvas = fabricCanvasRef.current;
    let autoSaveTimer = null;

    const handleModified = () => {
      // Don't trigger callback if it's a remote update
      if (isRemoteUpdate()) return;

      // Clear existing timer
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }

      // Debounce auto-save (500ms delay)
      autoSaveTimer = setTimeout(() => {
        // Serialize canvas data
        const data = canvas.toJSON();
        onDrawingChange(data);
      }, 500);
    };

    // Listen for canvas modifications
    canvas.on('object:added', handleModified);
    canvas.on('object:modified', handleModified);
    canvas.on('object:removed', handleModified);
    canvas.on('path:created', handleModified);

    return () => {
      canvas.off('object:added', handleModified);
      canvas.off('object:modified', handleModified);
      canvas.off('object:removed', handleModified);
      canvas.off('path:created', handleModified);

      // Clear timer on cleanup
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [isReady, onDrawingChange, isRemoteUpdate]);

  // Disable editing if user is viewer
  useEffect(() => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;

    if (!canEdit) {
      canvas.isDrawingMode = false;
      canvas.selection = false;
      canvas.forEachObject((obj) => {
        obj.selectable = false;
        obj.evented = false;
      });
    } else {
      canvas.forEachObject((obj) => {
        obj.selectable = true;
        obj.evented = true;
      });
    }

    canvas.renderAll();
  }, [canEdit]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative bg-white rounded-lg shadow-sm overflow-hidden"
      style={{ minHeight: '400px' }}
      role="img"
      aria-label="Whiteboard canvas for drawing and sketching"
    >
      <canvas ref={canvasRef} aria-label="Drawing canvas" />
      {!canEdit && (
        <div
          className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded"
          role="status"
          aria-live="polite"
        >
          View Only
        </div>
      )}
    </div>
  );
}
