/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define(["sap/gantt/misc/Utility"], function (Utility) {
	"use strict";

	/**
	 * ListLegend renderer.
	 *
	 * @namespace
	 */
	var ListLegendRenderer = {};

	var fnDensityHeight = function() {
		var iDefaultItemLineHeight = 32;
		var sDensity = Utility.findSapUiSizeClass();
		return Utility.scaleBySapUiSize(sDensity, iDefaultItemLineHeight);
	};

	ListLegendRenderer.render = function (oRm, oLegend) {
		oRm.write("<div");
		oRm.writeControlData(oLegend);

		oRm.write(">");

		var aItems = oLegend.getItems();
		var bHasInteractiveItem = aItems.some(function(oItem){
			return oItem.getInteractive();
		});
		for (var i = 0; i < aItems.length; i++) {
			this.renderLegendItem(oRm, aItems[i], bHasInteractiveItem);
		}
		oRm.write("</div>");
	};

	ListLegendRenderer.renderLegendItem = function(oRm, oItem, bHasInteractiveItem) {
		var oShape = oItem.getShape();
		var iLineHeight = fnDensityHeight(),
			sLineHeight = iLineHeight + "px";

		var iHeight = iLineHeight / 2,
			iWidth  = iHeight;

		this.normalizeShape(oShape, iWidth, iHeight);

		oRm.write("<div");
		oRm.writeElementData(oItem);
		oRm.writeAttributeEscaped("title", oShape.getTitle());
		oRm.addClass("sapGanttLLItem");

		oRm.writeClasses();

		oRm.addStyle("height", sLineHeight);
		oRm.addStyle("line-height", sLineHeight);
		var sMargin = "margin-" + (sap.ui.getCore().getConfiguration().getRTL() ? "right" : "left");
		if (bHasInteractiveItem && !oItem.getInteractive()) {
			oRm.addStyle(sMargin, sLineHeight);
		} else if (!oItem.getInteractive()){
			oRm.addStyle(sMargin, (iWidth / 2) + "px");
		}
		oRm.writeStyles();
		oRm.write(">");

		oRm.renderControl(oItem.getAggregation("_checkbox"));

		this.renderSvgPart(oRm, oShape, iWidth);
		this.renderLegendText(oRm, oShape.getTitle());

		oRm.write("</div>");
	};

	ListLegendRenderer.normalizeShape = function(oShape, iWidth, iHeight) {
		var iHalfHeight = iHeight / 2;

		var iStrokeWidth = oShape.getStrokeWidth() || 0;
		var mValues = {
			x: iStrokeWidth, y: iStrokeWidth, x1: iStrokeWidth, y1: iHalfHeight + iStrokeWidth, x2: iWidth, y2: iHalfHeight,
			yBias: iHalfHeight, rowYCenter: iHalfHeight
		};
		if (oShape.getWidth) {
			if (!oShape.getWidth()) {
				mValues.width = iWidth - 2 * iStrokeWidth;
			} else {
				mValues.width = oShape.getWidth();
			}
		}
		if (oShape.getHeight) {
			if (!oShape.getHeight()) {
				mValues.height = iHeight - 2 * iStrokeWidth;
			} else {
				mValues.height = oShape.getHeight();
			}
		}
		if (oShape.isA("sap.gantt.simple.BaseCursor")) {
			mValues.x += oShape.getLength() / 2;
		}

		if (oShape.isA("sap.gantt.simple.shapes.Shape")) {
			oShape.setWidth(iWidth);
			oShape.setHeight(iHeight);
			oShape.setStartX(0);
			oShape.setRowYCenter(iHeight);
		} else {
			Object.keys(mValues).forEach(function(prop){
				var sPropertySetter = prop.split("-").reduce(function(prefix, name){
					return prefix + name.charAt(0).toUpperCase() + name.slice(1);
				}, "set");
				if (oShape[sPropertySetter]) {
					oShape[sPropertySetter](mValues[prop]);
				}
			});
		}
	};

	ListLegendRenderer.renderSvgPart = function(oRm, oShape, iWidth) {
		oRm.write("<svg");
		oRm.writeAttributeEscaped("tabindex", -1);
		oRm.writeAttributeEscaped("focusable", false);

		oRm.addClass("sapGanttLLSvg");
		oRm.writeClasses();

		oRm.addStyle("width", iWidth + "px");
		oRm.writeStyles();
		oRm.write(">");
		oShape.renderElement(oRm, oShape);

		oRm.write("</svg>");
	};

	ListLegendRenderer.renderLegendText = function(oRm, sText) {
		oRm.write("<div");
		oRm.addClass("sapGanttLLItemTxt");
		oRm.writeClasses();
		oRm.write(">");
		if (sText) {
			oRm.writeEscaped(sText);
		}
		oRm.write("</div>");
	};

	return ListLegendRenderer;
}, true);
