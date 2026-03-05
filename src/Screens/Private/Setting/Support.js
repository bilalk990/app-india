import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Linking,
  ScrollView,
} from 'react-native';
import Typography from '../../../Component/UI/Typography';
import Button from '../../../Component/Button';
import Header from '../../../Component/Header';
import { ImageConstant } from '../../../Constants/ImageConstant';
import { Font } from '../../../Constants/Font';
import LinearGradient from 'react-native-linear-gradient';
import localization from '../../../Constants/localization';

const STATUSBAR_HEIGHT = StatusBar.currentHeight || 0;

const Support = () => {
  const [activeIndex, setActiveIndex] = useState(null);

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
          <Typography size={22} type={Font?.Manrope_Regular} color="#fff">
            {localization?.Settings?.helpu}
          </Typography>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.container}>
        <Typography type={Font?.Manrope_Bold} size={22}>{localization?.Settings?.suport_title}</Typography>
        <Typography type={Font?.Manrope_Regular} size={14}>{localization?.Settings?.suport_subtitle}</Typography>
        <View style={{marginTop:40}}>
       <Button
            onPress={() => Linking.openURL('mailto:info@ourtemples.info')}
            main_style={{ width: '100%' }}
            icon={ImageConstant?.emails}
            linerColor={['#592009', '#592009']}
            title={'info@ourtemples.info'}
          />
           <Button
            onPress={()=>{Linking.openURL('https://wa.me/919129124917') }}
            main_style={{ width: '100%' }}
            icon={ImageConstant?.whatsapp}
            linerColor={['#01C73E', '#01C73E']}
            title={localization?.Settings?.whatsapp}
          />
          </View>
      </ScrollView>
    </View>
  );
};

export default Support;

const styles = StyleSheet.create({
  background: {
    height: 261 + STATUSBAR_HEIGHT,
    paddingHorizontal: 20,
  },
  profileContainer: {
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
