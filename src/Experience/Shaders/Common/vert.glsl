uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

varying vec2 vUv;

varying vec3 vWorldPosition;

void main(){
    vec3 p=position;
    
    #ifdef USE_INSTANCING
    p=vec3(instanceMatrix*vec4(p,1.));
    #endif
    
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
    
    vUv=uv;
    vUv.y=1.-uv.y;
    vWorldPosition=vec3(modelMatrix*vec4(p,1));
}