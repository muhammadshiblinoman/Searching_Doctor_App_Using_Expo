import { router } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { useState } from 'react';
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput
} from 'react-native';
import { auth, db } from '../../firebaseConfig';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [registrationNumber, setRegNo] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('');
  const [college, setCollege] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPW] = useState('');

  const handleSignup = async () => {
    if (
      !name || !email || !phone || !registrationNumber ||
      !address || !role || !college ||
      !password || !confirmPassword
    ) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      // Create user in Firebase Authentication
      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      // Save doctor info in Firebase Realtime Database
      await set(ref(db, `doctors/${user.uid}`), {
        name,
        email,
        phone,
        registrationNumber,
        address,
        role,
        college,
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Success', 'Doctor account created');
      router.replace('/screen/login');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Signup Failed', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Doctor SignUp</Text>

      <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Registration No." value={registrationNumber} onChangeText={setRegNo} />
      <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
      <TextInput style={styles.input} placeholder="Role / Specialty" value={role} onChangeText={setRole} />
      <TextInput style={styles.input} placeholder="College" value={college} onChangeText={setCollege} />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPW} secureTextEntry />

      <Button title="Sign Up" onPress={handleSignup} />

      <Text style={styles.link} onPress={() => router.replace('/screen/login')}>
        Already have an account? Sign In
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  link: { marginTop: 15, color: 'blue', textAlign: 'center' },
});
