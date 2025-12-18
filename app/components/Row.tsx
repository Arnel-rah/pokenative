import { View, ViewProps, ViewStyle } from "react-native"

type Props = ViewProps & {
    gap?: number
}

const Row = ({style, gap, ...rest}: Props) => {
    return <View style={[rowStyle, style, gap ? {gap: gap} :undefined]} {...rest}></View>
}
export default Row
const rowStyle = {
    flex: 0, 
    flexDirection: 'row',
    alignItems: 'center',
} satisfies ViewStyle;