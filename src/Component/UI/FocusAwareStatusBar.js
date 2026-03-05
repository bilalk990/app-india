import * as React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';

export const FocusAwareStatusBar = React.memo(
  ({
    backgroundColor = 'transparent',
    translucent = true,
    barStyle = 'light-content',
    ...props
  }) => {
    const isFocused = useIsFocused();

    if (!isFocused) return null;

    return (
      <StatusBar
        translucent={translucent}
        animated={true}
        barStyle={barStyle}
        backgroundColor={backgroundColor}
        {...props}
      />
    );
  },
);
