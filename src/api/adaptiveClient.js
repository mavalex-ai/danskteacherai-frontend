// Frontend/frontend/src/api/adaptiveClient.js

import { API_BASE_URL } from "../config";

/**
 * Single API client for Dansk TeacherAI
 * Backend is the source of truth.
 */

// ---------------------------
// Helper
// ---------------------------
async function postJSON(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error ${response.status}: ${text}`);
  }

  return response.json();
}

// ---------------------------
// Mode
// ---------------------------
export async function setMode({ userId, mode }) {
  return postJSON(`${API_BASE_URL}/session/set-mode`, {
    userId,
    mode
  });
}

// ---------------------------
// Adaptive flow
// ---------------------------
export async function nextStep({ userId, answerMeta = {} }) {
  return postJSON(`${API_BASE_URL}/adaptive/next-step`, {
    userId,
    answerMeta
  });
}

// ---------------------------
// Exam control
// ---------------------------
export async function startExam({ userId, exam }) {
  return postJSON(`${API_BASE_URL}/exam/start`, {
    userId,
    exam
  });
}

export async function stopExam({ userId }) {
  return postJSON(`${API_BASE_URL}/exam/stop`, {
    userId
  });
}

// ---------------------------
// Exam status
// ---------------------------
export async function getExamStatus({ userId }) {
  const response = await fetch(
    `${API_BASE_URL}/exam/status?userId=${encodeURIComponent(userId)}`
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error ${response.status}: ${text}`);
  }

  return response.json();
}
