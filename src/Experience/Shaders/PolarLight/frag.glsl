uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

varying vec2 vUv;

uniform sampler2D uTexture;

varying vec3 vWorldPosition;

void main(){
    vec2 uv=vUv;
    
    // float mask=texture(uTexture,uv).r;
    float mask=1.5*texture(uTexture,uv+vec2(iTime*.015,0.)).r;
    mask+=texture(uTexture,uv*vec2(.4,1.)+vec2(iTime*-.0075,0.)).r;
    
    vec3 col=vec3(1.8);
    
    float alpha=mask;
    
    // 虚化光的一部分
    float mask1=1.;
    mask1*=smoothstep(0.,.5,uv.y);
    mask1*=smoothstep(0.,.1,uv.x);
    mask1*=smoothstep(1.,.9,uv.x);
    alpha*=mask1;
    
    // 与相机距离越近，透明度越小
    float distanceToCamera=distance(cameraPosition,vWorldPosition);
    alpha*=smoothstep(200.,1000.,distanceToCamera);
    
    gl_FragColor=vec4(col,alpha);
}