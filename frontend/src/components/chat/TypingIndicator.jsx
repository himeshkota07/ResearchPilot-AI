export default function TypingIndicator() {
  return (
    <div className="mb-4 flex justify-start">
      {/* AI avatar */}
      <div
        className="mr-3 mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm"
        style={{
          background: "linear-gradient(135deg,#6366f1,#a78bfa)",
          boxShadow: "0 0 10px rgba(99,102,241,0.4)",
        }}
      >
        🤖
      </div>

      {/* Bubble */}
      <div
        className="flex items-center gap-1.5 rounded-2xl px-4 py-3"
        style={{
          background: "rgba(30,41,59,0.7)",
          border: "1px solid rgba(99,102,241,0.15)",
          borderBottomLeftRadius: 4,
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full animate-bounce"
            style={{
              background: `linear-gradient(135deg, #6366f1, #a78bfa)`,
              boxShadow: "0 0 6px rgba(99,102,241,0.6)",
              animationDelay: `${i * 0.15}s`,
              animationDuration: "0.8s",
            }}
          />
        ))}
      </div>
    </div>
  );
}