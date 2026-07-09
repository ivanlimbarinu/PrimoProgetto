import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, TextInput, StyleSheet, SafeAreaView, Text } from 'react-native';
import { fetchItalianMeals, MealSummary } from '../services/mealsApi';
import { MealCard } from '../components/MealCard';
import { HeaderProfilo } from '../components/HeaderProfilo';
import { LoadingView, ErrorView } from '../components/FeedbackViews';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { lightTheme, darkTheme } from '../theme/colors';

export const MealsListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { isDarkMode } = useAuth();
  const colors = isDarkMode ? darkTheme : lightTheme;
  const { isFavorite } = useFavorites();

  const [meals, setMeals] = useState<MealSummary[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMeals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchItalianMeals();
      setMeals(data);
    } catch (e) {
      setError("Impossibile caricare i piatti italiani. Errore di rete.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  const filteredMeals = meals.filter(meal =>
    meal.strMeal.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingView />;
  if (error) return <ErrorView message={error} onRetry={loadMeals} />;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderProfilo />
      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { borderColor: colors.border, color: colors.text, backgroundColor: colors.surface }]}
          placeholder="Cerca piatto italiano..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
          accessibilityLabel="Campo di ricerca piatti"
        />
      </View>
      <FlatList
        data={filteredMeals}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <MealCard
            meal={item}
            isFav={isFavorite(item.idMeal)}
            onPress={() => navigation.navigate('MealDetail', { idMeal: item.idMeal })}
          />
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.text }]}>Nessun piatto trovato.</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: { padding: 16 },
  searchInput: { height: 44, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12 },
  empty: { textAlign: 'center', marginTop: 32, fontSize: 16 }
});