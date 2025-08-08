"use client";

import React, { useCallback, useRef, useState, Dispatch, SetStateAction } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import slugify from "slugify";
import { cn } from "@/lib/utils";
import { APIResponse } from "@/types";

interface AvatarUploadProps {
  value?: string;
  isUploading: boolean;
  setIsUploading: Dispatch<SetStateAction<boolean>>;
  onUploaded: (url: string, croppedDataUrl: string) => void;
  size?: number;
  className?: string;
  disabled?: boolean;
  placeholder?: React.ReactNode;
}

export function AvatarUpload({
  value,
  isUploading,
  setIsUploading,
  onUploaded,
  size = 120,
  className,
  disabled = false,
  placeholder,
}: AvatarUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setZoom(1);
        setPosition({ x: 0, y: 0 });
        setIsOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageLoad = () => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      setImageSize({ width: naturalWidth, height: naturalHeight });

      const container = containerRef.current;
      if (container) {
        const containerSize = 300;
        const scale = Math.max(containerSize / naturalWidth, containerSize / naturalHeight);
        setZoom(scale);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    },
    [isDragging, dragStart],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const getCroppedImage = (): string | null => {
    if (!imageRef.current || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const cropSize = 300;
    canvas.width = cropSize;
    canvas.height = cropSize;

    const containerSize = 300;
    const centerX = containerSize / 2;
    const centerY = containerSize / 2;
    const radius = containerSize / 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.clip();

    const scaledWidth = imageSize.width * zoom;
    const scaledHeight = imageSize.height * zoom;
    const drawX = centerX + position.x - scaledWidth / 2;
    const drawY = centerY + position.y - scaledHeight / 2;

    ctx.drawImage(imageRef.current, drawX, drawY, scaledWidth, scaledHeight);
    ctx.restore();

    return canvas.toDataURL("image/png");
  };

  const uploadImage = async (file: File) => {
    try {
      const { type, name } = file;
      const slugifiedName = slugify(name, { lower: true, strict: true, trim: true });

      const presignResponse = await fetch("https://dash.intuipay.xyz/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: slugifiedName }),
      });
      if (!presignResponse.ok) throw new Error("Failed to get upload URL");

      const { data: { preSignedUrl, objectKey } } = (await presignResponse.json()) as APIResponse<{ preSignedUrl: string; objectKey: string; }>;

      const uploadResponse = await fetch(preSignedUrl, { method: "PUT", headers: { "Content-Type": type }, body: file });
      if (!uploadResponse.ok) throw new Error("Failed to upload file");

      const onlineUrl = `${process.env.NEXT_PUBLIC_ASSET_DOMAIN}/${objectKey}`;
      return onlineUrl;
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  };

  const handleConfirm = async () => {
    setIsUploading(true);
    try {
      const file = fileInputRef.current?.files?.[0];
      const croppedDataUrl = getCroppedImage();
      if (croppedDataUrl && file) {
        setIsOpen(false);
        setSelectedImage(null);
        const onlineUrl = await uploadImage(file);
        onUploaded(onlineUrl, croppedDataUrl);
      }
    } catch (error) {
      console.error("Error in handleConfirm", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.1));

  return (
    <>
      <div className={cn("relative inline-block", className)}>
        <div
          className={cn(
            "group relative flex items-center justify-center overflow-hidden rounded-full bg-blue-600 text-white cursor-pointer",
            disabled && "opacity-60 cursor-not-allowed",
          )}
          style={{ width: size, height: size }}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          {value ? (
            <img src={value} alt="avatar" className="h-full w-full object-cover" />
          ) : (
            placeholder || <span className="text-sm">Upload</span>
          )}
          <div className="absolute inset-0 hidden bg-black/40 items-center justify-center group-hover:flex text-xs">Change</div>
        </div>

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" disabled={disabled} />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>编辑头像</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div
              ref={containerRef}
              className="relative mx-auto size-[300px] select-none overflow-hidden rounded-full bg-black/5 border"
              onMouseDown={handleMouseDown}
            >
              {selectedImage && (
                <img
                  ref={imageRef}
                  src={selectedImage}
                  alt="Selected"
                  className="absolute left-1/2 top-1/2 origin-center"
                  style={{
                    transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                    userSelect: "none",
                    WebkitUserDrag: "none",
                  }}
                  draggable={false}
                  onLoad={handleImageLoad}
                />
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex items-center gap-3">
              <Button type="button" variant="outline" size="sm" onClick={handleZoomOut}>-</Button>
              <Slider
                value={[zoom] as unknown as number[]}
                onValueChange={(v) => setZoom(v[0] as unknown as number)}
                max={3}
                min={0.1}
                step={0.05}
              />
              <Button type="button" variant="outline" size="sm" onClick={handleZoomIn}>+</Button>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isUploading}>取消</Button>
              <Button type="button" onClick={handleConfirm} disabled={isUploading}>保存{isUploading && "..."}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
