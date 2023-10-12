#include "/node_modules/lygia/generative/cnoise.glsl"
#include "/node_modules/lygia/math/saturate.glsl"

uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

varying vec2 vUv;

varying vec3 vWorldPosition;

// 噪声模拟雾
float getNoise(vec3 p){
    float noise=0.;
    
    noise=saturate(cnoise(p*vec3(.012,.012,0.)+vec3(iTime*.25))+.2);
    noise+=saturate(cnoise(p*vec3(.004,.004,0.)-vec3(iTime*.15))+.1);
    
    noise=saturate(noise);
    
    noise*=(1.-smoothstep(-5.,45.,p.y));
    noise*=(smoothstep(-200.,-35.,p.y));
    
    noise*=(smoothstep(0.,40.,p.x)+(1.-smoothstep(-40.,-0.,p.x)));
    
    return noise;
}

void main(){
    vec2 uv=vUv;
    
    vec3 col=vec3(3.);
    
    float alpha=getNoise(vWorldPosition);
    alpha*=.3;
    
    gl_FragColor=vec4(col,alpha);
}