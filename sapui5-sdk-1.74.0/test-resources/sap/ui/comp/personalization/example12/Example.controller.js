sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/core/util/MockServer',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/comp/personalization/Controller',
	'sap/ui/comp/personalization/Util',
	'test/sap/ui/comp/personalization/Util',
	'sap/ui/comp/smartvariants/PersonalizableInfo',
	'sap/ui/table/Column',
	'sap/m/library',
	'sap/m/Text',
	'sap/ui/model/Sorter',
	'sap/ui/model/Filter',
	'sap/base/util/merge'

], function(
	Controller,
	MockServer,
	ODataModel,
	PersonalizationController,
	PersonalizationUtil,
	TestUtil,
	PersonalizableInfo,
	Column,
	mLibrary,
	Text,
	Sorter,
	Filter,
	merge
) {
	"use strict";

	return Controller.extend("root.Example", {

		onInit: function() {
			// Init OData model
			this.initModel();

			// Init table columns
			this.initColumns(this._getTable());

			// Init JSON structure which will be persisted in LRep as a variant
			this.oPersistentData = {};
		},

		initModel: function() {
			var oMockServer = new MockServer({
				rootUri: "testsuite.personalization.example12/"
			});
			oMockServer.simulate("../../../../../../test-resources/sap/ui/comp/personalization/example12/mockserver/metadata.xml", "../../../../../../test-resources/sap/ui/comp/personalization/example12/mockserver/");
			// oMockServer.simulate("../../../../../../test-resources/sap/ui/comp/demokit/sample/smarttable/mockserver/orgHierarchy.xml", "../../../../../../test-resources/sap/ui/comp/demokit/sample/smarttable/mockserver/");
			oMockServer.start();

			// create and set ODATA Model
			this.getView().setModel(new ODataModel("testsuite.personalization.example12", true));
		},

		initColumns: function(oTable) {
			var that = this;
			var oModel = this.getView().getModel();
			// get metadata file to create table columns automatically
			oModel.getMetaModel().loaded().then(function() {
				oModel.getMetaModel().getODataEntityType('HierarchyTestservice.odata.tree.orgHierarchyType').property.forEach(function(oMetadata) {
					// oModel.getMetaModel().getODataEntityType('ZIVZ_COA_SRV.GLAccountHierarchyInChartOfAccountsList').property.forEach(function(oMetadata) {
					// Create new table column based on metadata (with binding)
					var sPath = oMetadata.name;
					var oColumn = new Column({
						grouped: false,
						autoResizable: true,
						visible: true,
						template: new Text({
							text: "{" + sPath + "}"
						}),
						// showFilterMenuEntry: (oMetadata["sap:filterable"] === undefined || oMetadata["sap:filterable"] === "true") ? true : false,
						label: new Text({
							text: oMetadata["sap:label"] || sPath
						})
					// ,
					// sortProperty: (oMetadata["sap:sortable"] === undefined || oMetadata["sap:sortable"] === "true") ? sPath : undefined,
					// filterProperty: (oMetadata["sap:filterable"] === undefined || oMetadata["sap:filterable"] === "true") ? sPath : undefined
					}).data("p13nData", {
						columnKey: sPath
					});

					// // mark only hierarchy columns as visible (can be changed by the personalization dialog)
					// if (oMetadata["sap:hierarchy-level-for"] !== undefined || oMetadata["sap:hierarchy-node-for"] !== undefined || oMetadata["sap:hierarchy-parent-node-for"] !== undefined) {
					// 	oColumn.setVisible(true);
					// }

					oTable.addColumn(oColumn);
				});

				oTable.bindRows({
					path: '/orgHierarchy',
					// path: '/GLAccountHierarchyInChartOfAccountsLiSet',
					parameters: {
						numberOfExpandedLevels: 2
					}
				});

				// Init P13nController
				that.initP13nController(oTable);

				// Init VariantManagement
				that.initVariantManagement(oTable, that.oP13nDialogController);
			});
		},

		initP13nController: function(oTable) {
			// Init P13nController for table personalization
			this.oP13nDialogController = new PersonalizationController({
				table: oTable,
				resetToInitialTableState: false,
				// columnKeys: this._getInitiallyVisibleColumns(this._getTable()),
				// requestColumns: this.onRequestColumns.bind(this),
				afterP13nModelDataChange: this.onAfterP13nModelDataChange.bind(this)
			});
		},

		initVariantManagement: function(oControl, oController) {
			var that = this;
			var oSmartVariant = this._getVariantManagement();

			oControl.fetchVariant = function() {
				return merge({}, that.oPersistentData);
			};
			oControl.applyVariant = function(oVariantJSON) {
				if (jQuery.isEmptyObject(oVariantJSON)) {
					oController.setPersonalizationData(null);
				} else {
					oController.setPersonalizationData(merge({}, oVariantJSON));
				}
				that._setDirtyFlag(false);
			};
			oSmartVariant.attachSave(function() {
				oController.setPersonalizationData(that.oPersistentData);
				that._setDirtyFlag(false);
			});
			oControl._fnDummy = function() {
			};
			oSmartVariant.addPersonalizableControl(new PersonalizableInfo({
				type: "table",
				keyName: "id",
				dataSource: "TODO",
				control: oControl
			}));
			oSmartVariant.initialise(oControl._fnDummy, oControl);
		},

		onP13nDialogPress: function() {
			this.oP13nDialogController.openDialog();
		},

		onAfterP13nModelDataChange: function(oEvent) {
			var oChangeTypeRestore = oEvent.getParameter("persistentDataChangeType");
			var oTable = oEvent.oSource.getTable();
			var aColumns = oTable.getColumns();
			var oBinding = oTable.getBinding("rows");

			this.oPersistentData = oEvent.getParameter("persistentData");

			this._setDirtyFlag(PersonalizationUtil.hasChangedType(oChangeTypeRestore));

			if (this.oPersistentData.sort) {
				var aSorters = [];
				if (this.oPersistentData.sort && this.oPersistentData.sort.sortItems) {
					this.oPersistentData.sort.sortItems.forEach(function(oSortItem) {
						var oColumn = TestUtil.getColumn(oSortItem.columnKey, aColumns);
						var sPath = PersonalizationUtil.getColumnKey(oColumn);
						var bDescending = oSortItem.operation === mLibrary.P13nConditionOperation.Descending;
						var oSorter = aSorters.find(function(oSorter) {
							return oSorter.sPath === sPath;
						});
						if (oSorter) {
							oSorter.bDescending = bDescending;
						} else {
							aSorters.push(new Sorter(sPath, bDescending));
						}
					}, this);
				}
				oBinding.sort(aSorters);
			}

			if (this.oPersistentData.filter && this.oPersistentData.filter.filterItems) {
				var aFilters = [];
				this.oPersistentData.filter.filterItems.forEach(function(oModelItem) {
					var oColumn = TestUtil.getColumn(oModelItem.columnKey, aColumns);
					var sPath = PersonalizationUtil.getColumnKey(oColumn);
					aFilters.push(new Filter(sPath, oModelItem.operation, oModelItem.value1, oModelItem.value2));
				}, this);
				oBinding.filter(aFilters);
			}
		},

		_getTable: function() {
			return this.getView().byId("IDTreeTable");
		},

		_getVariantManagement: function() {
			return this.getView().byId("IDSmartVariant");
		},

		_setDirtyFlag: function(bIsChanged) {
			this._getVariantManagement().currentVariantSetModified(bIsChanged);
		}

	// _getInitiallyVisibleColumns: function(oTable) {
	// 	return oTable.getColumns().filter(function(oColumn) {
	// 		return oColumn.getVisible();
	// 	}).map(function(oColumn) {
	// 		return JSON.parse(oColumn.data("p13nData")).columnKey;
	// 	});
	// },
	//
	// onRequestColumns: function(oEvent) {
	// 	var aColumnKeys = oEvent.getParameter("columnKeys");
	// 	var oTable = oEvent.oSource.getTable();
	//
	// 	var oColumnKey2ColumnMap = {};
	// 	if (oTable instanceof sap.ui.table.AnalyticalTable) {
	// 		oColumnKey2ColumnMap = sap.ui.comp.personalization.PersonalizationDialog.createAnalyticalColumns(oTable, oANAData, aColumnKeys);
	// 		oANAController.addColumns(oColumnKey2ColumnMap);
	// 	} else if (oTable instanceof sap.ui.table.Table) {
	// 		oColumnKey2ColumnMap = sap.ui.comp.personalization.PersonalizationDialog.createUIColumns(oTable, oJSONData, aColumnKeys);
	// 		oUIController.addColumns(oColumnKey2ColumnMap);
	// 	} else if (oTable instanceof sap.m.Table) {
	// 		oColumnKey2ColumnMap = sap.ui.comp.personalization.PersonalizationDialog.createMColumns(oTable, oJSONData, aColumnKeys);
	// 		oMController.addColumns(oColumnKey2ColumnMap);
	// 	}
	// },

	// onExit: function() {
	// 	FakeLrepConnectorLocalStorage.disableFakeConnector();
	// }
	});

});
