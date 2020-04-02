/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/mvc/JSView","sap/m/VBox","sap/ui/layout/VerticalLayout","sap/ui/core/HTML","sap/m/library","sap/m/Link"],function(J,V,a,H,m,L){"use strict";var F=m.FlexAlignItems;sap.ui.jsview("sap.collaboration.components.fiori.sharing.NoGroups",{getControllerName:function(){return"sap.collaboration.components.fiori.sharing.NoGroups";},createContent:function(c){var p=this.getViewData().controlId;this.oNoGroupsVBox=new V(p+"_NoGroupsVbox");this.oNoGroupsVBox.addItem(this.createNoDataLayout());return this.oNoGroupsVBox;},createNoDataLayout:function(c){var p=this.getViewData().controlId;var l=this.getViewData().langBundle;var j=this.getViewData().jamUrl;this.oNoDataLayout=new a(p+"_NoDataLayout",{width:"100%",content:[new H(p+"_NoDataDiv",{content:"<div>"+l.getText("NO_GROUPS_ERROR")+"</div>"}),new V(p+"_LinkVbox",{alignItems:F.End,items:[new L(p+"_JamLink",{text:l.getText("JAM_URL_TEXT"),target:"_blank",href:j})]}).addStyleClass("linkVBox")]});return this.oNoDataLayout;}});});
