import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StatusBar } from 'react-native';

const STATUSBAR_HEIGHT = StatusBar.currentHeight || 0;
import Typography from '../../../Component/UI/Typography';
import Button from '../../../Component/Button';
import Header from '../../../Component/Header';
import { ImageConstant } from '../../../Constants/ImageConstant';
import { Font } from '../../../Constants/Font';
import { setLanguage } from '../../../Constants/AsyncStorage';
import localization from '../../../Constants/localization';
import { useDispatch, useSelector } from 'react-redux';
import { langCode } from '../../../Redux/action';

const languages = [
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

const SelectLanguageScreen = ({ navigation }) => {
  const languageCode = useSelector(state => state.language_code);
  const [selectedLang, setSelectedLang] = useState(languageCode || 'en');

  const dispatch = useDispatch();

  // Bug 7 fix: Make handleSubmit async and await language changes
  const handleSubmit = async () => {
    // Set language in localization library first
    localization?.setLanguage(selectedLang);
    // Update Redux state
    dispatch(langCode(selectedLang));
    // Save to AsyncStorage
    await setLanguage(selectedLang);
    // Navigate back after all changes are applied
    navigation?.goBack();
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: STATUSBAR_HEIGHT }}
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
      />

      <View style={{ padding: 20, flex: 1 }}>
        <Typography
          size={30}
          style={{ textAlign: 'center', marginBottom: 10 }}
          type={Font?.Manrope_Regular}
        >
          {localization?.HomeDetails?.select_language}
        </Typography>
        <Typography
          size={16}
          lineHeight={23}
          style={{ textAlign: 'center', marginBottom: 20 }}
        >
          {localization?.HomeDetails?.description}
        </Typography>

        {languages.map((lang, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedLang(lang?.value)}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#eee',
            }}
          >
            <Typography variant="body" color="#000000">
              {lang.label}
            </Typography>
            <Image
              source={
                selectedLang === lang?.value
                  ? ImageConstant?.radioActive
                  : ImageConstant?.radioInactive
              }
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>
        ))}
        <View style={{ bottom: 0, position: 'absolute', width: '100%' }}>
          <Button
            title={localization?.HomeDetails?.continue}
            onPress={() => handleSubmit()}
            style={{ marginTop: 30, marginLeft: 40 }}
            linerColor={['#592009', '#592009']}
          />
        </View>
      </View>
    </View>
  );
};

export default SelectLanguageScreen;
