import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Custom hook for managing whiteboard undo/redo history
 * Maintains a history stack of canvas states and provides undo/redo functionality
 *
 * @param {Object} fabricCanvas - Fabric.js canvas instance
 * @param {number} maxHistorySize - Maximum number of history states to keep (default: 50)
 * @returns {Object} History management functions and state
 */
export default function useWhiteboardHistory(fabricCanvas, maxHistorySize = 50) {
  const historyStack = useRef([]);
  const historyIndex = useRef(-1);
  const isUndoRedoing = useRef(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Save current canvas state to history
  const saveState = useCallback(() => {
    if (!fabricCanvas || isUndoRedoing.current) return;

    const json = fabricCanvas.toJSON();
    const state = JSON.stringify(json);

    // Remove any states after current index (when user makes new change after undo)
    historyStack.current = historyStack.current.slice(0, historyIndex.current + 1);

    // Add new state
    historyStack.current.push(state);

    // Limit history size
    if (historyStack.current.length > maxHistorySize) {
      historyStack.current.shift();
    } else {
      historyIndex.current++;
    }

    // Update undo/redo availability
    setCanUndo(historyIndex.current > 0);
    setCanRedo(false);
  }, [fabricCanvas, maxHistorySize]);

  // Undo last action
  const undo = useCallback(() => {
    if (!fabricCanvas || historyIndex.current <= 0) return;

    isUndoRedoing.current = true;
    historyIndex.current--;

    const state = historyStack.current[historyIndex.current];
    fabricCanvas.loadFromJSON(JSON.parse(state), () => {
      fabricCanvas.renderAll();
      isUndoRedoing.current = false;
    });

    // Update undo/redo availability
    setCanUndo(historyIndex.current > 0);
    setCanRedo(historyIndex.current < historyStack.current.length - 1);
  }, [fabricCanvas]);

  // Redo last undone action
  const redo = useCallback(() => {
    if (!fabricCanvas || historyIndex.current >= historyStack.current.length - 1) return;

    isUndoRedoing.current = true;
    historyIndex.current++;

    const state = historyStack.current[historyIndex.current];
    fabricCanvas.loadFromJSON(JSON.parse(state), () => {
      fabricCanvas.renderAll();
      isUndoRedoing.current = false;
    });

    // Update undo/redo availability
    setCanUndo(historyIndex.current > 0);
    setCanRedo(historyIndex.current < historyStack.current.length - 1);
  }, [fabricCanvas]);

  // Clear history
  const clearHistory = useCallback(() => {
    historyStack.current = [];
    historyIndex.current = -1;
    setCanUndo(false);
    setCanRedo(false);
  }, []);

  // Initialize history with initial canvas state
  useEffect(() => {
    if (!fabricCanvas) return;

    // Save initial state
    const timer = setTimeout(() => {
      saveState();
    }, 100);

    return () => clearTimeout(timer);
  }, [fabricCanvas, saveState]);

  // Listen for canvas modifications and save state
  useEffect(() => {
    if (!fabricCanvas) return;

    const handleModified = () => {
      if (!isUndoRedoing.current) {
        saveState();
      }
    };

    // Listen for canvas modifications
    fabricCanvas.on('object:added', handleModified);
    fabricCanvas.on('object:modified', handleModified);
    fabricCanvas.on('object:removed', handleModified);

    return () => {
      fabricCanvas.off('object:added', handleModified);
      fabricCanvas.off('object:modified', handleModified);
      fabricCanvas.off('object:removed', handleModified);
    };
  }, [fabricCanvas, saveState]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+Z or Cmd+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Ctrl+Y or Cmd+Shift+Z for redo
      else if (
        ((e.ctrlKey || e.metaKey) && e.key === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [undo, redo]);

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    saveState,
  };
}
