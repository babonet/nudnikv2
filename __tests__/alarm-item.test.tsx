import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AlarmItem } from '../components/alarm-item';
import { Alarm } from '../types/alarm';

const mockAlarm: Alarm = {
  id: '1',
  time: new Date('2024-01-01T08:00:00.000Z').toISOString(),
  recurrence: {
    days: [1, 2, 3, 4, 5], // Monday to Friday
  },
  task: {
    type: 'math',
    difficulty: 'medium',
  },
  isEnabled: true,
  snoozeEnabled: true,
  snoozeDuration: 5,
  nextOccurrence: '2024-01-01T08:00:00.000Z',
};

describe('AlarmItem', () => {
  const mockOnToggle = jest.fn();
  const mockOnPress = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders alarm time correctly', () => {
    const { getByText } = render(
      <AlarmItem alarm={mockAlarm} onToggle={mockOnToggle} onPress={mockOnPress} onDelete={mockOnDelete} />
    );
    expect(getByText('10:00')).toBeTruthy();
  });

  it('renders recurrence text correctly for weekdays', () => {
    const { getByText } = render(
      <AlarmItem alarm={mockAlarm} onToggle={mockOnToggle} onPress={mockOnPress} onDelete={mockOnDelete}  />
    );
    expect(getByText('Weekdays')).toBeTruthy();
  });

  it('renders recurrence text correctly for all days', () => {
    const allDaysAlarm = {
      ...mockAlarm,
      recurrence: { days: [0, 1, 2, 3, 4, 5, 6] }
    };
    const { getByText } = render(
      <AlarmItem alarm={allDaysAlarm} onToggle={mockOnToggle} onPress={mockOnPress} onDelete={mockOnDelete}  />
    );
    expect(getByText('Every day')).toBeTruthy();
  });

  it('renders recurrence text correctly for specific days', () => {
    const specificDaysAlarm = {
      ...mockAlarm,
      recurrence: { days: [0, 3, 6] } // Sun, Wed, Sat
    };
    const { getByText } = render(
      <AlarmItem alarm={specificDaysAlarm} onToggle={mockOnToggle} onPress={mockOnPress} onDelete={mockOnDelete}  />
    );
    expect(getByText('Sun, Wed, Sat')).toBeTruthy();
  });

  it('shows task type when present', () => {
    const { getByText } = render(
      <AlarmItem alarm={mockAlarm} onToggle={mockOnToggle} onPress={mockOnPress} onDelete={mockOnDelete} />
    );
    expect(getByText('math')).toBeTruthy();
  });

  it('calls onToggle when switch is pressed', () => {
    const { getByTestId } = render(
      <AlarmItem alarm={mockAlarm} onToggle={mockOnToggle} onPress={mockOnPress} onDelete={mockOnDelete}  />
    );
    fireEvent(getByTestId('alarm-switch'), 'onValueChange', false);
    expect(mockOnToggle).toHaveBeenCalledWith('1', false);
  });

  it('calls onPress when item is pressed', () => {
    const { getByTestId } = render(
      <AlarmItem alarm={mockAlarm} onToggle={mockOnToggle} onPress={mockOnPress} onDelete={mockOnDelete}  />
    );
    fireEvent.press(getByTestId('alarm-item'));
    expect(mockOnPress).toHaveBeenCalledWith(mockAlarm);
  });

  it('calls onDelete when delete button is pressed', () => {
    const { getByTestId } = render(
      <AlarmItem alarm={mockAlarm} onToggle={mockOnToggle} onPress={mockOnPress} onDelete={mockOnDelete}  />
    );
    fireEvent.press(getByTestId('delete-alarm'));
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });
}); 