# Amazon Orders Management System

A Node.js backend application for managing Amazon orders with Express and MongoDB.

## Backend Folder Structure

```
backend/
├── package.json              # Project dependencies and scripts
├── package-lock.json         # Dependency lock file
├── server.js                 # Application entry point
└── src/
    ├── app.js                # Express app configuration
    ├── config/
    │   └── db.js             # Database connection configuration
    ├── controllers/          # Business logic for handling requests
    ├── middlewares/          # Custom middleware functions
    ├── models/               # MongoDB schema definitions
    ├── routes/               # API endpoint definitions
    └── services/             # Reusable business logic services
```

## Folder Descriptions

### `/backend`
- **package.json** - Defines project metadata, dependencies (express, mongoose, nodemon, dotenv), and npm scripts
- **server.js** - Main entry point that starts the Express server
- **src/** - Source code directory containing all application logic

### `/src`
- **app.js** - Express application setup, middleware configuration, and route integration
- **config/db.js** - MongoDB connection setup and configuration
- **controllers/** - Request handlers that process API calls and return responses
- **middlewares/** - Custom middleware for authentication, validation, error handling, etc.
- **models/** - Mongoose schemas and models for MongoDB documents
- **routes/** - Route definitions that map HTTP methods and paths to controllers
- **services/** - Business logic separated from routes for reusability

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Installation

```bash
cd backend
npm install
```

### Environment Variables
Create a `.env` file in the backend directory:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
```

### Running the Server

**Development mode** (with auto-restart):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

## Technologies Used
- **Express.js** - Web framework
- **Mongoose** - MongoDB object modeling
- **Nodemon** - Development auto-reload
- **dotenv** - Environment variable management

## Project Architecture
This project follows the MVC (Model-View-Controller) pattern with additional service layer:
- **Models** - Data structure definitions
- **Controllers** - Request/response handling
- **Services** - Business logic and reusable functions
- **Routes** - API endpoints
- **Middlewares** - Cross-cutting concerns
