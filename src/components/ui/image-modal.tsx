import { useState } from "react";
import { Dialog, DialogContent } from "./dialog";
import { X } from "lucide-react";

interface ImageModalProps {
  children: React.ReactNode;
  image: string;
  alt?: string;
}

export function ImageModal({
  children,
  image,
  alt = "拡大画像",
}: ImageModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="cursor-pointer" onClick={() => setIsOpen(true)}>
        {children}
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-screen-lg w-[90vw] p-0 overflow-hidden">
          <div className="relative h-[90vh] flex items-center justify-center bg-black/90">
            <img
              src={image}
              alt={alt}
              className="max-h-full max-w-full object-contain"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
