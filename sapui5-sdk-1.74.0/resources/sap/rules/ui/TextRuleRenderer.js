/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(["jquery.sap.global"],function(q){"use strict";var t={};t.render=function(r,c){if(c.getParent()instanceof q){q.sap.syncStyleClass("sapUiSizeCozy",c.getParent(),this.oControl);}r.write("<div");r.writeControlData(c);r.addClass("sapRULTextRule");r.writeClasses();r.write(">");r.renderControl(c.getAggregation("_toolbar"));r.renderControl(c.getAggregation("_verticalLayout"));r.write("</div>");};return t;},true);
