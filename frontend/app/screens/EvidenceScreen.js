import { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import ScreenShell from '../components/ScreenShell';
import SectionCard from '../components/SectionCard';
import PrimaryButton from '../components/PrimaryButton';
import { addEvidenceItem } from '../services/evidenceService';
import { theme } from '../utils/theme';

export default function EvidenceScreen({ route }) {
  const user = route.params?.user;
  const [recording, setRecording] = useState(null);
  const [busy, setBusy] = useState(false);

  const saveEvidence = async (payload) => {
    await addEvidenceItem({
      user_id: user?.id,
      ...payload
    });
  };

  const captureVideoEvidence = async () => {
    try {
      setBusy(true);
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (permission.status !== 'granted') {
        Alert.alert('Permission required', 'Camera permission is needed for video evidence.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 0.7,
        videoMaxDuration: 120
      });

      if (result.canceled || !result.assets?.[0]?.uri) {
        return;
      }

      await saveEvidence({
        type: 'video',
        uri: result.assets[0].uri,
        note: 'Captured from camera'
      });

      Alert.alert('Evidence saved', 'Video evidence was saved locally to incident timeline.');
    } catch {
      Alert.alert('Capture failed', 'Unable to capture video evidence right now.');
    } finally {
      setBusy(false);
    }
  };

  const startAudioRecording = async () => {
    try {
      setBusy(true);
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required', 'Microphone permission is needed for audio evidence.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true
      });

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
      Alert.alert('Recording started', 'Audio evidence recording is in progress.');
    } catch {
      Alert.alert('Recording failed', 'Unable to start audio recording.');
    } finally {
      setBusy(false);
    }
  };

  const stopAudioRecording = async () => {
    if (!recording) return;

    try {
      setBusy(true);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (!uri) {
        Alert.alert('Save failed', 'Audio recording URI was not generated.');
        return;
      }

      await saveEvidence({
        type: 'audio',
        uri,
        note: 'Recorded from microphone'
      });

      Alert.alert('Evidence saved', 'Audio evidence was saved locally to incident timeline.');
    } catch {
      Alert.alert('Stop failed', 'Unable to stop/save recording.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScreenShell>
      <SectionCard
        title="Evidence capture"
        subtitle="Capture video or audio evidence and attach it to your incident timeline."
      >
        <View style={styles.actions}>
          <PrimaryButton title="Capture Video Evidence" onPress={captureVideoEvidence} />
          {recording ? (
            <PrimaryButton title="Stop Audio Recording" variant="secondary" onPress={stopAudioRecording} />
          ) : (
            <PrimaryButton title="Start Audio Recording" variant="secondary" onPress={startAudioRecording} />
          )}
        </View>

        {busy ? <ActivityIndicator size="small" color={theme.colors.secondary} style={styles.loader} /> : null}
      </SectionCard>

      <SectionCard title="Privacy note" subtitle="Evidence is currently stored on-device for reliability in low-network scenarios.">
        <Text style={styles.note}>
          In the next step we can upload encrypted evidence to backend/cloud and include signed links in police report exports.
        </Text>
      </SectionCard>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: theme.spacing.sm
  },
  loader: {
    marginTop: theme.spacing.md
  },
  note: {
    color: theme.colors.textMuted,
    lineHeight: 20
  }
});
