export type TaskType = 'math' | 'qrCode' | 'barCode' | 'none';

export interface TaskConfiguration {
  type: TaskType;
  difficulty?: 'easy' | 'medium' | 'hard';
  timeLimit?: number;
  code?: string;  // For QR/Barcode tasks
}

export interface RecurrencePattern {
  days: number[];  // 0-6, where 0 is Sunday
}

export interface Alarm {
  id: string;
  time: Date;
  enabled: boolean;
  recurrence: {
    days: number[];
  };
  task: {
    type: TaskType;
    difficulty?: 'easy' | 'medium' | 'hard';
  };
  snoozeEnabled: boolean;
  snoozeDuration: number;
} 