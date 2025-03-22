import React, { useState, useRef, KeyboardEvent } from "react";
import { Plus } from "lucide-react";
import { Tag } from "./tag";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  category?: string;
}

export function TagInput({
  tags,
  onTagsChange,
  placeholder = "タグを追加...",
  className,
  category,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const addTag = () => {
    if (inputValue.trim() !== "" && !tags.includes(inputValue.trim())) {
      onTagsChange([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeTag = (indexToRemove: number) => {
    onTagsChange(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <div className="flex flex-wrap gap-2 mb-2">
        {category && (
          <span className="text-sm font-medium text-muted-foreground mr-1">
            {category}:
          </span>
        )}
        {tags.map((tag, index) => (
          <Tag key={index} onRemove={() => removeTag(index)}>
            {tag}
          </Tag>
        ))}
      </div>
      <div className="flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 border-none bg-transparent p-0 text-sm outline-none placeholder:text-muted-foreground"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            addTag();
            inputRef.current?.focus();
          }}
          className="h-8 px-2"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
