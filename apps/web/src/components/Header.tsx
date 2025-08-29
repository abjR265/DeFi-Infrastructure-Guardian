import { Shield, AlertTriangle, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Shield className="h-8 w-8 text-primary animate-pulse" />
              <div className="absolute inset-0 h-8 w-8 text-primary/20 animate-ping" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                DeFi Infrastructure Guardian
              </h1>
              <p className="text-sm text-muted-foreground font-cyber">
                Real-time Threat Detection & Response
              </p>
            </div>
          </div>

          {/* Status and Alerts */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">
                CRITICAL ALERTS: 4
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-500">
                System Status: ACTIVE
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Uptime: 99.97%
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};