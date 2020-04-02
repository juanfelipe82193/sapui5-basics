/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2017 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/mvc/JSView","sap/m/Page","sap/m/List"],function(J,P,L){"use strict";sap.ui.jsview("sap.collaboration.components.fiori.feed.splitApp.GroupMaster",{getControllerName:function(){return"sap.collaboration.components.fiori.feed.splitApp.GroupMaster";},createContent:function(c){this.sPrefixId=this.getViewData().controlId;this.groupMasterPage=new P(this.sPrefixId+"groupPage",{title:this.getViewData().groupMasterpageTitle,showNavButton:true,navButtonPress:c.onNavButtonTap,content:[new L(this.sPrefixId+"groupsList",{inset:true})]});return this.groupMasterPage;}});});
