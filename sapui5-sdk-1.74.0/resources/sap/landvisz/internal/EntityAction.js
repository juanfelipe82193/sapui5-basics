/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */
sap.ui.define(["sap/landvisz/library","sap/ui/core/Control","sap/ui/commons/Image","./EntityActionRenderer"],function(l,C,I,E){"use strict";var a=C.extend("sap.landvisz.internal.EntityAction",{metadata:{library:"sap.landvisz",properties:{actionTooltip:{type:"string",group:"Data",defaultValue:null},iconSrc:{type:"sap.ui.core.URI",group:"Data",defaultValue:null},renderingSize:{type:"string",group:"Dimension",defaultValue:null}},events:{press:{}}}});a.prototype.init=function(){this.initializationDone=false;};a.prototype.exit=function(){this.entityActionIcon&&this.entityActionIcon.destroy();this.style="";this.entityMaximized};a.prototype.initControls=function(){var n=this.getId();this.entityActionIcon&&this.entityActionIcon.destroy();this.entityActionIcon=new I(n+"-CLVEntityActionImg");};a.prototype.press=function(e){this.fireSelect();};a.prototype.onclick=function(e){this.firePress();};return a;});
