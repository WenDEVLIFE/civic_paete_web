import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { IMAGE_MAX_DIMENSION, IMAGE_QUALITY } from '@/constants';
import { requireStorage } from '@/lib/firebase';
import { readLocalBlob } from '@/storage/readLocalBlob';

export type UploadReportImageOptions = {
  uri: string;
  barangay: string;
  reportId: string;
  maxDimension?: number;
  quality?: number;
};

/**
 * Sanitizes a barangay name for use as a cloud storage directory slug.
 * Example: "Ibaba del Sur" -> "ibaba-del-sur"
 */
function slugifyBarangay(barangay: string): string {
  return (
    barangay
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'general'
  );
}

/**
 * Compresses a picked photo on device before upload. The web client uses Canvas + WebP;
 * React Native cannot, so this uses the native image manipulation API and JPEG output.
 */
export async function compressReportImage(
  uri: string,
  maxDimension = IMAGE_MAX_DIMENSION,
  quality = IMAGE_QUALITY
): Promise<string> {
  const context = ImageManipulator.manipulate(uri, {
    maxWidth: maxDimension,
    maxHeight: maxDimension,
  });
  const rendered = await context.renderAsync();
  const result = await rendered.saveAsync({
    format: SaveFormat.JPEG,
    compress: quality,
  });
  return result.uri;
}

/**
 * Uploads a community report photo to Firebase Storage after on-device compression.
 *
 * Bucket Path: `reports/{sanitizedBarangay}/{reportId}_{timestamp}.jpg`
 */
export async function uploadReportImage({
  uri,
  barangay,
  reportId,
  maxDimension = IMAGE_MAX_DIMENSION,
  quality = IMAGE_QUALITY,
}: UploadReportImageOptions): Promise<string> {
  if (!uri) {
    throw new Error('No image file provided for upload.');
  }

  const compressedUri = await compressReportImage(uri, maxDimension, quality);
  const blob = await readLocalBlob(compressedUri);

  const barangaySlug = slugifyBarangay(barangay);
  const storagePath = `reports/${barangaySlug}/${reportId}_${Date.now()}.jpg`;
  const storageRef = ref(requireStorage(), storagePath);

  await uploadBytes(storageRef, blob, {
    contentType: 'image/jpeg',
    cacheControl: 'public, max-age=31536000, immutable',
    customMetadata: {
      reportId,
      barangay,
      uploadedAt: new Date().toISOString(),
    },
  });

  return getDownloadURL(storageRef);
}
