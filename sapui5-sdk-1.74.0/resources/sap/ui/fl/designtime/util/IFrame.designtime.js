/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/Dialog","sap/m/Label","sap/m/TextArea","sap/m/Button","sap/m/library"],function(D,L,T,B,m){"use strict";var a=m.ButtonType;var b=m.DialogType;function e(c){return new Promise(function(r){var d=new D({title:"Settings",type:b.Message,content:[new L({text:"Please enter the URL",labelFor:"settingsDialogTextarea"}),new T('settingsDialogTextarea',{width:"100%",placeholder:"Enter URL (required)",value:c.getUrl(),liveChange:function(E){var u=E.getParameter('value');d.getBeginButton().setEnabled(u.length>0);}})],beginButton:new B({type:a.Emphasized,text:'Submit',enabled:false,press:function(){r(sap.ui.getCore().byId('settingsDialogTextarea').getValue());d.close();}}),endButton:new B({text:'Cancel',press:function(){r();d.close();}}),afterClose:function(){d.destroy();}});d.open();}).then(function(u){if(u){return[{selectorControl:c,changeSpecificData:{changeType:"updateIFrame",content:{url:u}}}];}return[];});}return{actions:{settings:function(){return{isEnabled:true,handler:e};},remove:{changeType:"hideControl"}}};});
