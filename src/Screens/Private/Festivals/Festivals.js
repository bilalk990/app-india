import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';

const STATUSBAR_HEIGHT = StatusBar.currentHeight || 0;
import HeaderForUser from '../../../Component/HeaderForUser';
import { FocusAwareStatusBar } from '../../../Component/UI/FocusAwareStatusBar';
import { ImageConstant } from '../../../Constants/ImageConstant';
import Typography from '../../../Component/UI/Typography';
import { Font } from '../../../Constants/Font';
import Input from '../../../Component/Input';
import localization from '../../../Constants/localization';
import { GET_WITH_TOKEN } from '../../../Backend/Backend';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import CustomBottomSheet from '../SetPop.js/CustomBottomSheet';
import LinearGradient from 'react-native-linear-gradient';
import Button from '../../../Component/Button';
import DropdownComponent from '../../../Component/DropdownComponent';
import MultiSelectDropdown from '../../../Component/MultiSelectDropdown';
import { POST_FORM_DATA } from './../../../Backend/Backend';
import { validators } from '../../../Backend/Validator';
import { isValidForm } from '../../../Backend/Utility';
import { SimpleToast } from 'react-native-simple-toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BASE_TAB_HEIGHT } from '../../../Navigation/TabNavigation';

const Festivals = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const bottomSpacing = BASE_TAB_HEIGHT + insets.bottom + 10;
  const [festivals, setFestivals] = useState({
    singleFestivals: [],
    multipleFestivals: [],
  });
  const [error, setError] = useState({});
  const [filteredFestivals, setFilteredFestivals] = useState({
    singleFestivals: [],
    multipleFestivals: [],
  });
  const [festival, setFestival] = useState({});
  const [visible, setVisible] = useState(false);
  const [Key, setKey] = useState({});
  const [loader, setLoader] = useState(false);
  const [activeTab, setActiveTab] = useState('Monthly');
  const [stateList, setStateList] = useState();
  const [selectState, setSelectState] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    GetState();
    GetFestival();
  }, [isFocused]);

  useEffect(() => {
    GetFestival();
  }, [selectState]);

  const GetFestival = () => {
    setLoader(true);

    // If no state selected, call API without state_id parameters
    if (selectState.length === 0) {
      GET_WITH_TOKEN(
        'festivalstab',
        success => {
          setLoader(false);
          setFestivals({
            singleFestivals: success?.data.single_festivals || [],
            multipleFestivals: success?.data.multiple_festivals || [],
          });
          setFilteredFestivals({
            singleFestivals: success?.data.single_festivals || [],
            multipleFestivals: success?.data.multiple_festivals || [],
          });
        },
        error => {
          console.log(error);
          setLoader(false);
        },
        fail => {
          console.log(fail);
          setLoader(false);
        },
      );
      return;
    }

    // Build query string with multiple state_ids
    const stateIds = selectState
      .map(state => `state_id=${state.value}`)
      .join('&');
    GET_WITH_TOKEN(
      `festivalstab?${stateIds}`,
      success => {
        setLoader(false);
        setFestivals({
          singleFestivals: success?.data.single_festivals || [],
          multipleFestivals: success?.data.multiple_festivals || [],
        });
        setFilteredFestivals({
          singleFestivals: success?.data.single_festivals || [],
          multipleFestivals: success?.data.multiple_festivals || [],
        });
      },
      error => {
        console.log(error);
        setLoader(false);
      },
      fail => {
        console.log(fail);
        setLoader(false);
      },
    );
  };

  const GetState = () => {
    setLoader(true);
    GET_WITH_TOKEN(
      'state',
      success => {
        setLoader(false);
        const ApiData = success?.data;
        const finalData = ApiData?.map((item, index) => ({
          label: item?.name,
          value: item?.id,
        }));
        setStateList(finalData);
      },
      error => {
        console.log(error);
        setLoader(false);
      },
      fail => {
        console.log(fail);
        setLoader(false);
      },
    );
  };

  // Handle search input
  const handleSearch = text => {
    const lowerText = text.toLowerCase();
    const filteredSingle = festivals.singleFestivals.filter(item =>
      (item?.festival_desc?.name || item.name)
        .toLowerCase()
        .includes(lowerText),
    );
    const filteredMultiple = festivals.multipleFestivals.filter(item =>
      (item?.festival_desc?.name || item.name)
        .toLowerCase()
        .includes(lowerText),
    );
    setFilteredFestivals({
      singleFestivals: filteredSingle,
      multipleFestivals: filteredMultiple,
    });
  };

  const Create_Notification = (datas, item) => {
    let error = {
      drop: validators?.checkRequire('Reminder Days', item),
    };
    setError(error);
    if (isValidForm(error)) {
      let data = new FormData();
      data.append('festival_id', datas?.id);
      data.append('festival_date', datas?.date);
      data.append('before_days', item?.key);
      data.append('is_recurring', datas?.is_multiple_festival == 1 ? 1 : 0);
      POST_FORM_DATA(
        'create-reminders',
        data,
        success => {
          SimpleToast?.show(success?.message || '');
          setVisible(false);
        },
        error => { },
        fail => { },
      );
    }
  };

  // Reusable festival card
  const renderFestivalCard = item => (
    <TouchableOpacity
      key={item.id}
      style={styles.card}
      onPress={() => navigation.navigate('HomeDeatilsNew', { data: item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.topRightIcons}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => {
            setFestival(item);
            setVisible(true);
          }}
        >
          {item?.is_remainder == 1 && (
            <View
              style={{
                width: 8,
                height: 8,
                backgroundColor: '#FF8700',
                borderRadius: 100,
                position: 'absolute',
                left: 18,
                top: 8,
                zIndex: 999,
              }}
            />
          )}

          <Image source={ImageConstant.bell} style={styles.notificationIcon} />
        </TouchableOpacity>
        {/* <TouchableOpacity style={styles.iconBtn}>
          <Image source={ImageConstant.share} style={styles.shareIcon} />
        </TouchableOpacity> */}
      </View>
      <View style={styles.cardContent}>
        <Typography style={styles.cardDate} type={Font.Poppins_Regular}>
          {moment(item.date)
            ?.locale(localization?.getLanguage())
            ?.format('DD MMMM YYYY, dddd')}
        </Typography>
        <Typography style={styles.cardTitle} type={Font.Poppins_Bold}>
          {item?.festival_desc?.name || item.name}
        </Typography>
        <View style={styles.cardFooter}>
          <Typography style={styles.cardSubtitle} numberOfLines={1}>
            {item?.festival_desc?.name || item.name}
          </Typography>
          <TouchableOpacity style={styles.viewDetailsBtn}>
            <Typography style={styles.viewDetails} type={Font.Poppins_SemiBold}>
              {localization?.Festivals?.view_details}{' '}
              <Image
                source={ImageConstant.rightarrow}
                style={{ width: 17, height: 10 }}
              />
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fffbf6' }}>
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="transparent" />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: STATUSBAR_HEIGHT,
        }}
      >
        <HeaderForUser
          source_arrow={ImageConstant?.BackArrow}
          style_backarrow={{
            borderWidth: 1,
            padding: 20,
            borderColor: '#000',
            tintColor: '#000',
            borderRadius: 10,
          }}
          onPressLeftIcon={() => navigation?.goBack()}
        />

        <View style={styles.profileContainer}>
          <Typography style={styles.profileName} type={Font?.Manrope_Regular}>
            {localization?.Festivals?.title}
          </Typography>
        </View>
        {/* <View
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
          type={Font?.Poppins_SemiBold}
        >
          {moment()?.locale(localization?.getLanguage())?.format('MMMM YYYY')}
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
      </View> */}

        {/* Search Input */}
        <Input
          placeholder={localization?.Festivals?.search}
          onChange={handleSearch}
          style_input={styles.inputText}
          placeholderTextColor={'#00000080'}
          source_eye={ImageConstant?.search}
        />

        <View
          style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectState.length === 0 && styles.filterButtonActive,
            ]}
            onPress={() => {
              setSelectState([]);
            }}
          >
            <Typography
              style={[
                selectState.length === 0 && {
                  color: '#E41D54',
                  fontWeight: 'bold',
                },
              ]}
              type={Font.Poppins_Regular}
            >
              All
            </Typography>
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <MultiSelectDropdown
              placeholder="Select States"
              marginHorizontal={0}
              style_dropdown={{
                width: '100%',
                paddingHorizontal: 10,
              }}
              selectedValues={selectState}
              error={error?.drop}
              onChange={selected => setSelectState(selected)}
              data={stateList || []}
            />
          </View>
        </View>

        {/* Custom Tabs */}
        <View style={styles.tabRow}>
          {['Yearly', 'Monthly'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Typography
                type={Font?.Poppins_Medium}
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab} Festivals
              </Typography>
            </TouchableOpacity>
          ))}
        </View>

        {loader ? (
          <ActivityIndicator
            size="large"
            color="#F53800"
            style={{ marginTop: 50 }}
          />
        ) : (
          <>
            {activeTab === 'Yearly'
              ? filteredFestivals.singleFestivals.map(item =>
                renderFestivalCard(item),
              )
              : filteredFestivals.multipleFestivals.map(item =>
                renderFestivalCard(item),
              )}
          </>
        )}

        <View style={{ height: bottomSpacing }} />

        <CustomBottomSheet visible={visible} onClose={() => setVisible(false)}>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <LinearGradient
              colors={['#FD8F1E', '#592009']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.reminderGradient}
            >
              <Image
                source={ImageConstant?.reminder}
                style={styles.reminderSheetIcon}
              />
            </LinearGradient>
          </View>

          <Typography style={styles.title} type={Font?.Poppins_Bold}>
            {localization?.HomeDetails?.setReminder}
          </Typography>
          <Typography style={styles.reminderDesc} type={Font?.Poppins_Regular}>
            {localization?.HomeDetails?.reminderDesc}
          </Typography>
          <View style={{ width: '100%' }}>
            <DropdownComponent
              placeholder="Select days"
              marginHorizontal={0}
              style_dropdown={{
                width: '100%',
                paddingHorizontal: 10,
                marginHorizontal: 0,
              }}
              value={Key?.value}
              error={error?.drop}
              onChange={v => setKey(v)}
              data={[
                { label: 'Before 1 day', value: 'before_1_day', key: 1 },
                { label: 'Before 2 days', value: 'before_2_days', key: 2 },
                { label: 'Before 3 days', value: 'before_3_days', key: 3 },
              ]}
            />
          </View>
          {/* <View
          style={[styles.row, { marginTop: 20, justifyContent: 'flex-start' }]}
        >
          <TouchableOpacity onPress={() => setOnEkadashi(!onEkadashi)}>
            <Image
              source={
                onEkadashi ? ImageConstant?.checked : ImageConstant?.unchecked
              }
              style={styles.checkbox}
            />
          </TouchableOpacity>
          <Typography type={Font?.Poppins_Regular} size={16}>
            {localization?.HomeDetails?.onEkadashi}
          </Typography>
        </View> */}

          {/* Buttons */}
          <View style={[styles.row, { marginTop: 30 }]}>
            <View style={styles.halfWidth}>
              <Button
                onPress={() => setVisible(false)}
                style={styles.cancelBtn}
                linerColor={['#FFFFFF', '#FFFFFF']}
                title={localization?.HomeDetails?.cancel}
                title_style={{ color: '#592009' }}
              />
            </View>
            <View style={styles.halfWidth}>
              <Button
                onPress={() => {
                  Create_Notification(festival, Key);
                }}
                linerColor={['#592009', '#592009']}
                title={localization?.HomeDetails?.confirm}
                title_style={{ color: '#fff' }}
              />
            </View>
          </View>
        </CustomBottomSheet>
      </ScrollView>
    </View>
  );
};

