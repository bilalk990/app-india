import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import React from 'react';
import { TabNavigation } from './TabNavigation';
import SelectLanguageScreen from '../Screens/Private/Others/SelectLanguageScreen';
import Delete from '../Screens/Private/Setting/Delete';
import Reminders from '../Screens/Private/Setting/Reminders';
import Notification from '../Screens/Private/Setting/Notification';
import Faq from '../Screens/Private/Setting/Faq';
import Support from '../Screens/Private/Setting/Support';
import Panchag from '../Screens/Private/Home/Panchag';
import HomeDeatils from '../Screens/Private/Home/HomeDeatils';
import About from '../Screens/Private/Setting/About';
import Privacy from '../Screens/Private/Setting/Privacy';
import Terms from '../Screens/Private/Setting/Terms';
import NotificationList from '../Screens/Private/Setting/NotificationList';

const commonOptions = {
  CardStyleInterpolators: CardStyleInterpolators.forHorizontalIOS,
  headerShown: false,
};
const Stack = createStackNavigator();

const RootStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="TabNavigation"
        component={TabNavigation}
        options={{ ...commonOptions }}
      />
      <Stack.Screen
        name="SelectLanguageScreen"
        component={SelectLanguageScreen}
        options={{ ...commonOptions }}
      />
      <Stack.Screen
        name="DeleteAccount"
        component={Delete}
        options={{ ...commonOptions }}
      />
      <Stack.Screen
        name="Reminders"
        component={Reminders}
        options={{ ...commonOptions }}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{ ...commonOptions }}
      />
      <Stack.Screen
        name="NotificationList"
        component={NotificationList}
        options={{ ...commonOptions }}
      />

      <Stack.Screen name="FAQ" component={Faq} options={{ ...commonOptions }} />
      <Stack.Screen
        name="Support"
        component={Support}
        options={{ ...commonOptions }}
      />
      <Stack.Screen
        name="Panchag"
        component={Panchag}
        options={{ ...commonOptions }}
      />
      <Stack.Screen
        name="Aboutus"
        component={About}
        options={{ ...commonOptions }}
      />
      <Stack.Screen
        name="Privacy"
        component={Privacy}
        options={{ ...commonOptions }}
      />
      <Stack.Screen
        name="Terms"
        component={Terms}
        options={{ ...commonOptions }}
      />
      <Stack.Screen
        name="HomeDeatilsNew"
        component={HomeDeatils}
        options={{ ...commonOptions }}
      />
    </Stack.Navigator>
  );
};

export default RootStack;
