import * as LocalAuthentication from 'expo-local-authentication';

export const verifyBiometricAccess = async () => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  if (!hasHardware) {
    return { ok: true, skipped: true, reason: 'Biometric hardware not available on this device.' };
  }

  const enrolled = await LocalAuthentication.isEnrolledAsync();
  if (!enrolled) {
    return { ok: true, skipped: true, reason: 'No biometrics enrolled. Set up fingerprint or face unlock first.' };
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Unlock SafeHer',
    cancelLabel: 'Cancel',
    fallbackLabel: 'Use device passcode',
    disableDeviceFallback: false
  });

  if (!result.success) {
    return { ok: false, reason: 'Authentication failed or canceled.' };
  }

  return { ok: true };
};
