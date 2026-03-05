import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Linking,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Typography from '../../../Component/UI/Typography';
import Button from '../../../Component/Button';
import Header from '../../../Component/Header';
import { ImageConstant } from '../../../Constants/ImageConstant';
import { Font } from '../../../Constants/Font';
import LinearGradient from 'react-native-linear-gradient';
import localization from '../../../Constants/localization';
import { GET } from '../../../Backend/Backend';
import { useIsFocused } from '@react-navigation/native';

const STATUSBAR_HEIGHT = StatusBar.currentHeight || 0;

const About = () => {
  const [loader, setLoader] = useState(false);

  const [data, setData] = useState({});

  useEffect(() => {
    GetFaq();
  }, [useIsFocused()]);

  const GetFaq = () => {
    setLoader(true);
    GET(
      'cms/about-us',
      success => {
        console.log(success);
        setData(success?.data);
        setLoader(false);
      },
      error => {
        console.log(error);
        setLoader(false);
      },
      fail => {
        setLoader(false);
        console.log(fail, 'fail================>');
      },
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <LinearGradient colors={['#F53800', '#E43500']} style={[styles.background, { paddingTop: STATUSBAR_HEIGHT }]}>
        <Header
          source_arrow={ImageConstant?.BackArrow}
          style_backarrow={{
            borderWidth: 1,
            padding: 20,
            borderColor: '#FFFFFF',
            tintColor: '#FFFFFF',
            borderRadius: 16,
          }}
          containerStyle={{ marginTop: 5 }}
        />
        <View style={styles.profileContainer}>
          <Typography style={styles.profileName} type={Font?.Manrope_Regular}>
            {localization?.Settings?.about}
          </Typography>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.container}>
        {loader ? (
          <ActivityIndicator size="large" color="#F53800" />
        ) : (
          <Typography size={18}>{data?.cms_desc?.body}</Typography>
        )}
      </ScrollView>
    </View>
  );
};

export default About;

const styles = StyleSheet.create({
  background: {
    height: 243 + STATUSBAR_HEIGHT,
    paddingHorizontal: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  profileName: {
    color: '#fff',
    fontSize: 30,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  faqCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  faqAnswer: {
    marginTop: 10,
    color: '#444',
    fontSize: 14,
  },
  supportBox: {
    backgroundColor: '#f6f6f6',
    borderRadius: 10,
    padding: 20,
    marginTop: 30,
  },
  supportTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  supportDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
});
