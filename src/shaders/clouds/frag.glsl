precision highp float;

varying vec2 vUv;
varying vec3 vWorldPos;
uniform float iTime;
uniform vec2 iResolution;

// --- DEFINES & HELPER FUNCTIONS ---
#define RGB vec3
#define mul(a,b) b*a
#define saturate(a) clamp( a, 0.0, 1.0 )

// Material IDs (Only need cloud ones)
#define MAT_BACK_CLOUDS 20.0
#define MAT_FRONT_CLOUDS 21.0
#define TEST_MAT_LESS( a, b ) a < (b + 0.1)

// --- CONSTANTS (Extracted from Color Scheme 0) ---
const float _FogMul = -0.00100;
const float _FogPow = 1.82000;
const vec3 _LightDir = vec3(-0.22632, 0.88099, -0.4155);
const float _SunSize = 25.00000;
const float _SunScale = 15.00000;
const float _ExposureOffset = 11.10000;
const float _ExposurePower = 0.52000;
const float _ExposureStrength = 0.09000;
const RGB _SunColor = RGB(1, 0.73741, 0.63971);
const RGB _Zenith = RGB(0.67128, 0.94118, 0.69204);
const float _ZenithFallOff = 1.42000;
const RGB _Nadir = RGB(0, 0, 0);
const float _NadirFallOff = 1.91000;
const RGB _Horizon = RGB(0.80147, 0.80147, 0.80147);
const vec3 _SunStar = vec3(14.7, 1.47, 0.1);

// Cloud Specific Constants
const float _CloudTransparencyMul = 0.90000;
const RGB _CloudCol = RGB(1, 0.96957, 0.18235);
const RGB _BackCloudCol = RGB(0.66176, 0.64807, 0.62284);
const RGB _CloudSpecCol = RGB(0.97647, 0.062284, 0.062284);
const RGB _BackCloudSpecCol = RGB(0.11029, 0.05193, 0.020275);
const float _CloudFogStrength = 0.90000;

// Cloud Positioning & Shape Constants
const vec3 _CloudNoiseStrength = vec3(0.9, 0.16, 0.1);
const vec3 _FrontCloudsPos = vec3(9.91, 8.6, -12.88);
const vec3 _FrontCloudsOffsetA = vec3(9.1, 3.04, 0);
const vec3 _FrontCloudsOffsetB = vec3(-2.97, 3.72, -0.05);
const vec3 _FrontCloudParams = vec3(5.02, 3.79, 5);
const vec3 _FrontCloudParamsA = vec3(3.04, 0.16, 2);
const vec3 _FrontCloudParamsB = vec3(1.34, 0.3, 3.15);
const vec3 _BackCloudsPos = vec3(29.99, 13.61, -18.8);
const vec3 _BackCloudsOffsetA = vec3(24.87, -1.49, 0);
const vec3 _BackCloudParams = vec3(7.12, 4.26, 1.68);
const vec3 _BackCloudParamsA = vec3(6.37, 2.23, 2.07);
const vec3 _PlaneParams = vec3(7.64, 10.85, 3.76);
const vec3 _CloudGlobalParams = vec3(0.123, 2.1, 0.5);
const vec3 _CloudBackGlobalParams = vec3(0.16, 1.4, -0.01);
const vec3 _CloudNormalMod = vec3(0.26, -0.13, 1.22);
const float _CloudSpecPower = 24.04000;

// Camera Constants (Needed for the Journey look)
const mat4 _CameraInvViewMatrix = mat4( 1, 0, 0, 1.04, 
0, 0.9684963, 0.2490279, 2.2, 
0, 0.2490279, -0.9684963, 18.6, 
0, 0, 0, 1 ) ;
const vec3 _CameraFOV = vec3(1.038, 0.78984, -1) ;
const vec3 _CameraPos = vec3(1.0, 2.2, 18.6) ;
const vec4 _CameraMovement = vec4(0.15, 0.1, 0.2, 0.25) ;
const vec3 _SunPosition = vec3(0.2, 56, -40.1) ;
const float _DrawDistance = 70.0;
const float _MaxSteps = 64.0;

// --- NOISE FUNCTIONS ---

// Value noise: https://www.shadertoy.com/view/4sfGRH 
float pn(vec3 p) {
    vec3 i = floor(p); 
    vec4 a = dot(i, vec3(1., 57., 21.)) + vec4(0., 57., 21., 78.);
    vec3 f = cos((p-i)*3.141592653589793)*(-.5) + .5;  
    a = mix(sin(cos(a)*a), sin(cos(1.+a)*(1.+a)), f.x);
    a.xy = mix(a.xz, a.yw, f.y);   
    return mix(a.x, a.y, f.z);
}

