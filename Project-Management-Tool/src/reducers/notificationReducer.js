import {
  GET_NOTIFICATIONS,
  ADD_NOTIFICATION,
  MARK_NOTIFICATION_READ,
  MARK_ALL_NOTIFICATIONS_READ,
  CLEAR_NOTIFICATIONS
} from "../actions/types";

const initialState = {
  notifications: [],
  unreadCount: 0
};

// Load notifications from localStorage
const savedNotifications = localStorage.getItem('notifications');
if (savedNotifications) {
  const notifications = JSON.parse(savedNotifications);
  initialState.notifications = notifications;
  initialState.unreadCount = notifications.filter(n => !n.read).length;
}

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.read).length
      };
    
    case ADD_NOTIFICATION:
      const updatedNotifications = [action.payload, ...state.notifications];
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter(n => !n.read).length
      };
    
    case MARK_NOTIFICATION_READ:
      const markedNotifications = state.notifications.map(notification => {
        if (notification.id === action.payload) {
          return { ...notification, read: true };
        }
        return notification;
      });
      localStorage.setItem('notifications', JSON.stringify(markedNotifications));
      return {
        ...state,
        notifications: markedNotifications,
        unreadCount: markedNotifications.filter(n => !n.read).length
      };
    
    case MARK_ALL_NOTIFICATIONS_READ:
      const allReadNotifications = state.notifications.map(notification => ({
        ...notification, 
        read: true
      }));
      localStorage.setItem('notifications', JSON.stringify(allReadNotifications));
      return {
        ...state,
        notifications: allReadNotifications,
        unreadCount: 0
      };
    
    case CLEAR_NOTIFICATIONS:
      localStorage.setItem('notifications', JSON.stringify([]));
      return {
        ...state,
        notifications: [],
        unreadCount: 0
      };
    
    default:
      return state;
  }
} 