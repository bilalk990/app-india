import { navigate } from '../Constants/NavigationConstant';

export const notificationOpen = async notification => {
  console.log('[NotificationOpen] notification:', notification);

  try {
    // Extract data from different notification formats
    const data = notification?.data || notification?.notification?.data || {};
    const notificationType = data?.type || data?.notification_type;
    const festivalId = data?.festival_id;
    const festivalDate = data?.festival_date;

    // Navigate based on notification type
    if (festivalId) {
      // Festival reminder notification - navigate to festival details
      // Pass data in the format HomeDeatils expects
      navigate('HomeDeatilsNew', {
        data: {
          id: festivalId,
          date: festivalDate || new Date().toISOString().split('T')[0],
        },
        fromNotification: true
      });
    } else if (notificationType === 'reminder') {
      // General reminder - go to reminders list
      navigate('Reminders');
    } else if (notificationType === 'panchang' || notificationType === 'daily_panchang') {
      // Daily panchang notification
      navigate('Panchag');
    } else {
      // Default: go to notification list
      navigate('NotificationList');
    }
  } catch (error) {
    console.error('[NotificationOpen] Error handling notification:', error);
  }
};
