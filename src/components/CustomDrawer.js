import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Avatar, Title, Caption, Drawer, Divider, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useAuthStore from '@store/authStore';
import { ROUTES } from '@utils/constants';

const CustomDrawer = (props) => {
  const { user, admin, role, logout } = useAuthStore();
  const isSuperuser = admin?.is_superuser || false;

  const handleLogout = async () => {
    await logout();
  };

  const getActiveRoute = () => {
    const state = props.state;
    const route = state.routes[state.index];
    return route.name;
  };

  const activeRoute = getActiveRoute();

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
        {/* User Info Section */}
        <View style={styles.userInfoSection}>
          <View style={styles.avatarContainer}>
            <Avatar.Icon
              size={60}
              icon="account"
              style={styles.avatar}
            />
          </View>
          <View style={styles.userDetails}>
            <Title style={styles.title}>
              {admin?.name || user?.name || 'User'}
            </Title>
            <Caption style={styles.caption}>
              {user?.email || 'user@homesteadsviands.com'}
            </Caption>
            {role && (
              <Caption style={styles.roleCaption}>
                {role.name}
              </Caption>
            )}
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Navigation Menu */}
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="view-dashboard" color={color} size={size} />
            )}
            label="Dashboard"
            active={activeRoute === ROUTES.DASHBOARD}
            onPress={() => props.navigation.navigate(ROUTES.DASHBOARD)}
          />

          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="account-group" color={color} size={size} />
            )}
            label="Customers"
            active={activeRoute === ROUTES.CUSTOMER_LIST}
            onPress={() => props.navigation.navigate(ROUTES.CUSTOMER_LIST)}
          />

          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="file-document" color={color} size={size} />
            )}
            label="Billing & Invoices"
            active={activeRoute === ROUTES.BILLING}
            onPress={() => props.navigation.navigate(ROUTES.BILLING)}
          />

          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="package-variant" color={color} size={size} />
            )}
            label="Orders"
            active={activeRoute === ROUTES.ORDERS}
            onPress={() => props.navigation.navigate(ROUTES.ORDERS)}
          />

          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="cog-outline" color={color} size={size} />
            )}
            label="Settings"
            active={activeRoute === ROUTES.SETTINGS}
            onPress={() => props.navigation.navigate(ROUTES.SETTINGS)}
          />

          {isSuperuser && (
            <>
              <Divider style={styles.sectionDivider} />
              <Text style={styles.sectionTitle}>Administration</Text>
              <DrawerItem
                icon={({ color, size }) => (
                  <MaterialCommunityIcons name="key" color={color} size={size} />
                )}
                label="API Keys"
                active={activeRoute === ROUTES.API_KEYS}
                onPress={() => props.navigation.navigate(ROUTES.API_KEYS)}
              />
            </>
          )}
        </Drawer.Section>
      </DrawerContentScrollView>

      {/* Logout Section at Bottom */}
      <View style={styles.bottomSection}>
        <Divider />
        <DrawerItem
          icon={({ color, size }) => (
            <MaterialCommunityIcons name="logout" color={color} size={size} />
          )}
          label="Logout"
          onPress={handleLogout}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  avatarContainer: {
    marginBottom: 10,
  },
  avatar: {
    backgroundColor: '#6200ee',
  },
  userDetails: {
    marginTop: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 3,
    marginBottom: 2,
  },
  caption: {
    fontSize: 13,
    lineHeight: 16,
    color: '#666',
  },
  roleCaption: {
    fontSize: 12,
    lineHeight: 14,
    color: '#6200ee',
    fontWeight: '600',
    marginTop: 4,
  },
  divider: {
    marginVertical: 10,
  },
  drawerSection: {
    marginTop: 10,
  },
  sectionDivider: {
    marginVertical: 8,
  },
  sectionTitle: {
    paddingHorizontal: 28,
    paddingVertical: 10,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    textTransform: 'uppercase',
  },
  bottomSection: {
    marginBottom: 15,
    borderTopWidth: 1,
    borderTopColor: '#f4f4f4',
  },
});

export default CustomDrawer;

