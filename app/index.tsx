import ThemedText from "@/app/components/ThemedText";
import getPokemonId from "@/function/pokemon";
import useFetchQuery from "@/hooks/useFetchQuerry";
import useThemeColors from "@/hooks/useThemeColors";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
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
  const [sortBy, setSortBy] = useState<"number" | "name">("number");
  const [sortOpen, setSortOpen] = useState(false);

  const filteredPokemons = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  const displayedPokemons = useMemo(() => {
    const list = [...filteredPokemons];
    if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      list.sort((a, b) => getPokemonId(a.url) - getPokemonId(b.url));
    }
    return list;
  }, [filteredPokemons, sortBy]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.tint }]}>
      <View style={{ backgroundColor: colors.tint }}>
        <Row style={styles.header}>
          <Row gap={16}>
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

          <View style={styles.sortButtonContainer}>
            <TouchableOpacity
              onPress={() => setSortOpen((prev) => !prev)}
              style={styles.sortButton}
            >
              <Text style={styles.sortIcon}>⇅</Text>
            </TouchableOpacity>

            {sortOpen && (
              <View style={[styles.sortMenu, styles.sortMenuShadow]}>
                <ThemedText variant="subtitle2" color="grayWhite" style={styles.sortTitle}>
                  Sort by:
                </ThemedText>

                <TouchableOpacity
                  style={styles.sortOption}
                  onPress={() => {
                    setSortBy("number");
                    setSortOpen(false);
                  }}
                >
                  <View style={styles.radioOuter}>
                    {sortBy === "number" && <View style={styles.radioInner} />}
                  </View>
                  <ThemedText color="grayWhite" style={styles.sortOptionText}>
                    Number
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.sortOption}
                  onPress={() => {
                    setSortBy("name");
                    setSortOpen(false);
                  }}
                >
                  <View style={styles.radioOuter}>
                    {sortBy === "name" && <View style={styles.radioInner} />}
                  </View>
                  <ThemedText color="grayWhite" style={styles.sortOptionText}>
                    Name
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </Row>

        <Row style={styles.search}>
          <SearchBar value={search} onChange={setSearch} />
        </Row>
      </View>

      <Card style={styles.bodyCard}>
        <FlatList
          data={displayedPokemons}
          numColumns={3}
          columnWrapperStyle={[styles.gridGap, styles.list]}
          contentContainerStyle={
            displayedPokemons.length === 0 ? styles.emptyContainer : undefined
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
                <ThemedText variant="subtitle3" color="grayMeduim">
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
    alignItems: "center",
    justifyContent: "space-between",
  },
  search: {
    paddingHorizontal: 12,
    paddingBottom: 16,
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
  sortButtonContainer: {
    position: "relative",
  },
  sortButton: {
    padding: 12,
    // hitSlop: { top: 10, bottom: 10, left: 10, right: 10 },
  },
  sortIcon: {
    color: "white",
    fontSize: 28,
  },
  sortMenu: {
    position: "absolute",
    top: "100%",
    right: 0,
    width: 180,
    padding: 16,
    backgroundColor: "transparent",
    borderRadius: 20,
    marginTop: 8,
    zIndex: 10,
  },
  sortMenuShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    backgroundColor: "rgba(8, 8, 8, 0.91)",
    
  },
  sortTitle: {
    marginBottom: 12,
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  sortOptionText: {
    marginLeft: 12,
    fontSize: 16,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "white",
  },
});