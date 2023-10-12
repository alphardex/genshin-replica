import * as POSTPROCESSING from "postprocessing";
import * as THREE from "three";

import bloomTransitionFragmentShader from "../Shaders/BloomTransition/frag.glsl";

export default class BloomTranstionEffect extends POSTPROCESSING.Effect {
  constructor({ intensity = 0, whiteAlpha = 0 } = {}) {
    super("BloomTranstionEffect", bloomTransitionFragmentShader, {
      uniforms: new Map([
        ["uIntensity", new THREE.Uniform(intensity)],
        ["uWhiteAlpha", new THREE.Uniform(whiteAlpha)],
      ]),
    });
  }
}
