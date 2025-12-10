import  ThemedText  from "@/app/components/ThemedText";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style= {styles.container}>
    <ThemedText variant="headline" color="grayWhite">Pokedex</ThemedText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})