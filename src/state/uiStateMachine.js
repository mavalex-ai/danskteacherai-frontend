export const UI_STATES = {
  IDLE: "IDLE",
  TASK: "TASK",
  FEEDBACK: "FEEDBACK",
  EXAM_RESULT: "EXAM_RESULT",
  DIAGNOSTIC_COMPLETE: "DIAGNOSTIC_COMPLETE",
  PAYWALL: "PAYWALL"
};

export function resolveUIState(response) {
  if (!response) {
    return { state: UI_STATES.IDLE };
  }

  // 🔒 PAYWALL (highest priority)
  if (response.action === "PAYWALL") {
    return {
      state: UI_STATES.PAYWALL,
      reason: response.reason,
      languageMode: response.languageMode
    };
  }

  // 🧠 Diagnostic complete
  if (response.diagnosticResult) {
    return {
      state: UI_STATES.DIAGNOSTIC_COMPLETE,
      result: response.diagnosticResult
    };
  }

  // Exam result
  if (response.action === "PASS_PD3" || response.action === "FAIL_PD3") {
    return {
      state: UI_STATES.EXAM_RESULT,
      verdict: response.action,
      examProgress: response.examProgress || null
    };
  }

  // Examiner feedback
  if (response.examinerFeedback) {
    return {
      state: UI_STATES.FEEDBACK,
      feedback: response.examinerFeedback,
      examProgress: response.examProgress || null
    };
  }

  // Task
  if (response.task) {
    return {
      state: UI_STATES.TASK,
      task: response.task
    };
  }

  return { state: UI_STATES.IDLE };
}
