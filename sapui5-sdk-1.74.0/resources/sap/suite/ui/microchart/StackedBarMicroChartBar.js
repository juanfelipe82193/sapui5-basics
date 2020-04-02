/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/thirdparty/jquery",'./library','sap/ui/core/Element',"sap/m/library"],function(q,l,E,m){"use strict";var V=m.ValueCSSColor;var S=E.extend("sap.suite.ui.microchart.StackedBarMicroChartBar",{metadata:{library:"sap.suite.ui.microchart",properties:{value:{type:"float",group:"Data",defaultValue:"0"},valueColor:{type:"sap.m.ValueCSSColor",group:"Appearance",defaultValue:null},displayValue:{type:"string",group:"Data",defaultValue:null}}}});S.prototype.setValue=function(v,s){var i=q.isNumeric(v);return this.setProperty("value",i?v:NaN,s);};S.prototype.setValueColor=function(v,s){var i=V.isValid(v);return this.setProperty("valueColor",i?v:null,s);};S.prototype._isTooltipSuppressed=function(){var t=this.getTooltip();return t&&q.trim(t).length===0;};return S;});
