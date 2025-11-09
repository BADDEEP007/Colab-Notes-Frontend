// Quick test file to verify mock backend works
import mockBackend from './dummy/mockBackend';

console.log('=== Testing Mock Backend ===');

// Test login
mockBackend.auth.login('demo@example.com', 'demo123')
  .then(result => {
    console.log('✅ Login successful:', result);
    console.log('Current user:', mockBackend.getCurrentUser());
    console.log('Auth token:', mockBackend.getAuthToken());
  })
  .catch(error => {
    console.error('❌ Login failed:', error);
  });
