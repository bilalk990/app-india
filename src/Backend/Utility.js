import moment from 'moment';
import { Alert, Dimensions, Platform } from 'react-native';
import localization from '../Constants/localization';
export const RFV = e => {
  return e;
};
export const regex = {
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  phoneNumber: /^(0|[1-9][0-9]*)$/,
};
export const DefaultToast = title => {
  return Toast.show(title, Toast.SHORT);
};
export const formatError = obj => {
  let errorsData = {};
  for (const field in obj) {
    if (Object.hasOwnProperty.call(obj, field)) {
      errorsData[field] = '';
    }
  }
  return errorsData;
};
export const parseValues = data => {
  let parsedData = {};
  for (const field in data) {
    if (Object.hasOwnProperty.call(data, field)) {
      const value = data[field].value;
      parsedData[field] = value;
    }
  }
  return parsedData;
};
export const isValidEmail = email => regex.email.test(email);
export const isValidPassword = email => regex.email.test(email);
export const isValidPhone = phone => regex.phoneNumber.test(phone);

export const isValidValue = ({
  value = '',
  required = true,
  type = '',
  minimum = 0,
  maximum = 1000,
}) => {
  if (required) {
    if (!value) {
      return 'Please Enter Some Value';
    } else if (type === 'email') {
      return !isValidEmail(value) ? 'Please Enter Valid Email!' : '';
    } else if (type === 'phone') {
      return !isValidPhone(value) ? 'Please Enter Valid Phone Number!' : '';
    } else if (value.length < minimum) {
      return `Minimum length should be ${minimum}`;
    } else if (value.length > maximum) {
      return `Maximum length should be ${maximum}`;
    } else {
      return '';
    }
  } else {
    return '';
  }
};
export const isValidForm = (form = {}) => {
  let valid = true;
  for (const field in form) {
    if (Object.hasOwnProperty.call(form, field)) {
      const error = form[field];
      valid = valid && !error;
    }
  }
  return valid;
};
export function getRegionForCoordinates(points) {
  let minX, maxX, minY, maxY;
  (point => {
    minX = point.latitude;
    maxX = point.latitude;
    minY = point.longitude;
    maxY = point.longitude;
  })(points[0]);
  points.map(point => {
    minX = Math.min(minX, point.latitude);
    maxX = Math.max(maxX, point.latitude);
    minY = Math.min(minY, point.longitude);
    maxY = Math.max(maxY, point.longitude);
  });
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;
  const deltaX = maxX - minX;
  const deltaY = maxY - minY;
  return {
    latitude: +midX,
    longitude: +midY,
    latitudeDelta: +deltaX,
    longitudeDelta: +deltaY,
  };
}
export const isIos = Platform.OS === 'ios';

export const injectedJavaScript = `
const meta = document.createElement('meta');
meta.setAttribute('name', 'viewport');
meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
document.getElementsByTagName('head')[0].appendChild(meta);

document.addEventListener('touchstart', function(event) {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}, { passive: false });

document.addEventListener('gesturestart', function(event) {
  event.preventDefault();
});

true; // note: this is needed to return a true value, preventing issues in WebView
`;



export const getGreeting = (sunrise, sunset) => {
  const now = moment();
  const sunriseTime = moment(sunrise, "hh:mm A");
  const sunsetTime = moment(sunset, "hh:mm A");

  if (now.isBefore(sunriseTime)) {
    return localization?.Home?.night; // before sunrise
  } else if (now.isBetween(sunriseTime, moment(sunriseTime).add(6, "hours"))) {
    return localization?.Home?.morning;
  } else if (now.isBetween(moment(sunriseTime).add(6, "hours"), sunsetTime)) {
    return localization?.Home?.afternoon;
  } else if (now.isBetween(sunsetTime, moment(sunsetTime).add(3, "hours"))) {
    return localization?.Home?.evening;
  } else {
    return localization?.Home?.night;
  }
};

