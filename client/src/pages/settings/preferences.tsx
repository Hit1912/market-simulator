import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Globe, Coins, Mail } from "lucide-react";
import { motion } from "framer-motion";

const Preferences = () => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Preferences</h3>
                <p className="text-sm text-muted-foreground">
                    Management your regional settings and notification preferences.
                </p>
            </div>
            <Separator />

            <div className="space-y-6">
                {/* Regional Settings */}
                <div className="space-y-4">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                        <Globe className="size-4 text-primary" /> Regional & Currency
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs text-muted-foreground">Default Currency</label>
                            <Select defaultValue="INR">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Currency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="INR">INR (₹) - Indian Rupee</SelectItem>
                                    <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                                    <SelectItem value="EUR">EUR (€) - Euro</SelectItem>
                                    <SelectItem value="GBP">GBP (£) - British Pound</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-muted-foreground">Language</label>
                            <Select defaultValue="en">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="en">English (US)</SelectItem>
                                    <SelectItem value="hi">Hindi (हिन्दी)</SelectItem>
                                    <SelectItem value="gu">Gujarati (ગુજરાતી)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Notification Settings */}
                <div className="space-y-4">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                        <Bell className="size-4 text-primary" /> Notifications
                    </h4>

                    <div className="space-y-3">
                        <motion.div
                            whileHover={{ x: 5 }}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Mail className="size-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm">Email Reports</p>
                                    <p className="text-[11px] text-muted-foreground">Receive weekly summaries of your spending.</p>
                                </div>
                            </div>
                            <Switch defaultChecked />
                        </motion.div>

                        <motion.div
                            whileHover={{ x: 5 }}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Bell className="size-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm">Push Notifications</p>
                                    <p className="text-[11px] text-muted-foreground">Alerts for unusual spending patterns.</p>
                                </div>
                            </div>
                            <Switch />
                        </motion.div>
                    </div>
                </div>

                <Separator />

                {/* Layout Settings */}
                <div className="space-y-4">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                        <Coins className="size-4 text-primary" /> Display Options
                    </h4>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                        <div>
                            <p className="text-sm">Show decimal places</p>
                            <p className="text-[11px] text-muted-foreground">Always show two decimal digits in transactions.</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preferences;
