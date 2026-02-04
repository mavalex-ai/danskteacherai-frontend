export default function DiagnosticCompleteScreen({
  result,
  onContinue,
  onRetry
}) {
  const suggestedLevel = result?.suggestedLevel || "PD2";

  return (
    <div style={{ maxWidth: 600 }}>
      <h2>Level check complete</h2>

      <p>
        We couldn’t confidently determine your exact level yet.
      </p>

      <p>
        Based on your answers, your Danish skills appear to be around
        the <strong>upper A2 / early {suggestedLevel}</strong> level.
      </p>

      <p>
        This is a common situation and a great place to continue learning.
      </p>

      <button
        style={{ marginTop: 16 }}
        onClick={onContinue}
      >
        Start learning at the recommended level
      </button>

      {onRetry && (
        <div style={{ marginTop: 12 }}>
          <button onClick={onRetry}>
            Retake free level check
          </button>
        </div>
      )}
    </div>
  );
}
