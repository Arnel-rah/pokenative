import { Text,TextProps } from "react-native"

type Props = TextProps & {
    variant?: string
    color?: string
}

 const ThemedText = ({variant, color, ...rest}: Props) => {
    return <Text {...rest}/>

}

export default ThemedText