'use client';

import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [health, setHealth] = useState<any>(null);
  const [apiTest, setApiTest] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealth(data);
    } catch (error) {
      setHealth({ status: 'error', message: String(error) });
    }
  };

  const testAPI = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/test-api');
      const data = await res.json();
      setApiTest(data);
    } catch (error) {
      setApiTest({ success: false, error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">System Debug</h1>

        {/* Health Check */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Health Check</h2>
            <button
              onClick={checkHealth}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              Refresh
            </button>
          </div>
          
          {health ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  health.status === 'healthy' ? 'bg-green-500' :
                  health.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <span className="font-medium">{health.status.toUpperCase()}</span>
                <span className="text-sm text-gray-500">{health.timestamp}</span>
              </div>
              
              <div className="border-t pt-3">
                {Object.entries(health.checks || {}).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex justify-between py-2">
                    <span className="font-medium">{key}</span>
                    <span className={`text-sm ${
                      value.status === 'ok' ? 'text-green-600' :
                      value.status === 'error' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {value.status}: {value.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Loading...</p>
          )}
        </div>

        {/* API Test */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Test</h2>
          
          <button
            onClick={testAPI}
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-gray-400 mb-4"
          >
            {loading ? 'Testing...' : 'Test Claude API'}
          </button>
          
          {apiTest && (
            <div className="bg-gray-50 rounded p-4 mt-4">
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(apiTest, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Environment Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Environment</h2>
          <div className="space-y-2 text-sm font-mono">
            <div className="flex justify-between">
              <span>Node.js</span>
              <span className="text-gray-600">{process.version || 'Unknown'}</span>
            </div>
            <div className="flex justify-between">
              <span>Environment</span>
              <span className="text-gray-600">{process.env.NODE_ENV || 'development'}</span>
            </div>
            <div className="flex justify-between">
              <span>Anthropic Key</span>
              <span className="text-gray-600">
                {process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY ? '✓ Set (client)' : 
                 process.env.ANTHROPIC_API_KEY ? '✓ Set (server)' : '✗ Not set'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Supabase URL</span>
              <span className="text-gray-600">
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✓ Set' : '✗ Not set'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex gap-4">
          <a
            href="/"
            className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            ← Back to Home
          </a>
          <a
            href="/sample"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            View Sample Course
          </a>
        </div>
      </div>
    </div>
  );
}
