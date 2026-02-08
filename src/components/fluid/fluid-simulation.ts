// WebGL Fluid Simulation
// Based on Pavel Dobryakov's WebGL Fluid Simulation
// https://github.com/PavelDoGreat/WebGL-Fluid-Simulation

export interface FluidConfig {
  simResolution: number;
  dyeResolution: number;
  densityDissipation: number;
  velocityDissipation: number;
  pressureDissipation: number;
  pressureIterations: number;
  curl: number;
  splatRadius: number;
  splatForce: number;
}

export const defaultConfig: FluidConfig = {
  simResolution: 128,
  dyeResolution: 1024,
  densityDissipation: 0.97,
  velocityDissipation: 0.98,
  pressureDissipation: 0.8,
  pressureIterations: 20,
  curl: 30,
  splatRadius: 0.25,
  splatForce: 6000,
};

// --- Shader Sources ---

const baseVertexShader = `
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;
  void main () {
    vUv = aPosition * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const clearShader = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  uniform sampler2D uTexture;
  uniform float value;
  void main () {
    gl_FragColor = value * texture2D(uTexture, vUv);
  }
`;

const displayShaderSource = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  void main () {
    vec3 c = texture2D(uTexture, vUv).rgb;
    float a = max(c.r, max(c.g, c.b));
    gl_FragColor = vec4(c, a);
  }
`;

const splatShader = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 color;
  uniform vec2 point;
  uniform float radius;
  void main () {
    vec2 p = vUv - point.xy;
    p.x *= aspectRatio;
    vec3 splat = exp(-dot(p, p) / radius) * color;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`;

const advectionShader = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform vec2 dyeTexelSize;
  uniform float dt;
  uniform float dissipation;
  vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
    vec2 st = uv / tsize - 0.5;
    vec2 iuv = floor(st);
    vec2 fuv = fract(st);
    vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
    vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
    vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
    vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
    return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
  }
  void main () {
    vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
    vec4 result = bilerp(uSource, coord, dyeTexelSize);
    float decay = 1.0 + dissipation * dt;
    gl_FragColor = result / decay;
  }
`;

const divergenceShader = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).x;
    float R = texture2D(uVelocity, vR).x;
    float T = texture2D(uVelocity, vT).y;
    float B = texture2D(uVelocity, vB).y;
    vec2 C = texture2D(uVelocity, vUv).xy;
    if (vL.x < 0.0) { L = -C.x; }
    if (vR.x > 1.0) { R = -C.x; }
    if (vT.y > 1.0) { T = -C.y; }
    if (vB.y < 0.0) { B = -C.y; }
    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`;

const curlShader = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).y;
    float R = texture2D(uVelocity, vR).y;
    float T = texture2D(uVelocity, vT).x;
    float B = texture2D(uVelocity, vB).x;
    float vorticity = R - L - T + B;
    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
  }
`;

const vorticityShader = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float curl;
  uniform float dt;
  void main () {
    float L = texture2D(uCurl, vL).x;
    float R = texture2D(uCurl, vR).x;
    float T = texture2D(uCurl, vT).x;
    float B = texture2D(uCurl, vB).x;
    float C = texture2D(uCurl, vUv).x;
    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= curl * C;
    force.y *= -1.0;
    vec2 vel = texture2D(uVelocity, vUv).xy;
    gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
  }
`;

