import{d as b,u as w,a as k,b as y,r as l,c as g,e as x,w as p,o as S,f as u,g as o,p as C,h as I,_ as R}from"./main-01d35b45.js";import{M as E}from"./MinWidth-968256d4.js";import{E as N}from"./Editor-bb290192.js";import"./dom-to-image-4f79793a.js";import"./_commonjsHelpers-042e6b4d.js";const A=a=>(C("data-v-946c8a65"),a=a(),I(),a),B=A(()=>o("span",{class:"material-symbols-rounded"},"arrow_back",-1)),$={class:"editor_container"},j=b({__name:"index",setup(a){const n=w(),_=k(),d=y();let r=_.params.id;const c=l();if(!r){const e=n.addEmptySong();d.push({path:`/editor/${e}`,replace:!0}),r=String(e)}const i=n.song(r);i||d.push("/");const s=l(i),m=async()=>{await n.prepareRender();const e=await c.value.render();e&&(e.autoPrint(),window.open(e.output("bloburl"),"_blank"))},f=async()=>{await n.prepareRender();const e=await c.value.render();e&&e.save(`${s.value.title}.pdf`)},h=()=>{if(!s.value)return;const e="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(s.value)),t=document.createElement("a");t.setAttribute("href",e),t.setAttribute("download",`${s.value.title}.chordsheets.json`),document.body.appendChild(t),t.click(),t.remove()};return(e,t)=>{const v=g("router-link");return S(),x(E,{minWidth:300},{default:p(()=>[u(v,{to:"/",class:"back-button"},{default:p(()=>[B]),_:1}),o("div",$,[o("div",{class:"toolbar"},[o("span",{class:"material-symbols-rounded",onClick:m}," print "),o("span",{class:"material-symbols-rounded",onClick:f}," picture_as_pdf "),o("span",{class:"material-symbols-rounded",onClick:h}," save ")]),u(N,{ref_key:"editor",ref:c,song:s.value},null,8,["song"])])]),_:1})}}});const P=R(j,[["__scopeId","data-v-946c8a65"]]);export{P as default};
