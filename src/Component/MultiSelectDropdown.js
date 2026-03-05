import {StyleSheet, View, Image, TouchableOpacity, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {ImageConstant} from '../Constants/ImageConstant';
import {Colors} from '../Constants/Colors';
import Typography from './UI/Typography';
import {Font} from '../Constants/Font';

const MultiSelectDropdown = ({
  title,
  source,
  style_img,
  style_title,
  style_dropdown,
  data,
  selectedValues = [],
  onChange = () => {},
  containerStyle = {},
  MainBoxStyle = {},
  iconColor,
  disable,
  width = '80%',
  marginHorizontal = 20,
  size = 52,
  error,
  placeholder = '',
  leftIcons = ImageConstant.BackArrow,
  leftIconsShow = false,
  selectedTextStyleNew = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSelection = item => {
    const isSelected = selectedValues.some(selected => selected.value === item.value);
    let newSelection;
    
    if (isSelected) {
      // Remove from selection
      newSelection = selectedValues.filter(selected => selected.value !== item.value);
    } else {
      // Add to selection
      newSelection = [...selectedValues, item];
    }
    
    onChange(newSelection);
  };

  const removeSelection = item => {
    const newSelection = selectedValues.filter(selected => selected.value !== item.value);
    onChange(newSelection);
  };

  const renderItem = (item, index) => {
    const isSelected = selectedValues.some(selected => selected.value === item.value);
    
    return (
      <>
        <TouchableOpacity
          onPress={() => toggleSelection(item)}
          style={{
            flexDirection: 'row',
            height: 50,
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            paddingHorizontal: 20,
          }}>
          <Typography style={{width: width}} type={Font.Poppins_SemiBold}>
            {item?.label}
          </Typography>
          <Image
            style={{height: 20, width: 20, marginStart: 20, resizeMode: 'contain'}}
            source={isSelected ? ImageConstant.checked : ImageConstant.unchecked}
          />
        </TouchableOpacity>
        {item?._index !== data?.length - 1 && (
          <View
            style={{
              height: 1.5,
              backgroundColor: Colors.lightgrey,
              marginHorizontal: 20,
            }}></View>
        )}
      </>
    );
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    if (selectedValues.length === 1) {
      return selectedValues[0].label;
    }
    return `${selectedValues.length} selected`;
  };

  return (
    <>
      <View style={[{marginHorizontal: marginHorizontal, marginVertical: 10}, MainBoxStyle]}>
        {title && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 10,
            }}>
            {source && <Image source={source} style={[styles.img_style, style_img]} />}
            <Typography style={[styles.txt_style, style_title]}>
              {title}
            </Typography>
          </View>
        )}

        <View style={[styles.dropdown, style_dropdown]}>
          {selectedValues.length > 0 ? (
            <View style={styles.selectedItemsWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.selectedItemsContainer}
                contentContainerStyle={styles.selectedItemsContent}>
                {selectedValues.map((item, index) => (
                  <View key={index} style={styles.chip}>
                    <Typography style={styles.chipText} type={Font.Poppins_Regular}>
                      {item.label}
                    </Typography>
                    <TouchableOpacity
                      onPress={() => removeSelection(item)}
                      style={styles.chipClose}>
                      <Typography style={styles.chipCloseText}>×</Typography>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          ) : (
            <View style={styles.placeholderWrapper}>
              <Typography
                style={[styles.placeholderText, selectedTextStyleNew]}
                type={Font.Poppins_Regular}>
                {placeholder}
              </Typography>
            </View>
          )}
          
          <Dropdown
            disable={disable}
            showsVerticalScrollIndicator={false}
            style={styles.dropdownInner}
            selectedTextStyle={[
              styles.selectedTextStyle,
              selectedTextStyleNew,
              {opacity: 0},
            ]}
            iconStyle={styles.iconStyle}
            placeholderStyle={[{color: 'transparent'}, {...selectedTextStyleNew}]}
            data={data}
            value={null}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={placeholder}
            iconColor={iconColor}
            onChange={() => {}}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
            renderRightIcon={() => {
              return (
                <View
                  style={{
                    height: size,
                    width: size,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    tintColor={iconColor}
                    source={ImageConstant.BackArrow}
                    style={{
                      height: 15,
                      width: 8,
                      resizeMode: 'contain',
                      tintColor: '#979797',
                      transform: [{rotate: isOpen ? '90deg' : '-90deg'}],
                    }}
                  />
                </View>
              );
            }}
            renderLeftIcon={() => {
              return (
                <>
                  {leftIconsShow && (
                    <View
                      style={{
                        height: size,
                        width: size,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        tintColor={iconColor}
                        source={leftIcons}
                        style={{
                          height: 20,
                          width: 20,
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  )}
                </>
              );
            }}
            renderItem={renderItem}
            containerStyle={[styles.containerStyle, containerStyle]}
          />
        </View>
      </View>
      {error && (
        <Typography
          textAlign={'right'}
          style={{
            color: 'red',
            fontSize: 12,
            marginStart: 5,
            marginTop: -5,
            marginBottom: 10,
          }}>
          {error}
        </Typography>
      )}
    </>
  );
};

export default MultiSelectDropdown;

const styles = StyleSheet.create({
  img_style: {
    height: 16,
    width: 16,
    marginLeft: 10,
  },
  txt_style: {
    color: Colors.black,
    fontSize: 15,
    fontWeight: '400',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginHorizontal: 10,
    height: 60,
    position: 'relative',
    overflow: 'hidden',
  },
  dropdownInner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  selectedItemsWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 50,
    bottom: 0,
    zIndex: 1,
    justifyContent: 'center',
  },
  selectedItemsContainer: {
    paddingHorizontal: 15,
  },
  selectedItemsContent: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  placeholderWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 50,
    bottom: 0,
    zIndex: 1,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  placeholderText: {
    color: 'gray',
  },
  placeholderStyle: {
    color: Colors.white,
  },
  inputSearchStyle: {
    borderWidth: 1,
  },
  iconStyle: {
    height: 24,
    width: 24,
    marginHorizontal: 10,
    marginVertical: 13,
  },
  selectedTextStyle: {
    color: Colors.black,
  },
  containerStyle: {
    borderRadius: 20,
    elevation: 2,
    borderWidth: 0,
    overflow: 'hidden',
    marginTop: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E41D54',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    marginRight: 6,
  },
  chipText: {
    color: '#fff',
    fontSize: 12,
    marginRight: 6,
  },
  chipClose: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipCloseText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 14,
  },
});

