import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { TextInput, Button, Appbar, HelperText, SegmentedButtons } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useCustomers } from '@hooks';
import { useSnackbar } from '@hooks/useSnackbar';
import { ConfirmDialog } from '@components';

const CustomerSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email'),
  phone: Yup.string().required('Phone is required'),
  companyName: Yup.string(),
  gstNumber: Yup.string(),
  panNumber: Yup.string(),
});

const CustomerFormScreen = ({ navigation, route }) => {
  const customerId = route.params?.customerId;
  const isEditMode = !!customerId;
  
  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    gstNumber: '',
    panNumber: '',
    isActive: true,
  });
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  
  const { loading, fetchCustomerById, createCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (isEditMode) {
      loadCustomer();
    }
  }, [customerId]);

  const loadCustomer = async () => {
    const result = await fetchCustomerById(customerId);
    if (result.success) {
      setInitialValues({
        name: result.data.name || '',
        email: result.data.email || '',
        phone: result.data.phone || '',
        companyName: result.data.companyName || '',
        gstNumber: result.data.gstNumber || '',
        panNumber: result.data.panNumber || '',
        isActive: result.data.isActive ?? true,
      });
    } else {
      showSnackbar(result.error || 'Failed to load customer', 'error');
      navigation.goBack();
    }
  };

  const handleSubmit = async (values) => {
    const data = {
      name: values.name,
      email: values.email || undefined,
      phone: values.phone,
      companyName: values.companyName || undefined,
      gstNumber: values.gstNumber || undefined,
      panNumber: values.panNumber || undefined,
      isActive: values.isActive,
    };

    let result;
    if (isEditMode) {
      result = await updateCustomer(customerId, data);
    } else {
      result = await createCustomer(data);
    }

    if (result.success) {
      showSnackbar(
        isEditMode ? 'Customer updated successfully' : 'Customer created successfully',
        'success'
      );
      navigation.goBack();
    } else {
      showSnackbar(result.error || 'Operation failed', 'error');
    }
  };

  const handleDelete = async () => {
    const result = await deleteCustomer(customerId);
    if (result.success) {
      showSnackbar('Customer deleted successfully', 'success');
      navigation.goBack();
    } else {
      showSnackbar(result.error || 'Failed to delete customer', 'error');
    }
    setDeleteDialogVisible(false);
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <View style={styles.headerLogo}>
          <Image source={require('@assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content 
          title={isEditMode ? 'Edit Customer' : 'New Customer'} 
          titleStyle={styles.headerTitle} 
        />
        {isEditMode && (
          <Appbar.Action
            icon="delete"
            onPress={() => setDeleteDialogVisible(true)}
          />
        )}
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
            enableReinitialize
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
              <View style={styles.form}>
                <TextInput
                  label="Full Name *"
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
                  label="Phone *"
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
                  label="Company Name"
                  mode="outlined"
                  value={values.companyName}
                  onChangeText={handleChange('companyName')}
                  onBlur={handleBlur('companyName')}
                  style={styles.input}
                />

                <TextInput
                  label="GST Number"
                  mode="outlined"
                  value={values.gstNumber}
                  onChangeText={handleChange('gstNumber')}
                  onBlur={handleBlur('gstNumber')}
                  autoCapitalize="characters"
                  style={styles.input}
                />

                <TextInput
                  label="PAN Number"
                  mode="outlined"
                  value={values.panNumber}
                  onChangeText={handleChange('panNumber')}
                  onBlur={handleBlur('panNumber')}
                  autoCapitalize="characters"
                  style={styles.input}
                />

                <SegmentedButtons
                  value={values.isActive ? 'active' : 'inactive'}
                  onValueChange={(value) => setFieldValue('isActive', value === 'active')}
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

      <ConfirmDialog
        visible={deleteDialogVisible}
        title="Delete Customer"
        message="Are you sure you want to delete this customer? This action cannot be undone."
        onConfirm={handleDelete}
        onDismiss={() => setDeleteDialogVisible(false)}
        loading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerLogo: {
    marginLeft: 8,
    marginRight: 4,
  },
  logo: {
    width: 28,
    height: 28,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
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
