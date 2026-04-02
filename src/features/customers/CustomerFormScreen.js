import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
  TextInput as RNTextInput,
} from 'react-native';
import { IconButton, Surface, HelperText, Avatar } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useCustomers } from '@hooks';
import { useSnackbar } from '@hooks/useSnackbar';
import { ConfirmDialog, ScreenTemplate } from '@components';

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

  const { loading, fetchCustomerById, createCustomer, updateCustomer, deleteCustomer } =
    useCustomers();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (isEditMode) loadCustomer();
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
    const result = isEditMode
      ? await updateCustomer(customerId, values)
      : await createCustomer(values);
    if (result.success) {
      showSnackbar(isEditMode ? 'Updated successfully' : 'Created successfully', 'success');
      navigation.goBack();
    } else {
      showSnackbar(result.error || 'Operation failed', 'error');
    }
  };

  // FIXED: Re-added the missing handleDelete function
  const handleDelete = async () => {
    const result = await deleteCustomer(customerId);
    if (result.success) {
      showSnackbar('Customer deleted successfully', 'success');
      setDeleteDialogVisible(false);
      navigation.goBack();
    } else {
      showSnackbar(result.error || 'Failed to delete customer', 'error');
      setDeleteDialogVisible(false);
    }
  };

  const FormInput = ({ label, icon, value, onChangeText, onBlur, error, touched, ...props }) => (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>{label}</Text>
      <Surface style={[styles.inputSurface, touched && error && styles.inputError]} elevation={0}>
        <IconButton icon={icon} size={20} iconColor="#4FD3B5" style={styles.inputIcon} />
        <RNTextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          placeholderTextColor="#BBB"
          {...props}
        />
      </Surface>
      {touched && error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <ScreenTemplate
      showBackButton
      title={isEditMode ? initialValues.name : 'Add Customer'}
      subtitle={isEditMode ? 'Edit member' : 'New member'}
      headerAction={
        isEditMode && (
          <IconButton
            icon="trash-can-outline"
            iconColor="#FF4B7D"
            onPress={() => setDeleteDialogVisible(true)}
          />
        )
      }
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <Formik
          initialValues={initialValues}
          validationSchema={CustomerSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
            <View>
              <FormInput
                label="Full Name *"
                icon="account-outline"
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                error={errors.name}
                touched={touched.name}
                placeholder="e.g. Loni Bowcher"
              />
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <FormInput
                    label="Phone *"
                    icon="phone-outline"
                    value={values.phone}
                    onChangeText={handleChange('phone')}
                    onBlur={handleBlur('phone')}
                    error={errors.phone}
                    touched={touched.phone}
                    keyboardType="phone-pad"
                    placeholder="98765..."
                  />
                </View>
                <View style={{ width: 15 }} />
                <View style={{ flex: 1 }}>
                  <FormInput
                    label="Status"
                    icon="circle-double"
                    value={values.isActive ? 'Active' : 'Inactive'}
                    editable={false}
                  />
                </View>
              </View>
              <FormInput
                label="Email Address"
                icon="email-outline"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                error={errors.email}
                touched={touched.email}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="loni@example.com"
              />
              <FormInput
                label="Company Name"
                icon="office-building-outline"
                value={values.companyName}
                onChangeText={handleChange('companyName')}
                onBlur={handleBlur('companyName')}
                placeholder="e.g. Sales Düsseldorf"
              />
              <View style={styles.statusToggleRow}>
                <Text style={styles.statusLabel}>Set Profile as Active</Text>
                <TouchableOpacity
                  style={[styles.toggleBase, values.isActive && styles.toggleActive]}
                  onPress={() => setFieldValue('isActive', !values.isActive)}
                >
                  <View style={[styles.toggleThumb, values.isActive && styles.toggleThumbActive]} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
                <Text style={styles.submitBtnText}>
                  {loading ? 'Processing...' : isEditMode ? 'Update Profile' : 'Create Profile'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>

      <ConfirmDialog
        visible={deleteDialogVisible}
        title="Delete Customer"
        message="This action is permanent. Continue?"
        onConfirm={handleDelete}
        onDismiss={() => setDeleteDialogVisible(false)}
        loading={loading}
      />
    </ScreenTemplate>
  );
};

const styles = StyleSheet.create({
  loadingFull: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollPadding: { paddingBottom: 40 },
  inputWrapper: { marginBottom: 20 },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#BBB',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputSurface: {
    backgroundColor: '#F9F9F9',
    borderRadius: 18,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  inputError: { borderColor: '#FF4B7D' },
  inputIcon: { marginLeft: 5 },
  textInput: { flex: 1, fontSize: 15, color: '#333', fontWeight: '500' },
  errorText: { color: '#FF4B7D', fontSize: 11, marginTop: 5, marginLeft: 15 },
  row: { flexDirection: 'row' },
  statusToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    paddingHorizontal: 5,
  },
  statusLabel: { fontSize: 14, fontWeight: '700', color: '#444' },
  toggleBase: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEE',
    padding: 3,
    justifyContent: 'center',
  },
  toggleActive: { backgroundColor: '#4FD3B5' },
  toggleThumb: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff' },
  toggleThumbActive: { alignSelf: 'flex-end' },
  submitBtn: {
    backgroundColor: '#333',
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default CustomerFormScreen;
