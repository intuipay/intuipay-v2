'use client';

import * as React from 'react';
import { useState, useRef, useCallback, Dispatch, SetStateAction } from 'react';
import { CameraIcon, PlusIcon, MinusIcon, NotePencilIcon } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { toS3ImageName } from '@/lib/utils';
import { APIResponse } from '@/types';

interface AvatarUploadProps {
  value?: string
  isUploading: boolean
  setIsUploading: Dispatch<SetStateAction<boolean>>
  onUploaded: (url: string, croppedDataUrl: string) => void
  size?: number
  className?: string
  disabled?: boolean
  placeholder?: React.ReactNode
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
    const file = event.target.files?.[ 0 ];
    if (file && file.type.startsWith('image/')) {
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

      // Center the image initially
      const container = containerRef.current;
      if (container) {
        const containerSize = 300; // Fixed container size
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
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const getCroppedImage = (): string | null => {
    if (!imageRef.current || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const cropSize = 300;
    canvas.width = cropSize;
    canvas.height = cropSize;

    // Calculate the crop area
    const containerSize = 300;
    const centerX = containerSize / 2;
    const centerY = containerSize / 2;
    const radius = containerSize / 2;

    // Create circular clipping path
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.clip();

    // Draw the image
    const scaledWidth = imageSize.width * zoom;
    const scaledHeight = imageSize.height * zoom;
    const drawX = centerX + position.x - scaledWidth / 2;
    const drawY = centerY + position.y - scaledHeight / 2;

    ctx.drawImage(imageRef.current, drawX, drawY, scaledWidth, scaledHeight);
    ctx.restore();

    return canvas.toDataURL('image/png');
  };

  const uploadImage = async (file: File) => {
    try {
      const { type, name } = file;
      const slugifiedName = toS3ImageName(name);

      // Step 1: Get presigned URL
      const presignResponse = await fetch(`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: slugifiedName,
        }),
      });
      if (!presignResponse.ok) {
        throw new Error('Failed to get upload URL');
      }

      const {
        data: {
          preSignedUrl,
          objectKey,
        },
      } = (await presignResponse.json()) as APIResponse<{
        preSignedUrl: string;
        objectKey: string;
      }>;

      // Step 2: Upload file using presigned URL
      const uploadResponse = await fetch(preSignedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      const onlineUrl = `${process.env.NEXT_PUBLIC_ASSET_DOMAIN}/${objectKey}`;
      return onlineUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  };

  const handleConfirm = async () => {
    setIsUploading(true);
    try {
      const file = fileInputRef.current?.files?.[ 0 ];
      const croppedDataUrl = getCroppedImage();
      if (croppedDataUrl && file) {
        setIsOpen(false);
        setSelectedImage(null);
        const onlineUrl = await uploadImage(file);
        onUploaded(onlineUrl, croppedDataUrl);
      }
    } catch (error) {
      console.error('Error in handleConfirm: Failed to upload image or process cropped data URL.', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.1));
  };

  return (
    <>
      <div className={cn('relative inline-block', className)}>
        <div
          className={cn(
            'relative overflow-hidden rounded-full border-2 border-dashed border-gray-300 transition-all duration-200 cursor-pointer group',
            'hover:border-gray-400 hover:bg-gray-50',
            disabled && 'cursor-not-allowed opacity-50',
            value && 'border-solid border-gray-200',
            isUploading && 'cursor-wait pointer-events-none'
          )}
          style={{ width: size, height: size }}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
            </div>
          ) : value ? (
            <>
              <img src={value || '/placeholder.svg'} alt="Avatar" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <CameraIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
              {placeholder || <NotePencilIcon className="w-8 h-8" />}
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogTitle className="sr-only">Avatar Upload</DialogTitle>
          <div className="space-y-4">
            {/* Image Editor */}
            <div
              ref={containerRef}
              className="relative mx-auto bg-gray-100 overflow-hidden"
              style={{ width: 300, height: 300 }}
            >
              {selectedImage && (
                <>
                  <img
                    ref={imageRef}
                    src={selectedImage || '/placeholder.svg'}
                    alt="Selected"
                    className="absolute cursor-move select-none"
                    style={{
                      width: imageSize.width * zoom,
                      height: imageSize.height * zoom,
                      left: 150 + position.x - (imageSize.width * zoom) / 2,
                      top: 150 + position.y - (imageSize.height * zoom) / 2,
                    }}
                    onLoad={handleImageLoad}
                    onMouseDown={handleMouseDown}
                    draggable={false}
                  />

                  {/* Circular crop overlay */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div
                      className="absolute border-2 border-blue-500 rounded-full"
                      style={{
                        width: 300,
                        height: 300,
                        left: 0,
                        top: 0,
                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                      }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={zoom <= 0.1}>
                <MinusIcon className="w-4 h-4" />
              </Button>

              <div className="flex-1">
                <Slider
                  value={[zoom]}
                  onValueChange={(value) => setZoom(value[ 0 ])}
                  min={0.1}
                  max={3}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={zoom >= 3}>
                <PlusIcon className="w-4 h-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-2">
              <Button onClick={handleConfirm}>Confirm</Button>
            </div>
          </div>

          {/* Hidden canvas for cropping */}
          <canvas ref={canvasRef} className="hidden" />
        </DialogContent>
      </Dialog>
    </>
  );
}
