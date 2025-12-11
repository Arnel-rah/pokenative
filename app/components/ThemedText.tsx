import useThemeColors from "@/hooks/useThemeColors";
import { Colors } from "@/constants/Colors";
import { StyleSheet, Text, TextProps } from "react-native";

const styles = StyleSheet.create({
  body3: {
    fontSize: 10,
    lineHeight: 16,
  },
  caption: {
    fontWeight: "normal",
    lineHeight: 12,
    fontSize: 8,
  },
  headline: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "bold",
  },
  subtitle1: {
    fontWeight: "bold",
    lineHeight: 16,
    fontSize: 14,
  },
  subtitle2: {
    fontWeight: "bold",
    lineHeight: 16,
    fontSize: 12,
  },
  subtitle3: {
    fontWeight: "bold",
    lineHeight: 16,
    fontSize: 10,
  },
});

type ThemeColorSet = typeof Colors.light;

type Props = TextProps & {
  variant?: keyof typeof styles;
  color?: keyof ThemeColorSet;
};

const ThemedText = ({ variant, color, ...rest }: Props) => {
  const colors = useThemeColors();
  return (
    <Text
      style={[
        styles[variant ?? "body3"],
        { color: colors[color ?? "grayDark"] },
      ]}
      {...rest}
    />
  );
};

export default ThemedText;
