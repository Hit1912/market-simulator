import { FC } from "react";
import CountUp from "react-countup";
import { TrendingDownIcon, TrendingUpIcon, LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercentage } from "@/lib/format-percentage";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { DateRangeEnum, DateRangeType } from "@/components/date-range-select";
import { useFormatCurrency } from "@/hooks/use-format-currency";

type CardType = "balance" | "income" | "expenses" | "savings";
type CardStatus = {
  label: string;
  color: string;
  Icon: LucideIcon;
  description?: string;
};
interface SummaryCardProps {
  title: string;
  value?: number;
  dateRange?: DateRangeType;
  percentageChange?: number;
  isPercentageValue?: boolean;
  isLoading?: boolean;
  expenseRatio?: number;
  cardType: CardType;
}

const getCardStatus = (
  value: number,
  cardType: CardType,
  expenseRatio?: number
): CardStatus => {
  if (cardType === "savings") {
    if (value === 0) {
      return {
        label: "No Savings Record",
        color: "text-gray-400",
        Icon: TrendingDownIcon,
      };
    }

    // Check savings percentage first
    if (value < 10) {
      return {
        label: "Low Savings",
        color: "text-red-400",
        Icon: TrendingDownIcon,
        description: `Only ${value.toFixed(1)}% saved`,
      };
    }

    if (value < 20) {
      return {
        label: "Moderate",
        color: "text-yellow-400",
        Icon: TrendingDownIcon,
        description: `${expenseRatio?.toFixed(0)}% spent`,
      };
    }

    // High savings → check if expense ratio is unusually high for warning
    if (expenseRatio && expenseRatio > 75) {
      return {
        label: "High Spend",
        color: "text-red-400",
        Icon: TrendingDownIcon,
        description: `${expenseRatio.toFixed(0)}% spent`,
      };
    }

    if (expenseRatio && expenseRatio > 60) {
      return {
        label: "Warning: High Spend",
        color: "text-orange-400",
        Icon: TrendingDownIcon,
        description: `${expenseRatio.toFixed(0)}% spent`,
      };
    }

    return {
      label: "Good Savings",
      color: "text-green-400",
      Icon: TrendingUpIcon,
    };
  }

  if (value === 0) {
    const typeLabel =
      cardType === "income"
        ? "Income"
        : cardType === "expenses"
          ? "Expenses"
          : "Balance";

    return {
      label: `No ${typeLabel}`,
      color: "text-gray-400",
      Icon: TrendingDownIcon,
      description: ``,
    };
  }

  // For balance card when negative
  if (cardType === "balance" && value < 0) {
    return {
      label: "Overdrawn",
      color: "text-red-400",
      Icon: TrendingDownIcon,
      description: "Balance is negative",
    };
  }

  return {
    label: "",
    color: "",
    Icon: TrendingDownIcon,
  };
};

const getTrendDirection = (value: number, cardType: CardType) => {
  if (cardType === "expenses") {
    // For expenses, lower is better
    return value <= 0 ? "positive" : "negative";
  }
  // For income and balance, higher is better
  return value >= 0 ? "positive" : "negative";
};

const SummaryCard: FC<SummaryCardProps> = ({
  title,
  value = 0,
  dateRange,
  percentageChange,
  isPercentageValue,
  isLoading,
  expenseRatio,
  cardType = "balance",
}) => {
  const formatCurrency = useFormatCurrency();
  const status = getCardStatus(value, cardType, expenseRatio);
  const showTrend =
    percentageChange !== undefined &&
    percentageChange !== null &&
    cardType !== "savings";

  const trendDirection =
    showTrend && percentageChange !== 0
      ? getTrendDirection(percentageChange, cardType)
      : null;

  if (isLoading) {
    return (
      <Card className="!border-none !border-0 !gap-0 !bg-white/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 !pb-5">
          <Skeleton className="h-4 w-24 bg-white/30" />
        </CardHeader>
        <CardContent className="space-y-8">
          <Skeleton className="h-10.5 w-full bg-white/30" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-12 bg-white/30" />
            <Skeleton className="h-3 w-16 bg-white/30" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCountupValue = (val: number) => {
    return isPercentageValue
      ? formatPercentage(val, { decimalPlaces: 1 })
      : formatCurrency(val, {
        isExpense: cardType === "expenses",
        showSign: cardType === "balance" && val < 0,
      });
  };

  return (
    <div className="gsap-reveal w-full">
      <Card className="glass-card relative border-0 overflow-hidden group p-2">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-indigo-500/10 blur opacity-0 group-hover:opacity-100 transition duration-1000" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
          <CardTitle className="text-sm text-slate-400 font-medium uppercase tracking-wider">
            {title}
          </CardTitle>
          <div className="size-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/30 transition-colors">
            {/* Icon could go here if needed, but keeping it clean for now */}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 relative z-10">
          <div
            className={cn(
              "text-3xl lg:text-4xl font-black tracking-tighter glow-text py-1 break-words",
              cardType === "balance" && value < 0 ? "text-red-400" : "text-white"
            )}
          >
            <CountUp
              start={0}
              end={value}
              preserveValue
              decimals={2}
              decimalPlaces={2}
              formattingFn={formatCountupValue}
            />
          </div>

          <div className="text-xs font-medium mt-1">
            {cardType === "savings" ? (
              <div className="glass-pill w-fit animate-in fade-in slide-in-from-bottom-2 duration-700">
                <status.Icon className={cn("size-3.5", status.color)} />
                <span className={status.color}>
                  {status.label} {value !== 0 && `(${formatPercentage(value)})`}
                </span>
              </div>
            ) : dateRange?.value === DateRangeEnum.ALL_TIME ? (
              <span className="text-slate-500">All-time overview</span>
            ) : value === 0 || status.label ? (
              <div className="flex items-center gap-1.5 text-slate-500">
                <status.Icon className="size-3.5" />
                <span>{status.label || "No data"}</span>
              </div>
            ) : showTrend ? (
              <div className="flex items-center gap-2">
                {percentageChange !== 0 && (
                  <div
                    className={cn(
                      "glass-pill !py-0.5",
                      trendDirection === "positive"
                        ? "!text-emerald-400 !bg-emerald-500/10 !border-emerald-500/20"
                        : "!text-rose-400 !bg-rose-500/10 !border-rose-500/20"
                    )}
                  >
                    {trendDirection === "positive" ? (
                      <TrendingUpIcon className="size-3" />
                    ) : (
                      <TrendingDownIcon className="size-3" />
                    )}
                    <span className="text-[11px]">
                      {formatPercentage(Math.abs(percentageChange || 0), {
                        showSign: false,
                        decimalPlaces: 1,
                      })}%
                    </span>
                  </div>
                )}
                <span className="text-slate-500 text-[11px]">• vs last period</span>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCard;
