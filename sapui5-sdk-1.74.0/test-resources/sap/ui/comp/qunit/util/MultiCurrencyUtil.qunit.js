/* global QUnit, sinon */
(function() {
	"use strict";

	QUnit.config.autostart = false;

	sap.ui.define([
		"sap/ui/comp/smarttable/SmartTable", "sap/ui/comp/util/MultiCurrencyUtil", "sap/m/HBox", "sap/m/Link", "sap/ui/core/Control", "sap/ui/model/analytics/AnalyticalBinding", "sap/ui/model/Context", "sap/ui/table/AnalyticalColumn", "sap/ui/model/Filter"
	], function(SmartTable, MultiCurrencyUtil, HBox, Link, Control, AnalyticalBinding, Context, AnalyticalColumn, Filter) {

		QUnit.module("sap.ui.comp.util.MultiCurrencyUtil");

		QUnit.test("Shall be instantiable", function(assert) {
			assert.ok(MultiCurrencyUtil);
		});

		QUnit.test("Shall return a boolean value indicating whether multi-currency " * " value is present for currency", function(assert) {
			assert.strictEqual(MultiCurrencyUtil.isMultiCurrency("*"), true);
			assert.strictEqual(MultiCurrencyUtil.isMultiCurrency("EUR"), false);
		});

		QUnit.test("Shall open a poover for multi-currency based on the context/analytical info -- No Binding", function(assert) {
			var oTemplate = sinon.createStubInstance(HBox); // Dummy Template
			oTemplate.clone.returns(oTemplate); // mock clone method
			var oLink = sinon.createStubInstance(Link); // Dummy link --> Event source
			// Stub parent(s) of event source
			oLink.getParent.returns({
				getParent: function() {
					return new Control();
				}
			});
			// create a dummy instance of SmartTable
			var sSmartTableId = "idView--ItemsST";
			var oSmartTable = new SmartTable(sSmartTableId, {
				tableType: "AnalyticalTable"
			});

			var oAnalyticalTable = oSmartTable.getTable();
			// Stub the "row binding" of table to return necessary mock data
			sinon.stub(oAnalyticalTable, "getBinding");
			oAnalyticalTable.getBinding.returns(undefined);

			// spies
			sinon.spy(oAnalyticalTable, "addDependent");

			// create additional mock parameter data needed for popover
			var mMultiCurrencyParameters = {
				additionalParent: true,
				currency: "AmountInTransactionCurrency",
				unit: "TransactionCurrency",
				smartTableId: sSmartTableId,
				template: oTemplate
			};
			var oEvent = {
				getSource: function() {
					return oLink;
				},
				mParameters: {
					id: "__link0-__clone1"
				}
			};

			MultiCurrencyUtil.openMultiCurrencyPopover(oEvent, mMultiCurrencyParameters);

			var oPopover = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover");
			assert.ok(!oPopover);
			var oList = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover-detailsList");
			assert.ok(!oList);
			assert.ok(oAnalyticalTable.addDependent.notCalled);
			oSmartTable.destroy();
		});

		QUnit.test("Shall open a poover for multi-currency based on the context/analytical info -- No currency/unit", function(assert) {
			var sPath = "/Items";
			var oTemplate = sinon.createStubInstance(HBox); // Dummy Template
			oTemplate.clone.returns(oTemplate); // mock clone method
			var oLink = sinon.createStubInstance(Link); // Dummy link --> Event source
			// Stub parent(s) of event source
			oLink.getParent.returns({
				getParent: function() {
					return new Control();
				}
			});
			// create a dummy instance of SmartTable
			var sSmartTableId = "idView--ItemsST";
			var oSmartTable = new SmartTable(sSmartTableId, {
				tableType: "AnalyticalTable"
			});

			var oAnalyticalTable = oSmartTable.getTable();
			// Stub the "row binding" of table to return necessary mock data
			sinon.stub(oAnalyticalTable, "getBinding");
			var oBinding = sinon.createStubInstance(AnalyticalBinding);
			oAnalyticalTable.getBinding.returns(oBinding);
			// mock binding data
			oBinding.getPath.returns(sPath);

			// spies
			sinon.spy(oAnalyticalTable, "addDependent");

			// create additional mock parameter data needed for popover
			var mMultiCurrencyParameters = {
				additionalParent: true,
				currency: undefined,
				unit: "",
				smartTableId: sSmartTableId,
				template: oTemplate
			};
			var oEvent = {
				getSource: function() {
					return oLink;
				},
				mParameters: {
					id: "__link0-__clone1"
				}
			};

			MultiCurrencyUtil.openMultiCurrencyPopover(oEvent, mMultiCurrencyParameters);

			var oPopover = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover");
			assert.ok(!oPopover);
			var oList = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover-detailsList");
			assert.ok(!oList);
			assert.ok(oAnalyticalTable.addDependent.notCalled);
			oSmartTable.destroy();
		});

		QUnit.test("Shall open a poover for multi-currency based on the context/analytical info -- No AnalyticalInfo for row", function(assert) {
			var sPath = "/Items";
			var oTemplate = sinon.createStubInstance(HBox); // Dummy Template
			oTemplate.clone.returns(oTemplate); // mock clone method
			var oLink = sinon.createStubInstance(Link); // Dummy link --> Event source
			// Stub parent(s) of event source
			oLink.getParent.returns({
				getParent: function() {
					return new Control();
				}
			});
			// create a dummy instance of SmartTable
			var sSmartTableId = "idView--ItemsST";
			var oSmartTable = new SmartTable(sSmartTableId, {
				tableType: "AnalyticalTable"
			});

			// Stub the "getAnalyticalInfoOfRow" method to return necessary mock data
			var oAnalyticalTable = oSmartTable.getTable();
			sinon.stub(oAnalyticalTable, "getAnalyticalInfoOfRow");
			// Return AnalyticalInfo for grandTotals
			oAnalyticalTable.getAnalyticalInfoOfRow.returns(undefined);

			// Stub the "row binding" of table to return necessary mock data
			sinon.stub(oAnalyticalTable, "getBinding");
			var oBinding = sinon.createStubInstance(AnalyticalBinding);
			oAnalyticalTable.getBinding.returns(oBinding);
			// mock binding data
			oBinding.getPath.returns(sPath);

			// spies
			sinon.spy(oAnalyticalTable, "addDependent");

			// create additional mock parameter data needed for popover
			var mMultiCurrencyParameters = {
				additionalParent: true,
				currency: "AmountInTransactionCurrency",
				unit: "TransactionCurrency",
				smartTableId: sSmartTableId,
				template: oTemplate
			};
			var oEvent = {
				getSource: function() {
					return oLink;
				},
				mParameters: {
					id: "__link0-__clone1"
				}
			};

			MultiCurrencyUtil.openMultiCurrencyPopover(oEvent, mMultiCurrencyParameters);

			var oPopover = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover");
			assert.ok(!oPopover);
			var oList = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover-detailsList");
			assert.ok(!oList);
			assert.ok(oAnalyticalTable.addDependent.notCalled);
			oSmartTable.destroy();
		});

		QUnit.test("Shall open a poover for multi-currency based on the context/analytical info -- Grand Total", function(assert) {
			var sPath = "/Items";
			var oTemplate = sinon.createStubInstance(HBox); // Dummy Template
			oTemplate.clone.returns(oTemplate); // mock clone method
			var oLink = sinon.createStubInstance(Link); // Dummy link --> Event source
			// Stub parent(s) of event source
			oLink.getParent.returns({
				getParent: function() {
					return new Control();
				}
			});
			// create a dummy instance of SmartTable
			var sSmartTableId = "idView--ItemsST";
			var oSmartTable = new SmartTable(sSmartTableId, {
				tableType: "AnalyticalTable"
			});

			// Stub the "getAnalyticalInfoOfRow" method to return necessary mock data
			var oAnalyticalTable = oSmartTable.getTable();
			sinon.stub(oAnalyticalTable, "getAnalyticalInfoOfRow");
			// Return AnalyticalInfo for grandTotals
			oAnalyticalTable.getAnalyticalInfoOfRow.returns({
				context: new Context(),
				grandTotal: true,
				group: false,
				groupTotal: false,
				groupedColumns: [],
				level: 0
			});

			// Stub the "row binding" of table to return necessary mock data
			sinon.stub(oAnalyticalTable, "getBinding");
			var oBinding = sinon.createStubInstance(AnalyticalBinding);
			oAnalyticalTable.getBinding.returns(oBinding);
			// mock binding data
			oBinding.getPath.returns(sPath);

			// spies
			sinon.spy(oAnalyticalTable, "addDependent");

			// create additional mock parameter data needed for popover
			var mMultiCurrencyParameters = {
				additionalParent: true,
				currency: "AmountInTransactionCurrency",
				unit: "TransactionCurrency",
				smartTableId: sSmartTableId,
				template: oTemplate
			};
			var oEvent = {
				getSource: function() {
					return oLink;
				},
				mParameters: {
					id: "__link0-__clone1"
				}
			};

			var oPopover = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover");
			assert.ok(!oPopover);
			var oList = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover-detailsList");
			assert.ok(!oList);

			MultiCurrencyUtil.openMultiCurrencyPopover(oEvent, mMultiCurrencyParameters);
			oPopover = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover");
			assert.ok(oPopover);
			assert.strictEqual(oPopover.getTitle(), sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_MULTI_TOTAL_TITLE") || "Total");
			assert.strictEqual(oPopover.getPlacement(), "VerticalPreferredTop");
			assert.strictEqual(oAnalyticalTable.addDependent.calledOnce, true);
			assert.strictEqual(oAnalyticalTable.addDependent.calledWith(oPopover), true);
			oList = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover-detailsList");
			assert.ok(oList);
			var oListBindingInfo = oList.getBindingInfo("items");
			assert.strictEqual(oListBindingInfo.path, sPath);
			assert.strictEqual(oListBindingInfo.parameters.select, mMultiCurrencyParameters.currency + "," + mMultiCurrencyParameters.unit);
			assert.strictEqual(oListBindingInfo.template.getContent()[0], oTemplate);
			assert.strictEqual(oListBindingInfo.filters.length, 0);
			sinon.spy(oPopover, "destroy");
			assert.ok(oPopover.destroy.notCalled);
			oSmartTable.destroy();
			assert.ok(oPopover.destroy.called);
		});

		QUnit.test("Shall open a poover for multi-currency based on the context/analytical info -- Group / Group Total", function(assert) {
			var sPath = "/Items";
			var oTemplate = sinon.createStubInstance(HBox); // Dummy Template
			oTemplate.clone.returns(oTemplate); // mock clone method
			var oLink = sinon.createStubInstance(Link); // Dummy link --> Event source
			// Stub parent(s) of event source
			oLink.getParent.returns({
				getParent: function() {
					return new Control();
				}
			});
			// create a dummy instance of SmartTable
			var sSmartTableId = "idView--ItemsST";
			var oSmartTable = new SmartTable(sSmartTableId, {
				tableType: "AnalyticalTable"
			});

			// Stub the "getAnalyticalInfoOfRow" method to return necessary mock data
			var oAnalyticalTable = oSmartTable.getTable();
			sinon.stub(oAnalyticalTable, "getAnalyticalInfoOfRow");
			// create a mock grouped column
			var sGroupedColumn = sSmartTableId + "--DummyColumn";
			var oColumn = new AnalyticalColumn(sGroupedColumn, {
				leadingProperty: "Customer"
			});
			oAnalyticalTable.addColumn(oColumn);

			// create mock group context data
			var oContext = sinon.createStubInstance(Context);
			oContext.getProperty.returns("test");

			// Return AnalyticalInfo for grandTotals
			oAnalyticalTable.getAnalyticalInfoOfRow.returns({
				context: oContext,
				grandTotal: false,
				group: true,
				groupTotal: true,
				groupedColumns: [
					sGroupedColumn
				],
				level: 0
			});

			// Stub the "row binding" of table to return necessary mock data
			sinon.stub(oAnalyticalTable, "getBinding");
			var oBinding = sinon.createStubInstance(AnalyticalBinding);
			oAnalyticalTable.getBinding.returns(oBinding);
			// mock binding data
			oBinding.getPath.returns(sPath);

			// spies
			sinon.spy(oAnalyticalTable, "addDependent");

			// create additional mock parameter data needed for popover
			var mMultiCurrencyParameters = {
				additionalParent: true,
				currency: "AmountInTransactionCurrency",
				unit: "TransactionCurrency",
				smartTableId: sSmartTableId,
				template: oTemplate
			};
			var oEvent = {
				getSource: function() {
					return oLink;
				},
				mParameters: {
					id: "__link0-__clone1"
				}
			};

			var oPopover = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover");
			assert.ok(!oPopover);
			var oList = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover-detailsList");
			assert.ok(!oList);

			MultiCurrencyUtil.openMultiCurrencyPopover(oEvent, mMultiCurrencyParameters);
			oPopover = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover");
			assert.ok(oPopover);
			assert.strictEqual(oPopover.getTitle(), sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_MULTI_GROUP_TITLE") || "Subtotal");
			assert.strictEqual(oPopover.getPlacement(), "VerticalPreferredBottom");
			assert.strictEqual(oAnalyticalTable.addDependent.calledOnce, true);
			assert.strictEqual(oAnalyticalTable.addDependent.calledWith(oPopover), true);
			oList = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover-detailsList");
			assert.ok(oList);
			var oListBindingInfo = oList.getBindingInfo("items");
			assert.strictEqual(oListBindingInfo.path, sPath);
			assert.strictEqual(oListBindingInfo.parameters.select, mMultiCurrencyParameters.currency + "," + mMultiCurrencyParameters.unit);
			assert.strictEqual(oListBindingInfo.template.getContent()[0], oTemplate);
			assert.strictEqual(oListBindingInfo.filters.length, 1);
			assert.strictEqual(oListBindingInfo.filters[0].sPath, "Customer");
			sinon.spy(oPopover, "destroy");
			assert.ok(oPopover.destroy.notCalled);
			oSmartTable.destroy();
			assert.ok(oPopover.destroy.called);
		});

		QUnit.test("Shall open a poover for multi-currency based on the context/analytical info -- Group / Group Total - determine dimension", function(assert) {
			var sPath = "/Items";
			var oTemplate = sinon.createStubInstance(HBox); // Dummy Template
			oTemplate.clone.returns(oTemplate); // mock clone method
			var oLink = sinon.createStubInstance(Link); // Dummy link --> Event source
			// Stub parent(s) of event source
			oLink.getParent.returns({
				getParent: function() {
					return new Control();
				}
			});
			// create a dummy instance of SmartTable
			var sSmartTableId = "idView--ItemsST";
			var oSmartTable = new SmartTable(sSmartTableId, {
				tableType: "AnalyticalTable"
			});

			// Stub the "getAnalyticalInfoOfRow" method to return necessary mock data
			var oAnalyticalTable = oSmartTable.getTable();
			sinon.stub(oAnalyticalTable, "getAnalyticalInfoOfRow");
			// create a mock grouped column
			var sGroupedColumn = sSmartTableId + "--DummyColumn";
			var oColumn = new AnalyticalColumn(sGroupedColumn, {
				leadingProperty: "CustomerName"
			});
			oAnalyticalTable.addColumn(oColumn);

			// create a mock grouped column
			var sGroupedColumn2 = sSmartTableId + "--DummyColumn2";
			var oColumn2 = new AnalyticalColumn(sGroupedColumn2, {
				leadingProperty: ""
			});
			oAnalyticalTable.addColumn(oColumn2);

			// create mock group context data
			var oContext = sinon.createStubInstance(Context);
			oContext.getProperty.returns("test");

			// Return AnalyticalInfo for grandTotals
			oAnalyticalTable.getAnalyticalInfoOfRow.returns({
				context: oContext,
				grandTotal: false,
				group: true,
				groupTotal: false,
				groupedColumns: [
					sGroupedColumn, sGroupedColumn2
				],
				level: 0
			});

			// Stub the "row binding" of table to return necessary mock data
			sinon.stub(oAnalyticalTable, "getBinding");
			var oBinding = sinon.createStubInstance(AnalyticalBinding);
			oAnalyticalTable.getBinding.returns(oBinding);
			// mock binding data
			oBinding.getPath.returns(sPath);
			// mock dimension determination data
			oBinding.getAnalyticalInfoForColumn.returns({
				dimensionPropertyName: "Customer"
			});

			// spies
			sinon.spy(oAnalyticalTable, "addDependent");

			// create additional mock parameter data needed for popover
			var mMultiCurrencyParameters = {
				additionalParent: true,
				currency: "AmountInTransactionCurrency",
				unit: "TransactionCurrency",
				smartTableId: sSmartTableId,
				template: oTemplate
			};
			var oEvent = {
				getSource: function() {
					return oLink;
				},
				mParameters: {
					id: "__link0-__clone1"
				}
			};

			var oPopover = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover");
			assert.ok(!oPopover);
			var oList = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover-detailsList");
			assert.ok(!oList);

			MultiCurrencyUtil.openMultiCurrencyPopover(oEvent, mMultiCurrencyParameters);
			oPopover = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover");
			assert.ok(oPopover);
			assert.strictEqual(oPopover.getTitle(), sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_MULTI_GROUP_TITLE") || "Subtotal");
			assert.strictEqual(oPopover.getPlacement(), "VerticalPreferredBottom");
			assert.strictEqual(oAnalyticalTable.addDependent.calledOnce, true);
			assert.strictEqual(oAnalyticalTable.addDependent.calledWith(oPopover), true);
			oList = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover-detailsList");
			assert.ok(oList);
			var oListBindingInfo = oList.getBindingInfo("items");
			assert.strictEqual(oListBindingInfo.path, sPath);
			assert.strictEqual(oListBindingInfo.parameters.select, mMultiCurrencyParameters.currency + "," + mMultiCurrencyParameters.unit);
			assert.strictEqual(oListBindingInfo.template.getContent()[0], oTemplate);
			assert.strictEqual(oListBindingInfo.filters.length, 1);
			assert.strictEqual(oListBindingInfo.filters[0].sPath, "Customer");
			assert.strictEqual(oBinding.getAnalyticalInfoForColumn.calledOnce, true);
			sinon.spy(oPopover, "destroy");
			assert.ok(oPopover.destroy.notCalled);
			oSmartTable.destroy();
			assert.ok(oPopover.destroy.called);
		});

		QUnit.test("Shall open a poover for multi-currency based on the context/analytical info -- Cell total", function(assert) {
			var sPath = "/Items";
			var oTemplate = sinon.createStubInstance(HBox); // Dummy Template
			oTemplate.clone.returns(oTemplate); // mock clone method
			var oLink = sinon.createStubInstance(Link); // Dummy link --> Event source
			// Stub parent(s) of event source
			oLink.getParent.returns({
				getParent: function() {
					return new Control();
				}
			});
			// create a dummy instance of SmartTable
			var sSmartTableId = "idView--ItemsST";
			var oSmartTable = new SmartTable(sSmartTableId, {
				tableType: "AnalyticalTable"
			});

			// Stub the "getAnalyticalInfoOfRow" method to return necessary mock data
			var oAnalyticalTable = oSmartTable.getTable();
			sinon.stub(oAnalyticalTable, "getAnalyticalInfoOfRow");
			// create a mock grouped column
			var sGroupedColumn = sSmartTableId + "--DummyColumn";
			var oColumn = new AnalyticalColumn(sGroupedColumn, {
				leadingProperty: "Customer"
			});
			oAnalyticalTable.addColumn(oColumn);

			// create mock group context data
			var oContext = sinon.createStubInstance(Context);
			oContext.getProperty.returns("test");

			// Return AnalyticalInfo for grandTotals
			oAnalyticalTable.getAnalyticalInfoOfRow.returns({
				context: oContext,
				grandTotal: false,
				group: false,
				groupTotal: false,
				groupedColumns: [],
				level: 0
			});

			// Stub the "row binding" of table to return necessary mock data
			sinon.stub(oAnalyticalTable, "getBinding");
			var oBinding = sinon.createStubInstance(AnalyticalBinding);
			oAnalyticalTable.getBinding.returns(oBinding);
			// mock binding data
			oBinding.getPath.returns(sPath);
			var mDimensionDetails = {
				"Customer": {
					"name": "Customer",
					"aAttributeName": [],
					"grouped": false,
					"keyPropertyName": "Customer",
					"analyticalInfo": {
						"name": "CustomerName",
						"visible": true,
						"grouped": false,
						"total": false,
						"sorted": false,
						"sortOrder": "Ascending",
						"inResult": false,
						"formatter": null,
						"dimensionPropertyName": "Customer"
					},
					"textPropertyName": "CustomerName"
				},
				"FiscalYear": {
					"name": "FiscalYear",
					"aAttributeName": [],
					"grouped": false,
					"keyPropertyName": "FiscalYear",
					"analyticalInfo": {
						"name": "FiscalYear",
						"visible": true,
						"grouped": false,
						"total": false,
						"sorted": false,
						"sortOrder": "Ascending",
						"inResult": false,
						"formatter": null,
						"dimensionPropertyName": "FiscalYear"
					}
				},
				"CompanyCode": {
					"name": "CompanyCode",
					"aAttributeName": [],
					"grouped": false,
					"keyPropertyName": "CompanyCode",
					"analyticalInfo": {
						"name": "CompanyName",
						"visible": true,
						"grouped": false,
						"total": false,
						"sorted": false,
						"sortOrder": "Ascending",
						"inResult": false,
						"formatter": null,
						"dimensionPropertyName": "CompanyCode"
					},
					"textPropertyName": "CompanyName"
				}
			};
			oBinding.getDimensionDetails.returns(mDimensionDetails);

			// spies
			sinon.spy(oAnalyticalTable, "addDependent");

			// create additional mock parameter data needed for popover
			var mMultiCurrencyParameters = {
				additionalParent: true,
				currency: "AmountInTransactionCurrency",
				unit: "TransactionCurrency",
				smartTableId: sSmartTableId,
				template: oTemplate
			};
			var oEvent = {
				getSource: function() {
					return oLink;
				},
				mParameters: {
					id: "__link0-__clone1"
				}
			};

			var oPopover = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover");
			assert.ok(!oPopover);
			var oList = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover-detailsList");
			assert.ok(!oList);

			MultiCurrencyUtil.openMultiCurrencyPopover(oEvent, mMultiCurrencyParameters);
			oPopover = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover");
			assert.ok(oPopover);
			assert.strictEqual(oPopover.getTitle(), sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_MULTI_GROUP_TITLE") || "Subtotal");
			assert.strictEqual(oPopover.getPlacement(), "VerticalPreferredBottom");
			assert.strictEqual(oAnalyticalTable.addDependent.calledOnce, true);
			assert.strictEqual(oAnalyticalTable.addDependent.calledWith(oPopover), true);
			oList = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover-detailsList");
			assert.ok(oList);
			var oListBindingInfo = oList.getBindingInfo("items");
			assert.strictEqual(oListBindingInfo.path, sPath);
			assert.strictEqual(oListBindingInfo.parameters.select, mMultiCurrencyParameters.currency + "," + mMultiCurrencyParameters.unit);
			assert.strictEqual(oListBindingInfo.template.getContent()[0], oTemplate);
			assert.strictEqual(oListBindingInfo.filters.length, 3);
			assert.strictEqual(oListBindingInfo.filters[0].sPath, "Customer");
			assert.strictEqual(oListBindingInfo.filters[1].sPath, "FiscalYear");
			assert.strictEqual(oListBindingInfo.filters[2].sPath, "CompanyCode");
			sinon.spy(oPopover, "destroy");
			assert.ok(oPopover.destroy.notCalled);
			oSmartTable.destroy();
			assert.ok(oPopover.destroy.called);
		});

		QUnit.test("Shall open a poover for multi-currency based on the context/analytical info -- Popover already exists", function(assert) {
			var sPath = "/Items";
			var oTemplate = sinon.createStubInstance(HBox); // Dummy Template
			oTemplate.clone.returns(oTemplate); // mock clone method
			var oLink = sinon.createStubInstance(Link); // Dummy link --> Event source
			// Stub parent(s) of event source
			oLink.getParent.returns({
				getParent: function() {
					return new Control();
				}
			});
			// create a dummy instance of SmartTable
			var sSmartTableId = "idView--ItemsST";
			var oSmartTable = new SmartTable(sSmartTableId, {
				tableType: "AnalyticalTable"
			});

			// Stub the "getAnalyticalInfoOfRow" method to return necessary mock data
			var oAnalyticalTable = oSmartTable.getTable();
			sinon.stub(oAnalyticalTable, "getAnalyticalInfoOfRow");
			// create a mock grouped column
			var sGroupedColumn = sSmartTableId + "--DummyColumn";
			var oColumn = new AnalyticalColumn(sGroupedColumn, {
				leadingProperty: "Customer"
			});
			oAnalyticalTable.addColumn(oColumn);

			// create mock group context data
			var oContext = sinon.createStubInstance(Context);
			oContext.getProperty.returns("test");

			// Return AnalyticalInfo for grandTotals
			oAnalyticalTable.getAnalyticalInfoOfRow.returns({
				context: oContext,
				grandTotal: false,
				group: true,
				groupTotal: true,
				groupedColumns: [
					sGroupedColumn
				],
				level: 0
			});

			// Stub the "row binding" of table to return necessary mock data
			sinon.stub(oAnalyticalTable, "getBinding");
			var oBinding = sinon.createStubInstance(AnalyticalBinding);
			oAnalyticalTable.getBinding.returns(oBinding);
			// mock binding data
			oBinding.getPath.returns(sPath);

			// spies
			sinon.spy(oAnalyticalTable, "addDependent");

			// create additional mock parameter data needed for popover
			var mMultiCurrencyParameters = {
				additionalParent: true,
				currency: "AmountInTransactionCurrency",
				unit: "TransactionCurrency",
				smartTableId: sSmartTableId,
				template: oTemplate
			};
			var oEvent = {
				getSource: function() {
					return oLink;
				},
				mParameters: {
					id: "__link0-__clone1"
				}
			};

			var oPopover = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover");
			assert.ok(!oPopover);
			var oList = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover-detailsList");
			assert.ok(!oList);

			MultiCurrencyUtil.openMultiCurrencyPopover(oEvent, mMultiCurrencyParameters);
			oPopover = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover");
			assert.ok(oPopover);
			assert.strictEqual(oPopover.getTitle(), sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_MULTI_GROUP_TITLE") || "Subtotal");
			assert.strictEqual(oPopover.getPlacement(), "VerticalPreferredBottom");
			assert.strictEqual(oAnalyticalTable.addDependent.calledOnce, true);
			assert.strictEqual(oAnalyticalTable.addDependent.calledWith(oPopover), true);
			oList = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover-detailsList");
			assert.ok(oList);

			sinon.spy(oPopover, "openBy");
			MultiCurrencyUtil.openMultiCurrencyPopover(oEvent, mMultiCurrencyParameters);

			assert.strictEqual(oAnalyticalTable.addDependent.calledTwice, false);
			assert.strictEqual(oAnalyticalTable.addDependent.calledOnce, true);
			assert.strictEqual(oPopover.openBy.called, true);

			var oListBindingInfo = oList.getBindingInfo("items");
			assert.strictEqual(oListBindingInfo.path, sPath);
			assert.strictEqual(oListBindingInfo.parameters.select, mMultiCurrencyParameters.currency + "," + mMultiCurrencyParameters.unit);
			assert.strictEqual(oListBindingInfo.template.getContent()[0], oTemplate);
			assert.strictEqual(oListBindingInfo.filters.length, 1);
			assert.strictEqual(oListBindingInfo.filters[0].sPath, "Customer");

			sinon.spy(oPopover, "destroy");
			assert.ok(oPopover.destroy.notCalled);
			oSmartTable.destroy();
			assert.ok(oPopover.destroy.called);
		});

		QUnit.test("Shall open a poover for multi-currency based on the context/analytical info -- filters already exists", function(assert) {
			var sPath = "/Items";
			var oTemplate = sinon.createStubInstance(HBox); // Dummy Template
			oTemplate.clone.returns(oTemplate); // mock clone method
			var oLink = sinon.createStubInstance(Link); // Dummy link --> Event source
			// Stub parent(s) of event source
			oLink.getParent.returns({
				getParent: function() {
					return new Control();
				}
			});
			// create a dummy instance of SmartTable
			var sSmartTableId = "idView--ItemsST";
			var oSmartTable = new SmartTable(sSmartTableId, {
				tableType: "AnalyticalTable"
			});

			// Stub the "getAnalyticalInfoOfRow" method to return necessary mock data
			var oAnalyticalTable = oSmartTable.getTable();
			sinon.stub(oAnalyticalTable, "getAnalyticalInfoOfRow");
			// create a mock grouped column
			var sGroupedColumn = sSmartTableId + "--DummyColumn";
			var oColumn = new AnalyticalColumn(sGroupedColumn, {
				leadingProperty: "Customer"
			});
			oAnalyticalTable.addColumn(oColumn);

			// create mock group context data
			var oContext = sinon.createStubInstance(Context);
			oContext.getProperty.returns("test");

			// Return AnalyticalInfo for grandTotals
			oAnalyticalTable.getAnalyticalInfoOfRow.returns({
				context: oContext,
				grandTotal: false,
				group: true,
				groupTotal: true,
				groupedColumns: [
					sGroupedColumn
				],
				level: 0
			});

			// Stub the "row binding" of table to return necessary mock data
			sinon.stub(oAnalyticalTable, "getBinding");
			var oBinding = sinon.createStubInstance(AnalyticalBinding);
			oAnalyticalTable.getBinding.returns(oBinding);
			// mock binding data
			oBinding.getPath.returns(sPath);
			// mock applicaton filter
			oBinding.aApplicationFilter = [
				new Filter("SomeFilterPath", "EQ", "SomeValue")
			];

			// spies
			sinon.spy(oAnalyticalTable, "addDependent");

			// create additional mock parameter data needed for popover
			var mMultiCurrencyParameters = {
				additionalParent: true,
				currency: "AmountInTransactionCurrency",
				unit: "TransactionCurrency",
				smartTableId: sSmartTableId,
				template: oTemplate
			};
			var oEvent = {
				getSource: function() {
					return oLink;
				},
				mParameters: {
					id: "__link0-__clone1"
				}
			};

			var oPopover = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover");
			assert.ok(!oPopover);
			var oList = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover-detailsList");
			assert.ok(!oList);

			MultiCurrencyUtil.openMultiCurrencyPopover(oEvent, mMultiCurrencyParameters);
			oPopover = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover");
			assert.ok(oPopover);
			assert.strictEqual(oPopover.getTitle(), sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_MULTI_GROUP_TITLE") || "Subtotal");
			assert.strictEqual(oPopover.getPlacement(), "VerticalPreferredBottom");
			assert.strictEqual(oAnalyticalTable.addDependent.calledOnce, true);
			assert.strictEqual(oAnalyticalTable.addDependent.calledWith(oPopover), true);
			oList = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover-detailsList");
			assert.ok(oList);

			sinon.spy(oPopover, "openBy");
			MultiCurrencyUtil.openMultiCurrencyPopover(oEvent, mMultiCurrencyParameters);

			assert.strictEqual(oAnalyticalTable.addDependent.calledTwice, false);
			assert.strictEqual(oAnalyticalTable.addDependent.calledOnce, true);
			assert.strictEqual(oPopover.openBy.called, true);

			var oListBindingInfo = oList.getBindingInfo("items");
			assert.strictEqual(oListBindingInfo.path, sPath);
			assert.strictEqual(oListBindingInfo.parameters.select, mMultiCurrencyParameters.currency + "," + mMultiCurrencyParameters.unit);
			assert.strictEqual(oListBindingInfo.template.getContent()[0], oTemplate);
			assert.strictEqual(oListBindingInfo.filters.length, 2);
			assert.strictEqual(oListBindingInfo.filters[0].sPath, "SomeFilterPath");
			assert.strictEqual(oListBindingInfo.filters[1].sPath, "Customer");

			sinon.spy(oPopover, "destroy");
			assert.ok(oPopover.destroy.notCalled);
			oSmartTable.destroy();
			assert.ok(oPopover.destroy.called);
		});

		QUnit.test("Shall open a poover for multi-currency based on the context/analytical info -- custom query paramters already exists", function(assert) {
			var sPath = "/Items";
			var oTemplate = sinon.createStubInstance(HBox); // Dummy Template
			oTemplate.clone.returns(oTemplate); // mock clone method
			var oLink = sinon.createStubInstance(Link); // Dummy link --> Event source
			// Stub parent(s) of event source
			oLink.getParent.returns({
				getParent: function() {
					return new Control();
				}
			});
			// create a dummy instance of SmartTable
			var sSmartTableId = "idView--ItemsST";
			var oSmartTable = new SmartTable(sSmartTableId, {
				tableType: "AnalyticalTable"
			});

			// Stub the "getAnalyticalInfoOfRow" method to return necessary mock data
			var oAnalyticalTable = oSmartTable.getTable();
			sinon.stub(oAnalyticalTable, "getAnalyticalInfoOfRow");
			// create a mock grouped column
			var sGroupedColumn = sSmartTableId + "--DummyColumn";
			var oColumn = new AnalyticalColumn(sGroupedColumn, {
				leadingProperty: "Customer"
			});
			oAnalyticalTable.addColumn(oColumn);

			// create mock group context data
			var oContext = sinon.createStubInstance(Context);
			oContext.getProperty.returns("test");

			// Return AnalyticalInfo for grandTotals
			oAnalyticalTable.getAnalyticalInfoOfRow.returns({
				context: oContext,
				grandTotal: false,
				group: true,
				groupTotal: true,
				groupedColumns: [
					sGroupedColumn
				],
				level: 0
			});

			// Stub the "row binding" of table to return necessary mock data
			sinon.stub(oAnalyticalTable, "getBinding");
			var oBinding = sinon.createStubInstance(AnalyticalBinding);
			oAnalyticalTable.getBinding.returns(oBinding);
			// mock binding data
			oBinding.getPath.returns(sPath);
			// mock applicaton filter
			oBinding.aApplicationFilter = [
				new Filter("SomeFilterPath", "EQ", "SomeValue")
			];

			// Stub the "row binding info" of table to return necessary mock data
			sinon.stub(oAnalyticalTable, "getBindingInfo");
			// mock binding info and parameters
			var oBindingInfo = {
				parameters: {
					select: "foo,bar",
					custom: {
						search: "searchText",
						"search-focus": "FocusedField4Search"
					}
				}
			};

			oAnalyticalTable.getBindingInfo.returns(oBindingInfo);

			// spies
			sinon.spy(oAnalyticalTable, "addDependent");

			// create additional mock parameter data needed for popover
			var mMultiCurrencyParameters = {
				additionalParent: true,
				currency: "AmountInTransactionCurrency",
				unit: "TransactionCurrency",
				smartTableId: sSmartTableId,
				template: oTemplate
			};
			var oEvent = {
				getSource: function() {
					return oLink;
				},
				mParameters: {
					id: "__link0-__clone1"
				}
			};

			var oPopover = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover");
			assert.ok(!oPopover);
			var oList = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover-detailsList");
			assert.ok(!oList);

			MultiCurrencyUtil.openMultiCurrencyPopover(oEvent, mMultiCurrencyParameters);
			oPopover = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover");
			assert.ok(oPopover);
			assert.strictEqual(oPopover.getTitle(), sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_MULTI_GROUP_TITLE") || "Subtotal");
			assert.strictEqual(oPopover.getPlacement(), "VerticalPreferredBottom");
			assert.strictEqual(oAnalyticalTable.addDependent.calledOnce, true);
			assert.strictEqual(oAnalyticalTable.addDependent.calledWith(oPopover), true);
			oList = sap.ui.getCore().byId(sSmartTableId + "-multiUnitPopover-detailsList");
			assert.ok(oList);

			sinon.spy(oPopover, "openBy");
			MultiCurrencyUtil.openMultiCurrencyPopover(oEvent, mMultiCurrencyParameters);

			assert.strictEqual(oAnalyticalTable.addDependent.calledTwice, false);
			assert.strictEqual(oAnalyticalTable.addDependent.calledOnce, true);
			assert.strictEqual(oPopover.openBy.called, true);

			var oListBindingInfo = oList.getBindingInfo("items");
			assert.strictEqual(oListBindingInfo.path, sPath);
			assert.strictEqual(oListBindingInfo.parameters.select, mMultiCurrencyParameters.currency + "," + mMultiCurrencyParameters.unit);
			assert.strictEqual(oListBindingInfo.template.getContent()[0], oTemplate);
			assert.strictEqual(oListBindingInfo.filters.length, 2);
			assert.strictEqual(oListBindingInfo.filters[0].sPath, "SomeFilterPath");
			assert.strictEqual(oListBindingInfo.filters[1].sPath, "Customer");
			assert.ok(oListBindingInfo.parameters.custom);
			assert.strictEqual(oListBindingInfo.parameters.custom.search, "searchText");
			assert.strictEqual(oListBindingInfo.parameters.custom["search-focus"], "FocusedField4Search");

			sinon.spy(oPopover, "destroy");
			assert.ok(oPopover.destroy.notCalled);
			oSmartTable.destroy();
			assert.ok(oPopover.destroy.called);
		});

		QUnit.start();
	});

})();
