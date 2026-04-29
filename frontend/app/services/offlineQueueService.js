import AsyncStorage from '@react-native-async-storage/async-storage';

const ALERT_QUEUE_KEY = 'safeher.alert.queue.v1';

const readQueue = async () => {
  const raw = await AsyncStorage.getItem(ALERT_QUEUE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeQueue = async (queue) => {
  await AsyncStorage.setItem(ALERT_QUEUE_KEY, JSON.stringify(queue));
};

export const queueAlert = async (payload) => {
  const queue = await readQueue();
  queue.push({
    payload,
    queued_at: new Date().toISOString(),
    attempts: 0
  });
  await writeQueue(queue);
};

export const flushAlerts = async (sendFn) => {
  const queue = await readQueue();
  if (queue.length === 0) {
    return { flushed: 0, remaining: 0 };
  }

  const remaining = [];
  let flushed = 0;

  for (const item of queue) {
    try {
      await sendFn(item.payload);
      flushed += 1;
    } catch {
      remaining.push({
        ...item,
        attempts: (item.attempts || 0) + 1
      });
    }
  }

  await writeQueue(remaining);
  return { flushed, remaining: remaining.length };
};

export const getQueuedAlertCount = async () => {
  const queue = await readQueue();
  return queue.length;
};
