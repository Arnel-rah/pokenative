import { Image, ViewStyle } from "react-native"
import Card from "../Card"
import ThemedText from "../ThemedText"

type Props = {
    style?: ViewStyle,
    id: number,
    name: string
}

const PokemonCard = ({style, id, name}: Props) => {
    return <Card style={style}>
        <ThemedText variant="caption" color="grayMeduim">#{id.toString().padStart(3,'0')}</ThemedText>
        <Image source={{uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`}}
        width={72}
        height={72}
        />
    </Card>

}

export default PokemonCard