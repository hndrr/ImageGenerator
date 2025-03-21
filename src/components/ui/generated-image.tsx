import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Button } from "./button";
import { Download, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImageModal } from "./image-modal";

interface ResponseLog {
  status: "success" | "error" | "generating";
  timestamp: string;
  imageGenerated: boolean;
  error?: string;
  prompt?: string;
  size?: string;
  rawResponse?: string;
  requestData?: string;
  description?: string | null;
  retryCount?: number;
  maxRetries?: number;
}

interface GeneratedImageProps {
  generatedImage: string | null;
  isLoading: boolean;
  responseLog: ResponseLog | null;
  error: string | null;
  onUseAsInput?: (imageData: string) => void;
}

export function GeneratedImage({
  generatedImage,
  isLoading,
  responseLog,
  error,
  onUseAsInput,
}: GeneratedImageProps) {
  const handleDownload = (imageData: string) => {
    const link = document.createElement("a");
    link.href = imageData;
    link.download = `generated-image-${new Date().getTime()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: ResponseLog["status"]) => {
    switch (status) {
      case "success":
        return "text-green-500";
      case "error":
        return "text-destructive";
      case "generating":
        return "text-yellow-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusText = (status: ResponseLog["status"]) => {
    switch (status) {
      case "success":
        return "生成完了";
      case "error":
        return "エラー";
      case "generating":
        if (
          responseLog?.retryCount !== undefined &&
          responseLog?.maxRetries !== undefined
        ) {
          return `生成中... [${responseLog.retryCount + 1}/${
            responseLog.maxRetries
          }]`;
        }
        return "生成中...";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <CardHeader className="px-0 p-1">
          <CardTitle className="text-lg">生成された画像</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Card className="overflow-hidden">
            <CardContent className="p-4 bg-white/10">
              {isLoading ? (
                <div className="h-96 flex flex-col items-center justify-center bg-secondary rounded-lg">
                  <Loader2 className="h-8 w-8 animate-spin mb-4" />
                  {responseLog?.status === "generating" &&
                    responseLog?.retryCount !== undefined &&
                    responseLog?.maxRetries !== undefined && (
                      <p className="text-center text-sm text-muted-foreground">
                        生成中... [{responseLog.retryCount + 1}/
                        {responseLog.maxRetries}]
                      </p>
                    )}
                </div>
              ) : error ? (
                <div className="h-96 flex items-center justify-center">
                  <p className="text-destructive text-center whitespace-pre-line">
                    {error}
                  </p>
                </div>
              ) : generatedImage ? (
                <div className="space-y-2">
                  <ImageModal image={generatedImage} alt="生成された画像">
                    <img
                      src={generatedImage}
                      alt="生成された画像"
                      className="w-full rounded-lg object-contain h-96 cursor-pointer"
                    />
                  </ImageModal>
                  {responseLog?.description && (
                    <div className="mt-4 p-3 bg-secondary/50 rounded-lg text-sm">
                      <p className="font-semibold mb-1">画像の説明:</p>
                      <p className="whitespace-pre-line">
                        {responseLog.description}
                      </p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleDownload(generatedImage)}
                      className="flex-1"
                      variant="secondary"
                      size="sm"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      ダウンロード
                    </Button>
                    {onUseAsInput && (
                      <Button
                        onClick={() => onUseAsInput(generatedImage)}
                        className="flex-1"
                        variant="outline"
                        size="sm"
                      >
                        <ArrowRight className="mr-2 h-4 w-4" />
                        入力として使用
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center bg-secondary">
                  <p className="text-muted-foreground text-sm">
                    ここに生成された画像が表示されます
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </div>

      <div>
        <CardHeader className="px-0 p-1">
          <CardTitle className="text-lg">ログ</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Card className="border-border">
            <CardContent className="font-mono text-sm overflow-auto max-h-[400px] space-y-4 p-4">
              {responseLog ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {new Date(responseLog.timestamp).toLocaleString("ja-JP")}
                    </div>
                    <div
                      className={cn(
                        "text-sm font-medium",
                        getStatusColor(responseLog.status)
                      )}
                    >
                      {getStatusText(responseLog.status)}
                    </div>
                  </div>

                  {responseLog.prompt && (
                    <div>
                      <div className="text-muted-foreground mb-1">
                        プロンプト:
                      </div>
                      <div className="bg-secondary/50 rounded-md p-2 whitespace-pre-wrap">
                        {responseLog.prompt}
                      </div>
                    </div>
                  )}

                  {responseLog.size && (
                    <div>
                      <div className="text-muted-foreground mb-1">
                        出力サイズ:
                      </div>
                      <div className="bg-secondary/50 rounded-md p-2">
                        {responseLog.size}
                      </div>
                    </div>
                  )}

                  {responseLog.requestData && (
                    <div>
                      <div className="text-muted-foreground mb-1">
                        リクエスト情報:
                      </div>
                      <div className="bg-secondary/50 rounded-md p-2 whitespace-pre-wrap">
                        {responseLog.requestData}
                      </div>
                    </div>
                  )}

                  {responseLog.error && (
                    <div>
                      <div className="text-destructive mb-1">エラー:</div>
                      <div className="bg-destructive/10 text-destructive rounded-md p-2 whitespace-pre-wrap">
                        {responseLog.error}
                      </div>
                    </div>
                  )}

                  {responseLog.rawResponse && (
                    <div>
                      <div className="text-muted-foreground mb-1">
                        レスポンス:
                      </div>
                      <details>
                        <summary className="cursor-pointer hover:text-primary transition-colors">
                          詳細を表示
                        </summary>
                        <pre className="mt-2 bg-secondary/50 rounded-md p-2 whitespace-pre-wrap break-words">
                          {responseLog.rawResponse}
                        </pre>
                      </details>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-muted-foreground">
                  リクエストを実行するとログが表示されます
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </div>
    </div>
  );
}
