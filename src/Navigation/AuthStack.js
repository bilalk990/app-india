import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import SocialLogin from '../Screens/Auth/SocialLogin';
import SiginUp from '../Screens/Auth/SiginUp';

const AuthStack = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        options={{ headerShown: false }}
        name="SocialLogin"
        component={SocialLogin}
      />
     
      <Stack.Screen
        options={{ headerShown: false }}
        name="SiginUp"
        component={SiginUp}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
