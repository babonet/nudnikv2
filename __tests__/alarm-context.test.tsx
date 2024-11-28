import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { AlarmProvider, useAlarms } from '../context/alarm-context';
import { TaskType } from '../types/alarm';
import AsyncStorage from '@react-native-async-storage/async-storage';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AlarmProvider>{children}</AlarmProvider>
);

describe('AlarmContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it('should start with empty alarms list', async () => {
    const { result } = renderHook(() => useAlarms(), { wrapper });
    await act(async () => {
      // Wait for initial load
    });
    expect(result.current.alarms).toHaveLength(0);
  });

  it('should add a new alarm', async () => {
    const { result } = renderHook(() => useAlarms(), { wrapper });

    const newAlarm = {
      time: new Date(),
      recurrence: { days: [1, 2, 3, 4, 5] },
      task: { type: 'math' as TaskType },
      enabled: true,
      snoozeEnabled: true,
      snoozeDuration: 5,
    };

    await act(async () => {
      result.current.addAlarm(newAlarm);
    });

    expect(result.current.alarms).toHaveLength(1);
    expect(result.current.alarms[0]).toMatchObject(newAlarm);
    expect(result.current.alarms[0].id).toBeDefined();
  });

  it('should update an existing alarm', async () => {
    const { result } = renderHook(() => useAlarms(), { wrapper });

    const initialAlarm = {
      time: new Date(),
      recurrence: { days: [1, 2, 3, 4, 5] },
      task: { type: 'math' as TaskType },
      enabled: true,
      snoozeEnabled: true,
      snoozeDuration: 5,
    };

    await act(async () => {
      result.current.addAlarm(initialAlarm);
    });

    const alarmId = result.current.alarms[0].id;
    const updatedAlarm = {
      ...initialAlarm,
      recurrence: { days: [0, 6] },
      snoozeEnabled: false,
      snoozeDuration: 10,
    };

    await act(async () => {
      result.current.updateAlarm(alarmId, updatedAlarm);
    });

    expect(result.current.alarms[0]).toMatchObject(updatedAlarm);
  });

  it('should toggle alarm enabled state', async () => {
    const { result } = renderHook(() => useAlarms(), { wrapper });

    const initialAlarm = {
      time: new Date(),
      recurrence: { days: [1, 2, 3, 4, 5] },
      task: { type: 'math' as TaskType },
      enabled: true,
      snoozeEnabled: true,
      snoozeDuration: 5,
    };

    await act(async () => {
      result.current.addAlarm(initialAlarm);
    });

    const alarmId = result.current.alarms[0].id;

    await act(async () => {
      result.current.toggleAlarm(alarmId, false);
    });

    expect(result.current.alarms[0].enabled).toBe(false);
  });

  it('should delete an alarm', async () => {
    const { result } = renderHook(() => useAlarms(), { wrapper });

    const initialAlarm = {
      time: new Date(),
      recurrence: { days: [1, 2, 3, 4, 5] },
      task: { type: 'math' as TaskType },
      enabled: true,
      snoozeEnabled: true,
      snoozeDuration: 5,
    };

    await act(async () => {
      result.current.addAlarm(initialAlarm);
    });

    const alarmId = result.current.alarms[0].id;

    await act(async () => {
      result.current.deleteAlarm(alarmId);
    });

    expect(result.current.alarms).toHaveLength(0);
  });
}); 