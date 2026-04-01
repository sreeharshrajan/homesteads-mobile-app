import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { TextInput, Button, Text, Title, HelperText } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useAuthStore from '../store/authStore';
import { ROUTES } from '../utils/constants';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (values) => {
    setLoading(true);
    setError('');

    const result = await login(values.email, values.password);

    if (result.success) {
      // The auth state update will automatically trigger navigation in AppNavigator
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
        </View>
        <Title style={styles.title}>Homesteads Viands</Title>
        <Text style={styles.subtitle}>Billing & Customer Management</Text>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              <TextInput
                label="Email"
                mode="outlined"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                keyboardType="email-address"
                autoCapitalize="none"
                error={touched.email && errors.email}
                style={styles.input}
              />
              <HelperText type="error" visible={touched.email && errors.email}>
                {errors.email}
              </HelperText>

              <TextInput
                label="Password"
                mode="outlined"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                secureTextEntry
                error={touched.password && errors.password}
                style={styles.input}
              />
              <HelperText type="error" visible={touched.password && errors.password}>
                {errors.password}
              </HelperText>

              {error ? (
                <HelperText type="error" visible={true} style={styles.errorText}>
                  {error}
                </HelperText>
              ) : null}

              <Button
                mode="contained"
                onPress={handleSubmit}
                loading={loading}
                disabled={loading}
                style={styles.button}
              >
                Login
              </Button>
            </View>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 4,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 8,
  },
});

export default LoginScreen;

