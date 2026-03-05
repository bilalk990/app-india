import {
    StyleSheet,
    Modal,
    View,
    TouchableOpacity,
    Image,
    Platform,
  } from 'react-native';
  import React from 'react';
  import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
  import ImagePicker from 'react-native-image-crop-picker';
  
  import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
  import SimpleToast from 'react-native-simple-toast';
import { ImageConstant } from '../Constants/ImageConstant';
import Typography from '../Component/UI/Typography';
import { Colors } from '../Constants/Colors';
import { Font } from '../Constants/Font';
import { windowHeight } from '../Constants/Dimensions';
  
  const ImageModal = ({
    showModal,
    documents = false,
    document,
    close = () => {},
    selected = () => {},
    TimeVal,
    deleteImage = false,
  }) => {
    const OsVer = Platform.constants['Release'];
  
    const getCameraPermission = () =>
      Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
  
    const getPhotoPermission = () =>
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : OsVer > 12
        ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
  
    const handlePermission = async (permission, action) => {
      try {
        const result = await check(permission);
  
        if (result === RESULTS.GRANTED) {
          action();
        } else if (result === RESULTS.DENIED || result === RESULTS.LIMITED) {
          const requestResult = await request(permission);
  
          if (requestResult === RESULTS.GRANTED) {
            action();
          } else {
            SimpleToast.show('Permission denied.');
          }
        } else if (result === RESULTS.BLOCKED) {
          SimpleToast.show('Permission is blocked. Please enable it from settings.');
        } else {
          SimpleToast.show('Unknown permission error.');
        }
      } catch (error) {
        SimpleToast.show('An error occurred while requesting permissions.');
      }
    };
  
    const OpenCamera = async () => {
      await handlePermission(getCameraPermission(), async () => {
        try {
          const image = await ImagePicker.openCamera({
            width: 800,
            height: 800,
            cropping: true,
            cropperCircleOverlay: true,
            compressImageQuality: 0.8,
            includeBase64: false,
          });

          if (image) {
            // Format to match react-native-image-picker response structure
            const formattedResponse = [{
              uri: image.path,
              type: image.mime,
              name: image.path.split('/').pop() || 'image.jpg',
              width: image.width,
              height: image.height,
            }];
            selected(formattedResponse, 'camera');
            close();
          }
        } catch (error) {
          if (error.message !== 'User cancelled image selection') {
            console.log('Camera error:', error);
            SimpleToast.show('Error opening camera');
          }
        }
      });
    };
  
    const OpenGallery = async () => {
      await handlePermission(getPhotoPermission(), async () => {
        try {
          const image = await ImagePicker.openPicker({
            width: 800,
            height: 800,
            cropping: true,
            cropperCircleOverlay: true,
            compressImageQuality: 0.8,
            includeBase64: false,
          });

          if (image) {
            // Format to match react-native-image-picker response structure
            const formattedResponse = [{
              uri: image.path,
              type: image.mime,
              name: image.path.split('/').pop() || 'image.jpg',
              width: image.width,
              height: image.height,
            }];
            selected(formattedResponse, 'gallery');
            close();
          }
        } catch (error) {
          if (error.message !== 'User cancelled image selection') {
            console.log('Gallery error:', error);
            SimpleToast.show('Error opening gallery');
          }
        }
      });
    };
  

    return (
      <Modal
        statusBarTranslucent
        onRequestClose={() => close()}
        transparent={true}
        visible={showModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => close()}>
                <Typography
                  size={18}
                  color={Colors.black}
                  fontFamily={Font.Inter_Medium}>
                  ✕
                </Typography>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.modalView,
                {height: documents || deleteImage ? 220 : 200},
              ]}>
              <TouchableOpacity style={styles.checkView} onPress={OpenCamera}>
                <View style={styles.iconContainer}>
                  <Image
                    style={styles.icon}
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/128/685/685655.png',
                    }}
                  />
                </View>
                <Typography
                  size={16}
                  color={Colors.black}
                  style={{marginLeft: 15}}
                  fontFamily={Font.Inter_Medium}>
                  Open Camera
                </Typography>
              </TouchableOpacity>
  
              <TouchableOpacity style={styles.checkView} onPress={OpenGallery}>
                <View style={styles.iconContainer}>
                  <Image
                    style={styles.icon}
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/128/16025/16025439.png',
                    }}
                  />
                </View>
                <Typography
                  size={16}
                  fontFamily={Font.Inter_Medium}
                  color={Colors.black}
                  style={{marginLeft: 15}}>
                  Open Gallery
                </Typography>
              </TouchableOpacity>
  
           
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  
  export default ImageModal;
  
  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: Colors.black + '80',
    },
    modalContent: {
      backgroundColor: Colors.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      height: windowHeight / 4,
      ...Platform.select({
        ios: {
          shadowColor: 'black',
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.25,
          shadowRadius: 4,
        },
        android: {
          elevation: 15,
        },
      }),
    },
    modalHeader: {
      padding: 8,
      alignItems: 'flex-end',
      borderBottomWidth: 1,
      borderBottomColor: Colors.black,
      paddingHorizontal: 10,
    },
    checkView: {
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
      marginBottom: 10,
    },
    modalView: {
      paddingHorizontal: 10,
      borderRadius: 10,
      marginTop: 20,
    },
    iconContainer: {
      borderRadius: 50,
      backgroundColor: Colors.bg_grey,
      height: 45,
      width: 45,
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      height: 25,
      width: 25,
    },
  });
  