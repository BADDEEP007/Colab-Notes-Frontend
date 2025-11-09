import { create } from 'zustand';
import shareApi from '../api/shareApi';

/**
 * Instance store for managing workspace instances and containers
 */
const useInstanceStore = create((set, get) => ({
  // State
  instances: [],
  currentInstance: null,
  containers: [],
  currentContainer: null,
  isLoading: false,
  error: null,

  // Actions

  /**
   * Fetch all instances for the current user
   */
  fetchInstances: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call when instances API is implemented
      // const response = await instancesApi.getAll();
      // set({ instances: response.data, isLoading: false });

      // Placeholder for now
      set({ instances: [], isLoading: false });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch instances.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Create a new instance
   * @param {string} name - Instance name
   */
  createInstance: async (name) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call when instances API is implemented
      // const response = await instancesApi.create({ name });
      // const newInstance = response.data;

      // Placeholder for now
      const newInstance = {
        id: Date.now().toString(),
        name,
        ownerId: 'current-user-id',
        members: [],
        containers: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set((state) => ({
        instances: [...state.instances, newInstance],
        isLoading: false,
      }));

      return { success: true, instance: newInstance };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create instance.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Update an existing instance
   * @param {string} id - Instance ID
   * @param {Object} updates - Partial instance object with updates
   */
  updateInstance: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call when instances API is implemented
      // const response = await instancesApi.update(id, updates);
      // const updatedInstance = response.data;

      set((state) => ({
        instances: state.instances.map((instance) =>
          instance.id === id
            ? { ...instance, ...updates, updatedAt: new Date().toISOString() }
            : instance
        ),
        currentInstance:
          state.currentInstance?.id === id
            ? { ...state.currentInstance, ...updates }
            : state.currentInstance,
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update instance.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Delete an instance
   * @param {string} id - Instance ID
   */
  deleteInstance: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call when instances API is implemented
      // await instancesApi.delete(id);

      set((state) => ({
        instances: state.instances.filter((instance) => instance.id !== id),
        currentInstance: state.currentInstance?.id === id ? null : state.currentInstance,
        isLoading: false,
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete instance.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Set the current active instance
   * @param {string} id - Instance ID
   */
  setCurrentInstance: (id) => {
    const instance = get().instances.find((inst) => inst.id === id);
    if (instance) {
      set({ currentInstance: instance });
    }
  },

  /**
   * Invite a member to an instance
   * @param {string} instanceId - Instance ID
   * @param {string} email - Email of user to invite
   * @param {string} role - Role to assign ('Owner', 'Editor', or 'Viewer')
   */
  inviteMember: async (instanceId, email, role) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call when instances API is implemented
      // const response = await instancesApi.inviteMember(instanceId, { email, role });

      // Placeholder for now
      const newMember = {
        userId: `user-${Date.now()}`,
        email,
        role,
        joinedAt: new Date().toISOString(),
      };

      set((state) => ({
        instances: state.instances.map((instance) =>
          instance.id === instanceId
            ? {
                ...instance,
                members: [...instance.members, newMember],
              }
            : instance
        ),
        isLoading: false,
      }));

      return { success: true, member: newMember };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to invite member.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Generate a shareable link for an instance
   * @param {string} instanceId - Instance ID
   * @param {string} role - Role for the link ('Owner', 'Editor', or 'Viewer')
   * @param {Date} expiresAt - Optional expiry date
   * @param {boolean} isPublic - Whether the link is public or restricted
   */
  generateShareLink: async (instanceId, role, expiresAt = null, isPublic = true) => {
    set({ isLoading: true, error: null });
    try {
      const response = await shareApi.generateInstanceLink(instanceId, {
        role,
        expiresAt,
        isPublic,
      });

      const link = response.data.link || response.data.url;

      set({ isLoading: false });
      return { success: true, link, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to generate share link.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Fetch containers for a specific instance
   * @param {string} _instanceId - Instance ID
   */
  fetchContainers: async (_instanceId) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call when containers API is implemented
      // const response = await containersApi.getByInstance(instanceId);
      // set({ containers: response.data, isLoading: false });

      // Placeholder for now
      set({ containers: [], isLoading: false });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch containers.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Create a new container within an instance
   * @param {string} instanceId - Instance ID
   * @param {string} name - Container name
   */
  createContainer: async (instanceId, name) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call when containers API is implemented
      // const response = await containersApi.create({ instanceId, name });
      // const newContainer = response.data;

      // Placeholder for now
      const newContainer = {
        id: Date.now().toString(),
        instanceId,
        name,
        notes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set((state) => ({
        containers: [...state.containers, newContainer],
        isLoading: false,
      }));

      return { success: true, container: newContainer };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create container.';
      set({ isLoading: false, error: errorMessage });
      return { success: false, error: errorMessage };
    }
  },

  /**
   * Set the current active container
   * @param {string} id - Container ID
   */
  setCurrentContainer: (id) => {
    const container = get().containers.find((cont) => cont.id === id);
    if (container) {
      set({ currentContainer: container });
    }
  },

  /**
   * Clear error state
   */
  clearError: () => {
    set({ error: null });
  },
}));

export default useInstanceStore;
