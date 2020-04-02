/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/Core",
	"./GanttExtension",
	"./GanttUtils",
	"./CoordinateUtils"
],
function(
	jQuery,
	Core,
	GanttExtension,
	GanttUtils,
	CoordinateUtils
) {
	"use strict";

	var _sNamespace = ".sapGanttPopover";
	var sMouseDown = "mousedown";
	var sMouseDownWithNamespace = sMouseDown + _sNamespace;
	var aEvents = ["mousemove", "mouseup", "keydown"];
	var BrowserEvent = aEvents.reduce(function(events, name){
		events[name] = name;
		return events;
	}, {});

	var aEventWithNamespace = aEvents.map(function(sEvent) { return sEvent + _sNamespace; });

	var PopoverHelper = {
		dispatchEvent: function(oEvent) {
			var oExtension = this._getPopoverExtension();
			if (oEvent.type === BrowserEvent.mousemove) {
				oExtension.onMouseMove(oEvent);
			} else if (oEvent.type === BrowserEvent.mouseup) {
				oExtension.onMouseUp(oEvent);
			} else if (oEvent.type === BrowserEvent.keydown) {
				oExtension.onKeydown(oEvent);
			}
		},
		entry: function(oEvent) {
			if (this.getShowShapeTimeOnDrag()) {
				var oExtension = this._getPopoverExtension();
				oExtension.onMouseDown(oEvent);
			}
		},
		addEventListeners: function(oGantt) {
			this.removeEventListeners(oGantt);
			var oSvg = jQuery(oGantt._getPopoverExtension().getDomRefs().ganttSvg);
			oSvg.on(sMouseDownWithNamespace, PopoverHelper.entry.bind(oGantt) );
		},
		removeEventListeners: function(oGantt) {
			var oSvg = jQuery(oGantt._getPopoverExtension().getDomRefs().ganttSvg);
			oSvg.off(sMouseDownWithNamespace);
		},
		addPopoverEventListeners: function(oGantt) {
			this.removePopoverEventListeners(oGantt);
			aEventWithNamespace.forEach(function(sEventName) {
				jQuery(document).on(sEventName, PopoverHelper.dispatchEvent.bind(oGantt) );
			});
		},
		removePopoverEventListeners: function(oGantt) {
			jQuery(document).off(_sNamespace);
		}
	};

	/**
	 * For time popover on ganttchart.
	 *
	 * @extends sap.gantt.simple.GanttExtension
	 * @author SAP SE
	 * @version 1.74.0
	 * @constructor
	 * @private
	 * @alias sap.gantt.simple.GanttPopoverExtension
	 */
	var GanttPopoverExtension = GanttExtension.extend("sap.gantt.simple.GanttPopoverExtension", {
		/**
		 * @override
		 * @inheritDoc
		 * @returns {string} The name of this extension.
		 */
		_init: function(oGantt, mSettings) {
			this._initPopoverStates();
			return "PopoverExtension";
		},

		/**
		 * @override
		 * @inheritDoc
		 */
		_attachEvents: function() {
			var oGantt = this.getGantt();
			PopoverHelper.addEventListeners(oGantt);
		},

		/**
		 * @override
		 * @inheritDoc
		 */
		_detachEvents: function() {
			var oGantt = this.getGantt();
			PopoverHelper.removeEventListeners(oGantt);
		}
	});

	GanttPopoverExtension.prototype._initPopoverStates = function() {
		this._iOffsetX = 10;
		this._iOffsetY = 32;
		this._bNeedReverse = false;
	};

	GanttPopoverExtension.prototype.onMouseMove = function(oEvent) {
		if (this.isDraggingOrResizing(oEvent)) {
			this._showPopover(oEvent);
		}
	};

	GanttPopoverExtension.prototype.onMouseDown = function(oEvent) {
		PopoverHelper.addPopoverEventListeners(this.getGantt());
	};


	GanttPopoverExtension.prototype.onMouseUp = function(oEvent) {
		PopoverHelper.removePopoverEventListeners(this.getGantt());
		this._hidePopover(oEvent);
		this._initPopoverStates();
	};

	GanttPopoverExtension.prototype.onKeydown = function(oEvent) {
		if (!this.isDraggingOrResizing(oEvent)) { return; }

		if (oEvent.keyCode === jQuery.sap.KeyCodes.ESCAPE) {
			PopoverHelper.removePopoverEventListeners(this.getGantt());
			this._hidePopover(oEvent);
			this._initPopoverStates();
		}
	};

	GanttPopoverExtension.prototype.isDraggingOrResizing = function(oEvent) {
		var oDragExtension = this.getGantt()._getDragDropExtension();
		var oResizer = this.getGantt()._getResizeExtension();
		return oDragExtension.isDragging() || oResizer.isResizing();
	};

	GanttPopoverExtension.prototype._buildPopover = function(oEvent) {
		var sStart = Core.getLibraryResourceBundle("sap.gantt").getText("GNT_CURRENT_START");
		var sEnd = Core.getLibraryResourceBundle("sap.gantt").getText("GNT_CURRENT_END");

		var createTimeDiv = function(sLabel, sStyle) {
			var sContent = "<span class='sapUiTinyMarginEnd sapMLabel'>" + sLabel + "</span>"
				+ "<span class='sapMLabel " + sStyle + "'></span>";
			return "<div class='sapUiTinyMargin'>" + sContent + "</div>";
		};

		this.oTimePopover = jQuery("<div id='sapGanttPopoverWrapper'>"
			+ createTimeDiv(sStart, "sapGanttPopoverStartTime")
			+ createTimeDiv(sEnd, "sapGanttPopoverEndTime")
			+ "</div>");

		this.createAnchor();
		this._calcPopoverOffset();

		var $anchor = jQuery.sap.byId("sapGanttPopoverAnchor");
		$anchor.append(this.oTimePopover);

		var oPositionData = this._getPopoverData(oEvent);
		this._updateTime(oPositionData);
	};

	GanttPopoverExtension.prototype._updateTime = function(oPositionData) {
		var bRtl = Core.getConfiguration().getRTL();
		var sMarginDirction = bRtl ? "marginRight" : "marginLeft";
		var oStyle = { marginTop: oPositionData.offsetY + "px"};
		oStyle[sMarginDirction] = oPositionData.offsetX + "px";
		var oWrapper = jQuery.sap.byId("sapGanttPopoverWrapper").css(oStyle);
		oWrapper.find(".sapGanttPopoverStartTime").html(oPositionData.startNewDate);
		oWrapper.find(".sapGanttPopoverEndTime").html(oPositionData.endNewDate);
	};

	GanttPopoverExtension.prototype._getDragDropOrResizingDom = function() {
		var oDragExtension = this.getGantt()._getDragDropExtension();
		var oResizer = this.getGantt()._getResizeExtension();
		if (oDragExtension.isDragging()) {
			return oDragExtension.$ghost.get(0);
		} else if (oResizer.isResizing()) {
			var aShapes = GanttUtils.getShapesWithUid(this.getGantt().getId(), [oResizer.origin.resizeFor]);
			if (aShapes.length === 1 && aShapes[0]) {
				return document.getElementById(aShapes[0].getShapeUid() + "-selected");
			}
		}
	};

	GanttPopoverExtension.prototype.createAnchor = function(oEvent) {
		var $anchor = jQuery.sap.byId("sapGanttPopoverAnchor");
		if ($anchor.length === 0) {
			$anchor = jQuery("<div id='sapGanttPopoverAnchor'></div>");
			jQuery(document.body).append($anchor);
		}
		this._oTargetDom = $anchor.get(0);
	};

	GanttPopoverExtension.prototype.moveAnchor = function(oEvent) {
		var oPoint = CoordinateUtils.getEventPosition(oEvent),
			iPageX = oPoint.pageX,
			iPageY = oPoint.pageY,
			iScreenWidth = window.screen.width,
			iScreenHeight = window.screen.height;

		if (iPageX < -this._iOffsetX) {
			iPageX = -this._iOffsetX;
		} else if (iPageX > iScreenWidth + this._iOffsetX) {
			iPageX = iScreenWidth + this._iOffsetX;
		}

		var iSpaceY = this._iOffsetY;
		if (this.oTimePopover) {
			iSpaceY += this.oTimePopover.height();
		}

		if (iPageY < -this._iOffsetY) {
			iPageY = -this._iOffsetY;
		} else if (iPageY > iScreenHeight - iSpaceY) {
			iPageY = iScreenHeight - iSpaceY;
		}

		var oLocation = {left: iPageX + "px", top: iPageY + "px", visibility: "visible"};
		jQuery.sap.byId("sapGanttPopoverAnchor").css(oLocation);
	};

	GanttPopoverExtension.prototype.checkIfNeedReverse = function(oEvent) {
		var bRtl = Core.getConfiguration().getRTL();
		var oPoint = CoordinateUtils.getEventPosition(oEvent);
		var iWidth = this.oTimePopover.width() + 10;
		if (bRtl && oPoint.pageX < iWidth || !bRtl && oPoint.pageX + iWidth > window.screen.width) {
			this._bNeedReverse = true;
		} else {
			this._bNeedReverse = false;
		}
	};

	GanttPopoverExtension.prototype._showPopover = function(oEvent) {
		this.moveAnchor(oEvent);
		if (this.oTimePopover) {
			this.checkIfNeedReverse(oEvent);
			this._calcPopoverOffset();
			var oPositionData = this._getPopoverData(oEvent);
			this._updateTime(oPositionData);
		} else {
			this._buildPopover(oEvent);
		}
	};

	GanttPopoverExtension.prototype._hidePopover = function() {
		if (this.oTimePopover) {
			var $anchor = jQuery.sap.byId("sapGanttPopoverAnchor");
			$anchor.css({"visibility": "hidden"});
		}
	};

	GanttPopoverExtension.prototype._getPopoverData = function(oEvent) {
		var oCurrentTime = this._getCurrentTime(oEvent);

		var iOffsetX = this._iOffsetX;
		if (this._bNeedReverse) {
			iOffsetX = -iOffsetX - this.oTimePopover.width();
		}

		var oPopoverData = {
			offsetX: iOffsetX,
			offsetY: this._iOffsetY
		};

		if (oCurrentTime) {
			var oFormater = GanttUtils.getTimeFormaterBySmallInterval(this.getGantt());
			oPopoverData.startNewDate = oFormater.format(oCurrentTime.time);
			oPopoverData.endNewDate = oFormater.format(oCurrentTime.endTime);
		}

		return oPopoverData;
	};

	GanttPopoverExtension.prototype._getCurrentTime = function(oEvent) {
		var oDragExtension = this.getGantt()._getDragDropExtension();
		var oResizer = this.getGantt()._getResizeExtension();
		if (oDragExtension.isDragging()) {
			return oDragExtension._getGhostTime(oEvent);
		} else if (oResizer.isResizing()) {
			return oResizer._getResizeTime(oEvent);
		}
	};

	GanttPopoverExtension.prototype._calcPopoverOffset = function() {
		this._iOffsetY = this._getOffsetY();
	};

	GanttPopoverExtension.prototype._getOffsetY = function() {
		var _oDraggedDom = this._getDragDropOrResizingDom();
		var oDragClientRect = _oDraggedDom && _oDraggedDom.getBoundingClientRect();
		var iOffsetY = 32;
		if (oDragClientRect) {
			iOffsetY = oDragClientRect.height + 2;
		}
		return Math.ceil(iOffsetY);
	};

	GanttPopoverExtension.prototype._updatePopoverWhenAutoScroll = function(oEvent) {
		if (this.getGantt().getShowShapeTimeOnDrag()) {
			var oDragExtension = this.getGantt()._getDragDropExtension();
			var oResizer = this.getGantt()._getResizeExtension();
			if (oDragExtension.isDragging() || oResizer.isResizing()) {
				this._showPopover(oEvent);
			}
		}
	};

	return GanttPopoverExtension;
});
