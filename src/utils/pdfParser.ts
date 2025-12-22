import { Question } from '@/types/question';

/**
 * Extracts text content from a PDF file using the browser's FileReader
 * This is a simplified version that works without the pdf.js worker
 */
export async function parsePDFToQuestions(file: File): Promise<Question[]> {
  try {
    // Dynamic import to avoid loading issues
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set up the worker from CDN
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    const pages: string[] = [];
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ');
      pages.push(pageText);
    }
    
    const questions = parseQuestionsFromText(pages);
    
    // Renumber questions sequentially
    return questions.map((q, index) => ({
      ...q,
      id: index + 1
    }));
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('No se pudo procesar el archivo PDF. Verifica que sea un PDF válido con texto seleccionable.');
  }
}

/**
 * Parses questions from extracted PDF text
 */
function parseQuestionsFromText(pages: string[]): Question[] {
  const fullText = pages.join('\n');
  const questions: Question[] = [];
  
  // Pattern to match questions
  const questionPatterns = [
    /(?:^|\n)\s*(\d+)\s*[.)\-:]\s*(.+?)(?=\n\s*[A-Ea-e][.)\-:]|\n\s*\d+\s*[.)\-:]|$)/gs,
    /(?:^|\n)\s*Pregunta\s*(\d+)\s*[.:\-]?\s*(.+?)(?=\n\s*[A-Ea-e][.)\-:]|$)/gis
  ];
  
  // Pattern to match options
  const optionPattern = /([A-Ea-e])\s*[.)\-:]\s*([^\n]+)/g;
  
  let matches: RegExpExecArray | null;
  const questionBlocks: { id: number; text: string; startIndex: number }[] = [];
  
  for (const pattern of questionPatterns) {
    pattern.lastIndex = 0;
    while ((matches = pattern.exec(fullText)) !== null) {
      questionBlocks.push({
        id: parseInt(matches[1]),
        text: matches[2].trim(),
        startIndex: matches.index
      });
    }
  }
  
  // Sort by position and remove duplicates
  questionBlocks.sort((a, b) => a.startIndex - b.startIndex);
  const uniqueQuestions = questionBlocks.filter((q, index, self) => 
    index === self.findIndex(t => t.id === q.id)
  );
  
  // For each question, find its options
  for (let i = 0; i < uniqueQuestions.length; i++) {
    const current = uniqueQuestions[i];
    const nextStart = uniqueQuestions[i + 1]?.startIndex || fullText.length;
    const questionSection = fullText.slice(current.startIndex, nextStart);
    
    const options: { id: string; text: string }[] = [];
    let optionMatches: RegExpExecArray | null;
    optionPattern.lastIndex = 0;
    
    while ((optionMatches = optionPattern.exec(questionSection)) !== null) {
      options.push({
        id: optionMatches[1].toUpperCase(),
        text: optionMatches[2].trim()
      });
    }
    
    if (options.length >= 2) {
      questions.push({
        id: current.id,
        text: current.text,
        options: options,
        correctOptionId: detectCorrectAnswer(questionSection) || options[0].id
      });
    }
  }
  
  return questions;
}

/**
 * Attempts to detect the correct answer from text patterns
 */
function detectCorrectAnswer(text: string): string | null {
  const answerPatterns = [
    /(?:respuesta|correcta|answer|correct)\s*[:\-]?\s*([A-Ea-e])/i,
    /\*\s*([A-Ea-e])\s*[.)\-:]/,
    /([A-Ea-e])\s*\*\s*[.)\-:]/,
    /\[([A-Ea-e])\]/,
    /✓\s*([A-Ea-e])/,
  ];
  
  for (const pattern of answerPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].toUpperCase();
    }
  }
  
  const endPattern = /(?:^|\n)\s*([A-Ea-e])\s*$/m;
  const endMatch = text.match(endPattern);
  if (endMatch) {
    return endMatch[1].toUpperCase();
  }
  
  return null;
}
