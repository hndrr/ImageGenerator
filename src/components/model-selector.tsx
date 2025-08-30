import { Cpu } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const models = [
  {
    value: "gemini-2.5-flash-image-preview",
    label: "Gemini 2.5 Flash Image (Nano Banana🍌)",
    responseModalities: ["TEXT", "IMAGE"],
  },
  {
    value: "gemini-2.0-flash-preview-image-generation",
    label: "Gemini 2.0 Flash Preview Image Generation",
    responseModalities: ["TEXT", "IMAGE"],
  },
  {
    value: "gemini-2.0-flash-exp-image-generation",
    label: "Gemini 2.0 Flash Experimental Image Generation",
    responseModalities: ["TEXT", "IMAGE"],
  },
];

export { models };

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <div className="space-y-2">
      <Label className="text-lg font-semibold">
        <Cpu className="inline-block mr-2 h-5 w-5" />
        モデル選択
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full border-border">
          <SelectValue placeholder="モデルを選択してください" />
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.value} value={model.value}>
              <div className="flex flex-col">
                <span className="font-medium text-left">{model.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
