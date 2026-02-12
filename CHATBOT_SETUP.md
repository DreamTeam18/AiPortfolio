# Chatbot Setup Guide

The AI chatbot feature requires an OpenRouter API key to function. Follow these steps to set it up:

## 1. Get an OpenRouter API Key

1. Visit [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Sign up for a free account
3. Generate a new API key
4. Copy the key (you won't be able to see it again)

## 2. Configure the API Key

Add your API key to the `.env` file in the project root:

```bash
# OpenRouter API Key
OPENROUTER_API_KEY=your_actual_api_key_here

# Server Port (optional)
PORT=3002
```

## 3. Start the Backend Server

Run the backend server:

```bash
npm run server
```

The server will start on http://localhost:3002 with two endpoints:
- `POST /api/chat` - Chat endpoint for AI responses
- `GET /api/health` - Health check endpoint

## 4. Start the Frontend

In a separate terminal, run:

```bash
npm run dev
```

The frontend will be available at http://localhost:5173

## 5. Test the Chatbot

1. Open http://localhost:5173 in your browser
2. Type a message in the "Ask me anything..." input
3. Click the send button (arrow icon)
4. The chatbot will respond with information about Siddhant

## Features

- **AI-powered responses** using OpenRouter's GPT-3.5 Turbo
- **Comprehensive system prompt** with Siddhant's full resume and portfolio data
- **Casual, first-person personality** as Siddhant
- **Conversation history** maintained during the session
- **Error handling** with user-friendly messages
- **Loading states** with spinner animation
- **Styled chat bubbles** (blue for user, gray for bot)

## Troubleshooting

**Error: "OpenRouter API key not configured"**
- Make sure you've created a `.env` file in the project root
- Verify the API key is correctly copied (no extra spaces)
- Restart the backend server after adding the key

**Error: "Failed to connect to server"**
- Make sure the backend server is running (`npm run server`)
- Check that port 3002 is not being used by another application
- Try changing the PORT in `.env` to a different number

**Error: "Failed to get response from AI"**
- Check your OpenRouter API key is valid
- Verify you have credits remaining on your OpenRouter account
- Check the browser console and server logs for details

## API Usage

The backend uses OpenRouter's API to access GPT-3.5 Turbo. Each request costs a small amount based on tokens used. Check your usage at https://openrouter.ai/activity

## Development Mode

For development without an API key, the backend will return a helpful error message explaining how to set up the key. This allows testing the integration without incurring API costs.
