import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MarketData {
  crop: string;
  icon: string;
  currentPrice: number;
  previousPrice: number;
  change: number;
  trend: 'up' | 'down';
  markets: Array<{
    name: string;
    price: number;
    updated: string;
  }>;
}

interface GovtScheme {
  id: number;
  title: string;
  description: string;
  status: string;
  deadline: string;
  amount: string;
  eligibility: string;
  icon: string;
  category: string;
}

export default function Market() {
  const [activeTab, setActiveTab] = useState<'markets' | 'schemes'>('markets');

  const marketData: MarketData[] = [
    {
      crop: 'Wheat',
      icon: '🌾',
      currentPrice: 2150,
      previousPrice: 2040,
      change: 5.4,
      trend: 'up',
      markets: [
        { name: 'Delhi Azadpur', price: 2150, updated: '2 mins ago' },
        { name: 'Punjab Khanna', price: 2100, updated: '5 mins ago' },
        { name: 'Haryana Karnal', price: 2180, updated: '10 mins ago' },
      ],
    },
    {
      crop: 'Rice',
      icon: '🍚',
      currentPrice: 3200,
      previousPrice: 3270,
      change: -2.1,
      trend: 'down',
      markets: [
        { name: 'Punjab Amritsar', price: 3200, updated: '1 min ago' },
        { name: 'Haryana Kurukshetra', price: 3250, updated: '3 mins ago' },
        { name: 'UP Meerut', price: 3180, updated: '8 mins ago' },
      ],
    },
    {
      crop: 'Corn',
      icon: '🌽',
      currentPrice: 1850,
      previousPrice: 1700,
      change: 8.8,
      trend: 'up',
      markets: [
        { name: 'Bihar Patna', price: 1850, updated: '4 mins ago' },
        { name: 'MP Bhopal', price: 1820, updated: '6 mins ago' },
        { name: 'Karnataka Bangalore', price: 1900, updated: '12 mins ago' },
      ],
    },
  ];

  const govtSchemes: GovtScheme[] = [
    {
      id: 1,
      title: 'PM-KISAN Benefit Transfer',
      description: 'Direct income support of ₹6000 per year to farmer families',
      status: 'Active',
      deadline: '31 Dec 2024',
      amount: '₹6,000/year',
      eligibility: 'All landholding farmer families',
      icon: '💰',
      category: 'Income Support',
    },
    {
      id: 2,
      title: 'Pradhan Mantri Crop Insurance Scheme',
      description: 'Comprehensive risk solution for crops against natural calamities',
      status: 'Registration Open',
      deadline: '15 Nov 2024',
      amount: 'Up to ₹2,00,000',
      eligibility: 'All farmers (sharecroppers included)',
      icon: '🛡️',
      category: 'Insurance',
    },
    {
      id: 3,
      title: 'Drip Irrigation Subsidy',
      description: 'Financial assistance for micro irrigation systems',
      status: 'Available',
      deadline: 'Ongoing',
      amount: '40-55% subsidy',
      eligibility: 'Small & marginal farmers',
      icon: '💧',
      category: 'Infrastructure',
    },
  ];

  const priceAlerts = [
    { crop: 'Wheat', targetPrice: 2200, currentPrice: 2150, status: 'below' as const },
    { crop: 'Rice', targetPrice: 3000, currentPrice: 3200, status: 'above' as const },
  ];

  const renderMarketTab = () => (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
      {/* Price Alerts */}
      {priceAlerts.length > 0 && (
        <View style={styles.alertsCard}>
          <View style={styles.alertsHeader}>
            <Ionicons name="notifications-outline" size={20} color="#FF9800" />
            <Text style={styles.alertsTitle}>Price Alerts</Text>
          </View>
          {priceAlerts.map((alert, index) => (
            <View key={index} style={styles.alertItem}>
              <Text style={styles.alertText}>
                {alert.crop}: Target ₹{alert.targetPrice}
              </Text>
              <View
                style={[
                  styles.alertStatus,
                  alert.status === 'above' ? styles.alertStatusSuccess : styles.alertStatusWarning,
                ]}
              >
                <Text
                  style={[
                    styles.alertStatusText,
                    alert.status === 'above'
                      ? styles.alertStatusTextSuccess
                      : styles.alertStatusTextWarning,
                  ]}
                >
                  {alert.status === 'above' ? 'Above target' : 'Below target'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Market Prices */}
      {marketData.map((item, index) => (
        <View key={index} style={styles.marketCard}>
          <View style={styles.marketHeader}>
            <View style={styles.marketInfo}>
              <Text style={styles.marketIcon}>{item.icon}</Text>
              <View>
                <Text style={styles.marketCrop}>{item.crop}</Text>
                <Text style={styles.marketUnit}>per quintal</Text>
              </View>
            </View>
            <View style={styles.marketPrice}>
              <Text style={styles.priceValue}>₹{item.currentPrice.toLocaleString()}</Text>
              <View style={styles.priceChange}>
                <Ionicons
                  name={item.trend === 'up' ? 'trending-up' : 'trending-down'}
                  size={16}
                  color={item.trend === 'up' ? '#4CAF50' : '#F44336'}
                />
                <Text
                  style={[
                    styles.changeText,
                    { color: item.trend === 'up' ? '#4CAF50' : '#F44336' },
                  ]}
                >
                  {Math.abs(item.change)}%
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.marketsContainer}>
            <Text style={styles.marketsLabel}>Major Markets:</Text>
            {item.markets.map((market, idx) => (
              <View key={idx} style={styles.marketItem}>
                <View style={styles.marketItemInfo}>
                  <Ionicons name="location-outline" size={12} color="#666" />
                  <Text style={styles.marketName}>{market.name}</Text>
                </View>
                <View style={styles.marketItemPrice}>
                  <Text style={styles.marketPrice}>₹{market.price.toLocaleString()}</Text>
                  <Text style={styles.marketUpdated}>{market.updated}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.marketActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="trending-up-outline" size={16} color="#666" />
              <Text style={styles.actionButtonText}>Price History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="notifications-outline" size={16} color="#666" />
              <Text style={styles.actionButtonText}>Set Alert</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickAction}>
          <Ionicons name="car-outline" size={24} color="#666" />
          <Text style={styles.quickActionText}>Find Buyers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Ionicons name="business-outline" size={24} color="#666" />
          <Text style={styles.quickActionText}>Nearby Mandis</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderSchemesTab = () => (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.tabContent}>
      {/* Scheme Cards */}
      {govtSchemes.map(scheme => (
        <View key={scheme.id} style={styles.schemeCard}>
          <View style={styles.schemeHeader}>
            <View style={styles.schemeInfo}>
              <Text style={styles.schemeIcon}>{scheme.icon}</Text>
              <View style={styles.schemeTitleContainer}>
                <Text style={styles.schemeTitle}>{scheme.title}</Text>
                <View
                  style={[
                    styles.schemeStatus,
                    scheme.status === 'Active' ? styles.schemeStatusActive : styles.schemeStatusInactive,
                  ]}
                >
                  <Text
                    style={[
                      styles.schemeStatusText,
                      scheme.status === 'Active'
                        ? styles.schemeStatusTextActive
                        : styles.schemeStatusTextInactive,
                    ]}
                  >
                    {scheme.status}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.schemeCategory}>
              <Text style={styles.schemeCategoryText}>{scheme.category}</Text>
            </View>
          </View>

          <Text style={styles.schemeDescription}>{scheme.description}</Text>

          <View style={styles.schemeDetails}>
            <View style={styles.schemeDetail}>
              <Text style={styles.schemeDetailLabel}>Benefit Amount:</Text>
              <Text style={styles.schemeDetailValue}>{scheme.amount}</Text>
            </View>
            <View style={styles.schemeDetail}>
              <Text style={styles.schemeDetailLabel}>Deadline:</Text>
              <Text style={styles.schemeDetailValueOrange}>{scheme.deadline}</Text>
            </View>
          </View>

          <View style={styles.eligibilityContainer}>
            <Text style={styles.eligibilityLabel}>Eligibility:</Text>
            <Text style={styles.eligibilityText}>{scheme.eligibility}</Text>
          </View>

          <View style={styles.schemeActions}>
            <TouchableOpacity style={styles.schemePrimaryButton}>
              <Ionicons name="open-outline" size={14} color="#fff" />
              <Text style={styles.schemePrimaryButtonText}>Apply Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.schemeSecondaryButton}>
              <Ionicons name="document-text-outline" size={14} color="#666" />
              <Text style={styles.schemeSecondaryButtonText}>Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Application Status */}
      <View style={styles.applicationStatus}>
        <Text style={styles.applicationStatusTitle}>Your Applications</Text>
        <View style={styles.applicationItem}>
          <Text style={styles.applicationName}>PM-KISAN</Text>
          <View style={styles.applicationStatusBadge}>
            <Text style={styles.applicationStatusText}>Approved</Text>
          </View>
        </View>
        <View style={styles.applicationItem}>
          <Text style={styles.applicationName}>Crop Insurance</Text>
          <View style={[styles.applicationStatusBadge, styles.applicationStatusBadgePending]}>
            <Text style={[styles.applicationStatusText, styles.applicationStatusTextPending]}>
              Pending
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.trackButton}>
          <Text style={styles.trackButtonText}>Track All Applications</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: '#4CAF50' }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Market & Schemes</Text>
            <Text style={styles.headerSubtitle}>Live prices • Government benefits</Text>
          </View>
          <TouchableOpacity style={styles.alertButton}>
            <Ionicons name="notifications-outline" size={16} color="#4CAF50" />
            <Text style={styles.alertButtonText}>Alerts</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'markets' && styles.tabActive]}
          onPress={() => setActiveTab('markets')}
        >
          <Ionicons
            name="trending-up-outline"
            size={20}
            color={activeTab === 'markets' ? '#4CAF50' : '#666'}
          />
          <Text style={[styles.tabText, activeTab === 'markets' && styles.tabTextActive]}>
            Market Prices
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'schemes' && styles.tabActive]}
          onPress={() => setActiveTab('schemes')}
        >
          <Ionicons
            name="gift-outline"
            size={20}
            color={activeTab === 'schemes' ? '#4CAF50' : '#666'}
          />
          <Text style={[styles.tabText, activeTab === 'schemes' && styles.tabTextActive]}>
            Govt Schemes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {activeTab === 'markets' ? renderMarketTab() : renderSchemesTab()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 40,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  alertButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  alertButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4CAF50',
  },
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  tabActive: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  tabTextActive: {
    color: '#4CAF50',
  },
  content: {
    flex: 1,
    marginTop: 16,
  },
  tabContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  alertsCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  alertsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  alertsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E65100',
  },
  alertItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertText: {
    fontSize: 12,
    color: '#5D4037',
  },
  alertStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  alertStatusSuccess: {
    backgroundColor: '#4CAF50',
  },
  alertStatusWarning: {
    backgroundColor: '#FF9800',
  },
  alertStatusText: {
    fontSize: 10,
    fontWeight: '500',
  },
  alertStatusTextSuccess: {
    color: '#fff',
  },
  alertStatusTextWarning: {
    color: '#fff',
  },
  marketCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  marketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  marketInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  marketIcon: {
    fontSize: 24,
  },
  marketCrop: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  marketUnit: {
    fontSize: 12,
    color: '#666',
  },
  marketPrice: {
    alignItems: 'flex-end',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  priceChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  marketsContainer: {
    marginBottom: 16,
  },
  marketsLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 8,
  },
  marketItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  marketItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  marketName: {
    fontSize: 12,
    color: '#1a1a1a',
  },
  marketItemPrice: {
    alignItems: 'flex-end',
  },
  marketUpdated: {
    fontSize: 10,
    color: '#666',
  },
  marketActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quickActionText: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  schemeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  schemeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  schemeInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 12,
  },
  schemeIcon: {
    fontSize: 24,
  },
  schemeTitleContainer: {
    flex: 1,
  },
  schemeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    lineHeight: 18,
    marginBottom: 4,
  },
  schemeStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  schemeStatusActive: {
    backgroundColor: '#E8F5E8',
  },
  schemeStatusInactive: {
    backgroundColor: '#F0F0F0',
  },
  schemeStatusText: {
    fontSize: 10,
    fontWeight: '500',
  },
  schemeStatusTextActive: {
    color: '#4CAF50',
  },
  schemeStatusTextInactive: {
    color: '#666',
  },
  schemeCategory: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  schemeCategoryText: {
    fontSize: 10,
    color: '#666',
  },
  schemeDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 12,
  },
  schemeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  schemeDetail: {
    flex: 1,
  },
  schemeDetailLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  schemeDetailValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4CAF50',
  },
  schemeDetailValueOrange: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FF9800',
  },
  eligibilityContainer: {
    marginBottom: 16,
  },
  eligibilityLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  eligibilityText: {
    fontSize: 10,
    color: '#1a1a1a',
  },
  schemeActions: {
    flexDirection: 'row',
    gap: 8,
  },
  schemePrimaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  schemePrimaryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  schemeSecondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    gap: 4,
  },
  schemeSecondaryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  applicationStatus: {
    backgroundColor: '#E3F2FD',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  applicationStatusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1565C0',
    marginBottom: 12,
  },
  applicationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  applicationName: {
    fontSize: 12,
    color: '#1a1a1a',
  },
  applicationStatusBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  applicationStatusBadgePending: {
    backgroundColor: '#FF9800',
  },
  applicationStatusText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#fff',
  },
  applicationStatusTextPending: {
    color: '#fff',
  },
  trackButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  trackButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196F3',
  },
});