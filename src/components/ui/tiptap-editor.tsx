import { useEditor, EditorContent, Editor } from "@tiptap/react";
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
  ApertureIcon,
  ShirtIcon,
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
} from "@/lib/templates";
import { useEffect, useRef } from "react";

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

// 完全なコンテンツからエディタ表示用の内容を抽出する関数
const extractEditorContent = (fullContent: string): string => {
  if (!fullContent) return "";

  // システムプロンプトを削除
  const withoutSystemPrompt = fullContent.replace(systemPrompt, "").trim();

  // 先頭の空行を削除
  const lines = withoutSystemPrompt.split("\n").filter((line) => line.trim());

  // サイズ情報の行を削除（通常は先頭の1行）
  if (
    lines.length > 0 &&
    (lines[0].startsWith("- wide") ||
      lines[0].startsWith("- rectangular") ||
      lines[0].startsWith("- square"))
  ) {
    lines.shift();
  }

  return lines.join("\n");
};

export function TipTapEditor({
  value,
  onChange,
  placeholder = "画像生成の指示を入力してください",
  className,
  images = [],
  selectedSize,
}: TipTapEditorProps) {
  // 前回のサイズを保持
  const prevSizeRef = useRef(selectedSize);

  // エディタの内容用の値を抽出
  const editorContent = extractEditorContent(value);

  // コンテンツ更新のヘルパー関数
  const updateContentWithSize = (editor: Editor) => {
    const editorContent = editor
      .getHTML()
      .replace(/<p>/g, "")
      .replace(/<\/p>/g, "")
      .split(/<br\/?>/g)
      .map((line: string) => line.trim())
      .filter((line: string) => line.length > 0)
      .map((line: string) => (line.startsWith("-") ? line : `- ${line}`))
      // サイズ指定行を除外
      .filter(
        (line: string) =>
          !(
            line.startsWith("- wide") ||
            line.startsWith("- rectangular") ||
            line.startsWith("- square")
          )
      )
      .join("\n");

    if (!editorContent) {
      onChange("");
      return;
    }

    // selectedSizeがある場合はpromptに追加
    let finalContent: string;
    if (selectedSize) {
      finalContent = `${systemPrompt}\n\n- ${selectedSize}\n${editorContent}`;
    } else {
      finalContent = `${systemPrompt}\n\n${editorContent}`;
    }
    onChange(finalContent);
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
    content: editorContent
      ? `<p>${editorContent.replace(/\n/g, "<br>")}</p>`
      : "",
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
      updateContentWithSize(editor);
    },
  });

  // サイズが変更された場合に強制的にプロンプトを更新
  useEffect(() => {
    if (editor && selectedSize !== prevSizeRef.current) {
      prevSizeRef.current = selectedSize;

      // エディタが空の場合、またはサイズ変更のみの場合は更新する
      const currentContent = editor
        .getHTML()
        .replace(/<p>|<\/p>/g, "")
        .replace(/<br\/?>/g, "\n")
        .trim();
      if (
        currentContent === "" ||
        (value && extractEditorContent(value).trim() === currentContent)
      ) {
        updateContentWithSize(editor);
      }
    }
  }, [selectedSize, editor, value]);

  // 外部からvalueが変更された場合にエディタ内容を更新
  useEffect(() => {
    if (editor) {
      const newEditorContent = extractEditorContent(value);
      const currentHTML = editor
        .getHTML()
        .replace(/<p>|<\/p>/g, "")
        .replace(/<br\/?>/g, "\n");

      // エディタの内容と異なる場合のみ更新
      if (newEditorContent.trim() !== currentHTML.trim()) {
        editor.commands.setContent(
          newEditorContent
            ? `<p>${newEditorContent.replace(/\n/g, "<br>")}</p>`
            : ""
        );
      }
    }
  }, [value, editor]);

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

    // テンプレート挿入後に強制的にコンテンツを更新
    updateContentWithSize(editor);
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

    // 画像参照挿入後に強制的にコンテンツを更新
    updateContentWithSize(editor);
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

  const insertLensTemplate = (text: string) => {
    insertTemplate(text);
  };

  const insertClothingTemplate = (text: string) => {
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
            <ShirtIcon className="h-4 w-4" />
            <span>服装</span>
          </Button>
          <div className="absolute top-full left-0 mt-1 w-48 py-1 bg-popover rounded-md shadow-md border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-[300px] overflow-y-auto">
            {clothingTemplates.map((template) => (
              <button
                key={template.label}
                onClick={() => insertClothingTemplate(template.text)}
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
            <ApertureIcon className="h-4 w-4" />
            <span>レンズ</span>
          </Button>
          <div className="absolute top-full left-0 mt-1 w-48 py-1 bg-popover rounded-md shadow-md border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-[300px] overflow-y-auto">
            {lensTemplates.map((template) => (
              <button
                key={template.label}
                onClick={() => insertLensTemplate(template.text)}
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
