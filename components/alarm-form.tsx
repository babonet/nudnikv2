import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Switch, Pressable, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Alarm, TaskType } from '../types/alarm';

interface AlarmFormProps {
  alarm?: Alarm;
  onSave: (alarm: Omit<Alarm, 'id' | 'nextOccurrence'>) => void;
  onCancel: () => void;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const AlarmForm = ({ alarm, onSave, onCancel }: AlarmFormProps) => {
  const [date, setDate] = useState(new Date(alarm?.time || new Date()));
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>(
    alarm?.recurrence.days || [1, 2, 3, 4, 5] // Default to weekdays
  );
  const [taskType, setTaskType] = useState<TaskType>(alarm?.task.type || 'none');
  const [snoozeEnabled, setSnoozeEnabled] = useState<boolean>(alarm?.snoozeEnabled ?? true);

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleDayToggle = (dayIndex: number) => {
    setSelectedDays(current => {
      if (current.includes(dayIndex)) {
        // Don't allow removing the last day
        if (current.length === 1) return current;
        return current.filter(d => d !== dayIndex);
      } else {
        return [...current, dayIndex].sort();
      }
    });
  };

  const handleSave = () => {
    onSave({
      time: date.toISOString(),
      recurrence: { 
        days: selectedDays
      },
      task: { type: taskType },
      isEnabled: true,
      snoozeEnabled,
      snoozeDuration: 5,
    });
  };

  const TaskButton = ({ type, label }: { type: TaskType; label: string }) => (
    <Pressable
      style={[styles.button, taskType === type && styles.buttonSelected]}
      onPress={() => setTaskType(type)}
    >
      <Text style={[styles.buttonText, taskType === type && styles.buttonTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );

  const DayButton = ({ day, index }: { day: string; index: number }) => (
    <Pressable
      style={[
        styles.dayButton,
        selectedDays.includes(index) && styles.dayButtonSelected
      ]}
      onPress={() => handleDayToggle(index)}
    >
      <Text style={[
        styles.dayButtonText,
        selectedDays.includes(index) && styles.dayButtonTextSelected
      ]}>
        {day}
      </Text>
    </Pressable>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Time</Text>
        <Pressable
          style={styles.timeButton}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.timeText}>
            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </Pressable>
        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            is24Hour={true}
            onChange={handleTimeChange}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Repeat on</Text>
        <View style={styles.daysContainer}>
          {DAYS_OF_WEEK.map((day, index) => (
            <DayButton key={day} day={day} index={index} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Wake-up Task</Text>
        <View style={styles.buttonGroup}>
          <TaskButton type="none" label="None" />
          <TaskButton type="math" label="Math" />
          <TaskButton type="qrCode" label="QR Code" />
          <TaskButton type="barCode" label="Barcode" />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Allow Snooze</Text>
          <Switch value={snoozeEnabled} onValueChange={setSnoozeEnabled} />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Alarm</Text>
        </Pressable>
        <Pressable style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  buttonSelected: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#333',
  },
  buttonTextSelected: {
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    padding: 16,
    gap: 8,
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
  cancelButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  timeButton: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginTop: 8,
  },
  timeText: {
    fontSize: 18,
    textAlign: 'center',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 4,
  },
  dayButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    minWidth: 40,
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: '#007AFF',
  },
  dayButtonText: {
    fontSize: 12,
    color: '#333',
  },
  dayButtonTextSelected: {
    color: '#fff',
  },
}); 