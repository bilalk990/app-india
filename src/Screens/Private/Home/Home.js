import {
  StyleSheet,
  View,
  ImageBackground,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  StatusBar,
} from 'react-native';
import React, { useState, useEffect } from 'react';

const STATUSBAR_HEIGHT = StatusBar.currentHeight || 0;
import { ImageConstant } from '../../../Constants/ImageConstant';
import HeaderForUser from '../../../Component/HeaderForUser';
import Typography from '../../../Component/UI/Typography';
import { Font } from '../../../Constants/Font';
import { Calendar } from 'react-native-calendars';
import CustomBottomSheet from '../SetPop.js/CustomBottomSheet';
import localization from '../../../Constants/localization';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import moment from 'moment';
import { getGreeting } from '../../../Backend/Utility';
import { GET_WITH_TOKEN, POST_FORM_DATA } from '../../../Backend/Backend';
import { GET_NOTIFI, TIP_TOP_LIST } from '../../../Backend/api_routes';
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BASE_TAB_HEIGHT } from '../../../Navigation/TabNavigation';

const HomeScreen = ({ navigation }) => {
  const languageCode = useSelector(state => state.language_code);
  const userDetails = useSelector(state => state.userDetails);
  const insets = useSafeAreaInsets();
  const bottomSpacing = BASE_TAB_HEIGHT + insets.bottom + 10;
  const [visible, setVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('');
  const [temples, setTemples] = useState([]);
  const [Pnachnage, setPnachnage] = useState({});
  const [markedDates, setMarkedDates] = useState({});
  const [ManagePnachnage, setManagePnachnage] = useState();
  const [TipTopList, setTipTopList] = useState();
  const [selectedDate, setSelectedDate] = useState(
    moment().format('YYYY-MM-DD'),
  );
  console.log('userDetails---', userDetails);

  const isFocused = useIsFocused();
  const [data, setData] = useState({
    sunrise: '06:05 AM',
    sunset: '07:05 PM',
  });

  useEffect(() => {
    fetchLocation();
    getTemples();
    getNofitication();
    GetTipTop();
  }, [isFocused]);

  const getNofitication = () => {
    GET_WITH_TOKEN(
      GET_NOTIFI,
      success => {
        const apiData = success?.data?.daily_panchang;
        setManagePnachnage(apiData);
      },
      error => {
        console.log('GET_NOTIFI error', error);
      },
      fail => {
        console.log(fail);
      },
    );
  };

  const GetTipTop = () => {
    GET_WITH_TOKEN(
      TIP_TOP_LIST,
      success => {
        setTipTopList(success?.data?.data);
      },
      error => {
        console.log('GET_NOTIFI error', error);
      },
      fail => {
        console.log('GET_NOTIFI fail', fail);
      },
    );
  };

  const getAddressFromCoords = async (latitude, longitude, retryCount = 0) => {
    try {
      // Log coordinates for debugging (helps verify if they're in India)
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'RemyndNow/1.0 (mohit@gmail.com)', // Keep this for Nominatim compliance
          'Accept-Language': 'en',
        },
      });

      if (!response.ok) {
        const errBody = await response.text();
        console.error('Nominatim API Error:', response.status, errBody);

        // Handle rate limit (429) with retry
        if (response.status === 429 && retryCount < 2) {
          setTimeout(
            () => getAddressFromCoords(latitude, longitude, retryCount + 1),
            2000,
          );
          return;
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.address) {
        const district =
          data.address.state_district ||
          data.address.county ||
          data.address.city ||
          data.address.town ||
          data.address.village ||
          '';
        const state = data.address.state || data.address.region || '';

        if (district && state) {
          setCurrentLocation(`${district}, ${state}`);
        } else if (state) {
          setCurrentLocation(state);
        } else if (district) {
          setCurrentLocation(district);
        } else if (data.display_name) {
          // Improved fallback: Take last 2-3 parts, but ensure it's not empty
          const parts = data.display_name
            .split(',')
            .filter(part => part.trim())
            .slice(-3);
          setCurrentLocation(
            parts.join(', ').trim() || 'Location not available',
          );
        } else {
          setCurrentLocation('Location not available');
        }
      } else {
        setCurrentLocation('Location not available');
      }
    } catch (error) {
      console.error('Error in getAddressFromCoords:', error);
      setCurrentLocation('Location not available');
    }
  };

  const Panchange_Data = async (lat, lng) => {
    try {
      const now = new Date();
      const date = moment(now).format('YYYY-MM-DD');
      const timezone = new Date().getTimezoneOffset() / -60;

      let formData = new FormData();
      formData.append('year', now.getFullYear());
      formData.append('month', now.getMonth() + 1);
      formData.append('date', now.getDate());
      formData.append('hours', now.getHours());
      formData.append('minutes', now.getMinutes());
      formData.append('seconds', now.getSeconds());
      formData.append('lat', lat);
      formData.append('lng', lng);
      formData.append('timezone', timezone);

      POST_FORM_DATA(
        'panchang',
        formData,
        success => {
          setPnachnage(success);
        },
        error => {
          setPnachnage({
            tithi: JSON.stringify({ name: 'Tithi', completes_at: '' }),
            nakshatra: { name: 'Nakshatra', starts_at: '', ends_at: '' },
            yama_gandam: { starts_at: '', ends_at: '' },
          });
        },
        fail => {
          setPnachnage({
            tithi: JSON.stringify({ name: 'Tithi', completes_at: '' }),
            nakshatra: { name: 'Nakshatra', starts_at: '', ends_at: '' },
            yama_gandam: { starts_at: '', ends_at: '' },
          });
        },
      );
    } catch (error) {
      setPnachnage({
        tithi: JSON.stringify({ name: 'Tithi', completes_at: '' }),
        nakshatra: { name: 'Nakshatra', starts_at: '', ends_at: '' },
        yama_gandam: { starts_at: '', ends_at: '' },
      });
    }
  };

  const festivalTypes = [
    // { label: 'Sankranti', icon: ImageConstant?.sankranti },
    { label: 'Festival', icon: ImageConstant?.FestivalNew },
    { label: 'Amavasya', icon: ImageConstant?.Amavasya },
    { label: 'Pournami', icon: ImageConstant?.Pournami },
    { label: 'Ekadashi', icon: ImageConstant?.ekadashi },
  ];

  const getSunriseSunset = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`,
      );
      const data = await response.json();
      if (data.status === 'OK') {
        const sunrise = new Date(data.results.sunrise);
        const sunset = new Date(data.results.sunset);

        setData({
          sunrise: sunrise.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          sunset: sunset.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        });
      }
    } catch (error) { }
  };

  const fetchLocation = async () => {
    try {
      const finePermission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      let permissionStatus = await check(finePermission);

      if (permissionStatus === RESULTS.DENIED) {
        permissionStatus = await request(finePermission);
      }

      // Android 12+ sometimes only grants coarse on first ask; request coarse as fallback
      if (
        Platform.OS === 'android' &&
        permissionStatus !== RESULTS.GRANTED &&
        PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION
      ) {
        const coarseStatus = await request(
          PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        );
        if (coarseStatus === RESULTS.GRANTED) {
          permissionStatus = RESULTS.GRANTED;
        }
      }

      if (permissionStatus === RESULTS.BLOCKED) {
        Alert.alert(
          'Permission blocked',
          'Please allow location access from Settings to fetch your current location.',
          [
            {
              text: 'Open Settings',
              onPress: () => openSettings().catch(() => { }),
            },
            { text: 'Cancel', style: 'cancel' },
          ],
        );
        return;
      }

      if (permissionStatus !== RESULTS.GRANTED) {
        Alert.alert(
          'Permission needed',
          'Location access is required to show your current place.',
        );
        return;
      }

      // iOS-specific authorization (ensures dialog shows on real devices)
      if (Platform.OS === 'ios') {
        const iosAuth = await Geolocation.requestAuthorization('whenInUse');
        if (iosAuth !== 'granted') {
          Alert.alert('Permission Denied', 'Location access is required.');
          return;
        }
      }

      const handleSuccess = position => {
        const currentLatitude = position.coords.latitude;
        const currentLongitude = position.coords.longitude;
        getAddressFromCoords(currentLatitude, currentLongitude);
        getSunriseSunset(currentLatitude, currentLongitude);
        Panchange_Data(currentLatitude, currentLongitude);
      };

      const handleError = error => {
        console.error('Geolocation Error:', error);
        let errorMessage = 'Failed to get location.';
        if (error.code === 1) {
          errorMessage = 'Location permission denied.';
        } else if (error.code === 2) {
          errorMessage = 'Turn on GPS or check network.';
        } else if (error.code === 3) {
          errorMessage = 'Location request timed out. Retrying might help.';
        }

        // Retry once with relaxed settings — this helps on some real devices
        Geolocation.getCurrentPosition(
          handleSuccess,
          retryError => {
            console.error('Retry geolocation error:', retryError);
            Alert.alert('Location Error', errorMessage, [{ text: 'OK' }]);
          },
          {
            enableHighAccuracy: false,
            timeout: 40000,
            maximumAge: 120000,
            distanceFilter: 0,
            forceRequestLocation: true,
            showLocationDialog: true,
            forceLocationManager: true,
          },
        );
      };

      Geolocation.getCurrentPosition(handleSuccess, handleError, {
        enableHighAccuracy: true,
        timeout: 25000,
        maximumAge: 60000,
        distanceFilter: 0,
        forceRequestLocation: true, // Android: forces a new reading on real devices
        showLocationDialog: true, // Android: prompts user to enable GPS if off
        forceLocationManager: true, // Some OEMs require LocationManager instead of FusedLocation
      });
    } catch (error) {
      console.error('General Location Error:', error);
      Alert.alert('Location Error', 'An error occurred. Please try again.');
    }
  };

  const getTemples = () => {
    GET_WITH_TOKEN(
      'festivals',
      sucess => {
        setTemples(sucess?.data);
        const marks = {};
        console.log('getTemples-----', sucess?.data);
        sucess?.data?.forEach(item => {
          if (item.date) {
            marks[item.date] = {
              marked: true,
              dotColor: '#e41d54',
              selectedColor: '#e41d54',
            };
          }
        });
        setMarkedDates(marks);
      },
      error => {
        console.log(error);
      },
      fail => {
        console.log(fail);
        setLoader(false);
      },
    );
  };

  // Parse tithi because API returns a stringified JSON
  const parsedTithi = Pnachnage?.tithi ? JSON.parse(Pnachnage.tithi) : null;

  // Format Times with Moment
  const tithiEnd = parsedTithi?.completes_at
    ? moment(parsedTithi.completes_at, 'YYYY-MM-DD HH:mm:ss').format('hh:mm A')
    : '';

  const nakshatraStart = Pnachnage?.nakshatra?.starts_at
    ? moment(Pnachnage.nakshatra.starts_at).format('hh:mm A')
    : '';

  const nakshatraEnd = Pnachnage?.nakshatra?.ends_at
    ? moment(Pnachnage.nakshatra.ends_at).format('hh:mm A')
    : '';

  const yamStart = Pnachnage?.yama_gandam?.starts_at
    ? moment(Pnachnage.yama_gandam.starts_at).format('hh:mm A')
    : '';

  const yamEnd = Pnachnage?.yama_gandam?.ends_at
    ? moment(Pnachnage.yama_gandam.ends_at).format('hh:mm A')
    : '';

  // inside your component render
  const currentDate = moment().format('YYYY-MM-DD');

  // get upcoming festivals only
  const upcoming = (temples || []).filter(item => {
    return item?.date && moment(item.date).isAfter(currentDate, 'day');
  });

  // show "All" button only when more than 3 upcoming items exist
  const showAllButton = upcoming.length > 3;

  // prepare data for FlatList: first 3 if many, otherwise all
  const flatListData = showAllButton
    ? upcoming.slice(0, 3).concat({ id: 'all' })
    : upcoming;

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <ImageBackground
        source={ImageConstant?.HomeBack}
        style={{
          height: (languageCode == 'ta' || languageCode == 'te' ? 320 : 280) + insets.top,
          width: '100%',
          paddingTop: insets.top,
        }}
      >
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <HeaderForUser
            source_arrow={ImageConstant?.Draw}
            style_backarrow={{
              borderWidth: 1,
              padding: 20,
              borderColor: '#FFFFFF',
              tintColor: '#FFFFFF',
              borderRadius: 10,
            }}
            source_logo={ImageConstant?.Notification}
            Lang_icon={ImageConstant?.lang}
            onPressLangIcon={() => {
              navigation?.navigate('SelectLanguageScreen');
            }}
            onPressRightIcon={() => {
              navigation?.navigate('NotificationList');
            }}
            Profile_icon={
              userDetails?.image
                ? { uri: userDetails.image }
                : ImageConstant.TestProfile
            }
          />
          {/* Header */}
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View style={styles.header}>
              <Typography
                style={styles.goodMorning}
                size={30}
                type={Font?.Manrope_Regular}
              >
                {getGreeting(data?.sunrise, data?.sunset)}
              </Typography>
              <Typography style={styles.date}>
                {moment()
                  .locale(localization?.getLanguage())
                  .format('DD MMMM YYYY, dddd')}
              </Typography>
              <Typography
                style={styles.location}
                size={18}
                type={Font?.Poppins_Bold}
              >
                Location:
              </Typography>
              <Typography
                style={styles.location}
                size={18}
                type={Font?.Poppins_SemiBold}
              >
                {currentLocation || ''}
              </Typography>
            </View>
            <View style={styles.sunInfo}>
              <View
                style={{ justifyContent: 'flex-end', alignItems: 'flex-end', marginBottom: 12 }}
              >
                <Typography
                  style={styles.sunLabel}
                  size={16}
                  type={Font?.Poppins_SemiBold}
                  numberOfLines={1}
                >
                  🌞 {localization?.Home?.sunrise}
                </Typography>
                <Typography
                  style={styles.sunTime}
                  size={14}
                  type={Font?.Poppins_Regular}
                >
                  {data?.sunrise}
                </Typography>
              </View>
              <View
                style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}
              >
                <Typography
                  style={styles.sunLabel}
                  size={16}
                  type={Font?.Poppins_SemiBold}
                  numberOfLines={1}
                >
                  🌇 {localization?.Home?.sunset}
                </Typography>
                <Typography
                  style={styles.sunTime}
                  size={14}
                  type={Font?.Poppins_Regular}
                >
                  {data?.sunset}
                </Typography>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
      {/* Sunrise/Sunset */}

      {/* Panchang Section */}
      {(ManagePnachnage == 1 || ManagePnachnage === undefined || ManagePnachnage === null) && (
        <ImageBackground
          source={ImageConstant?.Card}
          style={{ height: 217, width: '100%' }}
        >
          <View style={styles.panchangSection}>
            <View style={{ flexDirection: 'row' }}>
              <Typography
                style={styles.panchangTitle}
                type={Font?.Manrope_Regular}
              >
                Today's
              </Typography>
              <Typography
                style={styles.panchangTitle1}
                type={Font?.Manrope_Regular}
              >
                {' '}
                Panchang
              </Typography>
            </View>

            {/* Tithi + Nakshatra Row */}
            <View style={styles.panchangRow}>
              {/* Tithi */}
              <View>
                <Typography
                  style={styles.panchangLabel}
                  size={14}
                  type={Font?.Poppins_Bold}
                >
                  Tithi
                </Typography>

                <Typography
                  style={styles.panchangValue}
                  size={14}
                  type={Font?.Poppins_Regular}
                >
                  Shukla Paksha Dwadashi
                  {/* {parsedTithi?.name || 'Shukla Paksha Dwadashi'} */}
                </Typography>

                {/* <Typography
                  style={styles.panchangTime}
                  size={14}
                  type={Font?.Poppins_Regular}
                >
                  Ends at: {tithiEnd}
                </Typography> */}
              </View>

              {/* Nakshatra */}
              <View>
                <Typography
                  style={styles.panchangLabel}
                  size={14}
                  type={Font?.Poppins_Bold}
                >
                  Nakshatra
                </Typography>

                <Typography
                  style={styles.panchangValue}
                  size={14}
                  type={Font?.Poppins_Regular}
                >
                  Uttara Phalguni
                  {/* {Pnachnage?.nakshatra?.name || 'Uttara Phalguni'} */}
                </Typography>

                {/* <Typography
                  style={styles.panchangTime}
                  size={14}
                  type={Font?.Poppins_Regular}
                >
                  {nakshatraStart} - {nakshatraEnd}
                </Typography> */}
              </View>
            </View>

            {/* Yamagandam + Muhurta */}
            <View style={styles.panchangRow}>
              <View>
                <Typography
                  style={styles.panchangLabel}
                  size={14}
                  type={Font?.Poppins_Bold}
                >
                  Yamagandam
                </Typography>
                <Typography
                  style={styles.panchangTime}
                  size={14}
                  type={Font?.Poppins_Regular}
                >
                  {/* {yamStart} - {yamEnd} */}
                  1:30 PM – 3:00 PM
                </Typography>
              </View>

              {/* <View>
              <Typography
                style={styles.panchangLabel}
                size={14}
                type={Font?.Poppins_Bold}
              >
                Muhurta
              </Typography>
              <Typography
                style={styles.panchangTime}
                size={14}
                type={Font?.Poppins_Regular}
              >
                No data
              </Typography>
            </View> */}
            </View>
          </View>
        </ImageBackground>
      )}

      {/* Calendar */}
      <View style={styles.calendarSection}>
        <View style={styles.sectionHeader}>
          <Image
            source={ImageConstant?.LeftTri}
            style={styles.headerDecor}
          />
          <Typography
            style={{ fontSize: 23, marginHorizontal: 10 }}
            type={Font?.Poppins_Bold}
          >
            {localization?.Home?.calandar}
          </Typography>
          <Image
            source={ImageConstant?.rigthTri}
            style={styles.headerDecor}
          />
        </View>
        <View style={styles.calendarWrapper}>
          <Calendar
            current={moment().format('YYYY-MM-DD')}
            markedDates={{
              ...markedDates,
              ...(selectedDate && {
                [selectedDate]: {
                  selected: true,
                  selectedColor: '#F53800',
                  selectedTextColor: '#fff',
                },
              }),
            }}
            dayComponent={({ date, state }) => {
              const isSelected =
                date.dateString === moment().format('YYYY-MM-DD');
              // find event for this date
              const event = temples.find(item => item?.date === date.dateString);

              // check if event name matches any in festivalTypes
              let eventIcon = null;
              const hasReminder = event?.is_remainder == 1;

              if (event) {
                const match = festivalTypes.find(f =>
                  event.name.toLowerCase().includes(f.label.toLowerCase()),
                );
                eventIcon = match ? match.icon : ImageConstant?.FestivalNew; // fallback to Festival icon
              }

              return (
                <TouchableOpacity
                  style={[
                    styles.dayContainer,
                    isSelected && styles.selectedDay,
                    hasReminder && styles.reminderDay,
                  ]}
                  onPress={() => {
                    if (eventIcon) {
                      setSelectedDate(date.dateString);
                      setVisible(true);
                    }
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      justifyContent: event ? 'flex-end' : 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      size={16}
                      style={[
                        styles.dayText,
                        state === 'disabled' && styles.disabledText,
                        isSelected && styles.selectedDayText,
                      ]}
                    >
                      {date.day}
                    </Typography>
                  </View>
                  {event && (
                    <Image
                      source={eventIcon}
                      style={{ width: 16, height: 16, marginTop: 3 }}
                      resizeMode="contain"
                    />
                  )}
                </TouchableOpacity>
              );
            }}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#000',
              selectedDayBackgroundColor: '#e41d54',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#e41d54',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#e41d54',
              arrowColor: '#e41d54',
              monthTextColor: '#000',
              indicatorColor: '#e41d54',
              textDayFontFamily: 'Poppins-Regular',
              textMonthFontFamily: 'Poppins-Bold',
              textDayHeaderFontFamily: 'Poppins-Bold',
              'stylesheet.calendar.main': {
                week: {
                  marginTop: 0,
                  marginBottom: 0,
                  paddingVertical: 0,
                  flexDirection: 'row', // IMPORTANT – iske bina vertical ho jata hai
                  justifyContent: 'space-around',
                },
              },
              'stylesheet.day.basic': {
                base: {
                  marginVertical: 0,
                  paddingVertical: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              },
            }}
            style={styles.calendar}
            onDayPress={day => {
              setSelectedDate(day.dateString);
              setVisible(true);
            }}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          backgroundColor: '#FFF5EA',
          padding: 20,
          borderWidth: 1,
          borderColor: '#E5E5E5',
          borderRadius: 8,
        }}
      >
        {festivalTypes.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 5,
              paddingHorizontal: 5,
              // width: '25%', // 4 items per row
            }}
          >
            <Image
              source={item.icon}
              style={{ width: 14, height: 14, resizeMode: 'contain' }}
            />
            <Typography style={{ marginLeft: 5, fontSize: 12 }}>
              {item.label}
            </Typography>
          </View>
        ))}
      </View>
      {/* Upcoming Festivals */}
      {flatListData?.length > 0 && (
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              source={ImageConstant?.LeftTri}
              style={{
                width: 60,
                height: 11,
                tintColor: '#FF8700',
                resizeMode: 'cover',
              }}
            />
            <Typography
              style={{ fontSize: 23, margin: 10 }}
              type={Font?.Poppins_Bold}
            >
              {localization?.Home?.upcoming}
            </Typography>
            <Image
              source={ImageConstant?.rigthTri}
              style={{
                width: 60,
                height: 11,
                tintColor: '#FF8700',
                resizeMode: 'cover',
              }}
            />
          </View>

          <FlatList
            style={{ padding: 2, alignSelf: 'center' }}
            horizontal
            data={flatListData}
            keyExtractor={(item, index) =>
              item?.id?.toString?.() ?? `temp-key-${index}`
            }
            renderItem={({ item, index }) =>
              item.id === 'all' ? (
                // "All Festivals" block
                <TouchableOpacity
                  onPress={() => {
                    navigation?.navigate('Festivals');
                  }}
                  style={{ alignItems: 'center', width: 100, marginRight: 10 }}
                >
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#FFD2A4',
                      padding: 5,
                      borderRadius: 20,
                    }}
                  >
                    <Image
                      source={ImageConstant?.BackArrow}
                      style={{
                        width: 92,
                        height: 93,
                        borderRadius: 12,
                        backgroundColor: '#F53800',
                        resizeMode: 'center',
                        transform: [{ rotate: '180deg' }],
                      }}
                    />
                  </View>
                  <Typography
                    style={{ fontSize: 14, marginTop: 5, textAlign: 'center' }}
                    type={Font?.Poppins_Regular}
                  >
                    {localization?.Home?.all_festivals}
                  </Typography>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    navigation?.navigate('HomeDeatilsNew', { data: item });
                  }}
                  style={{ alignItems: 'center', width: 100, marginRight: 10 }}
                >
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#FFD2A4',
                      padding: 5,
                      borderRadius: 20,
                    }}
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={{ width: 92, height: 93, borderRadius: 12 }}
                    />
                  </View>
                  <Typography
                    style={{ fontSize: 14, marginTop: 5, textAlign: 'center' }}
                    type={Font?.Poppins_Regular}
                  >
                    {item?.festival_desc?.name}
                  </Typography>
                </TouchableOpacity>
              )
            }
            // ListEmptyComponent={() => (
            //   <View
            //     style={{
            //       alignItems: 'center',
            //       alignSelf: 'center',
            //       alignContent: 'center',
            //       margin: 'auto',
            //       width: '100%',
            //     }}
            //   >
            //     <Typography
            //       textAlign={'center'}
            //       size={16}
            //       style={{ margin: 'auto' }}
            //       type={Font?.Poppins_SemiBold}
            //     >
            //       No upcoming festivals at the moment.
            //     </Typography>
            //   </View>
            // )}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      {/* Tip of the Day */}
      <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={ImageConstant?.LeftTri}
            style={{
              width: 60,
              height: 11,
              tintColor: '#FF8700',
              resizeMode: 'cover',
            }}
          />
          <Typography
            style={{ fontSize: 23, margin: 10 }}
            type={Font?.Poppins_Bold}
          >
            {localization?.Home?.tips}
          </Typography>
          <Image
            source={ImageConstant?.rigthTri}
            style={{
              width: 60,
              height: 11,
              tintColor: '#FF8700',
              resizeMode: 'cover',
            }}
          />
        </View>

        <FlatList
          horizontal
          data={TipTopList}
          // data={[1]}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                borderWidth: 1,
                borderColor: '#FFD2A4',
                padding: 5,
                borderRadius: 20,
                width: 142,
                marginRight: 7,
              }}
            >
              <Image
                source={item.image ? { uri: item.image } : ImageConstant?.Festival2}
                style={{
                  width: 130,
                  height: 160,
                  marginRight: 15,
                  borderRadius: 14,
                }}
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: 10,
                  width: 130,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 60,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    size={10}
                    style={{
                      color: '#fff',
                      justifyContent: 'center',
                      textAlign: 'center',
                    }}
                    type={Font?.Poppins_SemiBold}
                  >
                    {item?.title}
                  </Typography>
                </View>
              </View>
            </View>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={{ height: bottomSpacing }} />

      <CustomBottomSheet visible={visible} onClose={() => setVisible(false)}>
        <Typography style={styles.title} type={Font?.Poppins_Bold}>
          {localization?.HomeDetails?.Vrat}
        </Typography>
        <ScrollView>
          {temples
            ?.filter(item => item?.date === selectedDate)
            .map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => {
                  setVisible(false);
                  navigation?.navigate('HomeDeatilsNew', { data: item });
                }}
              >
                <Typography style={styles.text} type={Font?.Poppins_Medium}>
                  {item?.festival_desc?.name}
                </Typography>
                <Image
                  source={ImageConstant?.rightarrow}
                  style={{ width: 30, height: 10, resizeMode: 'contain' }}
                />
              </TouchableOpacity>
            ))}
        </ScrollView>
      </CustomBottomSheet>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 20,
    width: '70%',
  },
  goodMorning: {
    color: '#fff',
  },
  date: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
  location: {
    color: '#fff',
    fontSize: 18,
    marginTop: 2,
  },
  sunInfo: {
    marginTop: 30,
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '35%',
    minWidth: 140,
  },
  sunLabel: {
    color: '#fff',
    fontWeight: 'bold',
    flexShrink: 0,
  },
  sunTime: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  panchangSection: {
    marginTop: 0,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 10,
  },
  panchangTitle: {
    color: '#000',
    fontSize: 34,
    marginBottom: 10,
  },
  panchangTitle1: {
    color: '#E43500',
    fontSize: 34,
    marginBottom: 10,
  },
  panchangRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 5,
  },
  panchangLabel: {
    color: '#000',
    fontSize: 14,
    fontWeight: '500',
  },
  panchangValue: {
    color: '#000',
  },
  panchangTime: {
    color: '#000',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
  // Calendar styles
  calendarSection: {
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerDecor: {
    width: 60,
    height: 11,
    tintColor: '#FF8700',
    resizeMode: 'cover',
  },
  calendarWrapper: {
    marginHorizontal: 10,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  calendar: {
    borderRadius: 12,
  },
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    width: 48,
    backgroundColor: '#fff',
    borderRightWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#E8E8E8',
  },
  dayText: {
    color: '#2d4150',
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
  },
  disabledText: {
    color: '#d9e1e8',
  },
  selectedDay: {
    backgroundColor: '#F53800',
    borderRadius: 8,
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: '600',
  },
  reminderDay: {
    backgroundColor: '#FEE5DE',
    borderColor: '#F53800',
    borderWidth: 1.5,
    borderRadius: 8,
  },
});
