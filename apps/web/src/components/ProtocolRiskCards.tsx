import { ExternalLink, AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useApi, DashboardData } from "@/hooks/useApi";
import { useEffect, useState } from "react";

interface ProtocolData {
  name: string;
  pool: string;
  vyperVersion: string;
  tvl: number;
  riskLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "vulnerable" | "secure" | "investigating";
  lastScan: string;
  logo?: string;
}

const ProtocolCard = ({ protocol }: { protocol: ProtocolData }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case "CRITICAL": return "critical";
      case "HIGH": return "warning";
      case "MEDIUM": return "warning";
      case "LOW": return "success";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "vulnerable": return <XCircle className="h-4 w-4 text-critical" />;
      case "secure": return <CheckCircle className="h-4 w-4 text-success" />;
      case "investigating": return <Clock className="h-4 w-4 text-warning" />;
      default: return null;
    }
  };

  const formatTVL = (tvl: number) => {
    return `$${(tvl / 1000000).toFixed(1)}M`;
  };

  const shouldPulse = protocol.riskLevel === "CRITICAL";

  return (
    <Card className={`cyber-card hover:scale-105 transition-all duration-300 cursor-pointer ${
      shouldPulse ? 'animate-critical-pulse border-critical/50' : ''
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-sm">
                {protocol.name.charAt(0)}
              </span>
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                {protocol.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{protocol.pool}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Risk Level and Status */}
        <div className="flex items-center justify-between">
          <Badge 
            variant={getRiskColor(protocol.riskLevel) as any}
            className={`font-bold ${shouldPulse ? 'animate-critical-pulse' : ''}`}
          >
            {protocol.riskLevel}
          </Badge>
          <div className="flex items-center space-x-1">
            {getStatusIcon(protocol.status)}
            <span className="text-sm text-muted-foreground capitalize">
              {protocol.status}
            </span>
          </div>
        </div>

        {/* TVL */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total Value Locked</span>
            <span className="text-sm font-bold text-foreground">
              {formatTVL(protocol.tvl)}
            </span>
          </div>
        </div>

        {/* Compiler Version */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Compiler Version</span>
            <Badge 
              variant={protocol.vyperVersion === "0.2.15" ? "destructive" : "secondary"}
              className="font-cyber text-xs"
            >
              {protocol.vyperVersion}
            </Badge>
          </div>
        </div>

        {/* Last Scan */}
        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Last scan</span>
            <span className="text-xs text-muted-foreground font-cyber">
              {protocol.lastScan}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const ProtocolRiskCards = () => {
  const { getDashboardData, loading, error } = useApi();
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getDashboardData();
      if (result) {
        setData(result);
      }
    };

    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [getDashboardData]);

  const convertToProtocolData = (data: DashboardData): ProtocolData[] => {
    return data.riskAssessments.map(assessment => {
      // Find the corresponding contract for this assessment
      const contract = data.contracts.find(c => c.address === assessment.address);
      
      return {
        name: assessment.protocol,
        pool: assessment.address.slice(0, 8) + '...',
        vyperVersion: contract ? `${contract.compiler} ${contract.version}` : 'N/A',
        tvl: assessment.tvlAtRisk > 0 ? assessment.tvlAtRisk : (contract?.tvl || 0),
        riskLevel: assessment.riskLevel,
        status: assessment.riskLevel === 'CRITICAL' ? 'vulnerable' : 
                assessment.riskLevel === 'HIGH' ? 'investigating' : 'secure',
        lastScan: new Date().toLocaleTimeString(),
      };
    });
  };

  if (loading && !data) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-critical" />
            <span>Protocol Risk Assessment</span>
          </h2>
          <Button variant="outline" size="sm" disabled>
            Loading...
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="cyber-card animate-pulse">
              <CardContent className="p-6">
                <div className="h-40 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-critical" />
            <span>Protocol Risk Assessment</span>
          </h2>
        </div>
        <Card className="cyber-card">
          <CardContent className="p-6">
            <div className="text-center text-critical">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
              <p>Failed to load protocol data</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const protocols = data ? convertToProtocolData(data) : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-critical" />
          <span>Protocol Risk Assessment</span>
        </h2>
        <Button variant="outline" size="sm">
          View All Protocols
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {protocols.length > 0 ? (
          protocols.map((protocol, index) => (
            <ProtocolCard key={index} protocol={protocol} />
          ))
        ) : (
          <Card className="cyber-card col-span-full">
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                <p>No protocols found</p>
                <p className="text-sm">Add contracts to start monitoring</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};