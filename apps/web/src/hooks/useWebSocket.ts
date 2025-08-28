import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export interface WebSocketEvent {
  type: 'alert' | 'scan_complete' | 'risk_update' | 'bot_status' | 'tvl_update';
  data: any;
  timestamp: string;
}

export interface WebSocketMessage {
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  protocol?: string;
  message: string;
  tvlAtRisk?: number;
  action?: string;
  botName?: string;
  status?: 'ACTIVE' | 'STANDBY' | 'OFFLINE';
  oldTVL?: number;
  newTVL?: number;
  change?: number;
  changePercent?: number;
  timestamp: string;
}

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
    
    // Create socket connection
    socketRef.current = io(wsUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
    });

    const socket = socketRef.current;

    // Connection events
    socket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    // Custom events
    socket.on('alert', (data: WebSocketMessage) => {
      console.log('Alert received:', data);
      setLastMessage(data);
      setMessages(prev => [...prev, data].slice(-50)); // Keep last 50 messages
    });

    socket.on('scan_complete', (data: WebSocketMessage) => {
      console.log('Scan complete:', data);
      setLastMessage(data);
      setMessages(prev => [...prev, data].slice(-50));
    });

    socket.on('risk_update', (data: WebSocketMessage) => {
      console.log('Risk update:', data);
      setLastMessage(data);
      setMessages(prev => [...prev, data].slice(-50));
    });

    socket.on('bot_status', (data: WebSocketMessage) => {
      console.log('Bot status:', data);
      setLastMessage(data);
      setMessages(prev => [...prev, data].slice(-50));
    });

    socket.on('tvl_update', (data: WebSocketMessage) => {
      console.log('TVL update:', data);
      setLastMessage(data);
      setMessages(prev => [...prev, data].slice(-50));
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const joinRoom = (room: string) => {
    if (socketRef.current) {
      socketRef.current.emit('join_room', room);
    }
  };

  const leaveRoom = (room: string) => {
    if (socketRef.current) {
      socketRef.current.emit('leave_room', room);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    isConnected,
    lastMessage,
    messages,
    joinRoom,
    leaveRoom,
    clearMessages,
  };
};
