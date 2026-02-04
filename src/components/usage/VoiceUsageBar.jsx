export default function VoiceUsageBar({ usage }) {
  if (!usage?.voice) return null;

  const used = Math.round(usage.voice.secondsUsed / 60);
  const limit = Math.round(usage.voice.limitSeconds / 60);

  const percent = Math.min(100, (used / limit) * 100);

  let color = "#4caf50";
  if (percent > 80) color = "#ff9800";
  if (usage.voice.exhausted) color = "#f44336";

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 14 }}>
        🎙 Voice today: {used} / {limit} minutes
      </div>

      <div style={{
        height: 6,
        background: "#eee",
        borderRadius: 4,
        overflow: "hidden",
        marginTop: 4
      }}>
        <div style={{
          width: `${percent}%`,
          height: "100%",
          background: color,
          transition: "0.3s"
        }} />
      </div>

      {percent > 80 && !usage.voice.exhausted && (
        <div style={{ fontSize: 12, color: "#ff9800", marginTop: 4 }}>
          ⚠️ Almost at today’s voice limit
        </div>
      )}

      {usage.voice.exhausted && (
        <div style={{ fontSize: 12, color: "#f44336", marginTop: 4 }}>
          Voice practice complete for today.  
          Text learning remains available 📚
        </div>
      )}
    </div>
  );
}
