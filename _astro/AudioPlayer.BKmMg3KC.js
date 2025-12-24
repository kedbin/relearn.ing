import{j as t}from"./jsx-runtime.D_zvdyIk.js";import{r as n}from"./index.Cd_vQiNd.js";import{c as o}from"./createLucideIcon.BYiIDVK1.js";/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3",key:"1xhozi"}]],L=o("headphones",k);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=[["rect",{x:"14",y:"3",width:"5",height:"18",rx:"1",key:"kaeet6"}],["rect",{x:"5",y:"3",width:"5",height:"18",rx:"1",key:"1wsw3u"}]],E=o("pause",M);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",key:"10ikf1"}]],P=o("play",_);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["path",{d:"M16 9a5 5 0 0 1 0 6",key:"1q6k2b"}],["path",{d:"M19.364 18.364a9 9 0 0 0 0-12.728",key:"ijwkga"}]],A=o("volume-2",S);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["line",{x1:"22",x2:"16",y1:"9",y2:"15",key:"1ewh16"}],["line",{x1:"16",x2:"22",y1:"9",y2:"15",key:"5ykzw1"}]],$=o("volume-x",T);function I({src:f,title:p="Audio Overview"}){const r=n.useRef(null),[l,h]=n.useState(!1),[i,v]=n.useState(!1),[c,u]=n.useState(0),[d,y]=n.useState(0),[z,j]=n.useState(!1);n.useEffect(()=>{const e=r.current;if(!e)return;const a=()=>{y(e.duration),j(!0)},s=()=>{u(e.currentTime)},x=()=>{h(!1),u(0)};return e.addEventListener("loadedmetadata",a),e.addEventListener("timeupdate",s),e.addEventListener("ended",x),()=>{e.removeEventListener("loadedmetadata",a),e.removeEventListener("timeupdate",s),e.removeEventListener("ended",x)}},[]);const b=()=>{const e=r.current;e&&(l?e.pause():e.play(),h(!l))},w=()=>{const e=r.current;e&&(e.muted=!i,v(!i))},g=e=>{const a=r.current;if(!a)return;const s=parseFloat(e.target.value);a.currentTime=s,u(s)},m=e=>{if(isNaN(e))return"0:00";const a=Math.floor(e/60),s=Math.floor(e%60);return`${a}:${s.toString().padStart(2,"0")}`},N=d>0?c/d*100:0;return t.jsxs("div",{className:"bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm",children:[t.jsxs("div",{className:"flex items-center gap-2 text-brand-300 font-bold mb-4 font-display",children:[t.jsx(L,{className:"w-4 h-4"}),t.jsx("h3",{children:p})]}),t.jsx("audio",{ref:r,src:f,preload:"metadata"}),t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx("button",{onClick:b,className:"flex-shrink-0 w-10 h-10 flex items-center justify-center bg-brand-600 hover:bg-brand-500 text-white rounded-full transition-colors shadow-lg shadow-brand-900/30","aria-label":l?"Pause":"Play",children:l?t.jsx(E,{className:"w-4 h-4"}):t.jsx(P,{className:"w-4 h-4 ml-0.5"})}),t.jsxs("div",{className:"flex-1 space-y-1",children:[t.jsxs("div",{className:"relative h-2 bg-slate-700/50 rounded-full overflow-hidden",children:[t.jsx("div",{className:"absolute h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-150",style:{width:`${N}%`}}),t.jsx("input",{type:"range",min:0,max:d||100,value:c,onChange:g,className:"absolute inset-0 w-full h-full opacity-0 cursor-pointer","aria-label":"Seek"})]}),t.jsxs("div",{className:"flex justify-between text-xs text-slate-500",children:[t.jsx("span",{children:m(c)}),t.jsx("span",{children:m(d)})]})]}),t.jsx("button",{onClick:w,className:"flex-shrink-0 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50","aria-label":i?"Unmute":"Mute",children:i?t.jsx($,{className:"w-4 h-4"}):t.jsx(A,{className:"w-4 h-4"})})]}),t.jsx("p",{className:"text-xs text-slate-500",children:"Listen to a quick audio overview of this entry"})]})]})}export{I as default};
