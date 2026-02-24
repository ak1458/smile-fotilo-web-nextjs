#!/usr/bin/env node
/**
 * API Health Check Script
 * Run this to test all API endpoints
 * 
 * Usage: node scripts/monitoring/api-health-check.js
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const ENDPOINTS = [
  {
    name: 'Health Check',
    path: '/api/health',
    method: 'GET',
    expectedStatus: 200,
  },
  {
    name: 'SEO Content API',
    path: '/api/seo-content',
    method: 'POST',
    body: { business: 'Test Clinic', industry: 'Healthcare' },
    expectedStatus: 200,
  },
  {
    name: 'Brand Kit API',
    path: '/api/brand-kit',
    method: 'POST',
    body: { businessName: 'Test Business', industry: 'Retail' },
    expectedStatus: 200,
  },
  {
    name: 'Content Calendar API',
    path: '/api/content-calendar',
    method: 'POST',
    body: { businessName: 'Test Shop', industry: 'Food' },
    expectedStatus: 200,
  },
  {
    name: 'Audit API',
    path: '/api/audit',
    method: 'POST',
    body: { url: 'https://example.com' },
    expectedStatus: 200,
  },
  {
    name: 'Video Generate API',
    path: '/api/videos/generate',
    method: 'POST',
    body: { prompt: 'Dental clinic welcome video', template: 'clinic_welcome' },
    expectedStatus: 200,
  },
];

async function testEndpoint(endpoint) {
  const start = Date.now();
  try {
    const options = {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (endpoint.body) {
      options.body = JSON.stringify(endpoint.body);
    }

    const response = await fetch(`${BASE_URL}${endpoint.path}`, options);
    const duration = Date.now() - start;
    const data = await response.json().catch(() => null);

    const success = response.status === endpoint.expectedStatus;

    return {
      name: endpoint.name,
      success,
      status: response.status,
      duration,
      error: success ? null : `Expected ${endpoint.expectedStatus}, got ${response.status}`,
      rateLimitRemaining: response.headers.get('X-RateLimit-Remaining'),
    };
  } catch (error) {
    return {
      name: endpoint.name,
      success: false,
      status: 0,
      duration: Date.now() - start,
      error: error.message,
      rateLimitRemaining: null,
    };
  }
}

async function runHealthCheck() {
  console.log('🔍 API Health Check');
  console.log('==================');
  console.log(`Base URL: ${BASE_URL}\n`);

  const results = [];
  
  for (const endpoint of ENDPOINTS) {
    process.stdout.write(`Testing ${endpoint.name}... `);
    const result = await testEndpoint(endpoint);
    results.push(result);
    
    if (result.success) {
      console.log(`✅ ${result.duration}ms (Rate limit remaining: ${result.rateLimitRemaining || 'N/A'})`);
    } else {
      console.log(`❌ ${result.error}`);
    }
  }

  console.log('\n📊 Summary');
  console.log('==========');
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`Passed: ${passed}/${results.length}`);
  console.log(`Failed: ${failed}/${results.length}`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Endpoints:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.name}: ${r.error}`);
    });
    process.exit(1);
  } else {
    console.log('\n✅ All endpoints healthy!');
    process.exit(0);
  }
}

runHealthCheck();
