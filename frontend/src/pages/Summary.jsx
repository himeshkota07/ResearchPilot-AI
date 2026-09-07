import { useNavigate } from "react-router-dom";
import { useResearch } from "../context/ResearchContext";
import PageHeader from "../components/common/PageHeader";
import SummaryCard from "../components/SummaryCard";
import AnimatedPage from "../components/common/AnimatedPage";
import EmptyState from "../components/common/EmptyState";
import Button from "../components/common/Button";

export default function Summary() {
  const { summary } = useResearch();
  const navigate = useNavigate();

  return (
    <AnimatedPage>
      <div className="pb-8">
        <PageHeader
          title="Paper Summary"
          icon="📄"
          subtitle="AI-generated summary including title, key points, methodology, and datasets."
        />
        {summary ? (
          <SummaryCard data={summary} />
        ) : (
          <EmptyState
            icon="📄"
            title="No Summary Yet"
            description="Upload and analyze a research paper from the Dashboard to see the summary here."
            action={
              <Button variant="primary" icon="🏠" onClick={() => navigate("/")}>
                Go to Dashboard
              </Button>
            }
          />
        )}
      </div>
    </AnimatedPage>
  );
}