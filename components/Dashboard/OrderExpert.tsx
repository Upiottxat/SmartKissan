import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * @description A card  that uses to Order the Expert to visit your farm    
 */
const OrderExpert = () => {


  return (
          <TouchableOpacity
              style={styles.card}
              activeOpacity={0.7}>
                <View style={styles.cardHeader}>
              <View style={[styles.iconContainer, { backgroundColor:"rgba(20, 224, 211, 1)"}]}>
                <Text style={styles.icon}>{"🧑‍⚕️"}</Text>
              </View>
              <Text style={styles.cardTitle}>Need Expert to Visit Your Fram?</Text>
              </View>
              <Text style={styles.cardSubtitle}>An Expert will come to your farm and test all thing on site to tell you the best advice</Text>
              <TouchableOpacity style={styles.OrderBtn} >
                <Text style={styles.OrderBtnText}>Order an Expert</Text>
              </TouchableOpacity>
            </TouchableOpacity>
  );
};

const styles = StyleSheet.create({


  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    // Adding a subtle shadow for depth (iOS and Android)
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,

  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    fontSize: 26,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937', // Dark gray
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280', // Medium gray
    marginBottom: 8,
    fontStyle: 'italic',
        marginTop: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#4B5563', // Lighter gray
    lineHeight: 20,
  },
  cardHeader:{
    flex:1,
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent:'space-evenly',
    alignItems:'center'
  },
  OrderBtn: {

    
    backgroundColor: '#22c55e',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignSelf: 'stretch',
    marginTop: 10,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
   
  },
  OrderBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});




export default OrderExpert;
