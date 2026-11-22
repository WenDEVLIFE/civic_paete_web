import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from 'expo-speech-recognition';
import { Mic, Square } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import { AppText, SecondaryButton } from '@/components/ui';
import { usePreferences } from '@/lib/preferences';
import { useTheme } from '@/theme';

export function DescriptionDictation({ onTranscript }: { onTranscript: (transcript: string) => void }) {
  const { language, t } = usePreferences();
  const { colors } = useTheme();
  const [starting, setStarting] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState('');
  const active = useRef(false);
  const mounted = useRef(true);

  useSpeechRecognitionEvent('start', () => {
    if (!active.current) return;
    setStarting(false);
    setListening(true);
  });
  useSpeechRecognitionEvent('result', (event) => {
    const transcript = event.results[0]?.transcript.trim();
    if (active.current && event.isFinal && transcript) onTranscript(transcript);
  });
  useSpeechRecognitionEvent('end', () => {
    active.current = false;
    setStarting(false);
    setListening(false);
  });
  useSpeechRecognitionEvent('error', (event) => {
    if (!active.current) return;
    active.current = false;
    setStarting(false);
    setListening(false);
    if (event.error !== 'aborted') setError('Could not recognize speech. Try again or type the description.');
  });

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (active.current) {
        active.current = false;
        ExpoSpeechRecognitionModule.abort();
      }
    };
  }, []);

  async function toggleDictation() {
    if (listening) {
      ExpoSpeechRecognitionModule.stop();
      return;
    }
    setError('');
    setStarting(true);
    try {
      if (!ExpoSpeechRecognitionModule.isRecognitionAvailable()) {
        setError('Voice input is unavailable on this device.');
        return;
      }
      const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!mounted.current) return;
      if (!permission.granted) {
        setError('Allow microphone and speech recognition access to use voice input.');
        return;
      }
      active.current = true;
      ExpoSpeechRecognitionModule.start({ lang: language === 'fil' ? 'fil-PH' : 'en-PH', interimResults: false });
    } catch {
      active.current = false;
      if (mounted.current) setError('Voice input is unavailable on this device.');
    } finally {
      if (mounted.current && !active.current) setStarting(false);
    }
  }

  const Icon = listening ? Square : Mic;
  return (
    <View>
      <SecondaryButton label={t(listening ? 'Stop dictation' : 'Dictate description')} disabled={starting}
        icon={<Icon size={17} color={colors.primary} />} onPress={() => void toggleDictation()} />
      {error ? <AppText variant="caption" color={colors.danger}>{t(error)}</AppText> : null}
    </View>
  );
}
