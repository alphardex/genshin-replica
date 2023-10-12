import * as kokomi from "kokomi.js";
import * as THREE from "three";
import * as POSTPROCESSING from "postprocessing";
import gsap from "gsap";

import type Experience from "./Experience";

import BloomTranstionEffect from "./Effects/BloomTranstionEffect";

export default class Postprocessing extends kokomi.Component {
  declare base: Experience;
  params;
  bt: BloomTranstionEffect;
  constructor(base: Experience) {
    super(base);

    this.params = {
      bloomTransitionIntensity: 0,
      bloomTransitionWhiteAlpha: 0,
    };

    const composer = new POSTPROCESSING.EffectComposer(this.base.renderer, {
      frameBufferType: THREE.HalfFloatType,
    });
    // @ts-ignore
    this.base.composer = composer;

    composer.addPass(
      new POSTPROCESSING.RenderPass(this.base.scene, this.base.camera)
    );

    const bt = new BloomTranstionEffect({
      intensity: this.params.bloomTransitionIntensity,
      whiteAlpha: this.params.bloomTransitionWhiteAlpha,
    });
    this.bt = bt;

    const customEffectPass = new POSTPROCESSING.EffectPass(
      this.base.camera,
      bt
    );
    composer.addPass(customEffectPass);

    const fxaa = new POSTPROCESSING.FXAAEffect();

    const bloom = new POSTPROCESSING.BloomEffect({
      blendFunction: POSTPROCESSING.BlendFunction.ADD,
      mipmapBlur: true,
      luminanceThreshold: 2,
      intensity: 0.6,
    });

    const tonemapping = new POSTPROCESSING.ToneMappingEffect({
      mode: POSTPROCESSING.ToneMappingMode.ACES_FILMIC,
    });

    const effectPass = new POSTPROCESSING.EffectPass(
      this.base.camera,
      fxaa,
      bloom,
      tonemapping
    );
    composer.addPass(effectPass);

    this.createDebug();
  }
  createDebug() {
    const debug = this.base.debug;
    const params = this.params;

    if (debug.active) {
      const debugFolder = debug.ui!.addFolder("bloomTransition");
      debugFolder
        .add(params, "bloomTransitionIntensity")
        .min(0)
        .max(5)
        .name("intensity")
        .onChange((val: number) => {
          const intensity = this.bt.uniforms.get("uIntensity")!;
          intensity.value = val;
        });
      debugFolder
        .add(params, "bloomTransitionWhiteAlpha")
        .min(0)
        .max(1)
        .name("whiteAlpha")
        .onChange((val: number) => {
          const whiteAlpha = this.bt.uniforms.get("uWhiteAlpha")!;
          whiteAlpha.value = val;
        });
    }
  }
  // 画面闪成白色
  bloomTransitionIn() {
    const intensity = this.bt.uniforms.get("uIntensity")!;
    const whiteAlpha = this.bt.uniforms.get("uWhiteAlpha")!;
    gsap.to(intensity, {
      value: 3,
      duration: 0.84,
      ease: "power2.in",
    });
    gsap.to(whiteAlpha, {
      value: 1,
      duration: 0.2,
      delay: 0.5,
    });
  }
}
