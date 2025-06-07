import {
  GET_NOTIFICATIONS,
  ADD_NOTIFICATION,
  MARK_NOTIFICATION_READ,
  MARK_ALL_NOTIFICATIONS_READ,
  CLEAR_NOTIFICATIONS
} from "./types";

// Get all notifications
export const getNotifications = () => dispatch => {
  const savedNotifications = localStorage.getItem('notifications');
  const notifications = savedNotifications ? JSON.parse(savedNotifications) : [];
  
  dispatch({
    type: GET_NOTIFICATIONS,
    payload: notifications
  });
};

// Add a new notification
export const addNotification = notification => dispatch => {
  // Generate a unique ID for the notification
  const id = Date.now();
  const newNotification = {
    ...notification,
    id,
    timestamp: new Date().toISOString(),
    read: false
  };

  dispatch({
    type: ADD_NOTIFICATION,
    payload: newNotification
  });

  // Return the created notification for further use if needed
  return newNotification;
};

// Mark a notification as read
export const markNotificationRead = id => dispatch => {
  dispatch({
    type: MARK_NOTIFICATION_READ,
    payload: id
  });
};

// Mark all notifications as read
export const markAllNotificationsRead = () => dispatch => {
  dispatch({
    type: MARK_ALL_NOTIFICATIONS_READ
  });
};

// Clear all notifications
export const clearNotifications = () => dispatch => {
  dispatch({
    type: CLEAR_NOTIFICATIONS
  });
};

// Create a task notification (helper function)
export const createTaskNotification = (taskSummary, projectIdentifier, ptSequence) => dispatch => {
  const notification = {
    type: 'task',
    title: 'New Task Assigned',
    message: `You have been assigned a new task: ${taskSummary}`,
    link: `/updateProjectTask/${projectIdentifier}/${ptSequence}`
  };
  
  return dispatch(addNotification(notification));
};

// Create a comment notification (helper function)
export const createCommentNotification = (username, taskSummary, projectIdentifier, ptSequence) => dispatch => {
  const notification = {
    type: 'comment',
    title: 'New Comment',
    message: `${username} commented on your task: ${taskSummary}`,
    link: `/updateProjectTask/${projectIdentifier}/${ptSequence}`
  };
  
  return dispatch(addNotification(notification));
};

// Create a project notification (helper function)
export const createProjectNotification = (projectName, projectIdentifier, daysRemaining) => dispatch => {
  const notification = {
    type: 'project',
    title: 'Project Due Soon',
    message: `Project "${projectName}" is due in ${daysRemaining} days`,
    link: `/projectBoard/${projectIdentifier}`
  };
  
  return dispatch(addNotification(notification));
}; 