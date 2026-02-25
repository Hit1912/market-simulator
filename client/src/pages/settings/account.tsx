import { Separator } from "@/components/ui/separator"
import { AccountForm } from "./_components/account-form"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Loader2 } from "lucide-react"
import { useDeleteAccountMutation } from "@/features/user/userAPI"
import { useAppDispatch } from "@/app/hook"
import { logout } from "@/features/auth/authSlice"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { AUTH_ROUTES } from "@/routes/common/routePath"

const Account = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [deleteAccount, { isLoading }] = useDeleteAccountMutation();

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you absolutely sure you want to delete your account? This action is irreversible and all your data (transactions, reports) will be permanently deleted."
    );

    if (confirmed) {
      try {
        const response: any = await deleteAccount().unwrap();
        toast.success(response.message || "Account deleted successfully");
        dispatch(logout());
        navigate(AUTH_ROUTES.LOGIN);
      } catch (error: any) {
        toast.error(error.data?.message || "Failed to delete account. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings and manage your profile.
        </p>
      </div>
      <Separator />
      <AccountForm />

      <div className="pt-10">
        <div className="space-y-4 rounded-xl border border-red-500/20 bg-red-500/5 p-6">
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-red-400 flex items-center gap-2">
              <AlertTriangle className="size-4" /> Danger Zone
            </h4>
            <p className="text-[13px] text-muted-foreground">
              Irreversibly delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={isLoading}
            className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border-red-500/20"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Account