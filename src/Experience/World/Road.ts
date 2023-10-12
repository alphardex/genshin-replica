import * as kokomi from "kokomi.js";
import * as THREE from "three";
import * as STDLIB from "three-stdlib";
import gsap from "gsap";

import type Experience from "../Experience";

import { getToonMaterialDoor, getToonMaterialRoad } from "../utils";

export default class Road extends kokomi.Component {
  declare base: Experience;
  offset: THREE.Vector3;
  model: STDLIB.GLTF;
  zLength: number;
  roadCount: number;
  originPosList: THREE.Vector3[];
  isDoorCreateActive: boolean;
  isRunning: boolean;
  animations!: kokomi.AnimationManager;
  constructor(base: Experience) {
    super(base);

    const model = this.base.am.items["SM_Road"] as STDLIB.GLTF;
    this.model = model;

    // @ts-ignore
    model.scene.traverse((obj: THREE.Mesh) => {
      if (obj.isMesh) {
        obj.receiveShadow = true;
        const material = obj.material as THREE.MeshStandardMaterial;
        const toonMaterial = getToonMaterialRoad(material, this.base.renderer);
        obj.material = toonMaterial;
        obj.frustumCulled = false;
      }
    });

    this.offset = new THREE.Vector3(0, 34, 200);

    // @ts-ignore
    model.scene.children.forEach((obj: THREE.Mesh) => {
      obj.position.multiplyScalar(0.1);
      obj.scale.multiplyScalar(0.1);
      obj.position.sub(this.offset);
    });

    const zLength = 212.4027;

    const roadCount = model.scene.children.length;
    this.roadCount = roadCount;

    // 克隆一批相同的路块，把它们放在后面
    for (let i = 0; i < roadCount; i++) {
      const cloned = model.scene.children[i].clone();
      cloned.position.add(new THREE.Vector3(0, 0, -zLength));
      model.scene.add(cloned);
    }

    this.zLength = zLength;
    this.zLength *= 2;

    // 把路的原始位置存起来
    this.originPosList = [];
    this.model.scene.children.forEach((item) => {
      this.originPosList.push(item.position.clone());
    });

    this.isDoorCreateActive = false;
    this.isRunning = true;
  }
  addExisting(): void {
    this.container.add(this.model.scene);
  }
  update(): void {
    if (this.isRunning) {
      this.model.scene.children.forEach((item, i) => {
        // 判断相机是否刚好经过路块
        if (item.position.z > this.base.camera.position.z) {
          // 创建门时应停止路块动画
          if (i % this.roadCount === 0 && this.isDoorCreateActive) {
            this.isRunning = false;
            this.createDoor(item.position.z);
            this.emit("stop-camera");
          }
          // 把路块放到后面
          const zOffset = new THREE.Vector3(0, 0, this.zLength);
          item.position.sub(zOffset);
          this.originPosList[i].sub(zOffset);
          // 让路块从下面浮起来
          const originPos = this.originPosList[i].clone();
          item.position.add(new THREE.Vector3(0, -70, 0));
          gsap.to(item.position, {
            x: originPos.x,
            y: originPos.y,
            z: originPos.z,
            duration: 2,
            ease: "back.out",
          });
        }
      });
    }
  }
  // 激活创建门这个动作
  activateCreateDoor() {
    this.isDoorCreateActive = true;
  }
  // 创建门
  async createDoor(z: number) {
    const model = this.base.am.items["DOOR"] as STDLIB.GLTF;

    // @ts-ignore
    model.scene.traverse((obj: THREE.Mesh) => {
      if (obj.isMesh) {
        obj.receiveShadow = true;
        obj.castShadow = true;
        const material = obj.material as THREE.MeshStandardMaterial;
        const toonMaterial = getToonMaterialDoor(material);
        obj.material = toonMaterial;
        obj.frustumCulled = false;
      }
    });

    model.scene.scale.set(0.1, 0.1, 0.04);
    this.offset.copy(
      new THREE.Vector3(0, -this.offset.y, z - this.zLength - 14)
    );
    model.scene.position.copy(this.offset);

    this.container.add(model.scene);

    this.emit("door-comeout");

    // 门的动画分成2个部分：合成门、开门。前者播放完后我们要先暂停它
    const animations = new kokomi.AnimationManager(
      this.base,
      model.animations,
      model.scene
    );
    this.animations = animations;
    for (const action of Object.values(this.animations.actions)) {
      action.setLoop(THREE.LoopOnce, 1);
      action.play();
    }
    await kokomi.sleep(1458);
    for (const action of Object.values(this.animations.actions)) {
      action.paused = true;
    }
    this.emit("door-created");
    this.createWhitePlane();
  }
  // 开门
  async openDoor() {
    for (const action of Object.values(this.animations.actions)) {
      action.paused = false;
    }
    await kokomi.sleep(300);
    for (const action of Object.values(this.animations.actions)) {
      action.paused = true;
    }
  }
  // 创建白色平面（就是门缝里的白光）
  createWhitePlane() {
    const model = this.base.am.items["WHITE_PLANE"] as STDLIB.GLTF;
    model.scene.scale.setScalar(0.1);
    model.scene.position.copy(this.offset);
    // @ts-ignore
    model.scene.traverse((obj: THREE.Mesh) => {
      if (obj.isMesh) {
        const material = obj.material as THREE.MeshStandardMaterial;
        material.color = new THREE.Color("#ffffff").multiplyScalar(3);
        obj.frustumCulled = false;
      }
    });

    this.container.add(model.scene);
  }
}
