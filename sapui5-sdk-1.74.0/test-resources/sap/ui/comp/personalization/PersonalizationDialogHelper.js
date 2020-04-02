/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

/**
 * @namespace Provides utitlity functions for the personalization dialog
 * @name sap.ui.comp.personalization.PersonalizationDialogHelper
 * @author SAP SE
 * @version 1.74.0
 * @private
 * @since 1.25.0
 */
sap.ui.define([
	'sap/ui/base/ManagedObject',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/m/Toolbar',
	'sap/m/ToolbarSpacer',
	'test/sap/ui/comp/personalization/Util',
	'sap/chart/Chart',
	'sap/chart/library',
	'sap/viz/ui5/controls/Popover',
	'sap/m/Table',
	'sap/m/ColumnListItem',
	'sap/m/Button',
	'sap/m/Label',
	'sap/ui/table/library',
	'sap/ui/table/Table',
	'sap/ui/table/AnalyticalTable',
	'sap/ui/core/CustomData',
	'sap/ui/comp/smartvariants/SmartVariantManagement'
], function(ManagedObject, ODataModel, Toolbar, ToolbarSpacer, TestUtil, Chart, chartLibrary, Popover,
		Table, ColumnListItem, Button, Label, tableLibrary, UiTable, AnalyticalTable, CustomData, SmartVariantManagement) {
	"use strict";

	var PersonalizationDialogHelper = ManagedObject.extend("sap.ui.comp.personalization.PersonalizationDialogHelper", /** @lends sap.ui.comp.personalization.PersonalizationDialogHelper.prototype */
	{
		constructor: function(sId, mSettings) {
			ManagedObject.apply(this, arguments);
		}
	});

	PersonalizationDialogHelper.createMTable = function(sId, oData, bPerformanceOptimization, bShowVariantManagement, fOpenDialog, fOpenDialogSort, fOpenDialogFilter, fOpenDialogColumns, fOpenDialogGroup, fOpenDialogDataSuiteFormat, fOpenDialogPersistentData) {
		var oModel = new ODataModel(oData.rootUri);
		var oTable = new Table();
		oTable.setHeaderToolbar(this.createToolbar(oTable.getId(), bShowVariantManagement, fOpenDialog, fOpenDialogSort, fOpenDialogFilter, fOpenDialogColumns, fOpenDialogGroup, fOpenDialogDataSuiteFormat, fOpenDialogPersistentData));
		oTable.setModel(oModel);
		oTable._itemsTemplate = new ColumnListItem();

		TestUtil.addColumnsToMTable(oTable, oModel, oData.entitySet, bPerformanceOptimization);

		return oTable;
	};

	PersonalizationDialogHelper.createUITable = function(sId, oData, bPerformanceOptimization, bShowVariantManagement, fOpenDialog, fOpenDialogSort, fOpenDialogFilter, fOpenDialogColumns, fOpenDialogGroup, fOpenDialogDataSuiteFormat, fOpenDialogPersistentData) {
		var oModel = new ODataModel(oData.rootUri, true);
		var oTable = new UiTable({
			enableGrouping: true,
			showColumnVisibilityMenu: true,
			rows: {
				path: "/" + oData.entitySet
			}
		});
		oTable.setToolbar(this.createToolbar(oTable.getId(), bShowVariantManagement, fOpenDialog, fOpenDialogSort, fOpenDialogFilter, fOpenDialogColumns, fOpenDialogGroup, fOpenDialogDataSuiteFormat, fOpenDialogPersistentData));
		oTable.setModel(oModel);

		TestUtil.addColumnsToUITable(oTable, oModel, oData.entitySet, bPerformanceOptimization);

		return oTable;
	};

	PersonalizationDialogHelper.createAnalyticalTable = function(sId, oData, bPerformanceOptimization, bShowVariantManagement, fOpenDialog, fOpenDialogSort, fOpenDialogFilter, fOpenDialogColumns, fOpenDialogGroup, fOpenDialogDataSuiteFormat, fOpenDialogPersistentData) {
		var oModel = new ODataModel(oData.rootUri, true);
		var oTable = new AnalyticalTable({
			selectionMode: tableLibrary.SelectionMode.Single,
			showColumnVisibilityMenu: true,
			enableColumnFreeze: true,
			enableCellFilter: true,
			rows: {
				path: "/" + oData.entitySet,
				parameters: {
					entitySet: oData.entitySet,
					useBatchRequests: true,
					useAcceleratedAutoExpand: false
				}
			}
		});
		oTable.setToolbar(this.createToolbar(oTable.getId(), bShowVariantManagement, fOpenDialog, fOpenDialogSort, fOpenDialogFilter, fOpenDialogColumns, fOpenDialogGroup, fOpenDialogDataSuiteFormat, fOpenDialogPersistentData));
		oTable.setModel(oModel);

		TestUtil.addColumnsToAnalyticalTable(oTable, oModel, oData.entitySet, bPerformanceOptimization);

		return oTable;
	};

	PersonalizationDialogHelper.createChart = function(sId, oData, bPerformanceOptimization, bUseVariantManagement, fOpenDialog, fOpenDialogSort, fOpenDialogFilter, fOpenDialogColumns, fOpenDialogGroup) {
		var oModel = new ODataModel(oData.rootUri, true);

		var aColumnKeys = bPerformanceOptimization ? TestUtil.getColumnKeysVisibleFromODataModel(oModel, oData.entitySet) : TestUtil.getColumnKeysFromODataModel(oModel, oData.entitySet);
		var oColumnKey2ColumnMap = TestUtil.createDimMeasuresMap(oModel, aColumnKeys, oData.entitySet);
		var aDimensions = [];
		var aMeasures = [];
		var aNotDimeasures = [];
		for ( var sPath in oColumnKey2ColumnMap) {
			if (oColumnKey2ColumnMap[sPath].dimension) {
				aDimensions.push(oColumnKey2ColumnMap[sPath].dimension);
			} else if (oColumnKey2ColumnMap[sPath].measure) {
				aMeasures.push(oColumnKey2ColumnMap[sPath].measure);
			} else if (oColumnKey2ColumnMap[sPath].notDimeasure) {
				aNotDimeasures.push(oColumnKey2ColumnMap[sPath].notDimeasure);
			}
		}
		var oChart = new Chart(sId, {
			width: '100%',
			isAnalytical: true,
			uiConfig: {
				applicationSet: 'fiori'
			},
			chartType: TestUtil.getChartTypeFromODataModel(oModel, oData.entitySet),
			selectionMode: chartLibrary.SelectionMode.Single,
			visibleDimensions: TestUtil.getColumnKeysOfDimensionsVisibleFromODataModel(oModel, oData.entitySet),
			visibleMeasures: TestUtil.getColumnKeysOfMeasuresVisibleFromODataModel(oModel, oData.entitySet),
			dimensions: aDimensions,
			measures: aMeasures,
			data: {
				path: "/" + oData.entitySet,
				parameters: {
					entitySet: oData.entitySet,
					useBatchRequests: true,
					provideGrandTotals: true,
					provideTotalResultSize: true
				}
			},
			customData: new CustomData({
				key: "NonDimeasures",
				value: aNotDimeasures
			})
		});
		oChart.setModel(oModel);

		// assign Popover to chart
		var oPopover = new Popover({});
		oPopover.connect(oChart.getVizUid());
		return oChart;
	};

	PersonalizationDialogHelper.createToolbar = function(sIDTable, bShowVariantManagement, fOpenDialog, fOpenDialogSort, fOpenDialogFilter, fOpenDialogColumns, fOpenDialogGroup, fOpenDialogDataSuiteFormat, fOpenDialogPersistentData) {
		var oToolbar = new Toolbar();
		if (fOpenDialogFilter) {
			oToolbar.addContent(new Button({
				icon: "sap-icon://filter",
				press: function() {
					fOpenDialogFilter();
				}
			}));
		}
		if (fOpenDialogSort) {
			oToolbar.addContent(new Button({
				icon: "sap-icon://sorting-ranking",
				press: function() {
					fOpenDialogSort();
				}
			}));
		}
		if (fOpenDialogGroup) {
			oToolbar.addContent(new Button({
				icon: "sap-icon://group-2",
				press: function() {
					fOpenDialogGroup();
				}
			}));
		}
		if (fOpenDialogColumns) {
			oToolbar.addContent(new Button({
				icon: "sap-icon://multi-select",
				press: function() {
					fOpenDialogColumns();
				}
			}));
		}
		oToolbar.addContent(new SmartVariantManagement(sIDTable + "-SmartVariant", {
			visible: bShowVariantManagement,
			showExecuteOnSelection: true,
			showShare: true
		}));
		oToolbar.addContent(new Label({
			text: ""
		}));
		oToolbar.addContent(new ToolbarSpacer({}));
		if (fOpenDialogPersistentData) {
			oToolbar.addContent(new Button({
				icon: "sap-icon://cloud",
				press: function() {
					fOpenDialogPersistentData();
				}
			}));
		}
		if (fOpenDialogDataSuiteFormat) {
			oToolbar.addContent(new Button({
				icon: "sap-icon://journey-change",
				press: function() {
					fOpenDialogDataSuiteFormat();
				}
			}));
		}
		if (fOpenDialog) {
			oToolbar.addContent(new Button({
				icon: "sap-icon://action-settings",
				press: function() {
					fOpenDialog();
				}
			}));
		}
		return oToolbar;
	};

	PersonalizationDialogHelper.getVariantManagementIdOfTable = function(oTable) {
		return oTable.getId() + "-SmartVariant";
	};

	return PersonalizationDialogHelper;
}, /* bExport= */true);
