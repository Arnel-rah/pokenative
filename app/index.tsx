import  ThemedText  from "@/app/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Card from "./components/Card";

export default function Index() {
  return (
    <SafeAreaView style= {[styles.container, {backgroundColor: Colors.light.tint} ]}>
      <View style={styles.header}>
        <Image source={require("@/assets/images/pokeball.png")} width={24} height={24}/>
        <ThemedText variant="headline" color="grayDark">Pokédex</ThemedText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row'
  }
})