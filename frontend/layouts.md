

```markdown
# Collab Notes - UI/UX Layout and Design Specification

## Design Overview

**Goal:**  
Build a clean, collaborative, productivity-oriented interface that feels **light, fluid, and futuristic**.  
Design style should reflect focus and collaboration, using a **soft glassmorphism aesthetic** with light color tones (blue, peach, and white gradients).  

### General Theme
- **Primary Colors:**  
  - Light Sky Blue `#B3E5FC`  
  - Soft Peach `#FFE0B2`  
  - Off White `#F9FAFB`
- **Accent Colors:**  
  - Muted Navy `#355C7D` for text and icons  
  - Light Coral `#FFAB91` for highlights or errors  
- **Background:**  
  - Subtle gradient with blur effect:  
    - Linear gradient (180deg): `rgba(255,255,255,0.7)` → `rgba(255,255,255,0.4)`
- **Glass Effect (Containers, Buttons):**  
  - Background blur: `backdrop-filter: blur(10px)`  
  - Border: `1px solid rgba(255,255,255,0.3)`  
  - Rounded corners: `border-radius: 16px`  
  - Shadow: soft, low-opacity drop shadows.

---

## 1. Authentication Page (Login / Signup)

### Layout Composition
```

---

## | Left: Form Section   | Right: Animated Background Panel  |

```

### Form Section
- Center-aligned vertically and horizontally.
- Includes:
  - App logo (small, top-left)
  - Welcome text (“Welcome Back” / “Create an Account”)
  - Input fields: Email, Password, Confirm Password (for signup)
  - Primary button: “Login” / “Sign Up”
  - Secondary links: “Forgot Password?” / “Sign up here” / “Back to Login”
  - Divider with “or continue with”
  - OAuth buttons (Google, Microsoft)
- All inputs have subtle inner shadows and hover glow (glass effect).
- Primary buttons use soft gradients (blue → peach).
- Validation errors appear inline below fields.

### Animated Background Panel
- A full-height background with **animated abstract waves or floating particles**.
- Animation should be smooth, looped, and non-distracting.
- During transitions (login ↔ signup), the form slides horizontally while the background shifts its hue slightly.
- Transition duration: `0.8s`, easing: `ease-in-out`.

### Responsiveness
- On mobile:
  - Background collapses behind form (stacked layout).
  - Animation fades to subtle gradient overlay.
  - Form stretches full width.

---

## 2. Dashboard (Main Page After Login)

### Layout Composition
```

---

## | Top Navigation Bar                                      |

| Left Sidebar (Online Users) | Instances Grid Area       |
|----------------------------------------------------------|
| Bottom Toolbar (Productivity Tools)                     |
-----------------------------------------------------------

```

### Navigation Bar
- Fixed at the top with slight transparency.
- Contains:
  - App logo (left)
  - Search bar (center)
  - User avatar (right) → dropdown: Profile, Settings, Logout
- Background: frosted glass with subtle shadow.

### Instances Grid Area
- Responsive 3-column grid (desktop), 2-column (tablet), 1-column (mobile).
- Each instance card:
  - Glassy container with hover scale-up (1.03x).
  - Title, member count, and “Open” button.
  - On hover: subtle glow border + blur intensity increase.
- “+ Create Instance” button fixed bottom-right (floating action button, gradient background).

### Online Users Sidebar
- Vertical list showing avatars of online users with small green status dots.
- Hover shows tooltip with user name and role.
- On mobile: collapsible or toggle via icon in nav bar.

### Productivity Toolbar
- Docked bottom bar:
  - Buttons: AI Assistant, Calendar, Quick Notes, Shared Notes.
  - Icons only, tooltip on hover.
- Slight elevation + shadow.
- Gradient fade effect when scrolling.

### Animations
- Smooth page fade-in on load.
- Instance cards fade and rise on mount.
- Sidebar slides in/out when toggled.

---

## 3. Instance Page (Inside a Workspace)

### Layout Composition
```

---

## | Top Bar: Instance Title | Invite | Share | Profile      |

| Left Column: My Notes / Collaborated Notes Tabs         |
| Center: Container Cards Grid                            |
| Right Sidebar: Friends Online                           |
-----------------------------------------------------------

## | Bottom: AI Assistant Toolbar                            |

```

### Instance Header
- Displays:
  - Instance name
  - Action buttons:
    - “Invite” (opens modal)
    - “Share Instance” (opens modal)
  - User avatar dropdown.
- Background: gradient with light transparency.

### Container Grid
- Cards represent note groups.
- Glass effect on hover.
- Responsive grid system.
- Each card:
  - Container name
  - Notes count
  - Last updated timestamp
- “Add Container” floating button at bottom-right.

### Friends Online Sidebar
- Displays avatars and usernames.
- Status indicator (online/offline).
- “Invite to Instance” option via dropdown per friend.
- Scrollable and collapsible.

