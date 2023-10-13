#include "./aces.glsl"

void RE_Direct_Physical(const in IncidentLight directLight,const in vec3 geometryPosition,const in vec3 geometryNormal,const in vec3 geometryViewDir,const in vec3 geometryClearcoatNormal,const in PhysicalMaterial material,inout ReflectedLight reflectedLight){
    float dotNL=saturate(dot(geometryNormal,directLight.direction));
    vec3 irradiance=dotNL*directLight.color;
    #ifdef USE_CLEARCOAT
    float dotNLcc=saturate(dot(geometryClearcoatNormal,directLight.direction));
    vec3 ccIrradiance=dotNLcc*directLight.color;
    clearcoatSpecular+=ccIrradiance*BRDF_GGX_Clearcoat(directLight.direction,geometryViewDir,geometryClearcoatNormal,material);
    #endif
    #ifdef USE_SHEEN
    sheenSpecular+=irradiance*BRDF_Sheen(directLight.direction,geometryViewDir,geometryNormal,material.sheenColor,material.sheenRoughness);
    #endif
    reflectedLight.directSpecular+=irradiance*BRDF_GGX(directLight.direction,geometryViewDir,geometryNormal,material);
    reflectedLight.directDiffuse+=irradiance*BRDF_Lambert(material.diffuseColor);
}