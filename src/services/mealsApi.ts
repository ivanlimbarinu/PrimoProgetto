const BASE = "https://www.themealdb.com/api/json/v1/1";

export interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface MealDetail {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  [key: string]: string | null; // Per mappare dinamicamente strIngredientX e strMeasureX
}

// Funzione helper per gestire il retry fino a 2 volte (3 tentativi totali)
async function fetchWithRetry(url: string, retriesLeft = 2): Promise<any> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (error) {
    if (retriesLeft > 0) {
      return await fetchWithRetry(url, retriesLeft - 1);
    }
    throw error;
  }
}

export async function fetchItalianMeals(): Promise<MealSummary[]> {
  const data = await fetchWithRetry(`${BASE}/filter.php?a=Italian`);
  return data.meals ?? [];
}

export async function fetchMealById(id: string): Promise<MealDetail | null> {
  const data = await fetchWithRetry(`${BASE}/lookup.php?i=${id}`);
  return data.meals?.[0] ?? null;
}