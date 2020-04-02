/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/Core",
	"./GanttExtension",
	"./CoordinateUtils",
	"./GanttUtils"
], function(jQuery, Core, GanttExtension, CoordinateUtils, GanttUtils) {
	"use strict";


	/**
	 * GanttResizeExtension class is responsible to shape resize, including rendering resize outline if the element is resizable
	 * or a plain outline if resize is impossible, and resizing effect and fire shapeResize event as well.
	 *
	 * @class
	 * @private
	 * @alias sap.gantt.simple.GanttResizeExtension
	 * @extends sap.gantt.simple.GanttExtension
	 */
	var GanttResizeExtension = GanttExtension.extend("sap.gantt.simple.GanttResizeExtension", /** @lends sap.gantt.simple.GanttResizeExtension.prototype */ {
		/**
		 * @override
		 * @inheritDoc
		 * @returns {string} The name of this extension.
		 */
		_init: function(oGantt, mSettings) {

			this._initResizeStatus();
			return "ResizeExtension";
		}
	});

	// define the resizing event namespace
	var _sResizingNamespace = ".sapGanttResizing";

	// provide default shape selection style as fallback
	var mDefaultSelectionStyle = {
		color: "#596468",
		strokeWidth: 1,
		strokeDasharray: "5, 1"
	};

	var ResizeActions = {
		None: 0,
		LeftResize: 1,
		RightResize: 2
	};

	var fnValueOf = function($elem, attr){
		return parseFloat($elem.attr(attr), 10);
	};


	GanttResizeExtension.prototype.getSelectionSettings = function() {
		if (!this.mSelectionSettings) {
			var mCustomSettings = this.getGantt().getShapeSelectionSettings();
			if (jQuery.isEmptyObject(mCustomSettings)) {
				return mDefaultSelectionStyle;
			}
			var mClonedDefaults = jQuery.extend(true, {}, mDefaultSelectionStyle);
			for (var sStyle in mClonedDefaults) {
				if (mCustomSettings[sStyle]) {
					mClonedDefaults[sStyle] = mCustomSettings[sStyle];
				}
			}
			this.mSelectionSettings = mClonedDefaults;
		}
		return this.mSelectionSettings;
	};

	GanttResizeExtension.prototype.getSelectionInlineStyle = function() {
		var mSettings = this.getSelectionSettings();
		var mStyles = {
			fill: "transparent",
			stroke: mSettings.color,
			"stroke-width": mSettings.strokeWidth,
			"stroke-dasharray": mSettings.strokeDasharray
		};

		return Object.keys(mStyles).reduce(function(sStyle, attr){
			sStyle += (attr + ":" + mStyles[attr] + ";");
			return sStyle;
		}, "");
	};

	GanttResizeExtension.prototype.initDomSelector = function() {
		this.mDoms = {};
	};

	GanttResizeExtension.prototype.updateDomSelector = function(event){
		if (event) {
			this.origin.shapeUid = jQuery(event.target).parents("g").attr(GanttUtils.SELECT_FOR_DATASET_KEY);
		}
		var sRootSel = 'g[' + GanttUtils.SELECT_FOR_DATASET_KEY + '="' + this.origin.shapeUid + '"]';
		var mSelectors = {
			leftLine:   sRootSel + " .leftLine",
			rightLine:  sRootSel + " .rightLine",
			topLine:    sRootSel + " .topLine",
			bottomLine: sRootSel + " .bottomLine",

			leftLineTrigger:  sRootSel + " line.leftTrigger",
			rightLineTrigger: sRootSel + " line.rightTrigger",

			leftRectTrigger:  sRootSel + " rect.leftTrigger",
			rightRectTrigger: sRootSel + " rect.rightTrigger",

			resizeRectCover: sRootSel + " rect.resizeCover"
		};

		for (var sKey in mSelectors) {
			if (mSelectors.hasOwnProperty(sKey)) {
				this.mDoms[sKey] = jQuery(mSelectors[sKey]);
			}
		}
	};

	GanttResizeExtension.prototype.getSvgElement = function() {
		var $elem = jQuery.sap.byId(this.getGantt().getId());
		if ($elem.length === 0) {
			jQuery.sap.log.warning("can not find gantt chart, use gantt chart instance sId as the key is required");
		}
		return $elem.find("svg.sapGanttChartSvg").get(0);
	};

	GanttResizeExtension.prototype._getShapeSelectionRootNode = function() {
		var svg = this.getSvgElement(),
			$selection = jQuery(svg).find("g.sapGanttChartSelection");

		return d3.select($selection.get(0));
	};

	GanttResizeExtension.prototype.toggleOutline = function(oElement) {
		if (!oElement.getSelected()) {
			this.removeOutline(oElement);
			return;
		}
		this.setFrame(oElement.getDomRef().getBBox());

		var bConnectable = oElement.getConnectable(),
			bResizable = oElement.getResizable();

		if (bConnectable || bResizable) {
			this.renderResizerOutline(oElement);
		} else {
			this.renderPlainOutline(oElement);
		}
	};

	GanttResizeExtension.prototype.clearAllOutline = function(sContainer) {
		this._getShapeSelectionRootNode().selectAll("*").remove();
	};

	GanttResizeExtension.prototype.renderPlainOutline = function(oElement) {
		var oDomRef = oElement.getDomRef();
		if (oDomRef) {
			var bRelationship = !!oElement.getRlsAnchors;
			var mBias = {
				x: oElement.getXBias(),
				y: oElement.getYBias()
			};
			var sElementPathD = bRelationship ? oElement.getD() : this.determineOutlineByFrame(oDomRef.getBBox(), mBias);
			var selectionRootNode = this._getShapeSelectionRootNode();
			var oPathNode = bRelationship ? this.createOutlineRlsNode(oElement, sElementPathD) : this.createOutlinePathNode(oElement, sElementPathD);
			selectionRootNode.node().appendChild(oPathNode);
		}
	};

	GanttResizeExtension.prototype.createOutlineRlsNode = function(oElement, sOutlinePath) {
		/* eslint-disable sap-no-element-creation */
		var oGroup = document.createElementNS(d3.ns.prefix.svg, "g");
		var oLinePath = document.createElementNS(d3.ns.prefix.svg, "path");
		var oArrowPath = document.createElementNS(d3.ns.prefix.svg, "path");
		/* eslint-enable: sap-no-element-creation */
		oGroup.setAttribute("id", oElement.getShapeUid() + "-selected");
		oGroup.setAttribute("aria-hidden", "false");
		oGroup.setAttribute("class", "resizeContainer sapGanttSelectedPath");
		oGroup.setAttribute("style", oElement.getSelectedStyle());
		oLinePath.setAttribute("d", sOutlinePath);
		oArrowPath.setAttribute("d", oElement.getArrowPathD(sOutlinePath));
		oGroup.appendChild(oLinePath);
		oGroup.appendChild(oArrowPath);
		return oGroup;
	};

	GanttResizeExtension.prototype.createOutlinePathNode = function(oElement, sOutlinePath) {
		/* eslint-disable sap-no-element-creation */
		var oPath = document.createElementNS(d3.ns.prefix.svg, "path");
		/* eslint-enable: sap-no-element-creation */
		oPath.setAttribute("id", oElement.getShapeUid() + "-selected");
		oPath.setAttribute("aria-hidden", "false");
		oPath.setAttribute("class", "resizeContainer sapGanttSelectedPath");

		var sSelectedStyle = oElement.getSelectedStyle ? oElement.getSelectedStyle() : this.getSelectionInlineStyle();
		oPath.setAttribute("style", sSelectedStyle);
		oPath.setAttribute("d", sOutlinePath);
		return oPath;
	};

	/**
	 * Construct the <code>d</code> of <path> svg element
	 *
	 * @param {object} oRect Frame of the element box
	 * @return {string} d path
	 */
	GanttResizeExtension.prototype.determineOutlineByFrame = function(oRect, mBias) {
		var x1 = oRect.x,
			y1 = oRect.y,
			width = oRect.width,
			height = oRect.height,
			x2 = x1 + width,
			y2 = y1 + height;

		// considering strokeWidth
		var iStrokeWidth = this.getSelectionSettings().strokeWidth,
			iHalfStrokeWidth = iStrokeWidth / 2;

		// need to consider the width of the stroke and the xBias & yBias setted by the user
		x1 = x1 - iHalfStrokeWidth + mBias.x;
		y1 = y1 - iHalfStrokeWidth + mBias.y;
		x2 = x2 + iHalfStrokeWidth + mBias.x;
		y2 = y2 + iHalfStrokeWidth + mBias.y;

		var sDAttribute = ["M", x1, y1, "L", x2, y1, "L", x2, y2, "L", x1, y2, "z"].join(" ").trim();
		return sDAttribute;
	};

	GanttResizeExtension.prototype.removeOutline = function(oElement) {
		var oResizeContainer = document.getElementById(oElement.getShapeUid() + "-selected");
		if (oResizeContainer) {
			jQuery(oResizeContainer).remove();
		}
	};

	GanttResizeExtension.prototype.renderResizerOutline = function(oElement) {
		this.removeOutline(oElement);

		var bConnectable = oElement.getConnectable(),
			bResizable = oElement.getResizable();

		var mPath = this.getOutlineLines();
		var oSvgGroup = this.createResizeContainer(oElement);

		this.renderSelectionBorders(mPath, oSvgGroup);

		if (bResizable) {
			this.renderResizeTriggerAndCover(mPath, oSvgGroup);
			this.attachMousedownEvent();
		}

		if (bConnectable) {
			this.renderShapeConnectTrigger(oElement, oSvgGroup);

			// event listener for shape connect
			this.getGantt()._getConnectExtension().attachShapeConnectEvents();
		}

		//Auto scroll will rerender the shapes, thus need to update the domSelector.
		if (this.isResizing()) {
			this.updateDomSelector();
			// Origin shape's x,y in SVG will change when auto scroll triggered by resizing
			this.updateOriginShapeFrame();
			this.attachResizeEvents();
		}
	};

	GanttResizeExtension.prototype.showShapeConnectTrigger = function(oElement) {
		var oExtention = this.getGantt()._getConnectExtension();
		var sShapeUid = oExtention.getRlsStartShape().shapeUid;

		// if connecting shapes, and current element is not target, hide shape connect trigger
		return oExtention.isShapeConnecting() ? sShapeUid === oElement.getShapeUid() : true;
	};

	GanttResizeExtension.prototype.renderSelectionBorders = function(mPath, oGroup) {
		// 4 lines top, right, bottom, left
		oGroup.selectAll(".border")
			.data(mPath.border).enter()
			.append("line")

			.each(function(d){
				d3.select(this).attr(d);
			})
			.attr("class", function(d){
				return "border " + d.class + "Line";
			});
	};

	GanttResizeExtension.prototype.renderResizeTriggerAndCover = function(mPath, oGroup) {
		// 2 lines on both left and right sides again to trigger resize
		oGroup.selectAll(".lineTrigger")
			.data(mPath.indicator).enter()
			.append("line")
			.each(function(d){
				d3.select(this).attr(d);
			})
			.attr("class", function(d){
				return "resizeTrigger lineTrigger " + d.class + "Trigger";
			})
			.attr({
				opacity: 0,
				"stroke-width": 3,
				style: "cursor: ew-resize"
			});

		var mCoverAttr = this.getResizeRectCoverAttrs();
		oGroup.append("rect").attr(mCoverAttr);
	};

	GanttResizeExtension.prototype.createResizeContainer = function(oElement) {
		var oSelectionRootNode = this._getShapeSelectionRootNode();

		var oGroup = oSelectionRootNode
			.append("g")
			.classed("resizeContainer", true)
			.attr("id", oElement.getShapeUid() + "-selected")
			.attr(GanttUtils.SELECT_FOR_DATASET_KEY, oElement.getShapeUid());
		return oGroup;
	};

	GanttResizeExtension.prototype.renderShapeConnectTrigger = function(oElement, oGroup) {
		var bShowShapeConnectTrigger = this.showShapeConnectTrigger(oElement);
		var aRects = this.getConnectSquaresData(bShowShapeConnectTrigger);

		// 2 small rectangle on both left and right sides to trigger resize
		oGroup.selectAll(".rectTrigger")
			.data(aRects.slice()).enter()
			.append("rect")
			.each(function(d){
				d3.select(this).attr(d);
			})
			.attr("class", function(d){
				return "shapeConnectTrigger rectTrigger " + d.class + "Trigger";
			})
			.attr({
				stroke: "#000",
				"stroke-width": 1
			});
	};

	GanttResizeExtension.prototype.attachMousedownEvent = function() {
		var $ganttChartSvg = jQuery(document.getElementById(this.getGantt().getId() + "-svg"));
		var $resizeTrigger = $ganttChartSvg.find(".resizeTrigger");

		// off event listener
		$resizeTrigger.off(_sResizingNamespace);
		$resizeTrigger.bind("mousedown" + _sResizingNamespace, jQuery.proxy(this.beforeResizing, this));
	};

	GanttResizeExtension.prototype.attachResizeEvents = function() {
		this._removeDragEvents();
		var $document = jQuery(document);
		$document.bind("mousemove" + _sResizingNamespace, jQuery.proxy(this.onResizing, this));
		$document.bind("mouseup" + _sResizingNamespace, jQuery.proxy(this.endResizing, this));
		$document.bind("keydown" + _sResizingNamespace, jQuery.proxy(this.onKeydown, this));
	};

	GanttResizeExtension.prototype._removeDragEvents = function() {
		var $document = jQuery(document);
		$document.off(_sResizingNamespace);
	};

	GanttResizeExtension.prototype.beforeResizing = function(event) {
		var $target = jQuery(event.target),
			sShapeUid = $target.parents("g").attr(GanttUtils.SELECT_FOR_DATASET_KEY);
		var oElement = this._getShapeByUid(sShapeUid);
		if (!oElement) {
			return;
		}

		this.setFrame(oElement.getDomRef().getBBox());
		this.updateDomSelector(event);

		this.origin.eventTarget = event.target;
		this.updateOriginShapeFrame();
		this.origin.resizeFor = sShapeUid;
		if ($target.hasClass("leftTrigger")) {
			this.currentAction = ResizeActions.LeftResize;
		} else {
			this.currentAction = ResizeActions.RightResize;
		}
		this._updateResizingEffect(true);
		this.attachResizeEvents();
	};

	GanttResizeExtension.prototype.updateOriginShapeFrame = function() {
		var frame = this.getFrame();
		this.origin.minX = frame.x;
		this.origin.maxX = frame.x + frame.width;
	};

	GanttResizeExtension.prototype.onResizing = function(event) {
		if (this._shallSkip(event)){ return; }
		this._updateResizingEffect(true);

		var svg = this.getSvgElement();
		var iEventX = CoordinateUtils.getEventSVGPoint(svg, event).x;
		var oPointerExtension = this.getGantt()._getPointerExtension();
		iEventX = iEventX + oPointerExtension._getAutoScrollStep();
		if (this.currentAction === ResizeActions.RightResize) {
			this._updateRightPartDoms(iEventX);
		} else if (this.currentAction === ResizeActions.LeftResize) {
			this._updateLeftPartDoms(iEventX);
		}
	};

	GanttResizeExtension.prototype._updateResizingEffect = function(bResizing) {
		var fOpacity = bResizing ? 0.4 : 0;
		this.mDoms.resizeRectCover.attr("opacity", fOpacity);
	};

	GanttResizeExtension.prototype.isResizing = function() {
		return this.currentAction === ResizeActions.LeftResize || this.currentAction === ResizeActions.RightResize;
	};

	GanttResizeExtension.prototype._updateRightPartDoms = function(iEventX) {
		var fnNormalizeMinX = function(iX) {
			if (iX - this.origin.minX <= 2 * this.getMargin()) {
				return this.origin.minX + 2 * this.getMargin();
			}
			return iX;
		}.bind(this);

		var iX = fnNormalizeMinX(iEventX);

		this.mDoms.rightLine.attr({x1: iX, x2: iX});
		this.mDoms.rightLineTrigger.attr({x1: iX, x2: iX});

		this.mDoms.topLine.attr({x2: iX});
		this.mDoms.bottomLine.attr({x2: iX});
		this.mDoms.rightRectTrigger.attr({x: iX + GanttUtils.SHAPE_CONNECT_INDICATOR_WIDTH / 2 - 2});

		var iNewWidth = iX - this.origin.minX;

		this.mDoms.resizeRectCover.attr({width: iNewWidth});
	};

	GanttResizeExtension.prototype._updateLeftPartDoms = function(iEventX) {
		var fnNormalizeMaxX = function(iX) {
			var iMaxX = this.origin.maxX;
			var iLeastWidth = 2 * this.getMargin();

			if (iMaxX - iX <= iLeastWidth) {
				return iMaxX - iLeastWidth;
			}
			return iX;
		}.bind(this);


		var iX = fnNormalizeMaxX(iEventX);

		this.mDoms.leftLine.attr({x1: iX, x2: iX});
		this.mDoms.leftLineTrigger.attr({x1: iX, x2: iX});

		this.mDoms.topLine.attr({x1: iX});
		this.mDoms.bottomLine.attr({x1: iX});

		this.mDoms.leftRectTrigger.attr({x: iX - this.getMargin() - GanttUtils.SHAPE_CONNECT_INDICATOR_WIDTH - 2});

		var iRectWidth = Math.abs(iX - fnValueOf(this.mDoms.rightLineTrigger, "x1")) - 2;
		this.mDoms.resizeRectCover.attr({x: iX + this.getMargin(), width: iRectWidth < 0 ? 0 : iRectWidth});
	};

	GanttResizeExtension.prototype.onKeydown = function(event) {
		if (event.keyCode === jQuery.sap.KeyCodes.ESCAPE) {
			if (this.isResizing()) {
				this._updateLeftPartDoms(this.origin.minX - this.getMargin());
				this._updateRightPartDoms(this.origin.maxX + this.getMargin());

				this._updateResizingEffect(false);
				this._initResizeStatus();
			}

			this._removeDragEvents();
		}
	};

	GanttResizeExtension.prototype.endResizing = function (event) {
		this._removeDragEvents();
		if (this._shallSkip(event)) { return; }
		// minX or maxX could be changed during resizing
		// 1 is the line stroke width
		var minX = fnValueOf(this.mDoms.leftLine, "x1") + this.getMargin(),
			maxX = fnValueOf(this.mDoms.rightLine, "x1") - this.getMargin();

		var oShape = this._getShapeByUid(this.origin.resizeFor),
			oGanttChart = this.getGantt();
		if (oShape) {
			this.renderResizerOutline(oShape);
			this._fireShapeResizeEvent(oGanttChart, oShape, minX, maxX);
		}
		this._initResizeStatus();
	};

	GanttResizeExtension.prototype._getShapeByUid = function(sShapeUid) {
		var aShapes = GanttUtils.getShapesWithUid(this.getGantt().getId(), [sShapeUid]);
		if (aShapes.length > 0) {
			return aShapes[0];
		}
	};

	GanttResizeExtension.prototype._fireShapeResizeEvent = function (oGantt, oShape, minX, maxX) {
		var dNewStartTime = minX === this.origin.minX ? oShape.getTime() : oGantt.getAxisTime().viewToTime(minX),
			dNewEndTime = maxX === this.origin.maxX ? oShape.getEndTime() : oGantt.getAxisTime().viewToTime(maxX);

		if (Core.getConfiguration().getRTL()) {
			var dTempTime = dNewEndTime;
			dNewEndTime = dNewStartTime;
			dNewStartTime = dTempTime;
		}
		oGantt.fireShapeResize({
			shape: oShape,
			shapeUid: oShape.getShapeUid(),
			rowObject: oShape.getParent(),
			oldTime: [oShape.getTime(), oShape.getEndTime()],
			newTime: [dNewStartTime, dNewEndTime]
		});
	};

	GanttResizeExtension.prototype._initResizeStatus = function() {
		this.currentAction = ResizeActions.None;
		this.origin = {
			minX: -1,
			maxX: -1,
			eventTarget: null,
			resizeFor: null
		};

		this.mElementFrame = null;
		this.iOutlineMargin = 0;

		this.initDomSelector();
	};

	GanttResizeExtension.prototype.setFrame = function(mFrame) {
		this.mElementFrame = mFrame;
	};

	GanttResizeExtension.prototype.getFrame = function() {
		return this.mElementFrame;
	};

	GanttResizeExtension.prototype.setMargin = function(iMargin) {
		this.iOutlineMargin = iMargin;
	};

	GanttResizeExtension.prototype.getMargin = function() {
		return this.iOutlineMargin;
	};

	GanttResizeExtension.prototype._shallSkip = function(event) {
		if (!this.isResizing()) {
			return true;
		}
		if (this.origin.eventTarget && !jQuery(this.origin.eventTarget).hasClass("resizeTrigger")) {
			return true;
		}
		return false;
	};

	GanttResizeExtension.prototype.getConnectSquaresData = function(bShowConnectIndicator) {
		var frame = this.getFrame(),
			iX = frame.x,
			iY = frame.y,
			iWidth = frame.width,
			iHeight = frame.height;
		var iMargin = this.getMargin();

		var iRectWidth = bShowConnectIndicator ? GanttUtils.SHAPE_CONNECT_INDICATOR_WIDTH : 0; // use 0 to hide the indicators
		var mCommonProp = {
			width: iRectWidth,
			height: iRectWidth,
			stroke: "#000",
			"stroke-width": 1
		};

		var iLeftX = iX - iMargin - iRectWidth - 2,
			iLeftY = iY + (iHeight / 2) - (iRectWidth / 2);

		var iRightX = (iX + iWidth + iMargin) + 2,
			iRightY = iLeftY;

		return [
			jQuery.extend({
				x: iLeftX, y: iLeftY,
				"class": "left"
			}, mCommonProp),
			jQuery.extend({
				x: iRightX, y: iRightY,
				"class": "right"
			}, mCommonProp)
		];
	};

	GanttResizeExtension.prototype.getResizeRectCoverAttrs = function() {
		var frame = this.getFrame(),
			iMargin = this.getMargin(),
			iStrokeWidth = this.getSelectionSettings().strokeWidth;

		var mCommonProp = {
			stroke: "none",
			"stroke-width": 0,
			fill: "red",
			"class": "resizeCover",
			opacity: 0,
			style: "pointer-events: none;"
		};

		// to ensure that there is 1 px inside the resize outline
		var iOffsetValue = (2 * iMargin) - (2 * iStrokeWidth);
		return jQuery.extend({
			x: frame.x - iMargin + iStrokeWidth,
			y: frame.y - iMargin + iStrokeWidth,
			width: frame.width + iOffsetValue,
			height: frame.height + iOffsetValue
		}, mCommonProp);
	};

	GanttResizeExtension.prototype.getOutlineLines = function() {
		var frame = this.getFrame(),
			iX = frame.x,
			iY = frame.y,
			iWidth = frame.width,
			iHeight = frame.height;
		var iMargin = this.getMargin();

		var mSelectionSetting = this.getSelectionSettings();

		var mCommonProp = {
			"stroke-dasharray": mSelectionSetting.strokeDasharray,
			fill: "transparent",
			stroke: mSelectionSetting.color,
			"stroke-width": mSelectionSetting.strokeWidth
		};

		var p = {
			minX: iX - iMargin,
			minY: iY - iMargin,

			maxX: iX + iWidth + iMargin,
			maxY: iY + iHeight + iMargin
		};

		var mPaths = {
			top: {
				x1: p.minX, y1: p.minY, x2: p.maxX, y2: p.minY
			},
			right: {
				x1: p.maxX, y1: p.minY, x2:p.maxX, y2:p.maxY
			},
			bottom: {
				x1: p.minX, y1: p.maxY, x2: p.maxX, y2: p.maxY
			},
			left: {
				x1: p.minX, y1: p.minY, x2: p.minX, y2: p.maxY
			}
		};
		var aDirection = ["top", "right", "bottom", "left"];

		var aLines = aDirection.map(function(dir){
			return jQuery.extend(mPaths[dir] , { "class": dir }, mCommonProp);
		});

		var mCloned = jQuery.extend(true, mPaths);
		var aIndicators = ["left", "right"].map(function(dir){
			return jQuery.extend(mCloned[dir] , { "class": dir }, mCommonProp);
		});
		return {border: aLines, indicator: aIndicators};
	};

	GanttResizeExtension.prototype._getResizeTime = function(oEvent) {

		var minX = fnValueOf(this.mDoms.leftLine, "x1") + this.getMargin(),
			maxX = fnValueOf(this.mDoms.rightLine, "x1") - this.getMargin();

		if (isNaN(minX) || isNaN(maxX)) {
			return null;
		}

		var oGantt = this.getGantt();
		var startTime = oGantt.getAxisTime().viewToTime(minX),
			endTime = oGantt.getAxisTime().viewToTime(maxX),
			tempTime;
		var bRTL = Core.getConfiguration().getRTL();
		if (bRTL) {
			tempTime = endTime;
			endTime = startTime;
			startTime = tempTime;
		}

		return {
			time: startTime,
			endTime: endTime
		};
	};


	return GanttResizeExtension;
});
