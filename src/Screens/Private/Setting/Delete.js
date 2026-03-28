import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  Settings,
} from 'react-native';
import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Removed STATUSBAR_HEIGHT

import Header from '../../../Component/Header';
import { ImageConstant } from '../../../Constants/ImageConstant';
import Typography from '../../../Component/UI/Typography';
import Button from '../../../Component/Button';
import { useDispatch } from 'react-redux';
import { isAuth } from '../../../Redux/action';
import { Font } from '../../../Constants/Font';
import DropdownComponent from '../../../Component/DropdownComponent';
import Input from '../../../Component/Input';
import { Color } from 'react-native/types_generated/Libraries/Animated/AnimatedExports';
import SimpleModal from '../../../Component/UI/SimpleModal';
import localization from '../../../Constants/localization';

const Delete = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [modal, setModal] = useState(false);
  const reasonsForLeaving = [
    { label: 'I don’t find this app useful', value: 'not_useful' },
    { label: 'I have privacy concerns', value: 'privacy_concerns' },
    {
      label: 'I’m getting too many notifications',
      value: 'too_many_notifications',
    },
    { label: 'I created a duplicate account', value: 'duplicate_account' },
    { label: 'Other', value: 'other' },
  ];

  const dispatch = useDispatch();

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#F53800', '#E43500']} style={[styles.background, { paddingTop: insets.top }]}>
        <Header
          source_arrow={ImageConstant?.BackArrow}
          style_backarrow={{
            borderWidth: 1,
            padding: 20,
            borderColor: '#FFFFFF',
            tintColor: '#FFFFFF',
            borderRadius: 16,
          }}
          containerStyle={{ marginTop: 5 }}
        />
        <View style={styles.profileContainer}>
          <Typography
            style={styles.profileName}
            Font={Font?.Manrope_Regular}
            size={30}
          >
            {localization?.Settings?.delete}
          </Typography>
          <Typography
            Font={Font?.Poppins_Bold}
            size={18}
            lineHeight={35}
            color="#fff"
          >
            {localization?.Settings?.accountDeleteSubtitle}
          </Typography>
          <Typography
            size={15}
            color="#fff"
            lineHeight={22}
            type={Font?.Manrope_Regular}
          >
            {localization?.Settings?.accountDeleteDesc}
          </Typography>
        </View>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={{ flex: 1 }}>
          <DropdownComponent
            placeholder="Select"
            title="Reason for Leaving"
            selectedTextStyleNew={{ marginLeft: 20 }}
            value={selectedReason?.value}
            marginHorizontal={0}
            style_dropdown={{ width: '100%', marginHorizontal: 0 }}
            onChange={v => {
              console.log(v, 'v==========rr=====>');
              setSelectedReason(v);
            }}
            data={reasonsForLeaving}
          />

          {selectedReason?.label === 'Other' && (
            <Input
              placeholder={localization?.Settings?.reasonOther}
              onChange={text => setOtherReason(text)}
              style_input={styles.inputText}
              title={localization?.Settings?.reasonOther}
              multiline={true}
              placeholderTextColor={'#00000080'}
              value={otherReason}
              style_inputContainer={{ height: 130 }}
            />
          )}
        </View>

        <View style={styles.logoutWrapper}>
          <Button
            onPress={() => {
              setModal(true);
            }}
            main_style={{ width: '48%' }}
            // icon={ImageConstant?.logout}
            linerColor={['#592009', '#592009']}
            title={localization?.Settings?.deleteButton}
          />
          <Button
            onPress={() => {
              navigation.goBack();
            }}
            main_style={{ width: '48%' }}
            // icon={ImageConstant?.logout}
            linerColor={['#FFFFFF', '#FFFFFF']}
            style={{ borderWidth: 1, borderRadius: 10, borderColor: '#A6A6A6' }}
            title={localization?.Settings?.cancelButton}
            title_style={{ color: '#A6A6A6' }}
          />
        </View>
        {/* <View style={{ height: 80 }} /> */}
      </ScrollView>
      <SimpleModal visible={modal}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 20,
          }}
        >
          <Typography size={24} type={Font?.Poppins_Medium}>
            {localization?.Settings?.confirmTitle}
          </Typography>
          <Typography
            size={16}
            type={Font?.Poppins_Regular}
            textAlign={'center'}
            color="#4E4E4E"
          >
            {localization?.Settings?.confirmDesc}
          </Typography>
          <Button
            onPress={() => {
              setModal(false);
            }}
            main_style={{ width: '85%' }}
            // icon={ImageConstant?.logout}
            linerColor={['#592009', '#592009']}
            title={localization?.Settings?.confirmCancel}
          />
          <Button
            onPress={() => {
              dispatch(isAuth(false));
            }}
            main_style={{ width: '85%' }}
            // icon={ImageConstant?.logout}
            linerColor={['#FFFFFF', '#FFFFFF']}
            style={{ borderWidth: 1, borderRadius: 10, borderColor: '#A6A6A6' }}
            title={localization?.Settings?.confirmDelete}
            title_style={{ color: '#A6A6A6' }}
          />
        </View>
      </SimpleModal>
    </View>
  );
};

export default Delete;

const styles = StyleSheet.create({
  background: {
    minHeight: 280, // Adjusted for insets.top
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  profileContainer: {
    // flexDirection: 'row',
    // alignItems: 'center',
    marginTop: 10,
  },
  profileName: {
    color: '#fff',
    // fontSize: 24,
    // fontWeight: '700',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#fffbf6',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    width: 30,
    height: 30,
    marginRight: 16,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  subtitle: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
  },
  logoutWrapper: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  inputText: {
    color: '#000',
    height: 130,
  },
});
