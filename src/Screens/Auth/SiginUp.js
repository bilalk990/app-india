import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import React, { useState } from 'react';

const STATUSBAR_HEIGHT = StatusBar.currentHeight || 0;
import Typography from '../../Component/UI/Typography';
import Button from '../../Component/Button';
import Input from '../../Component/Input';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../Component/Header';
import { ImageConstant } from '../../Constants/ImageConstant';
import { Font } from '../../Constants/Font';
import DropdownComponent from '../../Component/DropdownComponent';
import localization from '../../Constants/localization';
import { isAuth, langCode, Token, userDetails } from '../../Redux/action';
import { setLanguage } from '../../Constants/AsyncStorage';
import { useDispatch } from 'react-redux';
import checkRequire, { validators } from '../../Backend/Validator';
import { isValidForm } from '../../Backend/Utility';
import SimpleToast from 'react-native-simple-toast';
import {
  POST,
  POST_FORM_DATA,
  POST_FORM_WITHOUT_DATA,
} from '../../Backend/Backend';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SiginUp = ({ navigation, route }) => {
  const { socialData } = route?.params;
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const dispatch = useDispatch();

  const [error, setError] = useState({});
  // 🧠 Input States
  const [name, setName] = useState(socialData?.name || '');
  const [email, setEmail] = useState(socialData?.email || '');
  const [mobile, setMobile] = useState(socialData?.number || '');

  // 🧠 Dropdown States
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [language, setLanguages] = useState({
    label: 'English',
    value: 'en',
  });
  const [notifyDays, setNotifyDays] = useState(null);

  // 🧾 Dummy Data
  const countryList = [
    { label: 'India', value: 'india' },
    { label: 'US', value: 'us' },
    { label: 'Canada', value: 'canada' },
    { label: 'Singapore', value: 'singapore' },
    { label: 'Malaysia', value: 'malaysia' },
    { label: 'Australia', value: 'australia' },
    { label: 'Thailand', value: 'thailand' },
    { label: 'Europe', value: 'europe' },
    { label: 'Sri Lanka', value: 'sri_lanka' },
  ];

  // Country-State mapping
  const countryStateMapping = {
    india: [
      { label: 'Andhra Pradesh', value: 'andhra_pradesh' },
      { label: 'Arunachal Pradesh', value: 'arunachal_pradesh' },
      { label: 'Assam', value: 'assam' },
      { label: 'Bihar', value: 'bihar' },
      { label: 'Chhattisgarh', value: 'chhattisgarh' },
      { label: 'Goa', value: 'goa' },
      { label: 'Gujarat', value: 'gujarat' },
      { label: 'Haryana', value: 'haryana' },
      { label: 'Himachal Pradesh', value: 'himachal_pradesh' },
      { label: 'Jharkhand', value: 'jharkhand' },
      { label: 'Karnataka', value: 'karnataka' },
      { label: 'Kerala', value: 'kerala' },
      { label: 'Madhya Pradesh', value: 'madhya_pradesh' },
      { label: 'Maharashtra', value: 'maharashtra' },
      { label: 'Manipur', value: 'manipur' },
      { label: 'Meghalaya', value: 'meghalaya' },
      { label: 'Mizoram', value: 'mizoram' },
      { label: 'Nagaland', value: 'nagaland' },
      { label: 'Odisha', value: 'odisha' },
      { label: 'Punjab', value: 'punjab' },
      { label: 'Rajasthan', value: 'rajasthan' },
      { label: 'Sikkim', value: 'sikkim' },
      { label: 'Tamil Nadu', value: 'tamil_nadu' },
      { label: 'Telangana', value: 'telangana' },
      { label: 'Tripura', value: 'tripura' },
      { label: 'Uttar Pradesh', value: 'uttar_pradesh' },
      { label: 'Uttarakhand', value: 'uttarakhand' },
      { label: 'West Bengal', value: 'west_bengal' },
    ],
    us: [
      { label: 'Alabama', value: 'alabama' },
      { label: 'Alaska', value: 'alaska' },
      { label: 'Arizona', value: 'arizona' },
      { label: 'Arkansas', value: 'arkansas' },
      { label: 'California', value: 'california' },
      { label: 'Colorado', value: 'colorado' },
      { label: 'Connecticut', value: 'connecticut' },
      { label: 'Delaware', value: 'delaware' },
      { label: 'Florida', value: 'florida' },
      { label: 'Georgia', value: 'georgia' },
      { label: 'Hawaii', value: 'hawaii' },
      { label: 'Idaho', value: 'idaho' },
      { label: 'Illinois', value: 'illinois' },
      { label: 'Indiana', value: 'indiana' },
      { label: 'Iowa', value: 'iowa' },
      { label: 'Kansas', value: 'kansas' },
      { label: 'Kentucky', value: 'kentucky' },
      { label: 'Louisiana', value: 'louisiana' },
      { label: 'Maine', value: 'maine' },
      { label: 'Maryland', value: 'maryland' },
      { label: 'Massachusetts', value: 'massachusetts' },
      { label: 'Michigan', value: 'michigan' },
      { label: 'Minnesota', value: 'minnesota' },
      { label: 'Mississippi', value: 'mississippi' },
      { label: 'Missouri', value: 'missouri' },
      { label: 'Montana', value: 'montana' },
      { label: 'Nebraska', value: 'nebraska' },
      { label: 'Nevada', value: 'nevada' },
      { label: 'New Hampshire', value: 'new_hampshire' },
      { label: 'New Jersey', value: 'new_jersey' },
      { label: 'New Mexico', value: 'new_mexico' },
      { label: 'New York', value: 'new_york' },
      { label: 'North Carolina', value: 'north_carolina' },
      { label: 'North Dakota', value: 'north_dakota' },
      { label: 'Ohio', value: 'ohio' },
      { label: 'Oklahoma', value: 'oklahoma' },
      { label: 'Oregon', value: 'oregon' },
      { label: 'Pennsylvania', value: 'pennsylvania' },
      { label: 'Rhode Island', value: 'rhode_island' },
      { label: 'South Carolina', value: 'south_carolina' },
      { label: 'South Dakota', value: 'south_dakota' },
      { label: 'Tennessee', value: 'tennessee' },
      { label: 'Texas', value: 'texas' },
      { label: 'Utah', value: 'utah' },
      { label: 'Vermont', value: 'vermont' },
      { label: 'Virginia', value: 'virginia' },
      { label: 'Washington', value: 'washington' },
      { label: 'West Virginia', value: 'west_virginia' },
      { label: 'Wisconsin', value: 'wisconsin' },
      { label: 'Wyoming', value: 'wyoming' },
    ],
    canada: [
      { label: 'Alberta', value: 'alberta' },
      { label: 'British Columbia', value: 'british_columbia' },
      { label: 'Manitoba', value: 'manitoba' },
      { label: 'New Brunswick', value: 'new_brunswick' },
      { label: 'Newfoundland and Labrador', value: 'newfoundland_labrador' },
      { label: 'Northwest Territories', value: 'northwest_territories' },
      { label: 'Nova Scotia', value: 'nova_scotia' },
      { label: 'Nunavut', value: 'nunavut' },
      { label: 'Ontario', value: 'ontario' },
      { label: 'Prince Edward Island', value: 'prince_edward_island' },
      { label: 'Quebec', value: 'quebec' },
      { label: 'Saskatchewan', value: 'saskatchewan' },
      { label: 'Yukon', value: 'yukon' },
    ],
    singapore: [
      { label: 'Central Region', value: 'central_region' },
      { label: 'East Region', value: 'east_region' },
      { label: 'North Region', value: 'north_region' },
      { label: 'North-East Region', value: 'north_east_region' },
      { label: 'West Region', value: 'west_region' },
    ],
    malaysia: [
      { label: 'Johor', value: 'johor' },
      { label: 'Kedah', value: 'kedah' },
      { label: 'Kelantan', value: 'kelantan' },
      { label: 'Kuala Lumpur', value: 'kuala_lumpur' },
      { label: 'Labuan', value: 'labuan' },
      { label: 'Malacca', value: 'malacca' },
      { label: 'Negeri Sembilan', value: 'negeri_sembilan' },
      { label: 'Pahang', value: 'pahang' },
      { label: 'Penang', value: 'penang' },
      { label: 'Perak', value: 'perak' },
      { label: 'Perlis', value: 'perlis' },
      { label: 'Putrajaya', value: 'putrajaya' },
      { label: 'Sabah', value: 'sabah' },
      { label: 'Sarawak', value: 'sarawak' },
      { label: 'Selangor', value: 'selangor' },
      { label: 'Terengganu', value: 'terengganu' },
    ],
    australia: [
      { label: 'Australian Capital Territory', value: 'act' },
      { label: 'New South Wales', value: 'nsw' },
      { label: 'Northern Territory', value: 'nt' },
      { label: 'Queensland', value: 'queensland' },
      { label: 'South Australia', value: 'sa' },
      { label: 'Tasmania', value: 'tasmania' },
      { label: 'Victoria', value: 'victoria' },
      { label: 'Western Australia', value: 'wa' },
    ],
    thailand: [
      { label: 'Bangkok', value: 'bangkok' },
      { label: 'Chiang Mai', value: 'chiang_mai' },
      { label: 'Chiang Rai', value: 'chiang_rai' },
      { label: 'Krabi', value: 'krabi' },
      { label: 'Phuket', value: 'phuket' },
      { label: 'Pattaya', value: 'pattaya' },
      { label: 'Koh Samui', value: 'koh_samui' },
      { label: 'Ayutthaya', value: 'ayutthaya' },
      { label: 'Sukhothai', value: 'sukhothai' },
      { label: 'Kanchanaburi', value: 'kanchanaburi' },
    ],
    europe: [
      { label: 'United Kingdom', value: 'uk' },
      { label: 'Germany', value: 'germany' },
      { label: 'France', value: 'france' },
      { label: 'Italy', value: 'italy' },
      { label: 'Spain', value: 'spain' },
      { label: 'Netherlands', value: 'netherlands' },
      { label: 'Belgium', value: 'belgium' },
      { label: 'Switzerland', value: 'switzerland' },
      { label: 'Austria', value: 'austria' },
      { label: 'Sweden', value: 'sweden' },
      { label: 'Norway', value: 'norway' },
      { label: 'Denmark', value: 'denmark' },
      { label: 'Finland', value: 'finland' },
      { label: 'Poland', value: 'poland' },
      { label: 'Czech Republic', value: 'czech_republic' },
    ],
    sri_lanka: [
      { label: 'Central Province', value: 'central_province' },
      { label: 'Eastern Province', value: 'eastern_province' },
      { label: 'North Central Province', value: 'north_central_province' },
      { label: 'Northern Province', value: 'northern_province' },
      { label: 'North Western Province', value: 'north_western_province' },
      { label: 'Sabaragamuwa Province', value: 'sabaragamuwa_province' },
      { label: 'Southern Province', value: 'southern_province' },
      { label: 'Uva Province', value: 'uva_province' },
      { label: 'Western Province', value: 'western_province' },
    ],
  };

  // Get states based on selected country
  const getStateList = () => {
    if (country?.value) {
      return countryStateMapping[country.value] || [];
    }
    return [];
  };

  const languageList = [
    {
      label: 'English',
      value: 'en',
    },
    {
      label: 'Hindi (हिंदी)',
      value: 'hi',
    },
    {
      label: 'Tamil (தமிழ்)',
      value: 'ta',
    },
    {
      label: 'Telugu (తెలుగు)',
      value: 'te',
    },
  ];

  const notifyList = [
    { label: 'Before 1 day', value: 'before_1_day' },
    { label: 'Before 2 days', value: 'before_2_days' },
    { label: 'Before 3 days', value: 'before_3_days' },
  ];

  const SiginUp = async () => {
    let cleanToken = '';
    const FCMToken = await AsyncStorage.getItem('fcm_token');
    if (FCMToken) {
      // Token is stored as plain string, use directly
      cleanToken = FCMToken;
    }
    let error = {
      name: validators?.checkRequire('Name', name),
      email: validators?.checkRequire('Email', email),
      phone: validators?.checkFixPhoneNumber('Whatsapp Number', mobile),
      country: validators?.checkRequire('Country', country),
      state: validators?.checkRequire('State', state),
      lang: validators?.checkRequire('Language', language),
      notify: validators?.checkRequire('Notify', notifyDays),
    };
    setError(error);
    if (isValidForm(error)) {
      let data = new FormData();
      data.append('name', name);
      data.append('email', email);
      data.append('phone_prefix', '+91');
      data.append('phone_country_code', 'in');
      data.append('phone_number', mobile);
      data.append('country', country?.value);
      data.append('state', state?.value);
      data.append('language', language?.value);
      data.append('notify', notifyDays?.value);
      data.append('device_id', cleanToken);
      data.append('device_type', Platform.OS == 'android' ? 'android' : 'ios');
      POST_FORM_WITHOUT_DATA(
        'signup',
        data,
        sucess => {
          GoogleSignin?.signOut();
          if (sucess?.status == 'success') {
            // console.log(sucess, 'su=================>');
            // Set token and user details BEFORE isAuth to ensure data is ready before navigation
            dispatch(Token(sucess?.token));
            dispatch(userDetails(sucess?.user));
            localization?.setLanguage(language?.value);
            dispatch(langCode(language?.value));
            setLanguage(language?.value);
            SimpleToast?.show(sucess?.msg || '');
            // Set isAuth LAST to trigger navigation after all data is set
            dispatch(isAuth(true));
          } else {
            let error = {
              email: sucess?.errors?.email[0],
            };
            setError(error);
          }
        },
        error => {
          console.log(error, 'error=================>');
        },
        fail => {
          console.log(fail, 'fail=================>');
        },
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
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
        />
        <Typography
          color="#fff"
          size={30}
          type={Font?.Manrope_Regular}
          style={{ marginTop: 10 }}
        >
          Sign Up
        </Typography>
        <Typography
          color="#fff"
          type={Font?.Manrope_Regular}
          size={20}
          style={{ marginBottom: 24 }}
        >
          Secure sign-up for a personalized experience.
        </Typography>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          backgroundColor: '#fffbf6',
        }}
      >
        <Input
          showImage={true}
          showTitle
          source={ImageConstant.profile}
          placeholder="Enter name"
          value={name}
          onChange={text => setName(text)}
          style_input={styles.inputText}
          title={'Name'}
          error={error?.name}
          placeholderTextColor={'#00000080'}
        />

        <Input
          showImage={true}
          showTitle
          source={ImageConstant.email}
          placeholder="example@gmail.com"
          value={email}
          onChange={text => setEmail(text)}
          keyboardType="email-address"
          textContentType="emailAddress"
          style_input={styles.inputText}
          title={'Email Address'}
          error={error?.email}
          placeholderTextColor={'#00000080'}
        />

        <Input
          countryPicker
          showTitle
          placeholder="Enter mobile number"
          value={mobile}
          onChange={text => setMobile(text)}
          style_input={styles.inputText}
          error={error?.phone}
          title={'Whatsapp Number'}
          placeholderTextColor={'#00000080'}
          keyboardType={'number-pad'}
        />

        <DropdownComponent
          placeholder="Select"
          title={'Select Country'}
          selectedTextStyleNew={{ marginLeft: 20 }}
          marginHorizontal={0}
          style_dropdown={{ width: '100%', marginHorizontal: 0 }}
          error={error?.country}
          value={country}
          onChange={v => {
            console.log(v, '===========>');
            setCountry(v);
            setState(null); // Reset state when country changes
          }}
          data={countryList}
        />
        <DropdownComponent
          placeholder="Select"
          title={'Select State'}
          selectedTextStyleNew={{ marginLeft: 20 }}
          marginHorizontal={0}
          style_dropdown={{ width: '100%', marginHorizontal: 0 }}
          error={error?.state}
          value={state}
          onChange={v => {
            console.log(v, '===========>');
            setState(v);
          }}
          data={getStateList()}
        />
        <DropdownComponent
          placeholder="Select"
          title={'Select Language'}
          selectedTextStyleNew={{ marginLeft: 0 }}
          marginHorizontal={0}
          style_dropdown={{ width: '100%', marginHorizontal: 0 }}
          error={error?.lang}
          value={language}
          leftIconsShow
          leftIcons={ImageConstant?.lang}
          onChange={v => {
            console.log(v, '===========>');
            // localization?.setLanguage(v?.value);
            // dispatch(langCode(v?.value));
            // setLanguage(v?.value);
            setLanguages(v);
          }}
          data={languageList}
        />
        <DropdownComponent
          placeholder="Select days"
          title={'Notify'}
          selectedTextStyleNew={{ marginLeft: 20 }}
          marginHorizontal={0}
          style_dropdown={{ width: '100%', marginHorizontal: 0 }}
          error={error?.notify}
          value={notifyDays}
          onChange={v => {
            console.log(v, '===========>');
            setNotifyDays(v);
          }}
          data={notifyList}
        />

        <View
          style={{
            marginVertical: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography type={Font?.Manrope_Regular} size={16}>
            Notification Preferences
          </Typography>
          <TouchableOpacity
            onPress={() => setIsNotificationEnabled(!isNotificationEnabled)}
          >
            <Image
              source={
                isNotificationEnabled
                  ? ImageConstant?.active
                  : ImageConstant?.inActive
              }
              style={{ width: 40, height: 24 }}
            />
          </TouchableOpacity>
        </View>

        <Button
          linerColor={['#592009', '#592009']}
          title={'SIGN UP'}
          onPress={() => {
            SiginUp();
            return;
          }}
        />
      </ScrollView>
    </View>
  );
};

export default SiginUp;

const styles = StyleSheet.create({
  background: {
    height: 260 + STATUSBAR_HEIGHT,
    paddingHorizontal: 20,
  },
  container: {
    paddingBottom: 60,
  },
  buttonWrapper: {
    marginTop: 24,
  },
  inputText: {
    color: '#000',
  },
});
