import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Typography from './Typography';
import {Colors} from '../../Constants/Colors';

const EmptyView = ({title = 'No Data Found'}) => {
  return (
    <View
      style={{
        paddingVertical: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.border_blue,
      }}>
      <Typography textAlign={'center'} color={Colors.blue}>
        {title}
      </Typography>
    </View>
  );
};

export default EmptyView;

const styles = StyleSheet.create({});
