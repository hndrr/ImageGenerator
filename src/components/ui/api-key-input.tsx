import { Key, ExternalLink } from "lucide-react";
import { Label } from "./label";

interface ApiKeyInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ApiKeyInput({ value, onChange }: ApiKeyInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold" htmlFor="apiKey">
          Gemini APIキー
        </Label>
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center gap-1"
        >
          <span>Google AI StudioのAPIキーを取得</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <div className="relative">
        <input
          type="password"
          id="apiKey"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pr-10"
          placeholder="APIキーを入力してください"
        />
        <Key className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}
