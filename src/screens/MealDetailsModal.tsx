import React from "react";
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { fetchMealById } from "../services/mealsApi";
import { useTheme } from "../context/ThemeContext";

export default function MealDetailsModal({
  visible,
  onClose,
  mealId,
}: {
  visible: boolean;
  onClose: () => void;
  mealId: string | null;
}) {
  const { colors } = useTheme();
  const [loading, setLoading] = React.useState(false);
  const [meal, setMeal] = React.useState<any>(null);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!visible || !mealId) {
      setMeal(null);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    fetchMealById(mealId)
      .then((data) => {
        setMeal(data);
      })
      .catch(() => {
        setError("Impossibile caricare i dettagli.");
      })
      .finally(() => setLoading(false));
  }, [mealId, visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.backdrop, { backgroundColor: "rgba(0,0,0,0.45)" }]}>
        <View style={[styles.card, { backgroundColor: colors.card }]}> 
          <View style={[styles.header, { borderBottomColor: colors.border }]}> 
            <Text style={[styles.title, { color: colors.text }]}>Dettagli piatto</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={[styles.closeText, { color: colors.text }]}>✕</Text>
            </Pressable>
          </View>
          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator color={colors.accent} />
              <Text style={{ color: colors.text }}>Caricamento...</Text>
            </View>
          ) : error ? (
            <Text style={[styles.error, { color: colors.accent }]}>{error}</Text>
          ) : meal ? (
            <ScrollView contentContainerStyle={styles.content}>
              <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
              <Text style={[styles.mealTitle, { color: colors.text }]}>{meal.strMeal}</Text>
              <Text style={[styles.category, { color: colors.subtitle }]}>{meal.strCategory} • {meal.strArea}</Text>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Ingredienti</Text>
              {Array.from({ length: 20 }, (_, index) => index + 1)
                .map((i) => ({
                  ingredient: meal[`strIngredient${i}`],
                  measure: meal[`strMeasure${i}`],
                }))
                .filter((item) => item.ingredient)
                .map((item, index) => (
                  <Text key={index} style={[styles.ingredientText, { color: colors.text }]}> 
                    • {item.ingredient} {item.measure ?? ""}
                  </Text>
                ))}
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Preparazione</Text>
              <Text style={[styles.description, { color: colors.text }]}>{meal.strInstructions}</Text>
            </ScrollView>
          ) : (
            <Text style={[styles.empty, { color: colors.subtitle }]}>Seleziona un piatto per visualizzarne i dettagli.</Text>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", padding: 16 },
  card: { flex: 1, backgroundColor: "#fff", borderRadius: 16, overflow: "hidden" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: 1, borderBottomColor: "#eee" },
  title: { fontSize: 20, fontWeight: "700" },
  closeButton: { padding: 8 },
  closeText: { fontSize: 18 },
  content: { padding: 16, gap: 12 },
  image: { width: "100%", height: 220, borderRadius: 14, marginBottom: 12 },
  mealTitle: { fontSize: 24, fontWeight: "700" },
  category: { color: "#555" },
  sectionTitle: { marginTop: 12, fontSize: 18, fontWeight: "700" },
  ingredientText: { marginTop: 4, lineHeight: 22 },
  description: { marginTop: 4, lineHeight: 22, color: "#333" },
  empty: { padding: 16, color: "#555" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { padding: 16, color: "#c00" },
});
