/**
 * Example usage of NoteEditor component with CRUD operations
 * This demonstrates how to integrate the NoteEditor in a page
 */
import { useState, useEffect } from 'react';
import NoteEditor from './NoteEditor';
import { useNotes } from '../../hooks';
import { ROLES } from '../../utils/constants';

/**
 * Example Container/Note Page Component
 */
export default function NoteEditorExample() {
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const [userRole, setUserRole] = useState(ROLES.EDITOR);
  
  const {
    notes,
    currentNote,
    isLoading,
    createNote,
    fetchNoteByTitle,
    deleteNote,
    setCurrentNote,
  } = useNotes();

  // Load note when selected
  useEffect(() => {
    if (selectedNoteId) {
      setCurrentNote(selectedNoteId);
      const note = notes.find(n => n.id === selectedNoteId);
      if (note) {
        setNoteContent(note.content || '');
      }
    }
  }, [selectedNoteId, notes, setCurrentNote]);

  // Handle creating a new note
  const handleCreateNote = async () => {
    const title = prompt('Enter note title:');
    if (!title) return;
    
    const containerId = 'example-container-id'; // Replace with actual container ID
    const result = await createNote(containerId, title, '');
    
    if (result.success) {
      setSelectedNoteId(result.note.id);
      alert('Note created successfully!');
    } else {
      alert(`Failed to create note: ${result.error}`);
    }
  };

  // Handle deleting a note
  const handleDeleteNote = async () => {
    if (!selectedNoteId) return;
    
    const confirmed = confirm('Are you sure you want to delete this note?');
    if (!confirmed) return;
    
    const result = await deleteNote(selectedNoteId);
    
    if (result.success) {
      setSelectedNoteId(null);
      setNoteContent('');
      alert('Note deleted successfully!');
    } else {
      alert(`Failed to delete note: ${result.error}`);
    }
  };

  // Handle fetching note by title
  const handleFetchByTitle = async () => {
    const title = prompt('Enter note title to fetch:');
    if (!title) return;
    
    const result = await fetchNoteByTitle(title);
    
    if (result.success) {
      setSelectedNoteId(result.note.id);
      setNoteContent(result.note.content || '');
    } else {
      alert(`Failed to fetch note: ${result.error}`);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold text-gray-900">
            {currentNote?.title || 'No Note Selected'}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateNote}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Create Note
          </button>
          
          <button
            onClick={handleFetchByTitle}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Fetch by Title
          </button>
          
          {selectedNoteId && (
            <button
              onClick={handleDeleteNote}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              Delete Note
            </button>
          )}
          
          {/* Role selector for testing */}
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
          >
            <option value={ROLES.OWNER}>Owner</option>
            <option value={ROLES.EDITOR}>Editor</option>
            <option value={ROLES.VIEWER}>Viewer</option>
          </select>
        </div>
      </div>

      {/* Sidebar with notes list */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Notes</h2>
            
            {isLoading ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : notes.length === 0 ? (
              <div className="text-sm text-gray-500">No notes yet</div>
            ) : (
              <div className="space-y-2">
                {notes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => setSelectedNoteId(note.id)}
                    className={`
                      w-full text-left px-3 py-2 rounded-lg text-sm
                      ${selectedNoteId === note.id 
                        ? 'bg-blue-100 text-blue-900' 
                        : 'hover:bg-gray-100 text-gray-700'
                      }
                    `}
                  >
                    {note.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Note Editor */}
        <div className="flex-1">
          {selectedNoteId ? (
            <NoteEditor
              noteId={selectedNoteId}
              initialContent={noteContent}
              canEdit={userRole !== ROLES.VIEWER}
              onContentChange={setNoteContent}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a note or create a new one to start editing
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
