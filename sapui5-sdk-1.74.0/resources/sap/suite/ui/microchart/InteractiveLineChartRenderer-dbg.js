/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

sap.ui.define(["sap/ui/thirdparty/jquery", "sap/m/library", "sap/base/security/encodeXML"], function(jQuery, MobileLibrary, encodeXML) {
	"use strict";

	/**
	 * InteractiveLineChartRenderer renderer.
	 * @namespace
	 */
	var InteractiveLineChartRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the Render - Output - Buffer
	 * @param {sap.ui.core.Control} oControl the control to be rendered
	 */
	InteractiveLineChartRenderer.render = function (oRm, oControl) {
		if (!oControl._bThemeApplied) {
			return;
		}

		var nPointsLength = oControl._iVisiblePointsCount,
			nPercentageWidth = 100 / nPointsLength;
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.addClass("sapSuiteILC");
		oRm.writeClasses();

		//container accessibility
		var oAccOptions = {};
		oAccOptions.role = "listbox";
		oAccOptions.multiselectable = true;
		oAccOptions.disabled = !oControl._isChartEnabled();
		oAccOptions.labelledby = oControl.getAriaLabelledBy();
		oAccOptions.describedby = this._getAriaDescribedBy(oControl, nPointsLength);
		oRm.writeAccessibilityState(oControl, oAccOptions);

		//tooltip for non-interactive chart
		if (!oControl._isChartEnabled()) {
			var sAreaTooltip = oControl.getTooltip_AsString();
			if (jQuery.type(sAreaTooltip) === "string") {
				oRm.writeAttributeEscaped("title", sAreaTooltip);
			}
		}

		oRm.write(">");

		oRm.write("<div class=\"sapSuiteILCWrapperChild\">");
		oRm.write("<div class=\"sapSuiteILCInner\">");

		if (!oControl.getSelectionEnabled()) {
			this._renderDisabledOverlay(oRm, oControl);
		}
		this._renderChartCanvas(oRm, oControl, nPointsLength, nPercentageWidth);
		oRm.write("<div");
		oRm.addClass("sapSuiteILCBottomLabelArea");
		if (oControl._fNormalizedZero) {
			oRm.addClass("sapSuiteILCBottomLabelAreaNoDivider");
		}
		oRm.writeClasses();
		oRm.write(">");
		oRm.write("</div>");

		oRm.write("<div");
		oRm.addClass("sapSuiteILCInteraction");
		oRm.writeClasses();
		oRm.write(">");

		for (var iIndex = 0; iIndex < nPointsLength; iIndex++) {
			this._renderPoint(oRm, oControl, iIndex, nPointsLength, nPercentageWidth);
		}
		oRm.write("</div>");
		oRm.write("</div>");

		var sLastLabel = "",
			bRenderedWrapper = false,
			aPoints = oControl.getPoints();

		for (var i = 0; i < nPointsLength; i++) {
			var oChild = aPoints[i],
				sSecondaryLabel = oChild.getSecondaryLabel();

			if (sSecondaryLabel && sLastLabel !== sSecondaryLabel) {
				sLastLabel = sSecondaryLabel;
				// render wrapper only if there is an item with secondary label
				if (!bRenderedWrapper) {
					bRenderedWrapper = true;
					oRm.write("<div class=\"sapSuiteILCInnerBottom\">");
				}
				this._renderSecondaryLabel(oRm, oChild, i, nPercentageWidth, sLastLabel);
			}
		}
		if (bRenderedWrapper) {
			oRm.write("</div>");
		}

		oRm.write("</div>");
		oRm.write("</div>");
	};

	InteractiveLineChartRenderer._renderSecondaryLabel = function (oRm, oControl, index, percentageWidth, sLabel) {
		oRm.write("<div class=\"sapSuiteILCSecondaryLabel\"");

		oRm.addStyle("width", encodeXML(percentageWidth + "%"));
		oRm.addStyle("left", encodeXML(index * percentageWidth + "%"));
		oRm.writeStyles();
		oRm.writeAttributeEscaped("aria-label", encodeXML(sLabel));

		oRm.write(">");
		oRm.write(encodeXML(sLabel));
		oRm.write("</div>");
	};

	/**
	 * Renders the HTML for the given point, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the rendering buffer
	 * @param {sap.ui.core.Control} oControl The control to be rendered
	 * @param {int} index The index of the point to be rendered inside the points aggregation
	 * @param {int} pointsLength The amount of points to be displayed
	 * @param {int} percentageWidth The width of the current point expressed in percentage from the total available chart width
	 * @private
	 */
	InteractiveLineChartRenderer._renderPoint = function (oRm, oControl, index, pointsLength, percentageWidth) {
		var oPoint = oControl.getPoints()[index];

		oRm.write("<div");
		oRm.writeAttributeEscaped("id", oControl.getId() + "-point-area-" + index);
		oRm.addClass("sapSuiteILCSection");
		oRm.addClass("sapSuiteILCCanvasLayout");
		if (oPoint.getSelected()) {
			oRm.addClass("sapSuiteILCSelected");
		}
		oRm.writeClasses();
		oRm.addStyle("width", encodeXML(percentageWidth + "%"));
		oRm.addStyle("left", encodeXML(index * percentageWidth + "%"));
		oRm.writeStyles();
		oRm.write(">");

		//render point
		var sColor = oPoint.getColor();

		oRm.write("<div");

		if (!oPoint._bNullValue) {
			if (oPoint.getSelected()) {
				oRm.addClass("sapSuiteILCSelected");
			}
			if (sColor !== MobileLibrary.ValueColor.Neutral) {
				oRm.addClass("sapSuiteICSemanticColor" + sColor);
			}
			oRm.writeAttributeEscaped("id", oControl.getId() + "-point-" + index);
			oRm.addClass("sapSuiteILCPoint");
			oRm.addStyle("bottom", encodeXML(oControl._aNormalizedValues[index] + "%"));
		}
		oRm.writeClasses();
		oRm.writeStyles();
		oRm.write("></div>"); //point

		oRm.write("<div");
		oRm.addClass("sapSuiteILCBackgroundArea");
		oRm.writeClasses();
		oRm.write("></div>");

		var sAriaLabel = this._renderPointLabel(oRm, oControl, index, pointsLength);
		var sSemanticColor = oPoint._getSemanticColor();
		if (sSemanticColor) {
			sAriaLabel += " " + sSemanticColor;
		}
		var sTooltip = oPoint.getTooltip_Text();
		if (sTooltip && jQuery.trim(sTooltip).length > 0) {
			sAriaLabel = sTooltip;
		}

		oRm.write("<div");
		oRm.addClass("sapSuiteILCInteractionArea");
		oRm.addClass("sapMPointer");
		oRm.writeClasses();
		if (index === 0 && oControl._isChartEnabled()) {
			oRm.writeAttribute("tabindex", "0");
		}

		// point accessibility
		var oAccOptions = {};
		oAccOptions.role = "option";
		oAccOptions.label = sAriaLabel;
		oAccOptions.selected = oPoint.getSelected();
		oAccOptions.posinset = index + 1;
		oAccOptions.setsize = pointsLength;
		oRm.writeAccessibilityState(oPoint, oAccOptions);

		//tooltip for interactive mode
		if (oControl._isChartEnabled()) {
			var sAreaTooltip = oPoint.getTooltip_AsString();
			if (jQuery.type(sAreaTooltip) === "string") {
				oRm.writeAttributeEscaped("title", sAreaTooltip);
			}
		}

		oRm.write("></div>");
		oRm.write("</div>");
	};

	/**
	 * Renders the HTML for the given chart canvas, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the rendering buffer
	 * @param {sap.ui.core.Control} oControl The control to be rendered
	 * @param {int} displayedPoints The amount of points to be displayed
	 * @param {int} percentageWidth The width corresponding to each point expressed in percentage from the total available chart width
	 * @private
	 */
	InteractiveLineChartRenderer._renderChartCanvas = function (oRm, oControl, displayedPoints, percentageWidth) {
		var i,
			aPoints = oControl.getPoints();

		oRm.write("<div");
		oRm.addClass("sapSuiteILCChartCanvas");
		oRm.addClass("sapSuiteILCCanvasLayout");
		oRm.writeClasses();
		oRm.write(">");

		oRm.write("<svg");
		oRm.addClass("sapSuiteILCSvgElement");
		oRm.writeClasses();
		oRm.writeAttribute("focusable", "false");
		oRm.write(">");

		if (oControl._fNormalizedZero) {
			oRm.write("<line");
			oRm.writeAttribute("x1", "1%");
			oRm.writeAttributeEscaped("y1", 100 - oControl._fNormalizedZero + "%");
			oRm.writeAttribute("x2", "99%");
			oRm.writeAttributeEscaped("y2", 100 - oControl._fNormalizedZero + "%");
			oRm.writeAttribute("stroke-width", "1");
			oRm.addClass("sapSuiteILCDivider");
			oRm.writeClasses();
			oRm.write("/>");
		}

		var fnCreateLine = function (i, y, y1) {
			oRm.write("<line");
			oRm.writeAttributeEscaped("x1", percentageWidth / 2 + (i - 1) * percentageWidth + "%");
			oRm.writeAttributeEscaped("y1", 100 - y + "%");
			oRm.writeAttributeEscaped("x2", percentageWidth / 2 + (i * percentageWidth) + "%");
			oRm.writeAttributeEscaped("y2", 100 - y1 + "%");
			oRm.writeAttribute("stroke-width", "2");
			oRm.write("/>");
		};

		for (i = 1; i < displayedPoints; i++) {
			if (!aPoints[i - 1]._bNullValue && !aPoints[i]._bNullValue) {
				fnCreateLine(i, oControl._aNormalizedValues[i - 1], oControl._aNormalizedValues[i]);
			}
		}

		if (oControl._fNormalizedPrecedingPoint !== null) {
			fnCreateLine(0, oControl._fNormalizedPrecedingPoint, oControl._aNormalizedValues[0]);
		}

		if (oControl._fNormalizedSucceedingPoint !== null) {
			fnCreateLine(i, oControl._aNormalizedValues[i - 1], oControl._fNormalizedSucceedingPoint);
		}

		oRm.write("</svg>");
		oRm.write("</div>");
	};

	/**
	 * Renders the label to be displayed for the current point, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the rendering buffer
	 * @param {sap.ui.core.Control} oControl The control to be rendered
	 * @param {int} index The index of the point to be rendered inside the points aggregation
	 * @param {int} pointsLength The amount of points to be displayed
	 * @returns {string} The value of the aria-label accessibility attribute
	 * @private
	 */
	InteractiveLineChartRenderer._renderPointLabel = function (oRm, oControl, index, pointsLength) {
		var oPoint = oControl.getPoints()[index];
		var sBottomLabelText = oPoint.getLabel() || "", sTopLabelText = oPoint.getDisplayedValue();
		var aHeights;
		oRm.write("<div");
		oRm.addClass("sapSuiteILCTextElement");
		oRm.addClass("sapSuiteILCBottomText");
		oRm.addClass("sapMPointer");
		oRm.writeClasses();
		oRm.write(">");
		oRm.writeEscaped(sBottomLabelText);
		oRm.write("</div>");

		oRm.write("<div");
		oRm.addClass("sapSuiteILCTextElement");
		oRm.addClass("sapSuiteILCToplabel");
		oRm.addClass("sapMPointer");
		if (!oPoint._bNullValue) {
			if (!sTopLabelText) {
				sTopLabelText = oPoint.getValue().toString();
			}
			aHeights = [oControl._aNormalizedValues[index]];
			if (index > 0 && !oControl.getPoints()[index - 1]._bNullValue) {
				aHeights.push((oControl._aNormalizedValues[index] + oControl._aNormalizedValues[index - 1]) / 2);
			}
			if (index < pointsLength - 1 && !oControl.getPoints()[index + 1]._bNullValue) {
				aHeights.push((oControl._aNormalizedValues[index] + oControl._aNormalizedValues[index + 1]) / 2);
			}
			aHeights.sort(function (a, b) {
				return a - b;
			});
			if (oPoint.getValue() === oControl.nMax && oControl.nMax !== oControl.nMin) {
				oRm.addStyle("bottom", encodeXML(aHeights[aHeights.length - 1] + "%"));
				oRm.addClass("sapSuiteILCShiftAbove");
			} else if (oPoint.getValue() === oControl.nMin && oControl.nMax !== oControl.nMin) {
				oRm.addStyle("bottom", encodeXML(aHeights[0] + "%"));
				oRm.addClass("sapSuiteILCShiftBelow");
			} else if (Math.abs(oControl._aNormalizedValues[index] - aHeights[0]) < Math.abs(oControl._aNormalizedValues[index] - aHeights[aHeights.length - 1])) {
				oRm.addStyle("bottom", encodeXML(aHeights[0] + "%"));
				oRm.addClass("sapSuiteILCShiftBelow");
			} else {
				oRm.addStyle("bottom", encodeXML(aHeights[aHeights.length - 1] + "%"));
				oRm.addClass("sapSuiteILCShiftAbove");
			}
		} else {
			sTopLabelText = oControl._oRb.getText("INTERACTIVECHART_NA");
			oRm.addClass("sapSuiteILCShiftBelow");
			oRm.addClass("sapSuiteILCNaLabel");
		}
		oRm.writeClasses();
		oRm.writeStyles();
		oRm.write(">");
		oRm.writeEscaped(sTopLabelText);
		oRm.write("</div>");

		return sBottomLabelText + " " + sTopLabelText;
	};

	/**
	 * Renders an additional disabling overlay.
	 *
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the rendering buffer
	 * @param {sap.ui.core.Control} oControl The control to be rendered
	 * @private
	 */
	InteractiveLineChartRenderer._renderDisabledOverlay = function (oRm, oControl) {
		oRm.write("<div");
		oRm.addClass("sapSuiteILCDisabledOverlay");
		oRm.writeClasses();
		oRm.write(">");
		oRm.write("</div>");
	};

	/**
	 * Creates the value of the aria-describedby accessibility attribute
	 *
	 * @param {sap.ui.core.Control} oControl The control to be rendered
	 * @param {int} pointsLength The amount of points
	 * @returns {string} A comma-separated list of all InteractionAreas' IDs
	 * @private
	 */
	InteractiveLineChartRenderer._getAriaDescribedBy = function (oControl, pointsLength) {
		var aAreaIds = [];
		for (var i = 0; i < pointsLength; i++) {
			aAreaIds.push(oControl.getId() + "-point-area-" + i);
		}
		return aAreaIds.join(",");
	};

	return InteractiveLineChartRenderer;

}, /* bExport */ true);
