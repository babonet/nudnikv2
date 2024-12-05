import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TaskType } from '../types/alarm';

type Props = {
  route: {
    params: {
      taskType: TaskType;
      onSave: (taskType: TaskType) => void;
    }
  };
  navigation: any;
};

const TASK_OPTIONS: { type: TaskType; label: string; icon: string }[] = [
  { type: 'math', label: 'Math Problem', icon: 'calculator' },
  { type: 'qrCode', label: 'Scan QR Code', icon: 'qr-code' },
  { type: 'barCode', label: 'Scan Barcode', icon: 'barcode' },
];

export const TaskConfigScreen = ({ route, navigation }: Props) => {
  const { taskType, onSave } = route.params;

  const handleSelect = (type: TaskType) => {
    onSave(type);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Task Type</Text>
      {TASK_OPTIONS.map((option) => (
        <Pressable
          key={option.type}
          style={[
            styles.optionButton,
            taskType === option.type && styles.optionButtonSelected
          ]}
          onPress={() => handleSelect(option.type)}
        >
          <Ionicons 
            name={option.icon as any} 
            size={24} 
            color={taskType === option.type ? '#fff' : '#333'} 
          />
          <Text style={[
            styles.optionText,
            taskType === option.type && styles.optionTextSelected
          ]}>
            {option.label}
          </Text>
          {taskType === option.type && (
            <Ionicons name="checkmark" size={24} color="#fff" />
          )}
        </Pressable>
      ))}
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
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    gap: 12,
  },
  optionButtonSelected: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  optionTextSelected: {
    color: '#fff',
  },
}); 