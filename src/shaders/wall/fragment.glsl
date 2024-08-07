uniform vec3 uColor;
varying vec2 vUv;

void main(){
    float gradientFactor = (vUv.x + vUv.y) / 2.0;
    vec3 gradient = mix(vec3(0.0),uColor , gradientFactor);
    gl_FragColor = vec4(gradient, 1.0);
}