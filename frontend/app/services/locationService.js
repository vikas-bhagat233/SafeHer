import * as Location from 'expo-location';

export const getLiveLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    throw new Error("Permission denied");
  }

  const loc = await Location.getCurrentPositionAsync({});
  const latitude = loc.coords.latitude;
  const longitude = loc.coords.longitude;

  return {
    latitude,
    longitude,
    link: `https://maps.google.com/?q=${latitude},${longitude}`
  };
};