import { useState, useEffect } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Tag } from "./tag";
import {
  ImageIcon,
  CameraIcon as AngleIcon,
  User as PoseIcon,
  GlassesIcon,
  MountainIcon,
  BrushIcon,
  ClockIcon,
  HeartIcon,
  FilterIcon,
  CloudIcon,
  ApertureIcon,
  ShirtIcon,
  SmileIcon,
  CalendarIcon,
  ScissorsIcon,
  PaintbrushIcon,
  LampIcon,
  Plus,
  X,
} from "lucide-react";
import {
  angleTemplates,
  poseTemplates,
  accessoryTemplates,
  backgroundTemplates,
  styleTemplates,
  weatherTemplates,
  moodTemplates,
  filterTemplates,
  timeTemplates,
  lensTemplates,
  clothingTemplates,
  expressionTemplates,
  ageTemplates,
  hairstyleTemplates,
  haircolorTemplates,
  lightingTemplates,
} from "@/lib/templates";

interface TemplateItem {
  label: string;
  text: string;
}

interface TemplateButtonProps {
  icon: React.ReactNode;
  label: string;
  templates: TemplateItem[];
  onSelect: (template: TemplateItem) => void;
  disabled?: boolean;
}

function TemplateButton({
  icon,
  label,
  templates,
  onSelect,
  disabled = false,
}: TemplateButtonProps) {
  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 gap-1"
        disabled={disabled}
      >
        {icon}
        <span>{label}</span>
      </Button>
      <div className="absolute top-full max-md:-ml-4 left-0 mt-1 max-md:w-[140px] w-48 py-1 bg-popover rounded-md shadow-md border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-[300px] overflow-y-auto">
        {templates.map((template) => (
          <button
            key={template.label}
            onClick={() => onSelect(template)}
            className="w-full px-2 py-1.5 text-sm text-left hover:bg-accent hover:text-accent-foreground hover:font-medium truncate"
          >
            {template.label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface ImageReferenceButtonProps {
  images: Array<{ id: string; filename: string }>;
  onSelect: (filename: string) => void;
}

function ImageReferenceButton({ images, onSelect }: ImageReferenceButtonProps) {
  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2 gap-1"
        disabled={!(images.length > 0)}
      >
        <ImageIcon className="h-4 w-4" />
        <span>画像名</span>
      </Button>
      <div className="absolute top-full left-0 mt-1 w-48 py-1 bg-popover rounded-md shadow-md border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        {images.length > 0 &&
          images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => onSelect(image.filename)}
              className="w-full px-2 py-1.5 text-sm text-left hover:bg-accent hover:text-accent-foreground hover:font-medium truncate"
            >
              {`image_${index + 1}: ${image.filename}`}
            </button>
          ))}
      </div>
    </div>
  );
}

// タグに関連する型定義
export interface TagData {
  [category: string]: string[];
}

export interface PromptData {
  positive: TagData;
  negative: TagData;
}

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  onTagsChange?: (tags: TagData) => void;
  placeholder?: string;
  className?: string;
  images?: Array<{ id: string; filename: string }>;
  isNegativePrompt?: boolean;
}

// カテゴリと関連タグの型定義
interface TagCategory {
  name: string;
  tags: string[];
  expanded?: boolean;
}

const systemPrompt =
  "Please follow the instructions below to change the image:";

const negativeSystemPrompt =
  "[NEGATIVE PROMPT] Do not include the following elements in the generated image:";

type TagVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "expression"
  | "angle"
  | "pose"
  | "accessory"
  | "background"
  | "style"
  | "weather"
  | "mood"
  | "filter"
  | "time"
  | "lens"
  | "clothing"
  | "age"
  | "hairstyle"
  | "haircolor"
  | "lighting"
  | "image";

