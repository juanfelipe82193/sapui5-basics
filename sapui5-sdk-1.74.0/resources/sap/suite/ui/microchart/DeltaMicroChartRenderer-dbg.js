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
	function(library, encodeXML, MicroChartRenderUtils, Parameters, MobileLibrary) {
	"use strict";

	// shortcut for sap.m.ValueColor
	var ValueColor = MobileLibrary.ValueColor;
	var DeltaMicroChartViewType = library.DeltaMicroChartViewType;

	/**
	 * DeltaMicroChart renderer.
	 * @namespace
	 */
	var DeltaMicroChartRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm The RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl The control to be rendered
	 */
	DeltaMicroChartRenderer.render = function(oRm, oControl) {
		function getDir(bLeft) {
			return bLeft ? "sapSuiteDMCDirectionLeft" : "sapSuiteDMCDirectionRight";
		}

		if (oControl._hasData()) {
			if (!oControl._bThemeApplied) {
				return;
			}
			var sDv1 = oControl.getDisplayValue1();
			var sDv2 = oControl.getDisplayValue2();
			var fVal1 = oControl.getValue1();
			var fVal2 = oControl.getValue2();
			var sDdv = oControl.getDeltaDisplayValue();
			var sAdv1ToShow = sDv1 ? sDv1 : "" + fVal1;
			var sAdv2ToShow = sDv2 ? sDv2 : "" + fVal2;
			var sAddvToShow = sDdv ? sDdv : "" + oControl._getDeltaValue();
			var sColor = oControl.getColor();

			var fnSetColor = function(sColor, sStyle) {
				if (ValueColor[sColor]) {
					oRm.addClass("sapSuiteDMCSemanticColor" + sColor);
				} else {
					oRm.addStyle(sStyle, Parameters.get(sColor) || sColor);
					oRm.writeStyles();
				}
			};

			var sTitle1 = oControl.getTitle1();
			var sTitle2 = oControl.getTitle2();
			var sView = oControl.getView();

			oRm.write("<div");
			this._writeMainProperties(oRm, oControl);

			if (!sTitle1) {
				oRm.addClass("sapSuiteDMCNoTitleTop");
			}

			if (!sTitle2) {
				oRm.addClass("sapSuiteDMCNoTitleBottom");
			}

			if (sView === DeltaMicroChartViewType.Wide) {
				oRm.addClass("sapSuiteDMCWideMode");
			}

			oRm.writeClasses();
			oRm.writeStyles();

			oRm.write(">");

			oRm.write("<div");
			oRm.addClass("sapSuiteDMCVerticalAlignmentContainer");
			oRm.writeClasses();
			oRm.write(">");

			if ((sTitle1 || sTitle2) && (sView === DeltaMicroChartViewType.Wide || sView === DeltaMicroChartViewType.Responsive)) {
				oRm.write("<div");
				oRm.addClass("sapSuiteDMCWideTitles");
				oRm.addClass("sapSuiteDMCLabel");
				oRm.writeClasses();
				oRm.write(">");
				this._renderTitle(oRm, sTitle1, "sapSuiteDMCPositionTop");
				this._renderTitle(oRm, sTitle2, "sapSuiteDMCPositionBtm");
				oRm.write("</div>"); // end ofsapSuiteDMCWideTitles

				oRm.write("<div");
				oRm.addClass("sapSuiteDMCSpacer");
				oRm.addClass("sapSuiteDMCSpacerLeft");
				oRm.writeClasses();
				oRm.write(">");
				oRm.write("</div>");
			}

			oRm.write("<div");
			oRm.addClass("sapSuiteDMCCnt");
			oRm.writeClasses();
			oRm.write(">");

			if (sTitle1 && (sView === DeltaMicroChartViewType.Normal || sView === DeltaMicroChartViewType.Responsive)) {
				this._renderTitle(oRm, sTitle1, "sapSuiteDMCPositionTop");
			}

			oRm.write("<div");
			oRm.addClass("sapSuiteDMCChart");
			oRm.writeClasses();
			oRm.writeAttribute("id", oControl.getId() + "-dmc-chart");
			oRm.write(">");
			oRm.write("<div");
			oRm.addClass("sapSuiteDMCBar");
			oRm.addClass("sapSuiteDMCBar1");

			if (oControl._oChartData.delta.isMax) {
				oRm.addClass("sapSuiteDMCBarDeltaMaxDelta");
			}
			if (oControl._oChartData.bar1.isSmaller) {
				oRm.addClass("sapSuiteDMCBarSizeSmaller");
			}
			if (parseFloat(oControl._oChartData.bar1.width) === 0) {
				oRm.addClass("sapSuiteDMCBarZeroWidth");
			} else if (parseFloat(oControl._oChartData.bar2.width) === 0) {
				oRm.addClass("sapSuiteDMCBarUniqueNonzero");
			}
			oRm.addClass(encodeXML(getDir(oControl._oChartData.bar1.left)));
			oRm.writeClasses();
			oRm.addStyle("width", encodeXML(oControl._oChartData.bar1.width + "%"));
			oRm.writeStyles();
			oRm.writeAttribute("id", oControl.getId() + "-dmc-bar1");
			oRm.write(">");
			oRm.write("<div");
			oRm.addClass("sapSuiteDMCBarInternal");
			oRm.addClass(encodeXML(getDir(oControl._oChartData.bar2.left)));
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("</div>");
			oRm.write("</div>");

			oRm.write("<div");
			oRm.addClass("sapSuiteDMCBar");
			oRm.addClass("sapSuiteDMCBar2");
			if (oControl._oChartData.delta.isMax) {
				oRm.addClass("sapSuiteDMCBarDeltaMaxDelta");
			}
			if (oControl._oChartData.bar2.isSmaller) {
				oRm.addClass("sapSuiteDMCBarSizeSmaller");
			}
			if (parseFloat(oControl._oChartData.bar2.width) === 0) {
				oRm.addClass("sapSuiteDMCBarZeroWidth");
			} else if (parseFloat(oControl._oChartData.bar1.width) === 0) {
				oRm.addClass("sapSuiteDMCBarUniqueNonzero");
			}
			oRm.addClass(encodeXML(getDir(oControl._oChartData.bar2.left)));
			oRm.writeClasses();
			oRm.addStyle("width", encodeXML(oControl._oChartData.bar2.width + "%"));
			oRm.writeStyles();
			oRm.writeAttribute("id", oControl.getId() + "-dmc-bar2");
			oRm.write(">");
			oRm.write("<div");
			oRm.addClass("sapSuiteDMCBarInternal");
			oRm.addClass(encodeXML(getDir(oControl._oChartData.bar1.left)));
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("</div>");
			oRm.write("</div>");

			oRm.write("<div");
			oRm.addClass("sapSuiteDMCBar");
			oRm.addClass("sapSuiteDMCBarDelta");
			if (!oControl._oChartData.delta.isMax) {
				oRm.addClass("sapSuiteDMCBarDeltaNotMax");
			}
			if (oControl._oChartData.delta.isZero) {
				oRm.addClass("sapSuiteDMCBarDeltaZero");
			}
			if (oControl._oChartData.delta.isEqual) {
				oRm.addClass("sapSuiteDMCBarDeltaEqual");
			}
			oRm.addClass(encodeXML(getDir(oControl._oChartData.delta.left)));
			oRm.writeClasses();
			oRm.addStyle("width", encodeXML(oControl._oChartData.delta.width + "%"));
			oRm.writeStyles();
			oRm.writeAttribute("id", oControl.getId() + "-dmc-bar-delta");
			oRm.write(">");
			oRm.write("<div");
			fnSetColor(sColor, "background-color");
			oRm.addClass("sapSuiteDMCBarDeltaInt");
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("</div>");

			oRm.write("<div");
			oRm.addClass("sapSuiteDMCBarDeltaStripe");
			oRm.addClass(encodeXML(getDir(true)));
			if (oControl._oChartData.delta.isEqual) {
				oRm.addClass("sapSuiteDMCBarDeltaEqual");
			}
			oRm.addClass("sapSuiteDMCBarDeltaFirstStripe" + (oControl._oChartData.delta.isFirstStripeUp ? "Up" : "Down"));
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("</div>");

			oRm.write("<div");
			oRm.addClass("sapSuiteDMCBarDeltaStripe");
			oRm.addClass(encodeXML(getDir(false)));
			oRm.addClass("sapSuiteDMCBarDeltaFirstStripe" + (oControl._oChartData.delta.isFirstStripeUp ? "Down" : "Up"));
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("</div>");
			oRm.write("</div>");
			oRm.write("</div>"); // end of sapSuiteDMCChart

			if (sTitle2 && (sView === DeltaMicroChartViewType.Normal || sView === DeltaMicroChartViewType.Responsive)) {
				this._renderTitle(oRm, sTitle2, "sapSuiteDMCPositionBtm");
			}

			oRm.write("</div>"); // end of sapSuiteDMCCnt

			oRm.write("<div");
			oRm.addClass("sapSuiteDMCSpacer");
			oRm.addClass("sapSuiteDMCSpacerRight");
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("</div>");

			oRm.write("<div");
			oRm.addClass("sapSuiteDMCLbls");
			oRm.writeClasses();
			oRm.write(">");
			oRm.write("<div");
			oRm.writeAttribute("id", oControl.getId() + "-value1");
			oRm.addClass("sapSuiteDMCLabel");
			oRm.addClass("sapSuiteDMCValue1");
			oRm.writeClasses();
			oRm.write(">");
			oRm.writeEscaped(sAdv1ToShow);
			oRm.write("</div>");

			oRm.write("<div");
			oRm.writeAttribute("id", oControl.getId() + "-delta");
			oRm.addClass("sapSuiteDMCLabel");
			oRm.addClass("sapSuiteDMCDelta");
			fnSetColor(sColor, "color");
			oRm.writeClasses();
			oRm.write(">");
			oRm.writeEscaped(sAddvToShow);
			oRm.write("</div>");

			oRm.write("<div");
			oRm.writeAttribute("id", oControl.getId() + "-value2");
			oRm.addClass("sapSuiteDMCLabel");
			oRm.addClass("sapSuiteDMCValue2");
			oRm.writeClasses();
			oRm.write(">");
			oRm.writeEscaped(sAdv2ToShow);
			oRm.write("</div>");
			oRm.write("</div>"); // end of sapSuiteDMCLbls

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

		DeltaMicroChartRenderer._renderTitle = function(oRm, sTitle, sClass) {
			oRm.write("<div");
			oRm.addClass("sapSuiteDMCLabel");
			oRm.addClass("sapSuiteDMCTitle");
			oRm.addClass(sClass);
			oRm.writeClasses();
			oRm.write(">");
			oRm.writeEscaped(sTitle);
			oRm.write("</div>");
		};


		/**
		 * Renders control data and prepares default classes and styles
		 *
		 * @param {object} oRm render manager
		 * @param {object} oControl AreaMicroChart control
		 * @private
		 */
		DeltaMicroChartRenderer._writeMainProperties = function(oRm, oControl) {
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
			oRm.addClass("sapSuiteDMC");
			oRm.addClass("sapSuiteDMCSize" + oControl.getSize());
			oRm.addStyle("width", oControl.getWidth());
			oRm.addStyle("height", oControl.getHeight());
		};

	MicroChartRenderUtils.extendMicroChartRenderer(DeltaMicroChartRenderer);

	return DeltaMicroChartRenderer;

}, /* bExport= */ true);
