import { Request, Response } from 'express';
import { ethers } from 'ethers';
import { ContractScannerService } from '../services/scanner.service';
import { RiskAssessmentService } from '../services/risk.service';
import { WebSocketService } from '../services/websocket.service';

interface ContractInfo {
  address: string;
  compiler: 'solidity' | 'vyper';
  version: string;
  protocol: string;
  tvl: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  chain: string;
  lastScanned: Date;
}

export class ScannerController {
  private scannerService: ContractScannerService;
  private riskService: RiskAssessmentService;
  private wsService: WebSocketService;

  constructor(wsService: WebSocketService) {
    const rpcUrl = process.env.ETHEREUM_RPC_URL || 'https://eth-mainnet.alchemyapi.io/v2/demo';
    this.scannerService = new ContractScannerService(rpcUrl);
    this.riskService = new RiskAssessmentService();
    this.wsService = wsService;
  }

  // GET /api/scan/contract/:address
  async scanContract(req: Request, res: Response) {
    try {
      const { address } = req.params;
      const { protocol } = req.query;

      if (!ethers.isAddress(address)) {
        return res.status(400).json({ error: 'Invalid Ethereum address' });
      }

      const contractInfo = await this.scannerService.scanContract(
        address, 
        protocol as string || 'Unknown'
      );

      res.json({
        success: true,
        data: contractInfo
      });
    } catch (error) {
      console.error('Error scanning contract:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // POST /api/scan/bulk
  async bulkScan(req: Request, res: Response) {
    try {
      const { contracts } = req.body;

      if (!Array.isArray(contracts)) {
        return res.status(400).json({ error: 'Contracts must be an array' });
      }

      const addresses = contracts.map(c => c.address);
      const protocols = contracts.map(c => c.protocol || 'Unknown');

      const results = await this.scannerService.bulkScan(addresses, protocols);

      res.json({
        success: true,
        data: results,
        summary: {
          total: results.length,
          critical: results.filter(r => r.riskLevel === 'CRITICAL').length,
          high: results.filter(r => r.riskLevel === 'HIGH').length,
          medium: results.filter(r => r.riskLevel === 'MEDIUM').length,
          low: results.filter(r => r.riskLevel === 'LOW').length,
        }
      });
    } catch (error) {
      console.error('Error in bulk scan:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/vulnerabilities
  async getVulnerabilities(req: Request, res: Response) {
    try {
      const vulnerabilities = this.scannerService.getVulnerabilityRules();
      
      res.json({
        success: true,
        data: vulnerabilities
      });
    } catch (error) {
      console.error('Error getting vulnerabilities:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // POST /api/risk/assess
  async assessRisk(req: Request, res: Response) {
    try {
      const { contracts } = req.body;

      if (!Array.isArray(contracts)) {
        return res.status(400).json({ error: 'Contracts must be an array' });
      }

      const riskScore = await this.riskService.assessProtocolRisk(contracts);

      res.json({
        success: true,
        data: riskScore
      });
    } catch (error) {
      console.error('Error assessing risk:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // GET /api/scan/demo
  async demoScan(req: Request, res: Response) {
    try {
      console.log('🚀 Starting demo scan...');
      
      // Mock data to avoid RPC rate limits
      const mockContracts: ContractInfo[] = [
        // Real contracts with realistic Solidity versions
        {
          address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
          compiler: 'solidity',
          version: '0.8.19',
          protocol: 'Curve Finance',
          tvl: 24.7e6,
          riskLevel: 'LOW',
          chain: 'ethereum',
          lastScanned: new Date()
        },
        {
          address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', // LINK
          compiler: 'solidity',
          version: '0.8.21',
          protocol: 'Chainlink',
          tvl: 1e6,
          riskLevel: 'LOW',
          chain: 'ethereum',
          lastScanned: new Date()
        },
        {
          address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', // AAVE
          compiler: 'solidity',
          version: '0.8.23',
          protocol: 'Aave',
          tvl: 15.3e6,
          riskLevel: 'LOW',
          chain: 'ethereum',
          lastScanned: new Date()
        },
        {
          address: '0xBA12222222228d8Ba445958a75a0704d566BF2C8', // BAL
          compiler: 'solidity',
          version: '0.8.25',
          protocol: 'Balancer',
          tvl: 12.5e6,
          riskLevel: 'LOW',
          chain: 'ethereum',
          lastScanned: new Date()
        },
        {
          address: '0xc00e94Cb662C3520282E6f5717214004A7f26888', // COMP
          compiler: 'solidity',
          version: '0.8.24',
          protocol: 'Compound',
          tvl: 8.9e6,
          riskLevel: 'LOW',
          chain: 'ethereum',
          lastScanned: new Date()
        },
        // Mock vulnerable Vyper contracts
        {
          address: '0x1234567890123456789012345678901234567890',
          compiler: 'vyper',
          version: '0.2.15',
          protocol: 'Vulnerable Protocol 1',
          tvl: 15.2e6,
          riskLevel: 'CRITICAL',
          chain: 'ethereum',
          lastScanned: new Date()
        },
        {
          address: '0x2345678901234567890123456789012345678901',
          compiler: 'vyper',
          version: '0.2.16',
          protocol: 'Vulnerable Protocol 2',
          tvl: 8.7e6,
          riskLevel: 'CRITICAL',
          chain: 'ethereum',
          lastScanned: new Date()
        },
        {
          address: '0x3456789012345678901234567890123456789012',
          compiler: 'vyper',
          version: '0.3.0',
          protocol: 'Vulnerable Protocol 3',
          tvl: 12.3e6,
          riskLevel: 'HIGH',
          chain: 'ethereum',
          lastScanned: new Date()
        }
      ];

      // Simulate scanning delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Emit real-time updates
      this.wsService.emitScanComplete(mockContracts, {
        totalContracts: mockContracts.length,
        completedAt: new Date()
      });

      // Generate risk assessments
      const riskAssessments = mockContracts.map(contract => ({
        protocol: contract.protocol,
        address: contract.address,
        riskLevel: contract.riskLevel,
        tvlAtRisk: contract.riskLevel === 'CRITICAL' ? contract.tvl : 
                   contract.riskLevel === 'HIGH' ? contract.tvl * 0.5 : 0,
        vulnerabilities: contract.riskLevel !== 'LOW' ? [
          {
            id: `${contract.compiler}-${contract.version}-vulnerability`,
            severity: contract.riskLevel,
            description: `${contract.compiler} ${contract.version} known vulnerability`,
            affectedFunctions: ['withdraw', 'deposit', 'swap']
          }
        ] : []
      }));

      // Calculate summary
      const summary = {
        totalContracts: mockContracts.length,
        totalProtocols: new Set(mockContracts.map(c => c.protocol)).size,
        criticalVulnerabilities: mockContracts.filter(c => c.riskLevel === 'CRITICAL').length,
        totalTVL: mockContracts.reduce((sum, c) => sum + c.tvl, 0),
        tvlAtRisk: riskAssessments.reduce((sum, r) => sum + r.tvlAtRisk, 0)
      };

      // Emit risk updates for each protocol
      riskAssessments.forEach(assessment => {
        if (assessment.riskLevel !== 'LOW') {
          this.wsService.emitRiskUpdate(
            assessment.protocol,
            'LOW', // Assume previous risk was LOW
            assessment.riskLevel,
            assessment.tvlAtRisk
          );
        }
      });

      console.log('✅ Demo scan completed successfully');
      console.log(`📊 Found ${summary.criticalVulnerabilities} critical vulnerabilities`);
      console.log(`💰 TVL at risk: $${(summary.tvlAtRisk / 1e6).toFixed(1)}M`);

      res.json({
        success: true,
        data: {
          contracts: mockContracts,
          riskAssessments,
          summary
        }
      });
    } catch (error) {
      console.error('❌ Demo scan failed:', error);
      res.status(500).json({
        success: false,
        error: 'Demo scan failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
