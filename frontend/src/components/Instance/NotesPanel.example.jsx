/**
 * Example usage of NotesPanel component
 * This file demonstrates how to use the NotesPanel component in an Instance page
 */

import NotesPanel from './NotesPanel';

// Example usage in an Instance page component
export default function InstancePageExample() {
  const instanceId = 'instance-123';
  const containerId = 'container-456';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Instance Page</h1>
      
      {/* NotesPanel Component */}
      <div className="max-w-2xl">
        <NotesPanel 
          instanceId={instanceId} 
          containerId={containerId} 
        />
      </div>
    </div>
  );
}

/**
 * Component Features:
 * 
 * 1. Two Tabs:
 *    - "My Notes": Displays notes created by the current user
 *    - "Collaborated Notes": Displays notes shared with the current user
 * 
 * 2. Note Filtering:
 *    - My Notes: Filters by authorId === current user's id
 *    - Collaborated Notes: Filters by sharedWith array containing current user's id
 *                          AND excludes notes created by current user
 * 
 * 3. Features:
 *    - Tab navigation with visual indicators
 *    - Note count badges on each tab
 *    - Click to navigate to note detail page
 *    - Loading state while fetching notes
 *    - Empty state messages for each tab
 *    - Responsive design with hover effects
 *    - Keyboard navigation support
 *    - Accessibility features (ARIA labels, roles)
 * 
 * 4. Requirements Satisfied:
 *    - Requirement 12.3: Display shared notes in Collaborated Notes tab
 *    - Requirement 12.4: Display notes created by user in My Notes tab
 */
