import { useNavigate } from 'react-router-dom';

/**
 * Productivity Toolbar Component
 * Bottom toolbar with quick access to AI assistant and shared notes
 * Requirements: 4.6
 */
export default function ProductivityToolbar() {
  const navigate = useNavigate();

  const handleAIAssistant = () => {
    // TODO: Open AI assistant panel or navigate to AI page
    console.log('Opening AI Assistant...');
    // For now, we can show an alert
    alert('AI Assistant feature coming soon!');
  };

  const handleSharedNotes = () => {
    // Navigate to shared notes view
    navigate('/shared-notes');
  };

  const handleQuickNote = () => {
    // TODO: Open quick note creation modal
    console.log('Creating quick note...');
    alert('Quick note feature coming soon!');
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-fixed glass-container shadow-glass"
      style={{ borderRadius: 0, borderBottom: 'none', borderLeft: 'none', borderRight: 'none' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-4 py-3">
          {/* AI Assistant Button with icon and tooltip */}
          <button
            onClick={handleAIAssistant}
            className="btn-primary inline-flex items-center px-4 py-2 text-white text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors shadow-glass"
            style={{ background: 'linear-gradient(135deg, #9C27B0 0%, #2196F3 100%)' }}
            aria-label="Open AI Assistant"
            title="AI Assistant"
          >
            <svg
              className="h-5 w-5 mr-2"
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
            <span className="hidden sm:inline">AI Assistant</span>
          </button>

          {/* Shared Notes Button with tooltip */}
          <button
            onClick={handleSharedNotes}
            className="glass-button inline-flex items-center px-4 py-2 text-navy text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
            aria-label="View shared notes"
            title="Shared Notes"
          >
            <svg
              className="h-5 w-5 mr-2"
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
            <span className="hidden sm:inline">Shared Notes</span>
          </button>

          {/* Quick Notes Button with tooltip */}
          <button
            onClick={handleQuickNote}
            className="glass-button inline-flex items-center px-4 py-2 text-navy text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
            aria-label="Create quick note"
            title="Quick Note"
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="hidden sm:inline">Quick Note</span>
          </button>
        </div>
      </div>
    </div>
  );
}
