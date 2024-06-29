import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url, scale, initialRotation }) {
  const { scene, animations } = useGLTF(url);
  const mixer = useRef(null);

  useEffect(() => {
    if (animations && animations.length) {
      mixer.current = new THREE.AnimationMixer(scene);
      animations.forEach(clip => {
        mixer.current.clipAction(clip).play();
      });
    }
    return () => {
      if (mixer.current) {
        mixer.current.stopAllAction();
      }
    };
  }, [animations, scene]);

  useFrame((state, delta) => {
    if (mixer.current) mixer.current.update(delta);
  });

  scene.scale.set(scale, scale, scale);

  // Set initial rotation
  useEffect(() => {
    if (initialRotation) {
      scene.rotation.x = initialRotation[0];
      scene.rotation.y = initialRotation[1];
      scene.rotation.z = initialRotation[2];
    }
  }, [initialRotation, scene]);

  return <primitive object={scene} />;
}

function ThreeDModel() {
  const defaultScale = 1.8; // Adjust this value to increase or decrease the size
  const defaultRotation = [0.4, 2.8, 0]; // Adjust these values for the initial rotation

  return (
    <div className="canvas-container">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60, near: 0.1, far: 1000 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Model
            url="/models/tenhun_falling_spaceman_fanart/scene.gltf"
            scale={defaultScale}
            initialRotation={defaultRotation}
          />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default ThreeDModel;
