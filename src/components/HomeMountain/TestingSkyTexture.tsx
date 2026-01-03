import { useFrame } from "@react-three/fiber"
import { editable as e } from "@theatre/r3f"
import { useMemo, useRef } from "react"
import * as THREE from "three"

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`

const fragmentShader = `
precision highp float;
uniform float uTime;

varying vec2 vUv;

#define RGB vec3
#define mul(a,b) b*a
#define saturate(a) clamp( a, 0.0, 1.0 )

// Use Scheme 1 (Yellow/Desert) as requested by user providing the code
#define COLOR_SCHEME 1

#if COLOR_SCHEME == 1
const float _FogMul = -0.00800 ;
const float _FogPow = 1.00000 ;
const vec3 _LightDir = vec3(-0.23047, 0.87328, -0.42927) ;
const vec3 _SunStar = vec3(14.7, 1.47, 0.1) ;
const float _SunSize = 26.00000 ;
const float _SunScale = 15.00000 ;
const float _ExposureOffset = 11.10000 ;
const float _ExposurePower = 0.52000 ;
const float _ExposureStrength = 0.09000 ;
const RGB _SunColor = RGB(1, 0.95441, 0.77206) ;
const RGB _Zenith = RGB(0.77941, 0.5898, 0.41263) ;
const float _ZenithFallOff = 2.36000 ;
const RGB _Nadir = RGB(1, 0.93103, 0) ;
const float _NadirFallOff = 1.91000 ;
const RGB _Horizon = RGB(0.96324, 0.80163, 0.38954) ;
const float _CloudTransparencyMul = 0.90000 ;
const RGB _CloudCol = RGB(1, 0.84926, 0.69853) ;
const RGB _BackCloudCol = RGB(0.66176, 0.64807, 0.62284) ;
const RGB _CloudSpecCol = RGB(0.17647, 0.062284, 0.062284) ;
const RGB _BackCloudSpecCol = RGB(0.11029, 0.05193, 0.020275) ;
const float _CloudFogStrength = 0.50000 ;
const RGB _PyramidCol = RGB(0.69853, 0.40389, 0.22086) ;
const vec2 _PyramidHeightFog = vec2(38.66, 1.3) ;
const RGB _TerrainCol = RGB(0.56618, 0.29249, 0.1915) ;
const RGB _TerrainSpecColor = RGB(1, 0.77637, 0.53676) ;
const float _TerrainSpecPower = 55.35000 ;
const float _TerrainSpecStrength = 1.56000 ;
const float _TerrainGlitterRep = 7.00000 ;
const float _TerrainGlitterPower = 3.20000 ;
const RGB _TerrainRimColor = RGB(0.16176, 0.13131, 0.098724) ;
const float _TerrainRimPower = 5.59000 ;
const float _TerrainRimStrength = 1.61000 ;
const float _TerrainRimSpecPower = 2.88000 ;
const float _TerrainFogPower = 2.11000 ;
const vec4 _TerrainShadowParams = vec4(0.12, 5.2, 88.7, 0.28) ;
const RGB _TerrainShadowColor = RGB(0.48529, 0.13282, 0) ;
const RGB _TerrainDistanceShadowColor = RGB(0.70588, 0.4644, 0.36851) ;
const float _TerrainDistanceShadowPower = 0.11000 ;
#endif

// Camera Constants
const mat4 _CameraInvViewMatrix = mat4( 1, 0, 0, 1.04, 
0, 0.9684963, 0.2490279, 2.2, 
0, 0.2490279, -0.9684963, 18.6, 
0, 0, 0, 1 ) ;
const vec3 _CameraFOV = vec3(1.038, 0.78984, -1) ;
const vec3 _CameraPos = vec3(1.0, 2.2, 18.6) ;
const vec4 _CameraMovement = vec4(0.15, 0.1, 0.2, 0.25) ;

const float _DrawDistance = 150.00000 ; // Increased draw distance
const float _MaxSteps = 64.00000 ;
const vec3 _SunPosition = vec3(0.2, 56, -40.1) ;

