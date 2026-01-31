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
