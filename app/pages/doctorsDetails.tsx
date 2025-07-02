import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function DoctorDetails() {
  const params = useLocalSearchParams();

  // Parse doctor data
  const doctor = {
    name: decodeURIComponent(params.name?.toString() || ''),
    address: decodeURIComponent(params.address?.toString() || ''),
    dob: params.dob?.toString() || '', // expect ISO string e.g. "1980-05-12T00:00:00.000Z"
    role: decodeURIComponent(params.role?.toString() || ''),
    college: decodeURIComponent(params.college?.toString() || ''),
    description: decodeURIComponent(params.description?.toString() || ''),
  };

  // Function to calculate age from DOB string
  const calculateAge = (dobStr: string) => {
    if (!dobStr) return 0;
    const dobDate = new Date(dobStr);
    const today = new Date();
    let age = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    return age;
  };

  // Calculate age once
  const age = calculateAge(doctor.dob);

  const [description, setDescription] = useState(doctor.description);

  useEffect(() => {
    if (!doctor.description) {
      const fetchDescription = async () => {
        try {
          const roleForUrl = encodeURIComponent(doctor.role);
          const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${roleForUrl}`);
          if (!res.ok) throw new Error('Failed to fetch');

          const data = await res.json();

          if (data.extract) {
            setDescription(data.extract);
          } else {
            setDescription('No description available for this specialty.');
          }
        } catch (error) {
          setDescription('Could not load description.');
        }
      };

      fetchDescription();
    }
  }, [doctor.description, doctor.role]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back-outline" size={24} color="#007AFF" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.name}>{doctor.name}</Text>
      <Text style={styles.field}>Address: {doctor.address}</Text>
      <Text style={styles.field}>Age: {age}</Text>
      <Text style={styles.field}>Role: {doctor.role}</Text>
      <Text style={styles.field}>College: {doctor.college}</Text>

      <Text style={styles.desc}>
        {description || 'This doctor has not added a description yet.'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backText: { marginLeft: 5, color: '#007AFF', fontSize: 16 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  field: { fontSize: 16, marginBottom: 5 },
  desc: { marginTop: 20, fontStyle: 'italic', fontSize: 16, color: '#555' },
});
