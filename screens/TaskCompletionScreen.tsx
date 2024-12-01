import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alarm } from '../types/alarm';
import * as Notifications from 'expo-notifications';
import { Pressable } from 'react-native';

type RootStackParamList = {
  TaskCompletion: { alarm: Alarm };
};

type Props = NativeStackScreenProps<RootStackParamList, 'TaskCompletion'>;

const TaskCompletionScreen = ({ route, navigation }: Props) => {
  const { alarm } = route.params;

  const handleSnooze = async () => {
    const snoozeTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: alarm.name ? `Alarm: ${alarm.name} (Snoozed)` : "Alarm (Snoozed)",
        body: `It's time for your alarm!`,
        data: { alarm },
      },
      trigger: snoozeTime,
    });
    console.debug(`[Alarm] Snoozed alarm: ${alarm.id} for 5 minutes`);
    navigation.goBack();
  };

  const handleCompleteTask = () => {
    // Logic to verify task completion
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Task</Text>
      {alarm.name && <Text style={styles.alarmName}>Alarm: {alarm.name}</Text>}
      <Text style={styles.taskDescription}>
        Task: {alarm.task.type}
      </Text>
      
      <View style={styles.buttonContainer}>
        <Pressable 
          style={styles.completeButton} 
          onPress={handleCompleteTask}
        >
          <Text style={styles.buttonText}>Complete Task</Text>
        </Pressable>

        {alarm.snoozeEnabled && (
          <Pressable 
            style={styles.snoozeButton} 
            onPress={handleSnooze}
          >
            <Text style={styles.buttonText}>Snooze (5min)</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  alarmName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 18,
    marginBottom: 16,
  },
  buttonContainer: {
    gap: 12,
    width: '100%',
    paddingHorizontal: 32,
  },
  completeButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  snoozeButton: {
    backgroundColor: '#FF9500',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TaskCompletionScreen; 