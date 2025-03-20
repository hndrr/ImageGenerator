import { useState, useEffect } from "react";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { GenerateContentRequest } from "@google/generative-ai";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { GeneratedImage } from "@/components/ui/generated-image";
import { ApiKeyInput } from "@/components/ui/api-key-input";
import { TipTapEditor } from "@/components/ui/tiptap-editor";
import { SizeSelector } from "@/components/ui/size-selector";
import { saveEncryptedApiKey, getDecryptedApiKey } from "@/lib/crypto";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ImageItem {
  id: string;
  originalImage: string;
  generatedImage: string | null;
  status: "pending" | "generating" | "completed" | "error";
  error?: string;
  filename: string;
}

interface ResponseLog {
  status: "success" | "error" | "generating";
  timestamp: string;
  imageGenerated: boolean;
  error?: string;
  prompt?: string;
  size?: string;
  rawResponse?: string;
  requestData?: string;
}

function App() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [shouldSaveApiKey, setShouldSaveApiKey] = useState<boolean>(false);
  const [responseLog, setResponseLog] = useState<ResponseLog | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("1024x1024");
  const [isApiKeyFromEnv, setIsApiKeyFromEnv] = useState<boolean>(false);

  useEffect(() => {
    // 環境変数とlocalStorageからAPIキーを取得
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (envApiKey) {
      setApiKey(envApiKey);
      setIsApiKeyFromEnv(true);
    } else {
      // 暗号化されたAPIキーを復号化して取得
      getDecryptedApiKey().then((decryptedKey) => {
        if (decryptedKey) {
          setApiKey(decryptedKey);
          setShouldSaveApiKey(true);
        }
      });
    }
  }, []);

  // APIキーが変更されたときに暗号化して保存（保存設定が有効な場合のみ）
  useEffect(() => {
    if (apiKey && !isApiKeyFromEnv && shouldSaveApiKey) {
      saveEncryptedApiKey(apiKey);
    } else if (!shouldSaveApiKey) {
      // 保存設定が無効な場合は保存されているAPIキーを削除
      localStorage.removeItem("encryptedApiKey");
    }
  }, [apiKey, isApiKeyFromEnv, shouldSaveApiKey]);

  const handleFiles = (files: File[]) => {
    const newImages = files.map((file) => {
      return new Promise<ImageItem>((resolve, reject) => {
        if (!file.type.startsWith("image/")) {
          reject(new Error("画像ファイルのみアップロード可能です"));
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            id: crypto.randomUUID(),
            originalImage: reader.result as string,
            generatedImage: null,
            status: "pending",
            filename: file.name,
          });
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImages)
      .then((loadedImages) => {
        setImages((prev) => [...prev, ...loadedImages]);
        setError(null);
        setResponseLog(null);
        setGeneratedImage(null);
      })
      .catch((err) => {
        setError(err.message);
        setResponseLog({
          status: "error",
          timestamp: new Date().toISOString(),
          imageGenerated: false,
          error: err.message,
        });
      });
  };

  const generateImages = async () => {
    if (images.length === 0 || !apiKey) {
      const errorMessage = "画像とAPIキーの両方が必要です";
      setError(errorMessage);
      setResponseLog({
        status: "error",
        timestamp: new Date().toISOString(),
        imageGenerated: false,
        error: errorMessage,
        prompt: prompt,
        size: selectedSize,
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const contents = [
        { text: prompt },
        ...images.map((image) => ({
          inlineData: {
            mimeType: "image/png",
            data: image.originalImage.split(",")[1],
          },
        })),
      ];

      setResponseLog({
        status: "generating",
        timestamp: new Date().toISOString(),
        imageGenerated: false,
        prompt: prompt,
        size: selectedSize,
        requestData: JSON.stringify(
          {
            prompt,
            size: selectedSize,
            imageCount: images.length,
            imageNames: images.map((img) => img.filename),
          },
          null,
          2
        ),
      });

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp-image-generation",
        generationConfig: {
          responseModalities: ["Text", "Image"],
        } as GenerateContentRequest["generationConfig"],
      });

      const result = await model.generateContent(contents);
      const response = await result.response;
      console.log("Raw response:", response);

      let imageGenerated = false;
      if (response?.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            const generatedImageData = `data:image/png;base64,${part.inlineData.data}`;
            setGeneratedImage(generatedImageData);
            imageGenerated = true;
            break;
          }
        }
      }

      if (!imageGenerated) {
        throw new Error(
          `画像データが返ってきませんでした。\n\n複数回試しても結果が返ってこない場合は、\n画像もしくはプロンプトの変更を試してください。`
        );
      }

      setResponseLog({
        status: "success",
        timestamp: new Date().toISOString(),
        imageGenerated: true,
        prompt: prompt,
        size: selectedSize,
        rawResponse: JSON.stringify(response, null, 2),
        requestData: JSON.stringify(
          {
            prompt,
            size: selectedSize,
            imageCount: images.length,
            imageNames: images.map((img) => img.filename),
          },
          null,
          2
        ),
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "画像の生成に失敗しました";

      setError(errorMessage);
      setResponseLog({
        status: "error",
        timestamp: new Date().toISOString(),
        imageGenerated: false,
        error: errorMessage,
        prompt: prompt,
        size: selectedSize,
        requestData: JSON.stringify(
          {
            prompt,
            size: selectedSize,
            imageCount: images.length,
            imageNames: images.map((img) => img.filename),
          },
          null,
          2
        ),
      });

      console.error("エラー:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Gemini画像ジェネレーター
            </CardTitle>
            <CardDescription className="text-center">
              複数画像を追加して、AIで新しい画像を生成
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Input Section */}
              <Card className="border-none shadow-none">
                <CardContent className="space-y-8">
                  {isApiKeyFromEnv ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-lg font-semibold">
                          Gemini APIキー
                        </Label>
                      </div>
                      <div className="relative">
                        <div className="flex w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
                          $GEMINI_API_KEY ALREADY SET ENV
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ApiKeyInput
                      value={apiKey}
                      onChange={setApiKey}
                      shouldSave={shouldSaveApiKey}
                      onShouldSaveChange={setShouldSaveApiKey}
                    />
                  )}

                  <ImageUpload
                    images={images}
                    onImagesSelect={handleFiles}
                    onImageRemove={removeImage}
                  />

                  <div className="space-y-2">
                    <Label className="text-lg font-semibold">出力サイズ</Label>
                    <SizeSelector
                      value={selectedSize}
                      onChange={setSelectedSize}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-lg font-semibold" htmlFor="prompt">
                      プロンプト
                    </Label>
                    <TipTapEditor
                      value={prompt}
                      onChange={setPrompt}
                      images={images.map((img) => ({
                        id: img.id,
                        filename: img.filename,
                      }))}
                      selectedSize={selectedSize}
                    />
                  </div>

                  <div className="text-center">
                    <Button
                      onClick={generateImages}
                      disabled={images.length === 0 || !apiKey || isLoading}
                      size="lg"
                      className="w-full"
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <ImageIcon className="mr-2 h-4 w-4" />
                      )}
                      画像を生成
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Right Column - Output Section */}
              <Card className="border-none shadow-none">
                <CardContent>
                  <GeneratedImage
                    generatedImage={generatedImage}
                    isLoading={isLoading}
                    responseLog={responseLog}
                    error={error}
                  />
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
