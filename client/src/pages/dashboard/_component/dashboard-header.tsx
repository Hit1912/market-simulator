import { DateRangeSelect, DateRangeType } from "@/components/date-range-select";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";

interface Props {
  title: string;
  subtitle: string;
  dateRange?: DateRangeType;
  setDateRange?: (range: DateRangeType) => void;
}

const DashboardHeader = ({ title, subtitle, dateRange, setDateRange }: Props) => {
  return (
    <div className="flex flex-col lg:flex-row items-end justify-between space-y-7 mb-10">
      <div className="space-y-2">
        <h2 className="text-3xl lg:text-5xl font-bold tracking-tight glow-text">{title}</h2>
        <p className="text-white/50 text-base lg:text-lg font-light">{subtitle}</p>
      </div>
      <div className="flex flex-wrap items-center justify-start lg:justify-end gap-3 lg:gap-5 w-full lg:w-auto">
        <DateRangeSelect dateRange={dateRange || null} setDateRange={(range) => setDateRange?.(range)} />
        <AddTransactionDrawer />
      </div>
    </div>
  );
};

export default DashboardHeader;
