import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View, Image } from "react-native";

type MealSummary = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

type Props = {
  meals: MealSummary[];
  colors: {
    background: string;
    card: string;
    text: string;
    subtitle: string;
    border: string;
    accent: string;
  };
  onBack: () => void;
  onToggleFavorite: (idMeal: string) => void;
  onSelectMeal: (idMeal: string) => void;
};

export default function FavoritesScreen({ meals, colors, onBack, onToggleFavorite, onSelectMeal }: Props) {
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Preferiti</Text>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={[styles.backText, { color: colors.accent }]}>← Indietro</Text>
        </Pressable>
      </View>
      {meals.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.subtitle }]}>Nessun piatto nei preferiti.</Text>
        </View>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => item.idMeal}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => (
            <Pressable
              style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => onSelectMeal(item.idMeal)}
            >
              <Image source={{ uri: item.strMealThumb }} style={styles.thumb} />
              <Text style={[styles.mealName, { color: colors.text }]} numberOfLines={2}>
                {item.strMeal}
              </Text>
              <Pressable
                style={[styles.removeButton, { backgroundColor: colors.accent }]}
                onPress={(event) => {
                  event.stopPropagation();
                  onToggleFavorite(item.idMeal);
                }}
              >
                <Text style={[styles.removeButtonText, { color: colors.card }]}>Rimuovi</Text>
              </Pressable>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  title: { fontSize: 24, fontWeight: "700" },
  backButton: { padding: 8 },
  backText: { color: "#2492d1", fontWeight: "600" },
  emptyContainer: { alignItems: "center", marginTop: 32 },
  emptyText: { color: "#666" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  thumb: { width: 80, height: 60, borderRadius: 8 },
  mealName: { flex: 1, fontWeight: "600" },
  removeButton: { paddingVertical: 6, paddingHorizontal: 10, backgroundColor: "#eb0000", borderRadius: 8 },
  removeButtonText: { color: "#fff", fontWeight: "600" },
});
