#include "./aces.glsl"

void RE_Direct_ToonPhysical(const in IncidentLight directLight,const in GeometricContext geometry,const in PhysicalMaterial material,const in float metalnessFactor,inout ReflectedLight reflectedLight){
    float dotNL_noSaturate=dot(geometry.normal,directLight.direction);
    float dotNL=saturate(dotNL_noSaturate);
    // toon光照的普遍算法：将原光照的值阶梯化
    float dotNL_toon=smoothstep(.25,.27,dotNL)*pow(dotNL,.5)*1.4;
    dotNL_toon+=smoothstep(.75,.8,dotNL)*pow(dotNL,1.);
    vec3 irradiance=dotNL_toon*directLight.color;
    #ifdef USE_CLEARCOAT
    float dotNLcc=saturate(dot(geometry.clearcoatNormal,directLight.direction));
    vec3 ccIrradiance=dotNLcc*directLight.color;
    // clearcoatSpecular+=ccIrradiance*BRDF_GGX(directLight.direction,geometry.viewDir,geometry.clearcoatNormal,material.clearcoatF0,material.clearcoatF90,material.clearcoatRoughness);
    clearcoatSpecular+=ccIrradiance*BRDF_GGX_Clearcoat(directLight.direction,geometry.viewDir,geometry.clearcoatNormal,material);
    #endif
    #ifdef USE_SHEEN
    sheenSpecular+=irradiance*BRDF_Sheen(directLight.direction,geometry.viewDir,geometry.normal,material.sheenColor,material.sheenRoughness);
    #endif
    // #ifdef USE_IRIDESCENCE
    // reflectedLight.directSpecular+=irradiance*BRDF_GGX_Iridescence(directLight.direction,geometry.viewDir,geometry.normal,material.specularColor,material.specularF90,material.iridescence,material.iridescenceFresnel,material.roughness);
    // #else
    
    // 优化粗糙度
    float new_roughness=(1.-metalnessFactor)*pow(material.roughness,.4);
    new_roughness+=metalnessFactor*pow(material.roughness,1.2);
    // reflectedLight.directSpecular+=irradiance*BRDF_GGX(directLight.direction,geometry.viewDir,geometry.normal,material.specularColor,material.specularF90,new_roughness);
    PhysicalMaterial new_material=material;
    new_material.roughness=new_roughness;
    reflectedLight.directSpecular+=irradiance*BRDF_GGX(directLight.direction,geometry.viewDir,geometry.normal,new_material);
    // #endif
    reflectedLight.directDiffuse+=irradiance*BRDF_Lambert(new_material.diffuseColor);
}