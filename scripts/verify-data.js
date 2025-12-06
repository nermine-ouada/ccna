const fs = require("fs");
const path = require("path");

const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/questions.json"), "utf-8")
);

const withImages = data.filter((q) => q.images && q.images.length > 0);
const withExplanations = data.filter((q) => q.explanation);

console.log(`Total questions: ${data.length}`);
console.log(`Questions with images: ${withImages.length}`);
console.log(`Questions with explanations: ${withExplanations.length}`);
console.log(
  `\nSample question with image:`,
  withImages[0] ? `Question ${withImages[0].id}` : "None"
);
console.log(
  `\nSample question with explanation:`,
  withExplanations[0] ? `Question ${withExplanations[0].id}` : "None"
);
