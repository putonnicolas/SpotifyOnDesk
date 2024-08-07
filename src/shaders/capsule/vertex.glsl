varying float vProgressPosition;

void main() {
    vProgressPosition = (position.y + 10.0)/ 20.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}