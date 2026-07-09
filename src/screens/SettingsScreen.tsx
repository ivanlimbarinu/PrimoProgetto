import React from 'react';
import { View, Text, StyleSheet, Button, Switch, SafeAreaView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/Avatar';
import { lightTheme, darkTheme } from '../theme/colors';

export const SettingsScreen: React.FC = () => {
  const { user, logout, isDarkMode, toggleTheme } = useAuth();
  const colors = isDarkMode ? darkTheme : lightTheme;

  if (!user) return null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Avatar uri={user.avatarUri} size={80} />
        <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
        <Text style={{ color: '#888' }}>{user.email}</Text>
      </View>

      <View style={[styles.row, { borderBottomColor: colors.border }]}>
        <Text style={[styles.rowText, { color: colors.text }]}>Tema Scuro</Text>
        <Switch 
          value={isDarkMode} 
          onValueChange={toggleTheme} 
          accessibilityLabel="Selettore modalità scura"
        />
      </View>

      <View style={{ padding: 16, marginTop: 'auto' }}>
        <Button 
          title="Disconnetti" 
          color={colors.accent} 
          onPress={logout} 
          accessibilityLabel="Esegui il logout dall'applicazione"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileCard: { padding: 24, alignItems: 'center', margin: 16, borderRadius: 12, borderWidth: 1 },
  name: { fontSize: 20, fontWeight: 'bold', marginTop: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  rowText: { fontSize: 16, fontWeight: '500' }
});