import CropRecommendationScreen from '@/components/Dashboard/CropRecommendationScreen';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import DashboardMainScreen from '@/components/Dashboard/DashboardMainScreen';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SceneMap, TabView } from 'react-native-tab-view';
const initialLayout = { width: Dimensions.get('window').width };

/**
 * @description The main container for the dashboard, managing tab navigation.
 * It uses TabView to switch between the main dashboard and crop recommendations.
 */
export default function Dashboard() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'dashboard', title: 'Home', icon: 'home-outline' },
    { key: 'recommendation', title: 'Crop Advice', icon: 'leaf-outline' },
  ]);

  // Maps route keys to their respective screen components
  const renderScene = SceneMap({
    dashboard: DashboardMainScreen,
    recommendation: CropRecommendationScreen,
  });

  // Custom TabBar for a more farmer-friendly look with icons
  const renderTabBar = (props: any) => (
    <View style={styles.tabBar}>
      {props.navigationState.routes.map((route: any, i: number) => {
        const isActive = i === props.navigationState.index;
        const color = isActive ? '#ffffff' : '#a7f3d0';
        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            onPress={() => props.jumpTo(route.key)}
          >
            <Ionicons name={route.icon} size={22} color={color} />
            <Text style={[styles.tabLabel, { color }]}>{route.title}</Text>
            {isActive && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Renders the main header for the dashboard */}
      <DashboardHeader />

      {/* Tab view for navigating between dashboard screens */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar} // Use the custom tab bar
        tabBarPosition="bottom" // More accessible at the bottom
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fdf8',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#22c55e',
    borderTopWidth: 1,
    borderTopColor: '#16a34a',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '40%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
});

