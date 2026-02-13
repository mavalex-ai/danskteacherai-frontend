import { useState } from "react";
import "./App.css";

import { API_BASE_URL } from "./config";

import {
  nextStep,
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

  const [diagnosticStep, setDiagnosticStep] = useState(1);
  const [diagnosticTotalSteps] = useState(4);

  // =========================
  // ADAPTIVE MODE
  // =========================
  async function loadAdaptiveStep(answerMeta = {}) {
    try {
      setLoading(true);
      setError(null);

      const response = await nextStep({
        userId: USER_ID,
        answerMeta
      });

      const nextUI = resolveUIState(response);

      setUiState(nextUI);
      setLanguageMode(response.languageMode || "EN");
      setUsage(response.usage || null);

    } catch (err) {
      setError(err.message || "Adaptive error");
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // DIAGNOSTIC MODE (DEBUG ENABLED)
  // =========================
  async function loadDiagnosticStep(answerMeta = {}) {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_BASE_URL}/diagnostic/step?t=${Date.now()}`, // защита от кеша
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: USER_ID,
            answerMeta
          })
        }
      ).then(r => r.json());

      console.log("=== BACKEND RESPONSE ===");
      console.log(response);

      if (response.diagnosticResult) {
        console.log("Diagnostic complete:", response.diagnosticResult);

        setUiState({
          state: UI_STATES.DIAGNOSTIC_COMPLETE,
          result: response.diagnosticResult
        });
        return;
      }

      console.log("Setting diagnostic step:", response.step);
      console.log("Task from backend:", response.task);

      setDiagnosticStep(response.step);

      setUiState({
        state: UI_STATES.TASK,
        task: { ...response.task } // принудительно новый объект
      });

      setLanguageMode(response.languageMode || "EN");

    } catch (err) {
      console.error("Diagnostic error:", err);
      setError("Diagnostic error");
    } finally {
      setLoading(false);
    }
  }

  async function startDiagnostic() {
    setFlowMode("DIAGNOSTIC");
    setDiagnosticStep(1);

    await fetch(`${API_BASE_URL}/diagnostic/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: USER_ID })
    });

    loadDiagnosticStep();
  }

  // =========================
  // RENDER
  // =========================
  function renderContent() {

    if (loading) return <p className="loading">Loading…</p>;
    if (error) return <p className="error">{error}</p>;

    switch (uiState.state) {

      case UI_STATES.TASK:

        console.log("=== RENDERING TASK ===");
        console.log("Current task in state:", uiState.task);

        return (
          <>
            <VoiceUsageBar usage={usage} />
            <LessonPage
              task={uiState.task}
              currentStep={
                flowMode === "DIAGNOSTIC"
                  ? diagnosticStep
                  : 1
              }
              totalSteps={
                flowMode === "DIAGNOSTIC"
                  ? diagnosticTotalSteps
                  : 5
              }
              languageMode={languageMode}
              onSubmit={(answerMeta) =>
                flowMode === "DIAGNOSTIC"
                  ? loadDiagnosticStep(answerMeta)
                  : loadAdaptiveStep(answerMeta)
              }
            />
          </>
        );

      case UI_STATES.FEEDBACK:
        return (
          <FeedbackPage
            feedback={uiState.feedback}
            languageMode={languageMode}
            onContinue={() =>
              flowMode === "DIAGNOSTIC"
                ? loadDiagnosticStep()
                : loadAdaptiveStep()
            }
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
            onSubscribe={() => alert("Subscription logic here")}
            onViewProgress={() =>
              setUiState({ state: UI_STATES.IDLE })
            }
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

      default:
        return (
          <div className="landing">
            <h2>Welcome to Dansk TeacherAI</h2>
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