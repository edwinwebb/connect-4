import { Box, Cylinder, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber'
import { CylinderCollider, Debug, Physics, RigidBody } from '@react-three/rapier';
import { Controllers, Hands, useController, useInteraction, VRButton, XR, XRButton } from '@react-three/xr';
import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useGLTF } from "@react-three/drei";
import { Addition, Brush, Subtraction } from '@react-three/csg';

export function BoardModel(props) {
  const { nodes, materials } = useGLTF("/connect4.gltf");
  return (
    <group {...props} dispose={null}>
      <RigidBody colliders="trimesh" type="fixed" 
        rotation={[Math.PI / 2, 0, 0]}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Board.geometry}
        material={materials.BluePlastic}
        scale={0.001}
      />
      </RigidBody>
    </group>
  );
}

useGLTF.preload("/connect4.gltf");

const Board = () => { 
  return (
    <Suspense fallback={null}>
      <BoardModel />
    </Suspense>
  );
};

// const BoardRenderer = () => {
//   return (
//     <group>
//       <mesh>
//         <Subtraction>
//           <Brush a position={[0,0,wallSize]}>
//             <boxGeometry args={[
//               cols * (hspacing * 2 + radius * 2), 
//               rows * (vspacing * 2 + radius * 2), 
//               wallSize / 2
//             ]}
//             />
//           </Brush>
//           <Brush a position={[0,0,-wallSize]}>
//             <boxGeometry args={[
//               cols * (hspacing * 2 + radius * 2), 
//               rows * (vspacing * 2 + radius * 2), 
//               wallSize / 2
//             ]}
//             />
//           </Brush>
//           {
//             new Array((cols)).fill(0).map((col, colIndex) => (
//               <>
//                 {
//                   new Array((rows)).fill(0).map((row, rowIndex) => (
//                     <Brush b
//                       position={[
//                         ((colIndex - cols / 2) * (hspacing * 2 + radius * 2)) + hspacing + radius,
//                         ((rowIndex - rows / 2) * (vspacing * 2 + radius * 2)) + vspacing + radius,
//                         0
//                       ]}
//                       rotation={[Math.PI/2, 0, 0]}
//                     >
//                       <cylinderGeometry args={[radius * 0.8, radius * 0.8, wallSize * 4, 32]} />
//                     </Brush>
//                   ))
//                 }
//               </>
//             ))
//           }
//         </Subtraction>
//         <meshNormalMaterial />
//       </mesh>
//     </group>
//   );
// };

const PhysBoard = () => {
  const rows = 6;
  const cols = 7;
  const hspacing = 0.025;
  const vspacing = 0;
  const radius = 0.02;
  const wallSize = 0.02;

  return (<>
    <RigidBody colliders="cuboid" type="fixed" position={[0, rows * radius * 2, 0]}>
      <Box
        args={[
          cols * (hspacing * 2 + radius * 2), 
          rows * radius * 4, 
          wallSize / 2
        ]}
        position={[0,0,wallSize]} 
      >
        <meshStandardMaterial color="blue" transparent opacity={0.4} />
        </Box>
      <Box 
        args={[
          cols * (hspacing * 2 + radius * 2), 
          rows * radius * 4, 
          .02
        ]}
      position={[0,0,-wallSize]} 
      >
        <meshStandardMaterial color="blue" transparent opacity={0.4} />
      </Box>
      {new Array(cols + 1).fill(0).map((col, index) => (
        <Box args={[
          .01,
          rows * radius * 4,
          wallSize
        ]}
        key={index}
        position={[
          (index - (cols) / 2) * (hspacing * 2 + radius * 2),
          0,
          0
        ]} 
        />
      ))}
    </RigidBody>
  </>
  )
}


// board
// chips
const Chips = ({color= 'green', position = [0,0,0]}) => {
  const [chips, setChips] = useState([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);
  return(
    <group position={position}>
     {chips.map((chip, index) => (
        <Chip 
        key={index} 
        color={color}
        position={[
          (Math.random(0) - 0.5) * 0.025,
          index * 0.03,
          (Math.random(0) - 0.5) * 0.025
        ]}/>))
      }
    </group>
  )
}

const Chip = (props) => {
  const color = props.color
  const highlightColor = 'blue'
  const [interactive, setInteractive] = useState(true);
  const [hovered, setHovered] = useState(false);
  const right = useController('right');
  const coinRef = useRef();

  useInteraction(coinRef, 'onSelectStart', (e) => {
    console.log(e)
    if(interactive) {
      setInteractive(false)

      //coinRef.current.applyImpulse(right.velocity, right.angularVelocity);
    }
  })

  useInteraction(coinRef, 'onHover', () => {
    setHovered(true);
  })

  useInteraction(coinRef, 'onBlur', () => {
    setHovered(false);
  })


  return (
    <RigidBody colliders={false} {...props}>
      <mesh ref={coinRef}>
        <cylinderBufferGeometry args={[0.04, 0.04, 0.02, 32]} />
        <meshStandardMaterial color={hovered ? highlightColor : color} />
      </mesh>
      <CylinderCollider args={[0.01, 0.04]} />
    </RigidBody>
  );
};

const Floor = () => {
  return (
    <RigidBody colliders="cuboid" type="fixed">
      <Box args={[10, 0.1, 10]} position={[0,-.05,0]}>
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
        <Physics gravity={[
          0,
          -9.81/10,
          0
        ]}>
          <Debug color="red" sleepColor="blue" scale={1} />
          <Chips color="red" position={[-0.5,0.1,0]} />
          <Chips color="yellow" position={[0.5,0.1,0]} />
          <Floor />
          <PhysBoard />
        </Physics>
      </XR>
      <OrbitControls />
    </Canvas>
    <VRButton />
  </>);
}

export default App;
