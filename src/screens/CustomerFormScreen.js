import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Appbar, HelperText, SegmentedButtons } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';

const CustomerSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone is required'),
  address: Yup.string().required('Address is required'),
});

const CustomerFormScreen = ({ navigation, route }) => {
  const customerId = route.params?.customerId;
  const isEditMode = !!customerId;
  const [loading, setLoading] = useState(false);

  // In a real app, you would fetch customer data if in edit mode
  const initialValues = {
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Customer data:', values);
      setLoading(false);
      navigation.goBack();
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={isEditMode ? 'Edit Customer' : 'New Customer'} />
      </Appbar.Header>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView}>
          <Formik
            initialValues={initialValues}
            validationSchema={CustomerSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
              <View style={styles.form}>
                <TextInput
                  label="Full Name"
                  mode="outlined"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  error={touched.name && errors.name}
                  style={styles.input}
                />
                <HelperText type="error" visible={touched.name && errors.name}>
                  {errors.name}
                </HelperText>

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
                  label="Phone"
                  mode="outlined"
                  value={values.phone}
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  keyboardType="phone-pad"
                  error={touched.phone && errors.phone}
                  style={styles.input}
                />
                <HelperText type="error" visible={touched.phone && errors.phone}>
                  {errors.phone}
                </HelperText>

                <TextInput
                  label="Address"
                  mode="outlined"
                  value={values.address}
                  onChangeText={handleChange('address')}
                  onBlur={handleBlur('address')}
                  multiline
                  numberOfLines={3}
                  error={touched.address && errors.address}
                  style={styles.input}
                />
                <HelperText type="error" visible={touched.address && errors.address}>
                  {errors.address}
                </HelperText>

                <SegmentedButtons
                  value={values.status}
                  onValueChange={(value) => setFieldValue('status', value)}
                  buttons={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                  ]}
                  style={styles.segmentedButtons}
                />

                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  loading={loading}
                  disabled={loading}
                  style={styles.button}
                >
                  {isEditMode ? 'Update Customer' : 'Create Customer'}
                </Button>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 4,
  },
  segmentedButtons: {
    marginTop: 16,
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
});

export default CustomerFormScreen;

