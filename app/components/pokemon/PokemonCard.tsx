import useThemeColors from "@/hooks/useThemeColors";
import { Image, StyleSheet, View, ViewStyle } from "react-native";
import Card from "../Card";
import ThemedText from "../ThemedText";

type Props = {
  style?: ViewStyle;
  id: number;
  name: string;
};

const PokemonCard = ({ style, id, name }: Props) => {
  const colors = useThemeColors();
  return (
    <Card style={[style, styles.card]}>
      <ThemedText style={styles.id} variant="caption" color="grayMeduim">
        #{id.toString().padStart(3, "0")}
      </ThemedText>
      <Image
        source={{
          uri: `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${String(
            id
          ).padStart(3, "0")}.png`,
        }}
        style={{ width: 120, height: 120 }}
      />

      <ThemedText>{name}</ThemedText>
      <View
        style={[styles.shadow, { backgroundColor: colors.grayBackground }]}
      />
    </Card>
  );
};
const styles = StyleSheet.create({
  card: {
    position: "relative",
    alignItems: "center",
    padding: 4,
  },
  id: {
    alignSelf: "flex-end",
  },
  shadow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 44,
    borderRadius: 7,
    zIndex: -1,
  },
});
export default PokemonCard;
