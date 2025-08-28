import { Activity, AlertTriangle, Bot, Shield, Clock, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { useWebSocket, WebSocketMessage } from "@/hooks/useWebSocket";

interface ActivityItem {
  id: string;
  timestamp: string;
  type: "alert" | "bot_action" | "system" | "exploit_prevented" | "websocket";
  severity: "critical" | "high" | "medium" | "low" | "info";
  title: string;
  description: string;
  protocol?: string;
  value?: string;
  botName?: string;
}

const ActivityItem = ({ item }: { item: ActivityItem }) => {
  const getIcon = () => {
    switch (item.type) {
      case "alert": return <AlertTriangle className="h-4 w-4 text-critical" />;
      case "bot_action": return <Bot className="h-4 w-4 text-primary" />;
      case "exploit_prevented": return <Shield className="h-4 w-4 text-success" />;
      case "system": return <Activity className="h-4 w-4 text-muted-foreground" />;
      case "websocket": return <Activity className="h-4 w-4 text-primary" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSeverityColor = () => {
    switch (item.severity) {
      case "critical": return "critical";
      case "high": return "warning";
      case "medium": return "warning";
      case "low": return "secondary";
      case "info": return "secondary";
      default: return "secondary";
    }
  };

  const shouldPulse = item.severity === "critical" && (item.type === "alert" || item.type === "websocket");

  return (
    <div className={`flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/20 transition-colors cursor-pointer ${
      shouldPulse ? 'animate-critical-pulse bg-critical/5 border-l-2 border-critical' : ''
    }`}>
      <div className={`mt-1 ${shouldPulse ? 'animate-critical-pulse' : ''}`}>
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <h4 className="text-sm font-medium text-foreground truncate">
            {item.title}
          </h4>
          <div className="flex items-center space-x-2 ml-2">
            {item.value && (
              <Badge variant="outline" className="text-xs font-cyber">
                {item.value}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground whitespace-nowrap font-cyber">
              {item.timestamp}
            </span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {item.description}
        </p>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            {item.protocol && (
              <Badge variant="secondary" className="text-xs">
                {item.protocol}
              </Badge>
            )}
            {item.botName && (
              <Badge variant="outline" className="text-xs font-cyber">
                🤖 {item.botName}
              </Badge>
            )}
            <Badge 
              variant={getSeverityColor() as any}
              className="text-xs uppercase"
            >
              {item.severity}
            </Badge>
          </div>
          
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ActivityFeed = () => {
  const [apiHealthy, setApiHealthy] = useState<"unknown" | "ok" | "down">("unknown");
  const { getHealth } = useApi();
  const { isConnected, messages } = useWebSocket();
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
    fetch(`${baseUrl}/health`, { signal: controller.signal })
      .then((r) => r.ok ? r.json() : Promise.reject(new Error("bad status")))
      .then(() => setApiHealthy("ok"))
      .catch(() => setApiHealthy("down"))
      .finally(() => clearTimeout(timeout));
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  // Convert WebSocket messages to activity items
  useEffect(() => {
    const wsActivities: ActivityItem[] = messages.map((msg, index) => ({
      id: `ws-${index}`,
      timestamp: new Date(msg.timestamp).toLocaleTimeString(),
      type: "websocket" as const,
      severity: msg.severity?.toLowerCase() as any || "info",
      title: msg.message,
      description: msg.action || msg.message,
      protocol: msg.protocol,
      value: msg.tvlAtRisk ? `$${(msg.tvlAtRisk / 1e6).toFixed(1)}M` : undefined,
      botName: msg.botName,
    }));

    // Combine with static activities
    const staticActivities: ActivityItem[] = [
      {
        id: "1",
        timestamp: "2 min ago",
        type: "alert",
        severity: "critical",
        title: "Vulnerable Vyper 0.2.15 detected",
        description: "Curve Finance CRV/ETH pool using vulnerable compiler version",
        protocol: "Curve Finance",
        value: "$24.7M"
      },
      {
        id: "2", 
        timestamp: "5 min ago",
        type: "bot_action",
        severity: "high",
        title: "White hat intervention successful",
        description: "Front-ran potential exploit attempt on Yearn USDC vault",
        protocol: "Yearn Finance",
        botName: "c0ffeebabe.eth",
        value: "$18.2M"
      },
      {
        id: "3",
        timestamp: "8 min ago",
        type: "system",
        severity: "info", 
        title: "Protocol scan completed",
        description: "Deep security analysis finished for 127 protocols",
        value: "127 protocols"
      }
    ];

    setActivities([...wsActivities, ...staticActivities]);
  }, [messages]);

  return (
    <Card className="cyber-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <span>Live Activity Feed</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              apiHealthy === "ok" && isConnected ? "bg-success animate-status-breathe" : 
              apiHealthy === "down" || !isConnected ? "bg-critical" : "bg-muted"
            }`} />
            <span className={`text-xs font-medium ${
              apiHealthy === "ok" && isConnected ? "text-success" : 
              apiHealthy === "down" || !isConnected ? "text-critical" : "text-muted-foreground"
            }`}>
              {apiHealthy === "ok" && isConnected ? "LIVE" : 
               apiHealthy === "down" ? "API DOWN" : 
               !isConnected ? "WS DISCONNECTED" : "CHECKING"}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="space-y-1 p-4 pt-0">
            {activities.length > 0 ? (
              activities.map((item) => (
                <ActivityItem key={item.id} item={item} />
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No activity yet</p>
                <p className="text-sm">Real-time updates will appear here</p>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-border/50">
          <Button variant="outline" className="w-full" size="sm">
            View All Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};