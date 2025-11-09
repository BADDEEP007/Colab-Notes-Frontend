import { useState, useEffect } from 'react';
import ContainerCard from './ContainerCard';
import useInstanceStore from '../../store/useInstanceStore';

/**
 * Containers Grid Component
 * Displays containers in a grid layout with create functionality
 * Requirements: 7.1, 7.2, 7.5, 19.2, 19.3, 19.5
 */
export default function ContainersGrid({ instanceId, canEdit = true, searchQuery = '' }) {
  const { containers, fetchContainers, createContainer, isLoading } = useInstanceStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newContainerName, setNewContainerName] = useState('');
  const [error, setError] = useState('');
  const [filteredContainers, setFilteredContainers] = useState([]);

  useEffect(() => {
    if (instanceId) {
      fetchContainers(instanceId);
    }
  }, [instanceId, fetchContainers]);

  // Filter containers based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredContainers(containers);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = containers.filter((container) =>
        container.name.toLowerCase().includes(query)
      );
      setFilteredContainers(filtered);
    }
  }, [searchQuery, containers]);

  const handleCreateContainer = async (e) => {
    e.preventDefault();
    setError('');

    if (!newContainerName.trim()) {
      setError('Container name is required');
      return;
    }

    setIsCreating(true);
    const result = await createContainer(instanceId, newContainerName.trim());
    setIsCreating(false);

    if (result.success) {
      setNewContainerName('');
      setError('');
    } else {
      setError(result.error || 'Failed to create container');
    }
  };

  const handleCancelCreate = () => {
    setNewContainerName('');
    setError('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 
            className="text-xl sm:text-2xl font-bold"
            style={{ color: 'var(--color-muted-navy)' }}
          >
            Containers
          </h2>
          {searchQuery && (
            <p 
              className="mt-1 text-sm"
              style={{ color: 'var(--color-muted-navy)', opacity: 0.7 }}
            >
              {filteredContainers.length} {filteredContainers.length === 1 ? 'container' : 'containers'} found
            </p>
          )}
        </div>
        {canEdit && (
          <button
            onClick={() => setNewContainerName(' ')}
            className="btn-primary inline-flex items-center justify-center"
            aria-label="Create new container"
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
            New Container
          </button>
        )}
      </div>

      {/* Create Container Form */}
      {newContainerName !== '' && canEdit && (
        <div className="mb-6 p-4 glass-container scale-in">
          <form onSubmit={handleCreateContainer}>
            <label
              htmlFor="container-name"
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--color-muted-navy)' }}
            >
              Container Name
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="container-name"
                value={newContainerName}
                onChange={(e) => setNewContainerName(e.target.value)}
                placeholder="Enter container name..."
                className="glass-input flex-1"
                autoFocus
                required
              />
              <button
                type="submit"
                disabled={isCreating || !newContainerName.trim()}
                className="btn-primary"
              >
                {isCreating ? 'Creating...' : 'Create'}
              </button>
              <button
                type="button"
                onClick={handleCancelCreate}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
            {error && (
              <p 
                className="mt-2 text-sm"
                style={{ color: 'var(--color-light-coral)' }}
              >
                {error}
              </p>
            )}
          </form>
        </div>
      )}

      {/* No Search Results */}
      {!isLoading && filteredContainers.length === 0 && searchQuery && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <svg
            className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No containers found
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No containers match &quot;{searchQuery}&quot;. Try a different search term.
          </p>
        </div>
      )}

      {/* Containers Grid */}
      {filteredContainers.length === 0 && !searchQuery ? (
        <div 
          className="text-center py-12 glass-container-light rounded-lg border-2 border-dashed"
          style={{ borderColor: 'var(--glass-border)' }}
        >
          <svg
            className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No containers yet
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {canEdit
              ? 'Get started by creating your first container to organize your notes.'
              : 'This instance has no containers yet.'}
          </p>
          {canEdit && (
            <button
              onClick={() => setNewContainerName(' ')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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
              Create First Container
            </button>
          )}
        </div>
      ) : filteredContainers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
          {filteredContainers.map((container) => (
            <ContainerCard
              key={container.id}
              container={container}
              instanceId={instanceId}
              canEdit={canEdit}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
