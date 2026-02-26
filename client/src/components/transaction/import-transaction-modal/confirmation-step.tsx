import { useState } from "react";
import { z } from "zod";
import { ChevronDown, ChevronLeft, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { _TRANSACTION_TYPE, PAYMENT_METHODS_ENUM } from "@/constant";
import { toast } from "sonner";
import { MAX_IMPORT_LIMIT } from "@/constant";
import { BulkTransactionType } from "@/features/transaction/transationType";
import { useProgressLoader } from "@/hooks/use-progress-loader";
import { useBulkImportTransactionMutation } from "@/features/transaction/transactionAPI";

type ConfirmationStepProps = {
  file: File | null;
  mappings: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  csvData: any[];
  onComplete: () => void;
  onBack: () => void;
};

const transactionSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  amount: z
    .number({
      invalid_type_error: "Amount must be a number",
      required_error: "Amount is required",
    })
    .positive("Amount must be greater than zero"),
  date: z.preprocess(
    (val) => new Date(val as string),
    z.date({
      invalid_type_error: "Invalid date format",
      required_error: "Date is required",
    })
  ),
  type: z.enum([_TRANSACTION_TYPE.INCOME, _TRANSACTION_TYPE.EXPENSE], {
    invalid_type_error: "Invalid transaction type",
    required_error: "Transaction type is required",
  }),
  category: z.string({
    required_error: "Category is required",
  }),
  paymentMethod: z
    .union([
      z.literal(""),
      z.undefined(),
      z.enum(
        [
          PAYMENT_METHODS_ENUM.CARD,
          PAYMENT_METHODS_ENUM.BANK_TRANSFER,
          PAYMENT_METHODS_ENUM.MOBILE_PAYMENT,
          PAYMENT_METHODS_ENUM.AUTO_DEBIT,
          PAYMENT_METHODS_ENUM.CASH,
          PAYMENT_METHODS_ENUM.OTHER,
        ],
        {
          errorMap: (issue) => ({
            message:
              issue.code === "invalid_enum_value"
                ? `Payment method must be one of: ${Object.values(PAYMENT_METHODS_ENUM).join(", ")}`
                : "Invalid payment method",
          }),
        }
      ),
    ])
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
});

