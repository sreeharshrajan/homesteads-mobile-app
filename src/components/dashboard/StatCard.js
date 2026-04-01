import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Title, Paragraph } from 'react-native-paper';

/**
 * A reusable card for displaying individual statistics on the dashboard.
 * Following the minimalistic design chosen in DashboardScreen.js.
 */
const StatCard = ({ title, value, color = '#1a1a1a', subValue = null }) => (
  <Surface style={[styles.statCard]}>
    <View style={styles.statCardContent}>
      <View style={styles.statCardHeader}>
        <Paragraph style={styles.statCardTitle}>{title}</Paragraph>
      </View>
      <Title style={styles.statCardValue}>{value}</Title>
      {subValue && <Paragraph style={styles.statCardSubValue}>{subValue}</Paragraph>}
    </View>
  </Surface>
);

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 4,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#ffffff',
    marginBottom: 16,
    marginHorizontal: 4,
  },
  statCardContent: {
    flex: 1,
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statCardTitle: {
    fontSize: 12,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statCardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statCardSubValue: {
    fontSize: 12,
    color: '#666666',
  },
});

export default StatCard;
