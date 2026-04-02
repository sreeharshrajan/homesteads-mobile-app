import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  TextInput as RNTextInput,
} from 'react-native';
import { IconButton, Surface, Button, Divider, HelperText } from 'react-native-paper';
import { ROUTES } from '@utils/constants';
import { discountsApi } from '@api';
import { CartSummary } from '@components';
import { useSnackbar } from '@hooks/useSnackbar';

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
      {/* 1. BRANDED HEADER */}
      <View style={styles.headerBackground}>
        <View style={styles.topNav}>
          <IconButton icon="arrow-left" iconColor="#333" onPress={() => navigation.goBack()} />
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>Step 3 of 4</Text>
          </View>
        </View>

        <View style={styles.headerTextGroup}>
          <Text style={styles.subTitle}>{customer.name}</Text>
          <Text style={styles.mainTitle}>Apply Discount</Text>
        </View>
      </View>

      {/* 2. CONTENT AREA */}
      <View style={styles.contentSheet}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollPadding}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Promo Code</Text>

          <Surface style={styles.inputCard} elevation={1}>
            {!appliedCoupon ? (
              <View style={styles.inputRow}>
                <RNTextInput
                  placeholder="Enter code (e.g. SAVE20)"
                  placeholderTextColor="#AAA"
                  value={couponCode}
                  onChangeText={(val) => {
                    setCouponCode(val);
                    setError('');
                  }}
                  autoCapitalize="characters"
                  style={styles.rawInput}
                />
                <TouchableOpacity
                  onPress={handleValidateCoupon}
                  disabled={loading || !couponCode.trim()}
                  style={[
                    styles.applyBtn,
                    (!couponCode.trim() || loading) && styles.applyBtnDisabled,
                  ]}
                >
                  <Text style={styles.applyBtnText}>{loading ? '...' : 'Apply'}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.appliedContainer}>
                <View style={styles.appliedInfo}>
                  <View style={styles.badge}>
                    <IconButton icon="ticket-percent" size={16} iconColor="#4FD3B5" />
                    <Text style={styles.appliedCodeText}>{appliedCoupon.code}</Text>
                  </View>
                  <Text style={styles.appliedDesc}>{appliedCoupon.description}</Text>
                </View>
                <TouchableOpacity onPress={handleRemoveCoupon}>
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          </Surface>

          <HelperText type="error" visible={!!error} style={styles.errorText}>
            {error}
          </HelperText>

          <View style={styles.summarySection}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <CartSummary
              items={cart}
              discount={discountAmount}
              couponCode={appliedCoupon?.code}
              style={styles.summary}
            />
          </View>
        </ScrollView>
      </View>

      {/* 3. PREMIUM FOOTER */}
      <Surface style={styles.footer} elevation={4}>
        <Button mode="text" onPress={handleSkip} textColor="#999" style={styles.skipButton}>
          Skip Discount
        </Button>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueText}>Review Invoice</Text>
          <IconButton icon="chevron-right" iconColor="#fff" size={20} />
        </TouchableOpacity>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerBackground: {
    backgroundColor: '#61F2D5',
    height: 200,
    paddingTop: 45,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    zIndex: 10,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  stepIndicator: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 20,
  },
  stepText: { fontSize: 11, fontWeight: 'bold', color: '#333', textTransform: 'uppercase' },
  headerTextGroup: { paddingHorizontal: 25, marginTop: 10 },
  subTitle: { fontSize: 13, color: '#444', opacity: 0.7 },
  mainTitle: { fontSize: 26, fontWeight: 'bold', color: '#222', fontFamily: 'serif' },

  contentSheet: {
    flex: 1,
    marginTop: -40,
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    zIndex: 5,
  },
  scroll: { flex: 1 },
  scrollPadding: { paddingHorizontal: 25, paddingTop: 40, paddingBottom: 100 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#222', marginBottom: 15 },

  inputCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingLeft: 12 },
  rawInput: { flex: 1, height: 45, fontSize: 15, color: '#333', fontWeight: '600' },
  applyBtn: {
    backgroundColor: '#4FD3B5',
    paddingHorizontal: 20,
    height: 40,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtnDisabled: { backgroundColor: '#EEE' },
  applyBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },

  appliedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  appliedInfo: { flex: 1 },
  badge: { flexDirection: 'row', alignItems: 'center', marginLeft: -10 },
  appliedCodeText: { fontSize: 16, fontWeight: 'bold', color: '#222', marginLeft: -8 },
  appliedDesc: { fontSize: 12, color: '#888', marginLeft: 8 },
  removeText: { color: '#FF4B7D', fontWeight: 'bold', marginRight: 10 },

  errorText: { marginLeft: 10 },
  summarySection: { marginTop: 20 },
  summary: { backgroundColor: 'transparent' },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  skipButton: { flex: 1 },
  continueButton: {
    flex: 2,
    backgroundColor: '#333',
    height: 55,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 15,
  },
  continueText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default InvoiceDiscountScreen;
