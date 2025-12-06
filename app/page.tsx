"use client";

import { useState, useEffect } from "react";
import Flashcard from "@/components/Flashcard";
import questionsData from "@/data/questions.json";
import styles from "./page.module.css";

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Image {
  src: string;
  alt: string;
}

interface Question {
  id: number;
  question: string;
  images: Image[] | null;
  answers: Answer[];
  explanation: string | null;
}

export default function Home() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    // Shuffle questions on load
    const shuffled = [...questionsData].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleAnswerSelect = (answerIndex: number) => {
    if (showAnswer) return;

    setSelectedAnswers((prev) => {
      if (prev.includes(answerIndex)) {
        return prev.filter((i) => i !== answerIndex);
      }
      return [...prev, answerIndex];
    });
  };

  const handleCheckAnswer = () => {
    if (selectedAnswers.length === 0) return;

    const correctAnswers = currentQuestion.answers
      .map((a, i) => (a.isCorrect ? i : -1))
      .filter((i) => i !== -1);

    const isCorrect =
      selectedAnswers.length === correctAnswers.length &&
      selectedAnswers.every((i) => correctAnswers.includes(i)) &&
      correctAnswers.every((i) => selectedAnswers.includes(i));

    setShowAnswer(true);
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswers([]);
      setShowAnswer(false);
    } else {
      // Restart with new random order
      const shuffled = [...questionsData].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
      setCurrentIndex(0);
      setSelectedAnswers([]);
      setShowAnswer(false);
    }
  };

  const handleRandom = () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    setCurrentIndex(randomIndex);
    setSelectedAnswers([]);
    setShowAnswer(false);
  };

  if (!currentQuestion) {
    return (
      <div className={styles.loading}>
        <h1>Loading flashcards...</h1>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>CCNA Flashcards</h1>
        <div className={styles.stats}>
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span>
            Score: {score.correct}/{score.total}
          </span>
        </div>
      </div>

      <Flashcard
        question={currentQuestion}
        selectedAnswers={selectedAnswers}
        showAnswer={showAnswer}
        onAnswerSelect={handleAnswerSelect}
      />

      <div className={styles.controls}>
        {!showAnswer ? (
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={handleCheckAnswer}
            disabled={selectedAnswers.length === 0}
          >
            Check Answer
          </button>
        ) : (
          <>
            <button
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={handleRandom}
            >
              Random Card
            </button>
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={handleNext}
            >
              {currentIndex < questions.length - 1 ? "Next" : "Restart"}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
