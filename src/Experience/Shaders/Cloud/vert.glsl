#include "/node_modules/lygia/generative/random.glsl"

uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

varying vec2 vUv;

varying vec3 vWorldPosition;

// 通过扭曲UV来随机化
vec2 distortUV(vec2 uv,vec2 offset){
    vec2 wh=vec2(2.,4.);
    uv/=wh;
    float rn=ceil(random(offset)*wh.x*wh.y);
    vec2 cell=vec2(1.,1.)/wh;
    uv+=vec2(cell.x*mod(rn,wh.x),cell.y*(ceil(rn/wh.x)-1.));
    return uv;
}

void main(){
    vec3 p=position;
    
    #ifdef USE_INSTANCING
    p=vec3(instanceMatrix*vec4(p,1.));
    
    vec3 instPosition=vec3(instanceMatrix*vec4(vec3(0.),1.));
    #endif
    
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
    
    vUv=distortUV(uv,instPosition.xy);
    vWorldPosition=vec3(modelMatrix*vec4(p,1));
}