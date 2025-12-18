import  ThemedText  from "@/app/components/ThemedText";import { StyleSheet, Text, View, Image, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "./components/Card";
import useThemeColors from "@/hooks/useThemeColors";
import PokemonCard from "./components/pokemon/PokemonCard";
import useFetchQuery from "@/hooks/useFetchQuerry";
import getPokemonId from "@/function/pokemon";
import SearchBar from "./components/SearchBar";
import { useState } from "react";
import Row from "./components/Row";


export default function Index() {
  const colors = useThemeColors();

  const {data, isFetching} = useFetchQuery('/pokemon?limit=21');
  // const pokemons = data?.pages.flatMap((page: { results: any; }) => page.results) ?? [];
  const pokemons = data?.results ?? []
  const [search, setSearch] = useState('');
  return (
    <SafeAreaView style= {[styles.container, {backgroundColor: colors.tint} ]}>
      <Row style={styles.header} gap={16}>
        <Image source={require("@/assets/images/pokeball.png")} width={24} height={24}/>
        <ThemedText variant="headline" color="grayLight">Pokédex</ThemedText>
      </Row>
      <Row>
        <SearchBar value={search} onChange={setSearch}/>
      </Row>
      <Card style={styles.bodyCard}>
        <FlatList data={pokemons} 
        numColumns={3} 
        ListFooterComponent={
          isFetching ? <ActivityIndicator color={colors.tint} style={{padding: 4}}/> : null
        }
        columnWrapperStyle={[styles.gridGap, styles.list]}
        renderItem={({item}) => <PokemonCard id={getPokemonId(item.url)} name={item.name} style={{flex: 1/3}}/>}
        keyExtractor={(item) => item.url}/>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 12,
  },
  bodyCard: {
    flex: 1,
  },
  gridGap:{
    gap: 8
  },
  list: {
    padding: 12
  }
})

function useInfiniteFetchQuery(arg0: string): { data: any; isFetching: any; } {
  throw new Error("Function not implemented.");
}
