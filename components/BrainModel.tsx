import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, Html, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { BrainRegionData, Language } from '../types';

interface BrainPartMeshProps {
  data: BrainRegionData;
  isSelected: boolean;
  isHovered: boolean;
  isTranslucentMode: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  language: Language;
}

const BrainPartMesh: React.FC<BrainPartMeshProps> = ({
  data,
  isSelected,
  isHovered,
  isTranslucentMode,
  onSelect,
  onHover,
  language
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Pulse effect when selected
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      const t = state.clock.getElapsedTime();
      const scaleBase = data.scale;
      const pulse = 1 + Math.sin(t * 3) * 0.02;
      meshRef.current.scale.set(
        scaleBase[0] * pulse,
        scaleBase[1] * pulse,
        scaleBase[2] * pulse
      );
    }
  });

  // Material Logic
  const color = useMemo(() => new THREE.Color(data.color), [data.color]);
  const hoverColor = useMemo(() => new THREE.Color(data.color).offsetHSL(0, 0, 0.2), [data.color]);
  
  // Determine if this part should be transparent in translucent mode
  const isHippocampus = data.id === 'hippocampus';
  const shouldBeTransparent = isTranslucentMode && !isHippocampus;
  const shouldBeHighlighted = isTranslucentMode && isHippocampus;

  // Material Properties based on mode
  const materialOpacity = shouldBeTransparent ? 0.15 : (isSelected ? 1 : 0.95);
  const materialTransmission = shouldBeTransparent ? 0.6 : 0;
  const materialRoughness = shouldBeTransparent ? 0.1 : 0.4;
  const materialColor = shouldBeHighlighted ? color.clone().offsetHSL(0, 0.2, 0.1) : (isHovered || isSelected ? hoverColor : color);

  return (
    <group position={new THREE.Vector3(...data.position)}>
      <mesh
        ref={meshRef}
        scale={new THREE.Vector3(...data.scale)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(data.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(data.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          onHover(null);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* We use SphereGeometry to approximate lobes for this demo since we can't load external assets */}
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          color={materialColor}
          roughness={materialRoughness}
          metalness={0.1}
          clearcoat={0.8}
          clearcoatRoughness={0.2}
          transmission={materialTransmission}
          transparent={true}
          opacity={materialOpacity}
          thickness={shouldBeTransparent ? 0.5 : 0} // Thickness for refraction
          depthWrite={!shouldBeTransparent} // Helps with transparency sorting
        />
        
        {/* Hover Tooltip - Anchored to 3D position */}
        {isHovered && !isSelected && !isTranslucentMode && (
          <Html distanceFactor={10}>
            <div className="pointer-events-none px-3 py-1 bg-black/80 backdrop-blur text-white text-xs rounded whitespace-nowrap shadow-lg -translate-y-8 z-50">
               {language === 'zh' ? data.nameZh : data.nameEn}
            </div>
          </Html>
        )}
      </mesh>
      
      {/* Mirror Temporal Lobe manually if needed for better symmetry visual */}
       {data.id === 'temporal-lobe' && (
         <mesh
            position={[-2.4, 0, 0]} // Relative to the group which is already offset
            scale={new THREE.Vector3(...data.scale)}
            onClick={(e) => { e.stopPropagation(); onSelect(data.id); }}
            onPointerOver={(e) => { e.stopPropagation(); onHover(data.id); }}
            onPointerOut={(e) => { e.stopPropagation(); onHover(null); }}
         >
            <sphereGeometry args={[1, 64, 64]} />
             <meshPhysicalMaterial
              color={materialColor}
              roughness={materialRoughness}
              metalness={0.1}
              clearcoat={0.8}
              transmission={materialTransmission}
              transparent={true}
              opacity={materialOpacity}
              thickness={shouldBeTransparent ? 0.5 : 0}
              depthWrite={!shouldBeTransparent}
            />
         </mesh>
       )}
    </group>
  );
};

interface BrainModelProps {
  regions: BrainRegionData[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  language: Language;
  darkMode: boolean;
  isTranslucentMode: boolean;
}

const BrainModel: React.FC<BrainModelProps> = ({ regions, selectedId, onSelect, language, darkMode, isTranslucentMode }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        camera={{ position: [5, 2, 5], fov: 45 }}
        dpr={[1, 2]}
        // Canvas resizes automatically to parent div
      >
        {/* Environment */}
        <color attach="background" args={[darkMode ? '#0f172a' : '#f8fafc']} />
        <ambientLight intensity={darkMode ? 0.3 : 0.6} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Environment preset={darkMode ? "city" : "studio"} />

        {/* The Brain */}
        <group position={[0, 0, 0]}>
          {regions.map((region) => (
            <BrainPartMesh
              key={region.id}
              data={region}
              isSelected={selectedId === region.id}
              isHovered={hoveredId === region.id}
              isTranslucentMode={isTranslucentMode}
              onSelect={onSelect}
              onHover={setHoveredId}
              language={language}
            />
          ))}
        </group>

        {/* Visual Enhancements */}
        <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2.5} far={4} />
        <OrbitControls
           enablePan={false}
           minDistance={3}
           maxDistance={12}
           autoRotate={!selectedId} // Stop rotation when interacting
           autoRotateSpeed={1}
        />
        
        {darkMode && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
      </Canvas>
    </div>
  );
};

export default BrainModel;