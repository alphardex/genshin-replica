import * as kokomi from "kokomi.js";
import * as THREE from "three";

import type Experience from "../Experience";

import cloudVertexShader from "../Shaders/Cloud/vert.glsl";
import cloudFragmentShader from "../Shaders/Cloud/frag.glsl";

import { meshList } from "../Data/cloud";
import config from "../config";

export default class Cloud extends kokomi.Component {
  declare base: Experience;
  params;
  meshInfos: MeshInfo[];
  uj: kokomi.UniformInjector;
  material: THREE.ShaderMaterial;
  instancedMesh: THREE.InstancedMesh;
  constructor(base: Experience) {
    super(base);

    this.params = {
      color1: "#00a2f0",
      color2: "#f0f0f5",
    };

    // 转化所有物体的属性格式
    const meshInfos = meshList.map((item) => {
      return {
        object: item.object,
        position: new THREE.Vector3(
          item.position[0],
          item.position[2],
          -item.position[1]
        ).multiplyScalar(0.1),
        rotation: new THREE.Quaternion(),
        scale: new THREE.Vector3(1, 1, 1),
      };
    });
    meshInfos.sort((a, b) => {
      return a.position.z - b.position.z;
    });
    this.meshInfos = meshInfos;

    const geometry = new THREE.PlaneGeometry(3000, 1500);

    const uj = new kokomi.UniformInjector(this.base);
    this.uj = uj;

    const material = new THREE.ShaderMaterial({
      vertexShader: cloudVertexShader,
      fragmentShader: cloudFragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        ...uj.shadertoyUniforms,
        uTexture: {
          value: this.base.am.items["Tex_0062"],
        },
        uColor1: {
          value: new THREE.Color(this.params.color1),
        },
        uColor2: {
          value: new THREE.Color(this.params.color2),
        },
      },
    });
    this.material = material;

    const instancedMesh = new THREE.InstancedMesh(
      geometry,
      material,
      meshInfos.length
    );
    this.instancedMesh = instancedMesh;
    this.instancedMesh.frustumCulled = false;

    this.createDebug();
  }
  addExisting(): void {
    this.container.add(this.instancedMesh);
    this.updateInstance();
  }
  update(): void {
    this.uj.injectShadertoyUniforms(this.material.uniforms);

    this.keepInfinite();
  }
  // 将所有物体属性同步到网格上
  updateInstance() {
    this.meshInfos.forEach((item, i) => {
      const mat = new THREE.Matrix4();
      mat.compose(item.position, item.rotation, item.scale);
      this.instancedMesh.setMatrixAt(i, mat);
    });
    this.instancedMesh.instanceMatrix.needsUpdate = true;
  }
  createDebug() {
    const debug = this.base.debug;
    const params = this.params;
    const material = this.material;

    if (debug.active) {
      const debugFolder = debug.ui!.addFolder("cloud");
      debugFolder.addColor(params, "color1").onChange((val: number) => {
        material.uniforms.uColor1.value = new THREE.Color(val);
      });
      debugFolder.addColor(params, "color2").onChange((val: number) => {
        material.uniforms.uColor2.value = new THREE.Color(val);
      });
    }
  }
  // 无限延伸，本质上是一种移动物体位置的障眼法
  keepInfinite() {
    if (this.instancedMesh) {
      if (
        this.meshInfos[this.meshInfos.length - 1].position.z >
        this.base.camera.position.z
      ) {
        const firstElement = this.meshInfos.pop();
        if (firstElement) {
          firstElement.position.z -= config.totalZ * 0.1;
          this.meshInfos.unshift(firstElement);
          this.updateInstance();
        }
      }
    }
  }
}
