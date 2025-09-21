import { Ionicons } from '@expo/vector-icons';
import * as NavigationBar from 'expo-navigation-bar';
import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export default function TabLayout() {
  const insets = useSafeAreaInsets();
  useEffect(()=>{
    NavigationBar.setVisibilityAsync('hidden'); 
    NavigationBar.setBackgroundColorAsync('#676767'); 
  })

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Advisory':
              iconName = focused ? 'chatbubble' : 'chatbubble-outline';
              break;
            case 'Market':
              iconName = focused ? 'trending-up' : 'trending-up-outline';
              break;
            case 'Community':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Profile':
                iconName = focused ? 'person' : 'person-outline';
                break;
            default:
              iconName = 'home-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e5e5',
          height:60 + insets.bottom/2,
          // paddingBottom: insets.bottom,

        },
        headerShown: false,
        animationEnabled: false, 
        tabBarButton: (props) => (
          <TouchableOpacity {...props} activeOpacity={1} /> 
        ),
      })}
    >
      <Tabs.Screen name="Dashboard" />
      <Tabs.Screen name="Advisory" />
      <Tabs.Screen name="Market" />
       <Tabs.Screen name="Community" />
      <Tabs.Screen name="Profile" />
    </Tabs>
  );
}
