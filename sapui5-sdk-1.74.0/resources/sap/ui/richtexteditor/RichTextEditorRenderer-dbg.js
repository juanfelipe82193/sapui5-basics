/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */
// Provides default renderer for control sap.ui.richtexteditor.RichTextEditor
sap.ui.define(['sap/ui/core/Renderer'],
	function(Renderer) {
	"use strict";


	/**
	 * RichTextEditorRenderer
	 * @class
	 * @static
	 * @author Malte Wedel, Andreas Kunz
	 */
	var RichTextEditorRenderer = {
		apiVersion: 2
	};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} rm The RenderManager that can be used for writing to the Render-Output-Buffer.
	 * @param {sap.ui.richtexteditor.RichTextEditor}
	 *            oRichTextEditor The RichTextEditor control that should be rendered.
	 */
	RichTextEditorRenderer.render = function(rm, oRichTextEditor) {
		var oToolbarWrapper = oRichTextEditor.getAggregation("_toolbarWrapper");
		var bCustomToolbar = oToolbarWrapper && oRichTextEditor._bCustomToolbarRequirementsFullfiled;

		rm.openStart("div", oRichTextEditor);
		if (oRichTextEditor.getEditorType() == "TinyMCE4") {
			rm.attr("data-sap-ui-preserve", oRichTextEditor.getId());
		}
		rm.class("sapUiRTE");
		if (oRichTextEditor.getRequired()) {
			rm.class("sapUiRTEReq");
		}
		if (oRichTextEditor.getUseLegacyTheme()) {
			rm.class("sapUiRTELegacyTheme");
		}
		if (bCustomToolbar) {
			rm.class("sapUiRTEWithCustomToolbar");
		}

		rm.style("width", oRichTextEditor.getWidth());
		rm.style("height", oRichTextEditor.getHeight());
		if (oRichTextEditor.getTooltip_AsString()) { // ensure not to render null
			rm.attr("title", oRichTextEditor.getTooltip_AsString());
		}
		rm.openEnd();

		if (bCustomToolbar) {
			oToolbarWrapper.addStyleClass("sapUiRTECustomToolbar");
			rm.renderControl(oToolbarWrapper);
		}

		// Call specialized renderer method if it exists
		var sRenderMethodName = "render" + oRichTextEditor.getEditorType() + "Editor";
		if (this[sRenderMethodName] && typeof this[sRenderMethodName] === "function") {
			this[sRenderMethodName].call(this, rm, oRichTextEditor);
		}

		rm.close("div");
	};

	return RichTextEditorRenderer;

}, /* bExport= */ true);