import AIToolbar from './AIToolbar';

/**
 * Example usage of AIToolbar component
 *
 * This component should be placed at the bottom of the Instance page
 * to provide AI-powered tools for instance-level operations.
 */

// Example 1: Basic usage in Instance page
function InstancePage() {
  const instanceId = 'instance-123'; // Get from route params or store

  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav>...</nav>

      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        {/* NotesPanel, ContainersGrid, FriendsOnlinePanel */}
      </div>

      {/* AI Toolbar at the bottom */}
      <AIToolbar instanceId={instanceId} />
    </div>
  );
}

// Example 2: Usage without explicit instanceId (uses current instance from store)
function InstancePageWithStore() {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <nav>...</nav>

      {/* Main content area */}
      <div className="flex-1 overflow-auto">{/* Content */}</div>

      {/* AI Toolbar - will use currentInstance from useInstanceStore */}
      <AIToolbar />
    </div>
  );
}

// Example 3: Responsive layout with AI Toolbar
function ResponsiveInstancePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40">
        <nav>...</nav>
      </header>

      {/* Main content with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - Notes Panel */}
        <aside className="w-64 overflow-y-auto">{/* NotesPanel */}</aside>

        {/* Center - Containers Grid */}
        <main className="flex-1 overflow-y-auto p-6">{/* ContainersGrid */}</main>

        {/* Right sidebar - Friends Online */}
        <aside className="w-72 overflow-y-auto">{/* FriendsOnlinePanel */}</aside>
      </div>

      {/* AI Toolbar - Fixed at bottom */}
      <div className="sticky bottom-0 z-30">
        <AIToolbar />
      </div>
    </div>
  );
}

/**
 * Features demonstrated:
 *
 * 1. AI Summary Button:
 *    - Click to summarize all notes in the instance
 *    - Shows loading state while processing
 *    - Displays results in expandable panel
 *
 * 2. AI Assist Button:
 *    - Click to show prompt input
 *    - Enter custom prompt for content generation
 *    - Press Ctrl+Enter or click Generate
 *    - Results shown in panel with copy functionality
 *
 * 3. Results Panel:
 *    - Automatically expands when AI operation starts
 *    - Shows loading spinner during processing
 *    - Displays error messages if operation fails
 *    - Copy button to copy results to clipboard
 *    - Close button to hide panel
 *
 * 4. Responsive Design:
 *    - Works on mobile, tablet, and desktop
 *    - Buttons stack appropriately on small screens
 *    - Panel adapts to available space
 */

export { InstancePage, InstancePageWithStore, ResponsiveInstancePage };
