import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

import { filipino } from './translations';

type Appearance = 'system' | 'light' | 'dark';
type Language = 'en' | 'fil';
type TranslationValues = Record<string, string | number>;

const appearanceKey = 'civic-paete:appearance';
const languageKey = 'civic-paete:language';

function createTranslator(language: Language) {
  return (message: string, values?: TranslationValues) => {
    const translation = language === 'fil' && Object.prototype.hasOwnProperty.call(filipino, message)
      ? filipino[message]
      : message;
    return values
      ? translation.replace(/\{(\w+)\}/g, (match, key: string) => String(values[key] ?? match))
      : translation;
  };
}

const translators = { en: createTranslator('en'), fil: createTranslator('fil') };

const PreferencesContext = createContext<{
  appearance: Appearance;
  language: Language;
  setAppearance: (value: Appearance) => void;
  setLanguage: (value: Language) => void;
  t: ReturnType<typeof createTranslator>;
} | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [appearance, setAppearance] = useState<Appearance>('system');
  const [language, setLanguage] = useState<Language>('en');
  const [ready, setReady] = useState(false);
  const pendingWrite = useRef(Promise.resolve());

  useEffect(() => {
    let active = true;
    void Promise.all([AsyncStorage.getItem(appearanceKey), AsyncStorage.getItem(languageKey)])
      .then(([storedAppearance, storedLanguage]) => {
        if (!active) return;
        if (storedAppearance === 'light' || storedAppearance === 'dark') setAppearance(storedAppearance);
        if (storedLanguage === 'fil') setLanguage(storedLanguage);
      })
      .catch((error) => console.warn('Could not load app preferences:', error))
      .finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);

  function save(key: string, value: string) {
    pendingWrite.current = pendingWrite.current
      .then(() => AsyncStorage.setItem(key, value))
      .catch((error) => console.warn('Could not save app preference:', error));
  }

  if (!ready) return null;

  return (
    <PreferencesContext.Provider value={{
      appearance,
      language,
      setAppearance: (value) => { setAppearance(value); save(appearanceKey, value); },
      setLanguage: (value) => { setLanguage(value); save(languageKey, value); },
      t: translators[language],
    }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const preferences = useContext(PreferencesContext);
  if (!preferences) throw new Error('usePreferences requires PreferencesProvider.');
  return preferences;
}
