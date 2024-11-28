import React from 'react';
import { render } from '@testing-library/react-native';
import { AlarmList } from '../components/alarm-list';
import { Alarm } from '../types/alarm';
import {expect, jest} from '@jest/globals';
import AsyncStorage from '@react-native-async-storage/async-storage';


const mockAlarms: Alarm[] = [
  {
    id: '1',
    time: new Date('2024-01-01T08:00:00.000Z'),
    recurrence: {
      days: [1, 2, 3, 4, 5],
    },
    task: {
      type: 'math',
      difficulty: 'medium',
    },
    enabled: true,
    snoozeEnabled: true,
    snoozeDuration: 5,
  },
  {
    id: '2',
    time: new Date('2024-01-01T09:00:00.000Z'),
    recurrence: {
      days: [1, 3, 5],
    },
    task: {
      type: 'qrCode',
    },
    enabled: true,
    snoozeEnabled: false,
    snoozeDuration: 10,
  },
];

describe('AlarmList', () => {
  const mockOnToggleAlarm = jest.fn();
  const mockOnPressAlarm = jest.fn();
  const mockOnDeleteAlarm = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it('renders empty state when no alarms', () => {
    const { getByText } = render(
      <AlarmList
        alarms={[]}
        onToggleAlarm={mockOnToggleAlarm}
        onPressAlarm={mockOnPressAlarm}
        onDeleteAlarm={mockOnDeleteAlarm}
      />
    );

    expect(getByText('No alarms set')).toBeTruthy();
    expect(getByText('Tap + to add an alarm')).toBeTruthy();
  });

  it('renders list of alarms', () => {
    const { getAllByTestId } = render(
      <AlarmList
        alarms={mockAlarms}
        onToggleAlarm={mockOnToggleAlarm}
        onPressAlarm={mockOnPressAlarm}
        onDeleteAlarm={mockOnDeleteAlarm}
      />
    );

    const alarmItems = getAllByTestId('alarm-item');
    expect(alarmItems).toHaveLength(2);
  });

  it('renders alarm times correctly', () => {
    const { getByText } = render(
      <AlarmList
        alarms={mockAlarms}
        onToggleAlarm={mockOnToggleAlarm}
        onPressAlarm={mockOnPressAlarm}
        onDeleteAlarm={mockOnDeleteAlarm}
      />
    );

    expect(getByText('10:00')).toBeTruthy();
    expect(getByText('11:00')).toBeTruthy();
  });

  it('renders different recurrence patterns', () => {
    const { getByText } = render(
      <AlarmList
        alarms={mockAlarms}
        onToggleAlarm={mockOnToggleAlarm}
        onPressAlarm={mockOnPressAlarm}
        onDeleteAlarm={mockOnDeleteAlarm}
      />
    );

    expect(getByText('Weekdays')).toBeTruthy();
    expect(getByText('Mon, Wed, Fri')).toBeTruthy();
  });
}); 