const getTagVariant = (categoryName: string): TagVariant => {
  const lowerCaseName = categoryName.toLowerCase();

  if (lowerCaseName.includes("表情") || lowerCaseName.includes("expression"))
    return "expression";
  if (lowerCaseName.includes("アングル") || lowerCaseName.includes("angle"))
    return "angle";
  if (lowerCaseName.includes("ポーズ") || lowerCaseName.includes("pose"))
    return "pose";
  if (
    lowerCaseName.includes("アクセサリー") ||
    lowerCaseName.includes("accessory")
  )
    return "accessory";
  if (lowerCaseName.includes("背景") || lowerCaseName.includes("background"))
    return "background";
  if (lowerCaseName.includes("スタイル") || lowerCaseName.includes("style"))
    return "style";
  if (lowerCaseName.includes("天気") || lowerCaseName.includes("weather"))
    return "weather";
  if (lowerCaseName.includes("ムード") || lowerCaseName.includes("mood"))
    return "mood";
  if (lowerCaseName.includes("フィルター") || lowerCaseName.includes("filter"))
    return "filter";
  if (lowerCaseName.includes("時間") || lowerCaseName.includes("time"))
    return "time";
  if (lowerCaseName.includes("レンズ") || lowerCaseName.includes("lens"))
    return "lens";
  if (lowerCaseName.includes("服装") || lowerCaseName.includes("clothing"))
    return "clothing";
  if (lowerCaseName.includes("年齢") || lowerCaseName.includes("age"))
    return "age";
  if (lowerCaseName.includes("髪型") || lowerCaseName.includes("hairstyle"))
    return "hairstyle";
  if (lowerCaseName.includes("髪色") || lowerCaseName.includes("haircolor"))
    return "haircolor";
  if (lowerCaseName.includes("照明") || lowerCaseName.includes("lighting"))
    return "lighting";
  if (lowerCaseName.includes("画像") || lowerCaseName.includes("image"))
    return "image";

  // デフォルトはsecondary
  return "secondary";
};

