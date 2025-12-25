precision highp float;
in vec2 pos;
out vec4 fragColor;
uniform float power;
uniform vec2 c;

const int numIterations = 200;
const float escapeRadius = 2.0;
const int extraIts = 2;

const vec4 mapping[16] = vec4[](
  vec4(66, 30, 15, 255) / 255.0, 
  vec4(25, 7, 26, 255) / 255.0, 
  vec4(9, 1, 47, 255) / 255.0, 
  vec4(4, 4, 73, 255) / 255.0, 
  vec4(0, 7, 100, 255) / 255.0, 
  vec4(12, 44, 138, 255) / 255.0, 
  vec4(24, 82, 177, 255) / 255.0, 
  vec4(57, 125, 209, 255) / 255.0, 
  vec4(134, 181, 229, 255) / 255.0, 
  vec4(211, 236, 248, 255) / 255.0, 
  vec4(241, 233, 191, 255) / 255.0, 
  vec4(248, 201, 95, 255) / 255.0, 
  vec4(255, 170, 0, 255) / 255.0, 
  vec4(204, 128, 0, 255) / 255.0, 
  vec4(153, 87, 0, 255) / 255.0, 
  vec4(106, 52, 3, 255) / 255.0
);

vec2 complex_pow_fractional(vec2 z, float p) {
    float r = length(z);
    float theta = atan(z.y, z.x); // Range [-PI, PI]

    // Apply the power
    float new_r = pow(r, p);
    float new_theta = theta * p;

    // Convert back to Cartesian
    return vec2(new_r * cos(new_theta), new_r * sin(new_theta));
}

int run(vec2 coord) {
  vec2 normC = c;
  vec2 newCoord = coord;

  int i;
  for(i = 0; i < numIterations; i++) {
    if(length(newCoord) > escapeRadius)
      break;
    newCoord = complex_pow_fractional(newCoord, power) + normC;
  }

  for(int j = 0; j < extraIts; j++) newCoord = complex_pow_fractional(newCoord, power) + normC;

  return i + extraIts;
}

vec4 getColor(int n) {
  // float val = sqrt(float(n) / float(numIterations));
  // return vec4(val, val, val, 1.0);

  if(n < numIterations && n > 0)
    return mapping[n % 16];
  else
    return vec4(0.0, 0.0, 0.0, 1.0);
}

void main() {
  // vec2 coord = getCoords(vec2(gl_FragCoord.x, windowSize.y - gl_FragCoord.y));

  int n = run(pos);
  fragColor = getColor(n);
}
