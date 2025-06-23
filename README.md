# Gram

**Gram** is a modern social platform for sharing moments, connecting with friends, and discovering new content. It features user authentication, post creation with image uploads, real-time messaging, AI-powered caption generation, and a beautiful, responsive frontend.

---

## Features

- **User Authentication:** Register, login, profile management, follow/unfollow users.
- **Feed:** View posts from users you follow.
- **Post Creation:** Upload images, add captions (with optional AI-generated suggestions).
- **Likes & Comments:** Like posts and comments, interact with others.
- **Search:** Find users and view their profiles.
- **Real-time Chat:** Send and receive messages instantly.
- **AI Integration:** Generate engaging captions for images using Google Gemini AI.
- **Responsive UI:** Built with React, Tailwind CSS, and Vite for a fast, modern experience.

---

## Tech Stack

### Backend
- Node.js, Express.js
- MongoDB (Mongoose)
- Socket.io (real-time chat)
- Redis (caching, optional)
- ImageKit (image uploads)
- Google Gemini AI (caption generation)
- JWT (authentication)
- Deployed-ready for Render

### Frontend
- React (with Vite)
- Tailwind CSS
- React Router
- Axios
- Framer Motion (animations)
- Socket.io-client

---

## Project Structure

```
gram/
  Backend/      # Express API, MongoDB models, sockets, AI, image, and auth services
  Frontend/     # React app, components, views, routes, assets, Tailwind config
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or cloud)
- ImageKit account (for image uploads)
- Google Gemini AI API key (for AI captions)
- Redis instance (optional, for caching)

### Environment Variables

Create a `.env` file in `Backend/` with:

```
PORT=3000
MONGO_URL=mongodb://localhost:27017/gram
JWT_KEY=your_jwt_secret
IMAGE_KIT_PUBLIC_KEY=your_imagekit_public_key
IMAGE_KIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
REDIS_URL=your_redis_url
GEMINI_AI_KEY=your_gemini_api_key
```

### Backend Setup

```bash
cd Backend
npm install
npm start
```

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

The frontend will run on [http://localhost:5173](http://localhost:5173) by default.

---

## API Overview

### Auth & User

- `POST /users/register` — Register a new user
- `POST /users/login` — Login
- `GET /users/profile` — Get current user profile
- `PATCH /users/togglefollow` — Follow/unfollow a user
- `GET /users/search` — Search users
- `POST /users/searched-profile` — Get another user's profile
- `GET /users/get-messages` — Get messages
- `GET /users/conversations` — Get conversation list

### Posts

- `POST /posts/create` — Create a post (with image upload)
- `PATCH /posts/like` — Like/unlike a post
- `GET /posts/:postId` — Get a single post
- `DELETE /posts/:postId` — Delete a post

### Comments

- `POST /comments/create` — Add a comment
- `POST /comments/like` — Like a comment
- `DELETE /comments/delete` — Delete a comment

### Feed

- `GET /feed` — Get the main feed (requires authentication)

### Real-time Messaging

- Socket.io events for chat and conversation history

### AI Caption

- Backend service for generating captions using Google Gemini AI

---

## Frontend Routes

- `/` — Landing page (Hero)
- `/register` — Register
- `/login` — Login
- `/home` — Main feed (protected)
- `/profile` — Your profile (protected)
- `/profile/:username` — Other user profiles (protected)
- `/create-post` — Create a new post (protected)
- `/search` — Search users (protected)
- `/messages` — Real-time chat (protected)
- `*` — 404 Not Found

---

## Contributing

1. Fork the repo
2. Create a new branch
3. Make your changes
4. Submit a pull request

---

## License

This project is licensed under the MIT License. 