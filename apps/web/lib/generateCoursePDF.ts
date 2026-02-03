import jsPDF from 'jspdf';
import mermaid from 'mermaid';

// Types
interface Lesson {
  title: string;
  content: string;
  quiz?: {
    question: string;
    answer?: string;
  };
}

interface Module {
  title: string;
  description?: string;
  lessons?: Lesson[];
}

interface Course {
  id?: string;
  title: string;
  description?: string;
  estimated_time?: string;
  modules: Module[];
  next_steps?: string[];
  topic?: string;
}

// Colors (Royal Blue theme)
const ROYAL_BLUE: [number, number, number] = [0, 63, 135];
const ROYAL_BLUE_LIGHT: [number, number, number] = [0, 86, 179];
const GRAY_900: [number, number, number] = [17, 24, 39];
const GRAY_600: [number, number, number] = [75, 85, 99];
const GRAY_100: [number, number, number] = [243, 244, 246];

// Page settings
const PAGE_WIDTH = 210; // A4 width in mm
const PAGE_HEIGHT = 297; // A4 height in mm
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);

// Helper to parse mermaid diagrams from content
function parseContent(content: string): Array<{ type: 'text' | 'mermaid'; content: string }> {
  const parts: Array<{ type: 'text' | 'mermaid'; content: string }> = [];
  const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = mermaidRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const textContent = content.substring(lastIndex, match.index);
      if (textContent.trim()) {
        parts.push({ type: 'text', content: textContent });
      }
    }
    parts.push({ type: 'mermaid', content: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    const remaining = content.substring(lastIndex);
    if (remaining.trim()) {
      parts.push({ type: 'text', content: remaining });
    }
  }

  if (parts.length === 0) {
    parts.push({ type: 'text', content });
  }

  return parts;
}

