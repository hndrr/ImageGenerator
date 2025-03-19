import React, { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Loader2, Key } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function App() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setGeneratedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateImage = async () => {
    if (!selectedImage || !apiKey) {
      setError("画像とAPIキーの両方が必要です");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp-image-generation",
        generationConfig: {
          responseModalities: ["Text", "Image"],
        } as any,
      });

      const base64Image = selectedImage.split(",")[1];
      const contents = [
        { text: prompt },
        {
          inlineData: {
            mimeType: "image/png",
            data: base64Image,
          },
        },
      ];

      const response = await model.generateContent(contents);

      if (
        response &&
        response.response &&
        response.response.candidates &&
        response.response.candidates[0] &&
        response.response.candidates[0].content &&
        response.response.candidates[0].content.parts
      ) {
        for (const part of response.response.candidates[0].content.parts) {
          if (part.inlineData) {
            setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
          }
        }
      } else {
        setError(
          "レスポンスの形式が予期せぬものでした。もう一度試してください。"
        );
      }
    } catch (err) {
      setError(
        "画像の生成に失敗しました。APIキーが正しいことを確認してください。"
      );
      console.error("エラー:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-xl border border-border bg-card p-8">
          <h1 className="text-3xl font-bold mb-8 text-center">
            画像ジェネレーター
          </h1>

          <div className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="apiKey">Gemini APIキー</Label>
              <div className="relative">
                <input
                  type="password"
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring pr-10"
                  placeholder="APIキーを入力してください"
                />
                <Key className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="mb-4"
                variant="secondary"
              >
                <Upload className="mr-2 h-4 w-4" />
                画像をアップロード
              </Button>
              {selectedImage && (
                <img
                  src={selectedImage}
                  alt="選択された画像"
                  className="max-h-64 mx-auto rounded-lg"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">プロンプト</Label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder="画像生成の指示を入力してください"
              />
            </div>

            <div className="text-center">
              <Button
                onClick={generateImage}
                disabled={!selectedImage || !apiKey || isLoading}
                size="lg"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <ImageIcon className="mr-2 h-4 w-4" />
                )}
                画像を生成
              </Button>
            </div>

            {error && (
              <div className="text-destructive text-center">{error}</div>
            )}

            {generatedImage && (
              <div className="border border-border rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4 text-center">
                  生成された画像
                </h2>
                <img
                  src={generatedImage}
                  alt="生成された画像"
                  className="max-h-96 mx-auto rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
