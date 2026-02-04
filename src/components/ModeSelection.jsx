// frontend/src/components/ModeSelection.jsx

import "./ModeSelection.css";

export default function ModeSelection({ onSelectMode }) {
  return (
    <div className="mode-selection fade-in">
      <h2>🇩🇰 Dansk Teacher AI</h2>
      <p>Choose learning mode:</p>

      <div className="mode-buttons">
        <button onClick={() => onSelectMode("CONVERSATION")}>
          💬 Conversation
        </button>

        <button onClick={() => onSelectMode("GRAMMAR")}>
          📘 Grammar
        </button>

        <button onClick={() => onSelectMode("PHRASES")}>
          🗣️ Phrases
        </button>
      </div>
    </div>
  );
}
