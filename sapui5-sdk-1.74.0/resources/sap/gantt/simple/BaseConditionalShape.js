/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["./BaseShape"],function(B){"use strict";var P=["rowYCenter","shapeUid","selected"];var a=B.extend("sap.gantt.simple.BaseConditionalShape",{metadata:{properties:{activeShape:{type:"int",defaultValue:0},countInBirdEye:{type:"boolean",defaultValue:false}},aggregations:{shapes:{type:"sap.gantt.simple.BaseShape",multiple:true,singularName:"shape",sapGanttLazy:true}}}});a.prototype.renderElement=function(r,e){var A=e._getActiveShapeElement();if(A){A._iBaseRowHeight=e._iBaseRowHeight;A.renderElement(r,A);}};a.prototype.setProperty=function(p,v,s){B.prototype.setProperty.apply(this,arguments);if(P.indexOf(p)>=0){this.getShapes().forEach(function(S){S.setProperty(p,v,s);});}if(p==="shapeId"){this.getShapes().forEach(function(S){var b=S.getShapeId();if(!b){S.setProperty(p,v,s);}});}};a.prototype.getShapeId=function(){var A=this._getActiveShapeElement(),s;if(A){s=A.getShapeId();}if(!s){s=this.getProperty("shapeId");}return s;};a.prototype.getCountInBirdEye=function(){var A=this._getActiveShapeElement();if(A){return A.getCountInBirdEye();}return false;};a.prototype._getActiveShapeElement=function(){var A=this.getActiveShape(),s=this.getShapes();if(A>=0&&A<s.length){return s[A];}return undefined;};return a;});
