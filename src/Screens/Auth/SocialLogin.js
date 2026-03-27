import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import appleAuth, {
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication';

import { ImageConstant } from '../../Constants/ImageConstant';
import Typography from '../../Component/UI/Typography';
import Button from '../../Component/Button';
import { Font } from '../../Constants/Font';
import { useDispatch } from 'react-redux';
import { isAuth, langCode, Token, userDetails } from '../../Redux/action';
import SimpleToast from 'react-native-simple-toast';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { POST_FORM_WITHOUT_DATA, POST } from '../../Backend/Backend';
import localization from '../../Constants/localization';
import { setLanguage } from '../../Constants/AsyncStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { FACEBOOK_LOGIN } from '../../Backend/api_routes';

const SocialLogin = ({ navigation }) => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '342118935526-5enee4e4c8rm0k9gu8nsufdnm8mp9h3l.apps.googleusercontent.com',
    });
  }, []);

  const signIn = async () => {
    try {
      // Trigger the Google sign-in flow
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info:', userInfo);
      if (userInfo?.type === 'success') {
        SocialLogins(userInfo?.data?.user);
      } else {
      }
    } catch (error) {
      console.log(error, 'ERRRORROO');

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing in');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services are not available');
      } else {
        console.error('Something went wrong:', error);
      }
    }
  };

  const SocialLogins = async datas => {
    const FCMToken = await AsyncStorage.getItem('fcm_token');
    let cleanToken = '';
    if (FCMToken) {
      try {
        // If token is stored like a JSON string: "\"abc\""
        cleanToken = JSON.parse(FCMToken);
      } catch (e) {
        // Fallback: just remove quotes
        cleanToken = FCMToken.replace(/^"+|"+$/g, '');
      }
    }
    let data = new FormData();
    data.append('social_id', datas?.id);
    data.append('provider', 'google');
    data.append('email', datas?.email);
    data.append('name', datas?.name ? datas.name : `${datas?.givenName || ''} ${datas?.familyName || ''}`.trim());
    data.append('device_id', cleanToken);
    data.append('device_type', Platform.OS == 'android' ? 'android' : 'ios');
    console.log('data-----', data);
    POST_FORM_WITHOUT_DATA(
      'social-login',
      data,
      sucess => {
        console.log(sucess, 'sucess------------->ffff');
        GoogleSignin?.signOut();
        if (sucess?.redirect == 'redirect_signup') {
          navigation?.navigate('SiginUp', { socialData: datas });
        } else {
          dispatch(Token(sucess?.token));
          if (sucess?.user?.language) {
            localization?.setLanguage(sucess?.user?.language);
            dispatch(langCode(sucess?.user?.language));
            setLanguage(sucess?.user?.language);
          }
          dispatch(isAuth(true));
          dispatch(userDetails(sucess?.user));
          SimpleToast?.show(sucess?.message || sucess?.msg || 'Google Login successful');
        }
      },
      error => {
        console.log(error);
        GoogleSignin?.signOut();
      },
      fail => {
        console.log(fail);
        GoogleSignin?.signOut();
      },
    );
  };

  const facebookSignIn = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);
      if (result.isCancelled) {
        console.log('Facebook login cancelled');
        return;
      }
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        SimpleToast.show('Failed to get Facebook access token');
        return;
      }
      const FCMToken = await AsyncStorage.getItem('fcm_token');
      let cleanToken = '';
      if (FCMToken) {
        try {
          cleanToken = JSON.parse(FCMToken);
        } catch (e) {
          cleanToken = FCMToken.replace(/^"+|"+$/g, '');
        }
      }
      POST(
        FACEBOOK_LOGIN,
        {
          facebook_access_token: data.accessToken,
          device_type: Platform.OS === 'android' ? 'android' : 'ios',
          device_id: cleanToken,
        },
        success => {
          console.log('Facebook login success:', success);
          LoginManager.logOut();
          if (success?.redirect === 'redirect_signup') {
            navigation?.navigate('SiginUp', {
              socialData: {
                email: success?.user?.email,
                name: success?.user?.name,
                social_id: success?.user?.social_id,
              },
            });
          } else {
            dispatch(Token(success?.token));
            if (success?.user?.language) {
              localization?.setLanguage(success?.user?.language);
              dispatch(langCode(success?.user?.language));
              setLanguage(success?.user?.language);
            }
            dispatch(isAuth(true));
            dispatch(userDetails(success?.user));
            SimpleToast?.show(
              success?.message || 'Facebook login successful',
            );
          }
        },
        error => {
          console.log('Facebook login error:', error);
          SimpleToast.show('Facebook login failed. Please try again.');
          LoginManager.logOut();
        },
        fail => {
          console.log('Facebook login network fail:', fail);
          LoginManager.logOut();
        },
      );
    } catch (error) {
      console.log('Facebook login error:', error);
      SimpleToast.show('Something went wrong with Facebook login');
    }
  };

  const appleSignIn = async () => {
    try {
      if (Platform.OS === 'android') {
        // Android flow using appleAuthAndroid
        // IMPORTANT: clientId must be your Service ID from Apple Developer portal
        appleAuthAndroid.configure({
          clientId: 'com.remyndnow.login.android', // Replace with your Service ID
          redirectUri: 'https://railway-production-adaa.up.railway.app/api/social-login', // Production Redirect URI
          responseType: appleAuthAndroid.ResponseType.ALL,
          scope: appleAuthAndroid.Scope.ALL,
        });

        const response = await appleAuthAndroid.signIn();
        if (response) {
          const { user, email, fullName, nonce, identityToken } = response;
          let name = 'Apple User';
          if (fullName) {
            name = `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim();
          }
          handleAppleLoginOnBackend(user, email, name);
        }
        return;
      }

      // Check if Apple Sign-In is supported (iOS only native check)
      if (!appleAuth.isSupported) {
        SimpleToast.show('Apple Sign-In is not supported on this device');
        return;
      }

      // Perform Apple Sign-In request (iOS Native)
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // Get credential state
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      // Check if authorized
      if (credentialState !== appleAuth.State.AUTHORIZED) {
        SimpleToast.show('Apple Sign-In was not authorized');
        return;
      }

      // Extract user info
      const { user, email, fullName } = appleAuthRequestResponse;

      // Construct name from fullName object
      let name = '';
      if (fullName) {
        const firstName = fullName.givenName || '';
        const lastName = fullName.familyName || '';
        name = `${firstName} ${lastName}`.trim();
      }

      // If no name provided, use default
      if (!name) {
        name = 'Apple User';
      }

      handleAppleLoginOnBackend(user, email, name);
    } catch (error) {
      console.log('Apple Sign-In error:', error);
      if (error.code === appleAuth.Error.CANCELED || error.code === '1001') {
        console.log('User canceled Apple Sign-In');
      } else {
        SimpleToast.show('Something went wrong with Apple Sign-In');
      }
    }
  };

  const handleAppleLoginOnBackend = async (user, email, name) => {
    try {
      // Get FCM token
      const FCMToken = await AsyncStorage.getItem('fcm_token');
      let cleanToken = '';
      if (FCMToken) {
        try {
          cleanToken = JSON.parse(FCMToken);
        } catch (e) {
          cleanToken = FCMToken.replace(/^"+|"+$/g, '');
        }
      }

      // Prepare data for backend
      let formData = new FormData();
      formData.append('social_id', user);
      formData.append('provider', 'apple');
      formData.append('email', email || `${user}@apple.social`);
      formData.append('name', name);
      formData.append('device_id', cleanToken);
      formData.append('device_type', Platform.OS === 'android' ? 'android' : 'ios');

      console.log('Apple Sign-In data:', { user, email, name });

      // Send to backend
      POST_FORM_WITHOUT_DATA(
        'social-login',
        formData,
        success => {
          console.log('Apple login success:', success);
          if (success?.redirect === 'redirect_signup') {
            navigation?.navigate('SiginUp', {
              socialData: {
                email: email || `${user}@apple.social`,
                name: name,
                social_id: user,
              },
            });
          } else {
            dispatch(Token(success?.token));
            if (success?.user?.language) {
              localization?.setLanguage(success?.user?.language);
              dispatch(langCode(success?.user?.language));
              setLanguage(success?.user?.language);
            }
            dispatch(isAuth(true));
            dispatch(userDetails(success?.user));
            SimpleToast?.show(success?.message || 'Apple login successful');
          }
        },
        error => {
          console.log('Apple login error:', error);
          SimpleToast.show('Apple login failed. Please try again.');
        },
        fail => {
          console.log('Apple login network fail:', fail);
          SimpleToast.show('Network error. Please try again.');
        },
      );
    } catch (error) {
      console.log('handleAppleLoginOnBackend error:', error);
    }
  };

  return (
    <>
      <ImageBackground
        source={ImageConstant?.BackGroundImage}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={[styles.overlay, { paddingTop: insets.top }]}>
          {/* Title Section */}
          <View style={styles.titleWrapper}>
            <Typography
              color="#fff"
              type={Font?.Manrope_Regular}
              size={36}
              lineHeight={50}
            >
              Sign In
            </Typography>
            <Typography
              color="#fff"
              size={16}
              type={Font?.Poppins_Regular}
              style={styles.subtitle}
            >
              Welcome back!
            </Typography>
            <Typography color="#fff" size={16}>
              Please sign in to continue.
            </Typography>
          </View>

          {/* Buttons Section */}
          <View style={styles.buttonWrapper}>
            {/* <View style={styles.row}> */}
            <View style={styles.fullWidth}>
              <Button
                onPress={() => {
                  signIn();
                  // navigation?.navigate('SiginUp');
                }}
                icon={ImageConstant?.Google}
                linerColor={['#FFFFFF', '#FFFFFF']}
                title={'Google'}
                title_style={{ color: '#000000' }}
              />
            </View>
            {/* <View style={styles.halfWidth}>
                <Button
                  onPress={() => {
                    // navigation?.navigate('SiginUp');
                  }}
                  icon={ImageConstant?.Apple}
                  linerColor={['#FFFFFF', '#FFFFFF']}
                  title={'Apple'}
                  title_style={{ color: '#000000' }}
                />
              </View> */}
            {/* </View> */}
            <View style={styles.fullWidth}>
              <Button
                onPress={() => {
                  facebookSignIn();
                }}
                icon={ImageConstant?.FaceBook}
                linerColor={['#FFFFFF', '#FFFFFF']}
                title={'Facebook'}
                title_style={{ color: '#000000' }}
              />
            </View>
            <View style={styles.fullWidth}>
              <Button
                onPress={() => {
                  appleSignIn();
                }}
                icon={ImageConstant?.Apple}
                linerColor={['#FFFFFF', '#FFFFFF']}
                title={'Apple'}
                title_style={{ color: '#000000' }}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

export default SocialLogin;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: 'space-between', // Keep space between title and buttons,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end', // This centers vertically within available space
    paddingBottom: 40,
    marginTop: 60, // Added spacing to prevent overlap with OM logo in background
  },
  subtitle: {
    marginVertical: 4,
  },
  buttonWrapper: {
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  halfWidth: {
    width: '48%',
  },
  fullWidth: {
    width: '100%',
  },
});
