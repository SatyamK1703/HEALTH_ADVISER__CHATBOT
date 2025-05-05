# Health Advisor AI Chatbot - Backend

This is the backend API for the Health Advisor AI Chatbot, built with Node.js, Express, and Google's Generative AI (Gemini 1.5 Pro).

## Live API

API Endpoint: [https://heakth-adviser-backend.vercel.app](https://heakth-adviser-backend.vercel.app)

Test the API health: [https://heakth-adviser-backend.vercel.app/api/health](https://heakth-adviser-backend.vercel.app/api/health)

## Features

- RESTful API for chat interactions with Gemini 1.5 Pro
- Configurable system instructions for health-focused responses
- Request timeout handling
- CORS configuration for secure cross-origin requests
- Detailed error handling and logging

## Tech Stack

- Node.js
- Express.js
- Google Generative AI SDK
- CORS for cross-origin resource sharing
- dotenv for environment variable management

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/chat` - Chat endpoint that processes messages and returns AI responses

### Chat Endpoint

Request body:
```json
{
  "message": "Your health question here",
  "history": [
    {
      "text": "Previous message",
      "sender": "user"
    },
    {
      "text": "Previous response",
      "sender": "bot"
    }
  ]
}
```

Response:
```json
{
  "reply": "AI response text",
  "model": "gemini-1.5-pro"
}
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Google AI API key (Gemini)

### Installation

1. Clone the repository and navigate to the backend directory
   ```
   git clone https://github.com/yourusername/health-adviser.git
   cd health-adviser/heakth-adviser-backend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create environment file
   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your Gemini API key
   ```
   PORT=5000
   GEMINI_API_KEY=your_api_key_here
   ```

### Development

Start the development server:
```
npm run dev
```

The API will be available at [http://localhost:5000](http://localhost:5000)

### Production

Start the production server:
```
npm start
```

## Deployment

This backend is deployed on Vercel as a serverless function. The deployment process is:

1. Create a `vercel.json` file in the root directory
2. Connect your GitHub repository to Vercel
3. Configure the build settings
4. Set the environment variables in the Vercel dashboard
5. Deploy

### vercel.json

```json
{
  "version": 2,
  "builds": [
    {
      "src": "app.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "app.js"
    }
  ]
}
```

## Testing the API

You can use the included `test-api.js` script to test your Gemini API key:

```
node test-api.js
```

## Project Structure

```
heakth-adviser-backend/
├── app.js                  # Express server and API routes
├── test-api.js             # Script to test Gemini API
├── .env.example            # Example environment variables
├── vercel.json             # Vercel deployment configuration
└── package.json            # Backend dependencies
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.