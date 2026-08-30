uniform vec3 uColor;
uniform float uOpacity;

void main() {
  vec2 uv = gl_PointCoord - 0.5;

  float distanceFromCenter = length(uv);

  float glow = 1.0 - smoothstep(0.0, 0.5, distanceFromCenter);

  gl_FragColor = vec4(
    uColor,
    glow * uOpacity
  );
}