/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
		"sap/gantt/library",
		"sap/ui/thirdparty/jquery",
		"sap/ui/core/Element",
		"sap/ui/core/Core",
		"sap/ui/core/format/NumberFormat",
		"sap/m/Label",
		"sap/m/Text",
		"sap/m/Title",
		"sap/m/Dialog",
		"sap/m/Button",
		"sap/m/Input",
		"sap/m/FlexBox",
		"sap/m/library",
		"sap/m/FlexItemData",
		"sap/m/ScrollContainer",
		"sap/m/ComboBox",
		"sap/m/RadioButton",
		"sap/m/RadioButtonGroup",
		"sap/m/CheckBox",
		"sap/m/Slider",
		"sap/m/ResponsiveScale",
		"sap/m/StepInput",
		"sap/m/DatePicker",
		"sap/m/BusyDialog",
		"sap/m/MessageStrip",
		"sap/m/Switch",
		"sap/m/Panel",
		"sap/m/TextArea",
		"sap/gantt/misc/Format",
		"sap/gantt/simple/GanttChartContainer",
		"sap/gantt/config/TimeHorizon",
		"sap/gantt/axistime/FullScreenStrategy",
		"sap/ui/core/Item",
		"sap/ui/core/HTML",
		"sap/ui/layout/VerticalLayout",
		"sap/ui/layout/HorizontalLayout",
		"sap/ui/layout/GridData",
		"sap/ui/layout/form/SimpleForm",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/theming/Parameters",
		"sap/ui/core/ResizeHandler",
		"sap/gantt/thirdparty/jspdf",
		"sap/gantt/thirdparty/html2canvas"
	],
	function (
		GanttLibrary,
		$,
		Element,
		Core,
		NumberFormat,
		Label,
		Text,
		Title,
		Dialog,
		Button,
		Input,
		FlexBox,
		MobileLibrary,
		FlexItemData,
		ScrollContainer,
		ComboBox,
		RadioButton,
		RadioButtonGroup,
		CheckBox,
		Slider,
		ResponsiveScale,
		StepInput,
		DatePicker,
		BusyDialog,
		MessageStrip,
		Switch,
		Panel,
		TextArea,
		Format,
		GanttChartContainer,
		TimeHorizon,
		FullScreenStrategy,
		Item,
		HTML,
		VerticalLayout,
		HorizontalLayout,
		GridData,
		SimpleForm,
		JSONModel,
		Parameters,
		ResizeHandler,
		jsPDF,
		html2canvas
	) {
		"use strict";

		var FlexDirection = MobileLibrary.FlexDirection,
			GanttChartWithTableDisplayType = GanttLibrary.simple.GanttChartWithTableDisplayType;
		html2canvas = window.html2canvas;
		jsPDF = window.jsPDF;

		/**
		 * Constructor for a new GanttPrinting control.
		 *
		 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
		 * @param {object} [mSetting] Initial settings for the new control
		 *
		 * @class
		 * The <code>GanttPrinting</code> control enables you to export your Gantt chart as a PDF document.
		 * <br>Please note that the area of the chart that can be exported is limited to canvas area 16,384 x 16,384 pixels (268,435,456 square pixels).
		 *
		 * @extend sap.ui.core.Element
		 *
		 * @author SAP SE
		 * @version 1.74.0
		 * @since 1.66
		 *
		 * @constructor
		 * @public
		 * @alias sap.gantt.simple.GanttPrinting
		 */
		var GanttPrinting = Element.extend("sap.gantt.simple.GanttPrinting", {
			metadata: {
				associations: {

					/**
					 * Gantt chart to be exported as PDF document.
					 */
					ganttChart: {
						type: "sap.gantt.simple.GanttChartWithTable",
						multiple: false
					}
				}
			}
		});

		GanttPrinting._oPaperSizes = {
			"A5": {
				width: mmToPx(148),
				height: mmToPx(210)
			},
			"A4": {
				width: mmToPx(210),
				height: mmToPx(297)
			},
			"A3": {
				width: mmToPx(297),
				height: mmToPx(420)
			},
			"A2": {
				width: mmToPx(420),
				height: mmToPx(594)
			},
			"A1": {
				width: mmToPx(594),
				height: mmToPx(841)
			},
			"A0": {
				width: mmToPx(841),
				height: mmToPx(1189)
			},
			"Letter": {
				width: inToPx(8.5),
				height: inToPx(11)
			},
			"Legal": {
				width: inToPx(8.5),
				height: inToPx(14)
			},
			"Tabloid": {
				width: inToPx(11),
				height: inToPx(17)
			},
			"Custom": {
				width: undefined,
				height: undefined
			}
		};

		var TEXTFONT = "9px Arial, Helvetica, sans-serif";
		var PAGENUMBERFONT = "12px Arial, Helvetica, sans-serif";
		var MAXCANVASSIZE = "16384";
		/* maximum canvas area is 16,384 x 16,384 pixels (268,435,456 square pixels). */

		GanttPrinting.prototype.init = function () {
			this._oRb = Core.getLibraryResourceBundle("sap.gantt");
			// size in px computed from mm and in

			var oData = {
				"multiplePage": true,
				"portrait": true,
				"paperSize": "A4",
				"paperWidth": GanttPrinting._oPaperSizes.A4.width,
				"paperHeight": GanttPrinting._oPaperSizes.A4.height,
				"unit": "mm",
				"repeatSelectionPanel": false,
				"scale": 100,
				"duration": "all",
				"startDate": new Date(),
				"endDate": new Date(),
				"showPageNumber": false,
				"showHeaderText": false,
				"headerText": "",
				"showFooterText": false,
				"footerText": "",
				"exportAll": true,
				"exportRange": "",
				"exportAsJPEG": true,
				"compressionQuality": 75,
				"previewPageNumber": 1,
				"lastPageNumber": undefined,
				"marginType": "default",
				"marginLocked": false,
				"marginTop": mmToPx(5),
				"marginRight": mmToPx(5),
				"marginBottom": mmToPx(5),
				"marginLeft": mmToPx(5),
				"cropMarks": false,
				"cropMarksWeight": 0.25,
				"cropMarksOffset": mmToPx(3)
			};

			this._oModel = new JSONModel(oData);

			this._oGanttCanvas = undefined;

			// 8mm
			this._iHeaderAndFooterHeight = mmToPx(8);

			this._ganttChartContainer = new GanttChartContainer();
		};

		/* ================================================ */
		/* 					Public Methods					*/
		/* ================================================ */

		/**
		 *
		 * Exports the Gantt chart as PDF.
		 *
		 * @public
		 */
		GanttPrinting.prototype.export = function () {
			this._savePdf();
		};

		// TODO add this feature
		// GanttPrinting.prototype.savePreset = function () {
		// };

		/**
		 * Opens the print dialog.
		 *
		 * @public
		 */
		GanttPrinting.prototype.open = function () {
			if (!this.getGanttChart() || !this._getOriginalGanttChart().isA("sap.gantt.simple.GanttChartWithTable")) {
				throw new Error("Association 'ganttChart' of type 'sap.gantt.simple.GanttChartWithTable' is not set");
			}
			var that = this;

			this._createAndOpenDialog();
			this._oDialog.getContent()[0].setBusy(true);
			this._drawClonedGantt().then(function () {
				return that._expandAndCollapse();
			}).then(function () {
				return that._createGanttCanvas();
			}).then(function (oUpdatedCanvas) {
				that._oGanttCanvas = oUpdatedCanvas;
				that._updateDialogPreview();
				that._oDialog.getContent()[0].setBusy(false);
			});
		};

		/**
		 * Closes the print dialog.
		 *
		 * @public
		 */
		GanttPrinting.prototype.close = function () {
			this._ganttChartClone.destroy();
			this._ganttChartClone = null;
			this._ganttChartContainer.destroy();
			this._ganttChartContainer = null;
			document.body.removeChild(this._oClonedGanttDiv);

			ResizeHandler.deregister(this._sResizeHandlerId);
			this._oDialog.close();
			this._oDialog.destroy();
		};

		/**
		 * Sets the Gantt chart to be exported as PDF.
		 *
		 * @param oGanttChart Gantt chart to export
		 * @returns {sap.gantt.simple.GanttPrinting}
		 * @public
		 */
		GanttPrinting.prototype.setGanttChart = function (oGanttChart) {
			this.setAssociation("ganttChart", oGanttChart);

			// aggregation - clone
			this._ganttChartClone = oGanttChart.clone();
			this._originalHasRenderedShapes = oGanttChart.getInnerGantt().hasRenderedShapes();
			// Because of Models
			this._ganttChartContainer.setParent(this._getOriginalGanttChart(), "originalGanttChart", true);

			// detach all events
			this._ganttChartClone.mEventRegistry = {};

			this._ganttChartClone.setHeight("100%");

			// set panel size in px from original gantt chart (default panel size is 30%)
			var iTableSize = oGanttChart._oSplitter._calculatedSizes[0];
			this._ganttChartClone.setSelectionPanelSize(iTableSize.toString() + "px");

			var oAxisTimeStrategy = oGanttChart.getAxisTimeStrategy();
			if (!oAxisTimeStrategy.isA("sap.gantt.axistime.FullScreenStrategy")) {
				oGanttChart._getScrollExtension()._updateVisibleHorizonForce();
				// set visible horizon to total horizon, we always need to see the full graph
				var oCloneAxisTimeStrategy = this._ganttChartClone.getAxisTimeStrategy();
				oCloneAxisTimeStrategy.setVisibleHorizon(oCloneAxisTimeStrategy.getTotalHorizon());
			}

			// calculate how many pixels are in a sec
			var oVisibleHorizon = oAxisTimeStrategy.getVisibleHorizon();
			var oVisibleHorizonDates = this._getHorizonDates(oVisibleHorizon);
			var iVisibleHorizonInSec = this._horizonWidthInSec(oVisibleHorizonDates);
			this._fPixelsBySec = oGanttChart.getVisibleWidth() / iVisibleHorizonInSec;

			this._ganttChartContainer.addGanttChart(this._ganttChartClone);

			return this;
		};

		/* ================================================= */
		/* 					Private methods					 */
		/* ================================================= */


		GanttPrinting.prototype._expandAndCollapse = function () {
			// expansion state of the nodes is not duplicated during cloning
			// it is held in the binding and has to be copied after the binding is initialized on the cloned gantt
			var oOrigRowsBinding = this._getOriginalGanttChart().getTable().getBinding("rows"),
				oCloneRowsBinding = this._ganttChartClone.getTable().getBinding("rows"),
				bChanged = false;


			for (var i = 0; i < oOrigRowsBinding.getLength(); i++) {
				if (oOrigRowsBinding.isExpanded(i) && !oCloneRowsBinding.isExpanded(i)) {
					oCloneRowsBinding.expand(i);
					bChanged = true;
				} else if (!oOrigRowsBinding.isExpanded(i) && oCloneRowsBinding.isExpanded(i)) {
					oCloneRowsBinding.collapse(i);
					bChanged = true;
				}
			}
			if (bChanged) {
				return new Promise(function (resolve) {
					this._ganttChartClone.getTable().attachEventOnce("_rowsUpdated", resolve, this);
					this._ganttChartClone.invalidate();
				}.bind(this));
			} else {
				return Promise.resolve();
			}

		};

		GanttPrinting.prototype._onResize = function () {
			var $dialogPreviewContentDiv = this._oHTMLDialogPreview.getDomRef();
			$dialogPreviewContentDiv.style.overflow = "hidden";
			this._resizePrintingPreviewPage();
			// overflow has to be set to visible because of the page shadow
			$dialogPreviewContentDiv.style.overflow = "visible";
		};

		function mmToPx(iMm) {
			// 1 millimeter = 3.78 pixel
			return iMm * 3.78;
		}

		function pxToMm(fPx) {
			// 1 millimeter = 3.78 pixel
			return fPx / 3.78;
		}

		function inToPx(iIn) {
			// 1 inch =  pixel 0.01042 pixel
			return iIn / 0.01042;
		}

		function pxToIn(fPx) {
			// 1 inch =  pixel 0.01042 pixel
			return fPx * 0.01042;
		}

		GanttPrinting.prototype._convertUnitToPx = function (fVal) {
			var sUnit = this._oModel.getProperty("/unit");
			if (!sUnit) {
				return undefined;
			}

			switch (sUnit) {
				case "mm":
					return mmToPx(fVal);
				case "cm":
					return mmToPx(fVal) * 10;
				case "in":
					return inToPx(fVal);
				default:
					return undefined;
			}
		};

		GanttPrinting.prototype._convertPxToUnit = function (fPx) {
			var sUnit = this._oModel.getProperty("/unit");
			if (!sUnit) {
				return undefined;
			}

			switch (sUnit) {
				case "mm":
					return pxToMm(fPx);
				case "cm":
					return pxToMm(fPx) / 10;
				case "in":
					return pxToIn(fPx);
				default:
					return undefined;
			}
		};

		GanttPrinting.prototype._onChangeUnitComboBox = function () {
			this._updatePaperSizeInputs();
			this._updateMarginInputs();
			// TODO add this with crop marks feature
			// this._updateCropMarksOffsetInput();
		};

		GanttPrinting.prototype._updatePaperSizeInputs = function () {
			var fPaperWidth = this._oModel.getProperty("/paperWidth"),
				fPaperHeight = this._oModel.getProperty("/paperHeight");

			this._setPaperSizeInputs(fPaperWidth, fPaperHeight);
		};

		GanttPrinting.prototype._setPaperSizeInputs = function (fPaperWidth, fPaperHeight) {
			if (this._oInputPaperWidth) {
				this._oInputPaperWidth.setValue(this._convertPxToUnit(fPaperWidth));
			}
			if (this._oInputPaperHeight) {
				this._oInputPaperHeight.setValue(this._convertPxToUnit(fPaperHeight));
			}
		};

		GanttPrinting.prototype._setPaperSizesToModel = function (fPaperWidth, fPaperHeight) {
			// update sizes to the model
			this._oModel.setProperty("/paperWidth", fPaperWidth);
			this._oModel.setProperty("/paperHeight", fPaperHeight);
		};

		GanttPrinting.prototype._updatePaperSizeValues = function () {
			var sPaperSize = this._oModel.getProperty("/paperSize"),
				bPortrait = this._oModel.getProperty("/portrait"),
				fPaperWidth,
				fPaperHeight;

			if (!sPaperSize || sPaperSize === "Custom") {
				return;
			}

			var oSizes = GanttPrinting._oPaperSizes[sPaperSize];
			if (bPortrait) {
				fPaperWidth = oSizes.width;
				fPaperHeight = oSizes.height;
			} else {
				fPaperWidth = oSizes.height;
				fPaperHeight = oSizes.width;
			}
			this._setPaperSizeInputs(fPaperWidth, fPaperHeight);
			this._setPaperSizesToModel(fPaperWidth, fPaperHeight);

			if (sPaperSize === "Letter" || sPaperSize === "Legal" || sPaperSize === "Tabloid") {
				this._oComboBoxUnit.setSelectedKey("in");
			} else {
				this._oComboBoxUnit.setSelectedKey("mm");
			}

			this._onChangeUnitComboBox();
			this._updateDialogPreview();
		};

		GanttPrinting.prototype._updatePaperOrientation = function (oEvent) {
			var fPaperWidth = this._oModel.getProperty("/paperWidth"),
				fPaperHeight = this._oModel.getProperty("/paperHeight");

			if (fPaperHeight > fPaperWidth) {
				this._oModel.setProperty("/portrait", true);
				this._radioGroupOrientation.setSelectedIndex(0);
			} else {
				this._oModel.setProperty("/portrait", false);
				this._radioGroupOrientation.setSelectedIndex(1);
			}
		};

		GanttPrinting.prototype._onChangePaperSizeInput = function (oEvent) {
			var oChangedInput = oEvent.getSource();
			var fNewValue = this._convertUnitToPx(NumberFormat.getFloatInstance().parse(oChangedInput.getValue()));

			if (oChangedInput === this._oInputPaperWidth) {
				this._oModel.setProperty("/paperWidth", fNewValue);
			} else {
				this._oModel.setProperty("/paperHeight", fNewValue);
			}

			this._oComboBoxPaperSizes.setSelectedKey("Custom");

			this._updatePaperOrientation();
			this._updateDialogPreview();
		};

		GanttPrinting.prototype._onChangeCompressionSlider = function (oEvent) {
			var oChangedSlider = oEvent.getSource();
			var iNewValue = oChangedSlider.getValue();

			this._setCompressionComboBoxItem(iNewValue);
		};

		GanttPrinting.prototype._setCompressionComboBoxItem = function (iNewValue) {
			if (iNewValue === 100) {
				this._oComboBoxCompression.setSelectedKey("maximum");
			} else if (iNewValue >= 75) {
				this._oComboBoxCompression.setSelectedKey("high");
			} else if (iNewValue >= 50) {
				this._oComboBoxCompression.setSelectedKey("medium");
			} else {
				this._oComboBoxCompression.setSelectedKey("low");
			}
		};

		GanttPrinting.prototype._onChangeCompressionComboBox = function (oEvent) {
			var sKey = oEvent.getSource().getSelectedKey();

			var mCompQuality = {
				maximum: 100,
				high: 75,
				medium: 50,
				low: 25
			};

			this._oModel.setProperty("/compressionQuality", mCompQuality[sKey]);
		};

		GanttPrinting.prototype._onChangeOrientation = function () {
			var fPaperWidth = this._oModel.getProperty("/paperWidth"),
				fPaperHeight = this._oModel.getProperty("/paperHeight");

			// swap values
			this._setPaperSizeInputs(fPaperHeight, fPaperWidth);
			this._setPaperSizesToModel(fPaperHeight, fPaperWidth);

			this._updateDialogPreview();
		};

		GanttPrinting.prototype._onChangeExportTypes = function () {
			this._updateDialogPreview();
		};

		GanttPrinting.prototype._setMarginInputs = function (fTop, fRight, fBottom, fLeft) {
			this._oInputMarginTop.setValue(this._convertPxToUnit(fTop));
			this._oInputMarginRight.setValue(this._convertPxToUnit(fRight));
			this._oInputMarginBottom.setValue(this._convertPxToUnit(fBottom));
			this._oInputMarginLeft.setValue(this._convertPxToUnit(fLeft));
		};

		GanttPrinting.prototype._setMarginsToModel = function (fTop, fRight, fBottom, fLeft) {
			if (fTop !== undefined) {
				this._oModel.setProperty("/marginTop", fTop);
			}

			if (fRight !== undefined) {
				this._oModel.setProperty("/marginRight", fRight);
			}

			if (fBottom !== undefined) {
				this._oModel.setProperty("/marginBottom", fBottom);
			}

			if (fLeft !== undefined) {
				this._oModel.setProperty("/marginLeft", fLeft);
			}
		};

		GanttPrinting.prototype._onChangeMarginComboBox = function (oEvent) {
			var sKey = oEvent.getSource().getSelectedKey();

			// default margin is 5mm
			var fMargin = mmToPx(5);
			if (sKey === "none") {
				fMargin = 0;
			}

			this._setMarginsToModel(fMargin, fMargin, fMargin, fMargin);
			this._setMarginInputs(fMargin, fMargin, fMargin, fMargin);

			this._updateDialogPreview();
		};

		GanttPrinting.prototype._updateModelFromMarginInputs = function () {
			var fMarginTop,
				fMarginRight,
				fMarginBottom,
				fMarginLeft;

			if (this._oInputMarginTop.getValueState() !== "Error") {
				fMarginTop = this._convertUnitToPx(this._oInputMarginTop.getValue());
			}

			if (this._oInputMarginRight.getValueState() !== "Error") {
				fMarginRight = this._convertUnitToPx(this._oInputMarginRight.getValue());
			}

			if (this._oInputMarginBottom.getValueState() !== "Error") {
				fMarginBottom = this._convertUnitToPx(this._oInputMarginBottom.getValue());
			}

			if (this._oInputMarginLeft.getValueState() !== "Error") {
				fMarginLeft = this._convertUnitToPx(this._oInputMarginLeft.getValue());
			}

			this._setMarginsToModel(fMarginTop, fMarginRight, fMarginBottom, fMarginLeft);
		};

		GanttPrinting.prototype._updateMarginInputs = function () {
			var fMarginTop = this._oModel.getProperty("/marginTop");
			var fMarginRight = this._oModel.getProperty("/marginRight");
			var fMarginBottom = this._oModel.getProperty("/marginBottom");
			var fMarginLeft = this._oModel.getProperty("/marginLeft");

			this._setMarginInputs(fMarginTop, fMarginRight, fMarginBottom, fMarginLeft);
		};

		GanttPrinting.prototype._updateCropMarksOffsetInput = function () {
			var fCropMarksOffset = this._oModel.getProperty("/cropMarksOffset");
			this._oInputCropMarksOffset.setValue(this._convertPxToUnit(fCropMarksOffset));
		};

		GanttPrinting.prototype._onChangeMarginInput = function (oEvent) {
			var oChangedInput = oEvent.getSource();

			if (oChangedInput.getValueState() === "Error") {
				return;
			}

			if (this._oModel.getProperty("/marginLocked")) {
				var fNewValue = this._convertUnitToPx(oChangedInput.getValue());

				this._setMarginInputs(fNewValue, fNewValue, fNewValue, fNewValue);
				this._setMarginsToModel(fNewValue, fNewValue, fNewValue, fNewValue);
			} else {
				this._updateModelFromMarginInputs();
			}

			this._updateDialogPreview();
		};

		GanttPrinting.prototype._onChangeCropMarksInput = function (oEvent) {
			var oChangedInput = oEvent.getSource();
			var fNewValue = this._convertUnitToPx(oChangedInput.getValue());

			this._oInputCropMarksOffset.setValue(this._convertPxToUnit(fNewValue));
			this._oModel.setProperty("/cropMarksOffset", fNewValue);
		};

		GanttPrinting.prototype._allRange = function () {
			this._oModel.setProperty("/startDate", this._oDatePickerFrom.getMinDate());
			this._oModel.setProperty("/endDate", this._oDatePickerTo.getMaxDate());
		};

		GanttPrinting.prototype._getFirstDayOfNextWeek = function (oDate) {
			var iFirstDayOfWeek = this._getOriginalGanttChart().getAxisTimeStrategy().getFirstDayOfWeek();
			var iDaysToFirstDayOfWeek = (iFirstDayOfWeek + 7 - oDate.getDay()) % 7;
			// if today is the first day of week add 7 days to move to the right date
			return new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate() + (iDaysToFirstDayOfWeek === 0 ? 7 : iDaysToFirstDayOfWeek));
		};

		GanttPrinting.prototype._nextWeekRange = function () {
			var oNow = new Date();
			var oNextWeek = this._getFirstDayOfNextWeek(oNow);

			this._oModel.setProperty("/startDate", this._validateDate(oNextWeek));
			this._oModel.setProperty("/endDate", this._validateDate(new Date(oNextWeek.getFullYear(), oNextWeek.getMonth(), oNextWeek.getDate() + 7)));
		};

		GanttPrinting.prototype._getFirstDayOfNextMonth = function (oDate) {
			return new Date(oDate.getFullYear(), oDate.getMonth() + 1, 1);
		};

		GanttPrinting.prototype._nextMonthRange = function () {
			var oNow = new Date();

			this._oModel.setProperty("/startDate", this._validateDate(this._getFirstDayOfNextMonth(oNow)));
			this._oModel.setProperty("/endDate", this._validateDate(new Date(oNow.getFullYear(), oNow.getMonth() + 2, 1)));
		};

		GanttPrinting.prototype._validateDate = function (oDate) {
			var oMaxDate = this._oDatePickerTo.getMaxDate(),
				oMinDate = this._oDatePickerFrom.getMinDate();

			if (oDate.getTime() > oMaxDate.getTime()) {
				return oMaxDate;
			}

			if (oDate.getTime() < oMinDate.getTime()) {
				return oMinDate;
			}

			return oDate;
		};

		GanttPrinting.prototype._onChangeDurationComboBox = function () {
			var sDurationValue = this._oModel.getProperty("/duration");

			switch (sDurationValue) {
				case "all": {
					this._allRange();
				}
					break;
				case "week": {
					this._nextWeekRange();
				}
					break;
				case "month": {
					this._nextMonthRange();
				}
					break;
				case "custom":
				default:
					return;
			}

			this._updateGanttCanvas();
		};

		GanttPrinting.prototype._onChangeDurationDatePicker = function () {
			this._oComboBoxDuration.setSelectedKey("custom");

			this._updateGanttCanvas();
		};

		GanttPrinting.prototype._setEnabledPreviousButtons = function (bValue) {
			this._oButtonFirst.setEnabled(bValue);
			this._oButtonPrevious.setEnabled(bValue);
		};

		GanttPrinting.prototype._setEnabledNextButtons = function (bValue) {
			this._oButtonNext.setEnabled(bValue);
			this._oButtonLast.setEnabled(bValue);
		};

		GanttPrinting.prototype._updatePageNumberButtons = function () {
			if (!this._oGanttCanvas) {
				this._setEnabledNextButtons(false);
				this._setEnabledPreviousButtons(false);
				return;
			}

			var iCurrentPage = this._oModel.getProperty("/previewPageNumber"),
				iLastPage = this._oModel.getProperty("/lastPageNumber");

			// if iLastPage is undefined, allow to press next
			if (!iLastPage) {
				iLastPage = Number.MAX_SAFE_INTEGER;
			}

			if (iCurrentPage <= 1) {
				this._setEnabledPreviousButtons(false);
			}

			if (iCurrentPage >= iLastPage) {
				this._setEnabledNextButtons(false);
			}

			if (iCurrentPage > 1) {
				this._setEnabledPreviousButtons(true);
			}

			if (iCurrentPage < iLastPage) {
				this._setEnabledNextButtons(true);
			}
		};

		GanttPrinting.prototype._getHeaderHeight = function () {
			var bHeaderText = this._oModel.getProperty("/showHeaderText");
			if (bHeaderText) {
				return this._iHeaderAndFooterHeight;
			}

			return 0;
		};

		GanttPrinting.prototype._isFooterMultiline = function () {
			// footer is never multiline in single page mode
			if (!this._oModel.getProperty("/multiplePage")) {
				return false;
			}

			var bPageNumber = this._oModel.getProperty("/showPageNumber"),
				bFooterText = this._oModel.getProperty("/showFooterText");

			if (!bFooterText || !bPageNumber) {
				return false;
			}

			var sFooterText = this._oModel.getProperty("/footerText"),
				fPaperWidth = this._oModel.getProperty("/paperWidth"),
				fMargin;

			var bRTL = Core.getConfiguration().getRTL();
			if (bRTL) {
				fMargin = this._oModel.getProperty("/marginRight");
			} else {
				fMargin = this._oModel.getProperty("/marginLeft");
			}

			// to make it easier - number > 9 and < 100 has width roughly 14px
			// lets say average number width is 14px width -> 7px from the beginning to the center of the number
			var fPageNumberWidth = 7;

			var oCanvasContext = this._oGanttCanvas.getContext("2d");
			oCanvasContext.font = TEXTFONT;
			var fFooterTextWidth = oCanvasContext.measureText(sFooterText).width;

			if (fPaperWidth / 2 > (fMargin + mmToPx(4) /* footer text padding */
				+ fFooterTextWidth + mmToPx(10) /* space between text and page number */ + fPageNumberWidth)) {
				return false;
			} else {
				return true;
			}
		};

		GanttPrinting.prototype._getFooterHeight = function () {
			var bPageNumber = this._oModel.getProperty("/showPageNumber"),
				bFooterText = this._oModel.getProperty("/showFooterText");

			if (bFooterText && bPageNumber) {
				return this._isFooterMultiline() ? 2 * this._iHeaderAndFooterHeight : this._iHeaderAndFooterHeight;
			}

			if (bFooterText || bPageNumber) {
				return this._iHeaderAndFooterHeight;
			}

			return 0;
		};

		GanttPrinting.prototype._isShrinkableToOnePageByWidth = function () {
			var fPaperWidthRatio = this._getPaperContentWidth() / this._getPaperContentHeight(),
				fChartWidthRatio = this._oGanttCanvas.width / this._oGanttCanvas.height;

			return fPaperWidthRatio <= fChartWidthRatio;
		};

		GanttPrinting.prototype._getPaperContentWidth = function () {
			var fPaperWidth = this._oModel.getProperty("/paperWidth"),
				fMarginLeft = this._oModel.getProperty("/marginLeft"),
				fMarginRight = this._oModel.getProperty("/marginRight");

			return fPaperWidth - fMarginLeft - fMarginRight;
		};

		GanttPrinting.prototype._getPaperContentHeight = function () {
			var fPaperHeight = this._oModel.getProperty("/paperHeight"),
				fMarginTop = this._oModel.getProperty("/marginTop"),
				fMarginBottom = this._oModel.getProperty("/marginBottom");

			return fPaperHeight - fMarginTop - this._getHeaderHeight() - fMarginBottom - this._getFooterHeight();
		};

		GanttPrinting.prototype._getScale = function () {
			return 100 / this._oModel.getProperty("/scale");
		};

		GanttPrinting.prototype._getCroppingWidth = function () {
			return this._getScale() * this._getPaperContentWidth();
		};

		GanttPrinting.prototype._getCroppingHeight = function () {
			return this._getScale() * this._getPaperContentHeight();
		};

		GanttPrinting.prototype._getPagesInARow = function () {
			return Math.ceil(this._oGanttCanvas.width / this._getCroppingWidth());
		};

		GanttPrinting.prototype._getPagesInAColumn = function () {
			return Math.ceil(this._oGanttCanvas.height / this._getCroppingHeight());
		};

		GanttPrinting.prototype._updateLastPageNumber = function () {
			if (!this._oGanttCanvas) {
				return;
			}

			var iLastPage = this._getPagesInARow() * this._getPagesInAColumn();
			this._oModel.setProperty("/lastPageNumber", iLastPage);

			// if current page is higher then last page, set it to the last page
			var iCurrentPage = this._oModel.getProperty("/previewPageNumber");

			if (iCurrentPage > iLastPage) {
				this._oModel.setProperty("/previewPageNumber", iLastPage);
			}

		};

		GanttPrinting.prototype._onPressButtonFirst = function () {
			this._oModel.setProperty("/previewPageNumber", 1);

			this._updatePageNumberButtons();
			this._updateDialogPreviewCanvas();
		};

		GanttPrinting.prototype._onPressButtonPrevious = function () {
			var iCurrentPage = this._oModel.getProperty("/previewPageNumber");
			this._oModel.setProperty("/previewPageNumber", iCurrentPage - 1);

			this._updatePageNumberButtons();
			this._updateDialogPreviewCanvas();
		};

		GanttPrinting.prototype._onPressButtonNext = function () {
			var iCurrentPage = this._oModel.getProperty("/previewPageNumber");
			this._oModel.setProperty("/previewPageNumber", iCurrentPage + 1);

			this._updatePageNumberButtons();
			this._updateDialogPreviewCanvas();
		};

		GanttPrinting.prototype._onPressButtonLast = function () {
			var iLastPage = this._oModel.getProperty("/lastPageNumber");
			if (!iLastPage) {
				return;
			}
			this._oModel.setProperty("/previewPageNumber", iLastPage);

			this._updatePageNumberButtons();
			this._updateDialogPreviewCanvas();
		};

		GanttPrinting.prototype._getOriginalGanttChart = function () {
			return sap.ui.getCore().byId(this.getAssociation("ganttChart"));
		};

		GanttPrinting.prototype._setGanttCloneDivWidth = function () {
			var oOriginalGanttChart = this._getOriginalGanttChart(),
				oTimeStrategy = this._ganttChartClone.getAxisTimeStrategy(),
				oTotalHorizon = oTimeStrategy.getTotalHorizon(),
				oTotalHorizonDates = this._getHorizonDates(oTotalHorizon),
				iTotalHorizonInSec = this._horizonWidthInSec(oTotalHorizonDates),
				iTotalHorizonInPx = Math.ceil(this._fPixelsBySec * iTotalHorizonInSec);

			var iTableAreaWidthInPx = oOriginalGanttChart.getDisplayType() === GanttChartWithTableDisplayType.Both ?
				oOriginalGanttChart.getTable().getDomRef().offsetWidth : 0;
			// add a magic constant which should cover splitbar, scrollbar, etc.
			this._oClonedGanttDiv.style.width = (iTableAreaWidthInPx + iTotalHorizonInPx + 10).toString() + "px";
		};

		GanttPrinting.prototype._setGanttCloneDivHeight = function () {
			var oTable = this._getOriginalGanttChart().getTable();

			var iRowCount = oTable._getTotalRowCount(),
				aRenderedRowHeight = oTable._aRowHeights;

			var fSumOfRowHeights = aRenderedRowHeight.reduce(function (fTotal, fRowHeigh) {
				return fTotal + fRowHeigh;
			});

			// TODO improve calculation of Gantt chart height
			// estimate gantt chart height based on average height of rendered rows
			var iGanttHeight = Math.ceil((fSumOfRowHeights / aRenderedRowHeight.length) * iRowCount);

			// add a magic constant which should cover head, scrollbar, etc.
			this._oClonedGanttDiv.style.height = (iGanttHeight + 102).toString() + "px";
		};

		GanttPrinting.prototype._createImgElementsFromSvgImages = function () {
			var $SvgContent = this._ganttChartClone.$().find("svg.sapGanttChartSvg");
			if (!$SvgContent.length) {
				return;
			}

			var oGanttContentBody = this._ganttChartClone.$().find(".sapGanttChartCnt")[0];
			if (!oGanttContentBody) {
				return;
			}
			oGanttContentBody.style.position = "relative";

			var $SvgImages = $SvgContent.find("image");
			for (var i = 0; i < $SvgImages.length; i++) {
				var oSvgImage = $SvgImages[i];

				var oImg = document.createElement("img");
				oImg.src = oSvgImage.getAttribute("xlink:href");
				oImg.style.position = "absolute";
				oImg.style.top = oSvgImage.getAttribute("y") + "px";
				oImg.style.left = oSvgImage.getAttribute("x") + "px";
				oImg.style.width = oSvgImage.getAttribute("width") + "px";
				oImg.style.height = oSvgImage.getAttribute("height") + "px";

				oGanttContentBody.appendChild(oImg);
			}
		};

		GanttPrinting.prototype._createGanttCanvas = function () {
			// set svg style directly to the dom
			this._setStyleToGanttChartSvg(this._ganttChartClone);
			this._createImgElementsFromSvgImages();

			if (this._oClonedGanttDiv.offsetWidth > MAXCANVASSIZE) {
				if (this._oGanttCanvas) {
					delete this._oGanttCanvas;
					this._oGanttCanvas = null;
				}
				return Promise.resolve();
			}

			return html2canvas(this._oClonedGanttDiv, {
				allowTaint: true,
				scale: 1,
				logging: false
			});
		};

		GanttPrinting.prototype._updateGanttCanvas = function () {
			var oModel = this._oModel;

			// set new horizons values
			var oTimeStrategy = this._ganttChartClone.getAxisTimeStrategy();
			oTimeStrategy.getTotalHorizon().setStartTime(oModel.getProperty("/startDate"));
			oTimeStrategy.getTotalHorizon().setEndTime(oModel.getProperty("/endDate"));
			oTimeStrategy.getVisibleHorizon().setStartTime(oModel.getProperty("/startDate"));
			oTimeStrategy.getVisibleHorizon().setEndTime(oModel.getProperty("/endDate"));

			this._setGanttCloneDivWidth();
			this._ganttChartContainer.rerender();

			this._oFlexBoxPreview.setBusy(true);
			return this._createGanttCanvas().then(function (oUpdatedCanvas) {
				this._oGanttCanvas = oUpdatedCanvas;

				this._updateDialogPreview();

				this._oFlexBoxPreview.setBusy(false);
			}.bind(this)).catch(function () {
				this._oFlexBoxPreview.setBusy(false);
			}.bind(this));
		};

		GanttPrinting.prototype._drawClonedGantt = function () {
			if (this._oClonedGanttDiv) {
				return;
			}
			// create div simulating Paper sizes
			this._oClonedGanttDiv = document.createElement("div");
			this._oClonedGanttDiv.id = "clonedGanttDiv";
			if (this._getOriginalGanttChart().$().closest(".sapUiSizeCompact").length > 0) {
				this._oClonedGanttDiv.classList.add("sapUiSizeCompact");
			}
			this._oClonedGanttDiv.style.position = "absolute";

			this._oClonedGanttDiv.style.top = "-17000px";
			this._oClonedGanttDiv.style.left = "-17000px";
			// FOR TESTING
			// this._oClonedGanttDiv.style.top = "0px";
			// this._oClonedGanttDiv.style.left = "0px";
			// this._oClonedGanttDiv.style.zIndex = "100";

			document.body.appendChild(this._oClonedGanttDiv);

			this._setGanttCloneDivWidth();
			this._setGanttCloneDivHeight();

			var oModel = this._oModel;
			var oTimeStrategy = this._ganttChartClone.getAxisTimeStrategy();
			oTimeStrategy.getVisibleHorizon().setStartTime(oModel.getProperty("/startDate"));
			oTimeStrategy.getVisibleHorizon().setEndTime(oModel.getProperty("/endDate"));

			this._ganttChartContainer.placeAt("clonedGanttDiv");

			return this._ganttChartClone.getInnerGantt().resolveWhenReady(this._originalHasRenderedShapes);
		};

		GanttPrinting.prototype._resizePrintingPreviewPage = function () {
			var $dialogPreviewContentDiv = this._oHTMLDialogPreview.getDomRef(),
				$dialogPreviewDiv = this._oHTMLDialogPreview.$().find(".sapGanttPrintingPreviewPageDiv")[0],
				fPreviewHeight = $dialogPreviewContentDiv.offsetHeight,
				fPaperHeight = this._oModel.getProperty("/paperHeight"),
				fPaperWidth = this._oModel.getProperty("/paperWidth"),
				bPortrait = this._oModel.getProperty("/portrait"),
				fRatio,
				fPreviewWidth;


			if (bPortrait) {
				fRatio = fPreviewHeight / fPaperHeight;
				fPreviewWidth = fPaperWidth * fRatio;
			} else {
				fRatio = fPreviewHeight / fPaperWidth;
				fPreviewWidth = fPreviewHeight;
				fPreviewHeight = fPaperHeight * fRatio;
			}

			$dialogPreviewDiv.style.width = fPreviewWidth.toString() + "px";
			$dialogPreviewDiv.style.height = fPreviewHeight.toString() + "px";
		};

		GanttPrinting.prototype._getCanvasOfPageN = function (iPageNumber, bForExport) {
			var iLastPage = this._oModel.getProperty("/lastPageNumber");
			if (iPageNumber > iLastPage) {
				return null;
			}

			var oCanvas = document.createElement("canvas");
			var oCanvasContext = oCanvas.getContext("2d");
			oCanvasContext.imageSmoothingEnabled = false;

			var fCroppingWidth = this._getCroppingWidth(),
				fCroppingHeight = this._getCroppingHeight();

			var iPagesInARow = this._getPagesInARow();

			var fPaperWidth = this._oModel.getProperty("/paperWidth"),
				fPaperHeight = this._oModel.getProperty("/paperHeight");

			var fMarginTop = this._oModel.getProperty("/marginTop"),
				fMarginRight = this._oModel.getProperty("/marginRight"),
				fMarginBottom = this._oModel.getProperty("/marginBottom"),
				fMarginLeft = this._oModel.getProperty("/marginLeft");

			var iColumn = (iPageNumber - 1) % iPagesInARow,
				iRow = Math.floor((iPageNumber - 1) / iPagesInARow);

			oCanvas.width = fPaperWidth;
			oCanvas.height = fPaperHeight;
			if (!bForExport) {
				oCanvas.style.height = "100%";
				oCanvas.style.width = "auto";
			}

			// set white background
			oCanvasContext.fillStyle = "white";
			oCanvasContext.fillRect(0, 0, oCanvas.width, oCanvas.height);

			oCanvasContext.fillStyle = Parameters.get("sapUiBaseText");
			oCanvasContext.textBaseline = "middle";
			oCanvasContext.font = TEXTFONT;
			var fXTextPosition;

			var bRTL = Core.getConfiguration().getRTL();
			if (bRTL) {
				oCanvasContext.textAlign = "right";
				fXTextPosition = fPaperWidth - fMarginRight - mmToPx(4);
				/* text padding */
			} else {
				oCanvasContext.textAlign = "left";
				fXTextPosition = fMarginLeft + mmToPx(4);
				/* text padding */
			}

			// add header
			var bShowHeaderText = this._oModel.getProperty("/showHeaderText");
			if (bShowHeaderText) {
				var sHeaderText = this._oModel.getProperty("/headerText");
				oCanvasContext.fillText(sHeaderText,
					fXTextPosition, fMarginTop + (this._iHeaderAndFooterHeight / 2));
			}

			// add footer
			if (this._oModel.getProperty("/showFooterText")) {
				oCanvasContext.fillText(this._oModel.getProperty("/footerText"),
					fXTextPosition, fPaperHeight - fMarginBottom - (this._iHeaderAndFooterHeight / 2) -
					(this._isFooterMultiline() ? this._iHeaderAndFooterHeight : 0));
			}

			// add page number
			var bShowPageNumber = this._oModel.getProperty("/showPageNumber"),
				bMultiplePage = this._oModel.getProperty("/multiplePage");

			if (bMultiplePage && bShowPageNumber) {
				oCanvasContext.font = PAGENUMBERFONT;
				oCanvasContext.textAlign = "center";
				oCanvasContext.fillText(iPageNumber.toString(),
					fPaperWidth / 2, fPaperHeight - fMarginBottom - (this._iHeaderAndFooterHeight / 2));
			}

			// multiple page mode
			if (bMultiplePage) {
				var fSourceX = iColumn * fCroppingWidth,
					fSourceY = iRow * fCroppingHeight,
					fLastPageContentHeight = 0,
					fLastPageContentWidth = 0;

				// the last horizontal images from the canvas
				var bLastHorizontalPage = false;
				if ((fSourceX + fCroppingWidth) > this._oGanttCanvas.width) {
					bLastHorizontalPage = true;

					fCroppingWidth = (this._oGanttCanvas.width - fSourceX);
					fLastPageContentWidth = fCroppingWidth / this._getScale();
				}

				// the last vertical images from the canvas
				var bLastVerticalPage = false;
				if ((fSourceY + fCroppingHeight) > this._oGanttCanvas.height) {
					bLastVerticalPage = true;

					fCroppingHeight = (this._oGanttCanvas.height - fSourceY);
					fLastPageContentHeight = fCroppingHeight / this._getScale();
				}

				oCanvasContext.drawImage(this._oGanttCanvas,
					fSourceX, /* source x */
					fSourceY, /* source y */
					fCroppingWidth, /* source image width */
					fCroppingHeight, /* source image height */
					fMarginLeft, /* destination x */
					fMarginTop + this._getHeaderHeight(), /* destination y */
					bLastHorizontalPage ? fLastPageContentWidth : this._getPaperContentWidth(),
					bLastVerticalPage ? fLastPageContentHeight : this._getPaperContentHeight()
				);
			} else { // single page mode
				var fPaperCntWidth = this._getPaperContentWidth(),
					fPaperCntHeight = this._getPaperContentHeight();

				var bShrinkByWidth = this._isShrinkableToOnePageByWidth();

				var fRatio;
				if (bShrinkByWidth) {
					fRatio = fPaperCntWidth / this._oGanttCanvas.width;
					fPaperCntHeight = this._oGanttCanvas.height * fRatio;
				} else {
					fRatio = fPaperCntHeight / this._oGanttCanvas.height;
					fPaperCntWidth = this._oGanttCanvas.width * fRatio;
				}

				oCanvasContext.drawImage(this._oGanttCanvas,
					0, /* source x */
					0, /* source y */
					this._oGanttCanvas.width, /* source image width */
					this._oGanttCanvas.height, /* source image height */
					fMarginLeft, /* destination x */
					fMarginTop + this._getHeaderHeight(), /* destination y */
					fPaperCntWidth,
					fPaperCntHeight
				);
			}

			return oCanvas;
		};

		function removeDialogPreviewChilds($dialogPreviewDiv) {
			while ($dialogPreviewDiv.firstChild) {
				$dialogPreviewDiv.removeChild($dialogPreviewDiv.firstChild);
			}
		}

		GanttPrinting.prototype._createPreviewErrorMessageStrip = function () {
			return new MessageStrip({
				text: this._oRb.getText("GNT_PRNTG_ERROR_BIGCHART"),
				showIcon: true,
				type: "Error"
			});
		};

		GanttPrinting.prototype._updateDialogPreviewCanvas = function () {
			var oDialogPreviewDiv = this._oHTMLDialogPreview.$().find(".sapGanttPrintingPreviewPageDiv");
			var $dialogPreviewDiv = oDialogPreviewDiv[0];

			if (this._oGanttCanvas) {
				this._oButtonExport.setEnabled(true);

				var bMultiplePage = this._oModel.getProperty("/multiplePage");
				// always return page 1 in single page mode
				var oCanvas = this._getCanvasOfPageN(bMultiplePage ? this._oModel.getProperty("/previewPageNumber") : 1, false);

				removeDialogPreviewChilds($dialogPreviewDiv);
				this._resizePrintingPreviewPage();
				$dialogPreviewDiv.appendChild(oCanvas);
			} else if (!this._oGanttCanvas && this._oClonedGanttDiv.offsetWidth > MAXCANVASSIZE) {
				this._oButtonExport.setEnabled(false);


				this._resizePrintingPreviewPage();

				if (!this._oHTMLDialogPreview.$().find("#" + this.getId() + "-previewErrorMessageStrip").length) {
					removeDialogPreviewChilds($dialogPreviewDiv);

					if (!this._oPreviewErrorMessageStrip) {
						this._oPreviewErrorMessageStrip = this._createPreviewErrorMessageStrip();
					}

					var oPreviewErrorDiv = document.createElement("div");
					oPreviewErrorDiv.id = this.getId() + "-previewErrorMessageStrip";
					oPreviewErrorDiv.style.width = "80%";
					$dialogPreviewDiv.appendChild(oPreviewErrorDiv);

					this._oPreviewErrorMessageStrip.placeAt(this.getId() + "-previewErrorMessageStrip");
				}
			} else {
				throw new Error("Gantt chart canvas does not exist.");
			}

			oDialogPreviewDiv.addClass("sapGanttPrintingPreviewPageDivBorder");
		};

		GanttPrinting.prototype._updateDialogPreview = function () {
			this._updateLastPageNumber();
			this._updatePageNumberButtons();

			this._updateDialogPreviewCanvas();
		};

		GanttPrinting.prototype._setStylesToDom = function (oSvg) {

			function explicitlySetStyle(element) {
				var cSSStyleDeclarationComputed = getComputedStyle(element);
				var i, len, key, value;
				var svgExcludedValues = ["height", "width", "min-height", "min-width"];
				var computedStyleStr = "";
				for (i = 0, len = cSSStyleDeclarationComputed.length; i < len; i++) {
					key = cSSStyleDeclarationComputed[i];
					if (!((element instanceof SVGElement) && svgExcludedValues.indexOf(key) >= 0)) {
						value = cSSStyleDeclarationComputed.getPropertyValue(key);
						computedStyleStr += key + ":" + value + ";";
					}
				}
				element.setAttribute("style", computedStyleStr);
			}

			function traverse(obj) {
				explicitlySetStyle(obj);
				visit(obj);

				function visit(node) {
					if (node && node.hasChildNodes()) {
						var child = node.firstChild;
						while (child) {
							if (child.nodeType === 1 && child.nodeName != "SCRIPT") {
								explicitlySetStyle(child);
								visit(child);
							}
							child = child.nextSibling;
						}
					}
				}
			}

			traverse(oSvg);
		};

		GanttPrinting.prototype._setStyleToGanttChartSvg = function (oGanttChart) {
			var $SvgChart = oGanttChart.$().find("svg.sapGanttChartSvg")[0];
			var $SvgChartHeader = oGanttChart.$().find("svg.sapGanttChartHeaderSvg")[0];

			if ($SvgChart) {
				this._setStylesToDom($SvgChart);
			}

			if ($SvgChartHeader) {
				this._setStylesToDom($SvgChartHeader);
			}
		};

		GanttPrinting.prototype._getHorizonDates = function (oHorizon) {
			var sAbapStartTime = oHorizon.getStartTime();
			var sAbapEndTime = oHorizon.getEndTime();
			return {
				"startTime": new Date(Format.abapTimestampToDate(sAbapStartTime)),
				"endTime": new Date(Format.abapTimestampToDate(sAbapEndTime))
			};
		};

		GanttPrinting.prototype._horizonWidthInSec = function (oVisibleHorizonDates) {
			if (oVisibleHorizonDates && oVisibleHorizonDates.startTime && oVisibleHorizonDates.endTime) {
				return oVisibleHorizonDates.endTime.getTime() - oVisibleHorizonDates.startTime.getTime();
			}

			return 0;
		};

		GanttPrinting.prototype._pageToBeExported = function () {
			// in single page mode export only the first page
			if (!this._oModel.getProperty("/multiplePage")) {
				return [1];
			}
			var iLastPageNumber = this._oModel.getProperty("/lastPageNumber"),
				bExportAll = this._oModel.getProperty("/exportAll"),
				aResultArray = [];

			if (bExportAll) {
				for (var i = 1; i <= iLastPageNumber; i++) {
					aResultArray.push(i);
				}

				return aResultArray;
			} else {
				var sExportRange = this._oModel.getProperty("/exportRange");
				sExportRange = sExportRange.replace(/\s/g, "");

				var oIntFormatter = NumberFormat.getIntegerInstance();

				var aRanges = sExportRange.split(",");
				aRanges.forEach(function (sRange) {

					// range e.g. 2-35
					if (sRange.indexOf("-") !== -1) {
						var aRange = sRange.split("-");
						var iFrom = oIntFormatter.parse(aRange[0]);
						var iTo = oIntFormatter.parse(aRange[1]);

						for (var i = iFrom; i <= iTo; i++) {
							aResultArray.push(i);
						}

					} else {  /* specific page */
						aResultArray.push(oIntFormatter.parse(sRange));
					}

				});

				return aResultArray;
			}
		};

		GanttPrinting.prototype._validateFields = function () {
			var bValidated = true;
			bValidated &= this._validateExportRangeInput();

			bValidated &= (this._oInputMarginTop.getValueState() !== "Error");
			bValidated &= (this._oInputMarginRight.getValueState() !== "Error");
			bValidated &= (this._oInputMarginBottom.getValueState() !== "Error");
			bValidated &= (this._oInputMarginLeft.getValueState() !== "Error");

			return bValidated;
		};

		GanttPrinting.prototype._savePdf = function () {
			if (!this._validateFields()) {
				return;
			}

			var sOrientation = this._oModel.getProperty("/portrait") ? "p" : "l",
				fPaperWidth = this._oModel.getProperty("/paperWidth"),
				fPaperHeight = this._oModel.getProperty("/paperHeight"),
				bExportAsJPEG = this._oModel.getProperty("/exportAsJPEG"),
				fCompressionQuality = this._oModel.getProperty("/compressionQuality") / 100,
				sPaperSize = this._oModel.getProperty("/paperSize");

			// multiply by 0.75 to convert px to pt
			var oPdf = new jsPDF({
				orientation: sOrientation,
				unit: "px",
				format: sPaperSize === "Custom" ? [fPaperWidth * 0.75, fPaperHeight * 0.75] : sPaperSize.toLowerCase()
			});

			var aPages = this._pageToBeExported();
			for (var i = 0; i < aPages.length; i++) {
				var oCanvas = this._getCanvasOfPageN(aPages[i], true);

				if (!oCanvas) {
					continue;
				}

				if (i !== 0) {
					oPdf.addPage();
				}

				if (bExportAsJPEG) {
					oPdf.addImage(oCanvas.toDataURL("image/jpeg", fCompressionQuality), "JPEG", 0, 0);
				} else {
					oPdf.addImage(oCanvas.toDataURL("image/png"), "PNG", 0, 0);
				}

			}

			var oDate = new Date();
			oPdf.save("GanttChartExport-" + oDate.toISOString() + ".pdf");
		};

		GanttPrinting.prototype._createPaperComboBox = function () {
			this._oComboBoxPaperSizes = new ComboBox({
				selectedKey: "{setting>/paperSize}",
				change: this._updatePaperSizeValues.bind(this),
				items: [
					new Item({
						key: "A5",
						text: "A5"
					}),
					new Item({
						key: "A4",
						text: "A4"
					}),
					new Item({
						key: "A3",
						text: "A3"
					}),
					new Item({
						key: "A2",
						text: "A2"
					}),
					new Item({
						key: "A1",
						text: "A1"
					}),
					new Item({
						key: "A0",
						text: "A0"
					}),
					new Item({
						key: "Letter",
						text: "Letter"
					}),
					new Item({
						key: "Legal",
						text: "Legal"
					}),
					new Item({
						key: "Tabloid",
						text: "Tabloid"
					}),
					new Item({
						key: "Custom",
						text: "Custom"
					})
				]
			});

			return this._oComboBoxPaperSizes;
		};

		GanttPrinting.prototype._createPaperSizeFields = function () {
			this._oInputPaperWidth = new Input({
				width: "20%",
				type: "Number",
				change: this._onChangePaperSizeInput.bind(this)
			});

			this._oInputPaperHeight = new Input({
				width: "20%",
				type: "Number",
				change: this._onChangePaperSizeInput.bind(this)
			});
			this._updatePaperSizeInputs();

			return new FlexBox({
				renderType: "Bare",
				alignItems: "Center",
				justifyContent: "SpaceBetween",
				items: [
					this._oInputPaperWidth,
					new Text({
						text: "×"
					}),
					this._oInputPaperHeight,
					this._oComboBoxUnit = new ComboBox({
						width: "50%",
						selectedKey: "{setting>/unit}",
						change: this._onChangeUnitComboBox.bind(this),
						items: [
							new Item({
								key: "mm",
								text: this._oRb.getText("GNT_PRNTG_MILLIMETERS")
							}),
							new Item({
								key: "cm",
								text: this._oRb.getText("GNT_PRNTG_CENTIMETERS")
							}),
							new Item({
								key: "in",
								text: this._oRb.getText("GNT_PRNTG_INCHES")
							})
						]
					})
				]
			});
		};

		GanttPrinting.prototype._createDurationComboBox = function () {
			var oTimeStrategy = this._getOriginalGanttChart().getAxisTimeStrategy(),
				oTotalHorizon = oTimeStrategy.getTotalHorizon(),
				oEndTime = new Date(Format.abapTimestampToDate(oTotalHorizon.getEndTime())),
				oDateNow = new Date();

			this._oComboBoxDuration = new ComboBox({
				selectedKey: "{setting>/duration}",
				change: this._onChangeDurationComboBox.bind(this),
				items: [
					new Item({
						key: "all",
						text: this._oRb.getText("GNT_PRNTG_DURATION_ALL")
					}),
					new Item({
						key: "week",
						enabled: this._getFirstDayOfNextWeek(oDateNow).getTime() < oEndTime.getTime(),
						text: this._oRb.getText("GNT_PRNTG_DURATION_NEXT_WEEK")
					}),
					new Item({
						key: "month",
						enabled: this._getFirstDayOfNextMonth(oDateNow).getTime() < oEndTime.getTime(),
						text: this._oRb.getText("GNT_PRNTG_DURATION_NEXT_MONTH")
					}),
					new Item({
						key: "custom",
						text: this._oRb.getText("GNT_PRNTG_DURATION_CUSTOM")
					})
				]
			});

			return this._oComboBoxDuration;
		};

		GanttPrinting.prototype._createDatePicker = function () {
			var oTimeStrategy = this._getOriginalGanttChart().getAxisTimeStrategy();
			var oTotalHorizon = oTimeStrategy.getTotalHorizon();
			var oStartTime = new Date(Format.abapTimestampToDate(oTotalHorizon.getStartTime()));
			var oEndTime = new Date(Format.abapTimestampToDate(oTotalHorizon.getEndTime()));
			this._oModel.setProperty("/startDate", oStartTime);
			this._oModel.setProperty("/endDate", oEndTime);

			this._oDatePickerFrom = new DatePicker({
				width: "47%",
				minDate: oStartTime,
				maxDate: "{setting>/endDate}",
				dateValue: "{setting>/startDate}",
				change: this._onChangeDurationDatePicker.bind(this),
				enabled: true
			});

			this._oDatePickerTo = new DatePicker({
				width: "47%",
				minDate: "{setting>/startDate}",
				maxDate: oEndTime,
				dateValue: "{setting>/endDate}",
				change: this._onChangeDurationDatePicker.bind(this),
				enabled: true
			});

			return new FlexBox({
				renderType: "Bare",
				alignItems: "Center",
				justifyContent: "SpaceBetween",
				items: [
					this._oDatePickerFrom,
					new Text({text: "~"}),
					this._oDatePickerTo
				]
			});
		};

		GanttPrinting.prototype._createScale = function () {
			return new Slider({
				min: 50,
				max: 200,
				step: 1,
				width: "25rem",
				value: "{setting>/scale}",
				visible: "{setting>/multiplePage}",
				liveChange: this._updateDialogPreview.bind(this),
				showAdvancedTooltip: true,
				inputsAsTooltips: true
			});
		};

		GanttPrinting.prototype._validateExportRangeInput = function () {
			// do not validate range field if we do not use it
			if (this._oModel.getProperty("/exportAll")) {
				return true;
			}

			var sValue = this._oModel.getProperty("/exportRange").replace(/\s/g, "");
			if (/^((\d+),|(\d+-\d+),)*((\d+)|(\d+-\d+))+$/.test(sValue)) {
				this._oInputRange.setValueState("None");
				return true;
			}

			this._oInputRange.setValueState("Error");
			this._oInputRange.setValueStateText(this._oRb.getText("GNT_PRNTG_PAGE_RANGE_ERROR"));
			return false;
		};

		GanttPrinting.prototype._createPageRange = function () {

			var fnOnChangeRadioButtonRange = function (oEvent) {
				var iSelectedButton = oEvent.getSource().getSelectedIndex();
				if (iSelectedButton === 0) { // all
					this._oButtonExport.setEnabled(true);
					this._oInputRange.setValueState("None");
				}
			};

			return new FlexBox({
				renderType: "Bare",
				alignItems: "Center",
				visible: "{setting>/multiplePage}",
				justifyContent: "SpaceBetween",
				items: [
					new RadioButtonGroup({
						layoutData: new FlexItemData({
							shrinkFactor: 0,
							growFactor: 1
						}),
						selectedIndex: this._oModel.getProperty("/exportAll") ? 0 : 1,
						columns: 2,
						select: fnOnChangeRadioButtonRange.bind(this),
						buttons: [
							new RadioButton({
								id: "all",
								text: this._oRb.getText("GNT_PRNTG_PAGE_RANGE_ALL"),
								selected: "{setting>/exportAll}"
							}),
							new RadioButton({
								id: "range",
								text: this._oRb.getText("GNT_PRNTG_PAGE_RANGE_RANGE") + " "
							})
						]
					}),
					this._oInputRange = new Input({
						layoutData: new FlexItemData({
							growFactor: 1
						}),
						value: "{setting>/exportRange}",
						change: this._validateExportRangeInput.bind(this),
						enabled: {
							path: "setting>/exportAll",
							formatter: function (bExportAll) {
								return !bExportAll;
							}
						}
					}).addStyleClass("sapGanttPrintingPageRangeInput")
				]
			});
		};

		GanttPrinting.prototype._createLabelWithSwitch = function (sText, sStateBinding) {
			return new FlexBox({
				renderType: "Bare",
				visible: "{setting>/multiplePage}",
				alignItems: "Center",
				items: [
					new Label({
						text: sText
					}),
					new Switch({
						state: sStateBinding,
						change: this._updateDialogPreviewCanvas.bind(this)
					}).addStyleClass("sapGanttPrintingSwitchPadding")
				]
			});
		};


		GanttPrinting.prototype._createCheckBoxWithInput = function (sText, bCheckBoxBinding, sValueBinding) {
			return new FlexBox({
				renderType: "Bare",
				alignItems: "Start",
				justifyContent: "SpaceBetween",
				items: [
					new CheckBox({
						selected: bCheckBoxBinding,
						text: sText,
						select: this._updateDialogPreviewCanvas.bind(this)
					}),
					new Input({
						width: "65%",
						value: sValueBinding,
						enabled: bCheckBoxBinding,
						change: this._updateDialogPreviewCanvas.bind(this)
					})
				]
			});
		};

		GanttPrinting.prototype._createPanel = function (sTitle, oContent) {
			return new Panel({
				expandable: true,
				expanded: false,
				headerText: sTitle,
				content: [
					new FlexBox({
						renderType: "Bare",
						direction: FlexDirection.Column,
						items: [
							oContent
						]
					})
				]
			});
		};

		GanttPrinting.prototype._createCompressionSlider = function () {
			return new Slider({
				min: 1,
				max: 100,
				step: 1,
				change: this._onChangeCompressionSlider.bind(this),
				value: {
					path: "setting>/compressionQuality",
					type: "sap.ui.model.type.Integer"
				},
				visible: "{setting>/exportAsJPEG}",
				showAdvancedTooltip: true,
				inputsAsTooltips: true
			});
		};

		GanttPrinting.prototype._createCompressionComboBox = function () {
			this._oComboBoxCompression = new ComboBox({
				visible: "{setting>/exportAsJPEG}",
				change: this._onChangeCompressionComboBox.bind(this),
				items: [
					new Item({
						key: "maximum",
						text: this._oRb.getText("GNT_PRNTG_COMPRESSION_MAXIMUM")
					}),
					new Item({
						key: "high",
						text: this._oRb.getText("GNT_PRNTG_COMPRESSION_HIGH")
					}),
					new Item({
						key: "medium",
						text: this._oRb.getText("GNT_PRNTG_COMPRESSION_MEDIUM")
					}),
					new Item({
						key: "low",
						text: this._oRb.getText("GNT_PRNTG_COMPRESSION_LOW")
					})
				]
			});

			// init
			var iCompressionValue = this._oModel.getProperty("/compressionQuality");
			this._setCompressionComboBoxItem(iCompressionValue);

			return this._oComboBoxCompression;
		};

		GanttPrinting.prototype._updateInputsStep = function (sUnit) {
			var fStep = 0.1;
			if (sUnit === "mm") {
				fStep = 1;
			}

			return fStep;
		};

		GanttPrinting.prototype._createMargin = function () {
			function setMaxMargin(fPaperSize) {
				// max margin is 33.3% of paper size
				return Math.round(this._convertPxToUnit(fPaperSize / 3));
			}

			return [
				new Label({
					text: this._oRb.getText("GNT_PRNTG_MARGIN") + ":"
				}),
				new ComboBox({
					change: this._onChangeMarginComboBox.bind(this),
					selectedKey: "{setting>/marginType}",
					items: [
						new Item({
							key: "default",
							text: this._oRb.getText("GNT_PRNTG_MARGIN_DEFAULT")
						}),
						new Item({
							key: "none",
							text: this._oRb.getText("GNT_PRNTG_MARGIN_NONE")
						}),
						new Item({
							key: "custom",
							text: this._oRb.getText("GNT_PRNTG_MARGIN_CUSTOM")
						})
					]
				}),
				new FlexBox({
					renderType: "Bare",
					alignItems: "Center",
					visible: {
						path: "setting>/marginType",
						formatter: function (sMarginType) {
							return sMarginType === "custom";
						}
					},
					items: [
						new FlexBox({
							direction: FlexDirection.Column,
							layoutData: new FlexItemData({
								shrinkFactor: 0,
								growFactor: 0,
								baseSize: "8rem"
							}),
							items: [
								new Label({
									text: this._oRb.getText("GNT_PRNTG_MARGIN_TOP")
								}),
								this._oInputMarginTop = new StepInput({
									min: 0,
									step: {
										path: "setting>/unit",
										formatter: this._updateInputsStep
									},
									displayValuePrecision: 1,
									change: this._onChangeMarginInput.bind(this),
									value: this._convertPxToUnit(this._oModel.getProperty("/marginTop")),
									fieldWidth: "7rem",
									validationMode: "LiveChange",
									valueStateText: this._oRb.getText("GNT_PRNTG_MARGIN_HEIGHT_ERROR"),
									max: {
										parts: [
											{path: "setting>/paperHeight"},
											{path: "setting>/unit"}
										],
										formatter: setMaxMargin.bind(this)
									},
									description: "{setting>/unit}"
								}).addStyleClass("sapGanttPrintingBottomMargin"),
								new Label({
									text: this._oRb.getText("GNT_PRNTG_MARGIN_LEFT")
								}),
								this._oInputMarginLeft = new StepInput({
									min: 0,
									step: {
										path: "setting>/unit",
										formatter: this._updateInputsStep
									},
									displayValuePrecision: 1,
									change: this._onChangeMarginInput.bind(this),
									value: this._convertPxToUnit(this._oModel.getProperty("/marginLeft")),
									fieldWidth: "7rem",
									validationMode: "LiveChange",
									valueStateText: this._oRb.getText("GNT_PRNTG_MARGIN_WIDTH_ERROR"),
									max: {
										parts: [
											{path: "setting>/paperWidth"},
											{path: "setting>/unit"}
										],
										formatter: setMaxMargin.bind(this)
									},
									description: "{setting>/unit}"
								})
							]
						}),
						new FlexBox({
							direction: FlexDirection.Column,
							layoutData: new FlexItemData({
								shrinkFactor: 0,
								growFactor: 0,
								baseSize: "8rem"
							}),
							items: [
								new Label({
									text: this._oRb.getText("GNT_PRNTG_MARGIN_BOTTOM")
								}),
								this._oInputMarginBottom = new StepInput({
									min: 0,
									step: {
										path: "setting>/unit",
										formatter: this._updateInputsStep
									},
									displayValuePrecision: 1,
									change: this._onChangeMarginInput.bind(this),
									value: this._convertPxToUnit(this._oModel.getProperty("/marginBottom")),
									fieldWidth: "7rem",
									validationMode: "LiveChange",
									valueStateText: this._oRb.getText("GNT_PRNTG_MARGIN_HEIGHT_ERROR"),
									max: {
										parts: [
											{path: "setting>/paperHeight"},
											{path: "setting>/unit"}
										],
										formatter: setMaxMargin.bind(this)
									},
									description: "{setting>/unit}"
								}).addStyleClass("sapGanttPrintingBottomMargin"),
								new Label({
									text: this._oRb.getText("GNT_PRNTG_MARGIN_RIGHT")
								}),
								this._oInputMarginRight = new StepInput({
									min: 0,
									step: {
										path: "setting>/unit",
										formatter: this._updateInputsStep
									},
									displayValuePrecision: 1,
									change: this._onChangeMarginInput.bind(this),
									value: this._convertPxToUnit(this._oModel.getProperty("/marginRight")),
									fieldWidth: "7rem",
									validationMode: "LiveChange",
									valueStateText: this._oRb.getText("GNT_PRNTG_MARGIN_WIDTH_ERROR"),
									max: {
										parts: [
											{path: "setting>/paperWidth"},
											{path: "setting>/unit"}
										],
										formatter: setMaxMargin.bind(this)
									},
									description: "{setting>/unit}"
								})
							]
						}).addStyleClass("sapGanttPrintingLeftMargin"),
						new Button({
							icon: {
								path: "setting>/marginLocked",
								formatter: function (bMarginLocked) {
									if (bMarginLocked) {
										return "sap-icon://chain-link";
									}
									return "sap-icon://broken-link";
								}
							},
							press: function () {
								var bMarginLocked = this._oModel.getProperty("/marginLocked");
								this._oModel.setProperty("/marginLocked", !bMarginLocked);
							}.bind(this),
							type: "Transparent"
						}).addStyleClass("sapGanttPrintingLockButton sapGanttPrintingLeftMargin")
					]
				}).addStyleClass("sapGanttPrintingTopMargin sapGanttPrintingTopMargin")
			];
		};

		GanttPrinting.prototype._createCropMarks = function () {
			return [
				new Switch({
					state: "{setting>/cropMarks}"
				}),
				new FlexBox({
					renderType: "Bare",
					visible: "{setting>/cropMarks}",
					items: [
						new FlexBox({
							direction: FlexDirection.Column,
							layoutData: new FlexItemData({
								shrinkFactor: 0,
								growFactor: 0,
								baseSize: "8rem"
							}),
							items: [
								new Label({text: "Weight:"}),
								new StepInput({
									min: 0,
									step: 0.05,
									displayValuePrecision: 2,
									value: "{setting>/cropMarksWeight}",
									fieldWidth: "7rem",
									description: "pt"
								})
							]
						}),
						new FlexBox({
							direction: FlexDirection.Column,
							layoutData: new FlexItemData({
								shrinkFactor: 0,
								growFactor: 0,
								baseSize: "8rem"
							}),
							items: [
								new Label({text: "Offset:"}),
								this._oInputCropMarksOffset = new StepInput({
									min: 0,
									step: {
										path: "setting>/unit",
										formatter: this._updateInputsStep
									},
									displayValuePrecision: 1,
									change: this._onChangeCropMarksInput.bind(this),
									value: this._convertPxToUnit(this._oModel.getProperty("/cropMarksOffset")),
									fieldWidth: "7rem",
									description: "{setting>/unit}"
								})
							]
						}).addStyleClass("sapGanttPrintingLeftMargin")
					]
				}).addStyleClass("sapGanttPrintingTopMargin")
			];
		};

		GanttPrinting.prototype._createCompression = function () {
			// radio button group init
			var bExportAsJPEG = this._oModel.getProperty("/exportAsJPEG");

			return [
				new Label({
					text: this._oRb.getText("GNT_PRNTG_EXPORT_TYPES")
				}),
				new RadioButtonGroup({
					columns: 2,
					selectedIndex: bExportAsJPEG ? 0 : 1,
					buttons: [
						new RadioButton({
							id: "jpeg",
							text: "JPEG",
							selected: "{setting>/exportAsJPEG}"
						}),
						new RadioButton({
							id: "png",
							text: "PNG"
						})
					]
				}).addStyleClass("sapGanttPrintingBottomMargin"),
				new Label({
					text: this._oRb.getText("GNT_PRNTG_COMPRESSION_QUALITY"),
					visible: "{setting>/exportAsJPEG}"
				}),
				this._createCompressionComboBox(),
				this._createCompressionSlider().addStyleClass("sapGanttPrintingTopMargin sapGanttPrintingBottomMargin"),
				new MessageStrip({
					text: this._oRb.getText("GNT_PRNTG_COMPRESSION_PNG_WARNING"),
					showIcon: true,
					type: "Warning",
					visible: {
						path: "setting>/exportAsJPEG",
						type: "sap.ui.model.type.Boolean",
						formatter: function (bExportAsJPEG) {
							return !bExportAsJPEG;
						}
					}
				}).addStyleClass("sapGanttPrintingBottomMargin")
			];
		};

		GanttPrinting.prototype._createOptionsForm = function () {
			return new FlexBox({
				renderType: "Bare",
				direction: FlexDirection.Column,
				items: [
					new Label({
						text: this._oRb.getText("GNT_PRNTG_EXPORT_TYPES")
					}),
					new RadioButtonGroup({
						columns: 2,
						selectedIndex: this._oModel.getProperty("/multiplePage") ? 0 : 1,
						select: this._onChangeExportTypes.bind(this),
						buttons: [
							new RadioButton({
								id: "Multiple",
								text: this._oRb.getText("GNT_PRNTG_MULTIPLE_PAGE"),
								selected: "{setting>/multiplePage}"
							}),
							new RadioButton({
								id: "Single",
								text: this._oRb.getText("GNT_PRNTG_SINGLE_PAGE")
							})
						]
					}).addStyleClass("sapGanttPrintingBottomMargin"),
					new Label({
						text: this._oRb.getText("GNT_PRNTG_ORIENTATION")
					}),
					this._radioGroupOrientation = new RadioButtonGroup({
						columns: 2,
						selectedIndex: this._oModel.getProperty("/portrait") ? 0 : 1,
						select: this._onChangeOrientation.bind(this),
						buttons: [
							new RadioButton({
								id: "Portrait",
								text: this._oRb.getText("GNT_PRNTG_PORTRAIT"),
								selected: "{setting>/portrait}"
							}),
							new RadioButton({
								id: "Landscape",
								text: this._oRb.getText("GNT_PRNTG_LANDSCAPE")
							})
						]
					}).addStyleClass("sapGanttPrintingBottomMargin"),
					new Label({
						text: this._oRb.getText("GNT_PRNTG_PAPER_SIZE")
					}),
					this._createPaperComboBox(),
					this._createPaperSizeFields().addStyleClass("sapGanttPrintingBottomMargin"),

					new Label({
						text: this._oRb.getText("GNT_PRNTG_DURATION")
					}),
					this._createDurationComboBox(),
					this._createDatePicker().addStyleClass("sapGanttPrintingBottomMargin"),

					new Label({
						text: this._oRb.getText("GNT_PRNTG_SCALE"),
						visible: "{setting>/multiplePage}"
					}),
					this._createScale().addStyleClass("sapGanttPrintingBottomMargin"),

					new Label({
						text: this._oRb.getText("GNT_PRNTG_PAGE_RANGE"),
						visible: "{setting>/multiplePage}"
					}),
					this._createPageRange().addStyleClass("sapGanttPrintingBottomMargin"),

					// TODO add this feature
					// this._createLabelWithSwitch(this._oRb.getText("GNT_PRNTG_REPEAT_TABLE"), "{setting>/repeatSelectionPanel}").addStyleClass("sapGanttPrintingBottomMargin"),
					// new MessageStrip({
					// 	text: "The table cannot occupy more than 50% of its width on the format. Please change Gantt chart settings - shrink table width.",
					// 	showIcon: true,
					// 	type: "Error",
					// 	visible: false
					// }).addStyleClass("sapGanttPrintingBottomMargin"),

					new Label({
						text: this._oRb.getText("GNT_PRNTG_HEADER_AND_FOOTER")
					}),
					this._createCheckBoxWithInput(this._oRb.getText("GNT_PRNTG_HEADER"), "{setting>/showHeaderText}", "{setting>/headerText}"),
					this._createCheckBoxWithInput(this._oRb.getText("GNT_PRNTG_FOOTER"), "{setting>/showFooterText}", "{setting>/footerText}").addStyleClass("sapGanttPrintingBottomMargin"),

					this._createLabelWithSwitch(this._oRb.getText("GNT_PRNTG_SHOW_PAGE_NUMBER"), "{setting>/showPageNumber}").addStyleClass("sapGanttPrintingBottomMargin"),

					this._createPanel(this._oRb.getText("GNT_PRNTG_MARGIN"), this._createMargin()),
					// TODO add crop marks feature
					// this._createPanel("Crop marks", this._createCropMarks()),
					this._createPanel(this._oRb.getText("GNT_PRNTG_COMPRESSION"), this._createCompression())
				]
			});
		};

		GanttPrinting.prototype._createDialogContent = function () {
			var oDialogContent = new FlexBox({
				renderType: "Bare",
				fitContainer: true,
				items: [
					this._oFlexBoxPreview = new FlexBox({
						renderType: "Bare",
						layoutData: new FlexItemData({
							shrinkFactor: 1,
							growFactor: 1,
							baseSize: "auto"
						}),
						direction: FlexDirection.Column,
						items: [
							new FlexBox({
								renderType: "Bare",
								layoutData: new FlexItemData({
									shrinkFactor: 0,
									growFactor: 0,
									baseSize: "3.5rem"
								})
							}),
							this._oHTMLDialogPreview = new HTML({
								content: "<div class=\"sapGanttPrintingPreviewContentDiv\"><div class=\"sapGanttPrintingPreviewPageDiv\"></div></div>"
							}),
							new FlexBox({
								renderType: "Bare",
								justifyContent: "Center",
								alignItems: "Center",
								layoutData: new FlexItemData({
									shrinkFactor: 0,
									growFactor: 0,
									baseSize: "6rem"
								}),
								items: [
									this._oButtonFirst = new Button({
										icon: "sap-icon://close-command-field",
										visible: "{setting>/multiplePage}",
										press: this._onPressButtonFirst.bind(this),
										type: "Transparent"
									}).addStyleClass("sapGanttPrintingPreviewIconMarginRight"),
									this._oButtonPrevious = new Button({
										icon: "sap-icon://navigation-left-arrow",
										visible: "{setting>/multiplePage}",
										press: this._onPressButtonPrevious.bind(this),
										type: "Transparent"
									}),
									new Text({
										textAlign: "Center",
										visible: "{setting>/multiplePage}",
										width: "7.25rem",
										text: {
											parts: [
												{path: "setting>/previewPageNumber"},
												{path: "setting>/lastPageNumber"}
											],
											formatter: function (iPageNumber, iLastPageNumber) {
												return iLastPageNumber ? this._oRb.getText("GNT_PRNTG_OF", [iPageNumber, iLastPageNumber]) : iPageNumber.toString();
											}.bind(this)
										}
									}).addStyleClass("sapGanttPrintingPreviewText"),
									this._oButtonNext = new Button({
										icon: "sap-icon://navigation-right-arrow",
										visible: "{setting>/multiplePage}",
										press: this._onPressButtonNext.bind(this),
										type: "Transparent"
									}).addStyleClass("sapGanttPrintingPreviewIconMarginRight"),
									this._oButtonLast = new Button({
										icon: "sap-icon://open-command-field",
										visible: "{setting>/multiplePage}",
										press: this._onPressButtonLast.bind(this),
										type: "Transparent"
									})
								]
							}).addStyleClass("sapGanttPrintingPreviewFooter")
						]
					}).addStyleClass("sapGanttPrintingPreviewContent"),
					new ScrollContainer({
						horizontal: false,
						vertical: true,
						layoutData: new FlexItemData({
							shrinkFactor: 0,
							growFactor: 0,
							baseSize: "27rem"
						}),
						content: [
							this._createOptionsForm().addStyleClass("sapGanttPrintingDialogSettings")
						]
					})
				]
			});

			this._updatePageNumberButtons();

			return oDialogContent;
		};

		GanttPrinting.prototype._createAndOpenDialog = function () {
			this._oDialog = new Dialog({
				title: this._oRb.getText("GNT_PRNTG_PDF_EXPORT_TITLE"),
				contentWidth: "100%",
				contentHeight: "100%",
				horizontalScrolling: false,
				verticalScrolling: false,
				content: [
					this._createDialogContent()
				],

				buttons: [
					this._oButtonExport = new Button({
						text: this._oRb.getText("GNT_PRNTG_EXPORT"),
						type: MobileLibrary.ButtonType.Emphasized,
						press: this.export.bind(this)
					}),
					// TODO add this feature
					// new Button({
					// 	text: "Save preset",
					// 	press: function () {
					// 		this.savePreset();
					// 	}.bind(this)
					// }),
					new Button({
						text: this._oRb.getText("GNT_PRNTG_CANCEL"),
						press: function () {
							this.close();
						}.bind(this)
					})
				]
			}).addStyleClass("sapGanttPrintingDialog");

			this._oDialog.onsapescape = function (oEvent) {
				this.close();
				oEvent.preventDefault();
				oEvent.stopPropagation();
			}.bind(this);
			this._oDialog.setModel(this._oModel, "setting");
			this._oDialog.open();

			this._sResizeHandlerId = ResizeHandler.register(this._oDialog, this._onResize.bind(this));
		};

		return GanttPrinting;
	});
