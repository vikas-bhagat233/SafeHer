import { View, Text, TextInput, Alert, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import ScreenShell from '../components/ScreenShell';
import SectionCard from '../components/SectionCard';
import PrimaryButton from '../components/PrimaryButton';
import ContactCard from '../components/ContactCard';
import api from '../services/api';
import { theme } from '../utils/theme';

export default function ContactsScreen({ route }) {
  const user = route.params?.user;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingContactId, setEditingContactId] = useState(null);

  const loadContacts = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const res = await api.get(`/contact/${user.id}`);
      setContacts(Array.isArray(res.data) ? res.data : []);
    } catch {
      setContacts([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadContacts();
    }, [loadContacts])
  );

  const addContact = async () => {
    if (!user?.id || !name || !email) {
      Alert.alert('Add Contact Failed', 'Name and email are required');
      return;
    }

    try {
      await api.post('/contact/add', {
        user_id: user.id,
        name,
        email,
        phone
      });

      Alert.alert('Contact Added', `${email} will receive SOS alerts.`);
      setName('');
      setEmail('');
      setPhone('');
      loadContacts();
    } catch (err) {
      const message = err.response?.data?.error || 'Unable to add contact';
      Alert.alert('Add Contact Failed', message);
    }
  };

  const startEdit = (item) => {
    setEditingContactId(item.id);
    setName(item.name || '');
    setEmail(item.email || '');
    setPhone(item.phone || '');
  };

  const clearForm = () => {
    setEditingContactId(null);
    setName('');
    setEmail('');
    setPhone('');
  };

  const saveEdit = async () => {
    if (!editingContactId || !user?.id || !name || !email) {
      Alert.alert('Update Contact Failed', 'Name and email are required');
      return;
    }

    try {
      await api.put(`/contact/${editingContactId}`, {
        user_id: user.id,
        name,
        email,
        phone
      });
      Alert.alert('Contact Updated', 'Contact details were updated.');
      clearForm();
      loadContacts();
    } catch (err) {
      const message = err.response?.data?.error || 'Unable to update contact';
      Alert.alert('Update Contact Failed', message);
    }
  };

  const deleteContact = async (contactId) => {
    if (!user?.id) return;

    try {
      await api.delete(`/contact/${contactId}`, {
        data: { user_id: user.id }
      });
      Alert.alert('Contact Deleted', 'The contact was removed from your list.');
      if (editingContactId === contactId) {
        clearForm();
      }
      loadContacts();
    } catch (err) {
      const message = err.response?.data?.error || 'Unable to delete contact';
      Alert.alert('Delete Contact Failed', message);
    }
  };

  return (
    <ScreenShell>
      <SectionCard
        title={editingContactId ? 'Edit trusted contact' : 'Add trusted contact'}
        subtitle="People you trust will receive SOS notifications and location details."
      >
        <View style={styles.form}>
          <TextInput
            placeholder="Full name"
            placeholderTextColor={theme.colors.textMuted}
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Email address"
            placeholderTextColor={theme.colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
          <TextInput
            placeholder="Phone number (for SMS fallback)"
            placeholderTextColor={theme.colors.textMuted}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
          />
          {editingContactId ? (
            <>
              <PrimaryButton title="Save changes" onPress={saveEdit} />
              <PrimaryButton title="Cancel" variant="secondary" onPress={clearForm} />
            </>
          ) : (
            <PrimaryButton title="Add contact" onPress={addContact} />
          )}
        </View>
      </SectionCard>

      <SectionCard title={`Saved contacts (${contacts.length})`} subtitle="Review the people who will be notified in an emergency.">
        {loading ? (
          <ActivityIndicator size="small" color={theme.colors.secondary} />
        ) : contacts.length === 0 ? (
          <Text style={styles.empty}>No contacts saved yet.</Text>
        ) : (
          <FlatList
            data={contacts}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <ContactCard
                name={item.name}
                email={item.email}
                phone={item.phone}
                onEdit={() => startEdit(item)}
                onDelete={() => deleteContact(item.id)}
              />
            )}
          />
        )}
      </SectionCard>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: theme.spacing.sm
  },
  input: {
    minHeight: 54,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.input,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.md,
    fontSize: 16
  },
  empty: {
    color: theme.colors.textMuted
  }
});