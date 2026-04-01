import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import { IconButton, Surface, Divider, Avatar, ActivityIndicator } from 'react-native-paper';
import { formatCurrency, formatDate } from '@utils/formatters';
import { useInvoices } from '@hooks';
import { useSnackbar } from '@hooks/useSnackbar';
import { StatusBadge, EmptyState } from '@components';

const InvoiceScreen = ({ navigation, route }) => {
  const invoiceId = route.params?.invoiceId;
  const [localInvoice, setLocalInvoice] = useState(null);

  const { invoice, loading, fetchInvoiceById, updateInvoice } = useInvoices();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (invoiceId) loadInvoice();
  }, [invoiceId]);

  useEffect(() => {
    if (invoice) setLocalInvoice(invoice);
  }, [invoice]);

  const loadInvoice = async () => {
    const result = await fetchInvoiceById(invoiceId);
    if (!result.success) {
      showSnackbar(result.error || 'Failed to load invoice', 'error');
      if (result.status !== 500 && result.status !== 503) {
        setTimeout(() => navigation.goBack(), 2000);
      }
    }
  };

  const handleMarkAsPaid = async () => {
    const result = await updateInvoice(invoiceId, { status: 'PAID' });
    if (result.success) {
      showSnackbar('Invoice marked as paid', 'success');
      setLocalInvoice({ ...localInvoice, status: 'PAID' });
    }
  };

  if (loading && !localInvoice) {
    return (
      <View style={styles.loadingFull}>
        <ActivityIndicator size="large" color="#4FD3B5" />
      </View>
    );
  }

  if (!localInvoice) {
    return (
      <View style={styles.container}>
        <EmptyState icon="file-document-outline" title="Not Found" message="Unable to load invoice" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 1. PREMIUM HEADER */}
      <View style={styles.headerBackground}>
        <View style={styles.topNav}>
          <IconButton icon="arrow-left" iconColor="#333" onPress={() => navigation.goBack()} />
          <IconButton icon="download-outline" iconColor="#333" onPress={() => { }} />
        </View>

        <View style={styles.headerTextGroup}>
          <View style={styles.titleRow}>
            <Text style={styles.mainTitle}>{localInvoice.invoiceNo}</Text>
            <View style={styles.badgeWrapper}>
              <StatusBadge status={localInvoice.status} />
            </View>
          </View>
          <Text style={styles.subTitle}>Invoice details and history</Text>
        </View>
      </View>

      {/* 2. CONTENT SHEET */}
      <View style={styles.contentSheet}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollPadding} showsVerticalScrollIndicator={false}>

          {/* Customer Summary Card */}
          <Text style={styles.sectionLabel}>Customer</Text>
          <Surface style={styles.infoCard} elevation={1}>
            <View style={styles.customerRow}>
              <Avatar.Text
                size={45}
                label={localInvoice.customer?.name?.substring(0, 2).toUpperCase() || 'CU'}
                style={styles.avatar}
                labelStyle={styles.avatarLabel}
              />
              <View style={styles.customerDetails}>
                <Text style={styles.customerName}>{localInvoice.customer?.name}</Text>
                <Text style={styles.customerEmail}>{localInvoice.customer?.email}</Text>
              </View>
            </View>
          </Surface>

          {/* Logistics & Dates */}
          <View style={styles.metaGrid}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Issued</Text>
              <Text style={styles.metaValue}>{formatDate(localInvoice.issueDate)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Due Date</Text>
              <Text style={styles.metaValue}>{localInvoice.dueDate ? formatDate(localInvoice.dueDate) : 'N/A'}</Text>
            </View>
          </View>

          {/* Items Section */}
          <Text style={[styles.sectionLabel, { marginTop: 25 }]}>Billing Items</Text>
          {localInvoice.order?.orderItems?.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemMain}>
                <Text style={styles.itemName}>{item.variant?.product?.name || item.productName}</Text>
                <Text style={styles.itemSub}>Qty: {item.quantity} × {formatCurrency(item.unitPrice)}</Text>
              </View>
              <Text style={styles.itemTotal}>{formatCurrency(item.netAmount || item.totalPrice)}</Text>
            </View>
          ))}

          <Divider style={styles.divider} />

          {/* Totals Summary */}
          <View style={styles.totalsContainer}>
            <View style={styles.totalLine}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>{formatCurrency(localInvoice.order?.subtotal || 0)}</Text>
            </View>
            {localInvoice.order?.taxAmount > 0 && (
              <View style={styles.totalLine}>
                <Text style={styles.totalLabel}>Tax</Text>
                <Text style={styles.totalValue}>{formatCurrency(localInvoice.order.taxAmount)}</Text>
              </View>
            )}
            <View style={[styles.totalLine, styles.grandTotalLine]}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>{formatCurrency(localInvoice.totalAmount)}</Text>
            </View>
          </View>

          {localInvoice.remarks && (
            <View style={styles.remarksSection}>
              <Text style={styles.sectionLabel}>Notes</Text>
              <Text style={styles.remarksText}>{localInvoice.remarks}</Text>
            </View>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>
      </View>

      {/* 3. PERSISTENT ACTION FOOTER */}
      {localInvoice.status !== 'PAID' && localInvoice.status !== 'CANCELLED' && (
        <Surface style={styles.footer} elevation={8}>
          <TouchableOpacity style={styles.payButton} onPress={handleMarkAsPaid}>
            <IconButton icon="check-decagram" iconColor="#fff" size={20} />
            <Text style={styles.payButtonText}>Mark as Paid</Text>
          </TouchableOpacity>
        </Surface>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingFull: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerBackground: {
    backgroundColor: '#61F2D5',
    height: 220,
    paddingTop: 45,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    zIndex: 10,
  },
  topNav: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 },
  headerTextGroup: { paddingHorizontal: 25, marginTop: 15 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  mainTitle: { fontSize: 28, fontWeight: 'bold', color: '#222', fontFamily: 'serif' },
  subTitle: { fontSize: 13, color: '#444', opacity: 0.7, marginTop: 4 },
  badgeWrapper: { scaleX: 0.9, scaleY: 0.9, marginRight: -10 },

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
  sectionLabel: { fontSize: 12, fontWeight: 'bold', color: '#BBB', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },

  infoCard: { borderRadius: 20, backgroundColor: '#fff', padding: 15, borderWidth: 1, borderColor: '#F8F8F8', marginBottom: 20 },
  customerRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { backgroundColor: '#F0FFFC' },
  avatarLabel: { color: '#4FD3B5', fontWeight: 'bold' },
  customerDetails: { marginLeft: 15 },
  customerName: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  customerEmail: { fontSize: 12, color: '#888' },

  metaGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  metaItem: { flex: 1 },
  metaLabel: { fontSize: 11, color: '#BBB', textTransform: 'uppercase' },
  metaValue: { fontSize: 14, color: '#333', fontWeight: '600', marginTop: 2 },

  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  itemName: { fontSize: 14, fontWeight: '700', color: '#333' },
  itemSub: { fontSize: 12, color: '#999', marginTop: 2 },
  itemTotal: { fontSize: 14, fontWeight: '700', color: '#222' },

  divider: { marginVertical: 15, backgroundColor: '#F0F0F0' },

  totalsContainer: { marginTop: 10 },
  totalLine: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalLabel: { fontSize: 14, color: '#888' },
  totalValue: { fontSize: 14, color: '#333', fontWeight: '600' },
  grandTotalLine: { marginTop: 10, paddingTop: 10, borderTopWidth: 0 },
  grandTotalLabel: { fontSize: 16, fontWeight: 'bold', color: '#222' },
  grandTotalValue: { fontSize: 20, fontWeight: 'bold', color: '#4FD3B5' },

  remarksSection: { marginTop: 25, backgroundColor: '#F9F9F9', padding: 15, borderRadius: 15 },
  remarksText: { fontSize: 13, color: '#666', lineHeight: 18 },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    paddingBottom: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: 'center',
  },
  payButton: {
    backgroundColor: '#333',
    height: 55,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: -5 },
});

export default InvoiceScreen;