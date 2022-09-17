import { Box, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber'
import { CylinderCollider, Debug, Physics, RigidBody } from '@react-three/rapier';
import { Controllers, Hands, useController, useInteraction, VRButton, XR, XRButton } from '@react-three/xr';
import { useState, useRef, useEffect } from 'react';

// board
// chips
const Chips = () => {
  const [chips, setChips] = useState([1,2,3,4,5]);
  return(
    <>
     {chips.map((chip, index) => (
        <Chip key={index} />
      ))}
    </>
  )
}

const Chip = () => {
  const color = 'red'

  return (
    <RigidBody colliders={false} position={[0, 5, 0]}>
      <mesh>
        <cylinderBufferGeometry args={[0.04, 0.04, 0.01]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <CylinderCollider args={[0.005, 0.04]} />
    </RigidBody>
  );
};

const Floor = () => {
  return (
    <RigidBody colliders="cuboid" type="fixed">
      <Box args={[10, 0.1, 10]}>
        <meshStandardMaterial color="green" />
      </Box>
    </RigidBody>
  );
};

function App() {
  return (<>
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <XR>
        <Physics>
          <Debug color="red" sleepColor="blue" />
          <Chip />
          <Floor />
        </Physics>
      </XR>
      <OrbitControls />
    </Canvas>
    <VRButton />
  </>);
}

export default App;
