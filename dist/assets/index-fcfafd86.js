import{d as O,r as x,y as K,i as ee,o as G,w as oe,e as m,c as C,b as te,z as se,A as ne,v as f,B as R,x as A,C as N,_ as q,u as J,D as le,j as z,F as T,a as s,m as v,s as u,t as y,k as w,g as j,f as W,l as H,n as F,p as X,h as Q,E as ae,G as de,q as ie}from"./main-7ad6aae4.js";import{M as re}from"./MinWidth-249d4b42.js";import{d as L,E as ue,a as ce}from"./vuedraggable.umd-5c39a83c.js";import"./_commonjsHelpers-042e6b4d.js";const pe=["onDblclick"],me=["placeholder"],ge=O({__name:"EditableText",props:{modelValue:{type:String,required:!0},locked:{type:Boolean,default:!1},noOutline:{type:Boolean,default:!1},placeholder:{type:String,default:"Click to edit"}},emits:["update:modelValue","change"],setup(n,{emit:i}){const M=n,k=x(M.modelValue);K(()=>M.modelValue,U=>k.value=U);const r=x(!1),V=x(null),D=()=>{M.locked||(r.value=!0,N(()=>{V.value&&V.value.focus()}))},E=ee(()=>M.locked?!0:r.value?!1:k.value||k.value=="0"),P=U=>{k.value=U,i("change",U),i("update:modelValue",U)},S=()=>{V.value&&(V.value.style.height="auto",V.value.style.height=V.value.scrollHeight+"px")};return G(()=>S()),oe(()=>{r.value&&S()}),(U,g)=>(m(),C("div",{class:A(["editable-text",{outlined:!n.noOutline&&r.value}]),onDblclick:f(D,["stop"])},[E.value?te(U.$slots,"default",{key:0},void 0,!0):se((m(),C("input",{key:1,ref_key:"area",ref:V,type:"text",class:"textarea","onUpdate:modelValue":g[0]||(g[0]=b=>k.value=b),onChange:g[1]||(g[1]=b=>P(b.target.value)),onInput:g[2]||(g[2]=b=>S()),onClick:g[3]||(g[3]=f(b=>r.value=!0,["stop"])),onKeydown:[g[4]||(g[4]=R(b=>r.value=!1,["enter"])),g[5]||(g[5]=R(b=>r.value=!1,["esc"]))],onBlur:g[6]||(g[6]=b=>r.value=!1),placeholder:n.placeholder},null,40,me)),[[ne,k.value]])],42,pe))}});const _=q(ge,[["__scopeId","data-v-793c6cbc"]]),$=n=>(X("data-v-aad007bb"),n=n(),Q(),n),fe={class:"editor__header"},ve={class:"wrap-to-line"},he={class:"info"},ye=$(()=>s("span",{class:"material-symbols-rounded"},"music_note",-1)),_e={class:"info"},ke=$(()=>s("span",{class:"material-symbols-rounded"},"piano",-1)),Ve={class:"info"},be={class:"material-symbols-rounded"},we={class:"info"},Ce=$(()=>s("span",{class:"material-symbols-rounded"}," check ",-1)),$e={class:"capitalise"},Ue=["onClick"],Me=$(()=>s("span",{class:"material-symbols-rounded"}," add ",-1)),Ee=$(()=>s("hr",null,null,-1)),Se={class:"instruments"},xe={class:"instrument"},De=["onClick"],Be={class:"flex space-between"},Pe={class:"flex gap-2"},Ie=$(()=>s("span",{class:"material-symbols-rounded"}," volume_up ",-1)),Te={class:"settings"},ze={class:"muted"},Ae=$(()=>s("span",{class:"material-symbols-rounded"}," add ",-1)),Ne=$(()=>s("hr",null,null,-1)),We=["id"],He={class:"name"},Le={class:"buttons"},Ke=["onClick"],Oe=["onClick"],qe={key:0,class:"progression"},Re=["onClick"],je=$(()=>s("span",{class:"material-symbols-rounded"}," add ",-1)),Fe=["id","onMousedown","onMouseup"],Ge=["onClick"],Je=["id"],Xe={class:"name"},Qe={class:"buttons"},Ye=["onClick"],Ze=["onClick"],eo={key:0,class:"progression"},oo=["onClick"],to=$(()=>s("span",{class:"material-symbols-rounded"}," add ",-1)),so=["id","onMousedown","onMouseup"],no=["onClick"],lo=$(()=>s("span",{class:"material-symbols-rounded"}," add ",-1)),ao=O({__name:"Editor",props:{song:{type:Object,required:!0}},setup(n){const i=n,M=J(),k=x(!1),r=x(!1),V=(l,e)=>{const c=i.song.sections[l].progression[e],o={chord:c.chord,duration:c.duration};i.song.sections[l].progression.splice(e+1,0,o)},D=l=>{if(l.key==="Delete")for(const e of i.song.sections)e.progression=e.progression.filter(a=>!a.selected);if(l.ctrlKey&&(l.key==="d"||l.key==="b")){l.preventDefault();for(const e of i.song.sections)for(const a of e.progression)if(a.selected){const c={chord:a.chord,duration:a.duration};e.progression.splice(e.progression.indexOf(a)+1,0,c)}}l.ctrlKey&&l.key==="p"&&(l.preventDefault(),Z())},E=(l,e)=>{if(e.button===2)return;const a=e.target;if(e.offsetX>a.clientWidth-10){e.preventDefault(),e.stopImmediatePropagation(),k.value=!0;const c=a.getBoundingClientRect().width/l.duration;let o=0;const d=h=>{const p=h.clientX-a.getBoundingClientRect().left;o=Math.round(p/c),l.duration=Math.max(1,Math.min(16,o))},t=h=>{window.removeEventListener("mousemove",d),window.removeEventListener("mouseup",t),k.value=!1,h.stopImmediatePropagation()};window.addEventListener("mousemove",d),window.addEventListener("mouseup",t)}},P=(l,e)=>{let a=l.selected;if(!e.shiftKey)for(const c of i.song.sections)for(const o of c.progression)o.selected=!1;l.selected=!a},S=l=>{i.song.sections[l],i.song.sections.splice(l,1)},U=l=>{const e=i.song.sections[l],a={type:e.type,progression:e.progression.map(c=>({chord:c.chord,duration:c.duration})),page:0};i.song.sections.splice(l+1,0,a)},g=async l=>{const e=document.querySelectorAll(".editor");let a=e[0];const c=a.clientHeight/a.clientWidth;for(let t=0;t<e.length;t++){if(a=e[t],!a)continue;var o=l.internal.pageSize.getWidth(),d=l.internal.pageSize.getHeight();const h=2,p=await ce.toJpeg(a,{height:a.clientHeight*h,width:a.clientWidth*h,style:{transform:`scale(${h}) translate(${a.clientWidth/2/h}px, ${a.clientHeight/2/h}px)`}});d=c*o,l.addImage(p,"JPG",0,0,o,d),t+1<e.length&&l.addPage()}return l};let b;const Y=async()=>{r.value=!0,await new Promise(a=>{b=a});const e=new ue({orientation:"portrait",unit:"px",format:"a4"});return await g(e),e},Z=async()=>{await M.prepareRender();const l=await Y();l&&(l.autoPrint(),window.open(l.output("bloburl"),"_blank"))};G(()=>{window.addEventListener("keydown",D),I()}),le(()=>{window.removeEventListener("keydown",D)});const B=x([]),I=()=>{if(!r.value||B.value.length==0){B.value=[{start:0,end:i.song.sections.length}],r.value&&N(I);return}const l=document.querySelectorAll(".section");if(l.length==0)return;const e=l[0].parentElement,a=getComputedStyle(e),c=e.clientHeight-parseFloat(a.paddingBottom);for(let o=0;o<l.length;o++){const d=l[o];if(d.offsetTop+d.offsetHeight>c){B.value[B.value.length-1].end=o,B.value.push({start:o,end:i.song.sections.length}),N(I);return}}b==null||b()};return K(()=>i.song,I,{deep:!0}),K(r,()=>N(I)),(l,e)=>(m(!0),C(T,null,z(B.value,(a,c)=>(m(),C("div",{class:A(["editor",{resizing:k.value,print:r.value}]),onDragover:e[18]||(e[18]=f(()=>{},["prevent"]))},[c==0?(m(),C(T,{key:0},[s("div",fe,[v(_,{modelValue:n.song.artist,"onUpdate:modelValue":e[0]||(e[0]=o=>n.song.artist=o),class:"left",placeholder:"Click to edit artist name","no-outline":""},{default:u(()=>[s("h3",null,y(n.song.artist),1)]),_:1},8,["modelValue"]),v(_,{modelValue:n.song.title,"onUpdate:modelValue":e[1]||(e[1]=o=>n.song.title=o),class:"left h1",placeholder:"Click to edit song title","no-outline":""},{default:u(()=>[s("h1",null,y(n.song.title),1)]),_:1},8,["modelValue"])]),s("div",ve,[s("div",he,[ye,v(_,{modelValue:n.song.bpm,"onUpdate:modelValue":e[2]||(e[2]=o=>n.song.bpm=o),class:"left short",placeholder:"120"},{default:u(()=>[w(y(n.song.bpm),1)]),_:1},8,["modelValue"]),w(" BPM ")]),s("div",_e,[ke,v(_,{modelValue:n.song.key,"onUpdate:modelValue":e[3]||(e[3]=o=>n.song.key=o),class:"left short",placeholder:"C"},{default:u(()=>[w(y(n.song.key),1)]),_:1},8,["modelValue"])]),s("div",Ve,[s("span",be,y(n.song.transpose>0?"arrow_upward":n.song.transpose<0?"arrow_downward":"drag_handle"),1),v(_,{modelValue:n.song.transpose,"onUpdate:modelValue":e[4]||(e[4]=o=>n.song.transpose=o),class:"left short",placeholder:"0"},{default:u(()=>[w(y(n.song.transpose),1)]),_:1},8,["modelValue"])]),n.song.options?(m(!0),C(T,{key:0},z(n.song.options,(o,d)=>(m(),C("div",we,[Ce,v(_,{modelValue:n.song.options[d],"onUpdate:modelValue":t=>n.song.options[d]=t,class:"left",placeholder:"Option"},{default:u(()=>[s("span",$e,y(o),1)]),_:2},1032,["modelValue","onUpdate:modelValue"]),s("span",{onClick:t=>n.song.options.splice(d,1),class:"delete material-symbols-rounded"}," delete ",8,Ue)]))),256)):j("",!0),s("div",{class:"info add-option",onClick:e[5]||(e[5]=o=>n.song.options?n.song.options.push("Sustain"):n.song.options=["Sustain"])},[Me,w(" Add Option ")])]),Ee,s("div",Se,[(m(!0),C(T,null,z(n.song.instruments,(o,d)=>(m(),C("div",xe,[s("span",{onClick:t=>n.song.instruments.splice(d,1),class:"delete material-symbols-rounded"}," delete ",8,De),s("div",Be,[v(_,{modelValue:o.for,"onUpdate:modelValue":t=>o.for=t,class:"left short",placeholder:"Click to edit instrument","no-outline":""},{default:u(()=>[s("span",null,y(o.for),1)]),_:2},1032,["modelValue","onUpdate:modelValue"]),s("span",Pe,[Ie,v(_,{modelValue:o.volume,"onUpdate:modelValue":t=>o.volume=t,class:"left short",placeholder:"100"},{default:u(()=>[w(y(o==null?void 0:o.volume),1)]),_:2},1032,["modelValue","onUpdate:modelValue"])])]),s("div",Te,[v(_,{modelValue:o.name,"onUpdate:modelValue":t=>o.name=t,class:"left h3",placeholder:"Click to edit instrument name","no-outline":""},{default:u(()=>[s("h3",null,y(o.name),1)]),_:2},1032,["modelValue","onUpdate:modelValue"]),s("span",ze,[v(_,{modelValue:o.type,"onUpdate:modelValue":t=>o.type=t,class:"left",placeholder:"Click to edit instrument type","no-outline":""},{default:u(()=>[w(y(o==null?void 0:o.type),1)]),_:2},1032,["modelValue","onUpdate:modelValue"])])])]))),256)),s("div",{class:"instrument add-option",onClick:e[6]||(e[6]=o=>n.song.instruments.push({name:"New Instrument",for:"New Instrument",type:"New Instrument",volume:100}))},[Ae,w(" Add Instrument ")])]),Ne],64)):j("",!0),r.value?(m(!0),C(T,{key:2},z(i.song.sections.slice(a.start,a.end),(o,d)=>(m(),C("div",{class:"section",id:`section-${d}`},[v(_,{modelValue:o.type,"onUpdate:modelValue":t=>o.type=t,class:"left",placeholder:"Click to edit section name","no-outline":""},{default:u(()=>[s("span",Xe,y(o.type),1)]),_:2},1032,["modelValue","onUpdate:modelValue"]),s("div",Qe,[s("span",{class:"button material-symbols-rounded",onClick:t=>U(d)}," content_copy ",8,Ye),s("span",{class:"button material-symbols-rounded",onClick:t=>S(d)}," delete ",8,Ze)]),o.progression.length===0?(m(),C("div",eo,[s("div",{class:"chord create",style:{"--cols":4},onClick:f(t=>o.progression.push({chord:"C",duration:4}),["stop"])},[to,w(" Add Chord ")],8,oo)])):(m(),W(H(L),{key:1,modelValue:o.progression,"onUpdate:modelValue":t=>o.progression=t,class:"progression",onDragover:e[16]||(e[16]=f(()=>{},["stop"]))},{item:u(({element:t,index:h})=>[s("div",{class:A(["chord",t.selected?" selected":""]),ref_for:!0,ref:"chordElements",id:`chord-${d}-${h}`,onMousedown:p=>E(t,p),onMouseup:p=>P(t,p),onClick:e[15]||(e[15]=f(()=>{},["stop"])),style:F({"--cols":t.duration})},[v(_,{modelValue:t.chord,"onUpdate:modelValue":p=>t.chord=p,"no-outline":"",placeholder:"C"},{default:u(()=>[w(y(t.chord),1)]),_:2},1032,["modelValue","onUpdate:modelValue"]),s("span",{class:"insert_chord_here",onMousedown:e[13]||(e[13]=f(()=>{},["stop"])),onMouseup:e[14]||(e[14]=f(()=>{},["stop"])),onClick:f(p=>V(d,h),["stop"])},null,40,no)],46,so)]),_:2},1032,["modelValue","onUpdate:modelValue"]))],8,Je))),256)):(m(),W(H(L),{key:1,modelValue:n.song.sections,"onUpdate:modelValue":e[11]||(e[11]=o=>n.song.sections=o),class:"editor__content",onDragover:e[12]||(e[12]=f(()=>{},["stop"]))},{item:u(({element:o,index:d})=>[s("div",{class:"section",id:`section-${d}`},[v(_,{modelValue:o.type,"onUpdate:modelValue":t=>o.type=t,class:"left",placeholder:"Click to edit section name","no-outline":""},{default:u(()=>[s("span",He,y(o.type),1)]),_:2},1032,["modelValue","onUpdate:modelValue"]),s("div",Le,[s("span",{class:"button material-symbols-rounded",onClick:t=>U(d)}," content_copy ",8,Ke),s("span",{class:"button material-symbols-rounded",onClick:t=>S(d)}," delete ",8,Oe)]),o.progression.length===0?(m(),C("div",qe,[s("div",{class:"chord create",style:{"--cols":4},onClick:f(t=>o.progression.push({chord:"C",duration:4}),["stop"])},[je,w(" Add Chord ")],8,Re)])):(m(),W(H(L),{key:1,modelValue:o.progression,"onUpdate:modelValue":t=>o.progression=t,class:"progression",onDragover:e[10]||(e[10]=f(()=>{},["stop"]))},{item:u(({element:t,index:h})=>[s("div",{class:A(["chord",t.selected?" selected":""]),ref_for:!0,ref:"chordElements",id:`chord-${d}-${h}`,onMousedown:p=>E(t,p),onMouseup:p=>P(t,p),onClick:e[9]||(e[9]=f(()=>{},["stop"])),style:F({"--cols":t.duration})},[v(_,{modelValue:t.chord,"onUpdate:modelValue":p=>t.chord=p,"no-outline":"",placeholder:"C"},{default:u(()=>[w(y(t.chord),1)]),_:2},1032,["modelValue","onUpdate:modelValue"]),s("span",{class:"insert_chord_here",onMousedown:e[7]||(e[7]=f(()=>{},["stop"])),onMouseup:e[8]||(e[8]=f(()=>{},["stop"])),onClick:f(p=>V(d,h),["stop"])},null,40,Ge)],46,Fe)]),_:2},1032,["modelValue","onUpdate:modelValue"]))],8,We)]),_:2},1032,["modelValue"])),s("div",{class:"add-section",id:"add-section",onClick:e[17]||(e[17]=o=>n.song.sections.push({type:"New Section",progression:[]}))},[lo,w(" Add Section ")])],34))),256))}});const io=q(ao,[["__scopeId","data-v-aad007bb"]]),ro=n=>(X("data-v-e1e8a1b1"),n=n(),Q(),n),uo=ro(()=>s("span",{class:"material-symbols-rounded"},"arrow_back",-1)),co={class:"editor_container"},po=O({__name:"index",setup(n){const i=J(),M=ae(),k=de();let r=M.params.id;if(!r){const E=i.addEmptySong();k.push({path:`/editor/${E}`,replace:!0}),r=String(E)}const V=i.song(r);V||k.push("/");const D=x(V);return(E,P)=>{const S=ie("router-link");return m(),W(re,{minWidth:300},{default:u(()=>[v(S,{to:"/",class:"back-button"},{default:u(()=>[uo]),_:1}),s("div",co,[v(io,{song:D.value},null,8,["song"])])]),_:1})}}});const ho=q(po,[["__scopeId","data-v-e1e8a1b1"]]);export{ho as default};
