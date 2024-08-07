varying float vProgressPosition;
uniform float uProgress;

void main() {
    vec3 color = vec3(0.5);

    if(vProgressPosition < uProgress) {
        color = vec3(1.0);
    }

    gl_FragColor = vec4(color, 1.0);
}