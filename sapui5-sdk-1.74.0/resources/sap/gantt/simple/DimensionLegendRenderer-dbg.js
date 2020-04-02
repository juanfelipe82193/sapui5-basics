/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/base/util/ObjectPath",
	"sap/gantt/misc/Utility",
	"./BasePath",
	"sap/ui/core/Core"
], function (ObjectPath, Utility, BasePath, Core) {
	"use strict";

	/**
	 * DimensionLegend renderer.
	 *
	 * @namespace
	 */
	var DimensionLegendRenderer = {};

	var _iBaseSpace = 10;

	var fnDensityHeight = function() {
		var iDefaultItemLineHeight = 32;
		var sDensity = Utility.findSapUiSizeClass();
		return Utility.scaleBySapUiSize(sDensity, iDefaultItemLineHeight);
	};

	DimensionLegendRenderer.render = function (oRm, oDimensionLegend) {
		oRm.write("<div");
		oRm.writeControlData(oDimensionLegend);

		oRm.write(">");

		var ColumnConfigs = oDimensionLegend.getColumnConfigs();
		var RowConfigs = oDimensionLegend.getRowConfigs();
		var aYDimensionRenderItems = [];

		for (var i = 0; i < RowConfigs.length; i++){
			var oYDimensionConfig = RowConfigs[i];
			var mRowConfigData = {};
			mRowConfigData.text = oYDimensionConfig.getText();

			var sShapeClass = oYDimensionConfig.getShapeClass();
			var sShapeName = oYDimensionConfig.getShapeName();
			var sStroke = oYDimensionConfig.getStroke();
			var fStrokeWidth = oYDimensionConfig.getStrokeWidth();
			var CustomerClass = ObjectPath.get(sShapeClass);

			var aShapeInstances = [];
			for (var l = 0; l < ColumnConfigs.length; l++){
				var sFill = ColumnConfigs[l].getFill();
				if (sFill == null) {
					var fnFillFactory = ColumnConfigs[l].getFillFactory();
					if (typeof fnFillFactory === 'function' ) {
						sFill = fnFillFactory(sShapeName);
					}
				}
				var oShapeInstance = new CustomerClass({
					stroke: sStroke,
					strokeWidth: fStrokeWidth,
					fill: sFill
				});

				aShapeInstances.push(oShapeInstance);
			}

			mRowConfigData.shapeInstances = aShapeInstances;
			aYDimensionRenderItems.push(mRowConfigData);
		}
		this.renderYDimension(oRm, aYDimensionRenderItems);

		var aXDimensionRenderItems = [];
		for (var j = 0; j < ColumnConfigs.length; j++){
			var oColumnConfigData = {};
			oColumnConfigData.text = ColumnConfigs[j].getText();
			aXDimensionRenderItems.push(oColumnConfigData);
		}

		this.renderXDimension(oRm, aXDimensionRenderItems);

		oRm.write("</div>");
	};

	DimensionLegendRenderer.renderYDimension = function (oRm, aYDimensionRenderItems) {
		for (var k = 0; k < aYDimensionRenderItems.length; k++) {
			this.renderYItems(oRm, aYDimensionRenderItems[k], k);
		}
	};

	DimensionLegendRenderer.renderYItems = function(oRm, oItem, iIndex) {
		var iLineHeight = fnDensityHeight(),
		sLineHeight = iLineHeight + "px";

		var iHeight = iLineHeight / 2,
		iWidth  = iHeight;

		oRm.write("<div");
		oRm.writeAttributeEscaped("title", oItem.text);
		oRm.addClass("sapGanttDLItem");

		oRm.writeClasses();

		oRm.addStyle("height", sLineHeight);
		oRm.addStyle("line-height", sLineHeight);
		oRm.addStyle(this._getMarginStyle(), (iWidth / 2) + "px");
		oRm.writeStyles();
		oRm.write(">");

		this.renderYSvgPart(oRm, oItem.shapeInstances, iWidth, iHeight);
		this.renderYLegendText(oRm, oItem.text);

		oRm.write("</div>");
	};

	DimensionLegendRenderer._getMarginStyle = function() {
		var bRTL = Core.getConfiguration().getRTL();
		return "margin-" + (bRTL ? "right" : "left");
	};

	DimensionLegendRenderer.normalizeShape = function(oShape, iWidth, iHeight, iIndex) {
		var iHalfHeight = iHeight / 2;
		var mValues = {
			x: iIndex * (iWidth + _iBaseSpace) + _iBaseSpace / 2, y: 0, x1: 0, y1: iHalfHeight, x2: iWidth, y2: iHalfHeight,
			width: iWidth, height: iHeight,
			yBias: iHalfHeight, rowYCenter: iHalfHeight
		};

		if (oShape.isA("sap.gantt.simple.shapes.Shape")) {
			oShape.setWidth(iWidth);
			oShape.setHeight(iHeight);
			oShape.setStartX(0);
			oShape.setRowYCenter(iHeight);
		} else {
			Object.keys(mValues).forEach(function (prop) {
				var sPropertySetter = prop.split("-").reduce(function (prefix, name) {
					return prefix + name.charAt(0).toUpperCase() + name.slice(1);
				}, "set");
				if (oShape[sPropertySetter]) {
					oShape[sPropertySetter](mValues[prop]);
				}
			});
		}
	};

	DimensionLegendRenderer.renderYSvgPart = function(oRm, aShapeInstances, iWidth, iHeight) {
		oRm.write("<svg");
		oRm.writeAttributeEscaped("tabindex", -1);
		oRm.writeAttributeEscaped("focusable", false);

		oRm.addClass("sapGanttDLSvg");
		oRm.writeClasses();

		oRm.addStyle("width", (iWidth + _iBaseSpace) * aShapeInstances.length + "px");
		oRm.writeStyles();
		oRm.write(">");
		for (var i = 0; i < aShapeInstances.length; i++){
			this.normalizeShape(aShapeInstances[i], iWidth, iHeight, i);
			aShapeInstances[i].renderElement(oRm, aShapeInstances[i]);
		}

		oRm.write("</svg>");
	};

	DimensionLegendRenderer.renderYLegendText = function(oRm, sText) {
		oRm.write("<div");
		oRm.addClass("sapGanttDLItemTxt");
		oRm.writeClasses();
		oRm.write(">");
		if (sText) {
			oRm.writeEscaped(sText);
		}
		oRm.write("</div>");
	};

	DimensionLegendRenderer.renderXDimension = function (oRm, aXDimensionRenderItems) {
		var iLength = aXDimensionRenderItems.length;
		var iLineHeight = fnDensityHeight(),
		sLineHeight = iLineHeight + "px";

		var iHeight = iLineHeight / 2,
		iWidth  = iHeight;

		oRm.write("<div");
		oRm.addClass("sapGanttDLItem");

		oRm.writeClasses();

		oRm.addStyle("height", sLineHeight * iLength);
		oRm.addStyle("line-height", sLineHeight);
		oRm.addStyle(this._getMarginStyle(), (iWidth / 2) + "px");
		oRm.writeStyles();
		oRm.write(">");

		//render path
		this.renderXDimensionPath(oRm, aXDimensionRenderItems);
		//render text
		this.renderXDimensionText(oRm, aXDimensionRenderItems);

		oRm.write("</div>");
	};

	DimensionLegendRenderer.renderXDimensionPath = function (oRm, aRenderItems) {
		var iLength = aRenderItems.length;
		var iLineHeight = fnDensityHeight();

		var iHeight = iLineHeight / 2,
		iWidth  = iHeight;

		oRm.write("<div");
		oRm.addStyle("height", iLineHeight * iLength + "px");

		var iSVGWidth =  (iLineHeight / 2 + _iBaseSpace) * iLength;
		oRm.addStyle("width", iSVGWidth + "px");
		oRm.addStyle("display", "block");
		oRm.writeStyles();
		oRm.write(">");

		oRm.write("<svg");
		oRm.writeAttributeEscaped("tabindex", -1);
		oRm.writeAttributeEscaped("focusable", false);
		oRm.writeAttribute("width", iSVGWidth + "px");

		oRm.addClass("sapGanttDLSvg");
		oRm.writeClasses();
		oRm.write(">");

		var bRTL = Core.getConfiguration().getRTL();
		for (var i = 0; i < iLength; i++){
			var iStartX = i * (iWidth + _iBaseSpace) + _iBaseSpace / 2 + iWidth / 2;
			var sD = "M" + iStartX + " 0";
			if (bRTL) {
				sD += " v" + ((i + 0.5) * iLineHeight);
				sD += " h" + (-iStartX);
			} else {
				sD += " v" + ((iLength - i - 0.5) * iLineHeight);
				sD += " h" + ((iLineHeight / 2 + _iBaseSpace) * iLength - iStartX);
			}

			var oBasePath = new BasePath({
				d: sD,
				fill: "transparent",
				strokeWidth: 2.5
			}).addStyleClass("sapGanttDimensionLegendPath");
			oBasePath.renderElement(oRm, oBasePath);
		}
		oRm.write("</svg>");

		oRm.write("</div>");
	};

	DimensionLegendRenderer.renderXDimensionText = function (oRm, aRenderItems) {
		var iLength = aRenderItems.length;
		var iLineHeight = fnDensityHeight();

		oRm.write("<div");
		oRm.addClass("sapGanttDLItemTxt");
		oRm.writeClasses();

		oRm.addStyle("height", iLineHeight * iLength + "px");
		oRm.addStyle("width", "100%");
		oRm.writeStyles();

		oRm.write(">");

		for (var i = iLength - 1; i >= 0; i--){
			oRm.write("<div");
			var sDimensionText = aRenderItems[i].text;
			if (sDimensionText) {
				oRm.writeAttribute("title", sDimensionText);
			}

			oRm.addClass("sapGanttDLItemTxt");
			oRm.writeClasses();
			oRm.addStyle("font-style", "italic");
			oRm.addStyle("height", iLineHeight + "px");
			oRm.writeStyles();

			oRm.write(">");
			if (sDimensionText) {
				oRm.writeEscaped(aRenderItems[i].text);
			}
			oRm.write("</div>");
		}

		oRm.write("</div>");
	};
	return DimensionLegendRenderer;
}, true);
