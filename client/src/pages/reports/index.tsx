import {
  Card,
  CardContent,
} from "@/components/ui/card";
import PageLayout from "@/components/page-layout";
import ScheduleReportDrawer from "./_component/schedule-report-drawer";
import ReportTable from "./_component/report-table";
import { usePageTransition } from "@/hooks/use-gsap";
import { GenerateReportModal } from "./_component/generate-report-modal";


export default function Reports() {
  usePageTransition(".gsap-reveal");

  return (
    <PageLayout
      title="Report History"
      subtitle="View and manage your financial reports"
      addMarginTop
      rightAction={
        <div className="flex items-center gap-3">
          <GenerateReportModal />
          <ScheduleReportDrawer />
        </div>
      }
    >
      <div className="gsap-reveal">
        <Card className="glass-card border-0 !shadow-none overflow-hidden relative">
          <div className="absolute top-0 left-0 p-20 bg-primary/5 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
          <CardContent className="relative z-10">
            <ReportTable />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
