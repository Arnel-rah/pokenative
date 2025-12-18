import { TextInput } from "react-native"


type Props = {
    value: string,
    onChange: (s: string) => void
}
const SearchBar = ({value, onChange}: Props) => {
    return <TextInput value={value} onChangeText={onChange} />

}

export default SearchBar