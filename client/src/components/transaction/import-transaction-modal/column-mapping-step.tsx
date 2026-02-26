import { useMemo, useState } from "react";

import {
  BanIcon,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CsvColumn, TransactionField } from "@/@types/transaction.type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ColumnMappingStepProps = {
  csvColumns: CsvColumn[];
  transactionFields: TransactionField[];
  mappings: Record<string, string>;
  onComplete: (mappings: Record<string, string>) => void;
  onBack: () => void;
};

type AvailableAttributeType =
  | { fieldName: string; required?: never } // For the "Do not import" option
  | TransactionField; // For the actual fields

const ColumnMappingStep = ({
  csvColumns,
  transactionFields,
  onComplete,
  onBack,
  ...props
}: ColumnMappingStepProps) => {
  const [mappings, setMappings] = useState<Record<string, string>>(
    props.mappings || {}
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableAttributes: AvailableAttributeType[] = useMemo(
    () => [{ fieldName: "Skip" }, ...transactionFields],
    [transactionFields]
  );

  const handleMappingChange = (csvColumn: string, field: string) => {
    setMappings((prev) => ({
      ...prev,
      [csvColumn]: field,
    }));

    if (errors[csvColumn]) {
      //delete the csvColumn from errors
      delete errors[csvColumn];
      setErrors((prev) => ({ ...prev }));
    }
  };

  console.log(mappings, "mapping");

  const validateMappings = () => {
    const newErrors: Record<string, string> = {};
    const usedFields = new Set<string>();
    Object.entries(mappings).forEach(([csvColumn, field]) => {
      if (field !== "Skip" && usedFields.has(field)) {
        newErrors[csvColumn] = "Field already mapped";
      }
      if (field !== "Skip") usedFields.add(field);
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const finalMappings = Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(mappings).filter(([_, field]) => field !== "Skip")
      );

      console.log(finalMappings, "maning");
      onComplete(finalMappings);
    }
  };

  const hasRequiredMappings = transactionFields.every(
    (field) =>
      !field.required || Object.values(mappings).includes(field.fieldName)
  );

  // Calculate the count of non-"none" mappings
  const validMappingsCount = Object.values(mappings).filter(
    (field) => field !== "Skip"
  ).length;

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="p-8 space-y-8 relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full" />

      <DialogHeader className="relative z-10">
        <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Column Mapping
        </DialogTitle>
        <DialogDescription className="text-slate-400">
          Match your CSV headers to our transaction fields
        </DialogDescription>
      </DialogHeader>

      <div className="glass-card !bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden max-h-[400px] overflow-y-auto custom-scrollbar">
        <Table>
          <TableHeader className="bg-white/5 border-b border-white/5">
            <TableRow className="hover:bg-transparent border-b-0">
              <TableHead className="!font-bold !text-[11px] uppercase tracking-widest text-slate-400 py-4 pl-6">CSV Column</TableHead>
              <TableHead className="!font-bold !text-[11px] uppercase tracking-widest text-slate-400 py-4">Transaction Field</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {csvColumns.map((column) => (
              <TableRow
                key={column.id}
                className={cn(
                  "border-b border-white/[0.04] hover:bg-white/[0.04] transition-colors group/row",
                  column.hasError && "bg-rose-500/5 hover:bg-rose-500/10"
                )}
              >
                <TableCell className="pl-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                      <FileSpreadsheet className="size-4 text-emerald-400" />
                    </div>
                    <span className="text-sm font-semibold text-slate-200 group-hover/row:text-white transition-colors">{column.name}</span>
                  </div>
                </TableCell>
                <TableCell className="py-2">
                  <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                    <HelpCircle className="size-4 text-slate-500" />
                    <Select
                      value={mappings[column.name] || ""}
                      onValueChange={(value) =>
                        handleMappingChange(column.name, value)
                      }
                    >
                      <SelectTrigger
                        className="h-7 border-none shadow-none focus:ring-0 p-0 text-sm font-medium bg-transparent"
                      >
                        <SelectValue
                          className="capitalize"
                          placeholder="Map to Field"
                        />
                      </SelectTrigger>
                      <SelectContent className="glass-card border-white/10 p-1.5">
                        {availableAttributes.map((attr) => {
                          const isDisabled =
                            attr.fieldName !== "Skip" &&
                            attr.fieldName !== mappings[column.name] &&
                            Object.values(mappings).includes(attr.fieldName);

                          return (
                            <SelectItem
                              key={attr.fieldName}
                              value={attr.fieldName}
                              className="rounded-lg py-2 cursor-pointer hover:bg-white/5 transition-colors focus:bg-white/10"
                              disabled={isDisabled}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="capitalize">
                                  {attr.fieldName}
                                  {attr?.required && (
                                    <span className="text-rose-500 ml-1">*</span>
                                  )}
                                </span>
                                {isDisabled && (
                                  <BanIcon className="size-3.5 opacity-50 ml-2" />
                                )}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors[column.name] && (
                    <p className="mt-1.5 ml-1 text-[10px] font-bold uppercase tracking-wider text-rose-400">
                      {errors[column.name]}
                    </p>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center bg-white/5 p-4 -mx-8 -mb-8 mt-4 border-t border-white/10">
        <Button variant="ghost" onClick={onBack} className="rounded-xl px-6 hover:bg-white/10 text-slate-300">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={validateMappings}
          disabled={!hasRequiredMappings || hasErrors}
          className="rounded-xl px-8 bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:shadow-none transition-all"
        >
          Verify Data ({validMappingsCount}/{transactionFields.length})
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default ColumnMappingStep;
