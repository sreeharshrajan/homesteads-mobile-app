import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Text,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';

/**
 * ScreenTemplate Component
 * Standard layout for all screens in the Homesteads app.
 * Features a premium branded header and a floating content sheet.
 *
 * @param {Object} props
 * @param {string} props.title - Main title displayed in the header
 * @param {string} props.subtitle - Secondary text above the title
 * @param {React.ReactNode} props.headerContent - Custom content for the header area (e.g. stats, welcome info)
 * @param {React.ReactNode} props.headerAction - Custom action components in the top row (e.g. bell icon)
 * @param {boolean} props.showBackButton - Whether to show the back arrow
 * @param {boolean} props.showMenuButton - Whether to show the drawer menu icon
 * @param {string} props.headerColor - Color of the header background (defaults to #61F2D5)
 * @param {boolean} props.scrollable - Whether the content sheet should be scrollable
 * @param {boolean} props.loading - Loading state for refresh control
 * @param {Function} props.onRefresh - Pull-to-refresh callback
 * @param {React.ReactNode} props.footer - Floating footer component (e.g. bottom nav)
 * @param {React.ReactNode} props.children - Main screen content
 * @param {Object} props.containerStyle - Custom styles for the content container
 */
const ScreenTemplate = ({
  title,
  subtitle,
  headerContent,
  headerAction,
  showBackButton = false,
  showMenuButton = true,
  headerColor = '#61F2D5',
  scrollable = true,
  loading = false,
  onRefresh,
  footer,
  children,
  containerStyle,
}) => {
  const navigation = useNavigation();

  const Header = (
    <View style={[styles.headerBackground, { backgroundColor: headerColor }]}>
      <SafeAreaView>
        <View style={styles.topNav}>
          <View style={styles.topLeftActions}>
            {showBackButton && (
              <IconButton icon="arrow-left" iconColor="#333" onPress={() => navigation.goBack()} />
            )}
            {showMenuButton && (
              <IconButton icon="menu" iconColor="#333" onPress={() => navigation.openDrawer()} />
            )}
          </View>
          {headerAction && <View style={styles.topRightActions}>{headerAction}</View>}
        </View>

        {(title || subtitle) && (
          <View style={styles.headerTextGroup}>
            {subtitle && <Text style={styles.subTitle}>{subtitle}</Text>}
            {title && <Text style={styles.mainTitle}>{title}</Text>}
          </View>
        )}

        {headerContent && <View style={styles.customHeaderContent}>{headerContent}</View>}
      </SafeAreaView>
    </View>
  );

  const Content = scrollable ? (
    <ScrollView
      contentContainerStyle={[styles.scrollPadding, containerStyle]}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={loading} onRefresh={onRefresh} tintColor="#4FD3B5" />
        ) : undefined
      }
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.viewPadding, containerStyle]}>{children}</View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {Header}
      <View style={styles.contentSheet}>{Content}</View>
      {footer && <View style={styles.footerContainer}>{footer}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBackground: {
    minHeight: 220,
    paddingTop: 10,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    zIndex: 10,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  topLeftActions: {
    flexDirection: 'row',
  },
  topRightActions: {
    flexDirection: 'row',
  },
  headerTextGroup: {
    paddingHorizontal: 25,
    marginTop: 5,
  },
  subTitle: {
    fontSize: 14,
    color: '#444',
    opacity: 0.7,
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#222',
  },
  customHeaderContent: {
    paddingHorizontal: 25,
    marginTop: 10,
  },
  contentSheet: {
    flex: 1,
    marginTop: -45,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    zIndex: 5,
    overflow: 'hidden',
  },
  scrollPadding: {
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 120,
  },
  viewPadding: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 120,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 100,
  },
});

export default ScreenTemplate;
