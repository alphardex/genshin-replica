#include "/node_modules/lygia/generative/random.glsl"

uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

varying vec2 vUv;

uniform float uPointSize;
uniform float uPixelRatio;

attribute vec3 aRandom;

varying vec3 vWorldPosition;
varying vec3 vRandom;

// 随机化粒子位置
vec3 distort(vec3 p){
    float seed=random(aRandom);
    float strength=500.;
    float t=sin(iTime*(.1*seed));
    p.x+=(seed-.5)*2.*strength;
    p.y+=(seed-.8)*2.*strength;
    p.z+=((seed-.5)*2.*t+seed)*strength;
    return p;
}

void main(){
    vec3 p=position;
    p=distort(p);
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
    
    gl_PointSize=uPointSize*uPixelRatio;
    vec4 mvPosition=modelViewMatrix*vec4(p,1.);
    gl_PointSize*=(1./-mvPosition.z);
    
    vUv=uv;
    vWorldPosition=vec3(modelMatrix*vec4(p,1));
    vRandom=aRandom;
}