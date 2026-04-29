import api from './api';
import { flushAlerts, queueAlert } from './offlineQueueService';

export const sendAlert = async (data) => {
  return await api.post('/alert/send', data);
};

export const sendAlertWithQueue = async (payload) => {
  try {
    const response = await sendAlert(payload);
    return {
      queued: false,
      response
    };
  } catch (err) {
    await queueAlert(payload);
    return {
      queued: true,
      error: err
    };
  }
};

export const retryQueuedAlerts = async () => {
  return flushAlerts(sendAlert);
};