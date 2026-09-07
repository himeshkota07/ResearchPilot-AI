import { useNavigate } from "react-router-dom";
import { useResearch } from "../context/ResearchContext";
import PageHeader from "../components/common/PageHeader";
import ReportCard from "../components/ReportCard";
import AnimatedPage from "../components/common/AnimatedPage";
import EmptyState from "../components/common/EmptyState";
import Button from "../components/common/Button";

export default function Report() {
  const { report } = useResearch();
  const navigate = useNavigate();

  return (
    <AnimatedPage>
      <div className="pb-8">
        <PageHeader
          title="Generated Report"
          icon="📑"
          subtitle="Full AI-generated research report with abstract, literature review, gaps, future work, and conclusion."
        />
        {report ? (
          <ReportCard data={report} />
        ) : (
          <EmptyState
            icon="📑"
            title="No Report Yet"
            description="Upload and analyze a research paper from the Dashboard to generate the full report."
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