export default Festivals;

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  profileName: {
    color: '#000',
    fontSize: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    padding: 10,
  },
  image: {
    width: '100%',
    height: 195,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  cardContent: {
    padding: 15,
    paddingBottom: 10,
  },
  cardDate: {
    fontSize: 13,
    color: '#5B5B5B',
  },
  cardTitle: {
    fontSize: 18,
    marginTop: 4,
    color: '#000',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    gap: 10,
  },
  cardSubtitle: {
    flex: 1,
    fontSize: 14,
    color: '#5B5B5B',
  },
  viewDetailsBtn: {
    flexShrink: 0,
  },
  viewDetails: {
    fontSize: 14,
    color: '#E41D54',
  },
  topRightIcons: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    gap: 7,
  },
  iconBtn: {
    padding: 4,
  },
  notificationIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  shareIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginTop: 5,
  },
  tabRow: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#E41D54',
  },
  tabText: {
    fontSize: 16,
    color: '#444',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#E41D54',
  },
  inputText: {
    color: '#000',
  },
  reminderGradient: { padding: 20, borderRadius: 40 },
  reminderSheetIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  title: { fontSize: 18, textAlign: 'center', marginBottom: 8 },
  reminderDesc: { fontSize: 14, textAlign: 'center', marginBottom: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  halfWidth: { width: '48%' },
  checkbox: { width: 22, height: 22, marginRight: 10 },
  cancelBtn: { borderWidth: 1, borderRadius: 10, borderColor: '#592009' },
  infoRow: {
    marginTop: 12,
    marginRight: 3,
  },
  filterButton: {
    borderWidth: 1,
    padding: 18,
    borderRadius: 10,
    borderColor: '#ccc',
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    borderColor: '#E41D54',
    backgroundColor: '#fff',
  },
});
