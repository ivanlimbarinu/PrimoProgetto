import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, SafeAreaView, Text } from 'react-native';
import { fetchMealById, MealDetail } from '../services/mealsApi';
import { MealCard } from '../components/MealCard';
import { HeaderProfilo } from '../components/HeaderProfilo';
import { LoadingView, ErrorView } from '../components/FeedbackViews';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { lightTheme, darkTheme } from '../theme/colors';

export const FavoritesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { isDarkMode } = useAuth();
  const colors = isDarkMode ? darkTheme : lightTheme;
  const { favorites, isFavorite } = useFavorites();

  const [meals, setMeals] = useState<MealDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const favoriteIds = useMemo(() => favorites ?? [], [favorites]);

  const loadFavoritesMeals = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (favoriteIds.length === 0) {
        setMeals([]);
        return;
      }

      const loaded = await Promise.all(favoriteIds.map((idMeal) => fetchMealById(idMeal)));
      const validMeals = loaded.filter((m): m is MealDetail => m != null);

      // Dedup per idMeal
      const unique = Array.from(new Map(validMeals.map((m) => [m.idMeal, m])).values());
      setMeals(unique);
    } catch {
      setError('Impossibile caricare i preferiti. Errore di rete.');
    } finally {
      setLoading(false);
    }
  }, [favoriteIds]);

  useEffect(() => {
    loadFavoritesMeals();
  }, [loadFavoritesMeals]);

  if (loading) return <LoadingView />;
  if (error) return <ErrorView message={error} onRetry={loadFavoritesMeals} />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderProfilo />

      <FlatList
        data={meals}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <MealCard
            meal={item as any}
            isFav={isFavorite(item.idMeal)}
            onPress={() => navigation.navigate('MealDetail', { idMeal: item.idMeal })}
          />
        )}
        ListEmptyComponent={<Text style={[styles.empty, { color: colors.text }]}>Nessun preferito.</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  empty: { textAlign: 'center', marginTop: 32, fontSize: 16 },
});

