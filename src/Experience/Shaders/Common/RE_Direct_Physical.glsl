#include "./aces.glsl"

void RE_Direct_Physical(const in IncidentLight directLight,const in GeometricContext geometry,const in PhysicalMaterial material,inout ReflectedLight reflectedLight){
    float dotNL=saturate(dot(geometry.normal,directLight.direction));
    vec3 irradiance=dotNL*directLight.color;
    #ifdef USE_CLEARCOAT
    float dotNLcc=saturate(dot(geometry.clearcoatNormal,directLight.direction));
    vec3 ccIrradiance=dotNLcc*directLight.color;
    clearcoatSpecular+=ccIrradiance*BRDF_GGX(directLight.direction,geometry.viewDir,geometry.clearcoatNormal,material.clearcoatF0,material.clearcoatF90,material.clearcoatRoughness);
    #endif
    #ifdef USE_SHEEN
    sheenSpecular+=irradiance*BRDF_Sheen(directLight.direction,geometry.viewDir,geometry.normal,material.sheenColor,material.sheenRoughness);
    #endif
    #ifdef USE_IRIDESCENCE
    reflectedLight.directSpecular+=irradiance*BRDF_GGX_Iridescence(directLight.direction,geometry.viewDir,geometry.normal,material.specularColor,material.specularF90,material.iridescence,material.iridescenceFresnel,material.roughness);
    #else
    reflectedLight.directSpecular+=irradiance*BRDF_GGX(directLight.direction,geometry.viewDir,geometry.normal,material.specularColor,material.specularF90,material.roughness);
    #endif
    reflectedLight.directDiffuse+=irradiance*BRDF_Lambert(material.diffuseColor);
}