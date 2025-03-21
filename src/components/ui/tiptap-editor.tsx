import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";
import { Button } from "./button";
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
  onSelect: (text: string) => void;
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
      <div className="absolute top-full left-0 mt-1 max-md:w-36 w-48 py-1 bg-popover rounded-md shadow-md border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-[300px] overflow-y-auto">
        {templates.map((template) => (
          <button
            key={template.label}
            onClick={() => onSelect(template.text)}
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

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  images?: Array<{ id: string; filename: string }>;
  selectedSize?: string;
}

const systemPrompt =
  "Please follow the instructions below to change the image:";

export function TipTapEditor({
  value,
  onChange,
  placeholder = "画像生成の指示を入力してください",
  className,
  images = [],
}: TipTapEditorProps) {
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
      console.log("Original HTML:", html);

      const content = processContent(html);
      console.log("Processed content:", content);

      const finalContent = createFinalPrompt(content);
      console.log("Final content:", finalContent);

      onChange(finalContent);
    },
  });

  if (!editor) {
    return null;
  }

  const insertTemplate = (text: string) => {
    const currentContent = editor.getHTML();
    const isEmpty = currentContent === "" || currentContent === "<p></p>";

    if (isEmpty) {
      editor.chain().focus().setContent(`<p>- ${text}</p>`).run();
    } else {
      editor.chain().focus().insertContent(`<br>- ${text}`).run();
    }

    // テンプレート挿入後に明示的にプロンプトを更新
    setTimeout(() => {
      const updatedContent = editor.getHTML();
      const content = processContent(updatedContent);
      if (content) {
        onChange(createFinalPrompt(content));
      }
    }, 0);
  };

  const insertImageReference = (filename: string) => {
    const imageNumber =
      images.findIndex((img) => img.filename === filename) + 1;
    const imageRef = `![image_${imageNumber}](${filename})`;
    const currentContent = editor.getHTML();
    const isEmpty = currentContent === "" || currentContent === "<p></p>";

    if (isEmpty) {
      editor.chain().focus().setContent(`<p>${imageRef}</p>`).run();
    } else {
      editor.chain().focus().insertContent(`<br>${imageRef}`).run();
    }

    // 画像参照挿入後に明示的にプロンプトを更新
    setTimeout(() => {
      const updatedContent = editor.getHTML();
      const content = processContent(updatedContent);
      if (content) {
        onChange(createFinalPrompt(content));
      }
    }, 0);
  };

  return (
    <div className="space-y-2 border border-border rounded-lg">
      <div className="flex items-center gap-1 rounded-t-md border-b border-border bg-transparent p-1.5 flex-wrap">
        <ImageReferenceButton images={images} onSelect={insertImageReference} />

        <TemplateButton
          icon={<CalendarIcon className="h-4 w-4" />}
          label="年齢"
          templates={ageTemplates}
          onSelect={insertTemplate}
        />

        <TemplateButton
          icon={<SmileIcon className="h-4 w-4" />}
          label="表情"
          templates={expressionTemplates}
          onSelect={insertTemplate}
        />

        <TemplateButton
          icon={<PoseIcon className="h-4 w-4" />}
          label="ポーズ"
          templates={poseTemplates}
          onSelect={insertTemplate}
        />

        <TemplateButton
          icon={<ScissorsIcon className="h-4 w-4" />}
          label="髪型"
          templates={hairstyleTemplates}
          onSelect={insertTemplate}
        />

        <TemplateButton
          icon={<PaintbrushIcon className="h-4 w-4" />}
          label="髪色"
          templates={haircolorTemplates}
          onSelect={insertTemplate}
        />

        <TemplateButton
          icon={<ShirtIcon className="h-4 w-4" />}
          label="服装"
          templates={clothingTemplates}
          onSelect={insertTemplate}
        />

        <TemplateButton
          icon={<GlassesIcon className="h-4 w-4" />}
          label="小道具"
          templates={accessoryTemplates}
          onSelect={insertTemplate}
        />

        <TemplateButton
          icon={<AngleIcon className="h-4 w-4" />}
          label="アングル"
          templates={angleTemplates}
          onSelect={insertTemplate}
        />

        <TemplateButton
          icon={<ApertureIcon className="h-4 w-4" />}
          label="レンズ"
          templates={lensTemplates}
          onSelect={insertTemplate}
        />

        <TemplateButton
          icon={<MountainIcon className="h-4 w-4" />}
          label="背景"
          templates={backgroundTemplates}
          onSelect={insertTemplate}
        />

        <TemplateButton
          icon={<ClockIcon className="h-4 w-4" />}
          label="時間"
          templates={timeTemplates}
          onSelect={insertTemplate}
        />

        <TemplateButton
          icon={<CloudIcon className="h-4 w-4" />}
          label="天気"
          templates={weatherTemplates}
          onSelect={insertTemplate}
        />

        <TemplateButton
          icon={<LampIcon className="h-4 w-4" />}
          label="照明"
          templates={lightingTemplates}
          onSelect={insertTemplate}
        />

        <TemplateButton
          icon={<HeartIcon className="h-4 w-4" />}
          label="雰囲気"
          templates={moodTemplates}
          onSelect={insertTemplate}
        />

        <TemplateButton
          icon={<FilterIcon className="h-4 w-4" />}
          label="フィルター"
          templates={filterTemplates}
          onSelect={insertTemplate}
        />

        <TemplateButton
          icon={<BrushIcon className="h-4 w-4" />}
          label="スタイル"
          templates={styleTemplates}
          onSelect={insertTemplate}
        />
      </div>

      <div className={cn("rounded-b-md bg-transparent", className)}>
        <EditorContent
          editor={editor}
          className="px-4 pb-3 min-h-[200px] prose prose-sm max-w-none prose-invert focus:outline-none [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:px-1 [&_.ProseMirror]:h-full [&_.ProseMirror]:overflow-y-auto [&_.ProseMirror]:whitespace-pre-wrap"
        />
      </div>
    </div>
  );
}
