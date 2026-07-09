import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from './Avatar';
import { useAuth } from '../context/AuthContext';
import { lightTheme, darkTheme } from '../theme/colors';

export const HeaderProfilo: React.FC = () => {
  const { user, isDarkMode } = useAuth();
  const colors = isDarkMode ? darkTheme : lightTheme;

  if (!user) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Avatar uri={user.avatarUri} size={40} />
        <Text style={[styles.text, { color: colors.text }]} accessibilityLabel={`Utente loggato: ${user.name}`}>{user.name}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  }
});