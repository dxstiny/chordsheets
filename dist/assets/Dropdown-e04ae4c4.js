import{d as u,c as e,t as r,l as a,q as h,n as m,o as t,b as p,F as y,g as _}from"./main-5e89385d.js";import{_ as l}from"./_plugin-vue_export-helper-c27b6911.js";const b=["disabled"],E={key:0,class:"material-symbols-rounded"},g={key:1},v=u({__name:"IconButton",props:{icon:{required:!1,type:String},label:{required:!1,type:String},style:{required:!1,type:String},disabled:{required:!1,type:Boolean,default:!1}},setup(o){return(d,i)=>(t(),e("button",{class:h(["icon-button",{disabled:o.disabled}]),style:m(o.style?`--accent: var(--color-${o.style})`:""),disabled:o.disabled},[o.icon?(t(),e("i",E,r(o.icon),1)):a("",!0),o.label?(t(),e("span",g,r(o.label),1)):a("",!0)],14,b))}});const I=l(v,[["__scopeId","data-v-aec48a12"]]),k=["Major","Major Pentatonic","Minor","Minor Pentatonic","Blues Major","Blues Minor","Dorian","Phrygian","Lydian","Mixolydian","Locrian","Harmonic Minor","Melodic Minor","Super Locrian","Hungarian Minor","Minor Gypsy","Double Harmonic"],A=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"],G=["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"],q=["intro","verse","pre-chorus","chorus","bridge","break","fill","solo","interlude","outro","(other)"],F=["Piano","Guitar","Strings","Choir & Pad","Drum Kit","E. Piano","Bass","Brass","Synth","Organ Flutes","Organ","Accordion","Woodwind","Percussion"].sort(),x={title:"",artist:"",spotify:"",cover:"",bpm:120,key:"C",transpose:0,octave:0,sections:[],instruments:{},options:{touch:!1,sustain:!1,mono:!1},structure:[],id:0};new Date().getTime();const D={class:"input"},C={key:0},f=["value"],S=["value"],B=u({__name:"Dropdown",props:{modelValue:{required:!0,type:String},label:{required:!1,type:String},options:{required:!0,type:Array}},emits:["update:modelValue"],setup(o,{emit:d}){const i=s=>{const c=s.target.value;d("update:modelValue",c)};return(s,c)=>(t(),e("div",D,[o.label?(t(),e("h2",C,r(o.label),1)):a("",!0),p("select",{value:o.modelValue,onInput:i,class:"dropdown"},[(t(!0),e(y,null,_(o.options,n=>(t(),e("option",{key:n,value:n},r(n),9,S))),128))],40,f)]))}});const L=l(B,[["__scopeId","data-v-03e50cd6"]]);export{L as D,G as F,I,q as S,F as a,A as b,k as c,x as e};
