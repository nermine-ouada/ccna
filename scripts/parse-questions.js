const fs = require("fs");
const path = require("path");

// Function to decode HTML entities
function decodeHtmlEntities(text) {
  if (!text) return text;
  return text
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…")
    .replace(/&eacute;/g, "é")
    .replace(/&egrave;/g, "è")
    .replace(/&ecirc;/g, "ê")
    .replace(/&agrave;/g, "à")
    .replace(/&acirc;/g, "â")
    .replace(/&ocirc;/g, "ô")
    .replace(/&icirc;/g, "î")
    .replace(/&ucirc;/g, "û")
    .replace(/&ccedil;/g, "ç")
    .replace(/&#39;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#160;/g, " ");
}

// Read the HTML file
const htmlContent = fs.readFileSync(
  path.join(__dirname, "../page.html"),
  "utf-8"
);

// Simple regex-based parser for questions and answers
const questions = [];
let questionNumber = 0;

// Match questions (starting with <p><strong> followed by a number)
const questionRegex = /<p><strong>(\d+)\.\s*([^<]+)<\/strong><\/p>/g;
const answerRegex = /<ul>([\s\S]*?)<\/ul>/g;
const correctAnswerRegex = /class="correct_answer"|style="color:\s*#ff0000;"/g;

let match;
const questionMatches = [];
while ((match = questionRegex.exec(htmlContent)) !== null) {
  questionMatches.push({
    number: parseInt(match[1]),
    question: decodeHtmlEntities(match[2].trim()),
    index: match.index,
  });
}

// Extract answers for each question
questionMatches.forEach((q, idx) => {
  const startIndex = q.index;
  const endIndex =
    idx < questionMatches.length - 1
      ? questionMatches[idx + 1].index
      : htmlContent.length;

  const questionSection = htmlContent.substring(startIndex, endIndex);

  // Extract images from question section (before answers)
  const imageMatches = questionSection.match(
    /<img[^>]+src=["']([^"']+)["'][^>]*>/gi
  );
  const images = [];
  if (imageMatches) {
    imageMatches.forEach((imgTag) => {
      const srcMatch = imgTag.match(/src=["']([^"']+)["']/i);
      const altMatch = imgTag.match(/alt=["']([^"']*)["']/i);
      if (srcMatch) {
        images.push({
          src: srcMatch[1],
          alt: altMatch ? decodeHtmlEntities(altMatch[1]) : "",
        });
      }
    });
  }

  // Find the first <ul> after the question
  const ulMatch = questionSection.match(/<ul>([\s\S]*?)<\/ul>/);

  if (ulMatch) {
    const answersHtml = ulMatch[1];
    const answerItems = answersHtml.match(/<li[^>]*>([\s\S]*?)<\/li>/g) || [];

    const answers = answerItems
      .map((item) => {
        const isCorrect =
          item.includes('class="correct_answer"') ||
          item.includes('style="color: #ff0000;"') ||
          item.includes('style="color:#ff0000;"') ||
          item.includes('<span style="color: #ff0000;">') ||
          item.includes('<span style="color:#ff0000;">');
        let text = item
          .replace(/<span[^>]*style="color:\s*#ff0000;?"[^>]*>/gi, "")
          .replace(/<\/span>/gi, "")
          .replace(/<strong[^>]*>/gi, "")
          .replace(/<\/strong>/gi, "")
          .replace(/<[^>]+>/g, "")
          .trim();
        text = decodeHtmlEntities(text);
        return {
          text: text,
          isCorrect: isCorrect,
        };
      })
      .filter((a) => a.text.length > 0);

    // Extract explanation/remark if present (improved regex)
    let explanation = null;
    const explanationDiv = questionSection.match(
      /<div class="message_box announce">([\s\S]*?)<\/div>/
    );
    if (explanationDiv) {
      const explanationContent = explanationDiv[1];
      // Extract all text from explanation, preserving structure
      explanation = explanationContent
        .replace(/<p[^>]*>/gi, "")
        .replace(/<\/p>/gi, "\n")
        .replace(/<b[^>]*>/gi, "")
        .replace(/<\/b>/gi, "")
        .replace(/<strong[^>]*>/gi, "")
        .replace(/<\/strong>/gi, "")
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/\n\s*\n\s*\n/g, "\n\n")
        .trim();
      explanation = decodeHtmlEntities(explanation);
    }

    if (answers.length > 0) {
      questions.push({
        id: q.number,
        question: q.question,
        images: images.length > 0 ? images : null,
        answers: answers,
        explanation: explanation,
      });
    }
  }
});

// Save to JSON
const outputPath = path.join(__dirname, "../data/questions.json");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2), "utf-8");

console.log(`Parsed ${questions.length} questions`);
console.log(`Saved to ${outputPath}`);