const pressureShader = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    float C = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - C) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`;

const gradientSubtractShader = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  varying highp vec2 vL;
  varying highp vec2 vR;
  varying highp vec2 vT;
  varying highp vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

// --- Interfaces ---

interface FBO {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  attach(id: number): number;
}

interface DoubleFBO {
  width: number;
  height: number;
  texelSizeX: number;
  texelSizeY: number;
  read: FBO;
  write: FBO;
  swap(): void;
}

interface TextureFormats {
  internalFormat: number;
  format: number;
  type: number;
  halfFloatExt: OES_texture_half_float | null;
}

// --- Utility Functions ---

function getWebGLContext(canvas: HTMLCanvasElement): { gl: WebGLRenderingContext; ext: TextureFormats } {
  const params = {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    preserveDrawingBuffer: false,
  };

  const gl = canvas.getContext('webgl', params) as WebGLRenderingContext;
  if (!gl) throw new Error('WebGL not supported');

  const halfFloat = gl.getExtension('OES_texture_half_float');
  gl.getExtension('OES_texture_half_float_linear');

  let internalFormat: number;
  let format: number;
  let type: number;

  if (halfFloat) {
    internalFormat = gl.RGBA;
    format = gl.RGBA;
    type = halfFloat.HALF_FLOAT_OES;

    // Test if half float rendering works
    if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
      // Fallback to unsigned byte
      type = gl.UNSIGNED_BYTE;
    }
  } else {
    internalFormat = gl.RGBA;
    format = gl.RGBA;
    type = gl.UNSIGNED_BYTE;
  }

  return {
    gl,
    ext: { internalFormat, format, type, halfFloatExt: halfFloat },
  };
}

function supportRenderTextureFormat(
  gl: WebGLRenderingContext,
  internalFormat: number,
  format: number,
  type: number
): boolean {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

  const fbo = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  gl.deleteTexture(texture);
  gl.deleteFramebuffer(fbo);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);

  return status === gl.FRAMEBUFFER_COMPLETE;
}

function getResolution(gl: WebGLRenderingContext, resolution: number): { width: number; height: number } {
  let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
  if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;
  const min = Math.round(resolution);
  const max = Math.round(resolution * aspectRatio);
  if (gl.drawingBufferWidth > gl.drawingBufferHeight) {
    return { width: max, height: min };
  }
  return { width: min, height: max };
}

function createFBO(
  gl: WebGLRenderingContext,
  w: number,
  h: number,
  internalFormat: number,
  format: number,
  type: number,
  param: number
): FBO {
  gl.activeTexture(gl.TEXTURE0);
  const texture = gl.createTexture();
  if (!texture) throw new Error('Failed to create texture');
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

  const fbo = gl.createFramebuffer();
  if (!fbo) throw new Error('Failed to create framebuffer');
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.viewport(0, 0, w, h);
  gl.clear(gl.COLOR_BUFFER_BIT);

  return {
    texture,
    fbo,
    width: w,
    height: h,
    texelSizeX: 1.0 / w,
    texelSizeY: 1.0 / h,
    attach(id: number) {
      gl.activeTexture(gl.TEXTURE0 + id);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      return id;
    },
  };
}

function createDoubleFBO(
  gl: WebGLRenderingContext,
  w: number,
  h: number,
  internalFormat: number,
  format: number,
  type: number,
  param: number
): DoubleFBO {
  let fbo1 = createFBO(gl, w, h, internalFormat, format, type, param);
  let fbo2 = createFBO(gl, w, h, internalFormat, format, type, param);
  return {
    width: w,
    height: h,
    texelSizeX: 1.0 / w,
    texelSizeY: 1.0 / h,
    get read() { return fbo1; },
    set read(value) { fbo1 = value; },
    get write() { return fbo2; },
    set write(value) { fbo2 = value; },
    swap() {
      const temp = fbo1;
      fbo1 = fbo2;
      fbo2 = temp;
    },
  };
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Failed to create shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    throw new Error('Failed to compile shader');
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
  const program = gl.createProgram();
  if (!program) throw new Error('Failed to create program');
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    throw new Error('Failed to link program');
  }
  return program;
}

function getUniforms(gl: WebGLRenderingContext, program: WebGLProgram): Record<string, WebGLUniformLocation> {
  const uniforms: Record<string, WebGLUniformLocation> = {};
  const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < uniformCount; i++) {
    const uniformInfo = gl.getActiveUniform(program, i);
    if (uniformInfo) {
      const location = gl.getUniformLocation(program, uniformInfo.name);
      if (location) {
        uniforms[uniformInfo.name] = location;
      }
    }
  }
  return uniforms;
}

// --- Material Class ---

class Material {
  private uniforms: Record<string, WebGLUniformLocation> = {};
  private program: WebGLProgram;

  constructor(gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShaderSource: string) {
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    this.program = createProgram(gl, vertexShader, fragmentShader);
    this.uniforms = getUniforms(gl, this.program);
  }

  bind(gl: WebGLRenderingContext) {
    gl.useProgram(this.program);
  }

  setUniform(gl: WebGLRenderingContext, name: string, value: number | number[] | boolean) {
    const location = this.uniforms[name];
    if (location === undefined) return;
    if (Array.isArray(value)) {
      if (value.length === 2) gl.uniform2f(location, value[0], value[1]);
      else if (value.length === 3) gl.uniform3f(location, value[0], value[1], value[2]);
      else if (value.length === 4) gl.uniform4f(location, value[0], value[1], value[2], value[3]);
    } else if (typeof value === 'boolean') {
      gl.uniform1i(location, value ? 1 : 0);
    } else {
      gl.uniform1f(location, value);
    }
  }

  setUniformInt(gl: WebGLRenderingContext, name: string, value: number) {
    const location = this.uniforms[name];
    if (location === undefined) return;
    gl.uniform1i(location, value);
  }

  getProgram(): WebGLProgram {
    return this.program;
  }
}

// --- Color Helpers ---

function HSVtoRGB(h: number, s: number, v: number): { r: number; g: number; b: number } {
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r: number, g: number, b: number;
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
    default: r = 0; g = 0; b = 0;
  }
  return { r, g, b };
}

function generateColor(): [number, number, number] {
  const c = HSVtoRGB(Math.random(), 1.0, 1.0);
  // Multiply by 0.15 for subtle colors (matching reference exactly)
  return [c.r * 0.15, c.g * 0.15, c.b * 0.15];
}

// --- Main Simulation Class ---

export class FluidSimulation {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext;
  private config: FluidConfig;
  private ext: TextureFormats;

  private dye!: DoubleFBO;
  private velocity!: DoubleFBO;
  private divergenceFBO!: FBO;
  private curlFBO!: FBO;
  private pressure!: DoubleFBO;

  private clearProgram: Material;
  private displayProgram: Material;
  private splatProgram: Material;
  private advectionProgram: Material;
  private divergenceProgram: Material;
  private curlProgram: Material;
  private vorticityProgram: Material;
  private pressureProgram: Material;
  private gradientSubtractProgram: Material;

  private quadBuffer: WebGLBuffer;
  private lastTime = 0;
  private colorHue = Math.random();

  constructor(canvas: HTMLCanvasElement, config: Partial<FluidConfig> = {}) {
    this.canvas = canvas;
    this.config = { ...defaultConfig, ...config };

    const { gl, ext } = getWebGLContext(canvas);
    this.gl = gl;
    this.ext = ext;

    gl.clearColor(0.0, 0.0, 0.0, 0.0);

    const baseVertex = compileShader(gl, gl.VERTEX_SHADER, baseVertexShader);

    this.clearProgram = new Material(gl, baseVertex, clearShader);
    this.displayProgram = new Material(gl, baseVertex, displayShaderSource);
    this.splatProgram = new Material(gl, baseVertex, splatShader);
    this.advectionProgram = new Material(gl, baseVertex, advectionShader);
    this.divergenceProgram = new Material(gl, baseVertex, divergenceShader);
    this.curlProgram = new Material(gl, baseVertex, curlShader);
    this.vorticityProgram = new Material(gl, baseVertex, vorticityShader);
    this.pressureProgram = new Material(gl, baseVertex, pressureShader);
    this.gradientSubtractProgram = new Material(gl, baseVertex, gradientSubtractShader);

    this.quadBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);

    this.initFramebuffers();
  }

  private initFramebuffers() {
    const gl = this.gl;
    const { internalFormat, format, type } = this.ext;

    const simRes = getResolution(gl, this.config.simResolution);
    const dyeRes = getResolution(gl, this.config.dyeResolution);

    this.dye = createDoubleFBO(gl, dyeRes.width, dyeRes.height, internalFormat, format, type, gl.LINEAR);
    this.velocity = createDoubleFBO(gl, simRes.width, simRes.height, internalFormat, format, type, gl.LINEAR);
    this.divergenceFBO = createFBO(gl, simRes.width, simRes.height, internalFormat, format, type, gl.NEAREST);
    this.curlFBO = createFBO(gl, simRes.width, simRes.height, internalFormat, format, type, gl.NEAREST);
    this.pressure = createDoubleFBO(gl, simRes.width, simRes.height, internalFormat, format, type, gl.NEAREST);
  }

  resize() {
    this.initFramebuffers();
  }

  private blit(target: FBO | null) {
    const gl = this.gl;
    if (target) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      gl.viewport(0, 0, target.width, target.height);
    } else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }

  private bindQuad(program: Material) {
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);
    const aPosition = gl.getAttribLocation(program.getProgram(), 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
  }

  splatAtPoint(x: number, y: number, dx: number, dy: number, color: [number, number, number]) {
    const gl = this.gl;

    // Velocity splat
    this.splatProgram.bind(gl);
    this.bindQuad(this.splatProgram);
    this.splatProgram.setUniformInt(gl, 'uTarget', this.velocity.read.attach(0));
    this.splatProgram.setUniform(gl, 'aspectRatio', this.canvas.width / this.canvas.height);
    this.splatProgram.setUniform(gl, 'point', [x, y]);
    this.splatProgram.setUniform(gl, 'color', [dx, dy, 0.0]);
    this.splatProgram.setUniform(gl, 'radius', correctRadius(this.config.splatRadius / 100.0));
    this.blit(this.velocity.write);
    this.velocity.swap();

    // Dye splat
    this.splatProgram.bind(gl);
    this.bindQuad(this.splatProgram);
    this.splatProgram.setUniformInt(gl, 'uTarget', this.dye.read.attach(0));
    this.splatProgram.setUniform(gl, 'aspectRatio', this.canvas.width / this.canvas.height);
    this.splatProgram.setUniform(gl, 'point', [x, y]);
    this.splatProgram.setUniform(gl, 'color', color);
    this.splatProgram.setUniform(gl, 'radius', correctRadius(this.config.splatRadius / 100.0));
    this.blit(this.dye.write);
    this.dye.swap();
  }

  multipleSplats(amount: number) {
    for (let i = 0; i < amount; i++) {
      const color = generateColor();
      const x = Math.random();
      const y = Math.random();
      const dx = 1000 * (Math.random() - 0.5);
      const dy = 1000 * (Math.random() - 0.5);
      this.splatAtPoint(x, y, dx, dy, color);
    }
  }

  splatPointer(x: number, y: number, dx: number, dy: number) {
    const forceMultiplier = this.config.splatForce;
    let velocityX = dx * forceMultiplier;
    let velocityY = dy * forceMultiplier;

    // Ensure minimum velocity for visibility even with slow mouse movements
    const minVelocity = 500;
    const magnitude = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    if (magnitude > 0 && magnitude < minVelocity) {
      const scale = minVelocity / magnitude;
      velocityX *= scale;
      velocityY *= scale;
    }

    console.log('Splat:', { velocityX: velocityX.toFixed(2), velocityY: velocityY.toFixed(2) });
    this.splatAtPoint(x, y, velocityX, velocityY, this.getNextColor());
  }

  private getNextColor(): [number, number, number] {
    this.colorHue += 0.01;
    if (this.colorHue >= 1.0) this.colorHue -= 1.0;
    const c = HSVtoRGB(this.colorHue, 1.0, 1.0);
    // Multiply by 0.15 for subtle mouse movement colors (matching reference)
    const color: [number, number, number] = [c.r * 0.15, c.g * 0.15, c.b * 0.15];
    console.log('Color:', { r: color[0].toFixed(2), g: color[1].toFixed(2), b: color[2].toFixed(2) });
    return color;
  }

  step() {
    const gl = this.gl;
    const now = performance.now();
    let dt = (now - this.lastTime) / 1000;
    dt = Math.min(dt, 0.016666);
    this.lastTime = now;

    gl.disable(gl.BLEND);

    // Curl
    this.curlProgram.bind(gl);
    this.bindQuad(this.curlProgram);
    this.curlProgram.setUniform(gl, 'texelSize', [this.velocity.texelSizeX, this.velocity.texelSizeY]);
    this.curlProgram.setUniformInt(gl, 'uVelocity', this.velocity.read.attach(0));
    this.blit(this.curlFBO);

    // Vorticity
    this.vorticityProgram.bind(gl);
    this.bindQuad(this.vorticityProgram);
    this.vorticityProgram.setUniform(gl, 'texelSize', [this.velocity.texelSizeX, this.velocity.texelSizeY]);
    this.vorticityProgram.setUniformInt(gl, 'uVelocity', this.velocity.read.attach(0));
    this.vorticityProgram.setUniformInt(gl, 'uCurl', this.curlFBO.attach(1));
    this.vorticityProgram.setUniform(gl, 'curl', this.config.curl);
    this.vorticityProgram.setUniform(gl, 'dt', dt);
    this.blit(this.velocity.write);
    this.velocity.swap();

    // Divergence
    this.divergenceProgram.bind(gl);
    this.bindQuad(this.divergenceProgram);
    this.divergenceProgram.setUniform(gl, 'texelSize', [this.velocity.texelSizeX, this.velocity.texelSizeY]);
    this.divergenceProgram.setUniformInt(gl, 'uVelocity', this.velocity.read.attach(0));
    this.blit(this.divergenceFBO);

    // Clear pressure
    this.clearProgram.bind(gl);
    this.bindQuad(this.clearProgram);
    this.clearProgram.setUniformInt(gl, 'uTexture', this.pressure.read.attach(0));
    this.clearProgram.setUniform(gl, 'value', this.config.pressureDissipation);
    this.blit(this.pressure.write);
    this.pressure.swap();

    // Pressure solve
    this.pressureProgram.bind(gl);
    this.bindQuad(this.pressureProgram);
    this.pressureProgram.setUniform(gl, 'texelSize', [this.velocity.texelSizeX, this.velocity.texelSizeY]);
    for (let i = 0; i < this.config.pressureIterations; i++) {
      this.pressureProgram.setUniformInt(gl, 'uPressure', this.pressure.read.attach(0));
      this.pressureProgram.setUniformInt(gl, 'uDivergence', this.divergenceFBO.attach(1));
      this.blit(this.pressure.write);
      this.pressure.swap();
    }

    // Gradient subtract
    this.gradientSubtractProgram.bind(gl);
    this.bindQuad(this.gradientSubtractProgram);
    this.gradientSubtractProgram.setUniform(gl, 'texelSize', [this.velocity.texelSizeX, this.velocity.texelSizeY]);
    this.gradientSubtractProgram.setUniformInt(gl, 'uPressure', this.pressure.read.attach(0));
    this.gradientSubtractProgram.setUniformInt(gl, 'uVelocity', this.velocity.read.attach(1));
    this.blit(this.velocity.write);
    this.velocity.swap();

    // Advect velocity
    this.advectionProgram.bind(gl);
    this.bindQuad(this.advectionProgram);
    this.advectionProgram.setUniform(gl, 'texelSize', [this.velocity.texelSizeX, this.velocity.texelSizeY]);
    this.advectionProgram.setUniform(gl, 'dyeTexelSize', [this.velocity.texelSizeX, this.velocity.texelSizeY]);
    this.advectionProgram.setUniformInt(gl, 'uVelocity', this.velocity.read.attach(0));
    this.advectionProgram.setUniformInt(gl, 'uSource', this.velocity.read.attach(0));
    this.advectionProgram.setUniform(gl, 'dt', dt);
    this.advectionProgram.setUniform(gl, 'dissipation', this.config.velocityDissipation);
    this.blit(this.velocity.write);
    this.velocity.swap();

    // Advect dye
    this.advectionProgram.bind(gl);
    this.bindQuad(this.advectionProgram);
    this.advectionProgram.setUniform(gl, 'texelSize', [this.velocity.texelSizeX, this.velocity.texelSizeY]);
    this.advectionProgram.setUniform(gl, 'dyeTexelSize', [this.dye.texelSizeX, this.dye.texelSizeY]);
    this.advectionProgram.setUniformInt(gl, 'uVelocity', this.velocity.read.attach(0));
    this.advectionProgram.setUniformInt(gl, 'uSource', this.dye.read.attach(1));
    this.advectionProgram.setUniform(gl, 'dt', dt);
    this.advectionProgram.setUniform(gl, 'dissipation', this.config.densityDissipation);
    this.blit(this.dye.write);
    this.dye.swap();

    // Display
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
    this.displayProgram.bind(gl);
    this.bindQuad(this.displayProgram);
    this.displayProgram.setUniformInt(gl, 'uTexture', this.dye.read.attach(0));
    this.blit(null);
  }
}

function correctRadius(radius: number): number {
  const aspectRatio = window.innerWidth / window.innerHeight;
  if (aspectRatio > 1) {
    return radius * aspectRatio;
  }
  return radius;
}
