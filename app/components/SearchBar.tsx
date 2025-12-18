import useThemeColors from "@/hooks/useThemeColors";
import { Image, Platform, StyleSheet, TextInput } from "react-native";
import Row from "./Row";

type Props = {
  value: string;
  onChange: (s: string) => void;
};

const SearchBar = ({ value, onChange }: Props) => {
  const colors = useThemeColors();
  return (
    <Row
      style={[styles.wrapper, { backgroundColor: colors.grayBackground }]}
      gap={12}
    >
      <Image
        source={require("@/assets/images/search.png")}
        width={25}
        height={25}
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

  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingVertical: 0,
  },
});

export default SearchBar;
