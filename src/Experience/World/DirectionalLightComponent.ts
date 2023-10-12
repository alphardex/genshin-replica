import * as kokomi from "kokomi.js";
import * as THREE from "three";

import type Experience from "../Experience";

export default class DirectionalLightComponent extends kokomi.Component {
  declare base: Experience;
  params;
  dirLight: THREE.DirectionalLight;
  target: THREE.Object3D;
  originPos: THREE.Vector3;
  constructor(base: Experience) {
    super(base);

    this.params = {
      color: 0xff6222,
      intensity: 35,
    };

    const dirLight = new THREE.DirectionalLight(
      this.params.color,
      this.params.intensity
    );
    this.dirLight = dirLight;
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.top = 400;
    dirLight.shadow.camera.bottom = -100;
    dirLight.shadow.camera.left = -100;
    dirLight.shadow.camera.right = 400;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 50000;
    dirLight.shadow.bias = -0.00005;

    const target = new THREE.Object3D();
    this.target = target;
    dirLight.target = target;

    const originPos = new THREE.Vector3(10000, 0, 6000);
    originPos.y = Math.hypot(originPos.x, originPos.z) / 1.35;
    this.originPos = originPos;

    this.createDebug();
  }
  addExisting(): void {
    this.container.add(this.dirLight);
    this.container.add(this.target);
  }
  update(): void {
    // 太阳光要跟随相机的视角
    this.dirLight.position.copy(
      this.base.camera.position.clone().add(this.originPos)
    );
    this.dirLight.target.position.copy(this.base.camera.position);
  }
  createDebug() {
    const debug = this.base.debug;
    const params = this.params;

    if (debug.active) {
      const debugFolder = debug.ui!.addFolder("directionalLight");
      debugFolder.addColor(params, "color").onChange((val: number) => {
        this.dirLight.color.set(val);
      });
      debugFolder
        .add(params, "intensity")
        .min(0)
        .max(50)
        .onChange((val: number) => {
          this.dirLight.intensity = val;
        });
    }
  }
}
