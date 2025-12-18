import { Image, StyleSheet, TextInput, Platform } from "react-native";
import Row from "./Row";
import useThemeColors from "@/hooks/useThemeColors";

type Props = {
  value: string;
  onChange: (s: string) => void;
};

const SearchBar = ({ value, onChange }: Props) => {
  return (
    <Row
      style={[styles.wrapper, { backgroundColor: "white" }]}
      gap={12}
    >
      <Image
        source={require("@/assets/images/search.png")}
        width={20}
        height={20}
        style={styles.searchIcon}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder="Search"
        placeholderTextColor="#aaa"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </Row>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    height: 48,
    borderRadius: 30,
    paddingHorizontal: 16,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  searchIcon: {
    tintColor: "#aaa",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingVertical: 0,
  },
});

export default SearchBar;