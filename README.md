# Chat Application

A real-time chat application built with **React**, **Node.js**, **Socket.IO**, and **MongoDB**. This application allows users to log in, send messages, and see who is online, with real-time communication powered by **Socket.IO**.

---

## Features

- **Real-time Messaging**: Send and receive messages instantly using **Socket.IO**.
- **User Authentication**: Secure login functionality with JWT tokens.
- **User Online Status**: Displays the online/offline status of users.
- **Responsive Design**: Fully responsive layout using **Tailwind CSS**.
- **Trial Login**: Pre-configured trial login credentials for easy access.

---

## Tech Stack

### Frontend:
- **React.js**: JavaScript library for building user interfaces.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Axios**: HTTP client for making API requests.
- **React Router**: For navigation between components.
- **Socket.IO Client**: For real-time communication.

### Backend:
- **Node.js**: JavaScript runtime for building the server-side logic.
- **Express.js**: Web framework for Node.js.
- **Socket.IO Server**: For handling real-time messaging between clients.
- **MongoDB**: NoSQL database for storing user data, messages, and conversations.
- **Mongoose**: MongoDB object modeling tool for Node.js.
- **JWT (JSON Web Token)**: For secure user authentication.
- **CORS**: Middleware for handling cross-origin resource sharing.

---

## Deployment

### Backend (Render)
1. Go to [Render.com](https://chat-application-3jzb.onrender.com).
2. Create a new Web Service with the **Node.js** environment.
3. Connect your GitHub repository.
4. Set the build and start commands:
   - Build command: `npm install`
   - Start command: `node app.js`
5. Set up environment variables such as `MONGODB_URI`, `JWT_SECRET`, etc.

### Frontend (Vercel)
1. Go to [Vercel.com](https://chat-application-seven-eosin.vercel.app).
2. Create a new project and link your GitHub repository.
3. Vercel will automatically detect your project and deploy it.
4. Set up environment variables like the backend URL (`REACT_APP_BACKEND_URL`).
5. The frontend will be accessible via a generated URL.

---

## Installation

### Backend:
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/chat-application-backend.git
   cd chat-application-backend
