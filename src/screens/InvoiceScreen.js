import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Card, Title, Paragraph, Button, Appbar, Divider, DataTable, ActivityIndicator } from 'react-native-paper';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useInvoices } from '../hooks';
import { useSnackbar } from '../hooks/useSnackbar';
import { StatusBadge, EmptyState } from '../components';

const InvoiceScreen = ({ navigation, route }) => {
  const invoiceId = route.params?.invoiceId;
  const [localInvoice, setLocalInvoice] = useState(null);
  
  const { invoice, loading, fetchInvoiceById, updateInvoice } = useInvoices();
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (invoiceId) {
      loadInvoice();
    }
  }, [invoiceId]);

  useEffect(() => {
    if (invoice) {
      setLocalInvoice(invoice);
    }
  }, [invoice]);

  const loadInvoice = async () => {
    const result = await fetchInvoiceById(invoiceId);
    if (!result.success) {
      const errorMsg = result.error || 'Failed to load invoice';
      showSnackbar(errorMsg, 'error');
      
      // Don't automatically go back for server errors - give user chance to retry
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
    } else {
      showSnackbar(result.error || 'Failed to update invoice', 'error');
    }
  };

  const handleDownload = () => {
    showSnackbar('Download feature coming soon', 'info');
  };

  if (loading && !localInvoice) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <View style={styles.headerLogo}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} />
          </View>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Invoice Details" />
        </Appbar.Header>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </View>
    );
  }

  if (!localInvoice) {
    return (
      <View style={styles.container}>
        <Appbar.Header>
          <View style={styles.headerLogo}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} />
          </View>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Invoice Details" />
        </Appbar.Header>
        <EmptyState
          icon="file-document-outline"
          title="Invoice not found"
          message="Unable to load invoice details"
        />
        <Button
          mode="outlined"
          onPress={loadInvoice}
          loading={loading}
          disabled={loading}
          style={styles.retryButton}
        >
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <View style={styles.headerLogo}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
        </View>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Invoice Details" />
        <Appbar.Action icon="download" onPress={handleDownload} />
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.headerRow}>
              <Title style={styles.invoiceNumber}>{localInvoice.invoiceNo}</Title>
              <StatusBadge status={localInvoice.status} />
            </View>
            
            {localInvoice.customer && (
              <View style={styles.section}>
                <Paragraph style={styles.sectionTitle}>Bill To:</Paragraph>
                <Title>{localInvoice.customer.name}</Title>
                {localInvoice.customer.email && (
                  <Paragraph>{localInvoice.customer.email}</Paragraph>
                )}
                {localInvoice.customer.phone && (
                  <Paragraph>{localInvoice.customer.phone}</Paragraph>
                )}
                {localInvoice.customer.companyName && (
                  <Paragraph>{localInvoice.customer.companyName}</Paragraph>
                )}
                {localInvoice.customer.gstNumber && (
                  <Paragraph>GST: {localInvoice.customer.gstNumber}</Paragraph>
                )}
              </View>
            )}

            <Divider style={styles.divider} />

            <View style={styles.datesRow}>
              <View style={styles.dateColumn}>
                <Paragraph style={styles.label}>Issue Date</Paragraph>
                <Paragraph>{formatDate(localInvoice.issueDate)}</Paragraph>
              </View>
              {localInvoice.dueDate && (
                <View style={styles.dateColumn}>
                  <Paragraph style={styles.label}>Due Date</Paragraph>
                  <Paragraph>{formatDate(localInvoice.dueDate)}</Paragraph>
                </View>
              )}
            </View>

            {localInvoice.poNumber && (
              <View style={styles.row}>
                <Paragraph style={styles.label}>PO Number:</Paragraph>
                <Paragraph>{localInvoice.poNumber}</Paragraph>
              </View>
            )}

            {localInvoice.placeOfSupply && (
              <View style={styles.row}>
                <Paragraph style={styles.label}>Place of Supply:</Paragraph>
                <Paragraph>{localInvoice.placeOfSupply}</Paragraph>
              </View>
            )}

            <Divider style={styles.divider} />

            {localInvoice.order && Array.isArray(localInvoice.order.orderItems) && localInvoice.order.orderItems.length > 0 ? (
              <>
                <Paragraph style={styles.sectionTitle}>Items</Paragraph>
                <DataTable>
                  <DataTable.Header>
                    <DataTable.Title>Product</DataTable.Title>
                    <DataTable.Title numeric>Qty</DataTable.Title>
                    <DataTable.Title numeric>Price</DataTable.Title>
                    <DataTable.Title numeric>Total</DataTable.Title>
                  </DataTable.Header>

                  {localInvoice.order.orderItems.map((item) => (
                    <DataTable.Row key={item.id}>
                      <DataTable.Cell>
                        {item.variant?.product?.name || item.productName || 'Product'}
                      </DataTable.Cell>
                      <DataTable.Cell numeric>{item.quantity || 0}</DataTable.Cell>
                      <DataTable.Cell numeric>
                        {formatCurrency(item.unitPrice || 0)}
                      </DataTable.Cell>
                      <DataTable.Cell numeric>
                        {formatCurrency(item.netAmount || item.totalPrice || 0)}
                      </DataTable.Cell>
                    </DataTable.Row>
                  ))}
                </DataTable>

                <Divider style={styles.divider} />

                <View style={styles.totalsSection}>
                  <View style={styles.totalRow}>
                    <Paragraph>Subtotal:</Paragraph>
                    <Paragraph>{formatCurrency(localInvoice.order.subtotal || 0)}</Paragraph>
                  </View>
                  {(localInvoice.order.discountAmt || 0) > 0 && (
                    <View style={styles.totalRow}>
                      <Paragraph>Discount:</Paragraph>
                      <Paragraph>-{formatCurrency(localInvoice.order.discountAmt || 0)}</Paragraph>
                    </View>
                  )}
                  {(localInvoice.order.taxAmount || 0) > 0 && (
                    <View style={styles.totalRow}>
                      <Paragraph>Tax:</Paragraph>
                      <Paragraph>{formatCurrency(localInvoice.order.taxAmount || 0)}</Paragraph>
                    </View>
                  )}
                </View>
              </>
            ) : null}

            <Divider style={styles.divider} />

            <View style={styles.totalRow}>
              <Title>Total:</Title>
              <Title style={styles.totalAmount}>
                {formatCurrency(localInvoice.totalAmount || 0)}
              </Title>
            </View>

            {localInvoice.remarks && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.section}>
                  <Paragraph style={styles.sectionTitle}>Remarks:</Paragraph>
                  <Paragraph>{localInvoice.remarks}</Paragraph>
                </View>
              </>
            )}

            {Array.isArray(localInvoice.payments) && localInvoice.payments.length > 0 && (
              <>
                <Divider style={styles.divider} />
                <View style={styles.section}>
                  <Paragraph style={styles.sectionTitle}>Payment History:</Paragraph>
                  {localInvoice.payments.map((payment, index) => (
                    <View key={payment.id || `payment-${index}`} style={styles.paymentRow}>
                      <View>
                        <Paragraph>{payment.method || 'N/A'}</Paragraph>
                        <Paragraph style={styles.label}>
                          {payment.paidAt ? formatDate(payment.paidAt) : 'Pending'}
                        </Paragraph>
                      </View>
                      <View style={styles.paymentRight}>
                        <Paragraph style={styles.paymentAmount}>
                          {formatCurrency(payment.amount || 0)}
                        </Paragraph>
                        {payment.status && <StatusBadge status={payment.status} style={styles.paymentBadge} />}
                      </View>
                    </View>
                  ))}
                </View>
              </>
            )}
          </Card.Content>
        </Card>

        {localInvoice.status !== 'PAID' && localInvoice.status !== 'CANCELLED' && (
          <Button
            mode="contained"
            onPress={handleMarkAsPaid}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Mark as Paid
          </Button>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerLogo: {
    marginLeft: 8,
    marginRight: 8,
  },
  logo: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  invoiceNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  divider: {
    marginVertical: 16,
  },
  datesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dateColumn: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  totalsSection: {
    marginTop: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  paymentRight: {
    alignItems: 'flex-end',
  },
  paymentAmount: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  paymentBadge: {
    height: 24,
  },
  button: {
    margin: 16,
    marginTop: 0,
    paddingVertical: 8,
  },
  retryButton: {
    margin: 16,
    marginTop: 16,
  },
});

export default InvoiceScreen;
