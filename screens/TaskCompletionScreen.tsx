import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Alarm } from '../types/alarm';

type RootStackParamList = {
  TaskCompletion: { alarm: Alarm };
};

type Props = NativeStackScreenProps<RootStackParamList, 'TaskCompletion'>;

const TaskCompletionScreen = ({ route, navigation }: Props) => {
  const { alarm } = route.params;

  const handleCompleteTask = () => {
    // Logic to verify task completion
    // Navigate back or show success message
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Task</Text>
      {alarm.name && <Text style={styles.alarmName}>Alarm: {alarm.name}</Text>}
      <Text style={styles.taskDescription}>
        Task: {alarm.task.type}
      </Text>
      <Button title="Complete Task" onPress={handleCompleteTask} />
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
});

export default TaskCompletionScreen; 