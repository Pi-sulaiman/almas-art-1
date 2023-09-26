import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRoute, useLocation } from 'wouter';
import { easing } from 'maath';
import { suspend } from 'suspend-react';
import getUuid from 'uuid-by-string';
import { MeshReflectorMaterial, Image, Text, Environment, useCursor } from '@react-three/drei';
import * as THREE from 'three';  // Make sure to import THREE.
import logo from './logo.svg'

const city = import('./a.exr').then((module) => module.default);

const GOLDENRATIO = 1.61803398875;

export const App = ({ images }) => {
  const mqlRef = useRef();
  mqlRef.current ??= window.matchMedia('(orientation:portrait)');
  const [portrait, setPortrait] = useState(mqlRef.current.matches);
  

  useEffect(() => {
    const handleChange = (e) => setPortrait(e.matches);
    enterFullScreen()
    mqlRef.current.addEventListener('change', handleChange);
    return () => mqlRef.current.removeEventListener('change', handleChange);
  }, []);

  console.log(portrait, "dlkjfglsj");
  const [isFullScreen, setIsFullScreen] = useState(false);

  const enterFullScreen = async () => {
    try {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
      setIsFullScreen(true);
    } catch (error) {
      console.error('Error entering full screen:', error);
    }
  };

  const exitFullScreen = () => {
    try {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullScreen(false);
    } catch (error) {
      console.error('Error exiting full screen:', error);
    }
  };


  return portrait ? (
    <div className='rotate'>
      <img src='/12.gif' alt="my-gif" />

    </div>
  ) : (
    <>
    <a className='web-link'  href='https://almas-f.vercel.app/'>
    <img src={logo} />
    </a>
    <Canvas  onClick={enterFullScreen} dpr={[1, 1.5]} camera={{ fov: 70, position: [0, 2, 15] }}>
      <color attach="background" args={['#191920']} />
      <fog attach="fog" args={['#191920', 0, 15]} />
      <group position={[0, -0.5, 0]}>
        <Frames images={images} />
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={2048}
            mixBlur={1}
            mixStrength={80}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#050505"
            metalness={0.5}
          />
        </mesh>
      </group>

      {/* <Environment preset="city" /> */}
      {/* <Environment files="./123.hdr" /> */}
      <Environment files={suspend(city)} /> 
      {/* {startTransition(() => (
        <Environment files={suspend(city)} />
      ))} */}
    </Canvas>
    </>
  );
}

function Frames({ images, q = new THREE.Quaternion(), p = new THREE.Vector3() }) {
  const ref = useRef()
  const clicked = useRef()
  const [, params] = useRoute('/item/:id')
  const [, setLocation] = useLocation()
  useEffect(() => {
    clicked.current = ref.current.getObjectByName(params?.id)
    if (clicked.current) {
      clicked.current.parent.updateWorldMatrix(true, true)
      clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25))
      clicked.current.parent.getWorldQuaternion(q)
    } else {
      p.set(0, 0, 5.5)
      q.identity()
    }
  })
  useFrame((state, dt) => {
    easing.damp3(state.camera.position, p, 0.4, dt)
    easing.dampQ(state.camera.quaternion, q, 0.4, dt)
  })

  
  return (
    <group
      ref={ref}
      // data= {props.text}
      onClick={(e) => (e.stopPropagation(), setLocation(clicked.current === e.object ? '/' : '/item/' + e.object.text),console.log(e))}
      onPointerMissed={() => setLocation('/')}>
      {images.map((props) => <Frame key={props.url} {...props} /> /* prettier-ignore */)}
    </group>

  )
}

function Frame({ url, c = new THREE.Color(), ...props }) {
  // console.log(props);
  const image = useRef()
  const frame = useRef()
  const [, params] = useRoute('/item/:id')
  const [hovered, hover] = useState(false)
  const [rnd] = useState(() => Math.random())
  const name = getUuid(url)
  const isActive = params?.id === props.text
  console.log("params?.id === props.text",params?.id === props.text,params?.id ,props.text)
  useCursor(hovered)
  useFrame((state, dt) => { 
    image.current.material.zoom = 2 + Math.sin(rnd * 10000 + state.clock.elapsedTime / 3) / 2
    easing.damp3(image.current.scale, [0.85 * (!isActive && hovered ? 0.995 : 1), 0.9 * (!isActive && hovered ? 0.995 : 1), 1], 0.1, dt)
    easing.dampC(frame.current.material.color, hovered ? '#8176FF' : 'white', 0.1, dt)
  })
  return (
    <group {...props}>
      <mesh
        name={props.text}
        text={props.text}
        onPointerOver={(e) => (e.stopPropagation(), hover(true))}
        onPointerOut={() => hover(false)}
        scale={[1, GOLDENRATIO, 0.05]}
        position={[0, GOLDENRATIO / 2, 0]}>
        <boxGeometry />
        <meshStandardMaterial color="#151515" metalness={1} roughness={0} envMapIntensity={2} />
        <mesh ref={frame} raycast={() => null} scale={[0.9, 0.93, 0.9]} position={[0, 0, 0.2]}>
          <boxGeometry />
          <meshBasicMaterial toneMapped={false} fog={false} />
        </mesh>
        <Image raycast={() => null} ref={image} position={[0, 0, 0.7]} url={url} />
      </mesh>
      <Text maxWidth={0.1} anchorX="left" anchorY="top" position={[0.55, GOLDENRATIO, 0]} fontSize={0.025}>
        {/* {name.split('-').join(' ')} */}
        {props.text}
        {props.text1}
      </Text>
    </group>
  )
  
}
