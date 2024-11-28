import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AlarmForm } from '../components/alarm-form';
import { Alarm } from '../types/alarm';
import { useAlarms } from '../context/alarm-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  AlarmEdit: { alarm?: Alarm };
};

type Props = NativeStackScreenProps<RootStackParamList, 'AlarmEdit'>;

export const AlarmEditScreen = ({ route, navigation }: Props) => {
  const { alarm } = route.params || {};
  const { addAlarm, updateAlarm } = useAlarms();

  const handleSave = (newAlarm: Omit<Alarm, 'id' | 'nextOccurrence'>) => {
    if (alarm) {
      updateAlarm(alarm.id, newAlarm);
    } else {
      addAlarm(newAlarm);
    }
    navigation.goBack();
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <AlarmForm
        alarm={alarm}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 