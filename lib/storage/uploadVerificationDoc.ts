import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { compressImage } from "./uploadReportImage";

export interface UploadVerificationDocOptions {
  /** The citizen applicant's unique Firebase user ID */
  userId: string;
  /** Document type slug (e.g., "philsys_id", "voters_id", "barangay_cert") */
  documentType: string;
  /** The selected File object (image or PDF) */
  file: File;
}

/**
 * Sanitizes a document type string for safe use in Storage file paths.
 */
function sanitizeDocType(docType: string): string {
  return docType
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "document";
}

/**
 * Uploads a resident KYC / residency proof document to Firebase Storage:
 * Storage Path: verifications/{userId}/{documentType}_{timestamp}.ext
 *
 * Automatically optimizes images via client-side downsampling/WebP encoding.
 * PDFs are uploaded directly without conversion.
 *
 * Returns the secure download URL to be stored in the verification request document.
 */
export async function uploadVerificationDocument({
  userId,
  documentType,
  file,
}: UploadVerificationDocOptions): Promise<string> {
  const timestamp = Date.now();
  const safeDocType = sanitizeDocType(documentType);
  const isImage = file.type.startsWith("image/");
  const isPdf = file.type === "application/pdf";

  let uploadData: Blob | Uint8Array = file;
  let extension = "bin";

  if (isImage) {
    try {
      uploadData = await compressImage(file, 1920, 0.85);
      extension = "webp";
    } catch (compressionErr) {
      console.warn(
        "Notice: Client image compression skipped, uploading original:",
        compressionErr
      );
      extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    }
  } else if (isPdf) {
    extension = "pdf";
  } else {
    extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  }

  // Storage path: verifications/{userId}/{documentType}_{timestamp}.ext
  const storagePath = `verifications/${userId}/${safeDocType}_${timestamp}.${extension}`;
  const storageRef = ref(storage, storagePath);

  const contentType =
    isImage && extension === "webp"
      ? "image/webp"
      : file.type || "application/octet-stream";

  const snapshot = await uploadBytes(storageRef, uploadData, {
    contentType,
    customMetadata: {
      userId,
      documentType: safeDocType,
      uploadedAt: new Date(timestamp).toISOString(),
      originalFileName: file.name,
      privacyClassification: "confidential_kyc",
    },
  });

  const downloadUrl = await getDownloadURL(snapshot.ref);
  return downloadUrl;
}
