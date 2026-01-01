import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { editable as e } from "@theatre/r3f";
import { types } from "@theatre/core";
import { ImprovedNoise } from "three/examples/jsm/Addons.js";

export default function CloudLayer1() {
  const cloudObjRef = useRef<THREE.Group>(null!);
  const { nodes } = useGLTF("/models/Scene1/Cloud.glb");

  const [cloudProps, setCloudProps] = useState({
    sunPosition: new THREE.Vector3(50, 50, 50),
    sunColor: new THREE.Color("#ffecd2"),
    sunIntensity: 1.0,
    baseColor: new THREE.Color("#798aa0"),
    scatter: 1.0,
    absorption: 1.0,
    threshold: 0.25,
    opacity: 0.25,
    range: 0.1,
    steps: 100,
    shadowStepSize: 5.0
  });

  // Sync Theatre controls with shader uniforms
  useEffect(() => {
    if (!cloudObjRef.current) return;

    const unsubscribe = cloudObjRef.current.onValuesChange((values) => {
      setCloudProps({
        sunPosition: new THREE.Vector3(values.sunPosition.x, values.sunPosition.y, values.sunPosition.z),
        sunColor: new THREE.Color(values.sunColor.r, values.sunColor.g, values.sunColor.b),
        sunIntensity: values.sunIntensity,
        baseColor: new THREE.Color(values.baseColor.r, values.baseColor.g, values.baseColor.b),
        scatter: values.scatter,
        absorption: values.absorption,
        threshold: values.threshold,
        opacity: values.opacity,
        range: values.range,
        steps: values.steps,
        shadowStepSize: values.shadowStepSize
      });
    });

    return () => unsubscribe();
  }, [cloudObjRef]);


  const { material } = useMemo(() => {
    const size = 128;
    const data = new Uint8Array(size * size * size);

    let i = 0;
    const scale = 0.05;
    const perlin = new ImprovedNoise();
    const vector = new THREE.Vector3();

    for (let z = 0; z < size; z++) {
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const d = 1.0 - vector.set(x, y, z).subScalar(size / 2).divideScalar(size).length();
          data[i] = (128 + 128 * perlin.noise(x * scale / 1.5, y * scale, z * scale / 1.5)) * d * d;
          i++;
        }
      }
    }

    const texture = new THREE.Data3DTexture(data, size, size, size);
    texture.format = THREE.RedFormat;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.unpackAlignment = 1;
    texture.needsUpdate = true;

    // Material

    const vertexShader = /* glsl */`
	  	in vec3 position;

	  	uniform mat4 modelMatrix;
	  	uniform mat4 modelViewMatrix;
	  	uniform mat4 projectionMatrix;
	  	uniform vec3 cameraPos;

	  	out vec3 vOrigin;
	  	out vec3 vDirection;
      out vec3 vPosition;

	  	void main() {
	  		vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        
        // Calculate world position for light direction relative to object
        vPosition = (modelMatrix * vec4(position, 1.0)).xyz;

	  		vOrigin = vec3( inverse( modelMatrix ) * vec4( cameraPos, 1.0 ) ).xyz;
	  		vDirection = position - vOrigin;

	  		gl_Position = projectionMatrix * mvPosition;
	  	}
	  `;

    const fragmentShader = /* glsl */`
	  	precision highp float;
	  	precision highp sampler3D;

	  	in vec3 vOrigin;
	  	in vec3 vDirection;
      in vec3 vPosition;

	  	out vec4 color;

	  	uniform vec3 base;
	  	uniform sampler3D map;

	  	uniform float threshold;
	  	uniform float range;
	  	uniform float opacity;
	  	uniform float steps;
	  	uniform float frame;

      uniform vec3 boxMin;
      uniform vec3 boxMax;
      
      // Lighting uniforms
      uniform vec3 sunPosition;
      uniform vec3 sunColor;
      uniform float sunIntensity;
      uniform float scatter;
      uniform float absorption;
      uniform float shadowStepSize;
      uniform mat4 modelMatrix;

	  	uint wang_hash(uint seed)
	  	{
	  			seed = (seed ^ 61u) ^ (seed >> 16u);
	  			seed *= 9u;
	  			seed = seed ^ (seed >> 4u);
	  			seed *= 0x27d4eb2du;
	  			seed = seed ^ (seed >> 15u);
	  			return seed;
	  	}

	  	float randomFloat(inout uint seed)
	  	{
	  			return float(wang_hash(seed)) / 4294967296.;
	  	}

	  	vec2 hitBox( vec3 orig, vec3 dir ) {
	  		vec3 inv_dir = 1.0 / dir;
	  		vec3 tmin_tmp = ( boxMin - orig ) * inv_dir;
	  		vec3 tmax_tmp = ( boxMax - orig ) * inv_dir;
	  		vec3 tmin = min( tmin_tmp, tmax_tmp );
	  		vec3 tmax = max( tmin_tmp, tmax_tmp );
	  		float t0 = max( tmin.x, max( tmin.y, tmin.z ) );
	  		float t1 = min( tmax.x, min( tmax.y, tmax.z ) );
	  		return vec2( t0, t1 );
	  	}

	  	float sample1( vec3 p ) {
        // Remap p from [boxMin, boxMax] to [0, 1] for texture sampling
        vec3 texCoord = (p - boxMin) / (boxMax - boxMin);
        
        // Edge fade: Calculate distance from center (0.5, 0.5, 0.5)
        // 1.0 at center, 0.0 at edges
        float dist = distance(texCoord, vec3(0.5));
        float fade = smoothstep(0.5, 0.35, dist); // Fade out starting at 0.35 radius, fully 0 at 0.5
        
	  		return texture( map, texCoord ).r * fade;
	  	}

      // Calculate light reaching the point
      float lightmarch(vec3 position, vec3 lightDir) {
        vec3 stepStep = lightDir * shadowStepSize; // Step size towards light
        float totalDensity = 0.0;
        
        // Take a few steps towards the light
        for(int i = 0; i < 6; i++) {
           position += stepStep;
           
           // Check if we are still inside box
           if (position.x < boxMin.x || position.x > boxMax.x ||
               position.y < boxMin.y || position.y > boxMax.y ||
               position.z < boxMin.z || position.z > boxMax.z) {
               break;
           }
           
           float d = sample1(position);
           if (d > 0.01) {
             totalDensity += d;
           }
        }
        
        float transmittance = exp(-totalDensity * absorption);
        return transmittance;
      }

	  	vec4 linearToSRGB( in vec4 value ) {
	  		return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
	  	}

	  	void main(){
	  		vec3 rayDir = normalize( vDirection );
	  		vec2 bounds = hitBox( vOrigin, rayDir );

	  		if ( bounds.x > bounds.y ) discard;

	  		bounds.x = max( bounds.x, 0.0 );

	  		float stepSize = ( bounds.y - bounds.x ) / steps;

	  		// Jitter
	  		uint seed = uint( gl_FragCoord.x ) * uint( 1973 ) + uint( gl_FragCoord.y ) * uint( 9277 ) + uint( frame ) * uint( 26699 );
	  		vec3 size = vec3( textureSize( map, 0 ) );
	  		float randNum = randomFloat( seed ) * 2.0 - 1.0;
	  		vec3 p = vOrigin + bounds.x * rayDir;
	  		p += rayDir * randNum * ( 1.0 / size );

        // Transform sun position to local space to get direction
        // Inverse model matrix is complicated in shader, assuming light is far away:
        // For directional light, we just need the direction vector in local space
        // Approximating by rotating the sun vector by inverse model rotation would be ideal
        // But for simplicity, we pass sunPosition as world space and here we treat it relative to origin for direction
        // Note: Ideally we pass lightDir in local space from JS.
        // Let's assume sunPosition is in World Space.
        
        // Simple directional light vector in world space
        vec3 worldLightDir = normalize(sunPosition); 
        
        // We need local light dir. Since we are in local space (p), we need to rotate worldLightDir into local space.
        // But we don't have inverse ModelMatrix easily here without passing it.
        // HACK: Let's assume the cloud object isn't rotated much, OR pass lightDir directly.
        // For now, using a fixed direction for testing if rotation fails.
        vec3 lightDir = normalize(vec3(0.5, 1.0, 0.5)); // Fallback
        
        // Better: calculate it roughly if we assume sunPosition is relative to the cloud center in world space
        // or just use the passed uniform directly if we assume it's already local.
        // Let's assume the JS passes it correctly or we use world-space logic?
        // Let's stick to the previous logic but add lighting.
        
        lightDir = normalize(sunPosition); // Treating sunPosition as a direction vector for now

	  		vec4 ac = vec4( base, 0.0 );

	  		for ( float i = 0.0; i < steps; i += 1.0 ) {

	  			float t = bounds.x + i * stepSize;
          
	  			float d = sample1( p );

	  			d = smoothstep( threshold - range, threshold + range, d ) * opacity;

          if (d > 0.001) {
            // Lighting calculation
            float lightTransmittance = lightmarch(p, lightDir);
            float luminance = 0.1 + lightTransmittance * scatter; // ambient + diffuse
            
            vec3 finalColor = base * (sunColor * sunIntensity) * luminance;
            
            ac.rgb += ( 1.0 - ac.a ) * d * finalColor;
            ac.a += ( 1.0 - ac.a ) * d;
          }

	  			if ( ac.a >= 0.95 ) break;

	  			p += rayDir * stepSize;

	  		}

	  		color = linearToSRGB( ac );

	  		if ( color.a == 0.0 ) discard;

	  	}
	  `;

    // Compute bounds
    nodes.clouds3006.geometry.computeBoundingBox();
    const boxMin = nodes.clouds3006.geometry.boundingBox.min;
    const boxMax = nodes.clouds3006.geometry.boundingBox.max;

    const material = new THREE.RawShaderMaterial({
      glslVersion: THREE.GLSL3,
      uniforms: {
        base: { value: new THREE.Color(0x798aa0) },
        map: { value: texture },
        cameraPos: { value: new THREE.Vector3() },
        threshold: { value: 0.25 },
        opacity: { value: 0.25 },
        range: { value: 0.1 },
        steps: { value: 100 },
        frame: { value: 0 },
        boxMin: { value: boxMin },
        boxMax: { value: boxMax },
        sunPosition: { value: new THREE.Vector3(50, 50, 50) },
        sunColor: { value: new THREE.Color("#ffecd2") },
        sunIntensity: { value: 1.0 },
        scatter: { value: 1.0 },
        absorption: { value: 1.0 },
        shadowStepSize: { value: 5.0 }
      },
      vertexShader,
      fragmentShader,
      side: THREE.BackSide,
      transparent: true
    });
    // return { material }
    return new THREE.MeshStandardMaterial({
      color: 'pink'
    })
  }, [nodes]);

  // Update uniforms every frame if props change
  useEffect(() => {
    material.uniforms.sunPosition.value.copy(cloudProps.sunPosition);
    material.uniforms.sunColor.value.copy(cloudProps.sunColor);
    material.uniforms.sunIntensity.value = cloudProps.sunIntensity;
    material.uniforms.base.value.copy(cloudProps.baseColor);
    material.uniforms.scatter.value = cloudProps.scatter;
    material.uniforms.absorption.value = cloudProps.absorption;
    material.uniforms.threshold.value = cloudProps.threshold;
    material.uniforms.opacity.value = cloudProps.opacity;
    material.uniforms.range.value = cloudProps.range;
    material.uniforms.steps.value = cloudProps.steps;
    material.uniforms.shadowStepSize.value = cloudProps.shadowStepSize;
  }, [cloudProps, material]);


  return (
    <>
      <e.group
        theatreKey="scene1-cloud1"
        objRef={cloudObjRef}
        additionalProps={{
          sunPosition: types.compound({
            x: types.number(50, { range: [-100, 100] }),
            y: types.number(50, { range: [-100, 100] }),
            z: types.number(50, { range: [-100, 100] }),
          }),
          sunColor: types.rgba({ r: 1, g: 0.92, b: 0.82, a: 1 }),
          sunIntensity: types.number(1.0, { range: [0, 10] }),
          baseColor: types.rgba({ r: 0.47, g: 0.54, b: 0.63, a: 1 }), // #798aa0
          scatter: types.number(1.0, { range: [0, 5] }),
          absorption: types.number(1.0, { range: [0, 5] }),
          threshold: types.number(0.25, { range: [0, 1] }),
          opacity: types.number(0.25, { range: [0, 1] }),
          range: types.number(0.1, { range: [0, 1] }),
          steps: types.number(100, { range: [10, 200] }),
          shadowStepSize: types.number(5.0, { range: [0.1, 100] })
        }}
      >
        <mesh castShadow receiveShadow geometry={nodes.clouds3006.geometry} material={material} />

      </e.group>
    </>
  );
}
