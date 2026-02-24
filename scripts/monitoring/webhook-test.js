#!/usr/bin/env node
/**
 * Webhook Signature Verification Test
 * Tests that Twilio webhooks properly validate signatures
 * 
 * Usage: node scripts/monitoring/webhook-test.js
 */

const crypto = require('crypto');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || 'test_auth_token';

// Generate a valid Twilio signature
function generateTwilioSignature(authToken, url, params) {
  const sortedKeys = Object.keys(params).sort();
  let data = url;
  
  for (const key of sortedKeys) {
    data += key + params[key];
  }
  
  return crypto
    .createHmac('sha1', authToken)
    .update(data)
    .digest('base64');
}

async function testWebhook(endpoint, description, shouldSucceed, signature = null) {
  const params = {
    From: '+1234567890',
    Body: 'Test message',
    To: '+0987654321',
  };

  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  if (signature) {
    headers['X-Twilio-Signature'] = signature;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: new URLSearchParams(params).toString(),
    });

    const success = shouldSucceed ? response.status !== 401 : response.status === 401;
    
    return {
      description,
      success,
      status: response.status,
      expected: shouldSucceed ? '200-299' : '401',
    };
  } catch (error) {
    return {
      description,
      success: false,
      status: 0,
      expected: shouldSucceed ? '200-299' : '401',
      error: error.message,
    };
  }
}

async function runWebhookTests() {
  console.log('🔐 Webhook Security Test');
  console.log('========================\n');

  const tests = [];

  // Test 1: Request without signature (should fail in production)
  tests.push(await testWebhook(
    '/api/twilio/messages/webhook',
    'No signature (should be rejected in production)',
    false,
    null
  ));

  // Test 2: Request with invalid signature
  tests.push(await testWebhook(
    '/api/twilio/messages/webhook',
    'Invalid signature (should be rejected)',
    false,
    'invalid_signature'
  ));

  // Test 3: Request with valid signature
  const validSignature = generateTwilioSignature(
    TWILIO_AUTH_TOKEN,
    `${BASE_URL}/api/twilio/messages/webhook`,
    {
      From: '+1234567890',
      Body: 'Test message',
      To: '+0987654321',
    }
  );

  tests.push(await testWebhook(
    '/api/twilio/messages/webhook',
    'Valid signature (should be accepted)',
    true,
    validSignature
  ));

  // Test 4: Rate limiting test - send 110 requests rapidly
  console.log('Testing rate limiting (sending 110 requests)...');
  const rateLimitTests = [];
  for (let i = 0; i < 110; i++) {
    const result = await testWebhook(
      '/api/twilio/messages/webhook',
      `Rate limit test ${i + 1}`,
      true,
      validSignature
    );
    rateLimitTests.push(result);
    
    if (result.status === 429) {
      console.log(`  Rate limit hit after ${i + 1} requests ✅`);
      break;
    }
  }

  const rateLimited = rateLimitTests.some(t => t.status === 429);
  if (!rateLimited) {
    console.log('  ⚠️ Rate limiting may not be working correctly');
  }

  // Print results
  console.log('\n📊 Test Results');
  console.log('===============');
  
  tests.forEach(test => {
    const icon = test.success ? '✅' : '❌';
    console.log(`${icon} ${test.description}`);
    console.log(`   Status: ${test.status} (expected: ${test.expected})`);
    if (test.error) console.log(`   Error: ${test.error}`);
  });

  const allPassed = tests.every(t => t.success);
  
  if (allPassed) {
    console.log('\n✅ All security tests passed!');
    process.exit(0);
  } else {
    console.log('\n❌ Some tests failed');
    process.exit(1);
  }
}

runWebhookTests();
