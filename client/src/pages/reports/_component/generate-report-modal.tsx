import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { useGenerateReportMutation } from "@/features/report/reportAPI";
import { toast } from "sonner";
import { DateRange } from "react-day-picker";

export const GenerateReportModal = () => {
    const [date, setDate] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    });
    const [open, setOpen] = useState(false);
    const [generateReport, { isLoading }] = useGenerateReportMutation();

    const handleGenerate = () => {
        if (!date?.from || !date?.to) {
            toast.error("Please select a date range");
            return;
        }

        generateReport({
            from: date.from.toISOString(),
            to: date.to.toISOString(),
        })
            .unwrap()
            .then((res: any) => {
                toast.success(res.message || "Report generated and sent!");
                setOpen(false);
            })
            .catch((err) => {
                toast.error(err.data?.message || "Failed to generate report");
            });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="!cursor-pointer !px-6 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20">
                    <Send className="h-4 w-4 mr-2" />
                    <span>Generate Now</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] glass-card border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Generate Manual Report</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Select a date range to generate a manual financial report and send it to your email.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-normal bg-white/5 border-white/10 hover:bg-white/10",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date?.from ? (
                                        date.to ? (
                                            <>
                                                {format(date.from, "LLL dd, y")} -{" "}
                                                {format(date.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(date.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Pick a date range</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-slate-900 border-white/10" align="start">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={date?.from}
                                    selected={date}
                                    onSelect={setDate}
                                    numberOfMonths={2}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full text-white"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                            <Send className="h-4 w-4 mr-2" />
                        )}
                        Generate & Send Report
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
