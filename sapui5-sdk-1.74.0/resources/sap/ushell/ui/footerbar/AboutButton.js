// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(["sap/m/Button","sap/m/Dialog","sap/m/ObjectHeader","sap/m/VBox","sap/ui/layout/form/SimpleForm","sap/ushell/resources","sap/ushell/ui/launchpad/ActionItem","sap/ushell/services/AppConfiguration","sap/m/Label","sap/m/Text","sap/ushell/utils/type","sap/base/Log","sap/base/util/isEmptyObject","sap/ui/core/library","sap/ui/layout/library","sap/ui/VersionInfo","./AboutButtonRenderer"],function(B,D,O,V,S,r,A,a,L,T,t,b,i,c,l,d){"use strict";var e=l.form.SimpleFormLayout;var f=c.TitleLevel;var g=A.extend("sap.ushell.ui.footerbar.AboutButton",{metadata:{library:"sap.ushell"}});g.prototype.init=function(){if(A.prototype.init){A.prototype.init.apply(this,arguments);}this.setIcon("sap-icon://hint");this.setText(r.i18n.getText("about"));this.setTooltip(r.i18n.getText("about"));this.attachPress(this.showAboutDialog);this._translationBundle=r.i18n;};g.prototype.showAboutDialog=function(){return this._getUI5VersionInfo().then(function(v){var m=a.getMetadata(),o=v||{},h=sap.ushell.Container.getService("AppLifeCycle").getCurrentApplication(),p=sap.ushell.Container.getLogonSystem().getProductVersion(),C=this._getClientRoleDescription(),s=new S({id:"aboutDialogFormID",editable:false,layout:e.ResponsiveGridLayout,content:[new L({text:this._translationBundle.getText("technicalName")}),new T({text:m.technicalName||""}),new L({text:this._translationBundle.getText("fioriVersionFld")}),new T({text:m.version||""}),new L({text:this._translationBundle.getText("sapui5Fld")}),new T({text:(o.version||"")+(" ("+(o.buildTimestamp||"")+")")||""}),new L({text:this._translationBundle.getText("userAgentFld")}),new T({text:navigator.userAgent||""}),new L({text:this._translationBundle.getText("productVersionFld"),visible:!!p}),new T({text:p||"",visible:!!p}),new L({text:this._translationBundle.getText("clientRoleFld"),visible:!!C}),new T({text:C||"",visible:!!C})]}),H=new O({title:m.title,titleLevel:f.H3,icon:m.icon}).addStyleClass("sapUshellAboutDialogHeader"),j,k,n=new B({text:this._translationBundle.getText("okBtn"),press:function(){j.close();}});if(h){h.getTechnicalParameter("sap-fiori-id").then(function(F){if(t.isArray(F)&&F[0]){s.addContent(new L({text:this._translationBundle.getText("fioriAppId")}));s.addContent(new T({text:F[0]}));}}.bind(this),function(E){b.error("Cannot get technical parameter 'sap-fiori-id'",E,"sap.ushell.ui.footerbar.AboutButton");});h.getTechnicalParameter("sap-ach").then(function(q){if(t.isArray(q)&&q[0]){s.addContent(new L({text:this._translationBundle.getText("sapAch")}));s.addContent(new T({text:q[0]}));}}.bind(this),function(E){b.error("Cannot get technical parameter 'sap-ach'",E,"sap.ushell.ui.footerbar.AboutButton");});}if(i(m)||!m.icon){k=new V({items:[s]});}else{k=new V({items:[H,s]});}j=new D({id:"aboutContainerDialogID",title:this._translationBundle.getText("about"),contentWidth:"25rem",horizontalScrolling:false,leftButton:n,afterClose:function(){j.destroy();if(window.document.activeElement&&window.document.activeElement.tagName==="BODY"){window.document.getElementById("meAreaHeaderButton").focus();}}});j.addContent(k);j.open();}.bind(this));};g.prototype._getClientRoleDescription=function(){var C=sap.ushell.Container.getLogonSystem().getClientRole();var o={"P":"clientRoleProduction","T":"clientRoleTest","C":"clientRoleCustomizing","D":"clientRoleDemonstration","E":"clientRoleTraining","S":"clientRoleSAPReference"};return this._translationBundle.getText(o[C]);};g.prototype._getUI5VersionInfo=function(){return new Promise(function(h){d.load().then(h).catch(function(){b.error("VersionInfo could not be loaded");h({});});});};return g;});
