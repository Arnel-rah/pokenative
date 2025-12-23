import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from '@expo/vector-icons'; // Pour la flèche de retour

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

// Map pour les couleurs par type (optionnel mais recommandé)
const TYPE_COLORS: any = {
  fire: "#F57C00",
  grass: "#74CB48",
  water: "#6493EB",
  bug: "#A7B723",
  normal: "#AAA67F",
  poison: "#A43E9E",
};

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, error } = useQuery<PokemonDetail>({
    queryKey: ["pokemon", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await fetch(`${endPoint}/pokemon/${id}`);
      return res.json();
    },
  });

  if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" color="#fff" /></View>;
  if (error || !data) return <View style={styles.center}><Text>Erreur lors du chargement</Text></View>;

  const mainColor = TYPE_COLORS[data.types[0].type.name] || "#F57C00";

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: mainColor }]}>
      {/* HEADER NAVIGATION */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerName}>{data.name}</Text>
        <Text style={styles.headerId}>#{data.id.toString().padStart(3, "0")}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* IMAGE CONTENEUR */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: data.sprites.other["official-artwork"].front_default }}
            style={styles.image}
          />
        </View>

        {/* WHITE CARD */}
        <View style={styles.card}>
          {/* TYPES */}
          <View style={styles.typesRow}>
            {data.types.map(t => (
              <View key={t.type.name} style={[styles.typeBadge, { backgroundColor: mainColor }]}>
                <Text style={styles.typeText}>{t.type.name}</Text>
              </View>
            ))}
          </View>

          {/* ABOUT SECTION */}
          <Text style={[styles.sectionTitle, { color: mainColor }]}>About</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <View style={styles.infoValueContainer}>
                 <Ionicons name="fitness-outline" size={16} />
                 <Text style={styles.infoValue}>{data.weight / 10} kg</Text>
              </View>
              <Text style={styles.infoLabel}>Weight</Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoBox}>
               <View style={styles.infoValueContainer}>
                 <Ionicons name="resize-outline" size={16} />
                 <Text style={styles.infoValue}>{data.height / 10} m</Text>
              </View>
              <Text style={styles.infoLabel}>Height</Text>
            </View>
          </View>

          <Text style={styles.description}>
            It has a preference for hot things. When it rains, steam is said to spout from the tip of its tail.
          </Text>

          {/* STATS SECTION */}
          <Text style={[styles.sectionTitle, { color: mainColor, marginTop: 20 }]}>Base Stats</Text>

          {data.stats.map(stat => (
            <View key={stat.stat.name} style={styles.statRow}>
              <Text style={[styles.statName, { color: mainColor }]}>
                {stat.stat.name.replace('special-attack', 'SATK').replace('special-defense', 'SDEF').replace('hp', 'HP').replace('attack', 'ATK').replace('defense', 'DEF').replace('speed', 'SPD').toUpperCase()}
              </Text>
              <View style={styles.statDivider} />
              <Text style={styles.statValue}>{stat.base_stat.toString().padStart(3, "0")}</Text>
              <View style={styles.statBarBg}>
                <View
                  style={[
                    styles.statFill,
                    { width: `${Math.min((stat.base_stat / 200) * 100, 100)}%`, backgroundColor: mainColor },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: 'space-between'
  },
  headerName: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    flex: 1,
    marginLeft: 15
  },
  headerId: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 40,
  },
  imageContainer: {
    zIndex: 1,
    marginBottom: -50, // Fait chevaucher l'image sur la carte
  },
  image: {
    width: 200,
    height: 200,
  },
  card: {
    backgroundColor: "white",
    width: '95%',
    borderRadius: 20,
    paddingTop: 60, // Espace pour l'image qui chevauche
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  typesRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  typeBadge: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  typeText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'capitalize'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 20
  },
  infoBox: { alignItems: 'center', flex: 1 },
  infoValueContainer: { flexDirection: 'row', alignItems: 'center' },
  infoValue: { fontSize: 16, fontWeight: '500', marginLeft: 5 },
  infoLabel: { fontSize: 12, color: '#666', marginTop: 5 },
  separator: { width: 1, height: 40, backgroundColor: '#E0E0E0' },
  description: {
    textAlign: 'center',
    lineHeight: 20,
    color: '#1D1D1D',
    marginBottom: 10
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    width: '100%',
    marginBottom: 10,
  },
  statName: {
    width: 45,
    fontSize: 12,
    fontWeight: "bold",
  },
  statDivider: {
    width: 1,
    height: 15,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 10
  },
  statValue: {
    width: 35,
    fontSize: 14,
    marginRight: 10,
  },
  statBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    overflow: 'hidden'
  },
  statFill: {
    height: "100%",
    borderRadius: 10,
  },
});