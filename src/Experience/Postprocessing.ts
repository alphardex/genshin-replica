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
  dof: POSTPROCESSING.DepthOfFieldEffect;
  constructor(base: Experience) {
    super(base);

    this.params = {
      bloomTransitionIntensity: 0,
      bloomTransitionWhiteAlpha: 0,
      dofBokehScale: 1,
      dofFocusDistance: 0,
      dofFocalLength: 0.05,
    };

    const composer = new POSTPROCESSING.EffectComposer(this.base.renderer, {
      frameBufferType: THREE.HalfFloatType,
      multisampling: 8,
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

    const bloom = new POSTPROCESSING.BloomEffect({
      blendFunction: POSTPROCESSING.BlendFunction.ADD,
      mipmapBlur: true,
      luminanceThreshold: 2,
      intensity: 0.6,
    });

    const dof = new POSTPROCESSING.DepthOfFieldEffect(this.base.camera, {
      bokehScale: this.params.dofBokehScale,
      focusDistance: this.params.dofFocusDistance,
      focalLength: this.params.dofFocalLength,
    });
    this.dof = dof;

    const tonemapping = new POSTPROCESSING.ToneMappingEffect({
      mode: POSTPROCESSING.ToneMappingMode.ACES_FILMIC,
    });

    const effectPass = new POSTPROCESSING.EffectPass(
      this.base.camera,
      bloom,
      dof,
      tonemapping
    );
    composer.addPass(effectPass);

    this.createDebug();
  }
  createDebug() {
    const debug = this.base.debug;
    const params = this.params;

    if (debug.active) {
      const debugFolderBt = debug.ui!.addFolder("bloomTransition");
      debugFolderBt
        .add(params, "bloomTransitionIntensity")
        .min(0)
        .max(5)
        .name("intensity")
        .onChange((val: number) => {
          const intensity = this.bt.uniforms.get("uIntensity")!;
          intensity.value = val;
        });
      debugFolderBt
        .add(params, "bloomTransitionWhiteAlpha")
        .min(0)
        .max(1)
        .name("whiteAlpha")
        .onChange((val: number) => {
          const whiteAlpha = this.bt.uniforms.get("uWhiteAlpha")!;
          whiteAlpha.value = val;
        });

      const debugFolderDof = debug.ui!.addFolder("depthOfField");
      debugFolderDof
        .add(params, "dofBokehScale")
        .min(0)
        .max(5)
        .step(0.001)
        .name("bokehScale")
        .onChange((val: number) => {
          this.dof.bokehScale = val;
        });
      debugFolderDof
        .add(params, "dofFocusDistance")
        .min(0)
        .max(1)
        .step(0.001)
        .name("focusDistance")
        .onChange((val: number) => {
          this.dof.cocMaterial.uniforms.focusDistance.value = val;
        });
      debugFolderDof
        .add(params, "dofFocalLength")
        .min(0)
        .max(1)
        .step(0.001)
        .name("focalLength")
        .onChange((val: number) => {
          this.dof.cocMaterial.uniforms.focalLength.value = val;
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
  // 后方变模糊
  blurBehind() {
    gsap.to(this.dof, {
      bokehScale: 3.6,
      duration: 0.8,
      ease: "power2.out",
    });
  }
}
