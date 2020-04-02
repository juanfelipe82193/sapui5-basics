/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

sap.ui.define([
		'./library',
		'sap/m/library',
		'sap/suite/ui/microchart/MicroChartRenderUtils',
	    "sap/base/security/encodeXML"
	], function(library, MobileLibrary, MicroChartRenderUtils, encodeXML) {
	"use strict";

	/**
	 * BulletMicroChart renderer.
	 * @namespace
	 */
	var BulletMicroChartRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.suite.ui.microchart.BulletMicroChart} oControl the control to be rendered
	 */
	BulletMicroChartRenderer.render = function(oRm, oControl) {
		if (!oControl._bThemeApplied) {
			return;
		}

		if (oControl._hasData()) {
			var oChartData = oControl._calculateChartData();
			var fForecastValuePct = +oChartData.forecastValuePct;
			var sSize;
			if (oControl._isResponsive()) {
				sSize = "sapSuiteBMCResponsive";
			} else {
				sSize = "sapSuiteBMCSize" + oControl.getSize();
			}
			var sScale = oControl.getScale();
			var sDirection = sap.ui.getCore().getConfiguration().getRTL() ? "right" : "left";
			var sMode = "sapSuiteBMCModeType" + oControl.getMode();
			var sDeltaValue = oControl.getMode() === library.BulletMicroChartModeType.Delta ? oControl._calculateDeltaValue() : 0;
			var bIsActualSet = oControl.getActual() && oControl.getActual()._isValueSet;
			var bShowActualValue = oControl.getShowActualValue() && oControl.getSize() !== MobileLibrary.Size.XS && oControl.getMode() ===  library.BulletMicroChartModeType.Actual;
			var bShowActualValueInDelta = oControl.getShowActualValueInDeltaMode() && oControl.getSize() !== MobileLibrary.Size.XS && oControl.getMode() === library.BulletMicroChartModeType.Delta;
			var bShowDeltaValue = oControl.getShowDeltaValue() && oControl.getSize() !== MobileLibrary.Size.XS && oControl.getMode() === library.BulletMicroChartModeType.Delta;
			var bShowTargetValue = oControl.getShowTargetValue() && oControl.getSize() !== MobileLibrary.Size.XS;
			var bShowThresholds = oControl.getShowThresholds();
			var sActualValueLabel = oControl.getActualValueLabel();
			var sDeltaValueLabel = oControl.getDeltaValueLabel();
			var sTargetValueLabel = oControl.getTargetValueLabel();
			var aData = oControl.getThresholds();

			var sSemanticColor;
			if (bIsActualSet) {
				sSemanticColor = "sapSuiteBMCSemanticColor" + oControl.getActual().getColor();
			}

			oRm.write("<div");
			this._writeMainProperties(oRm, oControl);

			oRm.writeClasses();
			oRm.writeStyles();

			oRm.writeAttribute("id", oControl.getId() + "-bc-content");
			oRm.write(">");

			oRm.write("<div");
			oRm.addClass("sapSuiteBMCVerticalAlignmentContainer");
			oRm.writeClasses();
			oRm.write(">");

			oRm.write("<div");
			oRm.addClass("sapSuiteBMCChart");
			oRm.addClass(encodeXML(sSize));
			oRm.writeClasses();
			oRm.writeAttribute("id", oControl.getId() + "-bc-chart");
			oRm.write(">");

			if ((bIsActualSet && (bShowActualValue || bShowActualValueInDelta)) || (bIsActualSet && oControl._isTargetValueSet && bShowDeltaValue)) {
				var sValScale = "";
				oRm.write("<div");
				oRm.addClass("sapSuiteBMCTopLabel");
				oRm.writeClasses();
				oRm.write(">");
				if (bIsActualSet && (bShowActualValue || bShowActualValueInDelta)) {
					var sActualValueToRender = sActualValueLabel ? sActualValueLabel : "" + oControl.getActual().getValue();
					sValScale = sActualValueToRender + sScale;
					oRm.write("<div");
					oRm.addClass("sapSuiteBMCItemValue");
					oRm.addClass(encodeXML(sSemanticColor));
					oRm.addClass(encodeXML(sSize));
					oRm.writeClasses();
					oRm.writeStyles();
					oRm.writeAttribute("id", oControl.getId() + "-bc-item-value");
					oRm.write(">");
					oRm.writeEscaped(sValScale);
					oRm.write("</div>");
				} else if (bIsActualSet && oControl._isTargetValueSet && bShowDeltaValue) {
					var sDeltaValueToRender = sDeltaValueLabel ? sDeltaValueLabel : "" + sDeltaValue;
					sValScale = sDeltaValueToRender + sScale;
					oRm.write("<div");
					oRm.addClass("sapSuiteBMCItemValue");
					oRm.addClass(encodeXML(sSemanticColor));
					oRm.addClass(encodeXML(sSize));
					oRm.writeClasses();
					oRm.writeStyles();
					oRm.writeAttribute("id", oControl.getId() + "-bc-item-value");
					oRm.write(">");
					oRm.write("&Delta;");
					oRm.writeEscaped(sValScale);
					oRm.write("</div>");
				}
				oRm.write("</div>");
			}

			oRm.write("<div");
			oRm.addClass("sapSuiteBMCChartCanvas");
			oRm.writeClasses();
			oRm.write(">");

			if (bShowThresholds) {
				for (var i = 0; i < oChartData.thresholdsPct.length; i++) {
					if (aData[i]._isValueSet) {
						this.renderThreshold(oRm,  oControl, oChartData.thresholdsPct[i], sSize);
					}
				}
			}

			oRm.write("<div");
			oRm.writeAttribute("id", oControl.getId() + "-chart-bar");
			oRm.addClass("sapSuiteBMCBar");
			oRm.addClass(encodeXML(sSize));
			oRm.addClass("sapSuiteBMCScaleColor" + oControl.getScaleColor());
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("</div>");

			if (bIsActualSet) {
				//render forecast value bar
				if (oControl._isForecastValueSet && oControl.getMode() === library.BulletMicroChartModeType.Actual) {
					oRm.write("<div");
					oRm.addClass("sapSuiteBMCForecastBarValue");
					oRm.addClass(encodeXML(sSemanticColor));
					oRm.addClass(encodeXML(sSize));
					oRm.writeClasses();
					oRm.addStyle("width", fForecastValuePct + "%");
					oRm.writeStyles();
					oRm.writeAttribute("id", oControl.getId() + "-forecast-bar-value");
					oRm.write("></div>");
				}

				oRm.write("<div");
				oRm.addClass("sapSuiteBMCBarValueMarker");
				oRm.addClass(sMode);
				if (!oControl.getShowValueMarker()) {
					oRm.addClass("sapSuiteBMCBarValueMarkerHidden");
				}
				oRm.addClass(encodeXML(sSemanticColor));
				oRm.addClass(encodeXML(sSize));
				oRm.writeClasses();
				oRm.addStyle(encodeXML(sDirection), encodeXML(parseFloat(oChartData.actualValuePct) + parseFloat(1) + "%"));
				if (oControl.getMode() === library.BulletMicroChartModeType.Delta && oChartData.actualValuePct <= oChartData.targetValuePct) {
					oRm.addStyle("margin", "0");
				}
				oRm.writeStyles();
				oRm.writeAttribute("id", oControl.getId() + "-bc-bar-value-marker");
				oRm.write("></div>");

				//render actual value bar
				if (oControl.getMode() === library.BulletMicroChartModeType.Actual && oChartData.actualValuePct !== 0) {
					oRm.write("<div");
					oRm.addClass("sapSuiteBMCBarValue");
					oRm.addClass(encodeXML(sSemanticColor));
					oRm.addClass(encodeXML(sSize));
					if (oControl._isForecastValueSet) {
						oRm.addClass("sapSuiteBMCForecast");
					}
					oRm.writeClasses();
					oRm.addStyle("width", encodeXML(oChartData.actualValuePct + "%"));
					oRm.writeStyles();
					oRm.writeAttribute("id", oControl.getId() + "-bc-bar-value");
					oRm.write("></div>");
				} else if (oControl._isTargetValueSet && oControl.getMode() === library.BulletMicroChartModeType.Delta) {
					oRm.write("<div");
					oRm.addClass("sapSuiteBMCBarValue");
					oRm.addClass(encodeXML(sSemanticColor));
					oRm.addClass(encodeXML(sSize));
					oRm.writeClasses();
					oRm.addStyle("width", encodeXML(Math.abs(oChartData.actualValuePct - oChartData.targetValuePct) + "%"));
					oRm.addStyle(encodeXML(sDirection), encodeXML(1 + Math.min(oChartData.actualValuePct, oChartData.targetValuePct) + "%"));
					oRm.writeStyles();
					oRm.writeAttribute("id", oControl.getId() + "-bc-bar-value");
					oRm.write("></div>");
				}
			}

			if (oControl._isTargetValueSet) {
				oRm.write("<div");
				oRm.addClass("sapSuiteBMCTargetBarValue");
				oRm.addClass(encodeXML(sSize));
				oRm.writeClasses();
				oRm.addStyle(encodeXML(sDirection), encodeXML(parseFloat(oChartData.targetValuePct).toFixed(2) + "%"));
				oRm.writeStyles();
				oRm.writeAttribute("id", oControl.getId() + "-bc-target-bar-value");
				oRm.write("></div>");
				oRm.write("</div>");

				if (bShowTargetValue) {
					oRm.write("<div");
					oRm.addClass("sapSuiteBMCBottomLabel");
					oRm.writeClasses();
					oRm.write(">");
					var sTValToShow = sTargetValueLabel ? sTargetValueLabel : "" + oControl.getTargetValue();
					var sTValScale = sTValToShow + sScale;
					oRm.write("<div");
					oRm.addClass("sapSuiteBMCTargetValue");
					oRm.addClass(encodeXML(sSize));
					oRm.writeClasses();
					oRm.writeStyles();
					oRm.writeAttribute("id", oControl.getId() + "-bc-target-value");
					oRm.write(">");
					oRm.writeEscaped(sTValScale);
					oRm.write("</div>");
					oRm.write("</div>");
				}
			} else {
				oRm.write("</div>");
			}
			oRm.write("</div>");

			oRm.write("<div");
			oRm.writeAttribute("id", oControl.getId() + "-info");
			oRm.writeAttribute("aria-hidden", "true");
			oRm.addStyle("display", "none");
			oRm.writeStyles();
			oRm.write(">");
			oRm.write("</div>");
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
		BulletMicroChartRenderer._writeMainProperties = function(oRm, oControl) {
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
			oRm.addClass("sapSuiteBMC");
			oRm.addClass("sapSuiteBMCContent");
			oRm.addClass(oControl._isResponsive() ? "sapSuiteBMCResponsive" : "sapSuiteBMCSize" + oControl.getSize());

			oRm.addStyle("width", oControl.getWidth());
			oRm.addStyle("height", oControl.getHeight());
		};

	/**
	 * Renders the HTML for the thresholds, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.suite.ui.microchart.BulletMicroChart} oControl the control to be rendered
	 * @param {object} oThreshold an object containing threshold values and colors
	 * @param {string} sSize a string representing the size CSS class
	 */
	BulletMicroChartRenderer.renderThreshold = function(oRm, oControl, oThreshold, sSize) {
		var sDirection = sap.ui.getCore().getConfiguration().getRTL() ? "right" : "left",
			fValuePct = 0.98 * oThreshold.valuePct + 1,
			sColor = "sapSuiteBMCSemanticColor" + oThreshold.color;

		if (sColor === "sapSuiteBMCSemanticColor" + MobileLibrary.ValueColor.Error) {
			oRm.write("<div");
			oRm.addClass("sapSuiteBMCDiamond");
			oRm.addClass(encodeXML(sSize));
			oRm.addClass(encodeXML(sColor));
			oRm.writeClasses();
			oRm.addStyle(encodeXML(sDirection), encodeXML(fValuePct + "%"));
			oRm.writeStyles();
			oRm.write("></div>");
		}
		oRm.write("<div");
		oRm.addClass("sapSuiteBMCThreshold");
		oRm.addClass(encodeXML(sSize));
		oRm.addClass(encodeXML(sColor));
		oRm.writeClasses();
		oRm.addStyle(encodeXML(sDirection), encodeXML(fValuePct + "%"));
		oRm.writeStyles();
		oRm.write("></div>");
	};

	MicroChartRenderUtils.extendMicroChartRenderer(BulletMicroChartRenderer);

	return BulletMicroChartRenderer;

}, /* bExport= */ true);
