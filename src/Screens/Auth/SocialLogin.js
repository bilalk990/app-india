import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  StatusBar,
  Platform,
} from 'react-native';

const STATUSBAR_HEIGHT = StatusBar.currentHeight || 0;
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

  return (
    <>
      <ImageBackground
        source={ImageConstant?.BackGroundImage}
        style={[styles.background, { paddingTop: STATUSBAR_HEIGHT }]}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
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
                  SimpleToast.show('Comming Soon');
                  // navigation?.navigate('SiginUp');
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
