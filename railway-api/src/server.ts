import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { ScannerController } from "./controllers/scanner.controller.js";
import { WebSocketService } from "./services/websocket.service.js";

dotenv.config();

const app = express();
const server = createServer(app);

app.use(cors());
app.use(express.json());

// Initialize WebSocket service
const wsService = new WebSocketService(server);

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    connectedClients: wsService.getConnectedClientsCount()
  });
});

// Initialize controllers
const scannerController = new ScannerController(wsService);

// Scanner routes
app.get("/api/scan/contract/:address", (req, res) => scannerController.scanContract(req, res));
app.post("/api/scan/bulk", (req, res) => scannerController.bulkScan(req, res));
app.get("/api/vulnerabilities", (req, res) => scannerController.getVulnerabilities(req, res));
app.post("/api/risk/assess", (req, res) => scannerController.assessRisk(req, res));
app.get("/api/scan/demo", (req, res) => scannerController.demoScan(req, res));

// WebSocket status endpoint
app.get("/api/ws/status", (_req, res) => {
  res.json({
    connectedClients: wsService.getConnectedClientsCount(),
    socketIds: wsService.getConnectedClients()
  });
});

// Test WebSocket events endpoint
app.post("/api/ws/test", (req, res) => {
  const { eventType, data } = req.body;
  
  switch (eventType) {
    case 'critical_alert':
      wsService.emitCriticalAlert(data.protocol, data.message, data.tvlAtRisk);
      break;
    case 'bot_status':
      wsService.emitBotStatus(data.botName, data.status, data.action);
      break;
    case 'tvl_update':
      wsService.emitTVLUpdate(data.protocol, data.oldTVL, data.newTVL);
      break;
    default:
      return res.status(400).json({ error: 'Invalid event type' });
  }
  
  res.json({ success: true, message: `Emitted ${eventType} event` });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 DeFi Infrastructure Guardian API listening on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Demo scan: http://localhost:${PORT}/api/scan/demo`);
  console.log(`🔌 WebSocket status: http://localhost:${PORT}/api/ws/status`);
  console.log(`🧪 Test WebSocket: POST http://localhost:${PORT}/api/ws/test`);
});
