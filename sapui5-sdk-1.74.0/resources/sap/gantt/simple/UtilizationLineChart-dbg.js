/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/Core",
	"./UtilizationChart",
	"sap/gantt/def/pattern/BackSlashPattern"
], function(jQuery, Core, UtilizationChart, BackSlashPattern){
	"use strict";

	/**
	 * Constructor for a new Utilization Line
	 *
	 * @param {string} [sId] ID of the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new control
	 *
	 * @class
	 * <p>
	 * Utilization Line Chart (ULC) is a complex shape, you can use it to visualize resource utilization on different dimensions.
	 * Each Utilization dimension is represented by a line, you could define different colors for each dimension.
	 * </p>
	 *
	 * <p>You can define the ULC background by property <code>fill</code>, the default background color is light gray</p>
	 *
	 * @extends sap.gantt.simple.UtilizationChart
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.simple.UtilizationLineChart
	 */
	var UtilizationLineChart = UtilizationChart.extend("sap.gantt.simple.UtilizationLineChart", /** @lends sap.gantt.simple.UtilizationLineChart.prototype */ {
		metadata: {
			properties: {

				/**
				 * Flag to show or hide the middle line in Utilization Line Chart. The value of the <code>overConsumptionMargin</code> will affect
				 * the middle line position. By default the middle line is a gray dashed line
				 */
				showMiddleLine: { type: "boolean", defaultValue: true }
			},
			defaultAggregation: "dimensions",
			aggregations: {
				/**
				 * Dimensions of the Utilization Line Chart
				 */
				dimensions: {
					type: "sap.gantt.simple.UtilizationDimension",
					group : "Data"
				}
			},
			associations: {
				/**
				 * The value for overConsuptionPattern can be either an UI5 ID which points to an instance of <code>PatternBase</code> which defined in svgDefs
				 * or an instance of <code>PatternBase</code>.
				 *
				 * The overConsumptionPattern is visualized as rectangle which the height is calculated based on <code>overConsumptionMargin</code>
				 */
				overConsumptionPattern: {
					type: "sap.gantt.def.DefBase",
					altTypes : ["string"],
					multiple: false,
					group: "Appearance"
				}
			}
		}
	});

	UtilizationLineChart.prototype.applySettings = function(mSettings, oScope) {
		mSettings = mSettings || {};
		UtilizationChart.prototype.applySettings.call(this, mSettings, oScope);

		this._createDefaultDefs();
	};

	/**
	 * Render a shape element with RenderManager
	 * @protected
	 * @param {object} oRm Render Manager
	 * @param {object} oElement shape instance
	 */
	UtilizationLineChart.prototype.renderElement = function(oRm, oElement) {
		if (this.getDimensions().length === 0) {
			this.renderEmptyDomRefs(oRm, true/**bCloseTag*/);
			return;
		}

		this.renderEmptyDomRefs(oRm, false/**bCloseTag*/);

		var iX = this.getX(),

			iHeight = this.getHeight(),
			iY = this.getRowYCenter() - iHeight / 2,
			iWidth = this.getWidth();

		var mProp = {
			x: iX, y: iY, width: iWidth, height: iHeight
		};

		// 1. all dimension clip path
		this.renderDimensionClipPaths(oRm, mProp);
		this.renderDefaultDefs(oRm);

		// 2. not exceed of utilization part
		this.renderULCBackground(oRm, mProp);

		// 3. middle indicator line
		this.renderMiddleLine(oRm, mProp);

		// 4. overage rect / dangerour zone background rectangle
		this.renderOverConsumptionBackground(oRm, mProp);
		this.renderOverConsumptionClipPath(oRm, mProp);

		// 5. all dimension paths
		this.renderDimensionPaths(oRm, mProp);

		// 6. render tooltip rectangles
		this.renderTooltips(oRm, mProp);

		oRm.write("</g>");
	};

	UtilizationLineChart.prototype.renderEmptyDomRefs = function(oRm, bClosedTag) {
		oRm.write("<g class='sapGanttUtilizationLine'");
		oRm.writeElementData(this);
		oRm.write(">");
		if (bClosedTag) {
			oRm.write("</g>");
		}
	};

	UtilizationLineChart.prototype.renderDimensionClipPaths = function(oRm, mProp) {
		var aDimensions = this.getDimensions();
		oRm.write("<defs>");
		for (var iIndex = 0; iIndex < aDimensions.length; iIndex++) {

			oRm.write("<clipPath");
			oRm.writeAttribute("id", aDimensions[iIndex].getId() + "-clipPath");
			oRm.write(">");
			this.renderDimensionPath(oRm, aDimensions[iIndex], mProp.y, mProp.height);
			oRm.write("</clipPath>");
		}
		oRm.write("</defs>");
	};

	UtilizationLineChart.prototype.renderULCBackground = function(oRm, mProp) {
		var mAttr = jQuery.extend({
			id: this.getId() + "-ulcBg",
			fill: this.getFill() || "transparent",
			stroke: "none"
		}, true, mProp);

		this.renderRectangleWithAttributes(oRm, mAttr);
	};

	UtilizationLineChart.prototype.getClipPathIdOfDimension = function(oDimension) {
		return "url(#" + oDimension.getId() + "-clipPath)";
	};

	UtilizationLineChart.prototype.renderOverConsumptionBackground = function(oRm, mProp) {
		var mCopiedProp = jQuery.extend({
			id: this.getId() + "-ulcOverConsumptionBg",
			fill: this._getOverageFillPattern()
		}, true, mProp);
		mCopiedProp.height = this.getThresholdHeight(mProp.height);

		this.renderRectangleWithAttributes(oRm, mCopiedProp);
	};

	UtilizationLineChart.prototype.renderOverConsumptionClipPath = function(oRm, mProp) {
		var mCopiedProp = jQuery.extend({}, true, mProp);
		mCopiedProp.height = this.getThresholdHeight(mProp.height);

		var aDimensions = this.getDimensions();
		for (var iIndex = 0; iIndex < aDimensions.length; iIndex++) {
			var mAttr = jQuery.extend({
				"clip-path": this.getClipPathIdOfDimension(aDimensions[iIndex]),
				fill: this.getOverConsumptionColor()
			}, true, mCopiedProp);
			this.renderRectangleWithAttributes(oRm, mAttr);
		}
	};

	UtilizationLineChart.prototype._getOverageFillPattern = function() {
		var sPatternId = this.getOverConsumptionPattern();
		if (sPatternId) {
			sPatternId = Core.byId(sPatternId).getRefString();
		} else {
			sPatternId = "url(#" + this.getId() + "-defaultPattern" + ")";
		}
		return sPatternId;
	};

	UtilizationLineChart.prototype.getThresholdHeight = function(iHeight) {
		return (this.getOverConsumptionMargin() * iHeight) / (100 + this.getOverConsumptionMargin());
	};

	UtilizationLineChart.prototype.renderMiddleLine = function(oRm, mProp) {
		if (this.getShowMiddleLine()) {

			var iMiddleY = this.getMiddleLineY(mProp);

			oRm.write("<path");
			oRm.writeAttribute("id", this.getId() + "-middleLine");
			oRm.writeAttribute("d", "M " + mProp.x + " " + iMiddleY + " h " + mProp.width);
			oRm.addClass("sapGanttUtilizationMiddleLine");
			oRm.writeClasses();
			oRm.write("></path>");
		}
	};

	UtilizationLineChart.prototype.getMiddleLineY = function(mProp) {
		var iThresholdHeight = this.getThresholdHeight(mProp.height);
		return (mProp.y + iThresholdHeight) + (mProp.height - iThresholdHeight) / 2;
	};

	UtilizationLineChart.prototype.renderDimensionPaths = function(oRm, mProp) {
		var iX = mProp.x,
			fOverHeight = this.getThresholdHeight(mProp.height),
			iY = mProp.y,
			iWidth = mProp.width,
			iHeight = mProp.height;

		var aDimensions = this.getDimensions();
		for (var iIndex = 0; iIndex < aDimensions.length; iIndex++) {
			oRm.write("<g>");
			var oDimension = aDimensions[iIndex];
			this.renderDimensionPath(oRm, oDimension, iY, iHeight, "ulcPath"/**sIdSuffix*/);

			var mAttr = {
				id: oDimension.getId() + "-ulcRect",
				x: iX,
				y: iY + fOverHeight,
				width: iWidth,
				height: iHeight - fOverHeight,

				fill: this.getRemainCapacityColor(),
				"fill-opacity": 0.5,
				"stroke-opacity": 0.5,
				"clip-path": this.getClipPathIdOfDimension(oDimension)
			};
			this.renderRectangleWithAttributes(oRm, mAttr);

			oRm.write("</g>");
		}
	};

	UtilizationLineChart.prototype.renderTooltips = function(oRm, mProp) {
		var iY = mProp.y,
			iHeight = mProp.height;

		oRm.write("<g class='ulc-tooltips'>");
		var aDimensionPoints = this.getAllDimensionPoints();
		aDimensionPoints.forEach(function(oPoint, iIndex, aPoints) {

			var oNextPoint = aPoints[iIndex + 1] || oPoint;

			var sTooltip = oPoint.tooltip;

			var bDifferentDimension = oPoint.name !== oNextPoint.name;
			if (bDifferentDimension) {
				sTooltip = oPoint.tooltip + "\n" + oNextPoint.tooltip;
			}

			var iX1 = this.toX(oPoint.from),
				bLastPoint = aPoints.length - 1 === iIndex,
				iX2 = this.toX(bLastPoint ? oNextPoint.to : oNextPoint.from),
				iWidth = Math.abs(iX2 - iX1);

			if (iWidth > 0) {
				// if and only if the rectangle has actual width, then render it
				// otherwise 0 width user can't see anything
				var mDefault = {
					opacity: 0,
					fillOpacity: 0,
					strokeOpacity: 0
				};

				var mAttr = jQuery.extend({
					x: iX1,
					y: iY,
					width: iWidth,
					height: iHeight
				}, mDefault);

				this.renderRectangleWithAttributes(oRm, mAttr, sTooltip);
			}
		}.bind(this));
		oRm.write("</g>");
	};

	UtilizationLineChart.prototype.getAllDimensionPoints = function() {
		var aAllPeriods = [];
		this.getDimensions().forEach(function(oDimension){
			var sName = oDimension.getName();
			oDimension.getPeriods().forEach(function(oPeriod, iIndex, aPeriods) {
				var sTooltip = oPeriod.getTooltip();
				if (!sTooltip) {
					sTooltip = sName + ":" + oPeriod.getValue();
				}

				aAllPeriods.push({
					name: sName,
					from: oPeriod.getFrom(),
					to: oPeriod.getTo(),
					tooltip: sTooltip
				});
			});
		});
		aAllPeriods.sort(function(a ,b){
			return a.from - b.from;
		});
		return aAllPeriods;
	};

	UtilizationLineChart.prototype.renderDimensionPath = function(oRm, oDimension, iRowY, iRowHeight, sIdSuffix) {
		var aPeriods = oDimension.getPeriods();
		var d = "";
		for (var i = 0; i < aPeriods.length; i++) {
			var bFirst = (i === 0),
				bLast  = (i === aPeriods.length - 1);

			var oPeriod = aPeriods[i];
			var xPos1 = this.toX(oPeriod.getFrom());
			var xPos2 = this.toX(oPeriod.getTo());
			var vValue = oPeriod.getValue();

			var iMargin = this.getOverConsumptionMargin();

			if (vValue > (100 + iMargin)) {
				vValue = 100 + iMargin;
			}

			var yOrigin = iRowY + iRowHeight;
			var iPercentageHeight = iRowHeight * (vValue / (100 + iMargin));
			var yActual = yOrigin - iPercentageHeight;

			d += (bFirst ? " M " + xPos1 + " " + yOrigin : "") +
				" L " + xPos1 + " " + yActual + " L " + xPos2 + " " + yActual +
				(bLast ? " L " + xPos2 + " " + yOrigin : "");
		}

		oRm.write("<path");
		if (sIdSuffix) {
			oRm.writeAttribute("id", oDimension.getId() + "-" + sIdSuffix);
		}
		oRm.writeAttribute("d", d);
		oRm.writeAttribute("fill", "none");
		oRm.writeAttribute("stroke-width", 2);
		oRm.writeAttribute("stroke", oDimension.getDimensionColor());
		oRm.addClass("sapGanttUlcDimensionPath");
		oRm.writeClasses();
		oRm.write("/>");

	};

	UtilizationLineChart.prototype._createDefaultDefs = function() {
		if (this.getOverConsumptionPattern()) {
			return;
		}
		this.mDefaultDefs = new sap.gantt.def.SvgDefs({
			defs: [
				new BackSlashPattern({
					id: this.getId() + "-defaultPattern",
					tileWidth: 5,
					tileHeight: 9,
					backgroundColor: "#fff",
					stroke: "#ececec",
					strokeWidth: 1
				})
			]
		});
	};

	UtilizationLineChart.prototype.renderDefaultDefs = function(oRm) {
		if (this.mDefaultDefs) {
			oRm.write(this.mDefaultDefs.getDefString());
		}
	};

	UtilizationLineChart.prototype.destroy = function() {
		UtilizationChart.prototype.destroy.apply(this, arguments);

		if (this.mDefaultDefs) {
			this.mDefaultDefs.destroy();
		}
	};

	return UtilizationLineChart;
}, /**bExport*/true);
