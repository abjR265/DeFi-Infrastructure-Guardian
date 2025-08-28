import { Header } from "@/components/Header";
import { StatsCards } from "@/components/StatsCards";
import { ProtocolRiskCards } from "@/components/ProtocolRiskCards";
import { ActivityFeed } from "@/components/ActivityFeed";
import { ThreatVisualization } from "@/components/ThreatVisualization";

export const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Stats Row */}
        <StatsCards />
        
        {/* Main Content - Vertical Stack */}
        <div className="flex flex-col gap-8">
          {/* Protocol Risk Assessment */}
          <div>
            <ProtocolRiskCards />
          </div>

          {/* Real-time Threat Visualization */}
          <div>
            <ThreatVisualization />
          </div>

          {/* Live Activity Feed */}
          <div>
            <ActivityFeed />
          </div>
        </div>
      </main>
    </div>
  );
};