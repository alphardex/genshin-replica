#include "/node_modules/lygia/color/space.glsl"
#include "/node_modules/lygia/math/saturate.glsl"
#include "../Common/aces.glsl"

#define iTime time
#define iResolution resolution
#define iChannel0 inputBuffer

uniform float uIntensity;
uniform float uWhiteAlpha;

void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor)
{
    vec4 diffuseBase=texture(iChannel0,uv);
    
    vec3 col=diffuseBase.rgb;
    
    vec3 linear=aces_fitted(col.rgb);
    // col=linear;
    
    vec3 hsv=rgb2hsv(linear);
    
    // hsv的v是明度，这里增加了画面的明度来产生炫白的效果
    hsv.z+=uIntensity;
    // col=hsv;
    
    vec3 rgb=hsv2rgb(hsv);
    col=rgb;
    col=mix(col,vec3(1.),uWhiteAlpha);
    col=saturate(col);
    col=ACES_Inv(col);
    
    float alpha=diffuseBase.a;
    
    outputColor=vec4(col,alpha);
}