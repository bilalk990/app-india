import {
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  ImageBackground,
  StatusBar,
} from 'react-native';
import React, { useEffect, useState } from 'react';

const STATUSBAR_HEIGHT = StatusBar.currentHeight || 0;
import { ImageConstant } from '../../../Constants/ImageConstant';
import HeaderForUser from '../../../Component/HeaderForUser';
import Typography from '../../../Component/UI/Typography';
import { Font } from '../../../Constants/Font';
import CustomBottomSheet from '../SetPop.js/CustomBottomSheet';
import Button from '../../../Component/Button';
import DropdownComponent from '../../../Component/DropdownComponent';
import moment from 'moment';
import { GET, POST_FORM_DATA } from '../../../Backend/Backend';
import { useIsFocused } from '@react-navigation/native';
import localization from '../../../Constants/localization';
import { validators } from '../../../Backend/Validator';
import { isValidForm } from '../../../Backend/Utility';
import SimpleToast from 'react-native-simple-toast';

const HomeDeatils = ({ navigation, route }) => {
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [beforeEkadashi, setBeforeEkadashi] = useState(true);
  const [onEkadashi, setOnEkadashi] = useState(false);
  const [data, setData] = useState({});
  const [isReminderSet, setIsReminderSet] = useState(route?.params?.data?.is_remainder == 1);
  const [Modaldata, seModaltData] = useState({

  });
  const [upcoming_festivals, setUpcoming_festivals] = useState([]);
  const isFocused = useIsFocused();
  // alert (route?.params?.data?.is_remainder)
useEffect(() => {
  if (!Modaldata.selectDay) {
    seModaltData({ ...Modaldata, selectDay:  { label: '1 Day', value: '1_day' } });
  }
}, [isFocused]);
  const toggleAnswer = index => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  useEffect(() => {
    const festivalId = route?.params?.data?.id;
    if (festivalId) {
      getTemples(festivalId);
    }
  }, [isFocused]);

  const renderDetailRow = (label, value) => {
    if (!value) {
      return null;
    }

    return (
      <View style={styles.infoRow}>
        {/* <Typography style={styles.infoLabel} type={Font?.Poppins_SemiBold}>
          {label}
        </Typography> */}
        <Typography style={styles.infoValue} type={Font?.Poppins_Regular}>
          {value}
        </Typography>
      </View>
    );
  };

  const getTemples = id => {
    GET(
      `festival-detail/${id}`,
      success => {
        setData(success?.data);
        setUpcoming_festivals(success?.upcoming_festivals);
      },
      error => console.log(error),
      fail => console.log(fail),
    );
  };

  const Create_Notification = () => {
    // let error = {
    //   drop: validators?.checkRequire(
    //     'Before Days',
    //     Modaldata?.selectDay?.label,
    //   ),
    // };
    // setError(error);
    // beforeEkadashi
    // if (isValidForm(error)) {
      let body = new FormData();
      let firstDate = data?.date?.split(',')[0].trim();
      const selectDate = onEkadashi
        ? data?.date // all dates
        : firstDate;

      console.log('Modaldata?.selectDay---', Modaldata?.selectDay?.label);

      body.append('festival_id', data?.id);
      body.append('festival_date', selectDate);
      body.append('before_days', Modaldata?.selectDay?.label?.split(' ')[0]);
      body.append('is_recurring', onEkadashi == true ? 1 : 0);
      console.log('data----', body);

      const newBody = {
        festival_id: data?.id,
        festival_date: selectDate,
        before_days: Modaldata?.selectDay?.label,
        is_recurring: onEkadashi == true ? 1 : 0,
      };

      // return;
      POST_FORM_DATA(
        'create-reminders',
        body,
        success => {
          console.log('success---success---', success);

          SimpleToast?.show(success?.message || 'Reminder created successfully');
          setVisible(false);
          setIsReminderSet(true);
          
          // Refresh the festival data
          if (data?.id) {
            getTemples(data.id);
          }
        },
        error => {
          console.log('error---error--', error);
        },
        fail => {
          console.log('---fail----', fail);
        },
      );
    // }
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      {/* Header with Image */}
      <ImageBackground
        source={{ uri: data?.image }}
        style={{ height: 285 + STATUSBAR_HEIGHT, width: '100%', paddingTop: STATUSBAR_HEIGHT }}
      >
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <HeaderForUser
            source_arrow={ImageConstant?.BackArrow}
            style_backarrow={{
              borderWidth: 1,
              padding: 20,
              borderColor: '#F53800',
              tintColor: '#F53800',
              borderRadius: 10,
            }}
            onPressLeftIcon={() => navigation?.goBack()}
          />
        </View>
      </ImageBackground>

      {/* Festival Info Section */}
      <View style={styles.panchangSection}>
        {/* Title */}
        <Typography
          style={styles.panchangTitle}
          type={Font?.Poppins_SemiBold}
        >
          {data?.festival_desc?.name}
        </Typography>

        {/* Date and Reminder Row */}
        <View style={styles.dateReminderRow}>
          <View style={styles.dateBadge}>
            <Image
              source={ImageConstant?.cal}
              style={styles.calendarIcon}
            />
            <Typography size={13} color="#F53800" type={Font?.Poppins_Medium}>
              {route?.params?.data?.date ? moment(route?.params?.data?.date)
                ?.locale(localization?.getLanguage())
                ?.format('DD MMMM YYYY, dddd') : ''}
            </Typography>
          </View>

          <TouchableOpacity
            style={[
              styles.reminderButton,
              isReminderSet && styles.reminderButtonActive
            ]}
            onPress={() => {
              if (isReminderSet) {
                SimpleToast.show('Reminder is already enabled for this festival');
              } else {
                setVisible(true);
              }
            }}
          >
            <Image
              source={ImageConstant?.reminder}
              style={styles.reminderBtnIcon}
            />
            <Typography color={'#fff'} size={12} type={Font?.Poppins_Medium}>
              {isReminderSet
                ? localization?.HomeDetails?.reminderEnabled || 'REMINDER ENABLED'
                : localization?.HomeDetails?.reminderMe}
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Regional Names */}
        {data?.festival_desc?.regional_names && (
          <View style={styles.infoChip}>
            <Typography size={13} color="#666" type={Font?.Poppins_Regular}>
              Also known as: {data?.festival_desc?.regional_names}
            </Typography>
          </View>
        )}

        {/* States Celebrated */}
        {data?.festival_desc?.states_celebrated && (
          <View style={styles.infoChip}>
            <Typography size={13} color="#666" type={Font?.Poppins_Regular}>
              Celebrated in: {data?.festival_desc?.states_celebrated}
            </Typography>
          </View>
        )}

        {/* Description */}
        {data?.festival_desc?.description && (
          <Typography
            style={styles.descriptionText}
            type={Font?.Poppins_Regular}
          >
            {data?.festival_desc?.description}
          </Typography>
        )}
      </View>

      {/* <View style={styles.separator} /> */}

      {/* Temple Section */}
      {/* {data?.temples?.length > 0 && (
        <View style={styles.sectionBox}>
          <Typography style={styles.sectionTitle} type={Font?.Poppins_Bold}>
            {localization?.Temple?.Temple}
          </Typography>
          <FlatList
            horizontal
            data={data?.temples}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => Share.share({ message: item?.temple?.url })}
                style={styles.templeCard}
              >
                <View style={styles.templeImageBox}>
                  <Image
                    source={{ uri: item?.temple?.image }}
                    style={styles.templeImage}
                  />
                </View>
                <Typography
                  style={styles.templeName}
                  type={Font?.Poppins_Regular}
                >
                  {item?.temple?.temple_desc?.name}
                </Typography>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )} */}

      {/* <View style={styles.separator} /> */}

      {/* Panchang Details */}
      {/* <View style={styles.sectionBox}>
        <Typography style={styles.sectionTitle} type={Font?.Poppins_Bold}>
          {localization?.HomeDetails?.panchangTitle}
        </Typography>

        <View style={styles.rowBetween}>
          <Typography>
            {localization?.HomeDetails?.panchangFor} {data?.festival_desc?.name}
          </Typography>
          <Typography
            color={'#F53800'}
            size={16}
            type={Font?.Poppins_Medium}
            onPress={() => {
              // setVisible(true)
            }}
          >
            <Image
              source={ImageConstant?.reminder}
              style={styles.reminderIcon}
            />{' '}
            {localization?.HomeDetails?.reminderMe}
          </Typography>
        </View>

        
         {[
           {
             day: 'SUN',
             date: '06 Jul',
             event: 'Ekadashi',
             Timeline: 'upto 09:15 PM on 6th',
           },
           {
             day: 'MON',
             date: '07 Jul',
             event: 'Dwadashi',
             Timeline: 'upto 09:15 PM on 6th',
           },
         ].map((date, index) => (
          <View key={index} style={styles.panchangCard}>
            <View style={styles.panchangDayBox}>
              <Typography
                type={Font?.Poppins_SemiBold}
                size={13}
                color="#FFFFFF"
                textAlign="center"
              >
                {date?.day} {'   '}
                {date?.date}
              </Typography>
            </View>
            <View style={styles.rowBetweenWide}>
              <View>
                <Typography
                  style={{ fontSize: 17, left: 10 }}
                  type={Font?.Poppins_SemiBold}
                >
                  {date?.event}
                </Typography>
                <Typography
                  style={{ fontSize: 14, left: 10 }}
                  type={Font?.Poppins_Regular}
                >
                  {date?.Timeline}
                </Typography>
              </View>
              <Image
                source={ImageConstant?.rightarrow}
                style={styles.rightArrow}
              />
            </View>
          </View>
        ))}
      </View> */}

      {/* Festival Highlights Section */}
      {(data?.festival_desc?.duration ||
        data?.festival_desc?.daily_significance ||
        data?.festival_desc?.history ||
        data?.festival_desc?.temples_to_visit ||
        data?.festival_desc?.other_info ||
        data?.duration ||
        data?.daily_significance ||
        data?.history ||
        data?.temples_to_visit ||
        data?.other_info) && (
        <View style={styles.highlightsSection}>
          <Typography
            style={styles.sectionTitle}
            type={Font?.Poppins_Bold}
          >
            {localization?.HomeDetails?.festivalHighlights || 'Festival Highlights'}
          </Typography>

          <View style={styles.highlightsCard}>
            {(data?.festival_desc?.duration || data?.duration) && (
              <View style={styles.highlightItem}>
                <Typography style={styles.highlightText} type={Font?.Poppins_Regular}>
                  {data?.festival_desc?.duration || data?.duration}
                </Typography>
              </View>
            )}

            {(data?.festival_desc?.history || data?.history) && (
              <View style={styles.highlightItem}>
                <Typography style={styles.highlightText} type={Font?.Poppins_Regular}>
                  {data?.festival_desc?.history || data?.history}
                </Typography>
              </View>
            )}

            {(data?.festival_desc?.daily_significance || data?.daily_significance) && (
              <View style={styles.highlightItem}>
                <Typography style={styles.highlightText} type={Font?.Poppins_Regular}>
                  {data?.festival_desc?.daily_significance || data?.daily_significance}
                </Typography>
              </View>
            )}

            {(data?.festival_desc?.temples_to_visit || data?.temples_to_visit) && (
              <View style={styles.highlightItem}>
                <Typography style={styles.highlightText} type={Font?.Poppins_Regular}>
                  {data?.festival_desc?.temples_to_visit || data?.temples_to_visit}
                </Typography>
              </View>
            )}

            {(data?.festival_desc?.other_info || data?.other_info) && (
              <View style={[styles.highlightItem, { borderBottomWidth: 0 }]}>
                <Typography style={styles.highlightText} type={Font?.Poppins_Regular}>
                  {data?.festival_desc?.other_info || data?.other_info}
                </Typography>
              </View>
            )}
          </View>
        </View>
      )}

      {/* FAQs Section */}
      {data?.faqs?.length > 0 && (
        <View style={styles.faqSection}>
          <Typography style={styles.sectionTitle} type={Font?.Poppins_Bold}>
            Frequently Asked Questions
          </Typography>
          {data?.faqs?.map((item, index) => (
            <View key={index} style={styles.faqCard}>
              <TouchableOpacity
                onPress={() => toggleAnswer(index)}
                style={styles.faqQuestion}
              >
                <Typography
                  type={Font?.Poppins_Medium}
                  style={styles.faqQuestionText}
                >
                  {item.faq_desc?.question}
                </Typography>
                <View style={styles.faqToggleIcon}>
                  <Typography
                    type={Font?.Poppins_SemiBold}
                    style={styles.faqToggleText}
                    color={activeIndex === index ? '#F53800' : '#333'}
                  >
                    {activeIndex === index ? '−' : '+'}
                  </Typography>
                </View>
              </TouchableOpacity>
              {activeIndex === index && (
                <Typography
                  type={Font?.Poppins_Regular}
                  style={styles.faqAnswer}
                >
                  {item?.faq_desc?.answer}
                </Typography>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Upcoming Festivals */}
      {data?.date
        ?.split(',')
        .filter(i => i !== route?.params?.data?.date)
        .map(d => d.trim())
        .filter(Boolean)?.length > 0 && (
        <View style={styles.sectionBox}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Typography style={styles.sectionTitle} type={Font?.Poppins_Bold}>
              {localization?.HomeDetails?.upcomingFestivals}
            </Typography>
          </View>

          {data?.date
            ?.split(',')
            .filter(i => i !== route?.params?.data?.date)
            .map(d => d.trim())
            .filter(Boolean)
            .map((item, index) => (
              <TouchableOpacity key={index} style={styles.upcomingCard}>
                <View style={styles.upcomingIconBox}>
                  <Image
                    source={ImageConstant?.cal}
                    style={styles.upcomingIcon}
                  />
                </View>
                <View style={styles.rowBetweenWide}>
                  <Typography
                    style={{ left: 10, right: 10, width: '90%' }}
                    size={17}
                    type={Font?.Poppins_Regular}
                  >
                    {moment(item)
                      ?.locale(localization?.getLanguage())
                      ?.format('DD MMMM YYYY, dddd')}
                  </Typography>
                  <Image
                    source={ImageConstant?.rightarrow}
                    style={styles.rightArrow}
                  />
                </View>
              </TouchableOpacity>
            ))}
        </View>
      )}

      {data?.festival_desc?.long_description && (
        <View style={styles.sectionBox}>
          <Typography style={styles.sectionTitle} type={Font?.Poppins_Bold}>
            {localization?.HomeDetails?.aboutFestival}
          </Typography>
          <Typography style={styles.aboutText} type={Font?.Poppins_Regular}>
            {data?.festival_desc?.long_description}
          </Typography>
        </View>
      )}

      <View style={{ height: 20, width: '100%' }} />

      {/* Reminder Bottom Sheet */}
      <CustomBottomSheet visible={visible} onClose={() => setVisible(false)}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 100,
          }}
        >
          <Image
            source={ImageConstant?.botmreme}
            style={styles.reminderSheetIcon}
          />
        </View>

        <Typography style={styles.title} type={Font?.Poppins_Bold}>
          {localization?.HomeDetails?.setReminder}
        </Typography>
        <Typography style={styles.reminderDesc} type={Font?.Poppins_Regular}>
          {localization?.HomeDetails?.reminderDesc}

          {/* {`${localization?.HomeDetails?.startPhrase} ${new Date(
            data?.created_at,
          ).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
          })} ${localization?.HomeDetails?.endPhrase}`} */}
        </Typography>
        {/* Before Ekadashi Option */}
        <View style={styles.row}>
          {/* <TouchableOpacity onPress={() => setBeforeEkadashi(!beforeEkadashi)}>
            <Image
              source={
                beforeEkadashi
                  ? ImageConstant?.checked
                  : ImageConstant?.unchecked
              }
              style={styles.checkbox}
            />
          </TouchableOpacity> */}
          <View style={[styles.halfWidth, {}]}>
            <DropdownComponent
              placeholder="Select days"
              style_dropdown={{ paddingLeft: 15 }}
              MainBoxStyle={{ width: '100%', marginLeft: 'auto' }}
              onChange={v => seModaltData({ ...Modaldata, selectDay: v })}
              value={Modaldata?.selectDay}
              data={[
                { label: '1 Day', value: '1_day' },
                { label: '2 Day', value: '2_day' },
                { label: '3 Day', value: '3_day' },
              ]}
            />
          </View>
          <Typography
            type={Font?.Poppins_Medium}
            size={16}
            style={{ marginLeft: 10 }}
          >
            {localization?.HomeDetails?.beforeEkadashi}{' '}
            {data?.festival_desc?.name}
          </Typography>
        </View>

        {/* On Ekadashi Option */}
        {route?.params?.data?.is_multiple_festival == 1 && (
          <View
            style={[
              styles.row,
              { marginTop: 20, justifyContent: 'flex-start' },
            ]}
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
              {localization?.HomeDetails?.onEkadashi}{' '}
              {data?.festival_desc?.name}
            </Typography>
          </View>
        )}

        {/* Buttons */}
        <View
          style={[
            styles.row,
            { marginTop: 30, justifyContent: 'space-between' },
          ]}
        >
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
                Create_Notification();
              }}
              linerColor={['#592009', '#592009']}
              title={localization?.HomeDetails?.confirm}
              title_style={{ color: '#fff' }}
            />
          </View>
        </View>
      </CustomBottomSheet>
    </ScrollView>
  );
};

export default HomeDeatils;

const styles = StyleSheet.create({
  panchangSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingBottom: 24,
  },
  panchangTitle: {
    color: '#000',
    fontSize: 26,
    marginBottom: 12,
  },
  dateReminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 10,
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE0D0',
  },
  calendarIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    tintColor: '#F53800',
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F53800',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  reminderButtonActive: {
    backgroundColor: '#4CAF50',
  },
  reminderBtnIcon: {
    width: 14,
    height: 14,
    tintColor: '#fff',
    marginRight: 6,
  },
  infoChip: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  descriptionText: {
    color: '#444444',
    fontSize: 15,
    lineHeight: 24,
    marginTop: 8,
    textAlign: 'justify',
  },
  separator: { backgroundColor: '#F5F5F5', height: 8, width: '100%' },
  sectionBox: { backgroundColor: '#FFFFFF', padding: 20 },
  sectionTitle: { fontSize: 20, marginBottom: 16, color: '#000' },
  highlightsSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  highlightsCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    overflow: 'hidden',
  },
  highlightItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  highlightText: {
    color: '#444444',
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'justify',
  },
  templeCard: { alignItems: 'center', width: 130, marginTop: 10 },
  templeImageBox: {
    borderWidth: 1,
    borderColor: '#FFD2A4',
    padding: 5,
    borderRadius: 20,
  },
  templeImage: { width: 110, height: 112, borderRadius: 12 },
  templeName: { fontSize: 14, marginTop: 5, textAlign: 'center' },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowBetweenWide: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
  },
  reminderIcon: { width: 15, height: 15, tintColor: '#F53800', top: 10 },
  panchangCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 10,
    marginTop: 10,
    height: 70,
  },
  panchangDayBox: {
    backgroundColor: '#F53800',
    width: 55,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightArrow: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    tintColor: '#F53800',
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444444',
    textAlign: 'justify',
  },
  faqSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  faqCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestionText: {
    fontSize: 15,
    flex: 1,
    paddingRight: 10,
    color: '#333',
  },
  faqToggleIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  faqToggleText: {
    fontSize: 18,
    lineHeight: 22,
  },
  faqAnswer: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
    lineHeight: 22,
  },
  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 10,
    marginTop: 10,
    overflow: 'hidden',
  },
  upcomingIconBox: {
    backgroundColor: '#F53800',
    width: 55,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upcomingIcon: { width: 20, height: 20, resizeMode: 'contain' },
  reminderGradient: { padding: 20, borderRadius: 40 },
  reminderSheetIcon: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  title: { fontSize: 18, textAlign: 'center', marginBottom: 8 },
  reminderDesc: { fontSize: 14, textAlign: 'center', marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  halfWidth: { width: '47%' },
  checkbox: { width: 22, height: 22, marginRight: 10 },
  cancelBtn: { borderWidth: 1, borderRadius: 10, borderColor: '#592009' },
  infoRow: {
    marginTop: 12,
    marginRight: 3,
  },
  infoLabel: {
    color: '#592009',
    // marginBottom: 4,
    fontSize: 16,
    //  textAlign: 'left',
    textAlign: 'justify',
  },
  infoValue: {
    color: '#444444',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'justify',
  },
});