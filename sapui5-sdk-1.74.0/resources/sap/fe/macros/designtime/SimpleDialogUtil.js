/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(["../Constants","sap/ui/core/Fragment","sap/ui/model/resource/ResourceModel","sap/ui/model/json/JSONModel"],function(C,F,R,J){"use strict";var r=new R({bundleName:"sap.fe.macros.designtime.messagebundle",async:true}),o=new Promise(function(a,b){r.attachRequestCompleted(a);}),s={dialog:null};function c(I,t,m,S,a){return new Promise(function(b){s.resolve=b;Promise.all([s.dialog?Promise.resolve(s.dialog):F.load({id:I,name:"sap.fe.macros.designtime.fragments.SimpleSettingsDialog",controller:{apply:function(e){var d={selectedOption:sap.ui.core.Fragment.byId(I,"options").getSelectedButton().data("selectedOption")};s.dialog.close();s.resolve(d);},cancel:function(){s.dialog.close();s.resolve();}}}),o]).then(function(d){var D=d[0],e,f,g=a;s.dialog=D;for(var i=0;i<S.length;i++){if(S[i].option===g){f=i;break;}}e=new J({initialMode:g,selectedIndex:f,options:S,title:t,message:m});D.setModel(e,C.sDialogModel);D.setModel(r,C.sI18n);D.open();});});}return{createDialog:c};});
