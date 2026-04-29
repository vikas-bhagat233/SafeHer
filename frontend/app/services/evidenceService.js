import AsyncStorage from '@react-native-async-storage/async-storage';

const EVIDENCE_KEY = 'safeher.evidence.timeline.v1';

const readEvidence = async () => {
  const raw = await AsyncStorage.getItem(EVIDENCE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeEvidence = async (items) => {
  await AsyncStorage.setItem(EVIDENCE_KEY, JSON.stringify(items));
};

export const addEvidenceItem = async (item) => {
  const current = await readEvidence();
  const next = [
    {
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      created_at: new Date().toISOString(),
      status: 'saved_local',
      ...item
    },
    ...current
  ];

  await writeEvidence(next);
  return next[0];
};

export const getEvidenceByUser = async (userId) => {
  const items = await readEvidence();
  return items.filter((item) => String(item.user_id) === String(userId));
};
