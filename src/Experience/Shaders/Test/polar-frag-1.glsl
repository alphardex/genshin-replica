#iChannel0"https://s2.loli.net/2023/09/10/QozT59R6KsYmb3q.jpg"

void mainImage(out vec4 fragColor,in vec2 fragCoord){
    vec2 uv=fragCoord/iResolution.xy;
    vec3 tex=1.5*texture(iChannel0,uv+vec2(iTime*.015,0.)).xyz;
    tex+=texture(iChannel0,uv*vec2(.4,1.)+vec2(iTime*-.0075,0.)).xyz;
    fragColor=vec4(tex,1.);
}
