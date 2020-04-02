/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/gantt/shape/Shape","sap/gantt/misc/Utility"],function(S,U){"use strict";var P=S.extend("sap.gantt.shape.Path",{metadata:{properties:{tag:{type:"string",defaultValue:"path"},isClosed:{type:"boolean",defaultValue:false},fill:{type:"string",defaultValue:"none"},d:{type:"string"}}}});P.prototype.init=function(){S.prototype.init.apply(this,arguments);var r=sap.ui.getCore().getLibraryResourceBundle("sap.gantt");this.setProperty("ariaLabel",r.getText("ARIA_PATH"));};P.prototype.getD=function(d,r){var D;if(this.mShapeConfig.hasShapeProperty("d")){D=this._configFirst("d",d);}else{var c=this._getCenter(d,r),i=this.getIsDuration(d,r),m=this.mChartInstance.getSapUiSizeClass();var n=U.scaleBySapUiSize(m,7.5);if(i){var e=this._getCenter(d,r,true);n=(e[0]-c[0])/2;}D="M "+c[0]+" "+c[1]+" c 0,"+-n+" "+n+","+-n+" "+n+",0 c 0,"+n+" "+n+","+n+" "+n+",0";}if(this.isValid(D)){return D;}else{jQuery.sap.log.warning("Path shape generated invalid d: "+D+" from the given data: "+d);return null;}};P.prototype.getIsClosed=function(d){return this._configFirst("isClosed",d);};P.prototype.getStyle=function(d,r){var i=S.prototype.getStyle.apply(this,arguments);var s={"fill":this.determineValueColor(this.getFill(d,r)),"stroke-dasharray:":this.getStrokeDasharray(d,r)};if(this.getIsClosed(d,r)){s["fill-opacity"]=this.getFillOpacity(d,r);s["stroke-opacity"]=this.getStrokeOpacity(d,r);}return i+this.getInlineStyle(s);};P.prototype.isValid=function(d){return!!d&&d.indexOf("NaN")===-1&&d.indexOf("undefined")===-1&&d.indexOf("null")===-1;};return P;},true);
