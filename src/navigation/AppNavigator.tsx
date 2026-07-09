import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { lightTheme, darkTheme } from '../theme/colors';

// Schermate
import { LoginScreen } from '../screens/LoginScreen';
import { MealsListScreen } from '../screens/MealsListScreen';
import { MealDetailScreen } from '../screens/MealDetailScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  const { isDarkMode } = useAuth();
  const colors = isDarkMode ? darkTheme : lightTheme;

  return (
    <Tab.Navigator screenOptions={{
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: '#888',
      tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
      headerShown: false
    }}>
      <Tab.Screen 
        name="MealsList" 
        component={MealsListScreen} 
        options={{ title: "Piatti" }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen} 
        options={{ title: "Preferiti" }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: "Impostazioni" }}
      />

    </Tab.Navigator>
  );
}

export const AppNavigator: React.FC = () => {
  const { user, isDarkMode } = useAuth();
  const colors = isDarkMode ? darkTheme : lightTheme;

  return (
    <Stack.Navigator screenOptions={{
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.text,
    }}>
      {user == null ? (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
          <Stack.Screen 
            name="MealDetail" 
            component={MealDetailScreen} 
            options={{ title: "Ricetta" }} 
          />
        </>
      )}
    </Stack.Navigator>
  );
};