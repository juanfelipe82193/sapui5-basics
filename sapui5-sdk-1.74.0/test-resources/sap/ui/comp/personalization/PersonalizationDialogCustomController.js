/*globals $ */

sap.ui.require([
	'sap/ui/comp/library',
	'test/sap/ui/comp/personalization/PersonalizationDialog',
	'test/sap/ui/comp/personalization/Util',
	'sap/ui/comp/personalization/Controller',
	'sap/ui/comp/personalization/BaseController',
	'sap/m/P13nPanel',
	'sap/m/CustomPanelColumns',
	'sap/m/MultiComboBox',
	'sap/m/App',
	'sap/m/Page',
	'sap/m/Toolbar',
	'sap/m/CheckBox',
	'sap/m/Carousel',
	'sap/m/Panel',
	'sap/m/Shell',
	'sap/ui/core/Item'
], function(compLibrary, PersonalizationDialog, Util, Controller, BaseController, P13nPanel, CustomPanelColumns,
		MultiComboBox, App, Page, Toolbar, CheckBox, Carousel, Panel, Shell, Item) {
	'use strict';

	// P13nPanel extention
	P13nPanel.extend("sap.m.CustomPanelColumns", {
		constructor: function(sId, mSettings) {
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
		renderer: function(oRm, oControl) {
			if (!oControl.getVisible()) {
				return;
			}
			oRm.renderControl(oControl.getContent());
		}
	});

	// Controller extention
	var CustomController = BaseController.extend("sap.ui.comp.personalization.CustomController", {
		constructor: function(sId, mSettings) {
			BaseController.apply(this, arguments);
			this.setType("customColumns");
		},
		getTitleText: function() {
			return "MyColumns";
		},
		getTable2Json: function() {
			var oJsonData = this.createControlDataStructure();
			var oTable = this.getTable();
			if (oTable) {
				oTable.getColumns().forEach(function(oColumn, iIndex) {
					if (oColumn.getVisible()) {
						var sColumnKey = Util.getColumnKey(oColumn);
						oJsonData.customColumns.customColumnsItems.push(sColumnKey);
					}
				}, this);
			}
			return oJsonData;
		},
		//		syncTable2TransientModel: function() {
		//			var oTable = this.getTable();
		//			var aItems = [];
		//			if (oTable) {
		//				oTable.getColumns().forEach(function(oColumn) {
		//					aItems.push({
		//						columnKey: Util.getColumnKey(oColumn),
		//						text: oColumn.getLabel ? oColumn.getLabel().getText() : oColumn.getHeader().getText()
		//					});
		//				});
		//			}
		//			var aItemsBefore = this.getModel("$sapuicomppersonalizationBaseController").getData().transientData.customColumns.items;
		//			if (jQuery(aItems).not(aItemsBefore).length !== 0 || jQuery(aItemsBefore).not(aItems).length !== 0) {
		//				this.getModel("$sapuicomppersonalizationBaseController").getData().transientData.customColumns.items = aItems;
		//			}
		//		},
		getPanel: function() {
			var that = this;
			var oPanel = new CustomPanelColumns({
				type: "customColumns",
				title: this.getTitleText(),
				titleLarge: "Custom Definition of Columns Properties",
				beforeNavigationTo: that.setModelFunction(that.getModel()),
				content: new MultiComboBox({
					items: {
						path: "$sapmP13nPanel>/transientData/customColumns/items",
						template: new Item({
							key: "{$sapmP13nPanel>columnKey}",
							text: "{$sapmP13nPanel>text}"
						})
					},
					selectedKeys: {
						path: "$sapmP13nPanel>/persistentData/customColumns/customColumnsItems"
					}
				})
			});
			return oPanel;
		},
		syncJson2Table: function() {
			var oTable = this.getTable();
			var oData = this.getModel("$sapuicomppersonalizationBaseController").getData();
			var aColumns = oTable.getColumns();

			// Set visibility
			aColumns.forEach(function(oColumn) {
				var sColumnKey = Util.getColumnKey(oColumn);
				if (oData.persistentData.customColumns.customColumnsItems.indexOf(sColumnKey) > -1) {
					oColumn.setVisible(true);
				} else {
					oColumn.setVisible(false);
				}
			});
			// Set order
			if (oTable && oTable.isA("sap.ui.table.Table")) {
				oData.persistentData.customColumns.customColumnsItems.forEach(function(sColumnKey, iIndex) {
					var oColumn = Util.getColumn(sColumnKey, aColumns);
					oTable.removeColumn(oColumn);
					oTable.insertColumn(oColumn, iIndex);
				}, this);
			} else if (oTable && oTable.isA("sap.m.Table")) {
				oData.persistentData.customColumns.customColumnsItems.forEach(function(sColumnKey, iIndex) {
					var oColumn = Util.getColumn(sColumnKey, aColumns);
					oColumn.setOrder(iIndex);
				}, this);
			}

			if (oTable && oTable.isA("sap.m.Table")) {
				oTable.rerender();
			}
		},
		getChangeType: function(oPersistentDataBase, oPersistentDataCompare) {
			if (!oPersistentDataCompare || !oPersistentDataCompare.customColumns || !oPersistentDataCompare.customColumns.customColumnsItems) {
				return compLibrary.personalization.ChangeType.Unchanged;
			}
			var bIsDirty = JSON.stringify(oPersistentDataBase.customColumns.customColumnsItems) !== JSON.stringify(oPersistentDataCompare.customColumns.customColumnsItems);

			return bIsDirty ? compLibrary.personalization.ChangeType.ModelChanged : compLibrary.personalization.ChangeType.Unchanged;

		},
		getChangeData: function(oPersistentDataBase, oPersistentDataCompare) {
			if (!oPersistentDataBase || !oPersistentDataBase.customColumns || !oPersistentDataBase.customColumns.customColumnsItems) {
				return {
					customColumns: {
						customColumnsItems: []
					}
				};
			}

			if (!oPersistentDataCompare || !oPersistentDataCompare.customColumns || !oPersistentDataCompare.customColumns.customColumnsItems) {
				return {
					customColumns: Util.copy(oPersistentDataBase.customColumns)
				};
			}

			if (JSON.stringify(oPersistentDataBase.customColumns.customColumnsItems) !== JSON.stringify(oPersistentDataCompare.customColumns.customColumnsItems)) {
				return {
					customColumns: Util.copy(oPersistentDataBase.customColumns)
				};
			}
			return null;
		},
		getUnionData: function(oPersistentDataBase, oPersistentDataCompare) {
			if (!oPersistentDataCompare || !oPersistentDataCompare.customColumns || !oPersistentDataCompare.customColumns.customColumnsItems) {
				return {
					customColumns: Util.copy(oPersistentDataBase.customColumns)
				};
			}
			return {
				customColumns: Util.copy(oPersistentDataCompare.customColumns)
			};
		}
	});

	var aContent = [];
	jQuery.ajax({
		url: "../../../../../test-resources/sap/ui/comp/personalization/mockserver/ProductCollection.json",
		dataType: 'text',
		async: false,
		success: function(response, textStatus, xhr) {
			aContent = JSON.parse(response);
		},
		error: function(xhr, textStatus, error) {

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
	var oMTable;
	var oMController = new Controller({
		table: oMTable,
		setting: {
			customColumns: {
				visible: true,
				controller: new CustomController("CustomController")
			},
			group: {
				visible: false
			},
			columns: {
				visible: false
			}
		}
	});
	oMTable = PersonalizationDialog.createMTable("testMTableCustomController", oJSONData, false, false, function() {
		oMController.openDialog();
	});

	oMController.attachAfterP13nModelDataChange(this.fHandleAfterP13nModelDataChange, this);

	var oApp = new App("myApp", {
		pages: [
			new Page({
				title: "Table Personalization Dialog with custom Panel and custom Personalization Controller",
				headerContent: [
					new Toolbar({
						content: [
							new CheckBox({
								text: "compact Mode",
								selected: true,
								select: function() {
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

	$(document).ready(function() {
		$("#myApp").toggleClass("sapUiSizeCompact");
	});

});
