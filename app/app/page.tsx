export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* Header */}
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Learn Anything in Minutes
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            AI-powered personalized courses generated just for you.
            <br />
            Type what you want to learn, get a full course in seconds.
          </p>

          {/* CTA Input */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <input
              type="text"
              placeholder="I want to learn..."
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none mb-4"
            />
            <button className="w-full bg-indigo-600 text-white font-semibold py-4 px-8 rounded-lg hover:bg-indigo-700 transition">
              Generate My Course → $5
            </button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">⚡ Fast</h3>
              <p className="text-gray-600">Full course generated in under 60 seconds</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">🎯 Personalized</h3>
              <p className="text-gray-600">Tailored to your skill level and goals</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">💰 Affordable</h3>
              <p className="text-gray-600">$5 per course. No subscriptions.</p>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-12 text-gray-500 text-sm">
            Built with AI • Powered by Claude
          </p>
        </div>
      </div>
    </main>
  );
}
