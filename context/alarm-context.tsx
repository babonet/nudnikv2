import React, { createContext, useContext, useState, useCallback } from 'react';
import 'react-native-get-random-values';
import { Alarm } from '../types/alarm';
import { v4 as uuidv4 } from 'uuid';

interface AlarmContextType {
  alarms: Alarm[];
  addAlarm: (alarm: Omit<Alarm, 'id' | 'nextOccurrence'>) => void;
  updateAlarm: (id: string, alarm: Omit<Alarm, 'id' | 'nextOccurrence'>) => void;
  toggleAlarm: (id: string, enabled: boolean) => void;
  deleteAlarm: (id: string) => void;
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export const AlarmProvider = ({ children }: { children: React.ReactNode }) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  const addAlarm = useCallback((newAlarm: Omit<Alarm, 'id' | 'nextOccurrence'>) => {
    console.debug('[Alarm] Adding new alarm:', {
      time: newAlarm.time,
      recurrence: newAlarm.recurrence,
      task: newAlarm.task
    });
    
    const alarm: Alarm = {
      ...newAlarm,
      id: uuidv4(),
      nextOccurrence: new Date().toISOString(),
    };
    
    setAlarms(current => {
      console.debug('[Alarm] Successfully added alarm:', alarm.id);
      return [...current, alarm];
    });
  }, []);

  const updateAlarm = useCallback((id: string, updatedAlarm: Omit<Alarm, 'id' | 'nextOccurrence'>) => {
    console.debug('[Alarm] Updating alarm:', {
      id,
      updates: updatedAlarm
    });
    
    setAlarms(current => {
      const updated = current.map(alarm =>
        alarm.id === id
          ? { ...alarm, ...updatedAlarm }
          : alarm
      );
      console.debug('[Alarm] Successfully updated alarm:', id);
      return updated;
    });
  }, []);

  const toggleAlarm = useCallback((id: string, enabled: boolean) => {
    console.debug('[Alarm] Toggling alarm:', {
      id,
      enabled
    });
    
    setAlarms(current => {
      const updated = current.map(alarm =>
        alarm.id === id ? { ...alarm, isEnabled: enabled } : alarm
      );
      console.debug('[Alarm] Successfully toggled alarm:', id);
      return updated;
    });
  }, []);

  const deleteAlarm = useCallback((id: string) => {
    console.debug('[Alarm] Deleting alarm:', id);
    
    setAlarms(current => {
      const updated = current.filter(alarm => alarm.id !== id);
      console.debug('[Alarm] Successfully deleted alarm:', id);
      return updated;
    });
  }, []);

  return (
    <AlarmContext.Provider
      value={{
        alarms,
        addAlarm,
        updateAlarm,
        toggleAlarm,
        deleteAlarm,
      }}
    >
      {children}
    </AlarmContext.Provider>
  );
};

export const useAlarms = () => {
  const context = useContext(AlarmContext);
  if (context === undefined) {
    throw new Error('useAlarms must be used within an AlarmProvider');
  }
  return context;
}; 