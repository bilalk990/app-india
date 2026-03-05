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

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [faqData, setFaqData] = useState([]);
  const [loader, setLoader] = useState(false);
  const toggleAnswer = index => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  useEffect(() => {
    GetFaq();
  }, [useIsFocused()]);

  const GetFaq = () => {
    setLoader(true);
    GET(
      'faqs',
      success => {
        console.log(success);
        setFaqData(success?.data);
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
            {localization?.Settings?.faq}
          </Typography>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.container}>
        {loader ? (
          <ActivityIndicator size="large" color="#F53800" />
        ) : (
          <>
            {faqData.map((item, index) => (
              <View key={index} style={styles.faqCard}>
                
                <TouchableOpacity
                  onPress={() => toggleAnswer(index)}
                  style={styles.faqQuestion}
                >
                  <Typography
                    type={Font?.Manrope_SemiBold}
                    style={styles.faqQuestionText}
                  >
                    {item?.faq_desc?.question}
                  </Typography>
                  <View style={styles.faqToggleIcon}>
                    <Typography
                      type={Font?.Manrope_SemiBold}
                      style={styles.faqToggleText}
                    >
                      {activeIndex === index ? '-' : '+'}
                    </Typography>
                  </View>
                </TouchableOpacity>
                {activeIndex === index && (
                  <Typography
                    type={Font?.Manrope_Regular}
                    style={styles.faqAnswer}
                  >
                    {item?.faq_desc?.answer}
                  </Typography>
                )}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default Faq;

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
    alignItems: 'center',
  },
  faqQuestionText: {
    fontSize: 16,
    flex: 1,
    paddingRight: 10,
  },
  faqToggleIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqToggleText: {
    fontSize: 20,
    lineHeight: 24,
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
