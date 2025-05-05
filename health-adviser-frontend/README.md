# Health Advisor AI Chatbot - Frontend

This is the frontend application for the Health Advisor AI Chatbot, built with React 19, Vite, and Tailwind CSS.

## Live Demo

Visit the live application: [https://virtual-health-coach.vercel.app](https://virtual-health-coach.vercel.app)

## Features

- Modern, responsive UI that works on desktop and mobile devices
- Real-time chat interface with the AI health advisor
- Markdown rendering for formatted responses
- Loading states and error handling
- Session-based chat history persistence

## Tech Stack

- React 19 (latest version)
- Vite for fast development and optimized builds
- Tailwind CSS for styling
- React Markdown for rendering formatted responses

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository and navigate to the frontend directory
   ```
   git clone https://github.com/yourusername/health-adviser.git
   cd health-adviser/health-adviser-frontend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create environment file
   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your backend URL
   ```
   VITE_API_URL=http://localhost:5000
   ```
   For production, use your deployed backend URL.

### Development

Start the development server:
```
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173)

### Building for Production

```
npm run build
```

The built files will be in the `dist` directory.

## Deployment

This frontend is deployed on Vercel. The deployment process is:

1. Connect your GitHub repository to Vercel
2. Configure the build settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Set the environment variables in the Vercel dashboard
4. Deploy

## Project Structure

```
health-adviser-frontend/
├── public/                 # Static assets
├── src/                    # Source code
│   ├── App.jsx             # Main application component
│   ├── index.css           # Global styles
│   └── main.jsx            # Application entry point
├── .env.example            # Example environment variables
└── package.json            # Frontend dependencies
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

