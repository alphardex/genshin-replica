import * as kokomi from "kokomi.js";
import * as THREE from "three";

import type Experience from "../Experience";

import gradientBackgroundFragmentShader from "../Shaders/GradientBackground/frag.glsl";

export default class GradientBackground extends kokomi.Component {
  declare base: Experience;
  params;
  quad: kokomi.ScreenQuad;
  constructor(base: Experience) {
    super(base);

    this.params = {
      color1: "#001c54",
      color2: "#023fa1",
      color3: "#26a8ff",
      stop1: 0.2,
      stop2: 0.6,
    };

    // 用纯Shader实现的一个平面
    this.quad = new kokomi.ScreenQuad(this.base, {
      fragmentShader: gradientBackgroundFragmentShader,
      shadertoyMode: true,
      uniforms: {
        uColor1: {
          value: new THREE.Color(this.params.color1),
        },
        uColor2: {
          value: new THREE.Color(this.params.color2),
        },
        uColor3: {
          value: new THREE.Color(this.params.color3),
        },
        uStop1: {
          value: this.params.stop1,
        },
        uStop2: {
          value: this.params.stop2,
        },
      },
    });

    // 把平面放在最后侧渲染，就成为了背景
    const mesh = this.quad.mesh;
    mesh.position.z = -1000;
    mesh.renderOrder = -1;
    mesh.frustumCulled = false;

    const material = this.quad.mesh.material as THREE.ShaderMaterial;
    material.depthWrite = false;

    this.createDebug();
  }
  addExisting(): void {
    this.quad.addExisting();
  }
  createDebug() {
    const debug = this.base.debug;
    const params = this.params;
    const material = this.quad.mesh.material as THREE.ShaderMaterial;

    if (debug.active) {
      const debugFolder = debug.ui!.addFolder("background");
      debugFolder.addColor(params, "color1").onChange((val: number) => {
        material.uniforms.uColor1.value = new THREE.Color(val);
      });
      debugFolder.addColor(params, "color2").onChange((val: number) => {
        material.uniforms.uColor2.value = new THREE.Color(val);
      });
      debugFolder.addColor(params, "color3").onChange((val: number) => {
        material.uniforms.uColor3.value = new THREE.Color(val);
      });
      debugFolder
        .add(params, "stop1")
        .min(0)
        .max(1)
        .onChange((val: number) => {
          material.uniforms.uStop1.value = val;
        });
      debugFolder
        .add(params, "stop2")
        .min(0)
        .max(1)
        .onChange((val: number) => {
          material.uniforms.uStop2.value = val;
        });
    }
  }
}