float rand(float n) {
    return fract(sin(n) * 43758.5453123);
}

float noise(float p) {
    float fl = floor(p);
    float fc = fract(p);
    fc = fc*fc*(3.0-2.0*fc);
    return mix(rand(fl), rand(fl + 1.0), fc);
}

// Distance Field Operations
vec2 min_mat( vec2 d1, vec2 d2 ) {
    return (d1.x<d2.x) ? d1 : d2;
}

// --- CLOUD SDFs ---

float sdCloud( in vec3 pos, vec3 cloudPos, float rad, float spread, float phaseOffset, vec3 globalParams)
{ 
    // Add noise to the clouds
    pos += pn( pos ) * _CloudNoiseStrength;
    pos = pos - cloudPos;

    // Make us 2d-ish
    pos.z /= globalParams.x;

    // Repeat the space
    float repitition = rad * 2.0 + spread;
    vec3  repSpace = pos - mod( pos - repitition * 0.5, repitition);

    // Create the overall shape to create clouds on
    pos.y +=  sin(phaseOffset + repSpace.x * 0.23  )  * globalParams.y ;

    // Creates clouds with offset on the main path
    pos.y +=  sin(phaseOffset + repSpace.x * 0.9 ) * globalParams.z;

    // repeated spheres
    pos.x = fract( (pos.x + repitition * 0.5) / repitition ) * repitition - repitition * 0.5;

    // return the spheres  
    float sphere = length(pos)- rad;
    return sphere * globalParams.x;
}

vec2 sdClouds( in vec3 pos )
{
    // Front layer
    float c1 = sdCloud( pos, _FrontCloudsPos, _FrontCloudParams.x, _FrontCloudParams.y, _FrontCloudParams.z, _CloudGlobalParams );
    float c2 = sdCloud( pos, _FrontCloudsPos + _FrontCloudsOffsetA, _FrontCloudParamsA.x, _FrontCloudParamsA.y, _FrontCloudParamsA.z, _CloudGlobalParams );
    float c3 = sdCloud( pos, _FrontCloudsPos + _FrontCloudsOffsetB, _FrontCloudParamsB.x, _FrontCloudParamsB.y, _FrontCloudParamsB.z, _CloudGlobalParams);
    float frontClouds = min(c3, min(c1, c2));

    // Plane to hide empty spaces (optimization in original shader)
    float mainPlane = length(pos.z - _FrontCloudsPos.z) / _CloudGlobalParams.x + (pos.y - _PlaneParams.y  + sin(_PlaneParams.x + pos.x * 0.23 ) * _PlaneParams.z);
    frontClouds = min(mainPlane * _CloudGlobalParams.x, frontClouds);

    // Back layer
    float c4 = sdCloud( pos, _BackCloudsPos, _BackCloudParams.x, _BackCloudParams.y, _BackCloudParams.z, _CloudBackGlobalParams );
    float c5 = sdCloud( pos, _BackCloudsPos + _BackCloudsOffsetA, _BackCloudParamsA.x, _BackCloudParamsA.y, _BackCloudParamsA.z, _CloudBackGlobalParams );
    float backClouds = min(c4,c5);
    
    return min_mat(vec2(frontClouds,MAT_FRONT_CLOUDS), vec2(backClouds,MAT_BACK_CLOUDS));
}

// --- MAIN MAP FUNCTION ---
vec2 map( in vec3 pos ) {
    return sdClouds(pos);
}

// --- RAYMARCHING ---

// Simple map for normal calculation
vec2 mapSimple( in vec3 pos ) {
    return map(pos);
}

vec3 calcNormal( in vec3 pos ) {
    vec2 e = vec2(1.0,-1.0)*0.5773*0.0005;
    return normalize( e.xyy*mapSimple( pos + e.xyy ).x + 
                      e.yyx*mapSimple( pos + e.yyx ).x + 
                      e.yxy*mapSimple( pos + e.yxy ).x + 
                      e.xxx*mapSimple( pos + e.xxx ).x );
}

vec3 castRay(vec3 ro, vec3 rd) {
    float tmin = 0.1;
    float tmax = _DrawDistance;
    
    float t = tmin;
    float m = -1.0;
    float p = 0.0;
    float maxSteps = _MaxSteps;
    float j = 0.0;
    for( float i = 0.0; i < _MaxSteps; i += 1.0 )
    {
        j = i;
        float precis = 0.0005*t;
        vec2 res = map( ro+rd*t );
        if( res.x<precis || t>tmax ) 
            break;
        t += res.x;
        m = res.y;
    }
    p = j / maxSteps;
    if( t>tmax ) m=-1.0;
    return vec3( t, m, p );
}

