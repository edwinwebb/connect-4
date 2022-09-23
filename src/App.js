import { Box, Cylinder, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber'
import { CylinderCollider, Debug, InstancedRigidBodies, Physics, RigidBody } from '@react-three/rapier';
import { Controllers, Hands, useController, useInteraction, VRButton, XR, XRButton } from '@react-three/xr';
import React, { useState, useRef, useEffect, Suspense, useCallback } from 'react';
import { useGLTF } from "@react-three/drei";
import { Addition, Brush, Subtraction } from '@react-three/csg';
import PhysBoard from './Board';

// chips
const Chips = ({color= 'green', position = [0,0,0]}) => {
  const [chips, setChips] = useState([1,2,3]);
  return(
    <group position={position}>
     {chips.map((chip, index) => (
        <Chip 
        key={index} 
        color={color}
        position={[
          (Math.random(0) - 0.5) * 0.01,
          index * 1.02,
          (Math.random(0) - 0.5) * 0.01
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
  // const [held, setHeld] = useState(false);
  const coinRef = useRef();
  const dummyCoinRef = useRef();
  const physAPI = useRef();
  const controller = useController('right')
  const controller2 = useController('left')
  const missedRef = useRef()
  const held2 = useRef(false)
  const held = held2.current


  useInteraction(coinRef, 'onHover', () => {
    setHovered(true);
  })

  useInteraction(coinRef, 'onBlur', () => {
    setHovered(false);
  })

  useInteraction(coinRef, 'onSelectStart', () => {
    if(interactive) {
      held2.current = true
    }
  })

  useInteraction(missedRef, 'onSelectEnd', (e) => {
    console.log('end', held)
  })

  useInteraction(missedRef, 'onSelectMissed', (e) => {
    if(held2.current) {
      physAPI.current.setTranslation({
        x: e.target.grip.position.x,
        y: e.target.grip.position.y,
        z: e.target.grip.position.z
      })
      physAPI.current.setRotation({
        x: e.target.grip.quaternion.x,
        y: e.target.grip.quaternion.y,
        z: e.target.grip.quaternion.z,
        w: e.target.grip.quaternion.w
      })
      physAPI.current.setAngvel({
        x: e.target.grip.angularVelocity.x,
        y: e.target.grip.angularVelocity.y,
        z: e.target.grip.angularVelocity.z
      })
      physAPI.current.setLinvel({
        x: e.target.grip.linearVelocity.x,
        y: e.target.grip.linearVelocity.y,
        z: e.target.grip.linearVelocity.z
      })
      held2.current = false
      setInteractive(false);
    }
    
  })

  useFrame(()=>{
    if (controller && held) {
      dummyCoinRef.current.position.set(
        controller.grip.position.x,
        controller.grip.position.y,
        controller.grip.position.z
      )
      dummyCoinRef.current.rotation.set(
        controller.grip.rotation.x,
        controller.grip.rotation.y,
        controller.grip.rotation.z
      )
    }
  })

  return (
    <>
      <RigidBody colliders={false} {...props} ref={physAPI} type="dynamic">
        <mesh ref={coinRef}>
          <cylinderBufferGeometry args={[0.04, 0.04, 0.02, 32]} />
          <meshStandardMaterial 
            color={hovered ? held ? 'green' : highlightColor : held ? 'green' : color} 
            visible={!held}
            />
        </mesh>
        <CylinderCollider args={[0.01, 0.04]} />
      </RigidBody>
      <mesh ref={dummyCoinRef}>
        <cylinderBufferGeometry args={[0.04, 0.04, 0.02, 32]} />
        <meshStandardMaterial 
          color={'pink'} 
          visible={held}
          />
      </mesh>
      <Box args={[.1,.1,.1]} ref={missedRef} position={[1,0,0]} />
    </>
  );
};

const ChipAdder = () => {
  const [chips, setChips] = useState([])
  const groupRef = useRef()
  useInteraction(groupRef, 'onSelectMissed', (e) => {
    console.log(chips)
    const chip = <Chip 
      key={chips.length}
      color={chips.length % 2 ? 'red' : 'yellow'}  
      position={[
        e.target.controller.position.x,
        e.target.controller.position.y,
        e.target.controller.position.z
      ]}
      rotation={[
        e.target.controller.rotation.x,
        e.target.controller.rotation.y,
        e.target.controller.rotation.z
      ]}
    />
    chips.push(chip)
    setChips(chips)
  })
  return(
    <group ref={groupRef}>
      {chips}
      <Box args={[0.1, 0.1, 0.1]} position={[0, 0, 0]} visible={false} />
    </group>
  )
}

const Chips2 = () => {
  const [chips, setChips] = useState([])
  const [positions, setPositions] = useState([])
  const [rotations, setRotations] = useState([])
  const boxRef = useRef()
  const instancedApi = useRef(null);

  const count = chips.length
  
  // const rotations = Array.from({ length: count }, () => [Math.random(), Math.random(), Math.random()])

  useInteraction(boxRef, 'onSelectMissed', (e) => {
    //const newArray = [...positions, e.target.controller.position.toArray()]
    //console.log(e, chips, positions, newArray)
    chips.push(0)
    positions.push(e.target.controller.position.toArray())
    rotations.push(e.target.controller.rotation.toArray())
    setPositions(positions)
    setChips(chips)
  })

  return(
    <>
      <Box args={[0.1, 0.1, 0.1]} position={[0, 0, 0]} ref={boxRef} />
    
      <InstancedRigidBodies positions={positions} rotations={rotations} colliders={false} ref={instancedApi}>
        <CylinderCollider args={[0.01, 0.04]} />
        <instancedMesh receiveShadow castShadow args={[undefined, undefined, count]} dispose={null}>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 32]} />
          <meshStandardMaterial color={'pink'} />
        </instancedMesh>
      </InstancedRigidBodies>
    </>
  )
}

const Floor = () => {
  return (
    <RigidBody colliders="cuboid" type="fixed">
      <Box args={[10, 0.1, 10]} position={[0,-.05,0]}>
        <meshStandardMaterial color="gray" />
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
          -9.81,
          0
        ]}>
          <Debug color="red" sleepColor="blue" scale={1} />
          <Chips color='red' position={[0,0,0]} />
          <Floor />
          <PhysBoard />
        </Physics>
        <Controllers />
      </XR>
      <OrbitControls />
    </Canvas>
    <VRButton />
  </>);
}

export default App;
