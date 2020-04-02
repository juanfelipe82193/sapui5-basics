//@ui5-bundle sap/ui/fl/designtime/library-preload.designtime.js
/*
 * ! OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine('sap/ui/fl/designtime/appVariant/AppVariantModifier',["sap/ui/fl/descriptorRelated/api/DescriptorInlineChangeFactory","sap/ui/fl/designtime/appVariant/ModifierUtils","sap/base/util/includes"],function(D,M,i){"use strict";var A={};A.DESCRIPTOR_CHANGE_PATTERN={NAMESPACE:"/descriptorChanges/",FILETYPE:".change"};var _=D.getCondensableDescriptorChangeTypes();var a="/manifest.appdescr_variant";
function b(c){return i(_,c);}
function s(c,C){if(c.creation===C.creation){return 0;}return c.creation>C.creation?1:-1;}
A.modify=function(n,f){if(f.length!==0){var S=A._separateDescriptorAndInlineChangesFromOtherFiles(f);var r=S.inlineChanges.concat(S.descriptorChanges.sort(s)).concat(n.content);n.content=A._condenseDescriptorChanges(r);f=S.otherFiles;}f.push({fileName:a,content:JSON.stringify(n)});return f;};
A._separateDescriptorAndInlineChangesFromOtherFiles=function(f){var d=[];var I=[];var o=[];f.forEach(function(F){if(M.fileNameMatchesPattern(F.fileName,A.DESCRIPTOR_CHANGE_PATTERN)){var c=JSON.parse(F.content);d.push(c);}else if(F.fileName===a){var O=JSON.parse(F.content);I=O.content;}else{o.push(F);}});return{descriptorChanges:d,inlineChanges:I,otherFiles:o};};
A._condenseDescriptorChanges=function(d){var c=[];var C=[];d.reverse().forEach(function(o){var e=o.changeType;if(!i(c,e)){C.push(o);if(b(e)){c.push(e);}}});return C.reverse();};
return A;});
sap.ui.predefine('sap/ui/fl/designtime/appVariant/AppVariantUtils',["sap/ui/fl/designtime/appVariant/ChangeModifier","sap/ui/fl/designtime/appVariant/AppVariantModifier","sap/ui/fl/designtime/appVariant/ModuleModifier"],function(C,A,M){"use strict";var a={};
a.prepareContent=function(f,n,N,s,S){S=S||sap.ui.fl.Scenario.VersionedAppVariant;return new Promise(function(r,b){if(!f||!n||!N||!s){b("Not all parameters were passed!");}r(f);}).then(M.modify.bind(M,N)).then(C.modify.bind(C,N,s,S)).then(A.modify.bind(A,n));};
return a;});
sap.ui.predefine('sap/ui/fl/designtime/appVariant/ChangeModifier',["sap/ui/fl/Utils","sap/ui/fl/designtime/appVariant/ModifierUtils"],function(U,M){"use strict";var C={};C.CHANGE_PATTERN={NAMESPACE:"/changes/",FILETYPE:".change"};
C.modify=function(n,N,s,f){return f.map(function(F){if(M.fileNameMatchesPattern(F.fileName,C.CHANGE_PATTERN)){F.content=C._modifyChangeFile(F.content,n,N,s);}return F;});};
var _=new RegExp("(apps/[^/]*/).*/","g");
C._modifyChangeFile=function(c,n,N,s){var o=JSON.parse(c);o.reference=n;o.validAppVersions=U.getValidAppVersions({appVersion:N,developerMode:true,scenario:s});o.support.generator="appVariant.UiChangeModifier";o.support.user="";o.projectId=n;o.packageName="";o.namespace=C._adjustFileName(o.namespace,n);return JSON.stringify(o);};
C._adjustFileName=function(n,N){return n.replace(_,"$1appVariants/"+N+"/changes/");};
return C;});
sap.ui.predefine('sap/ui/fl/designtime/appVariant/ModifierUtils',[],function(){"use strict";var M={};
M.fileNameMatchesPattern=function(f,p){if(f.startsWith(p.NAMESPACE)&&f.endsWith(p.FILETYPE)){f=f.replace(new RegExp("^"+p.NAMESPACE),"");f=f.replace(new RegExp(p.FILETYPE+"$"),"");return f.indexOf("/")===-1;}return false;};
return M;});
sap.ui.predefine('sap/ui/fl/designtime/appVariant/ModuleModifier',["sap/ui/fl/designtime/appVariant/ChangeModifier","sap/ui/fl/designtime/appVariant/ModifierUtils"],function(C,M){"use strict";var a={};a.CODE_EXT_PATTERN={NAMESPACE:"/changes/coding/",FILETYPE:".js"};a.FRAGMENT_PATTERN={NAMESPACE:"/changes/fragments/",FILETYPE:".xml"};
a.modify=function(n,f){var o=a._extractOldReference(f);if(o){return f.map(function(F){if(M.fileNameMatchesPattern(F.fileName,a.CODE_EXT_PATTERN)||M.fileNameMatchesPattern(F.fileName,a.FRAGMENT_PATTERN)){F.content=a._modifyModuleFile(F.content,o,n);}return F;});}return f;};
a._extractOldReference=function(f){var o=null;var c;f.some(function(F){if(M.fileNameMatchesPattern(F.fileName,C.CHANGE_PATTERN)){if(F.content){c=JSON.parse(F.content);o=c.reference;if(o.endsWith(".Component")){o=o.replace(".Component","");}return true;}}});return o;};
a._modifyModuleFile=function(m,o,n){var O=o.replace(/\./g,'\/');var s=m.replace(new RegExp(o,'g'),n);s=s.replace(new RegExp(O,'g'),n);return s;};
return a;});
sap.ui.predefine('sap/ui/fl/designtime/variants/VariantManagement.designtime',["sap/ui/fl/Utils"],function(f){"use strict";var s=function(v,d){var a=f.getAppComponentForControl(v);var c=v.getId();var m=a.getModel(f.VARIANT_MODEL_NAME);var V=a.getLocalId(c)||c;if(!m){return;}m.setModelPropertiesForControl(V,d,v);m.checkUpdate(true);};return{annotations:{},properties:{showExecuteOnSelection:{ignore:false},showSetAsDefault:{ignore:false},manualVariantKey:{ignore:false},inErrorState:{ignore:false},editable:{ignore:false},modelName:{ignore:false},updateVariantInURL:{ignore:false}},variantRenameDomRef:function(v){return v.getTitle().getDomRef("inner");},customData:{},tool:{start:function(v){var d=true;s(v,d);},stop:function(v){var d=false;s(v,d);}}};});
/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.predefine('sap/ui/fl/designtime/library.designtime',[],function(){"use strict";return{};});
sap.ui.predefine('sap/ui/fl/designtime/util/IFrame.designtime',["sap/m/Dialog","sap/m/Label","sap/m/TextArea","sap/m/Button","sap/m/library"],function(D,L,T,B,m){"use strict";var a=m.ButtonType;var b=m.DialogType;
function e(c){return new Promise(function(r){var d=new D({title:"Settings",type:b.Message,content:[new L({text:"Please enter the URL",labelFor:"settingsDialogTextarea"}),new T('settingsDialogTextarea',{width:"100%",placeholder:"Enter URL (required)",value:c.getUrl(),liveChange:function(E){var u=E.getParameter('value');d.getBeginButton().setEnabled(u.length>0);}})],beginButton:new B({type:a.Emphasized,text:'Submit',enabled:false,press:function(){r(sap.ui.getCore().byId('settingsDialogTextarea').getValue());d.close();}}),endButton:new B({text:'Cancel',press:function(){r();d.close();}}),afterClose:function(){d.destroy();}});d.open();}).then(function(u){if(u){return[{selectorControl:c,changeSpecificData:{changeType:"updateIFrame",content:{url:u}}}];}return[];});}
return{actions:{settings:function(){return{isEnabled:true,handler:e};},remove:{changeType:"hideControl"}}};});
//# sourceMappingURL=library-preload.designtime.js.map