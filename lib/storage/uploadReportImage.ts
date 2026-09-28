import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export interface UploadReportImageOptions {
  /** The original file selected by the citizen */
  file: File;
  /** Paete barangay name (used for bucket path partitioning) */
  barangay: string;
  /** Unique ID of the community report */
  reportId: string;
  /** Max dimension in pixels (default: 1920) */
  maxDimension?: number;
  /** Compression quality between 0.0 and 1.0 (default: 0.82) */
  quality?: number;
}

/**
 * Compresses an image client-side using HTML5 Canvas.
 * Scales down images larger than maxDimension while preserving aspect ratio,
 * and encodes to WebP format for optimal byte weight and transfer speed.
 */
export async function compressImage(
  file: File,
  maxDimension = 1920,
  quality = 0.82
): Promise<Blob> {
  // If file is not an image (e.g. unexpected format), return as-is
  if (!file.type.startsWith("image/")) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Failed to read image file."));

    reader.onload = (event) => {
      const img = new Image();

      img.onerror = () => reject(new Error("Failed to decode image data."));

      img.onload = () => {
        let { width, height } = img;

        // Calculate proportional downscaling if exceeding maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          // Fallback if 2d context unavailable
          return resolve(file);
        }

        // Apply smooth downsampling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP format with fallback to original type
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          "image/webp",
          quality
        );
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Sanitizes a barangay name for use as a cloud storage directory slug.
 * Example: "Ibaba del Sur" -> "ibaba-del-sur"
 */
function slugifyBarangay(barangay: string): string {
  return (
    barangay
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "general"
  );
}

/**
 * Uploads a community report photo to Firebase Storage with automated client-side compression.
 *
 * Bucket Path: `reports/{sanitizedBarangay}/{reportId}_{timestamp}.webp`
 *
 * @returns {Promise<string>} The permanent public CDN download URL of the uploaded image.
 */
export async function uploadReportImage({
  file,
  barangay,
  reportId,
  maxDimension = 1920,
  quality = 0.82,
}: UploadReportImageOptions): Promise<string> {
  if (!file) {
    throw new Error("No image file provided for upload.");
  }

  // 1. Perform client-side compression
  const compressedBlob = await compressImage(file, maxDimension, quality);

  // 2. Build structured storage path
  const barangaySlug = slugifyBarangay(barangay);
  const timestamp = Date.now();
  const fileExtension = compressedBlob.type === "image/webp" ? "webp" : "jpg";
  const storagePath = `reports/${barangaySlug}/${reportId}_${timestamp}.${fileExtension}`;

  // 3. Create Storage reference
  const storageRef = ref(storage, storagePath);

  // 4. Upload with metadata headers
  const uploadResult = await uploadBytes(storageRef, compressedBlob, {
    contentType: compressedBlob.type || "image/webp",
    cacheControl: "public, max-age=31536000, immutable",
    customMetadata: {
      reportId,
      barangay,
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
    },
  });

  // 5. Retrieve and return permanent download URL
  const downloadUrl = await getDownloadURL(uploadResult.ref);
  return downloadUrl;
}
