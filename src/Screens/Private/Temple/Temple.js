import {
  ScrollView,
  StyleSheet,
  View,
  Linking,
  StatusBar,
} from 'react-native';
import React from 'react';

const STATUSBAR_HEIGHT = StatusBar.currentHeight || 0;
import HeaderForUser from '../../../Component/HeaderForUser';
import { ImageConstant } from '../../../Constants/ImageConstant';
import Typography from '../../../Component/UI/Typography';
import { Font } from '../../../Constants/Font';
import localization from '../../../Constants/localization';
import { FocusAwareStatusBar } from '../../../Component/UI/FocusAwareStatusBar';

const Temple = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#fffbf6' }}>
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="transparent" />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: STATUSBAR_HEIGHT,
        }}
      >
      {/* Header */}
      <HeaderForUser
        source_arrow={ImageConstant?.BackArrow}
        style_backarrow={{
          borderWidth: 1,
          padding: 20,
          borderColor: '#000',
          tintColor: '#000',
          borderRadius: 10,
        }}
        onPressLeftIcon={() => {
          navigation?.goBack();
        }}
      />

      {/* About OurTemples.info */}
      <View style={styles.contentWrapper}>
        <Typography style={styles.title} type={Font?.Poppins_Bold}>
          {localization.Temple.aboutTitle}
        </Typography>

        <Typography style={styles.text} type={Font?.Poppins_Regular}>
          {localization.Temple.aboutText1}{' '}
          <Typography
            style={styles.link}
            type={Font?.Poppins_SemiBold}
            onPress={() => Linking.openURL('https://ourtemples.info/')}
          >
            OurTemples.info
          </Typography>
          {localization.Temple.aboutText2}
        </Typography>

        <Typography
          style={[styles.text, { marginTop: 15 }]}
          type={Font?.Poppins_Bold}
        >
          {localization.Temple.ourTemples}
        </Typography>

        <Typography style={styles.text} type={Font?.Poppins_Regular}>
          {localization.Temple.points}
        </Typography>

        <Typography
          style={[styles.text, { marginTop: 15 }]}
          type={Font?.Poppins_Regular}
        >
          {localization.Temple.closingText}{' '}
          <Typography
            style={styles.link}
            type={Font?.Poppins_SemiBold}
            onPress={() => Linking.openURL('https://ourtemples.info/')}
          >
            OurTemples.info
          </Typography>{' '}
          {localization.Temple.closingText2}
        </Typography>
      </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
};

export default Temple;

const styles = StyleSheet.create({
  contentWrapper: {
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    color: '#000',
    marginBottom: 15,
  },
  text: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  link: {
    fontSize: 15,
    color: '#E41D54',
    textDecorationLine: 'underline',
  },
});
