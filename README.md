# DevConnect Ecosystem 🚀

DevConnect is a premium, high-performance social platform for developers to connect, collaborate, and showcase their architectural masterpieces.

## Features ✨

- **Glassmorphic UI**: A stunning, modern interface built with Tailwind CSS v4 and Vite.
- **Real-time Messaging**: Instant developer-to-developer coordination via Socket.IO.
- **Portfolio Showcasing**: Create and share your projects with the global dev community.
- **Developer Network**: Follow elite builders and stay updated on the latest tech innovations.

## Technology Stack 🛠️

- **Frontend**: React 19, Tailwind CSS v4, Vite, Axios, Socket.IO-Client.
- **Backend**: Node.js, Express 5, MongoDB (Mongoose), JWT, Socket.IO.
- **State Management**: React Context API (Auth).

## Getting Started 🚀

### Prerequisites

- Node.js (v18+)
- MongoDB (Running locally or via Atlas)

### Installation

1.  **Clone the repository**
2.  **Install dependencies for all packages**
    ```bash
    npm run install-all
    ```

3.  **Configure Environment Variables**
    - Create a `.env` file in the `server` directory with:
      ```env
      MONGO_URI=your_mongodb_uri
      JWT_SECRET=your_secret_key
      PORT=5000
      ```

### Running the Application

To run both the frontend and backend concurrently:
```bash
npm run dev
```

The application will be available at:
- **Client**: `http://localhost:3000`
- **Server**: `http://localhost:5000`

## Project Structure 📁

```text
├── client/          # Frontend React application (Vite + Tailwind v4)
├── server/          # Backend Node.js API (Express + MongoDB)
└── package.json     # Root management with concurrently
```

## Contributing 🤝

Contributions are welcome! If you have a fix or a feature, feel free to open a PR.

---
Architected for the modern web with ❤️
