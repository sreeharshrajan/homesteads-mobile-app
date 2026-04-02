import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  Text,
  TextInput as RNTextInput,
  ScrollView, // Added missing import
} from 'react-native';
import { Surface, IconButton, HelperText } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useAuthStore from '@store/authStore';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Too short').required('Password is required'),
});

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [secureText, setSecureText] = useState(true);
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (values) => {
    setLoading(true);
    setError('');
    const result = await login(values.email, values.password);
    if (!result.success) {
      setError(result.error || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* 1. BRANDED BACKGROUND HEADER */}
      <View style={styles.headerBackground}>
        <Surface style={styles.logoCircle} elevation={4}>
          <Image source={require('@assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </Surface>
        <Text style={styles.brandTitle}>Homesteads Viands</Text>
        <Text style={styles.brandSubtitle}>Homemade with Love & Care</Text>
      </View>

      {/* 2. LOGIN FORM SHEET */}
      <View style={styles.contentSheet}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollPadding}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.formTitle}>Sign In</Text>
            <Text style={styles.formSub}>Enter your credentials to continue</Text>

            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={LoginSchema}
              onSubmit={handleLogin}
            >
              {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <View style={styles.form}>
                  {/* Email Input */}
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <Surface
                      style={[
                        styles.inputSurface,
                        touched.email && errors.email && styles.inputError,
                      ]}
                      elevation={0}
                    >
                      <IconButton icon="email-outline" size={20} iconColor="#4FD3B5" />
                      <RNTextInput
                        placeholder="admin@homesteads.com"
                        value={values.email}
                        onChangeText={handleChange('email')}
                        onBlur={handleBlur('email')}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.textInput}
                      />
                    </Surface>
                    <HelperText type="error" visible={touched.email && errors.email}>
                      {errors.email}
                    </HelperText>
                  </View>

                  {/* Password Input */}
                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <Surface
                      style={[
                        styles.inputSurface,
                        touched.password && errors.password && styles.inputError,
                      ]}
                      elevation={0}
                    >
                      <IconButton icon="lock-outline" size={20} iconColor="#4FD3B5" />
                      <RNTextInput
                        placeholder="••••••••"
                        value={values.password}
                        onChangeText={handleChange('password')}
                        onBlur={handleBlur('password')}
                        secureTextEntry={secureText}
                        style={styles.textInput}
                      />
                      <IconButton
                        icon={secureText ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        iconColor="#CCC"
                        onPress={() => setSecureText(!secureText)}
                      />
                    </Surface>
                    <HelperText type="error" visible={touched.password && errors.password}>
                      {errors.password}
                    </HelperText>
                  </View>

                  {error ? <Text style={styles.serverError}>{error}</Text> : null}

                  <TouchableOpacity
                    style={[styles.loginBtn, loading && styles.btnDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.loginBtnText}>
                      {loading ? 'Authenticating...' : 'Sign In'}
                    </Text>
                    {!loading && <IconButton icon="arrow-right" iconColor="#fff" size={20} />}
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.forgotBtn}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#61F2D5',
  },
  headerBackground: {
    height: '35%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  logo: {
    width: 45,
    height: 45,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    fontFamily: 'serif',
  },
  brandSubtitle: {
    fontSize: 13,
    color: '#333',
    opacity: 0.6,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  contentSheet: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  keyboardView: {
    flex: 1,
  },
  scrollPadding: {
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 40,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  formSub: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    marginBottom: 30,
  },
  inputWrapper: {
    marginBottom: 5,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#BBB',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 5,
  },
  inputSurface: {
    backgroundColor: '#F9F9F9',
    borderRadius: 18,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 5,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  inputError: {
    borderColor: '#FF4B7D',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
    outlineStyle: 'none', // Fix for web focus outlines
  },
  serverError: {
    color: '#FF4B7D',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 15,
  },
  loginBtn: {
    backgroundColor: '#333',
    height: 60,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    // Removed deprecated shadow props, using elevation for Paper
  },
  btnDisabled: {
    opacity: 0.7,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  forgotBtn: {
    marginTop: 20,
    alignItems: 'center',
  },
  forgotText: {
    color: '#4FD3B5',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default LoginScreen;
