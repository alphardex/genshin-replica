// https://ycw.github.io/three-shaderlib-skim/dist/#/0.150.0/basic/fragment
#ifdef USE_FOG
#ifdef FOG_EXP2
float fogFactor=1.-exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
#else
float fogFactor=smoothstep(fogNear,fogFar,vFogDepth);
#endif
vec3 linearFragCol=aces_fitted(gl_FragColor.rgb);
gl_FragColor.rgb=mix(linearFragCol,fogColor,fogFactor);
gl_FragColor.rgb=ACES_Inv(gl_FragColor.rgb);
#endif