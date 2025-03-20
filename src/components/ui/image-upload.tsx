import React, { useRef, DragEvent } from "react";
import { Loader2Icon, Upload, X } from "lucide-react";
import { Button } from "./button";
import { ImageModal } from "./image-modal";

interface ImageItem {
  id: string;
  originalImage: string;
  generatedImage: string | null;
  status: "pending" | "generating" | "completed" | "error";
  error?: string;
  filename: string;
}

interface ImageUploadProps {
  images: ImageItem[];
  onImagesSelect: (files: File[]) => void;
  onImageRemove: (id: string) => void;
}

export function ImageUpload({
  images,
  onImagesSelect,
  onImageRemove,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    onImagesSelect(files);
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    onImagesSelect(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg transition-colors duration-200 ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/50"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept="image/*"
        multiple
        className="hidden"
      />
      <div className="min-h-[300px] flex flex-col items-center justify-center p-8">
        {images.length > 0 ? (
          <div className="w-full space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <ImageModal image={image.originalImage} alt={image.filename}>
                    <img
                      src={image.originalImage}
                      alt={image.filename}
                      className="w-full h-32 object-cover rounded-lg cursor-pointer"
                    />
                  </ImageModal>
                  <button
                    onClick={() => onImageRemove(image.id)}
                    className="absolute top-2 right-2 p-1 bg-destructive rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4 text-white" />
                  </button>
                  {image.status === "generating" && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                      <Loader2Icon className="h-6 w-6 animate-spin text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              variant="secondary"
            >
              <Upload className="mr-2 h-4 w-4" />
              画像を追加
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 p-4 rounded-full bg-secondary">
              <Upload className="h-8 w-8" />
            </div>
            <p className="text-lg font-medium mb-2">
              ここに画像をドラッグ＆ドロップ
            </p>
            <p className="text-sm text-muted-foreground mb-4">または</p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="secondary"
            >
              画像を選択
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
