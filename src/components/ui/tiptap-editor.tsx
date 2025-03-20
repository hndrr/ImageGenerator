import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
  Image as ImageIcon,
  Ratio as AspectRatio,
  Camera as Angle,
  User as Pose,
  Glasses,
  Palette,
  Brush,
} from "lucide-react";

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

const aspectRatioTemplates = [
  {
    label: "横長",
    text: "aspect:landscape",
    ratio: (w: number, h: number) => w > h,
  },
  {
    label: "縦長",
    text: "aspect:portrait",
    ratio: (w: number, h: number) => w < h,
  },
  {
    label: "正方形",
    text: "aspect:square",
    ratio: (w: number, h: number) => w === h,
  },
];

const angleTemplates = [
  { label: "正面", text: "view:front view" },
  { label: "俯瞰", text: "view:bird's eye view" },
  { label: "アオリ", text: "view:low angle" },
  { label: "斜め", text: "view:45 degree angle" },
  { label: "クローズアップ", text: "view:close-up shot" },
  { label: "引き", text: "view:full body shot" },
];

const poseTemplates = [
  { label: "立ち", text: "pose:standing" },
  { label: "座り", text: "pose:sitting" },
  { label: "寝転び", text: "pose:lying down" },
  { label: "歩き", text: "pose:walking" },
  { label: "走り", text: "pose:running" },
  { label: "ジャンプ", text: "pose:jumping" },
];

const accessoryTemplates = [
  { label: "メガネ", text: "accessory:wearing glasses" },
  { label: "サングラス", text: "accessory:wearing sunglasses" },
  { label: "帽子", text: "accessory:wearing a hat" },
  { label: "キャップ", text: "accessory:wearing a cap" },
  { label: "ベレー帽", text: "accessory:wearing a beret" },
  { label: "マフラー", text: "accessory:wearing a scarf" },
  { label: "ネックレス", text: "accessory:wearing a necklace" },
  { label: "イヤリング", text: "accessory:wearing earrings" },
  { label: "バッグ", text: "accessory:holding a bag" },
  { label: "傘", text: "accessory:holding an umbrella" },
];

const backgroundTemplates = [
  { label: "自然", text: "background:nature scene" },
  { label: "都会", text: "background:urban cityscape" },
  { label: "室内", text: "background:indoor room" },
  { label: "海", text: "background:beach and ocean" },
  { label: "山", text: "background:mountain landscape" },
  { label: "公園", text: "background:park" },
  { label: "カフェ", text: "background:cafe interior" },
  { label: "オフィス", text: "background:office space" },
  { label: "学校", text: "background:school campus" },
  { label: "夜景", text: "background:night city view" },
  { label: "夕暮れ", text: "background:sunset sky" },
  { label: "森林", text: "background:forest" },
];

const styleTemplates = [
  { label: "写真調", text: "generate style:photorealistic" },
  { label: "絵画調", text: "generate style:oil painting" },
  { label: "水彩画", text: "generate style:watercolor" },
  { label: "鉛筆画", text: "generate style:pencil sketch" },
  { label: "パステル", text: "generate style:pastel art" },
  { label: "アニメ調", text: "generate style:anime" },
  { label: "漫画調", text: "generate style:manga" },
  { label: "ピクサー風", text: "generate style:pixar" },
  { label: "ジブリ風", text: "generate style:ghibli" },
  { label: "モノクロ", text: "generate style:black and white" },
  { label: "セピア", text: "generate style:sepia" },
  { label: "ネオン", text: "generate style:neon" },
  { label: "サイバーパンク", text: "generate style:cyberpunk" },
  { label: "レトロ", text: "generate style:retro" },
  { label: "ミニマル", text: "generate style:minimal" },
  { label: "抽象的", text: "generate style:abstract" },
];

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
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const content = editor
        .getHTML()
        .replace(/<p>/g, "")
        .replace(/<\/p>/g, "\n")
        .replace(/<br>/g, "\n")
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join("\n");

      const finalContent = content ? `${systemPrompt}\n\n${content}` : content;
      onChange(finalContent);
    },
  });

  if (!editor) {
    return null;
  }

  const insertImageReference = (filename: string) => {
    const imageNumber =
      images.findIndex((img) => img.filename === filename) + 1;
    const imageRef = `- ![image_${imageNumber}](${filename})`;
    editor
      .chain()
      .focus()
      .insertContent(imageRef + "\n")
      .run();
  };

  const insertAspectRatioTemplate = (text: string) => {
    editor.chain().focus().insertContent(`- ${text}\n`).run();
  };

  const insertAngleTemplate = (text: string) => {
    editor.chain().focus().insertContent(`- ${text}\n`).run();
  };

  const insertPoseTemplate = (text: string) => {
    editor.chain().focus().insertContent(`- ${text}\n`).run();
  };

  const insertAccessoryTemplate = (text: string) => {
    editor.chain().focus().insertContent(`- ${text}\n`).run();
  };

  const insertBackgroundTemplate = (text: string) => {
    editor.chain().focus().insertContent(`- ${text}\n`).run();
  };

  const insertStyleTemplate = (text: string) => {
    editor.chain().focus().insertContent(`- ${text}\n`).run();
  };

  const getAspectRatioFromSize = (size: string) => {
    if (!size) return null;
    const [width, height] = size.split("x").map(Number);
    return aspectRatioTemplates.find((template) =>
      template.ratio(width, height)
    );
  };

  const currentAspectRatio = selectedSize
    ? getAspectRatioFromSize(selectedSize)
    : null;

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
            <AspectRatio className="h-4 w-4" />
            <span>構図</span>
          </Button>
          <div className="absolute top-full left-0 mt-1 w-48 py-1 bg-popover rounded-md shadow-md border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            {aspectRatioTemplates.map((template) => (
              <button
                key={template.label}
                onClick={() => insertAspectRatioTemplate(template.text)}
                className={cn(
                  "w-full px-2 py-1.5 text-sm text-left hover:bg-muted truncate",
                  currentAspectRatio?.label === template.label && "font-bold"
                )}
              >
                {template.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative group">
          <Button variant="ghost" size="sm" className="h-8 px-2 gap-1">
            <Angle className="h-4 w-4" />
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
            <Pose className="h-4 w-4" />
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
            <Glasses className="h-4 w-4" />
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
            <Palette className="h-4 w-4" />
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
            <Brush className="h-4 w-4" />
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
      </div>

      <div className={cn("rounded-b-md bg-transparent", className)}>
        <EditorContent
          editor={editor}
          className="px-4 pb-3 min-h-[200px] prose prose-sm max-w-none prose-invert focus:outline-none [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:px-1"
        />
      </div>
    </div>
  );
}
