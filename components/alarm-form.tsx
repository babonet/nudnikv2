import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Switch, Pressable, Platform, TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Alarm, TaskType } from '../types/alarm';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface AlarmFormProps {
  alarm?: Alarm;
  onSave: (alarm: Omit<Alarm, 'id' | 'nextOccurrence'>) => void;
  onCancel: () => void;
  navigation: any;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SNOOZE_PRESETS = [5, 10, 15];

export const AlarmForm = ({ alarm, onSave, onCancel, navigation }: AlarmFormProps) => {
  const [date, setDate] = useState(new Date(alarm?.time || new Date()));
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>(
    alarm?.recurrence.days || [1, 2, 3, 4, 5] // Default to weekdays
  );
  const [taskType, setTaskType] = useState<TaskType>(alarm?.task.type || 'none');
  const [snoozeEnabled, setSnoozeEnabled] = useState<boolean>(alarm?.snoozeEnabled ?? true);
  const [name, setName] = useState(alarm?.name || '');
  const [snoozeDuration, setSnoozeDuration] = useState<number>(alarm?.snoozeDuration ?? 5);
  const [customDuration, setCustomDuration] = useState<string>('');

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const getDaysTitle = () => {
    if (selectedDays.length === 0) return 'Once';
    if (selectedDays.length === 7) return 'Every day';
    if (selectedDays.length > 0 && selectedDays.length < 7) {
      return `Every ${selectedDays.map(day => DAYS_OF_WEEK[day]).join(', ')}`;
    }
  };

  const handleDayToggle = (dayIndex: number) => {
    setSelectedDays(current => {
      if (current.includes(dayIndex)) {
        return current.filter(d => d !== dayIndex);
      } else {
        return [...current, dayIndex].sort();
      }
    });
  };

  const handleCustomDuration = (text: string) => {
    const duration = parseInt(text);
    if (!text) {
      setCustomDuration('');
      return;
    }
    if (isNaN(duration) || duration < 1) {
      return;
    }
    setCustomDuration(text);
    setSnoozeDuration(Math.min(duration, 99));
  };

  const handleSave = () => {
    onSave({
      name,
      time: date,
      recurrence: { days: selectedDays },
      task: { type: taskType },
      enabled: true,
      snoozeEnabled,
      snoozeDuration: snoozeDuration,
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
        <Text style={styles.label}>{getDaysTitle()}</Text>
        <View style={styles.daysContainer}>
          {DAYS_OF_WEEK.map((day, index) => (
            <DayButton key={day} day={day} index={index} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <TextInput
          placeholder="Alarm Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      </View>
      
      <View style={styles.section}>
        <Pressable 
          style={styles.taskRow}
          onPress={() => {
            if (!taskType || taskType === 'none') {
              setTaskType('math');
            } else {
              navigation.navigate('TaskConfig', {
                taskType,
                onSave: (newTaskType: TaskType) => setTaskType(newTaskType)
              });
            }
          }}
        >
          <View style={styles.taskTitleRow}>
            <Text style={styles.label}>Task</Text>
            {taskType && taskType !== 'none' && (
              <Text style={styles.taskType}>
                {taskType.charAt(0).toUpperCase() + taskType.slice(1)}
              </Text>
            )}
            <Switch 
              value={taskType !== 'none'} 
              onValueChange={(enabled) => setTaskType(enabled ? 'math' : 'none')}
              style={styles.switch}
            />
          </View>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Pressable 
          style={styles.taskRow}
          onPress={() => {
            if (snoozeEnabled) {
              navigation.navigate('SnoozeConfig', {
                duration: snoozeDuration,
                onSave: (newDuration: number) => setSnoozeDuration(newDuration)
              });
            }
          }}
        >
          <View style={styles.row}>
            <Text style={styles.label}>Allow Snooze</Text>
            {snoozeEnabled && (
              <Text style={styles.taskType}>
                {snoozeDuration} minutes
              </Text>
            )}
            <Switch 
              value={snoozeEnabled}
              onValueChange={setSnoozeEnabled}
              style={styles.switch}
            />
          </View>
        </Pressable>
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
  input: {
    borderWidth: 1,
    borderColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
  },
  snoozeSettings: {
    marginTop: 16,
  },
  sublabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  snoozeDurationContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  durationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    minWidth: 50,
    alignItems: 'center',
  },
  durationButtonSelected: {
    backgroundColor: '#007AFF',
  },
  durationButtonText: {
    color: '#333',
  },
  durationButtonTextSelected: {
    color: '#fff',
  },
  customDurationContainer: {
    flex: 1,
  },
  customDurationInput: {
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    textAlign: 'center',
  },
  taskConfigButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginLeft: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  taskRow: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  taskTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskType: {
    fontSize: 12,
    marginBottom: 12,
    color: '#666',
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
}); 