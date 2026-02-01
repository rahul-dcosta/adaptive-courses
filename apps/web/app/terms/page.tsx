export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto prose prose-indigo">
        <h1>Terms of Service</h1>
        <p className="text-gray-600">Last updated: January 31, 2026</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using Adaptive Courses ("the Service"), you agree to be bound by these Terms of Service.
          If you do not agree to these terms, do not use the Service.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          Adaptive Courses is an AI-powered educational platform that generates personalized learning courses
          based on user input. We use Claude AI (Anthropic) to create custom curricula tailored to your learning needs.
        </p>

        <h2>3. Pricing and Payment</h2>
        <p>
          Courses are sold on a pay-per-course basis at $5 USD per course (or as otherwise displayed at checkout).
          Payment is processed through Stripe. All sales are final, except as outlined in our Refund Policy.
        </p>

        <h3>3.1 Refund Policy</h3>
        <p>
          If you are not satisfied with your course, you may request a refund within 24 hours of purchase
          by emailing support@adaptive-courses.com with your order details. Refunds are granted at our discretion.
        </p>

        <h2>4. User Responsibilities</h2>
        <p>You agree to:</p>
        <ul>
          <li>Provide accurate information when using the Service</li>
          <li>Not misuse or abuse the Service (e.g., excessive API calls, attempting to reverse-engineer)</li>
          <li>Not resell or redistribute generated courses without permission</li>
          <li>Use the Service in compliance with all applicable laws</li>
        </ul>

        <h2>5. Content Ownership</h2>
        <p>
          <strong>Your Input:</strong> You retain all rights to the topics and information you provide to the Service.
        </p>
        <p>
          <strong>Generated Courses:</strong> Once you purchase a course, you own that specific course content
          and may use it for personal, educational, or commercial purposes. You may not resell the Service itself
          or create derivative products based on our platform.
        </p>

        <h2>6. AI-Generated Content Disclaimer</h2>
        <p>
          Courses are generated using AI (Claude by Anthropic). While we strive for accuracy and quality:
        </p>
        <ul>
          <li>Content may contain errors or inaccuracies</li>
          <li>We do not guarantee completeness or suitability for any specific purpose</li>
          <li>You should verify important information independently</li>
          <li>We are not liable for decisions made based on course content</li>
        </ul>

        <h2>7. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Adaptive Courses shall not be liable for any indirect,
          incidental, special, consequential, or punitive damages, or any loss of profits or revenues,
          whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
        </p>

        <h2>8. Changes to Service</h2>
        <p>
          We reserve the right to modify or discontinue the Service at any time, with or without notice.
          We will not be liable to you or any third party for any modification, suspension, or discontinuation.
        </p>

        <h2>9. Privacy</h2>
        <p>
          Your use of the Service is also governed by our <a href="/privacy">Privacy Policy</a>.
        </p>

        <h2>10. Governing Law</h2>
        <p>
          These Terms shall be governed by the laws of the State of Michigan, United States,
          without regard to its conflict of law provisions.
        </p>

        <h2>11. Contact</h2>
        <p>
          For questions about these Terms, please contact us at:
          <br />
          Email: support@adaptive-courses.com
        </p>

        <hr className="my-8" />
        
        <p className="text-sm text-gray-500">
          By using Adaptive Courses, you acknowledge that you have read, understood, and agree to be bound
          by these Terms of Service.
        </p>
      </div>
    </div>
  );
}
