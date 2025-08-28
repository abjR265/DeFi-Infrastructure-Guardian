# DeFi Infrastructure Guardian - Web Application

This is the frontend web application for the DeFi Infrastructure Guardian system, built with React, TypeScript, and Vite.

## Features

- **Real-time Dashboard**: Live monitoring of DeFi protocol vulnerabilities
- **Interactive Components**: Protocol risk cards, threat visualization, and activity feed
- **WebSocket Integration**: Real-time updates and notifications
- **Responsive Design**: Mobile-first approach with cyber theme
- **TypeScript**: Full type safety and IntelliSense support

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development
- **Styling**: TailwindCSS with custom cyber theme
- **UI Components**: Radix UI with Shadcn/ui
- **State Management**: React Query for server state
- **Real-time**: Socket.IO client for live updates
- **Charts**: Recharts for data visualization

## Development

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

The application will be available at http://localhost:8080

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Environment Variables

Create a `.env` file in the root of the web app:

```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Shadcn/ui components
│   ├── StatsCards.tsx  # Statistics dashboard
│   ├── ProtocolRiskCards.tsx  # Protocol risk assessment
│   ├── ThreatVisualization.tsx  # Network visualization
│   ├── ActivityFeed.tsx  # Live activity feed
│   └── Header.tsx      # Navigation header
├── hooks/              # Custom React hooks
│   ├── useApi.ts       # API integration
│   └── useWebSocket.ts # WebSocket management
├── pages/              # Page components
│   └── Dashboard.tsx   # Main dashboard
├── lib/                # Utility libraries
└── main.tsx           # Application entry point
```

## Contributing

1. Follow TypeScript best practices
2. Use the existing component patterns
3. Ensure responsive design
4. Test with the backend API
5. Update documentation as needed
