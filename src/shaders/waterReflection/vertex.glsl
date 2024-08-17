varying vec4 vClipSpace;
varying vec2 vTextureCoords;
uniform vec3 uLightPosition;

varying vec2 vUv;
varying vec3 vToCamera;
varying vec3 vFromLight;
varying vec3 vPosition;

void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vClipSpace = projectionMatrix * viewMatrix * worldPosition;
    vTextureCoords = uv; 
    vUv = uv;
    vToCamera = cameraPosition.xyz - worldPosition.xyz;
    vPosition = worldPosition.xyz;
    vFromLight = worldPosition.xyz - uLightPosition;
    gl_Position = vClipSpace;
}
