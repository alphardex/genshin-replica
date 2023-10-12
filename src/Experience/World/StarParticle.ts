import * as kokomi from "kokomi.js";
import * as THREE from "three";

import type Experience from "../Experience";

import starParticleVertexShader from "../Shaders/StarParticle/vert.glsl";
import starParticleFragmentShader from "../Shaders/StarParticle/frag.glsl";

export default class StarParticle extends kokomi.Component {
  declare base: Experience;
  uj: kokomi.UniformInjector;
  material: THREE.ShaderMaterial;
  points: THREE.Points;
  constructor(base: Experience) {
    super(base);

    const geometry = new THREE.BufferGeometry();
    const count = 4000;
    let positions = Float32Array.from(
      Array.from({ length: count }, () =>
        [2500, 2500, 1000].map(THREE.MathUtils.randFloatSpread)
      ).flat()
    );
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const randoms = Float32Array.from(
      Array.from({ length: count }, () => [1, 1, 1].map(Math.random)).flat()
    );
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 3));

    const uj = new kokomi.UniformInjector(this.base);
    this.uj = uj;

    const material = new THREE.ShaderMaterial({
      vertexShader: starParticleVertexShader,
      fragmentShader: starParticleFragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        ...uj.shadertoyUniforms,
        uPointSize: {
          value: 10000,
        },
        uPixelRatio: {
          value: this.base.renderer.getPixelRatio(),
        },
        uTexture: {
          value: this.base.am.items["Tex_0075"],
        },
      },
    });
    this.material = material;

    const points = new THREE.Points(geometry, material);
    this.points = points;
    this.points.position.set(0, 0, -1000);
    this.points.frustumCulled = false;
  }
  addExisting(): void {
    this.container.add(this.points);
  }
  update(): void {
    this.uj.injectShadertoyUniforms(this.material.uniforms);

    // 使物体紧跟相机
    this.points.position.copy(
      new THREE.Vector3(
        this.base.camera.position.x,
        this.base.camera.position.y,
        this.base.camera.position.z - 200
      )
    );
  }
}
