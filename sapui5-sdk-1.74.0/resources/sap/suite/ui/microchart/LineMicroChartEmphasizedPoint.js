/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.define(["sap/m/library","sap/suite/ui/microchart/LineMicroChartPoint"],function(m,L){"use strict";var V=m.ValueCSSColor;var a=L.extend("sap.suite.ui.microchart.LineMicroChartEmphasizedPoint",{metadata:{properties:{color:{type:"sap.m.ValueCSSColor",group:"Misc",defaultValue:"Neutral"},show:{type:"boolean",group:"Appearance",defaultValue:false}}}});a.prototype.setColor=function(v){this.setProperty("color",V.isValid(v)?v:null);return this;};return a;});
