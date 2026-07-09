import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type User = {
  name: string;
  avatarUri: string;
};

type Props = {
  colors: {
    background: string;
    card: string;
    text: string;
    subtitle: string;
    border: string;
    accent: string;
  };
  dark: boolean;
  user: User | null;
  onBack: () => void;
  onToggleDark: () => void;
  onLogin: () => void;
  onLogout: () => void;
};

export default function SettingsScreen({
  colors,
  dark,
  user,
  onBack,
  onToggleDark,
  onLogin,
  onLogout,
}: Props) {
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Impostazioni</Text>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={[styles.backText, { color: colors.accent }]}>← Indietro</Text>
        </Pressable>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.sectionTitle, { color: colors.subtitle }]}>Tema</Text>
        <Pressable style={[styles.row, { borderColor: colors.border }]} onPress={onToggleDark}>
          <Text style={[styles.rowText, { color: colors.text }]}>Modalità scura</Text>
          <Text style={[styles.rowValue, { color: colors.text }]}>{dark ? "Attiva" : "Disattiva"}</Text>
        </Pressable>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}> 
        <Text style={[styles.sectionTitle, { color: colors.subtitle }]}>Account</Text>
        <Pressable
          style={[styles.profileRow, { borderColor: colors.border, backgroundColor: colors.background }]}
          onPress={user ? onLogout : onLogin}
        >
          {user ? (
            <Image source={{ uri: user.avatarUri }} style={styles.avatar} />
          ) : (
            <Text style={styles.avatarPlaceholder}>👤</Text>
          )}
          <Text style={[styles.profileText, { color: colors.text }]}> 
            {user ? `Esci da ${user.name}` : "Accedi"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { fontSize: 24, fontWeight: "700" },
  backButton: { padding: 8 },
  backText: { fontWeight: "700" },
  section: { borderWidth: 1, borderRadius: 16, padding: 16, gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "700" },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderRadius: 12, padding: 14 },
  rowText: { fontSize: 16, fontWeight: "600" },
  rowValue: { fontSize: 16, fontWeight: "600" },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderRadius: 12, padding: 14 },
  avatar: { width: 42, height: 42, borderRadius: 21 },
  avatarPlaceholder: { fontSize: 24 },
  profileText: { fontSize: 16, fontWeight: "600" },
});
