import { useEffect, useRef, useCallback } from 'react';
import useSocketStore from '../store/useSocketStore';

/**
 * Custom hook for real-time whiteboard synchronization
 * Handles emitting and receiving drawing updates via WebSocket with debouncing
 *
 * @param {Object} fabricCanvas - Fabric.js canvas instance
 * @param {string} noteId - Note ID for the whiteboard
 * @param {Function} onRemoteUpdate - Callback when remote update is received
 * @param {number} debounceMs - Debounce delay for emitting updates (default: 100ms)
 * @returns {Object} Sync functions
 */
export default function useWhiteboardSync(fabricCanvas, noteId, onRemoteUpdate, debounceMs = 100) {
  const { emit, on, off, isConnected } = useSocketStore();
  const debounceTimer = useRef(null);
  const isApplyingRemoteUpdate = useRef(false);
  const lastEmittedState = useRef(null);

  /**
   * Emit drawing update to server with debouncing
   */
  const emitDrawingUpdate = useCallback(
    (whiteboardData) => {
      if (!isConnected || !noteId) return;

      // Clear existing timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Debounce the emit
      debounceTimer.current = setTimeout(() => {
        // Only emit if data has changed
        const stateString = JSON.stringify(whiteboardData);
        if (stateString !== lastEmittedState.current) {
          emit('draw:update', {
            noteId,
            whiteboardData,
            timestamp: Date.now(),
          });
          lastEmittedState.current = stateString;
        }
      }, debounceMs);
    },
    [emit, isConnected, noteId, debounceMs]
  );

  /**
   * Handle incoming drawing update from other users
   */
  const handleRemoteDrawingUpdate = useCallback(
    (data) => {
      // Ignore updates for different notes
      if (data.noteId !== noteId) return;

      // Don't apply our own updates
      const stateString = JSON.stringify(data.whiteboardData);
      if (stateString === lastEmittedState.current) return;

      // Mark that we're applying a remote update
      isApplyingRemoteUpdate.current = true;

      // Apply the update to canvas
      if (fabricCanvas && data.whiteboardData) {
        try {
          fabricCanvas.loadFromJSON(data.whiteboardData, () => {
            fabricCanvas.renderAll();
            isApplyingRemoteUpdate.current = false;
          });
        } catch (error) {
          console.error('Failed to apply remote drawing update:', error);
          isApplyingRemoteUpdate.current = false;
        }
      }

      // Notify parent component
      if (onRemoteUpdate) {
        onRemoteUpdate(data);
      }
    },
    [fabricCanvas, noteId, onRemoteUpdate]
  );

  /**
   * Check if currently applying remote update
   */
  const isRemoteUpdate = useCallback(() => {
    return isApplyingRemoteUpdate.current;
  }, []);

  // Listen for canvas modifications and emit updates
  useEffect(() => {
    if (!fabricCanvas || !noteId) return;

    const handleModified = () => {
      // Don't emit if we're applying a remote update
      if (isApplyingRemoteUpdate.current) return;

      // Serialize canvas data
      const data = fabricCanvas.toJSON();
      emitDrawingUpdate(data);
    };

    // Listen for canvas modifications
    fabricCanvas.on('object:added', handleModified);
    fabricCanvas.on('object:modified', handleModified);
    fabricCanvas.on('object:removed', handleModified);
    fabricCanvas.on('path:created', handleModified);

    return () => {
      fabricCanvas.off('object:added', handleModified);
      fabricCanvas.off('object:modified', handleModified);
      fabricCanvas.off('object:removed', handleModified);
      fabricCanvas.off('path:created', handleModified);
    };
  }, [fabricCanvas, noteId, emitDrawingUpdate]);

  // Subscribe to remote drawing updates
  useEffect(() => {
    if (!noteId) return;

    // Register event listener
    on('draw:update', handleRemoteDrawingUpdate);

    return () => {
      // Cleanup event listener
      off('draw:update', handleRemoteDrawingUpdate);

      // Clear debounce timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [noteId, on, off, handleRemoteDrawingUpdate]);

  return {
    emitDrawingUpdate,
    isRemoteUpdate,
  };
}
