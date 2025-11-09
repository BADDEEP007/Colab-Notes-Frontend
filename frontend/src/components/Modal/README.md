# Modal Component System

A comprehensive modal system with glassmorphism styling for the Collab Notes application.

## Components

### Modal (Base Component)

The main modal component with backdrop blur, escape key handling, and body scroll prevention.

```jsx
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components';

<Modal isOpen={isOpen} onClose={handleClose}>
  <ModalHeader onClose={handleClose}>Title</ModalHeader>
  <ModalBody>Content goes here</ModalBody>
  <ModalFooter>
    <GlassButton onClick={handleClose}>Close</GlassButton>
  </ModalFooter>
</Modal>
```

**Props:**
- `isOpen` (boolean, required): Whether the modal is open
- `onClose` (function, required): Function to call when modal should close
- `children` (node, required): Modal content
- `className` (string): Additional CSS classes
- `closeOnOverlayClick` (boolean, default: true): Whether clicking overlay closes modal
- `closeOnEscape` (boolean, default: true): Whether pressing Escape closes modal

**Features:**
- Backdrop blur effect
- Scale animation (0.95 to 1.0) over 0.3s
- Escape key support
- Body scroll prevention
- Overlay click to close
- Full-screen on mobile devices

### ModalHeader

Header section with title and optional close button.

```jsx
<ModalHeader onClose={handleClose}>
  Modal Title
</ModalHeader>
```

### ModalBody

Body section for main content with scrollable overflow.

```jsx
<ModalBody>
  <p>Your content here</p>
</ModalBody>
```

### ModalFooter

Footer section for action buttons, aligned to the right.

```jsx
<ModalFooter>
  <GlassButton variant="ghost" onClick={handleClose}>Cancel</GlassButton>
  <GlassButton variant="primary" onClick={handleSubmit}>Submit</GlassButton>
</ModalFooter>
```

## Specialized Modals

### InviteModal

Modal for inviting users to an instance via email or friend selection.

```jsx
import { InviteModal } from '@/components';

<InviteModal
  isOpen={isOpen}
  onClose={handleClose}
  onInvite={handleInvite}
  currentMembers={members}
  friends={friendsList}
  loading={isLoading}
/>
```

**Props:**
- `isOpen` (boolean, required): Whether the modal is open
- `onClose` (function, required): Function to call when modal closes
- `onInvite` (function, required): Function to call when invitation is sent
- `currentMembers` (array): Array of current member objects
- `friends` (array): Array of friend objects to select from
- `loading` (boolean): Loading state

**Features:**
- Email input with validation
- Friend selector dropdown
- Role selection (Owner, Editor, Viewer)
- Current members list display
- Form validation

### ShareModal

Modal for generating and managing shareable links with access controls.

```jsx
import { ShareModal } from '@/components';

<ShareModal
  isOpen={isOpen}
  onClose={handleClose}
  onGenerateLink={handleGenerateLink}
  resourceType="note"
  resourceId="123"
  existingLink={link}
  loading={isLoading}
/>
```

**Props:**
- `isOpen` (boolean, required): Whether the modal is open
- `onClose` (function, required): Function to call when modal closes
- `onGenerateLink` (function, required): Function to call when generating a link
- `resourceType` (string): Type of resource ('note' or 'instance')
- `resourceId` (string): ID of the resource being shared
- `existingLink` (string): Existing share link if available
- `loading` (boolean): Loading state

**Features:**
- Public/Restricted access toggle
- Role selection (Viewer, Editor)
- Expiry date picker
- Link generation
- Copy link button with check animation
- Link settings summary

### AIResultModal

Modal for displaying AI-generated content with copy and insert options.

```jsx
import { AIResultModal } from '@/components';

<AIResultModal
  isOpen={isOpen}
  onClose={handleClose}
  content={aiContent}
  loading={isProcessing}
  onInsert={handleInsert}
  title="AI Summary"
  showInsertButton={true}
/>
```

**Props:**
- `isOpen` (boolean, required): Whether the modal is open
- `onClose` (function, required): Function to call when modal closes
- `content` (string): AI-generated content to display
- `loading` (boolean): Loading state during AI processing
- `onInsert` (function): Function to call when inserting content to note
- `title` (string, default: 'AI Assistant Result'): Modal title
- `showInsertButton` (boolean, default: true): Whether to show the insert button

**Features:**
- Loading shimmer animation during processing
- Copy to clipboard functionality
- Insert to note functionality
- Empty state handling
- Responsive layout

## Responsive Behavior

All modals are fully responsive:

### Mobile (< 768px)
- Full-screen overlay
- No border radius
- Adjusted padding
- Touch-friendly buttons (min 44x44px)
- Stacked button layout

### Tablet (768px - 1199px)
- Max width: 600px
- Centered on screen
- Standard padding

### Desktop (≥ 1200px)
- Max width: 700px (500px for standard modals)
- Centered on screen
- Full padding

## Accessibility

All modals include:
- Keyboard navigation support
- Escape key to close
- Focus management
- ARIA labels and roles
- Visible focus indicators
- Screen reader compatible
- Reduced motion support

## Styling

Modals use the glassmorphism design system:
- Backdrop blur effect
- Semi-transparent backgrounds
- Smooth animations
- Consistent spacing and typography
- Touch-friendly interactive elements

## Examples

### Basic Modal

```jsx
const [isOpen, setIsOpen] = useState(false);

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <ModalHeader onClose={() => setIsOpen(false)}>
    Confirm Action
  </ModalHeader>
  <ModalBody>
    <p>Are you sure you want to proceed?</p>
  </ModalBody>
  <ModalFooter>
    <GlassButton variant="ghost" onClick={() => setIsOpen(false)}>
      Cancel
    </GlassButton>
    <GlassButton variant="primary" onClick={handleConfirm}>
      Confirm
    </GlassButton>
  </ModalFooter>
</Modal>
```

### Invite Modal

```jsx
const handleInvite = async (inviteData) => {
  console.log('Inviting:', inviteData);
  // API call to send invitation
};

<InviteModal
  isOpen={showInvite}
  onClose={() => setShowInvite(false)}
  onInvite={handleInvite}
  currentMembers={[
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Owner' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' }
  ]}
  friends={[
    { id: '3', name: 'Bob Wilson', email: 'bob@example.com' }
  ]}
/>
```

### Share Modal

```jsx
const handleGenerateLink = async (linkData) => {
  // API call to generate shareable link
  const response = await api.generateShareLink(linkData);
  return response.link;
};

<ShareModal
  isOpen={showShare}
  onClose={() => setShowShare(false)}
  onGenerateLink={handleGenerateLink}
  resourceType="note"
  resourceId={noteId}
/>
```

### AI Result Modal

```jsx
const handleInsert = (content) => {
  // Insert AI content into editor
  editor.insertText(content);
};

<AIResultModal
  isOpen={showAIResult}
  onClose={() => setShowAIResult(false)}
  content={aiGeneratedText}
  loading={isProcessing}
  onInsert={handleInsert}
  title="AI Summary"
/>
```

## Requirements Fulfilled

This implementation fulfills the following requirements from the design document:

- **Requirement 7.1**: Modals with glassmorphism containers and backdrop blur
- **Requirement 7.2**: Scale animation from 0.95 to 1.0 on modal open
- **Requirement 7.5**: Copy link functionality with check animation
- **Requirement 9.3**: Full-screen overlay on mobile devices with touch-friendly buttons
