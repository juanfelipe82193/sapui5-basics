sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/comp/personalization/Controller',
	'sap/ui/model/odata/v2/ODataModel',
	'personalization/Util',
	'sap/ui/model/Sorter',
	'sap/ui/model/Filter',
	'sap/ui/table/library',
	'sap/ui/table/AnalyticalTable',
	'sap/ui/comp/library',
	'sap/ui/comp/smartvariants/PersonalizableInfo',
	'sap/base/util/merge'

],  function(
	Controller,
	PersonalizationController,
	ODataModel,
	TestUtil,
	Sorter,
	Filter,
	tableLibrary,
	AnalyticalTable,
	compLibrary,
	PersonalizableInfo,
	merge
) {
	"use strict";

	return Controller.extend("view.Main", {

		oPersData: {},

		onInit: function() {
			var oModel = new ODataModel("applicationUnderTestPerf");
			this.getView().setModel(oModel);

			oModel.getMetaModel().loaded().then(function(){
				var aColumnKeysOrdered = TestUtil.getColumnKeysOrderedFromODataModel(oModel, "ProductCollection");
				var aColumnKeysVisible = TestUtil.getColumnKeysVisibleFromODataModel(oModel, "ProductCollection");
				this.oColumnKey2ColumnMap = TestUtil.createAnalyticalColumnsMap(oModel, aColumnKeysOrdered, "ProductCollection");

				var that = this;
				this.aInitialSorter = aColumnKeysOrdered.reduce(function(aSorter, sColumnKey, iIndex, aColumnKeys) {
					if (that.oColumnKey2ColumnMap[sColumnKey].getSorted()) {
						aSorter.push(new Sorter(sColumnKey, that.oColumnKey2ColumnMap[sColumnKey].getSortOrder() === "Descending"));
					}
					return aSorter;
				}, []);
				this.aInitialFilters = aColumnKeysOrdered.reduce(function(aFilterer, sColumnKey, iIndex, aColumnKeys) {
					if (that.oColumnKey2ColumnMap[sColumnKey].getFiltered()) {
						aFilterer.push(new Filter(sColumnKey, that.oColumnKey2ColumnMap[sColumnKey].getFilterOperator(), that.oColumnKey2ColumnMap[sColumnKey].getFilterValue()));
					}
					return aFilterer;
				}, []);

				// ER: Analytical Table sets already sorter and filters
				var oTable = new AnalyticalTable("IDAnalyticalTable", {
					selectionMode: tableLibrary.SelectionMode.Single,
					rows: {
						path: "/ProductCollection",
						filters: this.aInitialFilters,
						sorter: this.aInitialSorter,
						parameters: {
							entitySet: "ProductCollection",
							useBatchRequests: true,
							useAcceleratedAutoExpand: false
						}
					},
					columns: aColumnKeysVisible.map(function(sColumnKey) {
						return this.oColumnKey2ColumnMap[sColumnKey];
					}, this)
				});

				this.oP13nDialogController = new PersonalizationController({
					table: oTable,
					resetToInitialTableState: true,
					afterP13nModelDataChange: this.fnHandleAfterP13nModelDataChange.bind(this),
					columnKeys: aColumnKeysOrdered,
					requestColumns: this.fnHandleRequestColumns.bind(this)
				});

				// Bind OData to the table after instantiating of PersonalizationController in order to test
				// the initial grouping!
				this.byId("IDVBox").addItem(oTable);

				this._initVariantManagement();
			}.bind(this));
		},

		_initVariantManagement: function() {
			var oSmartVariant = this.getView().byId("IDSmartVariantManagement");
			var oControl = this.getView().byId("IDVBox");
			if (!oSmartVariant || !oControl) {
				return;
			}

			oControl.fetchVariant = function() {
				return merge({}, this.oPersData);
			}.bind(this);
			oControl.applyVariant = function(oVariantJSON) {
				this.oP13nDialogController.setPersonalizationData(jQuery.isEmptyObject(oVariantJSON) ? null : merge({}, oVariantJSON));
				// this.fnSetDirtyFlag(false, oTable);
			}.bind(this);
			oSmartVariant.attachSave(function() {
				this.oP13nDialogController.setPersonalizationData(this.oPersData);
				// this.fnSetDirtyFlag(false, oTable);
			}.bind(this));
			oControl.getPersistencyKey = function(){
				return "PKeyApplicationUnderTestPerf";
			};
			oControl._fnDummy = function() {
			};
			oSmartVariant.addPersonalizableControl(new PersonalizableInfo({
				type: "table",
				keyName: "persistencyKey",
				dataSource: "TODO",
				control: oControl
			}));
			oSmartVariant.initialise(oControl._fnDummy, oControl);
		},
		onP13nDialogPress: function() {
			this.oP13nDialogController.openDialog();
		},
		fnHandleAfterP13nModelDataChange: function(oEvent) {
			var oPersistentData = oEvent.getParameter("persistentData");
			var oPersistentDataChangeType = oEvent.getParameter("persistentDataChangeType");
			var oTable = oEvent.oSource.getTable();
			oTable.bindRows({
				path: "/ProductCollection",
				filters: oPersistentDataChangeType.filter === compLibrary.personalization.ChangeType.Unchanged ? this.aInitialFilters : oPersistentData.filter.filterItems.map(function(oMItem) {
					return new Filter(oMItem.columnKey, oMItem.operation, oMItem.value1);
				}),
				sorter: oPersistentDataChangeType.sort === compLibrary.personalization.ChangeType.Unchanged ? this.aInitialSorter : oPersistentData.sort.sortItems.map(function(oMItem) {
					return new Sorter(oMItem.columnKey, oMItem.operation === "Descending");
				})
			});

			this.oPersData = oPersistentData;

			// TestUtil.setDirtyFlag(this.byId("IDDirtyFlagLabel"), sap.ui.comp.personalization.Util.hasChangedType(oChangeTypeRestore));

			// TestUtil.updateSortererFromP13nModelDataChange(oTable, oChangeData);
		},
		fnHandleRequestColumns: function(oEvent) {
			var that = this;
			this.oP13nDialogController.addColumns(oEvent.getParameter("columnKeys").reduce(function(oColumnKey2ColumnMap, sColumnKey, iIndex, aColumnKeys) {
				oColumnKey2ColumnMap[sColumnKey] = that.oColumnKey2ColumnMap[sColumnKey];
				return oColumnKey2ColumnMap;
			}, {}));
		},
		onExit: function() {
			TestUtil.stopMockServer();
		}
	});
});
