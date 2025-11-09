import { useState } from 'react';

/**
 * ToolsPanel component for whiteboard drawing tools with glassmorphism styling
 * Provides tool selection, color picker, size selector, and export functionality
 * Requirements: 6.1, 6.5
 * 
 * @param {Object} props
 * @param {string} props.selectedTool - Currently selected tool
 * @param {Function} props.onToolChange - Callback when tool changes
 * @param {Object} props.toolOptions - Current tool options (color, strokeWidth)
 * @param {Function} props.onToolOptionsChange - Callback when tool options change
 * @param {Function} props.onExport - Callback for export action
 * @param {Function} props.onUndo - Callback for undo action
 * @param {Function} props.onRedo - Callback for redo action
 * @param {boolean} props.canEdit - Whether user can edit (disables tools for Viewer role)
 * @param {boolean} props.canUndo - Whether undo is available
 * @param {boolean} props.canRedo - Whether redo is available
 */
export default function ToolsPanel({
  selectedTool = 'pen',
  onToolChange,
  toolOptions = { color: '#000000', strokeWidth: 2 },
  onToolOptionsChange,
  onExport,
  onUndo,
  onRedo,
  canEdit = true,
  canUndo = false,
  canRedo = false,
}) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const tools = [
    { id: 'pen', label: 'Pen', icon: '✏️' },
    { id: 'eraser', label: 'Eraser', icon: '🧹' },
    { id: 'rectangle', label: 'Shapes', icon: '▭' },
    { id: 'text', label: 'Text', icon: 'T' },
    { id: 'select', label: 'Select', icon: '↖️' },
    { id: 'clear', label: 'Clear', icon: '🗑️' },
  ];

  const strokeWidths = [1, 2, 4, 6, 8, 12];

  const commonColors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  ];

  const handleToolClick = (toolId) => {
    if (!canEdit) return;
    onToolChange(toolId);
  };

  const handleColorChange = (color) => {
    onToolOptionsChange({ ...toolOptions, color });
    setShowColorPicker(false);
  };

  const handleStrokeWidthChange = (width) => {
    onToolOptionsChange({ ...toolOptions, strokeWidth: width });
  };

  const handleExport = (format) => {
    onExport(format);
    setShowExportMenu(false);
  };

  return (
    <div className="flex md:flex-col gap-2 md:gap-3 p-2 md:p-4 glass-container-light w-full md:w-20 md:h-full items-center overflow-x-auto md:overflow-x-visible overflow-y-visible md:overflow-y-auto">
      {/* Tool Buttons */}
      <div className="flex md:flex-col gap-2 shrink-0">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => handleToolClick(tool.id)}
            disabled={!canEdit}
            className={`
              w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-lg md:text-xl
              transition-all duration-fast touch-manipulation
              ${
                selectedTool === tool.id
                  ? 'bg-gradient-primary text-white shadow-glass glow-effect'
                  : 'glass-button hover:scale-103'
              }
              ${!canEdit ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            title={tool.label}
            aria-label={tool.label}
            aria-pressed={selectedTool === tool.id}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="hidden md:block w-full h-px" style={{ background: 'var(--glass-border)' }} />

      {/* Color Picker */}
      <div className="relative shrink-0">
        <button
          onClick={() => canEdit && setShowColorPicker(!showColorPicker)}
          disabled={!canEdit}
          className={`
            w-10 h-10 md:w-12 md:h-12 rounded-lg border-2 touch-manipulation shadow-glass
            ${!canEdit ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-103 transition-all'}
          `}
          style={{ 
            backgroundColor: toolOptions.color,
            borderColor: 'var(--glass-border)'
          }}
          title="Color"
          aria-label="Select color"
          aria-expanded={showColorPicker}
          aria-haspopup="true"
        />
        {showColorPicker && canEdit && (
          <div className="absolute left-0 md:left-20 top-12 md:top-0 glass-container p-3 z-dropdown scale-in">
            <div className="grid grid-cols-5 gap-2 mb-2">
              {commonColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className="w-8 h-8 rounded border-2 hover:scale-110 transition-all"
                  style={{ 
                    backgroundColor: color,
                    borderColor: 'var(--glass-border)'
                  }}
                  title={color}
                  aria-label={`Color ${color}`}
                />
              ))}
            </div>
            <input
              type="color"
              value={toolOptions.color}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-full h-8 cursor-pointer rounded"
              aria-label="Custom color picker"
            />
          </div>
        )}
      </div>

      {/* Stroke Width Selector */}
      <div className="flex md:flex-col gap-1 shrink-0">
        {strokeWidths.slice(0, 4).map((width) => (
          <button
            key={width}
            onClick={() => canEdit && handleStrokeWidthChange(width)}
            disabled={!canEdit}
            className={`
              w-10 md:w-12 h-8 rounded flex items-center justify-center touch-manipulation transition-all
              ${
                toolOptions.strokeWidth === width
                  ? 'glass-container shadow-glass-hover scale-103'
                  : 'glass-button hover:scale-103'
              }
              ${!canEdit ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            title={`Width ${width}px`}
            aria-label={`Stroke width ${width} pixels`}
          >
            <div
              className="rounded-full"
              style={{ 
                width: `${width}px`, 
                height: `${width}px`,
                background: 'var(--color-muted-navy)'
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

