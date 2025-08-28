import { useState, useEffect } from "react";
import {
  ImageIcon,
  Loader2,
  LayoutIcon,
  BanIcon,
  TextIcon,
} from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import type { GenerationConfig } from "@google/genai";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/ui/image-upload";
import { GeneratedImage } from "@/components/ui/generated-image";
import { ApiKeyInput } from "@/components/ui/api-key-input";
import { TipTapEditor } from "@/components/ui/tiptap-editor";
import { SizeSelector } from "@/components/ui/size-selector";
import { saveEncryptedApiKey, getDecryptedApiKey } from "@/lib/crypto";
import { logEvent } from "@/lib/analytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  negativePrompt?: string;
  size?: string;
  rawResponse?: string;
  requestData?: string;
  description?: string | null;
  retryCount?: number;
  maxRetries?: number;
}

function App() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [negativePrompt, setNegativePrompt] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [shouldSaveApiKey, setShouldSaveApiKey] = useState<boolean>(false);
  const [responseLog, setResponseLog] = useState<ResponseLog | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>(
    "square image with 1:1 aspect ratio"
  );
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
    // Google Analyticsでファイルのアップロードを追跡
    logEvent("User Action", "Upload", "Image Upload", files.length);

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
    if (!apiKey) {
      const errorMessage = "APIキーが必要です";
      setError(errorMessage);
      setResponseLog({
        status: "error",
        timestamp: new Date().toISOString(),
        imageGenerated: false,
        error: errorMessage,
        prompt: prompt,
        negativePrompt: negativePrompt,
        size: selectedSize,
      });
      return;
    }

    // Google Analyticsで画像生成を追跡
    logEvent("User Action", "Generate", "Image Generation", images.length);

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    if (!prompt || prompt.trim() === "") {
      setError("プロンプトが必要です");
      setIsLoading(false);
      return;
    }

    // プロンプトチェックとデバッグ
    console.log("Original prompt:", prompt);

    // サイズを含むプロンプトを作成
    let finalPrompt = prompt;

    // システムプロンプトがない場合は追加
    const systemLine =
      "Please follow the instructions below to change the image:";
    if (!finalPrompt.includes(systemLine)) {
      finalPrompt = `${systemLine}\n\n${finalPrompt}`;
    }

    // サイズが含まれていない場合は追加
    if (selectedSize && !finalPrompt.includes(selectedSize)) {
      const splitPrompt = finalPrompt.split("\n\n");

      // システムプロンプト部分を取得し、その後に選択サイズを追加
      if (splitPrompt.length >= 2) {
        finalPrompt = `${splitPrompt[0]}\n\n- ${selectedSize}\n${splitPrompt
          .slice(1)
          .join("\n\n")}`;
      } else {
        // システムプロンプトしかない場合
        finalPrompt = `${systemLine}\n\n- ${selectedSize}`;
      }
    }

    // 最終的なプロンプトを確認
    console.log("Final prompt:", finalPrompt);

    let retryCount = 0;
    const maxRetries = 3;

    const attemptGeneration = async () => {
      try {
        // プロンプトとオプションで画像の配列を作成
        const contents: Array<
          { text: string } | { inlineData: { mimeType: string; data: string } }
        > = [{ text: finalPrompt }];

        // ネガティブプロンプトがある場合は指示文を追加
        if (negativePrompt && negativePrompt.trim() !== "") {
          const textContent = contents[0] as { text: string };
          textContent.text += `\n\n[NEGATIVE PROMPT] ${negativePrompt}`;
        }

        // 画像がある場合は追加
        if (images.length > 0) {
          images.forEach((image) => {
            contents.push({
              inlineData: {
                mimeType: "image/png",
                data: image.originalImage.split(",")[1],
              },
            });
          });
        }

        // ログに記録
        setResponseLog({
          status: "generating",
          timestamp: new Date().toISOString(),
          imageGenerated: false,
          prompt: finalPrompt,
          negativePrompt: negativePrompt,
          size: selectedSize,
          retryCount: retryCount,
          maxRetries: maxRetries,
          requestData: JSON.stringify(
            {
              prompt: finalPrompt,
              negativePrompt: negativePrompt,
              size: selectedSize,
              imageCount: images.length,
              imageNames: images.map((img) => img.filename),
            },
            null,
            2
          ),
        });

        const genAI = new GoogleGenAI({ apiKey });

        const result = await genAI.models.generateContent({
          model: "gemini-2.5-flash-image-preview",
          contents: contents,
          generationConfig: {
            responseModalities: ["Text", "Image"],
            // Remove responseSchema to fix the "Unsupported response mime type" error
          } as GenerationConfig,
        });
        console.log("Raw result:", result);

        let imageGenerated = false;
        let imageDescription = null;

        // Process response using new @google/genai library format
        // The new library provides direct access to candidates through the result object
        if (result?.candidates && result.candidates.length > 0) {
          const candidate = result.candidates[0];
          console.log("Processing candidate:", candidate);

          if (candidate?.content?.parts && candidate.content.parts.length > 0) {
            console.log("Found parts:", candidate.content.parts.length);

            for (const part of candidate.content.parts) {
              console.log("Processing part:", part);

              // Handle image data from inlineData
              if (part.inlineData && part.inlineData.data) {
                const mimeType = part.inlineData.mimeType || "image/png";
                const generatedImageData = `data:${mimeType};base64,${part.inlineData.data}`;
                setGeneratedImage(generatedImageData);
                imageGenerated = true;
                console.log(
                  "Image data extracted successfully, mimeType:",
                  mimeType
                );
              }

              // Handle text description
              if (part.text && part.text.trim()) {
                imageDescription = part.text.trim();
                console.log("Text description extracted:", imageDescription);
              }
            }
          } else {
            console.log("No content parts found in candidate");
          }
        } else {
          console.log("No candidates found in response");
        }

        // Validate that we received a proper response
        if (!result || !result.candidates || result.candidates.length === 0) {
          retryCount++;
          if (retryCount < maxRetries) {
            console.log(
              `無効なレスポンス。リトライ ${retryCount}/${maxRetries}`
            );
            return await attemptGeneration();
          }
          throw new Error(
            `APIから有効なレスポンスが返ってきませんでした。\n\n${maxRetries}回試しましたが失敗しました。\nAPIキーまたはプロンプトを確認してください。`
          );
        }

        if (!imageGenerated) {
          retryCount++;
          if (retryCount < maxRetries) {
            console.log(`画像生成失敗。リトライ ${retryCount}/${maxRetries}`);
            return await attemptGeneration();
          }
          throw new Error(
            `画像データが返ってきませんでした。\n\n${maxRetries}回試しましたが失敗しました。\n画像もしくはプロンプトの変更を試してください。`
          );
        }

        setResponseLog({
          status: "success",
          timestamp: new Date().toISOString(),
          imageGenerated: true,
          prompt: finalPrompt,
          negativePrompt: negativePrompt,
          size: selectedSize,
          description: imageDescription,
          rawResponse: JSON.stringify(result, null, 2),
          requestData: JSON.stringify(
            {
              prompt: finalPrompt,
              negativePrompt: negativePrompt,
              size: selectedSize,
              imageCount: images.length,
              imageNames: images.map((img) => img.filename),
            },
            null,
            2
          ),
        });
      } catch (err) {
        console.error("API Error:", err);

        let errorMessage = "画像の生成に失敗しました";
        let shouldRetry = false;

        // Handle different types of errors from the new @google/genai library
        if (err instanceof Error) {
          const errorStr = err.message.toLowerCase();

          // Check for specific error types that warrant retry
          if (
            errorStr.includes("network") ||
            errorStr.includes("timeout") ||
            errorStr.includes("connection") ||
            errorStr.includes("fetch") ||
            errorStr.includes("503") ||
            errorStr.includes("502") ||
            errorStr.includes("500")
          ) {
            shouldRetry = true;
            errorMessage = `ネットワークエラーが発生しました: ${err.message}`;
          } else if (
            errorStr.includes("quota") ||
            errorStr.includes("rate limit") ||
            errorStr.includes("429")
          ) {
            shouldRetry = true;
            errorMessage = `API制限に達しました。しばらく待ってから再試行してください: ${err.message}`;
          } else if (
            errorStr.includes("api key") ||
            errorStr.includes("authentication") ||
            errorStr.includes("401") ||
            errorStr.includes("403")
          ) {
            shouldRetry = false;
            errorMessage = `APIキーが無効です。正しいAPIキーを設定してください: ${err.message}`;
          } else if (
            errorStr.includes("model not found") ||
            errorStr.includes("404")
          ) {
            shouldRetry = false;
            errorMessage = `指定されたモデルが見つかりません: ${err.message}`;
          } else if (
            errorStr.includes("content policy") ||
            errorStr.includes("safety") ||
            errorStr.includes("blocked")
          ) {
            shouldRetry = false;
            errorMessage = `コンテンツポリシーに違反しています。プロンプトを変更してください: ${err.message}`;
          } else {
            // Generic error - allow retry for unknown errors
            shouldRetry = true;
            errorMessage = `エラーが発生しました: ${err.message}`;
          }
        } else {
          // Non-Error objects
          shouldRetry = true;
          errorMessage = `予期しないエラーが発生しました: ${String(err)}`;
        }

        // Retry logic for retryable errors
        if (shouldRetry && retryCount < maxRetries) {
          retryCount++;
          console.log(
            `リトライ ${retryCount}/${maxRetries} - エラー: ${errorMessage}`
          );

          // Add exponential backoff delay
          const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 5000);
          await new Promise((resolve) => setTimeout(resolve, delay));

          return await attemptGeneration();
        }

        // Final error after all retries or non-retryable error
        const finalErrorMessage =
          retryCount >= maxRetries
            ? `${maxRetries}回試行しましたが失敗しました。\n最後のエラー: ${errorMessage}`
            : errorMessage;

        setError(finalErrorMessage);
        setResponseLog({
          status: "error",
          timestamp: new Date().toISOString(),
          imageGenerated: false,
          error: finalErrorMessage,
          prompt: finalPrompt,
          negativePrompt: negativePrompt,
          size: selectedSize,
          retryCount: retryCount,
          maxRetries: maxRetries,
          requestData: JSON.stringify(
            {
              prompt: finalPrompt,
              negativePrompt: negativePrompt,
              size: selectedSize,
              imageCount: images.length,
              imageNames: images.map((img) => img.filename),
            },
            null,
            2
          ),
        });
      } finally {
        setIsLoading(false);
      }
    };

    await attemptGeneration();
  };

  const removeImage = (id: string) => {
    // Google Analyticsで画像削除を追跡
    logEvent("User Action", "Remove", "Image Removal");
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const useGeneratedAsInput = (imageData: string) => {
    // Google Analyticsで生成済み画像の再利用を追跡
    logEvent("User Action", "Reuse", "Generated Image Reuse");
    const newImage: ImageItem = {
      id: crypto.randomUUID(),
      originalImage: imageData,
      generatedImage: null,
      status: "pending",
      filename: `generated-image-${new Date().getTime()}.png`,
    };

    setImages((prev) => [...prev, newImage]);
    // 生成された画像と関連データを消去しない
    // setGeneratedImage(null);
    // setResponseLog(null);
    // setError(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8 max-md:p-4 w-full">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Gemini画像ジェネレーター
            </CardTitle>
            <CardDescription className="text-center">
              画像とプロンプトでAIが新しい画像を生成します
            </CardDescription>
          </CardHeader>
          <CardContent className="max-md:p-0">
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
                    <Label className="text-lg font-semibold">
                      <LayoutIcon className="inline-block mr-2 h-5 w-5" />
                      出力サイズ
                    </Label>
                    <SizeSelector
                      value={selectedSize}
                      onChange={setSelectedSize}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-lg font-semibold" htmlFor="prompt">
                      <TextIcon className="inline-block mr-2 h-5 w-5" />
                      プロンプト
                    </Label>
                    <TipTapEditor
                      value={prompt}
                      onChange={setPrompt}
                      images={images.map((img) => ({
                        id: img.id,
                        filename: img.filename,
                      }))}
                    />
                  </div>

                  <Accordion type="single" collapsible className="mt-4">
                    <AccordionItem
                      value="negative-prompt"
                      className="border-b-0"
                    >
                      <AccordionTrigger className="py-2 px-0 hover:no-underline">
                        <div className="flex items-center">
                          <BanIcon className="mr-2 h-5 w-5 text-destructive" />
                          <span className="text-lg font-semibold text-destructive">
                            ネガティブプロンプト [EXPERIMENTAL]
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <TipTapEditor
                          value={negativePrompt}
                          onChange={setNegativePrompt}
                          placeholder="生成したくない要素を入力してください"
                          images={images.map((img) => ({
                            id: img.id,
                            filename: img.filename,
                          }))}
                          isNegativePrompt={true}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="text-center">
                    <Button
                      onClick={generateImages}
                      disabled={!apiKey || isLoading}
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
                    onUseAsInput={useGeneratedAsInput}
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
