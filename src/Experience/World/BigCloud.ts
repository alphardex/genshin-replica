import * as kokomi from "kokomi.js";
import * as THREE from "three";
import * as STDLIB from "three-stdlib";

import type Experience from "../Experience";

import bigCloudVertexShader from "../Shaders/BigCloud/vert.glsl";
import bigCloudFragmentShader from "../Shaders/BigCloud/frag.glsl";
import bigCloudBgFragmentShader from "../Shaders/BigCloud/frag-bg.glsl";

export default class BigCloud extends kokomi.Component {
  declare base: Experience;
  model: STDLIB.GLTF;
  constructor(base: Experience) {
    super(base);

    const material1 = new THREE.ShaderMaterial({
      vertexShader: bigCloudVertexShader,
      fragmentShader: bigCloudFragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTexture: {
          value: this.base.am.items["Tex_0063"],
        },
      },
    });

    const material2 = new THREE.ShaderMaterial({
      vertexShader: bigCloudVertexShader,
      fragmentShader: bigCloudBgFragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTexture: {
          value: this.base.am.items["Tex_0067b"],
        },
      },
    });

    const model = this.base.am.items["SM_BigCloud"] as STDLIB.GLTF;
    this.model = model;

    // @ts-ignore
    model.scene.traverse((obj: THREE.Mesh) => {
      if (obj.isMesh) {
        obj.position.multiplyScalar(0.1);
        obj.scale.multiplyScalar(0.1);
        obj.renderOrder = -1;
        obj.frustumCulled = false;
        if (obj.name === "Plane011") {
          obj.material = material1;
        } else {
          obj.material = material2;
        }
      }
    });
  }
  addExisting(): void {
    this.container.add(this.model.scene);
  }
  update(): void {
    this.model.scene.position.copy(this.base.camera.position);
  }
}
