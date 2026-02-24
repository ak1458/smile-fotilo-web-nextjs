#!/usr/bin/env node
/**
 * Log Analyzer
 * Analyzes application logs for security issues
 * 
 * Usage: node scripts/monitoring/log-analyzer.js [logfile]
 * Or pipe logs: cat app.log | node scripts/monitoring/log-analyzer.js
 */

const fs = require('fs');
const readline = require('readline');

// Security patterns to watch for
const SECURITY_PATTERNS = [
  {
    pattern: /rate limit exceeded/i,
    severity: 'warning',
    description: 'Rate limiting triggered - possible abuse',
  },
  {
    pattern: /invalid signature/i,
    severity: 'warning',
    description: 'Webhook signature validation failed - possible spoofing attempt',
  },
  {
    pattern: /prompt injection/i,
    severity: 'critical',
    description: 'Prompt injection attempt detected',
  },
  {
    pattern: /invalid input detected/i,
    severity: 'warning',
    description: 'Input validation rejected suspicious content',
  },
  {
    pattern: /unauthorized/i,
    severity: 'warning',
    description: 'Unauthorized access attempt',
  },
  {
    pattern: /error.*api.*key/i,
    severity: 'error',
    description: 'API key related error',
  },
  {
    pattern: /timeout/i,
    severity: 'warning',
    description: 'Request timeout - possible DoS',
  },
  {
    pattern: /too many requests/i,
    severity: 'warning',
    description: 'Client exceeded rate limit',
  },
  {
    pattern: /sql injection/i,
    severity: 'critical',
    description: 'SQL injection attempt detected',
  },
  {
    pattern: /xss|cross.site.scripting/i,
    severity: 'critical',
    description: 'XSS attempt detected',
  },
];

// Statistics
const stats = {
  totalLines: 0,
  matches: [],
  bySeverity: {
    critical: 0,
    error: 0,
    warning: 0,
    info: 0,
  },
  byPattern: {},
};

function analyzeLine(line) {
  stats.totalLines++;
  
  for (const rule of SECURITY_PATTERNS) {
    if (rule.pattern.test(line)) {
      stats.matches.push({
        line: stats.totalLines,
        content: line.trim(),
        ...rule,
      });
      
      stats.bySeverity[rule.severity]++;
      stats.byPattern[rule.description] = (stats.byPattern[rule.description] || 0) + 1;
    }
  }
}

function printReport() {
  console.log('🔍 Security Log Analysis Report');
  console.log('================================\n');
  
  console.log(`Total lines analyzed: ${stats.totalLines}`);
  console.log(`Security events found: ${stats.matches.length}\n`);
  
  // Severity summary
  console.log('📊 Severity Distribution');
  console.log('------------------------');
  Object.entries(stats.bySeverity).forEach(([severity, count]) => {
    if (count > 0) {
      const icon = severity === 'critical' ? '🔴' : severity === 'error' ? '❌' : severity === 'warning' ? '⚠️' : 'ℹ️';
      console.log(`${icon} ${severity.toUpperCase()}: ${count}`);
    }
  });
  
  // Pattern summary
  if (Object.keys(stats.byPattern).length > 0) {
    console.log('\n📋 Event Types');
    console.log('--------------');
    Object.entries(stats.byPattern)
      .sort(([, a], [, b]) => b - a)
      .forEach(([desc, count]) => {
        console.log(`  ${count}x - ${desc}`);
      });
  }
  
  // Recent critical events
  const criticalEvents = stats.matches.filter(m => m.severity === 'critical');
  if (criticalEvents.length > 0) {
    console.log('\n🔴 Critical Events (Recent)');
    console.log('---------------------------');
    criticalEvents.slice(-5).forEach(event => {
      console.log(`\nLine ${event.line}: ${event.description}`);
      console.log(`  ${event.content.substring(0, 100)}...`);
    });
  }
  
  // Recommendations
  console.log('\n💡 Recommendations');
  console.log('------------------');
  
  if (stats.bySeverity.critical > 0) {
    console.log('🔴 CRITICAL: Immediate action required. Review critical events above.');
  }
  if (stats.bySeverity.error > 0) {
    console.log('❌ ERRORS: Check API keys and service configurations.');
  }
  if (stats.bySeverity.warning > 10) {
    console.log('⚠️ High volume of warnings. Consider tightening security rules.');
  }
  if (stats.matches.length === 0) {
    console.log('✅ No security events detected. Logs look clean!');
  }
  
  // Exit with error code if critical issues found
  if (stats.bySeverity.critical > 0) {
    process.exit(1);
  }
}

async function analyzeFile(filename) {
  const stream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: stream,
    crlfDelay: Infinity,
  });
  
  for await (const line of rl) {
    analyzeLine(line);
  }
  
  printReport();
}

async function analyzeStdin() {
  const rl = readline.createInterface({
    input: process.stdin,
    crlfDelay: Infinity,
  });
  
  for await (const line of rl) {
    analyzeLine(line);
  }
  
  printReport();
}

// Main
const filename = process.argv[2];

if (filename) {
  if (!fs.existsSync(filename)) {
    console.error(`Error: File not found: ${filename}`);
    process.exit(1);
  }
  analyzeFile(filename);
} else {
  // Check if stdin has data
  if (process.stdin.isTTY) {
    console.log('Usage: node log-analyzer.js [logfile]');
    console.log('   or: cat logfile | node log-analyzer.js');
    process.exit(0);
  }
  analyzeStdin();
}
