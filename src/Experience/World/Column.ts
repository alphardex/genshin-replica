import * as kokomi from "kokomi.js";
import * as THREE from "three";
import * as STDLIB from "three-stdlib";
import ky from "kyouka";

import type Experience from "../Experience";

import { meshList } from "../Data/column";
import { getToonMaterialColumn } from "../utils";
import config from "../config";

export default class Column extends kokomi.Component {
  declare base: Experience;
  meshInfos: MeshInfo[];
  instanceInfos: InstanceInfo[];
  uj: kokomi.UniformInjector;
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
          new THREE.Euler(item.rotation[0], item.rotation[2], item.rotation[1])
        ),
        scale: new THREE.Vector3(
          item.scale[0],
          item.scale[2],
          item.scale[1]
        ).multiplyScalar(0.1),
      };
    });
    this.meshInfos = meshInfos;

    // 柱子有多个种类，需要将其分组
    const meshGroup = ky.groupBy(
      meshInfos,
      (item: MeshInfo) => item.object
    ) as Record<string, MeshInfo[]>;
    this.instanceInfos = Object.entries(meshGroup).map(([k, v]) => ({
      object: k,
      instanceList: v,
      meshList: [],
    }));

    const uj = new kokomi.UniformInjector(this.base);
    this.uj = uj;

    this.instanceInfos.forEach((item) => {
      const model = this.base.am.items[item.object] as STDLIB.GLTF;
      // @ts-ignore
      model.scene.traverse((obj: THREE.Mesh) => {
        if (obj.isMesh) {
          const material = obj.material as THREE.MeshStandardMaterial;
          const toonMaterial = getToonMaterialColumn(material);
          const im = new THREE.InstancedMesh(
            obj.geometry,
            toonMaterial,
            item.instanceList.length
          );
          im.castShadow = true;
          im.frustumCulled = false;
          item.meshList.push(im);
        }
      });
    });
  }
  addExisting(): void {
    this.instanceInfos.forEach((item) => {
      item.meshList.forEach((e) => {
        this.container.add(e);
      });
    });
  }
  update(): void {
    this.keepInfinite();
    this.updateInstance();
  }
  // 将所有物体属性同步到网格上
  updateInstance() {
    this.instanceInfos.forEach((item) => {
      item.meshList.forEach((mesh) => {
        item.instanceList.forEach((e, i) => {
          const mat = new THREE.Matrix4();
          mat.compose(e.position, e.rotation, e.scale);
          mesh.setMatrixAt(i, mat);
        });
        mesh.instanceMatrix.needsUpdate = true;
      });
    });
  }
  // 无限延伸，本质上是一种移动物体位置的障眼法
  keepInfinite() {
    this.instanceInfos.forEach((item) => {
      item.meshList.forEach(() => {
        item.instanceList.forEach((e) => {
          if (e.position.z > this.base.camera.position.z + 2000) {
            e.position.z -= config.totalZ * 0.1;
          }
        });
      });
    });
  }
}
