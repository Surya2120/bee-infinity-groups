import{r as t,j as r}from"./index-CBTuLW6k.js";import{u as w,M as D,a as P,W as F,P as $,b as K,c as X,C as W,S as H,_ as q,d as J,e as N}from"./extends-XTFQRxow.js";const Q={uniforms:{tDiffuse:{value:null},h:{value:1/512}},vertexShader:`
      varying vec2 vUv;

      void main() {

        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

      }
  `,fragmentShader:`
    uniform sampler2D tDiffuse;
    uniform float h;

    varying vec2 vUv;

    void main() {

    	vec4 sum = vec4( 0.0 );

    	sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;
    	sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;

    	gl_FragColor = sum;

    }
  `},Y={uniforms:{tDiffuse:{value:null},v:{value:1/512}},vertexShader:`
    varying vec2 vUv;

    void main() {

      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,fragmentShader:`

  uniform sampler2D tDiffuse;
  uniform float v;

  varying vec2 vUv;

  void main() {

    vec4 sum = vec4( 0.0 );

    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;
    sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;

    gl_FragColor = sum;

  }
  `},ee=t.forwardRef(({children:e,enabled:a=!0,speed:i=1,rotationIntensity:n=1,floatIntensity:s=1,floatingRange:l=[-.1,.1],autoInvalidate:b=!1,...T},c)=>{const o=t.useRef(null);t.useImperativeHandle(c,()=>o.current,[]);const U=t.useRef(Math.random()*1e4);return w(M=>{var h,g;if(!a||i===0)return;b&&M.invalidate();const d=U.current+M.clock.elapsedTime;o.current.rotation.x=Math.cos(d/4*i)/8*n,o.current.rotation.y=Math.sin(d/4*i)/8*n,o.current.rotation.z=Math.sin(d/4*i)/20*n;let v=Math.sin(d/4*i)/10;v=D.mapLinear(v,-.1,.1,(h=l==null?void 0:l[0])!==null&&h!==void 0?h:-.1,(g=l==null?void 0:l[1])!==null&&g!==void 0?g:.1),o.current.position.y=v*s,o.current.updateMatrix()}),t.createElement("group",T,t.createElement("group",{ref:o,matrixAutoUpdate:!1},e))}),te=t.forwardRef(({scale:e=10,frames:a=1/0,opacity:i=1,width:n=1,height:s=1,blur:l=1,near:b=0,far:T=10,resolution:c=512,smooth:o=!0,color:U="#000000",depthWrite:M=!1,renderOrder:h,...g},d)=>{const v=t.useRef(null),f=P(u=>u.scene),m=P(u=>u.gl),y=t.useRef(null);n=n*(Array.isArray(e)?e[0]:e||1),s=s*(Array.isArray(e)?e[1]:e||1);const[S,Z,V,x,R,C,B]=t.useMemo(()=>{const u=new F(c,c),E=new F(c,c);E.texture.generateMipmaps=u.texture.generateMipmaps=!1;const A=new $(n,s).rotateX(Math.PI/2),O=new K(A),j=new X;j.depthTest=j.depthWrite=!1,j.onBeforeCompile=p=>{p.uniforms={...p.uniforms,ucolor:{value:new W(U)}},p.fragmentShader=p.fragmentShader.replace("void main() {",`uniform vec3 ucolor;
           void main() {
          `),p.fragmentShader=p.fragmentShader.replace("vec4( vec3( 1.0 - fragCoordZ ), opacity );","vec4( ucolor * fragCoordZ * 2.0, ( 1.0 - fragCoordZ ) * 1.0 );")};const G=new H(Q),L=new H(Y);return L.depthTest=G.depthTest=!1,[u,A,j,O,G,L,E]},[c,n,s,e,U]),I=u=>{x.visible=!0,x.material=R,R.uniforms.tDiffuse.value=S.texture,R.uniforms.h.value=u*1/256,m.setRenderTarget(B),m.render(x,y.current),x.material=C,C.uniforms.tDiffuse.value=B.texture,C.uniforms.v.value=u*1/256,m.setRenderTarget(S),m.render(x,y.current),x.visible=!1};let _=0,k,z;return w(()=>{y.current&&(a===1/0||_<a)&&(_++,k=f.background,z=f.overrideMaterial,v.current.visible=!1,f.background=null,f.overrideMaterial=V,m.setRenderTarget(S),m.render(f,y.current),I(l),o&&I(l*.4),m.setRenderTarget(null),v.current.visible=!0,f.overrideMaterial=z,f.background=k)}),t.useImperativeHandle(d,()=>v.current,[]),t.createElement("group",q({"rotation-x":Math.PI/2},g,{ref:v}),t.createElement("mesh",{renderOrder:h,geometry:Z,scale:[1,-1,1],rotation:[-Math.PI/2,0,0]},t.createElement("meshBasicMaterial",{transparent:!0,map:S.texture,opacity:i,depthWrite:M})),t.createElement("orthographicCamera",{ref:y,args:[-n/2,n/2,s/2,-s/2,b,T]}))});function re({scrollProgress:e}){const{camera:a,pointer:i}=P();return w(()=>{const n=e,s=D.lerp(8.2,5.6,n);a.position.x=D.lerp(a.position.x,i.x*.45,.06),a.position.y=D.lerp(a.position.y,1.35+i.y*.25,.06),a.position.z=D.lerp(a.position.z,s,.07),a.lookAt(0,1.05,0)}),null}function ae(){const e=t.useRef(null);w((i,n)=>{e.current&&(e.current.rotation.y+=n*.35)});const a=t.useMemo(()=>new N({color:new W("#0b0b0f"),metalness:.9,roughness:.25}),[]);return r.jsxs(ee,{floatIntensity:1.35,rotationIntensity:.9,speed:1.1,children:[r.jsx("mesh",{ref:e,position:[0,1.05,0],castShadow:!0,material:a,children:r.jsx("torusKnotGeometry",{args:[.62,.18,220,24]})}),r.jsxs("mesh",{position:[0,.9,0],rotation:[Math.PI/2,0,0],receiveShadow:!0,children:[r.jsx("ringGeometry",{args:[.8,1.22,96]}),r.jsx("meshStandardMaterial",{color:"#d4af37",metalness:1,roughness:.25,emissive:"#d4af37",emissiveIntensity:.2})]})]})}function se({scrollProgress:e}){return r.jsxs(J,{shadows:!0,dpr:[1,2],camera:{position:[0,1.35,8.2],fov:38},gl:{antialias:!0,alpha:!0},children:[r.jsx("color",{attach:"background",args:["#060608"]}),r.jsx("fog",{attach:"fog",args:["#060608",9,18]}),r.jsx("ambientLight",{intensity:.25}),r.jsx("directionalLight",{position:[4.5,6.5,2.5],intensity:1.2,castShadow:!0,"shadow-mapSize-width":2048,"shadow-mapSize-height":2048}),r.jsx("pointLight",{position:[-3,2.5,2],intensity:.8,color:"#d4af37"}),r.jsx("spotLight",{position:[0,6.5,-4],intensity:.75,angle:.35,penumbra:.5,color:"#ffffff"}),r.jsx(re,{scrollProgress:e}),r.jsx(ae,{}),r.jsx(te,{position:[0,0,0],opacity:.65,scale:14,blur:2.4,far:10})]})}export{se as default};
