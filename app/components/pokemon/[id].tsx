import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, SafeAreaView, TouchableOpacity, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

type PokemonDetail = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  cries: { latest: string };
  sprites: {
    other: {
      "official-artwork": { front_default: string };
    };
  };
};

const endPoint = "https://pokeapi.co/api/v2";

const TYPE_COLORS: Record<string, string> = {
  fire: "#F57C00", grass: "#74CB48", water: "#6493EB", bug: "#A7B723",
  normal: "#AAA67F", poison: "#A43E9E", electric: "#F9CF30", ground: "#DEC16B",
  fairy: "#E69EAC", fighting: "#C12239", psychic: "#FB5584", rock: "#B69E31",
  ghost: "#705594", ice: "#9AD6DF", dragon: "#7037FF", dark: "#75574C", steel: "#B7B9D0"
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

  async function playCry() {
    if (data?.cries?.latest) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: data.cries.latest },
          { shouldPlay: true }
        );
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync();
          }
        });
      } catch (e) {
        console.error("Erreur audio:", e);
      }
    }
  }

  if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" color="#F57C00" /></View>;
  if (error || !data) return <View style={styles.center}><Text>Pokémon introuvable</Text></View>;

  const mainColor = TYPE_COLORS[data.types[0].type.name] || "#F57C00";

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: mainColor }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerName}>{data.name}</Text>
        <Text style={styles.headerId}>#{data.id.toString().padStart(3, "0")}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* IMAGE & NAVIGATION FLÈCHES */}
        <View style={styles.imageSection}>
          <TouchableOpacity style={styles.navArrow} onPress={() => router.setParams({ id: (data.id - 1).toString() })}>
            <Ionicons name="chevron-back" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.9} onPress={playCry}>
            <Image
              source={{ uri: data.sprites.other["official-artwork"].front_default }}
              style={styles.image}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.navArrow} onPress={() => router.setParams({ id: (data.id + 1).toString() })}>
            <Ionicons name="chevron-forward" size={30} color="white" />
          </TouchableOpacity>
        </View>

        {/* CARD BLANCHE */}
        <View style={styles.card}>
          <View style={styles.typesRow}>
            {data.types.map(t => (
              <View key={t.type.name} style={[styles.typeBadge, { backgroundColor: mainColor }]}>
                <Text style={styles.typeText}>{t.type.name}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { color: mainColor }]}>About</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <View style={styles.infoValueContainer}>
                <Ionicons name="scale-outline" size={16} color="#1D1D1D" />
                <Text style={styles.infoValue}>{data.weight / 10} kg</Text>
              </View>
              <Text style={styles.infoLabel}>Weight</Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoBox}>
              <View style={styles.infoValueContainer}>
                <Ionicons name="resize-outline" size={16} color="#1D1D1D" />
                <Text style={styles.infoValue}>{data.height / 10} m</Text>
              </View>
              <Text style={styles.infoLabel}>Height</Text>
            </View>
          </View>

          <Text style={styles.description}>
            Cliquez sur le Pokémon pour entendre son cri. Ce Pokémon a une préférence pour les choses chaudes.
          </Text>

          <Text style={[styles.sectionTitle, { color: mainColor, marginTop: 20 }]}>Base Stats</Text>

          {data.stats.map(stat => {
            const statAbbr = stat.stat.name.toUpperCase()
              .replace('SPECIAL-ATTACK', 'SATK').replace('SPECIAL-DEFENSE', 'SDEF').replace('SPEED', 'SPD');
            
            return (
              <View key={stat.stat.name} style={styles.statRow}>
                <Text style={[styles.statName, { color: mainColor }]}>{statAbbr}</Text>
                <View style={styles.statDivider} />
                <Text style={styles.statValue}>{stat.base_stat.toString().padStart(3, "0")}</Text>
                <View style={styles.statBarBg}>
                  <View style={[styles.statFill, { width: `${Math.min(stat.base_stat / 1.5, 100)}%`, backgroundColor: mainColor }]} />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    justifyContent: 'space-between'
  },
  headerName: { color: 'white', fontSize: 28, fontWeight: 'bold', textTransform: 'capitalize', flex: 1, marginLeft: 15 },
  headerId: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  scrollContent: { alignItems: 'center', paddingTop: 20, paddingBottom: 40 },
  imageSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    zIndex: 1,
    marginBottom: -60,
  },
  navArrow: { padding: 10 },
  image: { width: 220, height: 220 },
  card: {
    backgroundColor: "white",
    width: '94%',
    borderRadius: 12,
    paddingTop: 70,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  typesRow: { flexDirection: 'row', marginBottom: 20 },
  typeBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginHorizontal: 5 },
  typeText: { color: 'white', fontWeight: 'bold', textTransform: 'capitalize', fontSize: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  infoRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-evenly', alignItems: 'center', marginBottom: 20 },
  infoBox: { alignItems: 'center', flex: 1 },
  infoValueContainer: { flexDirection: 'row', alignItems: 'center' },
  infoValue: { fontSize: 14, fontWeight: '500', marginLeft: 8, color: '#1D1D1D' },
  infoLabel: { fontSize: 11, color: '#666', marginTop: 8 },
  separator: { width: 1, height: 40, backgroundColor: '#E0E0E0' },
  description: { textAlign: 'center', fontSize: 13, lineHeight: 18, color: '#1D1D1D', paddingHorizontal: 10 },
  statRow: { flexDirection: "row", alignItems: "center", width: '100%', marginBottom: 12 },
  statName: { width: 40, fontSize: 12, fontWeight: "bold" },
  statDivider: { width: 1, height: 20, backgroundColor: '#E0E0E0', marginHorizontal: 15 },
  statValue: { width: 30, fontSize: 13, marginRight: 10, color: '#1D1D1D' },
  statBarBg: { flex: 1, height: 8, backgroundColor: '#F0F0F0', borderRadius: 10, overflow: 'hidden' },
  statFill: { height: "100%", borderRadius: 10 },
});