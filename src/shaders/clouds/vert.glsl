varying vec2 vUv;
varying vec3 vWorldPos; // NEW: We need to know where this pixel is in the 3D world

void main() {
    vUv = uv;
    // Calculate world position of the vertex
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPosition.xyz;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
