import ThemedText from "@/app/components/ThemedText";
import getPokemonId from "@/function/pokemon";
import useFetchQuery from "@/hooks/useFetchQuerry";
import useThemeColors from "@/hooks/useThemeColors";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "./components/Card";
import PokemonCard from "./components/pokemon/PokemonCard";
import Row from "./components/Row";
import SearchBar from "./components/SearchBar";

export default function Index() {
  const colors = useThemeColors();

  const { data, isFetching } = useFetchQuery("/pokemon?limit=21");
  const pokemons = data?.results ?? [];

  const [search, setSearch] = useState("");

  const filteredPokemons = pokemons.filter((pokemon) => {
    const query = search.trim();
    if (!query) return true;

    if (query.startsWith("#")) {
      const numStr = query.slice(1).trim();
      const num = parseInt(numStr, 10);
      if (!isNaN(num)) {
        return getPokemonId(pokemon.url) === num;
      }
      return false;
    }

    return pokemon.name.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.tint }]}>
      <Row style={styles.header} gap={16}>
        <Image
          source={require("@/assets/images/pokeball.png")}
          width={32}
          height={32}
          style={{ tintColor: "white" }}
        />
        <ThemedText variant="headline" color="grayWhite">
          Pokédex
        </ThemedText>
      </Row>

      <Row style={styles.search}>
        <SearchBar value={search} onChange={setSearch} />
      </Row>

      <Card style={styles.bodyCard}>
        <FlatList
          data={filteredPokemons}
          numColumns={3}
          columnWrapperStyle={[styles.gridGap, styles.list]}
          contentContainerStyle={
            filteredPokemons.length === 0 ? styles.emptyContainer : undefined
          }
          ListEmptyComponent={
            isFetching ? (
              <ActivityIndicator
                color={colors.tint}
                size="large"
                style={{ padding: 40 }}
              />
            ) : (
              <View style={styles.emptyState}>
                <ThemedText variant="subtitle2" color="grayMeduim">
                  Aucun Pokémon trouvé
                </ThemedText>
              </View>
            )
          }
          renderItem={({ item }) => (
            <PokemonCard
              id={getPokemonId(item.url)}
              name={item.name}
              style={{ flex: 1 / 3 }}
            />
          )}
          keyExtractor={(item) => item.url}
        />
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
  },
  header: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  search: {
    paddingHorizontal: 12,
    marginTop: 8,
  },
  bodyCard: {
    flex: 1,
    marginTop: 16,
  },
  gridGap: {
    gap: 8,
  },
  list: {
    padding: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
  },
});