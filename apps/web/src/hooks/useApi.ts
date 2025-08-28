import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface ContractInfo {
  address: string;
  compiler: 'solidity' | 'vyper';
  version: string;
  protocol: string;
  tvl: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  chain: string;
  lastScanned: string;
}

export interface Vulnerability {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  affectedFunctions: string[];
}

export interface RiskAssessment {
  protocol: string;
  address: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  tvlAtRisk: number;
  vulnerabilities: Vulnerability[];
}

export interface DashboardData {
  contracts: ContractInfo[];
  riskAssessments: RiskAssessment[];
  summary: {
    totalContracts: number;
    totalProtocols: number;
    criticalVulnerabilities: number;
    totalTVL: number;
    tvlAtRisk: number;
  };
}

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async <T>(endpoint: string): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}${endpoint}`);
      const data: ApiResponse<T> = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'API request failed');
      }
      
      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('API Error:', errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getDashboardData = () => fetchData<DashboardData>('/api/scan/demo');
  const getHealth = () => fetchData<{ status: string; timestamp: string }>('/health');

  return {
    loading,
    error,
    fetchData,
    getDashboardData,
    getHealth,
  };
};
