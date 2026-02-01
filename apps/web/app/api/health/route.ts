import { NextResponse } from 'next/server';

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    checks: {
      anthropic: { status: 'unknown', message: 'Not tested in health check' },
      supabase: { status: 'unknown', message: 'Not tested in health check' },
      environment: { status: 'ok', message: 'Environment variables loaded' }
    }
  };

  // Check environment variables
  const requiredEnvVars = [
    'ANTHROPIC_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];

  const missingVars = requiredEnvVars.filter(v => !process.env[v]);
  if (missingVars.length > 0) {
    checks.checks.environment = {
      status: 'error',
      message: `Missing env vars: ${missingVars.join(', ')}`
    };
    checks.status = 'unhealthy';
  }

  // Quick Anthropic check (just verify key format)
  if (process.env.ANTHROPIC_API_KEY?.startsWith('sk-ant-')) {
    checks.checks.anthropic = { status: 'ok', message: 'API key format valid' };
  } else {
    checks.checks.anthropic = { status: 'error', message: 'Invalid API key format' };
    checks.status = 'degraded';
  }

  // Supabase URL check
  if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('.supabase.co')) {
    checks.checks.supabase = { status: 'ok', message: 'Supabase URL configured' };
  } else {
    checks.checks.supabase = { status: 'error', message: 'Invalid Supabase URL' };
    checks.status = 'degraded';
  }

  const statusCode = checks.status === 'healthy' ? 200 : 
                     checks.status === 'degraded' ? 200 : 503;

  return NextResponse.json(checks, { status: statusCode });
}
