import React from 'react';
import { useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { isIos } from '../Backend/Utility';
import { Colors } from '../Constants/Colors';
import { ImageConstant } from '../Constants/ImageConstant';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import Typography from '../Component/UI/Typography';
import { Font } from '../Constants/Font';
import ComingSoon from '../Component/UI/ComingSoon';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../Screens/Private/Home/Home';
import Preferences from '../Screens/Private/Preferences/Preferences';
import Festivals from '../Screens/Private/Festivals/Festivals';
import Setting from '../Screens/Private/Setting/Setting';
import localization from '../Constants/localization';
import Temple from '../Screens/Private/Temple/Temple';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Home"
    >
      <Stack.Screen name="Home" component={Home} />
      {/* <Stack.Screen name="HomeDeatils" component={HomeDeatils} /> */}

    </Stack.Navigator>
  );
};

const PreferencesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Preferences"
    >
      <Stack.Screen name="Preferences" component={Preferences} />
    </Stack.Navigator>
  );
};

const FestivalsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Festivals"
    >
      <Stack.Screen name="Festivals" component={Festivals} />
      {/* <Stack.Screen name="HomeDetails" component={HomeDeatils} /> */}
    </Stack.Navigator>
  );
};

export const BASE_TAB_HEIGHT = isIos ? 85 : 65;
export const bottomTabHeight = BASE_TAB_HEIGHT;
export const TabNavigation = () => {
  const commonOptions = {
    headerShown: false,
  };
  const navigation = useNavigation();
  const lang_code = useSelector(store => store.language_code);
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom;
  const totalTabHeight = BASE_TAB_HEIGHT + bottomInset;

  const LinearImage = ({ image = ImageConstant?.home, isFocused = false }) => {
    return (
      <Image
        source={image}
        style={{ width: 17.5, height: 17.5, top: 5, marginBottom: 7.5 }}
        resizeMode={'contain'}
        tintColor={isFocused ? '#E43500' : Colors?.black}
      />
    );
  };
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarActiveTintColor: Colors.blue,
        tabBarInactiveTintColor: Colors.black,
        tabBarStyle: {
          height: totalTabHeight,
          paddingBottom: bottomInset,
          elevation: 5,
          backgroundColor: Colors.white,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 5,
        },
        tabBarButton: props => (
          <TouchableOpacity activeOpacity={0.7} {...props}>
            {props.children}
          </TouchableOpacity>
        ),
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tab]}>
              <LinearImage isFocused={focused} image={ImageConstant?.home} />
              <Typography
                size={focused ? 10 : 9}
                color={focused ? '#E43500' : Colors?.black}
                type={focused ? Font.Poppins_SemiBold : Font.Poppins_Regular}
                style={styles.text}
                numberOfLines={1}
                ellipsizeMode="tail"
                textAlign={'center'}
              >
                {localization?.Home?.Home}
              </Typography>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Preferences"
        component={PreferencesStack}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tab]}>
              <LinearImage
                isFocused={focused}
                image={ImageConstant?.Preferences}
              />
              <Typography
                size={focused ? 10 : 9}
                color={focused ? '#E43500' : Colors?.black}
                type={focused ? Font.Poppins_SemiBold : Font.Poppins_Regular}
                style={styles.text}
                numberOfLines={1}
                ellipsizeMode="tail"
                textAlign={'center'}
              >
                {localization?.Preferences?.Preferences}
              </Typography>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Festivals"
        component={FestivalsStack}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tab]}>
              <LinearImage
                isFocused={focused}
                image={ImageConstant?.Festivals}
              />
              <Typography
                size={focused ? 10 : 9}
                color={focused ? '#E43500' : Colors?.black}
                type={focused ? Font.Poppins_SemiBold : Font.Poppins_Regular}
                style={styles.text}
                numberOfLines={1}
                ellipsizeMode="tail"
                textAlign={'center'}
              >
                {localization?.Festivals?.title}
              </Typography>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Temple"
        component={Temple}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tab]}>
              <LinearImage isFocused={focused} image={ImageConstant?.Temple} />
              <Typography
                size={focused ? 10 : 9}
                color={focused ? '#E43500' : Colors?.black}
                type={focused ? Font.Poppins_SemiBold : Font.Poppins_Regular}
                style={styles.text}
                numberOfLines={1}
                ellipsizeMode="tail"
                textAlign={'center'}
              >
                {localization?.Temple?.Temple}
              </Typography>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={Setting}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tab]}>
              <LinearImage isFocused={focused} image={ImageConstant?.setting} />
              <Typography
                size={focused ? 10 : 9}
                color={focused ? '#E43500' : Colors?.black}
                type={focused ? Font.Poppins_SemiBold : Font.Poppins_Regular}
                style={styles.text}
                numberOfLines={1}
                ellipsizeMode="tail"
                textAlign={'center'}
              >
                {localization?.Settings?.title}
              </Typography>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tab: {
    marginTop: 5,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: widthPercentageToDP(20),
    height: 50,
    paddingBottom: 5,
  },
  text: {
    width: widthPercentageToDP(18),
    marginTop: 4,
  },
});
