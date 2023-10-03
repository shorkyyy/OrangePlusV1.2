import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './src/MainScreen';
import AddExpenseScreen from './src/AddExpenseScreen';
import ExpenseDetailsScreen from './src/ExpenseDetailsScreen';
import EditExpenseScreen from './src/EditExpenseScreen';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';

const Stack = createStackNavigator();

const screenTitles = {
  MainScreen: 'Tổng Chi Tiêu',
  AddExpenseScreen: 'Thêm Mới',
  ExpenseDetailsScreen: 'Thông Tin',
  EditExpenseScreen: 'Chỉnh Sửa',
};

export default function App() {
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
  });

  useEffect(() => {
    registerForPushNotificationsAsync();
    // Set up the notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }, []);

  const registerForPushNotificationsAsync = async () => {
    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="MainScreen"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#F3F4F6', // Set the background color of the header
            },
            headerTitleStyle: {
              fontFamily: 'Roboto-Bold', // Set the font family for the header title
              fontSize: 20,
              color: '#000',
              fontWeight: 'bold',
              textAlign: 'center',
            },
            headerTitleAlign: 'center', // Center align the header title
            headerBackTitleVisible: false, // Hide the back button title
            headerTintColor: '#000', // Set the color of the back button icon and title
          }}
        >
          <Stack.Screen name="MainScreen" component={MainScreen} options={{ title: 'Tổng Quan' }} />
          <Stack.Screen name="AddExpenseScreen" component={AddExpenseScreen} options={{ title: 'Thêm Mới' }} />
          <Stack.Screen name="ExpenseDetailsScreen" component={ExpenseDetailsScreen} options={{ title: 'Thông Tin' }} />
          <Stack.Screen name="EditExpenseScreen" component={EditExpenseScreen} options={{ title: 'Chỉnh Sửa' }} />
        </Stack.Navigator>
        <StatusBar style="Dark" androidNavigationBarStyle="light-content" />
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: '#F3F4F6',
  },
});
