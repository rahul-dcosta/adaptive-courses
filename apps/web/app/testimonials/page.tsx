export default function TestimonialsPage() {
  const testimonials = [
    {
      name: "Sarah Chen",
      title: "Product Manager at TechCorp",
      photo: null,
      quote: "I had a factory tour in 24 hours and knew nothing about manufacturing. Adaptive Courses gave me exactly what I needed - the right vocab, the right questions to ask, and enough context to not look clueless. Worth every penny.",
      rating: 5,
      topic: "Manufacturing Operations"
    },
    {
      name: "Mike Rodriguez",
      title: "Supply Chain Analyst",
      photo: null,
      quote: "I was switching careers from marketing to supply chain. The 'Ask good questions' goal was perfect - I learned enough to sound conversational in interviews without drowning in theory. Got the job!",
      rating: 5,
      topic: "Supply Chain Management"
    },
    {
      name: "Emma Watson",
      title: "Management Consultant",
      photo: null,
      quote: "The button-based questions felt like magic. It knew exactly what I needed without me having to explain my entire situation. 30 seconds later, I had a custom course. This is the future of learning.",
      rating: 5,
      topic: "Industrial Automation"
    },
    {
      name: "David Kim",
      title: "Engineering Manager",
      photo: null,
      quote: "I've tried Coursera, Udemy, even bootcamps. Nothing compares to this for speed and relevance. When you need to learn something fast for a specific reason, this is THE tool.",
      rating: 5,
      topic: "Lean Manufacturing"
    },
    {
      name: "Lisa Zhang",
      title: "Business Development",
      photo: null,
      quote: "Client meeting tomorrow, needed to understand their industry. Generated a course on pharmaceutical manufacturing during lunch. Closed the deal the next day. ROI = infinite.",
      rating: 5,
      topic: "Pharmaceutical Manufacturing"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h1>
          <p className="text-xl text-gray-600">
            Real results from professionals who needed to learn fast
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-lg p-6 flex flex-col">
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 mb-6 flex-1">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                  {testimonial.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.title}</p>
                  <p className="text-xs text-indigo-600 mt-1">📚 {testimonial.topic}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Join hundreds of professionals learning faster
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Your first course is $5. No subscription. No commitment.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="/"
              className="bg-indigo-600 text-white font-semibold px-8 py-4 rounded-lg hover:bg-indigo-700 transition text-lg"
            >
              Generate Your Course →
            </a>
            <a
              href="/sample"
              className="bg-gray-100 text-gray-700 font-semibold px-8 py-4 rounded-lg hover:bg-gray-200 transition text-lg"
            >
              See a Sample First
            </a>
          </div>
        </div>

        {/* Back */}
        <div className="mt-8 text-center">
          <a href="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
