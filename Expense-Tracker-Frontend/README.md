# Expense Tracker Frontend

Modern, responsive React-based frontend application for the Expense Tracker Spring Boot backend.

## Features

- 📊 Track Expenses & Income
- 📈 Dashboard Analytics with P&L
- 🔐 Secure Authentication (Traditional + OAuth2)
- 📱 Fully Responsive Design
- 🎨 Modern UI with Tailwind CSS

## Tech Stack

- React 18+ with Vite
- Tailwind CSS
- React Router v6
- Axios
- Recharts
- React Hook Form

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend server running on http://localhost:8080

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at http://localhost:5173

### Build

```bash
npm run build
```

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_OAUTH2_REDIRECT_URI=http://localhost:5173/auth/callback
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API service layer
├── context/       # React Context providers
├── hooks/        # Custom React hooks
├── utils/        # Utility functions
└── App.jsx       # Main app component
```

## Authentication

- Traditional: Username/Email + Password
- OAuth2: Google and GitHub

## License

MIT

