if(!self.define){let s,e={};const l=(l,i)=>(l=new URL(l+".js",i).href,e[l]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=l,s.onload=e,document.head.appendChild(s)}else s=l,importScripts(l),e()})).then((()=>{let s=e[l];if(!s)throw new Error(`Module ${l} didn’t register its module`);return s})));self.define=(i,n)=>{const r=s||("document"in self?document.currentScript.src:"")||location.href;if(e[r])return;let u={};const o=s=>l(s,r),t={module:{uri:r},exports:u,require:o};e[r]=Promise.all(i.map((s=>t[s]||o(s)))).then((s=>(n(...s),u)))}}define(["./workbox-3e911b1d"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"assets/ChordFinder-BrWvFCLu.js",revision:null},{url:"assets/ChordFinder-CfOIKui9.css",revision:null},{url:"assets/ChordProgressions-DcZY-zON.css",revision:null},{url:"assets/ChordProgressions-DQTur9H_.js",revision:null},{url:"assets/Dashboard-CwuPx9Pi.js",revision:null},{url:"assets/Dashboard-DBxbHnj4.css",revision:null},{url:"assets/dom-to-image-13VFuKJy.js",revision:null},{url:"assets/Dropdown-CNdbjxPf.css",revision:null},{url:"assets/Dropdown-Cr_uC14n.js",revision:null},{url:"assets/Editor-B4ecGi4p.js",revision:null},{url:"assets/Editor-BKPD_i1z.js",revision:null},{url:"assets/Editor-Br48-nVc.css",revision:null},{url:"assets/Editor-DTUO6Iix.css",revision:null},{url:"assets/history-CG4E6KDr.js",revision:null},{url:"assets/html2canvas.esm-CBrSDip1.js",revision:null},{url:"assets/IconButton-BH4OZInV.css",revision:null},{url:"assets/IconButton-Dns8PT7Y.js",revision:null},{url:"assets/index-B7kkFBJ1.js",revision:null},{url:"assets/index-Bv1xuVbQ.js",revision:null},{url:"assets/index-BZSTa_k4.css",revision:null},{url:"assets/index-C_aRJbZJ.css",revision:null},{url:"assets/index-C_k73pfD.css",revision:null},{url:"assets/index-Cc-ECb-n.css",revision:null},{url:"assets/index-DCBioz7z.js",revision:null},{url:"assets/index-DlFw9dCn.js",revision:null},{url:"assets/index-DyCwOq9a.js",revision:null},{url:"assets/index-qoJjQ9KM.css",revision:null},{url:"assets/index-YiLDv4GV.js",revision:null},{url:"assets/index.es-ZkDG7SNN.js",revision:null},{url:"assets/inputListener-D2lKYh2m.js",revision:null},{url:"assets/Keyboard-1yrphnKZ.js",revision:null},{url:"assets/Keyboard-CFNDqzgp.css",revision:null},{url:"assets/learnSession-D4nDLafn.js",revision:null},{url:"assets/main-CFTRWoaP.js",revision:null},{url:"assets/main-CGs6MSTl.css",revision:null},{url:"assets/MidiPreview-B6QR3Atd.js",revision:null},{url:"assets/MidiPreview-B9mp8g4O.css",revision:null},{url:"assets/MinWidth-BAatWkSQ.js",revision:null},{url:"assets/MinWidth-ZCrXf6L2.css",revision:null},{url:"assets/purify.es-DGIRlouP.js",revision:null},{url:"assets/ScaleFinder-Ct4dcOvd.css",revision:null},{url:"assets/ScaleFinder-DhpTeQJi.js",revision:null},{url:"assets/ScaleQuiz-BUlxFBXI.css",revision:null},{url:"assets/ScaleQuiz-DEn7YBBT.js",revision:null},{url:"assets/Scales-BQ8fJqsX.css",revision:null},{url:"assets/scales-CBMWNTq8.js",revision:null},{url:"assets/Scales-DvpjaOGb.js",revision:null},{url:"assets/setlists-CgEJQ4N2.js",revision:null},{url:"assets/Settings-4AT-voq4.js",revision:null},{url:"assets/Settings-B5wR4xtg.css",revision:null},{url:"assets/Song-CBbnjYG8.js",revision:null},{url:"assets/Song-CdOCdIeX.css",revision:null},{url:"assets/Songs-COM-x69K.js",revision:null},{url:"assets/Songs-DQpZsZz5.css",revision:null},{url:"assets/TextInput-daAmcUed.js",revision:null},{url:"assets/TextInput-eEpP2IWD.css",revision:null},{url:"assets/vuedraggable.umd-DJQKlQjA.js",revision:null},{url:"editor.html",revision:"9fcd7a50f0ec854ce85f30b870f69004"},{url:"index.html",revision:"55d4bc4d79928fabbcff88b473b7a3c3"},{url:"registerSW.js",revision:"9991f402623542733a685415990b1f42"},{url:"manifest.webmanifest",revision:"048c14266837ddc25045b52847c40b28"}],{}),s.cleanupOutdatedCaches(),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html")))}));
