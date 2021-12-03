// In App.js in a new project

import React, {useEffect, useRef } from 'react';
import { StatusBar } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import analytics from '@react-native-firebase/analytics';
import messaging from '@react-native-firebase/messaging';
import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin';
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

const Stack = createNativeStackNavigator();

const App = () => {
  const routeNameRef = useRef(null);
  const navigationRef = useRef(null);
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '1084336596737-p355pnpl9aeolk73gf33qi7ef73c0fjs.apps.googleusercontent.com',
    });
    requestUserPermission();
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.current.getCurrentRoute().name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;
        console.log(currentRouteName);
        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
        }
        routeNameRef.current = currentRouteName;
      }}>
      <StatusBar barStyle="default" />
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
