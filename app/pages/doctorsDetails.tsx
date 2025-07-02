// /screen/DoctorDetails.tsx
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text } from 'react-native';

export default function DoctorDetails() {
  const doctor = useLocalSearchParams();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.name}>{doctor.name}</Text>
      <Text>Address: {doctor.address}</Text>
      <Text>Age: {doctor.age}</Text>
      <Text>Role: {doctor.role}</Text>
      <Text>College: {doctor.college}</Text>
      <Text style={styles.desc}>
        {doctor.description || 'This doctor has not added a description yet.'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  desc: {
    marginTop: 20,
    fontStyle: 'italic',
  },
});
