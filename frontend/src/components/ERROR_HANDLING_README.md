# Error Handling and Loading States

This document describes the error handling and loading state components implemented for the Collab Notes application.

## Components

### 1. ErrorBoundary

A React error boundary component that catches JavaScript errors anywhere in the component tree and displays a fallback UI.

**Usage:**
```jsx
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <YourApp />
    </ErrorBoundary>
  );
}
```

**Features:**
- Catches React errors in child components
- Displays user-friendly error message
- Shows error details in development mode
- Logs errors to console (can be extended to error tracking services like Sentry)
- Provides "Try Again" and "Go Home" buttons

### 2. LoadingSpinner

A reusable loading indicator component with multiple size options.

**Usage:**
```jsx
import LoadingSpinner from './components/LoadingSpinner';

// Basic usage
<LoadingSpinner />

// With size
<LoadingSpinner size="small" />  // small, medium, large
<LoadingSpinner size="large" />

// Full screen loading
<LoadingSpinner fullScreen />
```

### 3. LoadingOverlay

A full-screen loading overlay with a message.

**Usage:**
```jsx
import { LoadingOverlay } from './components/LoadingSpinner';

<LoadingOverlay message="Loading your data..." />
```

### 4. LoadingButton

A button component with built-in loading state.

**Usage:**
```jsx
import { LoadingButton } from './components/LoadingSpinner';

<LoadingButton
  loading={isLoading}
  onClick={handleSubmit}
  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
>
  Submit
</LoadingButton>
```

### 5. SkeletonLoader

Skeleton loading placeholders for content.

**Usage:**
```jsx
import { SkeletonLoader } from './components/LoadingSpinner';

// Text skeleton
<SkeletonLoader variant="text" />

// Title skeleton
<SkeletonLoader variant="title" />

// Avatar skeleton
<SkeletonLoader variant="avatar" />

// Card skeleton
<SkeletonLoader variant="card" />

// Button skeleton
<SkeletonLoader variant="button" />
```

### 6. CardSkeleton

Pre-built skeleton for card layouts.

**Usage:**
```jsx
import { CardSkeleton } from './components/LoadingSpinner';

// Single card skeleton
<CardSkeleton />

// Multiple card skeletons
<CardSkeleton count={4} />
```

## Utility Functions

### handleApiError

Handles API errors and returns user-friendly messages.

**Usage:**
```jsx
import { handleApiError } from './utils/helpers';

try {
  await apiCall();
} catch (error) {
  const errorInfo = handleApiError(error);
  console.log(errorInfo.message); // User-friendly message
  console.log(errorInfo.type);    // Error type: validation, auth, permission, etc.
}
```

### retryWithBackoff

Retries a function with exponential backoff.

**Usage:**
```jsx
import { retryWithBackoff } from './utils/helpers';

const result = await retryWithBackoff(
  () => apiCall(),
  3,    // maxRetries (default: 3)
  1000  // baseDelay in ms (default: 1000)
);
```

**Features:**
- Exponential backoff with jitter
- Skips retry for client errors (4xx) except 408 and 429
- Maximum delay capped at 10 seconds

### showApiError

Shows error toast notification for API errors.

**Usage:**
```jsx
import { showApiError } from './utils/helpers';
import { useToast } from './components/ToastContainer';

function MyComponent() {
  const { showError } = useToast();
  
  try {
    await apiCall();
  } catch (error) {
    showApiError(error, showError);
  }
}
```

## Custom Hooks

### useApiCall

A hook for making API calls with automatic error handling and loading states.

**Usage:**
```jsx
import { useApiCall } from './hooks/useApiCall';

function MyComponent() {
  const { execute, loading, error } = useApiCall();
  
  const fetchData = async () => {
    try {
      const result = await execute(
        () => apiFunction(),
        {
          showErrorToast: true,  // Show error toast (default: true)
          retry: true,           // Retry on failure (default: false)
          maxRetries: 3          // Max retry attempts (default: 3)
        }
      );
      // Handle success
    } catch (err) {
      // Error already handled and displayed
    }
  };
  
  return (
    <div>
      {loading && <LoadingSpinner />}
      {error && <p>Error: {error.message}</p>}
      <button onClick={fetchData}>Fetch Data</button>
    </div>
  );
}
```

### useApiMutation

A hook for making API mutations with manual control.

**Usage:**
```jsx
import { useApiMutation } from './hooks/useApiCall';

function MyComponent() {
  const { mutate, loading, error, data } = useApiMutation();
  
  const handleSubmit = async () => {
    try {
      const result = await mutate(
        () => createInstance(name),
        {
          showErrorToast: true,
          showSuccessToast: true,
          successMessage: 'Instance created successfully!',
          retry: false
        }
      );
      // Handle success
    } catch (err) {
      // Error already handled
    }
  };
  
  return (
    <LoadingButton loading={loading} onClick={handleSubmit}>
      Create Instance
    </LoadingButton>
  );
}
```

## Toast Notifications

Toast notifications are already implemented and integrated with the error handling system.

**Usage:**
```jsx
import { useToast } from './components/ToastContainer';

function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo } = useToast();
  
  const handleAction = async () => {
    try {
      await apiCall();
      showSuccess('Operation completed successfully!');
    } catch (error) {
      showError('Operation failed. Please try again.');
    }
  };
  
  return <button onClick={handleAction}>Do Something</button>;
}
```

## Best Practices

1. **Always wrap your app with ErrorBoundary** at the root level
2. **Use LoadingButton** for form submissions instead of manual loading states
3. **Use SkeletonLoader** for content that's loading to improve perceived performance
4. **Use useApiCall or useApiMutation** for API calls to get automatic error handling
5. **Use retryWithBackoff** for network requests that might fail temporarily
6. **Show toast notifications** for user actions to provide feedback
7. **Handle errors gracefully** - always provide a way for users to recover

## Example: Complete Component with Error Handling

```jsx
import { useState } from 'react';
import { useApiMutation } from './hooks/useApiCall';
import { LoadingButton, SkeletonLoader } from './components/LoadingSpinner';
import { useToast } from './components/ToastContainer';

function MyComponent() {
  const [data, setData] = useState(null);
  const { mutate, loading } = useApiMutation();
  const { showSuccess } = useToast();
  
  const handleFetch = async () => {
    try {
      const result = await mutate(
        () => fetchData(),
        { showErrorToast: true, retry: true }
      );
      setData(result);
      showSuccess('Data loaded successfully!');
    } catch (error) {
      // Error already handled by useApiMutation
    }
  };
  
  return (
    <div>
      {loading ? (
        <SkeletonLoader variant="card" />
      ) : data ? (
        <div>{/* Display data */}</div>
      ) : (
        <LoadingButton loading={loading} onClick={handleFetch}>
          Load Data
        </LoadingButton>
      )}
    </div>
  );
}
```

## Requirements Covered

- **17.1**: ErrorBoundary component catches React errors and displays fallback UI
- **17.2**: LoadingSpinner with multiple sizes and variants
- **17.3**: API error handling with retry logic and toast notifications
- **17.4**: Loading states added to components with skeleton loaders and loading buttons
