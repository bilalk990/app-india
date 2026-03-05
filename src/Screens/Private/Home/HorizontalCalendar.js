import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import moment from 'moment';
import Typography from '../../../Component/UI/Typography';

const HorizontalCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));

  const generateDates = () => {
    const dates = [];
    for (let i = -3; i <= 10; i++) {
      const date = moment().add(i, 'days');
      dates.push({
        fullDate: date.format('YYYY-MM-DD'),
        dateNum: date.format('D'),
        day: date.format('ddd').toUpperCase(),
      });
    }
    return dates;
  };

  const calendarData = generateDates();

  return (
    <FlatList
      horizontal
      data={calendarData}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      keyExtractor={(item) => item.fullDate}
      renderItem={({ item }) => {
        const isSelected = item.fullDate === selectedDate;

        return (
          <TouchableOpacity
            style={[styles.dateContainer, isSelected && styles.selectedDate]}
            onPress={() => setSelectedDate(item.fullDate)}
          >
            <Typography style={[styles.day, isSelected && styles.selectedText]}>
              {item.day}
            </Typography>
            <Typography style={[styles.dateNum, isSelected && styles.selectedTypography]}>
              {item.dateNum}
            </Typography>
          </TouchableOpacity>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: 10,
    paddingVertical: 10,
  },
  dateContainer: {
    width: 80,
    height: 90,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 5,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth:1,
    borderColor:"#6B779A1A"
  },
  selectedDate: {
    backgroundColor: '#F53800',
  },
  day: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'Poppins-SemiBold',
  },
  dateNum: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
    fontFamily: 'Poppins-SemiBold',
  },
  selectedText: {
    color: '#fff',
  },
});

export default HorizontalCalendar;
