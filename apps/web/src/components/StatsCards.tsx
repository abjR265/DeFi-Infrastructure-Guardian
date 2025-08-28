import { AlertTriangle, DollarSign, Bot, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useApi, DashboardData } from "@/hooks/useApi";
import { useEffect, useState } from "react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  variant?: "default" | "critical" | "success" | "warning";
  animation?: boolean;
}

const StatCard = ({ title, value, subtitle, icon, trend, variant = "default", animation = false }: StatCardProps) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "critical":
        return "border-critical/50 bg-gradient-critical/10 hover:shadow-critical";
      case "success":
        return "border-success/50 bg-gradient-success/10 hover:shadow-glow";
      case "warning":
        return "border-warning/50 bg-warning/10";
      default:
        return "border-primary/30 bg-gradient-primary/10 hover:shadow-glow";
    }
  };

  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-success" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-critical" />;
    return null;
  };

  return (
    <Card className={`cyber-card ${getVariantClasses()} ${animation ? 'animate-float' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg bg-background/20 ${animation ? 'animate-critical-pulse' : ''}`}>
              {icon}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <div className="flex items-center space-x-2">
                <p className={`text-2xl font-bold counter-animate ${
                  variant === 'critical' ? 'text-critical' : 
                  variant === 'success' ? 'text-success' : 
                  'text-foreground'
                }`}>
                  {value}
                </p>
                {getTrendIcon()}
              </div>
              {subtitle && (
                <p className="text-xs text-muted-foreground font-cyber">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const StatsCards = () => {
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

  if (loading && !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="cyber-card animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="API Error"
          value="!"
          subtitle="Failed to load data"
          icon={<AlertTriangle className="h-6 w-6 text-critical" />}
          variant="critical"
        />
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(1)}K`;
    return `$${amount.toFixed(0)}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Critical Vulnerabilities"
        value={data?.summary.criticalVulnerabilities.toString() || "0"}
        subtitle="Real-time detection"
        icon={<AlertTriangle className="h-6 w-6 text-critical" />}
        variant="critical"
        animation={data?.summary.criticalVulnerabilities > 0}
      />
      
      <StatCard
        title="TVL at Risk"
        value={data ? formatCurrency(data.summary.tvlAtRisk) : "$0"}
        subtitle={`Across ${data?.summary.totalProtocols || 0} protocols`}
        icon={<DollarSign className="h-6 w-6 text-warning" />}
        variant="warning"
        trend={data?.summary.tvlAtRisk > 0 ? "up" : "neutral"}
      />
      
      <StatCard
        title="Active White Hats"
        value="3"
        subtitle="Online & monitoring"
        icon={<Bot className="h-6 w-6 text-success" />}
        variant="success"
        trend="neutral"
      />
      
      <StatCard
        title="Total TVL Monitored"
        value={data ? formatCurrency(data.summary.totalTVL) : "$0"}
        subtitle={`${data?.summary.totalContracts || 0} contracts`}
        icon={<TrendingUp className="h-6 w-6 text-primary" />}
        variant="default"
        trend="neutral"
      />
    </div>
  );
};