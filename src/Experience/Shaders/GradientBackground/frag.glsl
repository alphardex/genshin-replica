uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uStop1;
uniform float uStop2;

#include "../Common/aces.glsl"

void mainImage(out vec4 fragColor,in vec2 fragCoord){
    vec2 uv=fragCoord/iResolution.xy;
    // vec3 col1=vec3(1.,0.,0.);
    // vec3 col2=vec3(0.,1.,0.);
    // vec3 col3=vec3(0.,0.,1.);
    // vec3 col1=vec3(0.,.110,.329);
    // vec3 col2=vec3(.008,.247,.631);
    // vec3 col3=vec3(.149,.659,1.);
    vec3 col1=uColor1;
    vec3 col2=uColor2;
    vec3 col3=uColor3;
    vec3 col=vec3(0.);
    // float stop1=.2;
    // float stop2=.6;
    float stop1=uStop1;
    float stop2=uStop2;
    float y=1.-uv.y;
    float mask1=1.-smoothstep(0.,stop1,y);
    float mask2=smoothstep(0.,stop1,y)*(1.-smoothstep(stop1,stop2,y));
    float mask3=smoothstep(stop1,stop2,y);
    col+=col1*mask1;
    col+=col2*mask2;
    col+=col3*mask3;
    col=ACES_Inv(col);
    fragColor=vec4(col,1.);
}