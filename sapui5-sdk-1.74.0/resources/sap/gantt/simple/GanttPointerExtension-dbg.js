/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/Core",
	"./GanttExtension",
	"../drawer/CursorLine",
	"./CoordinateUtils"
], function(
	jQuery,
	Core,
	GanttExtension,
	CursorLineDrawer,
	CoordinateUtils
) {
	"use strict";

	// Listen event on Gantt SVG only
	var sNamespace = ".sapGanttPointer";
	var ContextMenuEvent = "contextmenu" + sNamespace;

	// Here mouseenter = mouseover; mouseleave = mouseout
	var aMouseEvents = ["mouseenter", "mouseleave", "click", "dblclick", "mouseup", "mousedown"],
		aMouseEventWithNS = aMouseEvents.map(function(sEvent) { return sEvent + sNamespace; });

	var sMousemoveEvent = "mousemove",
		sMousemoveEventWithNamespace = sMousemoveEvent + sNamespace,
		sMouseEventForAutoScrollWithNamespace = sMousemoveEventWithNamespace + " mouseup" + sNamespace;

	var BrowserEvent = aMouseEvents.reduce(function(events, name){
		events[name] = name;
		return events;
	}, {});
	BrowserEvent[sMousemoveEvent] = sMousemoveEvent;

	var Direction = {
		Forward: "forward",
		Backward: "backward",
		Bottom: "bottom",
		Top: "top"
	};

	//delay to trigger auto scroll and delay for each scroll
	var iDelayInMillis = 200;

	var GanttPointerHelper = {
		addEventListeners: function(oGantt) {
			var oExtension = oGantt._getPointerExtension(),
				$ganttSvg  = jQuery(oExtension.getDomRefs().ganttSvg),
				$headerSvg = jQuery(oExtension.getDomRefs().headerSvg);

			// To prevent duplicate binding, onBeforeRendering and onAfterRendering is not called in order
			// Sometimes onAfterRendering will be called twice one right after another
			GanttPointerHelper.removeEventListeners(oGantt);

			aMouseEventWithNS.forEach(function(sEvent){
				$ganttSvg.on(sEvent, oExtension.onGanttChartMouseEvent.bind(oExtension));
			});

			$ganttSvg.on(sMouseEventForAutoScrollWithNamespace, oExtension.onCrossSvgMouseEvent.bind(oExtension));

			// Show cursor line
			$ganttSvg.on(sMousemoveEventWithNamespace, oExtension.updateGanttCursorLine.bind(oExtension));

			// Bind contextmenu click dblclick mouseenter and mouseleave event to background row rectangle
			this.bindBackgroundRowEvent($ganttSvg, oExtension);

			// prevent mouse down event on Gantt chart header
			// default behavior is to reorder columns
			$headerSvg.on(BrowserEvent.mousedown + sNamespace, function(oEvent){
				oEvent.preventDefault();
				oEvent.stopPropagation();
				oEvent.stopImmediatePropagation();
				return false;
			});

			// remember the cursor position whenever cursor moving inside the control
			jQuery(document.getElementById(oGantt.getId())).on(sMousemoveEventWithNamespace, CoordinateUtils.updateCursorPosition);
		},

		removeEventListeners: function(oGantt) {
			var oExtension = oGantt._getPointerExtension(),
				$ganttSvg  = jQuery(oExtension.getDomRefs().ganttSvg),
				$headerSvg = jQuery(oExtension.getDomRefs().headerSvg);
			// unbind all of the handlers in a namespace, regardless of event type
			$ganttSvg.off(sNamespace);
			$headerSvg.off(BrowserEvent.mousedown + sNamespace);

			this.unbindBackgroundRowEvent($ganttSvg);
		},

		doGanttAutoScroll : function(oGantt, sDirection, oEvent, iLastScrollDistance) {
			var oExtension = oGantt._getPointerExtension();

			if (oExtension.iTableAutoScrollTimerId) {
				jQuery.sap.clearDelayedCall(oExtension.iTableAutoScrollTimerId);
				oExtension.iTableAutoScrollTimerId = null;
			}
			if (oExtension._bAutoScroll){
				// When extension triggers autoscroll and the cursor is stable, doGanttAutoScroll remembers the last event.
				// If the current position is out of gantt, the last event will trigger autoscroll time and time again.
				// So the extension should decide if to autoscroll by judging the current position.
				if (!oExtension.allowAutoScroll()) {
					return;
				}
				oExtension._toggleCursorLine(false);
				var oResizer = oGantt._getResizeExtension();
				if (oResizer.isResizing()) {
					oResizer.onResizing(oEvent);
				}

				var oConnectExtension = oGantt._getConnectExtension();
				if (oConnectExtension.isShapeConnecting()) {
					oConnectExtension.onShapeConnecting(oEvent);
				}

				var oPopoverExtension = oGantt._getPopoverExtension();
				oPopoverExtension._updatePopoverWhenAutoScroll(oEvent);

				var oZoomExtention = oGantt._getZoomExtension();
				oZoomExtention._handleAutoScroll(oEvent);

				var bRtl = Core.getConfiguration().getRTL();
				var iStep = 30;
				if (Direction.Backward === sDirection || Direction.Top === sDirection) {
					iStep = (-1) * iStep;
				}

				if (Direction.Backward === sDirection || Direction.Forward === sDirection ) {
					oExtension._iStep = iStep;
				} else {
					oExtension._iStep = 0;
				}

				var $ScrollArea = this.getScrollArea(oGantt, sDirection);

				var sScrollFunction, bHorizontalScroll = false;
				if (sDirection === Direction.Forward || sDirection === Direction.Backward) {
					sScrollFunction = bRtl ? "scrollLeftRTL" : "scrollLeft";
					bHorizontalScroll = true;
				} else {
					sScrollFunction = "scrollTop";
					bHorizontalScroll = false;
				}

				oConnectExtension.storeScrollDistance(iStep, bHorizontalScroll);

				var iTargetScrollDistance = $ScrollArea[sScrollFunction]() + iStep;
				$ScrollArea[sScrollFunction](iTargetScrollDistance);

				var iScrollDistance = $ScrollArea[sScrollFunction]();

				// store real scroll distance for ConnectExtension
				if (iScrollDistance !== iTargetScrollDistance) {
					oConnectExtension.storeScrollDistance(iScrollDistance - iTargetScrollDistance, bHorizontalScroll);
				}

				// if not scroll to end, continue to scroll
				if (!(iLastScrollDistance !== undefined && iLastScrollDistance === iScrollDistance)) {
					oExtension.iTableAutoScrollTimerId = jQuery.sap.delayedCall(iDelayInMillis, GanttPointerHelper,
						GanttPointerHelper.doGanttAutoScroll, [oGantt, sDirection, oEvent, iScrollDistance]);
				}
			}
		},

		getScrollArea: function(oGantt, sDirection) {
			var $ScrollArea;
			var oTable = oGantt.getTable();
			var	oTableVSB = jQuery(oTable.getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar));
			if (sDirection === Direction.Forward || sDirection === Direction.Backward) {
				$ScrollArea = jQuery(document.getElementById(oGantt.getId() + "-hsb"));
			} else {
				$ScrollArea = oTableVSB;
			}
			return $ScrollArea;
		},

		bindBackgroundRowEvent: function($ganttSvg, oExtension) {
			function attachEventListener(oRow) {
				jQuery(oRow).on(BrowserEvent.mouseenter + sNamespace + " " + BrowserEvent.mouseleave + sNamespace, function(oEvent) {
					var iIndex = oExtension._getRowIndexFromEvent(oEvent);
					oExtension.onMouseHover(iIndex, oEvent.type === BrowserEvent.mouseenter);
				});

				jQuery(oRow).on(BrowserEvent.click + sNamespace + " " + BrowserEvent.dblclick + sNamespace, function(oEvent) {
					oExtension.dispatchGanttClick(oEvent);
				});

				jQuery(oRow).on(ContextMenuEvent, function(oEvent) {
					oExtension.onGanttChartContextMenu(oEvent);
				});

			}

			// bind click, dblclick, mouseenter, mouseleave and contextmenu to every row
			var aBackgroundRows = $ganttSvg.find("rect.sapGanttBackgroundSVGRow");
			var iLength = aBackgroundRows.length;
			for (var i = 0; i < iLength; i++) {
				attachEventListener(aBackgroundRows[i]);
			}
		},

		unbindBackgroundRowEvent: function($ganttSvg) {
			// bind click dblclick and hover to every row
			var aBackgroundRows = $ganttSvg.find("rect.sapGanttBackgroundSVGRow");
			var iLength = aBackgroundRows.length;
			for (var i = 0; i < iLength; i++) {
				jQuery(aBackgroundRows[i]).off(sNamespace);
			}
		}
	};

	/**
	 * For render/draw Now line ,vertical lines cursor lines
	 * Fire pointer events
	 *
	 * @extends sap.gantt.simple.GanttExtension
	 * @author SAP SE
	 * @version 1.74.0
	 * @constructor
	 * @private
	 * @alias sap.gantt.simple.GanttPointerExtension
	 */
	var GanttPointerExtension = GanttExtension.extend("sap.gantt.simple.GanttPointerExtension", /** @lends sap.gantt.simple.GanttPointerExtension.prototype */{
		/**
		 * @override
		 * @inheritDoc
		 * @returns {string} The name of this extension.
		 */
		_init: function(oGantt, mSettings) {
			// it's used to update gantt cursor line when mouse moving
			this._oCursorLineDrawer = new CursorLineDrawer();
			this.bPreventSingleClick = false;
			this.iTableAutoScrollTimerId = null;
			this._iStep = 0;

			return "PointerExtension";
		},

		/**
		 * @override
		 * @inheritDoc
		 */
		_attachEvents: function() {
			var oGantt = this.getGantt();
			GanttPointerHelper.addEventListeners(oGantt);
		},

		/**
		 * @override
		 * @inheritDoc
		 */
		_detachEvents: function() {
			var oGantt = this.getGantt();
			GanttPointerHelper.removeEventListeners(oGantt);
		},

		/**
		 * @override
		 * @inheritDoc
		 */
		destroy: function() {
			if (this._oCursorLineDrawer) {
				this._oCursorLineDrawer.destroy();
			}
			delete this.bPreventSingleClick;
		}
	});

	GanttPointerExtension.prototype.onGanttChartContextMenu = function(oEvent) {
		oEvent.preventDefault();
		if (oEvent.target === oEvent.currentTarget) {
			// target: The DOM element on the lefthand side of the call that triggered this event
			// currentTarget: The EventTarget whose EventListeners are currently being processed. As the event capturing and bubbling occurs this value changes
			var oGantt = this.getGantt();
			var iIndex = this._getRowIndexFromEvent(oEvent);
			var oRow = oGantt.getTable().getRows()[iIndex];

			oGantt.fireShapeContextMenu({
				row: oRow,
				pageX: oEvent.pageX,
				pageY: oEvent.pageY
			});
		}
	};

	GanttPointerExtension.prototype.onGanttChartMouseEvent = function(oEvent) {
		// show cursor line
		this.updateGanttCursorLine(oEvent);

		if (oEvent.type === BrowserEvent.mousedown) {
			this.oMousedownTargetElement = oEvent.target;
		}

		this.onMouseEnterLeaveEvent(oEvent);
	};

	// Handle mousemove and mouseup event on document for auto scroll
	GanttPointerExtension.prototype.onCrossSvgMouseEvent = function(oEvent) {
		var oGantt = this.getGantt();

		if (oEvent.type === BrowserEvent.mousemove) {

			if (this.needAutoscrollInContainerIfNecessary()) {
				this.updateCursorStyle("move");
				this.tableAutoScroll(oEvent);
			} else {
				var oDragExtension = oGantt._getDragDropExtension();
				var oConnectExtention = oGantt._getConnectExtension();
				var oResizer = oGantt._getResizeExtension();
				var oZoomExtention = oGantt._getZoomExtension();

				if ((oDragExtension.isDragging() || oResizer.isResizing() || oConnectExtention.isShapeConnecting()
					|| oZoomExtention.isTimeZooming())) {
					this.tableAutoScroll(oEvent);
				}
			}
		}

		if (oEvent.type === BrowserEvent.mouseup) {
			this.oMouseupTargetElement = oEvent.target;
			this._bAutoScroll = false;
		}
	};

	GanttPointerExtension.prototype.needAutoscrollInContainerIfNecessary = function() {
		var oGanttContainer = this.getGantt().getParent();
		if (oGanttContainer && oGanttContainer.getGanttCharts) {
			var aCharts = oGanttContainer.getGanttCharts();
			var oCurrentChart = this.getGantt();
			return aCharts.some(function(oChart){
				return oChart !== oCurrentChart && oChart._getDragDropExtension().isDragging();
			});
		}
		return false;
	};

	GanttPointerExtension.prototype.updateCursorStyle = function(sStyle) {
		document.body.style.cursor = sStyle;
		this.getDomRefs().ganttSvg.style.cursor = sStyle;
	};

	GanttPointerExtension.prototype.isPointerInGanttChart = function(oEvent) {
		return this._bMouseOnSvg;
	};

	GanttPointerExtension.prototype.onMouseEnterLeaveEvent = function(oEvent) {
		this.updateCursorStyle("default");
		if (oEvent.type === BrowserEvent.mouseenter) {
			this._bMouseOnSvg = true;
		} else if (oEvent.type === BrowserEvent.mouseleave) {
			this._bMouseOnSvg = false;
		}
	};

	GanttPointerExtension.prototype.dispatchGanttClick = function(oEvent) {
		// only fire click/dblclick if and only if on gantt row rectangle
		if (this.isEventTargetOnGanttRow(oEvent) === false) { return; }
		if (oEvent.type === BrowserEvent.click) {
			if (this.oMousedownTargetElement === this.oMouseupTargetElement) {
				// only if mousedown and mouseup on the same element, should fire click
				this.onGanttSingleClick(oEvent);
				delete this.oMouseupTargetElement;
				delete this.oMousedownTargetElement;
			}
		} else if (oEvent.type === BrowserEvent.dblclick) {
			this.onGanttDoubleClick(oEvent);
		}
	};

	GanttPointerExtension.prototype.isEventTargetOnGanttRow = function(oEvent) {
		return jQuery(oEvent.target).hasClass("sapGanttBackgroundSVGRow");
	};

	GanttPointerExtension.prototype._getRowIndexFromEvent = function (oEvent) {
		return parseInt(oEvent.target.getAttribute("data-sap-ui-index"), 10);
	};

	GanttPointerExtension.prototype._getRowIndexFromElement = function (oElem) {
		return parseInt(oElem.getAttribute("data-sap-ui-index"), 10);
	};

	GanttPointerExtension.prototype.onGanttSingleClick = function(oEvent) {
		// update shape selection whenever empty area on Gantt chart is clicked
		this.getGantt().getSelection().update(null, {
			selected: false,
			ctrl: oEvent.ctrlKey || oEvent.metaKey
		});

		var oGantt = this.getGantt();
		// handle click event on svg, ensure row selection enabled
		var iIndex = this._getRowIndexFromEvent(oEvent);
		var oRow = oGantt.getTable().getRows()[iIndex];
		if (!oRow) { return; }

		var fnClickEvent = function () {
			if (this.bPreventSingleClick === false) {
				this._selectTableRow(oGantt, iIndex);
				oGantt.fireShapePress({
					shape: null, // explicitly set shape to null because event doesn't triggered on shapes
					row: oRow
				});
			}
			this.bPreventSingleClick = false;
		}.bind(this);

		if (oGantt.getDisableShapeDoubleClickEvent()) {
			this.bPreventSingleClick = false;
			fnClickEvent();
			return;
		}
		this.iSingleClickTimer = jQuery.sap.delayedCall(300, this, fnClickEvent);
	};

	GanttPointerExtension.prototype.onGanttDoubleClick = function(oEvent) {
		var oGantt = this.getGantt(),
			bIsDisabledDoubleClick = oGantt.getDisableShapeDoubleClickEvent(),
			iIndex, oRow;

		if (!bIsDisabledDoubleClick) {
			jQuery.sap.clearDelayedCall(this.iSingleClickTimer);
			this.bPreventSingleClick = true;
		}
		iIndex = this._getRowIndexFromEvent(oEvent);
		oRow = oGantt.getTable().getRows()[iIndex];

		this._selectTableRow(oGantt, iIndex);

		if (!bIsDisabledDoubleClick) {
			oGantt.fireShapeDoubleClick({
				shape: null, // explicitly set shape to null because event doesn't triggered on shapes
				row: oRow
			});
		}
	};

	GanttPointerExtension.prototype._selectTableRow = function(oGantt, iIndex) {
		var sTableRowSelectionBehavior = this.getGantt().getTable().getSelectionBehavior();
		var SelectionBehavior = sap.ui.table.SelectionBehavior;
		if (SelectionBehavior.Row === sTableRowSelectionBehavior || SelectionBehavior.RowOnly === sTableRowSelectionBehavior) {
			// Rows can be selected on the complete row.
			oGantt.getSyncedControl().syncRowSelection(iIndex);
		}
	};

	GanttPointerExtension.prototype.onMouseHover = function(iIndex, bHover) {
		this.getGantt().getSyncedControl().syncRowHover(iIndex, bHover);
	};

	GanttPointerExtension.prototype._getAutoScrollStep = function() {
		if (this._bAutoScroll) {
			return this._iStep;
		}
		return 0;
	};

	GanttPointerExtension.prototype.updateGanttCursorLine = function(oEvent) {
		if (this.getGantt().getEnableCursorLine() === false) { return; }
		if (oEvent.type === BrowserEvent.mousemove) {
			var oSvgPoint = CoordinateUtils.getEventSVGPoint(this.getDomRefs().ganttSvg, oEvent);
			this._toggleCursorLine(true, oSvgPoint);
		} else if (oEvent.type === BrowserEvent.mouseleave) {
			this._toggleCursorLine(false);
		}
	};

	GanttPointerExtension.prototype._toggleCursorLine = function(bShow, oPosition) {
		var mDom = this._getCursorLineDOMs();
		if (bShow) {
			// draw cursorLine. select svgs of all chart instances to impl synchronized cursorLine
			this._oCursorLineDrawer.drawSvg(mDom.allGanttSvg, mDom.allHeaderSvg, this.getGantt().getLocale(), oPosition);
		} else {
			this._oCursorLineDrawer.destroySvg(mDom.allGanttSvg, mDom.allHeaderSvg);
		}
	};

	GanttPointerExtension.prototype._getCursorLineDOMs = function() {
		return {
			// add parent className to prevent sap-ui-perserve selection
			allHeaderSvg: d3.selectAll(".sapGanttChartWithSingleTable .sapGanttChartHeaderSvg"),
			allGanttSvg : d3.selectAll(".sapGanttChartWithSingleTable .sapGanttChartSvg")
		};
	};

	GanttPointerExtension.prototype.tableAutoScroll = function(oEvent) {
		this._bAutoScroll = false;

		if (this.ifAutoScrollToRight()) {
			// in non-rtl mode, pointer is at the right edge of the gantt column
			jQuery.sap.delayedCall(iDelayInMillis, this, function(){
				GanttPointerHelper.doGanttAutoScroll(this.getGantt(), Direction.Forward, oEvent);
			});
		} else if (this.ifAutoScrollToLeft()) {
			// in non-rtl mode, pointer is at the left edge of the gantt column
			// scroll backward because bRtl is false
			jQuery.sap.delayedCall(iDelayInMillis, this, function(){
				GanttPointerHelper.doGanttAutoScroll(this.getGantt(), Direction.Backward, oEvent);
			});
		} else if (this.ifAutoScrollToDown()) {
			// Scroll down
			jQuery.sap.delayedCall(iDelayInMillis, this, function(){
				GanttPointerHelper.doGanttAutoScroll(this.getGantt(), Direction.Bottom, oEvent);
			});
		} else if (this.ifAutoScrollToUp()) {
			// Scroll up
			jQuery.sap.delayedCall(iDelayInMillis, this, function(){
				GanttPointerHelper.doGanttAutoScroll(this.getGantt(), Direction.Top, oEvent);
			});
		} else {
			this._bAutoScroll = false;
		}

	};

	GanttPointerExtension.prototype.ifAutoScrollToRight = function () {
		var oAutoScrollPosition = this.getAutoScrollPosition();
		this._bAutoScroll = oAutoScrollPosition.iLocationX > oAutoScrollPosition.oScrollAreaRect.left +
			oAutoScrollPosition.iScrollAreaWidth - oAutoScrollPosition.iScrollTriggerAreaWidth &&
			oAutoScrollPosition.iLocationX < oAutoScrollPosition.oScrollAreaRect.left + oAutoScrollPosition.iScrollAreaWidth &&
			oAutoScrollPosition.iScrollAreaScrollLeft + oAutoScrollPosition.iScrollAreaWidth < oAutoScrollPosition.oScrollArea.scrollWidth;
		return this._bAutoScroll;
	};

	GanttPointerExtension.prototype.ifAutoScrollToLeft = function () {
		var oAutoScrollPosition = this.getAutoScrollPosition();
		this._bAutoScroll = oAutoScrollPosition.iLocationX <
			oAutoScrollPosition.oScrollAreaRect.left + oAutoScrollPosition.iScrollTriggerAreaWidth &&
			oAutoScrollPosition.iLocationX > oAutoScrollPosition.oScrollAreaRect.left &&
			oAutoScrollPosition.iScrollAreaScrollLeft > 0;
		return this._bAutoScroll;
	};

	GanttPointerExtension.prototype.ifAutoScrollToDown = function () {
		var oAutoScrollPosition = this.getAutoScrollPosition();
		this._bAutoScroll = oAutoScrollPosition.iLocationY > oAutoScrollPosition.oVisibleScrollAreaRect.top +
			oAutoScrollPosition.iVisibleScrollAreaHeight - oAutoScrollPosition.iScrollTriggerAreaHeight &&
			oAutoScrollPosition.iLocationY < oAutoScrollPosition.oVisibleScrollAreaRect.top +
			oAutoScrollPosition.iVisibleScrollAreaHeight &&
			oAutoScrollPosition.iScrollAreaScrollTop + oAutoScrollPosition.iScrollAreaHeight -
			oAutoScrollPosition.iBaseRowHeight <= oAutoScrollPosition.iScrollHeight;
		return this._bAutoScroll;
	};

	GanttPointerExtension.prototype.ifAutoScrollToUp = function () {
		var oAutoScrollPosition = this.getAutoScrollPosition();
		this._bAutoScroll = oAutoScrollPosition.iLocationY < oAutoScrollPosition.oVisibleScrollAreaRect.top +
			oAutoScrollPosition.iScrollTriggerAreaHeight &&
			oAutoScrollPosition.iLocationY > oAutoScrollPosition.oVisibleScrollAreaRect.top;
		return this._bAutoScroll;
	};

	GanttPointerExtension.prototype.getAutoScrollPosition = function() {
		var bRtl = Core.getConfiguration().getRTL();
		var oTable = this.getGantt().getTable();
		var iCurrentScrollTriggerAreaWidth = 10,
			iCurrentScrollTriggerAreaHeight = 10,
			oCurrentScrollArea = document.getElementById(this.getGantt().getId() + "-gantt"),
			$ScrollArea = jQuery(oCurrentScrollArea),
			oCurrentScrollAreaRect = oCurrentScrollArea.getBoundingClientRect(),
			iCurrentScrollAreaWidth = $ScrollArea.outerWidth(),
			iCurrentScrollAreaHeight = $ScrollArea.outerHeight(),
			oCurrentVisibleScrollAreaRect = oCurrentScrollAreaRect,
			iCurrentVisibleScrollAreaHeight = iCurrentScrollAreaHeight,
			iCurrentBaseRowHeight = this.getGantt()._oExpandModel.getBaseRowHeight(),
			iCurrentScrollAreaScrollLeft = bRtl ? $ScrollArea.scrollLeftRTL() : $ScrollArea.scrollLeft();

		var $TableVSB = jQuery(oTable.getDomRef(sap.ui.table.SharedDomRef.VerticalScrollBar)),
			iCurrentScrollAreaScrollTop = $TableVSB.scrollTop(),
			iCurrentScrollHeight = $TableVSB.get(0).scrollHeight;

		var iCursorLocationX = CoordinateUtils.getLatestCursorPosition().pageX,
			iCursorLocationY = CoordinateUtils.getLatestCursorPosition().pageY;

		return {
			iLocationX: iCursorLocationX,
			iLocationY: iCursorLocationY,
			oScrollAreaRect: oCurrentScrollAreaRect,
			oScrollArea: oCurrentScrollArea,
			iScrollAreaWidth: iCurrentScrollAreaWidth,
			iScrollTriggerAreaWidth: iCurrentScrollTriggerAreaWidth,
			iScrollTriggerAreaHeight: iCurrentScrollTriggerAreaHeight,
			iScrollAreaScrollLeft: iCurrentScrollAreaScrollLeft,
			oVisibleScrollAreaRect: oCurrentVisibleScrollAreaRect,
			iVisibleScrollAreaHeight: iCurrentVisibleScrollAreaHeight,
			iScrollAreaScrollTop: iCurrentScrollAreaScrollTop,
			iBaseRowHeight: iCurrentBaseRowHeight,
			iScrollHeight: iCurrentScrollHeight,
			iScrollAreaHeight: iCurrentScrollAreaHeight
		};
	};

	GanttPointerExtension.prototype.allowAutoScroll = function() {
		return this.ifAutoScrollToRight() || this.ifAutoScrollToLeft() || this.ifAutoScrollToDown() || this.ifAutoScrollToUp();

	};

	return GanttPointerExtension;
});
