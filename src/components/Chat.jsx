// src/components/Chat.jsx
import { useEffect, useRef, useState } from "react";
import "../App.css";
import { API_BASE_URL } from "../config";

export default function Chat({ mode, onBack }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "ai",
      text: `Hej! Dette er ${mode} teacher. Hvordan kan jeg hjælpe?`,
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 🎤 Voice recording
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function addMessage(msg) {
    setMessages((m) => [...m, { ...msg, id: Date.now() }]);
  }

  // ==============================
  //    TEXT MESSAGE SEND
  // ==============================
  async function sendMessage() {
    const text = input.trim();
    if (!text) return;

    addMessage({ role: "user", text });
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          mode,
        }),
      });

      const data = await resp.json();

      const aiText =
        data.reply ||
        data.replyText ||
        data?.choices?.[0]?.message?.content ||
        JSON.stringify(data);

      addMessage({ role: "ai", text: aiText });
    } catch (err) {
      console.error("Chat error:", err);
      addMessage({ role: "ai", text: "❌ Error contacting server." });
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  // ==============================
  //    🎤 START RECORDING
  // ==============================
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      const audioChunks = [];
      recorder.ondataavailable = (e) => audioChunks.push(e.data);

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        await sendVoice(audioBlob);
      };

      recorderRef.current = recorder;
      setIsRecording(true);
      recorder.start();
    } catch (e) {
      alert("Microphone access denied.");
    }
  }

  // ==============================
  //    🎤 STOP RECORDING
  // ==============================
  function stopRecording() {
    recorderRef.current?.stop();
    setIsRecording(false);
  }

  // ==============================
  //    🎤 SEND VOICE TO BACKEND
  // ==============================
  async function sendVoice(blob) {
    const form = new FormData();
    form.append("audio", blob, "voice.webm");

    addMessage({ role: "user", text: "🎤 (voice message)" });
    setLoading(true);

    try {
      const resp = await fetch(`${API_BASE_URL}/api/voice-chat`, {
        method: "POST",
        body: form,
      });

      const data = await resp.json();

      if (data.replyText) {
        addMessage({ role: "ai", text: data.replyText });

        if (data.replyAudio) {
          const audio = new Audio("data:audio/wav;base64," + data.replyAudio);
          audio.play();
        }
      } else {
        addMessage({ role: "ai", text: "❌ No reply from server." });
      }
    } catch (err) {
      console.error("Voice error:", err);
      addMessage({ role: "ai", text: "❌ Voice chat failed." });
    } finally {
      setLoading(true);
      setTimeout(() => setLoading(false), 400);
    }
  }

  return (
    <div className="chat-container fade-in">
      <div className="chat-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h3>{mode} — Chat</h3>
      </div>

      <div className="chat-window">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`chat-msg ${m.role === "user" ? "from-user" : "from-ai"}`}
          >
            <div className="msg-text">{m.text}</div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-controls">
        <textarea
          className="chat-input"
          placeholder="Type message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={loading || isRecording}
        />

        <div className="chat-buttons">
          <button onClick={sendMessage} disabled={loading || isRecording}>
            Send
          </button>

          {!isRecording && (
            <button className="voice-btn" onClick={startRecording}>
              🎤 Voice
            </button>
          )}

          {isRecording && (
            <button className="voice-stop-btn" onClick={stopRecording}>
              ⏹ Stop
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
