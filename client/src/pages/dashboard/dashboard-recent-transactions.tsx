import { Link } from "react-router-dom";
import TransactionTable from "@/components/transaction/transaction-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";

const DashboardRecentTransactions = () => {
  return (
    <Card className="glass-card gsap-reveal !shadow-none border-0 mt-6 relative overflow-hidden group">
      {/* Animated orbit glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full pointer-events-none transition-all duration-700 group-hover:bg-primary/20" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

      <CardHeader className="!pb-0 relative z-10">
        <div className="flex items-center justify-between w-full">
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">Recent Transactions</CardTitle>
            <CardDescription className="text-white/40 mt-0.5">Your latest financial activity</CardDescription>
          </div>
          <Button
            asChild
            size="sm"
            className="glow-btn bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/40 text-white/70 hover:text-white text-xs px-4 transition-all duration-300"
          >
            <Link to={PROTECTED_ROUTES.TRANSACTIONS}>View all →</Link>
          </Button>
        </div>
        {/* Gradient Divider */}
        <div className="h-px w-full mt-4 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </CardHeader>
      <CardContent className="pt-2 relative z-10">
        <TransactionTable pageSize={10} isShowPagination={false} />
      </CardContent>
    </Card>
  );
};

export default DashboardRecentTransactions;
