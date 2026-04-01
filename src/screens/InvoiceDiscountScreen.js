import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Appbar, TextInput, Button, Card, Paragraph, HelperText } from 'react-native-paper';
import { ROUTES } from '../utils/constants';
import { discountsApi } from '../api';
import { CartSummary } from '../components';
import { useSnackbar } from '../hooks/useSnackbar';

const InvoiceDiscountScreen = ({ navigation, route }) => {
  const { customer, cart } = route.params;
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { showSnackbar } = useSnackbar();

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      setError('Please enter a coupon code');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const result = await discountsApi.validateCoupon({
        code: couponCode,
        customerId: customer.id,
        subtotal,
      });
      
      if (result.validation?.isValid) {
        setAppliedCoupon(result.coupon);
        setDiscountAmount(result.discount?.amount || 0);
        showSnackbar('Coupon applied successfully', 'success');
      } else {
        setError('Invalid or expired coupon');
      }
    } catch (err) {
      setError(err.message || 'Failed to validate coupon');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode('');
    setError('');
  };

  const handleContinue = () => {
    navigation.navigate(ROUTES.INVOICE_REVIEW, {
      customer,
      cart,
      coupon: appliedCoupon,
      discountAmount,
    });
  };

  const handleSkip = () => {
    navigation.navigate(ROUTES.INVOICE_REVIEW, {
      customer,
      cart,
      coupon: null,
      discountAmount: 0,
    });
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <View style={styles.headerLogo}>
          <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content
          title="Apply Discount"
          subtitle={`Step 3 of 4 • ${customer.name}`}
        />
      </Appbar.Header>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <Paragraph style={styles.sectionTitle}>Have a coupon code?</Paragraph>
            
            {!appliedCoupon ? (
              <>
                <TextInput
                  label="Coupon Code"
                  mode="outlined"
                  value={couponCode}
                  onChangeText={setCouponCode}
                  autoCapitalize="characters"
                  error={!!error}
                  style={styles.input}
                />
                <HelperText type="error" visible={!!error}>
                  {error}
                </HelperText>
                
                <Button
                  mode="contained"
                  onPress={handleValidateCoupon}
                  loading={loading}
                  disabled={loading || !couponCode.trim()}
                  style={styles.applyButton}
                >
                  Apply Coupon
                </Button>
              </>
            ) : (
              <Card mode="outlined" style={styles.appliedCouponCard}>
                <Card.Content>
                  <View style={styles.appliedCouponHeader}>
                    <Paragraph style={styles.appliedCouponCode}>
                      {appliedCoupon.code}
                    </Paragraph>
                    <Button mode="text" onPress={handleRemoveCoupon}>
                      Remove
                    </Button>
                  </View>
                  <Paragraph style={styles.appliedCouponDesc}>
                    {appliedCoupon.description}
                  </Paragraph>
                  {appliedCoupon.type === 'PERCENTAGE' && (
                    <Paragraph style={styles.discountValue}>
                      {appliedCoupon.value}% off
                    </Paragraph>
                  )}
                </Card.Content>
              </Card>
            )}
          </Card.Content>
        </Card>

        <CartSummary
          items={cart}
          discount={discountAmount}
          couponCode={appliedCoupon?.code}
          style={styles.summary}
        />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          mode="outlined"
          onPress={handleSkip}
          style={styles.skipButton}
        >
          Skip
        </Button>
        <Button
          mode="contained"
          onPress={handleContinue}
          style={styles.continueButton}
        >
          Continue
        </Button>
      </View>
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
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 4,
  },
  applyButton: {
    marginTop: 8,
  },
  appliedCouponCard: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4CAF50',
  },
  appliedCouponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appliedCouponCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  appliedCouponDesc: {
    marginTop: 4,
    color: '#666',
  },
  discountValue: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  summary: {
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
  skipButton: {
    flex: 1,
    paddingVertical: 8,
  },
  continueButton: {
    flex: 2,
    paddingVertical: 8,
  },
});

export default InvoiceDiscountScreen;

