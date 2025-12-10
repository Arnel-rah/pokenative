import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";


export const hooksColors = () => {
    const colors = useColorScheme() ?? 'light';
    return  Colors[colors];
}