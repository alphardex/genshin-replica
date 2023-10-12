#include "./aces.glsl"

void RE_Direct_ToonPhysical(const in IncidentLight directLight,const in GeometricContext geometry,const in PhysicalMaterial material,const in float metalnessFactor,inout ReflectedLight reflectedLight){
    float dotNL_noSaturate=dot(geometry.normal,directLight.direction);
    float dotNL=saturate(dotNL_noSaturate);
    // toon光照的普遍算法：将原光照的值阶梯化
    float dotNL_toon=smoothstep(.25,.27,dotNL);
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
    float new_roughness=(1.-step(.01,metalnessFactor))*pow(material.roughness,.4);
    new_roughness+=step(.01,metalnessFactor)*pow(material.roughness,1.4);
    // reflectedLight.directSpecular+=irradiance*BRDF_GGX(directLight.direction,geometry.viewDir,geometry.normal,material.specularColor,material.specularF90,new_roughness);
    PhysicalMaterial new_material=material;
    new_material.roughness=new_roughness;
    reflectedLight.directSpecular+=irradiance*BRDF_GGX(directLight.direction,geometry.viewDir,geometry.normal,new_material);
    // #endif
    // reflectedLight.directSpecular*=13.;
    reflectedLight.directDiffuse+=irradiance*BRDF_Lambert(new_material.diffuseColor);
    
    // 计算近似的菲涅尔反射（外发光）
    float dotNL_reflect_faker=1.-smoothstep(0.,.3,dotNL_noSaturate);
    float fresnelTerm=dot(geometry.viewDir,geometry.normal);
    fresnelTerm=saturate(1.-fresnelTerm)*dotNL_reflect_faker;
    vec3 fresnelCol=vec3(.333,.902,3.418);
    reflectedLight.directDiffuse+=fresnelCol*pow(fresnelTerm,4.5)*.8;
}