import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StorageProvider } from '../Context/StorageContext';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});



export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Runtime: require('../assets/fonts/Runtime-Regular.otf'),
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    NavigationBar.setVisibilityAsync('hidden');
    NavigationBar.setBackgroundColorAsync('#676767');
  }, []);

  if (!loaded) return null;


  return (
    <StorageProvider>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <StatusBar
            style={colorScheme === 'dark' ? 'light' : 'dark'}
            backgroundColor={colorScheme === 'dark' ? '#000' : '#fff'}
          />

          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="+not-found" />
              <Stack.Screen name="SignIn"  options={{headerShown:true,headerTitle:"Let's get started"}} />
            </Stack>
          </ThemeProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </StorageProvider>
  );
}
