import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";

type PokemonDetail = {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
  };
};

const endPoint = "https://pokeapi.co/api/v2";

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, error } = useQuery<PokemonDetail>({
    queryKey: ["pokemon", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await fetch(`${endPoint}/pokemon/${id}`);
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text>Erreur lors du chargement</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: data.sprites.front_default }}
        style={styles.image}
      />
      <Text style={styles.name}>{data.name}</Text>

      <Text>ID: {data.id}</Text>
      <Text>Taille: {data.height}</Text>
      <Text>Poids: {data.weight}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 8,
    textTransform: "capitalize",
  },
});
