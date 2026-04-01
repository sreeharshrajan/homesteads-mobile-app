import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { List, Divider, Text, Appbar, Avatar } from 'react-native-paper';
import useAuthStore from '@store/authStore';
import { ROUTES } from '@utils/constants';

const SettingsScreen = ({ navigation }) => {
  const { user, admin, role, logout } = useAuthStore();
  const isSuperuser = admin?.is_superuser || false;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <View style={styles.headerLogo}>
          <Image source={require('@assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="Settings" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          <Avatar.Icon size={64} icon="account" style={styles.avatar} color="#ffffff" />
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{admin?.name || user?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
            {role && <Text style={styles.roleBadge}>{role.name}</Text>}
          </View>
        </View>

        <Divider style={styles.divider} />

        <List.Section>
          <List.Subheader style={styles.subheader}>Account</List.Subheader>
          <List.Item
            title="Edit Profile"
            description="Manage your account details"
            left={props => <List.Icon {...props} icon="account-edit-outline" />}
            onPress={() => {}}
            titleStyle={styles.listTitle}
          />
          <List.Item
            title="Update Password"
            left={props => <List.Icon {...props} icon="lock-outline" />}
            onPress={() => {}}
            titleStyle={styles.listTitle}
          />
        </List.Section>

        <Divider style={styles.divider} />

        {isSuperuser && (
          <>
            <List.Section>
              <List.Subheader style={styles.subheader}>Administrative</List.Subheader>
              <List.Item
                title="API Keys"
                description="Manage tokens for integrations"
                left={props => <List.Icon {...props} icon="key-outline" />}
                onPress={() => navigation.navigate(ROUTES.API_KEYS)}
                titleStyle={styles.listTitle}
              />
            </List.Section>
            <Divider style={styles.divider} />
          </>
        )}

        <List.Section>
          <List.Subheader style={styles.subheader}>App Information</List.Subheader>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Version</Text>
            <Text style={styles.infoValue}>1.0.0 (Minimal)</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Build</Text>
            <Text style={styles.infoValue}>Production</Text>
          </View>
        </List.Section>

        <View style={styles.logoutContainer}>
          <List.Item
            title="Logout"
            titleStyle={[styles.listTitle, { color: '#b71c1c' }]}
            left={props => <List.Icon {...props} icon="logout" color="#b71c1c" />}
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  avatar: {
    backgroundColor: '#1a1a1a',
  },
  profileInfo: {
    marginLeft: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  userEmail: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  roleBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#455a64',
    textTransform: 'uppercase',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#f9f9f9',
  },
  subheader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9e9e9e',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingTop: 16,
    paddingBottom: 8,
  },
  listTitle: {
    fontSize: 15,
    color: '#1a1a1a',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#757575',
  },
  infoValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  logoutContainer: {
    marginTop: 16,
    marginBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#f9f9f9',
  },
});

export default SettingsScreen;
