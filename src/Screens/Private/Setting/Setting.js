import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Header from '../../../Component/Header';
import { ImageConstant } from '../../../Constants/ImageConstant';
import Typography from '../../../Component/UI/Typography';
import Button from '../../../Component/Button';
import { useDispatch } from 'react-redux';
import { isAuth } from '../../../Redux/action';
import localization from '../../../Constants/localization';

const Setting = ({navigation}) => {
  const insets = useSafeAreaInsets();
  
  const menuItems = [
    {
      icon: ImageConstant?.calander,
      title: localization?.Settings?.reminders,
      subtitle: localization?.Settings?.remindersSubtitle,
      onPress: () => {navigation?.navigate("Reminders")},
    },
    {
      icon: ImageConstant?.reminder,
      title: localization?.Settings?.notifications,
      subtitle: localization?.Settings?.notificationsSubtitle,
      onPress: () => {navigation?.navigate("Notification")},
    },
    {
      icon: ImageConstant?.about,
      title: localization?.Settings?.about,
      subtitle: localization?.Settings?.aboutSubtitle,
      onPress: () => {navigation?.navigate("Aboutus")},
    },
      {
      icon: ImageConstant?.faq,
      title: localization?.Settings?.Privacy,
      subtitle:  localization?.Settings?.faqSubtitle,
      onPress: () => {navigation?.navigate("Privacy")},
    },
      {
      icon: ImageConstant?.faq,
      title:  localization?.Settings?.Terms_cond,
      subtitle:  localization?.Settings?.faqSubtitle,
      onPress: () => {navigation?.navigate("Terms")},
    },
    {
      icon: ImageConstant?.help,
      title: localization?.Settings?.help,
      subtitle:  localization?.Settings?.helpSubtitle,
      onPress: () => {navigation?.navigate("Support")},
    },
    {
      icon: ImageConstant?.delete,
      title: localization?.Settings?.delete,
      subtitle: localization?.Settings?.deleteSubtitle,
      onPress: () => {navigation?.navigate("DeleteAccount")},
    },
    {
      icon: ImageConstant?.faq,
      title: localization?.Settings?.faq,
      subtitle:  localization?.Settings?.faqSubtitle,
      onPress: () => {navigation?.navigate("FAQ")},
    },
  ];
   const dispatch = useDispatch()
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#F53800', '#E43500']} style={styles.background}>
        <View style={{ paddingTop: insets.top }}>
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
        </View>
        <View style={styles.profileContainer}>
          <Typography style={styles.profileName}> {localization?.Settings?.title}</Typography>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
            style={styles.card}
          >
            <Image source={item.icon} style={styles.icon} />
            <View style={styles.textContainer}>
              <Typography style={styles.title}>{item.title}</Typography>
              <Typography style={styles.subtitle}>{item.subtitle}</Typography>
            </View>
            <Image
              source={ImageConstant?.BackArrow}
              style={{
                tintColor: '#919293',
                transform: [{ rotate: '-180deg' }],
                width: 6,
                height: 12,
                marginRight: 16,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        ))}

        <View style={styles.logoutWrapper}>
          <Button
            onPress={()=>{dispatch(isAuth(false))}}
            main_style={{ width: '50%' }}
            icon={ImageConstant?.logout}
            linerColor={['#592009', '#592009']}
            title={localization?.Settings?.logout}
          />
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  background: {
    height: 198,
    paddingHorizontal: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  profileName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#fffbf6',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 16,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  subtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
  },
  logoutWrapper: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
