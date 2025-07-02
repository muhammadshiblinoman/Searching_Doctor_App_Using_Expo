import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { db } from '../../firebaseConfig';

interface Doctor {
  id: string;
  name: string;
  address: string;
  age: number;
  role: string;
  college: string;
}

export default function Home() {
  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();

  /* realtime fetch */
  useEffect(() => {
    const unsub = onValue(ref(db, 'doctors'), (snap) => {
      const data = snap.val();
      const list: Doctor[] = data
        ? Object.entries(data).map(([id, v]: any) => ({ id, ...v }))
        : [];
      setDoctors(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  /* search filter */
  const query = search.toLowerCase();
  const filtered = doctors.filter(
    d =>
      d.name.toLowerCase().includes(query) ||
      d.role.toLowerCase().includes(query) ||
      d.college.toLowerCase().includes(query)
  );

  /* responsive columns */
  const cols = width >= 1024 ? 4 : width >= 768 ? 3 : 1;
  const rows = [];
  for (let i = 0; i < filtered.length; i += cols) rows.push(filtered.slice(i, i + cols));

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/Home/home')}>
          <Ionicons name="home-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>All Doctors</Text>
        <TouchableOpacity onPress={() => router.replace('/screen/login')}>
          <Ionicons name="log-in-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* search */}
      <TextInput
        style={styles.search}
        placeholder="Search by name, role, college..."
        value={search}
        onChangeText={setSearch}
      />

      {/* list */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {rows.map((row, idx) => (
            <View key={idx} style={styles.row}>
              {row.map(doc => (
                <TouchableOpacity
                  key={doc.id}
                  style={[styles.card, { flex: 1 / cols }]}
                  onPress={() =>
                    router.push({ pathname: '../pages/doctorsDetails', params: { ...doc } })
                  }
                >
                  <Text style={styles.name}>{doc.name}</Text>
                  <Text style={styles.role}>{doc.role}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  search: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  scroll: { paddingBottom: 20 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  card: {
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  name: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  role: { fontSize: 14, color: '#666' },
});
