/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var a={};a.render=function(r,c){r.write("<div");r.writeControlData(c);r.addClass("sapAstArrayOperatorPanel");r.writeClasses();r.write(">");var a=c.getAggregation("PanelLayout");r.renderControl(a);r.write("</div>");};return a;},true);
