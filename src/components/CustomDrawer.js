import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { 
  Avatar, 
  Text, 
  Drawer, 
  Divider, 
  useTheme, 
  TouchableRipple 
} from 'react-native-paper';
import useAuthStore from '@store/authStore';
import { ROUTES } from '@utils/constants';

/**
 * CustomDrawer Component
 * Refactored for Material Design 3 and performance.
 */
const CustomDrawer = (props) => {
  const theme = useTheme();
  const { user, admin, role, logout } = useAuthStore();
  
  const isSuperuser = admin?.is_superuser || false;
  const activeRoute = props.state.routes[props.state.index].name;

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  // Helper to render navigation items using Paper's Drawer.Item
  const NavItem = ({ label, icon, route }) => (
    <Drawer.Item
      label={label}
      icon={icon}
      active={activeRoute === route}
      onPress={() => props.navigation.navigate(route)}
      style={styles.drawerItem}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
        
        {/* User Profile Header */}
        <TouchableRipple 
          onPress={() => props.navigation.navigate(ROUTES.SETTINGS)}
          rippleColor="rgba(0, 0, 0, .02)"
        >
          <View style={styles.userInfoSection}>
            <Avatar.Icon
              size={56}
              icon="account"
              style={{ backgroundColor: theme.colors.primaryContainer }}
              color={theme.colors.onPrimaryContainer}
            />
            <View style={styles.userDetails}>
              <Text variant="titleMedium" style={styles.userName}>
                {admin?.name || user?.name || 'User'}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {user?.email || 'user@homesteadsviands.com'}
              </Text>
              {role && (
                <Text 
                  variant="labelSmall" 
                  style={[styles.roleBadge, { color: theme.colors.primary }]}
                >
                  {role.name.toUpperCase()}
                </Text>
              )}
            </View>
          </View>
        </TouchableRipple>

        <Divider style={styles.divider} />

        {/* Main Navigation */}
        <Drawer.Section title="Menu" showDivider={false}>
          <NavItem label="Dashboard" icon="view-dashboard" route={ROUTES.DASHBOARD} />
          <NavItem label="Customers" icon="account-group" route={ROUTES.CUSTOMER_LIST} />
          <NavItem label="Billing" icon="file-document" route={ROUTES.BILLING} />
          <NavItem label="Orders" icon="package-variant" route={ROUTES.ORDERS} />
          <NavItem label="Settings" icon="cog" route={ROUTES.SETTINGS} />
        </Drawer.Section>

        {/* Superuser Section */}
        {isSuperuser && (
          <Drawer.Section title="Administration" style={styles.adminSection}>
            <NavItem label="API Keys" icon="key" route={ROUTES.API_KEYS} />
          </Drawer.Section>
        )}
      </DrawerContentScrollView>

      {/* Footer / Logout */}
      <View style={styles.footer}>
        <Divider />
        <Drawer.Item
          label="Logout"
          icon="logout"
          onPress={handleLogout}
          style={styles.logoutItem}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0, // Profile header should touch the top or follow safe area
  },
  userInfoSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  userDetails: {
    marginTop: 12,
  },
  userName: {
    fontWeight: '700',
  },
  roleBadge: {
    marginTop: 4,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  divider: {
    marginHorizontal: 16,
    height: 1,
  },
  drawerItem: {
    borderRadius: 28, // Material 3 Pill shape
    marginHorizontal: 12,
    marginVertical: 2,
  },
  adminSection: {
    marginTop: 10,
  },
  footer: {
    paddingBottom: 12,
  },
  logoutItem: {
    marginHorizontal: 12,
    marginTop: 12,
  }
});

export default CustomDrawer;