import React from "react";

export default function PassPD3Screen({ onContinue }) {
  return (
    <div className="exam-result pass">
      <h1>🎉 You passed PD3</h1>

      <p className="subtitle">
        Your Danish proficiency meets the PD3 exam requirements.
      </p>

      <section className="result-block">
        <h3>Examiner assessment</h3>
        <p>
          The candidate demonstrates sufficient control of grammar,
          vocabulary, and comprehension expected at PD3 level.
        </p>
      </section>

      <section className="result-meta">
        <p><strong>Verdict:</strong> PASS</p>
        <p><strong>Exam:</strong> PD3</p>
      </section>

      <button className="primary" onClick={onContinue}>
        Continue
      </button>
    </div>
  );
}
