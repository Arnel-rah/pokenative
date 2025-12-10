import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";

type ThemeColorSet = typeof Colors.light;

const useThemeColors = (): ThemeColorSet => {
  const theme = useColorScheme() ?? "light";
  return Colors[theme];
};

export default useThemeColors;
