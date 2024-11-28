import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AlarmForm } from '../components/alarm-form';
import { Alarm } from '../types/alarm';

const mockAlarm: Alarm = {
  id: '1',
  time: '2024-01-01T08:00:00.000Z',
  recurrence: { days: [1, 2, 3, 4, 5] },
  task: { type: 'math' },
  isEnabled: true,
  snoozeEnabled: true,
  snoozeDuration: 5,
  nextOccurrence: '2024-01-01T08:00:00.000Z',
};

describe('AlarmForm', () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly for new alarm', () => {
    const { getByText } = render(
      <AlarmForm onSave={mockOnSave} onCancel={mockOnCancel} />
    );

    expect(getByText('Time')).toBeTruthy();
    expect(getByText('Repeat on')).toBeTruthy();
    expect(getByText('Wake-up Task')).toBeTruthy();
    expect(getByText('Allow Snooze')).toBeTruthy();
  });

  it('renders day selection buttons', () => {
    const { getByText } = render(
      <AlarmForm onSave={mockOnSave} onCancel={mockOnCancel} />
    );

    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
      expect(getByText(day)).toBeTruthy();
    });
  });

  it('allows selecting days', () => {
    const { getByText } = render(
      <AlarmForm onSave={mockOnSave} onCancel={mockOnCancel} />
    );

    fireEvent.press(getByText('Sun'));
    fireEvent.press(getByText('Sat'));
    fireEvent.press(getByText('Save Alarm'));

    const saveArg = mockOnSave.mock.calls[0][0];
    expect(saveArg.recurrence.days).toContain(0);
    expect(saveArg.recurrence.days).toContain(6);
  });

  it('calls onSave with correct data when save is pressed', () => {
    const { getByText } = render(
      <AlarmForm onSave={mockOnSave} onCancel={mockOnCancel} />
    );

    fireEvent.press(getByText('Save Alarm'));
    
    const saveArg = mockOnSave.mock.calls[0][0];
    expect(saveArg).toHaveProperty('time');
    expect(saveArg.recurrence).toHaveProperty('days');
    expect(saveArg).toHaveProperty('task');
    expect(saveArg).toHaveProperty('isEnabled');
    expect(saveArg).toHaveProperty('snoozeEnabled');
    expect(saveArg).toHaveProperty('snoozeDuration');
  });

  it('calls onCancel when cancel is pressed', () => {
    const { getByText } = render(
      <AlarmForm onSave={mockOnSave} onCancel={mockOnCancel} />
    );

    fireEvent.press(getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalled();
  });

 
  it('allows changing task type', () => {
    const { getByText } = render(
      <AlarmForm onSave={mockOnSave} onCancel={mockOnCancel} />
    );

    fireEvent.press(getByText('Math'));
    fireEvent.press(getByText('Save Alarm'));

    const saveArg = mockOnSave.mock.calls[0][0];
    expect(saveArg.task.type).toBe('math');
  });
}); 