export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Adaptive Courses
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <h2>The Problem We Solve</h2>
            <p>
              You have a factory tour tomorrow. You Google "manufacturing basics" and get 47 tabs,
              3-hour YouTube documentaries, and generic courses that teach you everything.
            </p>
            <p>
              But you don't need everything. You need <strong>just enough</strong> to ask smart
              questions and not look clueless.
            </p>

            <h2>The Insight</h2>
            <p>
              Traditional courses ask: "What's your skill level?"
            </p>
            <p>
              But that's the <strong>wrong question</strong>.
            </p>
            <p>
              Learning for a job interview is different than learning out of curiosity.
              Learning when you have 24 hours is different than when you have a week.
            </p>
            <p>
              <strong>The right question:</strong> "What's the situation?"
            </p>

            <h2>How It Works</h2>
            <p>
              Adaptive Courses asks 3 quick questions (buttons, not typing):
            </p>
            <ol>
              <li><strong>What's the situation?</strong> (Factory visit, job interview, career switch, curiosity)</li>
              <li><strong>When do you need this?</strong> (Tomorrow, this week, no rush)</li>
              <li><strong>What's the goal?</strong> (Sound smart, ask questions, actually understand)</li>
            </ol>
            <p>
              Then Claude AI generates a custom course in 30 seconds. Modules. Lessons. Quizzes.
              Everything tailored to YOUR context.
            </p>

            <h2>Why $5?</h2>
            <p>
              We wanted it cheap enough to be an impulse buy, but expensive enough that we can
              keep improving the product. $5 is less than a coffee, but gets you a personalized
              curriculum that would take hours to research yourself.
            </p>

            <h2>The Team</h2>
            <p>
              Built by Rahul D'Costa, a forward deployed engineer who needed to learn
              manufacturing basics for a factory tour in 24 hours. Existing solutions were
              too slow, too generic, or too expensive.
            </p>
            <p>
              So he built this. With Claude as his AI co-founder.
            </p>

            <h2>The Vision</h2>
            <p>
              We're not building a course platform. We're building emergency learning for
              professionals.
            </p>
            <p>
              Every day, thousands of people need to learn something fast for a specific reason.
              They don't have time for 10-hour courses. They need exactly what they need, right now.
            </p>
            <p>
              That's what we built.
            </p>

            <h2>What's Next</h2>
            <ul>
              <li>Spaced repetition quizzes (so you actually remember)</li>
              <li>Multi-language support</li>
              <li>Voice narration</li>
              <li>Course templates for popular topics</li>
              <li>Community-shared courses</li>
            </ul>

            <h2>Get In Touch</h2>
            <p>
              Questions? Ideas? Want to partner?
              <br />
              Email us: <a href="mailto:hello@adaptive-courses.com" className="text-indigo-600 hover:text-indigo-700">hello@adaptive-courses.com</a>
            </p>
            <p>
              Follow our journey:
              <br />
              <a href="https://twitter.com/adaptivecourses" className="text-indigo-600 hover:text-indigo-700">Twitter</a>
              {' · '}
              <a href="https://linkedin.com/company/adaptive-courses" className="text-indigo-600 hover:text-indigo-700">LinkedIn</a>
            </p>
          </div>

          <div className="mt-12 flex gap-4 flex-wrap justify-center">
            <a
              href="/"
              className="bg-indigo-600 text-white font-semibold px-8 py-4 rounded-lg hover:bg-indigo-700 transition"
            >
              Generate Your Course →
            </a>
            <a
              href="/sample"
              className="bg-gray-100 text-gray-700 font-semibold px-8 py-4 rounded-lg hover:bg-gray-200 transition"
            >
              See a Sample First
            </a>
          </div>

          <div className="mt-8 text-center">
            <a href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