// Strip markdown formatting for plain text
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Bold
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1') // Italic
    .replace(/_([^_]+)_/g, '$1')
    .replace(/`([^`]+)`/g, '$1') // Code
    .replace(/^#{1,6}\s+/gm, '') // Headers
    .replace(/^[\-\*]\s+/gm, '• ') // Bullet points
    .replace(/^\d+\.\s+/gm, (match) => match) // Keep numbered lists
    .trim();
}

// Initialize mermaid for server-side rendering
async function initMermaid() {
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
    fontFamily: 'Arial, sans-serif',
  });
}

// Render mermaid diagram to SVG data URL
async function renderMermaidToDataURL(chart: string, id: string): Promise<string | null> {
  try {
    const { svg } = await mermaid.render(id, chart);
    // Convert SVG to data URL
    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(svgBlob);
    });
  } catch (error) {
    console.error('Mermaid render error:', error);
    return null;
  }
}

// Main PDF generation function
export async function generateCoursePDF(course: Course): Promise<void> {
  // Initialize mermaid
  await initMermaid();

  // Create PDF
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  let y = MARGIN;
  let mermaidCounter = 0;

  // Helper: Add new page if needed
  const checkPageBreak = (neededSpace: number) => {
    if (y + neededSpace > PAGE_HEIGHT - MARGIN) {
      doc.addPage();
      y = MARGIN;
      return true;
    }
    return false;
  };

  // Helper: Add text with word wrap
  const addWrappedText = (text: string, fontSize: number, color: [number, number, number], maxWidth: number, lineHeight: number = 1.4) => {
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, maxWidth);
    const totalHeight = lines.length * fontSize * lineHeight * 0.35;
    checkPageBreak(totalHeight);
    doc.text(lines, MARGIN, y);
    y += totalHeight;
  };

  // ===== HEADER =====
  // Royal blue header bar
  doc.setFillColor(...ROYAL_BLUE);
  doc.rect(0, 0, PAGE_WIDTH, 35, 'F');

  // Logo text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('ADAPTIVE COURSES', MARGIN, 15);

  // Course title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(course.title, CONTENT_WIDTH);
  doc.text(titleLines, MARGIN, 28);

  y = 45;

  // Estimated time
  if (course.estimated_time) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GRAY_600);
    doc.text(`Estimated time: ${course.estimated_time}`, MARGIN, y);
    y += 8;
  }

  // Course description
  if (course.description) {
    y += 5;
    addWrappedText(course.description, 11, GRAY_600, CONTENT_WIDTH);
    y += 5;
  }

  // Divider
  y += 5;
  doc.setDrawColor(...GRAY_100);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 10;

  // ===== MODULES & LESSONS =====
  for (let modIdx = 0; modIdx < course.modules.length; modIdx++) {
    const module = course.modules[modIdx];

    // Module header
    checkPageBreak(25);

    // Module number badge
    doc.setFillColor(...ROYAL_BLUE);
    doc.roundedRect(MARGIN, y - 5, 25, 10, 2, 2, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`Module ${modIdx + 1}`, MARGIN + 2.5, y + 2);

    // Module title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...GRAY_900);
    y += 12;
    const modTitleLines = doc.splitTextToSize(module.title, CONTENT_WIDTH - 30);
    doc.text(modTitleLines, MARGIN, y);
    y += modTitleLines.length * 6 + 3;

    // Module description
    if (module.description) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(...GRAY_600);
      const descLines = doc.splitTextToSize(module.description, CONTENT_WIDTH);
      doc.text(descLines, MARGIN, y);
      y += descLines.length * 4 + 5;
    }

    // Lessons
    if (module.lessons) {
      for (let lesIdx = 0; lesIdx < module.lessons.length; lesIdx++) {
        const lesson = module.lessons[lesIdx];

        checkPageBreak(20);

        // Lesson title
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...ROYAL_BLUE_LIGHT);
        y += 5;
        doc.text(`${modIdx + 1}.${lesIdx + 1} ${lesson.title}`, MARGIN, y);
        y += 8;

        // Parse and render lesson content
        const parts = parseContent(lesson.content);

        for (const part of parts) {
          if (part.type === 'text') {
            // Render text content
            const cleanText = stripMarkdown(part.content);
            const paragraphs = cleanText.split(/\n\n+/).filter(p => p.trim());

            for (const para of paragraphs) {
              doc.setFontSize(10);
              doc.setFont('helvetica', 'normal');
              doc.setTextColor(...GRAY_900);

              const lines = doc.splitTextToSize(para.trim(), CONTENT_WIDTH);
              const paraHeight = lines.length * 4.5;
              checkPageBreak(paraHeight + 5);
              doc.text(lines, MARGIN, y);
              y += paraHeight + 3;
            }
          } else if (part.type === 'mermaid') {
            // Render mermaid diagram
            checkPageBreak(60);

            const diagramId = `pdf-mermaid-${mermaidCounter++}`;
            const dataUrl = await renderMermaidToDataURL(part.content, diagramId);

            if (dataUrl) {
              try {
                // Add diagram with fixed dimensions
                const imgWidth = Math.min(CONTENT_WIDTH - 20, 120);
                const imgHeight = 50;
                const imgX = MARGIN + (CONTENT_WIDTH - imgWidth) / 2;

                doc.addImage(dataUrl, 'SVG', imgX, y, imgWidth, imgHeight);
                y += imgHeight + 10;
              } catch (imgError) {
                // Fallback: show placeholder
                doc.setFillColor(...GRAY_100);
                doc.roundedRect(MARGIN + 10, y, CONTENT_WIDTH - 20, 30, 2, 2, 'F');
                doc.setFontSize(9);
                doc.setTextColor(...GRAY_600);
                doc.text('[Diagram - view online for interactive version]', MARGIN + 20, y + 17);
                y += 35;
              }
            } else {
              // Mermaid render failed
              doc.setFillColor(...GRAY_100);
              doc.roundedRect(MARGIN + 10, y, CONTENT_WIDTH - 20, 20, 2, 2, 'F');
              doc.setFontSize(9);
              doc.setTextColor(...GRAY_600);
              doc.text('[Diagram]', MARGIN + 20, y + 12);
              y += 25;
            }
          }
        }

        // Quiz section
        if (lesson.quiz) {
          checkPageBreak(35);

          // Quiz box
          const quizStartY = y;
          doc.setFillColor(248, 250, 252); // slate-50
          doc.setDrawColor(...ROYAL_BLUE);
          doc.setLineWidth(0.3);

          // Calculate quiz height
          doc.setFontSize(10);
          const qLines = doc.splitTextToSize(`Q: ${lesson.quiz.question}`, CONTENT_WIDTH - 16);
          const aLines = lesson.quiz.answer ? doc.splitTextToSize(`A: ${lesson.quiz.answer}`, CONTENT_WIDTH - 16) : [];
          const quizHeight = 15 + (qLines.length * 4) + (aLines.length * 4);

          doc.roundedRect(MARGIN, y, CONTENT_WIDTH, quizHeight, 2, 2, 'FD');

          // Quiz header
          y += 6;
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...ROYAL_BLUE);
          doc.text('Quick Check', MARGIN + 5, y);
          y += 6;

          // Question
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...GRAY_900);
          doc.text(qLines, MARGIN + 5, y);
          y += qLines.length * 4 + 3;

          // Answer
          if (lesson.quiz.answer) {
            doc.setTextColor(...GRAY_600);
            doc.text(aLines, MARGIN + 5, y);
            y += aLines.length * 4;
          }

          y = quizStartY + quizHeight + 8;
        }

        y += 5;
      }
    }

    // Add space between modules (or page break for cleaner layout)
    if (modIdx < course.modules.length - 1) {
      if (y > PAGE_HEIGHT - 80) {
        doc.addPage();
        y = MARGIN;
      } else {
        y += 15;
        doc.setDrawColor(...GRAY_100);
        doc.setLineWidth(0.3);
        doc.line(MARGIN + 30, y, PAGE_WIDTH - MARGIN - 30, y);
        y += 15;
      }
    }
  }

  // ===== NEXT STEPS =====
  if (course.next_steps && course.next_steps.length > 0) {
    checkPageBreak(50);

    y += 10;

    // Next steps header
    doc.setFillColor(...ROYAL_BLUE);
    doc.roundedRect(MARGIN, y - 5, CONTENT_WIDTH, 12, 2, 2, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('NEXT STEPS', MARGIN + 5, y + 3);
    y += 15;

    // Steps list
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...GRAY_900);

    course.next_steps.forEach((step, idx) => {
      checkPageBreak(10);
      const stepLines = doc.splitTextToSize(`${idx + 1}. ${step}`, CONTENT_WIDTH - 10);
      doc.text(stepLines, MARGIN + 5, y);
      y += stepLines.length * 4.5 + 2;
    });
  }

  // ===== FOOTER =====
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...GRAY_600);
    doc.text(
      `Page ${i} of ${pageCount} • Generated by Adaptive Courses • adaptivecourses.ai`,
      PAGE_WIDTH / 2,
      PAGE_HEIGHT - 10,
      { align: 'center' }
    );
  }

  // Generate filename from course title
  const filename = `${course.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.pdf`;

  // Download
  doc.save(filename);
}
