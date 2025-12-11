import { View, ViewProps, ViewStyle } from "react-native"

type Props = ViewProps;

const Card = ({style, ...rest}: Props) => {
    return <View style={[style,]}{...rest}/>
}

const styles = {
    backgroundColor: '#FFF',
    borderRadius: 8
} satisfies ViewStyle

export default Card