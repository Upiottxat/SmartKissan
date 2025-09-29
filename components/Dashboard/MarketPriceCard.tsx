import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const MARKET_DATA = [
  { crop: 'Rice (Common)', icon: '🌾', price: 2100, change: 50, isPositive: true },
  { crop: 'Rice (Premium)', icon: '🌾', price: 2350, change: -25, isPositive: false },
];

/**
 * @description Card component for displaying current market prices of crops.
 */
const MarketPriceCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleContainer}>
          <Ionicons name="trending-up-outline" size={20} color="#16a34a" />
          <Text style={styles.cardTitle}>Market Prices</Text>
        </View>
        <Text style={styles.updateTime}>Updated 2h ago</Text>
      </View>
      <View style={styles.marketList}>
        {MARKET_DATA.map((item, index) => (
          <View key={index} style={styles.marketItem}>
            <View style={styles.marketItemLeft}>
              <Text style={styles.marketIcon}>{item.icon}</Text>
              <Text style={styles.marketCrop}>{item.crop}</Text>
            </View>
            <View style={styles.marketItemRight}>
              <Text style={styles.marketPrice}>₹{item.price.toLocaleString()}/qtl</Text>
              <View style={styles.marketChange}>
                <Ionicons
                  name={item.isPositive ? 'arrow-up' : 'arrow-down'}
                  size={12}
                  color={item.isPositive ? '#22c55e' : '#ef4444'}
                />
                <Text style={[styles.marketChangeText, { color: item.isPositive ? '#22c55e' : '#ef4444' }]}>
                  {item.isPositive ? '+' : ''}₹{Math.abs(item.change)}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  updateTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  marketList: {
    gap: 8,
  },
  marketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
  },
  marketItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  marketIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  marketCrop: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  marketItemRight: {
    alignItems: 'flex-end',
  },
  marketPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  marketChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  marketChangeText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
});

export default MarketPriceCard;
