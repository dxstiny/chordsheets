import{d as r,r as i,f as o,c as s,b as d,t as a,g as c,o as l,_ as u}from"./main-5840bc37.js";const _={key:0,class:"min-width"},p=r({__name:"MinWidth",props:{minWidth:{required:!0,type:Number},error:{required:!1,type:String,default:"Mobile devices are currently not supported."}},setup(t){const e=i(0);return o(()=>{e.value=window.innerWidth}),window.addEventListener("resize",()=>{e.value=window.innerWidth}),(n,h)=>e.value<t.minWidth?(l(),s("div",_,[d("p",null,a(t.error),1)])):c(n.$slots,"default",{key:1},void 0,!0)}});const v=u(p,[["__scopeId","data-v-40782251"]]);export{v as M};
