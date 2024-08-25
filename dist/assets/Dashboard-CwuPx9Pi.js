import{d as T,u as j,a as q,r as f,c as A,b as y,e as s,F as b,f as P,g as c,w as E,t as _,h as S,i as v,j as $,k as d,l as z,m as O,o as p,n as I,p as U,q as G,_ as J}from"./main-CFTRWoaP.js";import{I as h}from"./IconButton-Dns8PT7Y.js";import{E as K}from"./dom-to-image-13VFuKJy.js";import{E as L}from"./Editor-BKPD_i1z.js";import{u as Q}from"./history-CG4E6KDr.js";import{S as W}from"./Song-CBbnjYG8.js";import{u as X}from"./setlists-CgEJQ4N2.js";/* empty css                                                                   */import"./vuedraggable.umd-DJQKlQjA.js";/* empty css                                                               */const n=m=>(U("data-v-b8b3142c"),m=m(),G(),m),Y={class:"grid"},Z={class:"container column w-2 h-2"},ss=n(()=>s("p",{class:"muted row gap-2"},[s("span",{class:"material-symbols-rounded"},"history"),d(" Recently edited ")],-1)),es={class:"container column clickable"},ts=n(()=>s("p",{class:"muted row gap-2"},[s("span",{class:"material-symbols-rounded"},"library_music"),d(" Library ")],-1)),os={class:"wght-900"},ns={class:"row space-between gap-2 centre"},as=n(()=>s("p",{class:"muted row gap-2"},"Chord Sheets",-1)),rs={class:"container column clickable"},ls=n(()=>s("p",{class:"muted row gap-2"},[s("span",{class:"material-symbols-rounded"},"list"),d(" Library ")],-1)),is={class:"wght-900"},cs={class:"row space-between gap-2 centre"},ds=n(()=>s("p",{class:"muted row gap-2"},"Sets",-1)),us={class:"container column gap-2"},ps=n(()=>s("p",{class:"muted row gap-2"},[s("span",{class:"material-symbols-rounded"},"list"),d(" Library ")],-1)),_s={class:"row space-between gap-2 centre"},hs={class:"container column gap-2"},ms=n(()=>s("p",{class:"muted row gap-2"},[s("span",{class:"material-symbols-rounded"},"school"),d(" Learn ")],-1)),gs=n(()=>s("p",null,"How well do you know your scales?",-1)),vs={class:"container column"},ws=n(()=>s("p",{class:"muted row gap-2"},[s("span",{class:"material-symbols-rounded"},"favorite"),d(" Favourite Artist ")],-1)),fs={class:"wght-900"},ys=n(()=>s("p",null,"Most common artist in your library",-1)),bs={class:"content"},Ss={class:"preview-container"},ks={class:"preview scale-sm"},Cs=n(()=>s("h2",null,"Rendering...",-1)),xs=n(()=>s("p",null," Please wait while we render your chord sheets. This may take a while. ",-1)),As={class:"row"},Ps=["value","max"],Es={class:"void"},Is={class:"parent"},Ls=T({__name:"Dashboard",setup(m){const D=j(),u=q(),B=Q(),k=X(),C=z(),g=f(),w=f(),l=f(-1),x=async()=>{var a,r;(a=w.value)==null||a.showModal();let e=new K({orientation:"portrait",unit:"px",format:"a4"});l.value=0;const i=g.value??[];for(const[t,o]of i.entries())console.log(o.name()),await o.renderTo(e),l.value++,t<i.length-1&&e.addPage();return(r=w.value)==null||r.close(),l.value=-1,e},N=async()=>{const e=await x();e.autoPrint(),e.output("dataurlnewwindow")},R=async()=>{(await x()).save("chordsheets.pdf")},F=()=>{const e=u.createNew();C.push(D.editorUrl(e.id))},V=()=>{const{id:e}=k.addEmptySetlist();C.push("/setlists/edit/"+e)},H=A(()=>{var r;const i=u.songs.map(t=>t.artist).reduce((t,o)=>(t[o]=(t[o]||0)+1,t),{}),a=Object.entries(i).sort((t,o)=>o[1]-t[1]);return(r=a==null?void 0:a[0])==null?void 0:r[0]}),M=A(()=>B.history.map(e=>u.song(e.songId)).filter(e=>e!==void 0).slice(0,3));return(e,i)=>{var r,t;const a=O("RouterLink");return p(),y(b,null,[s("div",Y,[s("div",Z,[ss,(p(!0),y(b,null,P(M.value,o=>(p(),S(W,{song:o},null,8,["song"]))),256))]),c(a,{to:"/browse"},{default:E(()=>[s("div",es,[ts,s("h1",os,_(v(u).songs.length),1),s("div",ns,[as,c(h,{icon:"add",onClick:I(F,["prevent"]),style:"green"})])])]),_:1}),c(a,{to:"/setlists"},{default:E(()=>[s("div",rs,[ls,s("h1",is,_(v(k).setlists.length),1),s("div",cs,[ds,c(h,{icon:"add",onClick:I(V,["prevent"]),style:"green"})])])]),_:1}),s("div",us,[ps,s("div",_s,[c(h,{label:"Export all as PDF",icon:"picture_as_pdf",onClick:R,style:"blue"}),c(h,{label:"Print All",icon:"print",onClick:N,style:"blue"})])]),s("div",hs,[ms,gs,c(h,{label:"Start learning",icon:"arrow_forward",onClick:i[0]||(i[0]=o=>e.$router.push("/learn/scale-quiz")),style:"blue"})]),s("div",vs,[ws,s("h1",fs,_(H.value),1),ys])]),s("dialog",{ref_key:"renderDialog",ref:w},[s("div",bs,[s("div",Ss,[s("div",ks,[l.value>=0?(p(),S(L,{key:0,printing:"",song:v(u).songs[l.value]},null,8,["song"])):$("",!0)])]),Cs,xs,s("div",As,[s("progress",{value:l.value,max:(r=g.value)==null?void 0:r.length},null,8,Ps),s("p",null,[s("span",null,_(l.value),1),d(" / "+_((t=g.value)==null?void 0:t.length),1)])])])],512),s("div",Es,[s("div",Is,[(p(!0),y(b,null,P(v(u).songs,o=>(p(),S(L,{ref_for:!0,ref_key:"allPages",ref:g,printing:"",song:o},null,8,["song"]))),256))])])],64)}}}),qs=J(Ls,[["__scopeId","data-v-b8b3142c"]]);export{qs as default};
