import { Image, TextInput } from "react-native";
import Row from "./Row";

type Props = {
  value: string;
  onChange: (s: string) => void;
};
const SearchBar = ({ value, onChange }: Props) => {
  return (
    <Row>
      <Image
        source={require("@/assets/images/search.png")}
        width={16}
        height={16}
      />
      <TextInput value={value} onChangeText={onChange} />
    </Row>
  );
};

export default SearchBar;
