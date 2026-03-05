import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  PixelRatio,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from '../Constants/Colors';
import Typography from './UI/Typography';
import {CountryPicker} from 'react-native-country-codes-picker';

import {ImageConstant} from '../Constants/ImageConstant';
import {Font} from '../Constants/Font';

const Input = ({
  title,
  style_title,
  style_input,
  placeholder,
  keyboardType = 'default',
  maxLength,
  multiline,
  value,
  optional,
  editable = true,
  onChange,
  secureTextEntry,
  onPress,
  source_eye,
  style_inputContainer,
  placeholderTextColor,
  borderColor = "#DDDDDD",
  countryPicker = false,
  onCountryPress = () => {},
  country,
  numberOfLines,
  onFocus = () => {},
  error = '',
  mainStyle,
  titleTo,
  icon_style,
  showImage,
  source,
  showTitle = true,
  textAlign = 'right',
  firstStyle,
  showImage2,
}) => {
  const [show, setShow] = useState(false);

  const fontScale = PixelRatio?.getFontScale();

  const [countryCode, setCountryCode] = useState({
    flag: '🇮🇳',
    dial_code: '+91',
  });

  useEffect(() => {
    // Update country code if it changes
    if (country?.dial_code && countryCode?.dial_code !== country?.dial_code) {
      setCountryCode(country);
    }
  }, [country]);

  return (
    <>
      <View style={[styles.container, mainStyle]}>
        {showTitle && (
          <View style={styles.titleContainer}>
            <Typography
              style={[
                styles.txt_style,
                {fontSize: 15 / fontScale},
                style_title,
              ]}>
              {title}
            </Typography>
            <Typography style={[styles.txt_style, style_title]}>
              {titleTo}
            </Typography>
          </View>
        )}

        <View
          style={[
            styles.input_container,
            style_inputContainer,
            {borderColor: borderColor},
          ]}>
          {showImage && (
            <View style={styles.imageContainer}>
              <Image source={source} style={[styles.image, firstStyle]} />
            </View>
          )}
          {countryPicker && (
            <>
              <TouchableOpacity
                onPress={() => setShow(true)}
                style={styles.countryPickerContainer}>
                <View style={styles.countryInfo}>
                  <Typography
                    size={14}
                    type={Font.Poppins_Medium}
                    style={styles.countryDialCode}>
                    {countryCode?.dial_code}
                  </Typography>
                </View>
              </TouchableOpacity>

              <CountryPicker
                show={show}
                onBackdropPress={() => setShow(false)}
                style={styles.countryPickerStyle}
                pickerButtonOnPress={item => {
                  onCountryPress(item);
                  setCountryCode(item);
                  setShow(false);
                }}
              />
            </>
          )}

          <TextInput
            style={[styles.input, {fontSize: 14 / fontScale}, style_input]}
            onChangeText={onChange}
            multiline={multiline}
            numberOfLines={numberOfLines}
            maxLength={maxLength}
            editable={editable}
            placeholder={placeholder}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            value={value}
            textAlignVertical={multiline ? 'top' : 'center'}
            placeholderTextColor={placeholderTextColor}
            onFocus={onFocus}
          />
          {showImage2 && (
            <Image
              source={source}
              style={[styles.image, firstStyle]}
              tintColor={'#029991'}
            />
          )}
          {source_eye && (
            <TouchableOpacity style={styles.icon_container} onPress={onPress}>
              <Image
                source={source_eye}
                style={[styles.icon_style, icon_style]}
              />
            </TouchableOpacity>
          )}
        </View>

        {optional && (
          <View style={styles.optionalContainer}>
            <Typography
              size={12}
              marginTop={5}
              type={Font.Inter_Regular}
              marginBottom={-20}
              color="#72778C">
              {'(Optional)'}
            </Typography>
          </View>
        )}

        {error && (
          <Typography textAlign={textAlign} style={styles.errorText}>
            {error}
          </Typography>
        )}
      </View>
    </>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  txt_style: {
    color: Colors.lableColor,
    fontize: 14,
    fontFamily: Font.Inter_Medium,
  },
  input_container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 4,
    height: 60,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },

  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
    paddingRight: 15,
    paddingVertical: 0,
    fontSize: 14,
    paddingTop: Platform.OS === "ios" ? 0  : 5,
    fontFamily: Font.Poppins_Medium,
    color: Colors.black,
    textAlignVertical: 'center',
  },
  icon_container: {
    paddingRight: 5,
  },
  icon_style: {
    height: 22,
    width: 22,
    marginRight: 5,
  },
  countryPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    paddingLeft: 10,
  },
  countryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryFlag: {
    marginLeft: 5,
  },
  countryDialCode: {
    marginHorizontal: 1,
    fontSize: 14,
    fontFamily: Font.Poppins_Medium,
  },
  arrowIcon: {
    height: 7,
    width: 14,
    resizeMode: 'contain',
    marginLeft: 2,
  },
  countryPickerStyle: {
    modal: {
      height: '50%',
    },
    textInput: {
      fontFamily: Font.Poppins_Medium,
      color: 'black',
      paddingHorizontal: 10,
    },
    countryName: {
      fontFamily: Font.Poppins_Medium,
      color: 'black',
    },
    dialCode: {
      fontFamily: Font.Poppins_Medium,
      color: 'black',
    },
  },
  optionalContainer: {
    alignSelf: 'flex-end',
  },
  errorText: {
    color: 'red',
    fontize: 11,
    paddingTop: 8,
  },
  imageContainer: {
    width: 44,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
});
