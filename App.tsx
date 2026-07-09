import React from "react";
import {ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { fetchItalianMeals } from "./src/services/mealsApi";
import { loadFavoriteIds, saveFavoriteIds } from "./src/services/storage";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import LoginScreen from "./src/screens/LoginScreen";
import MealDetailsModal from "./src/screens/MealDetailsModal";
import FavoritesScreen from "./src/screens/FavoritesScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";


interface MealSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <InnerApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

function InnerApp() {
  const [state, setState] = React.useState<{
    status: "idle" | "loading" | "success" | "error";
    items: MealSummary[];
    message: string;
  }>({
    status: "idle",
    items: [],
    message: "",
  });
  const [favoriteIds, setFavoriteIds] = React.useState<string[]>([]);
  const [favoritesLoaded, setFavoritesLoaded] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [favoritesOpen, setFavoritesOpen] = React.useState(false);
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const [selectedMealId, setSelectedMealId] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const { user, logout } = useAuth();
  const { colors, toggle, dark } = useTheme();

  React.useEffect(() => {
    loadFavoriteIds()
      .then(setFavoriteIds)
      .finally(() => setFavoritesLoaded(true));
  }, []);

  async function loadMeals() {
    setState({ status: "loading", items: [], message: "" });
    try {
      const data = await fetchItalianMeals();
      setState({ status: "success", items: data, message: "" });
    } catch {
      setState({
        status: "error",
        items: [],
        message: "Caricamento fallito. Controlla la connessione.",
      });
    }
  }

  React.useEffect(() => {
    loadMeals();
  }, []);

  function toggleFavorite(idMeal: string) {
    setFavoriteIds((current) => {
      const next = current.includes(idMeal)
        ? current.filter((id) => id !== idMeal)
        : [...current, idMeal];
      void saveFavoriteIds(next);
      return next;
    });
  }

  if (!favoritesLoaded || state.status === "loading") {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={[styles.centered, { backgroundColor: colors.background }]}> 
          <ActivityIndicator />
          <Text style={{ color: colors.text }}>Caricamento...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (state.status === "error") {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
          <Text style={[styles.error, { color: colors.text }]}>{state.message}</Text>
          <Pressable style={[styles.button, { backgroundColor: colors.accent, borderColor: colors.border }]} onPress={loadMeals}>
            <Text style={[styles.buttonText, { color: colors.card }]}>Retry</Text>
          </Pressable>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  const favoriteMeals = state.items.filter((item) => favoriteIds.includes(item.idMeal));

  if (favoritesOpen) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
          <FavoritesScreen
            meals={favoriteMeals}
            colors={colors}
            onBack={() => setFavoritesOpen(false)}
            onToggleFavorite={toggleFavorite}
            onSelectMeal={(idMeal) => {
              setSelectedMealId(idMeal);
              setDetailsOpen(true);
            }}
          />
          <MealDetailsModal visible={detailsOpen} onClose={() => setDetailsOpen(false)} mealId={selectedMealId} />
          <LoginScreen visible={loginOpen} onClose={() => setLoginOpen(false)} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (settingsOpen) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
          <SettingsScreen
            colors={colors}
            dark={dark}
            user={user}
            onBack={() => setSettingsOpen(false)}
            onToggleDark={toggle}
            onLogin={() => setLoginOpen(true)}
            onLogout={logout}
          />
          <MealDetailsModal visible={detailsOpen} onClose={() => setDetailsOpen(false)} mealId={selectedMealId} />
          <LoginScreen visible={loginOpen} onClose={() => setLoginOpen(false)} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
        <View style={styles.topRight} pointerEvents="box-none">
          <Pressable style={[styles.iconWrap, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => setSettingsOpen(true)}>
            <Text style={{ fontSize: 18 }}>⚙️</Text>
          </Pressable>
        </View>
        <LoginScreen visible={loginOpen} onClose={() => setLoginOpen(false)} />
        <Text style={[styles.title, { color: colors.text }]}>Piatti italiani</Text>
        <View style={styles.topInfo}>
          <Text style={[styles.subtitle, { color: colors.subtitle }]}>Preferiti salvati: {favoriteIds.length}</Text>
          <Pressable style={[styles.favoritesPageButton, { backgroundColor: colors.accent, borderColor: colors.accent }]} onPress={() => setFavoritesOpen(true)}>
            <Text style={[styles.favoritesPageText, { color: colors.card }]}>Vai ai preferiti</Text>
          </Pressable>
        </View>
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
          placeholder="Cerca piatti..."
          placeholderTextColor={dark ? "#8a9bb8" : "#8a9bb8"}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <MealDetailsModal visible={detailsOpen} onClose={() => setDetailsOpen(false)} mealId={selectedMealId} />
        <FlatList
          data={state.items.filter((item) => item.strMeal.toLowerCase().includes(searchQuery.toLowerCase()))}
          keyExtractor={(item) => item.idMeal}
          contentContainerStyle={{ gap: 4 }}
          renderItem={({ item }) => {
            const active = favoriteIds.includes(item.idMeal);
            return (
              <Pressable
                style={[styles.row, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
                onPress={() => {
                  setSelectedMealId(item.idMeal);
                  setDetailsOpen(true);
                }}
              >
                <Image source={{ uri: item.strMealThumb }} style={styles.thumb} />
                <Text style={[styles.mealName, { color: colors.text }]} numberOfLines={2}>
                  {item.strMeal}
                </Text>
                <Pressable
                  style={[
                    styles.favButton,
                    {
                      borderColor: colors.border,
                      backgroundColor: active ? colors.accent : colors.card,
                    },
                  ]}
                  onPress={(event) => {
                    event.stopPropagation();
                    toggleFavorite(item.idMeal);
                  }}
                >
                  <Text style={[
                    styles.favText,
                    { color: active ? colors.card : colors.text },
                  ]}
                  >
                    {active ? "♥" : "+"}
                  </Text>
                </Pressable>
              </Pressable>
            );
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );   
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  centered: { flex: 1, padding: 16, gap: 8, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { color: "#2492d1" },
  error: { color: "#ee0000" },
  button: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#eb0000",
  },
  buttonText: { fontWeight: "600" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#fc7a00",
  },
  thumb: { width: 267, height: 70, borderRadius: 8 },
  mealName: { flex: 1, fontWeight: "600" },
  favButton: { padding: 8, borderWidth: 1, borderRadius: 70 },
  favText: { fontSize: 18 },
  userAvatar: { width: 40, height: 40, borderRadius: 20 },
  userIconText: { fontSize: 20 },
  topRight: { position: "absolute", right: 16, top: 12, flexDirection: "row", gap: 8, zIndex: 30, alignItems: "center" },
  topInfo: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  favoritesPageButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 70,
    borderWidth: 1,
  },
  favoritesPageText: { fontWeight: "600" },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    marginRight: 8,
  },
  userIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginLeft: 0,
  },
  searchInput: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
});