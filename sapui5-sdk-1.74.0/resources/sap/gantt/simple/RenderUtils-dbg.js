/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

 // Provides helper sap.gantt.simple.GanttUtils
sap.ui.define([
	"./BaseText",
	"./AggregationUtils",
	"./GanttUtils"
], function (BaseText, AggregationUtils, GanttUtils) {
	"use strict";

	var RenderUtils = {

		// Define the render buffer to improve the overall horizontal scrolling performance
		RENDER_EXTEND_FACTOR: 0.382,

		getGanttRenderWidth: function(oGantt) {
			var iVisibleWidth = jQuery.sap.byId(oGantt.getId() + "-gantt").width();
			return iVisibleWidth * (1 + 2 * RenderUtils.RENDER_EXTEND_FACTOR);
		},

		renderAttributes : function(oRm, oElement, aAttribute) {
			var aPropertiesa = aAttribute.map(function(prop){
				var sPropertyGetter = prop.split("-").reduce(function(prefix, name) {
					return prefix + name.charAt(0).toUpperCase() + name.slice(1);
				}, "get");
				return {
					name: prop,
					value: oElement[sPropertyGetter]()
				};
			});

			aPropertiesa.forEach(function(oAttr) {
				if (oAttr.value || oAttr.value === 0) {
					oRm.writeAttribute(oAttr.name, oAttr.value);
				}
			});
		},

		renderTooltip: function(oRm, oElement) {
			if (oElement.getTooltip()) {
				oRm.write("<title>");
				oRm.write(oElement.getTooltip());
				oRm.write("</title>");
			}
		},

		/**
		 * Shape selection model is the single truth on shape selection, due to selection change event
		 * won't rerender all shapes, so here it requires to reset selected property value based on selection model
		 *
		 * @param {sap.gantt.simple.GanttChartWithTable} oGantt Gantt chart instance
		 * @param {array} aSelectedShapeUid array of selected shape UIDs
		 * @param {array} aDeselectedShapeUid array of deselected shape UIDs
		 *
		 * @private
		 */
		updateShapeSelections: function(oGantt, aSelectedShapeUid, aDeselectedShapeUid) {
			if (oGantt._getResizeExtension == null) {
				// Gantt Extensions only availble after GanttChart fully rendered. If the extension is not there
				// means the control haven't been rendered yet, thus skip update the selection outline
				return;
			}
			var oResizeExtension = oGantt._getResizeExtension();
			var sContainer = oGantt.getId();
			var aDeselectedShape = GanttUtils.getShapesWithUid(sContainer, aDeselectedShapeUid);
			aDeselectedShape.forEach(function(oElement) {
				if (oElement) {
					if (oElement.isA("sap.gantt.simple.shapes.Shape")) {
						oElement.setSelected(false);
					} else {
						oElement.setProperty("selected", false, true);
					}
				}
			});

			oResizeExtension.clearAllOutline(sContainer);

			var aElement = GanttUtils.getShapesWithUid(sContainer, aSelectedShapeUid);
			aElement.forEach(function(oElement) {
				if (oElement) {
					if (oElement.isA("sap.gantt.simple.shapes.Shape")) {
						oElement.setSelected(true);
					} else {
						// it's possible that the shape element is scrolling outside of visible area
						oElement.setProperty("selected", true, true);
						oResizeExtension.toggleOutline(oElement);
					}
					oGantt.getSelection().updateTime(oElement.getShapeUid(), {
						time: oElement.getTime(),
						endTime: oElement.getEndTime()
					});
				}
			});
		},

		/**
		 * Render the <text> SVG element for shapes which has title and showTitle properties
		 *
		 * If the shape is a Chevron, then need to consider it's headWith and tailWidth
		 *
		 * @param {sap.ui.core.RenderManager} oRm Render Manager
		 * @param {sap.gantt.simple.BaseShape} oElement shape instance
		 */
		renderElementTitle : function(oRm, oElement) {
			if (oElement.getShowTitle == null || !oElement.getShowTitle()) { return; }

			var sTitle = oElement.getTitle();
			if (sTitle) {
				var iHead = 0, iEllipseWidth = 0;

				if (oElement.getWidth) {
					iEllipseWidth = oElement.getWidth();
				}

				if (oElement.getHeadWidth) {
					iHead = oElement.getHeadWidth();
					iEllipseWidth -= iHead;
				}

				if (oElement.getTailWidth) {
					iEllipseWidth -= oElement.getTailWidth();
				}

				var iLeftPaddingPixel = 2 + iHead,
					iDefaultFontSize  = 12;

				var mTextSettings = {
					x: oElement.getX() + iLeftPaddingPixel,
					y: oElement.getRowYCenter() + iDefaultFontSize / 2,
					text: sTitle,
					fill: "#000",
					showEllipsis: true,
					truncateWidth: iEllipseWidth
				};

				var oTitle = new BaseText(mTextSettings).addStyleClass("sapGanttTextNoPointerEvents");
				oTitle.setProperty("childElement", true, true);
				oTitle.renderElement(oRm, oTitle);
			}
		},

		renderInlineShapes : function(oRm, oRowSetting, oGantt) {
			var sTopRowClassName = oRowSetting.getId() + "-top";
			var sRowClassName = oRowSetting.getId() + "-row";

			oRm.write("<g");
			oRm.writeElementData(oRowSetting);
			oRm.addClass(sTopRowClassName);
			oRm.writeClasses();
			oRm.write(">");
				oRm.write("<g");
				// set default rowId to empty string to prevent assertion failure
				oRm.writeAttribute(GanttUtils.ROW_ID_DATASET_KEY, oRowSetting.getRowId() || "");
				oRm.addClass(sRowClassName);
				oRm.writeClasses();
				oRm.write(">");

				this.renderMainRowAllShapes(oRm, oRowSetting, oGantt);

				oRm.write("</g>");
			oRm.write("</g>");
		},

		renderMainRowAllShapes: function(oRm, oRowSetting, oGantt){
			var aRowStates = oGantt.getSyncedControl().getRowStates();
			var mPosition = this.calcRowDomPosition(oRowSetting, aRowStates),
				iMainRowYCenter = mPosition.rowYCenter,
				iRowHeight = mPosition.rowHeight;

			var mAggregations = AggregationUtils.getNonLazyAggregations(oRowSetting);
			var aShapesInRow = Object.keys(mAggregations).filter(function(sName){
				// skip calendars due to special rendering order
				return sName !== "calendars" && sName !== "relationships";
			}).map(function(sName){ // eslint-disable-line
				// get all binding aggregation instances and default to empty array
				return oRowSetting.getAggregation(sName) || [];
			}.bind(oRowSetting));

			var sRowUid = oRowSetting.getRowUid(),
				oSelectionModel = oGantt.oSelection,
				oExpandModel    = oGantt._oExpandModel,
				oAxisTime       = oGantt.getAxisTime(),
				bHasExpandShape = oExpandModel.isRowExpanded(sRowUid);

			aShapesInRow.forEach(function(aShapes, iIndex){
				aShapes.forEach(function(oShape){

					if (oGantt.isShapeVisible(oShape)) {
						RenderUtils.renderMainRowShape(oRm, oShape, {
							expandModel: oExpandModel,
							selectionModel: oSelectionModel,
							axisTime: oAxisTime,
							rowSetting: oRowSetting,
							rowUid: sRowUid,
							rowExpanded: bHasExpandShape,
							mainRowYCenter: iMainRowYCenter,
							rowHeight: iRowHeight
						});
					}
				});
			});
		},

		renderMainRowShape : function(oRm, oShape, mOption) {
			// passing the mOption to save unnecessary calculation because of it's always the same for the row
			this.setSpecialProperties(oShape, mOption);

			// render main row shap in RenderManager
			oShape.renderElement(oRm, oShape, null);

			if (mOption.rowExpanded) {
				// just in case the main row shapes had expanded shapes
				this.renderExpandShapesIfNecessary(oRm, oShape, mOption);
			}
		},

		setSpecialProperties: function(oShape, mOption) {
			var oExpandModel = mOption.expandModel,
				sRowUid = mOption.rowUid,
				sShapeUid = mOption.rowSetting.getShapeUid(oShape);

			oShape._iBaseRowHeight = mOption.rowHeight;
			oShape.mAxisTime = mOption.axisTime;
			oShape.setProperty("shapeUid", sShapeUid, true);
			oShape.setProperty("selected", mOption.selectionModel.existed(sShapeUid), true);
			oShape.setProperty("rowYCenter", oExpandModel.getRowYCenterByUid(sRowUid, mOption.mainRowYCenter, oShape.getScheme(), 0), true);
		},

		/**
		 * Check whether the given d is valid.
		 *
		 * @param {string} sD attribute of this path
		 * @return {boolean} whether the given d is valid
		 */
		isValidD: function(sD) {
			return !!sD && sD.indexOf("NaN") === -1 && sD.indexOf("undefined") === -1 && sD.indexOf("null") === -1;
		},

		renderExpandShapesIfNecessary : function(oRm, oMainShape, mOption) {

			var fnRenderExpandShape = function(aShapes) {
				if (!aShapes || aShapes.length === 0) {
					return;
				}
				var aExpandedShapes = aShapes;
				if (jQuery.isArray(aShapes) === false) {
					aExpandedShapes = [aShapes];
				}

				aExpandedShapes.forEach(function(oShape, iIndex){
					oShape.setProperty("rowYCenter", mOption.expandModel.getRowYCenterByUid(mOption.rowUid, null, oShape.getScheme(), iIndex), true);
					oShape._iBaseRowHeight = mOption.expandModel.getExpandShapeHeightByUid(mOption.rowUid, oShape.getScheme(), mOption.iRowHeight);
					oShape.setProperty("shapeUid", mOption.rowSetting.getShapeUid(oShape), true);

					// render expanded shapes
					oShape.renderElement(oRm, oShape);
				});
			};

			var mAggregations = AggregationUtils.getLazyAggregations(oMainShape);
			Object.keys(mAggregations).forEach(function(sName){
				var aShapes = oMainShape.getAggregation(sName);
				fnRenderExpandShape(aShapes);
			});
		},

		calcRowDomPosition : function(oRowSetting, aRowStates) {
			var oRow = oRowSetting._getRow(),
				oTable = oRow.getParent(),
				iRowIndex = oTable.indexOfRow(oRow);

			var iRowHeight = aRowStates[iRowIndex].height;
			var iRowYCenter = 0;
			for (var iIndex = 0; iIndex <= iRowIndex; iIndex++) {
				iRowYCenter += aRowStates[iIndex].height;
			}

			iRowYCenter -= iRowHeight / 2;

			return {
				rowYCenter: iRowYCenter,
				rowHeight: iRowHeight
			};
		}
	};

	return RenderUtils;
}, /* bExport= */ true);
