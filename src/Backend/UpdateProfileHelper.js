/**
 * Update Profile API - Same pattern as SignUp.js
 * 
 * USAGE EXAMPLE (in your Profile/Edit Profile screen):
 * 
 * import { UPDATE_PROFILE } from '../../Backend/api_routes';
 * import { POST_FORM_DATA } from '../../Backend/Backend';
 * 
 * const updateProfile = () => {
 *   let formData = new FormData();
 *   formData.append('name', name);
 *   formData.append('email', email);
 *   formData.append('phone_prefix', '+91');
 *   formData.append('phone_country_code', 'in');
 *   formData.append('phone_number', mobile);
 *   formData.append('country', country?.value |P| country);
 *   formData.append('state', state?.value || state);
 *   formData.append('language', language?.value || language);
 *   formData.append('notify', notifyDays?.value || notifyDays);
 * 
 *   POST_FORM_DATA(
 *     UPDATE_PROFILE,
 *     formData,
 *     success => {
 *       if (success?.status == 'success') {
 *         console.log(success, 'Profile updated successfully');
 *         SimpleToast.show(success?.msg || 'Profile updated successfully');
 *         // Update user details in Redux if needed
 *         // dispatch(userDetails(success?.user));
 *       } else {
 *         // Handle validation errors
 *         let error = {
 *           email: success?.errors?.email?.[0]
 *         };
 *         setError(error);
 *       }
 *     },
 *     error => {
 *       console.log(error, 'ERROR Update Profile');
 *       SimpleToast.show(error?.msg || 'Failed to update profile');
 *     },
 *     fail => {
 *       console.log(fail, 'FAIL Update Profile');
 *       SimpleToast.show('Network error. Please try again.');
 *     },
 *   );
 * };
 */

// Export the route constant for direct use
export { UPDATE_PROFILE } from './api_routes';

