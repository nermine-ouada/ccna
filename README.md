# CCNA Flashcards App

A modern, responsive flashcard application built with Next.js for studying CCNA exam questions.

## Features

- 🎴 Interactive flashcard interface with flip animation
- 🎲 Random card selection
- ✅ Answer validation with immediate feedback
- 📊 Score tracking
- 📱 Fully responsive design
- 🎨 Modern UI with gradient backgrounds

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Parse questions from HTML (if not already done):
```bash
node scripts/parse-questions.js
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. **Select Answers**: Click on one or more answer options (for multiple choice questions)
2. **Check Answer**: Click "Check Answer" to see if you're correct
3. **View Explanation**: After checking, you'll see the correct answer(s) and explanation
4. **Flip Card**: Click the card to flip between question and answer view
5. **Next Card**: Click "Next" to move to the next question
6. **Random Card**: Click "Random Card" to jump to a random question

## Project Structure

```
ccna-flashcards/
├── app/                 # Next.js app directory
│   ├── layout.tsx       # Root layout
│   ├── page.tsx        # Main page component
│   ├── globals.css     # Global styles
│   └── page.module.css # Page-specific styles
├── components/          # React components
│   ├── Flashcard.tsx   # Flashcard component
│   └── Flashcard.module.css
├── data/               # Data files
│   └── questions.json # Parsed questions
├── scripts/            # Utility scripts
│   └── parse-questions.js # HTML parser
└── page.html           # Source HTML file
```

## Building for Production

```bash
npm run build
npm start
```

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **CSS Modules** - Scoped styling
- **React Hooks** - State management

## License

MIT

