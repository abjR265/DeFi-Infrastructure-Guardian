import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Network, Zap, Target, Info } from "lucide-react";

export const ThreatVisualization = () => {
  return (
    <Card className="cyber-card threat-visualization">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center space-x-2">
            <Network className="h-5 w-5 text-primary" />
            <span>Real-time Threat Network</span>
          </CardTitle>
          <Button variant="outline" size="sm">
            <Target className="h-4 w-4 mr-2" />
            Focus View
          </Button>
        </div>
        
        {/* Protocol Index - Horizontal Layout */}
        <div className="mt-3 bg-background/50 rounded-lg p-2 border border-border/30">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Info className="h-3 w-3 text-primary" />
              <span className="text-xs font-semibold text-foreground">Protocol Index:</span>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-critical rounded-full" />
                <span className="text-muted-foreground">C</span>
                <span className="text-foreground">Curve</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-critical rounded-full" />
                <span className="text-muted-foreground">Y</span>
                <span className="text-foreground">Yearn</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-warning rounded-full" />
                <span className="text-muted-foreground">B</span>
                <span className="text-foreground">Balancer</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span className="text-muted-foreground">U</span>
                <span className="text-foreground">Uniswap</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span className="text-muted-foreground">A</span>
                <span className="text-foreground">Aave</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-warning rounded-full" />
                <span className="text-muted-foreground">1</span>
                <span className="text-foreground">1inch</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="relative h-[400px] bg-background/5 rounded-lg border border-border/30 overflow-hidden">
          {/* Animated background grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }} />
          </div>
          
          {/* Network nodes */}
          <div className="relative h-full flex items-center justify-center">
            {/* Central hub - Critical node */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="w-16 h-16 bg-critical/20 border-2 border-critical rounded-full flex items-center justify-center animate-critical-pulse">
                  <Zap className="h-6 w-6 text-critical" />
                </div>
                <div className="absolute inset-0 w-16 h-16 border-2 border-critical/30 rounded-full animate-ping" />
                <Badge className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-critical text-critical-foreground">
                  CRITICAL
                </Badge>
              </div>
            </div>
            
            {/* Connected protocols */}
            {[
              { name: "Curve", position: "top-20 left-20", risk: "critical", size: "w-12 h-12" },
              { name: "Yearn", position: "top-20 right-20", risk: "critical", size: "w-12 h-12" },
              { name: "Balancer", position: "bottom-20 left-32", risk: "high", size: "w-10 h-10" },
              { name: "Uniswap", position: "bottom-32 right-20", risk: "low", size: "w-8 h-8" },
              { name: "Aave", position: "top-32 left-1/2 transform -translate-x-1/2", risk: "low", size: "w-8 h-8" },
              { name: "1inch", position: "bottom-20 left-1/2 transform -translate-x-1/2", risk: "medium", size: "w-9 h-9" }
            ].map((node, index) => (
              <div key={index} className={`absolute ${node.position}`}>
                <div className="relative">
                  <div className={`${node.size} ${
                    node.risk === 'critical' ? 'bg-critical/20 border-critical animate-critical-pulse' :
                    node.risk === 'high' ? 'bg-warning/20 border-warning' :
                    node.risk === 'medium' ? 'bg-warning/10 border-warning/70' :
                    'bg-success/20 border-success'
                  } border-2 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer`}>
                    <span className="text-xs font-bold text-foreground">
                      {node.name.slice(0, 1)}
                    </span>
                  </div>
                  
                  {/* Connection lines to center */}
                  <svg className="absolute inset-0 pointer-events-none" style={{
                    width: '400px',
                    height: '400px',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                  }}>
                    <line
                      x1="200"
                      y1="200"
                      x2={node.position.includes('left') ? '100' : node.position.includes('right') ? '300' : '200'}
                      y2={node.position.includes('top') ? '100' : node.position.includes('bottom') ? '300' : '200'}
                      stroke={`hsl(var(--${node.risk === 'critical' ? 'critical' : node.risk === 'high' || node.risk === 'medium' ? 'warning' : 'success'}))`}
                      strokeWidth="2"
                      strokeOpacity="0.6"
                      className={node.risk === 'critical' ? 'animate-pulse' : ''}
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
          
          {/* Risk Legend */}
          <div className="absolute bottom-4 left-4 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-critical rounded-full animate-critical-pulse" />
              <span className="text-xs text-muted-foreground">Critical Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-warning rounded-full" />
              <span className="text-xs text-muted-foreground">High/Medium Risk</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full" />
              <span className="text-xs text-muted-foreground">Low Risk</span>
            </div>
          </div>
          
          {/* Stats overlay */}
          <div className="absolute top-4 right-4 space-y-2">
            <Badge variant="secondary" className="font-cyber">
              Protocols: 127
            </Badge>
            <Badge variant="destructive" className="font-cyber animate-critical-pulse">
              At Risk: 4
            </Badge>
            <Badge variant="outline" className="font-cyber">
              Monitoring: ACTIVE
            </Badge>
          </div>
        </div>
        
        {/* Controls */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">View:</span>
            <Button variant="outline" size="sm">All Protocols</Button>
            <Button variant="outline" size="sm">Risk Only</Button>
            <Button variant="outline" size="sm">Connected</Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground font-cyber">Last Update:</span>
            <span className="text-sm text-success font-cyber">2s ago</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};