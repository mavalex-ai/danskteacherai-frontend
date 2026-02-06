import { useState } from "react";
import "./App.css";

import { API_BASE_URL } from "./config";

import {
  nextStep,
  startExam,
  stopExam
} from "./api/adaptiveClient";

import {
  resolveUIState,
  UI_STATES
} from "./state/uiStateMachine";

import LessonPage from "./components/LessonPage";
import FeedbackPage from "./components/FeedbackPage";
import PassPD3Screen from "./components/exam/PassPD3Screen";
import FailPD3Screen from "./components/exam/FailPD3Screen";
import DiagnosticCompleteScreen from "./components/diagnostic/DiagnosticCompleteScreen";
import PaywallScreen from "./components/paywall/PaywallScreen";
import VoiceUsageBar from "./components/usage/VoiceUsageBar";

const USER_ID = "test-user-hybrid-v1-clean";

function App() {
  const [uiState, setUiState] = useState({ state: UI_STATES.IDLE });
  const [flowMode, setFlowMode] = useState("NONE");
  const [languageMode, setLanguageMode] = useState("EN");
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadAdaptiveStep(answerMeta = {}) {
    try {
      setLoading(true);
      setError(null);

      const response = await nextStep({
        userId: USER_ID,
        answerMeta
      });

      const nextUI = resolveUIState(response);

      if (response.subscription?.active) {
        setFlowMode("ADAPTIVE");
      }

      setUiState(nextUI);
      setLanguageMode(response.languageMode || "EN");
      setUsage(response.usage || null);
    } catch (err) {
      setError(err.message || "Adaptive error");
    } finally {
      setLoading(false);
    }
  }

  async function loadDiagnosticStep(answerMeta = {}) {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/diagnostic/step`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: USER_ID,
            answerMeta
          })
        }
      ).then(r => r.json());

      const nextUI = resolveUIState(response);
      setUiState(nextUI);
      setLanguageMode(response.languageMode || "EN");
    } catch (err) {
      setError("Diagnostic error");
    } finally {
      setLoading(false);
    }
  }

  async function startDiagnostic() {
    setFlowMode("DIAGNOSTIC");

    await fetch(`${API_BASE_URL}/diagnostic/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: USER_ID })
    });

    await loadDiagnosticStep();
  }

  function renderContent() {
    if (loading) return <p>Loading…</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    switch (uiState.state) {

      case UI_STATES.TASK:
        return (
          <>
            <VoiceUsageBar usage={usage} />
            <LessonPage
              task={uiState.task}
              languageMode={languageMode}
              onSubmit={(answerMeta) => {
                if (flowMode === "DIAGNOSTIC") {
                  loadDiagnosticStep(answerMeta);
                } else {
                  loadAdaptiveStep(answerMeta);
                }
              }}
            />
          </>
        );

      case UI_STATES.FEEDBACK:
        return (
          <FeedbackPage
            feedback={uiState.feedback}
            languageMode={languageMode}
            onContinue={() => {
              if (flowMode === "DIAGNOSTIC") {
                loadDiagnosticStep();
              } else {
                loadAdaptiveStep();
              }
            }}
          />
        );

      case UI_STATES.DIAGNOSTIC_COMPLETE:
        return (
          <DiagnosticCompleteScreen
            result={uiState.result}
            onContinue={() => {
              setFlowMode("ADAPTIVE");
              loadAdaptiveStep();
            }}
          />
        );

      case UI_STATES.PAYWALL:
        return (
          <PaywallScreen
            onSubscribe={() => alert("Subscription will connect to Shopify here")}
            onViewProgress={() => setUiState({ state: UI_STATES.IDLE })}
          />
        );

      case UI_STATES.EXAM_RESULT:
        if (uiState.verdict === "PASS_PD3") {
          return (
            <PassPD3Screen
              onContinue={() => {
                stopExam({ userId: USER_ID });
                setUiState({ state: UI_STATES.IDLE });
              }}
            />
          );
        }

        if (uiState.verdict === "FAIL_PD3") {
          return (
            <FailPD3Screen
              examProgress={uiState.examProgress}
              onRetry={loadAdaptiveStep}
              onExit={() => {
                stopExam({ userId: USER_ID });
                setUiState({ state: UI_STATES.IDLE });
              }}
            />
          );
        }

        return null;

      case UI_STATES.IDLE:
      default:
        return (
          <div className="landing">
            <h2>Welcome to Dansk TeacherAI 👋</h2>

            <p>
              Discover your Danish level and get a personalized learning path
              to pass PD2 & PD3 faster and with confidence.
            </p>

            <button onClick={startDiagnostic}>
              Start free level check
            </button>
          </div>
        );
    }
  }

  return (
    <div className="app">
      {renderContent()}
    </div>
  );
}

export default App;