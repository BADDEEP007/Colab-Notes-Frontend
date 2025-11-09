import mockBackend from './mockBackend';

// Flag to enable/disable mock backend
export const USE_MOCK_BACKEND = import.meta.env.VITE_USE_MOCK_BACKEND !== 'false';

if (typeof window !== 'undefined') {
  console.log('Mock Backend:', USE_MOCK_BACKEND ? 'ENABLED' : 'DISABLED');
}

// Mock API interceptor for Axios
export const setupMockInterceptor = (axiosInstance) => {
  if (!USE_MOCK_BACKEND) {
    return;
  }

  // Request interceptor
  axiosInstance.interceptors.request.use(
    async (config) => {
      // Check if this is a mock-able request
      if (config.url.startsWith('/api/')) {
        // Mark as mock request
        config._isMock = true;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - intercept ALL requests to /api/
  axiosInstance.interceptors.response.use(
    async (response) => {
      // Let successful responses through
      return response;
    },
    async (error) => {
      const config = error.config;

      // Only handle mock requests (requests to /api/)
      if (!config._isMock) {
        return Promise.reject(error);
      }

      try {
        const mockResponse = await handleMockRequest(config);
        return {
          data: mockResponse,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
        };
      } catch (mockError) {
        return Promise.reject({
          response: {
            data: { message: mockError.message },
            status: 400,
            statusText: 'Bad Request',
          },
          config,
        });
      }
    }
  );
};

// Handle mock requests
const handleMockRequest = async (config) => {
  const { method, url } = config;
  const urlPath = url.replace('/api/', '');

  // Parse data if it's a string
  let data = config.data;
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch (e) {
      console.error('[Mock API] Failed to parse data:', e);
    }
  }

  console.log(`[Mock API] ${method.toUpperCase()} ${url}`, data);

  // Authentication endpoints
  if (urlPath === 'auth/register' && method === 'post') {
    return await mockBackend.auth.register(data.email, data.password, data.name);
  }

  if (urlPath === 'auth/login' && method === 'post') {
    return await mockBackend.auth.login(data.email, data.password);
  }

  if (urlPath === 'auth/logout' && method === 'post') {
    return await mockBackend.auth.logout();
  }

  if (urlPath === 'auth/me' && method === 'get') {
    try {
      return await mockBackend.auth.getCurrentUser();
    } catch (error) {
      // Return 401 error if not authenticated
      throw new Error('Not authenticated');
    }
  }

  if (urlPath === 'auth/forgot-password' && method === 'post') {
    return await mockBackend.auth.forgotPassword(data.email);
  }

  if (urlPath === 'auth/reset-password' && method === 'post') {
    return await mockBackend.auth.resetPassword(data.token, data.newPassword);
  }

  if (urlPath === 'auth/change-password' && method === 'post') {
    return await mockBackend.auth.changePassword(data.oldPassword, data.newPassword);
  }

  if (urlPath.startsWith('auth/verify') && method === 'get') {
    return await mockBackend.auth.verifyEmail(config.params?.token);
  }

  // Instance endpoints
  if (urlPath === 'instances' && method === 'get') {
    return await mockBackend.instances.getAll();
  }

  if (urlPath.match(/^instances\/[^/]+$/) && method === 'get') {
    const id = urlPath.split('/')[1];
    return await mockBackend.instances.getById(id);
  }

  if (urlPath === 'instances' && method === 'post') {
    return await mockBackend.instances.create(data.name);
  }

  if (urlPath.match(/^instances\/[^/]+$/) && method === 'put') {
    const id = urlPath.split('/')[1];
    return await mockBackend.instances.update(id, data);
  }

  if (urlPath.match(/^instances\/[^/]+$/) && method === 'delete') {
    const id = urlPath.split('/')[1];
    return await mockBackend.instances.delete(id);
  }

  // Container endpoints
  if (urlPath.match(/^instances\/[^/]+\/containers$/) && method === 'get') {
    const instanceId = urlPath.split('/')[1];
    return await mockBackend.containers.getByInstance(instanceId);
  }

  if (urlPath === 'containers' && method === 'post') {
    return await mockBackend.containers.create(data.instanceId, data.name);
  }

  if (urlPath.match(/^containers\/[^/]+$/) && method === 'put') {
    const id = urlPath.split('/')[1];
    return await mockBackend.containers.update(id, data);
  }

  if (urlPath.match(/^containers\/[^/]+$/) && method === 'delete') {
    const id = urlPath.split('/')[1];
    return await mockBackend.containers.delete(id);
  }

  // Note endpoints
  if (urlPath.match(/^containers\/[^/]+\/notes$/) && method === 'get') {
    const containerId = urlPath.split('/')[1];
    return await mockBackend.notes.getByContainer(containerId);
  }

  if (urlPath === 'notes/get' && method === 'get') {
    return await mockBackend.notes.getByContainer(config.params?.containerId);
  }

  if (urlPath.match(/^notes\/get\/title\/.+$/) && method === 'get') {
    const title = decodeURIComponent(urlPath.split('/title/')[1]);
    return await mockBackend.notes.getByTitle(title);
  }

  if (urlPath === 'notes/add' && method === 'post') {
    return await mockBackend.notes.create(data.containerId, data.title, data.content);
  }

  if (urlPath.match(/^notes\/update\/.+$/) && method === 'put') {
    const title = decodeURIComponent(urlPath.split('/update/')[1]);
    const note = await mockBackend.notes.getByTitle(title);
    return await mockBackend.notes.update(note.id, data);
  }

  if (urlPath === 'notes/delete' && method === 'delete') {
    const note = await mockBackend.notes.getByTitle(data.title);
    return await mockBackend.notes.delete(note.id);
  }

  // Friend endpoints
  if (urlPath === 'friends' && method === 'get') {
    return await mockBackend.friends.getAll();
  }

  if (urlPath === 'friends/requests' && method === 'get') {
    return await mockBackend.friends.getRequests();
  }

  if (urlPath === 'friends/request' && method === 'post') {
    return await mockBackend.friends.sendRequest(data.email);
  }

  if (urlPath.match(/^friends\/accept\/[^/]+$/) && method === 'post') {
    const requestId = urlPath.split('/')[2];
    return await mockBackend.friends.acceptRequest(requestId);
  }

  if (urlPath.match(/^friends\/reject\/[^/]+$/) && method === 'post') {
    const requestId = urlPath.split('/')[2];
    return await mockBackend.friends.rejectRequest(requestId);
  }

  if (urlPath.match(/^friends\/[^/]+$/) && method === 'delete') {
    const friendId = urlPath.split('/')[1];
    return await mockBackend.friends.remove(friendId);
  }

  // Status endpoints
  if (urlPath === 'status' && method === 'get') {
    return await mockBackend.status.getAll();
  }

  if (urlPath === 'status' && method === 'post') {
    return await mockBackend.status.update(data.status);
  }

  // Notification endpoints
  if (urlPath === 'notifications' && method === 'get') {
    return await mockBackend.notifications.getAll();
  }

  if (urlPath.match(/^notifications\/[^/]+\/read$/) && method === 'post') {
    const id = urlPath.split('/')[1];
    return await mockBackend.notifications.markAsRead(id);
  }

  if (urlPath === 'notifications/read-all' && method === 'post') {
    return await mockBackend.notifications.markAllAsRead();
  }

  // AI endpoints
  if (urlPath === 'ai/summary' && method === 'post') {
    return await mockBackend.ai.summarize(data.content);
  }

  if (urlPath === 'ai/assist' && method === 'post') {
    return await mockBackend.ai.assist(data.prompt, data.context);
  }

  // Email endpoints (mock success)
  if (urlPath === 'sendmail/verification' && method === 'post') {
    return { success: true, message: 'Verification email sent' };
  }

  // OAuth endpoints (mock redirect)
  if (urlPath.match(/^(google|microsoft)\/(register|callback)$/)) {
    return { success: true, message: 'OAuth flow initiated' };
  }

  // Default response for unhandled endpoints
  console.warn(`[Mock API] Unhandled endpoint: ${method.toUpperCase()} ${url}`);
  return { success: true, data: [], message: 'Mock response' };
};

export default setupMockInterceptor;
