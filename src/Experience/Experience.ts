import * as kokomi from "kokomi.js";
import * as THREE from "three";

import World from "./World/World";

import Debug from "./Debug";

import Postprocessing from "./Postprocessing";

import { resources } from "./resources";

export default class Experience extends kokomi.Base {
  world: World;
  debug: Debug;
  post: Postprocessing;
  am: kokomi.AssetManager;
  constructor(sel = "#sketch") {
    super(sel, {
      autoAdaptMobile: true,
    });

    (window as any).experience = this;

    this.debug = new Debug();

    kokomi.enableShadow(this.renderer);

    // 新版three.js的颜色、光照与旧版不兼容，要手动调整
    THREE.ColorManagement.enabled = false;
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.renderer.useLegacyLights = true;

    this.am = new kokomi.AssetManager(this, resources, {
      useDracoLoader: true,
    });

    // this.camera.position.set(0, 0, 1);
    this.camera.position.set(0, 0, 0);
    const camera = this.camera as THREE.PerspectiveCamera;
    camera.fov = 45;
    camera.near = 50;
    camera.far = 100000;
    camera.rotation.x = THREE.MathUtils.degToRad(5.5);
    camera.updateProjectionMatrix();

    // new kokomi.OrbitControls(this);

    this.world = new World(this);

    this.post = new Postprocessing(this);

    this.world.on("bloom-in", () => {
      this.post.bloomTransitionIn();
    });
  }
}
