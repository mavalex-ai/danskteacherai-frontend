import { useState } from "react";
import "./LessonPage.css";

export default function LessonPage({ task, onSubmit, onChangeMode }) {
  const [answer, setAnswer] = useState("");

  if (!task) {
    return <p>No task available</p>;
  }

  function handleSubmit() {
    if (!answer.trim()) return;

    onSubmit({
      answer,
      task
    });

    setAnswer("");
  }

  const charCount = answer.length;

  return (
    <div className="lesson-page fade-in">

      <div className="lesson-header">
        <button className="back-btn" onClick={onChangeMode}>
          ← Change mode
        </button>
        <h2>Lesson</h2>
      </div>

      <div className="task-container">

        <h3 className="task-title">Task</h3>

        <p className="task-main">
          Write <strong>4–8 sentences about yourself in Danish.</strong>
        </p>

        <div className="task-hints">
          <p>You can include:</p>
          <ul>
            <li>your daily life</li>
            <li>your work or studies</li>
            <li>your hobbies</li>
          </ul>
        </div>

        <p className="task-encouragement">
          Don’t worry about mistakes. Just write naturally.
        </p>

      </div>

      <textarea
        className="answer-input"
        placeholder="Start writing in Danish..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={6}
      />

      <div className="char-counter">
        {charCount} characters
      </div>

      <button 
        className="submit-btn"
        onClick={handleSubmit}
        disabled={!answer.trim()}
      >
        Submit
      </button>

    </div>
  );
}