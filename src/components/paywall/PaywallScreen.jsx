import "./PaywallScreen.css";

export default function PaywallScreen({ onSubscribe, onViewProgress }) {
  return (
    <div className="paywall-screen">
      <h2>Continue learning Danish with confidence 🇩🇰</h2>

      <p>
        You’ve completed your free introduction to Dansk TeacherAI.
      </p>

      <p>
        To continue learning at your level and prepare for PD2 / PD3,
        please unlock full access.
      </p>

      <div className="paywall-actions">
        <button className="primary" onClick={onSubscribe}>
          Start subscription
        </button>

        <button className="secondary" onClick={onViewProgress}>
          View my progress
        </button>
      </div>
    </div>
  );
}
