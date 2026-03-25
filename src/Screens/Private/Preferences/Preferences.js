import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';

const STATUSBAR_HEIGHT = StatusBar.currentHeight || 0;
import Header from '../../../Component/Header';
import { ImageConstant } from '../../../Constants/ImageConstant';
import Typography from '../../../Component/UI/Typography';
import { Font } from '../../../Constants/Font';
import Input from '../../../Component/Input';
import DropdownComponent from '../../../Component/DropdownComponent';
import Button from '../../../Component/Button';
import localization from '../../../Constants/localization';
import { useDispatch, useSelector } from 'react-redux';
import { userDetails as access } from '../../../Redux/action';
import ImageModal from '../../../Modals/ImageModal';
import { POST_FORM_DATA } from '../../../Backend/Backend';
import { UPDATE_PROFILE } from '../../../Backend/api_routes';
import SimpleToast from 'react-native-simple-toast';
import { validators } from '../../../Backend/Validator';
import { isValidForm } from '../../../Backend/Utility';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BASE_TAB_HEIGHT } from '../../../Navigation/TabNavigation';

const Preferences = ({ navigation }) => {
  const languageCode = useSelector(state => state.language_code);
  const userDetails = useSelector(state => state.userDetails);
  const insets = useSafeAreaInsets();
  const bottomSpacing = BASE_TAB_HEIGHT + insets.bottom + 10;

  const dispatch = useDispatch();
  const changes = async () => {
    localization?.setLanguage(languages?.value || languages);
  };
  // 🧠 Input States
  const [name, setName] = useState(userDetails?.name || '');
  const [email, setEmail] = useState(userDetails?.email || '');
  const [mobile, setMobile] = useState(userDetails?.phone_number || '');
  const [error, setError] = useState(null);

  // 🧠 Dropdown States
  const [country, setCountry] = useState({});
  const [state, setState] = useState({});
  const [languages, setLanguages] = useState(languageCode);
  const [notifyDays, setNotifyDays] = useState({});

  // 🧠 Image States
  const [showImageModal, setShowImageModal] = useState(false);
  const [profileImage, setProfileImage] = useState(userDetails?.image);

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

  useEffect(() => {
    let country = countryList?.filter(
      item => item?.value === userDetails?.country,
    );
    let notify = notifyList?.filter(
      item => item?.value === userDetails?.notify,
    );

    // Set country first
    if (country[0]) {
      setCountry(country[0]);
    }

    // Set notification
    if (notify[0]) {
      setNotifyDays(notify[0]);
    }

    // Set state after country is set (to ensure proper state list is available)
    if (userDetails?.state && country[0]) {
      const statesForCountry = countryStateMapping[country[0].value] || [];
      let state = statesForCountry?.filter(
        item => item?.value === userDetails?.state,
      );
      if (state[0]) {
        setState(state[0]);
      }
    }
  }, [userDetails]);

  useEffect(() => {
    let data = languageList?.filter(item => item?.value === languageCode);
    setLanguages(data[0]);
  }, [languageCode]);

  const updateProfile = () => {
    let error = {
      name: validators?.checkRequire('Name', name),
      email: validators?.checkRequire('Email', email),
      // Bug 6 fix: Validate mobile number must be exactly 10 digits
      mobile: validators?.checkPhoneNumberWithFixLength('Whatsapp Number', 10, mobile),
      country: validators?.checkRequire('country', country?.value),
      state: validators?.checkRequire('state', state?.value),
      // notifyDays: validators?.checkRequire('state', notifyDays?.value),
    };
    setError(error);

    if (isValidForm(error)) {
      let formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone_prefix', '+91');
      formData.append('phone_country_code', 'in');
      formData.append('phone_number', mobile);
      formData.append('country', country?.value || country);
      formData.append('state', state?.value || state);
      formData.append('language', languages?.value || languages);
      formData.append('notify', notifyDays?.value || notifyDays);
      {
        profileImage != undefined &&
          formData.append('image', {
            uri: profileImage,
            name: profileImage || '',
            type: 'image/jpeg',
          });
      }

      // console.log('444444444', formData);
      POST_FORM_DATA(
        UPDATE_PROFILE,
        formData,
        success => {
          if (success?.status == 'success') {
            console.log(success, 'Profile updated successfully');
            SimpleToast.show(success?.msg || 'Profile updated successfully');
            // Update user details in Redux if needed
            dispatch(access(success?.user));
          } else {
            // Handle validation errors
            let error = {
              email: success?.errors?.email?.[0],
            };
            setError(error);
          }
        },
        error => {
          console.log(error, 'ERROR Update Profile');
          SimpleToast.show(error?.msg || 'Failed to update profile');
        },
        fail => {
          console.log(fail, 'FAIL Update Profile');
          SimpleToast.show('Network error. Please try again.');
        },
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#F53800', '#E43500']} style={styles.background}>
        <View style={{ paddingTop: insets.top || STATUSBAR_HEIGHT }}>
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
        </View>
        <View style={styles.profileContainer}>
          <Typography type={Font?.Manrope_Regular} size={30} color="#FFF">
            {localization?.Preferences?.my_profile}
          </Typography>
        </View>
        <View style={styles.profileContainer}>
          <View>
            <Image
              source={
                profileImage
                  ? {
                      uri: profileImage,
                    }
                  : userDetails?.profile_image || ImageConstant?.TestProfile
              }
              style={styles.profileImage}
            />
            <TouchableOpacity
              style={styles.cameraIcon}
              onPress={() => setShowImageModal(true)}
            >
              <Image
                source={ImageConstant.Camra} // your camera icon
                style={{ width: 14, height: 14 }}
              />
            </TouchableOpacity>
          </View>

          <View style={{ marginLeft: 20 }}>
            <Typography style={styles.profileName}>
              {userDetails?.name}
            </Typography>
            <Typography style={styles.profileEmail} numberOfLines={2}>
              {userDetails?.email}
            </Typography>
            <Typography style={styles.profilePhone}>
              +91 {userDetails?.phone_number}
            </Typography>
          </View>
        </View>
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
          title={localization?.Preferences?.Name}
          placeholderTextColor={'#00000080'}
          error={error?.name}
        />

        <Input
          showImage={true}
          showTitle
          source={ImageConstant.email}
          placeholder="example@gmail.com"
          value={email}
          editable={false}
          onChange={text => setEmail(text)}
          keyboardType="email-address"
          textContentType="emailAddress"
          style_input={styles.inputText}
          title={localization?.Preferences?.email}
          placeholderTextColor={'#00000080'}
          error={error?.email}
        />

        <Input
          countryPicker
          showTitle
          placeholder="Enter mobile number"
          value={mobile}
          onChange={text => setMobile(text)}
          style_input={styles.inputText}
          title={localization?.Preferences?.phone}
          placeholderTextColor={'#00000080'}
          error={error?.mobile}
        />

        <DropdownComponent
          placeholder="Select"
          title={localization?.Preferences?.select_country}
          selectedTextStyleNew={{ marginLeft: 20 }}
          marginHorizontal={0}
          style_dropdown={{ width: '100%', marginHorizontal: 0 }}
          //   error={error?.gender}
          value={country}
          onChange={v => {
            console.log(v, '===========>');
            setCountry(v);
            setState({}); // Reset state when country changes
          }}
          data={countryList}
          error={error?.country}
        />
        <DropdownComponent
          placeholder="Select"
          title={localization?.Preferences?.select_state}
          selectedTextStyleNew={{ marginLeft: 20 }}
          marginHorizontal={0}
          style_dropdown={{ width: '100%', marginHorizontal: 0 }}
          //   error={error?.gender}
          value={state}
          onChange={v => {
            console.log(v, '===========>');
            setState(v);
          }}
          error={error?.state}
          data={getStateList()}
        />
        <DropdownComponent
          placeholder="Select"
          title={localization?.Preferences?.language}
          selectedTextStyleNew={{ marginLeft: 0 }}
          marginHorizontal={0}
          style_dropdown={{ width: '100%', marginHorizontal: 0 }}
          //   error={error?.gender}
          value={languages}
          leftIconsShow
          leftIcons={ImageConstant?.lang}
          onChange={v => {
            console.log(v, '======l=====>');
            setLanguages(v);
          }}
          data={languageList}
        />
        <DropdownComponent
          placeholder="Select days"
          title={localization?.Preferences?.notify}
          selectedTextStyleNew={{ marginLeft: 20 }}
          marginHorizontal={0}
          style_dropdown={{ width: '100%', marginHorizontal: 0 }}
          //   error={error?.gender}
          value={notifyDays}
          onChange={v => {
            console.log(v, '===========>');
            setNotifyDays(v);
          }}
          data={notifyList}
        />

        <Button
          linerColor={['#592009', '#592009']}
          title={localization?.Preferences?.update}
          onPress={() => {
            updateProfile();
            // changes();
            // dispatch(langCode(languages?.value || languages));
            // setLanguage(languages?.value || languages);
            // navigation?.goBack();
          }}
        />
        <View style={{ height: bottomSpacing }} />
      </ScrollView>

      {/* Image Modal for Profile Picture */}
      <ImageModal
        showModal={showImageModal}
        close={() => setShowImageModal(false)}
        selected={(assets, source) => {
          if (assets && assets.length > 0) {
            const selectedImage = assets[0];
            console.log('Selected image:', selectedImage);
            // Update profile image
            if (selectedImage.uri) {
              setProfileImage(selectedImage.uri);
            }

            // Here you can also upload the image to your backend
            // For now, we're just updating the local state
            setShowImageModal(false);
          }
        }}
      />
    </View>
  );
};

export default Preferences;

const styles = StyleSheet.create({
  background: {
    height: 310,
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
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    resizeMode: 'contain',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#FFFFFF',
    padding: 5,
    borderRadius: 20,
    width: 27,
    height: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
  profileEmail: {
    color: '#fff',
    fontSize: 14,
    marginTop: 4,
    width: '90%',
  },
  profilePhone: {
    color: '#fff',
    fontSize: 14,
    marginTop: 2,
  },
});
