import * as THREE from "three";

import lights_fragment_beginToon from "../Experience/Shaders/Common/lights_fragment_beginToon.glsl";
import ACES_fog_fragment from "../Experience/Shaders/Common/ACES_fog_fragment.glsl";
import RE_Direct_ToonPhysical from "../Experience/Shaders/Common/RE_Direct_ToonPhysical.glsl";
import RE_Direct_ToonPhysical_Road from "../Experience/Shaders/Common/RE_Direct_ToonPhysical_Road.glsl";

const getToonMaterialColumn = (material: THREE.MeshStandardMaterial) => {
  material.metalness = 0.3;
  material.onBeforeCompile = (shader) => {
    let fragment = shader.fragmentShader;
    fragment = fragment.replace(
      "#include <lights_physical_pars_fragment>",
      `
            #include <lights_physical_pars_fragment>
            ${RE_Direct_ToonPhysical}
            `
    );
    fragment = fragment.replace(
      "#include <lights_fragment_begin>",
      `
            ${lights_fragment_beginToon}
            `
    );
    fragment = fragment.replace(
      "#include <fog_fragment>",
      `
            ${ACES_fog_fragment}
            `
    );
    shader.fragmentShader = fragment;
  };
  return material;
};

const getToonMaterialRoad = (
  material: THREE.MeshStandardMaterial,
  renderer: THREE.WebGLRenderer
) => {
  material.color.multiply(
    new THREE.Color("#fffcfe").add(new THREE.Color().setRGB(0.015, 0, 0))
  );
  material.normalMap!.minFilter = THREE.LinearMipmapLinearFilter;
  material.normalMap!.anisotropy = renderer.capabilities.getMaxAnisotropy() / 2;
  material.roughnessMap!.anisotropy =
    renderer.capabilities.getMaxAnisotropy() / 2;
  material.map!.anisotropy = renderer.capabilities.getMaxAnisotropy() / 2;
  material.roughness = 5;
  material.metalness = 0;
  material.onBeforeCompile = (shader) => {
    let fragment = shader.fragmentShader;
    fragment = fragment.replace(
      "#include <lights_physical_pars_fragment>",
      `
          #include <lights_physical_pars_fragment>
          ${RE_Direct_ToonPhysical_Road}
          `
    );
    fragment = fragment.replace(
      "#include <lights_fragment_begin>",
      `
          ${lights_fragment_beginToon}
          `
    );
    shader.fragmentShader = fragment;
  };
  return material;
};

const getToonMaterialDoor = (material: THREE.MeshStandardMaterial) => {
  material.metalness = 0.15;
  material.color = new THREE.Color("#454545");
  material.onBeforeCompile = (shader) => {
    let fragment = shader.fragmentShader;
    fragment = fragment.replace(
      "#include <lights_physical_pars_fragment>",
      `
          #include <lights_physical_pars_fragment>
          ${RE_Direct_ToonPhysical_Road}
          `
    );
    fragment = fragment.replace(
      "#include <lights_fragment_begin>",
      `
          ${lights_fragment_beginToon}
          `
    );
    shader.fragmentShader = fragment;
  };
  return material;
};

export { getToonMaterialColumn, getToonMaterialRoad, getToonMaterialDoor };