### AI Toolbar
- Sticky bottom bar with:
  - “Summarize Instance Notes”
  - “Generate Summary Report”
- Button press triggers animated loader ring and result modal.

### Responsiveness
- Sidebar hides behind “Online” toggle on small screens.
- Cards become single-column in mobile view.

---

## 4. Container Page (Notes and Collaboration View)

### Layout Composition
```

---

## | Navbar: Container Title | Auto Save | Profile Avatar     |

## | Left Tools Panel | Main Canvas / Editor | Right Users Panel |

## | Bottom Toolbar (Actions: Undo, Redo, Share, AI, Export)   |

```

### Left Tools Panel
- Vertical icons:
  - Pen, Eraser, Shapes, Text, Sticky Notes, Select, Clear.
- Active tool highlighted with glow.
- Semi-transparent frosted panel.

### Main Editor Area
- **Mode Switch:** Tabs → [Notes] [Whiteboard]
- Notes:
  - Rich text editor (Markdown or Quill-style).
  - Auto-save after inactivity (2s debounce).
- Whiteboard:
  - Canvas-based (tldraw / Fabric.js).
  - Smooth pen input and real-time sync.
- Background:
  - Faint dotted grid with soft lighting overlay.

### Right Panel
- “Users Editing Now” list (avatars + initials).
- Inline chat or comments panel.
- Displays editing presence (live cursors optional).

### Bottom Toolbar
- Contains:
  - Undo / Redo
  - Share Note
  - AI Assist (Summarize or Rewrite)
  - Export
- On hover: tooltip fade-in with short description.

### Animations
- Canvas drawing has real-time fade strokes.
- Note save indicator glows briefly when triggered.
- User joins/leaves trigger avatar fade transitions.

### Responsiveness
- Tools panel collapses to top row icons in mobile view.
- Chat panel collapses under “Users” icon.
- Editor auto-fits to screen height.

---

## 5. Modals and Forms

### Modal Design
- Centralized, glassy containers.
- Fade-in with scale transition (`transform: scale(0.95) → scale(1)`).
- Subtle backdrop blur behind modal.

### Common Modals
- **Invite User Modal:**
  - Input email / select friend.
  - Assign role (Owner / Editor / Viewer).
  - “Send Invite” button.
- **Share Modal:**
  - Toggle: Public / Restricted.
  - Copy Link button with check animation on copy.
- **AI Summary Modal:**
  - Shows generated content with “Copy”, “Insert to Note” buttons.
  - Loading shimmer during AI processing.

### Form Elements
- Rounded, transparent inputs with frosted borders.
- Labels float upwards on focus.
- Validation errors appear in peach-red text.

---

## 6. Friends and Shared Notes Page

### Layout Composition
```

---

## | Tabs: Friends | Requests | Shared with Me              |

## | Friend Cards Grid                                     |

```

### Friend Card
- Displays:
  - Profile picture, username, status.
  - Buttons: Message, Share Note, Remove.
- “Add Friend” floating button in bottom-right.
- Hover effects: slight glow, elevate card.

### Shared Notes Section
- List of notes received from friends.
- Each entry:
  - Note title, sender, instance name.
  - “Open” button redirects to note page.

### Animations
- Tab transitions slide left/right.
- Friend cards fade-in sequentially.

### Responsiveness
- Stacks vertically on mobile.
- Tabs become a dropdown.

---

## 7. Global Design and Responsiveness Rules

### Breakpoints
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: below 768px

### Navigation
- Sidebar collapses to icons on tablet.
- Modals become full-screen overlays on mobile.
- Navigation bar always sticky with shadow.

### Transitions
- All interactive elements (buttons, cards) use:
  - `transition: all 0.3s ease;`
  - Hover scale: 1.03x
  - Pressed scale: 0.98x

### Buttons
- Gradient background (blue → peach).
- Soft glow on hover.
- Disabled state: reduced opacity, no shadow.

### Scroll Behavior
- Smooth scroll enabled globally.
- Custom slim scrollbar: rounded, semi-transparent.

---

## 8. Accessibility and Interaction Guidelines

- All text high contrast (WCAG AA minimum).
- Focus indicators for all interactive elements.
- Tooltips on hover and long press for icons.
- Keyboard shortcuts (optional):
  - Ctrl + S → Save
  - Ctrl + K → AI Assist
  - Ctrl + N → New Note

---

## 9. Summary

This layout defines:
- A consistent **glassy, light-themed interface**.
- Modular design structure.
- Smooth, minimal animations.
- Full responsiveness across devices.
- Accessibility and clarity as primary design principles.

All transitions, containers, modals, and components should maintain visual coherence using the **soft glassmorphism** and **peach-blue color scheme** for a calm, productive environment.

---

**End of Document**
```

