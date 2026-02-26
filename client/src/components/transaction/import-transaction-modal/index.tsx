import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImportIcon } from "lucide-react";
import FileUploadStep from "./fileupload-step";
import ColumnMappingStep from "./column-mapping-step";
import { CsvColumn, TransactionField } from "@/@types/transaction.type";
import ConfirmationStep from "./confirmation-step";


const ImportTransactionModal = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<File | null>(null);
  const [csvColumns, setCsvColumns] = useState<CsvColumn[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [csvData, setCsvData] = useState<any[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);

  const transactionFields: TransactionField[] = [
    { fieldName: 'title', required: true },
    { fieldName: 'amount', required: true },
    { fieldName: 'type', required: true },
    { fieldName: 'date', required: true },
    { fieldName: 'category', required: true },
    { fieldName: 'paymentMethod', required: true },
    { fieldName: 'description', required: false },
  ];

  // console.log(transactionFields, file, csvColumns, csvData, mappings);


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileUpload = (file: File, columns: CsvColumn[], data: any[]) => {
    setFile(file);
    setCsvColumns(columns);
    setCsvData(data);
    setMappings({});
    setStep(2);
  };

  const resetImport = () => {
    setFile(null);
    setCsvColumns([]);
    setMappings({});
    setStep(1);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => resetImport(), 300);
  };

  const handleMappingComplete = (mappings: Record<string, string>) => {
    setMappings(mappings);
    setStep(3);
  };

  const handleBack = (step: 1 | 2 | 3) => {
    setStep(step);
  };



  const renderStep = () => {
    switch (step) {
      case 1:
        return <FileUploadStep onFileUpload={handleFileUpload} />;
      case 2:
        return (
          <ColumnMappingStep
            csvColumns={csvColumns}
            mappings={mappings}
            transactionFields={transactionFields}
            onComplete={handleMappingComplete}
            onBack={() => handleBack(1)}
          />
        );
      case 3:
        return (
          <ConfirmationStep
            file={file}
            mappings={mappings}
            csvData={csvData}
            onBack={() => handleBack(2)}
            onComplete={() => handleClose()}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <Button
        variant="ghost"
        className="group/import relative flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-300 overflow-hidden"
        onClick={() => setOpen(true)}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 opacity-0 group-hover/import:opacity-100 transition-opacity" />
        <ImportIcon className="size-4.5 text-indigo-400 group-hover/import:scale-110 transition-transform" />
        <span className="text-sm font-semibold text-slate-300 group-hover/import:text-white transition-colors">Bulk Import</span>
      </Button>
      <DialogContent className="max-w-2xl glass-card !fixed !top-1/2 !left-1/2 !-translate-y-1/2 !-translate-x-1/2 border-white/10 p-0 overflow-y-auto max-h-[90vh] shadow-[0_30px_60px_rgba(0,0,0,0.4)] custom-scrollbar">
        {renderStep()}
      </DialogContent>
    </Dialog>
  );
};

export default ImportTransactionModal;
