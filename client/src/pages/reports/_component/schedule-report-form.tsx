import { Button } from "@/components/ui/button";
import { Loader, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { useUpdateReportSettingMutation } from "@/features/report/reportAPI";
import { updateCredentials } from "@/features/auth/authSlice";
import { toast } from "sonner";
import { useEffect } from "react";

const formSchema = z.object({
  email: z.string(),
  frequency: z.string(),
  isEnabled: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const ScheduleReportForm = ({
  onCloseDrawer,
}: {
  onCloseDrawer: () => void;
}) => {
  const dispatch = useAppDispatch();
  const { user, reportSetting } = useTypedSelector((state) => state.auth);

  const [updateReportSetting, { isLoading }] = useUpdateReportSettingMutation();

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      isEnabled: true,
      frequency: "MONTHLY",
    },
  });

  useEffect(() => {
    if (user && reportSetting) {
      form.reset({
        email: user?.email,
        isEnabled: reportSetting?.isEnabled,
        frequency: reportSetting?.frequency,
      });
    }
  }, [user, form, reportSetting]);

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    const payload = { isEnabled: values.isEnabled };
    updateReportSetting(payload)
      .unwrap()
      .then(() => {
        dispatch(updateCredentials({ reportSetting: payload }));
        onCloseDrawer();
        toast.success("Report setting updated successfully");
      })
      .catch((error) => {
        toast.error(error.data.message || "Failed to update report setting");
      });
  };

  // Get summary text based on form values
  const getScheduleSummary = () => {
    if (!form.watch("isEnabled")) {
      return "Reports are currently deactivated";
    }
    return "Report will be sent once a month on the 1st day of the next month";
  };

  return (
    <div className="pt-5 px-2.5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="w-full space-y-6 flex-1 px-4">
            {/* Enable/Disable Switch */}
            <FormField
              control={form.control}
              name="isEnabled"
              render={({ field }) => (
                <FormItem
                  className="flex flex-row items-center justify-between 
                rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm shadow-sm"
                >
                  <div className="space-y-0.5">
                    <FormLabel className="text-base font-semibold">Monthly Reports</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {form.watch("isEnabled")
                        ? "Receive monthly insights via email"
                        : "Email notifications are disabled"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-primary"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="relative space-y-6">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-medium">Notification Email</FormLabel>
                    <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-lg px-3 focus-within:ring-1 focus-within:ring-primary/50 transition-all">
                      <Mail className="h-4 w-4 text-primary/70" />
                      <FormControl>
                        <Input
                          placeholder="Enter email address"
                          disabled={true}
                          {...field}
                          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-10"
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Frequency */}
              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-medium">Repeat Frequency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={true}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger className="bg-white/5 border-white/10 focus:ring-1 focus:ring-primary/50">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-slate-900 border-white/10">
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Disabled overlay */}
              {!form.watch("isEnabled") && (
                <div className="absolute -inset-2 bg-slate-950/20 backdrop-blur-[1px] z-10 rounded-xl" />
              )}
            </div>

            {/* Schedule Summary */}
            <div className="bg-primary/5 border border-primary/10 p-4 rounded-xl space-y-2">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Schedule Status
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {getScheduleSummary()}
              </p>
            </div>

            {/* Submit Button */}
            <div className="sticky bottom-0 py-2 z-50">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full text-white"
              >
                {isLoading && <Loader className="h-4 w-4 animate-spin" />}
                Save changes
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ScheduleReportForm;
