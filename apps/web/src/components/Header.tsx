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
            {/* Critical Alerts Counter */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <AlertTriangle className="h-5 w-5 text-critical animate-critical-pulse" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs font-bold animate-critical-pulse"
                >
                  4
                </Badge>
              </div>
              <span className="text-sm text-critical font-medium">
                CRITICAL ALERTS: 4
              </span>
            </div>

            {/* System Status */}
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full animate-status-breathe" />
              <div className="flex flex-col">
                <div className="flex items-center space-x-1">
                  <Activity className="h-4 w-4 text-success" />
                  <span className="text-sm text-success font-medium">
                    System Status: ACTIVE
                  </span>
                </div>
                <span className="text-xs text-muted-foreground font-cyber">
                  Uptime: 99.97%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="mt-4">
          <div className="flex space-x-8">
            {[
              { name: "Dashboard", active: true, badge: null },
              { name: "Alerts", active: false, badge: "4" },
              { name: "Bots", active: false, badge: "3" },
              { name: "Simulation", active: false, badge: null },
              { name: "Analytics", active: false, badge: null }
            ].map((tab) => (
              <Button
                key={tab.name}
                variant={tab.active ? "default" : "ghost"}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  tab.active
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {tab.name}
                {tab.badge && (
                  <Badge 
                    variant="destructive"
                    className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {tab.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};