import { Key, ExternalLink } from "lucide-react";
import { Label } from "./label";
import { Switch } from "./switch";

interface ApiKeyInputProps {
  value: string;
  onChange: (value: string) => void;
  shouldSave: boolean;
  onShouldSaveChange: (value: boolean) => void;
}

export function ApiKeyInput({
  value,
  onChange,
  shouldSave,
  onShouldSaveChange,
}: ApiKeyInputProps) {
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
          autoComplete="new-password"
        />
        <Key className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="save-api-key"
          checked={shouldSave}
          onCheckedChange={onShouldSaveChange}
        />
        <Label htmlFor="save-api-key" className="text-sm text-muted-foreground">
          APIキーを保存する（暗号化して保存されます）
        </Label>
      </div>
    </div>
  );
}
