import { Box } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

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


/*
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
*/

export default PhysBoard;