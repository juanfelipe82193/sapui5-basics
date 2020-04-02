/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/base/Object",
	"sap/ui/core/Core",
	"sap/gantt/misc/Format"
], function (
	jQuery,
	BaseObject,
	Core,
	Format) {
	"use strict";

	/**
	 * Constructor for a new TimePopoverHandler
	 *
	 * Initialize the handler and reserve the caller of this handler as the '_oSourceChart'
	 * currently, '_oSourceChart' may be an instance of GanttChart or GanttChartWithTable
	 * @param {object} oChart an instance of the caller
	 *
	 * @class
	 * Handler for shape dragging event
	 * @extends sap.ui.base.Object
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @private
	 * @alias sap.gantt.eventHandler.TimePopoverHandler
	 */
	var TimePopoverHandler = BaseObject.extend("sap.gantt.eventHandler.TimePopoverHandler", {
		constructor : function (oChart) {
			BaseObject.call(this);
			this._bSelectShape = false;
			this._bDragShape = false;
			this._iOffsetX = 0;
			this._iOffsetY = 28;
			this._oSourceChart = oChart;
			this._oTimePopoverModel = undefined;
		}
	});

	TimePopoverHandler.prototype.handleTimePopover = function (oEvent) {
		this._handleTimePopoverDragStart(oEvent);
	};

	TimePopoverHandler.prototype._handleTimePopoverDragStart = function(oEvent) {
		this._bSelectShape = false;
		this._bDragShape = false;
		this._calcPositionGap();
		jQuery(document.body).unbind("mousemove.shapeDragDrop");
		jQuery(document).unbind("mouseup.shapeDragDrop");
		jQuery(document.body).bind("mousemove.shapeDragDrop", this._handleTimePopoverDragging.bind(this));
		jQuery(document).bind("mouseup.shapeDragDrop", this._handleTimePopoverEnd.bind(this));

	};

	TimePopoverHandler.prototype._calcPositionGap = function(oEvent) {
		var iToXGap;
		var bRtl = Core.getConfiguration().getRTL();

		if (this._oSourceChart.getGhostAlignment() === sap.gantt.dragdrop.GhostAlignment.Start) {
			this._iOffsetX = bRtl ? this._oSourceChart._oDraggingData.dragStartPoint.shapeWidth : -this._oSourceChart._oDraggingData.dragStartPoint.shapeWidth;
		} else if (this._oSourceChart.getGhostAlignment() === sap.gantt.dragdrop.GhostAlignment.None) {
			iToXGap = bRtl ? this._oSourceChart._oDraggingData.dragStartPoint.x - this._oSourceChart._oDraggingData.dragStartPoint.shapeX
						: this._oSourceChart._oDraggingData.dragStartPoint.x - this._oSourceChart._oDraggingData.dragStartPoint.shapeX - this._oSourceChart._oDraggingData.dragStartPoint.shapeWidth;
			this._iOffsetX = Math.ceil(iToXGap);
		} else if (this._oSourceChart.getGhostAlignment() === sap.gantt.dragdrop.GhostAlignment.End) {
			this._iOffsetX = 0;
		}

		var iOffsetY = this._oSourceChart.getBaseRowHeight();
		var oDragClientRect = this._oSourceChart._oDraggingData.groupDom.getBoundingClientRect();
		if (oDragClientRect) {
			iOffsetY += oDragClientRect.height;
		}
		this._iOffsetY = Math.ceil(iOffsetY);
	};

	TimePopoverHandler.prototype._handleTimePopoverDragging = function (oEvent) {
		var aDragDiv = d3.select("#dragDropShadow");
		var dragDiv = aDragDiv[0];
		if (this._oSourceChart.getEnableShapeTimeDisplay() && dragDiv[0]) {
			var oPositionData = this._getPopoverPosition(oEvent);
			this._displayTimePopover(oPositionData, dragDiv[0]);
		}
	};

	TimePopoverHandler.prototype._displayTimePopover = function(oPositionData, dragDiv) {

		if (!this._isDraggingShape()) {
			this._changeDraggingStatus();
		} else if (!this._existsPopover()) {
			this._buildPopover(oPositionData);
			this.oTimePopover.openBy(dragDiv);
		} else {
			if (this.oTimePopover.isOpen()) {
				this._updatePopover(oPositionData);
			} else {
				this.oTimePopover.destroy();
				this.oTimePopover = undefined;
				this._buildPopover(oPositionData);
				this.oTimePopover.openBy(dragDiv);
			}
		}

	};

	TimePopoverHandler.prototype._buildPopover = function(oPositionData) {
		var sStart = sap.ui.getCore().getLibraryResourceBundle("sap.gantt").getText("GNT_CURRENT_START");
		var sEnd = sap.ui.getCore().getLibraryResourceBundle("sap.gantt").getText("GNT_CURRENT_END");
		this.oTimePopover = new sap.m.ResponsivePopover({
			showArrow: false,
			showHeader: false,
			offsetX: "{time>/offsetX}",
			offsetY: "{time>/offsetY}",
			placement: "{time>/placement}",
			//title : "Current time interval",
			content : [new sap.m.FlexBox({
				alignItems: "Center",
				items: [new sap.m.Panel({
					content: [ new sap.m.FlexBox({
						alignItems: "Center",
						justifyContent: "End",
						items: [new sap.m.Label({text : sStart})]
					}).addStyleClass("sapUiTinyMargin"),
					new sap.m.FlexBox({
						alignItems: "Center",
						justifyContent: "End",
						items: [new sap.m.Label({text : sEnd})]
					}).addStyleClass("sapUiTinyMargin")]
				}).addStyleClass("sapUiNoContentPadding"),
				new sap.m.Panel({
					content: [ new sap.m.FlexBox({
						justifyContent: "Start",
						items: [new sap.m.Label({text: "{time>/startNewDate}"})]
					}).addStyleClass("sapUiTinyMargin"),
					new sap.m.FlexBox({
						justifyContent: "Start",
						items: [new sap.m.Label({text: "{time>/endNewDate}"})]
					}).addStyleClass("sapUiTinyMargin")]
				}).addStyleClass("sapUiNoContentPadding")]
			})]
		});

		this._oTimePopoverModel = new sap.ui.model.json.JSONModel(oPositionData);
		this.oTimePopover.setModel(this._oTimePopoverModel, "time");
	};

	TimePopoverHandler.prototype._updatePopover = function(oPositionData){
		/*Popover must create new model when updating data*/
		this._oTimePopoverModel = new sap.ui.model.json.JSONModel();
		this._oTimePopoverModel.setData(oPositionData);
		this.oTimePopover.setModel(this._oTimePopoverModel, "time");

	};

	TimePopoverHandler.prototype._calPopoverPosition = function(sStartTimetamp, sEndTimestamp){
		var oGanttLocale = this._oSourceChart.getLocale();
		var sStartNewDate = Format.abapTimestampToTimeLabel(new Date(sStartTimetamp), oGanttLocale);
		var sEndNewDate = Format.abapTimestampToTimeLabel(new Date(sEndTimestamp), oGanttLocale);

		var oPositionData = {
			startNewDate: sStartNewDate,
			endNewDate: sEndNewDate,
			offsetX: this._iOffsetX,
			offsetY: this._iOffsetY,
			placement: sap.m.PlacementType.Right
		};

		return oPositionData;
	};

	TimePopoverHandler.prototype._changeDraggingStatus = function(){
		if (this._bSelectShape){
			this._bDragShape = true;
		}
		if (!this._bSelectShape){
			this._bSelectShape  = true;
		}
	};

	TimePopoverHandler.prototype._isDraggingShape = function(){
		return this._bSelectShape && this._bDragShape;
	};

	TimePopoverHandler.prototype._existsPopover = function(){
		return this.oTimePopover !== undefined;
	};

	TimePopoverHandler.prototype._getPopoverPosition = function(oEvent) {
		this._oSourceChart._collectDraggingShapeData(this._oSourceChart._oDraggingData, oEvent);
		var oTargetData = this._oSourceChart._oDraggingData.targetData;
		var oPosition = this._calPopoverPosition(oTargetData["mouseTimestamp"].startTime,  oTargetData["mouseTimestamp"].endTime);
		return oPosition;
	};

	TimePopoverHandler.prototype._handleTimePopoverEnd = function() {
		if (this.oTimePopover /*&& this.oTimePopover.isOpen()*/){
			this.oTimePopover.destroy();
			this.oTimePopover = undefined;
		}
		jQuery(document.body).unbind("mousemove.shapeDragDrop");
		jQuery(document.body).unbind("mouseup.shapeDragDrop");
	};

	TimePopoverHandler.prototype.getCurrentPopoverData = function() {
		return {
			timePopover: this.oTimePopover,
			offsetX: this._iOffsetX,
			offsetY: this._iOffsetY
		};
	};

	TimePopoverHandler.prototype.setCurrentPopoverData = function(oTimePopoverData) {
		if (oTimePopoverData) {
			this.oTimePopover = oTimePopoverData.timePopover;
			this._iOffsetX = oTimePopoverData.offsetX;
			this._iOffsetY = oTimePopoverData.offsetY;
		}
	};

	return TimePopoverHandler;
}, true);