// Cloud Constants
const vec3 _CloudNoiseStrength = vec3(0.2, 0.16, 0.1) ;
const vec3 _FrontCloudsPos = vec3(9.91, 8.6, -12.88) ;
const vec3 _FrontCloudsOffsetA = vec3(-9.1, 3.04, 0) ;
const vec3 _FrontCloudsOffsetB = vec3(-2.97, 3.72, -0.05) ;
const vec3 _FrontCloudParams = vec3(5.02, 3.79, 5) ;
const vec3 _FrontCloudParamsA = vec3(3.04, 0.16, 2) ;
const vec3 _FrontCloudParamsB = vec3(1.34, 0.3, 3.15) ;
const vec3 _BackCloudsPos = vec3(29.99, 13.61, -18.8) ;
const vec3 _BackCloudsOffsetA = vec3(24.87, -1.49, 0) ;
const vec3 _BackCloudParams = vec3(7.12, 4.26, 1.68) ;
const vec3 _BackCloudParamsA = vec3(6.37, 2.23, 2.07) ;
const vec3 _PlaneParams = vec3(7.64, 10.85, 3.76) ;
const vec3 _CloudGlobalParams = vec3(0.123, 2.1, 0.5) ;
const vec3 _CloudBackGlobalParams = vec3(0.16, 1.4, -0.01) ;
const vec3 _CloudNormalMod = vec3(0.26, -0.13, 1.22) ;
const float _CloudSpecPower = 24.04000 ;
const float _CloudPyramidDistance = 0.14500 ;

// Pyramid Constants
const vec3 _PyramidPos = vec3(0, 10.9, -50) ;
const vec3 _PyramidScale = vec3(34.1, 24.9, 18) ;
const vec3 _PrismScale = vec3(1, 1.9, 1) ;
const vec3 _PyramidNoisePrams = vec3(1.5, 1, 1) ;
const vec3 _PrismEyeScale = vec3(0.7, 1.9, 51.5) ;
const vec3 _PyramidEyeOffset = vec3(2.0, -4.9, 0) ;
const float _PrismEyeWidth = 5.86000 ;

// Material IDs
#define MAT_PYRAMID 1.0
#define MAT_BACK_CLOUDS 20.0
#define MAT_FRONT_CLOUDS 21.0
#define TEST_MAT_LESS( a, b ) a < (b + 0.1)

// Utils
float rand(float n) { return fract(sin(n) * 43758.5453123); }
float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }

float noise(float p) {
    float fl = floor(p);
    float fc = fract(p);
    fc = fc*fc*(3.0-2.0*fc);
    return mix(rand(fl), rand(fl + 1.0), fc);
}

// Procedural noised replacement
vec3 noised( in vec2 p ) {
    vec2 i = floor( p );
    vec2 f = fract( p );
    vec2 u = f*f*(3.0-2.0*f);
    float a = rand(i);
    float b = rand(i + vec2(1.0, 0.0));
    float c = rand(i + vec2(0.0, 1.0));
    float d = rand(i + vec2(1.0, 1.0));
    return vec3(a+(b-a)*u.x+(c-a)*u.y+(a-b-c+d)*u.x*u.y,
                6.0*f*(1.0-f)*(vec2(b-a,c-a)+(a-b-c+d)*u.yx));
}

float pn(vec3 p) {
    vec3 i = floor(p); 
    vec4 a = dot(i, vec3(1., 57., 21.)) + vec4(0., 57., 21., 78.);
    vec3 f = cos((p-i)*3.141592653589793)*(-.5) + .5;  
    a = mix(sin(cos(a)*a), sin(cos(1.+a)*(1.+a)), f.x);
    a.xy = mix(a.xz, a.yw, f.y);   
    return mix(a.x, a.y, f.z);
}

// SDFs
float sdTriPrism( vec3 p, vec2 h ) {
    vec3 q = abs(p);
    float d1 = q.z-h.y;
    float d2 = max(q.x*0.866025+p.y*0.5,-p.y)-h.x*0.5;
    return length(max(vec2(d1,d2),0.0)) + min(max(d1,d2), 0.);
}

vec2 min_mat( vec2 d1, vec2 d2 ) { return (d1.x<d2.x) ? d1 : d2; }
vec2 smin_mat( vec2 a, vec2 b, float k, float c ) {
    float h = clamp( 0.5+0.5*(b.x-a.x)/k, 0.0, 1.0 );
    float x = mix( b.x, a.x, h ) - k*h*(1.0-h);
    return vec2( x, ( h < c ) ? b.y : a.y);
}

float sdBigMountain( in vec3 pos ) {
    float scaleMul = min(_PyramidScale.x, min(_PyramidScale.y, _PyramidScale.z));
    vec3 posPyramid = pos - _PyramidPos;
    float derNoise = sin(noised(posPyramid.xz * _PyramidNoisePrams.x).x) * _PyramidNoisePrams.y;
    posPyramid.x = posPyramid.x + derNoise;
    posPyramid /= _PyramidScale;
    float pyramid = sdTriPrism( posPyramid, _PrismScale.xy ) * scaleMul;
    return pyramid;
}

