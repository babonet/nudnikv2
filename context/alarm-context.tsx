import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import 'react-native-get-random-values';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alarm } from '../types/alarm';
import { v4 as uuidv4 } from 'uuid';
import * as Notifications from 'expo-notifications';

interface AlarmContextType {
  alarms: Alarm[];
  addAlarm: (alarm: Omit<Alarm, 'id'>) => void;
  updateAlarm: (id: string, alarm: Omit<Alarm, 'id'>) => void;
  toggleAlarm: (id: string, enabled: boolean) => void;
  deleteAlarm: (id: string) => void;
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export const AlarmProvider = ({ children }: { children: React.ReactNode }) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  useEffect(() => {
    loadAlarms();
  }, []);

  const loadAlarms = async () => {
    try {
      const storedAlarms = await AsyncStorage.getItem('alarms');
      if (storedAlarms) {
        setAlarms(JSON.parse(storedAlarms));
      }
    } catch (error) {
      console.error('Error loading alarms:', error);
    }
  };

  const saveAlarms = async (updatedAlarms: Alarm[]) => {
    try {
      await AsyncStorage.setItem('alarms', JSON.stringify(updatedAlarms));
    } catch (error) {
      console.error('Error saving alarms:', error);
    }
  };

  const scheduleNotification = async (alarm: Alarm) => {
    console.debug(`[Alarm] Attempting to schedule notification for alarm: ${alarm.id}`);

    if (!alarm.enabled) {
      console.debug(`[Alarm] Notification not scheduled for disabled alarm: ${alarm.id}`);
      return;
    }

    let trigger = new Date(alarm.time);
    const now = new Date();
    const currentDay = now.getDay();
    
    // If time has already passed today, start checking from tomorrow
    if (trigger <= now) {
      trigger.setDate(trigger.getDate() + 1);
      console.debug(`[Alarm] Time already passed today, checking tomorrow`);
    }

    // If the next trigger day isn't in selected days, find next valid day
    if (!alarm.recurrence.days.includes(trigger.getDay())) {
      const sortedDays = [...alarm.recurrence.days].sort((a, b) => a - b);
      const nextDay = sortedDays.find(day => day > trigger.getDay()) ?? sortedDays[0];
      const daysToAdd = nextDay > trigger.getDay() ? 
        nextDay - trigger.getDay() : 
        7 - trigger.getDay() + nextDay;
      
      trigger.setDate(trigger.getDate() + daysToAdd);
      console.debug(`[Alarm] Adjusted to next valid day: ${trigger.toLocaleString()}`);
    }

    console.debug(`[Alarm] Scheduling notification for: ${trigger.toLocaleString()}`);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: alarm.name ? `Alarm: ${alarm.name}` : "Alarm",
        body: `It's time for your alarm!`,
        data: { alarm },
      },
      trigger,
    });
  };

  const addAlarm = useCallback((newAlarm: Omit<Alarm, 'id'>) => {
    console.debug('[Alarm] Adding new alarm:', {
      time: newAlarm.time,
      enabled: newAlarm.enabled
    });
    
    const alarm: Alarm = {
      ...newAlarm,
      id: uuidv4(),
      time: new Date(newAlarm.time),
    };
    
    setAlarms(current => {
      const updated = [...current, alarm];
      saveAlarms(updated);
      scheduleNotification(alarm); // Schedule notification
      console.debug('[Alarm] Successfully added alarm:', alarm.id);
      return updated;
    });
  }, []);

  const updateAlarm = useCallback((id: string, updatedAlarm: Omit<Alarm, 'id'>) => {
    setAlarms(current => {
      const updated = current.map(alarm =>
        alarm.id === id ? { ...alarm, ...updatedAlarm, time: new Date(updatedAlarm.time) } : alarm
      );
      saveAlarms(updated);
      const alarm = updated.find(alarm => alarm.id === id);
      if (alarm) {
        scheduleNotification(alarm); // Reschedule notification
      }
      return updated;
    });
  }, []);

  const toggleAlarm = useCallback((id: string, enabled: boolean) => {
    setAlarms(current => {
      const updated = current.map(alarm =>
        alarm.id === id ? { ...alarm, enabled } : alarm
      );
      saveAlarms(updated);

      const alarm = updated.find(alarm => alarm.id === id);
      if (alarm) {
        if (enabled) {
          scheduleNotification(alarm); // Schedule if enabled
        } else {
          Notifications.cancelScheduledNotificationAsync(alarm.id); // Cancel if disabled
          console.debug(`[Alarm] Notification canceled for alarm: ${alarm.id}`);
        }
      }

      return updated;
    });
  }, []);

  const deleteAlarm = useCallback((id: string) => {
    setAlarms(current => {
      const updated = current.filter(alarm => alarm.id !== id);
      saveAlarms(updated);
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