/* globals $ */
sap.ui.require([
	"test/sap/ui/comp/personalization/PersonalizationDialog",
	"test/sap/ui/comp/personalization/Util",
	"sap/ui/comp/personalization/Controller",
	"sap/m/MessageToast",
	"sap/m/CustomPanelColumns",
	"sap/ui/core/Item",
	"sap/m/MultiComboBox/MultiComboBox",
	"sap/m/CustomPanelSetting",
	"sap/m/RadioButtonGroup",
	"sap/m/RadioButton",
	"sap/m/P13nDialog",
	"sap/ui/model/json/JSONModel",
	"sap/m/App",
	"sap/m/Page",
	"sap/m/Toolbar",
	"sap/m/CheckBox",
	"sap/m/Carousel",
	"sap/m/Panel",
	"sap/m/Shell",
	'sap/m/P13nPanel'

], function (PersonalizationDialog, Util, Controller, MessageToast, CustomPanelColumns, Item, MultiComboBox, CustomPanelSetting,
		RadioButtonGroup, RadioButton, P13nDialog, JSONModel, App, Page, Toolbar, CheckBox, Carousel, Panel, Shell, P13nPanel) {
	"use strict";

	// P13nPanel extention
	P13nPanel.extend("sap.m.CustomPanelColumns", {
		constructor: function (sId, mSettings) {
			P13nPanel.apply(this, arguments);
		},
		metadata: {
			library: "sap.m",
			aggregations: {
				content: {
					type: "sap.m.MultiComboBox",
					multiple: false,
					singularName: "content"
				}
			}
		},
		renderer: function (oRm, oControl) {
			if (!oControl.getVisible()) {
				return;
			}
			oRm.renderControl(oControl.getContent());
		}
	});

	// P13nPanel extention
	P13nPanel.extend("sap.m.CustomPanelSetting", {
		constructor: function (sId, mSettings) {
			P13nPanel.apply(this, arguments);
		},
		metadata: {
			library: "sap.m",
			aggregations: {
				content: {
					type: "sap.m.RadioButtonGroup",
					multiple: false,
					singularName: "content"
				}
			}
		},
		renderer: function (oRm, oControl) {
			if (!oControl.getVisible()) {
				return;
			}
			oRm.renderControl(oControl.getContent());
		}
	});

	var aContent = [];
	jQuery.ajax({
		url: "../../../../../test-resources/sap/ui/comp/personalization/mockserver/ProductCollection.json",
		dataType: 'text',
		async: false,
		success: function (response, textStatus, xhr) {
			aContent = JSON.parse(response);
		},
		error: function (xhr, textStatus, error) {
		}
	});
	var aPathOfVisibleCols = [
		"Name", "Category", "Price", "Quantity"
	];
	var aPathOfSorter = [];
	var aPathOfFilterer = [];

	var enumTypes = {
		String: "String",
		Number: "Number",
		Date: "Date",
		Time: "Time",
		Boolean: "Boolean"
	};
	var oJSONData = {
		oDataItems: aContent,
		cols: [
			{
				text: "ProductId",
				path: "ProductId",
				type: enumTypes.String
			}, {
				text: "Category",
				path: "Category",
				type: enumTypes.String
			}, {
				text: "Name",
				path: "Name",
				type: enumTypes.String
			}, {
				text: "Description",
				path: "Description",
				type: enumTypes.String
			}, {
				text: "SupplierName",
				path: "SupplierName",
				type: enumTypes.String
			}, {
				text: "Quantity",
				path: "Quantity",
				type: enumTypes.Number
			}, {
				text: "WeightMeasure",
				path: "WeightMeasure",
				type: enumTypes.Number
			}, {
				text: "WeightUnit",
				path: "WeightUnit",
				type: enumTypes.String
			}, {
				text: "Price",
				path: "Price",
				path2: "CurrencyCode",
				control: "ObjectNumber",
				type: enumTypes.Number
			}, {
				text: "Status",
				path: "Status",
				type: enumTypes.String
			}, {
				text: "CurrencyCode",
				path: "CurrencyCode",
				tableType: "UITable",
				type: enumTypes.String
			}, {
				text: "Width",
				path: "Width",
				type: enumTypes.Number
			}, {
				text: "Depth",
				path: "Depth",
				type: enumTypes.Number
			}, {
				text: "Height",
				path: "Height",
				type: enumTypes.Number
			}, {
				text: "DimUnit",
				path: "DimUnit",
				type: enumTypes.String
			}, {
				text: "Date",
				path: "Date",
				type: enumTypes.Date
			}, {
				text: "Time",
				path: "Time",
				type: enumTypes.Time
			}, {
				text: "GUID",
				path: "GUID",
				type: enumTypes.String
			}, {
				text: "Boolean",
				path: "Bool",
				type: enumTypes.Boolean
			}
		],
		selectedItems: [],
		pathOfVisibleCols: aPathOfVisibleCols,
		pathOfSorter: aPathOfSorter,
		pathOfFilterer: aPathOfFilterer
	};

	// --------------------------------------------------------------------------------------------------------------
	// -------------------------- sap.m.Table with customer columns panel ------------------------------------
	// --------------------------------------------------------------------------------------------------------------
	var fGetColumnData = function (sColumnKey, aColumnData) {
		var oColumnData = null;
		aColumnData.some(function (oColumnData_) {
			if (oColumnData_.columnKey === sColumnKey) {
				oColumnData = oColumnData_;
				return true;
			}
		});
		return oColumnData;
	};
	var
		fUpdateTable = function (oTable, aColumnData) {
			if (!aColumnData.length) {
				return;
			}
			// Set Column Visibility and Column Order
			oTable.getColumns().forEach(function (oColumn) {
				var sColumnKey = Util.getColumnKey(oColumn);
				var oColumnData = fGetColumnData(sColumnKey, aColumnData);
				if (oColumnData) {
					oColumn.setVisible(oColumnData.columnVisible);
					oColumn.setOrder(oColumnData.columnOrder);
				}
			});
			oTable.rerender();
		};

	var oPanelColumns = new CustomPanelColumns({
		type: "customColumns",
		title: "Columns (Custom Panel)",
		titleLarge: "Define Column Properties",
		content: new MultiComboBox({
			items: {
				path: "/cols",
				template: new Item({
					key: "{path}",
					text: "{text}"
				})
			},
			selectedKeys: {
				path: "/pathOfVisibleCols"
			},
			selectionFinish: function (oEvent) {
				var aColumnData = [];
				// Fill all selected columns
				oEvent.getParameter("selectedItems").forEach(function (oItem, iIndex) {
					aColumnData.push({
						columnKey: oItem.getKey(),
						columnOrder: iIndex,
						columnVisible: true
					});
				});
				// Add all other columns as invisible
				oMTable.getColumns().forEach(function (oColumn) {
					var sColumnKey = Util.getColumnKey(oColumn);
					var oColumnData = fGetColumnData(sColumnKey, aColumnData);
					if (!oColumnData) {
						aColumnData.push({
							columnKey: sColumnKey,
							columnOrder: aColumnData.length,
							columnVisible: false
						});
					}
				});
				fUpdateTable(oMTable, aColumnData);
			}
		})
	});

	var oPanelColumnsSetting = new CustomPanelSetting({
		type: "customColumnsSetting",
		title: "Columns Setting (Custom Panel)",
		titleLarge: "Define Column Setting",
		content: new RadioButtonGroup({
			columns: 2,
			buttons: [
				new RadioButton({
					text: "All Data"
				}), new RadioButton({
					text: "Evaluated Data"
				})
			]
		})
	});

	var oDialog = new P13nDialog({
		ok: function () {
			// Store Column Visibility and Order before opening of dialog
			aColumnOrderBeforeOpen = [];
			oMTable.getColumns().forEach(function (oColumn) {
				aColumnOrderBeforeOpen.push({
					columnKey: Util.getColumnKey(oColumn),
					columnOrder: oColumn.getOrder(),
					columnVisible: oColumn.getVisible()
				});
			});
			this.close();
		},
		cancel: function () {
			fUpdateTable(oMTable, aColumnOrderBeforeOpen);
			this.close();
		},
		initialVisiblePanelType: oPanelColumnsSetting.getType(),
		panels: [
			oPanelColumnsSetting, oPanelColumns
		]
	});
	oDialog.setModel(new JSONModel(oJSONData));

	var aColumnOrderBeforeOpen = [];
	var oMTable = PersonalizationDialog.createMTable("testMTableCustomController", oJSONData, false, false, function () {
		// Set compact style class if the table is compact too
		oDialog.toggleStyleClass("sapUiSizeCompact", !!jQuery(oMTable.getDomRef()).closest(".sapUiSizeCompact").length);
		oMTable.getColumns().forEach(function (oColumn) {
			aColumnOrderBeforeOpen.push({
				columnKey: Util.getColumnKey(oColumn),
				columnOrder: oColumn.getOrder(),
				columnVisible: oColumn.getVisible()
			});
		});
		oDialog.open();
	}, null, null, null, null);

	var oApp = new App("myApp", {
		pages: [
			new Page({
				title: "Table Personalization Dialog with custom Panels (without Personalization Controller)",
				headerContent: [
					new Toolbar({
						content: [
							new CheckBox({
								text: "compact Mode",
								selected: true,
								select: function () {
									$("#myApp").toggleClass("sapUiSizeCompact");
								}
							})
						]
					})
				],
				content: [
					new Carousel({
						pages: [
							new Page({
								content: [
									new Panel("IDMTablePanel", {
										headerText: "sap.m.Table",
										expandable: true,
										expanded: true,
										content: oMTable
									})
								]
							})
						]
					})
				]
			})
		]
	});

	var oShell = new Shell();
	oShell.setApp(oApp);
	oShell.placeAt("body");

	$(document).ready(function () {
		$("#myApp").toggleClass("sapUiSizeCompact");
	});

});