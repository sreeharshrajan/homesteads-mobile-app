import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Title, Paragraph, List } from 'react-native-paper';

/**
 * Section component for displaying real-time alerts.
 */
const AlertSection = ({ alerts = [] }) => {
  if (alerts.length === 0) return null;

  return (
    <Surface style={styles.card}>
      <View style={styles.container}>
        <Title style={styles.cardTitle}>Real-time Alerts</Title>
        <View style={styles.alertList}>
          {alerts.map(
            (alert, index) =>
              alert.value > 0 && (
                <Surface key={index} style={[styles.alertCard, { borderLeftColor: alert.color }]}>
                  <Paragraph style={styles.alertValue}>{alert.value}</Paragraph>
                  <Paragraph style={styles.alertLabel}>{alert.label}</Paragraph>
                </Surface>
              )
          )}
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#ffffff',
    padding: 16,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  alertList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  alertCard: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 4,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  alertValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  alertLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
});

export default AlertSection;
