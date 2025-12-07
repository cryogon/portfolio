import { Text } from "@react-three/drei";
import { editable as e } from "@theatre/r3f";

const CryogonText = () => {
  return (
    <e.group theatreKey="HeaderText">
      <Text
        font="/fonts/CinzelDecorative-Black.ttf" // Path to file in 'public' folder
        fontSize={1}
        color="white"
        anchorX="center"
        anchorY="middle"
        letterSpacing={-0.03}
      >
        CRYOGON
      </Text>
    </e.group>
  );
};

export default CryogonText;
