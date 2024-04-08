import{d as K,g as x,c as d,a as M,F as k,h as _,n as m,e as N,o as f,_ as E}from"./main-cbfee9d6.js";const T={key:0,class:"keyboard"},F=K({__name:"MidiPreview",props:{track:{type:Object,required:!0},width:{type:Number,default:1e3},height:{type:Number,default:300}},setup(o){const s=o,c=x(()=>({width:s.width-20,height:s.height})),i=x(()=>s.track.notes),n=x(()=>{if(!i.value)return null;let r=Math.min(...i.value.map(u=>u.note)),e=Math.max(...i.value.map(u=>u.note));const l=Math.min(...i.value.map(u=>u.start)),a=Math.max(...i.value.map(u=>u.start+u.duration));return r=Math.floor(r/12)*12,e=Math.ceil(e/12)*12,{y:{min:r,max:e},x:{min:l,max:a}}}),t=x(()=>{if(!n.value)return null;const{x:r,y:e}=n.value,l=c.value.width/r.max,a=c.value.height/(e.max-e.min+1);return{x:l,y:a}}),P=()=>{if(!t.value||!n.value)return null;const{x:r,y:e}=n.value;return!r||!e?null:{height:`${t.value.y*(1+e.max-e.min)}px`,width:`${t.value.x*r.max}px`}},C=r=>{if(!t.value||!n.value)return null;const{x:e,y:l}=n.value;if(!e||!l)return null;const a=r.note-l.min,u=r.start;return{backgroundColor:"var(--accent)",position:"absolute",height:`${t.value.y}px`,width:`${r.duration*t.value.x}px`,bottom:`${a*t.value.y}px`,left:`${u*t.value.x}px`}},j=()=>{if(!t.value||!n.value)return null;const{x:r,y:e}=n.value;if(!r||!e)return null;const l=[];for(let a=e.min;a<=e.max;a++){const h=[1,3,6,8,10].includes(a%12)?"var(--color-background-soft)":"var(--color-background)",v=s.track.signature.clocksPerTick*s.track.signature.numerator,g=2**s.track.signature.denominator;let p="repeating-linear-gradient(to right,";for(let y=0;y<g;y++){const w=y%g===g-1?"black":"var(--color-background-soft)",O=y*v*t.value.x,b=(y+1)*v*t.value.x;p+=`${h} ${O+1}px,`,p+=`${h} ${b}px,`,p+=`${w} ${b}px,`,p+=`${w} ${b+1}px,`}p=p.slice(0,-1)+")",l.push({background:p,position:"absolute",height:`${t.value.y}px`,width:c.value.width+"px",bottom:`${(a-e.min)*t.value.y}px`,left:"0px"})}return l},B=()=>{if(!t.value||!n.value)return null;const{x:r,y:e}=n.value;if(!r||!e)return null;const l=[];for(let a=e.min;a<=e.max;a++){const u=[1,3,6,8,10].includes(a%12),h=a%12===0,$=u?"black":h?"lightgrey":"white",v=u?.7:1;l.push({backgroundColor:$,position:"absolute",height:`${t.value.y}px`,width:`${20*v}px`,bottom:`${(a-e.min)*t.value.y}px`,left:"0px"}),u&&l.push({backgroundColor:"white",position:"absolute",height:`${t.value.y}px`,width:`${20*(1-v)}px`,bottom:`${(a-e.min)*t.value.y}px`,left:`${v*100*t.value.x}px`})}return l},S=()=>{if(!t.value||!n.value)return null;const{x:r,y:e}=n.value;return!r||!e?null:{height:`${(1+e.max-e.min)*t.value.y}px`,width:"20px"}};return(r,e)=>o.track?(f(),d("div",T,[M("div",{class:"keys",style:m(S())},[(f(!0),d(k,null,_(B(),l=>(f(),d("div",{style:m(l)},null,4))),256))],4),M("div",{class:"notes",style:m(P())},[(f(!0),d(k,null,_(j(),l=>(f(),d("div",{style:m(l)},null,4))),256)),(f(!0),d(k,null,_(i.value,l=>(f(),d("div",{class:"note",style:m(C(l))},null,4))),256))],4)])):N("",!0)}});const D=E(F,[["__scopeId","data-v-c2612ebf"]]);var G=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function I(o){return o&&o.__esModule&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o}function V(o){if(o.__esModule)return o;var s=o.default;if(typeof s=="function"){var c=function i(){if(this instanceof i){var n=[null];n.push.apply(n,arguments);var t=Function.bind.apply(s,n);return new t}return s.apply(this,arguments)};c.prototype=s.prototype}else c={};return Object.defineProperty(c,"__esModule",{value:!0}),Object.keys(o).forEach(function(i){var n=Object.getOwnPropertyDescriptor(o,i);Object.defineProperty(c,i,n.get?n:{enumerable:!0,get:function(){return o[i]}})}),c}export{D as M,V as a,G as c,I as g};
