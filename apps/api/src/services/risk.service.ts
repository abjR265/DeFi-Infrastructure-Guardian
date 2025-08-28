import { ContractInfo, VulnerabilityRule } from './scanner.service';

export interface RiskScore {
  protocol: string;
  overallScore: number; // 0-100
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  vulnerabilities: VulnerabilityRule[];
  tvlAtRisk: number;
  lastUpdated: Date;
  recommendations: string[];
}

export interface ProtocolRisk {
  name: string;
  contracts: ContractInfo[];
  totalTVL: number;
  riskScore: RiskScore;
  status: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';
}

export class RiskAssessmentService {
  private vulnerabilityRules: VulnerabilityRule[] = [
    {
      id: 'vyper-0.2.15-reentrancy',
      compilerVersions: ['0.2.15', '0.2.16'],
      severity: 'CRITICAL',
      description: 'Vyper 0.2.15/0.2.16 reentrancy vulnerability (Curve Finance exploit)',
    },
    {
      id: 'vyper-0.3.0-issues',
      compilerVersions: ['0.3.0'],
      severity: 'HIGH',
      description: 'Vyper 0.3.0 known issues',
    },
    {
      id: 'solidity-reentrancy',
      compilerVersions: ['0.8.0', '0.8.1', '0.8.2'],
      severity: 'MEDIUM',
      description: 'Potential reentrancy vulnerabilities in older Solidity versions',
    }
  ];

  async assessProtocolRisk(contracts: ContractInfo[]): Promise<RiskScore> {
    if (contracts.length === 0) {
      throw new Error('No contracts provided for risk assessment');
    }

    const protocol = contracts[0].protocol;
    const totalTVL = contracts.reduce((sum, contract) => sum + contract.tvl, 0);
    
    // Calculate risk score based on vulnerabilities
    let riskScore = 0;
    const foundVulnerabilities: VulnerabilityRule[] = [];
    
    for (const contract of contracts) {
      const contractVulnerabilities = this.checkVulnerabilities(contract);
      foundVulnerabilities.push(...contractVulnerabilities);
      
      // Add to risk score based on severity
      for (const vuln of contractVulnerabilities) {
        switch (vuln.severity) {
          case 'CRITICAL':
            riskScore += 40;
            break;
          case 'HIGH':
            riskScore += 25;
            break;
          case 'MEDIUM':
            riskScore += 15;
            break;
          case 'LOW':
            riskScore += 5;
            break;
        }
      }
    }
    
    // Cap risk score at 100
    riskScore = Math.min(riskScore, 100);
    
    // Calculate TVL at risk (simplified - in reality would be more complex)
    const tvlAtRisk = this.calculateTVLAtRisk(contracts, foundVulnerabilities);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(foundVulnerabilities, totalTVL);
    
    return {
      protocol,
      overallScore: riskScore,
      riskLevel: this.scoreToRiskLevel(riskScore),
      vulnerabilities: foundVulnerabilities,
      tvlAtRisk,
      lastUpdated: new Date(),
      recommendations,
    };
  }

  private checkVulnerabilities(contract: ContractInfo): VulnerabilityRule[] {
    const found: VulnerabilityRule[] = [];
    
    for (const rule of this.vulnerabilityRules) {
      if (rule.compilerVersions.includes(contract.version)) {
        found.push(rule);
      }
    }
    
    return found;
  }

  private calculateTVLAtRisk(contracts: ContractInfo[], vulnerabilities: VulnerabilityRule[]): number {
    let tvlAtRisk = 0;
    
    // If there are critical vulnerabilities, consider all TVL at risk
    const hasCriticalVulns = vulnerabilities.some(v => v.severity === 'CRITICAL');
    
    if (hasCriticalVulns) {
      tvlAtRisk = contracts.reduce((sum, contract) => sum + contract.tvl, 0);
    } else {
      // For non-critical vulnerabilities, calculate based on severity
      for (const contract of contracts) {
        const contractVulns = this.checkVulnerabilities(contract);
        const maxSeverity = contractVulns.reduce((max, vuln) => {
          const severityScore = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 }[vuln.severity] || 0;
          return Math.max(max, severityScore);
        }, 0);
        
        // Risk percentage based on severity
        const riskPercentage = maxSeverity * 0.25; // 25% per severity level
        tvlAtRisk += contract.tvl * riskPercentage;
      }
    }
    
    return tvlAtRisk;
  }

  private generateRecommendations(vulnerabilities: VulnerabilityRule[], totalTVL: number): string[] {
    const recommendations: string[] = [];
    
    if (vulnerabilities.length === 0) {
      recommendations.push('No immediate vulnerabilities detected. Continue monitoring.');
      return recommendations;
    }
    
    const criticalVulns = vulnerabilities.filter(v => v.severity === 'CRITICAL');
    const highVulns = vulnerabilities.filter(v => v.severity === 'HIGH');
    
    if (criticalVulns.length > 0) {
      recommendations.push('🚨 IMMEDIATE ACTION REQUIRED: Critical vulnerabilities detected');
      recommendations.push('Consider emergency pause of affected contracts');
      recommendations.push('Deploy white hat bots to protect funds');
      recommendations.push('Contact protocol team immediately');
    }
    
    if (highVulns.length > 0) {
      recommendations.push('⚠️ HIGH PRIORITY: High severity vulnerabilities found');
      recommendations.push('Schedule urgent contract upgrades');
      recommendations.push('Increase monitoring frequency');
    }
    
    if (totalTVL > 10e6) { // $10M+
      recommendations.push('💰 High TVL at risk - prioritize mitigation');
    }
    
    recommendations.push('Implement continuous monitoring and alerting');
    recommendations.push('Consider insurance coverage for remaining risks');
    
    return recommendations;
  }

  private scoreToRiskLevel(score: number): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' {
    if (score >= 80) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 30) return 'MEDIUM';
    return 'LOW';
  }

  async calculateTotalTVLAtRisk(protocols: ProtocolRisk[]): Promise<number> {
    return protocols.reduce((total, protocol) => total + protocol.riskScore.tvlAtRisk, 0);
  }

  getVulnerabilityRules(): VulnerabilityRule[] {
    return this.vulnerabilityRules;
  }

  addVulnerabilityRule(rule: VulnerabilityRule): void {
    this.vulnerabilityRules.push(rule);
  }

  // Get risk statistics for dashboard
  getRiskStatistics(protocols: ProtocolRisk[]) {
    const stats = {
      totalProtocols: protocols.length,
      criticalRisk: protocols.filter(p => p.status === 'CRITICAL').length,
      highRisk: protocols.filter(p => p.status === 'HIGH').length,
      mediumRisk: protocols.filter(p => p.status === 'MEDIUM').length,
      lowRisk: protocols.filter(p => p.status === 'LOW').length,
      totalTVL: protocols.reduce((sum, p) => sum + p.totalTVL, 0),
      tvlAtRisk: protocols.reduce((sum, p) => sum + p.riskScore.tvlAtRisk, 0),
    };
    
    return {
      ...stats,
      riskPercentage: stats.totalTVL > 0 ? (stats.tvlAtRisk / stats.totalTVL) * 100 : 0,
    };
  }
}
