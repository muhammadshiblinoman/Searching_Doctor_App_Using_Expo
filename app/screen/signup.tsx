import * as ImagePicker from 'expo-image-picker';
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
  const [dob, setDob] = useState<Date | null>(null);
  const [showDob, setShowDob] = useState(false);
  const [role, setRole] = useState('');
  const [college, setCollege] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPW] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Enable gallery permission to select a photo.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });
    if (!res.canceled) setPhoto(res.assets[0].uri);
  };

  const calculateAge = (date: Date) => {
    const today = new Date();
    let age = today.getFullYear() - date.getFullYear();
    const m = today.getMonth() - date.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
      age--;
    }
    return age;
  };

  const handleSignup = async () => {
    if (
      !name || !email || !phone || !registrationNumber ||
      !address || !dob || !role || !college ||
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
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const age = calculateAge(dob);

      await set(ref(db, `doctors/${user.uid}`), {
        name,
        email,
        phone,
        registrationNumber,
        address,
        age,
        role,
        college,
        photo: photo ?? '',
        dob: dob.toISOString(),
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
      
      {/* Date of Birth add  */}

      <TextInput style={styles.input} placeholder="Role / Specialty" value={role} onChangeText={setRole} />
      <TextInput style={styles.input} placeholder="College" value={college} onChangeText={setCollege} />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPW} secureTextEntry />

      <Button title="SignUp" onPress={handleSignup} />
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
  label: {
    marginBottom: 6,
    fontWeight: '600',
    marginTop: 10,
  },
  link: { marginTop: 15, color: 'blue', textAlign: 'center' },
  dateInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
});
