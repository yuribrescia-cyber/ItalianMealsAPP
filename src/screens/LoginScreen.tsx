import React from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View, Image, Alert } from "react-native";
import { validateLogin, MOCK_USERS } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function LoginScreen({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { login } = useAuth();
  const { colors } = useTheme();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!visible) {
      setEmail("");
      setPassword("");
      setSelectedIndex(null);
      setError("");
    }
  }, [visible]);

  function handleLogin() {
    const user = validateLogin(email, password);
    if (!user) {
      setError("Credenziali non valide");
      return;
    }
    login(user);
    setEmail("");
    setPassword("");
    setError("");
    onClose();
    Alert.alert("Accesso effettuato", `Benvenuto ${user.name}`);
  }

  function selectMock(idx: number) {
    // non autofill: seleziona solo visivamente l'avatar senza salvare le credenziali
    setSelectedIndex(idx);
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.backdrop, { backgroundColor: "rgba(0,0,0,0.4)" }]}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <Text style={[styles.title, { color: colors.text }]}>Accedi</Text>
            <View style={styles.avatarsRow}>
              {MOCK_USERS.map((u, idx) => (
                <Pressable
                  key={u.email}
                  onPress={() => selectMock(idx)}
                  style={[
                    styles.avatarOption,
                    selectedIndex === idx ? styles.avatarSelected : null,
                  ]}
                >
                  <Image source={{ uri: u.avatarUri }} style={styles.avatarImage} />
                </Pressable>
              ))}
            </View>
          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.subtitle}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.subtitle}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
          />
          {error ? <Text style={[styles.error, { color: colors.accent }]}>{error}</Text> : null}
          <View style={styles.row}>
            <Pressable style={[styles.button, { backgroundColor: colors.accent }]} onPress={handleLogin}>
              <Text style={styles.buttonText}>Entra</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.ghost, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={onClose}>
              <Text style={[styles.buttonText, { color: colors.text }]}>Annulla</Text>
            </Pressable>
          </View>
          
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", padding: 24 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  input: { borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 8, marginBottom: 8 },
  row: { flexDirection: "row", gap: 8, justifyContent: "flex-end" },
  button: { paddingVertical: 10, paddingHorizontal: 14, backgroundColor: "#2492d1", borderRadius: 8 },
  ghost: { backgroundColor: "#777" },
  buttonText: { color: "#fff", fontWeight: "600" },
  error: { color: "#c00", marginBottom: 8 },
  hint: { marginTop: 12, gap: 2 },
  avatarsRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  avatarOption: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  avatarImage: { width: 56, height: 56 },
  avatarSelected: { borderColor: "#2492d1" },
});
