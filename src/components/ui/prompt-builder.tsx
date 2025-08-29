import React, { useState } from "react";
import { PlusCircle, X } from "lucide-react";
import { TagInput } from "./tag-input";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { cn } from "@/lib/utils";

export interface PromptCategory {
  name: string;
  tags: string[];
}

export interface PromptType {
  positive: PromptCategory[];
  negative: PromptCategory[];
}

interface PromptBuilderProps {
  prompt: PromptType;
  onPromptChange: (prompt: PromptType) => void;
  className?: string;
}

export function PromptBuilder({
  prompt,
  onPromptChange,
  className,
}: PromptBuilderProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [activeTab, setActiveTab] = useState<"positive" | "negative">(
    "positive"
  );

  const handleAddCategory = (type: "positive" | "negative") => {
    if (newCategoryName.trim() === "") return;

    const newPrompt = { ...prompt };
    newPrompt[type] = [
      ...newPrompt[type],
      { name: newCategoryName.trim(), tags: [] },
    ];

    onPromptChange(newPrompt);
    setNewCategoryName("");
  };

  const handleRemoveCategory = (
    type: "positive" | "negative",
    index: number
  ) => {
    const newPrompt = { ...prompt };
    newPrompt[type] = newPrompt[type].filter((_, i) => i !== index);
    onPromptChange(newPrompt);
  };

  const handleTagsChange = (
    type: "positive" | "negative",
    categoryIndex: number,
    newTags: string[]
  ) => {
    const newPrompt = { ...prompt };
    newPrompt[type][categoryIndex].tags = newTags;
    onPromptChange(newPrompt);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex border-b mb-4">
        <button
          className={cn(
            "py-2 px-4 -mb-px font-medium",
            activeTab === "positive"
              ? "border-b-2 border-primary"
              : "text-muted-foreground"
          )}
          onClick={() => setActiveTab("positive")}
        >
          ポジティブプロンプト
        </button>
        <button
          className={cn(
            "py-2 px-4 -mb-px font-medium",
            activeTab === "negative"
              ? "border-b-2 border-destructive"
              : "text-muted-foreground"
          )}
          onClick={() => setActiveTab("negative")}
        >
          ネガティブプロンプト
        </button>
      </div>

      <div>
        {prompt[activeTab].map((category, index) => (
          <Card key={index} className="mb-4">
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">
                {category.name}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleRemoveCategory(activeTab, index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="py-2 px-4">
              <TagInput
                category={category.name}
                tags={category.tags}
                onTagsChange={(newTags) =>
                  handleTagsChange(activeTab, index, newTags)
                }
                placeholder="タグを追加..."
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="新しいカテゴリー名..."
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddCategory(activeTab);
            }
          }}
        />
        <Button
          onClick={() => handleAddCategory(activeTab)}
          size="sm"
          className="h-10"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          追加
        </Button>
      </div>
    </div>
  );
}
