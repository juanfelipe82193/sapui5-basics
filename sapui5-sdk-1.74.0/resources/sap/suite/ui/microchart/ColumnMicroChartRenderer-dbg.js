/*!
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */

sap.ui.define([
	    './library',
		"sap/base/security/encodeXML",
		'sap/suite/ui/microchart/MicroChartRenderUtils',
		'sap/ui/core/theming/Parameters',
		'sap/m/library',
		"./ColumnMicroChartRenderer"
	],
	function(library, encodeXML, MicroChartRenderUtils, Parameters, mobileLibrary) {
	"use strict";

	// shortcut for sap.m.ValueColor
	var ValueColor = mobileLibrary.ValueColor;
	// shortcut for sap.m.ValueCSSColor
	var ValueCSSColor = mobileLibrary.ValueCSSColor;

	var DEFAULT_ITEM_COLOR = "sapUiChartNeutral",
		DEFAULT_LABEL_COLOR = "sapUiChartCategoryAxisLabelFontColor";

	/**
	 * ColumnMicroChartRenderer renderer.
	 * @namespace
	 */
	var ColumnMicroChartRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to	the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl the control to be rendered
	 */
	ColumnMicroChartRenderer.render = function(oRm, oControl) {
		if (!oControl._bThemeApplied) {
			return;
		}

		var bColumnLabels = oControl.getAllowColumnLabels();
		var bAnyBottomColumnLabel = oControl.getColumns().some(function(oColumn) {
			return oColumn.getLabel();
		});

		if (oControl._hasData()) {
			oRm.write("<div");
			this._writeMainProperties(oRm, oControl);

			if (bColumnLabels) {
				oRm.addClass("sapSuiteClMCColumnLabels");
			}

			if (!bAnyBottomColumnLabel) {
				oRm.addClass("sapSuiteClMCNoBottomColumnLabels");
			}

			oRm.writeClasses();
			oRm.writeStyles();
			oRm.write(">");

			var bLeftTopLbl = oControl.getLeftTopLabel() && oControl.getLeftTopLabel().getLabel() !== "" && oControl.getShowTopLabels();
			var bRightTopLbl = oControl.getRightTopLabel() && oControl.getRightTopLabel().getLabel() !== "" && oControl.getShowTopLabels();
			var bLeftBtmLbl = oControl.getLeftBottomLabel() && oControl.getLeftBottomLabel().getLabel() !== "" && oControl.getShowBottomLabels();
			var bRightBtmLbl = oControl.getRightBottomLabel() && oControl.getRightBottomLabel().getLabel() !== "" && oControl.getShowBottomLabels();

			oRm.write("<div");
			oRm.addClass("sapSuiteClMCVerticalAlignmentContainer");
			oRm.writeClasses();
			oRm.write(">");

			if (bLeftTopLbl || bRightTopLbl) {
				oRm.write("<div");
				oRm.writeAttributeEscaped("id", oControl.getId() + "-top-lbls");
				oRm.addClass("sapSuiteClMCLabels");
				oRm.addClass("sapSuiteClMCPositionTop");
				oRm.writeClasses();
				oRm.write(">");
				var bWideTopLbl = bLeftTopLbl ^ bRightTopLbl;
				if (bLeftTopLbl) {
					this._writeEdgeLabel(oRm, oControl, oControl.getLeftTopLabel(), "-left-top-lbl", "sapSuiteClMCPositionLeft", bWideTopLbl);
				}

				if (bRightTopLbl) {
					this._writeEdgeLabel(oRm, oControl, oControl.getRightTopLabel(), "-right-top-lbl", "sapSuiteClMCPositionRight", bWideTopLbl);
				}
				oRm.write("</div>");
			}

			var aColumns = oControl.getColumns();
			var iColumnsNum = aColumns.length;
			var bTopColumnLabels, bBottomColumnLabels;
			var oColumn, fValue, i;

			if (bColumnLabels) {
				for (i = 0; i < iColumnsNum; i++) {
					oColumn = aColumns[i];
					fValue = oColumn.getValue();

					if (fValue && fValue >= 0) {
						bTopColumnLabels = true;
					} else if (fValue && fValue < 0) {
						bBottomColumnLabels = true;
					}

					if (bTopColumnLabels && bBottomColumnLabels) {
						break;
					}
				}
			}

			if (bColumnLabels && bTopColumnLabels) {
				oRm.write("<div");
				oRm.addClass("sapSuiteClMCColumnLabelDivider");
				oRm.writeClasses();
				oRm.write("></div>");
			}

			oRm.write("<div");
			oRm.writeAttributeEscaped("id", oControl.getId() + "-bars");
			oRm.addClass("sapSuiteClMCBars");
			oRm.writeClasses();
			oRm.write(">");

			for (i = 0; i < iColumnsNum; i++) {
				oColumn = aColumns[i];
				fValue = oColumn.getValue();

				oRm.write("<div");
				oRm.writeElementData(oColumn);
				oRm.addClass("sapSuiteClMCBar");

				if (oColumn.hasListeners("press")) {
					oRm.writeAttribute("tabindex", "0");
					oRm.writeAttribute("role", "presentation");
					var sBarAltText = oControl._getBarAltText(oColumn);
					oRm.writeAttributeEscaped("title", sBarAltText);
					oRm.writeAttributeEscaped("aria-label", sBarAltText);
					oRm.addClass("sapSuiteUiMicroChartPointer");
				}

				oRm.writeClasses();
				oRm.write(">");

				if (bColumnLabels && jQuery.isNumeric(fValue) && fValue >= 0) {
					this._writeColumnValueLabel(oRm, oColumn, "sapSuiteClMCLabelColumnTop");
				}

				oRm.write("<div");
				oRm.addClass("sapSuiteClMCInnerBar");

				this._setHexColor(oRm, oColumn.getColor(), DEFAULT_ITEM_COLOR, "background-color");

				oRm.writeClasses();
				oRm.writeStyles();
				oRm.write(">");
				oRm.write("</div>");

				if (bColumnLabels && jQuery.isNumeric(fValue) && fValue < 0) {
					this._writeColumnValueLabel(oRm, oColumn, "sapSuiteClMCLabelColumnBottom");
				}

				oRm.write("</div>");
			}
			oRm.write("</div>");

			if (bColumnLabels && bBottomColumnLabels) {
				oRm.write("<div");
				oRm.addClass("sapSuiteClMCColumnLabelDivider");
				oRm.writeClasses();
				oRm.write("></div>");
			}

			if (bLeftBtmLbl || bRightBtmLbl) {
				oRm.write("<div");
				oRm.writeAttributeEscaped("id", oControl.getId() + "-btm-lbls");
				oRm.addClass("sapSuiteClMCLabels");
				oRm.addClass("sapSuiteClMCPositionBtm");
				oRm.writeClasses();
				oRm.write(">");
				var bWideBtmLbl = bLeftBtmLbl ^ bRightBtmLbl; // XOR

				if (bLeftBtmLbl) {
					this._writeEdgeLabel(oRm, oControl, oControl.getLeftBottomLabel(), "-left-btm-lbl", "sapSuiteClMCPositionLeft", bWideBtmLbl);
				}

				if (bRightBtmLbl) {
					this._writeEdgeLabel(oRm, oControl, oControl.getRightBottomLabel(), "-right-btm-lbl", "sapSuiteClMCPositionRight", bWideBtmLbl);
				}

				oRm.write("</div>");
			}

			if (bColumnLabels && bAnyBottomColumnLabel) {
				oRm.write("<div");
				oRm.addClass("sapSuiteClMCLabels");
				oRm.addClass("sapSuiteClMCBottomColumnLabels");
				oRm.writeClasses();
				oRm.write(">");

				aColumns.forEach(function(oColumn) {
					this._writeColumnLabel(oRm, oColumn);
				}, this);

				oRm.write("</div>");
			}

			oRm.write("<div");
			oRm.writeAttributeEscaped("id", oControl.getId() + "-hidden");
			oRm.writeAttribute("aria-hidden", "true");
			oRm.writeAttribute("tabindex", "0");
			oRm.writeStyles();
			oRm.write(">");
			oRm.write("</div>");

			oRm.write("</div>"); // end of vertical containment
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
	ColumnMicroChartRenderer._writeMainProperties = function(oRm, oControl) {
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
		oRm.addClass("sapSuiteClMC");
		oRm.addClass("sapSuiteClMCSize" + oControl.getSize());
		oRm.addStyle("width", oControl.getWidth());
		oRm.addStyle("height", oControl.getHeight());
	};

	ColumnMicroChartRenderer._getHexColor = function (sColor, sDefaultColor) {
		sColor = ValueCSSColor.isValid(sColor) ? sColor : sDefaultColor;
		return Parameters.get(sColor) || sColor;
	};

	ColumnMicroChartRenderer._setHexColor = function (oRm, sColor, sDefaultColor, sStyle) {
			ValueColor[sColor] ? oRm.addClass(encodeXML("sapSuiteClMCSemanticColor" + sColor)) : oRm.addStyle(sStyle, this._getHexColor(sColor, sDefaultColor));
	};

	ColumnMicroChartRenderer._writeEdgeLabel = 	function (oRm, oControl, oLabel, sId, sClass, bWideBtmLbl) {
		oRm.write("<div");
		oRm.writeAttributeEscaped("id", oControl.getId() + sId);
		oRm.addClass("sapSuiteClMCLabel");
		oRm.addClass("sapSuiteClMCEdgeLabel");
		oRm.addClass(encodeXML(sClass));
		this._setHexColor(oRm, oLabel.getColor(), DEFAULT_LABEL_COLOR, "color");

		if (bWideBtmLbl) {
			oRm.addClass("sapSuiteClMCWideBtmLbl");
		}
		oRm.writeClasses();
		oRm.writeStyles();
		oRm.write(">");
		oRm.writeEscaped(oLabel.getLabel());
		oRm.write("</div>");
	};

	ColumnMicroChartRenderer._writeColumnValueLabel = function (oRm, oColumn, sClass) {
		var sValue = oColumn.getDisplayValue() ? oColumn.getDisplayValue() : oColumn.getValue();

		oRm.write("<div");
		oRm.addClass("sapSuiteClMCLabel");
		oRm.addClass("sapSuiteClMCLabelColumn");
		oRm.addClass(sClass);
		this._setHexColor(oRm, oColumn.getColor(), DEFAULT_ITEM_COLOR, "background-color");
		oRm.writeStyles();
		oRm.writeClasses();
		oRm.write(">");
		oRm.write(sValue);
		oRm.write("</div>");
	};

	ColumnMicroChartRenderer._writeColumnLabel = function (oRm, oColumn) {
		var sLabel = oColumn.getLabel();

		oRm.write("<div");
		oRm.addClass("sapSuiteClMCLabel");
		oRm.addClass("sapSuiteClMCLabelColumn");
		oRm.addClass("sapSuiteClMCBottomColumnLabel");
		oRm.writeClasses();
		oRm.write(">");
		oRm.write(sLabel);
		oRm.write("</div>");
	};

	MicroChartRenderUtils.extendMicroChartRenderer(ColumnMicroChartRenderer);

	return ColumnMicroChartRenderer;

}, /* bExport= */ true);
