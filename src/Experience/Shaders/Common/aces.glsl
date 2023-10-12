// ACES是一种广泛用于电影、电视和广告制作的颜色管理系统

vec3 rrt_odt_fit(vec3 v)
{
    vec3 a=v*(v+.0245786)-.000090537;
    vec3 b=v*(.983729*v+.4329510)+.238081;
    return a/b;
}

vec3 inv_rrt_odt_fit(vec3 v)
{
    vec3 a=-(sqrt(10.)*sqrt((-187248350.*pow(v,vec3(2.)))+232585567.*v+241290.)+21650.*v-1230.);
    vec3 b=(98370.*v-100000.);
    return a/b;
}

mat3 mat3_from_rows(vec3 c0,vec3 c1,vec3 c2)
{
    mat3 m=mat3(c0,c1,c2);
    m=transpose(m);
    
    return m;
}

vec3 mul(mat3 m,vec3 v)
{
    return m*v;
}

mat3 mul(mat3 m1,mat3 m2)
{
    return m1*m2;
}

// 转成ACES
vec3 aces_fitted(vec3 color)
{
    mat3 ACES_INPUT_MAT=mat3_from_rows(
        vec3(.59719,.35458,.04823),
        vec3(.07600,.90834,.01566),
        vec3(.02840,.13383,.83777));
        
        mat3 ACES_OUTPUT_MAT=mat3_from_rows(
            vec3(1.60475,-.53108,-.07367),
            vec3(-.10208,1.10813,-.00605),
            vec3(-.00327,-.07276,1.07602));
            
            color=mul(ACES_INPUT_MAT,color);
            
            // Apply RRT and ODT
            color=rrt_odt_fit(color);
            
            color=mul(ACES_OUTPUT_MAT,color);
            
            return color;
        }
        
        // 反向的ACES
        vec3 ACES_Inv(vec3 color)
        {
            mat3 ACES_INPUT_MAT=mat3_from_rows(
                vec3(1.76474,-.67577,-.08896),
                vec3(-.14702,1.16025,-.01322),
                vec3(-.03633,-.16243,1.19877));
                
                mat3 ACES_OUTPUT_MAT=mat3_from_rows(
                    vec3(.64304,.31119,.04578),
                    vec3(.05926,.93144,.00929),
                    vec3(.00596,.06393,.93012));
                    
                    color=mul(ACES_OUTPUT_MAT,color);
                    
                    // Apply RRT and ODT
                    color=inv_rrt_odt_fit(color);
                    
                    color=mul(ACES_INPUT_MAT,color);
                    
                    return color;
                }
                