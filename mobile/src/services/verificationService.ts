import type { DocumentPickerAsset } from 'expo-document-picker';
import { File } from 'expo-file-system';
import {
  collection,
  doc,
  getDocFromServer,
  getDocsFromServer,
  query,
  runTransaction,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';

import { MAX_IMAGE_BYTES, PAETE_BARANGAYS, VERIFIED_STATUSES } from '@/constants';
import { requireAuth, requireDb, requireStorage } from '@/lib/firebase';
import { readLocalBlob } from '@/storage/readLocalBlob';
import type { VerificationStatus } from '@/types';

const fileExtensions: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
};

export const VERIFICATION_FILE_TYPES = Object.keys(fileExtensions);

export function userVerificationRequests(userId: string) {
  return query(collection(requireDb(), 'verification_requests'), where('userId', '==', userId));
}

function checkEligible(status?: VerificationStatus) {
  if (status === 'pending') {
    throw new Error('Your verification request is already under review.');
  }
  if (status && VERIFIED_STATUSES.includes(status)) {
    throw new Error('Your account is already verified.');
  }
}

type VerificationInput = {
  applicantName: string;
  barangay: (typeof PAETE_BARANGAYS)[number];
  address: string;
  birthDate: string;
  method: 'certificate' | 'gov_id';
  documentType: string;
  documentNumber: string;
  file: DocumentPickerAsset;
};

export async function submitVerificationRequest(input: VerificationInput) {
  const user = requireAuth().currentUser;
  if (!user) throw new Error('Sign in to submit a verification request.');

  const contentType = input.file.mimeType;
  if (!contentType || !VERIFICATION_FILE_TYPES.includes(contentType)) {
    throw new Error('Select a JPEG, PNG, WebP, or PDF file.');
  }
  const extension = fileExtensions[contentType];
  const file = input.file.file ?? new File(input.file.uri);
  if (!file.size || file.size > MAX_IMAGE_BYTES) {
    throw new Error('Choose a readable document up to 5 MB.');
  }

  const database = requireDb();
  const userRef = doc(database, 'users', user.uid);
  const profile = await getDocFromServer(userRef);
  checkEligible(profile.data()?.verificationStatus);
  const requests = await getDocsFromServer(userVerificationRequests(user.uid));
  if (requests.docs.some((request) => request.data().status === 'pending')) {
    throw new Error('Your verification request is already under review.');
  }

  const requestRef = doc(collection(database, 'verification_requests'));
  const documentType = input.documentType.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/_+$/, '');
  const proofRef = ref(requireStorage(), `verifications/${user.uid}/${documentType}_${requestRef.id}.${extension}`);
  const blob = input.file.file ?? await readLocalBlob(input.file.uri);
  await uploadBytes(proofRef, blob, {
    contentType,
    cacheControl: 'private, no-store',
    customMetadata: { userId: user.uid, documentType, privacyClassification: 'confidential_kyc' },
  });

  try {
    const fileUrl = await getDownloadURL(proofRef);
    await runTransaction(database, async (transaction) => {
      const latest = (await transaction.get(userRef)).data();
      checkEligible(latest?.verificationStatus);
      if (latest?.verificationRequestId !== profile.data()?.verificationRequestId) {
        throw new Error('Your verification record changed. Check your account and try again.');
      }

      transaction.set(requestRef, {
        id: requestRef.id,
        userId: user.uid,
        applicantName: input.applicantName.trim(),
        email: user.email ?? '',
        barangay: input.barangay,
        address: input.address.trim(),
        birthDate: input.birthDate,
        method: input.method,
        documentType: input.documentType,
        documentNumber: input.documentNumber.trim(),
        fileUrl,
        status: 'pending',
        submittedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      // The existing rules reserve verificationStatus updates for staff.
      transaction.set(userRef, { verificationRequestId: requestRef.id }, { merge: true });
    });
  } catch (error) {
    // If the commit outcome is unknown, keep the proof so a committed request can still be reviewed.
    const saved = await getDocsFromServer(userVerificationRequests(user.uid)).catch(() => null);
    if (saved?.docs.some((request) => request.id === requestRef.id)) return;
    if (saved) await deleteObject(proofRef).catch(() => undefined);
    throw error;
  }
}
