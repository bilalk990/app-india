import {
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { Profiler } from 'react';
import { Colors } from '../Constants/Colors';
import { Font } from '../Constants/Font';
import Typography from './UI/Typography';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HeaderForUser = ({
  onPress,
  style_img,
  style_backarrow,
  style_title,
  title,
  source_arrow,
  source_logo,
  containerStyle,
  centerIcon = false,
  backgroundColor = Colors.white,
  centerIconSource,
  centerIconTitle,
  onPressRightIcon = () => { },
  onPressLangIcon = () => { },
  onPressLeftIcon = () => { },
  onPressProfileIcon = () => { },
  back_img,
  Lang_icon,
  Profile_icon,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, containerStyle]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#F53800"
        translucent
      />

      <View style={styles.backContainer}>
        <TouchableOpacity
          onPress={() => {
            onPressLeftIcon();
          }}
        >
          <Image
            source={source_arrow}
            style={[styles.back_img, style_backarrow]}
          />
        </TouchableOpacity>
        <Typography
          type={Font.Poppins_Medium}
          style={[styles.txt_style, style_title]}
        >
          {title}
        </Typography>
        {/* Bug 3 fix: Proper spacing between header icons to prevent overlap */}
        <View style={styles.rightIconsContainer}>
          {Lang_icon && (
            <TouchableOpacity onPress={onPressLangIcon} style={styles.iconButton}>
              <Image
                source={Lang_icon}
                style={[styles.back_img, { tintColor: '#fff' }, back_img]}
              />
            </TouchableOpacity>
          )}
          {source_logo && (
            <TouchableOpacity onPress={onPressRightIcon} style={styles.iconButton}>
              <Image source={source_logo} style={[styles.back_img, back_img]} />
            </TouchableOpacity>
          )}
          {Profile_icon && (
            <TouchableOpacity
              onPress={onPressProfileIcon}
              disabled={true}
              style={[styles.iconButton, { borderRadius: 100 }]}
            >
              <Image
                source={Profile_icon}
                style={[
                  styles.back_img,
                  { height: 40, width: 40, borderRadius: 100 },
                  back_img,
                ]}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default HeaderForUser;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  backContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  back_img: {
    height: 30,
    width: 30,
    resizeMode: 'center',
  },
  txt_style: {
    color: 'rgba(2, 153, 145, 1)',
    fontSize: 15,
    textAlign: 'center',
    flex: 1,
  },
  // Bug 3 fix: Container for right side icons with proper spacing
  rightIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
});
