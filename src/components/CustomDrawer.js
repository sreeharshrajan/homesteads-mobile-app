import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import {
  Avatar,
  Text,
  Divider,
  Surface,
  IconButton
} from 'react-native-paper';
import useAuthStore from '@store/authStore';
import { ROUTES } from '@utils/constants';

const CustomDrawer = (props) => {
  const { user, admin, role, logout } = useAuthStore();

  const isSuperuser = admin?.is_superuser || false;
  const activeRoute = props.state.routes[props.state.index].name;

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  // Premium Navigation Item
  const NavItem = ({ label, icon, route }) => {
    const isActive = activeRoute === route;
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => props.navigation.navigate(route)}
        style={[styles.navItem, isActive && styles.navItemActive]}
      >
        <View style={styles.navRow}>
          <IconButton
            icon={icon}
            size={22}
            iconColor={isActive ? "#4FD3B5" : "#777"}
            style={styles.navIcon}
          />
          <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
            {label}
          </Text>
        </View>
        {isActive && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 1. BRANDED MINT HEADER */}
      <View style={styles.drawerHeader}>
        {/* <View style={styles.headerTopRow}>
          <IconButton icon="close" size={24} iconColor="#333" onPress={() => props.navigation.closeDrawer()} />
        </View> */}

        <View style={styles.profileContainer}>
          <Surface style={styles.avatarSurface} elevation={2}>
            <Avatar.Image
              size={64}
              source={{ uri: `https://ui-avatars.com/api/?name=${admin?.name || user?.name || 'U'}&background=FF4B7D&color=fff` }}
            />
          </Surface>
          <View style={styles.profileText}>
            <Text style={styles.userName}>{admin?.name || user?.name || 'User'}</Text>
            <Text style={styles.userRole}>{role?.name || 'Administrator'}</Text>
          </View>
        </View>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Main Menu</Text>
          <NavItem label="Dashboard" icon="view-dashboard-outline" route={ROUTES.DASHBOARD} />
          <NavItem label="Customers" icon="account-group-outline" route={ROUTES.CUSTOMER_LIST} />
          <NavItem label="Orders" icon="package-variant-closed" route={ROUTES.ORDERS} />
          <NavItem label="Billing" icon="file-document-outline" route={ROUTES.BILLING} />
        </View>

        {isSuperuser && (
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>Administration</Text>
            <NavItem label="API Keys" icon="key-outline" route={ROUTES.API_KEYS} />
          </View>
        )}

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <NavItem label="Account Settings" icon="cog-outline" route={ROUTES.SETTINGS} />
        </View>
      </DrawerContentScrollView>

      {/* 2. PREMIUM FOOTER */}
      <View style={styles.footer}>
        <Divider style={styles.footerDivider} />
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <IconButton icon="logout" size={20} iconColor="#FF4B7D" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  drawerHeader: {
    backgroundColor: '#61F2D5', // The signature mint color
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomRightRadius: 50,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSurface: {
    borderRadius: 20,
    padding: 3,
    backgroundColor: '#fff',
  },
  profileText: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  userRole: {
    fontSize: 12,
    color: '#444',
    opacity: 0.8,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scrollContent: {
    paddingTop: 20,
  },
  menuSection: {
    marginBottom: 25,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#BBB',
    marginLeft: 15,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  navItem: {
    height: 50,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 15,
    marginBottom: 4,
  },
  navItemHover: {
    backgroundColor: '#F0FFFC', // Very light mint
  },
  navItemActive: {
    backgroundColor: '#F0FFFC', // Very light mint
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navIcon: {
    margin: 0,
  },
  navLabel: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#222',
    fontWeight: '700',
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4FD3B5',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  footerDivider: {
    backgroundColor: '#F0F0F0',
    marginBottom: 15,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF4B7D', // Pink accent for logout
  }
});

export default CustomDrawer;