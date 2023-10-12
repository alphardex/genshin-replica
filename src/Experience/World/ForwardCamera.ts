import * as kokomi from "kokomi.js";
import * as THREE from "three";
import gsap from "gsap";

import type Experience from "../Experience";

export default class ForwardCamera extends kokomi.Component {
  declare base: Experience;
  params;
  center: THREE.Vector3;
  t1: ReturnType<typeof gsap.timeline>;
  constructor(base: Experience) {
    super(base);

    this.params = {
      speed: 88,
      isRunning: true,
    };

    this.center = new THREE.Vector3(0, 0, 0);

    this.t1 = gsap.timeline();

    this.createDebug();
  }
  update(): void {
    if (this.params.isRunning) {
      const delta = this.base.clock.deltaTime;
      this.center.add(
        new THREE.Vector3(0, 0, -this.params.speed).multiplyScalar(delta)
      );
      this.base.camera.position.copy(this.center);
    }
  }
  createDebug() {
    const debug = this.base.debug;
    const params = this.params;

    if (debug.active) {
      const debugFolder = debug.ui!.addFolder("forwardCamera");
      debugFolder.add(params, "speed").min(-500).max(500);
      debugFolder.add(params, "isRunning");
    }
  }
  // 停止运动
  stop() {
    this.params.isRunning = false;
    const originPos = this.base.camera.position.clone();
    this.t1.to(this.base.camera.position, {
      x: originPos.x,
      y: originPos.y,
      z: originPos.z - 165,
      duration: 5,
      ease: "power2.out",
    });
  }
  // 冲进去
  diveIn() {
    const originPos = this.base.camera.position.clone();
    this.t1.clear();
    this.t1.to(this.base.camera.position, {
      x: originPos.x,
      y: originPos.y,
      z: originPos.z - 400,
      duration: 0.6,
      ease: "power2.in",
    });
  }
}
