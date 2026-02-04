import { useState } from "react";
import "./LessonPage.css";

export default function LessonPage({ task, onSubmit, onChangeMode }) {
  const [answer, setAnswer] = useState("");

  if (!task) {
    return <p>No task available</p>;
  }

  function handleSubmit() {
    if (!answer.trim()) return;

    // 🔴 КЛЮЧЕВОЙ МОМЕНТ:
    // отправляем И ответ, И само задание
    onSubmit({
      answer,
      task
    });

    setAnswer("");
  }

  return (
    <div className="lesson-page fade-in">
      <div className="lesson-header">
        <button className="back-btn" onClick={onChangeMode}>
          ← Change mode
        </button>
        <h2>Lesson</h2>
      </div>

      <div className="task-box">
        <p>{task.instruction}</p>
      </div>

      <textarea
        className="answer-input"
        placeholder="Write your answer here…"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={6}
      />

      <button className="submit-btn" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
