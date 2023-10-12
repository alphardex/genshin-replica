#include "../Common/aces.glsl"

uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

varying vec2 vUv;

uniform sampler2D uTexture;

varying vec3 vWorldPosition;

void main(){
    vec2 uv=vUv;
    
    vec4 tex=texture(uTexture,uv);
    
    vec3 col=vec3(.090,.569,.980);
    col=mix(col,vec3(.93),vec3(pow(tex.r,.4)));
    
    float alpha=tex.a;
    
    col=ACES_Inv(col);
    
    gl_FragColor=vec4(col,alpha);
}