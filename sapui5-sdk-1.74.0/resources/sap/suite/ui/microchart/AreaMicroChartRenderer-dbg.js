/*!
* SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
*/

sap.ui.define([
	"./library",
	"sap/suite/ui/microchart/MicroChartRenderUtils",
	"sap/base/security/encodeXML"
], function(library, MicroChartRenderUtils, encodeXML) {
	"use strict";

	var AreaMicroChartViewType = library.AreaMicroChartViewType;

	/**
	 * AreaMicroChartRenderer renderer.
	 * @namespace
	 */
	var AreaMicroChartRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl The control to be rendered
	 */
	AreaMicroChartRenderer.render = function(oRm, oControl) {
		if (!oControl._bThemeApplied) {
			return;
		}

		if (oControl._hasData()) {
			var bWideMode = oControl.getView() === AreaMicroChartViewType.Wide;
			var bShowLabels = oControl.getShowLabel();
			var bShouldRenderTopLabels = (bShowLabels &&
				((!bWideMode && (oControl.getFirstYLabel() || oControl.getLastYLabel())) || oControl.getMaxLabel()));
			var bShouldRenderBottomLabels = (bShowLabels &&
				((!bWideMode && (oControl.getFirstXLabel() || oControl.getLastXLabel())) || oControl.getMinLabel()));
			var bShouldRenderLeftLabels = (bShowLabels && bWideMode && (oControl.getFirstYLabel() || oControl.getFirstXLabel()));
			var bShouldRenderRightLabels = (bShowLabels && bWideMode && (oControl.getLastYLabel() || oControl.getLastXLabel()));

			oRm.write("<div");
			this._writeMainProperties(oRm, oControl);

			if (bWideMode) {
				oRm.addClass("sapSuiteAMCWideMode");
			}

			oRm.writeStyles();
			oRm.writeClasses();
			oRm.write(">");

			oRm.write("<div");
			oRm.addClass("sapSuiteAMCVerticalAlignmentContainer");
			oRm.writeClasses();
			oRm.write(">");

			if (bShouldRenderTopLabels) {
				oRm.write("<div");
				oRm.writeAttributeEscaped("id", oControl.getId() + "-top-labels");
				oRm.addClass("sapSuiteAMCLabels");
				oRm.addClass("sapSuiteAMCPositionTop");
				oRm.writeClasses();
				oRm.write(">");
				if (!bWideMode) {
					this._writeLabel(oRm, oControl, oControl.getFirstYLabel(), "-top-left-lbl", "sapSuiteAMCPositionLeft");
				}
				this._writeLabel(oRm, oControl, oControl.getMaxLabel(), "-top-center-lbl", "sapSuiteAMCPositionCenter");
				if (!bWideMode) {
					this._writeLabel(oRm, oControl, oControl.getLastYLabel(), "-top-right-lbl", "sapSuiteAMCPositionRight");
				}
				oRm.write("</div>");
			}

			if (bWideMode) {
				oRm.write("<div");
				oRm.addClass("sapSuiteAMCHorizontalContainer");
				oRm.writeClasses();
				oRm.write(">");
			}

			if (bShouldRenderLeftLabels) {
				oRm.write("<div");
				oRm.writeAttributeEscaped("id", oControl.getId() + "-left-labels");
				oRm.addClass("sapSuiteAMCSideLabels");
				oRm.addClass("sapSuiteAMCPositionLeft");
				oRm.writeClasses();
				oRm.write(">");
				this._writeLabel(oRm, oControl, oControl.getFirstYLabel(), "-top-left-lbl", "sapSuiteAMCPositionLeft");
				this._writeLabel(oRm, oControl, oControl.getFirstXLabel(), "-btm-left-lbl", "sapSuiteAMCPositionLeft");
				oRm.write("</div>");
			}

			oRm.write("<div");
			oRm.writeAttributeEscaped("id", oControl.getId() + "-canvas-cont");
			oRm.addClass("sapSuiteAMCCanvasContainer");
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("<canvas");
			oRm.writeAttributeEscaped("id", oControl.getId() + "-canvas");
			oRm.addClass("sapSuiteAMCCanvas");
			oRm.writeClasses();
			oRm.writeStyles();
			oRm.write("></canvas>");
			oRm.write("</div>");

			if (bShouldRenderRightLabels) {
				oRm.write("<div");
				oRm.writeAttributeEscaped("id", oControl.getId() + "-right-labels");
				oRm.addClass("sapSuiteAMCSideLabels");
				oRm.addClass("sapSuiteAMCPositionRight");
				oRm.writeClasses();
				oRm.write(">");
				this._writeLabel(oRm, oControl, oControl.getLastYLabel(), "-top-right-lbl", "sapSuiteAMCPositionRight");
				this._writeLabel(oRm, oControl, oControl.getLastXLabel(), "-btm-right-lbl", "sapSuiteAMCPositionRight");
				oRm.write("</div>");
			}

			if (bWideMode) {
				oRm.write("</div>"); // end of horizontal container
			}

			if (bShouldRenderBottomLabels) {
				oRm.write("<div");
				oRm.writeAttributeEscaped("id", oControl.getId() + "-bottom-labels");
				oRm.addClass("sapSuiteAMCLabels");
				oRm.addClass("sapSuiteAMCPositionBtm");
				oRm.writeClasses();
				oRm.write(">");
				if (!bWideMode) {
					this._writeLabel(oRm, oControl, oControl.getFirstXLabel(), "-btm-left-lbl", "sapSuiteAMCPositionLeft");
				}
				this._writeLabel(oRm, oControl, oControl.getMinLabel(), "-btm-center-lbl", "sapSuiteAMCPositionCenter");
				if (!bWideMode) {
					this._writeLabel(oRm, oControl, oControl.getLastXLabel(), "-btm-right-lbl", "sapSuiteAMCPositionRight");
				}
				oRm.write("</div>");
			}

			oRm.write("<div");
			oRm.writeAttributeEscaped("id", oControl.getId() + "-css-helper");
			oRm.addStyle("display", "none");
			oRm.writeStyles();
			oRm.write("></div>");

			oRm.write("</div>");
			oRm.write("</div>");
		} else {
			oRm.write("<div");
			this._writeMainProperties(oRm, oControl);
			oRm.writeClasses();
			oRm.writeStyles();
			oRm.write(">");

			this._renderNoData(oRm);

			oRm.write("</div>");
		}

	};

	/**
	 * Renders control data and prepares default classes and styles
	 *
	 * @param {object} oRm render manager
	 * @param {object} oControl AreaMicroChart control
	 * @private
	 */
	AreaMicroChartRenderer._writeMainProperties = function(oRm, oControl) {
		var bIsActive = oControl.hasListeners("press");

		this._renderActiveProperties(oRm, oControl);

		var sAriaLabel = oControl.getTooltip_AsString(bIsActive);
		oRm.writeAttribute("role", "img");

		if (oControl.getAriaLabelledBy().length) {
			oRm.writeAccessibilityState(oControl);
		} else {
			oRm.writeAttributeEscaped("aria-label", sAriaLabel);
		}

		oRm.writeControlData(oControl);
		oRm.addClass("sapSuiteAMC");

		oRm.addClass("sapSuiteAMCSize" + oControl.getSize());

		oRm.addStyle("width", oControl.getWidth());
		oRm.addStyle("height", oControl.getHeight());

	};

	AreaMicroChartRenderer._writeLabel = function(oRm, oControl, oLabel, sId, sClass) {
		if (!oLabel) {
			return;
		}

		var sLabel = oLabel ? oLabel.getLabel() : "";
		oRm.write("<div");
		oRm.writeAttribute("id", oControl.getId() + sId);

		oRm.addClass(encodeXML("sapSuiteAMCSemanticColor" + oLabel.getColor()));

		oRm.addClass("sapSuiteAMCLbl");
		oRm.addClass(encodeXML(sClass));
		oRm.writeClasses();
		oRm.write(">");
		oRm.writeEscaped(sLabel);
		oRm.write("</div>");
	};

	MicroChartRenderUtils.extendMicroChartRenderer(AreaMicroChartRenderer);

	return AreaMicroChartRenderer;

}, /* bExport= */ true);
