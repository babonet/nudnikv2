import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AlarmList } from './components/alarm-list';
import { AlarmEditScreen } from './screens/alarm-edit';
import { AlarmProvider, useAlarms } from './context/alarm-context';
import { Alarm, TaskType } from './types/alarm';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import  TaskCompletionScreen  from './screens/TaskCompletionScreen';
import { TaskConfigScreen } from './screens/task-config';
import { SnoozeConfigScreen } from './screens/snooze-config';

type RootStackParamList = {
  Home: undefined;
  AlarmEdit: { alarm?: Alarm };
  TaskCompletion: { alarm: Alarm };
  TaskConfig: {
    taskType: TaskType;
    onSave: (taskType: TaskType) => void;
  };
  SnoozeConfig: {
    duration: number;
    onSave: (duration: number) => void;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const { alarms, toggleAlarm, deleteAlarm } = useAlarms();

  const handlePressAlarm = (alarm: Alarm) => {
    navigation.navigate('AlarmEdit', {
      alarm: {
        ...alarm,
      },
    });
  };

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const alarm = response.notification.request.content.data.alarm;
      navigation.navigate('TaskCompletion', { alarm });
    });

    return () => subscription.remove();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <AlarmList
        alarms={alarms}
        onToggleAlarm={toggleAlarm}
        onPressAlarm={handlePressAlarm}
        onDeleteAlarm={deleteAlarm}
      />
    </View>
  );
};

const Navigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={({ navigation }) => ({
          title: 'Nudnik',
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate({
                name: 'AlarmEdit',
                params: {}
              })}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                padding: 8,
              })}
            >
              <Ionicons name="add" size={24} color="#007AFF" />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="AlarmEdit"
        component={AlarmEditScreen}
        options={({ route }) => ({
          title: route.params?.alarm ? 'Edit Alarm' : 'New Alarm',
        })}
      />
      <Stack.Screen
        name="TaskCompletion"
        component={TaskCompletionScreen}
        options={{ title: 'Complete Task' }}
      />
      <Stack.Screen 
        name="TaskConfig" 
        component={TaskConfigScreen}
        options={{ title: 'Configure Task' }}
      />
      <Stack.Screen 
        name="SnoozeConfig" 
        component={SnoozeConfigScreen}
        options={{ title: 'Snooze Duration' }}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission for notifications not granted!');
      }
    };

    requestPermissions();
  }, []);

  return (
    <NavigationContainer>
      <AlarmProvider>
        <Navigation />
      </AlarmProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
