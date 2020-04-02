/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/gantt/simple/BaseGroup",
	"sap/gantt/simple/BaseText",
	"sap/gantt/simple/BaseRectangle"
], function (BaseGroup, BaseText, BaseRectangle) {
	"use strict";

	var PROPAGATED_PROPERTIES = ["rowYCenter"];
	var PROGRESS_PROPERTIES = ["time", "endTime", "percentage"];

	var Progress = BaseGroup.extend("sap.gantt.simple.test.customShapes.Progress", {
		metadata: {
			properties: {
				percentage: { type: "float", defaultValue: 0 },
				height: {type: "float"}
			},
			aggregations: {
				shapes: {type: "sap.gantt.simple.BaseShape", multiple: true, singularName: "shape"}
			}
		}
	});

	Progress.prototype.init = function () {
		this.oText = new BaseText({
			fill: "#000000",
			textAnchor: "end",
			truncateWidth: 1000
		});
		this.oProgress = new BaseRectangle({
			fill: "#ABDBF2"
		});
		this.oSeparator = new BaseRectangle({
			fill: "white",
			width: 1
		});
		this.oBackground = new BaseRectangle({
			fill: "#5CBAE5"
		});
		this.addShape(this.oBackground);
		this.addShape(this.oProgress);
		this.addShape(this.oSeparator);
		this.addShape(this.oText);
	};

	Progress.prototype.setHeight = function (iHeight) {
		this.setProperty("height", iHeight);
		this.oProgress.setHeight(iHeight);
		this.oSeparator.setHeight(iHeight);
		this.oBackground.setHeight(iHeight);
		return this;
	};

	Progress.prototype.clone = function (sIdSuffix, aLocalIds) {
		return BaseGroup.prototype.clone.call(this, sIdSuffix, aLocalIds, {cloneChildren: false, cloneBindings: true});
	};

	Progress.prototype._updateProgress = function () {
		var iPercentage = this.getPercentage(),
			oTime = this.getTime(),
			oEndTime = this.getEndTime();

		if (isNaN(iPercentage) || !oTime || !oEndTime) {
			return;
		}
		var iTime = oTime.getTime(),
			iEndTime = oEndTime.getTime(),
			iProgressTime = iTime + (iEndTime - iTime) * iPercentage;

		this.oText.setText(iPercentage * 100 + "%");
		this.oText.setTime(new Date(iProgressTime));
		this.oText.setEndTime(new Date(iProgressTime));

		this.oProgress.setTime(oTime);
		this.oProgress.setEndTime(new Date(iProgressTime));

		this.oSeparator.setTime(new Date(iProgressTime));
		this.oSeparator.setEndTime(new Date(iProgressTime));

		this.oBackground.setTime(oTime);
		this.oBackground.setEndTime(oEndTime);
	};

	Progress.prototype.renderElement = function(oRm, oGroup) {
		BaseGroup.prototype.renderElement.apply(this, arguments);
	};

	Progress.prototype.getShapeAnchors = function () {
		return this.getShapes()[0].getShapeAnchors();
	};

	/**
	 * @protected
	 */
	Progress.prototype.setProperty = function (sPropertyName, oValue, bSuppressInvalidate) {
		BaseGroup.prototype.setProperty.apply(this, arguments);
		if (PROPAGATED_PROPERTIES.indexOf(sPropertyName) >= 0) {
			this.getShapes().forEach(function (oShape) {
				oShape.setProperty(sPropertyName, oValue, bSuppressInvalidate);
			});
		}
		if (PROGRESS_PROPERTIES.indexOf(sPropertyName) >= 0) {
			this._updateProgress();
		}
	};

	return Progress;
});
