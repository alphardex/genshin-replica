import * as kokomi from "kokomi.js";
import * as THREE from "three";
import * as STDLIB from "three-stdlib";

import type Experience from "../Experience";

import polarLightVertexShader from "../Shaders/PolarLight/vert.glsl";
import polarLightFragmentShader from "../Shaders/PolarLight/frag.glsl";

import { meshList } from "../Data/polarLight";
import config from "../config";

export default class PolarLight extends kokomi.Component {
  declare base: Experience;
  meshInfos: MeshInfo[];
  uj: kokomi.UniformInjector;
  material: THREE.ShaderMaterial;
  instancedMesh: THREE.InstancedMesh;
  constructor(base: Experience) {
    super(base);

    // 转化所有物体的属性格式
    const meshInfos = meshList.map((item) => {
      return {
        object: item.object,
        position: new THREE.Vector3(
          item.position[0],
          item.position[2],
          -item.position[1]
        ).multiplyScalar(0.1),
        rotation: new THREE.Quaternion().setFromEuler(
          new THREE.Euler(item.rotation[0], -item.rotation[1], item.rotation[2])
        ),
        scale: new THREE.Vector3(0.1, 0.1, 0.1),
      };
    });
    meshInfos.sort((a, b) => {
      return a.position.z - b.position.z;
    });
    this.meshInfos = meshInfos;

    const model = this.base.am.items["SM_Light"] as STDLIB.GLTF;
    const mesh = model.scene.children[0] as THREE.Mesh;

    const geometry = mesh.geometry;

    const tex = this.base.am.items["Tex_0071"] as THREE.Texture;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;

    const uj = new kokomi.UniformInjector(this.base);
    this.uj = uj;

    const material = new THREE.ShaderMaterial({
      vertexShader: polarLightVertexShader,
      fragmentShader: polarLightFragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        ...uj.shadertoyUniforms,
        uTexture: {
          value: tex,
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
