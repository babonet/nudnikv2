import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { AlarmProvider, useAlarms } from '../context/alarm-context';
import { TaskType } from '../types/alarm';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AlarmProvider>{children}</AlarmProvider>
);

describe('AlarmContext', () => {
  it('should start with empty alarms list', () => {
    const { result } = renderHook(() => useAlarms(), { wrapper });
    expect(result.current.alarms).toHaveLength(0);
  });

  it('should add a new alarm', () => {
    const { result } = renderHook(() => useAlarms(), { wrapper });

    const newAlarm = {
      time: new Date().toISOString(),
      recurrence: { days: [1, 2, 3, 4, 5] },
      task: { type: 'math' as TaskType },
      isEnabled: true,
      snoozeEnabled: true,
      snoozeDuration: 5,
    };

    act(() => {
      result.current.addAlarm(newAlarm);
    });

    expect(result.current.alarms).toHaveLength(1);
    expect(result.current.alarms[0]).toMatchObject(newAlarm);
    expect(result.current.alarms[0].id).toBeDefined();
    expect(result.current.alarms[0].nextOccurrence).toBeDefined();
  });

  it('should update an existing alarm', () => {
    const { result } = renderHook(() => useAlarms(), { wrapper });

    const initialAlarm = {
      time: new Date().toISOString(),
      recurrence: { days: [1, 2, 3, 4, 5] },
      task: { type: 'math' as TaskType },
      isEnabled: true,
      snoozeEnabled: true,
      snoozeDuration: 5,
    };

    act(() => {
      result.current.addAlarm(initialAlarm);
    });

    const alarmId = result.current.alarms[0].id;
    const updatedAlarm = {
      ...initialAlarm,
      recurrence: { days: [0, 6] },
      snoozeEnabled: false,
      snoozeDuration: 10,
    };

    act(() => {
      result.current.updateAlarm(alarmId, updatedAlarm);
    });

    expect(result.current.alarms[0]).toMatchObject(updatedAlarm);
  });

  it('should toggle alarm enabled state', () => {
    const { result } = renderHook(() => useAlarms(), { wrapper });

    const initialAlarm = {
      time: new Date().toISOString(),
      recurrence: { days: [1, 2, 3, 4, 5] },
      task: { type: 'math' as TaskType },
      isEnabled: true,
      snoozeEnabled: true,
      snoozeDuration: 5,
    };

    act(() => {
      result.current.addAlarm(initialAlarm);
    });

    const alarmId = result.current.alarms[0].id;

    act(() => {
      result.current.toggleAlarm(alarmId, false);
    });

    expect(result.current.alarms[0].isEnabled).toBe(false);
  });

  it('should delete an alarm', () => {
    const { result } = renderHook(() => useAlarms(), { wrapper });

    const initialAlarm = {
      time: new Date().toISOString(),
      recurrence: { days: [1, 2, 3, 4, 5] },
      task: { type: 'math' as TaskType },
      isEnabled: true,
      snoozeEnabled: true,
      snoozeDuration: 5,
    };

    act(() => {
      result.current.addAlarm(initialAlarm);
    });

    const alarmId = result.current.alarms[0].id;

    act(() => {
      result.current.deleteAlarm(alarmId);
    });

    expect(result.current.alarms).toHaveLength(0);
  });
}); 