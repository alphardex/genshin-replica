void mainImage(out vec4 fragColor,in vec2 fragCoord){
    vec2 uv=fragCoord/iResolution.xy;
    float mask1=1.;
    mask1*=smoothstep(0.,.5,uv.y);
    mask1*=smoothstep(0.,.1,uv.x);
    mask1*=smoothstep(1.,.9,uv.x);
    fragColor=vec4(vec3(mask1),1.);
}