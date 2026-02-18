import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, useTexture, Html } from '@react-three/drei'
import * as THREE from 'three'

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)
  
  const [earthTexture, cloudsTexture] = useTexture([
    'https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg',
    'https://unpkg.com/three-globe@2.31.0/example/img/earth-clouds.png',
  ])

  useEffect(() => {
    if (earthTexture) {
      earthTexture.wrapS = earthTexture.wrapT = THREE.RepeatWrapping
    }
    if (cloudsTexture) {
      cloudsTexture.wrapS = cloudsTexture.wrapT = THREE.RepeatWrapping
    }
  }, [earthTexture, cloudsTexture])

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.07
    }
  })

  return (
    <group>
      {/* Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Clouds */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.05, 64, 64]} />
        <meshStandardMaterial
          map={cloudsTexture}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>

      {/* Atmosphere glow */}
      <Atmosphere />
    </group>
  )
}

function Atmosphere() {
  const atmosphereRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.001
    }
  })

  return (
    <mesh ref={atmosphereRef} scale={[1.15, 1.15, 1.15]}>
      <sphereGeometry args={[2, 64, 64]} />
      <shaderMaterial
        vertexShader={`
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 atmosphere = vec3(0.3, 0.6, 1.0) * intensity;
            gl_FragColor = vec4(atmosphere, 1.0);
          }
        `}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        transparent
      />
    </mesh>
  )
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin" />
        <span className="text-earth-200 font-medium">Loading Earth...</span>
      </div>
    </Html>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-5, -3, -5]} intensity={0.3} color="#22d3ee" />
      
      <Earth />
      
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
      
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={10}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
    </>
  )
}

export default function EarthGlobe() {
  const [webglSupported, setWebglSupported] = useState(true)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) {
        setWebglSupported(false)
      }
    } catch {
      setWebglSupported(false)
    }
  }, [])

  if (!webglSupported) {
    return (
      <div className="h-full flex items-center justify-center bg-earth-900">
        <div className="text-center max-w-md px-6">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-earth-800 flex items-center justify-center">
            <svg className="w-12 h-12 text-earth-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-white mb-3">WebGL Not Available</h2>
          <p className="text-earth-400 mb-6">
            Your browser doesn't support WebGL, which is required for the 3D Earth experience.
          </p>
          <p className="text-earth-500 text-sm">
            Try using a modern browser like Chrome, Firefox, or Edge to view the interactive globe.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      {/* Overlay UI */}
      <div className="absolute top-6 left-6 z-10">
        <div className="glass rounded-xl px-4 py-3">
          <h1 className="font-display font-bold text-xl text-white">Explore Earth</h1>
          <p className="text-earth-400 text-sm">Drag to rotate • Scroll to zoom</p>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-10">
        <div className="glass rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-accent-emerald animate-pulse" />
          <span className="text-earth-200 text-sm">Live Data</span>
        </div>
      </div>

      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={<Loader />}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  )
}
