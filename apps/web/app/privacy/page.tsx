export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto prose prose-indigo">
        <h1>Privacy Policy</h1>
        <p className="text-gray-600">Last updated: January 31, 2026</p>

        <h2>1. Introduction</h2>
        <p>
          Adaptive Courses ("we," "our," or "us") respects your privacy and is committed to protecting your personal data.
          This Privacy Policy explains how we collect, use, and safeguard your information when you use our Service.
        </p>

        <h2>2. Information We Collect</h2>
        
        <h3>2.1 Information You Provide</h3>
        <ul>
          <li><strong>Email Address:</strong> Collected when you sign up or make a purchase</li>
          <li><strong>Course Topics:</strong> The subjects and learning goals you input</li>
          <li><strong>Payment Information:</strong> Processed by Stripe (we do not store card details)</li>
        </ul>

        <h3>2.2 Automatically Collected Information</h3>
        <ul>
          <li><strong>Usage Data:</strong> Pages visited, features used, time spent</li>
          <li><strong>Device Information:</strong> Browser type, IP address, operating system</li>
          <li><strong>Cookies:</strong> We use cookies for analytics and session management</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Generate your custom courses using AI</li>
          <li>Process payments via Stripe</li>
          <li>Send you your purchased courses via email</li>
          <li>Improve our Service based on usage patterns</li>
          <li>Communicate with you about your account or orders</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>4. Data Sharing</h2>
        <p>We share your information with:</p>
        
        <h3>4.1 Third-Party Services</h3>
        <ul>
          <li><strong>Anthropic (Claude AI):</strong> Course topics are sent to generate content</li>
          <li><strong>Stripe:</strong> Payment processing</li>
          <li><strong>Supabase:</strong> Database hosting</li>
          <li><strong>Vercel:</strong> Web hosting</li>
        </ul>

        <h3>4.2 We Do NOT:</h3>
        <ul>
          <li>Sell your personal data to third parties</li>
          <li>Share your email with marketers</li>
          <li>Use your course topics for any purpose other than generation</li>
        </ul>

        <h2>5. Data Retention</h2>
        <p>
          We retain your information for as long as your account is active or as needed to provide services.
          You may request deletion of your data at any time by emailing support@adaptive-courses.com.
        </p>

        <h3>5.1 What We Store</h3>
        <ul>
          <li>Your email address</li>
          <li>Course topics and generated content</li>
          <li>Purchase history</li>
          <li>Usage analytics (anonymized after 90 days)</li>
        </ul>

        <h2>6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li><strong>Access:</strong> Request a copy of your data</li>
          <li><strong>Correction:</strong> Update inaccurate information</li>
          <li><strong>Deletion:</strong> Request deletion of your account and data</li>
          <li><strong>Opt-Out:</strong> Unsubscribe from marketing emails (we don't send many!)</li>
          <li><strong>Data Portability:</strong> Download your courses in PDF format</li>
        </ul>

        <h2>7. Data Security</h2>
        <p>
          We use industry-standard security measures to protect your data:
        </p>
        <ul>
          <li>HTTPS encryption for all connections</li>
          <li>Secure database with row-level security (Supabase)</li>
          <li>PCI-compliant payment processing (Stripe)</li>
          <li>Regular security audits and updates</li>
        </ul>
        <p>
          However, no method of transmission over the Internet is 100% secure.
          We cannot guarantee absolute security.
        </p>

        <h2>8. Children's Privacy</h2>
        <p>
          Our Service is not intended for users under 13 years of age. We do not knowingly collect
          personal information from children under 13. If you become aware that a child has provided
          us with personal data, please contact us.
        </p>

        <h2>9. International Data Transfers</h2>
        <p>
          Your data may be transferred to and processed in the United States or other countries
          where our service providers operate. By using our Service, you consent to such transfers.
        </p>

        <h2>10. Cookies</h2>
        <p>We use cookies for:</p>
        <ul>
          <li>Session management (keeping you logged in)</li>
          <li>Analytics (Google Analytics or similar)</li>
          <li>Performance optimization</li>
        </ul>
        <p>
          You can control cookies through your browser settings, but this may affect functionality.
        </p>

        <h2>11. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes
          by posting the new Privacy Policy on this page and updating the "Last updated" date.
        </p>

        <h2>12. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy or want to exercise your rights, contact us:
        </p>
        <ul>
          <li>Email: support@adaptive-courses.com</li>
          <li>Response time: Within 48 hours</li>
        </ul>

        <hr className="my-8" />
        
        <p className="text-sm text-gray-500">
          By using Adaptive Courses, you acknowledge that you have read and understood this Privacy Policy.
        </p>
      </div>
    </div>
  );
}
