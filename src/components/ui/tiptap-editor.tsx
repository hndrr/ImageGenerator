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
  PaletteIcon,
  BrushIcon,
  ClockIcon,
  HeartIcon,
  FilterIcon,
  CloudIcon,
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
} from "@/lib/templates";

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
  selectedSize,
}: TipTapEditorProps) {
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
      const content = editor
        .getHTML()
        .replace(/<p>/g, "")
        .replace(/<\/p>/g, "")
        .split(/<br\/?>/g)
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line) => (line.startsWith("-") ? line : `- ${line}`))
        .join("\n");

      if (!content) {
        onChange("");
        return;
      }

      let finalContent = `${systemPrompt}\n\n${content}`;

      // selectedSizeがある場合はpromptに追加
      if (selectedSize) {
        finalContent = `${systemPrompt}\n\n- ${selectedSize}\n${content}`;
      }

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
  };

  const insertAngleTemplate = (text: string) => {
    insertTemplate(text);
  };

  const insertPoseTemplate = (text: string) => {
    insertTemplate(text);
  };

  const insertAccessoryTemplate = (text: string) => {
    insertTemplate(text);
  };

  const insertBackgroundTemplate = (text: string) => {
    insertTemplate(text);
  };

  const insertStyleTemplate = (text: string) => {
    insertTemplate(text);
  };

  const insertTimeTemplate = (text: string) => {
    insertTemplate(text);
  };

  const insertWeatherTemplate = (text: string) => {
    insertTemplate(text);
  };

  const insertMoodTemplate = (text: string) => {
    insertTemplate(text);
  };

  const insertFilterTemplate = (text: string) => {
    insertTemplate(text);
  };

  return (
    <div className="space-y-2 border border-border rounded-lg">
      <div className="flex items-center gap-1 rounded-t-md border-b border-border bg-transparent p-1.5 flex-wrap">
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
                  onClick={() => insertImageReference(image.filename)}
                  className="w-full px-2 py-1.5 text-sm text-left hover:bg-muted truncate"
                >
                  {`image_${index + 1}: ${image.filename}`}
                </button>
              ))}
          </div>
        </div>

        <div className="relative group">
          <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
            <AngleIcon className="h-4 w-4" />
            <span>アングル</span>
          </Button>
          <div className="absolute top-full left-0 mt-1 w-48 py-1 bg-popover rounded-md shadow-md border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            {angleTemplates.map((template) => (
              <button
                key={template.label}
                onClick={() => insertAngleTemplate(template.text)}
                className="w-full px-2 py-1.5 text-sm text-left hover:bg-muted truncate"
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group">
          <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
            <PoseIcon className="h-4 w-4" />
            <span>ポーズ</span>
          </Button>
          <div className="absolute top-full left-0 mt-1 w-48 py-1 bg-popover rounded-md shadow-md border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            {poseTemplates.map((template) => (
              <button
                key={template.label}
                onClick={() => insertPoseTemplate(template.text)}
                className="w-full px-2 py-1.5 text-sm text-left hover:bg-muted truncate"
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group">
          <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
            <GlassesIcon className="h-4 w-4" />
            <span>小道具</span>
          </Button>
          <div className="absolute top-full left-0 mt-1 w-48 py-1 bg-popover rounded-md shadow-md border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-[300px] overflow-y-auto">
            {accessoryTemplates.map((template) => (
              <button
                key={template.label}
                onClick={() => insertAccessoryTemplate(template.text)}
                className="w-full px-2 py-1.5 text-sm text-left hover:bg-muted truncate"
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group">
          <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
            <PaletteIcon className="h-4 w-4" />
            <span>背景</span>
          </Button>
          <div className="absolute top-full left-0 mt-1 w-48 py-1 bg-popover rounded-md shadow-md border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-[300px] overflow-y-auto">
            {backgroundTemplates.map((template) => (
              <button
                key={template.label}
                onClick={() => insertBackgroundTemplate(template.text)}
                className="w-full px-2 py-1.5 text-sm text-left hover:bg-muted truncate"
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group">
          <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
            <BrushIcon className="h-4 w-4" />
            <span>スタイル</span>
          </Button>
          <div className="absolute top-full left-0 mt-1 w-48 py-1 bg-popover rounded-md shadow-md border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-[300px] overflow-y-auto">
            {styleTemplates.map((template) => (
              <button
                key={template.label}
                onClick={() => insertStyleTemplate(template.text)}
                className="w-full px-2 py-1.5 text-sm text-left hover:bg-muted truncate"
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group">
          <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
            <ClockIcon className="h-4 w-4" />
            <span>時間</span>
          </Button>
          <div className="absolute top-full left-0 mt-1 w-48 py-1 bg-popover rounded-md shadow-md border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-[300px] overflow-y-auto">
            {timeTemplates.map((template) => (
              <button
                key={template.label}
                onClick={() => insertTimeTemplate(template.text)}
                className="w-full px-2 py-1.5 text-sm text-left hover:bg-muted truncate"
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group">
          <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
            <CloudIcon className="h-4 w-4" />
            <span>天気</span>
          </Button>
          <div className="absolute top-full left-0 mt-1 w-48 py-1 bg-popover rounded-md shadow-md border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-[300px] overflow-y-auto">
            {weatherTemplates.map((template) => (
              <button
                key={template.label}
                onClick={() => insertWeatherTemplate(template.text)}
                className="w-full px-2 py-1.5 text-sm text-left hover:bg-muted truncate"
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group">
          <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
            <HeartIcon className="h-4 w-4" />
            <span>雰囲気</span>
          </Button>
          <div className="absolute top-full left-0 mt-1 w-48 py-1 bg-popover rounded-md shadow-md border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-[300px] overflow-y-auto">
            {moodTemplates.map((template) => (
              <button
                key={template.label}
                onClick={() => insertMoodTemplate(template.text)}
                className="w-full px-2 py-1.5 text-sm text-left hover:bg-muted truncate"
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group">
          <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
            <FilterIcon className="h-4 w-4" />
            <span>フィルター</span>
          </Button>
          <div className="absolute top-full left-0 mt-1 w-48 py-1 bg-popover rounded-md shadow-md border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-[300px] overflow-y-auto">
            {filterTemplates.map((template) => (
              <button
                key={template.label}
                onClick={() => insertFilterTemplate(template.text)}
                className="w-full px-2 py-1.5 text-sm text-left hover:bg-muted truncate"
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>
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
