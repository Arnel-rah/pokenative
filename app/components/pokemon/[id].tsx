import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";

type PokemonDetail = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
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
        <ActivityIndicator size="large" color="#fff" />
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
    <ScrollView style={styles.screen}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.id}>#{data.id.toString().padStart(3, "0")}</Text>
        <Text style={styles.name}>{data.name}</Text>

        <View style={styles.types}>
          {data.types.map(t => (
            <View key={t.type.name} style={styles.typeBadge}>
              <Text style={styles.typeText}>{t.type.name}</Text>
            </View>
          ))}
        </View>

        <Image
          source={{ uri: data.sprites.other["official-artwork"].front_default }}
          style={styles.image}
        />
      </View>

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>About</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoValue}>{data.weight / 10} kg</Text>
            <Text style={styles.infoLabel}>Weight</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoValue}>{data.height / 10} m</Text>
            <Text style={styles.infoLabel}>Height</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Base Stats</Text>

        {data.stats.map(stat => (
          <View key={stat.stat.name} style={styles.statRow}>
            <Text style={styles.statName}>{stat.stat.name.toUpperCase()}</Text>
            <Text style={styles.statValue}>{stat.base_stat}</Text>
            <View style={styles.statBar}>
              <View
                style={[
                  styles.statFill,
                  { width: `${Math.min(stat.base_stat, 100)}%` },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F57C00",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F57C00",
  },

  header: {
    paddingTop: 40,
    paddingBottom: 80,
    alignItems: "center",
  },
  id: {
    color: "#fff",
    opacity: 0.7,
    fontSize: 14,
  },
  name: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    textTransform: "capitalize",
  },

  types: {
    flexDirection: "row",
    marginTop: 8,
  },
  typeBadge: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  typeText: {
    color: "#fff",
    fontWeight: "600",
    textTransform: "capitalize",
  },

  image: {
    width: 220,
    height: 220,
    marginTop: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    marginTop: -40,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F57C00",
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  infoBox: {
    alignItems: "center",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  infoLabel: {
    fontSize: 12,
    color: "#777",
  },

  statRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statName: {
    width: 60,
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
  },
  statValue: {
    width: 40,
    fontSize: 12,
    textAlign: "right",
    marginRight: 8,
  },
  statBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#eee",
    borderRadius: 4,
  },
  statFill: {
    height: 6,
    backgroundColor: "#F57C00",
    borderRadius: 4,
  },
});
