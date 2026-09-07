import PageHeader from "../components/common/PageHeader";
import UploadCard from "../components/UploadCard";
import AnimatedPage from "../components/common/AnimatedPage";

export default function Upload() {
  return (
    <AnimatedPage>
      <div className="space-y-6 pb-12">
        <PageHeader
          title="Upload Research Paper"
          icon="📤"
          subtitle="Upload any scientific PDF paper to trigger the multi-agent AI analysis pipeline."
        />

        <div className="max-w-2xl mx-auto">
          <UploadCard />
        </div>
      </div>
    </AnimatedPage>
  );
}