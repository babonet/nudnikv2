import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';

const SNOOZE_PRESETS = [5, 10, 15];

type Props = {
  route: {
    params: {
      duration: number;
      onSave: (duration: number) => void;
    }
  };
  navigation: any;
};

export const SnoozeConfigScreen = ({ route, navigation }: Props) => {
  const { duration, onSave } = route.params;
  const [selectedDuration, setSelectedDuration] = useState(duration);
  const [customDuration, setCustomDuration] = useState('');

  const handleSave = () => {
    onSave(selectedDuration);
    navigation.goBack();
  };

  const handleCustomDuration = (text: string) => {
    const newDuration = parseInt(text);
    if (!text) {
      setCustomDuration('');
      return;
    }
    if (isNaN(newDuration) || newDuration < 1 || newDuration > 60) {
      return;
    }
    setCustomDuration(text);
    setSelectedDuration(newDuration);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Snooze Duration</Text>
      <View style={styles.presetContainer}>
        {SNOOZE_PRESETS.map((preset) => (
          <Pressable
            key={preset}
            style={[
              styles.presetButton,
              selectedDuration === preset && styles.presetButtonSelected
            ]}
            onPress={() => {
              setSelectedDuration(preset);
              setCustomDuration('');
            }}
          >
            <Text style={[
              styles.presetText,
              selectedDuration === preset && styles.presetTextSelected
            ]}>
              {preset} min
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.customContainer}>
        <Text style={styles.customLabel}>Custom Duration (1-60 min)</Text>
        <TextInput
          style={styles.customInput}
          value={customDuration}
          onChangeText={handleCustomDuration}
          keyboardType="number-pad"
          maxLength={2}
          placeholder="Enter minutes"
        />
      </View>

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  presetContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  presetButton: {
    flex: 1,
    margin: 4,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  presetButtonSelected: {
    backgroundColor: '#007AFF',
  },
  presetText: {
    fontSize: 16,
    color: '#333',
  },
  presetTextSelected: {
    color: '#fff',
  },
  customContainer: {
    marginBottom: 24,
  },
  customLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  customInput: {
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 