float sdCloud( in vec3 pos, vec3 cloudPos, float rad, float spread, float phaseOffset, vec3 globalParams) { 
    pos += pn( pos ) * _CloudNoiseStrength;
    pos = pos - cloudPos;
    pos.z /= globalParams.x;
    float repitition = rad * 2.0 + spread;
    vec3 repSpace = pos - mod( pos - repitition * 0.5, repitition);
    pos.y += sin(phaseOffset + repSpace.x * 0.23  ) * globalParams.y;
    pos.y += sin(phaseOffset + repSpace.x * 0.9 ) * globalParams.z;
    pos.x = fract( (pos.x + repitition * 0.5) / repitition ) * repitition - repitition * 0.5;
    float sphere = length(pos)- rad;
    return sphere * globalParams.x;
}

vec2 sdClouds( in vec3 pos ) {
    float c1 = sdCloud( pos, _FrontCloudsPos, _FrontCloudParams.x, _FrontCloudParams.y, _FrontCloudParams.z, _CloudGlobalParams );
    float c2 = sdCloud( pos, _FrontCloudsPos + _FrontCloudsOffsetA, _FrontCloudParamsA.x, _FrontCloudParamsA.y, _FrontCloudParamsA.z, _CloudGlobalParams );
    float c3 = sdCloud( pos, _FrontCloudsPos + _FrontCloudsOffsetB, _FrontCloudParamsB.x, _FrontCloudParamsB.y, _FrontCloudParamsB.z, _CloudGlobalParams);
    float frontClouds = min(c3, min(c1, c2));
    float mainPlane = length(pos.z - _FrontCloudsPos.z) / _CloudGlobalParams.x + (pos.y - _PlaneParams.y  + sin(_PlaneParams.x + pos.x * 0.23 ) * _PlaneParams.z);
    frontClouds = min(mainPlane * _CloudGlobalParams.x, frontClouds);
    float c4 = sdCloud( pos, _BackCloudsPos, _BackCloudParams.x, _BackCloudParams.y, _BackCloudParams.z, _CloudBackGlobalParams );
    float c5 = sdCloud( pos, _BackCloudsPos + _BackCloudsOffsetA, _BackCloudParamsA.x, _BackCloudParamsA.y, _BackCloudParamsA.z, _CloudBackGlobalParams );
    float backClouds = min(c4,c5);
    return min_mat(vec2(frontClouds,MAT_FRONT_CLOUDS), vec2(backClouds,MAT_BACK_CLOUDS));
}

vec2 map( in vec3 pos ) {
    vec2 res = vec2(700.0, 0.0);
    vec2 clouds = sdClouds(pos);
    res = clouds;
    return res;
}

vec3 sky( vec3 ro, vec3 rd ) {
    float sunDistance = length( _SunPosition );
    vec3 delta = _SunPosition.xyz - (ro + rd * sunDistance);
    float dist = length(delta);
    delta.xy *= _SunStar.xy;
    float sunDist = length(delta);
    float spot = 1.0 - smoothstep(0.0, _SunSize, sunDist);
    vec3 sun = clamp(_SunScale * spot * spot * spot, 0.0, 1.0) * _SunColor.rgb;
    float expDist = clamp((dist - _ExposureOffset)  * _ExposureStrength, 0.0, 1.0);
    float expControl = pow(expDist,_ExposurePower);
    float y = rd.y;
    float zen = 1.0 - pow (min (1.0, 1.0 - y), _ZenithFallOff);
    vec3 zenithColor = _Zenith.rgb  * zen;
    zenithColor = mix( _SunColor.rgb, zenithColor, expControl );
    float nad = 1.0 - pow (min (1.0, 1.0 + y), _NadirFallOff);
    vec3 nadirColor = _Nadir.rgb * nad;
    float hor = 1.0 - zen - nad;
    vec3 horizonColor = _Horizon.rgb * hor;
    return (sun * _SunStar.z + zenithColor + horizonColor + nadirColor);
}

vec3 calcNormal( in vec3 pos ) {
    vec2 e = vec2(1.0,-1.0)*0.5773*0.005;
    return normalize( e.xyy*map( pos + e.xyy ).x + 
                      e.yyx*map( pos + e.yyx ).x + 
                      e.yxy*map( pos + e.yxy ).x + 
                      e.xxx*map( pos + e.xxx ).x );
}

