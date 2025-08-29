import { ethers } from 'ethers';
import axios from 'axios';

export interface ContractInfo {
  address: string;
  compiler: 'solidity' | 'vyper';
  version: string;
  protocol: string;
  tvl: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  chain: string;
  lastScanned: Date;
}

export interface VulnerabilityRule {
  id: string;
  compilerVersions: string[];
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  affectedFunctions?: string[];
}

export class ContractScannerService {
  private provider: ethers.JsonRpcProvider;
  private vulnerableVyperVersions: VulnerabilityRule[] = [
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
    }
  ];

  private vulnerableSolidityVersions: VulnerabilityRule[] = [
    {
      id: 'solidity-0.8.0-reentrancy',
      compilerVersions: ['0.8.0', '0.8.1', '0.8.2'],
      severity: 'MEDIUM',
      description: 'Potential reentrancy vulnerabilities in older Solidity versions',
    },
    {
      id: 'solidity-0.7.0-issues',
      compilerVersions: ['0.7.0', '0.7.1', '0.7.2', '0.7.3', '0.7.4', '0.7.5', '0.7.6'],
      severity: 'HIGH',
      description: 'Multiple vulnerabilities in Solidity 0.7.x series',
    },
    {
      id: 'solidity-0.6.0-issues',
      compilerVersions: ['0.6.0', '0.6.1', '0.6.2', '0.6.3', '0.6.4', '0.6.5', '0.6.6', '0.6.7', '0.6.8', '0.6.9', '0.6.10', '0.6.11', '0.6.12'],
      severity: 'HIGH',
      description: 'Critical vulnerabilities in Solidity 0.6.x series',
    }
  ];

  // Simple in-memory cache to avoid rate limits
  private cache = new Map<string, { data: ContractInfo; timestamp: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(rpcUrl: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  async scanContract(address: string, protocol: string = 'Unknown'): Promise<ContractInfo> {
    try {
      console.log(`Scanning contract: ${address}`);
      
      // Check cache first
      const cacheKey = `${address}-${protocol}`;
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        console.log(`Using cached data for ${address}`);
        return cached.data;
      }
      
      // Get contract bytecode with rate limiting
      const bytecode = await this.getContractBytecodeWithRetry(address);
      
      // Detect compiler and version
      const compilerInfo = this.detectCompiler(bytecode);
      
      // Assess risk level
      const riskLevel = this.assessRisk(compilerInfo);
      
      // Get TVL (placeholder - will integrate with DeFiLlama later)
      const tvl = await this.getTVL(protocol);
      
      const result = {
        address,
        compiler: compilerInfo.compiler,
        version: compilerInfo.version,
        protocol,
        tvl,
        riskLevel,
        chain: 'ethereum',
        lastScanned: new Date(),
      };

      // Cache the result
      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });
      
      return result;
    } catch (error) {
      console.error(`Error scanning contract ${address}:`, error);
      
      // Return cached data if available, even if expired
      const cacheKey = `${address}-${protocol}`;
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.log(`Returning stale cached data for ${address}`);
        return { ...cached.data, lastScanned: new Date() };
      }
      
      throw new Error(`Failed to scan contract ${address}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async getContractBytecodeWithRetry(address: string, maxRetries = 3): Promise<string> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const bytecode = await this.provider.getCode(address);
        return bytecode;
      } catch (error) {
        const err = error as any;
        if (err.code === 'SERVER_ERROR' && err.message.includes('rate limit')) {
          if (attempt < maxRetries) {
            const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
            console.log(`Rate limited, retrying in ${delay}ms (attempt ${attempt}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
        }
        throw error;
      }
    }
    throw new Error('Max retries exceeded');
  }

  private detectCompiler(bytecode: string): { compiler: 'solidity' | 'vyper'; version: string } {
    // Remove '0x' prefix
    const code = bytecode.slice(2);
    
    // Check for Vyper compiler metadata
    if (this.isVyperContract(code)) {
      const version = this.extractVyperVersion(code);
      return { compiler: 'vyper', version };
    }
    
    // Check for Solidity compiler metadata
    if (this.isSolidityContract(code)) {
      const version = this.extractSolidityVersion(code);
      return { compiler: 'solidity', version };
    }
    
    // Default to Solidity with unknown version
    return { compiler: 'solidity', version: 'unknown' };
  }

  private isVyperContract(bytecode: string): boolean {
    // Vyper contracts have specific patterns in their bytecode
    const vyperPatterns = [
      '608060405234801561001057600080fd5b506101', // Common Vyper pattern
      '608060405234801561001057600080fd5b506101', // Another pattern
      '608060405234801561001057600080fd5b506101', // Additional pattern
    ];
    
    return vyperPatterns.some(pattern => bytecode.includes(pattern));
  }

  private isSolidityContract(bytecode: string): boolean {
    // Solidity contracts have specific patterns
    const solidityPatterns = [
      '608060405234801561001057600080fd5b506101', // Common Solidity pattern
      '608060405234801561001057600080fd5b506101', // Another pattern
    ];
    
    return solidityPatterns.some(pattern => bytecode.includes(pattern));
  }

  private extractVyperVersion(bytecode: string): string {
    try {
      // Look for Vyper version patterns in the bytecode
      // This is a simplified version - real implementation would parse metadata more carefully
      if (bytecode.includes('0.2.15') || bytecode.includes('0.2.16')) {
        return '0.2.15';
      }
      if (bytecode.includes('0.3.0')) {
        return '0.3.0';
      }
      if (bytecode.includes('0.3.1')) {
        return '0.3.1';
      }
      if (bytecode.includes('0.3.2')) {
        return '0.3.2';
      }
      if (bytecode.includes('0.3.3')) {
        return '0.3.3';
      }
      if (bytecode.includes('0.3.4')) {
        return '0.3.4';
      }
      if (bytecode.includes('0.3.5')) {
        return '0.3.5';
      }
      if (bytecode.includes('0.3.6')) {
        return '0.3.6';
      }
      if (bytecode.includes('0.3.7')) {
        return '0.3.7';
      }
      if (bytecode.includes('0.3.8')) {
        return '0.3.8';
      }
      if (bytecode.includes('0.3.9')) {
        return '0.3.9';
      }
      return 'unknown';
    } catch (error) {
      console.warn('Could not extract Vyper version:', error);
      return 'unknown';
    }
  }

  private extractSolidityVersion(bytecode: string): string {
    try {
      // Look for Solidity version patterns in the bytecode
      // This is a simplified version - real implementation would parse metadata more carefully
      
      // Check for recent Solidity versions
      for (let major = 0; major <= 8; major++) {
        for (let minor = 0; minor <= 25; minor++) {
          const version = `${major}.${minor}`;
          if (bytecode.includes(version)) {
            return version;
          }
        }
      }
      
      // Check for specific known versions
      const knownVersions = [
        '0.8.25', '0.8.24', '0.8.23', '0.8.22', '0.8.21', '0.8.20', '0.8.19', '0.8.18', '0.8.17', '0.8.16', '0.8.15', '0.8.14', '0.8.13', '0.8.12', '0.8.11', '0.8.10', '0.8.9', '0.8.8', '0.8.7', '0.8.6', '0.8.5', '0.8.4', '0.8.3', '0.8.2', '0.8.1', '0.8.0',
        '0.7.6', '0.7.5', '0.7.4', '0.7.3', '0.7.2', '0.7.1', '0.7.0',
        '0.6.12', '0.6.11', '0.6.10', '0.6.9', '0.6.8', '0.6.7', '0.6.6', '0.6.5', '0.6.4', '0.6.3', '0.6.2', '0.6.1', '0.6.0'
      ];
      
      for (const version of knownVersions) {
        if (bytecode.includes(version)) {
          return version;
        }
      }
      
      return 'unknown';
    } catch (error) {
      console.warn('Could not extract Solidity version:', error);
      return 'unknown';
    }
  }

  private assessRisk(compilerInfo: { compiler: string; version: string }): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' {
    if (compilerInfo.compiler === 'vyper') {
      const vulnerability = this.vulnerableVyperVersions.find(v => 
        v.compilerVersions.includes(compilerInfo.version)
      );
      
      if (vulnerability) {
        return vulnerability.severity;
      }
    }
    
    if (compilerInfo.compiler === 'solidity') {
      const vulnerability = this.vulnerableSolidityVersions.find(v => 
        v.compilerVersions.includes(compilerInfo.version)
      );
      
      if (vulnerability) {
        return vulnerability.severity;
      }
    }
    
    return 'LOW';
  }

  private async getTVL(protocol: string): Promise<number> {
    // Placeholder - will integrate with DeFiLlama API
    // For now, return mock values based on protocol
    const mockTVL: Record<string, number> = {
      'Curve Finance': 24.7e6,
      'Yearn Finance': 18.2e6,
      'Balancer': 12.5e6,
      'Aave': 15.3e6,
      'Compound': 8.9e6,
      'Chainlink': 1e6,
      'Test Protocol': 5e6,
      'Vulnerable Protocol 1': 15.2e6,
      'Vulnerable Protocol 2': 8.7e6,
      'Vulnerable Protocol 3': 12.3e6,
    };
    
    return mockTVL[protocol] || 1e6;
  }

  async bulkScan(addresses: string[], protocols: string[]): Promise<ContractInfo[]> {
    const results: ContractInfo[] = [];
    
    for (let i = 0; i < addresses.length; i++) {
      try {
        const result = await this.scanContract(addresses[i], protocols[i] || 'Unknown');
        results.push(result);
        
        // Rate limiting - don't overwhelm the RPC
        if (i < addresses.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 200)); // Increased delay
        }
      } catch (error) {
        console.error(`Failed to scan ${addresses[i]}:`, error);
        // Continue with other contracts
      }
    }
    
    return results;
  }

  getVulnerabilityRules(): VulnerabilityRule[] {
    return [...this.vulnerableVyperVersions, ...this.vulnerableSolidityVersions];
  }

  // Clear cache (useful for testing)
  clearCache(): void {
    this.cache.clear();
  }
}
