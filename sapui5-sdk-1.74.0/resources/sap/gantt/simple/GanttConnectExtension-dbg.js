/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/Core",
	"sap/gantt/library",
	"./GanttExtension",
	"./CoordinateUtils",
	"./GanttUtils"
], function(jQuery, Core, library, GanttExtension, CoordinateUtils, GanttUtils) {
	"use strict";

	var _sNamespace = ".sapGanttShapeConnect";
	var RelationshipType = library.simple.RelationshipType;

	/**
	 * ShapeConnectHelper to provide de/attach DOM elements
	 */
	var ShapeConnectHelper = {
		addEventListeners: function(oGantt) {
			this.removeEventListeners(oGantt);
			var oExtension = oGantt._getConnectExtension();
			oExtension.shapeConnectDoms().shapeConnectTriggers.on("mousedown" + _sNamespace, oExtension.beforeShapeConnect.bind(oExtension));
		},
		removeEventListeners: function(oGantt) {
			var oExtension = oGantt._getConnectExtension();
			oExtension.shapeConnectDoms().shapeConnectTriggers.off(_sNamespace);
		},
		addShapeConnectEventListeners: function(oGantt) {
			this.removeShapeConnectEventListeners(oGantt);
			var oExtension = oGantt._getConnectExtension();
			var $document = jQuery(document);
			$document.on("mousemove" + _sNamespace, oExtension.onMousemove.bind(oExtension));
			$document.on("mouseup" + _sNamespace, oExtension.endShapeConnect.bind(oExtension));
			$document.on("keydown" + _sNamespace, oExtension.onKeydown.bind(oExtension));
		},
		removeShapeConnectEventListeners: function(oGantt) {
			jQuery(document).off(_sNamespace);
		}

	};

	/**
	 * GanttConnectExtension class
	 *
	 * @class
	 * The GanttConnectExtension aim to provide support for relationship creation.
	 * @private
	 * @alias sap.gantt.simple.GanttConnectExtension
	 * @extends sap.gantt.simple.GanttExtension
	 */
	var GanttConnectExtension = GanttExtension.extend("sap.gantt.simple.GanttConnectExtension", {
		/**
		 * @override
		 * @inheritDoc
		 * @returns {string} The name of this extension.
		 */
		_init: function(oGantt, mSettings) {
			this._initShapeConnectStates();

			return "ConnectExtension";
		}
	});

	GanttConnectExtension.prototype.attachShapeConnectEvents = function() {
		var oGantt = this.getGantt();
		ShapeConnectHelper.addEventListeners(oGantt);
		if (this.isShapeConnecting()) {
			ShapeConnectHelper.addShapeConnectEventListeners(oGantt);
		}
	};

	GanttConnectExtension.prototype._initShapeConnectStates = function() {
		this.mDom = {};
		this._oStartShape = {};
		this._bShapeConnecting = false;
		this._oScrollDistance = {x: 0, y: 0};
		this._bElementConnectable = false;
	};

	GanttConnectExtension.prototype.getRlsStartShape = function() {
		return this._oStartShape;
	};

	GanttConnectExtension.prototype.getSvgElement = function() {
		return this.getDomRefs().ganttSvg;
	};

	GanttConnectExtension.prototype._getShapeConnectRootNode = function() {
		var $shapeConnectContainer = this.shapeConnectDoms().shapeConnect;
		return d3.select($shapeConnectContainer.get(0));
	};

	GanttConnectExtension.prototype.setDomSelector = function() {
		var oDoms = this.shapeConnectDoms();
		this.mDom.connectLine = oDoms.connectLine;
		this.mDom.ghostRect = oDoms.shapeConnectGhost;
	};

	GanttConnectExtension.prototype.createConnectLine = function(oFrame, oSvgPoint) {
		var oPointerExtension = this.getGantt()._getPointerExtension();
		var iX = oSvgPoint.x + oPointerExtension._getAutoScrollStep();

		var oLineData = {
			"class": "shapeConnectLine",
			x1: oFrame.x + oFrame.width / 2,
			y1: oFrame.y + oFrame.width / 2,
			x2: iX,
			y2: oSvgPoint.y
		};

		if (this.getD3Doms().shapeConnectLine.empty()) {
			var oShapeConnectRootNode = this._getShapeConnectRootNode();
			oShapeConnectRootNode.append("line").attr(oLineData);
		}
	};

	GanttConnectExtension.prototype.createGhostRect = function(oFrame, oSvgPoint) {
		var oPointerExtension = this.getGantt()._getPointerExtension();
		var iX = oFrame.x + oPointerExtension._getAutoScrollStep();
		var oGhostRectData = {
			"class": "shapeConnectGhost",
			x: iX - oFrame.width / 2,
			y: oSvgPoint.y - oFrame.width / 2,
			width: oFrame.width,
			height: oFrame.width
		};

		if (this.getD3Doms().shapeConnectGhost.empty()) {
			var oShapeConnectRootNode = this._getShapeConnectRootNode();
			oShapeConnectRootNode.append("rect").attr(oGhostRectData);
		}
	};

	GanttConnectExtension.prototype.isShapeConnecting = function() {
		return this._bShapeConnecting;
	};

	GanttConnectExtension.prototype.updateShapeConnectEffect = function(oGantt) {
		if (this.isShapeConnecting()) {
			var oCursorPoint = CoordinateUtils.getLatestCursorPosition();
			var oFrame = this.getStartShapeFrame();
			var oSvg = this.getSvgElement();
			var oSvgPoint = CoordinateUtils.getEventSVGPoint(oSvg, oCursorPoint);
			this.createConnectLine(oFrame, oSvgPoint);
			this.createGhostRect(oFrame, oSvgPoint);
			this.showIndicator();
			this.setDomSelector();

			this.attachShapeConnectEvents();
		}
	};

	GanttConnectExtension.prototype.beforeShapeConnect = function(oEvent) {
		var $target = jQuery(oEvent.target);

		var sShapeUid = $target.parents("g").attr(GanttUtils.SELECT_FOR_DATASET_KEY);
		this._bElementConnectable = true;
		var bRTL = Core.getConfiguration().getRTL();
		var oFrame = oEvent.target.getBBox();

		var sStartPoint;
		if (bRTL) {
			sStartPoint = $target.hasClass("rightTrigger") ? "Start" : "Finish";
		} else {
			sStartPoint = $target.hasClass("leftTrigger") ? "Start" : "Finish";
		}

		this._oScrollDistance = {x: 0, y: 0};
		this._oStartShape = {
			startTriggerFrame: oFrame,
			x: oFrame.x + oFrame.width / 2,
			y: oFrame.y + oFrame.width / 2,
			shapeUid: sShapeUid,
			isRightTrigger: $target.hasClass("rightTrigger"),
			startPoint: sStartPoint
		};

		ShapeConnectHelper.addShapeConnectEventListeners(this.getGantt());
	};

	GanttConnectExtension.prototype.toggleShapeConnectTrigger = function() {
		var oGantt = this.getGantt();
		oGantt._updateShapeSelections(oGantt.getSelectedShapeUid(), []);
	};

	GanttConnectExtension.prototype.getStartShapeFrame = function() {
		var oFrame = {x: 0, y: 0, width: GanttUtils.SHAPE_CONNECT_INDICATOR_WIDTH};
		if (this.isShapeConnecting()) {
			var $shapeConnectTrigger = this.shapeConnectDoms().startShapeConnectTrigger;
			if ($shapeConnectTrigger && $shapeConnectTrigger.length === 1) {
				return $shapeConnectTrigger.get(0).getBBox();
			} else {
				oFrame.x = this._oStartShape.x - this._oScrollDistance.x;
				oFrame.y = this._oStartShape.y - this._oScrollDistance.y;
			}
		}
		return oFrame;
	};

	GanttConnectExtension.prototype._getAcceptableShapeElements = function() {
		var aAcceptableShapes = [];
		var that = this;
		this.shapeConnectDoms().connectableShapes.each(function(index, oShape) {
			var oControl = jQuery(oShape).control(0, true);
			if (oControl && that._oStartShape.shapeUid !== oControl.getShapeUid()
				&& oControl.getDomRef()) {
					aAcceptableShapes.push(oControl);
			}
		});

		return aAcceptableShapes;
	};

	GanttConnectExtension.prototype.showIndicator = function() {
		if (!this.isShapeConnecting()) {
			return;
		}

		var aIndicators = [];
		var that = this;
		this._getAcceptableShapeElements().forEach(function(oShape) {
			aIndicators.push(that._getIndicatorData(oShape));
		});

		this.getD3Doms().shapeConnectContainers
			.data(aIndicators).enter()
			.append("g")
			.classed("shapeConnectContainer", true)
			.attr("id", function(d) {
				return d.id + "-shape-connect";
			})
			.attr(GanttUtils.SHAPE_CONNECT_FOR_DATASET_KEY, function(d) {
				return d.id;
			})
			.each(function(d) {
				var g = d3.select(this);
				g.append("rect").attr(d.left);
				g.append("rect").attr(d.right);
			});

		this.attachEventHandlerToIndicator();
	};

	GanttConnectExtension.prototype.onMousemove = function(oEvent) {
		if (this._bElementConnectable === false) {
			return;
		}

		if (!this.isShapeConnecting()) {
			this._bShapeConnecting = true;
			var oSvg = this.getSvgElement();
			var oSvgPoint = CoordinateUtils.getEventSVGPoint(oSvg, oEvent);

			this.createConnectLine(this._oStartShape.startTriggerFrame, oSvgPoint);
			this.createGhostRect(this._oStartShape.startTriggerFrame, oSvgPoint);
			this.showIndicator();
			this.toggleShapeConnectTrigger();
			this.setDomSelector();
		} else {
			this.onShapeConnecting(oEvent);
		}
	};

	GanttConnectExtension.prototype.onShapeConnecting = function(oEvent) {
		var oSvg = this.getSvgElement();
		var oSvgPoint = CoordinateUtils.getEventSVGPoint(oSvg, oEvent);
		// this.mDom.connectLine.attr({x2: oSvgPoint.x, y2: oSvgPoint.y});
		var oPointerExtension = this.getGantt()._getPointerExtension();
		var iX = oSvgPoint.x + oPointerExtension._getAutoScrollStep();
		this.mDom.connectLine.attr({x2: iX, y2: oSvgPoint.y});
		var iIndicatorWidth = GanttUtils.SHAPE_CONNECT_INDICATOR_WIDTH;
		this.mDom.ghostRect.attr({
			x: iX - iIndicatorWidth / 2,
			y: oSvgPoint.y - iIndicatorWidth / 2
		});
	};

	GanttConnectExtension.prototype.fireEvent = function(oEvent) {
		var $target = jQuery(oEvent.target);
		var sToShapeId = $target.parents("g").attr(GanttUtils.SHAPE_CONNECT_FOR_DATASET_KEY);

		var bRTL = Core.getConfiguration().getRTL();
		var sEndPoint = (bRTL ? $target.hasClass("rightIndicator") : $target.hasClass("leftIndicator")) ? "Start" : "Finish";

		// fire event
		var sType = this._oStartShape.startPoint + "To" + sEndPoint;
		var oEventData = {
			fromShapeUid: this._oStartShape.shapeUid,
			toShapeUid: jQuery.sap.byId(sToShapeId).control(0).getShapeUid(),
			type: RelationshipType[sType]
		};

		var oGanttChart = this.getGantt();
		oGanttChart.fireShapeConnect(oEventData);
	};

	GanttConnectExtension.prototype.endShapeConnect = function(oEvent) {
		if (this.isShapeConnecting()) {
			var oShapeConnectRootNode = this._getShapeConnectRootNode();
			oShapeConnectRootNode.selectAll("*").remove();
		}
		ShapeConnectHelper.removeShapeConnectEventListeners(this.getGantt());
		this._initShapeConnectStates();
		this.toggleShapeConnectTrigger();
	};

	GanttConnectExtension.prototype.onKeydown = function(oEvent) {
		if (this.isShapeConnecting() && oEvent.keyCode === jQuery.sap.KeyCodes.ESCAPE) {
			this.endShapeConnect(oEvent);
		}
	};

	GanttConnectExtension.prototype.toggleGhostRect = function(oEvent) {
		if (this.isShapeConnecting()) {
			this.shapeConnectDoms().shapeConnectGhost.toggleClass("hideShapeConnectGhost");
			jQuery(oEvent.target).toggleClass("hoverOnShapeConnectIndicator");
		}
	};

	GanttConnectExtension.prototype.attachEventHandlerToIndicator = function() {
		var aIndicators = this.shapeConnectDoms().indicators;
		aIndicators.off(_sNamespace);
		aIndicators.on("mouseup" + _sNamespace, this.fireEvent.bind(this));
		aIndicators.on("mouseover" + _sNamespace + " mouseout" + _sNamespace, this.toggleGhostRect.bind(this));
	};

	GanttConnectExtension.prototype._getIndicatorData = function(oShape) {
		var sElemId = oShape.getId();
		var oFrame = oShape.getDomRef().getBBox(),
			iX = oFrame.x,
			iY = oFrame.y,
			iWidth = oFrame.width,
			iHeight = oFrame.height;

		var iRectWidth = GanttUtils.SHAPE_CONNECT_INDICATOR_WIDTH - 2;
		var iMargin = 2;
		var iLeftX = iX - iMargin - iRectWidth,
			iLeftY = iY + (iHeight / 2) - (iRectWidth / 2);

		var iRightX = (iX + iWidth + iMargin),
			iRightY = iLeftY;

		var mCommonProp = {
			width: iRectWidth,
			height: iRectWidth
		};

		return {
			id: sElemId,
			left: jQuery.extend({
					x: iLeftX, y: iLeftY, "class": "leftIndicator shapeConnectIndicator"
				}, mCommonProp),
			right: jQuery.extend({
					x: iRightX, y: iRightY, "class": "rightIndicator shapeConnectIndicator"
				}, mCommonProp)
		};
	};

	GanttConnectExtension.prototype.storeScrollDistance = function(iStep, bHorizontal) {
		if (bHorizontal) {
			this._oScrollDistance.x += iStep;
		} else {
			this._oScrollDistance.y += iStep;
		}
	};

	GanttConnectExtension.prototype.shapeConnectDoms = function() {
		var $svg = jQuery(this.getSvgElement());

		var sSelectShapePart = 'g[' + GanttUtils.SELECT_FOR_DATASET_KEY + '="' + this._oStartShape.shapeUid + '"]';
		var sTriggerPart = ".shapeConnectTrigger." + (this._oStartShape.isRightTrigger ? "rightTrigger" : "leftTrigger");
		var $shapeConnectArea = $svg.find("g.sapGanttChartShapeConnect");
		var $selectionArea = $svg.find("g.sapGanttChartSelection");
		return {
			shapeConnect:        $shapeConnectArea,
			indicators:          $shapeConnectArea.find(".shapeConnectContainer .shapeConnectIndicator"),
			shapeConnectGhost:   $shapeConnectArea.find(".shapeConnectGhost"),
			connectLine:         $shapeConnectArea.find(".shapeConnectLine"),
			connectableShapes:   $svg.find("[" + GanttUtils.CONNECTABLE_DATASET_KEY + "=true]"),
			shapeConnectTriggers: $selectionArea.find(".shapeConnectTrigger"),
			startShapeConnectTrigger: $selectionArea.find(sSelectShapePart + ' ' + sTriggerPart)

		};
	};

	GanttConnectExtension.prototype.getD3Doms = function() {
		var oNode = this._getShapeConnectRootNode();
		return {
			shapeConnectLine: oNode.selectAll(".shapeConnectLine"),
			shapeConnectGhost: oNode.selectAll(".shapeConnectGhost"),
			shapeConnectContainers: oNode.selectAll(".shapeConnectContainer")
		};
	};

	return GanttConnectExtension;
});
