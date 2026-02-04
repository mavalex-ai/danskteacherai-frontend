export default function FeedbackPage({
  feedback,
  examProgress,
  onContinue
}) {
  // 🔒 DEFENSIVE GUARDS
  const totalScore =
    typeof examProgress?.total === "number"
      ? examProgress.total
      : null;

  return (
    <div className="feedback-page">
      <h2>Examiner feedback</h2>

      <p>{feedback}</p>

      {totalScore !== null && (
        <p style={{ marginTop: 12 }}>
          <strong>Current score:</strong>{" "}
          {(totalScore * 100).toFixed(0)}%
        </p>
      )}

      <button onClick={onContinue} style={{ marginTop: 16 }}>
        Continue
      </button>
    </div>
  );
}
