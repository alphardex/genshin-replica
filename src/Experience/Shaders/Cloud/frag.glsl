#include "../Common/aces.glsl"

uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

varying vec2 vUv;

uniform sampler2D uTexture;

varying vec3 vWorldPosition;
varying vec3 vInstPosition;

uniform vec3 uColor1;
uniform vec3 uColor2;

void main(){
    vec2 uv=vUv;
    
    vec4 tex=texture(uTexture,uv);
    
    vec3 col=uColor1;
    col=mix(col,uColor2,pow(tex.r,.6));
    
    float alpha=tex.a;
    
    col=ACES_Inv(col);
    
    gl_FragColor=vec4(col,alpha);
}