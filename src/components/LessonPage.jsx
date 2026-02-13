import { useState } from "react";
import "./LessonPage.css";

export default function LessonPage({
  task,
  onSubmit,
  onChangeMode,
  currentStep = 1,
  totalSteps = 4
}) {
  const [answer, setAnswer] = useState("");

  if (!task) {
    return <p>No task available</p>;
  }

  function handleSubmit() {
    if (!answer.trim()) return;

    onSubmit({
      text: answer // ← КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ
    });

    setAnswer("");
  }

  const charCount = answer.length;
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="lesson-page fade-in">

      {/* Progress */}
      <div className="progress-wrapper">
        <div className="progress-label">
          Step {currentStep} of {totalSteps}
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="lesson-header">
        <h2>Task</h2>
      </div>

      <div className="task-container">
        <p className="task-main">
          {task.instruction}
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