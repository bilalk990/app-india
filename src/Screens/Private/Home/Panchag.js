import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';

const STATUSBAR_HEIGHT = StatusBar.currentHeight || 0;
import HeaderForUser from '../../../Component/HeaderForUser';
import { ImageConstant } from '../../../Constants/ImageConstant';
import Typography from '../../../Component/UI/Typography';
import { Font } from '../../../Constants/Font';
import HorizontalCalendar from './HorizontalCalendar';

const Panchang = ({ navigation }) => {
  return (
    <ScrollView style={[styles.container, { paddingTop: STATUSBAR_HEIGHT }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <HeaderForUser
        source_arrow={ImageConstant?.BackArrow}
        style_backarrow={{
          borderWidth: 1,
          padding: 20,
          borderColor: '#575957',
          tintColor: '#575957',
          borderRadius: 10,
        }}
        onPressLeftIcon={() => {
          navigation?.goBack();
        }}
      />
      <View style={[styles.profileContainer, { marginBottom: 20 }]}>
        <Typography style={styles.profileName} type={Font?.Manrope_Regular}>
          Panchang
        </Typography>
        <Typography color="" type={Font?.Manrope_Regular}>
          For 6 july 2025, Wednesday
        </Typography>
      </View>
     <HorizontalCalendar/>
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          padding: 20,
          borderWidth: 1,
          borderColor: '#E8E8E8',
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography size={20} type={Font?.Poppins_SemiBold}>
            Tithi
          </Typography>
          <Typography size={16} type={Font?.Poppins_Medium} color="#F53800">
            WHAT IS THIS?{' '}
            <Image
              source={ImageConstant?.rightarrow}
              style={{ width: 20, height: 13 }}
            />
          </Typography>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
          }}
        >
          <View>
            <Typography size={16} type={Font?.Poppins_SemiBold}>
              Dwadashi
            </Typography>
            <Typography color="#808080" size={14} type={Font?.Poppins_Regular}>
              upto 11:10 PM on 7th
            </Typography>
          </View>
          <View>
            <Typography size={16} type={Font?.Poppins_SemiBold}>
              Trayodashi
            </Typography>
            <Typography color="#808080" size={14} type={Font?.Poppins_Regular}>
              upto 11:10 PM on 7th
            </Typography>
          </View>
        </View>
      </View>

      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          padding: 20,
          borderWidth: 1,
          borderColor: '#E8E8E8',
          marginTop: 10,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography size={20} type={Font?.Poppins_SemiBold}>
            Sun & Moon Timings
          </Typography>
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            marginTop: 10,
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Typography size={16} type={Font?.Poppins_SemiBold}>
              Sun{'  '}
            </Typography>
            <Typography color="#808080" size={14} type={Font?.Poppins_Regular}>
              🌞 05:50 am 🌞 07:12 pm
            </Typography>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Typography size={16} type={Font?.Poppins_SemiBold}>
              Trayodashi{'  '}
            </Typography>
            <Typography color="#808080" size={14} type={Font?.Poppins_Regular}>
              🌙 04:20 pm 🌙 03:24 am
            </Typography>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          padding: 20,
          borderWidth: 1,
          borderColor: '#E8E8E8',
          marginTop: 10,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography size={20} type={Font?.Poppins_SemiBold}>
            More About...
          </Typography>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Typography size={16} type={Font?.Poppins_Medium} color="#F53800">
              WHAT IS THIS?
            </Typography>
            <Image
              source={ImageConstant?.rightarrow}
              style={{ width: 20, height: 13, marginLeft: 5 }}
            />
          </TouchableOpacity>
        </View>

        {/* Two info rows with moon icons */}
        <View style={{ marginTop: 15 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
              backgroundColor: '#F2DEC8',
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 20, marginRight: 8 }}>🌙</Text>
            <Typography size={14} type={Font?.Poppins_Regular}>
              <Text style={{ fontWeight: 'bold' }}>Krishna</Text> Paksh,{' '}
              <Text style={{ fontWeight: 'bold' }}>Shravana</Text> Maas 2082
              {'\n'}
              Kalayukti, Vikram Samvat
            </Typography>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#F2DEC8',
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 20, marginRight: 8 }}>🌙</Text>
            <Typography size={14} type={Font?.Poppins_Regular}>
              <Text style={{ fontWeight: 'bold' }}>Uttara Ashadha</Text>{' '}
              Nakshatra{'\n'}
              upto 06:34 am on 12th
            </Typography>
          </View>
        </View>

        {/* Horizontal data columns */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginTop: 15,
          }}
        >
          <View style={{ width: '48%', marginBottom: 10 }}>
            <Typography type={Font?.Poppins_Medium} color="#686868">
              AYANA
            </Typography>
            <Typography color="#000" type={Font?.Poppins_SemiBold}>
              Uttarayan
            </Typography>
          </View>
          <View style={{ width: '48%', marginBottom: 10 }}>
            <Typography type={Font?.Poppins_Medium} color="#686868">
              RITU
            </Typography>
            <Typography color="#000" type={Font?.Poppins_SemiBold}>
              Varsha (Monsoon)
            </Typography>
          </View>
          <View style={{ width: '48%', marginBottom: 10 }}>
            <Typography type={Font?.Poppins_Medium} color="#686868">
              VAR
            </Typography>
            <Typography color="#000" type={Font?.Poppins_SemiBold}>
              Shukravar
            </Typography>
          </View>
          <View style={{ width: '48%', marginBottom: 10 }}>
            <Typography type={Font?.Poppins_Medium} color="#686868">
              YOG
            </Typography>
            <Typography color="#000" type={Font?.Poppins_SemiBold}>
              Vaidhriti upto 08:41 pm today{'\n'}
              Vishkambha upto 07:28 pm on 12th
            </Typography>
          </View>
          <View style={{ width: '100%', marginBottom: 10 }}>
            <Typography type={Font?.Poppins_Medium}>KARAN</Typography>
            <Typography color="#000" type={Font?.Poppins_SemiBold}>
              Balava upto 02:11 pm today{'\n'}
              Kaulava upto 02:09 am on 12th{'\n'}
              Taitila upto 02:00 pm on 12th
            </Typography>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          padding: 20,
          borderWidth: 1,
          borderColor: '#E8E8E8',
          marginTop: 10,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography size={20} type={Font?.Poppins_SemiBold}>
            Muhurat Today
          </Typography>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Typography size={16} type={Font?.Poppins_Medium} color="#F53800">
              WHAT IS THIS?
            </Typography>
            <Image
              source={ImageConstant?.rightarrow}
              style={{ width: 20, height: 13, marginLeft: 5 }}
            />
          </TouchableOpacity>
        </View>

        {/* Subheading */}
        <Typography
          style={{ marginTop: 10 }}
          size={16}
          type={Font?.Poppins_Medium}
        >
          Good and Bad Muhurat
        </Typography>

        {/* List */}
        <View style={{ marginTop: 15 }}>
          {/* Item 1 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <View>
              <Typography type={Font?.Poppins_SemiBold} color="#C02C03">
                ABHIJIT MUHURAT
              </Typography>
              <Typography
                size={14}
                type={Font?.Poppins_Regular}
                color="#808080"
              >
                Ended 2 hours ago at 12:59 PM
              </Typography>
            </View>
          </View>

          {/* Item 2 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <View>
              <Typography type={Font?.Poppins_SemiBold} color="#F53800">
                AMRIT KAL
              </Typography>
              <Typography
                size={14}
                type={Font?.Poppins_Regular}
                color="#808080"
              >
                Starts in 8 hours at 12:00 AM
              </Typography>
            </View>
            <Image
              source={ImageConstant?.bellFilled}
              style={{ width: 20, height: 20 }}
            />
          </View>

          {/* Item 3 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <View>
              <Typography type={Font?.Poppins_SemiBold} color="#404040">
                GULIKA KAL
              </Typography>
              <Typography
                size={14}
                type={Font?.Poppins_Regular}
                color="#808080"
              >
                Ended 6 hours ago at 09:12 AM
              </Typography>
            </View>
          </View>

          {/* Item 4 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <View>
              <Typography type={Font?.Poppins_SemiBold} color="#404040">
                RAHU KAL
              </Typography>
              <Typography
                size={14}
                type={Font?.Poppins_Regular}
                color="#808080"
              >
                Ended 2 hours ago at 12:32 PM
              </Typography>
            </View>
          </View>

          {/* Item 5 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View>
              <Typography type={Font?.Poppins_SemiBold} color="#404040">
                YAMAGANDA KAL
              </Typography>
              <Typography
                size={14}
                type={Font?.Poppins_Regular}
                color="#808080"
              >
                Starts in 21 minutes at 03:52
              </Typography>
            </View>
            <Image
              source={ImageConstant?.bellOutline}
              style={{ width: 20, height: 20 }}
            />
          </View>
        </View>
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

export default Panchang;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBF6',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  profileContainer: {
    marginTop: 20,
  },
  profileName: {
    color: '#000',
    fontSize: 40,
  },
});
