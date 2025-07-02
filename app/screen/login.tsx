import { router } from 'expo-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

export default function SignIn() {
  const { control, handleSubmit, setError } = useForm();
  const auth = getAuth();

  async function onSubmit(data: any) {
    const { email, password } = data;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Login Successful');
      router.replace('/Home/home'); // navigate to home or dashboard
    } catch (error: any) {
      let message = 'Login failed';
      if (error.code === 'auth/invalid-email') {
        message = 'Invalid email format';
      } else if (error.code === 'auth/user-not-found') {
        message = 'User not found';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password';
      }
      Alert.alert('Error', message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      <Controller
        control={control}
        name="email"
        rules={{ required: 'Email is required' }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TextInput
              placeholder="Email"
              style={styles.input}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {error && <Text style={styles.error}>{error.message}</Text>}
          </>
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={{ required: 'Password is required' }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TextInput
              placeholder="Password"
              secureTextEntry
              style={styles.input}
              onChangeText={onChange}
              value={value}
            />
            {error && <Text style={styles.error}>{error.message}</Text>}
          </>
        )}
      />

      <Button title="Sign In" onPress={handleSubmit(onSubmit)} />
      <Text style={styles.link} onPress={() => router.replace('/screen/signup')}>
        Don't have an account? Sign Up
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
  },
  error: { color: 'red', marginBottom: 10 },
  link: { marginTop: 15, color: 'blue', textAlign: 'center' },
});
