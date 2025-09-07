# ColabNotes

A modern, collaborative note-sharing platform built with React and Vite. ColabNotes features a sleek dark theme interface with integrated chatbot assistance and user-friendly navigation.

## Features

- 🌙 **Dark Theme Interface** - Modern, eye-friendly dark design
- 💬 **Integrated Chatbot** - AI-powered study assistant accessible from the navbar
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- 🎯 **Clean Navigation** - Intuitive navbar with sidebar and chatbot controls
- ⚡ **Fast Performance** - Built with Vite for lightning-fast development and builds
- 🎨 **Modern UI Components** - Custom-styled components with smooth animations

## Tech Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **Styling**: Custom CSS with modern design patterns
- **Icons**: Unicode emojis for lightweight icons

## Project Structure

```
ColabNotes/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Main navigation bar
│   │   │   ├── Navbar.css          # Navbar styling
│   │   │   ├── Sidebar.jsx         # Right-side navigation menu
│   │   │   ├── Sidebar.css         # Sidebar styling
│   │   │   ├── Chatbot.jsx         # AI chatbot component
│   │   │   └── Chatbot.css         # Chatbot styling
│   │   ├── App.jsx                 # Main application component
│   │   ├── main.jsx               # Application entry point
│   │   └── index.css              # Global styles
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/colabnotes.git
   cd colabnotes
   ```

2. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Available Scripts

In the frontend directory, you can run:

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code quality checks

## Usage

### Navigation
- **Home**: Welcome page with clean, minimal design
- **Navbar**: Contains navigation links and action buttons
- **Sidebar**: Access user dashboard, profile, notes, and settings via the menu button (☰)
- **Chatbot**: Get AI assistance by clicking the chat button (💬)

### Features Overview

#### Navbar
- Responsive design with mobile hamburger menu
- Integrated sidebar and chatbot toggle buttons
- Smooth hover animations and transitions

#### Sidebar
- Right-side sliding panel
- User navigation with dashboard, profile, notes, and settings
- User info display with avatar and online status
- Overlay background for mobile experience

#### Chatbot
- Floating overlay interface
- Real-time message exchange
- Typing indicators for better UX
- Responsive design for all screen sizes

## Customization

### Themes
The application uses CSS custom properties for easy theme customization. Main color variables are defined in the component CSS files:

- Primary: `#4a9eff`
- Success: `#28a745`
- Background: `#1a1a1a`
- Surface: `#2a2a2a`
- Text: `#e0e0e0`

### Components
Each component is modular and can be easily customized:
- Modify CSS files for styling changes
- Update component props for functionality changes
- Add new features by extending existing components

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

- [ ] User authentication system
- [ ] Real-time collaborative editing
- [ ] Note sharing and permissions
- [ ] Advanced chatbot integration with AI models
- [ ] File upload and attachment support
- [ ] Search functionality
- [ ] Class management system
- [ ] Notification system

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using React and Vite**