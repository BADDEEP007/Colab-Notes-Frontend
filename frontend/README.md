# Ollama Frontend

A modern React frontend for interacting with Ollama language models.

## Features

- 💬 Chat interface with multiple conversation threads
- 🤖 Model selection and management
- 🌙 Dark/Light theme toggle
- 📱 Responsive design for desktop and mobile
- ⚡ Real-time messaging with Ollama API
- 💾 Local storage for preferences and conversations

## Prerequisites

- Node.js (v18 or higher)
- Ollama running locally on port 11434

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Make sure Ollama is running locally
2. The app will automatically fetch available models
3. Select a model from the dropdown
4. Start chatting!

## API Endpoints

The frontend connects to these Ollama API endpoints:

- `GET /api/tags` - Fetch available models
- `POST /api/generate` - Generate responses

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.