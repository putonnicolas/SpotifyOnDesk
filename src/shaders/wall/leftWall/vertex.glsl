uniform float uTime;
uniform float uEnergy;

varying vec2 vUv;

vec2 randomGradient(vec2 p) {
  float x = dot(p, vec2(123.4, 234.5));
  float y = dot(p, vec2(234.5, 345.6));
  vec2 gradient = vec2(x, y);
  gradient = sin(gradient);
  gradient = gradient * 43758.5453;
  gradient = sin(gradient + uTime);
  return gradient;
}

vec2 quintic(vec2 p) {
  return p * p * p * (10.0 + p * (-15.0 + p * 6.0));
}

float perlinNoise(vec2 uv) {
  vec2 gridId = floor(uv);
  vec2 gridUv = fract(uv);

  vec2 bl = gridId + vec2(0.0, 0.0);
  vec2 br = gridId + vec2(1.0, 0.0);
  vec2 tl = gridId + vec2(0.0, 1.0);
  vec2 tr = gridId + vec2(1.0, 1.0);

  vec2 g1 = randomGradient(bl);
  vec2 g2 = randomGradient(br);
  vec2 g3 = randomGradient(tl);
  vec2 g4 = randomGradient(tr);

  vec2 distFromBl = gridUv - vec2(0.0, 0.0);
  vec2 distFromBr = gridUv - vec2(1.0, 0.0);
  vec2 distFromTl = gridUv - vec2(0.0, 1.0);
  vec2 distFromTr = gridUv - vec2(1.0, 1.0);

  float d1 = dot(g1, distFromBl);
  float d2 = dot(g2, distFromBr);
  float d3 = dot(g3, distFromTl);
  float d4 = dot(g4, distFromTr);

  gridUv = quintic(gridUv);

  float bot = mix(d1, d2, gridUv.x);
  float top = mix(d3, d4, gridUv.x);
  float pNoise = mix(bot, top, gridUv.y);

  return pNoise + 0.1;
}

float fbmPerlinNoise(vec2 uv) {
  float fbmNoise = 0.0;
  float amplitude = 1.0;
  const float octaves = 2.0;


  for (float i = 0.0; i < octaves; i++) {
    fbmNoise = fbmNoise + perlinNoise(uv) * amplitude;
    amplitude = amplitude * 0.5;
    uv = uv * 2.0;
  }

  return fbmNoise;
}

float domainWarpFbmPerlinNoise(vec2 uv) {
  float fbm1 = fbmPerlinNoise(uv + vec2(0.0, 0.0));
  float fbm2 = fbmPerlinNoise(uv + vec2(5.2, 1.3));
  return fbmPerlinNoise(vec2(fbm1, fbm2));

  float fbm3 = fbmPerlinNoise(uv + 4.0 * fbm1 + vec2(1.7, 9.2));
  float fbm4 = fbmPerlinNoise(uv + 4.0 * fbm2 + vec2(8.3, 2.8));
  return fbmPerlinNoise(vec2(fbm3, fbm4));
}

void main()
{

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    vec2 newUv = uv * 4.0;
    float dwNoise = domainWarpFbmPerlinNoise(newUv);

    modelPosition.x += dwNoise * uEnergy * 10.0;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vUv = uv;
    // vElevation = elevation;
}
