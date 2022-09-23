import { Addition, Brush, Subtraction } from "@react-three/csg";
import { Box } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";

const rows = 6;
const cols = 7;
const hspacing = 0.005;
const vspacing = 0.001;
const radius = 0.04;
const diameter = radius * 2;
const wallGap = 0.01;
const wallThickness = 0.01;
const dividerWidth = hspacing;

const PhysBoard = () => {
  return (<>
    <RigidBody colliders={false} type="fixed" position={[0, rows * diameter / 2, 0]}>
      <CuboidCollider 
        args={[
          cols * (hspacing * 2 + diameter) / 2, 
          rows * diameter / 2, 
          wallThickness
        ]}
        position={[0,0,wallGap + wallThickness*2]} 
      />
      <CuboidCollider 
        args={[
            cols * (hspacing * 2 + diameter) / 2, 
            rows * diameter / 2, 
            wallThickness
          ]}
        position={[0,0,-wallGap - wallThickness*2]} 
      />

      {new Array(cols + 1).fill(0).map((col, index) => (
        <CuboidCollider args={[
          dividerWidth,
          rows * diameter / 2,
          wallGap
        ]}
        key={index}
        position={[
          (index - (cols) / 2) * (hspacing * 2 + diameter),
          0,
          0
        ]} 
        />
      ))}
    </RigidBody>
  </>
  )
}

const BoardHoleSubtractor = ({position}) => {
  return(<mesh position={position}>
    <Subtraction>
      <Brush a>
        <boxGeometry args={[
          hspacing * 2 + diameter,
          vspacing * 2 + diameter,
          wallThickness
        ]} />
      </Brush>
      <Brush b rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[radius * 0.8, radius * 0.8, wallThickness * 4, 32]} />
      </Brush>
    </Subtraction>
    <meshNormalMaterial />
  </mesh>)
}

const BoardMesh = ({position}) => {
  return (
    <group 
      position={position}
    >
      {
        Array.from({length: cols}, (_, colIndex) => (
          Array.from({length: rows}, (_, rowIndex) => (
            <BoardHoleSubtractor
              key={`${colIndex}-${rowIndex}`}
              position={[
                ((colIndex - cols / 2) * (hspacing * 2 + diameter)) + hspacing + radius,
                ((rowIndex - rows / 2) * (vspacing * 2 + diameter)) + vspacing + radius,
                0
              ]}
            />
          ))
        ))
      }
    </group>
  )
}

const Board = () => { 
  return (
    <>
      <PhysBoard />
      <BoardMesh 
        position={[
          0,
          rows * diameter / 2,
          wallGap
        ]} 
      />
      <BoardMesh 
        position={[
          0,
          rows * diameter / 2,
          -wallGap
        ]} 
      />
      {new Array(cols + 1).fill(0).map((col, index) => (
        <Box args={[
          dividerWidth,
          rows * diameter,
          wallGap
        ]}
        key={index}
        position={[
          (index - (cols) / 2) * (hspacing * 2 + diameter),
          rows * diameter / 2,
          0
        ]}>

          <meshNormalMaterial />
        </Box>
      ))}
    </>
  );
};

export default Board;