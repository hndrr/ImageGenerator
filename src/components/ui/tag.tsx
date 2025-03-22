import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const tagVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary/80 text-secondary-foreground hover:bg-secondary",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        expression:
          "border-transparent bg-blue-100 text-blue-700 hover:bg-blue-200",
        angle:
          "border-transparent bg-green-100 text-green-700 hover:bg-green-200",
        pose: "border-transparent bg-purple-100 text-purple-700 hover:bg-purple-200",
        accessory:
          "border-transparent bg-amber-100 text-amber-700 hover:bg-amber-200",
        background:
          "border-transparent bg-lime-100 text-lime-700 hover:bg-lime-200",
        style: "border-transparent bg-pink-100 text-pink-700 hover:bg-pink-200",
        weather:
          "border-transparent bg-cyan-100 text-cyan-700 hover:bg-cyan-200",
        mood: "border-transparent bg-rose-100 text-rose-700 hover:bg-rose-200",
        filter:
          "border-transparent bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
        time: "border-transparent bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
        lens: "border-transparent bg-violet-100 text-violet-700 hover:bg-violet-200",
        clothing:
          "border-transparent bg-orange-100 text-orange-700 hover:bg-orange-200",
        age: "border-transparent bg-sky-100 text-sky-700 hover:bg-sky-200",
        hairstyle:
          "border-transparent bg-red-100 text-red-700 hover:bg-red-200",
        haircolor:
          "border-transparent bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-200",
        lighting:
          "border-transparent bg-teal-100 text-teal-700 hover:bg-teal-200",
        image: "border-transparent bg-gray-100 text-gray-700 hover:bg-gray-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface TagProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagVariants> {
  onRemove?: () => void;
}

function Tag({ className, variant, onRemove, children, ...props }: TagProps) {
  return (
    <div className={cn(tagVariants({ variant }), className)} {...props}>
      {children}
      {onRemove && (
        <button
          type="button"
          className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          onClick={onRemove}
        >
          <X className="h-3 w-3" />
          <span className="sr-only">Remove</span>
        </button>
      )}
    </div>
  );
}

export { Tag, tagVariants };
