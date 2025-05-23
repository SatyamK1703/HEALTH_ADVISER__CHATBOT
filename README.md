﻿# Health Advisor AI Chatbot

A conversational AI assistant that provides health information and advice based on established medical knowledge. This application uses Google's Gemini 1.5 Pro model to generate responses to health-related queries.

## Live Demo

- Frontend: [https://virtual-health-coach.vercel.app](https://virtual-health-coach.vercel.app)
- Backend API: [https://heakth-adviser-backend.vercel.app](https://heakth-adviser-backend.vercel.app)

## Features

- Real-time chat interface with AI health advisor
- Responsive design for desktop and mobile devices
- Markdown support for formatted responses
- Persistent chat history during session
- Clear error handling and loading states

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- React Markdown

### Backend
- Node.js
- Express
- Google Generative AI (Gemini 1.5 Pro)
- CORS for cross-origin requests

## Project Structure

```
health-adviser/
├── health-adviser-frontend/    # React frontend application
│   ├── public/                 # Static assets
│   ├── src/                    # Source code
│   │   ├── App.jsx             # Main application component
│   │   ├── index.css           # Global styles
│   │   └── main.jsx            # Application entry point
│   ├── .env.example            # Example environment variables
│   └── package.json            # Frontend dependencies
│
└── heakth-adviser-backend/     # Node.js backend API
    ├── app.js                  # Express server and API routes
    ├── .env.example            # Example environment variables
    └── package.json            # Backend dependencies
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Google AI API key (Gemini)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/SatyamK1703/health-adviser.git
   cd health-adviser
   ```

2. Set up the backend
   ```
   cd heakth-adviser-backend
   npm install
   cp .env.example .env
   ```
   Edit `.env` and add your Gemini API key

3. Set up the frontend
   ```
   cd ../health-adviser-frontend
   npm install
   cp .env.example .env
   ```
   Edit `.env` and set `VITE_API_URL` to your backend URL

### Running Locally

1. Start the backend server
   ```
   cd heakth-adviser-backend
   npm run dev
   ```

2. Start the frontend development server
   ```
   cd ../health-adviser-frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Deployment

This project is deployed on Vercel with automatic deployments from GitHub.

### Backend Deployment
- Deployed as a serverless Node.js function
- Environment variables set in Vercel dashboard
- CORS configured to allow requests from frontend domain

### Frontend Deployment
- Built with Vite and deployed as static assets
- Environment variables set in Vercel dashboard

## License

[MIT License](LICENSE)

## Acknowledgements

- Google Generative AI for providing the Gemini model
- Vercel for hosting the application
