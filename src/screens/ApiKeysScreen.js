import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Image } from 'react-native';
import { Card, Title, Paragraph, FAB, Chip, Appbar } from 'react-native-paper';
import { ROUTES } from '../utils/constants';
import useAuthStore from '../store/authStore';
import { useApiKeys } from '../hooks';
import { useSnackbar } from '../hooks/useSnackbar';
import { EmptyState, StatusBadge } from '../components';
import { formatDate } from '../utils/formatters';

const ApiKeysScreen = ({ navigation }) => {
  const role = useAuthStore((state) => state.role);
  const { apiKeys, loading, fetchApiKeys } = useApiKeys();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    // Check if user is super-admin
    if (role?.slug !== 'super-admin') {
      showSnackbar('Access denied. Super-admin privileges required.', 'error');
      navigation.goBack();
      return;
    }

    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    const result = await fetchApiKeys();
    if (!result.success) {
      showSnackbar(result.error || 'Failed to load API keys', 'error');
    }
  };

  const handleRefresh = () => {
    loadApiKeys();
  };

  const renderApiKeyCard = ({ item }) => (
    <Card
      style={styles.card}
      onPress={() => navigation.navigate(ROUTES.API_KEY_FORM, { apiKeyId: item.id })}
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title>{item.name}</Title>
          <StatusBadge
            status={item.isActive ? 'active' : 'inactive'}
            label={item.isActive ? 'Active' : 'Inactive'}
            style={styles.statusBadge}
          />
        </View>

        <View style={styles.permissionsRow}>
          {item.permissions.slice(0, 3).map((permission, index) => (
            <Chip key={index} mode="outlined" compact style={styles.permissionChip}>
              {permission}
            </Chip>
          ))}
          {item.permissions.length > 3 && (
            <Chip mode="outlined" compact style={styles.permissionChip}>
              +{item.permissions.length - 3} more
            </Chip>
          )}
        </View>

        <View style={styles.metaRow}>
          <Paragraph style={styles.meta}>
            Created: {formatDate(item.createdAt)}
          </Paragraph>
        </View>

        {item.lastUsedAt && (
          <View style={styles.metaRow}>
            <Paragraph style={styles.meta}>
              Last used: {formatDate(item.lastUsedAt)}
            </Paragraph>
          </View>
        )}

        {item.expiresAt && (
          <View style={styles.metaRow}>
            <Paragraph style={styles.meta}>
              Expires: {formatDate(item.expiresAt)}
            </Paragraph>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  // Don't render if not super-admin
  if (role?.slug !== 'super-admin') {
    return null;
  }

  return (
    <View style={styles.container}>
      <Appbar.Header elevated>
        <View style={styles.headerLogo}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
        </View>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="API Keys" titleStyle={styles.headerTitle} />
      </Appbar.Header>
      <View style={styles.content}>
        {apiKeys.length === 0 && !loading ? (
          <EmptyState
            icon="key-variant"
            title="No API keys found"
            message="Create your first API key to integrate with external systems"
          />
        ) : (
          <FlatList
            data={apiKeys}
            renderItem={renderApiKeyCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
            }
          />
        )}
      </View>

      <FAB
        icon="plus"
        label="New API Key"
        style={styles.fab}
        onPress={() => navigation.navigate(ROUTES.API_KEY_FORM)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerLogo: {
    marginLeft: 8,
    marginRight: 4,
  },
  logo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  content: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    height: 28,
  },
  permissionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  permissionChip: {
    height: 28,
  },
  metaRow: {
    marginTop: 4,
  },
  meta: {
    fontSize: 12,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default ApiKeysScreen;

