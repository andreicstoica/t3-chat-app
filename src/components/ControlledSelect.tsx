import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { SelectGroup } from "@radix-ui/react-select";

interface ControlledSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

function ControlledSelect({ value, onValueChange }: ControlledSelectProps) {
  return (
    <Select value={value} onValueChange={(value) => onValueChange(value)}>
      <SelectTrigger className="w-auto">
        {" "}
        {/* Adjusted width for better visibility */}
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Model</SelectLabel>
          <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
          <SelectItem value="gpt-4o-mini">gpt4o-mini</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default ControlledSelect;