// --- SKY (Needed for Cloud fogging) ---
vec3 sky( vec3 ro, vec3 rd )
{
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

// --- RENDER ---
vec3 render( in vec3 ro, in vec3 rd )
{ 
    vec3 res = castRay(ro,rd);
    vec3 skyCol = sky( ro, rd );
    
    float t = res.x;
    float m = res.y;
    vec3 pos = ro + t*rd;

    // Background (Sky)
    if( m < 0.0 )
    {
        // Fake bloom for background clouds from original shader
        float rightSideCloudDist = length( (ro + rd * length(_SunPosition)) - vec3(45.0, -5.0, _SunPosition.z));
        float leftSideCloudDist = length( (ro + rd * length(_SunPosition)) - vec3(-50.0, -5.0, _SunPosition.z));
        if( rightSideCloudDist < 40.0 ) {
             float smoothCloudBloom = 1.0 - smoothstep( 0.8, 1.0, rightSideCloudDist / 40.0);
             return skyCol + res.z * res.z * 0.2 * smoothCloudBloom;
        }
        else if( leftSideCloudDist < 40.0 ) {
             float smoothCloudBloom = 1.0 - smoothstep( 0.8, 1.0, leftSideCloudDist / 40.0);
             return skyCol + res.z * res.z * 0.2 * smoothCloudBloom;
        }
        return skyCol;
    }

    float skyFog = 1.0-exp( _FogMul * t * pow(pos.y, _FogPow) );
    vec3 nor = calcNormal(pos);

    // CLOUD RENDERING
    // Uses MAT_FRONT_CLOUDS for both front and back (logic handled inside)
    if( TEST_MAT_LESS (m, MAT_FRONT_CLOUDS ) )
    {
        // Modify normals for strong specular highlights (Journey style)
        nor = normalize( nor + _CloudNormalMod);
        float dotProd = dot( nor, vec3(1.0,-3.5,1.0) );

        float spec = 1.0 - clamp( pow(dotProd, _CloudSpecPower), 0.0, 1.0 );
        spec *= 2.0;
        vec3 cloudCol = spec * _CloudSpecCol + _CloudCol;

        // Note: I removed the BigMountain transparency check here as requested.
        
        // Mixing for backdrop clouds
        vec3 inCloudCol = mix(cloudCol, _BackCloudCol + skyCol * 0.5 + spec * _BackCloudSpecCol, MAT_FRONT_CLOUDS - m);
        return mix( inCloudCol , skyCol, skyFog * _CloudFogStrength );    
    }

    return skyCol;
}

void main()
{
    // Camera Setup (Matches original shader movement)
    float unitNoiseX = (noise(iTime * _CameraMovement.w ) * 2.0)  - 1.0;
    float unitNoiseY = (noise((iTime * _CameraMovement.w ) + 32.0) * 2.0)  -1.0;
    float unitNoiseZ = (noise((iTime * _CameraMovement.w ) + 48.0) * 2.0)  -1.0;
    vec3 ro = _CameraPos + vec3(unitNoiseX, unitNoiseY, unitNoiseZ) * _CameraMovement.xyz;

    // Ray Direction calculation
    vec2 fragCoord = vUv * iResolution; // Simulate fragCoord
    vec3 screenRay = vec3(vUv * 2.0 - 1.0, 1.0); // -1 to 1 space
    
    // Screen ray frustum aligned (Matching original aspect ratio logic roughly)
    // NOTE: In r3f you might want to pass proper aspect ratio here
    float aspect = iResolution.x / iResolution.y;
    
    screenRay.xy = screenRay.xy * _CameraFOV.xy;
    // Fix aspect ratio distortion from original shader logic
    // The original uses a specific FOV calc, here we adapt to UV
    
    screenRay.x *= 1.35; 
    screenRay.z  = -_CameraFOV.z;
    screenRay /= abs( _CameraFOV.z); 

    vec3 rd = normalize(mul( _CameraInvViewMatrix, vec4(screenRay,0.0))).xyz;

    vec3 col = render(ro, rd);

    // Vignette
    vec2 screenCoord = vUv * 2.0 - 1.0;
    float vig = pow(1.0 - 0.4 * dot(screenCoord, screenCoord), 0.6) * 1.25;
    vig = min( vig, 1.0);
    col *= vig;

    gl_FragColor = vec4(col, 1.0);
}
