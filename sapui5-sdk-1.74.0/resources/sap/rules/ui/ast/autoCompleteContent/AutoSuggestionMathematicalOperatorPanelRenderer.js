/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var A={};A.render=function(r,c){r.write("<div");r.writeControlData(c);r.addClass("sapAstMathematicalOperatorPanel");r.writeClasses();r.write(">");var A=c.getAggregation("PanelLayout");r.renderControl(A);r.write("</div>");};return A;},true);
