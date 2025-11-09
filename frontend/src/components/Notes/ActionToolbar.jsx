import { useState } from 'react';

/**
 * ActionToolbar Component
 * Bottom toolbar with action buttons (Undo, Redo, Share, AI Assist, Export)
 * Includes tooltips with fade-in animation
 * Requirements: 6.4
 * 
 * @param {Object} props
 * @param {Function} props.onUndo - Callback for undo action
 * @param {Function} props.onRedo - Callback for redo action
 * @param {Function} props.onShare - Callback for share action
 * @param {Function} props.onAIAssist - Callback for AI assist action
 * @param {Function} props.onExport - Callback for export action
 * @param {boolean} props.canUndo - Whether undo is available
 * @param {boolean} props.canRedo - Whether redo is available
 * @param {boolean} props.canEdit - Whether user can edit
 */
export default function ActionToolbar({
  onUndo,
  onRedo,
  onShare,
  onAIAssist,
  onExport,
  canUndo = false,
  canRedo = false,
  canEdit = true,
}) {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExport = (format) => {
    if (onExport) {
      onExport(format);
    }
    setShowExportMenu(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-container z-fixed">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 sm:gap-4 py-3">
          {/* Undo Button */}
          <div className="relative">
            <button
              onClick={onUndo}
              disabled={!canEdit || !canUndo}
              onMouseEnter={() => setHoveredButton('undo')}
              onMouseLeave={() => setHoveredButton(null)}
              className={`
                glass-button p-3 transition-all
                ${canEdit && canUndo ? 'hover:scale-103 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
              `}
              aria-label="Undo"
            >
              <svg
                className="h-5 w-5 text-navy"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                />
              </svg>
            </button>
            {hoveredButton === 'undo' && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 glass-container px-3 py-1 text-xs text-navy whitespace-nowrap fade-in">
                Undo (Ctrl+Z)
              </div>
            )}
          </div>

          {/* Redo Button */}
          <div className="relative">
            <button
              onClick={onRedo}
              disabled={!canEdit || !canRedo}
              onMouseEnter={() => setHoveredButton('redo')}
              onMouseLeave={() => setHoveredButton(null)}
              className={`
                glass-button p-3 transition-all
                ${canEdit && canRedo ? 'hover:scale-103 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
              `}
              aria-label="Redo"
            >
              <svg
                className="h-5 w-5 text-navy"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6"
                />
              </svg>
            </button>
            {hoveredButton === 'redo' && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 glass-container px-3 py-1 text-xs text-navy whitespace-nowrap fade-in">
                Redo (Ctrl+Y)
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-8 w-px" style={{ background: 'var(--glass-border)' }} />

          {/* Share Note Button */}
          <div className="relative">
            <button
              onClick={onShare}
              onMouseEnter={() => setHoveredButton('share')}
              onMouseLeave={() => setHoveredButton(null)}
              className="glass-button p-3 hover:scale-103 transition-all"
              aria-label="Share note"
            >
              <svg
                className="h-5 w-5 text-navy"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </button>
            {hoveredButton === 'share' && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 glass-container px-3 py-1 text-xs text-navy whitespace-nowrap fade-in">
                Share Note
              </div>
            )}
          </div>

          {/* AI Assist Button */}
          <div className="relative">
            <button
              onClick={onAIAssist}
              disabled={!canEdit}
              onMouseEnter={() => setHoveredButton('ai')}
              onMouseLeave={() => setHoveredButton(null)}
              className={`
                btn-primary p-3 transition-all
                ${canEdit ? 'hover:scale-103 cursor-pointer' : 'opacity-50 cursor-not-allowed'}
              `}
              aria-label="AI assist"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </button>
            {hoveredButton === 'ai' && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 glass-container px-3 py-1 text-xs text-navy whitespace-nowrap fade-in">
                AI Assist (Ctrl+K)
              </div>
            )}
          </div>

          {/* Export Button */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              onMouseEnter={() => setHoveredButton('export')}
              onMouseLeave={() => setHoveredButton(null)}
              className="glass-button p-3 hover:scale-103 transition-all"
              aria-label="Export"
              aria-expanded={showExportMenu}
              aria-haspopup="true"
            >
              <svg
                className="h-5 w-5 text-navy"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>
            {hoveredButton === 'export' && !showExportMenu && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 glass-container px-3 py-1 text-xs text-navy whitespace-nowrap fade-in">
                Export
              </div>
            )}
            {showExportMenu && (
              <div
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 glass-container overflow-hidden scale-in z-dropdown"
                role="menu"
                aria-label="Export options"
              >
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full px-4 py-2 text-left text-sm text-navy hover:bg-glass-bg-light transition-colors whitespace-nowrap"
                  role="menuitem"
                >
                  Export as PDF
                </button>
                <button
                  onClick={() => handleExport('png')}
                  className="w-full px-4 py-2 text-left text-sm text-navy hover:bg-glass-bg-light transition-colors whitespace-nowrap"
                  role="menuitem"
                >
                  Export as PNG
                </button>
                <button
                  onClick={() => handleExport('markdown')}
                  className="w-full px-4 py-2 text-left text-sm text-navy hover:bg-glass-bg-light transition-colors whitespace-nowrap"
                  role="menuitem"
                >
                  Export as Markdown
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close export menu */}
      {showExportMenu && (
        <div
          className="fixed inset-0 z-base"
          onClick={() => setShowExportMenu(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
