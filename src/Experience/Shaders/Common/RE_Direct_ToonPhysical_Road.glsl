#include "./aces.glsl"

void RE_Direct_ToonPhysical(const in IncidentLight directLight,const in vec3 geometryPosition,const in vec3 geometryNormal,const in vec3 geometryViewDir,const in vec3 geometryClearcoatNormal,const in PhysicalMaterial material,inout ReflectedLight reflectedLight,const in float metalnessFactor){
    float dotNL_noSaturate=dot(geometryNormal,directLight.direction);
    float dotNL=saturate(dotNL_noSaturate);
    // toon光照的普遍算法：将原光照的值阶梯化
    float dotNL_toon=smoothstep(.25,.27,dotNL)*pow(dotNL,.5)*1.4;
    dotNL_toon+=smoothstep(.75,.8,dotNL)*pow(dotNL,1.);
    vec3 irradiance=dotNL_toon*directLight.color;
    #ifdef USE_CLEARCOAT
    float dotNLcc=saturate(dot(geometryClearcoatNormal,directLight.direction));
    vec3 ccIrradiance=dotNLcc*directLight.color;
    clearcoatSpecular+=ccIrradiance*BRDF_GGX_Clearcoat(directLight.direction,geometryViewDir,geometryClearcoatNormal,material);
    #endif
    #ifdef USE_SHEEN
    sheenSpecular+=irradiance*BRDF_Sheen(directLight.direction,geometryViewDir,geometryNormal,material.sheenColor,material.sheenRoughness);
    #endif
    
    // 优化粗糙度
    float new_roughness=(1.-metalnessFactor)*pow(material.roughness,.4);
    new_roughness+=metalnessFactor*pow(material.roughness,1.2);
    PhysicalMaterial new_material=material;
    new_material.roughness=new_roughness;
    
    reflectedLight.directSpecular+=irradiance*BRDF_GGX(directLight.direction,geometryViewDir,geometryNormal,new_material);
    reflectedLight.directDiffuse+=irradiance*BRDF_Lambert(new_material.diffuseColor);
}