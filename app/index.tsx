import ThemedText from "@/app/components/ThemedText";
import getPokemonId from "@/function/pokemon";
import { useInfiniteFetchQuery } from "@/hooks/useFetchQuerry";
import useThemeColors from "@/hooks/useThemeColors";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
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

  const { data, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteFetchQuery("/pokemon?limit=60");

  type PokemonListItem = { name: string; url: string };

  const allPokemons = useMemo<PokemonListItem[]>(() => {
    return data?.pages.flatMap((page: any) => page.results ?? []) ?? [];
  }, [data]);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"number" | "name">("number");
  const [sortOpen, setSortOpen] = useState(false);

  const filteredPokemons = useMemo(
    () =>
      allPokemons.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(search.toLowerCase())
      ),
    [allPokemons, search]
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
              source={require("@/assets/images/logo.png")}
              style={{ tintColor: "white", width: 24, height: 24 }}
            />
            <ThemedText variant="headline" color="grayWhite">
              Pokédex
            </ThemedText>
          </Row>

          <TouchableOpacity
            onPress={() => setSortOpen(true)}
            style={styles.sortButton}
          >
            <Text style={styles.sortIcon}>⇅</Text>
          </TouchableOpacity>
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
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator color={colors.tint} style={{ padding: 20 }} />
            ) : null
          }
          ListEmptyComponent={
            displayedPokemons.length === 0 ? (
              isFetching ? (
                <ActivityIndicator
                  color={colors.tint}
                  size="large"
                  style={{ padding: 40 }}
                />
              ) : (
                <View style={styles.emptyState}>
                  <ThemedText variant="subtitle2" color="grayWhite">
                    Aucun Pokémon trouvé
                  </ThemedText>
                </View>
              )
            ) : null
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

      <Modal transparent visible={sortOpen} animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setSortOpen(false)}
        >
          <View
            style={[styles.sortMenu, { backgroundColor: colors.tint }]}
          >
            <View style={styles.sortCard}>
              <ThemedText style={styles.sortTitle}>Sort by:</ThemedText>

              <TouchableOpacity
                style={styles.sortOption}
                onPress={() => {
                  setSortBy("number");
                  setSortOpen(false);
                }}
              >
                <View style={styles.radioOuter}>
                  {sortBy === "number" && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.sortOptionText}>Number</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sortOption}
                onPress={() => {
                  setSortBy("name");
                  setSortOpen(false);
                }}
              >
                <View style={styles.radioOuter}>
                  {sortBy === "name" && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <Text style={styles.sortOptionText}>Name</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
  sortButton: {
    padding: 12,
  },
  sortIcon: {
    color: "white",
    fontSize: 28,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  sortMenu: {
    position: "absolute",
    top: 90,
    right: 16,
    padding: 8,
    borderRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
  },
  sortCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
  },
  sortTitle: {
    color: "white",
    fontWeight: "600",
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
    color: "#333",
    fontWeight: "500",
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#DC0A2D",
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#DC0A2D",
  },
});
