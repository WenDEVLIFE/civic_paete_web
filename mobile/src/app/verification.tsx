import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import { Check, FileUp } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, Card, Chip, Field, PrimaryButton, SecondaryButton } from '@/components/ui';
import { MAX_IMAGE_BYTES, PAETE_BARANGAYS } from '@/constants';
import { useAuth } from '@/lib/auth';
import { submitVerificationRequest, VERIFICATION_FILE_TYPES } from '@/services/verificationService';
import { radius, spacing, useTheme } from '@/theme';

const CERTIFICATE = 'Barangay Residency Certificate';
const ID_TYPES = [
  'PhilSys National ID',
  "COMELEC Voter's ID / Certification",
  "Driver's License (LTO)",
  'Postal ID (Digital)',
  'UMID Card',
  'Barangay Resident ID Card',
];

function isEligibleBirthDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    return false;
  }
  const today = new Date();
  const birthYear = date.getUTCFullYear();
  const birthMonth = date.getUTCMonth();
  const birthDay = date.getUTCDate();
  const birthdayPassed = today.getMonth() > birthMonth ||
    (today.getMonth() === birthMonth && today.getDate() >= birthDay);
  return today.getFullYear() - birthYear - (birthdayPassed ? 0 : 1) >= 15;
}

export default function VerificationScreen() {
  const { colors } = useTheme();
  const { user, verificationStatus, isVerifiedResident } = useAuth();
  const [name, setName] = useState(user?.displayName ?? '');
  const [birthDate, setBirthDate] = useState('');
  const [barangay, setBarangay] = useState<(typeof PAETE_BARANGAYS)[number]>();
  const [address, setAddress] = useState('');
  const [method, setMethod] = useState<'certificate' | 'gov_id'>('certificate');
  const [idType, setIdType] = useState(ID_TYPES[0]);
  const [documentNumber, setDocumentNumber] = useState('');
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset>();
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [picking, setPicking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const submitInProgress = useRef(false);
  const pending = submitted || verificationStatus === 'pending';

  const chooseDocument = async () => {
    setPicking(true);
    setError('');
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: VERIFICATION_FILE_TYPES,
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const selected = result.assets[0];
      if (!selected.mimeType || !VERIFICATION_FILE_TYPES.includes(selected.mimeType)) {
        throw new Error('Select a JPEG, PNG, WebP, or PDF file.');
      }
      if (selected.size !== undefined && selected.size > MAX_IMAGE_BYTES) {
        throw new Error('The document must be 5 MB or smaller.');
      }
      setFile(selected);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not open the document picker.');
    } finally {
      setPicking(false);
    }
  };

  const submit = async () => {
    if (submitInProgress.current) return;
    if (!name.trim() || !barangay || !address.trim() || !documentNumber.trim()) {
      setError('Enter your full name, barangay, address, and document number.');
      return;
    }
    if (!isEligibleBirthDate(birthDate.trim())) {
      setError('Enter a valid birth date (YYYY-MM-DD). Applicants must be at least 15.');
      return;
    }
    if (!file || !consent) {
      setError('Attach your proof of residency and confirm the declaration.');
      return;
    }

    submitInProgress.current = true;
    setSubmitting(true);
    setError('');
    try {
      await submitVerificationRequest({
        applicantName: name,
        barangay,
        address,
        birthDate: birthDate.trim(),
        method,
        documentType: method === 'certificate' ? CERTIFICATE : idType,
        documentNumber,
        file,
      });
      setFile(undefined);
      setSubmitted(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Submission failed. Please try again.');
    } finally {
      submitInProgress.current = false;
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.canvas }]}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <AppText variant="title">Barangay residency verification</AppText>
        {pending || isVerifiedResident ? (
          <>
            <AppText variant="body" color={colors.textMuted}>
              {isVerifiedResident
                ? 'Your account is verified. You can file community reports.'
                : 'Your request is under review. Check My Account for its status.'}
            </AppText>
            <PrimaryButton label="View my account" onPress={() => router.dismissTo('/profile')} />
          </>
        ) : (
          <>
            <AppText variant="body" color={colors.textMuted}>
              Submit proof of residency to unlock community reporting.
            </AppText>
            <Card style={styles.section}>
              <AppText variant="heading">Resident details</AppText>
              <Field label="Full name" accessibilityLabel="Full name" value={name} onChangeText={setName} editable={!submitting} />
              <Field label="Date of birth" accessibilityLabel="Date of birth" placeholder="YYYY-MM-DD" value={birthDate} onChangeText={setBirthDate} maxLength={10} editable={!submitting} />
              <AppText variant="label">BARANGAY</AppText>
              <View style={styles.chips}>
                {PAETE_BARANGAYS.map((item) => (
                  <Chip key={item} label={item} active={barangay === item} onPress={() => !submitting && setBarangay(item)} />
                ))}
              </View>
              <Field label="Residential address" accessibilityLabel="Residential address" value={address} onChangeText={setAddress} editable={!submitting} />
            </Card>

            <Card style={styles.section}>
              <AppText variant="heading">Proof of residency</AppText>
              <View style={styles.chips}>
                <Chip label="Barangay certificate" active={method === 'certificate'} onPress={() => !submitting && setMethod('certificate')} />
                <Chip label="Government ID" active={method === 'gov_id'} onPress={() => !submitting && setMethod('gov_id')} />
              </View>
              {method === 'gov_id' ? (
                <View style={styles.chips}>
                  {ID_TYPES.map((type) => (
                    <Chip key={type} label={type} active={idType === type} onPress={() => !submitting && setIdType(type)} />
                  ))}
                </View>
              ) : null}
              <Field label="Document number" accessibilityLabel="Document number" value={documentNumber} onChangeText={setDocumentNumber} editable={!submitting} autoCapitalize="characters" />
              <SecondaryButton
                label={picking ? 'Opening files…' : file ? 'Replace document' : 'Attach document'}
                disabled={submitting || picking}
                onPress={chooseDocument}
                icon={<FileUp size={17} color={colors.primary} />}
              />
              <AppText variant="caption" color={colors.textMuted}>
                {file ? file.name : 'JPEG, PNG, WebP, or PDF up to 5 MB'}
              </AppText>
            </Card>

            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: consent, disabled: submitting }}
              onPress={() => setConsent(!consent)}
              disabled={submitting}
              style={[styles.consent, { borderColor: colors.border, backgroundColor: colors.surface }]}
            >
              <View style={[styles.checkbox, { borderColor: colors.primary, backgroundColor: consent ? colors.primary : colors.surface }]}>
                {consent ? <Check size={15} color={colors.onPrimary} /> : null}
              </View>
              <AppText variant="caption" style={styles.consentText}>
                I confirm that I am a Paete resident aged 15 or older, that the information and document I am submitting are accurate, and that the Paete Municipal Government may use them to verify my residency.
              </AppText>
            </Pressable>

            {error ? <View accessibilityLiveRegion="polite"><AppText variant="caption" color={colors.danger}>{error}</AppText></View> : null}
            <PrimaryButton label="Submit verification request" loading={submitting} disabled={picking} onPress={submit} />
            <SecondaryButton label="Cancel" disabled={submitting} onPress={() => router.dismissTo('/profile')} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    gap: spacing.lg,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    padding: spacing.lg,
  },
  section: { padding: spacing.lg, gap: spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  consent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: radius.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  consentText: { flex: 1 },
});
