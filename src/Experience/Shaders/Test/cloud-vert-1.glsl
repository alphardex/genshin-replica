#iChannel0"https://s2.loli.net/2023/09/10/QozT59R6KsYmb3q.jpg"

float random(vec2 uv)
{
    return fract(sin(dot(uv,vec2(12.9898,78.233)))*43758.5453);
}

vec2 distortUV(vec2 uv,vec2 offset){
    vec2 wh=vec2(2.,4.);
    uv/=wh;
    float rn=ceil(random(offset)*wh.x*wh.y);
    vec2 cell=vec2(1.,1.)/wh;
    uv+=vec2(cell.x*mod(rn,wh.x),cell.y*(ceil(rn/wh.x)-1.));
    return uv;
}

void mainImage(out vec4 fragColor,in vec2 fragCoord){
    vec2 uv=fragCoord/iResolution.xy;
    uv=distortUV(uv,uv);
    vec3 tex=texture(iChannel0,uv).xyz;
    fragColor=vec4(tex,1.);
}
