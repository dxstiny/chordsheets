import{d as r,u as d,n as m,o as n,i as u,w as g,f as t,t as s,e as f,p as k,k as p,j as _,_ as v}from"./main-CcMCtTv5.js";const h={class:"song"},y={class:"cover"},B=["src"],C={class:"info"},S={class:"bpm"},w={class:"key"},b=r({__name:"Song",props:{song:{type:Object,required:!0},allowDelete:{type:Boolean,default:!1},openEditorOnClick:{type:Boolean,default:!1}},emits:["delete"],setup(e,{emit:a}){const l=d(),i=a;return(x,o)=>{const c=m("router-link");return n(),u(c,{to:_(l).editorUrl(e.song.id)},{default:g(()=>[t("div",h,[t("div",y,[t("img",{src:e.song.cover||"placeholders/song.svg"},null,8,B)]),t("div",C,[t("h2",null,s(e.song.title),1),t("span",null,s(e.song.artist),1)]),t("span",S,s(e.song.bpm)+" BPM ",1),t("span",w,s(e.song.key),1),e.allowDelete?(n(),f("span",{key:0,class:"material-symbols-rounded delete",onClick:o[0]||(o[0]=k(D=>i("delete",e.song),["prevent"]))}," delete ")):p("",!0)])]),_:1},8,["to"])}}}),E=v(b,[["__scopeId","data-v-81a7e747"]]);export{E as S};
