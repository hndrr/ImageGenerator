import { cn } from "@/lib/utils";
import { Button } from "./button";

interface SizeSelectorProps {
  value: string;
  onChange: (size: string) => void;
}

const sizes = [
  {
    label: "16:9",
    value: "wide rectangular image with 16:9 aspect ratio",
    description: "ワイド",
  },
  {
    label: "9:16",
    value: "wide rectangular image with 9:16 aspect ratio",
    description: "ランドスケープ",
  },
  {
    label: "4:3",
    value: "rectangular image with 4:3 aspect ratio",
    description: "スタンダード",
  },
  {
    label: "3:4",
    value: "rectangular image with 3:4 aspect ratio",
    description: "ポートレート",
  },
  {
    label: "1:1",
    value: "square image with 1:1 aspect ratio",
    description: "正方形",
  },
];

export function SizeSelector({ value, onChange }: SizeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
      {sizes.map((size) => (
        <Button
          key={size.value}
          variant={value === size.value ? "default" : "outline"}
          className={cn(
            "flex flex-col items-center py-3 h-auto gap-1",
            value === size.value && "bg-primary text-primary-foreground"
          )}
          onClick={() => onChange(size.value)}
        >
          <span className="text-sm font-medium">{size.label}</span>
          <span className="text-xs opacity-70">{size.description}</span>
        </Button>
      ))}
    </div>
  );
}
