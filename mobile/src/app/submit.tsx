import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import {
  BadgeCheck,
  Camera,
  ImagePlus,
  LogIn,
  ShieldAlert,
  Trash2,
  X,
} from 'lucide-react-native';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePreferences } from '@/lib/preferences';
import { CategoryIcon } from '@/components/CategoryIcon';
import {
  AppText,
  Chip,
  EmptyState,
  Field,
  LoadingState,
  PrimaryButton,
  SecondaryButton,
} from '@/components/ui';
import {
  BLOCKED_MESSAGES,
  CATEGORIES,
  CATEGORY_ORDER,
  MAX_IMAGE_BYTES,
  PAETE_BARANGAYS,
  VERIFICATION_LABELS,
} from '@/constants';
import { displayNameFor, useAuth } from '@/lib/auth';
import { formatFileSize } from '@/lib/format';
import { createReport } from '@/services/reportService';
import { radius, spacing, useTheme } from '@/theme';
import type { ReportCategory } from '@/types';

type PickedImage = { uri: string; size: number | null };

export default function SubmitReportScreen() {
  const { t } = usePreferences();
  const theme = useTheme();
  const {
    user,
    loading,
    googleReady,
    firebaseReady,
    isVerifiedResident,
    verificationStatus,
    signInWithGoogle,
  } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [barangay, setBarangay] = useState<string | null>(null);
  const [category, setCategory] = useState<ReportCategory | null>(null);
  const [locationDetail, setLocationDetail] = useState('');
  const [image, setImage] = useState<PickedImage | null>(null);
  const [anonymous, setAnonymous] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const applyPickedAsset = (asset: ImagePicker.ImagePickerAsset) => {
    if (typeof asset.fileSize === 'number' && asset.fileSize > MAX_IMAGE_BYTES) {
      Alert.alert(t('Photo too large'), t(BLOCKED_MESSAGES.imageTooLarge));
      return;
    }
    setImage({ uri: asset.uri, size: asset.fileSize ?? null });
  };

  const pickFromLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        t('Photo permission required'),
        t('Allow photo access so you can attach evidence to your community report.')
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsEditing: false,
    });
    if (!result.canceled) {
      applyPickedAsset(result.assets[0]);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        t('Camera permission required'),
        t('Allow camera access so you can photograph the concern you are reporting.')
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsEditing: false,
    });
    if (!result.canceled) {
      applyPickedAsset(result.assets[0]);
    }
  };

  const choosePhoto = () => {
    Alert.alert(t('Attach photo evidence'), t('A photo is required for municipal verification.'), [
      { text: t('Take photo'), onPress: () => void takePhoto() },
      { text: t('Choose from library'), onPress: () => void pickFromLibrary() },
      { text: t('Cancel'), style: 'cancel' },
    ]);
  };

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      Alert.alert(t('Sign-in failed'), t(err instanceof Error ? err.message : 'Please try again.'));
    } finally {
      setSigningIn(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert(t('Sign in required'), t(BLOCKED_MESSAGES.signInRequired));
      return;
    }
    if (!title.trim()) {
      setFormError(BLOCKED_MESSAGES.titleRequired);
      return;
    }
    if (!description.trim()) {
      setFormError(BLOCKED_MESSAGES.descriptionRequired);
      return;
    }
    if (!barangay) {
      setFormError(BLOCKED_MESSAGES.barangayRequired);
      return;
    }
    if (!category) {
      setFormError(BLOCKED_MESSAGES.categoryRequired);
      return;
    }
    if (!image) {
      setFormError(BLOCKED_MESSAGES.imageRequired);
      return;
    }

    setFormError(null);
    setSubmitting(true);
    try {
      const reportId = await createReport({
        title: title.trim(),
        description: description.trim(),
        category,
        barangay,
        locationDetail: locationDetail.trim() || undefined,
        imageUri: image.uri,
        isAnonymous: anonymous,
        anonymousAlias: anonymous
          ? `Protected Citizen #${Math.floor(100 + Math.random() * 9000)}`
          : undefined,
        authorUid: user.uid,
        authorName: displayNameFor(user),
        authorRealName: user.displayName || displayNameFor(user),
        authorEmail: user.email ?? undefined,
        authorAvatar: user.photoURL ?? undefined,
        authorRole: 'resident',
        authorVerificationStatus: verificationStatus,
      });

      router.replace({ pathname: '/report/[id]', params: { id: reportId } });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Report could not be submitted.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: theme.colors.canvas }]}>
      <View style={styles.topBar}>
        <AppText variant="heading">{t('File a report')}</AppText>
        <View style={styles.flexSpacer} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('Close report form')}
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.closeButton,
            {
              borderColor: theme.colors.border,
              backgroundColor: pressed ? theme.colors.surfaceAlt : theme.colors.surface,
            },
          ]}
        >
          <X size={18} color={theme.colors.text} />
        </Pressable>
      </View>

      {loading ? (
        <LoadingState label={t('Checking your citizen account…')} />
      ) : !firebaseReady ? (
        <EmptyState
          icon={<ShieldAlert size={24} color={theme.colors.danger} />}
          title={t('Backend not configured')}
          message={t(BLOCKED_MESSAGES.notConfigured)}
        />
      ) : !user ? (
        <ScrollView contentContainerStyle={styles.gateContent}>
          <View
            style={[
              styles.gateIcon,
              { backgroundColor: theme.colors.glow, borderColor: theme.colors.border },
            ]}
          >
            <LogIn size={26} color={theme.colors.primary} />
          </View>
          <AppText variant="title" style={styles.center}>
            {t('Sign in to file a report')}
          </AppText>
          <AppText variant="body" color={theme.colors.textMuted} style={styles.center}>
            {t('Reports carry an accountable citizen identity so the barangay and Municipal Hall can follow up with you. Anonymous mode keeps your name off the public feed while the municipality still knows who filed it.')}
          </AppText>
          <PrimaryButton
            label={signingIn ? t('Opening Google…') : t('Continue with Google')}
            loading={signingIn}
            onPress={handleGoogleSignIn}
            style={styles.gateAction}
          />
          {!googleReady ? (
            <AppText variant="caption" color={theme.colors.danger} style={styles.center}>
              {t(BLOCKED_MESSAGES.googleNotConfigured)}
            </AppText>
          ) : (
            <AppText variant="caption" color={theme.colors.textSubtle} style={styles.center}>
              {t('Google Sign-In requires a development build (npx expo run:ios / npx expo run:android).')}
            </AppText>
          )}
        </ScrollView>
      ) : !isVerifiedResident ? (
        <ScrollView contentContainerStyle={styles.gateContent}>
          <View
            style={[
              styles.gateIcon,
              {
                backgroundColor: theme.colors.status.pending.bg,
                borderColor: theme.colors.status.pending.border,
              },
            ]}
          >
            <BadgeCheck size={26} color={theme.colors.status.pending.fg} />
          </View>
          <View
            style={[
              styles.gatePill,
              {
                backgroundColor: theme.colors.status.pending.bg,
                borderColor: theme.colors.status.pending.border,
              },
            ]}
          >
            <AppText variant="label" color={theme.colors.status.pending.fg}>
              {t(VERIFICATION_LABELS[verificationStatus])}
            </AppText>
          </View>
          <AppText variant="title" style={styles.center}>
            {verificationStatus === 'pending'
              ? t('Residency verification under review')
              : t('Verified resident account required')}
          </AppText>
          <AppText variant="body" color={theme.colors.textMuted} style={styles.center}>
            {verificationStatus === 'pending'
              ? t('Paete Municipal Hall is reviewing the documents you submitted. You will be able to post community concerns once your barangay residency is approved.')
              : t('To keep reports trustworthy and prevent fake or automated submissions, only verified Paete residents can post community concerns.')}
          </AppText>

          <View
            style={[
              styles.gateNotes,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
            ]}
          >
            <AppText variant="bodyBold">{t('Why verification comes first')}</AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              {t('• Verified reports are endorsed to the correct Barangay Captain and Municipal Engineering Office.')}
            </AppText>
            <AppText variant="caption" color={theme.colors.textMuted}>
              {t('• Anonymous mode stays available: your name is hidden publicly, but the municipality can still reach you.')}
            </AppText>
          </View>

          {verificationStatus !== 'pending' ? (
            <PrimaryButton label={t('Verify residency')} onPress={() => router.replace('/verification')} />
          ) : null}
          <SecondaryButton label={t('Back to community')} onPress={() => router.replace('/')} />
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.form}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <AppText variant="label" color={theme.colors.textSubtle} style={styles.sectionLabel}>
              {t('1 · Concern')}
            </AppText>
            <Field
              label={t('Title')}
              placeholder={t('e.g. Broken streetlight along Quinale road')}
              value={title}
              onChangeText={setTitle}
              maxLength={120}
            />
            <Field
              label={t('Description (required)')}
              accessibilityLabel={t('Description (required)')}
              placeholder={t('Describe what you observed, how long it has been happening, and who it affects.')}
              value={description}
              onChangeText={(value) => {
                setDescription(value);
                if (value.trim() && formError === BLOCKED_MESSAGES.descriptionRequired) {
                  setFormError(null);
                }
              }}
              multiline
              numberOfLines={5}
              style={styles.textArea}
            />
            {formError === BLOCKED_MESSAGES.descriptionRequired ? (
              <View accessibilityLiveRegion="polite">
                <AppText variant="caption" color={theme.colors.danger}>{t(formError)}</AppText>
              </View>
            ) : null}
          </View>

          <View style={styles.section}>
            <AppText variant="label" color={theme.colors.textSubtle} style={styles.sectionLabel}>
              {t('2 · Location')}
            </AppText>
            <View style={styles.chipGrid}>
              {PAETE_BARANGAYS.map((option) => (
                <Chip
                  key={option}
                  label={option}
                  active={barangay === option}
                  onPress={() => setBarangay(option)}
                />
              ))}
            </View>
            <Field
              label={t('Landmark or street detail')}
              placeholder={t('Nearest landmark, street, or purok')}
              value={locationDetail}
              onChangeText={setLocationDetail}
            />
          </View>

          <View style={styles.section}>
            <AppText variant="label" color={theme.colors.textSubtle} style={styles.sectionLabel}>
              {t('3 · Category')}
            </AppText>
            <View style={styles.chipGrid}>
              {CATEGORY_ORDER.map((option) => (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityState={{ selected: category === option }}
                  onPress={() => setCategory(option)}
                  style={({ pressed }) => [
                    styles.categoryOption,
                    {
                      borderColor:
                        category === option ? theme.colors.primary : theme.colors.border,
                      backgroundColor:
                        category === option
                          ? theme.colors.glow
                          : pressed
                            ? theme.colors.surfaceAlt
                            : theme.colors.surface,
                    },
                  ]}
                >
                  <CategoryIcon
                    category={option}
                    size={16}
                    color={category === option ? theme.colors.primary : theme.colors.textMuted}
                  />
                  <AppText
                    variant="caption"
                    color={category === option ? theme.colors.primary : theme.colors.textMuted}
                    style={styles.categoryOptionLabel}
                  >
                    {t(CATEGORIES[option].label)}
                  </AppText>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <AppText variant="label" color={theme.colors.textSubtle} style={styles.sectionLabel}>
              {t('4 · Photo evidence')}
            </AppText>
            {image ? (
              <View style={styles.previewWrap}>
                <Image
                  source={{ uri: image.uri }}
                  style={styles.preview}
                  contentFit="cover"
                  transition={160}
                  alt={t('Selected report photo')}
                  accessibilityLabel={t('Selected report photo')}
                />
                <View style={styles.previewActions}>
                  <SecondaryButton
                    label={t('Replace')}
                    onPress={choosePhoto}
                    icon={<Camera size={15} color={theme.colors.text} />}
                    style={styles.previewButton}
                  />
                  <SecondaryButton
                    label={t('Remove')}
                    onPress={() => setImage(null)}
                    icon={<Trash2 size={15} color={theme.colors.text} />}
                    style={styles.previewButton}
                  />
                </View>
                {image.size ? (
                  <AppText variant="caption" color={theme.colors.textSubtle}>
                    {t('{size} · compressed before upload', { size: formatFileSize(image.size) })}
                  </AppText>
                ) : null}
              </View>
            ) : (
              <Pressable
                accessibilityRole="button"
                onPress={choosePhoto}
                style={({ pressed }) => [
                  styles.dropzone,
                  {
                    borderColor: theme.colors.borderStrong,
                    backgroundColor: pressed ? theme.colors.surfaceAlt : theme.colors.surface,
                  },
                ]}
              >
                <ImagePlus size={22} color={theme.colors.primary} />
                <AppText variant="bodyBold">{t('Attach a photo')}</AppText>
                <AppText variant="caption" color={theme.colors.textSubtle} style={styles.center}>
                  {t('Camera or gallery · JPEG, PNG, or WEBP · up to 5 MB')}
                </AppText>
              </Pressable>
            )}
          </View>

          <View
            style={[
              styles.anonymousRow,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
            ]}
          >
            <View style={styles.anonymousCopy}>
              <AppText variant="bodyBold">{t('Post anonymously')}</AppText>
              <AppText variant="caption" color={theme.colors.textMuted}>
                {t('Your name is hidden on the public feed, but the municipality keeps your verified identity for follow-up.')}
              </AppText>
            </View>
            <Switch
              value={anonymous}
              onValueChange={setAnonymous}
              trackColor={{ false: theme.colors.surfaceSunken, true: theme.colors.primary }}
              thumbColor={theme.colors.onPrimary}
              accessibilityLabel={t('Post anonymously')}
            />
          </View>

          {formError && formError !== BLOCKED_MESSAGES.descriptionRequired ? (
            <View
              style={[
                styles.errorBox,
                { backgroundColor: theme.colors.dangerSurface, borderColor: theme.colors.danger },
              ]}
            >
              <AppText variant="caption" color={theme.colors.danger}>
                {t(formError)}
              </AppText>
            </View>
          ) : null}

          <PrimaryButton
            label={submitting ? t('Submitting report…') : t('Submit for verification')}
            loading={submitting}
            onPress={handleSubmit}
          />
          <AppText variant="caption" color={theme.colors.textSubtle} style={styles.center}>
            {t('Your concern and photo are logged for official verification by Paete municipal authorities.')}
          </AppText>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  flexSpacer: { flex: 1 },
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gateContent: {
    flexGrow: 1,
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  gateIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gatePill: {
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  gateAction: { alignSelf: 'stretch', marginTop: spacing.sm },
  gateNotes: {
    alignSelf: 'stretch',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  center: { textAlign: 'center' },
  form: { paddingHorizontal: spacing.lg, paddingBottom: 120, gap: spacing.xl },
  section: { gap: spacing.md },
  sectionLabel: { textTransform: 'uppercase' },
  textArea: { minHeight: 112, textAlignVertical: 'top' },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 48,
    flexGrow: 1,
    flexBasis: '47%',
  },
  categoryOptionLabel: { flex: 1 },
  previewWrap: { gap: spacing.sm },
  preview: { width: '100%', height: 196, borderRadius: radius.md },
  previewActions: { flexDirection: 'row', gap: spacing.sm },
  previewButton: { flex: 1, minHeight: 44 },
  dropzone: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  anonymousRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  anonymousCopy: { flex: 1, gap: 2 },
  errorBox: { borderWidth: 1, borderRadius: radius.sm, padding: spacing.md },
});
