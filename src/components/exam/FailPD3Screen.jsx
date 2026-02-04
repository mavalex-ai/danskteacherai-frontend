export default function FailPD3Screen({
  examProgress,
  onRetry,
  onExit
}) {
  return (
    <div className="exam-result fail">
      <h2>❌ PD3 ikke bestået</h2>

      <p>
        Dit nuværende niveau er tæt på PD3, men
        opfylder endnu ikke alle krav.
      </p>

      {examProgress && (
        <div className="exam-progress">
          <p><strong>Forsøg:</strong> {examProgress.attempts}</p>
          <p>
            <strong>Samlet vurdering:</strong>{" "}
            {(examProgress.readiness?.total * 100).toFixed(0)}%
          </p>
        </div>
      )}

      <div className="next-steps">
        <h4>Hvad anbefaler vi?</h4>
        <ul>
          <li>Arbejd med tekststruktur og sammenhæng</li>
          <li>Fokuser på mere formelt sprog</li>
          <li>Træn længere skriftlige svar</li>
        </ul>
      </div>

      <div style={{ marginTop: 24 }}>
        <button onClick={onRetry}>
          🔁 Træn videre mod PD3
        </button>

        <button
          style={{ marginLeft: 12 }}
          onClick={onExit}
        >
          Afslut
        </button>
      </div>
    </div>
  );
}
