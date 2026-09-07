import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResearch } from "../context/ResearchContext";
import PageHeader from "../components/common/PageHeader";
import ChatBox from "../components/chat/ChatBox";
import EmptyState from "../components/common/EmptyState";
import Button from "../components/common/Button";
import AnimatedPage from "../components/common/AnimatedPage";
import api from "../api/api";

export default function Chat() {
  const { messages, setMessages, uploadedFile, summary } = useResearch();
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* ── No paper uploaded or analyzed ─────────────────────── */
  if (!uploadedFile && !summary) {
    return (
      <AnimatedPage>
        <EmptyState
          icon="📄"
          title="No Research Paper Uploaded"
          description="Upload and analyze a research paper from the Dashboard first before starting an AI conversation."
          action={
            <Button
              variant="primary"
              icon="🏠"
              onClick={() => navigate("/")}
            >
              Go to Dashboard
            </Button>
          }
        />
      </AnimatedPage>
    );
  }

  const paperTitle = uploadedFile?.name || summary?.title || "Analyzed Paper";

  /* ── Send message ─────────────────────────────────────── */
  const handleSend = async (presetQuestion) => {
    const text = presetQuestion ?? question;
    if (!text.trim()) return;

    const userMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const response = await api.post("/chat", { question: text });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.answer },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Unable to get a response. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="flex flex-col h-full">
        <PageHeader
          title="AI Research Assistant"
          icon="🤖"
          subtitle={`Asking about: ${paperTitle} — Ask questions, summarize sections, or discuss research ideas.`}
        />

        <ChatBox
          messages={messages}
          question={question}
          setQuestion={setQuestion}
          loading={loading}
          onSend={handleSend}
        />
      </div>
    </AnimatedPage>
  );
}