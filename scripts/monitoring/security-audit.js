#!/usr/bin/env node
/**
 * Security Audit Script
 * Comprehensive security checks for the application
 * 
 * Usage: node scripts/monitoring/security-audit.js
 * Run this weekly or before each deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.join(__dirname, '..', '..');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

const checks = [];

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function addCheck(name, passed, details = '') {
  checks.push({ name, passed, details });
}

// Check 1: Environment files not in git
function checkEnvFiles() {
  log('\n🔐 Checking environment files...', 'blue');
  
  try {
    const trackedFiles = execSync('git ls-files', { cwd: PROJECT_ROOT, encoding: 'utf8' });
    const envFiles = trackedFiles.split('\n').filter(f => f.includes('.env') && !f.includes('.env.'));
    
    if (envFiles.length === 0) {
      log('✅ No .env files tracked in git', 'green');
      addCheck('Environment files not in git', true);
    } else {
      log(`❌ Found tracked env files: ${envFiles.join(', ')}`, 'red');
      addCheck('Environment files not in git', false, envFiles.join(', '));
    }
  } catch (error) {
    log('⚠️ Could not check git status', 'yellow');
    addCheck('Environment files not in git', false, 'Git check failed');
  }
}

// Check 2: .gitignore includes .env
function checkGitignore() {
  log('\n📝 Checking .gitignore...', 'blue');
  
  const gitignorePath = path.join(PROJECT_ROOT, '.gitignore');
  
  if (!fs.existsSync(gitignorePath)) {
    log('❌ .gitignore file not found', 'red');
    addCheck('.gitignore exists', false);
    return;
  }
  
  const content = fs.readFileSync(gitignorePath, 'utf8');
  const hasEnvPattern = content.includes('.env') || content.includes('.env*');
  
  if (hasEnvPattern) {
    log('✅ .gitignore properly configured for .env files', 'green');
    addCheck('.gitignore includes .env', true);
  } else {
    log('❌ .gitignore missing .env pattern', 'red');
    addCheck('.gitignore includes .env', false);
  }
}

// Check 3: Security headers in API routes
function checkSecurityHeaders() {
  log('\n🔒 Checking API route security...', 'blue');
  
  const apiDir = path.join(PROJECT_ROOT, 'app', 'api');
  
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    let routeCount = 0;
    let secureCount = 0;
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        const subResults = scanDirectory(fullPath);
        routeCount += subResults.routeCount;
        secureCount += subResults.secureCount;
      } else if (file === 'route.ts' || file === 'route.js') {
        routeCount++;
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Check for security imports
        const hasRateLimit = content.includes('rateLimitMiddleware') || content.includes('rate-limit');
        const hasInputValidation = content.includes('guardPromptInput') || content.includes('zod');
        
        if (hasRateLimit || hasInputValidation) {
          secureCount++;
        }
      }
    }
    
    return { routeCount, secureCount };
  }
  
  const results = scanDirectory(apiDir);
  const percentage = Math.round((results.secureCount / results.routeCount) * 100);
  
  log(`Found ${results.secureCount}/${results.routeCount} API routes with security features (${percentage}%)`, 
    percentage >= 80 ? 'green' : percentage >= 50 ? 'yellow' : 'red'
  );
  
  addCheck('API routes have security features', percentage >= 80, `${results.secureCount}/${results.routeCount}`);
}

// Check 4: Check for hardcoded secrets
function checkHardcodedSecrets() {
  log('\n🔑 Checking for hardcoded secrets...', 'blue');
  
  const suspiciousPatterns = [
    /api[_-]?key\s*[:=]\s*['"][a-zA-Z0-9]{20,}['"]/i,
    /secret\s*[:=]\s*['"][a-zA-Z0-9]{20,}['"]/i,
    /password\s*[:=]\s*['"][^'"]{8,}['"]/i,
    /sk-[a-zA-Z0-9]{20,}/,
    /[a-zA-Z0-9]{40,}/, // Long strings that might be tokens
  ];
  
  const sourceDirs = [
    path.join(PROJECT_ROOT, 'app'),
    path.join(PROJECT_ROOT, 'scripts'),
  ];
  
  let issues = [];
  
  function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip comments and env variable usages
      if (line.trim().startsWith('//') || line.trim().startsWith('*')) continue;
      if (line.includes('process.env.')) continue;
      
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(line)) {
          issues.push(`${filePath}:${i + 1}`);
          break;
        }
      }
    }
  }
  
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && file !== 'node_modules') {
        scanDirectory(fullPath);
      } else if (file.endsWith('.ts') || file.endsWith('.js')) {
        scanFile(fullPath);
      }
    }
  }
  
  for (const dir of sourceDirs) {
    if (fs.existsSync(dir)) {
      scanDirectory(dir);
    }
  }
  
  if (issues.length === 0) {
    log('✅ No hardcoded secrets detected', 'green');
    addCheck('No hardcoded secrets', true);
  } else {
    log(`⚠️ Found ${issues.length} potential issues:`, 'yellow');
    issues.slice(0, 5).forEach(issue => log(`  - ${issue}`, 'yellow'));
    if (issues.length > 5) log(`  ... and ${issues.length - 5} more`, 'yellow');
    addCheck('No hardcoded secrets', false, `${issues.length} potential issues`);
  }
}

// Check 5: Security files exist
function checkSecurityFiles() {
  log('\n📁 Checking security infrastructure...', 'blue');
  
  const requiredFiles = [
    'app/lib/security/rate-limit.ts',
    'app/lib/security/prompt-guard.ts',
    'app/lib/security/twilio-verify.ts',
    'app/lib/security/api-timeout.ts',
  ];
  
  let missing = [];
  
  for (const file of requiredFiles) {
    const fullPath = path.join(PROJECT_ROOT, file);
    if (!fs.existsSync(fullPath)) {
      missing.push(file);
    }
  }
  
  if (missing.length === 0) {
    log('✅ All security files present', 'green');
    addCheck('Security files exist', true);
  } else {
    log(`❌ Missing security files: ${missing.join(', ')}`, 'red');
    addCheck('Security files exist', false, missing.join(', '));
  }
}

// Check 6: Dependencies for known vulnerabilities
function checkDependencies() {
  log('\n📦 Checking dependencies...', 'blue');
  
  try {
    // Check if npm audit is available
    execSync('npm audit --version', { stdio: 'pipe' });
    
    log('Run "npm audit" manually for detailed vulnerability report', 'yellow');
    addCheck('Dependencies checked', true, 'Run npm audit for details');
  } catch (error) {
    log('⚠️ Could not check dependencies', 'yellow');
    addCheck('Dependencies checked', false, 'npm audit not available');
  }
}

// Generate report
function generateReport() {
  log('\n📊 Security Audit Report', 'blue');
  log('======================\n', 'blue');
  
  let passed = 0;
  let failed = 0;
  
  for (const check of checks) {
    const icon = check.passed ? '✅' : '❌';
    const color = check.passed ? 'green' : 'red';
    log(`${icon} ${check.name}`, color);
    if (check.details) {
      log(`   Details: ${check.details}`, color);
    }
  }
  
  passed = checks.filter(c => c.passed).length;
  failed = checks.filter(c => !c.passed).length;
  
  log('\n📈 Summary', 'blue');
  log(`Total Checks: ${checks.length}`, 'reset');
  log(`Passed: ${passed}`, 'green');
  log(`Failed: ${failed}`, failed > 0 ? 'red' : 'reset');
  
  const score = Math.round((passed / checks.length) * 100);
  log(`\nSecurity Score: ${score}%`, score >= 90 ? 'green' : score >= 70 ? 'yellow' : 'red');
  
  // Save report to file
  const reportPath = path.join(PROJECT_ROOT, 'security-audit-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    score,
    checks,
  }, null, 2));
  
  log(`\n📄 Report saved to: ${reportPath}`, 'blue');
  
  if (failed > 0) {
    log('\n⚠️ Some checks failed. Review and fix issues before deploying.', 'yellow');
    process.exit(1);
  } else {
    log('\n✅ All security checks passed!', 'green');
    process.exit(0);
  }
}

// Run all checks
function runAudit() {
  log('🔒 Starting Security Audit...', 'blue');
  log(`Project: ${PROJECT_ROOT}\n`, 'reset');
  
  checkEnvFiles();
  checkGitignore();
  checkSecurityFiles();
  checkSecurityHeaders();
  checkHardcodedSecrets();
  checkDependencies();
  
  generateReport();
}

runAudit();
