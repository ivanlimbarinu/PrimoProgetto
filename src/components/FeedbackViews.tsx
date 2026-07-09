import React from 'react';
import { View, Text, ActivityIndicator, Button, StyleSheet } from 'react-native';
import { lightTheme, darkTheme } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

export const LoadingView: React.FC = () => {
  const { isDarkMode } = useAuth();
  const colors = isDarkMode ? darkTheme : lightTheme;
  return (
    <View style={[styles.center, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

interface ErrorViewProps {
  message: string;
  onRetry: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ message, onRetry }) => {
  const { isDarkMode } = useAuth();
  const colors = isDarkMode ? darkTheme : lightTheme;
  return (
    <View style={[styles.center, { backgroundColor: colors.background, padding: 24 }]}>
      <Text style={[styles.errText, { color: colors.error }]}>{message}</Text>
      <View style={{ marginTop: 16 }}>
        <Button title="Riprova" onPress={onRetry} color={colors.primary} accessibilityLabel="Pulsante Riprova caricamento dei dati" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  }
});