vec3 castRay(vec3 ro, vec3 rd) {
    float tmin = 0.1;
    float tmax = _DrawDistance;
    float t = tmin;
    float m = -1.0;
    for( float i = 0.0; i < _MaxSteps; i += 1.0 ) {
        float precis = 0.005 * t;
        vec2 res = map( ro + rd * t );
        if( res.x < precis || t > tmax ) break;
        t += res.x;
        m = res.y;
    }
    if( t > tmax ) m = -1.0;
    return vec3( t, m, 0.0 );
}

vec3 render( in vec3 ro, in vec3 rd ) { 
    vec3 res = castRay(ro,rd);
    vec3 skyCol = sky( ro, rd );
    float t = res.x;
    float m = res.y;
    vec3 pos = ro + t*rd;

    if( m < 0.0 ) {
        float rightSideCloudDist = length( (ro + rd * length(_SunPosition)) - vec3(45.0, -5.0, _SunPosition.z));
        float leftSideCloudDist = length( (ro + rd * length(_SunPosition)) - vec3(-50.0, -5.0, _SunPosition.z));
        if( rightSideCloudDist < 40.0 ) {
            float smoothCloudBloom = 1.0 - smoothstep( 0.8, 1.0, rightSideCloudDist / 40.0);
            return skyCol + res.z * res.z * 0.2 * smoothCloudBloom;
        } else if( leftSideCloudDist < 40.0 ) {
            float smoothCloudBloom = 1.0 - smoothstep( 0.8, 1.0, leftSideCloudDist / 40.0);
            return skyCol + res.z * res.z * 0.2 * smoothCloudBloom;
        } else {
            return skyCol;
        }
    }

    float skyFog = 1.0-exp( _FogMul * t * pow(max(0.0, pos.y), _FogPow) );
    vec3 pyramidCol = vec3(0.0);
    pyramidCol = mix( _PyramidCol, skyCol, skyFog * 0.5  ); 

    if( TEST_MAT_LESS( m, MAT_PYRAMID) ) {
        float nh = (pos.y / _PyramidHeightFog.x);
        nh = nh*nh*nh*nh*nh;
        float heightFog = pow(clamp(1.0 - (nh), 0.0, 1.0), _PyramidHeightFog.y);
        heightFog = clamp( heightFog, 0.0, 1.0 );
        pyramidCol = mix( pyramidCol, skyCol, heightFog ); 
        return pyramidCol;       
    }

    if( TEST_MAT_LESS (m, MAT_FRONT_CLOUDS ) ) {
        vec3 nor = calcNormal(pos);
        nor = normalize( nor + _CloudNormalMod);
        float dotProd = dot( nor, vec3(1.0,-3.5,1.0) );
        float spec = 1.0 - clamp( pow(dotProd, _CloudSpecPower), 0.0, 1.0 );
        spec *= 2.0;
        vec3 cloudCol = spec * _CloudSpecCol + _CloudCol;
        if( sdBigMountain( pos + (rd * t * _CloudPyramidDistance)) < 0.2 ) {
            cloudCol = mix( pyramidCol, cloudCol, _CloudTransparencyMul ); 
        }
        vec3 inCloudCol = mix(cloudCol, _BackCloudCol + skyCol * 0.5 + spec * _BackCloudSpecCol, MAT_FRONT_CLOUDS - m);
        return mix( inCloudCol , skyCol, skyFog * _CloudFogStrength );    
    }
    return skyCol;
}

void main() {
    vec2 screenCoord = vUv * 2.0 - 1.0;
    // Original Shader Camera Noise
    float unitNoiseX = (noise(uTime * _CameraMovement.w ) * 2.0)  - 1.0;
    float unitNoiseY = (noise((uTime * _CameraMovement.w ) + 32.0) * 2.0)  -1.0;
    float unitNoiseZ = (noise((uTime * _CameraMovement.w ) + 48.0) * 2.0)  -1.0;
    vec3 ro = _CameraPos + vec3(unitNoiseX, unitNoiseY, unitNoiseZ) * _CameraMovement.xyz;

    vec3 screenRay = vec3(screenCoord, 1.0);
    screenRay.xy = screenCoord * _CameraFOV.xy;
    screenRay.x *= 1.35;
    screenRay.z  = -_CameraFOV.z;
    screenRay /= abs( _CameraFOV.z); 

    vec3 rd = normalize(mul( _CameraInvViewMatrix, vec4(screenRay,0.0))).xyz;

    vec3 col = render(ro, rd);
    
    gl_FragColor = vec4(col, 1.0);
}
`

const TestingSkyTexture = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  )

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
    }
  })

  return (
    <e.mesh theatreKey="skyTestingMesh">
      <boxGeometry args={[2, 2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </e.mesh>
  )
}

export default TestingSkyTexture
