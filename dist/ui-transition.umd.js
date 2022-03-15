var We=Object.defineProperty,Oe=Object.defineProperties;var Me=Object.getOwnPropertyDescriptors;var oe=Object.getOwnPropertySymbols;var De=Object.prototype.hasOwnProperty,Ue=Object.prototype.propertyIsEnumerable;var le=(u,d,h)=>d in u?We(u,d,{enumerable:!0,configurable:!0,writable:!0,value:h}):u[d]=h,$=(u,d)=>{for(var h in d||(d={}))De.call(d,h)&&le(u,h,d[h]);if(oe)for(var h of oe(d))Ue.call(d,h)&&le(u,h,d[h]);return u},U=(u,d)=>Oe(u,Me(d));(function(u,d){typeof exports=="object"&&typeof module!="undefined"?module.exports=d(require("vue")):typeof define=="function"&&define.amd?define(["vue"],d):(u=typeof globalThis!="undefined"?globalThis:u||self,u.UiTransition=d(u.Vue))})(this,function(u){"use strict";const d={init:!1,waapi:!1,webWorker:null,styleId:"",styleCreated:!1,keyframes:{}};let h=0;const j=async function({type:e,data:n}){h+=1e-4;const t=d.webWorker;if(!(t instanceof Worker))return Promise.reject("Invalid worker, Please report this issue");const a=h;return t.postMessage({name:"uit",uid:a,type:e,data:n||{}}),new Promise(r=>{const o=s=>{var c,f;((c=s.data)==null?void 0:c.uid)===a&&(t.removeEventListener("message",o,{passive:!0}),r({data:((f=s.data)==null?void 0:f.data)||null}))};t.addEventListener("message",o,{passive:!0})})},ue=async function(n,t){return(await j({type:"spring",data:{type:"getSpring",config:t,frame:n}})).data},y={css:!1,appear:!1,tag:void 0,enterFromClass:void 0,enterActiveClass:void 0,enterToClass:void 0,appearFromClass:void 0,appearActiveClass:void 0,appearToClass:void 0,leaveFromClass:void 0,leaveActiveClass:void 0,leaveToClass:void 0,config:"fade",delay:void 0,duration:void 0,ease:"linear",group:!1,mode:"out-in",spring:"wobbly",retainFinalStyle:!1},x={componentName:"UiTransition",globals:["sleep","getSpring"]};var ce={css:{type:Boolean,default:y.css},appear:{type:Boolean,default:y.appear},tag:{type:String,default:y.tag},enterFromClass:{type:String,default:y.enterFromClass},enterActiveClass:{type:String,default:y.enterActiveClass},enterToClass:{type:String,default:y.enterToClass},appearFromClass:{type:String,default:y.appearFromClass},appearActiveClass:{type:String,default:y.appearActiveClass},appearToClass:{type:String,default:y.appearToClass},leaveFromClass:{type:String,default:y.leaveFromClass},leaveActiveClass:{type:String,default:y.leaveActiveClass},leaveToClass:{type:String,default:y.leaveToClass},moveClass:{type:String,default:y.moveClass},config:{type:[String,Object],default:y.config},delay:{type:[Number,Object],default:y.delay},duration:{type:[Number,Object],default:y.duration},ease:{type:[String,Object],default:y.ease},group:{type:Boolean,default:y.group},mode:{type:String,default:y.mode},spring:{type:[String,Object],default:y.spring},retainFinalStyle:{type:Boolean,default:y.retainFinalStyle}};const fe=function({slots:e,data:n}){return u.h(u.TransitionGroup,n,{default:()=>{var t;return(t=e.default)==null?void 0:t.call(e)}})},pe=function({slots:e,data:n}){return u.h(u.Transition,n,{default:()=>{var t,i;return(i=(t=e.default)==null?void 0:t.call(e))==null?void 0:i[0]}})};var de=function(){self.__spreadValues=Object.assign,self.addEventListener("message",async e=>{const{data:n,data:{name:t,uid:i,type:a,data:r}}=e;try{if(t==="uit"){const o=s=>self.postMessage({uid:i,data:s});if(a==="sleep"){const{duration:s}=r;if(s){const c=setTimeout(()=>{clearTimeout(c)},s)}else await Promise.resolve();return o(s)}if(a==="addMethod"){self.methods||(self.methods={});for(const s in r)self.methods[s]=new Function(`return ${r[s]}`)();return o(!0)}if(a==="addTransition"){self.transitions||(self.transitions={});for(const s in r){const c=new Function(`return ${r[s]}`)();self.transitions[s]=c}return}if(self.saved||(self.saved={}),a=="spring"){const{data:s}=n,f=(()=>{var re;const{tension:p=320,friction:S=25,mass:b=1,precision:g=.01,velocity:F=0,stopAttempt:w=20}=s.config||{},k=`${p}-${S}-${b}-${g}-${w}-${F}`.replace(/\./g,"-");if((re=self.saved)==null?void 0:re[k])return self.saved[k];let L=0;const q=1;let z=F,H=0,J=0;const Ie=Math.max(Math.abs(w),1)||5,N=[],R=1/60,je=Math.floor(R*1e3*1e3);for(let D=0;D<=je;D+=1){const Le=-p*(L-q),Ne=-S*z;z+=(Le+Ne)/b*R;const ie=L+z*R;if(Math.abs(ie-L)<Math.abs(g)?J+=1:J=0,J>=Ie){N.push(q),H=D+1;break}L=ie,D==0&&N.push(0),N.push(L)}return H==0&&(H=1e3,N.push(q)),self.saved[k]=N})(),m=`${JSON.stringify(s)}`;if(self.saved[m])return o(self.saved[m]);const v=(p,S,b)=>(p-S)*b+S,C=(p,S,b)=>{const g=Array.isArray(p),F=Array.isArray(S);if(g||F){if(g&&F){if(p.length!==S.length)return[];const w=[];for(let k=0;k<p.length;k++)w.push(v(S[k],p[k],b));return w}return[]}else return v(S,p,b)};if(s.type==="getSpring"){const{frame:p}=s;if(Array.isArray(p)&&p.length){const S=Array.isArray(p[0]),b=S?p:[[p[0]||0,p[1]||0]],g=[];return b.forEach(F=>{const w=[];f.forEach(k=>{w.push(C(F[0],F[1],k))}),S?g.push([w]):g.push(w)}),o(g)}return o([])}const l=self.methods.extractConfig(s.buildAnim,s.animPhase).frame,A=typeof l=="string"?new Function(`return ${l}`)():l,_=f.map(p=>A((b,g)=>C(b,g,p),s.animPhase));let T;if(T=f.length/60*1e3,s.waapi)return o(self.saved[m]={cssText:_,duration:T});{let p=`@keyframes ${s.keyframeName}{`;const S=(g,F)=>100/g*F,b=g=>g.replace(/[A-Z]/g,F=>`-${F}`.toLowerCase());for(let g=0;g<_.length;g++){p+=`${`${S(_.length-1,g)}%`}{`;for(const w in _[g])p+=`${b(w)}:${_[g][w]};`;p+="}"}return p+="}",o(self.saved[m]={cssText:p,duration:T})}}}}catch(o){if(o){const{buildAnim:s}=e.data.data;console.error("<UiTransition />: Your configurations might have some issues. Please check the following configuration."),console.groupCollapsed("<UiTransition />: Configuration",""),console.group(/string|boolean/.test(typeof s)?s:JSON.stringify(s)),console.groupEnd()}}},{passive:!0})}.toString().replace(/^function\s?\(\)\s?{|\}$/g,"");function me(){const e=new Blob([de],{type:"text/javascript"}),n=window.URL.createObjectURL(e);return new Worker(n,{name:"ui-transition-worker",credentials:"same-origin"})}function Z(e){if(!d.webWorker)return;const n={};for(const t in e)n[t]=e[t].toString();j({type:"addTransition",data:n})}let W={fade:(e=0,n=1)=>({frame:(t,i)=>({enter:{opacity:`${t(0,n)}`,transform:`scale3d(${t(e,n)}, ${t(e,n)}, 1)`},leave:{opacity:`${t(n,e)}`}})[i]})};function ve(e,n){W[e]=n,Z(W)}function O(e,n){if(!e)return{frame:()=>({}),duration:0,delay:0};const t={frame:(i,a)=>({enter:{opacity:`${i(0,1)}`,willChange:"opacity"},leave:{opacity:`${i(1,0)}`,willChange:"opacity"}})[a]};if(typeof e=="string"&&e){const i=/\(.+\)$/g,a=e.replace(i,""),r=W[a];if(!r)return t;const s=r(...(()=>{if(!i.test(e))return[];let c=e.match(i);return c?(c=c[0].replace(/^\(/,"[").replace(/\)$/,"]"),new Function(`try{return [${c}].flat()}catch(e){console.error(e)}`)()):[]})());return $($({},t),s)}if(typeof e=="object"){const i=e.extends,a=typeof i=="string"&&!!i;let r={};a&&(r=O(e.extends||"",n));let o={};return typeof e[n]!="undefined"&&(o=O(e[n]||"",n)),$($($($({},t),r),e),o)}return t}let Y=-1;const ge=()=>{Y+=1;const e=`uit-style-el-${Y}`,n=document.getElementById(e);n&&n.remove();const t=document.createElement("style");return t.id=e,t.innerText=".ui-transition{animation-timing-function:var(--uit-ease,linear)!important;animation-delay:var(--uit-delay)!important;animation-name:var(--uit-anim-name)!important;animation-duration:var(--uit-anim-duration)!important;transition-duration:0ms!important;}",(document.head||document.querySelector("head")).append(t),e};function ye(){d.init||(d.init=!0,d.waapi=typeof HTMLElement.prototype.animate=="function",d.waapi||(d.styleId=ge()),d.webWorker||(d.webWorker=me(),j({type:"addMethod",data:{extractConfig:O.toString()}}),Z(W)))}const V={};function Ce(e,n,t){const i=JSON.stringify(U($({},e),{frame:e.frame.toString()})),a=JSON.stringify(n),r=`${i}-${a}-${t}`;return V[r]?V[r]:V[r]=`uitKF-${t}-${performance.now().toString(36).replace(/\./g,"-")}`}function Q(e){return e.replace(/[A-Z]/g,n=>`-${n}`.toLowerCase()).replace(/^-/,"")}function be(e){return e.replace(/\w/,n=>n.toUpperCase()).replace(/-\w/g,n=>`${n[1]}`.toUpperCase())}const E=(e,n)=>{for(const t in n){const i=n[t];typeof i!="undefined"&&e.style.setProperty(t,`${i}`)}},X=(e,n,t)=>{n&&["animationend","animationcancel"].forEach(i=>{n[`${e}EventListener`](i,t)})},B=e=>e==="leave"?"leave":"enter",G=(e,n)=>n.value=e,M=(e,n,t)=>{e(Q(n),t),e(n,t)};function K(e){const{waapi:n}=d;if(!n){const t=e;t.classList.remove("ui-transition"),["--uit-anim-duration","--uit-anim-name","--uit-delay","--uit-ease"].forEach(i=>{t.style.removeProperty(i)})}}let ee=0;function Se(e,n,t,i,a,r,o){ee+=1e-4;const s=ee;e().then(c=>{const{data:{cssText:f,duration:m}}=c,v=n||m,C=t.animate(f,{duration:parseFloat(v),easing:i,delay:a});t.__animId=s,C.addEventListener("finish",()=>{var l;t.__animId===s&&((l=t.__done)==null||l.call(t),r(),delete t.__animId)},{once:!0}),C.addEventListener("cancel",()=>{var l;t.__animId===s&&((l=t.__done)==null||l.call(t,!0),r(),delete t.__animId)},{once:!0}),requestAnimationFrame(a?()=>{const l=setTimeout(()=>{r(),E(t,o),clearTimeout(l)},a)}:r)})}let te=0;function $e(e,n,t,i,a){te+=1e-4;const r=te;t.__animId=r;const{styleId:o,keyframes:s}=d;E(t,{"--uit-ease":a}),console.log(a),s[e]||n().then(f=>{const{data:{cssText:m,duration:v}}=f;s[e]=v;const C=document.getElementById(o);C&&(C.innerText+=m)}),t.addEventListener("animationstart",f=>{f.target===f.currentTarget&&f.animationName===e&&t.__animId===r&&i()},{once:!0});const c=f=>{var m;if(f.target===f.currentTarget&&f.animationName===e){t.__animId===r&&(i(),(m=t.__done)==null||m.call(t,f.type==="animationcancel"),delete t.__animId);const v=f.target;X("remove",v,c)}};X("add",t,c)}function Ae(e,n,t,i,a,r,o,s,c,f,m){const v=B(n),{waapi:C}=d;G(v,t),M(i,`before${u.capitalize(n)}`,[e]);const l=e;if(!a.value)return;const A=parseFloat(l.dataset.uitDelay||s.value)||0,_=()=>{l.__previousStyles&&(Object.assign(l.style,l.__previousStyles),delete l.__previousStyles)};_();const T=a.value.frame((b,g)=>b,t.value),p=a.value.frame((b,g)=>g,t.value);if(!l.__previousStyles){l.__previousStyles={};for(const b in p)l.__previousStyles[b]=l.style.getPropertyValue(b)}E(l,p),E(l,T),C||(E(l,{"--uit-delay":`${A}ms`}),l.classList.add("ui-transition"));const S=async()=>a.value?j({type:"spring",data:{buildAnim:(()=>typeof m=="object"&&m.frame?U($({},m),{frame:m.frame.toString()}):m)(),keyframeName:r.value,waapi:C,animPhase:t.value,config:f.value}}):Promise.resolve({});C?Se(S,l.dataset.uitDuration||o.value,l,l.dataset.uitEase||c.value,A,_,p):$e(r.value,S,l,_,l.dataset.uitEase||c.value)}async function ne(e,n){return await j({type:"sleep",data:{duration:e}}),typeof n=="function"?n():Promise.resolve()}function _e(e,n,t,i,a,r,o,s){const{keyframes:c,waapi:f}=d,m=B(t);if(G(m,a),M(i,t,[e]),!r.value)return n();const v=e;v.__done=C=>{n(C),delete v.__done},f||ne().then(()=>{E(v,{"--uit-anim-duration":`${(()=>{var l,A;return v.dataset.uitDuration?parseFloat(v.dataset.uitDuration):typeof s.value=="string"&&!!s.value?s.value:/string|number/.test(typeof((l=r.value)==null?void 0:l.duration))?parseFloat(`${(A=r.value)==null?void 0:A.duration}`)||1:c[o.value]})()}ms`,"--uit-anim-name":o.value})})}function he(e,n,t,i,a,r){const o=B(n);if(G(o,i),M(t,`after${u.capitalize(n)}`,[e]),K(e),r&&a.value){const s=e,c=a.value.frame((f,m)=>m,i.value);E(s,c)}}function Te(e,n,t){M(t,`${n}Cancelled`,[e]),K(e)}const Fe=function(e){const{configProp:n,getKeyframeName:t,animPhase:i,appear:a,emit:r,getDelay:o,getDuration:s,getEase:c,getSpring:f,propsConfig:m,fragment:v,retainFinalStyle:C}=e,l=A=>{if(A==="appear"&&!a)return{};const _=u.capitalize(A);return U($({[`onBefore${_}`]:T=>{Ae(T,A,i,r,n,t,s,o,c,f,m)},[`on${_}`]:(T,p)=>{_e(T,p,A,r,i,n,t,s)}},v.value?{}:{[`on${_}cancelled`]:T=>{Te(T,A,r)}}),{[`onAfter${_}`]:T=>{he(T,A,r,i,n,C)}})};return $($($({},l("appear")),l("enter")),l("leave"))};function ae(e,n,t){const i=o=>{if(typeof o!="undefined"){if(typeof o=="number")return`${o}`;if(typeof o=="object"){const s=o[t];if(typeof s=="number")return`${s}`}}return null},a=i(e);if(a)return a;const r=i(n);return r||""}function we(e,n,t){const i=o=>{if(typeof o!="undefined"){if(typeof o=="string")return`${o}`;if(typeof o=="object"){const s=o[t];if(typeof s=="string")return`${s}`}}return null},a=i(e);if(a)return a;const r=i(n);return r||"linear"}const I={default:{tension:320,friction:23,mass:1,precision:.01,velocity:0,stopAttempt:20},wobbly:{tension:180,friction:12,mass:1,precision:.01,velocity:0,stopAttempt:30},jello:{tension:220,friction:6,mass:1,precision:.01,velocity:0,stopAttempt:50},gentle:{tension:120,friction:14,mass:1,precision:.01,velocity:0,stopAttempt:20},stiff:{tension:160,friction:20,mass:1,precision:.01,velocity:0,stopAttempt:20},slow:{tension:280,friction:60,mass:1,precision:.001,velocity:0,stopAttempt:25}};function ke(e,n){let t={};typeof n.extends=="string"&&I[n.extends]&&(t=I[n.extends]),delete n.extends,I[e]=$($({},t),n)}function xe(e,n,t){const i=o=>{if(typeof o!="undefined"){if(typeof o=="string")return I[o.toLowerCase()]||null;if(typeof o=="object"){const s=o[t];if(s){if(typeof s=="string")return I[s.toLowerCase()]||null;if(typeof s=="object")return s}else return o}}return null},a=i(e);if(a)return a;const r=i(n);return r||I.default}const P=u.defineComponent({name:"UiTransition",props:ce,setup(e,{slots:n,emit:t}){const i=u.ref("enter"),a=u.computed(()=>e),r=u.computed(()=>O(a.value.config,i.value)),o=u.computed(()=>ae(a.value.duration,r.value.duration,i.value)),s=u.computed(()=>ae(a.value.delay,r.value.delay,i.value)),c=u.computed(()=>we(a.value.ease,r.value.ease||"",i.value)),f=u.computed(()=>xe(a.value.spring,r.value.spring,i.value)),m=u.computed(()=>Ce(r.value,f.value,i.value)),v=u.computed(()=>a.value.group&&!a.value.tag);return u.onBeforeMount(ye),function(){const C={slots:n,data:$({type:"animation",css:a.value.css,appear:a.value.appear,mode:a.value.group?void 0:a.value.mode,tag:a.value.group?a.value.tag:void 0,moveClass:a.value.group?a.value.moveClass:void 0,enterFromClass:a.value.enterFromClass,enterActiveClass:a.value.enterActiveClass,enterToClass:a.value.enterToClass,appearFromClass:a.value.appearFromClass,appearActiveClass:a.value.appearActiveClass,appearToClass:a.value.appearToClass,leaveFromClass:a.value.leaveFromClass,leaveActiveClass:a.value.leaveActiveClass,leaveToClass:a.value.leaveToClass},Fe({animPhase:i,appear:a.value.appear,configProp:r,emit:t,getKeyframeName:m,getDuration:o,getDelay:s,getEase:c,getSpring:f,propsConfig:a.value.config,fragment:v,retainFinalStyle:a.value.retainFinalStyle}))};return a.value.group?fe(C):pe(C)}}});let se=!1;function Ee(e,n={}){if(se)return;let{componentName:t=x.componentName,globals:i}=n;if(typeof i=="undefined"&&(i=x.globals),t&&(x.componentName=t),i){const r=[],o=["sleep","getSpring"];for(const s of i)if(typeof s=="string"&&o.includes(s)&&r.push({[s]:s}),typeof s=="object")for(const c in s)typeof s[c]=="string"&&o.includes(c)&&r.push(s);x.globals=r}if(n.props)for(const r in n.props)P.props[r].default=n.props[r];if(n.springPreset)for(const r in n.springPreset)ke(r,n.springPreset[r]);if(n.transitions)for(const r in n.transitions)ve(r,n.transitions[r]);if(x.globals){const r={sleep:ne,getSpring:ue},o=s=>{for(const[c,f]of Object.entries(s)){const m=`$${f}`,v=r[c];v&&(e.provide(m,v),e.config.globalProperties[m]=v)}};for(const s of x.globals)o(s)}const a=x.componentName||"UiTransition";e.component(be(a),P),e.component(Q(a),P),se=!0}return Ee});
