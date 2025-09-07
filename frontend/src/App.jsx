import { useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Chatbot from './components/Chatbot'

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen)
  }

  return (
    <div>
      <Navbar onSidebarToggle={toggleSidebar} onChatbotToggle={toggleChatbot} />
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <Chatbot isOpen={isChatbotOpen} onToggle={toggleChatbot} />
      
      <main style={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#1a1a1a', color: '#ffffff' }}>
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#ffffff' }}>
            Welcome to ColabNotes
          </h1>
        </div>
      </main>
    </div>
  )
}