const ConfirmationStep = ({
  file,
  mappings,
  csvData,
  onComplete,
  onBack,
}: ConfirmationStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    progress,
    isLoading,
    startProgress,
    updateProgress,
    doneProgress,
    resetProgress,
  } = useProgressLoader({ initialProgress: 10, completionDelay: 500 });

  const [bulkImportTransaction] = useBulkImportTransactionMutation();

  const handleImport = () => {
    const { transactions, hasValidationErrors } =
      getAssignFieldToMappedTransactions();
    console.log(transactions, "transactions");

    if (hasErrors || hasValidationErrors) return;

    if (transactions.length > MAX_IMPORT_LIMIT) {
      toast.error(`Cannot import more than ${MAX_IMPORT_LIMIT} transactions`);
      return;
    }
    resetProgress();
    startProgress(10);
    // Start progress
    let currentProgress = 10;
    const interval = setInterval(() => {
      const increment = currentProgress < 90 ? 10 : 1;
      currentProgress = Math.min(currentProgress + increment, 90);
      updateProgress(currentProgress);
    }, 250);

    const payload = { transactions: transactions as BulkTransactionType[] };

    console.log(payload, "payload");

    bulkImportTransaction(payload)
      .unwrap()
      .then(() => {
        updateProgress(100);
        toast.success("Imported transactions successfully");
      })
      .catch((error) => {
        resetProgress();
        toast.error(error.data?.message || "Failed to import transactions");
      })
      .finally(() => {
        clearInterval(interval);
        setTimeout(() => {
          doneProgress();
          resetProgress();
          onComplete();
        }, 500);
      });
  };

  const getAssignFieldToMappedTransactions = () => {
    let hasValidationErrors = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results: Partial<any>[] = [];

    csvData.forEach((row, index) => {
      const transaction: Record<string, string> = {};
      // Apply mappings
      Object.entries(mappings).forEach(([csvColumn, transactionField]) => {
        if (transactionField === "Skip" || row[csvColumn] === undefined) return;
        transaction[transactionField] =
          transactionField === "amount"
            ? Number(row[csvColumn])
            : transactionField === "date"
              ? new Date(row[csvColumn])
              : row[csvColumn];
      });
      try {
        const validated = transactionSchema.parse(transaction);
        results.push(validated);
      } catch (error) {
        hasValidationErrors = true;
        const message =
          error instanceof z.ZodError
            ? error.errors
              .map((e) => {
                if (e.path[0] === "type")
                  return "Transaction type:- must be INCOME or EXPENSE";
                if (e.path[0] === "paymentMethod")
                  return (
                    "Payment method:- must be one of: " +
                    Object.values(PAYMENT_METHODS_ENUM).join(", ")
                  );
                return `${e.path[0]}: ${e.message}`;
              })
              .join("\n")
            : "Invalid data";
        setErrors((prev) => ({
          ...prev,
          [index + 1]: message,
        }));
      }
    });
    return { transactions: results, hasValidationErrors };
  };

  const hasErrors = Object.keys(errors).length > 0;

  console.log(errors, "errors");

  return (
    <div className="p-8 space-y-8 relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />

      <DialogHeader className="relative z-10">
        <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Ready to Import
        </DialogTitle>
        <DialogDescription className="text-slate-400">
          Verify your data before finalizing the bulk import
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 relative z-10">
        <div className="glass-card !bg-white/[0.03] border border-white/5 rounded-2xl p-6">
          <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-400 mb-6">
            <FileCheck className="size-4" />
            Import Summary
          </h4>
          <div className="grid grid-cols-2 gap-y-6 gap-x-8">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Source File</p>
              <p className="text-sm font-semibold text-white truncate max-w-[180px]">{file?.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Mappings</p>
              <p className="text-sm font-semibold text-white">{Object.keys(mappings).length} Columns</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Entries</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white">{csvData.length}</p>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md">Validated</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Import Limit</p>
              <p className="text-sm font-semibold text-white">{MAX_IMPORT_LIMIT}</p>
            </div>
          </div>
        </div>

        {hasErrors && (
          <div className="glass-card !bg-rose-500/[0.02] border border-rose-500/20 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 bg-rose-500/10 border-b border-rose-500/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400">
                Validation Issues Found ({Object.keys(errors).length})
              </p>
            </div>
            <div className="p-4 space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {Object.entries(errors).map(([row, msg]) => (
                <details key={row} className="group/issue">
                  <summary className="flex items-center justify-between cursor-pointer py-1.5 hover:bg-white/5 px-2 rounded-lg transition-colors">
                    <span className="text-xs font-bold text-slate-400 group-open/issue:text-rose-400 transition-colors">Row {row}</span>
                    <ChevronDown className="size-3.5 text-slate-500 transform group-open/issue:rotate-180 transition-transform" />
                  </summary>
                  <div className="mt-2 pl-4 pr-2 text-xs text-rose-300 leading-relaxed border-l border-rose-500/30 ml-2 mb-2">
                    {msg.split("\n").map((line, i) => (
                      <p key={i} className="py-0.5">{line}</p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-indigo-400">
              <span>Synchronizing Transactions</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5 bg-white/5 border border-white/5" />
          </div>
        )}
      </div>

      <div className="flex justify-between items-center bg-white/5 p-4 -mx-8 -mb-8 mt-4 border-t border-white/10 relative z-10">
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={isLoading}
          className="rounded-xl px-6 hover:bg-white/10 text-slate-300"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Adjust Mappings
        </Button>
        <Button
          onClick={handleImport}
          disabled={isLoading}
          className="rounded-xl px-8 bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:shadow-none transition-all h-10 font-bold"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Syncing...
            </div>
          ) : "Finalize Import"}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
