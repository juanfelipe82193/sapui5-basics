/* global QUnit sinon */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/qunit/QUnitUtils",
    'sap/ui/comp/library',
    'sap/ui/comp/valuehelpdialog/ValueHelpDialog',
    'sap/ui/model/json/JSONModel',
    'sap/m/ColumnListItem',
    'sap/m/Label',
    'sap/m/Token',
    'sap/ui/comp/smartfilterbar/SmartFilterBar',
    'sap/ui/Device',
    'sap/m/SearchField',
	'sap/ui/model/type/Date',
	'sap/ui/base/Event',
	'sap/m/P13nFilterPanel'
], function (qutils, library, ValueHelpDialog, JSONModel, ColumnListItem, Label, Token, SmartFilterBar, Device, SearchField, typeDate, Event, P13nFilterPanel) {
	"use strict";

	function _InitRows (oValueHelpDialog) {

		var oColModel = new JSONModel();
		oColModel.setData({
			cols: [{
				label: "Company Code",
				template: "CompanyCode"
			}, {
				label: "Company Name",
				template: "CompanyName"
			}, {
				label: "City",
				template: "City"
			}, {
				label: "Currency Code",
				template: "CurrencyCode"
			}, {
				label: "Date",
				template: "Date",
				type: "date",
				oType: new typeDate()
			}, {
				label: "Boolean",
				template: "BoolCode",
				type: "boolean"
			}]
		});
		oValueHelpDialog.setModel(oColModel, "columns");

		var aItems = [{
			CompanyCode: "0001",
			CompanyName: "SAP A.G.",
			City: "Walldorf",
			CurrencyCode: "EUR",
			BoolCode: true
		}, {
			CompanyCode: "0002",
			CompanyName: "SAP Labs India",
			City: "Bangalore",
			CurrencyCode: "INR",
			BoolCode: true
		}, {
			CompanyCode: "0003",
			CompanyName: "SAP China LAB",
			City: "Beijing",
			CurrencyCode: "CNY",
			BoolCode: false
		}, {
			CompanyCode: "0099",
			CompanyName: "SAP0",
			City: "Berlin",
			CurrencyCode: "EUR",
			BoolCode: true
		}, {
			CompanyCode: "0100",
			CompanyName: "SAP1",
			City: "Berlin",
			CurrencyCode: "EUR",
			Date: new Date()
		}, {
			CompanyCode: "0101",
			CompanyName: "SAP2",
			City: "Berlin",
			CurrencyCode: "EUR"
		}, {
			CompanyCode: "0102",
			CompanyName: "SAP3",
			City: "Berlin",
			CurrencyCode: "EUR"
		}, {
			CompanyCode: "0103",
			CompanyName: "SAP4",
			City: "Berlin",
			CurrencyCode: "EUR",
			Date: new Date()
		}, {
			CompanyCode: "0104",
			CompanyName: "SAP5",
			City: "Berlin",
			CurrencyCode: "EUR"
		}, {
			CompanyCode: "0105",
			CompanyName: "SAP6",
			City: "Berlin",
			CurrencyCode: "EUR"
		}, {
			CompanyCode: "0106",
			CompanyName: "SAP7",
			City: "Berlin",
			CurrencyCode: "EUR",
			Date: new Date()
		}, {
			CompanyCode: "0107",
			CompanyName: "SAP8",
			City: "Berlin",
			CurrencyCode: "EUR",
			Date: new Date()
		}, {
			CompanyCode: "0108",
			CompanyName: "SAP9",
			City: "Berlin",
			CurrencyCode: "EUR"
		}, {
			CompanyCode: "0109",
			CompanyName: "SAP10",
			City: "Berlin",
			CurrencyCode: "EUR"
		}, {
			CompanyCode: "0110",
			CompanyName: "SAP11",
			City: "Berlin",
			CurrencyCode: "EUR"
		}, {
			CompanyCode: "0111",
			CompanyName: "SAP12",
			City: "Berlin",
			CurrencyCode: "EUR"
		}, {
			CompanyCode: "0112",
			CompanyName: "SAP13",
			City: "Berlin",
			CurrencyCode: "EUR"
		}, {
			CompanyCode: "0113",
			CompanyName: "SAP14",
			City: "Berlin",
			CurrencyCode: "EUR"
		}, {
			CompanyCode: "0114",
			CompanyName: "SAP15",
			City: "Berlin",
			CurrencyCode: "EUR"
		}, {
			CompanyCode: "0115",
			CompanyName: "SAP16",
			City: "Berlin",
			CurrencyCode: "EUR"
		}];

		var oRowsModel = new JSONModel();
		oRowsModel.setData(aItems);
		oValueHelpDialog.setModel(oRowsModel);

		oValueHelpDialog.getTableAsync().then(function(oTable){
			if (oTable.bindRows) {
				oTable.bindRows("/");
			}
			if (oTable.bindItems) {
				oTable.bindAggregation("items", "/", function (sId, oContext) {
					var aCols = oTable.getModel("columns").getData().cols;

					return new ColumnListItem({
						cells: aCols.map(function (column) {
							var colname = column.template;
							return new Label({
								text: "{" + colname + "}"
							});
						})
					});
				});
			}
		});

	}

	function _InitToken (oValueHelpDialog) {
		var token1 = new Token({
			key: "0001",
			text: "SAP A.G. (0001)"
		});
		var token2 = new Token({
			key: "0002",
			text: "SAP Labs India (0002)"
		});
		var rangeToken1 = new Token({
			key: "i1",
			text: "CompanyCode a..z"
		}).data("range", {
			"exclude": false,
			"operation": library.valuehelpdialog.ValueHelpRangeOperation.BT,
			"keyField": "CompanyCode",
			"value1": "a",
			"value2": "z"
		});
		var rangeToken2 = new Token({
			key: "i2",
			text: "CompanyCode ==foo"
		}).data("range", {
			"exclude": false,
			"operation": library.valuehelpdialog.ValueHelpRangeOperation.EQ,
			"keyField": "CompanyCode",
			"value1": "foo",
			"value2": ""
		});
		var rangeToken3 = new Token({
			key: "e1",
			text: "CompanyCode !(==foo)"
		}).data("range", {
			"exclude": true,
			"operation": library.valuehelpdialog.ValueHelpRangeOperation.EQ,
			"keyField": "CompanyCode",
			"value1": "foo",
			"value2": ""
		});
		var aTokens = [token1, token2, rangeToken1, rangeToken2, rangeToken3];

		oValueHelpDialog.setTokens(aTokens);
	}

	QUnit.module("Testing Public API", {
		beforeEach: function () {
			this.oValueHelpDialog = new ValueHelpDialog("VHD");
		},
		afterEach: function () {
			this.oValueHelpDialog.destroy();
			this.oValueHelpDialog = null;
		}
	});

	QUnit.test("Test sap.ui.table library not loaded", function (qUnit) {
		qUnit.notOk(sap.ui.require("sap/ui/table/library"), "sap.ui.table library not loaded");
	});

	QUnit.test("Test open with supportRangesOnly", function (qUnit) {
		this.oValueHelpDialog.setSupportRangesOnly(true);
		qUnit.equal(this.oValueHelpDialog.getSupportRangesOnly(), true, "SupportRangesOnly should be true");
	});

	QUnit.test("Test open with filterMode", function (qUnit) {
		this.oValueHelpDialog.setFilterMode(true);
		qUnit.equal(this.oValueHelpDialog.getFilterMode(), true, "FilterMode should be true");
	});

	QUnit.test("Check Title", function (qUnit) {
		this.oValueHelpDialog.setTitle("foo");
		qUnit.equal(this.oValueHelpDialog.getTitle(), "foo", "title should be foo");
	});

	QUnit.test("Check basicSearchText", function (qUnit) {
		var oFilterbar = new SmartFilterBar({
			advancedMode: true
		});

		// basic search text before the filterbar exist
		this.oValueHelpDialog.setBasicSearchText("bar");
		qUnit.equal(this.oValueHelpDialog.getBasicSearchText(), "bar", "basicSearchText should be bar");

		oFilterbar.setBasicSearch(new SearchField());
		this.oValueHelpDialog.setFilterBar(oFilterbar);

		// update the search text
		this.oValueHelpDialog.setBasicSearchText("foo");
		qUnit.equal(this.oValueHelpDialog.getBasicSearchText(), "foo", "basicSearchText should be foo");
	});

	QUnit.test("Check supportMultiselect", function (qUnit) {
		qUnit.equal(this.oValueHelpDialog.getSupportMultiselect(), true, "Default for supportMultiselect should be true");
		this.oValueHelpDialog.setSupportMultiselect(false);
		qUnit.equal(this.oValueHelpDialog.getSupportMultiselect(), false, "supportMultiselect should be false");
	});

	QUnit.test("Check supportRanges", function (qUnit) {
		qUnit.equal(this.oValueHelpDialog.getSupportRanges(), false, "Default for supportRanges should be false");
		this.oValueHelpDialog.setSupportRanges(true);
		qUnit.equal(this.oValueHelpDialog.getSupportRanges(), true, "supportRanges should be true");
	});

	QUnit.test("Check supportRangesOnly", function (qUnit) {
		qUnit.equal(this.oValueHelpDialog.getSupportRangesOnly(), false, "Default for supportRangesOnly should be false");
		this.oValueHelpDialog.setSupportRangesOnly(true);
		qUnit.equal(this.oValueHelpDialog.getSupportRangesOnly(), true, "supportRangesOnly should be true");
	});

	QUnit.test("test set/get Key", function (qUnit) {
		this.oValueHelpDialog.setKey("CompanyCode");
		qUnit.equal(this.oValueHelpDialog.getKey(), "CompanyCode", "the key should be CompanyCode");
	});

	QUnit.test("test set/get descriptionKey", function (qUnit) {
		this.oValueHelpDialog.setDescriptionKey("CompanyName");
		qUnit.equal(this.oValueHelpDialog.getDescriptionKey(), "CompanyName", "the descriptionKey should be CompanyName");
	});

	QUnit.test("test set/get Keys", function (qUnit) {
		this.oValueHelpDialog.setKeys(["CompanyCode"]);
		qUnit.equal(this.oValueHelpDialog.getKeys().length, 1, "the keys array should contain one entry");
	});

	QUnit.test("test set/get RangeKeyFields", function (qUnit) {
		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyCode",
			label: "ID"
		}, {
			key: "CompanyName",
			label: "Name"
		}]);
		qUnit.equal(this.oValueHelpDialog.getRangeKeyFields().length, 2, "the RangeKeyFields array should contain two entries");
	});

	QUnit.test("test set/IncludeExcludeOperations", function (qUnit) {
		this.oValueHelpDialog.setIncludeRangeOperations([library.valuehelpdialog.ValueHelpRangeOperation.EQ, library.valuehelpdialog.ValueHelpRangeOperation.LT], "string");
		this.oValueHelpDialog.setExcludeRangeOperations([library.valuehelpdialog.ValueHelpRangeOperation.EQ], "date");

		qUnit.equal(this.oValueHelpDialog._aIncludeRangeOperations["string"].length, 2, "the IncludeRangeOperation should contain 2 items");
		qUnit.equal(this.oValueHelpDialog._aExcludeRangeOperations["date"].length, 1, "the ExcludeRangeOperation should contain 1 item");
	});

	QUnit.test("test set Filterbar", function (qUnit) {
		var oFilterbar = new SmartFilterBar();
		this.oValueHelpDialog.setFilterBar(oFilterbar);
		qUnit.equal(this.oValueHelpDialog.getFilterBar(), oFilterbar, "Should return the added Filterbar");

		// replace it by another filterbar
		oFilterbar = new SmartFilterBar();
		this.oValueHelpDialog.setFilterBar(oFilterbar);
		qUnit.equal(this.oValueHelpDialog.getFilterBar(), oFilterbar, "Should return the added Filterbar");
	});

	QUnit.test("test set/get Tokens", function (qUnit) {
		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyCode",
			label: "ID"
		}, {
			key: "CompanyName",
			label: "Name"
		}]);

		qUnit.notOk(this.oValueHelpDialog._oRemoveAllSelectedItemsBtn.getEnabled(), "remove selected tokens button disabled");
		qUnit.notOk(this.oValueHelpDialog._oRemoveAllExcludeItemsBtn.getEnabled(), "remove excluded tokens button disabled");

		_InitToken(this.oValueHelpDialog);
		qUnit.equal(this.oValueHelpDialog._oSelectedItems.getItems().length, 2, "the Tokens array should contain 2 entries");
		var keys = Object.keys(this.oValueHelpDialog._oSelectedRanges);
		qUnit.equal(keys.length, 3, "the Tokens array should contain 3 entries");
		qUnit.ok(this.oValueHelpDialog._oRemoveAllSelectedItemsBtn.getEnabled(), "remove selected tokens button enabled");
		qUnit.ok(this.oValueHelpDialog._oRemoveAllExcludeItemsBtn.getEnabled(), "remove excluded tokens button enabled");
		qUnit.equal(this.oValueHelpDialog._oSelectedTokens.getTokens().length, 4, "SelectedTokens should be 4");
		qUnit.equal(this.oValueHelpDialog._oExcludedTokens.getTokens().length, 1, "ExcludedTokens should be 1");

		// remove all tokens by setting an empty array
		this.oValueHelpDialog.setTokens([]);
		qUnit.equal(this.oValueHelpDialog._oSelectedItems.getItems().length, 0, "the Tokens array should contain 0 entries");
		keys = Object.keys(this.oValueHelpDialog._oSelectedRanges);
		qUnit.equal(keys.length, 0, "the Tokens array should contain 0 entries");
		qUnit.notOk(this.oValueHelpDialog._oRemoveAllSelectedItemsBtn.getEnabled(), "remove selected tokens button disabled");
		qUnit.notOk(this.oValueHelpDialog._oRemoveAllExcludeItemsBtn.getEnabled(), "remove excluded tokens button disabled");
		qUnit.equal(this.oValueHelpDialog._oSelectedTokens.getTokens().length, 0, "SelectedTokens should be 0");
		qUnit.equal(this.oValueHelpDialog._oExcludedTokens.getTokens().length, 0, "ExcludedTokens should be 0");

		// check only value token
		var oToken = new Token({
			key: "0001",
			text: "SAP A.G. (0001)"
		});
		this.oValueHelpDialog.setTokens([oToken]);
		qUnit.ok(this.oValueHelpDialog._oRemoveAllSelectedItemsBtn.getEnabled(), "remove selected tokens button enabled");
		qUnit.notOk(this.oValueHelpDialog._oRemoveAllExcludeItemsBtn.getEnabled(), "remove excluded tokens button disabled");
		qUnit.equal(this.oValueHelpDialog._oSelectedTokens.getTokens().length, 1, "SelectedTokens should be 1");
		qUnit.equal(this.oValueHelpDialog._oExcludedTokens.getTokens().length, 0, "ExcludedTokens should be 0");

		this.oValueHelpDialog.setTokens([]);
		oToken.destroy();
	});

	QUnit.test("test getTableAsync", function (qUnit) {
		var fnDone = qUnit.async();
		this.oValueHelpDialog.getTableAsync().then(function(oTable){
			qUnit.ok(sap.ui.require("sap/ui/table/library"), "sap.ui.table library loaded");
			qUnit.ok(oTable && oTable.isA("sap.ui.table.Table"), "Table is a sao.ui.table.Table");
			fnDone();
		});
		qUnit.notOk(this.oValueHelpDialog._oTable, "Table not created syncronously");
	});

	QUnit.test("test getTable", function (qUnit) {
		var oTable = this.oValueHelpDialog.getTable();
		qUnit.ok(sap.ui.require("sap/ui/table/library"), "sap.ui.table library loaded");
		qUnit.ok(oTable && oTable.isA("sap.ui.table.Table"), "Table is a sao.ui.table.Table");
	});

	QUnit.test("test resetTableState", function (qUnit) {
		var fnDone = qUnit.async();
		this.oValueHelpDialog.getTableAsync().then(function(oTable){
			this.oValueHelpDialog.resetTableState();
			var sCurrentNoData = oTable.getNoData ? oTable.getNoData() : oTable.getNoDataText();
			qUnit.equal(sCurrentNoData, this.oValueHelpDialog._oRb.getText("VALUEHELPDLG_TABLE_PRESSSEARCH"), "checking the NoDataText of Table");
			fnDone();
		}.bind(this));
	});

	QUnit.test("test TableStateSearchData", function (qUnit) {
		var fnDone = qUnit.async();
		this.oValueHelpDialog.getTableAsync().then(function(oTable){
			this.oValueHelpDialog.TableStateSearchData();
			var sCurrentNoData = oTable.getNoData ? oTable.getNoData() : oTable.getNoDataText();
			qUnit.equal(sCurrentNoData, this.oValueHelpDialog._oRb.getText("VALUEHELPDLG_TABLE_PRESSSEARCH"), "checking the NoDataText of Table");
			fnDone();
		}.bind(this));
	});

	QUnit.test("test TableStateDataSearching", function (qUnit) {
		var fnDone = qUnit.async();
		this.oValueHelpDialog.getTableAsync().then(function(oTable){
			this.oValueHelpDialog.TableStateDataSearching();
			var sCurrentNoData = oTable.getNoData ? oTable.getNoData() : oTable.getNoDataText();
			qUnit.equal(sCurrentNoData, this.oValueHelpDialog._oRb.getText("VALUEHELPDLG_TABLE_SEARCHING"), "checking the NoDataText of Table");
			fnDone();
		}.bind(this));
	});

	QUnit.test("test TableStateDataFilled", function (qUnit) {
		var fnDone = qUnit.async();
		this.oValueHelpDialog.getTableAsync().then(function(oTable){
			this.oValueHelpDialog.TableStateDataFilled();
			var sCurrentNoData = oTable.getNoData ? oTable.getNoData() : oTable.getNoDataText();
			qUnit.equal(sCurrentNoData, this.oValueHelpDialog._oRb.getText("VALUEHELPDLG_TABLE_NODATA"), "checking the NoDataText of Table");
			fnDone();
		}.bind(this));
	});

	QUnit.test("test FormatedRangeTokenText", function (qUnit) {
		var result = this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.BT, "v1", "v2", false, "keyField");
		qUnit.equal(result, "v1...v2", "result must be correct");

		result = this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.EQ, "v1", "", false, "keyField");
		qUnit.equal(result, "=v1", "result must be correct");

		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyCode",
			label: "ID"
		}, {
			key: "CompanyName",
			label: "Name"
		}, {
			key: "date",
			label: "date",
			type: "date"
		}, {
			key: "time",
			label: "time",
			type: "time"
		}, {
			key: "boolean",
			label: "boolean",
			type: "boolean"
		}, {
			key: "numeric",
			label: "numeric",
			type: "numeric",
			scale: 2,
			precision: 10
		}]);
		result = this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.EndsWith, "v1", "", false, "CompanyName");
		qUnit.equal(result, "Name: *v1", "result must be correct");

		result = this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.StartsWith, "v1", "", false, "CompanyName");
		qUnit.equal(result, "Name: v1*", "result must be correct");

		result = this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.Contains, "v1", "", false, "CompanyName");
		qUnit.equal(result, "Name: *v1*", "result must be correct");

		result = this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.LE, "v1", "", true, "CompanyCode");
		qUnit.equal(result, "ID: !(<=v1)", "result must be correct");

		result = this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.LT, "v1", "", true, "CompanyCode");
		qUnit.equal(result, "ID: !(<v1)", "result must be correct");

		result = this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.GT, new Date(2000, 0, 1), "", false, "date");
		qUnit.ok(/date: <*/.test(result), "result must be correct");

		result = this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.GE, new Date(2000, 0, 0, 10, 10, 0), "", false, "time");
		qUnit.ok(/time: >=*/.test(result), "result must be correct");

		result = this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.EQ, true, "", false, "boolean");
		qUnit.ok(/boolean: =*/.test(result), "result must be correct");

		result = this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.BT, 10.123, 100.123, false, "numeric");
		qUnit.ok(/numeric: (.+)\.\.\.(.+)/.test(result), "result must be correct");
	});

	QUnit.test("test _updateTitles", function (qUnit) {
		_InitToken(this.oValueHelpDialog);
		this.oValueHelpDialog._oTokenizerPanel.setExpanded(true);
		this.oValueHelpDialog._updateTitles();

		if (Device.system.desktop) {
			// only on Desktop the Table title exist and can be tested! (do not check for tablet, as most desktops are recognized as combi device)
			var fnDone = qUnit.async();
			this.oValueHelpDialog.getTableAsync().then(function(oTable){
				qUnit.equal(oTable.getTitle().getText(), this.oValueHelpDialog._sTableTitleNoCount, "Table title should be " + this.oValueHelpDialog._sTableTitleNoCount);
				fnDone();
			}.bind(this));
		}

		var sTitle = "(4)";
		qUnit.equal(this.oValueHelpDialog._oTokenizerPanel.getHeaderText().match("\\(4\\)$"), sTitle, "Selected Item title should ends with " + sTitle);
		sTitle = "(1)";
		qUnit.equal(this.oValueHelpDialog._oExcludedTokenTitle.getText().match("\\(1\\)$"), sTitle, "Excluded tokens title should ends with " + sTitle);
	});

	QUnit.test("test set/get maxIncludeRanges", function (qUnit) {
		qUnit.equal(this.oValueHelpDialog.getMaxIncludeRanges(), "-1", "Table MaxIncludeRanges should be -1");
		this.oValueHelpDialog.setMaxIncludeRanges("1");
		qUnit.equal(this.oValueHelpDialog.getMaxIncludeRanges(), "1", "Table MaxIncludeRanges should be 1");
	});

	QUnit.test("test set/get maxExcludeRanges", function (qUnit) {
		qUnit.equal(this.oValueHelpDialog.getMaxExcludeRanges(), "-1", "Table MaxExcludeRanges should be -1");
		this.oValueHelpDialog.setMaxExcludeRanges("1");
		qUnit.equal(this.oValueHelpDialog.getMaxExcludeRanges(), "1", "Table MaxExcludeRanges should be 1");
	});

	QUnit.test("test _getFormatedRangeTokenText", function (qUnit) {
		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyCode",
			label: "ID"
		}, {
			key: "CompanyName",
			label: "Name"
		}]);

		qUnit.equal(this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.Empty, "", "", false, "CompanyCode"), "ID: <empty>", "returned value is correct");
		qUnit.equal(this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.GT, "v1", "v2", false, "CompanyCode"), "ID: >v1", "returned value is correct");
		qUnit.equal(this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.GE, "v1", "v2", false, "CompanyCode"), "ID: >=v1", "returned value is correct");
		qUnit.equal(this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.GE, "v1", "v2", true, "CompanyCode"), "ID: !(>=v1)", "returned value is correct");
		qUnit.equal(this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.LT, "v1", "v2", false, "CompanyCode"), "ID: <v1", "returned value is correct");
		qUnit.equal(this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.Contains, "v1", "v2", false, "CompanyCode"), "ID: *v1*", "returned value is correct");
		qUnit.equal(this.oValueHelpDialog._getFormatedRangeTokenText(library.valuehelpdialog.ValueHelpRangeOperation.StartsWith, "v1", "v2", false, "CompanyCode"), "ID: v1*", "returned value is correct");
	});

	QUnit.test("setTokens does not throw exception if '{' is part of the key of some tokens", function (assert) {
		// Arrange
		var oToken = new Token();
		oToken.setKey("not{escaped{key");
		oToken.setText("not{escaped{text");

		// Act
		this.oValueHelpDialog.setTokens([oToken]);

		// Assert
		assert.ok(true, "no exception is thrown");
	});

	QUnit.module("Async tests with Dialog Open", {
		beforeEach: function () {
			this.oValueHelpDialog = new ValueHelpDialog("VHD");
			this.oValueHelpDialog.addStyleClass("sapUiSizeCompact");
		},
		afterEach: function () {
			this.oValueHelpDialog.close();
			this.oValueHelpDialog.destroy();
			this.oValueHelpDialog = null;
			sap.ui.getCore().applyChanges();
		}
	});

	QUnit.test("test removeAllToken", function (qUnit) {
		var done = qUnit.async();

		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyCode",
			label: "ID"
		}, {
			key: "CompanyName",
			label: "Name"
		}]);
		_InitToken(this.oValueHelpDialog);

		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		var fnOpened = function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			qUnit.ok(this.oValueHelpDialog._oRemoveAllSelectedItemsBtn);
			qUnit.equal(this.oValueHelpDialog._oSelectedItems.getItems().length, 2, "_oSelectedItems should be 2");

			var oTarget = this.oValueHelpDialog._oRemoveAllSelectedItemsBtn.getFocusDomRef();
			qutils.triggerTouchEvent("tap", oTarget, {
				srcControl: null
			});
			sap.ui.getCore().applyChanges();

			qUnit.equal(this.oValueHelpDialog._oSelectedItems.getItems().length, 0, "_oSelectedItems should be 0");

			qUnit.ok(this.oValueHelpDialog._oRemoveAllExcludeItemsBtn);
			qUnit.equal(Object.keys(this.oValueHelpDialog._oSelectedRanges).length, 1, "_oSelectedRanges should be 1");

			oTarget = this.oValueHelpDialog._oRemoveAllExcludeItemsBtn.getFocusDomRef();
			qutils.triggerTouchEvent("tap", oTarget, {
				srcControl: null
			});
			sap.ui.getCore().applyChanges();

			qUnit.equal(Object.keys(this.oValueHelpDialog._oSelectedRanges).length, 0, "_oSelectedRanges should be 0");

			var oTokenizerPanel = this.oValueHelpDialog._oTokenizerPanel;
			oTokenizerPanel.fireExpand();

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();
		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();
	});

	QUnit.test("test remove single tokens", function (qUnit) {
		var done = qUnit.async();

		this.oValueHelpDialog.attachTokenRemove(function (oEvent) {
			oEvent.getParameters().useDefault = true;
		});

		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyCode",
			label: "ID"
		}, {
			key: "CompanyName",
			label: "Name"
		}]);
		_InitToken(this.oValueHelpDialog);

		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		var fnOpened = function () {
			this.oValueHelpDialog._bTableCreatedInternal = false;

			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			qUnit.ok(this.oValueHelpDialog._oSelectedTokens);
			qUnit.equal(this.oValueHelpDialog._oSelectedTokens.getTokens().length, 4, "SelectedTokens should be 4");

			// remove tokens from the select tokenizer
			var oTokenizer = this.oValueHelpDialog._oSelectedTokens;
			var oItemToken = oTokenizer.getTokens()[0];
			var oRangeToken = oTokenizer.getTokens()[2];
			oTokenizer.fireTokenUpdate({
				type: "removed",
				addedTokens: [],
				removedTokens: [oItemToken]
			});
			sap.ui.getCore().applyChanges();

			qUnit.equal(this.oValueHelpDialog._oSelectedTokens.getTokens().length, 3, "SelectedTokens should be 3");

			this.oValueHelpDialog._bTableCreatedInternal = true;
			oTokenizer.fireTokenUpdate({
				type: "removed",
				addedTokens: [],
				removedTokens: [oRangeToken]
			});
			sap.ui.getCore().applyChanges();

			qUnit.equal(Object.keys(this.oValueHelpDialog._oSelectedRanges).length, 2, "SelectedRanges should be 2");


			// remove token from the exclude tokenizer
			oTokenizer = this.oValueHelpDialog._oExcludedTokens;
			oRangeToken = oTokenizer.getTokens()[0];

			oTokenizer.fireTokenChange({
				type: "removed",
				addedTokens: [],
				removedTokens: [oRangeToken]
			});
			sap.ui.getCore().applyChanges();

			qUnit.equal(Object.keys(this.oValueHelpDialog._oSelectedRanges).length, 1, "SelectedRanges should be 1");

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();
		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();
	});

	QUnit.test("test rowSelectionChanged", function (qUnit) {
		var done = qUnit.async();
		this.oValueHelpDialog.setKey("CompanyCode");
		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyCode",
			label: "ID"
		}, {
			key: "CompanyName",
			label: "Name"
		}]);
		_InitToken(this.oValueHelpDialog);
		_InitRows(this.oValueHelpDialog);

		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		function triggerSelectionOnRow(oTable, i, bKeyboard, bCtrlKey, bShiftKey) {
			var oCell = window.document.getElementById(oTable.getId() + "-rowsel" + i);
			oCell = oCell || window.document.getElementById("__item" + (i + 2) + "-selectMulti");
			oCell.focus();
			if (bKeyboard) {
				qutils.triggerKeydown(oCell, "SPACE", !!bShiftKey, false, !!bCtrlKey);
				qutils.triggerKeyup(oCell, "SPACE", !!bShiftKey, false, !!bCtrlKey);
			} else {
				qutils.triggerEvent("click", oCell, {
					metaKey: !!bCtrlKey,
					ctrlKey: !!bCtrlKey,
					shiftKey: !!bShiftKey
				});
			}
		}

		var fnOpened = function () {

			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			if (this.oValueHelpDialog._isPhone()) {
				this.oValueHelpDialog._updateView("PHONE_LIST_VIEW");
			}

			this.oValueHelpDialog.update();
			sap.ui.getCore().applyChanges();

			triggerSelectionOnRow(this.oValueHelpDialog._oTable, 1, this.oValueHelpDialog._isPhone(), false, false);

			this.oValueHelpDialog._bTableCreatedInternal = false;
			this.oValueHelpDialog.attachSelectionChange(function (oEvent) {
				oEvent.getParameters().useDefault = true;
			});

			triggerSelectionOnRow(this.oValueHelpDialog._oTable, 2, this.oValueHelpDialog._isPhone(), false, false);
			triggerSelectionOnRow(this.oValueHelpDialog._oTable, 3, this.oValueHelpDialog._isPhone(), false, false);

			qUnit.equal(this.oValueHelpDialog._oSelectedItems.getItems().length, 3, "SelectedItems should be 3");

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();

		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();

	});

	QUnit.test("test bind table and update", function (qUnit) {
		var done = qUnit.async();

		this.oValueHelpDialog.setKey("CompanyCode");
		_InitToken(this.oValueHelpDialog);
		_InitRows(this.oValueHelpDialog);

		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		var fnOpened = function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			this.oValueHelpDialog.update();
			qUnit.ok(this.oValueHelpDialog);

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();

		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();

	});

	/* old	*/
	QUnit.test("test change view between SelectedItems and Conditions", function (qUnit) {
		var done = qUnit.async();

		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyCode",
			label: "ID"
		}, {
			key: "CompanyName",
			label: "Name"
		}]);
		this.oValueHelpDialog.setSupportRanges(true);
		_InitToken(this.oValueHelpDialog);
		_InitRows(this.oValueHelpDialog);

		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		var fnOpened = function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			this.oValueHelpDialog._updateView("DESKTOP_LIST_VIEW");
			sap.ui.getCore().applyChanges();

			qUnit.equal(this.oValueHelpDialog._oRanges, null, "The ranges part should not exist");

			this.oValueHelpDialog._updateView("DESKTOP_CONDITIONS_VIEW");
			sap.ui.getCore().applyChanges();

			qUnit.notEqual(this.oValueHelpDialog._oRanges, null, "The ranges part should exist");

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();

		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();

	});


	/* old
	QUnit.test("test toggle between Ranges and mainTable", function(qUnit) {
		var done = qUnit.async();

		this.oValueHelpDialog.setRangeKeyFields([{key: "CompanyCode", label: "ID"}, {key:"CompanyName", label : "Name"}]);
		_InitToken(this.oValueHelpDialog);
		_InitRows(this.oValueHelpDialog);

		var fnClosed = function() {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		var fnOpened = function() {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			this.oValueHelpDialog.setSupportRanges(true);
			qUnit.equal(this.oValueHelpDialog._oRanges, null, "The oRanges grid should not exist");

			//this.oValueHelpDialog._onRangesPressed()();
			this.oValueHelpDialog._updateView("DESKTOP_CONDITIONS_VIEW");
			sap.ui.getCore().applyChanges();


			qUnit.notEqual(this.oValueHelpDialog._oRanges, null, "The oRanges grid should exist");

			var fnValidateCallback= function() {};
			var fnSpy= sinon.spy(fnValidateCallback);

			this.oValueHelpDialog._validateRanges(fnSpy);

			this.oValueHelpDialog._oBackButton.firePress();
			sap.ui.getCore().applyChanges();


			qUnit.equal(this.oValueHelpDialog.getContent()[0], this.oValueHelpDialog._oMainGrid, "The dialog content should be the MainGrid");
			qUnit.equal(fnSpy.callCount, 1, "validateCallback callback function was called");

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();

		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();

	});*/

	QUnit.test("test _onCloseAndTakeOverValues", function (qUnit) {
		var done = qUnit.async();

		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyCode",
			label: "ID"
		}, {
			key: "CompanyName",
			label: "Name"
		}]);
		_InitToken(this.oValueHelpDialog);

		this.aTokens = [];
		var that = this;
		var fnc = function (oControlEvent) {
			that.aTokens = oControlEvent.getParameter("tokens");
		};
		this.oValueHelpDialog.attachOk(fnc);

		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		var fnOpened = function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			this.oValueHelpDialog._onCloseAndTakeOverValues();

			qUnit.equal(that.aTokens.length, 5, "Ok event should return 5 tokens");
			this.oValueHelpDialog.detachOk(fnc);
			delete this.aTokens;

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();

		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();

	});

	QUnit.test("Test open with supportRangesOnly and create range token", function (qUnit) {
		var done = qUnit.async();

		this.oValueHelpDialog.setSupportRanges(true);
		this.oValueHelpDialog.setSupportRangesOnly(true);
		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyName",
			label: "Name",
			type: "string"
		}]);

		this.aTokens = [];
		var that = this;
		var fnc = function (oControlEvent) {
			that.aTokens = oControlEvent.getParameter("tokens");
		};
		this.oValueHelpDialog.attachOk(fnc);

		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		var fnOpened = function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);


			if (Device.system.phone) {
				this.oValueHelpDialog._updateView("PHONE_CONDITIONS_VIEW");
			}

			// Change item
			var oConditionPanel = this.oValueHelpDialog._oFilterPanel._oIncludeFilterPanel;
			var oConditionGrid = oConditionPanel._oConditionsGrid.getContent()[0];
			var sValue1 = "foo";
			oConditionGrid.value1.setValue(sValue1);
			oConditionPanel._changeField(oConditionGrid);


			this.oValueHelpDialog._onCloseAndTakeOverValues();
			sap.ui.getCore().applyChanges();


			qUnit.equal(that.aTokens.length, 1, "Ok event should return 1 token");
			qUnit.equal(that.aTokens[0].getText(), "*foo*", "token text should return '*" + sValue1 + "*'");
			that.oValueHelpDialog.detachOk(fnc);
			delete that.aTokens;

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();

		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();

	});

	QUnit.test("Test open with supportRangesOnly and create range token of type date", function (qUnit) {
		var done = qUnit.async();

		this.oValueHelpDialog.setSupportRanges(true);
		this.oValueHelpDialog.setSupportRangesOnly(true);
		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyName",
			label: "Name",
			type: "date"
		}]);

		this.aTokens = [];
		var that = this;
		var fnc = function (oControlEvent) {
			that.aTokens = oControlEvent.getParameter("tokens");
		};
		this.oValueHelpDialog.attachOk(fnc);

		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		var fnOpened = function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			if (Device.system.phone) {
				this.oValueHelpDialog._updateView("PHONE_CONDITIONS_VIEW");
			}

			// Change item
			var oConditionPanel = this.oValueHelpDialog._oFilterPanel._oIncludeFilterPanel;
			var oConditionGrid = oConditionPanel._oConditionsGrid.getContent()[0];
			oConditionGrid.value1.setDateValue(new Date());
			var oFakeDateEvent = new Event("fakeDateEvent", this, {
				valid: "true"
			});

			oConditionPanel._changeField(oConditionGrid, oFakeDateEvent);

			this.oValueHelpDialog._onCloseAndTakeOverValues();
			sap.ui.getCore().applyChanges();


			qUnit.equal(that.aTokens.length, 1, "Ok event should return 1 token");
			qUnit.ok(that.aTokens[0].data("range").value1 instanceof Date, "token value should return return Date");
			that.oValueHelpDialog.detachOk(fnc);
			delete that.aTokens;


			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();

		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();

	});

	QUnit.test("test _onCancel", function (qUnit) {
		var done = qUnit.async();

		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyCode",
			label: "ID"
		}, {
			key: "CompanyName",
			label: "Name"
		}]);
		_InitToken(this.oValueHelpDialog);

		var that = this;
		var fnCancelCallback = function () { };
		var fnSpy = sinon.spy(fnCancelCallback);
		this.oValueHelpDialog.attachCancel(fnSpy);


		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		var fnOpened = function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			this.oValueHelpDialog._onCancel();
			sap.ui.getCore().applyChanges();


			qUnit.equal(fnSpy.callCount, 1, "cancel callback function was called");
			that.oValueHelpDialog.detachCancel(fnSpy);

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();

		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();

	});

	QUnit.test("stable IDs", function (qUnit) {
		var done = qUnit.async();

		this.oValueHelpDialog.setKey("CompanyCode");
		this.oValueHelpDialog.setSupportRanges(true);
		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyName",
			label: "Name",
			type: "date"
		}]);

		_InitToken(this.oValueHelpDialog);
		var that = this;
		var fnc = function (oControlEvent) {
			that.aTokens = oControlEvent.getParameter("tokens");
		};
		this.oValueHelpDialog.attachOk(fnc);

		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		var fnOpened = function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);
			var sId = this.oValueHelpDialog.getId();
			// only need to test interactive controls for stable IDs
			// do not check the control tree, as this must not be stable - just check if controls exist
			var oNavigationBar = sap.ui.getCore().byId(sId + "-navigation");
			qUnit.ok(oNavigationBar, "navigation bar found");
			var oFilterTable = sap.ui.getCore().byId(sId + "-itemstable");
			qUnit.ok(oFilterTable, "navigation item for table found");
			var oFilterRanges = sap.ui.getCore().byId(sId + "-ranges");
			qUnit.ok(oFilterRanges, "navigation item for ranged found");
			var oButton = sap.ui.getCore().byId(sId + "-ok");
			qUnit.ok(oButton, "ok button found");
			oButton = sap.ui.getCore().byId(sId + "-cancel");
			qUnit.ok(oButton, "cancel button found");
			oButton = sap.ui.getCore().byId(sId + "-removeSelItems");
			qUnit.ok(oButton, "remove selected items button found");
			oButton = sap.ui.getCore().byId(sId + "-removeExclItems");
			qUnit.ok(oButton, "remove excluded items button found");
			var oTable = sap.ui.getCore().byId(sId + "-table");
			qUnit.ok(oTable, "table found");

			this.oValueHelpDialog._updateView("DESKTOP_CONDITIONS_VIEW");
			var oFilterPanel = sap.ui.getCore().byId(sId + "-filterPanel");
			qUnit.ok(oFilterPanel, "Filter Panel found");

			that.oValueHelpDialog.detachOk(fnc);
			delete that.aTokens;

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();

		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();

	});

	QUnit.module("Async tests with Phone mode", {
		before: function () {
			this.orgPhone = Device.system.phone;
		},
		after: function () {
			Device.system.phone = this.orgPhone;
		},
		beforeEach: function () {

			Device.system.phone = true;
			this.oValueHelpDialog = new ValueHelpDialog("VHD");
			this.oValueHelpDialog.addStyleClass("sapUiSizeCompact");
		},
		afterEach: function () {
			this.oValueHelpDialog.close();
			this.oValueHelpDialog.destroy();
			this.oValueHelpDialog = null;
			sap.ui.getCore().applyChanges();
		}
	});

	QUnit.test("test open in phone mode", function (qUnit) {
		var done = qUnit.async();

		this.oValueHelpDialog.setRangeKeyFields([{
			key: "CompanyCode",
			label: "ID"
		}, {
			key: "CompanyName",
			label: "Name"
		}]);
		_InitToken(this.oValueHelpDialog);

		var oFilterbar = new SmartFilterBar({
			advancedMode: true
		});

		oFilterbar.setBasicSearch(new SearchField());
		this.oValueHelpDialog.setFilterBar(oFilterbar);

		var fnClosed = function () {
			this.oValueHelpDialog.detachAfterClose(fnClosed);
			done();
		}.bind(this);

		var fnOpened = function () {
			this.oValueHelpDialog.detachAfterOpen(fnOpened);

			qUnit.ok(this.oValueHelpDialog._oRemoveAllSelectedItemsBtn);
			qUnit.equal(this.oValueHelpDialog._oSelectedItems.getItems().length, 2, "_oSelectedItems should be 2");

			this.oValueHelpDialog._updateView("PHONE_LIST_VIEW");
			sap.ui.getCore().applyChanges();

			qUnit.equal(this.oValueHelpDialog._oRanges, null, "The ranges part should not exist");

			this.oValueHelpDialog._updateView("PHONE_SEARCH_VIEW");
			sap.ui.getCore().applyChanges();

			qUnit.equal(this.oValueHelpDialog._oFilterBar.getVisible(), true, "The Filterbar should by visible");

			this.oValueHelpDialog._updateView("PHONE_CONDITIONS_VIEW");
			sap.ui.getCore().applyChanges();

			qUnit.notEqual(this.oValueHelpDialog._oRanges, null, "The ranges part should exist");

			this.oValueHelpDialog._updateView("PHONE_MAIN_VIEW");
			sap.ui.getCore().applyChanges();

			qUnit.equal(this.oValueHelpDialog._oRanges.getVisible(), false, "The ranges part should be not visible");

			this.oValueHelpDialog.attachAfterClose(fnClosed);
			this.oValueHelpDialog.close();
		}.bind(this);

		this.oValueHelpDialog.attachAfterOpen(fnOpened);
		this.oValueHelpDialog.open();
	});

	QUnit.test("test set Filterbar", function (qUnit) {
		var oFilterbar = new SmartFilterBar({
			advancedMode: true
		});

		// basic search text before the filterbar exist
		this.oValueHelpDialog.setBasicSearchText("bar");
		qUnit.equal(this.oValueHelpDialog.getBasicSearchText(), "bar", "basicSearchText should be bar");

		oFilterbar.setBasicSearch(new SearchField());
		this.oValueHelpDialog.setFilterBar(oFilterbar);

		// update the search text
		this.oValueHelpDialog.setBasicSearchText("foo");
		qUnit.equal(this.oValueHelpDialog.getBasicSearchText(), "foo", "basicSearchText should be foo");
	});

	QUnit.module("Testing Private API", {
		beforeEach: function () {
			this.oValueHelpDialog = new ValueHelpDialog();
		},
		afterEach: function () {
			this.oValueHelpDialog.destroy();
			this.oValueHelpDialog = null;
		}
	});

	QUnit.test("_addToken2Tokenizer does not throw exception if '{' is part of the key", function (assert) {
		var oTokenizerStub = {
			addToken: this.stub(),
			getTokens: this.stub().returns([])
		};

		this.oValueHelpDialog._addToken2Tokenizer("not{escaped{key", "not{escaped{text", oTokenizerStub, "keyField");

		assert.ok(true, "no exception is thrown");
	});

	QUnit.test("_createRanges creates P13nFilterProvider with extended exclude operations", function (assert) {
		// Arrange
		var oPanelFunctionSpy = sinon.spy(P13nFilterPanel.prototype, "_enableEnhancedExcludeOperations");
		this.oValueHelpDialog.setProperty("_enhancedExcludeOperations", true);

		// Act
		this.oValueHelpDialog._createRanges();

		// Assert
		assert.strictEqual(oPanelFunctionSpy.callCount, 1, "Method called once during panel creation");

		// Cleanup
		oPanelFunctionSpy.restore();
	});

	QUnit.start();

});
