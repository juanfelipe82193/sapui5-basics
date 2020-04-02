/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2019 SAP SE. All rights reserved
 */
/* global sap, jQuery, QUnit, sinon */

sap.ui.define([
	"sap/apf/testhelper/baseClass/baseUI5ChartRepresentation",
	"sap/apf/testhelper/config/representationHelper",
	"sap/apf/testhelper/doubles/createUiApiAsPromise",
	"sap/apf/ui/representations/RepresentationInterfaceProxy",
	"sap/apf/testhelper/odata/sampleService",
	"sap/apf/ui/representations/table",
	"sap/apf/ui/representations/utils/representationFilterHandler",
	"sap/m/ViewSettingsDialog",
	"sap/ui/table/VisibleRowCountMode"
], function(
	BaseUI5ChartRepresentationTestHelper,
	RepresentationHelper,
	createUiApiAsPromise,
	RepresentationInterfaceProxy,
	sampleService,
	Table,
	RepresentationFilterHandler,
	ViewSettingsDialog,
	VisibleRowCountMode
) {
	'use strict';

	/*BEGIN_COMPATIBILITY*/
	sampleService = sampleService || sap.apf.testhelper.odata.getSampleService;
	RepresentationFilterHandler = RepresentationFilterHandler || sap.apf.ui.representations.utils.RepresentationFilterHandler;
	VisibleRowCountMode = VisibleRowCountMode || sap.ui.table.VisibleRowCountMode;
	/*END_COMPATIBILITY*/

	var representationHelper = RepresentationHelper.prototype;
	function _getSelectedSortItem(oViewSettingDialog) {
		var oSortOption = {};
		var oSelectedSortItem = oViewSettingDialog.getSelectedSortItem();
		oViewSettingDialog.getSortItems().forEach(function (oSortItem) {
			if (oSortItem.getId() === oSelectedSortItem) {
				oSortOption.property = oSortItem.getKey();
				oSortOption.ascending = !oViewSettingDialog.getSortDescending();
			}
		});
		return oSortOption;
	}
	function _firePagination(tableInstance) {
		tableInstance.setFirstVisibleRow(100);
	}
	function _destroyViewSettingDialog() {
		var viewSettingDialog = _getDialogByEmptyTitle();
		if (viewSettingDialog !== undefined && viewSettingDialog.isOpen()) {
			viewSettingDialog.destroy();
		}
	}
	function _getDialogByEmptyTitle() {
		sap.ui.getCore().applyChanges();
		var oExpectedDialog;
		jQuery.each(jQuery('.sapMDialog'), function (name, element) {
			var oDialog = sap.ui.getCore().byId(element.getAttribute("id"));
			if (oDialog.getTitle() === "") {
				oExpectedDialog = oDialog;
			}
		});
		return oExpectedDialog;
	}
	function _createMainContentAndViewSettingDialog(tableRepresentation) {
		var mainContent = tableRepresentation.getMainContent("Table with Filter", 600, 600);
		var oViewSettingDialog = tableRepresentation.getViewSettingDialog();
		oViewSettingDialog.setSelectedSortItem(oViewSettingDialog.getSortItems()[0]);
		return {
			mainContent: mainContent,
			oViewSettingDialog: oViewSettingDialog
		};
	}
	function _createMainContentAndViewSettingDialogUndefinedSortProperty(tableRepresentation) {
		var mainContent = tableRepresentation.getMainContent("Table with Filter", 600, 600);
		var oViewSettingDialog = tableRepresentation.getViewSettingDialog();
		return {
			mainContent: mainContent,
			oViewSettingDialog: oViewSettingDialog
		};
	}
	function _getDataPointForSelection() {
		return [{
			data: {
				"Year Month": "201312",
				"Days Sales Outstanding": "55.22"
			}
		}, {
			data: {
				"Year Month": "201311",
				"Days Sales Outstanding": "40.3"
			}
		}];
	}
	function _placeTableAtDom(oDataTableScrollContainer) {
		var divToPlaceTable = document.createElement("div");
		divToPlaceTable.setAttribute('id', 'contentOfTable');
		document.body.appendChild(divToPlaceTable);
		oDataTableScrollContainer.placeAt("contentOfTable", "only");
		sap.ui.getCore().applyChanges();
	}
	function _removeTableFromDom() {
		document.body.removeChild(document.getElementById('contentOfTable'));
	}
	function _commonSetupForCreatingTable(api, requiredParameter, topCount) {
		var interfaceProxy = new RepresentationInterfaceProxy(api.oCoreApi, api.oUiApi);
		var tableRepresentation = new Table(interfaceProxy, requiredParameter);
		var aTableData = BaseUI5ChartRepresentationTestHelper.getSampleData(api);
		if (topCount) {
			aTableData = aTableData.slice(0, topCount);
		}
		tableRepresentation.setData(aTableData, BaseUI5ChartRepresentationTestHelper.getSampleMetadata(), 999);
		return tableRepresentation;
	}
	function _commonAttachingPagination(tableRepresentation, isAlternateTable) {
		if (!isAlternateTable) {
			tableRepresentation.nDataResponseCount = tableRepresentation.getData().length;
		}
		var oTable = tableRepresentation.getMainContent("Table for pagination");
		_placeTableAtDom(oTable);
	}
	function _commonAssertsForTableWithNoFilter(api, tableRepresentation, assert, requiredParameter) {
		//arrange
		var oExpectedParameter = tableRepresentation.getParameter();
		var expectedData = tableRepresentation.getData();
		var expectedMetadata = tableRepresentation.getMetaData();
		var expectedRequestOptions = tableRepresentation.getRequestOptions();
		//act
		var mainContent = tableRepresentation.getMainContent("Table Without Filter");
		var oTable = mainContent.getItems()[0];
		//assert
		assert.deepEqual(requiredParameter, oExpectedParameter, "Then correct parameter is set on the table when diamnsions & measures are used as table column");
		assert.deepEqual(BaseUI5ChartRepresentationTestHelper.getSampleData(api), expectedData, "Then correct data is set on the table");
		assert.deepEqual(tableRepresentation.aDataResponse, expectedData, "Then correct data is assigned to the data response");
		assert.deepEqual(tableRepresentation.metadata, expectedMetadata, "Then Correct metadata is assigned to the table");
		assert.deepEqual(expectedRequestOptions.paging.top, 100, "Then Top 100 records have to be fetched when the request is fired for the first time");
		assert.deepEqual(expectedRequestOptions.paging.skip, 0, "Then No record is skipped when the request is fired for the first time");
		assert.deepEqual(oTable.getModel().getData().tableData, BaseUI5ChartRepresentationTestHelper.getSampleData(api), "Then the data is correctly set on the data table");
		assert.deepEqual(oTable.getColumns().length, oTable.getColumns().length, "Then Data table and header tables have same columns");
		//check the header for table
		assert.strictEqual(oTable.getColumns()[0].getLabel().getText(), BaseUI5ChartRepresentationTestHelper.getSampleMetadata().getPropertyMetadata("YearMonth").label, "Then correct header is set to the first column not aligned with unit");
		assert.strictEqual(oTable.getColumns()[0].getHAlign(), "Begin", "Then since YearMonth is a dimension property so HAlign is set it as Begin");
		assert.strictEqual(oTable.getColumns()[0].getTemplate().getBindingPath("text"), "YearMonth", "Then YearMonth is set as text property for the column");
		assert.strictEqual(oTable.getColumns()[0].getTemplate().getWrapping(), false, "Then the cells in the column don't have a wrapping");
		assert.strictEqual(oTable.getColumns()[0].getTemplate().getBindingPath("tooltip"), "YearMonth", "Then YearMonth is set as tooltip property for the column");
		assert.strictEqual(oTable.getColumns()[1].getLabel().getText(), BaseUI5ChartRepresentationTestHelper.getSampleMetadata().getPropertyMetadata("DaysSalesOutstanding").label, "Then correct header is set to the second column ");
		assert.strictEqual(oTable.getColumns()[1].getHAlign(), "End", "Then since Days Sales Oustanding is a measure property so HAlign is set it as End");
		assert.strictEqual(oTable.getSelectionMode(), "None", "Then selection mode is set to none for the table when there is no required filter");
		//visible row count mode
		assert.strictEqual(oTable.getVisibleRowCountMode(), VisibleRowCountMode.Auto, "then correct visible count row mode is set to the table");
	}
	function _commonAssertsForTableWithFilter(tableRepresentation, assert, requiredParameter) {
		// arrange
		var oExpectedParameter = tableRepresentation.getParameter();
		var expectedOrderby = tableRepresentation.getParameter().orderby;
		var expectedRequestOptions = tableRepresentation.getRequestOptions();
		//assert
		assert.deepEqual(requiredParameter, oExpectedParameter, "Then correct parameter is set on the table when properties are used as table column");
		assert.deepEqual(expectedRequestOptions.orderby, expectedOrderby, "Then correct sorting options are included in the request");
	}
	function _commonAssertsForTableInstanceAfterDestroy(assert, tableRepresentation) {
		assert.strictEqual(tableRepresentation.aDataResponse, null, "After destroy dataset is null");
		assert.strictEqual(tableRepresentation.orderby, undefined, " After destroy orderby is an empty array");
		assert.strictEqual(tableRepresentation.oParameter, null, " After destroy oParameter is an empty array ");
		assert.strictEqual(tableRepresentation.oViewSettingDialog, undefined, " After destroy oViewSetting dialog is undefined ");
	}

	BaseUI5ChartRepresentationTestHelper.run(Table);

	QUnit.module("Table Tests - When there is no required filter on the table", {
		beforeEach: function (assert) {
			var testEnv = this;
			var done = assert.async();
			createUiApiAsPromise().done(function (api) {
				testEnv.api = api;
				testEnv.requiredParameter = representationHelper.representationDataWithDimension();
				testEnv.tableRepresentation = _commonSetupForCreatingTable(api, testEnv.requiredParameter);
				//spy
				testEnv.spyOfGetText = sinon.spy(testEnv.tableRepresentation.oApi, "getTextNotHtmlEncoded");
				done();
			});
		},
		afterEach: function () {
			//restore
			this.spyOfGetText.restore();
			this.api.oCompContainer.destroy();
		}
	});
	QUnit.test("When table is initialized and it has no required filter", function (assert) {
		//assert
		_commonAssertsForTableWithNoFilter(this.api, this.tableRepresentation, assert, representationHelper.representationDataWithDimension());
		assert.strictEqual(this.spyOfGetText.calledWith("displayUnit", ["Revenue", "USD"]), true, "then header is aligned with its respective unit as the unit value is same for all data");
	});
	QUnit.test("When getViewSettingDialog is called for the table", function (assert) {
		var oMainContentViewSetting = _createMainContentAndViewSettingDialog(this.tableRepresentation);
		assert.strictEqual(oMainContentViewSetting.oViewSettingDialog instanceof ViewSettingsDialog, true, "Then View setting dialog is created");
		assert.strictEqual(oMainContentViewSetting.oViewSettingDialog.getSortItems().length, 3, "Then View setting dialog has one sort item");
		var expectedRequestOptions = this.tableRepresentation.getRequestOptions();
		var expectedOrderby = _getSelectedSortItem(oMainContentViewSetting.oViewSettingDialog);
		assert.deepEqual(expectedRequestOptions.orderby[0], expectedOrderby, "Then correct sorting options are included in the request");
	});
	QUnit.test("When filters are serialized and deserialized with empty value", function (assert) {
		//arrange
		var expectedFilterValue = [{
			"data": {}
		}];
		//act
		this.tableRepresentation.deserialize({
			oFilter: [{
				data: {}
			}]
		});
		//assert
		assert.deepEqual(this.tableRepresentation.oRepresentationFilterHandler.getFilterValues(), expectedFilterValue, "Then nothing has been seleted so deserialized value is empty");
		assert.deepEqual(this.tableRepresentation.oRepresentationFilterHandler.getFilterValues(), this.tableRepresentation.serialize().oFilter, "Then nothing has been seleted so serialized value is empty");
	});
	QUnit.test("When filters are serialized and deserialized with filter value", function (assert) {
		//act
		this.tableRepresentation.deserialize({
			oFilter: [{
				data: {
					"Year Month": "201312",
					"Days Sales Outstanding": "55.22"
				}
			}, {
				data: {
					"Year Month": "201311",
					"Days Sales Outstanding": "40.3"
				}
			}]
		});
		//assert
		assert.deepEqual(this.tableRepresentation.oRepresentationFilterHandler.getFilterValues(), _getDataPointForSelection(), "Then two points got selected so selescted point is deserialized");
		assert.deepEqual(this.tableRepresentation.oRepresentationFilterHandler.getFilterValues(), this.tableRepresentation.serialize().oFilter, "Then two points got selected so selected point is serialised");
	});
	QUnit.test("When table is destroyed", function (assert) {
		//act
		this.tableRepresentation.destroy();
		//assert
		_commonAssertsForTableInstanceAfterDestroy(assert, this.tableRepresentation);
	});
	QUnit.test("When table is destroyed and onAfterRendering is called for table", function (assert) {
		//spy
		var spyMarkSelectionInTable = sinon.spy(this.tableRepresentation, "markSelectionInTable");
		//arrange
		var oTable = this.tableRepresentation.getMainContent("Table with Filter", 600, 600);
		//act
		this.tableRepresentation.destroy();
		oTable.rerender();
		//assert
		_commonAssertsForTableInstanceAfterDestroy(assert, this.tableRepresentation);
		assert.strictEqual(spyMarkSelectionInTable.called, false, "then spyMarkSelectionInTable is not called twice for the table");
		//restore
		spyMarkSelectionInTable.restore();
	});
	QUnit.module("Table Tests - When unit has multiple values", {
		beforeEach: function (assert) {
			var testEnv = this;
			var done = assert.async();
			createUiApiAsPromise().done(function (api) {
				testEnv.api = api;
				testEnv.requiredParameter = representationHelper.representatationDataWithDimensionAndUnit();
				testEnv.tableRepresentation = _commonSetupForCreatingTable(api, testEnv.requiredParameter);
				//spy
				testEnv.spyOfGetText = sinon.spy(testEnv.tableRepresentation.oApi, "getTextNotHtmlEncoded");
				done();
			});
		},
		afterEach: function () {
			//restore
			this.spyOfGetText.restore();
			this.api.oCompContainer.destroy();
		}
	});
	QUnit.test("When table is initialized", function (assert) {
		//assert
		_commonAssertsForTableWithNoFilter(this.api, this.tableRepresentation, assert, representationHelper.representatationDataWithDimensionAndUnit());
		assert.strictEqual(this.spyOfGetText.callCount, 4, "THEN four calls for getting the title and the button texts");
		assert.equal(this.spyOfGetText.calledWith("stepTitleWithNumberOfRecords"), true, "Then called with text for title");
		assert.equal(this.spyOfGetText.calledWith("buttonTextExport"), true, "Then called with button text for excel export");
		assert.equal(this.spyOfGetText.calledWith("buttonTextLoadAll"), true, "Then called with button text for load all");
		assert.equal(this.spyOfGetText.calledWith("moreIcon"), true, "THEN called with link more");
	});
	QUnit.module("Table Tests - When there is a required filter on the table", {
		beforeEach: function (assert) {
			var that = this;
			function getActiveStepStub() {
				var oActiveStep = {};
				oActiveStep.getSelectedRepresentation = function () {
					var oRepresentationFilterHandler = new RepresentationFilterHandler(that.tableRepresentation.oApi, {
						requiredFilters: []
					});
					return {
						oRepresentationFilterHandler: oRepresentationFilterHandler
					};
				};
				return oActiveStep;
			}
			function getUiApiStub() {
				var oUiApi = {};
				oUiApi.getStepContainer = function () {
					return undefined;
				};
				return oUiApi;
			}
			var done = assert.async();
			createUiApiAsPromise().done(function (api) {
				that.api = api;
				that.requiredParameter = representationHelper.representatationDataForAlternateRep();
				that.tableRepresentation = _commonSetupForCreatingTable(api, that.requiredParameter);
				//stub
				sinon.stub(that.tableRepresentation.oApi, "getActiveStep", getActiveStepStub);
				sinon.stub(that.tableRepresentation.oApi, "getUiApi", getUiApiStub);
				done();
			});
		},
		afterEach: function () {
			//restore
			this.tableRepresentation.oApi.getActiveStep.restore();
			this.tableRepresentation.oApi.getUiApi.restore();
			this.api.oCompContainer.destroy();
		}
	});
	QUnit.test("When table is initialized and it has a required filter", function (assert) {
		//assert
		_commonAssertsForTableWithFilter(this.tableRepresentation, assert, this.requiredParameter);
	});
	QUnit.test("When last row is selected in the table", function (assert) {
		//arrange
		var oTable = this.tableRepresentation.getMainContent().getItems()[0];
		//act - select last items on the table
		var nExpectedFirstVisibleRow = oTable.getFirstVisibleRow();
		oTable.setSelectedIndex(oTable.getModel().getData().tableData.length - 1);
		//assert
		assert.strictEqual(oTable.getFirstVisibleRow(), nExpectedFirstVisibleRow, "then first visible row is same after selection is made on the last row");
	});
	QUnit.module("getPrintContent", {
		beforeEach : function(assert) {
			var done = assert.async();
			createUiApiAsPromise().done(function(api) {
				this.oGlobalApi = api;
				this.representationHelper = RepresentationHelper.prototype;
				var oRequiredParamter = representationHelper.representatationDataForAlternateRep();
				this.oTableRepresentation = _commonSetupForCreatingTable(api, oRequiredParamter);
				var mainContent = this.oTableRepresentation.getMainContent("Table with Filter", 600, 600);
				mainContent.placeAt("testArea");
				sap.ui.getCore().applyChanges();
				done();
			}.bind(this));
		},
		afterEach : function(){
			this.oTableRepresentation.tableControl.destroy();
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	QUnit.test("getPrintContent", function(assert) {
		var oTable = this.oTableRepresentation.tableControl;
		var printTable = this.oTableRepresentation.getPrintContent().oRepresentation;
		assert.strictEqual(printTable.getMetadata().getElementName(), "sap.ui.table.Table", "PrintContent contains a table");
		assert.notEqual(oTable, printTable, "PrintContent table is a copy of the existing table");
		assert.strictEqual(oTable.getTitle().getItems()[0].getText(), printTable.getTitle().getItems()[0].getText(), "PrintTable has same title as normal table");
		assert.equal(oTable.getModel(), printTable.getModel(), "PrintTable has same model as normal table");
		assert.strictEqual(printTable.getVisibleRowCountMode(), VisibleRowCountMode.Fixed, "PrintTable has a fixed visible rowCountMode");
		assert.strictEqual(printTable.getVisibleRowCount(), 403, "PrintTable has a row count of the data length of the oModel");
	});
	QUnit.test("getPrintContent with selections", function(assert) {
		var oTable = this.oTableRepresentation.tableControl;
		oTable.addSelectionInterval(1,1);
		oTable.addSelectionInterval(3,3);
		var printTable = this.oTableRepresentation.getPrintContent().oRepresentation;
		printTable.placeAt("testArea");
		sap.ui.getCore().applyChanges(); // render
		assert.strictEqual(printTable.getRows()[0].$().hasClass("sapTableSelectionForPrint"), false, "1st row is not shown as selected");
		assert.strictEqual(printTable.getRows()[1].$().hasClass("sapTableSelectionForPrint"), true, "2nd row is shown as selected");
		assert.strictEqual(printTable.getRows()[2].$().hasClass("sapTableSelectionForPrint"), false, "3rd row is not shown as selected");
		assert.strictEqual(printTable.getRows()[3].$().hasClass("sapTableSelectionForPrint"), true, "4th row is shown as selected");
		printTable.destroy();
	});
	QUnit.module("When there is a required filter on the table - Manual selection", {
		beforeEach : function(assert) {
			var that = this;
			function getActiveStepStub() {
				var oActiveStep = {};
				oActiveStep.getSelectedRepresentation = function() {
					var oRepresentationFilterHandler = new RepresentationFilterHandler(that.oTableRepresentation.oApi, {
						requiredFilters : []
					});
					return {
						oRepresentationFilterHandler : oRepresentationFilterHandler
					};
				};
				return oActiveStep;
			}
			function getUiApiStub() {
				var oUiApi = {};
				oUiApi.getStepContainer = function() {
					return undefined;
				};
				return oUiApi;
			}
			var done = assert.async();
			createUiApiAsPromise().done(function(api) {
				that.oGlobalApi = api;
				var representationHelper = RepresentationHelper.prototype;
				var oRequiredParamter = representationHelper.representatationDataForAlternateRep();
				that.oTableRepresentation = _commonSetupForCreatingTable(api, oRequiredParamter);
				var mainContent = that.oTableRepresentation.getMainContent("Table with Filter", 600, 600);
				sinon.stub(that.oTableRepresentation.oApi, "getActiveStep", getActiveStepStub);
				sinon.stub(that.oTableRepresentation.oApi, "getUiApi", getUiApiStub);
				_placeTableAtDom(mainContent);
				that.oEvent = {
					getSource: function(){
						return {
							getFocusDomRef: function(){
								return undefined;
							}
						};
					},
					getParameter: function(name){
						if (name === "userInteraction") {
							return true;
						}
						if (name === "rowIndices") {
							return [0];
						}
						return undefined;
					}
				};
				that.spies = {};
				that.spies._drawSelection = sinon.spy(that.oTableRepresentation, "_drawSelection");
				that.spies.selectionChanged = sinon.spy(that.oTableRepresentation.oApi, "selectionChanged");
				that.spies.createFilterFromSelectedValues = sinon.spy(that.oTableRepresentation.oRepresentationFilterHandler, "createFilterFromSelectedValues");
				done();
			}.bind(that));
		},
		afterEach : function() {
			//clear
			var that = this;
			Object.keys(this.spies).forEach(function(member){
				that.spies[member].restore();
			});
			document.body.removeChild(document.getElementById('contentOfTable'));
			this.oTableRepresentation.oApi.getActiveStep.restore();
			this.oTableRepresentation.oApi.getUiApi.restore();
			this.oGlobalApi.oCompContainer.destroy();
		}
	});
	function clickRow(tableId, Index){
		jQuery("#" + tableId + "-rowsel" + Index).click();
	}
	QUnit.test("When click on row selection element", function (assert) {
		// When a row is selected (manually) in the UI, then an event is fired which is handled by method _drawSelection.
		// Prove that _drawSelection is called, AND the filter is updated.
		assert.expect(9);
		var done = assert.async();
		var that = this;
		var tableId = that.oTableRepresentation.tableControl.sId;
		that.spies._drawSelection.restore();
		that._drawSelection = that.oTableRepresentation._drawSelection.bind(that.oTableRepresentation);
		that.spies._drawSelection = sinon.stub(that.oTableRepresentation, "_drawSelection", function(oEvent){
			that._drawSelection(oEvent);
			// run after click event handling
			//assert
			assert.strictEqual(that.spies._drawSelection.callCount, 1, "THEN _drawSelection is called which handles the selection event");
			assert.strictEqual(that.spies.selectionChanged.callCount, 1, "THEN selectionChanged is called");
			assert.strictEqual(that.oTableRepresentation.aFiltersInTable.length, 1, "AND Filter expression is set on the table");
			assert.strictEqual(that.oTableRepresentation.getFilter().getInternalFilter().getFilterTerms().length, 1, "AND one filter is returned from the table");
			assert.strictEqual(that.oTableRepresentation.aFiltersInTable[0], "AR", "AND Filter expression AR is set on the table");
			assert.strictEqual(that.oTableRepresentation.tableControl.getSelectedIndices().length, 1, "THEN all the rows with value AT is selected");
			assert.strictEqual(that.spies.createFilterFromSelectedValues.callCount, 1, "THEN createFilterFromSelectedValues is called only once");
			done();
		});
		//arrange
		that.oTableRepresentation.tableControl.rerender();
		sap.ui.getCore().applyChanges();
		// pre-condition
		assert.strictEqual(that.oTableRepresentation.aFiltersInTable.length, 0, "PRE: no filter on the table");
		assert.strictEqual(that.oTableRepresentation.tableControl.getSelectedIndices().length, 0, "PRE: no row is selected");
		//act
		clickRow(tableId, 0);
	});
	QUnit.test("When click twice on row selection element (select-deselect)", function (assert) {
		// Prove that _drawSelection is called, AND the filter is updated, AND two clicks result in no selections and filters
		assert.expect(11);
		var done = assert.async();
		var that = this;
		var tableId = that.oTableRepresentation.tableControl.sId;
		//arrange
		that.oTableRepresentation.tableControl.rerender();
		sap.ui.getCore().applyChanges();
		// pre-condition
		assert.strictEqual(that.oTableRepresentation.aFiltersInTable.length, 0, "PRE: no filter on the table");
		assert.strictEqual(that.oTableRepresentation.tableControl.getSelectedIndices().length, 0, "PRE: no row is selected");
		//act
		clickRow(tableId, 0);
		//assert
		assert.strictEqual(that.spies._drawSelection.callCount, 1, "THEN _drawSelection is called which handles the selection event");
		assert.strictEqual(that.spies.selectionChanged.callCount, 1, "THEN selectionChanged is called");
		assert.strictEqual(that.oTableRepresentation.aFiltersInTable.length, 1, "AND Filter expression is set on the table");
		assert.strictEqual(that.oTableRepresentation.getFilter().getInternalFilter().getFilterTerms().length, 1, "AND there is one filter term");
		assert.strictEqual(that.oTableRepresentation.getFilter().getInternalFilter().getFilterTerms()[0].value, "AR",
			"AND the right filter has been created");
		assert.strictEqual(that.oTableRepresentation.getFilter().getInternalFilter().getFilterTerms()[0].propertyName, "CompanyCodeCountry",
			"AND on the right property");
		//act
		clickRow(tableId, 0);
		//assert
		assert.strictEqual(that.spies._drawSelection.callCount, 2, "THEN _drawSelection is called which handles the selection event");
		assert.strictEqual(that.spies.selectionChanged.callCount, 2, "THEN selectionChanged is called");
		assert.strictEqual(that.oTableRepresentation.aFiltersInTable.length, 0, "AND no Filter expression is set");
		done();
	});
	QUnit.test("When clicking once and calling markSelectionInTable", function (assert) {
		// Prove that markSelectionInTable selects all members with an equal selected value on the filter property.
		assert.expect(7);
		var done = assert.async();
		var that = this;
		var tableId = that.oTableRepresentation.tableControl.sId;
		//arrange
		var resultingNumberOfSelectedRows = 8;
		that.oTableRepresentation.oRepresentationFilterHandler.updateFilterFromSelection(["hugo"]);
		that.oTableRepresentation.tableControl.rerender();
		sap.ui.getCore().applyChanges();
		// pre-condition
		assert.strictEqual(that.oTableRepresentation.aFiltersInTable.length, 0, "PRE: no filter on the table");
		assert.strictEqual(that.oTableRepresentation.tableControl.getSelectedIndices().length, 0, "PRE: no row is selected");
		//act
		clickRow(tableId, 0);
		that.oTableRepresentation.markSelectionInTable(true);
		//assert
		assert.strictEqual(that.spies._drawSelection.callCount, resultingNumberOfSelectedRows + 2,
			"THEN _drawSelection is called at least for each checked table row in the result");
		assert.strictEqual(that.spies.selectionChanged.callCount, 1, "THEN selectionChanged is called");
		assert.strictEqual(that.oTableRepresentation.aFiltersInTable.length, 1, "AND Filter expression is set on the table");
		assert.strictEqual(that.oTableRepresentation.tableControl.getSelectedIndices().length, 8, "Then all rows with value AR are selected");
		assert.strictEqual(that.oTableRepresentation.getFilter().getInternalFilter().getFilterTerms().length, 1,
			"AND one filter term can be retrieved from the table");
		done();
	});
	QUnit.module("Table Tests - When there is a required filter has display options on the table", {
		beforeEach: function (assert) {
			var that = this;
			function getActiveStepStub() {
				var oActiveStep = {};
				oActiveStep.getSelectedRepresentation = function () {
					var oRepresentationFilterHandler = {};
					oRepresentationFilterHandler.getFilterValues = function () {
						return ["AR"];
					};
					oRepresentationFilterHandler.clearFilters = function () {
						return;
					};
					return {
						oRepresentationFilterHandler: oRepresentationFilterHandler
					};
				};
				return oActiveStep;
			}
			function getUiApiStub() {
				var oUiApi = {};
				oUiApi.getStepContainer = function () {
					return undefined;
				};
				return oUiApi;
			}
			var done = assert.async();
			createUiApiAsPromise().done(function (api) {
				that.api = api;
				that.requiredParameter = representationHelper.representatationDataForAlternateRepWithFilterDisplayOptions();
				that.tableRepresentation = _commonSetupForCreatingTable(api, that.requiredParameter);
				//stub
				sinon.stub(that.tableRepresentation.oApi, "getActiveStep", getActiveStepStub);
				sinon.stub(that.tableRepresentation.oApi, "getUiApi", getUiApiStub);
				done();
			});
		},
		afterEach: function () {
			//restore
			this.tableRepresentation.oApi.getActiveStep.restore();
			this.tableRepresentation.oApi.getUiApi.restore();
			this.api.oCompContainer.destroy();
		}
	});
	QUnit.test("When table is initialized and it has a required filter", function (assert) {
		//assert
		_commonAssertsForTableWithFilter(this.tableRepresentation, assert, this.requiredParameter);
	});
	QUnit.test("When selection is made on the table", function (assert) {
		//arrange
		var mainContent = this.tableRepresentation.getMainContent("Table with Filter", 600, 600);
		var oTable = mainContent.getItems()[0];
		this.tableRepresentation.bIsAlternateRepresentation = true;
		var oSelectedValue = [{
			id: "AR",
			text: "Argentina (AR)"
		}];
		//act
		oTable.setSelectedIndex(0);
		assert.strictEqual(this.tableRepresentation.getSelections().length, 1, "Then there is only filter item set on the table");
		this.tableRepresentation.removeAllSelection();
		var oFilter = this.tableRepresentation.getFilter();
		//assert
		assert.strictEqual(oFilter.getExpressions().length, 0, "Then Filter expression is cleared from the table");
		//select two items on the table
		oTable.addSelectionInterval(1, 2);
		//assert
		assert.strictEqual(this.tableRepresentation.getSelections().length, 1, "Then there is only filter item set on the table");
		assert.deepEqual(this.tableRepresentation.getSelections(), oSelectedValue, "Then there is only filter item set has key value pair");
		assert.strictEqual(this.tableRepresentation.getFilter().getInternalFilter().getFilterTerms().length, 1, "Then one filter is returned from the table");
		assert.strictEqual(this.tableRepresentation.aFiltersInTable[0], "AR", "Then AR filter is set on the table");
		//remove all the selections
		this.tableRepresentation.removeAllSelection();
		oFilter = this.tableRepresentation.getFilter();
		//assert
		assert.strictEqual(oFilter.getExpressions().length, 0, "Then Filter expression is cleared from the table");
	});

	QUnit.module("Table Tests - When request option changes", {
		beforeEach: function (assert) {
			var that = this;
			var done = assert.async();
			createUiApiAsPromise().done(function (api) {
				that.api = api;
				that.requiredParameter = representationHelper.representationDataWithDimension();
				that.tableRepresentation = _commonSetupForCreatingTable(api, that.requiredParameter);
				done();
			});
		},
		afterEach: function () {
			this.api.oCompContainer.destroy();
		}
	});
	QUnit.test("When sort property is changed", function (assert) {
		//arrange
		var done = assert.async();
		var oMainContentViewSetting = _createMainContentAndViewSettingDialog(this.tableRepresentation);
		var expectedPagingOption = {
			inlineCount: true,
			top: 100,
			skip: 0
		};
		//stub
		sinon.stub(this.tableRepresentation.oApi, 'selectionChanged', selectionChangedStub);
		//act
		oMainContentViewSetting.oViewSettingDialog.open();
		oMainContentViewSetting.oViewSettingDialog.setSelectedSortItem(oMainContentViewSetting.oViewSettingDialog.getSortItems()[1]); //change the sort property
		var oDialogInstance = _getDialogByEmptyTitle();
		oDialogInstance.getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		var expectedOrderby = _getSelectedSortItem(oMainContentViewSetting.oViewSettingDialog);
		var oRequestOptions = this.tableRepresentation.getRequestOptions();
		//assert
		var that = this;
		function selectionChangedStub(sortEvent) {
			assert.strictEqual(sortEvent, true, "then sort is executed.");
			assert.deepEqual(oRequestOptions.paging, expectedPagingOption, "then correct paging options are included in the request");
			assert.deepEqual(oRequestOptions.orderby[0], expectedOrderby, "then correct sorting options are included in the request");
			_destroyViewSettingDialog();
			//restore
			that.tableRepresentation.oApi.selectionChanged.restore();
			done();
		}
	});
	QUnit.test("When sort property is not changed", function (assert) {
		//arrange
		var oMainContentViewSetting = _createMainContentAndViewSettingDialog(this.tableRepresentation);
		//spy
		var spyResetPaginationForTable = sinon.spy(this.tableRepresentation, "resetPaginationForTable");
		var spyOnResetPagination = sinon.spy(this.tableRepresentation.oPaginationHandler, "resetPaginationOption");
		//arrange
		var expectedPagingOption = {
			inlineCount: true,
			top: 100,
			skip: 0
		};
		//act
		var oRequestOptions = this.tableRepresentation.getRequestOptions();
		var expectedOrderby = _getSelectedSortItem(oMainContentViewSetting.oViewSettingDialog);
		//assert
		assert.strictEqual(spyResetPaginationForTable.calledOnce, false, "then resetPaginationForTable is not called for the table request");
		assert.strictEqual(spyOnResetPagination.calledOnce, false, "then resetPaginationOption is not called for the table request");
		assert.deepEqual(oRequestOptions.paging, expectedPagingOption, "then correct paging options are included in the request");
		assert.deepEqual(oRequestOptions.orderby[0], expectedOrderby, "then correct sorting options are included in the request");
		//restore
		spyResetPaginationForTable.restore();
		spyOnResetPagination.restore();
	});
	QUnit.test("When filter has changed in the table", function (assert) {
		//spy
		var spyOnResetPagination = sinon.spy(this.tableRepresentation.oPaginationHandler, "resetPaginationOption");
		//arrange
		var expectedPagingOption = {
			inlineCount: true,
			top: 100,
			skip: 0
		};
		//act
		var oRequestOptions = this.tableRepresentation.getRequestOptions(true);
		//assert
		assert.strictEqual(spyOnResetPagination.calledOnce, true, "then resetPaginationOption is called for the table request");
		assert.deepEqual(oRequestOptions.paging, expectedPagingOption, "then correct paging options are included in the request");
		assert.deepEqual(oRequestOptions.orderby, [], "then no sorting options are included in the request");
		//restore
		spyOnResetPagination.restore();
	});
	QUnit.module("Table Tests - Selection on table after sorting", {
		beforeEach: function (assert) {
			var that = this;
			var done = assert.async();
			createUiApiAsPromise().done(function (api) {
				that.api = api;
				that.requiredParameter = representationHelper.representatationDataWithProperty();
				that.tableRepresentation = _commonSetupForCreatingTable(api, that.requiredParameter);
				done();
			});
		},
		afterEach: function () {
			this.api.oCompContainer.destroy();
		}
	});
	QUnit.test("When sort property is changed after selection", function (assert) {
		//arrange
		var done = assert.async();
		var oMainContentViewSetting = _createMainContentAndViewSettingDialog(this.tableRepresentation);
		this.tableRepresentation.aFiltersInTable = ["AT"];
		var expectedFilter = [{
			id: "AT",
			text: "AT"
		}];
		var aSelectedFilter = [8, 9, 10, 11, 12, 13, 14, 15]; // series selection for value "AT"
		//stub
		sinon.stub(this.tableRepresentation.oApi, 'selectionChanged', selectionChangedStub);
		//act
		this.tableRepresentation.markSelectionInTable(true);
		assert.deepEqual(this.tableRepresentation.getSelections(), expectedFilter, "Then there is one item selected on the table before sorting");
		assert.deepEqual(this.tableRepresentation.tableControl.getSelectedIndices(), aSelectedFilter, "Then selected indices are same as expected");
		oMainContentViewSetting.oViewSettingDialog.open();
		oMainContentViewSetting.oViewSettingDialog.setSelectedSortItem(oMainContentViewSetting.oViewSettingDialog.getSortItems()[1]); //change the sort property
		var oDialogInstance = _getDialogByEmptyTitle();
		oDialogInstance.getBeginButton().firePress();
		sap.ui.getCore().applyChanges();
		//assert
		var testEnv = this;
		function selectionChangedStub(sortEvent) {
			assert.strictEqual(sortEvent, true, "then sort is executed.");
			assert.deepEqual(testEnv.tableRepresentation.getSelections(), expectedFilter, "Then there is one item selected on the table after sorting");
			assert.notEqual(testEnv.tableRepresentation.tableControl.getSelectedIndices(), aSelectedFilter, "Then selected indices are not same");
			assert.strictEqual(testEnv.tableRepresentation.getFilter().getInternalFilter().getFilterTerms().length, 1, "Then one filter is returned from the table");
			//restore
			_destroyViewSettingDialog();
			testEnv.tableRepresentation.oApi.selectionChanged.restore();
			done();
		}
	});
	QUnit.module("Table Tests - When sort property is not available in table column - main table", {
		beforeEach: function (assert) {
			var testEnv = this;
			var done = assert.async();
			createUiApiAsPromise().done(function (api) {
				testEnv.api = api;
				testEnv.requiredParameter = representationHelper.representatationDataWithNotAvailableOrderBy();
				testEnv.tableRepresentation = _commonSetupForCreatingTable(api, testEnv.requiredParameter);
				done();
			});
		},
		afterEach: function () {
			this.api.oCompContainer.destroy();
		}
	});
	QUnit.test("When getViewSettingDialog is called for the table and sort property is not available in table column", function (assert) {
		var oMainContentViewSetting = _createMainContentAndViewSettingDialogUndefinedSortProperty(this.tableRepresentation);
		assert.strictEqual(oMainContentViewSetting.oViewSettingDialog instanceof ViewSettingsDialog, true, "Then View setting dialog is created");
		assert.deepEqual(oMainContentViewSetting.oViewSettingDialog.getSortItems().length, 1, "then one available in the sort dialog");
		assert.deepEqual(oMainContentViewSetting.oViewSettingDialog.getSelectedSortItem(), null, "then no item is selcted as the sort item");
		assert.deepEqual(oMainContentViewSetting.oViewSettingDialog.getSortDescending(), true, "Descending is selected");
		assert.deepEqual(oMainContentViewSetting.oViewSettingDialog.getSortItems()[0].getText(), BaseUI5ChartRepresentationTestHelper.getSampleMetadata().getPropertyMetadata("BestPossibleDaysSalesOutstndng").label, "then the first sort item is "
			+ oMainContentViewSetting.oViewSettingDialog.getSortItems()[0].getText());

		var expectedSortItem = _getSelectedSortItem(oMainContentViewSetting.oViewSettingDialog);
		var expectedOrderby = [{
			"ascending": false,
			"property": "CompanyCodeCountry"
		}];
		assert.deepEqual(expectedSortItem, {}, "Then selected sorting item is undefined from the view setting dialog");
		assert.deepEqual(this.tableRepresentation.getParameter().orderby, expectedOrderby, "Then orderby is retained");
	});

	QUnit.module("Table Tests - When sort property is not available in table column - alternate table", {
		beforeEach: function (assert) {
			var testEnv = this;
			var done = assert.async();
			createUiApiAsPromise().done(function (api) {
				testEnv.api = api;
				testEnv.requiredParameter = representationHelper.representatationDataWithNotAvailableOrderByAlternateRep();
				testEnv.tableRepresentation = _commonSetupForCreatingTable(api, testEnv.requiredParameter);
				done();
			});
		},
		afterEach: function () {
			this.api.oCompContainer.destroy();
		}
	});
	QUnit.test("When getViewSettingDialog is called for the table and sort property is not available in table column", function (assert) {
		var oMainContentViewSetting = _createMainContentAndViewSettingDialogUndefinedSortProperty(this.tableRepresentation);
		assert.strictEqual(oMainContentViewSetting.oViewSettingDialog instanceof ViewSettingsDialog, true, "Then View setting dialog is created");
		assert.deepEqual(oMainContentViewSetting.oViewSettingDialog.getSortItems().length, 2, "then two items available in the sort dialog");
		assert.deepEqual(oMainContentViewSetting.oViewSettingDialog.getSelectedSortItem(), null, "then no item is selcted as the sort item");
		assert.deepEqual(oMainContentViewSetting.oViewSettingDialog.getSortDescending(), true, "Descending is selected");
		assert.deepEqual(oMainContentViewSetting.oViewSettingDialog.getSortItems()[0].getText(), BaseUI5ChartRepresentationTestHelper.getSampleMetadata().getPropertyMetadata("BestPossibleDaysSalesOutstndng").label, "then the first sort item is "
			+ oMainContentViewSetting.oViewSettingDialog.getSortItems()[0].getText());
		assert.deepEqual(oMainContentViewSetting.oViewSettingDialog.getSortItems()[1].getText(), BaseUI5ChartRepresentationTestHelper.getSampleMetadata().getPropertyMetadata("DaysSalesOutstanding").label, "then the second sort item is "
			+ oMainContentViewSetting.oViewSettingDialog.getSortItems()[1].getText());

		var expectedSortItem = _getSelectedSortItem(oMainContentViewSetting.oViewSettingDialog);
		var expectedOrderby = [{
			"ascending": false,
			"property": "CompanyCodeCountry"
		}];
		assert.deepEqual(expectedSortItem, {}, "Then selected sorting item is undefined from the view setting dialog");
		assert.deepEqual(this.tableRepresentation.getParameter().orderby, expectedOrderby, "Then orderby is retained");
	});
	QUnit.module("Table Tests - Filters on table after pagination", {
		beforeEach: function (assert) {
			var testEnv = this;
			var done = assert.async();
			createUiApiAsPromise().done(function (api) {
				testEnv.api = api;
				testEnv.requiredParameter = representationHelper.representatationDataWithProperty();
				testEnv.tableRepresentation = _commonSetupForCreatingTable(api, testEnv.requiredParameter, 100);
				done();
			});
		},
		afterEach: function () {
			this.api.oCompContainer.destroy();
		}
	});
	QUnit.test("Selection before and after pagination", function (assert) {
		var done = assert.async();
		// arrange stub
		var testEnv = this;
		function updatePathStub(fnStepProcessedCallback) {
			fnStepProcessedCallback();
			assert.deepEqual(testEnv.tableRepresentation.getSelections(), expectedFilterOnPagination, "Then there is one item selected on the table after pagination");
			assert.deepEqual(testEnv.tableRepresentation.tableControl.getSelectedIndices(), aSelectedFilterOnPagination, "Then selected indices are not same");
			_removeTableFromDom();
			//restore
			testEnv.tableRepresentation.oApi.updatePath.restore();
			testEnv.tableRepresentation.destroy();
			done();
		}
		//arrange
		var spy = sinon.spy(this.tableRepresentation.oPaginationDisplayOptionHandler, "getDisplayNameForPaginatedFilter");
		var oMainContentViewSetting = _createMainContentAndViewSettingDialog(this.tableRepresentation);
		this.tableRepresentation.aFiltersInTable = ["AT", "AR"];
		var expectedFilterOnPagination = [{
			id: "AT",
			text: "AT"
		}, {
			id: "AR",
			text: "AR"
		}];
		//stub
		sinon.stub(this.tableRepresentation.oApi, 'updatePath', updatePathStub);
		_placeTableAtDom(oMainContentViewSetting.mainContent);
		//act
		this.tableRepresentation.oPaginationHandler.attachPaginationOnTable(this.tableRepresentation); // attach the pagination event
		assert.deepEqual(this.tableRepresentation.getSelections(), expectedFilterOnPagination, "Then there is one item selected on the table before pagination");
		assert.ok(spy.args[0][4].getPropertyMetadata, "THEN entity metadata has been handed over when calling getDisplayNameForPaginatedFilter");
		var aSelectedFilterOnPagination = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]; // series selection for value "AT" and "AR"
		assert.deepEqual(this.tableRepresentation.tableControl.getSelectedIndices(), aSelectedFilterOnPagination, "Then selected indices are same as expected");

		spy.restore();
		_firePagination(testEnv.tableRepresentation.tableControl);
	});
	QUnit.test("When switching between chart and paginated table", function (assert) {
		assert.expect(6);
		var done = assert.async();
		//arrange stub
		var testEnv = this;
		function updatePathStub(fnStepProcessedCallback) {
			//still act
			fnStepProcessedCallback();
			var pagingOptionsAfterPagination = testEnv.tableRepresentation.oPaginationHandler.getPagingOption();
			assert.strictEqual(pagingOptionsAfterPagination.top, 99, "Then top is set correctly.");
			assert.strictEqual(pagingOptionsAfterPagination.skip, 100, "Then skip is set correctly.");

			testEnv.tableRepresentation.onChartSwitch();
			var pagingOptionsAfterOnChartSwitch = testEnv.tableRepresentation.oPaginationHandler.getPagingOption();
			assert.strictEqual(pagingOptionsAfterOnChartSwitch.top, 100, "Then top is reset correctly due to onChartSwitch().");
			assert.strictEqual(pagingOptionsAfterOnChartSwitch.skip, 0, "Then skip is reset correctly due to onChartSwitch().");
			//cleanup
			_removeTableFromDom();
			testEnv.tableRepresentation.oApi.updatePath.restore();
			testEnv.tableRepresentation.destroy();
			done();
		}
		//arrange
		var oMainContentViewSettingForTable = _createMainContentAndViewSettingDialog(this.tableRepresentation);
		sinon.stub(this.tableRepresentation.oApi, 'updatePath', updatePathStub); // for calling the asserts in the right time
		_placeTableAtDom(oMainContentViewSettingForTable.mainContent);
		this.tableRepresentation.oPaginationHandler.attachPaginationOnTable(this.tableRepresentation); // attach the pagination event
		//act
		var pagingOptionsBeforePagination = this.tableRepresentation.oPaginationHandler.getPagingOption();
		assert.strictEqual(pagingOptionsBeforePagination.top, 100, "Then top is initialized correctly.");
		assert.strictEqual(pagingOptionsBeforePagination.skip, 0, "Then skip is initialized correctly.");
		_firePagination(testEnv.tableRepresentation.tableControl);
	});
	QUnit.module("Table Tests - When top N is configured for the step", {
		beforeEach: function (assert) {
			function getActiveStepStub() {
				var oActiveStep = {};
				oActiveStep.getSelectedRepresentation = function () {
					var oRepresentationFilterHandler = {};
					oRepresentationFilterHandler.getFilterValues = function () {
						return ["LH"];
					};
					return {
						oRepresentationFilterHandler: oRepresentationFilterHandler
					};
				};
				return oActiveStep;
			}
			function getUiApiStub() {
				var oUiApi = {};
				oUiApi.getStepContainer = function () {
					return undefined;
				};
				return oUiApi;
			}
			var testEnv = this;
			var done = assert.async();
			createUiApiAsPromise().done(function (api) {
				testEnv.api = api;
				testEnv.requiredParameter = representationHelper.representatationDataWithTopNRecords();
				testEnv.tableRepresentation = _commonSetupForCreatingTable(api, testEnv.requiredParameter, 10);
				//stub
				sinon.stub(testEnv.tableRepresentation.oApi, "getActiveStep", getActiveStepStub);
				sinon.stub(testEnv.tableRepresentation.oApi, "getUiApi", getUiApiStub);
				done();
			});
		},
		afterEach: function () {
			//restore
			this.tableRepresentation.oApi.getActiveStep.restore();
			this.tableRepresentation.oApi.getUiApi.restore();
			this.api.oCompContainer.destroy();
		}
	});
	QUnit.test("When a filter is not available in top N data of table", function (assert) {
		//arrange
		_createMainContentAndViewSettingDialog(this.tableRepresentation);
		//assert
		assert.strictEqual(this.tableRepresentation.getSelections().length, 0, "Then there is no filter item set on the table");
		assert.deepEqual(this.tableRepresentation.aFiltersInTable.length, 0, "then filters are discarded since it is not availeble in data");
	});
	QUnit.module("Table Tests - When top N is not configured for the step", {
		beforeEach: function (assert) {
			function getActiveStepStub() {
				var oActiveStep = {};
				oActiveStep.getSelectedRepresentation = function () {
					var oRepresentationFilterHandler = {};
					oRepresentationFilterHandler.getFilterValues = function () {
						return ["KR"];
					};
					return {
						oRepresentationFilterHandler: oRepresentationFilterHandler
					};
				};
				return oActiveStep;
			}
			function getUiApiStub() {
				var oUiApi = {};
				oUiApi.getStepContainer = function () {
					return undefined;
				};
				return oUiApi;
			}
			var testEnv = this;
			var done = assert.async();
			createUiApiAsPromise().done(function (api) {
				testEnv.api = api;
				testEnv.requiredParameter = representationHelper.representatationDataWithProperty();
				testEnv.tableRepresentation = _commonSetupForCreatingTable(api, testEnv.requiredParameter);
				//stub
				sinon.stub(testEnv.tableRepresentation.oApi, "getActiveStep", getActiveStepStub);
				sinon.stub(testEnv.tableRepresentation.oApi, "getUiApi", getUiApiStub);
				done();
			});
		},
		afterEach: function () {
			//restore
			this.tableRepresentation.oApi.getActiveStep.restore();
			this.tableRepresentation.oApi.getUiApi.restore();
			this.api.oCompContainer.destroy();
		}
	});
	QUnit.test("When a filter is available in the data of table", function (assert) {
		//arrange
		var oExpectedSelection = [{
			id: "KR",
			text: "KR"
		}];
		this.tableRepresentation.aFiltersInTable = ["KR"];
		_createMainContentAndViewSettingDialog(this.tableRepresentation);
		//assert
		assert.deepEqual(this.tableRepresentation.getSelections(), oExpectedSelection, "Then expected selection is returned from table");
		assert.strictEqual(this.tableRepresentation.aFiltersInTable[0], "KR", "Then filter is not discarded");
	});
	QUnit.module("Table Tests - Serialization and deserialization with an orderby value", {
		beforeEach: function (assert) {
			var testEnv = this;
			var done = assert.async();
			createUiApiAsPromise().done(function (api) {
				testEnv.api = api;
				testEnv.requiredParameter = representationHelper.representatationDataWithProperty();
				testEnv.tableRepresentation = _commonSetupForCreatingTable(api, testEnv.requiredParameter);
				done();
			});
		},
		afterEach: function () {
			this.api.oCompContainer.destroy();
		}
	});
	QUnit.test("When table is serialized with an orderby value", function (assert) {
		//act
		var serializedData = this.tableRepresentation.serialize();
		//assert
		assert.deepEqual(this.tableRepresentation.orderby, serializedData.orderby, "Then the orderby value is serialised");
	});
	QUnit.test("When table is deserialized with an orderby value", function (assert) {
		//act
		this.tableRepresentation.deserialize({
			orderby: [{
				"ascending": false,
				property: "CompanyCodeCountry"
			}],
			oFilter: [{
				data: {
					"Year Month": "201312",
					"Days Sales Outstanding": "55.22"
				}
			}]
		});
		//assert
		assert.strictEqual(this.tableRepresentation.orderby[0].ascending, false, "Then the ordering direction is deserialized");
		assert.strictEqual(this.tableRepresentation.orderby[0].property, "CompanyCodeCountry", "Then the ordering property deserialized");
	});
	QUnit.module("Table Tests - Check if the pagination event to attached to the table", {
		beforeEach: function (assert) {
			var testEnv = this;
			var done = assert.async();
			createUiApiAsPromise().done(function (api) {
				testEnv.api = api;
				done();
			});
		},
		afterEach: function () {
			_removeTableFromDom();
			this.api.oCompContainer.destroy();
		}
	});
	QUnit.test("When an alternate table is initialized", function (assert) {
		//arrangement
		var requiredParameter = representationHelper.representatationDataForAlternateRep();
		var tableRepresentation = _commonSetupForCreatingTable(this.api, requiredParameter);
		//spy
		var spyOfAttachPaginationOnTable = sinon.spy(tableRepresentation.oPaginationHandler, "attachPaginationOnTable");
		//act
		_commonAttachingPagination(tableRepresentation, true);
		//assert
		assert.strictEqual(spyOfAttachPaginationOnTable.called, false, "Then pagination event is not attached on the alternate table");
		assert.strictEqual(tableRepresentation.nDataResponseCount, undefined, "Then data count to determine pagination is not available for the alternate table");
		//restore
		spyOfAttachPaginationOnTable.restore();
	});
	QUnit.test("When a main table without filter is initialized", function (assert) {
		//arrangement
		var requiredParameter = representationHelper.representatationDataWithNotAvailableOrderBy();
		var tableRepresentation = _commonSetupForCreatingTable(this.api, requiredParameter);
		//spy
		var spyOfAttachPaginationOnTable = sinon.spy(tableRepresentation.oPaginationHandler, "attachPaginationOnTable");
		//act
		_commonAttachingPagination(tableRepresentation, false);
		//assert
		assert.strictEqual(spyOfAttachPaginationOnTable.called, true, "Then pagination event is attached on the main table without filter");
		assert.notEqual(tableRepresentation.nDataResponseCount, undefined, "Then data count to determine pagination is available for the main table without filter");
		//restore
		spyOfAttachPaginationOnTable.restore();
	});
	QUnit.test("When a main table with filter is initialized", function (assert) {
		//arrangement
		var requiredParameter = representationHelper.representatationDataWithProperty();
		var tableRepresentation = _commonSetupForCreatingTable(this.api, requiredParameter);
		//spy
		var spyOfAttachPaginationOnTable = sinon.spy(tableRepresentation.oPaginationHandler, "attachPaginationOnTable");
		//act
		_commonAttachingPagination(tableRepresentation, false);
		//assert
		assert.strictEqual(spyOfAttachPaginationOnTable.called, true, "Then pagination event is attached on the table with filter");
		assert.notEqual(tableRepresentation.nDataResponseCount, undefined, "Then data count to determine pagination is available for the main table with filter");
		//restore
		spyOfAttachPaginationOnTable.restore();
	});

	QUnit.module("Table Tests - Export to Excel", {
		beforeEach: function (assert) {
			var testEnv = this;
			var done = assert.async();
			//stub
			testEnv.stubExportSpreadsheetBuild = sinon.stub();
			function spreadsheetStub(settings) {
				this.build = testEnv.stubExportSpreadsheetBuild;
			}
			testEnv.stubExportSpreadsheet = sinon.stub(sap.ui.export, "Spreadsheet", spreadsheetStub);
			createUiApiAsPromise().done(function (api) {
				testEnv.api = api;
				var requiredParameters = representationHelper.representationDataWithDimension();
				var interfaceProxy = new RepresentationInterfaceProxy(api.oCoreApi, api.oUiApi);
				testEnv.tableRepresentation = new Table(interfaceProxy, requiredParameters);
				var data = sampleService(api.oApi, 'sampleData');
				var metadataStub = {
					getPropertyMetadata: representationHelper.setPropertyMetadataStub.call()
				};
				testEnv.tableRepresentation.setData(data, metadataStub);
				done();
			});
		},
		afterEach: function () {
			//restore
			this.stubExportSpreadsheet.restore();
			this.api.oCompContainer.destroy();
		}
	});
	QUnit.test("When getMainContent is called", function (assert) {
		var content = this.tableRepresentation.getMainContent("StepTitle");
		var table = content.getItems()[0];
		var hbox = table.getTitle();
		assert.equal(hbox.getMetadata().getName(), "sap.m.HBox", "Then hbox is returned as control, that shows the title line");
		var label = hbox.getItems()[0];
		assert.equal(label.getMetadata().getName(), "sap.m.Title", "Then Title is first item");
		var buttonBox = hbox.getItems()[1];
		assert.equal(buttonBox.getMetadata().getName(), "sap.m.HBox", "Then hbox again is item");

		var loadAllButton = buttonBox.getItems()[0];
		assert.equal(loadAllButton.getMetadata().getName(), "sap.m.Button", "Then Button item");
		assert.equal(loadAllButton.getText(), this.api.oCoreApi.getTextNotHtmlEncoded("buttonTextLoadAll"), "Then load all button text as expected");
		assert.equal(loadAllButton.getAriaLabelledBy()[0], label.getId(), "Then aria label for load all button is set");

		var exportToExcelButton = buttonBox.getItems()[1];
		assert.equal(exportToExcelButton.getMetadata().getName(), "sap.m.Button", "Then Button item");
		assert.equal(exportToExcelButton.getText(), this.api.oCoreApi.getTextNotHtmlEncoded("buttonTextExport"), "Then export to excel button text as expected");
		assert.equal(exportToExcelButton.getAriaLabelledBy()[0], label.getId(), "Then aria label for exportToExcel button is set");
        assert.equal(exportToExcelButton.getEnabled(),true,"Then Export to Excel Button is enabled");
		
		assert.equal(table.getMetadata().getName(), "sap.ui.table.Table", "Then table as element");
		assert.equal(table.getAriaLabelledBy()[0], label.getId(), "Then aria label for table button is set");
	});
	QUnit.test("When getMainContent is called for alternate Representation", function (assert) {
		this.tableRepresentation.oParameter.isAlternateRepresentation = true;
		var content = this.tableRepresentation.getMainContent("StepTitle");
		assert.equal(content.getMetadata().getName(), "sap.m.VBox", "Then VBox is returned by getMainContent");
		var table = content.getItems()[0];
		assert.equal(table.getMetadata().getName(), "sap.ui.table.Table", "THEN table is inside vBox");
		var hbox = table.getTitle();
		assert.equal(hbox.getMetadata().getName(), "sap.m.HBox", "Then hbox is returned as control, that shows the title line");

		var label = hbox.getItems()[0];
		assert.equal(label.getMetadata().getName(), "sap.m.Title", "Then Title is first item");

		var buttonBox = hbox.getItems()[1];
		assert.equal(buttonBox.getMetadata().getName(), "sap.m.HBox", "Then hbox again is item");

		var exportToExcelButton = buttonBox.getItems()[0];
		assert.equal(exportToExcelButton.getMetadata().getName(), "sap.m.Button", "Then Button item");
		assert.equal(exportToExcelButton.getText(), this.api.oCoreApi.getTextNotHtmlEncoded("buttonTextExport"), "Then export to excel button text as expected");
		assert.equal(exportToExcelButton.getAriaLabelledBy()[0], label.getId(), "Then aria label for exportToExcel button is set");
		assert.equal(exportToExcelButton.getEnabled(),true,"Then Export to Excel Button is enabled");
		
		var table = content.getItems()[0];
		assert.equal(table.getMetadata().getName(), "sap.ui.table.Table", "Then table as element");
		assert.equal(table.getAriaLabelledBy()[0], label.getId(), "Then aria label for table button is set");
	});
	QUnit.test("When exportExcel function is called", function (assert) {
		assert.expect(5);

		var tableRepresentation = this.tableRepresentation;
		var expectedColumns = [{
			"label": "YearMonth",
			"property": "YearMonth",
			"type": "String"
		}, {
			"label": "Days Sales Outstanding",
			"property": "DaysSalesOutstanding",
			"scale": 0,
			"type": "Number"
		}, {
			"label": "Revenue (USD)",
			"property": "Revenue",
			"scale": 0,
			"type": "Number"
		}];
		this.tableRepresentation.exportExcel("StepTitle");

		assert.deepEqual(this.stubExportSpreadsheet.getCall(0).args[0].fileName, "StepTitle.xlsx", "Then filename as expected");
		assert.deepEqual(this.stubExportSpreadsheet.getCall(0).args[0].dataSource, tableRepresentation.getData(), "Then data as expected");
		assert.deepEqual(this.stubExportSpreadsheet.getCall(0).args[0].workbook.columns.length, 3, "Then 3 columns");
		assert.deepEqual(this.stubExportSpreadsheet.getCall(0).args[0].workbook.columns, expectedColumns, "Then column description as expected");
		assert.strictEqual(this.stubExportSpreadsheetBuild.callCount, 1, "Then Build function of spreadsheet was called");
	});

	QUnit.module("Table Tests - loadAll", {
		beforeEach: function (assert) {
			var testEnv = this;
			var done = assert.async();
			createUiApiAsPromise().done(function (api) {
				testEnv.api = api;
				var oRequiredParameter = representationHelper.representationDataWithDimension();
				testEnv.tableRepresentation = _commonSetupForCreatingTable(api, oRequiredParameter);
				//spy
				testEnv.spyUpdatePath = sinon.spy(api.oCoreApi, "updatePath");
				done();
			});
		},
		afterEach: function () {
			//restore
			this.spyUpdatePath.restore();
			this.api.oCompContainer.destroy();
		}
	});
	QUnit.test("When loadAll is executed", function (assert) {
		//check default behaviour
		var requestOptions = this.tableRepresentation.getRequestOptions();
		var expectedPagingOptions = {
			inlineCount: true,
			skip: 0,
			top: 100
		};
		assert.deepEqual(requestOptions.paging, expectedPagingOptions, "Then requestOptions with top and skip / inlinecount");
		assert.equal(this.spyUpdatePath.called, false, "Then update path has been not yet called");
		// action 1 press loadAll - button
		this.tableRepresentation.loadAll();
		assert.equal(this.spyUpdatePath.calledOnce, true, "Then update path has been called from loadAll");
		expectedPagingOptions = {
			inlineCount: true
		};
		requestOptions = this.tableRepresentation.getRequestOptions();
		assert.deepEqual(requestOptions.paging, expectedPagingOptions, "Then requestOptions WITHOUT top and WITHOUT skip - ONLY inlinecount");
		// expected setData from path update
		var aTableData = BaseUI5ChartRepresentationTestHelper.getSampleData(this.api);
		this.tableRepresentation.setData(aTableData, BaseUI5ChartRepresentationTestHelper.getSampleMetadata(), 999);
		expectedPagingOptions = {
			inlineCount: true
		};
		requestOptions = this.tableRepresentation.getRequestOptions();
		assert.deepEqual(requestOptions.paging, expectedPagingOptions, "Then requestOptions with top and skip / inlinecount are not changed after first setData");
		expectedPagingOptions = {
			inlineCount: true,
			skip: 0,
			top: 100
		};
		requestOptions = this.tableRepresentation.getRequestOptions(true);
		assert.deepEqual(requestOptions.paging, expectedPagingOptions, "Then requestOptions with top and skip / inlinecount are restored after filter have changed");
	});
	QUnit.test("When resetPagination is called the load all is reset", function(assert) {
		this.tableRepresentation.loadAll();
		var requestOptions = this.tableRepresentation.getRequestOptions();
		var expectedPagingOptions = {
				inlineCount : true
		};
		assert.deepEqual(requestOptions.paging, expectedPagingOptions, "Then skip and top are set as for load all");
		this.tableRepresentation.resetPaginationForTable();
		requestOptions = this.tableRepresentation.getRequestOptions();
		expectedPagingOptions = {
				inlineCount : true,
				skip : 0,
				top : 100
		};
		assert.deepEqual(requestOptions.paging, expectedPagingOptions, "Then skip and top are reset");

	});
	QUnit.test("Update count in title control after Path update", function (assert) {
		this.tableRepresentation.getMainContent("myTable");

		var expectedTitleWith1Line = this.api.oCoreApi.getTextNotHtmlEncoded("stepTitleWithNumberOfRecords", [this.tableRepresentation.title, 1, 999]);
		var expectedTitleWith2Lines = this.api.oCoreApi.getTextNotHtmlEncoded("stepTitleWithNumberOfRecords", [this.tableRepresentation.title, 2, 999]);
		//add a line to the table
		this.tableRepresentation.setData([{}], BaseUI5ChartRepresentationTestHelper.getSampleMetadata(), 999);
		assert.equal(this.tableRepresentation.titleControl.getText(), expectedTitleWith1Line, "Then title is updated as expected");
		//add another line to the table (trigger paging; paging option has to be provided so line gets amended)
		this.tableRepresentation.oPaginationHandler.pagingOption.skip = 1;
		this.tableRepresentation.oPaginationHandler.pagingOption.top = 1;
		this.tableRepresentation.setData([{}], BaseUI5ChartRepresentationTestHelper.getSampleMetadata(), 999);
		assert.equal(this.tableRepresentation.titleControl.getText(), expectedTitleWith2Lines, "Then title is updated as expected");
	});
	QUnit.module("Table Tests - no loadAll-Button for table with configured topN", {
		beforeEach: function (assert) {
			var testEnv = this;
			var done = assert.async();
			createUiApiAsPromise().done(function (api) {
				testEnv.api = api;
				var oRequiredParameter = representationHelper.representatationDataWithTopNRecords();
				testEnv.tableRepresentation = _commonSetupForCreatingTable(api, oRequiredParameter);
				//spy
				testEnv.spyOfGetText = sinon.spy(testEnv.tableRepresentation.oApi, "getTextNotHtmlEncoded");
				done();
			});
		},
		afterEach: function () {
			//restore
			this.spyOfGetText.restore();
			this.api.oCompContainer.destroy();
		}
	});
	QUnit.test("When topN is configured AND getMainContent is called", function (assert) {
		var content = this.tableRepresentation.getMainContent("myTable");
		assert.equal(this.spyOfGetText.calledWith("buttonTextExport"), true, "Then called with button text for excel export");
		//buttons that should not been available and where no stack
		assert.equal(this.spyOfGetText.calledWith("stepTitleWithNumberOfRecords"), false, "Then NOT called with text for title");
		assert.equal(this.spyOfGetText.calledWith("buttonTextLoadAll"), false, "Then NOT called with button text for load all");
		var hbox = content.getItems()[0].getTitle();
		assert.equal(hbox.getMetadata().getName(), "sap.m.HBox", "Then hbox is returned as control, that shows the title line");
		var label = hbox.getItems()[0];
		assert.equal(label.getMetadata().getName(), "sap.m.Title", "Then Title is first item");
		var buttonBox = hbox.getItems()[1];
		assert.equal(buttonBox.getMetadata().getName(), "sap.m.HBox", "Then hbox again is item");
		var exportToExcelButton = buttonBox.getItems()[0];
		assert.equal(exportToExcelButton.getMetadata().getName(), "sap.m.Button", "Then Button item");
		assert.equal(exportToExcelButton.getText(), this.api.oCoreApi.getTextNotHtmlEncoded("buttonTextExport"), "Then export to excel button text as expected");
		assert.equal(exportToExcelButton.getEnabled(),true,"Then Export to Excel Button is enabled");
		assert.equal(buttonBox.getItems().length, 1, "Then only one button - the load button is missing");
	});
	QUnit.module("Table Tests - Testing the tool tip", {
		beforeEach: function (assert) {
			var testEnv = this;
			var done = assert.async();
			createUiApiAsPromise().done(function (api) {
				testEnv.api = api;
				testEnv.requiredParameter = representationHelper.representationDataWithDimension();
				testEnv.tableRepresentation = _commonSetupForCreatingTable(api, testEnv.requiredParameter);

				done();
			});
		},
		afterEach: function () {
			//restore
			this.api.oCompContainer.destroy();
		}
	});
	QUnit.test("WHEN getMainContent is called", function(assert){
		var done = assert.async();
		var spy = sinon.spy(this.tableRepresentation.oFormatter, "getFormattedValueAsString");
		var mainContent = this.tableRepresentation.getMainContent("Table", 600, 600);
		assert.ok(mainContent);
		assert.equal(spy.callCount, 0, "THEN formatting has been not yet called");
		_placeTableAtDom(mainContent);

		var table = mainContent.getItems()[0];
		table.onAfterRendering = function() {
			assert.ok(spy.calledWith("YearMonth", "201304"), "cell value taken over from sample data");
			assert.ok(spy.calledWith("YearMonth", "201305"));
			assert.ok(spy.calledWith("YearMonth", "201306"));
			assert.ok(spy.calledWith("YearMonth", "201307"));
			assert.ok(spy.calledWith("YearMonth", "201308"));
			assert.ok(spy.calledWith("DaysSalesOutstanding", "40.2"));
			assert.ok(spy.calledWith("DaysSalesOutstanding", "39.49"));
			assert.ok(spy.calledWith("DaysSalesOutstanding", "41.73"));
			assert.ok(spy.calledWith("DaysSalesOutstanding", "37.86"));
			assert.ok(spy.calledWith("DaysSalesOutstanding", "41.31"));
			spy.restore();
			setTimeout(function(){
				_removeTableFromDom();
				done();
				},1);
		};

	});
});
