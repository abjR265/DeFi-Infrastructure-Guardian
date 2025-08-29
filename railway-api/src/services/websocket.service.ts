import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { ContractInfo } from './scanner.service.js';

export interface WebSocketEvent {
  type: 'alert' | 'scan_complete' | 'risk_update' | 'bot_status' | 'tvl_update';
  data: any;
  timestamp: Date;
}

export class WebSocketService {
  private io: SocketIOServer;

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:8080",
        methods: ["GET", "POST"]
      }
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Send initial connection confirmation
      socket.emit('connected', {
        message: 'Connected to DeFi Infrastructure Guardian',
        timestamp: new Date()
      });

      // Handle client disconnection
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });

      // Handle client joining specific rooms
      socket.on('join_room', (room: string) => {
        socket.join(room);
        console.log(`Client ${socket.id} joined room: ${room}`);
      });

      // Handle client leaving rooms
      socket.on('leave_room', (room: string) => {
        socket.leave(room);
        console.log(`Client ${socket.id} left room: ${room}`);
      });
    });
  }

  // Emit events to all connected clients
  emitToAll(event: WebSocketEvent) {
    this.io.emit(event.type, {
      ...event.data,
      timestamp: event.timestamp
    });
  }

  // Emit events to specific room
  emitToRoom(room: string, event: WebSocketEvent) {
    this.io.to(room).emit(event.type, {
      ...event.data,
      timestamp: event.timestamp
    });
  }

  // Emit critical alerts
  emitCriticalAlert(protocol: string, message: string, tvlAtRisk: number) {
    this.emitToAll({
      type: 'alert',
      data: {
        severity: 'CRITICAL',
        protocol,
        message,
        tvlAtRisk,
        action: 'IMMEDIATE_ATTENTION_REQUIRED'
      },
      timestamp: new Date()
    });
  }

  // Emit scan completion
  emitScanComplete(contracts: ContractInfo[], summary: any) {
    this.emitToAll({
      type: 'scan_complete',
      data: {
        contracts,
        summary,
        message: `Scan completed: ${contracts.length} contracts analyzed`
      },
      timestamp: new Date()
    });
  }

  // Emit risk level updates
  emitRiskUpdate(protocol: string, oldRisk: string, newRisk: string, tvlAtRisk: number) {
    this.emitToAll({
      type: 'risk_update',
      data: {
        protocol,
        oldRisk,
        newRisk,
        tvlAtRisk,
        message: `Risk level changed for ${protocol}: ${oldRisk} → ${newRisk}`
      },
      timestamp: new Date()
    });
  }

  // Emit bot status updates
  emitBotStatus(botName: string, status: 'ACTIVE' | 'STANDBY' | 'OFFLINE', action?: string) {
    this.emitToAll({
      type: 'bot_status',
      data: {
        botName,
        status,
        action,
        message: `Bot ${botName} is now ${status.toLowerCase()}`
      },
      timestamp: new Date()
    });
  }

  // Emit TVL updates
  emitTVLUpdate(protocol: string, oldTVL: number, newTVL: number) {
    this.emitToAll({
      type: 'tvl_update',
      data: {
        protocol,
        oldTVL,
        newTVL,
        change: newTVL - oldTVL,
        changePercent: ((newTVL - oldTVL) / oldTVL) * 100,
        message: `TVL updated for ${protocol}: $${(oldTVL / 1e6).toFixed(1)}M → $${(newTVL / 1e6).toFixed(1)}M`
      },
      timestamp: new Date()
    });
  }

  // Get connected clients count
  getConnectedClientsCount(): number {
    return this.io.engine.clientsCount;
  }

  // Get all connected socket IDs
  getConnectedClients(): string[] {
    return Array.from(this.io.sockets.sockets.keys());
  }
}
