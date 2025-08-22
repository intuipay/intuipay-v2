'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import {
  TextB as TextBIcon,
  TextItalic as TextItalicIcon,
  TextUnderline as TextUnderlineIcon,
  TextHOne as TextHOneIcon,
  TextHTwo as TextHTwoIcon,
  Paragraph as ParagraphIcon,
  ListBullets as ListBulletsIcon,
  ListNumbers as ListNumbersIcon,
  Link as LinkIcon,
  Image as ImageIcon,
} from '@phosphor-icons/react';
import type { EditorAction } from '@/types/editor';

interface EditorToolbarProps {
  onAction: (action: EditorAction) => void
  disabled?: boolean
}

export function EditorToolbar({ onAction, disabled = false }: EditorToolbarProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const handleLinkSubmit = () => {
    onAction({ type: 'link', url: linkUrl });
    setLinkUrl('');
    setIsLinkDialogOpen(false);
  };

  const handleImageSubmit = () => {
    onAction({ type: 'image', url: imageUrl });
    setImageUrl('');
    setIsImageDialogOpen(false);
  };

  return (
    <div className="flex items-center gap-1 flex-wrap">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
            onClick={() => onAction({ type: 'heading', level: 1 })}
          title="Heading 1"
          className="h-8 w-8 p-0"
          disabled={disabled}
        >
          <TextHOneIcon className="h-4 w-4 mr-2" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction({ type: 'heading', level: 2 })}
          title="Heading 2"
          className="h-8 w-8 p-0"
          disabled={disabled}
        >
          <TextHTwoIcon className="h-4 w-4 mr-2" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction({ type: 'paragraph' })}
          title="Underline"
          className="h-8 w-8 p-0"
          disabled={disabled}
        >
          <ParagraphIcon className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction({ type: 'bold' })}
          title="Bold (Ctrl+B)"
          className="h-8 w-8 p-0"
          disabled={disabled}
        >
          <TextBIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction({ type: 'italic' })}
          title="Italic (Ctrl+I)"
          className="h-8 w-8 p-0"
          disabled={disabled}
        >
          <TextItalicIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction({ type: 'underline' })}
          title="Underline"
          className="h-8 w-8 p-0"
          disabled={disabled}
        >
          <TextUnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction({ type: 'unordered-list' })}
          title="Bullet List"
          className="h-8 w-8 p-0"
          disabled={disabled}
        >
          <ListBulletsIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction({ type: 'ordered-list' })}
          title="Numbered List"
          className="h-8 w-8 p-0"
          disabled={disabled}
        >
          <ListNumbersIcon className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      <div className="flex items-center gap-1">
        <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" title="Link" className="h-8 w-8 p-0" disabled={disabled}>
              <LinkIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="link-url">URL</Label>
                <Input
                  id="link-url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  onKeyDown={(e) => e.key === 'Enter' && handleLinkSubmit()}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleLinkSubmit}>Add Link</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" title="Image" className="h-8 w-8 p-0" disabled={disabled}>
              <ImageIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  onKeyDown={(e) => e.key === 'Enter' && handleImageSubmit()}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsImageDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleImageSubmit}>Add Image</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
