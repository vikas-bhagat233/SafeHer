import { View, Text, StyleSheet, Linking, Alert } from 'react-native';
import { useMemo, useState } from 'react';
import ScreenShell from '../components/ScreenShell';
import SectionCard from '../components/SectionCard';
import PrimaryButton from '../components/PrimaryButton';
import { theme } from '../utils/theme';

const CITIES = {
  en: [
    {
      city: 'Delhi',
      emergency: '112',
      womenHelpline: '1091',
      policeQuery: 'police station near me',
      hospitalQuery: 'hospital near me'
    },
    {
      city: 'Mumbai',
      emergency: '112',
      womenHelpline: '103',
      policeQuery: 'police station near me',
      hospitalQuery: 'hospital near me'
    }
  ],
  hi: [
    {
      city: 'दिल्ली',
      emergency: '112',
      womenHelpline: '1091',
      policeQuery: 'पास का पुलिस स्टेशन',
      hospitalQuery: 'पास का अस्पताल'
    },
    {
      city: 'मुंबई',
      emergency: '112',
      womenHelpline: '103',
      policeQuery: 'पास का पुलिस स्टेशन',
      hospitalQuery: 'पास का अस्पताल'
    }
  ]
};

const t = {
  en: {
    title: 'Emergency resources',
    subtitle: 'Call helplines quickly and open nearby support services on maps.',
    switchLang: 'Switch to Hindi',
    callEmergency: 'Call Emergency',
    callWomen: 'Call Women Helpline',
    police: 'Nearest Police',
    hospital: 'Nearest Hospital'
  },
  hi: {
    title: 'आपातकालीन सहायता',
    subtitle: 'हेल्पलाइन को तुरंत कॉल करें और पास की सेवाएं मैप पर खोलें।',
    switchLang: 'Switch to English',
    callEmergency: 'आपातकाल कॉल करें',
    callWomen: 'महिला हेल्पलाइन कॉल करें',
    police: 'पास का पुलिस स्टेशन',
    hospital: 'पास का अस्पताल'
  }
};

export default function ResourcesScreen() {
  const [language, setLanguage] = useState('en');
  const labels = t[language];
  const cityData = useMemo(() => CITIES[language], [language]);

  const safeOpen = async (url) => {
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('Action failed', 'Unable to open this action on your device.');
    }
  };

  const openDialer = (number) => safeOpen(`tel:${number}`);
  const openMap = (query) => safeOpen(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`);

  return (
    <ScreenShell>
      <SectionCard title={labels.title} subtitle={labels.subtitle}>
        <PrimaryButton
          title={labels.switchLang}
          variant="secondary"
          onPress={() => setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'))}
        />
      </SectionCard>

      {cityData.map((item) => (
        <SectionCard key={item.city} title={item.city} subtitle={`Emergency: ${item.emergency} | Women: ${item.womenHelpline}`}>
          <View style={styles.actions}>
            <PrimaryButton title={labels.callEmergency} onPress={() => openDialer(item.emergency)} />
            <PrimaryButton title={labels.callWomen} variant="secondary" onPress={() => openDialer(item.womenHelpline)} />
            <PrimaryButton title={labels.police} variant="secondary" onPress={() => openMap(item.policeQuery)} />
            <PrimaryButton title={labels.hospital} variant="secondary" onPress={() => openMap(item.hospitalQuery)} />
          </View>
        </SectionCard>
      ))}

      <Text style={styles.note}>
        Numbers can vary by region. Please verify local helplines for your city and state.
      </Text>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: theme.spacing.sm
  },
  note: {
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.lg,
    lineHeight: 20
  }
});
