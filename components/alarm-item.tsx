import React from 'react';
import { View, Text, StyleSheet, Switch, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Alarm } from '../types/alarm';
import { format } from 'date-fns';

interface AlarmItemProps {
  alarm: Alarm;
  onToggle: (id: string, enabled: boolean) => void;
  onPress: (alarm: Alarm) => void;
  onDelete: (id: string) => void;
}

export const AlarmItem = ({ alarm, onToggle, onPress, onDelete }: AlarmItemProps) => {
  const { time, recurrence, task, enabled } = alarm;

  const getRecurrenceText = () => {
    if (recurrence.days.length === 7) return 'Every day';
    if (recurrence.days.length === 5 && 
        recurrence.days.every(d => d >= 1 && d <= 5)) {
      return 'Weekdays';
    }
    return recurrence.days
      .map(day => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day])
      .join(', ');
  };

  return (
    <Pressable 
      style={styles.container}
      onPress={() => onPress(alarm)}
      testID="alarm-item"
    >
      <View style={styles.timeContainer}>
        <Text style={styles.time}>
          {format(time, 'HH:mm')}
        </Text>
        <Text style={styles.recurrence}>{getRecurrenceText()}</Text>
      </View>
      
      <View style={styles.rightContainer}>
        {task.type !== 'none' && (
          <View style={styles.taskIndicator}>
            <Text style={styles.taskType}>{task.type}</Text>
          </View>
        )}
        <Switch
          testID="alarm-switch"
          value={enabled}
          onValueChange={(value) => onToggle(alarm.id, value)}
        />
        <Pressable 
          onPress={() => onDelete(alarm.id)}
          testID="delete-alarm"
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={24} color="#FF3B30" />
        </Pressable>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  timeContainer: {
    flex: 1,
  },
  time: {
    fontSize: 24,
    fontWeight: '600',
  },
  recurrence: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taskIndicator: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  taskType: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  }
}); 