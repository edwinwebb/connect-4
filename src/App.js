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
  const [chips, setChips] = useState(Array.from({length: 15}, (_,i)=>(i)));
  return(
    <group>
     {chips.map((chip, index) => (
        <Chip 
        key={index} 
        color={color}
        rotation={[0,0,0]}
        position={[
          (index * 0.08 + position[0]) - chips.length / 2 * 0.08,
          0.04 + position[1],
          0 + position[2]
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
  const coinRef = useRef();
  const dummyCoinRef = useRef();
  const physAPI = useRef();
  const controller = useController('right');
  const heldRef = useRef(false);
  const held = heldRef.current;

  useInteraction(coinRef, 'onHover', () => {
    setHovered(true);
  })

  useInteraction(coinRef, 'onBlur', () => {
    setHovered(false);
  })

  useInteraction(coinRef, 'onSelectStart', () => {
    if(interactive) {
      heldRef.current = true
    }
  })

  useInteraction(coinRef, 'onSelectMissed', (e) => {
    if(heldRef.current) {
      const ctarget = e.target.controller;
      physAPI.current.setTranslation({
        x: ctarget.position.x,
        y: ctarget.position.y,
        z: ctarget.position.z
      })
      physAPI.current.setRotation({
        x: ctarget.quaternion.x,
        y: ctarget.quaternion.y,
        z: ctarget.quaternion.z,
        w: ctarget.quaternion.w
      })
      physAPI.current.setAngvel({
        x: ctarget.angularVelocity.x,
        y: ctarget.angularVelocity.y,
        z: ctarget.angularVelocity.z
      })
      physAPI.current.setLinvel({
        x: ctarget.linearVelocity.x,
        y: ctarget.linearVelocity.y,
        z: ctarget.linearVelocity.z
      })
      heldRef.current = false
      setInteractive(false);
    }
    
  })

  useFrame(()=>{
    if (controller && held) {
      const ctarget = controller.controller;
      dummyCoinRef.current.position.set(
        ctarget.position.x,
        ctarget.position.y,
        ctarget.position.z
      )
      dummyCoinRef.current.rotation.set(
        ctarget.rotation.x,
        ctarget.rotation.y,
        ctarget.rotation.z
      )
    }
  })

  return (
    <>
      <RigidBody colliders={false} {...props} ref={physAPI} type="dynamic">
        <mesh ref={coinRef}>
          <cylinderBufferGeometry args={[0.04, 0.04, 0.01, 32]} />
          <meshStandardMaterial 
            color={hovered ? held ? 'green' : highlightColor : held ? 'green' : color} 
            visible={!held}
            />
        </mesh>
        <CylinderCollider args={[0.005, 0.04]} />
      </RigidBody>
      <mesh ref={dummyCoinRef}>
        <cylinderBufferGeometry args={[0.04, 0.04, 0.01, 32]} />
        <meshStandardMaterial 
          color={color} 
          visible={held}
          />
      </mesh>
    </>
  );
};

const Floor = () => {
  return (
    <RigidBody colliders="cuboid" type="fixed">
      <Box args={[10, 0.1, 10]} position={[0,-0.05,0]}>
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
          <Debug color="hotpink" sleepColor="yellow" scale={[1,2,1]} />
          <Chips color='red' position={[0,0,-0.2]} />
          <Chips color='yellow' position={[0,0,0.2]} />
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
