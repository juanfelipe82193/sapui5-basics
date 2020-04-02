/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/Core",
	"sap/ui/core/Control",
	"sap/ui/table/library",
	"./GanttExtension",
	"./InnerGanttChartRenderer"
], function (
		jQuery,
		Core,
		Control,
		tableLibrary,
		GanttExtension
) {
	"use strict";

	/**
	 * Inner Gantt Chart, the purpose for this class is to decouple the rendering cycle with Table in GanttChartWithTable.
	 * Use it in application is prohibited and not supported.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSetting] Initial settings for the new control
	 *
	 * @class
	 * Inner Gantt Chart is responsible for rendering the content of gantt chart
	 *
	 * @extend sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 *
	 * @constructor
	 * @private
	 * @alias sap.gantt.simple.InnerGanttChart
	 */
	var InnerGanttChart = Control.extend("sap.gantt.simple.InnerGanttChart", {
		metadata: {
			events: {
				/**
				 * Fired when gantt gets rendered.
				 */
				ganttReady: {
					parameters: {
						/**
						 * True if there are visible rendered shapes.
						 */
						hasRenderedShapes: {type: "boolean"},
						/**
						 * The total count of rendered shapes.
						 */
						totalRenderedShapes: {type: "int"}
					}
				}
			}
		}
	});

	InnerGanttChart.prototype.getDomRef = function(sSuffix) {
		var oParent = this.getParent(),
			sDomSuffix;
		if (sSuffix) {
			sDomSuffix = "-" + sSuffix;
		} else {
			sDomSuffix = "-cnt";
		}
		if (oParent) {
			return window.document.getElementById(oParent.getId() + sDomSuffix);
		}
		return null;
	};

	InnerGanttChart.prototype.invalidate = function(){
		// do nothing
		this.getUIArea().addInvalidatedControl(this);
	};

	InnerGanttChart.prototype.hasRenderedShapes = function () {
		return this.$("svg").find(".sapGanttChartShapes").children().size() > 0;
	};

	InnerGanttChart.prototype.getTotalRenderedShapes = function () {
		return this.$("svg").find(".sapGanttChartShapes").children().size();
	};

	InnerGanttChart.prototype.resolveWhenReady = function (bWithShapes) {
		return new Promise(function (resolve) {
			var fnHandleEvent = function handleEvent (oEvent) {
				if (bWithShapes && !oEvent.getParameter("hasRenderedShapes") || ( // in Auto mode table might sync prematurely with header rows only
					this.getParent().getTable().getVisibleRowCountMode() === tableLibrary.VisibleRowCountMode.Auto &&
					this.getParent().getSyncedControl().getRowStates().length < this.getParent().getTable().getBinding("rows").getLength()
				)) {
					this.attachEventOnce("ganttReady", fnHandleEvent);
				} else {
					resolve();
				}
			}.bind(this);

			if (Object.keys(this.getUIArea().mInvalidatedControls).indexOf(this.getParent().getId()) > -1) {
				// Gantt is currently invalidated
				this.attachEventOnce("ganttReady", fnHandleEvent);
			} else if ((!bWithShapes && this.getDomRef("svg")) || (bWithShapes && this.hasRenderedShapes())) {
				resolve();
			} else {
				this.attachEventOnce("ganttReady", fnHandleEvent);
			}
		}.bind(this));
	};

	InnerGanttChart.prototype._updateRowsHoverState = function() {
		var oGantt = this.getParent();

		// update hover on rows that were just rerendered and their event handlers would not catch latest mouseleave event
		// setTimeout is used because otherwise :hover returns zero elements
		setTimeout(function() {
			oGantt.$("svg").find("rect.sapGanttBackgroundSVGRow:hover").each(function() {
				var oExtension = oGantt._getPointerExtension(),
					iIndex = oExtension._getRowIndexFromElement(this);

				oGantt.getSyncedControl().syncRowHover(iIndex, true);
			});
			oGantt.$("svg").find("rect.sapGanttBackgroundSVGRow:not(:hover)").each(function() {
				var oExtension = oGantt._getPointerExtension(),
					iIndex = oExtension._getRowIndexFromElement(this);

				oGantt.getSyncedControl().syncRowHover(iIndex, false);
			});
		}, 0);
	};

	InnerGanttChart.prototype.onBeforeRendering = function (oEvent) {
		if (!this.getParent()._bPreventInitialRender) {
			// Visible Horizon Change --> Redraw -> Update scroll width -> Render all shapes -> Scroll Gantt
			this.getParent().jumpToVisibleHorizon("initialRender");
		}
	};

	InnerGanttChart.prototype.onAfterRendering = function (oEvent) {
		var oGantt = this.getParent();
		var oGanttParent = oGantt.getParent();

		if (oGanttParent && oGanttParent.isA("sap.gantt.simple.GanttChartContainer") && oGanttParent.getGanttCharts().length > 1) {
			oGantt.fireEvent("_initialRenderGanttChartsSync", {
				reasonCode: "initialRender", visibleHorizon: oGantt.getAxisTimeStrategy().getVisibleHorizon(), visibleWidth: oGantt.getVisibleWidth()
			});
		}

		var oRm = Core.createRenderManager();
		this.getRenderer().renderRelationships(oRm, oGantt);
		oRm.destroy();

		// Update shape selections from SelectionModel
		oGantt._updateShapeSelections(oGantt.getSelectedShapeUid(), []);

		// update shape connect effect when vertical scroll
		oGantt._getConnectExtension().updateShapeConnectEffect(oGantt);

		this._updateRowsHoverState();
		GanttExtension.attachEvents(oGantt);

		this.fireGanttReady({
			hasRenderedShapes: this.hasRenderedShapes(),
			totalRenderedShapes: this.getTotalRenderedShapes()
		});
	};

	return InnerGanttChart;

}, true);
