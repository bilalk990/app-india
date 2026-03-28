import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, FlatList, Image, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Removed STATUSBAR_HEIGHT
import Typography from '../../../Component/UI/Typography';
import Header from '../../../Component/Header';
import { ImageConstant } from '../../../Constants/ImageConstant';
import { Font } from '../../../Constants/Font';
import localization from '../../../Constants/localization';
import { GET_WITH_TOKEN, POST_WITH_TOKEN } from '../../../Backend/Backend';
import { GET_NOTIFI, MANAGE_NOTIFI } from '../../../Backend/api_routes';

const notificationData = [
  {
    id: '1',
    title: 'Daily Panchang Updates',
    description: 'Get notified everyday with Panchang for the day',
    enabled: null,
    type: 'Daily',
  },
  {
    id: '2',
    title: 'Festival Wishes',
    description: 'Get notified to wish your friends and family on festivals',
    enabled: null,
    type: 'Festival',
  },
];

const Notification = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(notificationData);

  useEffect(() => {
    getNofitication();
  }, []);

  const getNofitication = () => {
    GET_WITH_TOKEN(
      GET_NOTIFI,
      success => {
        const apiData = success?.data;
        const updatedNotifications = notificationData?.map((item, index) => {
          if (index === 0) {
            return {
              ...item,
              enabled: apiData?.daily_panchang === 1,
            };
          }

          if (index === 1) {
            return {
              ...item,
              enabled: apiData?.festival_notification === 1,
            };
          }
          return item;
        });
        setNotifications(updatedNotifications);
      },
      error => {
        console.log('GET_NOTIFI error', error);
      },
      fail => {
        console.log(fail);
      },
    );
  };

  const toggleSwitch = id => {
    const updated = notifications.map(item =>
      item?.id === id ? { ...item, enabled: !item?.enabled } : item,
    );
    const body = {
      daily_panchang: updated?.[0]?.enabled ? 1 : 0,
      festival_notification: updated?.[1]?.enabled ? 1 : 0,
    };
    POST_WITH_TOKEN(
      MANAGE_NOTIFI,
      body,
      success => {
        setNotifications(updated);
        getNofitication();
      },
      error => {
        console.log('error-0-MANAGE_NOTIFI---', error);
      },
      fail => { },
    );
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 13,
        padding: 16,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#E3E3E3',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flex: 1, paddingRight: 10 }}>
        <Typography
          type={Font?.Poppins_Medium}
          size={18}
          style={{ marginBottom: 4 }}
        >
          {item?.title}
        </Typography>
        <Typography
          type={Font?.Poppins_Regular}
          size={14}
          style={{ color: '#777' }}
        >
          {item?.description}
        </Typography>
      </View>

      <TouchableOpacity onPress={() => toggleSwitch(item?.id)}>
        <Image
          source={item?.enabled ? ImageConstant?.active : ImageConstant?.off}
          style={{ width: 45, height: 25, resizeMode: 'contain' }}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={{ flex: 1, backgroundColor: '#FFFBF6', paddingHorizontal: 20, paddingTop: insets.top }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <Header
        source_arrow={ImageConstant?.BackArrow}
        style_backarrow={{
          borderWidth: 1,
          padding: 20,
          borderColor: '#575957',
          tintColor: '#575957',
          borderRadius: 16,
        }}
        containerStyle={{ marginTop: 10 }}
      />

      <View style={{ paddingTop: 20, flex: 1 }}>
        <Typography
          size={30}
          style={{ marginBottom: 10 }}
          type={Font?.Manrope_Regular}
        >
          {localization?.Settings?.notifications}
        </Typography>
        <Typography size={16} lineHeight={23} style={{ marginBottom: 20 }}>
          {localization?.Settings?.notif}
        </Typography>

        <FlatList
          data={notifications}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default Notification;
