import { formatTimezoneOffset } from "@/lib/formatters";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useFormContext } from "react-hook-form";

export default function TimezoneFormField() {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name="timezone"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Timezone</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select a timezone" />
              </SelectTrigger>
              <SelectContent>
                {Intl.supportedValuesOf("timeZone").map((timezone) => (
                  <SelectItem key={timezone} value={timezone}>
                    {timezone} ({formatTimezoneOffset(timezone)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormDescription>Select your timezone</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
