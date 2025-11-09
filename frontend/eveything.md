
```markdown
# Collab Notes - Frontend Specification and Layout Guide

## Overview

Collab Notes is a real-time, collaborative notes and whiteboard web application.  
It enables users to:
- Log in or sign up using Email, Google, or Microsoft authentication.
- Create and manage **Instances** (workspaces).
- Create **Containers** inside each instance to group notes.
- Write and draw using a **whiteboard editor**.
- Invite friends and collaborate in real time.
- Share notes and instances through shareable links.
- Assign and manage **roles** (Owner, Editor, Viewer).
- Use **AI tools** to summarize or generate notes.
- Auto-save all notes and show real-time online users.

This document defines the **frontend architecture**, **layouts**, **page structure**, **features**, and **API routes**.

---

## 1. Authentication Page (Login / Signup)

### Layout
```

---

## | login/signup form | animated background (illustration) |

```

### Behavior
- For **Login**, form on the **left**, animated background on the **right**.
- For **Signup**, form slides to the **right**, animated background on the **left**.
- Smooth transition between login and signup forms.
- Google and Microsoft OAuth login options.
- Backend validation with error display.

### Endpoints
| Function | Method | Endpoint |
|-----------|---------|----------|
| Register | POST | `/api/auth/register` |
| Login | POST | `/api/auth/login` |
| Refresh Token | POST | `/api/auth/refresh` |
| Logout | POST | `/api/auth/logout` |
| Forgot Password | POST | `/api/auth/forgot-password` |
| Reset Password | POST | `/api/auth/reset-password` |
| Recover Username | POST | `/api/auth/recover-username` |
| Get Current User | GET | `/api/auth/me` |
| Send Verification Email | POST | `/api/sendmail/verification` |
| Verify Gmail | GET | `/api/auth/verify` |
| Change Password | POST | `/api/auth/change-password` |

### OAuth Endpoints
| Provider | Register | Callback | Verify |
|-----------|-----------|-----------|--------|
| Google | `/api/google/register` | `/api/google/callback` | `/api/google/verify-token` |
| Microsoft | `/api/microsoft/register` | `/api/microsoft/callback` | `/api/microsoft/verify-token` |

---

## 2. Main Dashboard (After Login)

### Layout
```

---

## | Navigation Bar (Logo, Search, Profile Avatar)           |

| Instances Grid (Instance Cards) |
| ------------------------------- |
| Sidebar: User Online List       |
| Bottom: Productivity Tools Bar  |

---

```

### Description
- Displays all instances the user owns or collaborates in.
- Each instance card shows:
  - Instance name
  - Members count
  - Role badge (Owner / Editor / Viewer)
- Users can create, rename, delete, or share instances.
- Online users visible in the sidebar.
- Productivity tools at the bottom: AI assistant, shared notes, and quick actions.

### Endpoints
| Function | Method | Endpoint |
|-----------|---------|----------|
| Get All Users | GET | `/api/database/users` |
| Get User by ID | GET | `/api/database/users/id` |
| Get User by Email | GET | `/api/database/users/mail` |
| Add User | POST | `/api/database/users` |
| Update User | PUT | `/api/database/users/:id` |
| Delete User | DELETE | `/api/database/users/delete` |

---

## 3. Instance Page (Inside a Workspace)

### Layout
```

---

## | Navbar: Instance Name | Invite | Share | Profile       |

| Left: My Notes / Collaborated Notes                    |
| Main: Containers Grid                                  |

| Right: Friends Online Panel             |
| --------------------------------------- |
| Bottom Toolbar: Productivity + AI Tools |

---

```

### Description
- Displays containers for organizing notes.
- **My Notes**: Notes created by the user.
- **Collaborated Notes**: Notes shared by friends.
- **Friends Online**: Shows live online users in the same instance.
- **Invite Button**: Invite users by email or friend list.
- **Share Button**: Generate role-based instance links.
- **AI Summary**: Summarizes all notes in this instance.

### Features
- Friends can share notes directly into instances.
- Role system enforced (Owner, Editor, Viewer).
- Shared notes appear under the “Collaborated Notes” section.

---

## 4. Container Page (Notes + Whiteboard View)

### Layout
```

---

## | Navbar: Container Name | Auto Save | Profile            |

| Left Panel: Tools (Pen, Eraser, Shape, Text, Export)    |
| Main Area: Whiteboard Canvas / Text Editor              |
| Right Bottom: Real-time Editing Users                   |
-----------------------------------------------------------

```

### Description
- Displays selected note or whiteboard.
- Auto-save enabled for each edit.
- Whiteboard supports:
  - Pen, Eraser, Shapes, Text tools.
  - Undo/Redo.
  - Export as image or PDF.
- Real-time updates using WebSockets.
- AI Assistant for summarizing or rewriting content.

### Endpoints
| Function | Method | Endpoint |
|-----------|---------|----------|
| Get All Notes | GET | `/api/notes/get` |
| Get Note by Title | GET | `/api/notes/get/title/:title` |
| Add Note | POST | `/api/notes/add` |
| Update Note | PUT | `/api/notes/update/:title` |
| Delete Note | DELETE | `/api/notes/delete` |

---

## 5. Friends and Collaboration System

### Layout
```

---

## | Friends List | Friend Requests | Shared Notes           |

## | Friend Card: [Send Message | Share Note | Remove]       |

