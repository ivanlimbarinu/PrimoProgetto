import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, Button, SafeAreaView } from 'react-native';
import { fetchMealById, MealDetail } from '../services/mealsApi';
import { LoadingView, ErrorView } from '../components/FeedbackViews';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { lightTheme, darkTheme } from '../theme/colors';

export const MealDetailScreen: React.FC<{ route: any }> = ({ route }) => {
  const { idMeal } = route.params;
  const { isDarkMode } = useAuth();
  const colors = isDarkMode ? darkTheme : lightTheme;
  const { toggleFavorite, isFavorite } = useFavorites();

  const [meal, setMeal] = useState<MealDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMealById(idMeal);
      setMeal(data);
    } catch (e) {
      setError("Errore nel caricamento dei dettagli del piatto.");
    } finally {
      setLoading(false);
    }
  }, [idMeal]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  if (loading) return <LoadingView />;
  if (error || !meal) return <ErrorView message={error || "Piatto non trovato"} onRetry={loadDetail} />;

  // Estrae ingredienti e dosi dinamici dall'API
  const ingredients: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== "") {
      ingredients.push(`${ingredient} - ${measure ?? ''}`);
    }
  }

  const fav = isFavorite(meal.idMeal);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>{meal.strMeal}</Text>
          <Text style={[styles.meta, { color: colors.accent }]}>{meal.strCategory} | {meal.strArea}</Text>
          
          <View style={styles.favBtn}>
            <Button
              title={fav ? "★ Rimuovi dai Preferiti" : "☆ Aggiungi ai Preferiti"}
              color={fav ? colors.accent : colors.primary}
              onPress={() => toggleFavorite(meal.idMeal)}
              accessibilityLabel={fav ? "Rimuovi questo piatto dai preferiti" : "Aggiungi questo piatto ai preferiti"}
            />
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Ingredienti</Text>
          {ingredients.map((ing, index) => (
            <Text key={index} style={[styles.ingredient, { color: colors.text }]}>• {ing}</Text>
          ))}

          <Text style={[styles.sectionTitle, { color: colors.text }]}>Istruzioni</Text>
          <Text style={[styles.instructions, { color: colors.text }]}>{meal.strInstructions}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: { width: '100%', height: 250 },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
  meta: { fontSize: 16, marginVertical: 4, fontWeight: '600' },
  favBtn: { marginVertical: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 18, marginBottom: 8 },
  ingredient: { fontSize: 15, marginVertical: 2, paddingLeft: 8 },
  instructions: { fontSize: 15, lineHeight: 22, textAlign: 'justify' }
});