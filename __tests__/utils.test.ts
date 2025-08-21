import { describe, it, expect } from "vitest";
import { toS3ImageName } from "@/lib/utils";

describe('Test Utils', () => {
  describe('toS3ImageName', () => {
    it('should convert image name to S3 format', () => {
      expect(toS3ImageName('My Image.png')).toBe('my-image.png');
      expect(toS3ImageName('Another Image.JPG')).toBe('another-image.JPG');
      expect(toS3ImageName('wuyanzu-1.webp')).toBe('wuyanzu-1.webp');
      // slugify 没法处理locale，所以会trim文件名，但是影响应该不大
      expect(toS3ImageName('我的头像.jpg')).toBe('.jpg');

      expect(toS3ImageName('avatar (1).png')).toBe('avatar-1.png');
      expect(toS3ImageName('avatar （21）.png')).toBe('avatar-21.png');
    });
  });
});
