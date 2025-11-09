import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import useInstanceStore from '../../store/useInstanceStore';
import InstanceCard from './InstanceCard';
import CreateInstanceModal from './CreateInstanceModal';
import LoadingSpinner, { CardSkeleton } from '../LoadingSpinner';

/**
 * Instances Grid Component - Improved Layout
 * Displays instances in responsive grid with better spacing
 */
export default function InstancesGrid({ searchQuery = '' }) {
  const { instances, fetchInstances, updateInstance, deleteInstance, generateShareLink, isLoading } = useInstanceStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch instances on mount
  useEffect(() => {
    fetchInstances();
  }, [fetchInstances]);

  // Filter instances based on search query
  const filteredInstances = useMemo(() => {
    if (!searchQuery.trim()) {
      return instances;
    }
    const query = searchQuery.toLowerCase();
    return instances.filter((instance) =>
      instance.name.toLowerCase().includes(query)
    );
  }, [searchQuery, instances]);

  const handleRename = useCallback(async (id, newName) => {
    await updateInstance(id, { name: newName });
  }, [updateInstance]);

  const handleDelete = useCallback(async (id) => {
    await deleteInstance(id);
  }, [deleteInstance]);

  const handleShare = useCallback(async (id) => {
    const instance = instances.find(inst => inst.id === id);
    if (!instance) return;

    const result = await generateShareLink(id, 'instance');
    if (result?.link) {
      try {
        await navigator.clipboard.writeText(result.link);
        alert('Shareable link copied to clipboard!');
      } catch (err) {
        prompt('Copy this shareable link:', result.link);
      }
    } else {
      alert('Failed to generate shareable link');
    }
  }, [instances, generateShareLink]);

  const handleCreateSuccess = useCallback(() => {
    fetchInstances();
  }, [fetchInstances]);

  return (
    <div className="w-full fade-in">
      {/* Header Section */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-3" style={{ background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              My Instances
            </h1>
            <p className="text-base text-navy" style={{ opacity: 0.7 }}>
              {filteredInstances.length} {filteredInstances.length === 1 ? 'instance' : 'instances'}
              {searchQuery && ' found'}
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary px-6 py-4 rounded-xl font-semibold text-white shadow-glass hover:scale-105 transition-all flex items-center justify-center gap-3"
            aria-label="Create new instance"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New Instance</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && instances.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CardSkeleton count={6} />
        </div>
      )}

      {/* Empty State with create prompt */}
      {!isLoading && filteredInstances.length === 0 && !searchQuery && (
        <div className="glass-container p-16 text-center fade-in">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-primary flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-navy mb-3">
              No instances yet
            </h3>
            <p className="text-base text-navy mb-8" style={{ opacity: 0.7 }}>
              Get started by creating your first instance to organize your notes and collaborate with your team.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-primary px-8 py-4 rounded-xl font-semibold text-white shadow-glass hover:scale-105 transition-all inline-flex items-center gap-3"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Instance
            </button>
          </div>
        </div>
      )}

      {/* No Search Results */}
      {!isLoading && filteredInstances.length === 0 && searchQuery && (
        <div className="glass-container p-16 text-center fade-in">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-secondary flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-navy mb-3">
              No results found
            </h3>
            <p className="text-base text-navy" style={{ opacity: 0.7 }}>
              No instances match "<span className="font-semibold">{searchQuery}</span>". Try a different search term.
            </p>
          </div>
        </div>
      )}

      {/* Responsive CSS Grid (3 cols desktop, 2 tablet, 1 mobile) with fade-in animation */}
      {!isLoading && filteredInstances.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredInstances.map((instance, index) => (
            <div 
              key={instance.id} 
              className="fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <InstanceCard
                instance={instance}
                onRename={handleRename}
                onDelete={handleDelete}
                onShare={handleShare}
              />
            </div>
          ))}
        </div>
      )}

      {/* Create Instance Modal */}
      {isCreateModalOpen && (
        <CreateInstanceModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
}
