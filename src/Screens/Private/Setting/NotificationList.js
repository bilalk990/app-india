import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, FlatList, Image, StatusBar } from 'react-native';

const STATUSBAR_HEIGHT = StatusBar.currentHeight || 0;
import Typography from '../../../Component/UI/Typography';
import Header from '../../../Component/Header';
import { ImageConstant } from '../../../Constants/ImageConstant';
import { Font } from '../../../Constants/Font';
import localization from '../../../Constants/localization';
import { LIST_NOTI } from '../../../Backend/api_routes';
import { GET_WITH_TOKEN } from '../../../Backend/Backend';
import { heightPercentageToDP } from 'react-native-responsive-screen';

const NotificationList = ({ navigation }) => {
  const [notifications, setNotifications] = useState();

  useEffect(() => {
    getNofitication();
  }, []);

  const getNofitication = () => {
    GET_WITH_TOKEN(
      LIST_NOTI,
      success => {
        setNotifications(success?.data);
      },
      error => {
        console.log(error);
      },
      fail => {
        console.log(fail);
      },
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
          color="#000"
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

      {/* <TouchableOpacity onPress={() => toggleSwitch(item.id)}>
        <Image
          source={item.enabled ? ImageConstant?.active : ImageConstant?.off}
          style={{ width: 45, height: 25, resizeMode: 'contain' }}
        />
      </TouchableOpacity> */}
    </View>
  );

  return (
    <View
      style={{ flex: 1, backgroundColor: '#FFFBF6', paddingHorizontal: 20, paddingTop: STATUSBAR_HEIGHT }}
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
        {/* <Typography size={16} lineHeight={23} style={{ marginBottom: 20 }}>
          {localization?.Settings?.notif}
        </Typography> */}

        <FlatList
          data={notifications}
          keyExtractor={item => item?.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: heightPercentageToDP(30),
              }}
            >
              <Typography size={15} color={'#000'} type={Font.Poppins_SemiBold}>
                No Notification yet.
              </Typography>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default NotificationList;
