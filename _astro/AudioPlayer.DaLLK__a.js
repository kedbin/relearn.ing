import{j as t}from"./jsx-runtime.D_zvdyIk.js";import{r as a}from"./index.Cd_vQiNd.js";import{c as l}from"./createLucideIcon.BYiIDVK1.js";/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=[["path",{d:"M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3",key:"1xhozi"}]],j=l("headphones",A);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],P=l("loader-circle",z);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=[["rect",{x:"14",y:"3",width:"5",height:"18",rx:"1",key:"kaeet6"}],["rect",{x:"5",y:"3",width:"5",height:"18",rx:"1",key:"1wsw3u"}]],I=l("pause",$);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=[["path",{d:"M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",key:"10ikf1"}]],T=l("play",C);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["path",{d:"M16 9a5 5 0 0 1 0 6",key:"1q6k2b"}],["path",{d:"M19.364 18.364a9 9 0 0 0 0-12.728",key:"ijwkga"}]],H=l("volume-2",q);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",key:"uqj9uw"}],["line",{x1:"22",x2:"16",y1:"9",y2:"15",key:"1ewh16"}],["line",{x1:"16",x2:"22",y1:"9",y2:"15",key:"5ykzw1"}]],V=l("volume-x",R);function U({src:p,title:b="Audio Overview"}){const s=a.useRef(null),[u,r]=a.useState(!1),[o,g]=a.useState(!1),[h,x]=a.useState(0),[d,w]=a.useState(0),[f,n]=a.useState(!1),[y,N]=a.useState(!1),[m,k]=a.useState(!1),L=a.useCallback(()=>{if(s.current||m)return s.current;const e=new Audio;return e.preload="metadata",e.src=p,e.addEventListener("loadedmetadata",()=>{w(e.duration)}),e.addEventListener("canplay",()=>{n(!1)}),e.addEventListener("timeupdate",()=>{x(e.currentTime)}),e.addEventListener("ended",()=>{r(!1),x(0)}),e.addEventListener("error",()=>{N(!0),n(!1),r(!1)}),e.addEventListener("waiting",()=>{n(!0)}),e.addEventListener("playing",()=>{n(!1),r(!0)}),e.addEventListener("pause",()=>{r(!1)}),s.current=e,k(!0),e},[p,m]);a.useEffect(()=>()=>{s.current&&(s.current.pause(),s.current.src="",s.current=null)},[]);const M=async()=>{if(y)return;const e=L();if(e)if(u)e.pause(),r(!1);else{n(!0);try{await e.play()}catch{r(!1),n(!1)}}},E=()=>{const e=s.current;e&&(e.muted=!o,g(!o))},_=e=>{const i=s.current;if(!i)return;const c=parseFloat(e.target.value);i.currentTime=c,x(c)},v=e=>{if(isNaN(e)||e===0)return"0:00";const i=Math.floor(e/60),c=Math.floor(e%60);return`${i}:${c.toString().padStart(2,"0")}`},S=d>0?h/d*100:0;return y?t.jsxs("div",{className:"bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm",children:[t.jsxs("div",{className:"flex items-center gap-2 text-slate-500 font-bold mb-2 font-display",children:[t.jsx(j,{className:"w-4 h-4"}),t.jsx("h3",{children:b})]}),t.jsx("p",{className:"text-xs text-slate-600",children:"Audio unavailable"})]}):t.jsxs("div",{className:"bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm",children:[t.jsxs("div",{className:"flex items-center gap-2 text-brand-300 font-bold mb-4 font-display",children:[t.jsx(j,{className:"w-4 h-4"}),t.jsx("h3",{children:b})]}),t.jsxs("div",{className:"space-y-4",children:[t.jsxs("div",{className:"flex items-center gap-3",children:[t.jsx("button",{onClick:M,disabled:f,className:"flex-shrink-0 w-10 h-10 flex items-center justify-center bg-brand-600 hover:bg-brand-500 disabled:bg-brand-700 disabled:cursor-wait text-white rounded-full transition-colors shadow-lg shadow-brand-900/30","aria-label":f?"Loading":u?"Pause":"Play",children:f?t.jsx(P,{className:"w-4 h-4 animate-spin"}):u?t.jsx(I,{className:"w-4 h-4"}):t.jsx(T,{className:"w-4 h-4 ml-0.5"})}),t.jsxs("div",{className:"flex-1 space-y-1",children:[t.jsxs("div",{className:"relative h-2 bg-slate-700/50 rounded-full overflow-hidden",children:[t.jsx("div",{className:"absolute h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all duration-150",style:{width:`${S}%`}}),t.jsx("input",{type:"range",min:0,max:d||100,value:h,onChange:_,className:"absolute inset-0 w-full h-full opacity-0 cursor-pointer","aria-label":"Seek"})]}),t.jsxs("div",{className:"flex justify-between text-xs text-slate-500",children:[t.jsx("span",{children:v(h)}),t.jsx("span",{children:v(d)})]})]}),t.jsx("button",{onClick:E,disabled:!m,className:"flex-shrink-0 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white disabled:text-slate-600 transition-colors rounded-lg hover:bg-slate-800/50","aria-label":o?"Unmute":"Mute",children:o?t.jsx(V,{className:"w-4 h-4"}):t.jsx(H,{className:"w-4 h-4"})})]}),t.jsx("p",{className:"text-xs text-slate-500",children:"Listen to a quick audio overview of this entry"})]})]})}export{U as default};
