sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'test/sap/ui/comp/personalization/Util',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/model/Sorter',
	'sap/ui/model/Filter',
	'sap/ui/model/BindingMode',
	'sap/ui/table/library',
	'sap/base/util/merge'
], function(
	Controller,
	JSONModel,
	TestUtil,
	ODataModel,
	Sorter,
	Filter,
	BindingMode,
	tableLibrary,
	merge
) {
	"use strict";

	return Controller.extend("root.Example", {

		oJSONModel: new JSONModel(),
		oDataInitial: {},
		oDataBeforeOpen: {},
		oColumnKey2ColumnMap: {},

		onInit: function() {
			TestUtil.startMockServer({
				rootUri:"/mockserver/",
				metadataUrl: "../../../../../../test-resources/sap/ui/comp/personalization/example11/mockserver/metadata.xml",
				mockdataSettings: "../../../../../../test-resources/sap/ui/comp/personalization/example11/mockserver/"
			});

			// Create ODATA Model
			var oModel = new ODataModel("/mockserver");
			this.getView().setModel(oModel);
			oModel.getMetaModel().loaded().then(function(){
				var oTable = this._getTable();
				var aColumnKeysOrdered = TestUtil.getColumnKeysOrderedFromODataModel(oModel, "ProductCollection");
				this.oColumnKey2ColumnMap = TestUtil.createUITableColumnsMap(oModel, aColumnKeysOrdered, "ProductCollection");
				var aColumnCollection = [];
				var aColumnsItems = [];
				var aSortItems = [];
				var aFilterer = [];
				var aSorter = [];
				aColumnKeysOrdered.forEach(function(sColumnKey, iIndex) {
					var oColumn = this.oColumnKey2ColumnMap[sColumnKey];
					aColumnCollection.push({
						columnKey: sColumnKey,
						text: oColumn.getLabel().getText()
					});
					aColumnsItems.push({
						columnKey: sColumnKey,
						visible: oColumn.getVisible(),
						index: iIndex
					});
					if (oColumn.getSorted()) {
						aSortItems.push({
							columnKey: sColumnKey,
							operation: oColumn.getSortOrder()
						});
					}

					oTable.addColumn(oColumn);

					if (oColumn.getSorted()) {
						aSorter.push(new Sorter(sColumnKey, oColumn.getSortOrder() === tableLibrary.SortOrder.Descending));
					}
					if (oColumn.getFiltered()) {
						aFilterer.push(new Filter(sColumnKey, oColumn.getFilterOperator(), oColumn.getFilterValue()));
					}
				}, this);
				oTable.setModel(oModel);
				// oTable.setModel(this.oJSONModel, "P13n");

				var oBinding = oTable.getBinding("rows");
				oBinding.sort(aSorter);
				oBinding.filter(aFilterer);

				// Create personalization JSON Model
				this.oDataInitial = {
					ShowResetEnabled: false,
					ColumnCollection: aColumnCollection,
					ColumnsItems: aColumnsItems,
					SortItems: aSortItems
				};

				this.oJSONModel.setDefaultBindingMode(BindingMode.TwoWay);
				this.oJSONModel.setData(merge({}, this.oDataInitial));

				oTable.attachSort(this._onSort, this);
				// tbd:
				//oTable.attachColumnMove...
				//oTable.attachColumnVisibility...
				//oTable.attachColumnResize...
			}.bind(this));
		},

		onOK: function(oEvent) {
			this._onClose(oEvent.getSource());
		},

		onCancel: function(oEvent) {
			this.oJSONModel.setProperty("/", merge([], this.oDataBeforeOpen));
			this._onClose(oEvent.getSource());
		},
		onReset: function() {
			this.oJSONModel.setProperty("/", merge([], this.oDataInitial));
		},
		_onClose: function(oPersonalizationDialog) {
			this.oDataBeforeOpen = {};
			oPersonalizationDialog.close();

			this._applyColumns();
			this._applySorts();
		},
		_applyColumns: function() {
			var aColumnsItems = this.oJSONModel.getProperty("/ColumnsItems");
			var oTable = this._getTable();
			aColumnsItems.forEach(function(oColumnsItem) {
				var oColumn = this.oColumnKey2ColumnMap[oColumnsItem.columnKey];
				// Apply column visibility
				if (oColumn.getVisible() !== oColumnsItem.visible) {
					oColumn.setVisible(oColumnsItem.visible, true);
				}
				// Apply column order
				if (oColumnsItem.index === undefined) {
					return;
				}
				if (oTable.indexOfColumn(oColumn) === oColumnsItem.index) {
					return;
				}
				oTable.removeColumn(oColumn, true);
				oTable.insertColumn(oColumn, oColumnsItem.index);
			}, this);
		},
		_applySorts: function() {
			var aSortItems = this.oJSONModel.getProperty("/SortItems");
			for ( var sColumnKey in this.oColumnKey2ColumnMap) {
				var oColumn = this.oColumnKey2ColumnMap[sColumnKey];
				var oSortItem = this._getSortItemByColumnKey(sColumnKey, aSortItems);
				if (!oSortItem) {
					oColumn.setSorted(false);
				} else {
					oColumn.setSorted(true);
					oColumn.setSortOrder(oSortItem.operation);
				}
			}

			var oTable = this._getTable();
			var oBinding = oTable.getBinding("rows");
			var aSorters = [];
			aSortItems.forEach(function(oSortItem) {
				var oSorter = aSorters.find(function(oSorter) {
					return oSorter.sPath === oSortItem.columnKey;
				});
				if (oSorter) {
					oSorter.bDescending = oSortItem.operation === tableLibrary.SortOrder.Descending;
				} else {
					aSorters.push(new Sorter(oSortItem.columnKey, oSortItem.operation === tableLibrary.SortOrder.Descending));
				}
			}, this);
			oBinding.sort(aSorters);
		},
		onP13nDialogPress: function() {
			var oPersonalizationDialog = sap.ui.xmlfragment("root.PersonalizationDialog", this);
			this.oJSONModel.setProperty("/ShowResetEnabled", this._isChangedSortItems() || this._isChangedColumnsItems());
			oPersonalizationDialog.setModel(this.oJSONModel);

			this.getView().addDependent(oPersonalizationDialog);

			this.oDataBeforeOpen = merge({}, this.oJSONModel.getData());
			oPersonalizationDialog.open();
		},
		onChangeColumnsItems: function(oEvent) {
			this.oJSONModel.setProperty("/ColumnsItems", oEvent.getParameter("items"));
		},
		onAddSortItem: function(oEvent) {
			var oParameters = oEvent.getParameters();
			var aSortItems = this.oJSONModel.getProperty("/SortItems");
			oParameters.index > -1 ? aSortItems.splice(oParameters.index, 0, {
				columnKey: oParameters.sortItemData.getColumnKey(),
				operation: oParameters.sortItemData.getOperation()
			}) : aSortItems.push({
				columnKey: oParameters.sortItemData.getColumnKey(),
				operation: oParameters.sortItemData.getOperation()
			});
			this.oJSONModel.setProperty("/SortItems", aSortItems);
		},
		onRemoveSortItem: function(oEvent) {
			var oParameters = oEvent.getParameters();
			if (oParameters.index > -1) {
				var aSortItems = this.oJSONModel.getProperty("/SortItems");
				aSortItems.splice(oParameters.index, 1);
				this.oJSONModel.setProperty("/SortItems", aSortItems);
			}
		},

		_isChangedSortItems: function() {
			var fnGetUnion = function(aDataBase, aData) {
				if (!aData) {
					return merge([], aDataBase);
				}
				return merge([], aData);
			};
			var fnIsEqual = function(aDataBase, aData) {
				if (!aData) {
					return true;
				}
				return JSON.stringify(aDataBase) === JSON.stringify(aData);
			};
			var aDataTotal = fnGetUnion(merge([], this.oDataInitial.SortItems), this.oJSONModel.getProperty("/SortItems"));
			var aDataInitialTotal = merge([], this.oDataInitial.SortItems);
			return !fnIsEqual(aDataTotal, aDataInitialTotal);
		},
		_isChangedColumnsItems: function() {
			var fnGetUnion = function(aDataBase, aData) {
				if (!aData) {
					return merge([], aDataBase);
				}
				return merge([], aData);
			};
			var fnIsEqual = function(aDataBase, aData) {
				if (!aData) {
					return true;
				}
				if (aDataBase.length !== aData.length) {
					return false;
				}
				var fnSort = function(a, b) {
					if (a.visible === true && (b.visible === false || b.visible === undefined)) {
						return -1;
					} else if ((a.visible === false || a.visible === undefined) && b.visible === true) {
						return 1;
					} else if (a.visible === true && b.visible === true) {
						if (a.index < b.index) {
							return -1;
						} else if (a.index > b.index) {
							return 1;
						} else {
							return 0;
						}
					} else if ((a.visible === false || a.visible === undefined) && (b.visible === false || b.visible === undefined)) {
						if (a.columnKey < b.columnKey) {
							return -1;
						} else if (a.columnKey > b.columnKey) {
							return 1;
						} else {
							return 0;
						}
					}
				};
				aDataBase.sort(fnSort);
				aData.sort(fnSort);
				return JSON.stringify(aDataBase) === JSON.stringify(aData);
			};
			var aDataTotal = fnGetUnion(this.oDataInitial.ColumnsItems, this.oJSONModel.getProperty("/ColumnsItems"));
			var aDataInitialTotal = merge([], this.oDataInitial.ColumnsItems);
			return !fnIsEqual(aDataTotal, aDataInitialTotal);
		},

		_onSort: function(oEvent) {
			if (!oEvent.getParameter("columnAdded")) {
				this.oJSONModel.setProperty("/SortItems", []);
			}
			var sColumnKey = this._getColumnKeyOfColumn(oEvent.getParameter("column"));
			var aSortItems = this.oJSONModel.getProperty("/SortItems");
			var oSortItem = this._getSortItemByColumnKey(sColumnKey, aSortItems);
			if (oSortItem) {
				oSortItem.operation = oEvent.getParameter("sortOrder");
			} else {
				aSortItems.push({
					columnKey: sColumnKey,
					operation: oEvent.getParameter("sortOrder")
				});
			}
		},

		_getColumnKeyOfColumn: function(oColumn) {
			for ( var sColumnKey in this.oColumnKey2ColumnMap) {
				if (oColumn === this.oColumnKey2ColumnMap[sColumnKey]) {
					return sColumnKey;
				}
			}
		},

		_getSortItemByColumnKey: function(sColumnKey, aSortItems) {
			return aSortItems.find(function(oSortItem) {
				return oSortItem.columnKey === sColumnKey;
			});
		},

		_getTable: function() {
			return this.getView().byId("IDUITable");
		}
	});
});
