import { useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Sky, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import House from './House';
import Furniture from './Furniture';
import Garden from './Garden';
import { makeTextures } from '../textures';
import { ROOMS } from '../data';

// Keeps the active camera's field of view in sync with the zoom control.
function FovController({ fov }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }, [fov, camera]);
  return null;
}

const OVERVIEW_POS = new THREE.Vector3(11, 9, 14);
const OVERVIEW_TARGET = new THREE.Vector3(0, 0, -1);

// Orbit controls + smooth fly-to when a room is focused.
function OrbitRig({ focus }) {
  const controls = useRef();
  const { camera } = useThree();
  const anim = useRef(null);

  useEffect(() => {
    if (!focus) return;
    let pos, target;
    if (focus.id === 'overview') {
      pos = OVERVIEW_POS.clone();
      target = OVERVIEW_TARGET.clone();
    } else {
      const [cx, cz] = focus.center;
      // pull the camera up and toward the front of the house to look into the room
      pos = new THREE.Vector3(cx * 0.7, 5.5, cz + 6);
      target = new THREE.Vector3(cx, 0.8, cz);
    }
    anim.current = { pos, target };
  }, [focus]);

  useFrame((_, dt) => {
    if (!controls.current) return;
    if (anim.current) {
      const k = Math.min(1, dt * 3);
      camera.position.lerp(anim.current.pos, k);
      controls.current.target.lerp(anim.current.target, k);
      controls.current.update();
      if (camera.position.distanceTo(anim.current.pos) < 0.2) anim.current = null;
    }
  });

  return (
    <OrbitControls
      ref={controls}
      enableDamping
      dampingFactor={0.08}
      minDistance={3}
      maxDistance={40}
      maxPolarAngle={Math.PI / 2.05}
      target={[0, 0, -1]}
    />
  );
}

// First-person walk: drag-to-look (no Pointer Lock API, so it works in every
// browser/embed) + WASD / arrow-key movement at eye height.
function WalkRig() {
  const { camera, gl } = useThree();
  const keys = useRef({});
  const look = useRef({ yaw: Math.PI, pitch: 0, dragging: false, lx: 0, ly: 0 });

  useEffect(() => {
    camera.position.set(0, 1.6, 2.5);
    look.current.yaw = 0; // face into the house (−Z)
    look.current.pitch = 0;
    const el = gl.domElement;
    el.style.cursor = 'grab';

    const kd = (e) => (keys.current[e.code] = true);
    const ku = (e) => (keys.current[e.code] = false);
    const down = (e) => {
      look.current.dragging = true;
      look.current.lx = e.clientX;
      look.current.ly = e.clientY;
      el.style.cursor = 'grabbing';
    };
    const up = () => {
      look.current.dragging = false;
      el.style.cursor = 'grab';
    };
    const move = (e) => {
      if (!look.current.dragging) return;
      const dx = e.clientX - look.current.lx;
      const dy = e.clientY - look.current.ly;
      look.current.lx = e.clientX;
      look.current.ly = e.clientY;
      look.current.yaw -= dx * 0.005;
      look.current.pitch = THREE.MathUtils.clamp(look.current.pitch - dy * 0.005, -1.1, 1.1);
    };

    el.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointermove', move);
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    return () => {
      el.style.cursor = 'default';
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
    };
  }, [camera, gl]);

  useFrame((_, dt) => {
    // apply look orientation
    camera.rotation.set(look.current.pitch, look.current.yaw, 0, 'YXZ');

    // move relative to facing (ignoring pitch so WASD stays on the ground)
    const dir = new THREE.Vector3(-Math.sin(look.current.yaw), 0, -Math.cos(look.current.yaw));
    const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();
    const step = new THREE.Vector3();
    const k = keys.current;
    if (k['KeyW'] || k['ArrowUp']) step.add(dir);
    if (k['KeyS'] || k['ArrowDown']) step.sub(dir);
    if (k['KeyD'] || k['ArrowRight']) step.add(right);
    if (k['KeyA'] || k['ArrowLeft']) step.sub(right);
    if (step.lengthSq() > 0) {
      step.normalize().multiplyScalar(3.2 * Math.min(dt, 0.05));
      camera.position.add(step);
    }
    camera.position.y = 1.6;
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -6.3, 6.3);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -8.6, 5.4);
  });

  return null;
}

function Hotspots({ onSelect }) {
  return ROOMS.map((room) => (
    <Html
      key={room.id}
      position={[room.center[0], 1.7, room.center[1]]}
      center
      distanceFactor={12}
      zIndexRange={[10, 0]}
    >
      <button
        className="hotspot"
        onClick={(e) => {
          e.stopPropagation();
          onSelect(room);
        }}
      >
        <span className="hotspot-dot" />
        {room.name}
      </button>
    </Html>
  ));
}

export default function Scene({
  mode,
  showRoof,
  showWalls,
  showFurniture,
  night,
  realistic,
  fov,
  focus,
  onSelectRoom,
}) {
  const tex = useMemo(() => makeTextures(), []);

  return (
    <Canvas
      shadows="soft"
      camera={{ position: [11, 9, 14], fov: 50 }}
      dpr={[1, 2]}
      gl={{ antialias: true, toneMappingExposure: 1.08 }}
    >
      <FovController fov={fov} />
      <color attach="background" args={[night ? '#0a0f1e' : realistic ? '#a9c6dd' : '#c3d8e8']} />
      {realistic && !night && <fog attach="fog" args={['#a9c6dd', 42, 120]} />}
      {!night && <Sky sunPosition={[8, 6, 4]} turbidity={realistic ? 2.5 : 6} rayleigh={realistic ? 0.6 : 1.2} />}

      <hemisphereLight intensity={night ? 0.18 : 0.55} groundColor="#6b7d55" color="#bcd3e6" />
      <ambientLight intensity={night ? 0.12 : realistic ? 0.28 : 0.35} />
      <directionalLight
        castShadow
        position={[10, 14, 8]}
        intensity={night ? 0.25 : realistic ? 1.35 : 1.15}
        color={night ? '#9fb4e0' : '#fff6e6'}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-radius={5}
        shadow-camera-left={-24}
        shadow-camera-right={24}
        shadow-camera-top={24}
        shadow-camera-bottom={-24}
      />
      {realistic && !night && <directionalLight position={[-8, 6, -6]} intensity={0.25} color="#cfe0ff" />}

      {/* Ground / lawn */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial
          color={night ? '#2b3a26' : realistic ? '#5f8a46' : '#6f8f57'}
          map={realistic && !night ? tex.grass : null}
          bumpMap={realistic && !night ? tex.grass : null}
          bumpScale={0.08}
          roughness={1}
        />
      </mesh>

      {/* the whole house sits on an elevated foundation (~0.5 m) */}
      <group position={[0, 0.5, 0]}>
        <House showRoof={showRoof} showWalls={showWalls} realistic={realistic} tex={tex} />
        {showFurniture && <Furniture />}
      </group>
      <Garden />

      <ContactShadows position={[0, 0.03, -1]} scale={26} blur={2.4} opacity={night ? 0.25 : 0.5} far={8} />

      {mode === 'orbit' ? (
        <>
          <Hotspots onSelect={onSelectRoom} />
          <OrbitRig focus={focus} />
        </>
      ) : (
        <WalkRig />
      )}
    </Canvas>
  );
}
