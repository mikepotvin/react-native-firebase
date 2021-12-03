import React, {useEffect, useState }  from 'react'
import {View, Text, StatusBar, Button, ActivityIndicator} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import messaging from '@react-native-firebase/messaging';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
const HomeScreen = ({navigation}) => {
    const [user, setUser] = useState();
    const [initializing, setInitializing] = useState(true);
    // Handle user state changes
    function onAuthStateChanged(user) {
      setUser(user);
      if (initializing) setInitializing(false);
    }
    async function onGoogleButtonPress() {
        // Get the users ID token
        const {idToken} = await GoogleSignin.signIn();
      
        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      
        // Sign-in the user with the credential
        return auth().signInWithCredential(googleCredential);
      }
    useEffect(() => {
      const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
      return subscriber; // unsubscribe on unmount
    }, []);
    if (initializing) return <ActivityIndicator />;
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Home Screen</Text>
        {!user && (
          <Button
            title="Google Sign-In"
            onPress={() =>
              onGoogleButtonPress().then(() =>
                console.log('Signed in with Google!'),
              )
            }
          />
        )}
        {user && (
          <View>
            <Text>Welcome {user.email}</Text>
          </View>
        )}
        <Button
          title="Go to Details"
          onPress={() => {
            crashlytics().log('Navigating to details');
            try {
              const user = {};
              if (user.this.shouldnt.work) {
              }
            } catch (err) {
              crashlytics().recordError(err);
            }
            navigation.navigate('Details');
          }}
        />
      </View>
    );
}

export default HomeScreen