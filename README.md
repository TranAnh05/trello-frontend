# Trello Clone Frontend

This project is a web application that replicates the core functionality of Trello. It provides a collaborative interface for managing tasks using boards, columns, and cards, featuring drag-and-drop mechanics, real-time updates, and user authentication.

## Project Description

The application provides a responsive dashboard for task management. Users can organize work in columns and move cards between them. The project supports real-time synchronization across clients, ensuring that all users see updates instantly. It includes secure authentication flows and a detailed card management interface that supports markdown-based descriptions.

## Technologies Used

- Core: React, Vite
- Styling: Material UI
- State Management: Redux Toolkit, Redux Persist
- Navigation: React Router
- Drag and Drop: dnd-kit
- Communication: Axios, Socket.io
- Rich Text Editor: react-md-editor

## How to Use

### Prerequisites

Ensure you have Node.js version 18 or higher installed.

### Installation

1. Clone or download the repository.
2. Open a terminal in the project root directory.
3. Run the following command to install the required dependencies:

```bash
npm install
```

### Running Locally

To start the development server, run:

```bash
npm run dev
```

This will launch the application in development mode. The default API host is configured for localhost:8017.

### Building for Production

To compile the application for production, run:

```bash
npm run build
```

The built files will be generated in the dist directory.

### Linting

To run the linter and check for code quality and formatting, run:

```bash
npm run lint
```
