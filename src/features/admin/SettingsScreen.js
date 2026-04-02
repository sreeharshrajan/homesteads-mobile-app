import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import { IconButton, Surface, Divider, Avatar } from 'react-native-paper';
import useAuthStore from '@store/authStore';
import { ROUTES } from '@utils/constants';

const SettingsScreen = ({ navigation }) => {
  const { user, admin, role, logout } = useAuthStore();
  const isSuperuser = admin?.is_superuser || false;

  const NavRow = ({ label, icon, onPress, color = '#666', showDivider = true }) => (
    <View>
      <TouchableOpacity style={styles.navRow} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.navLeft}>
          <IconButton icon={icon} size={22} iconColor={color} style={styles.navIcon} />
          <Text style={[styles.navLabel, { color: color === '#666' ? '#222' : color }]}>
            {label}
          </Text>
        </View>
        <IconButton icon="chevron-right" size={20} iconColor="#CCC" />
      </TouchableOpacity>
      {showDivider && <Divider style={styles.rowDivider} />}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 1. PREMIUM HEADER WITH PROFILE */}
      <View style={styles.headerBackground}>
        <View style={styles.topNav}>
          <IconButton icon="menu" iconColor="#333" onPress={() => navigation.openDrawer()} />
          <Text style={styles.headerText}>Account Settings</Text>
          <IconButton icon="bell-outline" iconColor="#333" />
        </View>

        <View style={styles.profileSection}>
          <Surface style={styles.avatarSurface} elevation={4}>
            <Avatar.Text
              size={70}
              label={(admin?.name || user?.name || 'U').substring(0, 2).toUpperCase()}
              style={styles.avatar}
              labelStyle={styles.avatarLabel}
            />
          </Surface>
          <View style={styles.profileText}>
            <Text style={styles.userName}>{admin?.name || user?.name || 'User'}</Text>
            <Text style={styles.userRole}>{role?.name || 'Super Admin'}</Text>
          </View>
        </View>
      </View>

      {/* 2. SETTINGS CONTENT SHEET */}
      <View style={styles.contentSheet}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollPadding}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionLabel}>General Settings</Text>
          <Surface style={styles.menuCard} elevation={1}>
            <NavRow label="Edit Profile" icon="account-circle-outline" onPress={() => {}} />
            <NavRow label="Change Password" icon="lock-open-outline" onPress={() => {}} />
            <NavRow
              label="Notification Settings"
              icon="bell-ring-outline"
              onPress={() => {}}
              showDivider={false}
            />
          </Surface>

          {isSuperuser && (
            <>
              <Text style={[styles.sectionLabel, { marginTop: 25 }]}>Administration</Text>
              <Surface style={styles.menuCard} elevation={1}>
                <NavRow
                  label="API Keys"
                  icon="key-chain-outline"
                  onPress={() => navigation.navigate(ROUTES.API_KEYS)}
                />
                <NavRow
                  label="Team Management"
                  icon="shield-account-outline"
                  onPress={() => {}}
                  showDivider={false}
                />
              </Surface>
            </>
          )}

          <Text style={[styles.sectionLabel, { marginTop: 25 }]}>App Details</Text>
          <Surface style={styles.infoCard} elevation={1}>
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Version</Text>
              <Text style={styles.infoValue}>2.4.0 (Build 2026)</Text>
            </View>
            <Divider style={styles.rowDivider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoKey}>Environment</Text>
              <Text style={styles.infoValue}>Production</Text>
            </View>
          </Surface>

          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <IconButton icon="logout" iconColor="#FF4B7D" size={20} />
            <Text style={styles.logoutText}>Sign Out of Session</Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>

      {/* FLOATING BOTTOM NAV INDICATOR */}
      <Surface style={styles.bottomNav} elevation={4}>
        <IconButton
          icon="home-outline"
          iconColor="#CCC"
          onPress={() => navigation.navigate(ROUTES.DASHBOARD)}
        />
        <IconButton
          icon="account-group-outline"
          iconColor="#CCC"
          onPress={() => navigation.navigate(ROUTES.CUSTOMER_LIST)}
        />
        <View style={styles.activeTabContainer}>
          <IconButton icon="cog" iconColor="#4FD3B5" />
          <View style={styles.activeDot} />
        </View>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerBackground: {
    backgroundColor: '#61F2D5',
    height: 280,
    paddingTop: 45,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    zIndex: 10,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  headerText: { fontSize: 16, fontWeight: '700', color: '#222', opacity: 0.8 },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 30,
  },
  avatarSurface: { borderRadius: 25, padding: 4, backgroundColor: '#fff' },
  avatar: { backgroundColor: '#FF4B7D' },
  avatarLabel: { fontWeight: 'bold', color: '#fff' },
  profileText: { marginLeft: 20 },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#222', fontFamily: 'serif' },
  userRole: {
    fontSize: 12,
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
    marginTop: 4,
  },

  contentSheet: {
    flex: 1,
    marginTop: -40,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    zIndex: 5,
  },
  scroll: { flex: 1 },
  scrollPadding: { paddingHorizontal: 25, paddingTop: 40 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#BBB',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 5,
  },

  menuCard: {
    borderRadius: 22,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F8F8F8',
    overflow: 'hidden',
    marginBottom: 5,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    paddingRight: 10,
  },
  navLeft: { flexDirection: 'row', alignItems: 'center' },
  navIcon: { marginRight: 0 },
  navLabel: { fontSize: 15, fontWeight: '600' },
  rowDivider: { backgroundColor: '#F5F5F5', marginHorizontal: 20 },

  infoCard: { borderRadius: 22, backgroundColor: '#F9F9F9', paddingVertical: 10 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  infoKey: { fontSize: 14, color: '#999' },
  infoValue: { fontSize: 14, fontWeight: '700', color: '#333' },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 35,
    height: 60,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFE5EC',
  },
  logoutText: { color: '#FF4B7D', fontWeight: 'bold', fontSize: 15 },

  bottomNav: {
    position: 'absolute',
    bottom: 25,
    left: 25,
    right: 25,
    height: 65,
    borderRadius: 22,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 100,
  },
  activeTabContainer: { alignItems: 'center' },
  activeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#4FD3B5', marginTop: -8 },
});

export default SettingsScreen;
