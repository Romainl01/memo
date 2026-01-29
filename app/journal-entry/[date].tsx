import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { colors } from '@/src/constants/colors';
import { typography } from '@/src/constants/typography';
import { useJournalStore } from '@/src/stores/journalStore';
import { formatJournalDate } from '@/src/utils/journalDateHelpers';

/**
 * Full-screen journal entry editor.
 * Opens for a specific date, loads existing content if available,
 * and auto-saves on back navigation.
 */
export default function JournalEntryScreen(): React.ReactElement {
  const { date } = useLocalSearchParams<{ date: string }>();
  const insets = useSafeAreaInsets();

  const getEntryByDate = useJournalStore((state) => state.getEntryByDate);
  const upsertEntry = useJournalStore((state) => state.upsertEntry);

  const [content, setContent] = useState('');

  // Load existing content when screen mounts or date changes
  useEffect(() => {
    if (date) {
      const entry = getEntryByDate(date);
      setContent(entry?.content ?? '');
    }
  }, [date, getEntryByDate]);

  const handleBack = useCallback(() => {
    // Auto-save before navigating back
    if (date && content.trim()) {
      upsertEntry(date, content);
    }
    router.back();
  }, [date, content, upsertEntry]);

  const formattedDate = date ? formatJournalDate(date) : '';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
          <SymbolView
            name="chevron.left"
            size={24}
            weight="semibold"
            tintColor={colors.primary}
          />
        </Pressable>
        <Text style={styles.dateText}>{formattedDate}</Text>
        {/* Spacer to center the date text */}
        <View style={styles.backButton} />
      </View>

      {/* Editor */}
      <KeyboardAvoidingView
        style={styles.editorContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={insets.top + 60}
      >
        <TextInput
          style={styles.textInput}
          value={content}
          onChangeText={setContent}
          placeholder="Write about your day..."
          placeholderTextColor={colors.neutralGray300}
          multiline
          textAlignVertical="top"
          autoFocus
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.neutralGray200,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    ...typography.body1,
    color: colors.neutralDark,
    flex: 1,
    textAlign: 'center',
  },
  editorContainer: {
    flex: 1,
    padding: 16,
  },
  textInput: {
    flex: 1,
    ...typography.mono1,
    color: colors.neutralDark,
    lineHeight: 28,
  },
});
