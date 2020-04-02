/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

sap.ui.define([
	    './library',
		"sap/base/security/encodeXML",
		'sap/suite/ui/microchart/MicroChartRenderUtils',
		'sap/ui/core/theming/Parameters',
		'sap/m/library'
	],
	function(library, encodeXML, MicroChartRenderUtils, Parameters, mobileLibrary) {
	"use strict";

	// shortcut for sap.m.ValueColor
	var ValueColor = mobileLibrary.ValueColor;

	/**
	 * ComparisonMicroChart renderer.
	 * @namespace
	 */
	var ComparisonMicroChartRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm
	 *			the RenderManager that can be used for writing to
	 *			the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl
	 *			the control to be rendered
	 */
	ComparisonMicroChartRenderer.render = function (oRm, oControl) {
		if (!oControl._bThemeApplied) {
			return;
		}

		if (oControl._hasData()) {
			var sAriaLabel = oControl.getTooltip_AsString(oControl.hasListeners("press"));

			oRm.write("<div");
			this._writeMainProperties(oRm, oControl);

			if (oControl.getShrinkable()) {
				oRm.addClass("sapSuiteCpMCShrinkable");
				oRm.addStyle("height", "auto");
			}

			oRm.writeClasses();

			oRm.writeStyles();
			oRm.write(">");

			this._renderInnerContent(oRm, oControl, sAriaLabel);

			oRm.write("<div");
			oRm.writeAttribute("id", oControl.getId() + "-info");
			oRm.writeAttribute("aria-hidden", "true");
			oRm.addStyle("display", "none");
			oRm.writeStyles();
			oRm.write(">");
			oRm.writeEscaped(sAriaLabel);
			oRm.write("</div>");

			oRm.write("<div");
			oRm.writeAttribute("id", oControl.getId() + "-hidden");
			oRm.writeAttribute("aria-hidden", "true");
		//	oRm.writeAttribute("tabindex", "-1");
			oRm.writeAttribute("focusable", "false");
			oRm.writeStyles();
			oRm.write(">");
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
		ComparisonMicroChartRenderer._writeMainProperties = function(oRm, oControl) {
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
			oRm.addClass("sapSuiteCpMC");
			oRm.addClass("sapSuiteCpMCChartContent");

			// size just defines the size of the dom element
			oRm.addClass(oControl._isResponsive() ? "sapSuiteCpMCResponsive" : "sapSuiteCpMCSize" + oControl.getSize());
			// view mode for backward compatibility
			oRm.addClass("sapSuiteCpMCViewType" + oControl.getView());

			oRm.addStyle("width", oControl.getWidth());
			oRm.addStyle("height", oControl.getHeight());
		};

	ComparisonMicroChartRenderer._renderInnerContent = function(oRm, oControl) {
		var iCPLength = oControl.getColorPalette().length,
			iCPIndex = 0,
			aData = oControl.getData(),
			aChartData = oControl._calculateChartData();

		var fnNextColor = function(sColor) {
			if (iCPLength) {
				if (iCPIndex === iCPLength) {
					iCPIndex = 0;
				}
				sColor = oControl.getColorPalette()[iCPIndex++].trim();
			}
			return Parameters.get(sColor) || sColor;
		};

		oRm.write("<div");
		oRm.addClass("sapSuiteCpMCVerticalAlignmentContainer");
		oRm.writeClasses();
		oRm.write(">");

		for (var i = 0; i < aChartData.length; i++) {
			this._renderChartItem(oRm, oControl, aChartData[i], i, fnNextColor(aData[i].getColor()));
		}
		oRm.write("</div>");
	};

	ComparisonMicroChartRenderer._renderChartItem = function(oRm, oControl, oChartData, iIndex, sColor) {
		var aData = oControl.getData();

		oRm.write("<div");
		oRm.addClass("sapSuiteCpMCChartItem");
		oRm.writeElementData(aData[iIndex]);

		oRm.writeClasses();
		oRm.write(">");
			this._renderChartTitle(oRm, oControl, iIndex);
			this._renderChartBar(oRm, oControl, oChartData, iIndex, sColor);
			this._renderChartValue(oRm, oControl, iIndex, sColor);
		oRm.write("</div>");
	};

	ComparisonMicroChartRenderer._renderChartBar = function(oRm, oControl, oChartData, iIndex, sColor) {
		var oData = oControl.getData()[iIndex];

		oRm.write("<div");
		oRm.writeAttribute("id", oControl.getId() + "-chart-item-bar-" + iIndex);
		oRm.addClass("sapSuiteCpMCChartBar");

		if (oControl.getData()[iIndex].hasListeners("press")) {
			if (iIndex === 0) {
				oRm.writeAttribute("tabindex", "0");
			}
			oRm.writeAttribute("role", "presentation");
			oRm.writeAttributeEscaped("aria-label", oControl._getBarAltText(iIndex));
			if (!library._isTooltipSuppressed(oControl._getBarAltText(iIndex))) {
				oRm.writeAttributeEscaped("title", oControl._getBarAltText(iIndex));
			} else {
				// By setting the empty title attribute on the bar, the followng desired behavior is achieved:
				// no tooltip is displayed when hovering over the bar press area, independent whether the tooltip of the chart is suppressed or displayed.
				oRm.writeAttribute("title", "");
			}
			oRm.writeAttribute("data-bar-index", iIndex);
			oRm.addClass("sapSuiteUiMicroChartPointer");
		}
		oRm.writeClasses();
		oRm.write(">");

		if (oChartData.negativeNoValue > 0) {
			oRm.write("<div");
			oRm.writeAttribute("data-bar-index", iIndex);
			oRm.addClass("sapSuiteCpMCChartBarNegNoValue");
			if (oChartData.value > 0 || oChartData.positiveNoValue > 0) {
				oRm.addClass("sapSuiteCpMCNotLastBarPart");
			}
			oRm.writeClasses();
			oRm.addStyle("width", encodeXML(oChartData.negativeNoValue + "%"));
			oRm.writeStyles();
			oRm.write("></div>");
		}

		if (oChartData.value > 0) {
			oRm.write("<div");
			oRm.writeAttribute("data-bar-index", iIndex);
			oRm.addClass("sapSuiteCpMCChartBarValue");
			oRm.addClass(encodeXML("sapSuiteCpMCSemanticColor" + oData.getColor()));
			oRm.writeClasses();
			oRm.addStyle("background-color", sColor ? encodeXML(sColor) : "");
			oRm.addStyle("width", encodeXML(oChartData.value + "%"));
			oRm.writeStyles();
			oRm.write("></div>");
		}

		if (oChartData.positiveNoValue > 0) {
			oRm.write("<div");
			oRm.writeAttribute("data-bar-index", iIndex);
			oRm.addClass("sapSuiteCpMCChartBarNoValue");
			if (!!oChartData.negativeNoValue && !oChartData.value) {
				oRm.addClass("sapSuiteCpMCNegPosNoValue");
			} else if (!!oChartData.negativeNoValue || !!oChartData.value) {
				oRm.addClass("sapSuiteCpMCNotFirstBarPart");
			}
			oRm.writeClasses();
			oRm.addStyle("width", encodeXML(oChartData.positiveNoValue + "%"));
			oRm.writeStyles();
			oRm.write("></div>");
		}

		oRm.write("</div>");
	};

	ComparisonMicroChartRenderer._renderChartTitle = function(oRm, oControl, iIndex) {
		var oData = oControl.getData()[iIndex];

		oRm.write("<div");
		oRm.writeAttribute("id", oControl.getId() + "-chart-item-" + iIndex + "-title");
		oRm.addClass("sapSuiteCpMCChartItemTitle");
		oRm.writeClasses();
		oRm.write(">");
		oRm.writeEscaped(oData.getTitle());
		oRm.write("</div>");
	};

	ComparisonMicroChartRenderer._renderChartValue = function(oRm, oControl, iIndex, sColor) {
		var oData = oControl.getData()[iIndex];
		var sScale = oControl.getScale();
		var sDisplayValue = oData.getDisplayValue();
		var sAValToShow = sDisplayValue ? sDisplayValue : "" + oData.getValue();
		var sValScale = sAValToShow + sScale;

		oRm.write("<div");
		oRm.writeAttribute("id", oControl.getId() + "-chart-item-" + iIndex + "-value");
		oRm.addClass("sapSuiteCpMCChartItemValue");
		if (ValueColor[sColor]) {
			oRm.addClass(encodeXML("sapSuiteCpMCSemanticColor" + oData.getColor()));
		}
		if (oData.getTitle()) {
			oRm.addClass("sapSuiteCpMCTitle");
		}
		oRm.writeClasses();
		oRm.write(">");
		if (!isNaN(oData.getValue())) {
			oRm.writeEscaped(sValScale);
		}
		oRm.write("</div>");
	};

	MicroChartRenderUtils.extendMicroChartRenderer(ComparisonMicroChartRenderer);

	return ComparisonMicroChartRenderer;

}, /* bExport= */ true);
