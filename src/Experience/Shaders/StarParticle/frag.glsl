#include "/node_modules/lygia/generative/random.glsl"

uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

varying vec2 vUv;

uniform sampler2D uTexture;

varying vec3 vWorldPosition;
varying vec3 vRandom;

void main(){
    vec2 uv=gl_PointCoord;
    
    // 粒子的图片随机化
    float seed=random(vRandom);
    float randId=floor(seed*3.)/3.;
    float mask=texture(uTexture,vec2(uv.x/3.+randId,uv.y)).r;
    
    vec3 col=vRandom;
    col+=.5;
    
    float alpha=mask;
    
    // 一闪一闪
    alpha*=smoothstep(0.,.2,sin(iTime*(1.2*seed+.4)+seed)-.8);
    
    gl_FragColor=vec4(col,alpha);
}