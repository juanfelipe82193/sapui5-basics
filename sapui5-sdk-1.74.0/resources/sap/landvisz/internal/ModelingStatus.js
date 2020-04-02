/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */
sap.ui.define(["sap/landvisz/library","sap/ui/core/Control","sap/ui/commons/Image","./ModelingStatusRenderer"],function(l,C,I,M){"use strict";var a=C.extend("sap.landvisz.internal.ModelingStatus",{metadata:{library:"sap.landvisz",properties:{status:{type:"string",group:"Data",defaultValue:null},statusTooltip:{type:"string",group:"Data",defaultValue:null},stateIconSrc:{type:"string",group:"Data",defaultValue:null},stateIconTooltip:{type:"any",group:"Data",defaultValue:null}}}});a.prototype.init=function(){this.initializationDone=false;this._imgResourcePath=sap.ui.resource('sap.landvisz','themes/base/img/status/');this._imgFolderPath;this.renderSize;if(!this.statusImage)this.statusImage=new I(this.getId()+"-CLVEntityStatusImage");};a.prototype.exit=function(){this.statusImage&&this.statusImage.destroy();};a.prototype.initControls=function(){var n=this.getId();if(!this.statusImage)this.statusImage=new I(n+"-CLVEntityStatusImage");if(!this.stateImage)this.stateImage=new I(n+"-EntityStateImage");this.entityMaximized;};return a;});
