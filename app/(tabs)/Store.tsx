import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- Interfaces (Data Structures) ---
interface StoreScreenProps {
  navigation: any;
}

interface Product {
  id: string;
  name: string;
  nameHindi: string;
  category: string;
  price: number;
  unit: string;
  rating: number;
  reviews: number;
  image: string;
  inStock: boolean;
  description: string;
}

interface CropListing {
  id: string;
  cropName: string;
  quantity: number;
  pricePerUnit: number;
  unit: string;
  quality: string;
  harvestDate: string;
  location: string;
  farmerName: string;
  image: string;
}

// --- Main Component ---
const Store: React.FC<StoreScreenProps> = ({ navigation }) => {
  // --- State Management ---
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [selectedCategory, setSelectedCategory] = useState('seeds');
  const [showSellModal, setShowSellModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // --- Sample Data ---
  const products: Product[] = [
    {
      id: '1',
      name: 'Premium Rice Seeds',
      nameHindi: 'प्रीमियम चावल के बीज',
      category: 'seeds',
      price: 250,
      unit: 'kg',
      rating: 4.5,
      reviews: 124,
      image: '🌾',
      inStock: true,
      description: 'High-yield variety with disease resistance'
    },
    {
      id: '2',
      name: 'Organic Fertilizer',
      nameHindi: 'जैविक उर्वरक',
      category: 'fertilizers',
      price: 180,
      unit: 'kg',
      rating: 4.3,
      reviews: 89,
      image: '🌱',
      inStock: true,
      description: 'Natural fertilizer for better soil health'
    },
    {
      id: '3',
      name: 'Effective Pesticide',
      nameHindi: 'कृषि स्प्रे',
      category: 'pesticides',
      price: 320,
      unit: 'liter',
      rating: 4.7,
      reviews: 156,
      image: '🧪',
      inStock: true,
      description: 'Effective pest control solution'
    },
    {
      id: '4',
      name: 'Farm Tools Set',
      nameHindi: 'खेती के औजार',
      category: 'tools',
      price: 1200,
      unit: 'set',
      rating: 4.4,
      reviews: 67,
      image: '🔧',
      inStock: true,
      description: 'Complete set of essential farming tools'
    }
  ];

  const cropListings: CropListing[] = [
    {
      id: '1',
      cropName: 'Rice (Basmati)',
      quantity: 50,
      pricePerUnit: 2100,
      unit: 'quintal',
      quality: 'Grade A',
      harvestDate: '2024-11-15',
      location: 'Punjab',
      farmerName: 'रमेश कुमार',
      image: '🌾'
    },
    {
      id: '2',
      cropName: 'Wheat',
      quantity: 30,
      pricePerUnit: 1850,
      unit: 'quintal',
      quality: 'Premium',
      harvestDate: '2024-11-10',
      location: 'Haryana',
      farmerName: 'सुनील सिंह',
      image: '🌾'
    }
  ];

  const categories = [
    { id: 'seeds', name: 'Seeds', nameHindi: 'बीज', icon: '🌱' },
    { id: 'fertilizers', name: 'Fertilizers', nameHindi: 'उर्वरक', icon: '🌿' },
    { id: 'pesticides', name: 'Pesticides', nameHindi: 'कीटनाशक', icon: '🧪' },
    { id: 'tools', name: 'Tools', nameHindi: 'औजार', icon: '🔧' },
  ];

  const filteredProducts = products.filter(p => p.category === selectedCategory);

  // --- Event Handlers ---
  const handleBuyProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowBuyModal(true);
  };

  const confirmPurchase = () => {
    setShowBuyModal(false);
    Alert.alert(
      'Purchase Confirmed',
      `Your order for ${selectedProduct?.name} has been placed successfully!`,
      [{ text: 'OK', onPress: () => setSelectedProduct(null) }]
    );
  };

  const confirmSellListing = () => {
    setShowSellModal(false);
    Alert.alert(
      'Listing Created',
      'Your crop has been listed successfully on the marketplace!',
      [{ text: 'OK' }]
    );
  };

  // --- Render Functions for UI Sections ---
  const renderBuyTab = () => (
    <>
      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryButton,
                selectedCategory === cat.id && styles.selectedCategory
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={styles.categoryName}>{cat.name}</Text>
              <Text style={styles.categoryNameHindi}>{cat.nameHindi}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View>
        <Text style={styles.sectionTitle}>Available Products</Text>
        <View style={styles.productGrid}>
          {filteredProducts.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productHeader}>
                <Text style={styles.productImage}>{product.image}</Text>
                {product.inStock && (
                  <View style={styles.stockBadge}>
                    <Text style={styles.stockText}>In Stock</Text>
                  </View>
                )}
              </View>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productNameHindi}>{product.nameHindi}</Text>
              <Text style={styles.productDescription}>{product.description}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#f59e0b" />
                <Text style={styles.rating}>{product.rating}</Text>
                <Text style={styles.reviews}>({product.reviews} reviews)</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{product.price}<Text style={styles.priceUnit}>/{product.unit}</Text></Text>
                <TouchableOpacity
                  style={styles.buyButton}
                  onPress={() => handleBuyProduct(product)}
                >
                  <Ionicons name="add" size={20} color="white" />
                  <Text style={styles.buyButtonText}>Buy</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    </>
  );

  const renderSellTab = () => (
    <View style={styles.sellSection}>
      <View style={styles.sellHeader}>
        <Text style={styles.sectionTitle}>Your Crop Listings</Text>
        <TouchableOpacity style={styles.addListingButton} onPress={() => setShowSellModal(true)}>
          <Ionicons name="add-circle-outline" size={22} color="white" />
          <Text style={styles.addListingText}>Add Listing</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.insightsCard}>
        <View style={styles.insightsHeader}>
          <Ionicons name="trending-up" size={22} color="#15803d" />
          <Text style={styles.insightsTitle}>Market Insights</Text>
        </View>
        <Text style={styles.insightsText}>
          Rice prices are up 5% from last month. A good time to sell!
        </Text>
      </View>
      
      <Text style={styles.sectionTitle}>Crops from Other Farmers</Text>
      <View style={styles.cropListings}>
        {cropListings.map((listing) => (
          <View key={listing.id} style={styles.cropCard}>
            <View style={styles.cropHeader}>
              <Text style={styles.cropImage}>{listing.image}</Text>
              <View style={styles.cropInfo}>
                <Text style={styles.cropName}>{listing.cropName}</Text>
                <Text style={styles.cropQuality}>{listing.quality} • {listing.quantity} {listing.unit}</Text>
                <Text style={styles.farmerName}>By {listing.farmerName}</Text>
              </View>
              <View style={styles.cropPrice}>
                <Text style={styles.priceValue}>₹{listing.pricePerUnit.toLocaleString()}</Text>
                <Text style={styles.priceUnit}>per {listing.unit}</Text>
              </View>
            </View>
            <View style={styles.cropDetails}>
              <View style={styles.cropDetailItem}>
                <Ionicons name="location-outline" size={14} color="#4b5563" />
                <Text style={styles.cropDetailText}>{listing.location}</Text>
              </View>
              <View style={styles.cropDetailItem}>
                <Ionicons name="calendar-outline" size={14} color="#4b5563" />
                <Text style={styles.cropDetailText}>Harvested: {listing.harvestDate}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.contactButton}>
              <Ionicons name="call-outline" size={18} color="#15803d" />
              <Text style={styles.contactButtonText}>Contact Farmer</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  // --- Main Return JSX ---
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>किसान बाज़ार</Text>
        <Text style={styles.headerSubtitle}>Buy Supplies & Sell Your Crops</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'buy' && styles.activeTab]}
          onPress={() => setActiveTab('buy')}
        >
          <Ionicons name="basket-outline" size={24} color={activeTab === 'buy' ? 'white' : '#15803d'} />
          <Text style={[styles.tabText, activeTab === 'buy' && styles.activeTabText]}>
            Buy / खरीदें
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sell' && styles.activeTab]}
          onPress={() => setActiveTab('sell')}
        >
          <Ionicons name="leaf-outline" size={24} color={activeTab === 'sell' ? 'white' : '#15803d'} />
          <Text style={[styles.tabText, activeTab === 'sell' && styles.activeTabText]}>
            Sell / बेचें
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'buy' ? renderBuyTab() : renderSellTab()}
      </ScrollView>

      {/* --- Modals --- */}
      <Modal visible={showBuyModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Purchase</Text>
              <TouchableOpacity onPress={() => setShowBuyModal(false)}>
                <Ionicons name="close-circle" size={28} color="#4b5563" />
              </TouchableOpacity>
            </View>
            {selectedProduct && (
              <ScrollView>
                <View style={styles.purchaseDetails}>
                  <Text style={styles.productImageLg}>{selectedProduct.image}</Text>
                  <Text style={styles.modalProductName}>{selectedProduct.name}</Text>
                  <Text style={styles.modalPrice}>₹{selectedProduct.price}/{selectedProduct.unit}</Text>
                  <View style={styles.quantitySelector}>
                    <Text style={styles.quantityLabel}>Quantity:</Text>
                    <View style={styles.quantityControls}>
                      <TouchableOpacity style={styles.quantityButton}>
                        <Ionicons name="remove" size={20} color="#374151" />
                      </TouchableOpacity>
                      <Text style={styles.quantityValue}>1</Text>
                      <TouchableOpacity style={styles.quantityButton}>
                        <Ionicons name="add" size={20} color="#374151" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.totalSection}>
                    <Text style={styles.totalText}>Total: ₹{selectedProduct.price}</Text>
                  </View>
                  <TouchableOpacity style={styles.confirmButton} onPress={confirmPurchase}>
                    <Ionicons name="card-outline" size={24} color="white" />
                    <Text style={styles.confirmButtonText}>Confirm and Pay</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      <Modal visible={showSellModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>List Your Crop</Text>
              <TouchableOpacity onPress={() => setShowSellModal(false)}>
                <Ionicons name="close-circle" size={28} color="#4b5563" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.sellForm}>
              <Text style={styles.formLabel}>Crop Type</Text>
              <TextInput style={styles.formInput} placeholder="e.g., Rice, Wheat, Corn" />
              <Text style={styles.formLabel}>Quantity (in Quintals)</Text>
              <TextInput style={styles.formInput} placeholder="e.g., 50" keyboardType="numeric" />
              <Text style={styles.formLabel}>Price per Quintal (₹)</Text>
              <TextInput style={styles.formInput} placeholder="e.g., 2100" keyboardType="numeric" />
              <Text style={styles.formLabel}>Quality Grade</Text>
              <TextInput style={styles.formInput} placeholder="e.g., Grade A, Premium" />
              <TouchableOpacity style={styles.confirmButton} onPress={confirmSellListing}>
                <Ionicons name="checkmark-done-outline" size={24} color="white" />
                <Text style={styles.confirmButtonText}>Create Listing</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  // Colors
  colors: {
    primary: '#22c55e', // Green
    primaryDark: '#15803d',
    background: '#F9FAF4',
    textPrimary: '#1f2937',
    textSecondary: '#4b5563',
    surface: '#ffffff',
    border: '#e5e7eb',
  },
  // Main Layout
  container: {
    flex: 1,
    backgroundColor: '#F9FAF4',
  },
  header: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    marginTop: 10,
  },
  // Tab Switcher
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 16,
    padding: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#22c55e',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#15803d',
    marginLeft: 8,
  },
  activeTabText: {
    color: 'white',
  },
  // Buy Tab: Categories
  categoriesContainer: {
    marginBottom: 24,
  },
  categoryButton: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 110,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  selectedCategory: {
    borderColor: '#22c55e',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  categoryNameHindi: {
    fontSize: 12,
    color: '#4b5563',
  },
  // Buy Tab: Product Cards
  productGrid: {
    gap: 16,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productImage: {
    fontSize: 40,
  },
  productImageLg: {
    fontSize: 60,
  },
  stockBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15803d',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  productNameHindi: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 6,
  },
  productDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#4b5563',
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 6,
  },
  // Sell Tab
  sellSection: {
    gap: 20,
  },
  sellHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addListingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  addListingText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 6,
  },
  insightsCard: {
    backgroundColor: '#dcfce7',
    borderRadius: 16,
    padding: 16,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#15803d',
    marginLeft: 8,
  },
  insightsText: {
    fontSize: 16,
    color: '#166534',
  },
  cropListings: {
    gap: 16,
  },
  cropCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cropHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cropImage: {
    fontSize: 40,
    marginRight: 12,
  },
  cropInfo: {
    flex: 1,
  },
  cropName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  cropQuality: {
    fontSize: 14,
    color: '#4b5563',
  },
  farmerName: {
    fontSize: 14,
    color: '#15803d',
    fontWeight: '600',
  },
  cropPrice: {
    alignItems: 'flex-end',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  cropDetails: {
    flexDirection: 'row',
    gap: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    marginTop: 12,
  },
  cropDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cropDetailText: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 6,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#22c55e',
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 8,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#15803d',
    marginLeft: 8,
  },
  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  purchaseDetails: {
    alignItems: 'center',
    gap: 16,
    paddingBottom: 20,
  },
  modalProductName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  modalPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#15803d',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 10,
  },
  quantityLabel: {
    fontSize: 18,
    color: '#1f2937',
    fontWeight: '500',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    minWidth: 30,
    textAlign: 'center',
  },
  totalSection: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginTop: 10,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22c55e',
    paddingVertical: 18,
    borderRadius: 16,
    width: '100%',
    marginTop: 16,
  },
  confirmButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  sellForm: {
    paddingBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
  },
});

export default Store;
