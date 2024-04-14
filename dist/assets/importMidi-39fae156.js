import{d as S,y as w,i as x,g as C,F as T,v as P,G as I,j as N,o as k,_ as A}from"./main-01d35b45.js";import{g as D}from"./_commonjsHelpers-042e6b4d.js";const E={key:0,class:"keyboard"},V=S({__name:"MidiPreview",props:{track:{type:Object,required:!0},width:{type:Number,default:1e3},height:{type:Number,default:300}},setup(p){const v=p,u=w(()=>({width:v.width-20,height:v.height})),n=w(()=>v.track.notes),t=w(()=>{if(!n.value)return null;let s=Math.min(...n.value.map(h=>h.note)),i=Math.max(...n.value.map(h=>h.note));const d=Math.min(...n.value.map(h=>h.start)),c=Math.max(...n.value.map(h=>h.start+h.duration));return s=Math.floor(s/12)*12,i=Math.ceil(i/12)*12,{y:{min:s,max:i},x:{min:d,max:c}}}),e=w(()=>{if(!t.value)return null;const{x:s,y:i}=t.value,d=u.value.width/s.max,c=u.value.height/(i.max-i.min+1);return{x:d,y:c}}),l=()=>{if(!e.value||!t.value)return null;const{x:s,y:i}=t.value;return!s||!i?null:{height:`${e.value.y*(1+i.max-i.min)}px`,width:`${e.value.x*s.max}px`}},f=s=>{if(!e.value||!t.value)return null;const{x:i,y:d}=t.value;if(!i||!d)return null;const c=s.note-d.min,h=s.start;return{backgroundColor:"var(--accent)",position:"absolute",height:`${e.value.y}px`,width:`${s.duration*e.value.x}px`,bottom:`${c*e.value.y}px`,left:`${h*e.value.x}px`}},a=()=>{if(!e.value||!t.value)return null;const{x:s,y:i}=t.value;if(!s||!i)return null;const d=[];for(let c=i.min;c<=i.max;c++){const b=[1,3,6,8,10].includes(c%12)?"var(--color-background-soft)":"var(--color-background)",y=v.track.signature.clocksPerTick*v.track.signature.numerator,M=2**v.track.signature.denominator;let m="repeating-linear-gradient(to right,";for(let g=0;g<M;g++){const F=g%M===M-1?"black":"var(--color-background-soft)",U=g*y*e.value.x,$=(g+1)*y*e.value.x;m+=`${b} ${U+1}px,`,m+=`${b} ${$}px,`,m+=`${F} ${$}px,`,m+=`${F} ${$+1}px,`}m=m.slice(0,-1)+")",d.push({background:m,position:"absolute",height:`${e.value.y}px`,width:u.value.width+"px",bottom:`${(c-i.min)*e.value.y}px`,left:"0px"})}return d},o=()=>{if(!e.value||!t.value)return null;const{x:s,y:i}=t.value;if(!s||!i)return null;const d=[];for(let c=i.min;c<=i.max;c++){const h=[1,3,6,8,10].includes(c%12),b=c%12===0,B=h?"black":b?"lightgrey":"white",y=h?.7:1;d.push({backgroundColor:B,position:"absolute",height:`${e.value.y}px`,width:`${20*y}px`,bottom:`${(c-i.min)*e.value.y}px`,left:"0px"}),h&&d.push({backgroundColor:"white",position:"absolute",height:`${e.value.y}px`,width:`${20*(1-y)}px`,bottom:`${(c-i.min)*e.value.y}px`,left:`${y*100*e.value.x}px`})}return d},r=()=>{if(!e.value||!t.value)return null;const{x:s,y:i}=t.value;return!s||!i?null:{height:`${(1+i.max-i.min)*e.value.y}px`,width:"20px"}};return(s,i)=>p.track?(k(),x("div",E,[C("div",{class:"keys",style:I(r())},[(k(!0),x(T,null,P(o(),d=>(k(),x("div",{style:I(d)},null,4))),256))],4),C("div",{class:"notes",style:I(l())},[(k(!0),x(T,null,P(a(),d=>(k(),x("div",{style:I(d)},null,4))),256)),(k(!0),x(T,null,P(n.value,d=>(k(),x("div",{class:"note",style:I(f(d))},null,4))),256))],4)])):N("",!0)}});const Z=A(V,[["__scopeId","data-v-c2612ebf"]]);var L={exports:{}};(function(p){(function(){const v=function(n){let t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",e=/^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;if(n=n.replace(/^.*?base64,/,""),n=String(n).replace(/[\t\n\f\r ]+/g,""),!e.test(n))throw new TypeError("Failed to execute _atob() : The string to be decoded is not correctly encoded.");n+="==".slice(2-(n.length&3));let l,f="",a,o,r=0;for(;r<n.length;)l=t.indexOf(n.charAt(r++))<<18|t.indexOf(n.charAt(r++))<<12|(a=t.indexOf(n.charAt(r++)))<<6|(o=t.indexOf(n.charAt(r++))),f+=a===64?String.fromCharCode(l>>16&255):o===64?String.fromCharCode(l>>16&255,l>>8&255):String.fromCharCode(l>>16&255,l>>8&255,l&255);return f},u={debug:!1,parse:function(n,t){if(n instanceof Uint8Array)return u.Uint8(n);if(typeof n=="string")return u.Base64(n);if(n instanceof HTMLElement&&n.type==="file")return u.addListener(n,t);throw new Error("MidiParser.parse() : Invalid input provided")},addListener:function(n,t){if(!File||!FileReader)throw new Error("The File|FileReader APIs are not supported in this browser. Use instead MidiParser.Base64() or MidiParser.Uint8()");if(n===void 0||!(n instanceof HTMLElement)||n.tagName!=="INPUT"||n.type.toLowerCase()!=="file")return console.warn("MidiParser.addListener() : Provided element is not a valid FILE INPUT element"),!1;t=t||function(){},n.addEventListener("change",function(e){if(!e.target.files.length)return!1;console.log("MidiParser.addListener() : File detected in INPUT ELEMENT processing data..");let l=new FileReader;l.readAsArrayBuffer(e.target.files[0]),l.onload=function(f){t(u.Uint8(new Uint8Array(f.target.result)))}})},Base64:function(n){n=String(n);let t=v(n),e=t.length,l=new Uint8Array(new ArrayBuffer(e));for(let f=0;f<e;f++)l[f]=t.charCodeAt(f);return u.Uint8(l)},Uint8:function(n){let t={data:null,pointer:0,movePointer:function(a){return this.pointer+=a,this.pointer},readInt:function(a){if(a=Math.min(a,this.data.byteLength-this.pointer),a<1)return-1;let o=0;if(a>1)for(let r=1;r<=a-1;r++)o+=this.data.getUint8(this.pointer)*Math.pow(256,a-r),this.pointer++;return o+=this.data.getUint8(this.pointer),this.pointer++,o},readStr:function(a){let o="";for(let r=1;r<=a;r++)o+=String.fromCharCode(this.readInt(1));return o},readIntVLV:function(){let a=0;if(this.pointer>=this.data.byteLength)return-1;if(this.data.getUint8(this.pointer)<128)a=this.readInt(1);else{let o=[];for(;this.data.getUint8(this.pointer)>=128;)o.push(this.readInt(1)-128);let r=this.readInt(1);for(let s=1;s<=o.length;s++)a+=o[o.length-s]*Math.pow(128,s);a+=r}return a}};if(t.data=new DataView(n.buffer,n.byteOffset,n.byteLength),t.readInt(4)!==1297377380)return console.warn("Header validation failed (not MIDI standard or file corrupt.)"),!1;t.readInt(4);let e={};e.formatType=t.readInt(2),e.tracks=t.readInt(2),e.track=[];let l=t.readInt(1),f=t.readInt(1);l>=128?(e.timeDivision=[],e.timeDivision[0]=l-128,e.timeDivision[1]=f):e.timeDivision=l*256+f;for(let a=1;a<=e.tracks;a++){e.track[a-1]={event:[]};let o=t.readInt(4);if(o===-1)break;if(o!==1297379947)return!1;t.readInt(4);let r=0,s=!1,i,d;for(;!s&&(r++,e.track[a-1].event[r-1]={},e.track[a-1].event[r-1].deltaTime=t.readIntVLV(),i=t.readInt(1),i!==-1);)if(i>=128?d=i:(i=d,t.movePointer(-1)),i===255){e.track[a-1].event[r-1].type=255,e.track[a-1].event[r-1].metaType=t.readInt(1);let c=t.readIntVLV();switch(e.track[a-1].event[r-1].metaType){case 47:case-1:s=!0;break;case 1:case 2:case 3:case 4:case 5:case 7:case 6:e.track[a-1].event[r-1].data=t.readStr(c);break;case 33:case 89:case 81:e.track[a-1].event[r-1].data=t.readInt(c);break;case 84:e.track[a-1].event[r-1].data=[],e.track[a-1].event[r-1].data[0]=t.readInt(1),e.track[a-1].event[r-1].data[1]=t.readInt(1),e.track[a-1].event[r-1].data[2]=t.readInt(1),e.track[a-1].event[r-1].data[3]=t.readInt(1),e.track[a-1].event[r-1].data[4]=t.readInt(1);break;case 88:e.track[a-1].event[r-1].data=[],e.track[a-1].event[r-1].data[0]=t.readInt(1),e.track[a-1].event[r-1].data[1]=t.readInt(1),e.track[a-1].event[r-1].data[2]=t.readInt(1),e.track[a-1].event[r-1].data[3]=t.readInt(1);break;default:this.customInterpreter!==null&&(e.track[a-1].event[r-1].data=this.customInterpreter(e.track[a-1].event[r-1].metaType,t,c)),(this.customInterpreter===null||e.track[a-1].event[r-1].data===!1)&&(t.readInt(c),e.track[a-1].event[r-1].data=t.readInt(c),this.debug&&console.info("Unimplemented 0xFF meta event! data block readed as Integer"))}}else switch(i=i.toString(16).split(""),i[1]||i.unshift("0"),e.track[a-1].event[r-1].type=parseInt(i[0],16),e.track[a-1].event[r-1].channel=parseInt(i[1],16),e.track[a-1].event[r-1].type){case 15:{if(this.customInterpreter!==null&&(e.track[a-1].event[r-1].data=this.customInterpreter(e.track[a-1].event[r-1].type,t,!1)),this.customInterpreter===null||e.track[a-1].event[r-1].data===!1){let c=t.readIntVLV();e.track[a-1].event[r-1].data=t.readInt(c),this.debug&&console.info("Unimplemented 0xF exclusive events! data block readed as Integer")}break}case 10:case 11:case 14:case 8:case 9:e.track[a-1].event[r-1].data=[],e.track[a-1].event[r-1].data[0]=t.readInt(1),e.track[a-1].event[r-1].data[1]=t.readInt(1);break;case 12:case 13:e.track[a-1].event[r-1].data=t.readInt(1);break;case-1:s=!0;break;default:if(this.customInterpreter!==null&&(e.track[a-1].event[r-1].data=this.customInterpreter(e.track[a-1].event[r-1].metaType,t,!1)),this.customInterpreter===null||e.track[a-1].event[r-1].data===!1)return console.log("Unknown EVENT detected... reading cancelled!"),!1}}return e},customInterpreter:null};p.exports=u})()})(L);var _=L.exports;const O=D(_),K=p=>{var f,a;if(!p)return null;const{track:v}=p,u=v.filter(o=>o.event.some(r=>r.type===9||r.type===8)),n=(f=u[0].event.find(o=>o.metaType===3&&o.type===255))==null?void 0:f.data,t=(a=v.find(o=>o.event.some(r=>r.metaType===88&&r.type===255)))==null?void 0:a.event.map(o=>o.data).flat();if(!t)return null;const e={numerator:t[0],denominator:t[1],clocksPerTick:t[2],notesPerQuarter:t[3]},l=u.map(o=>o.event.filter(s=>s.type===9||s.type===8)).flat();return{name:n,signature:e,notes:R(l)}},H=async p=>new Promise((v,u)=>{const n=new FileReader;n.onload=t=>{if(!t.target){u("No target");return}const e=t.target.result,l=O.parse(e);v(K(l))},n.readAsDataURL(p)}),R=p=>{const v=[],u={};let n=0;for(const t of p)if(n+=t.deltaTime,t.type===9)u[t.data[0]]={start:n,velocity:t.data[1]};else if(t.type===8){const e=u[t.data[0]];if(!e)continue;const l=n-e.start;v.push({note:t.data[0],velocity:e.velocity,duration:l,start:e.start}),delete u[t.data[0]]}return v};export{Z as M,H as m};
