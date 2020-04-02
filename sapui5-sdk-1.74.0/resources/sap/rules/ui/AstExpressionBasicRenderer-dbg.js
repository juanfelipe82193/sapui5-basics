/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"jquery.sap.global"
], function (jQuery) {
	"use strict";

	/**
	 * AstExpression renderer.
	 * @namespace
	 */
	var AstExpressionBasicRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm
	 *            the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl
	 *            the control to be rendered
	 */
	AstExpressionBasicRenderer.render = function (oRm, oControl) {

		//oRm.addClass("sapUiSizeCozy");
		if (oControl.getParent() instanceof jQuery){
			jQuery.sap.syncStyleClass("sapUiSizeCozy", oControl.getParent(), this.oControl);
		}
		var oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");
		var placeHolderText = oBundle.getText("ctrlSpaceCue");

		var sEditable = "contenteditable=\"true\"";
		var sPlaceHolder = "data-placeholder=\"" + placeHolderText + "\"";
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addClass("sapAstExpressionInputWrapper");
		oRm.write(" aria-label=\"\" >");
		oRm.write("<pre style=\"white-space: pre-wrap\" class=\"sapAstExpressionPreSpaceMargin\">");
		oRm.write("<div aria-label=\"\" spellcheck=\"false\"" + sEditable + sPlaceHolder + " id=\"" +
			oControl.getId() + "-input\" class=\"sapAstExpressionInput\"></div>");
		oRm.write("</pre>");
		oRm.write("</div>");

	};

	return AstExpressionBasicRenderer;

}, /* bExport= */ true);