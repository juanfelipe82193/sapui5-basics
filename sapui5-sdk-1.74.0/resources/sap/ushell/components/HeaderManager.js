// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/Config","sap/ushell/EventHub","sap/ushell/utils","sap/ushell/utils/clone","sap/ushell/components/StateHelper","sap/ushell/components/_HeaderManager/PropertyStrategiesFactory","sap/base/util/ObjectPath","sap/ui/Device"],function(C,E,u,c,S,g,O,D){"use strict";var h={application:{},centralAreaElement:null,headEndItems:[],headItems:[],headerVisible:true,showLogo:false,ShellAppTitleState:undefined,rootIntent:"",title:""};var H;var a;var o="endItemsOverflowBtn";var s;var B={"blank":{},"blank-home":{},"home":{"headItems":[]},"app":{"headItems":["backBtn","homeBtn"]},"minimal":{"headItems":["homeBtn"]},"standalone":{"headItems":["backBtn"]},"embedded":{"headItems":["backBtn","homeBtn"]},"embedded-home":{"headItems":[]},"headerless":{"headItems":["backBtn","homeBtn"],"headerVisible":false},"merged":{"headItems":["backBtn","homeBtn"]},"headerless-home":{"headerVisible":false},"merged-home":{},"lean":{"headItems":[]},"lean-home":{}};var d=[];function i(I,J){var K=I&&I.appState?I.appState:"home";H=w(I);a=J;s=D.media.getCurrentRange(D.media.RANGESETS.SAP_STANDARD).name;v();_();p(K);q();}function b(){e();}function _(){var I=E.on("setHeaderCentralAreaElement").do(function(P){m({propertyName:"centralAreaElement",value:P.id,aStates:S.getPassStates(P.states),bCurrentState:!!P.currentState,bDoNotPropagate:!!P.bDoNotPropagate});});d.push(I);d.push(E.on("updateHeaderOverflowState").do(f));D.media.attachHandler(f,this,D.media.RANGESETS.SAP_STANDARD);d.push(C.on("/core/shellHeader/headEndItems").do(j));}function e(){if(d){d.forEach(function(I){I.off();});}D.media.detachHandler(f,this,D.media.RANGESETS.SAP_STANDARD);}function f(P){if(P&&P.name){s=P.name;}v();j();}function v(I){var J=C.last("/core/shell/model/currentState/stateName"),K=J==='merged'||J==='headerless',L=C.last("/core/shell/model/currentViewPortState")==="LeftCenter",M=true;if((I||s)==="Phone"&&!L||K){M=false;}m({propertyName:"showLogo",value:M,aStates:["home","app","blank","blank-home","minimal","lean"],bCurrentState:false,bDoNotPropagate:true});}function j(P){var I=C.last("/core/shellHeader/headEndItems"),J=I.indexOf(o)>-1,K=P&&P.name||s,L;if(K==="Phone"&&!J&&I.length>2){k([o],false,["home","app"]);}else if(K!=="Phone"&&J){L=sap.ui.getCore().byId('headEndItemsOverflow');if(L){L.destroy();}r([o],false,["home","app"]);}}function k(I,J,K,L){m({propertyName:"headEndItems",value:I,aStates:K,bCurrentState:!!J,bDoNotPropagate:!!L});}function r(I,J,K){m({propertyName:"headEndItems",value:I,aStates:K,bCurrentState:!!J,action:"remove",bDoNotPropagate:false});}function l(I,J){var K={};Object.keys(I).forEach(function(L){var M=I[L];K[L]=Object.keys(M).reduce(function(T,N){T[N]=M[N];return T;},c(J));});return K;}function m(P){var I=P.propertyName,J=!P.bCurrentState?S.getAllStateToUpdate(P.aStates,P.bDoNotPropagate):[],K=C.last("/core/shellHeader"),L=C.last("/core/shell/model/currentState/stateName"),M=P.value,N;if(I.charAt(0)==="/"){I=I.substring(1);}N=g(I,P.action);if(!N){return;}if(!P.bCurrentState){H=x(H,I,N,J,M);}if(J.indexOf(L)>-1||P.bCurrentState){var Q=O.get(I.split("/"),K),R=N.execute(Q,M);if(Q!==R){O.set(I.split("/"),R,K);z(I,K);}}if(P.bCurrentState){y(I,N,M);}}function n(I){var J;for(J in I){if(I.hasOwnProperty(J)){u.updateProperties(H[J],I[J]);}}}function p(N){var I=H[N];if(!I){throw new Error("the state ("+N+") does not exist");}C.emit("/core/shellHeader",c(I));}function q(I){var J=C.last("/core/shellHeader"),K,L;if(a&&a.customShellState){K=a.customShellState.currentState;}if(I&&a.extendedShellStates[I]){L=a.extendedShellStates[I].customState.currentState;}C.emit("/core/shellHeader",t(J,K,L));}function t(I,J,K){var R={};Object.keys(I).forEach(function(P){var L=g(P),M;if(!L){R[P]=c(I[P]);return;}M=c(I[P]);if(K){M=L.execute(M,K[P]);}if(J){M=L.execute(M,J[P]);}R[P]=M;});R.ShellAppTitleState=C.last("/core/shellHeader/ShellAppTitleState");return R;}function w(I){if(I){h.rootIntent="#"+I.rootIntent;}var J=l(B,h);function K(M,J){var N,P;for(N in J){if(N==="blank"||N==="blank-home"){continue;}if(M==="ActionModeBtn"&&N!=="home"){continue;}if((M==="openCatalogBtn"||M==="userSettingsBtn")&&(N==="lean"||N==="lean-home")){continue;}if(M==="ContactSupportBtn"||M==="EndUserFeedbackBtn"){if(["home","app","minimal","standalone","embedded","embedded-home","lean"].indexOf(N)===-1){continue;}}P=J[N].headEndItems.indexOf(M);if(P===-1){J[N].headEndItems.push(M);}}}function L(T,J){var M;for(M in J){J[M].title=T;}}if(I){if(I.moveEditHomePageActionToShellHeader){K("ActionModeBtn",J);}if(I.moveContactSupportActionToShellHeader){K("ContactSupportBtn",J);}if(I.moveGiveFeedbackActionToShellHeader){K("EndUserFeedbackBtn",J);}if(I.moveAppFinderActionToShellHeader){K("openCatalogBtn",J);}if(I.moveUserSettingsActionToShellHeader){K("userSettingsBtn",J);}if(I.title){L(I.title,J);}}if(C.last("/core/productSwitch/enabled")){K("productSwitchBtn",J);}return J;}function x(I,P,J,K,L){if(K.length===0){return I;}var N=c(I);K.forEach(function(M){var Q=N[M],R;if(Q){R=J.execute(O.get(P.split("/"),Q),L);O.set(P.split("/"),R,Q);}});return N;}function y(P,I,J){var K,N;if(!a){return;}K=a.customShellState.currentState;N=I.execute(O.get(P.split("/"),K),J);O.set(P.split("/"),N,K);}function z(P,I){var R=P.split("/").shift();C.emit("/core/shellHeader/"+R,I[R]);}function A(I){var J;try{J=H[I];}catch(K){J=undefined;}return J;}function F(I,P){var J;try{J=A(I)[P];}catch(K){J=undefined;}return J;}function G(T){H=T;}return{init:i,destroy:b,switchState:p,updateStates:m,recalculateState:q,extendStates:n,validateShowLogo:v,handleEndItemsOverflow:j,_resetBaseStates:G,_generateBaseHeaderState:l,_createInitialState:w,_getBaseState:A,_getBaseStateMember:F};},false);
