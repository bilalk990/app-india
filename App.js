import React, { useState, useEffect, Component } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/Navigation/AuthStack';
import { FocusAwareStatusBar } from './src/Component/UI/FocusAwareStatusBar';
import { Provider, useSelector } from 'react-redux';
import { persistor, store } from './src/Redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import RootStack from './src/Navigation/RootStack';
import { getLanguage, setLanguage } from './src/Constants/AsyncStorage';
import localization from './src/Constants/localization';
import { PermissionsAndroid, Platform, View, StatusBar, Text, ActivityIndicator } from 'react-native';
import { fcmService } from './src/pushNotifacation/FMCService';
import { localNotificationService } from './src/pushNotifacation/LocalNotificationService';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "moment/locale/hi";
import "moment/locale/ta";
import "moment/locale/te";
import "moment/locale/en-gb";
import { navigationRef } from './src/Constants/NavigationConstant';

// Error Boundary to catch crashes
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Something went wrong</Text>
          <Text style={{ textAlign: 'center', color: '#666' }}>Please restart the app</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const LoadingView = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
    <ActivityIndicator size="large" color="#E43500" />
  </View>
);


const App = () => {
  const [langCode, setLangCode] = useState('');


const requestNotificationPermissions = async () => {
    try {
      if (Platform.OS === 'ios') {
        await PushNotificationIOS.requestPermissions();
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Notification permission denied');
        }
      }
    } catch (error) {
      console.warn('Notification permission error:', error);
    }
  };


  useEffect(() => {
    const initializeServices = async () => {
      try {
        await requestNotificationPermissions();
        await fcmService.registerAppWithFCM();
        fcmService.register();
        localNotificationService.configure();
      } catch (error) {
        console.warn('Firebase initialization error:', error);
      }
    };
    initializeServices();
  }, []);

  const loadLanguage = async () => {
    try {
      const storedLangCode = await getLanguage();
      if (storedLangCode) {
        setLangCode(storedLangCode);
        setLanguage(storedLangCode);
        localization.setLanguage(storedLangCode);
        console.log('🚀 ~ loadLanguage ~ storedLangCode:', storedLangCode);
      } else {
        setLanguage('en');
        setLangCode('en');
        localization.setLanguage('en');
      }
    } catch (error) {
      console.warn('Language loading error:', error);
      // Fallback to English on error
      setLanguage('en');
      setLangCode('en');
      localization.setLanguage('en');
    }
  };
  useEffect(() => {
    loadLanguage();
    const timer = setTimeout(() => {
      SplashScreen?.hide();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!langCode) {
    return null;
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <View style={{flex: 1}}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
          <Provider store={store}>
            <PersistGate loading={<LoadingView />} persistor={persistor}>
              <MainNavigation />
            </PersistGate>
          </Provider>
        </View>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
};

export default App;

const MainNavigation = () => {
  const isAuth = useSelector(store => store?.isAuth);
  const languageCode = useSelector(state => state.language_code);

  return (
    <NavigationContainer ref={navigationRef} key={languageCode}>
      <FocusAwareStatusBar />
      {isAuth ? <RootStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
