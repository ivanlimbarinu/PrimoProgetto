import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import * as Linking from "expo-linking";

const linking = {
  prefixes: [Linking.createURL("/"), "myapp://"],
  config: {
    screens: {
      Home: "home",
      Details: "details/:id",
    },
  },
};

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
    <NavigationContainer linking={linking}>
          <AppNavigator />
        </NavigationContainer>
      </FavoritesProvider>
    </AuthProvider>
  );
}