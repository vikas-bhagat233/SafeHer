import { Platform } from 'react-native';

const DEFAULT_ANDROID_EMULATOR_URL = 'http://10.0.2.2:3000/api';
const DEFAULT_LAN_URL = 'http://192.168.0.106:3000/api';

export const BASE_URL =
	process.env.EXPO_PUBLIC_API_URL ||
	(Platform.OS === 'android' ? DEFAULT_ANDROID_EMULATOR_URL : DEFAULT_LAN_URL);