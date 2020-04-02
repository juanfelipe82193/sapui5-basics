/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/mvc/View","sap/ui/core/Component"],function(V,C){"use strict";function g(c){while(c&&!(c instanceof V)){c=c.getParent();}return c;}function h(l){var H=false;l.getCurrentContexts().forEach(function(c){if(c&&c.isTransient()){H=true;}});return H;}function G(c){var b=c.getBinding().getDependentBindings();return(b&&b[0].isPatchWithoutSideEffects()&&b[0].getBoundContext())||c;}function u(o){var U=sap.ushell&&sap.ushell.Container;var x=U&&U.getService("CrossApplicationNavigation");var b=U&&U.getService("URLParsing");var p=b&&b.parseShellHash(document.location.hash);var c=p.semanticObject;var s=p.action;var m=o.getModel().getMetaModel();var B=o.getBindingContext();var P=B&&B.getPath();var M=m.getMetaPath(P);var S=M+"/"+"@com.sap.vocabularies.Common.v1.SemanticKey";var d=m.getObject(S);var e=m.getObject(M+"/"+"@com.sap.vocabularies.Common.v1.SemanticObjectUnavailableActions");var E=B.getObject();var f={};if(E){if(d&&d.length>0){for(var j=0;j<d.length;j++){var k=d[j].$PropertyPath;if(!f[k]){f[k]=[];f[k].push(E[k]);}}}else{var t=m.getObject(M+"/$Type/$Key");for(var l in t){var O=t[l];if(!f[O]){f[O]=[];f[O].push(E[O]);}}}}var L=x.getLinks({semanticObject:c,params:f});L.done(function(n){n.sort(function(w,y){if(w.text<y.text){return-1;}if(w.text>y.text){return 1;}return 0;});if(n&&n.length>0){var I=[];for(var i=0;i<n.length;i++){var q=n[i];var v=q.intent;var A=v.split("-")[1].split("?")[0];if(A!==s&&(!e||(e&&e.indexOf(A)===-1))){I.push({text:q.text,targetSemObject:v.split("#")[1].split("-")[0],targetAction:A.split("~")[0],targetParams:f});}}o.getModel("relatedAppsModel").setProperty("/visibility",I.length>0);o.getModel("relatedAppsModel").setProperty("/items",I);}else{o.getModel("relatedAppsModel").setProperty("/visibility",false);}});}function r(v){if(v==="true"||v===true){return true;}else{return false;}}function a(c){var o=C.getOwnerComponentFor(c);if(!o){return c;}else{return a(o);}}return{getParentViewOfControl:g,hasTransientContext:h,getContextForSideEffects:G,updateRelatedAppsDetails:u,resolveStringtoBoolean:r,getAppComponent:a};});
