import{d as H,r as _,a as G,K as oe,c as Q,x as W,y as X,o as l,b as m,D as ne,L as ae,e,i as L,F as $,f as O,M as le,n as E,v as ie,t as h,j as x,_ as Y,N as re,g as K,w as T,k as g,h as U,z as de,l as ue,m as ce,p as ve,q as pe}from"./main-CFTRWoaP.js";import{E as me}from"./dom-to-image-13VFuKJy.js";import{d as ge}from"./vuedraggable.umd-DJQKlQjA.js";import{a as q,E as z,i as he}from"./Editor-BKPD_i1z.js";import{S as _e}from"./Song-CBbnjYG8.js";/* empty css                                                                   */import{u as fe}from"./setlists-CgEJQ4N2.js";/* empty css                                                               */const ye={class:"search-results"},we=["onClick","onKeydown"],ke={class:"cover"},Se=["src"],be={class:"info"},De={key:0},Ce={key:0},$e=H({__name:"SongSearcher",emits:["select"],setup(V,{emit:N}){const b=_(""),M=G(),u=_(M.songs),c=_(-1),v=_(0),f=_(null),D=_(!1),P=oe.debounce(()=>{u.value=M.songs.filter(i=>JSON.stringify({title:i.title,artist:i.artist,bpm:i.bpm,key:i.key}).toLowerCase().includes(b.value.toLowerCase()))},300),A=i=>{D.value&&(i.key==="ArrowDown"?(i.preventDefault(),c.value<2?c.value=Math.min(c.value+1,u.value.length-1):v.value<u.value.length-3&&(v.value=Math.min(v.value+1,u.value.length-1))):i.key==="ArrowUp"?(i.preventDefault(),c.value>0?c.value=Math.max(c.value-1,0):v.value>0&&(v.value=Math.max(v.value-1,0))):i.key==="Enter"&&(i.preventDefault(),console.log("selecting",u.value[c.value+v.value],c.value),n("select",u.value[c.value+v.value])))},F=Q(()=>u.value.slice(v.value,Math.min(v.value+3,u.value.length)));W(()=>{window.addEventListener("keydown",A),f.value&&f.value.focus()}),X(()=>{window.removeEventListener("keydown",A)});const n=N;return(i,y)=>(l(),m("div",{class:"content",onFocusin:y[2]||(y[2]=r=>D.value=!0),onFocusout:y[3]||(y[3]=r=>D.value=!1)},[ne(e("input",{type:"text",placeholder:"Search...","onUpdate:modelValue":y[0]||(y[0]=r=>b.value=r),ref_key:"searchField",ref:f,onInput:y[1]||(y[1]=(...r)=>L(P)&&L(P)(...r))},null,544),[[ae,b.value]]),e("div",ye,[(l(!0),m($,null,O(F.value,r=>(l(),m("div",{key:r.id,tabindex:"0",onClick:C=>n("select",r),onKeydown:le(E(C=>n("select",r),["prevent","stop"]),["enter"]),class:ie(["song",{selected:c.value+v.value===u.value.indexOf(r)}])},[e("div",ke,[e("img",{src:r.cover||"placeholders/song.svg"},null,8,Se)]),e("div",be,[e("h2",null,h(r.title),1),e("span",null,h(r.artist),1)])],42,we))),128)),u.value.length===0?(l(),m("span",De,"No results found")):x("",!0)]),u.value.length?(l(),m("span",Ce,h(u.value.length)+" songs found",1)):x("",!0)],32))}}),Ee=Y($e,[["__scopeId","data-v-e36d027d"]]),w=V=>(ve("data-v-bd0eb0d2"),V=V(),pe(),V),xe={class:"browser"},Ve={class:"page-title"},Me={class:"items"},Pe={class:"container"},Ae={class:"section-checks"},Le=["title"],Ne=w(()=>e("span",{class:"material-symbols-rounded"}," warning ",-1)),Fe=w(()=>e("span",{class:"material-symbols-rounded"}," music_note ",-1)),Ke={title:"Pages"},Te=w(()=>e("span",{class:"material-symbols-rounded"}," book ",-1)),Ue={class:"duration",title:"Estimated duration (1 song = 3 minutes)"},Oe=w(()=>e("span",{class:"material-symbols-rounded"}," schedule ",-1)),Re=["onClick"],Be=w(()=>e("span",{class:"material-symbols-rounded"}," delete ",-1)),Ie=["onClick"],je=w(()=>e("span",{class:"material-symbols-rounded"}," add ",-1)),Je=w(()=>e("span",{class:"material-symbols-rounded"}," add ",-1)),qe={key:0,class:"preview"},ze={class:"content"},He={key:0},Ge={class:"content"},Qe={class:"preview-container"},We={class:"preview scale-sm"},Xe=w(()=>e("h2",null,"Rendering...",-1)),Ye=w(()=>e("p",null," Please wait while we render your chord sheets. This may take a while. ",-1)),Ze={class:"row"},es=["value","max"],ss=H({__name:"Editor",setup(V){const N=G(),b=fe(),M=de(),u=ue(),c=_(),v=_(),f=_(-1);if(M.params.id==="new"){const{id:s}=b.addEmptySetlist();u.push({path:`/setlist/${s}`,replace:!0})}const D=async()=>{var d,a;(d=v.value)==null||d.showModal();let s=new me({orientation:"portrait",unit:"px",format:"a4"});f.value=0;const t=c.value??[];for(const[k,o]of t.entries())await o.renderTo(s),f.value++,k<t.length-1&&s.addPage();return(a=v.value)==null||a.close(),f.value=-1,s},P=async()=>{const s=await D();s.autoPrint(),s.output("dataurlnewwindow")},A=async()=>{(await D()).save(n.value.name+".pdf")},F=async()=>{const s=n.value.sections.map(k=>({type:"setlist",...k,songs:k.songs.map(o=>C(o))})),t={...n.value,sections:s},d="data:text/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(t)),a=document.createElement("a");a.setAttribute("href",d),a.setAttribute("download",`${n.value.name}.chordsheets.json`),document.body.appendChild(a),a.click(),a.remove()},n=_(b.setlist(Number(M.params.id))||{id:-1,name:"",sections:[]}),i=_(n.value.sections.map(s=>s.songs.map(()=>1))),y=()=>{i.value.push([]),n.value.sections.push({id:new Date().getTime(),name:"Section "+(n.value.sections.length+1),songs:[]})},r=_(null),C=s=>"title"in s?s:N.songs.find(t=>t.id===s.id),j=s=>{r.value=null},R=s=>{const t=[],d=new Set;return s.songs.forEach(a=>{d.has(a.id)?t.push(C(a)):d.add(a.id)}),t},Z=s=>n.value.sections[s].songs.map((t,d)=>{var a;return((a=i.value[s])==null?void 0:a[d])??0}).reduce((t,d)=>t+d,0),ee=s=>{const t=s.songs.reduce((a,k)=>a+3,0),d=Math.floor(t/60);return d===0?`${t}m`:`${d}h ${t%60}m`},se=Q(()=>n.value.sections.some(s=>s.songs.length));re(()=>{n.value.id===-1&&u.push("/")});const J=s=>{s.ctrlKey&&s.key==="s"?(s.preventDefault(),F()):s.ctrlKey&&s.shiftKey&&s.key==="S"?(s.preventDefault(),A()):s.ctrlKey&&s.key==="p"&&(s.preventDefault(),s.stopImmediatePropagation(),P())};return W(()=>{document.addEventListener("click",j),window.addEventListener("keydown",J)}),X(()=>{document.removeEventListener("click",j),window.removeEventListener("keydown",J)}),(s,t)=>{var a,k;const d=ce("router-link");return l(),m("div",xe,[e("div",{class:"editor",onDragstart:t[3]||(t[3]=E(()=>{},["stop"])),onDragover:t[4]||(t[4]=E(()=>{},["stop"]))},[e("h1",Ve,[K(d,{class:"link-on-hover",to:"/setlists"},{default:T(()=>[g(" Setlists ")]),_:1}),g(" / "),K(q,{modelValue:n.value.name,"onUpdate:modelValue":t[0]||(t[0]=o=>n.value.name=o),placeholder:"Setlist name"},{default:T(()=>[g(h(n.value.name),1)]),_:1},8,["modelValue"])]),e("div",Me,[(l(!0),m($,null,O(n.value.sections,(o,S)=>(l(),m("div",Pe,[e("h2",null,[K(q,{class:"section-name",modelValue:o.name,"onUpdate:modelValue":p=>o.name=p,placeholder:"Section name"},{default:T(()=>[g(h(o.name),1)]),_:2},1032,["modelValue","onUpdate:modelValue"])]),e("div",Ae,[R(o).length?(l(),m("div",{key:0,class:"duplicates",title:`Duplicates: ${R(o).map(p=>p.title).join(", ")}`},[Ne,g(" "+h(R(o).length)+" Duplicates ",1)],8,Le)):x("",!0),e("div",null,[Fe,g(" "+h(o.songs.length)+" Songs ",1)]),e("div",Ke,[Te,g(" "+h(Z(S))+" Pages ",1)]),e("div",Ue,[Oe,g(" about "+h(ee(o)),1)]),e("div",{title:"Delete Section",class:"delete-section",onClick:p=>n.value.sections.splice(S,1)},[Be,g(" Delete Section ")],8,Re)]),K(L(ge),{modelValue:o.songs,"onUpdate:modelValue":p=>o.songs=p,class:"songs","item-key":"id",onDragover:t[1]||(t[1]=E(()=>{},["stop"])),group:"songs",disabled:L(he)()},{item:T(({element:p})=>[(l(),U(_e,{key:p.id,song:C(p),"allow-delete":"",onDelete:B=>o.songs.splice(o.songs.indexOf(p),1)},null,8,["song","onDelete"]))]),_:2},1032,["modelValue","onUpdate:modelValue","disabled"]),e("div",{class:"info add-song",onClick:E(p=>r.value=S,["stop"])},[r.value===S?(l(),U(Ee,{key:0,onClick:t[2]||(t[2]=E(()=>{},["stop"])),onSelect:p=>o.songs.push(p)},null,8,["onSelect"])):(l(),m($,{key:1},[je,g(" Add Song ")],64))],8,Ie)]))),256)),e("div",{class:"info add-song",onClick:y},[Je,g(" Add Section ")])])],32),se.value?(l(),m("div",qe,[e("div",{class:"toolbar"},[e("span",{class:"material-symbols-rounded",onClick:P,title:"Print (Ctrl+P)"}," print "),e("span",{class:"material-symbols-rounded",onClick:A,title:"Download as PDF (CTRL+SHIFT+S)"}," picture_as_pdf "),e("span",{class:"material-symbols-rounded",onClick:F,title:"Download as JSON (CTRL+S)"}," file_download ")]),e("div",ze,[(l(!0),m($,null,O(n.value.sections,(o,S)=>(l(),m($,null,[S>0?(l(),m("hr",He)):x("",!0),e("h2",null,h(o.name),1),(l(!0),m($,null,O(o.songs,(p,B)=>(l(),U(z,{ref_for:!0,ref_key:"allPages",ref:c,printing:"",song:C(p),onOnPageCount:I=>i.value[S][B]=I,"page-offset":i.value[S].slice(0,B).reduce((I,te)=>I+te,0),"section-name":o.name,"disable-hotkeys":""},null,8,["song","onOnPageCount","page-offset","section-name"]))),256))],64))),256))])])):x("",!0),e("dialog",{ref_key:"renderDialog",ref:v},[e("div",Ge,[e("div",Qe,[e("div",We,[f.value>=0?(l(),U(z,{key:0,printing:"",song:L(N).songs[f.value]},null,8,["song"])):x("",!0)])]),Xe,Ye,e("div",Ze,[e("progress",{value:f.value,max:(a=c.value)==null?void 0:a.length},null,8,es),e("p",null,[e("span",null,h(f.value),1),g(" / "+h((k=c.value)==null?void 0:k.length),1)])])])],512)])}}}),us=Y(ss,[["__scopeId","data-v-bd0eb0d2"]]);export{us as default};