export function TipTapEditor({
  value,
  onChange,
  onTagsChange,
  placeholder = "画像生成の指示を入力してください",
  className,
  images = [],
  isNegativePrompt = false,
}: TipTapEditorProps) {
  // タグ関連の状態
  const [tagCategories, setTagCategories] = useState<TagCategory[]>([]);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number | null>(
    null
  );
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newTagName, setNewTagName] = useState("");

  // タグから構造化データを生成
  useEffect(() => {
    if (onTagsChange) {
      const tagData: TagData = {};
      tagCategories.forEach((category) => {
        if (category.tags.length > 0) {
          tagData[category.name] = [...category.tags];
        }
      });
      onTagsChange(tagData);

      // テキストプロンプトも更新
      updateTextPrompt(tagCategories);
    }
  }, [tagCategories, onTagsChange]);

  // テキストプロンプトを更新する関数
  const updateTextPrompt = (categories: TagCategory[]) => {
    const promptLines: string[] = [];

    categories.forEach((category) => {
      if (category.tags.length > 0) {
        promptLines.push(`- ${category.name}: ${category.tags.join(", ")}`);
      }
    });

    const systemPromptText = isNegativePrompt
      ? negativeSystemPrompt
      : systemPrompt;

    const customPrompt =
      promptLines.length > 0
        ? `${systemPromptText}\n\n${promptLines.join("\n")}`
        : "";

    onChange(customPrompt);
  };

  // HTMLコンテンツを処理するユーティリティ関数
  const processContent = (html: string) => {
    if (!html || html === "<p></p>") {
      return "";
    }

    // HTMLから<p>と</p>タグを削除
    const cleanedHtml = html.replace(/<p>/g, "").replace(/<\/p>/g, "");

    // <br>タグで分割してライン配列を作成
    let lines = cleanedHtml.split(/<br\/?>/g);

    // 各ラインをトリムして空のラインを削除
    lines = lines.map((line) => line.trim()).filter((line) => line.length > 0);

    // 各ラインの先頭に「- 」がなければ追加（画像の場合は除く）
    lines = lines.map((line) =>
      line.startsWith("-") ? line : line.startsWith("![") ? line : `- ${line}`
    );

    // 改行で結合
    return lines.join("\n");
  };

  // 最終的なプロンプトを作成する関数
  const createFinalPrompt = (content: string) => {
    if (!content) {
      return "";
    }

    // ネガティブプロンプトの場合は専用のシステムプロンプトを付ける
    if (isNegativePrompt) {
      return `${negativeSystemPrompt}\n\n${content}`;
    }

    return `${systemPrompt}\n\n${content}`;
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        codeBlock: false,
        heading: false,
        orderedList: false,
        blockquote: false,
        hardBreak: {
          keepMarks: true,
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "min-h-[200px] outline-none",
      },
      handleKeyDown: (view, event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          const br = view.state.schema.nodes.hardBreak.create();
          view.dispatch(view.state.tr.replaceSelectionWith(br));
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const content = processContent(html);
      const finalContent = createFinalPrompt(content);
      onChange(finalContent);
    },
  });

  if (!editor) {
    return null;
  }

  const insertTemplate = (text: string) => {
    // テンプレートからタグを追加
    const colonIndex = text.indexOf(":");
    if (colonIndex > 0) {
      const category = text.substring(0, colonIndex).trim();
      const tag = text.substring(colonIndex + 1).trim();

      // カテゴリが存在するか確認
      const categoryIndex = tagCategories.findIndex(
        (c) => c.name.toLowerCase() === category.toLowerCase()
      );

      if (categoryIndex === -1) {
        // カテゴリが存在しない場合は作成
        setTagCategories([
          ...tagCategories,
          {
            name: category,
            tags: [tag],
            expanded: true,
          },
        ]);
      } else {
        // カテゴリが存在する場合はタグを追加
        const newCategories = [...tagCategories];
        if (!newCategories[categoryIndex].tags.includes(tag)) {
          newCategories[categoryIndex].tags.push(tag);
          setTagCategories(newCategories);
        }
      }
    }
  };

  // タグに関連する関数
  const addCategory = () => {
    if (newCategoryName.trim()) {
      setTagCategories([
        ...tagCategories,
        { name: newCategoryName.trim(), tags: [], expanded: true },
      ]);
      setNewCategoryName("");
    }
  };

  const removeCategory = (index: number) => {
    const newCategories = [...tagCategories];
    newCategories.splice(index, 1);
    setTagCategories(newCategories);
  };

  const addTag = (categoryIndex: number) => {
    if (newTagName.trim()) {
      const newCategories = [...tagCategories];
      newCategories[categoryIndex].tags.push(newTagName.trim());
      setTagCategories(newCategories);
      setNewTagName("");
    }
  };

  const removeTag = (categoryIndex: number, tagIndex: number) => {
    const newCategories = [...tagCategories];
    newCategories[categoryIndex].tags.splice(tagIndex, 1);
    setTagCategories(newCategories);
  };

  const toggleCategoryExpand = (index: number) => {
    const newCategories = [...tagCategories];
    newCategories[index].expanded = !newCategories[index].expanded;
    setTagCategories(newCategories);
  };

  const handleTemplateSelect = (template: TemplateItem) => {
    insertTemplate(template.text);
  };

  return (
    <div className={cn("space-y-2 border border-border rounded-lg", className)}>
      <div className="p-4">
        <div className="space-y-2">
          {tagCategories.map((category, catIndex) => (
            <div key={catIndex} className="mb-2">
              <h3 className="text-sm font-medium mb-1">{category.name}</h3>
              <div className="flex flex-wrap gap-1">
                {category.tags.map((tag, tagIndex) => (
                  <Tag
                    key={tagIndex}
                    variant={getTagVariant(category.name)}
                    onRemove={() => removeTag(catIndex, tagIndex)}
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>
          ))}
          {tagCategories.length === 0 && (
            <p className="text-sm text-muted-foreground">
              下のボタンを使ってタグを追加してください
            </p>
          )}
        </div>
      </div>

      <div className="px-2 flex flex-wrap gap-2 border-t pt-2 pb-1 bg-muted/20">
        <TemplateButton
          icon={<SmileIcon className="h-4 w-4" />}
          label="表情"
          templates={expressionTemplates}
          onSelect={handleTemplateSelect}
        />
        <TemplateButton
          icon={<AngleIcon className="h-4 w-4" />}
          label="アングル"
          templates={angleTemplates}
          onSelect={handleTemplateSelect}
        />
        <TemplateButton
          icon={<PoseIcon className="h-4 w-4" />}
          label="ポーズ"
          templates={poseTemplates}
          onSelect={handleTemplateSelect}
        />
        <TemplateButton
          icon={<GlassesIcon className="h-4 w-4" />}
          label="アクセサリー"
          templates={accessoryTemplates}
          onSelect={handleTemplateSelect}
        />
        <TemplateButton
          icon={<MountainIcon className="h-4 w-4" />}
          label="背景"
          templates={backgroundTemplates}
          onSelect={handleTemplateSelect}
        />
        <TemplateButton
          icon={<BrushIcon className="h-4 w-4" />}
          label="スタイル"
          templates={styleTemplates}
          onSelect={handleTemplateSelect}
        />
        <TemplateButton
          icon={<CloudIcon className="h-4 w-4" />}
          label="天気"
          templates={weatherTemplates}
          onSelect={handleTemplateSelect}
        />
        <TemplateButton
          icon={<HeartIcon className="h-4 w-4" />}
          label="ムード"
          templates={moodTemplates}
          onSelect={handleTemplateSelect}
        />
        <TemplateButton
          icon={<FilterIcon className="h-4 w-4" />}
          label="フィルター"
          templates={filterTemplates}
          onSelect={handleTemplateSelect}
        />
        <TemplateButton
          icon={<ClockIcon className="h-4 w-4" />}
          label="時間"
          templates={timeTemplates}
          onSelect={handleTemplateSelect}
        />
        <TemplateButton
          icon={<ApertureIcon className="h-4 w-4" />}
          label="レンズ"
          templates={lensTemplates}
          onSelect={handleTemplateSelect}
        />
        <TemplateButton
          icon={<ShirtIcon className="h-4 w-4" />}
          label="服装"
          templates={clothingTemplates}
          onSelect={handleTemplateSelect}
        />
        <TemplateButton
          icon={<CalendarIcon className="h-4 w-4" />}
          label="年齢"
          templates={ageTemplates}
          onSelect={handleTemplateSelect}
        />
        <TemplateButton
          icon={<ScissorsIcon className="h-4 w-4" />}
          label="髪型"
          templates={hairstyleTemplates}
          onSelect={handleTemplateSelect}
        />
        <TemplateButton
          icon={<PaintbrushIcon className="h-4 w-4" />}
          label="髪色"
          templates={haircolorTemplates}
          onSelect={handleTemplateSelect}
        />
        <TemplateButton
          icon={<LampIcon className="h-4 w-4" />}
          label="照明"
          templates={lightingTemplates}
          onSelect={handleTemplateSelect}
        />
        {images.length > 0 && (
          <ImageReferenceButton
            images={images}
            onSelect={(filename) => {
              // 画像参照をタグとして扱う
              const newCategories = [...tagCategories];
              const imageIndex =
                images.findIndex((img) => img.filename === filename) + 1;

              // 画像カテゴリを探す
              const imageCategoryIndex = newCategories.findIndex(
                (c) => c.name === "画像参照"
              );

              if (imageCategoryIndex === -1) {
                // カテゴリが存在しない場合は作成
                newCategories.push({
                  name: "画像参照",
                  tags: [`image_${imageIndex}: ${filename}`],
                  expanded: true,
                });
              } else {
                // カテゴリが存在する場合はタグを追加
                newCategories[imageCategoryIndex].tags.push(
                  `image_${imageIndex}: ${filename}`
                );
              }

              setTagCategories(newCategories);
            }}
          />
        )}
      </div>

      <div className="px-4 py-3 border-t space-y-4">
        <div className="flex flex-wrap gap-2">
          {tagCategories.map((category, catIndex) => (
            <div
              key={catIndex}
              className="border rounded-md overflow-hidden w-full md:w-[calc(50%-0.5rem)]"
            >
              <div className="bg-muted/20 px-3 py-2 flex items-center justify-between">
                <h3 className="font-medium text-sm">{category.name}</h3>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => toggleCategoryExpand(catIndex)}
                  >
                    {category.expanded ? "-" : "+"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-destructive"
                    onClick={() => removeCategory(catIndex)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {category.expanded && (
                <div className="p-2">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {category.tags.map((tag, tagIndex) => (
                      <Tag
                        key={tagIndex}
                        variant={getTagVariant(category.name)}
                        onRemove={() => removeTag(catIndex, tagIndex)}
                      >
                        {tag}
                      </Tag>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={activeCategoryIndex === catIndex ? newTagName : ""}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onFocus={() => setActiveCategoryIndex(catIndex)}
                      placeholder="新しいタグ..."
                      className="flex-1 text-sm px-2 py-1 border rounded"
                    />
                    <Button
                      size="sm"
                      className="h-7"
                      onClick={() => addTag(catIndex)}
                      disabled={
                        activeCategoryIndex !== catIndex || !newTagName.trim()
                      }
                    >
                      追加
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="新しいカテゴリ..."
            className="flex-1 px-3 py-1.5 border rounded-md"
          />
          <Button onClick={addCategory} disabled={!newCategoryName.trim()}>
            <Plus className="h-4 w-4 mr-1" />
            カテゴリ追加
          </Button>
        </div>
      </div>
    </div>
  );
}
