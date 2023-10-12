import * as kokomi from "kokomi.js";
import * as THREE from "three";

import type Experience from "../Experience";

export default class AmbientLightComponent extends kokomi.Component {
  declare base: Experience;
  params;
  ambiLight: THREE.AmbientLight;
  constructor(base: Experience) {
    super(base);

    this.params = {
      color: 0x0f6eff,
      intensity: 6,
    };

    this.ambiLight = new THREE.AmbientLight(
      this.params.color,
      this.params.intensity
    );

    this.createDebug();
  }
  addExisting(): void {
    this.container.add(this.ambiLight);
  }
  createDebug() {
    const debug = this.base.debug;
    const params = this.params;

    if (debug.active) {
      const debugFolder = debug.ui!.addFolder("ambientLight");
      debugFolder.addColor(params, "color").onChange((val: number) => {
        this.ambiLight.color.set(val);
      });
      debugFolder
        .add(params, "intensity")
        .min(0)
        .max(10)
        .onChange((val: number) => {
          this.ambiLight.intensity = val;
        });
    }
  }
}
