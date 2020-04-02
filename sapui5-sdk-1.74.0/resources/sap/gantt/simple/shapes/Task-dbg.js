/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"./Shape",
	"sap/gantt/library",
	"sap/gantt/simple/InnerGanttChartRenderer"
], function (Shape, library, InnerGanttChartRenderer) {
	"use strict";

	var TaskType = library.simple.shapes.TaskType;

	var COMPLEX_SHAPE_MIN_WIDTH = 10;

	function generateOverlappingSettings(mSettings) {
		var mOverlappingSettings = Object.assign({}, mSettings);
		mOverlappingSettings.iStartX -= 1;
		mOverlappingSettings.iEndX += 1;
		mOverlappingSettings.iHeight += 2;
		return mOverlappingSettings;
	}

	/**
	 * Creates and initializes a new Task class.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSetting] Initial settings for the new control
	 *
	 * @class
	 * A shape representing one task.
	 *
	 * @extends sap.gantt.simple.shapes.Shape
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.shapes.Task
	 * @since 1.69
	 */
	var Task = Shape.extend("sap.gantt.simple.shapes.Task", {
		metadata: {
			properties: {
				/**
				 * Type of the task.
				 */
				type: {type: "sap.gantt.simple.shapes.TaskType", defaultValue: TaskType.Normal},
				/**
				 * Position of utilisation information.
				 */
				utilizationDown: {type: "boolean", defaultValue: true},
				/**
				 * Title used for legend.
				 */
				title: {type: "string", defaultValue: null}
			}
		}
	});

	Task.prototype._generateRectD = function (mSettings) {
		var iCenter = this.getRowYCenter(),
			sD = "";
		sD += "M " + mSettings.iStartX + " " + iCenter;
		var iUp = mSettings.iHeight / 2,
			iLen = mSettings.iEndX - mSettings.iStartX,
			iRadius = this.generateArcRadius(iUp, iLen);
		sD += " l 0 " + (-iUp + iRadius);
		sD += " a " + iRadius + " " + iRadius + " 0 0 1 " + iRadius + " " + (-iRadius);
		iLen -= iRadius;
		var iRadius2 = this.generateArcRadius(iLen - iRadius, iUp);
		iLen -= iRadius2;
		sD += " l " + iLen + " 0";
		sD += " a " + iRadius2 + " " + iRadius2 + " 0 0 1 " + iRadius2 + " " + iRadius2;
		sD += " l 0 " + (2 * iUp - iRadius2 - iRadius);
		sD += " a " + iRadius2 + " " + iRadius2 + " 0 0 1 " + (-iRadius2) + " " + iRadius2;
		sD += " l " + (-iLen) + " 0";
		sD += " a " + iRadius + " " + iRadius + " 0 0 1 " + (-iRadius) + " " + (-iRadius);
		sD += " Z";
		return sD;
	};

	Task.prototype._renderOverlappingRectangle = function (oRm, mSettings) {
		var sD = this._generateRectD(generateOverlappingSettings(mSettings));
		oRm.write("<path class=\"sapGanttShapeOverlappingBorder\" d=\"" + sD + "\" />");
	};

	Task.prototype.renderNoramlTask = function (oRm, mSettings) {
		this._renderOverlappingRectangle(oRm, mSettings);
		var sD = this._generateRectD(mSettings);
		oRm.write("<path d=\"" + sD + "\" ");
		if (this.getHoverState()) {
			oRm.write("fill=\"" + this.getHoverBackgroundColor() + "\" stroke-width=\"1\" stroke=\"" + this.getHoverColor() + "\"");
		} else if (this.getSelected()) {
			oRm.write("fill=\"" + this.getSelectedColor() + "\"");
		} else {
			oRm.write("fill=\"" + this.getTranslatedColor() + "\"");
		}
		oRm.write(" />");
	};

	Task.prototype._generateSummaryD = function (mSettings, bForShadow) {
		var iCenter = this.getRowYCenter(),
			sD = "",
			iLineWidth = bForShadow ? 7 : 5;
		sD += "M " + mSettings.iStartX + " " + iCenter;
		var iUp = mSettings.iHeight / 2,
			iLen = mSettings.iEndX - mSettings.iStartX,
			iRadius = this.generateArcRadius(iUp, iLen);
		sD += " l 0 " + (-iUp + iRadius);
		sD += " a " + iRadius + " " + iRadius + " 0 0 1 " + iRadius + " " + (-iRadius);
		iLen -= iRadius;
		var iRadius2 = this.generateArcRadius(iLen - iRadius, iUp);
		iLen -= iRadius2;
		sD += " l " + iLen + " 0";
		sD += " a " + iRadius2 + " " + iRadius2 + " 0 0 1 " + iRadius2 + " " + iRadius2;
		sD += " l 0 " + (2 * iUp - iRadius2 - 3);
		sD += " a 3 5 0 0 1 -" + iLineWidth + " 0";
		sD += " l 0 " + (-2 * iUp + iRadius2 + iLineWidth);
		sD += " l " + (-iLen + 2 * iLineWidth - iRadius - iRadius2) + " 0";
		sD += " l 0 " + (2 * iUp - iRadius - iLineWidth);
		sD += " a 3 5 0 0 1 -" + iLineWidth + " 0";
		sD += " Z";
		return sD;
	};

	Task.prototype.renderSummaryTaskExpanded = function (oRm, mSettings) {
		if (Math.abs(mSettings.iEndX - mSettings.iStartX) <= COMPLEX_SHAPE_MIN_WIDTH) {
			this.renderNoramlTask(oRm, mSettings);
		} else {
			var sD;
			if (!mSettings.bFromCollapsed) {
				sD = this._generateSummaryD(generateOverlappingSettings(mSettings), true);
				oRm.write("<path class=\"sapGanttShapeOverlappingBorder\" d=\"" + sD + "\" />");
			}
			sD = this._generateSummaryD(mSettings);
			oRm.write("<path d=\"" + sD + "\"");
			if (this.getHoverState()) {
				oRm.write("fill=\"" + this.getHoverBackgroundColor() + "\" stroke-width=\"1\" stroke=\"" + this.getHoverColor() + "\"");
			} else if (this.getSelected()) {
				oRm.write(" fill=\"" + this.getSelectedColor() + "\"");
				if (mSettings.bFromCollapsed) {
					oRm.write(" stroke-width=\"1.0001\" stroke=\"white\" shape-rendering=\"crispEdges\"");
				}
			} else {
				oRm.write(" fill=\"" + this.getTranslatedColor() + "\"");
			}
			oRm.write(" />");
		}
	};

	Task.prototype.renderSummaryTaskCollapsed = function (oRm, mSettings) {
		if (Math.abs(mSettings.iEndX - mSettings.iStartX) <= COMPLEX_SHAPE_MIN_WIDTH) {
			this.renderNoramlTask(oRm, mSettings);
		} else {
			this._renderOverlappingRectangle(oRm, mSettings);
			var sD = this._generateRectD(mSettings);
			oRm.write("<path d=\"" + sD + "\"");
			if (this.getHoverState()) {
				oRm.write("fill=\"" + this.getHoverBackgroundColor() + "\" stroke-width=\"1\" stroke=\"" + this.getHoverColor() + "\"");
			} else if (this.getSelected()) {
				oRm.write(" fill=\"" + this.getSelectedColor() + "\"");
			} else {
				oRm.write(" fill=\"" + this.getTranslatedColor() + "\" fill-opacity=\"0.7\"");
			}
			oRm.write(" />");
			this.renderSummaryTaskExpanded(oRm, Object.assign({}, mSettings, {bFromCollapsed: true}));
		}
	};

	Task.prototype.renderErrorTask = function (oRm, mSettings) {
		this._renderOverlappingRectangle(oRm, mSettings);
		var sMaskId = this.getId() + "-mask",
			sD = this._generateRectD(mSettings),
			sStrokeColor,
			sFillColor,
			sPatternMask;
		if (this.getGanttChartBase()) {
			sPatternMask = this.getGanttChartBase().getId() + "-helperDef-linePattern";
		} else {
			InnerGanttChartRenderer.renderHelperDefs(oRm, this.getId());
			sPatternMask = this.getId() + "-helperDef-linePattern";
		}
		if (this.getHoverState()) {
			sStrokeColor = this.getHoverColor();
			sFillColor = this.getHoverBackgroundColor();
		} else if (this.getSelected()) {
			sStrokeColor = sFillColor = this.getSelectedColor();
		} else {
			sStrokeColor = sFillColor = this.getTranslatedColor();
		}
		oRm.write("<mask id=\"" + sMaskId + "\">");
		oRm.write("<path d=\"" + sD + "\" stroke=\"white\" stroke-width=\"1\" fill=\"url(#" + sPatternMask + ")\" />");
		oRm.write("</mask>");
		oRm.write("<path d=\"" + sD + "\" stroke=\"" + sStrokeColor + "\" stroke-width=\"1\" fill=\"" + sFillColor + "\" mask=\"url(#"
			+ sMaskId + ")\" />");
	};

	Task.prototype.renderContent = function (oRm) {
		var mSettings = {
			iHeight: this.getPixelHeight() - this.getRowPadding(),
			iStartX: this.getXStart(),
			iEndX: this.getXEnd()
		};
		switch (this.getType()) {
			case TaskType.Normal:
				this.renderNoramlTask(oRm, mSettings);
				break;
			case TaskType.Error:
				this.renderErrorTask(oRm, mSettings);
				break;
			case TaskType.SummaryCollapsed:
				this.renderSummaryTaskCollapsed(oRm, mSettings);
				break;
			case TaskType.SummaryExpanded:
				this.renderSummaryTaskExpanded(oRm, mSettings);
				break;
			default:
				throw new Error("Unknown type of Task: " + this.getType());
		}
	};

	Task.prototype.renderElement = function (oRm) {
		oRm.write("<g");
		this.writeElementData(oRm);
		oRm.write(" pointer-events=\"bounding-box\">");
		this.renderContent(oRm);
		oRm.write("</g>");
	};

	return Task;
});
