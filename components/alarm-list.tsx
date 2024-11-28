import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { Alarm } from '../types/alarm';
import { AlarmItem } from './alarm-item';

interface AlarmListProps {
  alarms: Alarm[];
  onToggleAlarm: (id: string, enabled: boolean) => void;
  onPressAlarm: (alarm: Alarm) => void;
  onDeleteAlarm: (id: string) => void;
}

export const AlarmList = ({ alarms, onToggleAlarm, onPressAlarm, onDeleteAlarm }: AlarmListProps) => {
  if (alarms.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No alarms set</Text>
        <Text style={styles.emptySubtext}>Tap + to add an alarm</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={alarms}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <AlarmItem
          alarm={item}
          onToggle={onToggleAlarm}
          onPress={onPressAlarm}
          onDelete={onDeleteAlarm}
        />
      )}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
  },
}); 