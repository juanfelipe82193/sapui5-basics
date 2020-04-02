/*!
* SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/m/library",
	"sap/ui/Device",
	"./library",
	"sap/base/security/encodeXML",
	"sap/suite/ui/microchart/MicroChartRenderUtils",
	"sap/ui/core/theming/Parameters"
], function (jQuery, MobileLibrary, Device, library, encodeXML, MicroChartRenderUtils, Parameters, ValueColor, ValueCSSColor) {
	"use strict";

	// shortcut for sap.m.ValueColor
	var ValueColor = MobileLibrary.ValueColor;
	// shortcut for sap.m.ValueCSSColor
	var ValueCSSColor = MobileLibrary.ValueCSSColor;

	// lazy dependency to avoid cyclic dependency
	var HarveyBallMicroChart;

	/**
	 * HarveyBallMicroChartRenderer renderer.
	 * @namespace
	 */
	var HarveyBallMicroChartRenderer = {};

	HarveyBallMicroChartRenderer._iReferenceControlSize = 72;
	HarveyBallMicroChartRenderer._iReferenceControlCenter = HarveyBallMicroChartRenderer._iReferenceControlSize / 2;

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the Render - Output - Buffer
	 * @param {sap.ui.core.Control} oControl the control to be rendered
	 */
	HarveyBallMicroChartRenderer.render = function (oRm, oControl) {
		HarveyBallMicroChart = HarveyBallMicroChart || sap.ui.require("sap/suite/ui/microchart/HarveyBallMicroChart");

		if (!oControl._hasData()) {
			oRm.write("<div");
			this._writeMainProperties(oRm, oControl);
			oRm.writeClasses();
			oRm.writeStyles();
			oRm.write(">");

			this._renderNoData(oRm);

			oRm.write("</div>");
			return;
		}

		if (!oControl._bThemeApplied) {
			return;
		}
		this._calculatePath(oControl);
		var aColorPalette = oControl.getColorPalette();
		var sTotalScale = "";
		var sValueLabel = "";
		var sValueScale = "";
		var bFmtLabel = false;
		var fValue = 0;
		var sColorClass = "";

		var fnGetColor = function (sColor) {
			if (ValueColor[sColor]) {
				sColorClass = "sapSuiteHBMCSemanticColor" + encodeXML(sColor);
			} else if (ValueCSSColor.isValid(sColor)) {
				return Parameters.get(sColor) || sColor;
			}
			return null;
		};

		var sColor = aColorPalette.length > 0 ? fnGetColor(aColorPalette[0]) : null;
		var iCircleRadius = this._oPath.center;

		if (oControl._isThemeHighContrast()) {
			iCircleRadius -= 1;
		}

		// currently only value from first item is supported
		if (oControl.getItems().length) {
			var oPieItem = oControl.getItems()[0];
			fValue = oPieItem.getFraction();
			sValueLabel = oPieItem.getFractionLabel() ? oPieItem.getFractionLabel() : sValueLabel + oPieItem.getFraction();
			sValueScale = oPieItem.getFractionScale() ? oPieItem.getFractionScale().substring(0, 3) : sValueScale;
			bFmtLabel = oPieItem.getFormattedLabel();

			if (!sColor && !sColorClass) {
				// If colorPalette isn't set use color form Item
				sColor = fnGetColor(oPieItem.getColor());
			}
		}

		if (bFmtLabel) {
			var oFormattedValue = oControl._parseFormattedValue(sValueLabel);

			sValueScale = oFormattedValue.scale.substring(0, 3);
			sValueLabel = oFormattedValue.value;
		}

		var fTotal = oControl.getTotal();
		var sTotalLabel = oControl.getTotalLabel() ? oControl.getTotalLabel() : "" + oControl.getTotal();
		if (oControl.getTotalScale()) {
			sTotalScale = oControl.getTotalScale().substring(0, 3);
		}

		if (oControl.getFormattedLabel()) {
			var oFormattedTotal = oControl._parseFormattedValue(sTotalLabel);
			sTotalScale = oFormattedTotal.scale.substring(0, 3);
			sTotalLabel = oFormattedTotal.value;
		}

		if (sValueLabel) {
			sValueLabel = HarveyBallMicroChart._truncateValue(sValueLabel, HarveyBallMicroChart.VALUE_TRUNCATION_DIGITS);
		}
		if (sTotalLabel) {
			sTotalLabel = HarveyBallMicroChart._truncateValue(sTotalLabel, HarveyBallMicroChart.VALUE_TRUNCATION_DIGITS);
		}

		oRm.write("<div");
		this._writeMainProperties(oRm, oControl);

		oRm.writeClasses();
		oRm.writeStyles();
		oRm.write(">");

		oRm.write("<div");
		oRm.addClass("sapSuiteHBMCAlign" + oControl.getAlignContent());
		oRm.addClass("sapSuiteHBMCVerticalAlignmentContainer");
		oRm.writeClasses();
		oRm.write(">");

		oRm.write("<div");
		oRm.addClass("sapSuiteHBMCChart");
		oRm.writeClasses();
		oRm.write(">");

		oRm.write("<svg");
		oRm.addClass("sapSuiteHBMCChartSvg");
		oRm.writeClasses();
		oRm.writeAttribute("id", oControl.getId() + "-harvey-ball");
		oRm.writeAttributeEscaped("viewBox", "0 0 72 72");
		oRm.writeAttribute("focusable", false);
		oRm.write(">");
		oRm.write("<g>");
		oRm.write("<circle");
		oRm.writeAttributeEscaped("cx", this._oPath.center);
		oRm.writeAttributeEscaped("cy", this._oPath.center);
		oRm.writeAttributeEscaped("r", iCircleRadius);
		oRm.addClass("sapSuiteHBMCBackgroundCircle");
		oRm.writeClasses();
		oRm.write("/>");

		if (fValue && fValue >= fTotal) {
			oRm.write("<circle");
			oRm.writeAttributeEscaped("cx", this._oPath.center);
			oRm.writeAttributeEscaped("cy", this._oPath.center);
			oRm.writeAttributeEscaped("r", iCircleRadius - this._oPath.border);
			oRm.addClass("sapSuiteHBMCSegment");
			if (sColor) {
				oRm.addStyle("fill", sColor);
				oRm.writeStyles();
			} else {
				oRm.addClass(encodeXML(sColorClass));
			}
			oRm.writeClasses();

			oRm.write("/>");
		} else if (fValue > 0) {
			oRm.write("<path");
			oRm.writeAttribute("id", oControl.getId() + "-segment");
			oRm.addClass("sapSuiteHBMCSegment");
			if (sColor) {
				oRm.addStyle("fill", sColor);
				oRm.writeStyles();
			} else {
				oRm.addClass(encodeXML(sColorClass));
			}
			oRm.writeClasses();
			oRm.writeAttributeEscaped("d", this._serializePieChart());

			oRm.write("/>");
		}
		oRm.write("</g>");
		oRm.write("</svg>");
		oRm.write("</div>");

		// Text container
		oRm.write("<div");
		oRm.addClass("sapSuiteHBMCTextContainer");
		oRm.writeClasses();
		oRm.write(">");

		if (oControl.getShowFractions()) {
			oRm.write("<div");
			oRm.addClass("sapSuiteHBMCValueContainer");
			oRm.writeClasses();
			oRm.write(">");
			this.renderLabel(oRm, oControl, [
				sColorClass,
				"sapSuiteHBMCValue"
			], sValueLabel, sColor, "-fraction");
			this.renderLabel(oRm, oControl, [
				sColorClass,
				"sapSuiteHBMCValueScale"
			], sValueScale, sColor, "-fraction-scale");
			oRm.write("</div>");
		}

		if (oControl.getShowTotal()) {
			oRm.write("<div");
			oRm.addClass("sapSuiteHBMCTotalContainer");
			oRm.writeClasses();
			oRm.write(">");
			this.renderLabel(oRm, oControl, [
				sColorClass,
				"sapSuiteHBMCTotal"
			], sTotalLabel, sColor, "-total");
			this.renderLabel(oRm, oControl, [
				sColorClass,
				"sapSuiteHBMCTotalScale"
			], sTotalScale, sColor, "-total-scale");
			oRm.write("</div>");
		}
		oRm.write("</div>");
		oRm.write("</div>");
		oRm.write("</div>");
	};

	/**
	 * Renders control data and prepares default classes and styles
	 *
	 * @param {object} oRm render manager
	 * @param {object} oControl AreaMicroChart control
	 * @private
	 */
	HarveyBallMicroChartRenderer._writeMainProperties = function (oRm, oControl) {
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
		oRm.addClass("sapSuiteHBMC");
		oRm.addClass("sapSuiteHBMCSize" + oControl.getSize());
		oRm.addStyle("width", oControl.getWidth());
		oRm.addStyle("height", oControl.getHeight());
	};

	HarveyBallMicroChartRenderer.renderLabel = function (oRm, oControl, aClasses, sLabel, sColor, sId) {
		var bUseColorPalette = !(aClasses.indexOf("sapSuiteHBMCTotal") > -1 || aClasses.indexOf("sapSuiteHBMCTotalScale") > -1);
		oRm.write("<span");
		oRm.writeAttribute("id", oControl.getId() + sId);
		for (var i = 0; i < aClasses.length; i++) {
			// uses palette color only for fraction label and scale
			if (!(i === 0 && sColor && bUseColorPalette)) {
				oRm.addClass(encodeXML(aClasses[i]));
			}
		}
		oRm.writeClasses();
		oRm.write(">");
		if (sLabel) {
			oRm.writeEscaped(sLabel);
		}
		oRm.write("</span>");
	};

	HarveyBallMicroChartRenderer._calculatePath = function (oControl) {
		var fTot = oControl.getTotal();
		var fFrac = 0;
		if (oControl.getItems().length) {
			fFrac = oControl.getItems()[0].getFraction();
		}

		var iCenter = HarveyBallMicroChartRenderer._iReferenceControlCenter;
		var iBorder = 5;
		this._oPath = {
			initial: {
				x: iCenter,
				y: iCenter
			},
			lineTo: {
				x: iCenter,
				y: iBorder
			},
			arc: {
				x1: iCenter - iBorder,
				y1: iCenter - iBorder,
				largeArc: 0,
				x2: "",
				y2: ""
			},
			size: HarveyBallMicroChartRenderer._iReferenceControlSize,
			border: iBorder,
			center: iCenter
		};

		var fAngle = fFrac / fTot * 360;
		var fRad = Math.PI / 180.0;
		var fRadius = this._oPath.center - this._oPath.border;
		var ix = fRadius * Math.cos((fAngle - 90) * fRad) + this._oPath.center;
		var iy = this._oPath.size - (fRadius * Math.sin((fAngle + 90) * fRad) + this._oPath.center);
		this._oPath.arc.x2 = ix.toFixed(2);
		this._oPath.arc.y2 = iy.toFixed(2);
		var iLargeArc = fTot / fFrac < 2 ? 1 : 0;

		this._oPath.arc.largeArc = iLargeArc;
	};

	HarveyBallMicroChartRenderer._serializePieChart = function () {
		var p = this._oPath;
		return [
			"M", p.initial.x, ",", p.initial.y,
			" L", p.initial.x, ",", p.lineTo.y,
			" A", p.arc.x1, ",", p.arc.y1, " 0 ", p.arc.largeArc, ",1 ", p.arc.x2, ",", p.arc.y2,
			" L", p.initial.x, ",", p.initial.y,
			" z"
		].join("");
	};

	MicroChartRenderUtils.extendMicroChartRenderer(HarveyBallMicroChartRenderer);

	return HarveyBallMicroChartRenderer;

}, /* bExport */ true);
