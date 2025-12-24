import{j as t}from"./jsx-runtime.D_zvdyIk.js";import{r as s}from"./index.Cd_vQiNd.js";import{c as o}from"./createLucideIcon.BYiIDVK1.js";/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=[["path",{d:"M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3",key:"1xhozi"}]],N=o("headphones",C);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],z=o("loader-circle",T);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=[["rect",{x:"14",y:"3",width:"5",height:"18",rx:"1",key:"kaeet6"}],["rect",{x:"5",y:"3",width:"5",height:"18",rx:"1",key:"1wsw3u"}]],H=o("pause",q);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",key:"10ikf1"}]],R=o("play",I);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["path",{d:"M16 9a5 5 0 0 1 0 6",key:"1q6k2b"}],["path",{d:"M19.364 18.364a9 9 0 0 0 0-12.728",key:"ijwkga"}]],V=o("volume-2",U);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["line",{x1:"22",x2:"16",y1:"9",y2:"15",key:"1ewh16"}],["line",{x1:"16",x2:"22",y1:"9",y2:"15",key:"5ykzw1"}]],F=o("volume-x",D);function G({src:k,title:f="Audio Overview"}){const i=s.useRef(null),[u,r]=s.useState(!1),[d,L]=s.useState(!1),[h,m]=s.useState(0),[c,E]=s.useState(0),[x,l]=s.useState(!1),[O,M]=s.useState(!1),[p,P]=s.useState(!1);s.useEffect(()=>{const e=i.current;if(!e)return;const a=()=>{E(e.duration)},n=()=>{M(!0),l(!1)},y=()=>{m(e.currentTime)},b=()=>{r(!1),m(0)},g=()=>{P(!0),l(!1),r(!1)},j=()=>{l(!0)},w=()=>{l(!1),r(!0)};return e.addEventListener("loadedmetadata",a),e.addEventListener("canplay",n),e.addEventListener("timeupdate",y),e.addEventListener("ended",b),e.addEventListener("error",g),e.addEventListener("waiting",j),e.addEventListener("playing",w),()=>{e.removeEventListener("loadedmetadata",a),e.removeEventListener("canplay",n),e.removeEventListener("timeupdate",y),e.removeEventListener("ended",b),e.removeEventListener("error",g),e.removeEventListener("waiting",j),e.removeEventListener("playing",w)}},[]);const _=async()=>{const e=i.current;if(!(!e||p))if(u)e.pause(),r(!1);else{l(!0);try{await e.play(),r(!0)}catch(a){console.warn("Audio play interrupted:",a),r(!1)}finally{l(!1)}}},S=()=>{const e=i.current;e&&(e.muted=!d,L(!d))},A=e=>{const a=i.current;if(!a)return;const n=parseFloat(e.target.value);a.currentTime=n,m(n)},v=e=>{if(isNaN(e))return"0:00";const a=Math.floor(e/60),n=Math.floor(e%60);return`${a}:${n.toString().padStart(2,"0")}`},$=c>0?h/c*100:0;return p?t.jsxs("div",{className:"bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm",children:[t.jsxs("div",{className:"flex items-center gap-2 text-slate-500 font-bold mb-2 font-display",children:[t.jsx(N,{className:"w-4 h-4"}),t.jsx("h3",{children:f})]}),t.jsx("p",{className:"text-xs text-slate-600",children:"Audio unavailable"})]}):t.jsxs("div",{className:"bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm",children:[t.jsxs("div",{className:"flex items-center gap-2 text-brand-300 font-bold mb-4 font-display",children:[t.jsx(N,{className:"w-4 h-4"}),t.jsx("h3",{children:f})]}),t.jsx("audio",{ref:i,src:k,preload:"metadata"}),t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx("button",{onClick:_,disabled:x,className:"flex-shrink-0 w-10 h-10 flex items-center justify-center bg-brand-600 hover:bg-brand-500 disabled:bg-brand-700 disabled:cursor-wait text-white rounded-full transition-colors shadow-lg shadow-brand-900/30","aria-label":x?"Loading":u?"Pause":"Play",children:x?t.jsx(z,{className:"w-4 h-4 animate-spin"}):u?t.jsx(H,{className:"w-4 h-4"}):t.jsx(R,{className:"w-4 h-4 ml-0.5"})}),t.jsxs("div",{className:"flex-1 space-y-1",children:[t.jsxs("div",{className:"relative h-2 bg-slate-700/50 rounded-full overflow-hidden",children:[t.jsx("div",{className:"absolute h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-150",style:{width:`${$}%`}}),t.jsx("input",{type:"range",min:0,max:c||100,value:h,onChange:A,className:"absolute inset-0 w-full h-full opacity-0 cursor-pointer","aria-label":"Seek"})]}),t.jsxs("div",{className:"flex justify-between text-xs text-slate-500",children:[t.jsx("span",{children:v(h)}),t.jsx("span",{children:v(c)})]})]}),t.jsx("button",{onClick:S,className:"flex-shrink-0 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50","aria-label":d?"Unmute":"Mute",children:d?t.jsx(F,{className:"w-4 h-4"}):t.jsx(V,{className:"w-4 h-4"})})]}),t.jsx("p",{className:"text-xs text-slate-500",children:"Listen to a quick audio overview of this entry"})]})]})}export{G as default};
