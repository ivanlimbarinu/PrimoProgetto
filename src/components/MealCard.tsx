import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, View } from 'react-native';
import { MealSummary } from '../services/mealsApi';
import { lightTheme, darkTheme } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

interface MealCardProps {
  meal: MealSummary;
  onPress: () => void;
  isFav: boolean;
}

export const MealCard: React.FC<MealCardProps> = ({ meal, onPress, isFav }) => {
  const { isDarkMode } = useAuth();
  const colors = isDarkMode ? darkTheme : lightTheme;

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]} 
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Vedi dettagli di ${meal.strMeal}. ${isFav ? 'Incluso nei preferiti' : ''}`}
    >
      <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{meal.strMeal}</Text>
        {isFav && <Text style={{ color: colors.accent, fontWeight: 'bold', marginTop: 4 }}>★ Preferito</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});