import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Appbar,
  HelperText,
  Checkbox,
  Text,
  Card,
  Paragraph,
} from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useAuthStore from '@store/authStore';
import { useApiKeys } from '@hooks';
import { useSnackbar } from '@hooks/useSnackbar';
import { ConfirmDialog } from '@components';
import { apiKeysApi } from '@api';

const ApiKeySchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  permissions: Yup.array().min(1, 'Select at least one permission'),
});

const PERMISSION_OPTIONS = [
  { value: 'invoices:read', label: 'View Invoices', category: 'Invoices' },
  { value: 'invoices:create', label: 'Create Invoices', category: 'Invoices' },
  { value: 'invoices:update', label: 'Update Invoices', category: 'Invoices' },
  { value: 'invoices:delete', label: 'Delete Invoices', category: 'Invoices' },
  { value: 'customers:read', label: 'View Customers', category: 'Customers' },
  { value: 'customers:create', label: 'Create Customers', category: 'Customers' },
  { value: 'customers:update', label: 'Update Customers', category: 'Customers' },
  { value: 'customers:delete', label: 'Delete Customers', category: 'Customers' },
  { value: '*', label: 'All Permissions', category: 'Admin' },
];

const ApiKeyFormScreen = ({ navigation, route }) => {
  const apiKeyId = route.params?.apiKeyId;
  const isEditMode = !!apiKeyId;

  const role = useAuthStore((state) => state.role);
  const [initialValues, setInitialValues] = useState({
    name: '',
    permissions: [],
  });
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
  const [generatedKey, setGeneratedKey] = useState(null);

  const { loading, createApiKey, updateApiKey, deleteApiKey, fetchApiKeys } = useApiKeys();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    // Check if user is super-admin
    if (role?.slug !== 'super-admin') {
      showSnackbar('Access denied. Super-admin privileges required.', 'error');
      navigation.goBack();
      return;
    }

    if (isEditMode) {
      loadApiKey();
    }
  }, [apiKeyId]);

  const loadApiKey = async () => {
    const result = await fetchApiKeys();
    if (result.success) {
      const apiKey = result.data.find((k) => k.id === apiKeyId);
      if (apiKey) {
        setInitialValues({
          name: apiKey.name || '',
          permissions: apiKey.permissions || [],
        });
      } else {
        showSnackbar('API key not found', 'error');
        navigation.goBack();
      }
    } else {
      showSnackbar(result.error || 'Failed to load API key', 'error');
      navigation.goBack();
    }
  };

  const handleSubmit = async (values) => {
    const data = {
      name: values.name,
      permissions: values.permissions,
    };

    let result;
    if (isEditMode) {
      result = await updateApiKey(apiKeyId, data);
    } else {
      result = await createApiKey(data);
    }

    if (result.success) {
      if (!isEditMode && result.data.key) {
        // Show the generated key
        setGeneratedKey(result.data.key);
        Alert.alert(
          'API Key Created',
          "Your API key has been created successfully. Make sure to copy it now as you won't be able to see it again.",
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        showSnackbar(
          isEditMode ? 'API key updated successfully' : 'API key created successfully',
          'success'
        );
        navigation.goBack();
      }
    } else {
      showSnackbar(result.error || 'Operation failed', 'error');
    }
  };

  const handleDelete = async () => {
    const result = await deleteApiKey(apiKeyId);
    if (result.success) {
      showSnackbar('API key deleted successfully', 'success');
      navigation.goBack();
    } else {
      showSnackbar(result.error || 'Failed to delete API key', 'error');
    }
    setDeleteDialogVisible(false);
  };

  const handleCopyKey = () => {
    if (generatedKey) {
      // In a real app, you'd use Clipboard API
      showSnackbar('Key copied to clipboard', 'success');
    }
  };

  // Don't render if not super-admin
  if (role?.slug !== 'super-admin') {
    return null;
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <View style={styles.headerLogo}>
          <Image source={require('@assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title={isEditMode ? 'Edit API Key' : 'New API Key'}
          titleStyle={styles.headerTitle}
        />
        {isEditMode && <Appbar.Action icon="delete" onPress={() => setDeleteDialogVisible(true)} />}
      </Appbar.Header>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView}>
          {generatedKey && (
            <Card style={styles.keyCard}>
              <Card.Content>
                <Paragraph style={styles.keyTitle}>Your API Key</Paragraph>
                <Paragraph style={styles.keyWarning}>
                  Copy this key now. You won't be able to see it again!
                </Paragraph>
                <TextInput
                  mode="outlined"
                  value={generatedKey}
                  editable={false}
                  style={styles.keyInput}
                  right={<TextInput.Icon icon="content-copy" onPress={handleCopyKey} />}
                />
              </Card.Content>
            </Card>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={ApiKeySchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
            }) => (
              <View style={styles.form}>
                <TextInput
                  label="API Key Name *"
                  mode="outlined"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  error={touched.name && errors.name}
                  style={styles.input}
                  placeholder="e.g., Production API Key"
                />
                <HelperText type="error" visible={touched.name && errors.name}>
                  {errors.name}
                </HelperText>

                <Text style={styles.sectionTitle}>Permissions *</Text>
                <HelperText type="info">Select the permissions this API key should have</HelperText>

                {PERMISSION_OPTIONS.map((option) => (
                  <View key={option.value} style={styles.checkboxRow}>
                    <Checkbox
                      status={values.permissions.includes(option.value) ? 'checked' : 'unchecked'}
                      onPress={() => {
                        const newPermissions = values.permissions.includes(option.value)
                          ? values.permissions.filter((p) => p !== option.value)
                          : [...values.permissions, option.value];
                        setFieldValue('permissions', newPermissions);
                      }}
                    />
                    <View style={styles.checkboxLabel}>
                      <Text>{option.label}</Text>
                      <Text style={styles.checkboxCategory}>{option.category}</Text>
                    </View>
                  </View>
                ))}
                <HelperText type="error" visible={touched.permissions && errors.permissions}>
                  {errors.permissions}
                </HelperText>

                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  loading={loading}
                  disabled={loading || generatedKey}
                  style={styles.button}
                >
                  {isEditMode ? 'Update API Key' : 'Create API Key'}
                </Button>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>

      <ConfirmDialog
        visible={deleteDialogVisible}
        title="Delete API Key"
        message="Are you sure you want to delete this API key? All integrations using this key will stop working."
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
  keyCard: {
    margin: 16,
    backgroundColor: '#fff3cd',
    elevation: 2,
  },
  keyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  keyWarning: {
    color: '#856404',
    marginBottom: 12,
  },
  keyInput: {
    backgroundColor: '#fff',
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  checkboxLabel: {
    flex: 1,
    marginLeft: 8,
  },
  checkboxCategory: {
    fontSize: 12,
    color: '#666',
  },
  button: {
    marginTop: 24,
    paddingVertical: 8,
  },
});

export default ApiKeyFormScreen;
