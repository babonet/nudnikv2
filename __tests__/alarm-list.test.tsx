import React from 'react';
import { render } from '@testing-library/react-native';
import { AlarmList } from '../components/alarm-list';
import { Alarm } from '../types/alarm';
import {expect, jest} from '@jest/globals';
import { v4 as uuidv4 } from 'uuid';

// Mock crypto for UUID generation
const mockCrypto = {
  getRandomValues: (arr: any) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256);
    }
    return arr;
  }
};
global.crypto = mockCrypto as unknown as Crypto;

const mockAlarms: Alarm[] = [
  {
    id: '1',
    time: '2024-01-01T08:00:00.000Z',
    recurrence: {
      days: [1, 2, 3, 4, 5],
    },
    task: {
      type: 'math',
      difficulty: 'medium',
    },
    isEnabled: true,
    snoozeEnabled: true,
    snoozeDuration: 5,
    nextOccurrence: '2024-01-01T08:00:00.000Z',
  },
  {
    id: '2',
    time: '2024-01-01T09:00:00.000Z',
    recurrence: {
      days: [1, 3, 5],
    },
    task: {
      type: 'qrCode',
    },
    isEnabled: true,
    snoozeEnabled: false,
    snoozeDuration: 10,
    nextOccurrence: '2024-01-01T09:00:00.000Z',
  },
];

describe('AlarmList', () => {
  const mockOnToggleAlarm = jest.fn();
  const mockOnPressAlarm = jest.fn();
  const mockOnDeleteAlarm = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
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