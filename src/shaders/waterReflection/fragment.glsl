uniform vec3 uColor; 
uniform vec3 uLightColor;

uniform float uWavesStrength; 
uniform float uMoveFactor; 

uniform sampler2D tDiffuse; 
uniform sampler2D tDudv; 
uniform sampler2D tNormal; 

varying vec4 vClipSpace;
varying vec2 vTextureCoords;
varying vec3 vToCamera;
varying vec3 vFromLight;
varying vec3 vPosition;
uniform vec3 uDirectionalLightPosition;
uniform vec3 uPointLightPosition;

const float reflectivity = 0.6;

#include ../includes/ambientLight.glsl
#include ../includes/directionalLight.glsl
#include ../includes/pointLight.glsl

void main() {
  vec2 ndc = (vClipSpace.xy / vClipSpace.w) / 2.0 + 0.5;
  vec2 reflectionCoords = vec2(ndc.x, 0.8 - ndc.y);

  // Coordinates
  vec2 distortedTexCoords = texture(tDudv, vec2(vTextureCoords.x + uMoveFactor, vTextureCoords.y)).rg * 0.1;
  distortedTexCoords = vTextureCoords + vec2(distortedTexCoords.x, distortedTexCoords.y + uMoveFactor);
  vec2 distortion = (texture(tDudv, distortedTexCoords).rg * 2.0 - 1.0) * uWavesStrength;

  reflectionCoords += distortion;
  reflectionCoords.x = clamp(reflectionCoords.x, 0.001, 0.999);
  reflectionCoords.y = clamp(reflectionCoords.y, 0.001, 0.999);

  vec4 reflectColor = texture(tDiffuse, reflectionCoords);
  vec3 viewVector = normalize(vToCamera);
  float refractiveFactor = dot(viewVector, vec3(0.0, 1.0, 0.0));
  refractiveFactor = pow(refractiveFactor, 0.5);

  // Normals
  vec4 normalMap = texture(tNormal, distortedTexCoords);
  vec3 normal = vec3(normalMap.r * 2.0 - 1.0, normalMap.b, normalMap.g * 2.0 - 1.0);
  normal = normalize(normal);

  // Reflection
  vec3 reflectedLight = reflect(normalize(vFromLight), normal);
	float specular = max(dot(reflectedLight, viewVector), 0.0);
	specular = pow(specular, 20.0);
	vec3 specularHighlights = uLightColor * specular * reflectivity;

  // Light
  vec3 light = vec3(0.0);
  light += ambientLight(uLightColor, 0.5);
  light += directionnalLight(uLightColor, 1.0, normal, uDirectionalLightPosition, -viewVector, 20.0);
  light += PointLight(uLightColor, 1.0, normal, uPointLightPosition, -viewVector, 4.0, vPosition, 0.25);

  // Final color
  vec4 color = mix(vec4(uColor, 1.0), reflectColor, refractiveFactor);
  color += vec4(specularHighlights, 0.0);
  color.rgb *= light;
  color.rgb = pow(color.rgb, vec3(1.0 / 2.2));


  gl_FragColor = color;
}
