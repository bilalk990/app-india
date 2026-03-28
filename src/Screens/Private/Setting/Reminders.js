import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, FlatList, Alert, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Removed STATUSBAR_HEIGHT
import Typography from '../../../Component/UI/Typography';
import Header from '../../../Component/Header';
import { ImageConstant } from '../../../Constants/ImageConstant';
import { Font } from '../../../Constants/Font';
import localization from '../../../Constants/localization';
import { GET_WITH_TOKEN } from '../../../Backend/Backend';
import moment from 'moment';
import { heightPercentageToDP } from 'react-native-responsive-screen';

const Reminders = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [reminderData, setReminderData] = useState([]);

  useEffect(() => {
    getReminders();
  }, []);

  const getReminders = () => {
    GET_WITH_TOKEN(
      'get-reminders',
      sucess => {
        setReminderData(sucess?.data);
      },
      error => {
        console.log(error);
      },
      fail => {
        console.log(fail);
      },
    );
  };

  const handleDelete = id => {
    Alert.alert(
      'Delete Confirmation',
      'Are you sure you want to delete this Reminder?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteRemindes(id),
          style: 'destructive',
        },
      ],
      { cancelable: true },
    );
  };

  const deleteRemindes = id => {
    GET_WITH_TOKEN(
      `delete-reminders/${id}`,
      sucess => {
        getReminders();
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
      <View>
        <Typography
          type={Font?.Poppins_Medium}
          size={20}
          style={{ marginBottom: 4 }}
        >
          {item?.festival?.name}
        </Typography>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={ImageConstant?.notificationgray}
            style={{
              width: 13,
              height: 15,
              marginRight: 6,
              resizeMode: 'contain',
            }}
          />
          <Typography
            type={Font?.Poppins_Regular}
            size={16}
            style={{ color: '#777' }}
          >
            {item.description || 'On each occurrence'}
          </Typography>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={ImageConstant?.watch}
            style={{
              width: 13,
              height: 15,
              marginRight: 6,
              marginTop: 5,
              resizeMode: 'contain',
            }}
          />
          <Typography
            type={Font?.Manrope_Regular}
            size={16}
            style={{ color: '#777', marginTop: 4 }}
          >
            {`${item?.date}  -  `}
          </Typography>
          <Typography
            type={Font?.Manrope_Regular}
            size={16}
            style={{ color: '#777', marginTop: 4 }}
          >
            6:00 AM
            {/* {moment(item.time, 'HH:mm:ss').format('h:mm A')} */}
          </Typography>


        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: 15 }}>
        {/* <TouchableOpacity >
          <Image
            source={ImageConstant?.EditIcon}
            style={{ width: 19, height: 19, tintColor: '#FF8700' }}
          />
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => {
            handleDelete(item?.id);
          }}
        >
          <Image
            source={ImageConstant?.DeleteIcon}
            style={{ width: 16, height: 20 }}
          />
        </TouchableOpacity>
      </View>
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
          {localization?.Settings?.reminders}
        </Typography>
        <Typography size={16} lineHeight={23} style={{ marginBottom: 20 }}>
          {localization?.Settings?.alluse}
        </Typography>

        <FlatList
          data={reminderData}
          keyExtractor={item => item.id}
          renderItem={renderItem}
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
              <Typography size={15} type={Font.Poppins_SemiBold}>
                No reminders set yet. Add a reminder to get started.
              </Typography>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default Reminders;
