import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ShieldCheck, Smartphone, ShieldAlert, History } from "lucide-react";
import { motion } from "framer-motion";
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { toggleTwoFactorAuth, toggleLoginAlerts } from "@/features/settings/settingsSlice";
import { toast } from "sonner";

const Security = () => {
    const dispatch = useAppDispatch();
    const { twoFactorAuth, loginAlerts } = useTypedSelector((state) => state.settings);

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Security</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your account security and authentication preferences.
                </p>
            </div>
            <Separator />

            <div className="space-y-4">
                {/* Two-Factor Authentication */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 border rounded-xl bg-white/5"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                            <Smartphone className="size-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Two-Factor Authentication</p>
                            <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
                        </div>
                    </div>
                    <Switch
                        checked={twoFactorAuth}
                        onCheckedChange={() => {
                            dispatch(toggleTwoFactorAuth());
                            toast.success(`2FA ${!twoFactorAuth ? 'Enabled' : 'Disabled'}`);
                        }}
                    />
                </motion.div>

                {/* Login Alerts */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-xl bg-white/5"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500">
                            <ShieldAlert className="size-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">Login Alerts</p>
                            <p className="text-xs text-muted-foreground">Get notified of suspicious login attempts.</p>
                        </div>
                    </div>
                    <Switch
                        checked={loginAlerts}
                        onCheckedChange={() => {
                            dispatch(toggleLoginAlerts());
                            toast.success(`Login alerts ${!loginAlerts ? 'Enabled' : 'Disabled'}`);
                        }}
                    />
                </motion.div>

                {/* Session History */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 border rounded-xl bg-white/5 space-y-4"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                                <History className="size-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Active Sessions</p>
                                <p className="text-xs text-muted-foreground">Device history where you are currently logged in.</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                            onClick={() => toast.info("Signing out from other devices...")}
                        >
                            Sign out all devices
                        </Button>
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                <span className="text-xs font-medium text-white">Windows PC • Chrome</span>
                            </div>
                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded uppercase">Current</span>
                        </div>
                        <div className="flex items-center justify-between opacity-60">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                                <span className="text-xs font-medium text-white">iPhone 13 • Safari</span>
                            </div>
                            <span className="text-[10px] text-gray-400">2 hours ago</span>
                        </div>
                    </div>
                </motion.div>

                {/* Password Reset */}
                <div className="flex items-center justify-between pt-4">
                    <div className="space-y-1">
                        <p className="text-sm font-medium">Reset Password</p>
                        <p className="text-xs text-muted-foreground italic">Last changed 3 months ago</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => toast.info("Password reset link sent to your email.")}
                    >
                        <ShieldCheck className="size-4" />
                        Change Password
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Security;
