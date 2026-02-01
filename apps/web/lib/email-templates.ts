export interface CourseEmailData {
  courseName: string;
  courseContent: any;
  userEmail: string;
  courseId: string;
}

export function generateCourseEmail(data: CourseEmailData): string {
  const { courseName, courseContent, courseId } = data;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ${courseName} Course</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 10px 10px 0 0;
      text-align: center;
    }
    .content {
      background: #ffffff;
      padding: 30px;
      border: 1px solid #e5e7eb;
      border-top: none;
    }
    .module {
      margin: 20px 0;
      padding: 20px;
      background: #f9fafb;
      border-left: 4px solid #667eea;
      border-radius: 4px;
    }
    .module-title {
      font-size: 18px;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 10px;
    }
    .lesson {
      margin: 15px 0;
      padding-left: 15px;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background: #667eea;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎓 Your Course is Ready!</h1>
    <p>${courseName}</p>
  </div>
  
  <div class="content">
    <p>Hi there! 👋</p>
    
    <p>Your personalized course is ready. Here's what we created for you:</p>
    
    ${courseContent.modules?.map((module: any, idx: number) => `
      <div class="module">
        <div class="module-title">Module ${idx + 1}: ${module.title}</div>
        ${module.lessons?.map((lesson: any) => `
          <div class="lesson">
            <strong>${lesson.title}</strong>
          </div>
        `).join('')}
      </div>
    `).join('')}
    
    <p><strong>Estimated Time:</strong> ${courseContent.estimated_time || '1-2 hours'}</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://adaptive-courses.vercel.app/course/${courseId}" class="button">
        View Full Course →
      </a>
    </div>
    
    <p><strong>What's Next?</strong></p>
    <ul>
      ${courseContent.next_steps?.map((step: string) => `<li>${step}</li>`).join('') || '<li>Start learning!</li>'}
    </ul>
    
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
    
    <p style="font-size: 14px; color: #6b7280;">
      Need help? Reply to this email or visit our <a href="https://adaptive-courses.vercel.app/faq">FAQ</a>.
    </p>
  </div>
  
  <div class="footer">
    <p>© 2026 Adaptive Courses - AI-powered personalized learning</p>
    <p>
      <a href="https://adaptive-courses.vercel.app/terms">Terms</a> · 
      <a href="https://adaptive-courses.vercel.app/privacy">Privacy</a>
    </p>
  </div>
</body>
</html>
  `.trim();
}

export function generateOTPEmail(code: string, email: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your verification code</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: #f9fafb;
    }
    .container {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: #003F87;
      color: white;
      padding: 24px;
      text-align: center;
    }
    .content {
      padding: 32px;
    }
    .code-box {
      background: #f3f4f6;
      border: 2px dashed #003F87;
      border-radius: 8px;
      padding: 24px;
      text-align: center;
      margin: 24px 0;
    }
    .code {
      font-size: 36px;
      font-weight: bold;
      letter-spacing: 8px;
      color: #003F87;
      font-family: 'Courier New', monospace;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #6b7280;
      font-size: 12px;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">Adaptive Courses</h1>
    </div>

    <div class="content">
      <h2 style="margin-top: 0;">Your verification code</h2>

      <p>Enter this code to verify your email address:</p>

      <div class="code-box">
        <div class="code">${code}</div>
      </div>

      <p style="color: #6b7280; font-size: 14px;">
        This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.
      </p>

      <p style="margin-bottom: 0;">
        Once verified, you'll get full access to your free course.
      </p>
    </div>

    <div class="footer">
      <p>© 2026 Adaptive Courses · Built with Claude</p>
      <p>This is an automated email. Please don't reply.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function generateMagicLinkEmail(magicLink: string, email: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in to Adaptive Courses</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background: #f9fafb;
    }
    .container {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: #003F87;
      color: white;
      padding: 24px;
      text-align: center;
    }
    .content {
      padding: 32px;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: #003F87;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
    }
    .button:hover {
      background: #002a5c;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #6b7280;
      font-size: 12px;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">Adaptive Courses</h1>
    </div>

    <div class="content">
      <h2 style="margin-top: 0;">Sign in to your account</h2>

      <p>Click the button below to sign in:</p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${magicLink}" class="button">
          Sign in to Adaptive Courses
        </a>
      </div>

      <p style="color: #6b7280; font-size: 14px;">
        This link expires in 15 minutes and can only be used once.
      </p>

      <p style="color: #6b7280; font-size: 14px;">
        If you didn't request this, you can safely ignore this email.
      </p>

      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

      <p style="font-size: 12px; color: #9ca3af;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <span style="word-break: break-all;">${magicLink}</span>
      </p>
    </div>

    <div class="footer">
      <p>© 2026 Adaptive Courses · Built with Claude</p>
      <p>This is an automated email. Please don't reply.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function generateWelcomeEmail(email: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to Adaptive Courses</title>
</head>
<body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px;">
    <h1>Welcome to Adaptive Courses! 🎉</h1>
  </div>
  
  <div style="padding: 30px; background: white; border: 1px solid #e5e7eb; margin-top: -1px;">
    <p>Hi there! 👋</p>
    
    <p>Thanks for joining Adaptive Courses. We're excited to help you learn faster and smarter.</p>
    
    <p><strong>What makes us different?</strong></p>
    <ul>
      <li>🎯 Courses tailored to your situation (not just skill level)</li>
      <li>⚡ Generated in 30 seconds by AI</li>
      <li>💰 Just $5 per course - no subscription</li>
    </ul>
    
    <p>Ready to create your first course?</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://adaptive-courses.vercel.app" style="display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 6px;">
        Generate My First Course →
      </a>
    </div>
    
    <p>Questions? Just reply to this email.</p>
    
    <p>Happy learning!<br>The Adaptive Courses Team</p>
  </div>
  
  <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
    <p>© 2026 Adaptive Courses</p>
  </div>
</body>
</html>
  `.trim();
}
