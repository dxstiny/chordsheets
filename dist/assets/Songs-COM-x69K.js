import{d as V,u as x,a as h,r as f,s as k,b as g,e as u,g as r,i,k as C,h as I,w as v,n as b,F as q,l as D,m as B,o as m,_ as N}from"./main-CFTRWoaP.js";import{I as U}from"./IconButton-Dns8PT7Y.js";import{D as L}from"./Dropdown-Cr_uC14n.js";import{T}from"./TextInput-daAmcUed.js";import{d as E}from"./vuedraggable.umd-DJQKlQjA.js";import{S as M}from"./Song-CBbnjYG8.js";/* empty css                                                                   *//* empty css                                                                 */const $={class:"toolbar"},A={class:"filters"},F={key:0,class:"songs"},O={class:"muted"},R=V({__name:"Songs",setup(W){const c=x(),a=h(),w=D(),_=()=>{const t=a.createNew();t.title=s.value.query,w.push(c.editorUrl(t.id))},s=f({artist:"",query:""}),n=f([]);k(()=>{n.value=a.songs.filter(t=>{if(s.value.artist&&s.value.artist!=="(any)"&&!t.artist.toLowerCase().includes(s.value.artist.toLowerCase()))return!1;const o=`${t.title} ${t.artist}`.toLowerCase();return!(s.value.query&&!o.includes(s.value.query.toLowerCase()))})});const S=({moved:t})=>{const o=a.songs.findIndex(d=>d.id===t.element.id),l=n.value[t.newIndex-1%n.value.length],e=l?a.songs.findIndex(d=>d.id===l.id):-1,p=t.newIndex>t.oldIndex?e:e+1;a.moveTo(o,p)},y=window.innerWidth<800;return(t,o)=>{const l=B("router-link");return m(),g(q,null,[u("div",$,[u("div",A,[r(T,{label:"Search",modelValue:s.value.query,"onUpdate:modelValue":o[0]||(o[0]=e=>s.value.query=e),placeholder:"Search for a song"},null,8,["modelValue"]),r(L,{label:"Artist",modelValue:s.value.artist,"onUpdate:modelValue":o[1]||(o[1]=e=>s.value.artist=e),options:["(any)",...new Set(i(a).songs.map(e=>e.artist).sort())]},null,8,["modelValue","options"])])]),n.value.length?(m(),I(i(E),{key:1,modelValue:n.value,"onUpdate:modelValue":o[2]||(o[2]=e=>n.value=e),class:"songs",onChange:S,"item-key":"id",onDragover:o[3]||(o[3]=b(()=>{},["stop"])),disabled:y},{item:v(({element:e})=>[r(l,{to:i(c).editorUrl(e.id)},{default:v(()=>[r(M,{song:e,"allow-delete":"",onDelete:p=>i(a).removeSong(e)},null,8,["song","onDelete"])]),_:2},1032,["to"])]),_:1},8,["modelValue"])):(m(),g("div",F,[u("p",O,[C(" No songs found. Do you want to add it? "),r(U,{icon:"add",label:"Add a new song",onClick:_})])]))],64)}}}),X=N(R,[["__scopeId","data-v-5e6aa010"]]);export{X as default};
