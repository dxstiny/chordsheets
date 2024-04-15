import{d as J,r as E,n as q,q as Z,o as X,s as ee,g as m,k,m as oe,v as te,x as se,y as g,z as R,A as I,B as L,_ as Q,u as ne,c as le,F as D,C as H,i as s,h as y,w as p,t as h,D as C,l as j,f as K,E as O,G as F,p as ae,j as de}from"./main-e2930811.js";import{d as ie,E as re,a as W}from"./dom-to-image-be0e4674.js";const ue=["onDblclick"],ce=["placeholder"],pe=J({__name:"EditableText",props:{modelValue:{type:String,required:!0},locked:{type:Boolean,default:!1},noOutline:{type:Boolean,default:!1},placeholder:{type:String,default:"Click to edit"}},emits:["update:modelValue","change"],setup(l,{emit:x}){const i=l,$=E(i.modelValue);q(()=>i.modelValue,U=>$.value=U);const _=E(!1),f=E(null),P=()=>{i.locked||(_.value=!0,L(()=>{f.value&&f.value.focus()}))},T=Z(()=>i.locked?!0:_.value?!1:$.value||$.value=="0"),z=U=>{$.value=U,x("change",U),x("update:modelValue",U)},S=()=>{f.value&&(f.value.style.height="auto",f.value.style.height=f.value.scrollHeight+"px")};return X(()=>S()),ee(()=>{_.value&&S()}),(U,u)=>(m(),k("div",{class:I(["editable-text",{outlined:!l.noOutline&&_.value}]),onDblclick:g(P,["stop"])},[T.value?oe(U.$slots,"default",{key:0},void 0,!0):te((m(),k("input",{key:1,ref_key:"area",ref:f,type:"text",class:"textarea","onUpdate:modelValue":u[0]||(u[0]=w=>$.value=w),onChange:u[1]||(u[1]=w=>z(w.target.value)),onInput:u[2]||(u[2]=w=>S()),onClick:u[3]||(u[3]=g(w=>_.value=!0,["stop"])),onKeydown:[u[4]||(u[4]=R(w=>_.value=!1,["enter"])),u[5]||(u[5]=R(w=>_.value=!1,["esc"]))],onBlur:u[6]||(u[6]=w=>_.value=!1),placeholder:l.placeholder},null,40,ce)),[[se,$.value]])],42,ue))}});const V=Q(pe,[["__scopeId","data-v-793c6cbc"]]),b=l=>(ae("data-v-b42aa6c2"),l=l(),de(),l),me={class:"editor__header"},ge={class:"wrap-to-line"},fe={class:"info"},ve=b(()=>s("span",{class:"material-symbols-rounded"},"music_note",-1)),he={class:"info"},ye=b(()=>s("span",{class:"material-symbols-rounded"},"piano",-1)),Ve={class:"info"},ke={class:"material-symbols-rounded"},Ce={class:"info"},_e=b(()=>s("span",{class:"material-symbols-rounded"}," check ",-1)),we={class:"capitalise"},be=["onClick"],Ue=b(()=>s("span",{class:"material-symbols-rounded"}," add ",-1)),$e=b(()=>s("hr",null,null,-1)),Me={class:"instruments"},Ee={class:"instrument"},Se=["onClick"],Pe={class:"flex space-between"},Be={class:"flex gap-2"},De=b(()=>s("span",{class:"material-symbols-rounded"}," volume_up ",-1)),xe={class:"settings"},Te={class:"muted"},ze=b(()=>s("span",{class:"material-symbols-rounded"}," add ",-1)),Ae=b(()=>s("hr",null,null,-1)),He=["id"],Ie={class:"name"},Le={class:"buttons"},Ke=["onClick"],Oe=["onClick"],We={key:0,class:"progression"},qe=["onClick"],Ne=b(()=>s("span",{class:"material-symbols-rounded"}," add ",-1)),Ge=["id","onMousedown","onMouseup"],Re=["onClick"],je=["id"],Fe={class:"name"},Je={class:"buttons"},Xe=["onClick"],Qe=["onClick"],Ye={key:0,class:"progression"},Ze=["onClick"],eo=b(()=>s("span",{class:"material-symbols-rounded"}," add ",-1)),oo=["id","onMousedown","onMouseup"],to=["onClick"],so=b(()=>s("span",{class:"material-symbols-rounded"}," add ",-1)),no=J({__name:"Editor",props:{song:{type:Object,required:!0},printing:{type:Boolean,default:!1}},setup(l,{expose:x}){const i=l,$=ne(),_=E(!1),f=E(i.printing),P=E(),T=(n,e)=>{const r=i.song.sections[n].progression[e],o={chord:r.chord,duration:r.duration};i.song.sections[n].progression.splice(e+1,0,o)},z=n=>{if(n.key==="Delete")for(const e of i.song.sections)e.progression=e.progression.filter(a=>!a.selected);if(n.ctrlKey&&(n.key==="d"||n.key==="b")){n.preventDefault();for(const e of i.song.sections){const a=e.progression.filter(r=>r.selected);e.progression.splice(e.progression.indexOf(a[a.length-1])+1,0,...a.map(r=>({chord:r.chord,duration:r.duration,selected:!0}))),a.forEach(r=>r.selected=!1)}}n.ctrlKey&&n.key==="p"&&(n.preventDefault(),Y())},S=(n,e)=>{if(e.button===2)return;const a=e.target;if(e.offsetX>a.clientWidth-10){e.preventDefault(),e.stopImmediatePropagation(),_.value=!0;const r=a.getBoundingClientRect().width/n.duration;let o=0;const d=v=>{const c=v.clientX-a.getBoundingClientRect().left;o=Math.round(c/r),n.duration=Math.max(1,Math.min(16,o))},t=v=>{window.removeEventListener("mousemove",d),window.removeEventListener("mouseup",t),_.value=!1,v.stopImmediatePropagation()};window.addEventListener("mousemove",d),window.addEventListener("mouseup",t)}},U=(n,e)=>{let a=n.selected;if(!e.shiftKey)for(const r of i.song.sections)for(const o of r.progression)o.selected=!1;n.selected=!a},u=n=>{i.song.sections.splice(n,1)},w=n=>{const e=i.song.sections[n],a={type:e.type,progression:e.progression.map(r=>({chord:r.chord,duration:r.duration})),page:0};i.song.sections.splice(n+1,0,a)},N=async n=>{console.log("rendering to pdf");const e=P.value.querySelectorAll(".editor");let a=e[0];const r=a.clientHeight/a.clientWidth;for(let t=0;t<e.length;t++){if(a=e[t],!a)continue;var o=n.internal.pageSize.getWidth(),d=n.internal.pageSize.getHeight();const v=2,c=await ie.toJpeg(a,{height:a.clientHeight*v,width:a.clientWidth*v,style:{transform:`scale(${v}) translate(${a.clientWidth/2/v}px, ${a.clientHeight/2/v}px)`}});d=r*o,n.addImage(c,"JPG",0,0,o,d),t+1<e.length&&n.addPage()}return n};let A;const G=async()=>{f.value=!0,i.song.sections.length&&!i.printing&&await new Promise(a=>{A=a});const n=new re({orientation:"portrait",unit:"px",format:"a4"});return await N(n),f.value=i.printing,n},Y=async()=>{await $.prepareRender();const n=await G();n&&(n.autoPrint(),window.open(n.output("bloburl"),"_blank"))};X(()=>{window.addEventListener("keydown",z),B()}),le(()=>{window.removeEventListener("keydown",z)});const M=E([]),B=()=>{if(i.song.sections.length==0){M.value=[{start:0,end:0}];return}if(!f.value||M.value.length==0){M.value=[{start:0,end:i.song.sections.length}],f.value&&i.song.sections.length>0&&L(B);return}const n=P.value.querySelectorAll(".section");if(n.length==0)return;const e=n[0].parentElement,a=getComputedStyle(e),r=e.clientHeight-parseFloat(a.paddingBottom);for(let o=0;o<n.length;o++){const d=n[o];if(d.offsetTop+d.offsetHeight>r){M.value[M.value.length-1].end=o,M.value.push({start:o,end:i.song.sections.length}),L(B);return}}A==null||A()};return q(()=>i.song,B,{deep:!0}),q(f,()=>L(B)),x({renderTo:N,render:G,name:()=>i.song.title}),(n,e)=>(m(),k("div",{ref_key:"parent",ref:P},[(m(!0),k(D,null,H(M.value,(a,r)=>(m(),k("div",{class:I(["editor",{resizing:_.value,print:f.value}]),onDragover:e[18]||(e[18]=g(()=>{},["prevent"]))},[r==0?(m(),k(D,{key:0},[s("div",me,[y(V,{modelValue:l.song.artist,"onUpdate:modelValue":e[0]||(e[0]=o=>l.song.artist=o),class:"left",placeholder:"Click to edit artist name","no-outline":""},{default:p(()=>[s("h3",null,h(l.song.artist),1)]),_:1},8,["modelValue"]),y(V,{modelValue:l.song.title,"onUpdate:modelValue":e[1]||(e[1]=o=>l.song.title=o),class:"left h1",placeholder:"Click to edit song title","no-outline":""},{default:p(()=>[s("h1",null,h(l.song.title),1)]),_:1},8,["modelValue"])]),s("div",ge,[s("div",fe,[ve,y(V,{modelValue:l.song.bpm,"onUpdate:modelValue":e[2]||(e[2]=o=>l.song.bpm=o),class:"left short",placeholder:"120"},{default:p(()=>[C(h(l.song.bpm),1)]),_:1},8,["modelValue"]),C(" BPM ")]),s("div",he,[ye,y(V,{modelValue:l.song.key,"onUpdate:modelValue":e[3]||(e[3]=o=>l.song.key=o),class:"left short",placeholder:"C"},{default:p(()=>[C(h(l.song.key),1)]),_:1},8,["modelValue"])]),s("div",Ve,[s("span",ke,h(l.song.transpose>0?"arrow_upward":l.song.transpose<0?"arrow_downward":"drag_handle"),1),y(V,{modelValue:l.song.transpose,"onUpdate:modelValue":e[4]||(e[4]=o=>l.song.transpose=o),class:"left short",placeholder:"0"},{default:p(()=>[C(h(l.song.transpose),1)]),_:1},8,["modelValue"])]),l.song.options?(m(!0),k(D,{key:0},H(l.song.options,(o,d)=>(m(),k("div",Ce,[_e,y(V,{modelValue:l.song.options[d],"onUpdate:modelValue":t=>l.song.options[d]=t,class:"left",placeholder:"Option"},{default:p(()=>[s("span",we,h(o),1)]),_:2},1032,["modelValue","onUpdate:modelValue"]),s("span",{onClick:t=>l.song.options.splice(d,1),class:"delete material-symbols-rounded"}," delete ",8,be)]))),256)):j("",!0),s("div",{class:"info add-option",onClick:e[5]||(e[5]=o=>l.song.options?l.song.options.push("Sustain"):l.song.options=["Sustain"])},[Ue,C(" Add Option ")])]),$e,s("div",Me,[(m(!0),k(D,null,H(l.song.instruments,(o,d)=>(m(),k("div",Ee,[s("span",{onClick:t=>l.song.instruments.splice(d,1),class:"delete material-symbols-rounded"}," delete ",8,Se),s("div",Pe,[y(V,{modelValue:o.for,"onUpdate:modelValue":t=>o.for=t,class:"left short",placeholder:"Click to edit instrument","no-outline":""},{default:p(()=>[s("span",null,h(o.for),1)]),_:2},1032,["modelValue","onUpdate:modelValue"]),s("span",Be,[De,y(V,{modelValue:o.volume,"onUpdate:modelValue":t=>o.volume=t,class:"left short",placeholder:"100"},{default:p(()=>[C(h(o==null?void 0:o.volume),1)]),_:2},1032,["modelValue","onUpdate:modelValue"])])]),s("div",xe,[y(V,{modelValue:o.name,"onUpdate:modelValue":t=>o.name=t,class:"left h3",placeholder:"Click to edit instrument name","no-outline":""},{default:p(()=>[s("h3",null,h(o.name),1)]),_:2},1032,["modelValue","onUpdate:modelValue"]),s("span",Te,[y(V,{modelValue:o.type,"onUpdate:modelValue":t=>o.type=t,class:"left",placeholder:"Click to edit instrument type","no-outline":""},{default:p(()=>[C(h(o==null?void 0:o.type),1)]),_:2},1032,["modelValue","onUpdate:modelValue"])])])]))),256)),s("div",{class:"instrument add-option",onClick:e[6]||(e[6]=o=>l.song.instruments.push({name:"ConcertGrand",for:"R1",type:"Piano",volume:100}))},[ze,C(" Add Instrument ")])]),Ae],64)):j("",!0),f.value?(m(!0),k(D,{key:2},H(i.song.sections.slice(a.start,a.end),(o,d)=>(m(),k("div",{class:"section",id:`section-${d}`},[y(V,{modelValue:o.type,"onUpdate:modelValue":t=>o.type=t,class:"left",placeholder:"Click to edit section name","no-outline":""},{default:p(()=>[s("span",Fe,h(o.type),1)]),_:2},1032,["modelValue","onUpdate:modelValue"]),s("div",Je,[s("span",{class:"button material-symbols-rounded",onClick:t=>w(d)}," content_copy ",8,Xe),s("span",{class:"button material-symbols-rounded",onClick:t=>u(d)}," delete ",8,Qe)]),o.progression.length===0?(m(),k("div",Ye,[s("div",{class:"chord create",style:{"--cols":4},onClick:g(t=>o.progression.push({chord:"C",duration:4}),["stop"])},[eo,C(" Add Chord ")],8,Ze)])):(m(),K(O(W),{key:1,modelValue:o.progression,"onUpdate:modelValue":t=>o.progression=t,class:"progression",onDragover:e[16]||(e[16]=g(()=>{},["stop"]))},{item:p(({element:t,index:v})=>[s("div",{class:I(["chord",t.selected?" selected":""]),ref_for:!0,ref:"chordElements",id:`chord-${d}-${v}`,onMousedown:c=>S(t,c),onMouseup:c=>U(t,c),onClick:e[15]||(e[15]=g(()=>{},["stop"])),style:F({"--cols":t.duration})},[y(V,{modelValue:t.chord,"onUpdate:modelValue":c=>t.chord=c,"no-outline":"",placeholder:"C"},{default:p(()=>[C(h(t.chord),1)]),_:2},1032,["modelValue","onUpdate:modelValue"]),s("span",{class:"insert_chord_here",onMousedown:e[13]||(e[13]=g(()=>{},["stop"])),onMouseup:e[14]||(e[14]=g(()=>{},["stop"])),onClick:g(c=>T(d,v),["stop"])},null,40,to)],46,oo)]),_:2},1032,["modelValue","onUpdate:modelValue"]))],8,je))),256)):(m(),K(O(W),{key:1,modelValue:l.song.sections,"onUpdate:modelValue":e[11]||(e[11]=o=>l.song.sections=o),class:"editor__content",onDragover:e[12]||(e[12]=g(()=>{},["stop"]))},{item:p(({element:o,index:d})=>[s("div",{class:"section",id:`section-${d}`},[y(V,{modelValue:o.type,"onUpdate:modelValue":t=>o.type=t,class:"left",placeholder:"Click to edit section name","no-outline":""},{default:p(()=>[s("span",Ie,h(o.type),1)]),_:2},1032,["modelValue","onUpdate:modelValue"]),s("div",Le,[s("span",{class:"button material-symbols-rounded",onClick:t=>w(d)}," content_copy ",8,Ke),s("span",{class:"button material-symbols-rounded",onClick:t=>u(d)}," delete ",8,Oe)]),o.progression.length===0?(m(),k("div",We,[s("div",{class:"chord create",style:{"--cols":4},onClick:g(t=>o.progression.push({chord:"C",duration:4}),["stop"])},[Ne,C(" Add Chord ")],8,qe)])):(m(),K(O(W),{key:1,modelValue:o.progression,"onUpdate:modelValue":t=>o.progression=t,class:"progression",onDragover:e[10]||(e[10]=g(()=>{},["stop"]))},{item:p(({element:t,index:v})=>[s("div",{class:I(["chord",t.selected?" selected":""]),ref_for:!0,ref:"chordElements",id:`chord-${d}-${v}`,onMousedown:c=>S(t,c),onMouseup:c=>U(t,c),onClick:e[9]||(e[9]=g(()=>{},["stop"])),style:F({"--cols":t.duration})},[y(V,{modelValue:t.chord,"onUpdate:modelValue":c=>t.chord=c,"no-outline":"",placeholder:"C"},{default:p(()=>[C(h(t.chord),1)]),_:2},1032,["modelValue","onUpdate:modelValue"]),s("span",{class:"insert_chord_here",onMousedown:e[7]||(e[7]=g(()=>{},["stop"])),onMouseup:e[8]||(e[8]=g(()=>{},["stop"])),onClick:g(c=>T(d,v),["stop"])},null,40,Re)],46,Ge)]),_:2},1032,["modelValue","onUpdate:modelValue"]))],8,He)]),_:2},1032,["modelValue"])),s("div",{class:"add-section",id:"add-section",onClick:e[17]||(e[17]=o=>l.song.sections.push({type:"New Section",progression:[]}))},[so,C(" Add Section ")])],34))),256))],512))}});const io=Q(no,[["__scopeId","data-v-b42aa6c2"]]);export{io as E};
