import  ThemedText  from "@/app/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style= {[styles.container, {backgroundColor: Colors.light.tint} ]}>
    <ThemedText variant="headline" color="grayWhite">Pokédex</ThemedText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})