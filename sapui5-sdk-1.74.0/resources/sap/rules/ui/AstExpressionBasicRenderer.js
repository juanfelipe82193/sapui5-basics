/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(["jquery.sap.global"],function(q){"use strict";var A={};A.render=function(r,c){if(c.getParent()instanceof q){q.sap.syncStyleClass("sapUiSizeCozy",c.getParent(),this.oControl);}var b=sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");var p=b.getText("ctrlSpaceCue");var e="contenteditable=\"true\"";var P="data-placeholder=\""+p+"\"";r.write("<div");r.writeControlData(c);r.addClass("sapAstExpressionInputWrapper");r.write(" aria-label=\"\" >");r.write("<pre style=\"white-space: pre-wrap\" class=\"sapAstExpressionPreSpaceMargin\">");r.write("<div aria-label=\"\" spellcheck=\"false\""+e+P+" id=\""+c.getId()+"-input\" class=\"sapAstExpressionInput\"></div>");r.write("</pre>");r.write("</div>");};return A;},true);
