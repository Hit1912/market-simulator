import { toast } from "sonner";
import { usePapaParse } from "react-papaparse";
import { FileUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MAX_FILE_SIZE, MAX_IMPORT_LIMIT } from "@/constant";
import { useProgressLoader } from "@/hooks/use-progress-loader";

interface CsvRow {
  [key: string]: string | undefined; // Define that rows can be indexed with strings
}

type FileUploadStepProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFileUpload: (file: File, columns: any[], data: any[]) => void;
};

const FileUploadStep = ({ onFileUpload }: FileUploadStepProps) => {
  const { readString } = usePapaParse();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    progress,
    isLoading,
    startProgress,
    updateProgress,
    doneProgress,
    resetProgress,
  } = useProgressLoader({ initialProgress: 10, completionDelay: 500 });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        `File size exceeds the limit of ${MAX_FILE_SIZE / 1024 / 1024} MB`
      );
      return;
    }
    resetProgress(); // Clear any previous progress
    startProgress();

    try {
      // First read the file as text
      const fileText = await file.text();
      // Then parse the CSV text
      readString<CsvRow>(fileText, {
        header: true,
        skipEmptyLines: true,
        fastMode: true,
        complete: (results) => {
          console.log(results, "results");
          if (results.data.length > MAX_IMPORT_LIMIT) {
            toast.error(
              `You can only import up to ${MAX_IMPORT_LIMIT} transactions.`
            );
            resetProgress();
            return;
          }

          updateProgress(40);

          const columns =
            results.meta.fields?.map((name: string) => ({
              id: name,
              name,
              sampleData:
                results.data[0]?.[name]?.slice(0, MAX_IMPORT_LIMIT) || "",
            })) || [];

          doneProgress();

          console.log(columns, results.data);

          setTimeout(() => {
            onFileUpload(file, columns, results.data);
          }, 500);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          resetProgress();
        },
      });
    } catch (error) {
      console.error("Error reading file:", error);
      resetProgress();
    }
  };

  return (
    <div className="p-8 space-y-8 relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />

      <DialogHeader className="relative z-10">
        <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Import Transactions
        </DialogTitle>
        <DialogDescription className="text-slate-400">
          Upload a CSV file to sync your financial data in bulk
        </DialogDescription>
      </DialogHeader>

      <div
        className={cn(
          "w-full rounded-[2rem] border-2 border-dashed border-white/10 hover:border-indigo-500/30 transition-all duration-500 bg-white/[0.02] hover:bg-white/[0.04] group/drop p-10 cursor-pointer text-center relative overflow-hidden",
          isLoading && "opacity-60 cursor-not-allowed border-indigo-500/20"
        )}
        onClick={() => !isLoading && fileInputRef.current?.click()}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover/drop:opacity-100 transition-opacity" />

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".csv"
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover/drop:scale-110 group-hover/drop:bg-indigo-500/20 transition-all duration-500">
            <FileUp className="size-8 text-indigo-400" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white tracking-tight">Drop your CSV here</h3>
            <p className="text-sm text-slate-500">or click to browse your computer</p>
          </div>

          <div className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-600 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
            CSV Supported • Max 5MB
          </div>
        </div>

        {isLoading && (
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center">
            <div className="w-full max-w-xs px-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-indigo-400">
                <span>Parsing Assets</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5 bg-white/10 border border-white/5" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadStep;
