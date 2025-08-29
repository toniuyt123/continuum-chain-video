#version 300 es
precision highp float;

#include "@motion-canvas/core/shaders/common.glsl"

uniform float time;     // animate over time
uniform float amplitude; // height of wave
uniform float frequency; // number of waves along the line

in vec2 position;       // vertex position
out vec2 vUV;           // pass UV to fragment shader

void main() {
    // Apply sine wave distortion to the y position
    float wave = sin(position.x * frequency + time) * amplitude;
    vec2 newPos = vec2(position.x, position.y + wave);

    // Output final position
    gl_Position = vec4(newPos, 0.0, 1.0);

    // pass UVs if needed
    vUV = position;
}
