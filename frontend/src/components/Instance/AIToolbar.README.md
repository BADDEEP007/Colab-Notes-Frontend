# AIToolbar Component

## Overview
The AIToolbar component provides AI-powered tools for instance-level operations, including summarization and content generation assistance.

## Requirements Implemented
- **14.3**: AI assistance for content generation with prompt input
- **14.4**: Instance-level summarization of all notes

## Features

### 1. AI Summary Button
- Summarizes all notes within the current instance
- Sends POST request to `/api/ai/summary/instance` with instanceId
- Displays loading state during processing
- Shows results in expandable panel

### 2. AI Assist Button
- Opens prompt input field for custom content generation
- Sends POST request to `/api/ai/assist` with prompt and context
- Supports Ctrl+Enter keyboard shortcut for submission
- Displays generated content in panel

### 3. Results Panel
- Automatically expands when AI operation starts
- Shows loading spinner with descriptive text
- Displays error messages with appropriate styling
- Copy to clipboard functionality
- Close button to hide panel
- Smooth slide-down animation

## Usage

```jsx
import { AIToolbar } from '../../components/Instance';

// In your Instance page component
function InstancePage() {
  const instanceId = 'instance-123'; // From route params or store

  return (
    <div className="flex flex-col h-screen">
      {/* Other components */}
      <AIToolbar instanceId={instanceId} />
    </div>
  );
}

// Or use without instanceId (uses currentInstance from store)
function InstancePage() {
  return (
    <div className="flex flex-col h-screen">
      {/* Other components */}
      <AIToolbar />
    </div>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| instanceId | string | No | The ID of the instance to work with. If not provided, uses currentInstance from useInstanceStore |

## Dependencies

- `aiApi` - API module for AI operations
- `useInstanceStore` - Zustand store for instance management
- React hooks: `useState`

## API Integration

### Instance Summarization
```javascript
POST /api/ai/summary/instance
Body: { instanceId: string }
Response: { summary: string }
```

### AI Assistance
```javascript
POST /api/ai/assist
Body: { prompt: string, context: string }
Response: { content: string }
```

## Styling

- Uses Tailwind CSS for styling
- Responsive design with mobile-first approach
- Dark mode support
- Smooth animations for panel expansion
- Accessible with proper ARIA labels

## Accessibility

- Keyboard navigation support
- ARIA labels on all interactive elements
- Focus management for modals
- Screen reader friendly
- Ctrl+Enter shortcut for prompt submission

## Error Handling

- Network errors displayed with user-friendly messages
- Loading states prevent duplicate submissions
- Graceful fallback for missing instance
- Copy to clipboard with error handling

## Future Enhancements

- Insert AI content directly into notes (Requirement 14.5)
- Contextual suggestions based on note content (Requirement 14.6)
- Export AI results
- History of AI operations
- Customizable AI parameters

## Testing

See `AIToolbar.example.jsx` for usage examples and integration patterns.
