"use client";

import styles from "./Flashcard.module.css";

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

interface FlashcardProps {
  question: Question;
  selectedAnswers: number[];
  showAnswer: boolean;
  onAnswerSelect: (index: number) => void;
}

export default function Flashcard({
  question,
  selectedAnswers,
  showAnswer,
  onAnswerSelect,
}: FlashcardProps) {
  const getAnswerClass = (index: number, isCorrect: boolean) => {
    const isSelected = selectedAnswers.includes(index);

    if (!showAnswer) {
      return isSelected ? "selected" : "";
    }

    // After showing answer, keep selected answers highlighted
    if (isSelected && isCorrect) {
      return "selected correct";
    }

    if (isSelected && !isCorrect) {
      return "selected incorrect";
    }

    if (isCorrect) {
      return "correct";
    }

    return "";
  };

  return (
    <div className={styles.flashcardContainer}>
      <div className={styles.flashcard}>
        <div className={styles.flashcardFront}>
          <div className={styles.questionNumber}>Question {question.id}</div>
          <div className={styles.questionText}>{question.question}</div>

          {question.images && question.images.length > 0 && (
            <div className={styles.imagesContainer}>
              {question.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.src}
                  alt={img.alt || `Question ${question.id} image ${idx + 1}`}
                  className={styles.questionImage}
                  loading="lazy"
                />
              ))}
            </div>
          )}

          <div className={styles.answers}>
            {question.answers.map((answer, index) => (
              <button
                key={index}
                className={`${styles.answerBtn} ${
                  getAnswerClass(index, answer.isCorrect).includes("selected")
                    ? styles.selected
                    : ""
                } ${
                  getAnswerClass(index, answer.isCorrect).includes("correct")
                    ? styles.correct
                    : ""
                } ${
                  getAnswerClass(index, answer.isCorrect).includes("incorrect")
                    ? styles.incorrect
                    : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onAnswerSelect(index);
                }}
                disabled={showAnswer}
              >
                {answer.text}
              </button>
            ))}
          </div>

          {showAnswer && (
            <div className={styles.answerResult}>
              {(() => {
                const correctAnswers = question.answers
                  .map((a, i) => (a.isCorrect ? i : -1))
                  .filter((i) => i !== -1);
                const isCorrect =
                  selectedAnswers.length === correctAnswers.length &&
                  selectedAnswers.every((i) => correctAnswers.includes(i)) &&
                  correctAnswers.every((i) => selectedAnswers.includes(i));

                return (
                  <div
                    className={`${styles.result} ${
                      isCorrect ? styles.correctResult : styles.incorrectResult
                    }`}
                  >
                    <h2>{isCorrect ? "✓ Correct!" : "✗ Incorrect"}</h2>
                  </div>
                );
              })()}

              <div className={styles.correctAnswers}>
                <h3>Correct Answer(s):</h3>
                {question.answers
                  .map((a, i) =>
                    a.isCorrect ? { text: a.text, index: i } : null
                  )
                  .filter((a) => a !== null)
                  .map((a, i) => (
                    <div key={i} className={styles.correctAnswer}>
                      {a!.text}
                    </div>
                  ))}
              </div>

              {question.explanation && (
                <div className={styles.explanation}>
                  <h3>Explanation:</h3>
                  <div className={styles.explanationText}>
                    {question.explanation.split("\n").map((line, idx) => (
                      <p key={idx}>{line || "\u00A0"}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
