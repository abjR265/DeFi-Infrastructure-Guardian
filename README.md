# DeFi Infrastructure Guardian

**Real-time monitoring and coordinated response system for infrastructure-level DeFi risks**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green.svg)](https://nodejs.org/)
[![Turbo](https://img.shields.io/badge/Turbo-1.10-purple.svg)](https://turbo.build/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Live Demo

**Production Deployment**
- **Frontend (Vercel):** [https://de-fi-infrastructure-guardian-web.vercel.app/](https://de-fi-infrastructure-guardian-web.vercel.app/)
- **Backend API (Render)** [https://defi-infrastructure-guardian.onrender.com](https://defi-infrastructure-guardian.onrender.com)

**Live Video Demo:**
- **Full Demo Walkthrough:** [Watch complete demo on Loom](https://www.loom.com/share/67a4b50490a741758e4449d3c5388106?sid=6981135f-3538-43a4-af7f-15a3d11dcdf0)

**API Endpoints:**
- **Health Check:** [https://defi-infrastructure-guardian.onrender.com/health](https://defi-infrastructure-guardian.onrender.com/health)
- **Demo Scan:** [https://defi-infrastructure-guardian.onrender.com/api/scan/demo](https://defi-infrastructure-guardian.onrender.com/api/scan/demo)
- **WebSocket Status:** [https://defi-infrastructure-guardian.onrender.com/api/ws/status](https://defi-infrastructure-guardian.onrender.com/api/ws/status)

## Mission

Prevent systemic DeFi exploits through real-time infrastructure monitoring, coordinated emergency responses, gamified white hat protection, and predictive analysis to stop exploits before they happen.

## Features

### Enhanced Compiler Detection
- **Multi-compiler support**: Solidity (0.6.x - 0.8.x) and Vyper (0.2.x - 0.3.x)
- **Real-time bytecode analysis** for vulnerability detection
- **Comprehensive vulnerability database** with known exploits
- **Rate-limited RPC integration** with caching and retry mechanisms

### Real-time Risk Assessment
- **Live protocol monitoring** with TVL tracking
- **Multi-level risk scoring**: CRITICAL, HIGH, MEDIUM, LOW
- **Vulnerability correlation** with affected functions
- **Economic impact analysis** with TVL at risk calculations

### Interactive Dashboard
- **Real-time statistics** with live updates
- **Protocol risk cards** with detailed vulnerability information
- **Threat visualization** with network topology mapping
- **Activity feed** with live scan results and alerts

### WebSocket Integration
- **Real-time updates** for scan completions
- **Live risk level changes** with instant notifications
- **Connected client management** with room-based messaging
- **Event-driven architecture** for scalable communication

### Modern Architecture
- **Monorepo structure** with Turborepo for efficient development
- **TypeScript-first** approach with comprehensive type safety
- **Microservices architecture** with API and Web applications
- **Containerized deployment** with Docker and Docker Compose

## Architecture

```
DeFi Infrastructure Guardian
├── Monorepo (Turborepo)
│   ├── apps/api/          # Node.js/Express API
│   ├── apps/web/          # React/Vite Frontend
│   └── packages/          # Shared utilities
├── Production Deployment
│   ├── Frontend (Vercel)     # React/Vite Application
│   └── Backend (Render)      # Node.js/Express API
└── Development Tools
    ├── TypeScript            # Type safety
    ├── ESLint               # Code quality
    └── Turbo                # Build system
```

## Tech Stack

### Backend
- **Runtime**: Node.js 20 with TypeScript
- **Framework**: Express.js with Socket.IO
- **Blockchain**: Ethers.js for Ethereum interaction
- **Database**: PostgreSQL with Redis caching (planned)
- **Real-time**: Socket.IO for WebSocket communication
- **HTTP Client**: Axios for external API calls
- **Deployment**: Render (Node.js Web Service)

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development
- **Styling**: TailwindCSS with custom cyber theme
- **UI Components**: Radix UI with Shadcn/ui
- **State Management**: React Query for server state
- **Real-time**: Socket.IO client for live updates
- **Charts**: Recharts for data visualization
- **Animations**: Framer Motion for smooth interactions
- **Deployment**: Vercel (React/Vite Application)

### Infrastructure
- **Monorepo**: Turborepo for efficient development
- **Frontend Hosting**: Vercel with automatic deployments
- **Backend Hosting**: Render with Node.js runtime
- **Development**: Hot reload with TypeScript compilation
- **CI/CD**: GitHub Actions with automatic deployment

## Installation

### Prerequisites
- Node.js 20+
- Git

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd DeFi-Infrastructure-Guardian
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start development servers**
```bash
# Start all services
npm run dev

# Or start individually
npm run dev -w apps/api    # Backend API (port 3001)
npm run dev -w apps/web    # Frontend (port 3000)
```

5. **Access the application**
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **Demo Scan**: http://localhost:3001/api/scan/demo

### Docker Deployment

```bash
# Start all services with Docker
docker-compose -f docker/docker-compose.yml up -d

# View logs
docker-compose -f docker/docker-compose.yml logs -f
```

## Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/defi_guardian
REDIS_URL=redis://localhost:6379

# Blockchain
ETHEREUM_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/YOUR_KEY
INFURA_URL=https://mainnet.infura.io/v3/YOUR_KEY

# Security
JWT_SECRET=your-jwt-secret
API_KEY=your-api-key

# Notifications
DISCORD_WEBHOOK_URL=your-discord-webhook
EMAIL_SERVICE=your-email-service
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

## API Endpoints

### Core Endpoints
- `GET /health` - Health check with WebSocket status
- `GET /api/scan/demo` - Demo scan with mock data
- `POST /api/scan/contract` - Scan individual contract
- `POST /api/scan/bulk` - Bulk contract scanning
- `GET /api/vulnerabilities` - Get vulnerability rules
- `GET /api/risk/assessment` - Get risk assessments

### WebSocket Events
- `scan_complete` - Scan completion notification
- `risk_update` - Risk level changes
- `alert` - Critical vulnerability alerts
- `bot_status` - Monitoring bot status updates
- `tvl_update` - TVL changes

## UI Components

### Dashboard Components
- **StatsCards**: Real-time statistics with animations
- **ProtocolRiskCards**: Individual protocol risk assessments
- **ThreatVisualization**: Network topology with protocol mapping
- **ActivityFeed**: Live activity stream with WebSocket updates
- **Header**: Navigation with status indicators

### Design System
- **Cyber Theme**: Dark theme with neon accents
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant components
- **Animations**: Smooth transitions and micro-interactions

## Vulnerability Detection

### Supported Compilers

#### Solidity
- **Versions**: 0.6.0 - 0.8.25
- **Vulnerabilities**: Reentrancy, overflow, access control
- **Risk Levels**: MEDIUM (0.8.0-0.8.2), HIGH (0.7.x, 0.6.x)

#### Vyper
- **Versions**: 0.2.15 - 0.3.9
- **Vulnerabilities**: Reentrancy (0.2.15/0.2.16), known issues (0.3.0)
- **Risk Levels**: CRITICAL (0.2.15/0.2.16), HIGH (0.3.0)

### Detection Features
- **Bytecode Analysis**: Real-time contract scanning
- **Version Detection**: Compiler version identification
- **Pattern Matching**: Known vulnerability patterns
- **Risk Assessment**: Multi-factor risk scoring
- **Caching**: Performance optimization with TTL

## Current Status

###  Production Deployment
- [x] **Frontend (Vercel)** - [Live Dashboard](https://de-fi-infrastructure-guardian-web.vercel.app/)
- [x] **Backend (Render)** - [API Service](https://defi-infrastructure-guardian.onrender.com)
- [x] **Real-time Communication** - WebSocket integration
- [x] **Environment Configuration** - Production environment variables

### Completed Features
- [x] **Monorepo Setup** - Turborepo with TypeScript
- [x] **Backend API** - Express.js with Socket.IO
- [x] **Frontend Dashboard** - React with real-time updates
- [x] **Compiler Detection** - Solidity and Vyper support
- [x] **Vulnerability Database** - Known exploit patterns
- [x] **Real-time Communication** - WebSocket integration
- [x] **Risk Assessment** - Multi-level scoring system
- [x] **Type Safety** - Comprehensive TypeScript coverage
- [x] **Production Deployment** - Vercel + Render hosting
- [x] **Clean UI** - Removed navigation clutter

### In Progress
- [ ] **Real TVL Integration** - DeFiLlama API connection
- [ ] **Enhanced Vulnerability Rules** - Expanded database
- [ ] **Real-time Monitoring** - Continuous contract scanning
- [ ] **Alert System** - Notification workflows
- [ ] **Simulation Engine** - Exploit simulation tools

### Roadmap
- [ ] **Phase 2**: Advanced monitoring and alerting
- [ ] **Phase 3**: Simulation and response coordination
- [ ] **Phase 4**: Database integration and scaling

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation for new features
- Use conventional commit messages
- Ensure code passes linting and type checking

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Ethers.js** for Ethereum interaction
- **Socket.IO** for real-time communication
- **Radix UI** for accessible components
- **TailwindCSS** for utility-first styling
- **Turborepo** for monorepo management

## Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Documentation**: [Wiki](https://github.com/your-repo/wiki)

---

**Built with love for the DeFi community**
