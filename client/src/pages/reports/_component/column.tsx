import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw, Trash2, Loader2 } from "lucide-react";
import { _REPORT_STATUS, ReportStatusType } from "@/constant";
import { ReportType } from "@/features/report/reportType";
import { useDeleteReportMutation, useResendReportMutation } from "@/features/report/reportAPI";
import { toast } from "sonner";

const ReportActions = ({ reportId }: { reportId: string }) => {
  const [resendReport, { isLoading: isResending }] = useResendReportMutation();
  const [deleteReport, { isLoading: isDeleting }] = useDeleteReportMutation();

  const handleResend = () => {
    resendReport(reportId)
      .unwrap()
      .then(() => toast.success("Report resent successfully"))
      .catch(() => toast.error("Failed to resend report"));
  };

  const handleDelete = () => {
    deleteReport(reportId)
      .unwrap()
      .then(() => toast.success("Report deleted successfully"))
      .catch(() => toast.error("Failed to delete report"));
  };

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        className="font-normal gap-2"
        onClick={handleResend}
        disabled={isResending || isDeleting}
      >
        {isResending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        Resend
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="font-normal text-destructive hover:text-destructive hover:bg-destructive/10"
        onClick={handleDelete}
        disabled={isResending || isDeleting}
      >
        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export const reportColumns: ColumnDef<ReportType>[] = [
  {
    accessorKey: "period",
    header: "Report Period",
    size: 150,
    cell: ({ row }) => {
      const period = row.getValue("period") as string;
      return (
        <div className="flex items-center gap-2 lg:!w-10">
          <Clock className="h-3.5 w-3.5 opacity-50 shrink-0" />
          <span>{period}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "sentDate",
    header: "Sent Date",
    size: 100,
    cell: ({ row }) => {
      const date = new Date(row.original.sentDate);
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 100,
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusStyles = {
        [_REPORT_STATUS.SENT]: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        [_REPORT_STATUS.FAILED]: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        [_REPORT_STATUS.PENDING]: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        [_REPORT_STATUS.PROCESSING]: "bg-sky-500/10 text-sky-400 border-sky-500/20",
        [_REPORT_STATUS.NO_ACTIVITY]: "bg-slate-500/10 text-slate-400 border-slate-500/20",
      };

      const style =
        statusStyles[status as ReportStatusType] || "bg-slate-500/10 text-slate-400 border-slate-500/20";

      return (
        <span
          className={`inline-flex items-center rounded-full border
         px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${style}`}
        >
          {status}
        </span>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: "actions",
    header: "Actions",
    size: 100,
    cell: ({ row }) => <ReportActions reportId={row.original._id} />,
  },

  {
    id: "-",
    header: "",
  },
  {
    id: "-",
    header: "",
  },
];
