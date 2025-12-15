import Shadow from "@/constants/Shadow";
import useThemeColors from "@/hooks/useThemeColors";
import { View, ViewProps, ViewStyle } from "react-native"

type Props = ViewProps;

const Card = ({style, ...rest}: Props) => {
    const color = useThemeColors()
    return <View style={[style, styles, {backgroundColor: color.grayWhite}]}{...rest}/>
}

const styles = {
    borderRadius: 8,
    overflow: 'hidden',
    margin: 4,
    ...Shadow.dp2
} satisfies ViewStyle

export default Card