```

### Description
- Users can add or remove friends.
- Accept or reject friend requests.
- Friends’ online status is visible in the sidebar.
- “Share Note” button allows sending a note to a friend or instance.

### Features
- Shared notes appear under “Shared with Me”.
- Shared notes are accessible in respective instances.
- Roles determine access control.

---

## 6. Shareable Links

### Description
Each note or instance can generate a secure, shareable link.

### Example URLs
- Instance: `/share/instance/:instanceId?role=viewer`
- Note: `/share/note/:noteId?role=editor`

### Features
- Role-based sharing control.
- Public or restricted access.
- Expiry option for links.

---

## 7. AI Integration

### Description
AI functionality supports productivity within the platform.

### Capabilities
- Summarize notes or entire containers.
- Generate drafts from prompts.
- Extract and summarize text from whiteboard drawings.
- Provide contextual suggestions.

### Endpoints
| Function | Method | Endpoint |
|-----------|---------|----------|
| Summarize Note | POST | `/api/ai/summary` |
| Generate Note | POST | `/api/ai/assist` |

---

## 8. Realtime Collaboration

### Description
All collaborative actions are synced via Socket.io.

### Socket Events
| Event | Description |
|--------|-------------|
| `note:update` | Synchronize note content. |
| `note:share` | Notify about a shared note. |
| `draw:update` | Sync whiteboard drawings. |
| `friend:added` | Notify friend request accepted. |
| `user:status` | Update online/offline presence. |

---

## 9. Folder / Component Structure

```

src/
├── api/
│   ├── axiosInstance.js
│   ├── authApi.js
│   ├── notesApi.js
│   ├── usersApi.js
│   ├── friendsApi.js
│   └── aiApi.js
│
├── components/
│   ├── Layout/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Toolbar.jsx
│   │   └── ShareModal.jsx
│   ├── Auth/
│   │   ├── LoginForm.jsx
│   │   └── SignupForm.jsx
│   ├── Dashboard/
│   │   ├── InstanceCard.jsx
│   │   └── CreateInstanceModal.jsx
│   ├── Instance/
│   │   ├── ContainerCard.jsx
│   │   └── InviteModal.jsx
│   ├── Notes/
│   │   ├── NoteEditor.jsx
│   │   ├── Whiteboard.jsx
│   │   ├── ShareNoteModal.jsx
│   │   └── AIPanel.jsx
│   ├── Friends/
│   │   ├── FriendList.jsx
│   │   ├── FriendCard.jsx
│   │   └── SharedWithMe.jsx
│   └── Profile/
│       ├── ProfileInfo.jsx
│       ├── AccessTable.jsx
│       └── RoleBadge.jsx
│
├── store/
│   ├── useAuthStore.js
│   ├── useInstanceStore.js
│   ├── useNoteStore.js
│   ├── useFriendStore.js
│   └── useSocketStore.js
│
├── utils/
│   ├── socket.js
│   ├── helpers.js
│   ├── roles.js
│   └── aiUtils.js
│
└── App.jsx

```

---

## 10. Technology Stack

- **Frontend Framework:** React (or Next.js)
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** Zustand or Redux Toolkit
- **Realtime Communication:** Socket.io Client
- **Whiteboard Library:** tldraw or Fabric.js
- **HTTP Client:** Axios with interceptors
- **AI Integration:** Custom REST endpoints

---

## 11. Backend Route Reference

| Category | Method | Endpoint | Description |
|-----------|---------|----------|-------------|
| Notes | GET | `/api/notes/get` | Fetch all notes |
| Notes | GET | `/api/notes/get/title/:title` | Get note by title |
| Notes | POST | `/api/notes/add` | Add a note |
| Notes | PUT | `/api/notes/update/:title` | Update a note |
| Notes | DELETE | `/api/notes/delete` | Delete a note |
| Auth | POST | `/api/auth/register` | Register a user |
| Auth | POST | `/api/auth/login` | Login user |
| Auth | POST | `/api/auth/refresh` | Refresh JWT token |
| Auth | POST | `/api/auth/logout` | Logout user |
| Auth | POST | `/api/auth/forgot-password` | Request password reset |
| Auth | POST | `/api/auth/reset-password` | Reset password |
| Auth | POST | `/api/auth/recover-username` | Recover username |
| Auth | GET | `/api/auth/me` | Get current user |
| Auth | GET | `/api/auth/verify` | Verify email |
| Auth | POST | `/api/sendmail/verification` | Send verification mail |
| Auth | POST | `/api/auth/change-password` | Change user password |
| Google Auth | POST | `/api/google/register` | Google register |
| Google Auth | GET | `/api/google/callback` | Google callback |
| Google Auth | POST | `/api/google/verify-token` | Google verify |
| Microsoft Auth | POST | `/api/microsoft/register` | Microsoft register |
| Microsoft Auth | GET | `/api/microsoft/callback` | Microsoft callback |
| Microsoft Auth | POST | `/api/microsoft/verify-token` | Microsoft verify |
| Database Users | POST | `/api/database/users` | Add user entry |
| Database Users | GET | `/api/database/users` | Get all users |
| Database Users | GET | `/api/database/users/id` | Get user by ID |
| Database Users | GET | `/api/database/users/mail` | Get user by email |
| Database Users | PUT | `/api/database/users/:id` | Update user |
| Database Users | DELETE | `/api/database/users/delete` | Delete user |

---

## 12. Deliverables

- Responsive frontend matching layout sketches.
- Auth flow with JWT and OAuth.
- Instance, container, and note management.
- Real-time collaboration for text and whiteboard.
- Role-based sharing and permission control.
- AI integration for summarization and generation.
- Friend system with shared notes.
- Clean and modular React + Tailwind structure.

---

## 13. Layout References

1. **Login / Signup Page**  
   - Split view layout with animated background.
2. **Main Dashboard**  
   - Instances grid, online users sidebar, productivity tools bottom bar.
3. **Instance Page**  
   - Containers grid, friends online, AI toolbar.
4. **Note Editor Page**  
   - Whiteboard area with tools sidebar, auto-save, and real-time collaborators.

---

**End of Document**
```

