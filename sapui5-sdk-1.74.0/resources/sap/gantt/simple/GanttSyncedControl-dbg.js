/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

// Provides control sap.gantt.simple.GanttSyncedControl.
sap.ui.define([
	"sap/ui/core/Control", "sap/ui/Device", "sap/ui/core/Core", "./GanttUtils"
], function(Control, Device, Core, GanttUtils) {
	"use strict";

	var GanttSyncedControl = Control.extend("sap.gantt.simple.GanttSyncedControl", /** @lends sap.gantt.simple.GanttSyncedControl.prototype */ {
		metadata: {
			library: "sap.gantt",
			properties: {
				innerWidth: {type: "sap.ui.core.CSSSize", group: "Dimension", defaultValue: "100%"}
			}
		},
		renderer: function(oRm, oControl) {
			// parent chain -> Splitter -> GanttChartWithTable
			var oGantt = oControl.getParent().getParent();

			oRm.write("<div class='sapGanttBackground'");
			oRm.writeControlData(oControl);
			oRm.write(">");

			oRm.write("<div class='sapGanttBackgroundFlexContainer'>");
			oRm.write("<div class='sapGanttBackgroundContainer sapGanttBackgroundScrollbar'>");

			// Table container
			oRm.write("<div");
			oRm.addClass("sapGanttBackgroundTable");
			oRm.writeClasses();
			oRm.write(">");

			// Gantt Chart Header
			oControl.renderGanttHeaderPlaceholder(oRm, oGantt);

			// Body SVG
			oControl.renderGanttBodyPlaceholder(oRm, oGantt);

			// render the HSB container, the actual HSB will be rendered in onAfterRendering
			oControl.renderHorizontalScrollbarContainer(oRm);

			oRm.write("</div>"); // Close table container

			oRm.write("</div>"); // Close gantt background container

			// Vertical scrollbar container
			oControl.renderVerticalScrollbarContainer(oRm, oControl);

			oRm.write("</div>"); // Close flex container
			oRm.write("</div>"); // Close root node
		}
	});

	GanttSyncedControl.prototype.init = function() {
		this.oSyncInterface = null;
		this.state = {
			rows: [], /* row:{height:int, selected:boolean, hovered:boolean} */
			innerVerticalScrollPosition: 0,
			horizontalScrollPosition: 0,
			layout: {
				top: 0,
				headerHeight: 0,
				contentHeight: 0
			}
		};
		this._bRowsHeightChanged = false;
		this._bAllowContentScroll = true;
	};

	GanttSyncedControl.prototype.onAfterRendering = function() {
		var mDom = this.getDomRefs();

		var oGantt = this.getParent().getParent();

		if (this.oSyncInterface) {
			var oRm = Core.createRenderManager();
			this.oSyncInterface.renderHorizontalScrollbar(oRm, oGantt.getId() + "-hsb", oGantt.getContentWidth());
			oRm.flush(mDom.hsbContainer);
		}

		if (this.oSyncInterface && mDom.content && mDom.vsbContainerContent) {
			this.oSyncInterface.registerVerticalScrolling({
				wheelAreas: [mDom.content],
				touchAreas: [mDom.content]
			});

			this.oSyncInterface.placeVerticalScrollbarAt(mDom.vsbContainerContent);
		}

		this.updateScrollPositions();
	};

	GanttSyncedControl.prototype.renderGanttHeaderPlaceholder = function(oRm, oGantt) {
		// Gantt Chart Header
		oRm.write("<div");
		oRm.writeAttribute("data-sap-ui-related", oGantt.getId());
		oRm.addClass("sapGanttChartWithTableHeader");
		oRm.writeClasses();
		oRm.write(">");
		oRm.write("</div>");
	};

	GanttSyncedControl.prototype.renderGanttBodyPlaceholder = function(oRm, oGantt) {
		// Content
		oRm.write("<div class='sapGanttBackgroundTableContent' style='height:" + this.state.layout.contentHeight + "px'>");

		oRm.write("<div");
		oRm.writeAttribute("id", oGantt.getId() + "-gantt");
		oRm.writeAttribute("data-sap-ui-related", oGantt.getId());
		oRm.addClass("sapGanttChartContentBody");
		oRm.addClass("sapGanttBackgroundSVG");
		oRm.writeClasses();
		oRm.write(">");

		this.renderSvgDefs(oRm, oGantt);
		this.renderGanttChartCnt(oRm, oGantt);

		oRm.write("</div>");

		oRm.write("</div>");
	};

	/**
	 * Vertical scroll container is a DIV placeholder, after rendering, Table/TreeTable will place the actual scroll bar here.
	 *
	 * @param {sap.ui.core.RenderManager} oRm Render manager
	 * @param {sap.gantt.simple.GanttSyncedControl} oControl the slave synced control
	 */
	GanttSyncedControl.prototype.renderVerticalScrollbarContainer = function(oRm, oControl) {
		oRm.write("<div class='sapGanttBackgroundVScrollContainer'>");
		oRm.write("<div class='sapGanttBackgroundVScrollContentArea' style='margin-top:" + (oControl.state.layout.top + oControl.state.layout.headerHeight) + "px'></div>");
		oRm.write("</div>");
	};

	GanttSyncedControl.prototype.syncWith = function(oTable) {
		var that = this;

		var oExpandModel = oTable.getParent()._oExpandModel;

		oTable._enableSynchronization().then(function(oSyncInterface) {

			that.oSyncInterface = oSyncInterface;

			oSyncInterface.rowCount = function(iCount) {
				var iOldCount = that.state.rows.length;
				var i;

				if (iOldCount < iCount) {
					for (i = 0; i < iCount - iOldCount; i++) {
						that.state.rows.push({
							height: 0,
							selected: false,
							hovered: false
						});
					}
				} else if (iOldCount > iCount) {
					for (i = iOldCount - 1; i >= iCount; i--) {
						that.state.rows.pop();
					}
				}
			};

			oSyncInterface.rowSelection = function(iIndex, bSelected) {
				if (that.state.rows[iIndex]) {
					that.state.rows[iIndex].selected = bSelected;
					GanttUtils.updateGanttRows(that, that.state.rows, iIndex);
				}
			};

			oSyncInterface.rowHover = function(iIndex, bHovered) {
				if (that.state.rows[iIndex]) {
					that.state.rows[iIndex].hovered = bHovered;
					GanttUtils.updateGanttRows(that, that.state.rows, iIndex);
				}
			};

			oSyncInterface.rowHeights = function(aHeights) {
				for (var i = 0; i <= aHeights.length - 1; i++) {
					aHeights[i] = oExpandModel.getRowHeightByIndex(oTable, i, aHeights[i]);
				}

				that.setRowsHeightChanged(false);
				aHeights.forEach(function(iHeight, iIndex) {
					if (!this.state.rows[iIndex]) {
						this.state.rows[iIndex] = {};
					}
					if (this.state.rows[iIndex].height !== iHeight) {
						that.setRowsHeightChanged(true);
					}
					this.state.rows[iIndex].height = iHeight;
				}.bind(that));

				return aHeights;
			};

			oSyncInterface.innerVerticalScrollPosition = function(iScrollPosition) {
				that.state.innerVerticalScrollPosition = iScrollPosition;
				that.updateScrollPositions();
			};

			oSyncInterface.layout = function(mLayoutData) {
				that.state.layout = mLayoutData;
				that.updateLayout();
			};

			that.invalidate();
		});
	};

	GanttSyncedControl.prototype.renderHorizontalScrollbarContainer = function(oRm) {
		oRm.write("<div class='sapGanttHSBContainer'>");
		oRm.write("</div>");
	};

	GanttSyncedControl.prototype.renderSvgDefs = function (oRm, oGantt) {
		var oSvgDefs = oGantt.getSvgDefs();
		if (oSvgDefs) {
			oRm.write("<svg");
			oRm.writeAttribute("id", oGantt.getId() + "-svg-psdef");
			oRm.writeAttribute("aria-hidden", "true");
			oRm.addStyle("float", "left");
			oRm.addStyle("width", "0px");
			oRm.addStyle("height", "0px");
			oRm.writeStyles();
			oRm.write(">");
			oRm.write(oSvgDefs.getDefString());
			oRm.write("</svg>");
		}
	};

	GanttSyncedControl.prototype.renderGanttChartCnt = function (oRm, oGantt) {
		oRm.write("<div id='" + oGantt.getId() + "-cnt'");
		oRm.addClass("sapGanttChartCnt");
		oRm.writeClasses();
		oRm.addStyle("height", "100%");
		oRm.addStyle("width", "100%");
		oRm.write(">");
		oRm.write("</div>");
	};

	GanttSyncedControl.prototype.setInnerWidth = function(sWidth) {
		this.setProperty("innerWidth", sWidth, true);
		this._toggleHSBVisibility(sWidth);
		return this;
	};

	GanttSyncedControl.prototype._toggleHSBVisibility = function(sWidth) {
		var mDom = this.getDomRefs();
		if (mDom.hsb == null || mDom.hsbContent == null) {
			return;
		}
		var bShowScrollbar = parseFloat(sWidth) > jQuery(mDom.contentContainer).width();
		if (bShowScrollbar) {
			// set height to null to prevent inheriting 100% height, which cause hsb is invisible
			mDom.hsbContent.style.height = null;
			mDom.hsbContent.style.width = sWidth;
		} else {
			// remove the style attribute
			mDom.hsbContent.style.cssText = null;
			if (Device.browser.msie) {
				mDom.hsbContent.style.width = 0;
			}
		}
	};

	GanttSyncedControl.prototype.addEventListeners = function() {
		this.addScrollEventListeners();
	};

	GanttSyncedControl.prototype.addScrollEventListeners = function() {
		var that = this;

		this.oHSb.addEventListener("scroll", function(oEvent) {
			that.state.horizontalScrollPosition = oEvent.target.scrollLeft;
		});
	};

	GanttSyncedControl.prototype.updateLayout = function() {
		var mDom = this.getDomRefs();
		if (mDom) {

			mDom.header.style.height = (this.state.layout.top + this.state.layout.headerHeight) + "px";
			mDom.contentContainer.style.height = this.state.layout.contentHeight + "px";
			mDom.vsbContainerContent.style.marginTop = (this.state.layout.top + this.state.layout.headerHeight) + "px";
		}
	};

	GanttSyncedControl.prototype.updateScrollPositions = function() {
		var mDom = this.getDomRefs();
		if (mDom && this._bAllowContentScroll) {
			mDom.content.scrollTop = this.state.innerVerticalScrollPosition;
			if (mDom.content.scrollTop !== this.state.innerVerticalScrollPosition) {
				this._bAllowContentScroll = false;
			}
		}
	};

	GanttSyncedControl.prototype.setAllowContentScroll = function(bAllowed) {
		this._bAllowContentScroll = bAllowed;
	};

	GanttSyncedControl.prototype.setRowsHeightChanged = function(bRowsHeightChanged) {
		this._bRowsHeightChanged = bRowsHeightChanged;
	};

	GanttSyncedControl.prototype.getRowsHeightChanged = function(bRowsHeightChanged) {
		return this._bRowsHeightChanged;
	};

	GanttSyncedControl.prototype.scrollContentIfNecessary = function() {
		if (this._bAllowContentScroll === false) {
			this._bAllowContentScroll = true;
			this.updateScrollPositions();
		}
	};

	GanttSyncedControl.prototype.getDomRefs = function() {
		var oDomRef = this.getDomRef();
		if (!oDomRef) {
			return null;
		}

		var oHeader = oDomRef.querySelector(".sapGanttChartWithTableHeader"),
			oContentContainer = oDomRef.querySelector(".sapGanttBackgroundTableContent"),
			oContent = oContentContainer.querySelector(".sapGanttChartContentBody");

		var oVSbContainer = oDomRef.querySelector(".sapGanttBackgroundVScrollContainer"),
			oVSbContainerContent = oVSbContainer.querySelector(".sapGanttBackgroundVScrollContentArea");

		var oHSBContainer = oDomRef.querySelector(".sapGanttHSBContainer");

		var oHsb = oDomRef.querySelector(".sapUiTableHSbExternal"),
			oHsbContent = oDomRef.querySelector(".sapUiTableHSbContent");

		return {
			header              : oHeader,
			contentContainer    : oContentContainer,
			content             : oContent,
			vsbContainer        : oVSbContainer,
			vsbContainerContent : oVSbContainerContent,

			hsbContainer        : oHSBContainer,

			hsb                 : oHsb,
			hsbContent          : oHsbContent
		};
	};

	GanttSyncedControl.prototype.getRowStates = function() {
		return this.state.rows;
	};

	GanttSyncedControl.prototype.getRowHeights = function() {
		return this.state.rows.map(function(row){
			return row.height;
		});
	};

	GanttSyncedControl.prototype.syncRowSelection = function (iIndex) {
		if (iIndex > -1) {
			var bSelected = !this.state.rows[iIndex].selected;
			this.oSyncInterface.syncRowSelection(iIndex, bSelected);
		}
	};

	GanttSyncedControl.prototype.syncRowHover = function (iIndex, bHover) {
		if (iIndex > -1) {
			this.oSyncInterface.syncRowHover(iIndex, bHover);
		}
	};

	return GanttSyncedControl;
});
