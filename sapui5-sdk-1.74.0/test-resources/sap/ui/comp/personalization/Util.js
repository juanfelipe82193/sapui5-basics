/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

/**
 * @namespace Provides utitlity functions for table personalization tests
 * @name sap.ui.comp.qunit.personalization.Util
 * @author SAP SE
 * @version 1.74.0
 * @private
 * @since 1.30.0
 */
sap.ui.define([
	'sap/ui/base/Object',
	'sap/chart/Chart',
	'sap/chart/data/Dimension',
	'sap/chart/data/Measure',
	'sap/ui/comp/personalization/Util',
	'sap/ui/core/util/MockServer',
	'sap/ui/comp/odata/ChartMetadata',
	'sap/ui/comp/smarttable/SmartTable',
	'sap/ui/model/Sorter',
	'sap/ui/model/Filter',
	'sap/m/library',
	'sap/m/TextArea',
	'sap/m/Dialog',
	'sap/m/Button',
	'sap/m/Text',
	'sap/m/Column',
	'sap/m/Label',
	'sap/ui/comp/library',
	'sap/ui/table/library',
	'sap/ui/table/AnalyticalColumn',
	'sap/ui/table/Column',
	'sap/ui/core/CustomData',
	'sap/ui/core/format/DateFormat',
	'sap/ui/model/FilterOperator',
	'sap/base/util/merge'

], function(
	BaseObject,
	Chart,
	Dimension,
	Measure,
	UtilPersonalization,
	MockServer,
	ChartMetadata,
	SmartTable,
	Sorter,
	Filter,
	mLibrary,
	TextArea,
	Dialog,
	Button,
	Text,
	Column,
	Label,
	compLibrary,
	tableLibrary,
	AnalyticalColumn,
	UiColumn,
	CustomData,
	DateFormat,
	FilterOperator,
	merge
) {
	"use strict";

	var Util = BaseObject.extend("sap.ui.comp.personalization.Util", /** @lends sap.ui.comp.personalization.Util.prototype */
	{});

	Util.getAvailableChartTypes = function(oChart) {
		var aAvailableChartTypes = [];
		var mChartTypes = Chart.getChartTypes();
		oChart.getAvailableChartTypes().available.forEach(function(oChartTypeKey) {
			aAvailableChartTypes.push({
				key: oChartTypeKey.chart,
				text: mChartTypes[oChartTypeKey.chart]
			});
		});
		return aAvailableChartTypes;
	};

	Util.getGroupFormatterForDate = function(oDate) {
		var sYear = oDate.getFullYear();
		return {
			key: sYear,
			text: sYear
		};
	};

	Util.getGroupFormatterForBoolean = function(oBoolean) {
		return {
			key: oBoolean,
			text: oBoolean
		};
	};

	Util.getGroupFormatterForText = function(sText, sLabel) {
		var sKey = sText.charAt(0);
		return {
			key: sKey,
			text: sLabel + ": " + sKey
		};
	};

	Util.getGroupFormatterForNumber = function(iNumber) {
		var iTenner = Math.floor(iNumber / 10) * 10;
		return {
			key: iTenner,
			text: iTenner
		};
	};

	/**
	 * @param {string} sColumnKey Column key
	 * @param {sap.ui.table.Column[] | sap.m.Column[]} aColumns array of columns
	 * @returns {sap.ui.table.Column | sap.m.Column | null} found column or null
	 */
	Util.getColumn = function(sColumnKey, aColumns) {
		var oResultColumn = null;
		aColumns.some(function(oColumn) {
			if (UtilPersonalization.getColumnKey(oColumn) === sColumnKey) {
				oResultColumn = oColumn;
				return true;
			}
		}, this);
		return oResultColumn;
	};

	Util.addSorter = function(oTable, aPathOfSorter) {
		var aSorter = [];
		var oBinding = this.getBindingObject(oTable);
		aPathOfSorter.forEach(function(oSortParams) {
			var bDescending = oSortParams.order === "Descending";// P13nConditionOperation.Descending;
			aSorter.push(new Sorter(oSortParams.path, bDescending));
			var oColumn = null;
			if (oTable && oTable.isA("sap.ui.table.Table")) {
				oColumn = this.getColumn(oSortParams.path, oTable.getColumns());
			} else if (oTable instanceof SmartTable) {
				oColumn = this.getColumn(oSortParams.path, oTable._oTable.getColumns());
			}
			if (oColumn) {
				oColumn.setSorted(true);
			}
		}, this);
		oBinding.sort(aSorter);
	};

	Util.addFilterer = function(oTable, aPathOfFilterer) {
		var aFilterer = [];
		var oBinding = this.getBindingObject(oTable);
		aPathOfFilterer.forEach(function(oFilterParams) {
			aFilterer.push(new Filter(oFilterParams.path, oFilterParams.operation, oFilterParams.value1, oFilterParams.value2));
			var oColumn = null;
			if (oTable && oTable.isA("sap.ui.table.Table")) {
				oColumn = this.getColumn(oFilterParams.path, oTable.getColumns());
			} else if (oTable instanceof SmartTable) {
				oColumn = this.getColumn(oFilterParams.path, oTable._oTable.getColumns());
			}
			if (oColumn) {
				oColumn.setFiltered(true);
				oColumn.setFilterOperator(oFilterParams.operation);
				oColumn.setFilterValue(oFilterParams.value1);
				// filterType: sPath === "Date" ? "sap.ui.model.type.Date" : undefined,
			}
		}, this);
		oBinding.filter(aFilterer);
	};

	Util.addGroup = function(oTable, aPathOfGroups) {
		aPathOfGroups.forEach(function(oGroupParams) {
			var oColumn = null;
			if (oTable && oTable.isA("sap.ui.table.Table")) {
				oColumn = this.getColumn(oGroupParams.path, oTable.getColumns());
			} else if (oTable instanceof SmartTable) {
				oColumn = this.getColumn(oGroupParams.path, oTable._oTable.getColumns());
			}
			if (oColumn) {
				oColumn.setGrouped(true);
			}
		}, this);
	};

	Util.updateFiltererFromP13nModelDataChange = function(oTable, oP13nChangeData) {
		var aFilters = [];
		var oBinding = this.getBindingObject(oTable);
		if (oP13nChangeData.filter && oP13nChangeData.filter.filterItems) {
			var aColumns = oTable.getColumns();
			oP13nChangeData.filter.filterItems.forEach(function(oModelItem) {
				var oColumn = this.getColumn(oModelItem.columnKey, aColumns);
				var sPath = UtilPersonalization.getColumnKey(oColumn);
				aFilters.push(new Filter(sPath, oModelItem.operation, oModelItem.value1, oModelItem.value2));
			}, this);
		}
		oBinding.filter(aFilters);
	};

	Util.updateSortererFromP13nModelDataChange = function(oTable, oP13nChangeData) {
		var aColumns = oTable.getColumns();
		var oBinding = this.getBindingObject(oTable);
		var that = this;
		var aSorters = [];

		if (oTable && oTable.isA("sap.m.Table")) {
			if (oP13nChangeData.group && oP13nChangeData.group.groupItems) {
				oP13nChangeData.group.groupItems.some(function(oModelItem) {
					var oColumn = this.getColumn(oModelItem.columnKey, aColumns);
					var sPath = oModelItem.columnKey;
					var bDescending = oModelItem.operation === mLibrary.P13nConditionOperation.GroupDescending;

					switch (UtilPersonalization._getCustomProperty(oColumn, "type")) {
						case "numeric":
							aSorters.push(new Sorter(sPath, bDescending, function(oContext) {
								return that.getGroupFormatterForNumber(oContext.getProperty(sPath));
							}));
							return true;
						case "date":
							aSorters.push(new Sorter(sPath, bDescending, function(oContext) {
								return that.getGroupFormatterForDate(oContext.getProperty(sPath));
							}));
							return true;
						case "boolean":
							aSorters.push(new Sorter(sPath, bDescending, function(oContext) {
								return that.getGroupFormatterForBoolean(oContext.getProperty(sPath));
							}));
							return true;
						default:
							aSorters.push(new Sorter(sPath, bDescending, function(oContext) {
								return that.getGroupFormatterForText(oContext.getProperty(sPath), oColumn.getHeader().getText());
							}));
							return true;
					}
				}, this);
			}
		}
		if (oP13nChangeData.sort && oP13nChangeData.sort.sortItems) {
			oP13nChangeData.sort.sortItems.forEach(function(oMSortItem) {
				var aSorter = aSorters.filter(function(oSorter) {
					return oSorter.sPath === oMSortItem.columnKey;
				});
				if (aSorter[0]) {
					aSorter[0].bDescending = oMSortItem.operation === "Descending";
				} else {
					aSorters.push(new Sorter(oMSortItem.columnKey, oMSortItem.operation === "Descending"));
				}
			});
		}
		oBinding.sort(aSorters);
	};

	Util.getBindingObject = function(oTable) {
		switch (UtilPersonalization.getTableBaseType(oTable)) {
			case compLibrary.personalization.TableType.ChartWrapper:
				return oTable.getChartObject().getBinding("data");
			case compLibrary.personalization.TableType.ResponsiveTable:
				return oTable.getBinding("items");
			case compLibrary.personalization.TableType.Table:
				return oTable.getBinding("rows");
			default:
				return null;
		}
	};

	Util.convertDateFromODataToJSON = function(aOData) {
		var aJSON = [];
		aOData.forEach(function(oData) {
			var oJSON = oData;
			if (oJSON.Date) {
				oJSON.Date = new Date(parseInt(oJSON.Date.substr(6)));
			}
			if (oJSON.Time) {
				oJSON.Time = new Date(oJSON.Time.ms);
			}
			aJSON.push(oJSON);
		});
		return aJSON;
	};

	Util.openDialogPersistentData = function(oPersistentDataVariant) {
		var oTextArea = new TextArea({
			rows: 20,
			width: "700px",
			editable: false
		});
		oTextArea.setValue(JSON.stringify(oPersistentDataVariant).replace(/(},)/g, "},\n"));

		var oDialog = new Dialog({
			title: "Show 'Persistent Data'",
			content: oTextArea,
			beginButton: new Button({
				text: 'OK',
				press: function() {
					oDialog.close();
				}
			})
		});
		oDialog.open();
	};

	Util.openDialogDataSuiteFormat = function(fnGetUiState, fnSetUiState) {
		var oTextArea = new TextArea({
			rows: 20,
			width: "700px"
		});
		var oUiState = fnGetUiState();
		var oDataSuiteFormat = merge({}, oUiState.getPresentationVariant());

		oTextArea.setValue(JSON.stringify(oDataSuiteFormat));
		var oDialog = new Dialog({
			title: "Edit PresentationVariant of the 'Data Suite Format'",
			content: oTextArea,
			beginButton: new Button({
				text: 'OK',
				press: function() {
					oUiState.setPresentationVariant(JSON.parse(oTextArea.getValue()));
					fnSetUiState(oUiState);
					oDialog.close();
				}
			}),
			endButton: new Button({
				text: 'Cancel',
				press: function() {
					oDialog.close();
				}
			})
		});
		oDialog.open();
	};

	Util.addColumnsToMTable = function(oTable, oODataModel, sEntitySet, bLazyLoad) {
		oODataModel.getMetaModel().loaded().then(function(){
			var aColumnKeys = bLazyLoad ? this.getColumnKeysVisibleFromODataModel(oODataModel, sEntitySet) : this.getColumnKeysOrderedFromODataModel(oODataModel, sEntitySet);
			var oColumnKey2ColumnMap = this.createMTableColumnsMap(oODataModel, aColumnKeys, sEntitySet);

			var aFilterer = [];
			var aSorter = [];
			aColumnKeys.forEach(function(sColumnKey) {
				oTable.addColumn(oColumnKey2ColumnMap[sColumnKey]);
				oTable._itemsTemplate.addCell(new Text({
					text: "{" + sColumnKey + "}"
				}));
			});

			oTable.bindItems({
				path: "/" + sEntitySet,
				template: oTable._itemsTemplate,
				filters: aFilterer,
				sorter: aSorter
			});
		}.bind(this));
	};

	Util.createMTableColumnsMap = function(oODataModel, aColumnKeys, sEntitySet) {
		var oColumnKey2ColumnMap = {};
		var aColumnKeysVisible = this.getColumnKeysVisibleFromODataModel(oODataModel, sEntitySet);

		var aColumnKeysSortable = this.getSortablePropertyNames(oODataModel, sEntitySet);
		var aColumnKeysFilterable = this.getFilterablePropertyNames(oODataModel, sEntitySet);

		// var aPresentationVariantSortOrders = this.getSortOrders(oODataModel, sEntitySet);
		// var aSelectionVariantFilters = this.getFilters(oODataModel, sEntitySet);
		// var aPresentationVariantGroupBys = this.getGroupBy(oODataModel, sEntitySet);

		var oEntityType = oODataModel.getMetaModel().getODataEntityType(oODataModel.getMetaModel().getODataEntitySet(sEntitySet).entityType);

		oEntityType.property.forEach(function(oProperty) {
			var sPath = oProperty.name;
			if (aColumnKeys.indexOf(sPath) < 0) {
				return;
			}
			// var aSortOrder = aPresentationVariantSortOrders.filter(function(oPresentationVariantSortOrder) {
			// 	return oPresentationVariantSortOrder.path === sPath;
			// });
			// var aFilter = aSelectionVariantFilters.filter(function(oSelectionVariantFilter) {
			// 	return oSelectionVariantFilter.path === sPath;
			// });

			oColumnKey2ColumnMap[sPath] = new Column({
				header: new Label({
					text: oProperty["sap:label"] || sPath
				}),
				visible: aColumnKeysVisible.indexOf(sPath) > -1,
				customData: new CustomData({
					key: "p13nData",
					value: {
						columnKey: sPath,
						sortProperty: aColumnKeysSortable.indexOf(sPath) < 0 ? undefined : sPath,
						filterProperty: aColumnKeysFilterable.indexOf(sPath) === -1 ? undefined : sPath,
						leadingProperty: sPath,
						type: this.getTypeOfProperty(oProperty.type),
						maxLength: sPath === "Quantity" ? 10 : undefined
					}
				})
			});
		}, this);
		return oColumnKey2ColumnMap;
	};
	Util.addColumnsToUITable = function(oTable, oODataModel, sEntitySet, bLazyLoad) {
		oODataModel.getMetaModel().loaded().then(function(){
			var aColumnKeys = bLazyLoad ? this.getColumnKeysVisibleFromODataModel(oODataModel, sEntitySet) : this.getColumnKeysOrderedFromODataModel(oODataModel, sEntitySet);
			var oColumnKey2ColumnMap = this.createUITableColumnsMap(oODataModel, aColumnKeys, sEntitySet);

			var aFilterer = [];
			var aSorter = [];
			aColumnKeys.forEach(function(sColumnKey) {
				oTable.addColumn(oColumnKey2ColumnMap[sColumnKey]);

				if (oColumnKey2ColumnMap[sColumnKey].getSorted()) {
					aSorter.push(new Sorter(sColumnKey, oColumnKey2ColumnMap[sColumnKey].getSortOrder()));
				}
				if (oColumnKey2ColumnMap[sColumnKey].getFiltered()) {
					aFilterer.push(new Filter(sColumnKey, oColumnKey2ColumnMap[sColumnKey].getFilterOperator(), oColumnKey2ColumnMap[sColumnKey].getFilterValue()));
				}
			});

			oTable.bindRows({
				path: "/" + sEntitySet,
				filters: aFilterer,
				sorter: aSorter
			});
		}.bind(this));
	};

	Util.createUITableColumnsMap = function(oODataModel, aColumnKeys, sEntitySet) {
		var oColumnKey2ColumnMap = {};
		var aColumnKeysVisible = this.getColumnKeysVisibleFromODataModel(oODataModel, sEntitySet);

		var aColumnKeysSortable = this.getSortablePropertyNames(oODataModel, sEntitySet);
		var aColumnKeysFilterable = this.getFilterablePropertyNames(oODataModel, sEntitySet);

		var aPresentationVariantSortOrders = this.getSortOrders(oODataModel, sEntitySet);
		var aSelectionVariantFilters = this.getFilters(oODataModel, sEntitySet);
		// var aPresentationVariantGroupBys = this.getGroupBy(oODataModel, sEntitySet);

		var oEntityType = oODataModel.getMetaModel().getODataEntityType(oODataModel.getMetaModel().getODataEntitySet(sEntitySet).entityType);

		oEntityType.property.forEach(function(oProperty) {
			var sPath = oProperty.name;
			if (aColumnKeys.indexOf(sPath) < 0) {
				return;
			}
			var aSortOrder = aPresentationVariantSortOrders.filter(function(oPresentationVariantSortOrder) {
				return oPresentationVariantSortOrder.path === sPath;
			});
			var aFilter = aSelectionVariantFilters.filter(function(oSelectionVariantFilter) {
				return oSelectionVariantFilter.path === sPath;
			});

			var sType;
			switch (sPath) {
				case "Price":
					sType = "sap.ui.model.odata.type.Double";
					break;
				case "Bool":
					sType = "sap.ui.model.odata.type.Boolean";
					break;
				case "Date":
					sType = "sap.ui.model.odata.type.DateTime";
					break;
				case "Time":
					sType = "sap.ui.model.odata.type.Time";
					break;
				default:
					sType = "sap.ui.model.odata.type.String";
			}

			var sSortOrder;
			if (aSortOrder[0]) {
				if (aSortOrder[0].descending) {
					sSortOrder = tableLibrary.SortOrder.Descending;
				} else {
					sSortOrder = tableLibrary.SortOrder.Ascending;
				}
			}

			oColumnKey2ColumnMap[sPath] = new UiColumn({
				label: new Label({
					text: oProperty["sap:label"] || sPath
				}),
				tooltip: sPath + " Tooltip",
				template: new Label({
					text: {
						path: sPath,
						type: sType
					}
				}),
				visible: aColumnKeysVisible.indexOf(sPath) > -1,
				sortProperty: aColumnKeysSortable.indexOf(sPath) < 0 ? undefined : sPath,
				sorted: !!aSortOrder[0],
				sortOrder: sSortOrder,
				showFilterMenuEntry: false,
				filterProperty: aColumnKeysFilterable.indexOf(sPath) === -1 ? undefined : sPath,
				filtered: !!aFilter[0],
				filterOperator: (aFilter[0] ? (aFilter[0].operation) : undefined),
				filterValue: (aFilter[0] ? (aFilter[0].value1) : undefined),
				customData: new CustomData({
					key: "p13nData",
					value: {
						columnKey: sPath,
						type: this.getTypeOfProperty(oProperty.type),
						maxLength: sPath === "Quantity" ? 10 : undefined
					}
				})
			});
		}, this);
		return oColumnKey2ColumnMap;
	};
	Util.addColumnsToAnalyticalTable = function(oTable, oODataModel, sEntitySet, bLazyLoad) {
		oODataModel.getMetaModel().loaded().then(function(){
			var aColumnKeys = bLazyLoad ? this.getColumnKeysVisibleFromODataModel(oODataModel, sEntitySet) : this.getColumnKeysOrderedFromODataModel(oODataModel, sEntitySet);
			var oColumnKey2ColumnMap = this.createAnalyticalColumnsMap(oODataModel, aColumnKeys, sEntitySet);

			var aFilterer = [];
			var aSorter = [];
			aColumnKeys.forEach(function(sColumnKey) {
				oTable.addColumn(oColumnKey2ColumnMap[sColumnKey]);

				if (oColumnKey2ColumnMap[sColumnKey].getSorted()) {
					aSorter.push(new Sorter(sColumnKey, oColumnKey2ColumnMap[sColumnKey].getSortOrder()));
				}
				if (oColumnKey2ColumnMap[sColumnKey].getFiltered()) {
					aFilterer.push(new Filter(sColumnKey, oColumnKey2ColumnMap[sColumnKey].getFilterOperator(), oColumnKey2ColumnMap[sColumnKey].getFilterValue()));
				}
			});

			oTable.bindRows({
				path: "/" + sEntitySet,
				filters: aFilterer,
				sorter: aSorter
			});
		}.bind(this));
	};

	Util.createAnalyticalColumnsMap = function(oODataModel, aColumnKeys, sEntitySet) {
		var oColumnKey2ColumnMap = {};
		var aColumnKeysVisible = this.getColumnKeysVisibleFromODataModel(oODataModel, sEntitySet);

		var aColumnKeysSortable = this.getSortablePropertyNames(oODataModel, sEntitySet);
		var aColumnKeysFilterable = this.getFilterablePropertyNames(oODataModel, sEntitySet);

		var aPresentationVariantSortOrders = this.getSortOrders(oODataModel, sEntitySet);
		var aSelectionVariantFilters = this.getFilters(oODataModel, sEntitySet);
		var aPresentationVariantGroupBys = this.getGroupBy(oODataModel, sEntitySet);

		var oEntityType = oODataModel.getMetaModel().getODataEntityType(oODataModel.getMetaModel().getODataEntitySet(sEntitySet).entityType);

		oEntityType.property.forEach(function(oProperty) {
			var sPath = oProperty.name;
			var sLabel = oProperty["sap:label"] || sPath;

			if (aColumnKeys.indexOf(sPath) < 0) {
				return;
			}
			var aSortOrder = aPresentationVariantSortOrders.filter(function(oPresentationVariantSortOrder) {
				return oPresentationVariantSortOrder.path === sPath;
			});
			var aFilter = aSelectionVariantFilters.filter(function(oSelectionVariantFilter) {
				return oSelectionVariantFilter.path === sPath;
			});

			var sType;
			if (sPath === "Price") {
				sType = "sap.ui.model.odata.type.Double";
			} else if (sPath === "Bool") {
				sType = "sap.ui.model.odata.type.Boolean";
			} else if (sPath === "Date") {
				sType = "sap.ui.model.odata.type.DateTime";
			} else if (sPath === "Time" ) {
				sType = "sap.ui.model.odata.type.Time";
			} else {
				sType = "sap.ui.model.odata.type.String";
			}

			var sSortOrder;
			if (aSortOrder[0]) {
				if (aSortOrder[0].descending) {
					sSortOrder = tableLibrary.SortOrder.Descending;
				} else {
					sSortOrder = tableLibrary.SortOrder.Ascending;
				}
			}

			oColumnKey2ColumnMap[sPath] = new AnalyticalColumn({
				label: new Label({
					text: sLabel
				}),
				tooltip: sPath + " Tooltip",
				template: new Text({
					wrapping: false,
					text: {
						path: sPath,
						type: sType,
						constraints: {
							displayFormat: sPath === "Date" ? "Date" : ""
						}
					}
				}),
				visible: aColumnKeysVisible.indexOf(sPath) > -1,
				sortProperty: aColumnKeysSortable.indexOf(sPath) < 0 ? undefined : sPath,
				sorted: !!aSortOrder[0],
				sortOrder: sSortOrder,
				showFilterMenuEntry: false,
				filterProperty: aColumnKeysFilterable.indexOf(sPath) === -1 ? undefined : sPath,
				filtered: !!aFilter[0],
				filterOperator: (aFilter[0] ? (aFilter[0].operation) : undefined),
				filterValue: (aFilter[0] ? (aFilter[0].value1) : undefined),
				customData: new CustomData({
					key: "p13nData",
					value: {
						columnKey: sPath,
						type: this.getTypeOfProperty(oProperty.type),
						maxLength: sPath === "Quantity" ? 10 : undefined
					}
				}),
				summed: false,
				leadingProperty: sPath,
				inResult: (sPath === 'Name'),
				autoResizable: true,
				grouped: aPresentationVariantGroupBys.indexOf(sPath) > -1
			});
		}, this);
		return oColumnKey2ColumnMap;
	};

	Util.createDimMeasuresMap = function(oODataModel, aColumnKeys, sEntitySet) {
		var oColumnKey2ColumnMap = {};

		var aColumnKeysSortable = this.getSortablePropertyNames(oODataModel, sEntitySet);
		var aColumnKeysFilterable = this.getFilterablePropertyNames(oODataModel, sEntitySet);

		var aPresentationVariantSortOrders = this.getSortOrders(oODataModel, sEntitySet);
		// var aSelectionVariantFilters = this.getFilters(oODataModel, sEntitySet);

		var oEntityType = oODataModel.getMetaModel().getODataEntityType(oODataModel.getMetaModel().getODataEntitySet(sEntitySet).entityType);

		var fnGetDateFormatter = function(sType) {
			switch (sType) {
				case "Edm.Date":
					return function(timestamp) {
						return DateFormat.getDateInstance().format(new Date(timestamp));
					};
				case "Edm.Time":
					return function(timestamp) {
						return DateFormat.getTimeInstance().format(new Date(timestamp));
					};
				case "Edm.DateTimeOffset":
				case "Edm.DateTime":
					return function(timestamp) {
						return DateFormat.getDateTimeInstance().format(new Date(timestamp));
					};
				default:
					return null;
			}
		};

		oEntityType.property.forEach(function(oProperty) {
			var sPath = oProperty.name;
			var sLabel = oProperty["sap:label"] || sPath;

			if (aColumnKeys.indexOf(sPath) < 0) {
				return;
			}

			var aSortOrder = aPresentationVariantSortOrders.filter(function(oPresentationVariantSortOrder) {
				return oPresentationVariantSortOrder.path === sPath;
			});
			// var aFilter = aSelectionVariantFilters.filter(function(oSelectionVariantFilter) {
			// 	return oSelectionVariantFilter.path === sPath;
			// });

			oColumnKey2ColumnMap[sPath] = {};
			var sSortOrder;
			if (oProperty["sap:aggregation-role"] && oProperty["sap:aggregation-role"] === "dimension") {

				if (aSortOrder[0]) {
					if (aSortOrder[0].descending) {
						sSortOrder = tableLibrary.SortOrder.Descending;
					} else {
						sSortOrder = tableLibrary.SortOrder.Ascending;
					}
				}

				oColumnKey2ColumnMap[sPath].dimension = new Dimension({
					label: sLabel,
					name: sPath,
					textFormatter: fnGetDateFormatter(oProperty.type),
					customData: new CustomData({
						key: "p13nData",
						value: {
							columnKey: sPath,
							sorted: !!aSortOrder[0],
							sortOrder: sSortOrder,
							sortProperty: aColumnKeysSortable.indexOf(sPath) > -1 ? sPath : undefined,
							filterProperty: aColumnKeysFilterable.indexOf(sPath) > -1 ? sPath : undefined,
							leadingProperty: sPath,
							type: this.getTypeOfProperty(oProperty.type),
							maxLength: sPath === "Quantity" ? 10 : undefined
						}
					})
				});
			} else if (oProperty["sap:aggregation-role"] && oProperty["sap:aggregation-role"] === "measure") {

				if (aSortOrder[0]) {
					if (aSortOrder[0].descending) {
						sSortOrder = tableLibrary.SortOrder.Descending;
					} else {
						sSortOrder = tableLibrary.SortOrder.Ascending;
					}
				}
				oColumnKey2ColumnMap[sPath].measure = new Measure({
					label: sLabel,
					name: sPath,
					customData: new CustomData({
						key: "p13nData",
						value: {
							columnKey: sPath,
							sorted: !!aSortOrder[0],
							sortOrder: sSortOrder,
							sortProperty: aColumnKeysSortable.indexOf(sPath) > -1 ? sPath : undefined,
							filterProperty: aColumnKeysFilterable.indexOf(sPath) > -1 ? sPath : undefined,
							leadingProperty: sPath,
							type: this.getTypeOfProperty(oProperty.type),
							maxLength: sPath === "Quantity" ? 10 : undefined
						}
					})
				});
			} else {

				if (aSortOrder[0]) {
					if (aSortOrder[0].descending) {
						sSortOrder = tableLibrary.SortOrder.Descending;
					} else {
						sSortOrder = tableLibrary.SortOrder.Ascending;
					}
				}
				oColumnKey2ColumnMap[sPath].notDimeasure = {
					columnKey: sPath,
					sorted: !!aSortOrder[0],
					sortOrder: sSortOrder,
					sortProperty: aColumnKeysSortable.indexOf(sPath) > -1 ? sPath : undefined,
					filterProperty: aColumnKeysFilterable.indexOf(sPath) > -1 ? sPath : undefined,
					leadingProperty: sPath,
					label: sLabel,
					tooltip: sLabel
				};
			}
		}, this);
		return oColumnKey2ColumnMap;
	};

	Util.getColumnKeysAndLabelsFromODataModel = function(oModel, sEntitySet) {
		var oMetaModel = oModel.getMetaModel();
		var oEntityType = oMetaModel.getODataEntityType(oMetaModel.getODataEntitySet(sEntitySet).entityType);
		return oEntityType.property.map(function(oProperty) {
			return {
				columnKey: oProperty.name,
				label: oProperty["sap:label"] || oProperty.name
			};
		});
	};

	Util.getColumnKeysVisibleFromODataModel = function(oModel, sEntitySet) {
		var oMetaModel = oModel.getMetaModel();
		var oEntityType = oMetaModel.getODataEntityType(oMetaModel.getODataEntitySet(sEntitySet).entityType);
		return oEntityType["com.sap.vocabularies.UI.v1.LineItem"].map(function(oLineItem) {
			return oLineItem["Value"]["Path"];
		});
	};

	Util.getColumnKeysFromODataModel = function(oModel, sEntitySet) {
		var oMetaModel = oModel.getMetaModel();
		var oEntityType = oMetaModel.getODataEntityType(oMetaModel.getODataEntitySet(sEntitySet).entityType);
		return oEntityType.property.map(function(oProperty) {
			return oProperty.name;
		});
	};

	Util.getColumnKeysOrderedFromODataModel = function(oModel, sEntitySet) {
		var aColumnKeysVisible = this.getColumnKeysVisibleFromODataModel(oModel, sEntitySet);
		var aColumnKeysInvisible = this.getColumnKeysFromODataModel(oModel, sEntitySet).filter(function(sColumnKey) {
			return aColumnKeysVisible.indexOf(sColumnKey) < 0;
		});
		return aColumnKeysVisible.concat(aColumnKeysInvisible);
	};

	Util.getColumnKeysOfChartOrderedFromODataModel = function(oModel, sEntitySet) {
		var aColumnKeysOfDimensionsVisible = this.getColumnKeysOfDimensionsVisibleFromODataModel(oModel, sEntitySet);
		var aColumnKeysOfMeasuresVisible = this.getColumnKeysOfMeasuresVisibleFromODataModel(oModel, sEntitySet);
		var aColumnKeysVisible = aColumnKeysOfDimensionsVisible.concat(aColumnKeysOfMeasuresVisible);
		var aColumnKeysInvisible = this.getColumnKeysFromODataModel(oModel, sEntitySet).filter(function(sColumnKey) {
			return aColumnKeysVisible.indexOf(sColumnKey) < 0;
		});
		return aColumnKeysVisible.concat(aColumnKeysInvisible);
	};

	Util.getSortablePropertyNames = function(oModel, sEntitySet) {
		var oMetaModel = oModel.getMetaModel();
		var oEntityType = oMetaModel.getODataEntityType(oMetaModel.getODataEntitySet(sEntitySet).entityType);
		return oEntityType.property.filter(function(oProperty) {
			return oProperty["sap:sortable"] === undefined || JSON.parse(oProperty["sap:sortable"]);
		}).map(function(oProperty) {
			return oProperty.name;
		});
	};

	Util.getFilterablePropertyNames = function(oModel, sEntitySet) {
		var oMetaModel = oModel.getMetaModel();
		var oEntityType = oMetaModel.getODataEntityType(oMetaModel.getODataEntitySet(sEntitySet).entityType);
		return oEntityType.property.filter(function(oProperty) {
			return oProperty["sap:filterable"] === undefined || JSON.parse(oProperty["sap:filterable"]);
		}).map(function(oProperty) {
			return oProperty.name;
		});
	};

	Util.getChartTypeFromODataModel = function(oModel, sEntitySet) {
		var oMetaModel = oModel.getMetaModel();
		var oEntityType = oMetaModel.getODataEntityType(oMetaModel.getODataEntitySet(sEntitySet).entityType);
		var oAnnotation = oEntityType["com.sap.vocabularies.UI.v1.Chart"];
		if (oAnnotation && oAnnotation["ChartType"]) {
			return ChartMetadata.getChartType(oAnnotation["ChartType"]["EnumMember"]);
		}
		return "";
	};

	Util.getColumnKeysOfDimensionsVisibleFromODataModel = function(oModel, sEntitySet) {
		var oMetaModel = oModel.getMetaModel();
		var oEntityType = oMetaModel.getODataEntityType(oMetaModel.getODataEntitySet(sEntitySet).entityType);
		var oAnnotation = oEntityType["com.sap.vocabularies.UI.v1.Chart"];
		if (oAnnotation && oAnnotation["Dimensions"]) {
			return oAnnotation["Dimensions"].map(function(oDimension) {
				return oDimension["PropertyPath"];
			});
		}
		return [];
	};

	Util.getColumnKeysOfMeasuresVisibleFromODataModel = function(oModel, sEntitySet) {
		var oMetaModel = oModel.getMetaModel();
		var oEntityType = oMetaModel.getODataEntityType(oMetaModel.getODataEntitySet(sEntitySet).entityType);
		var oAnnotation = oEntityType["com.sap.vocabularies.UI.v1.Chart"];
		if (oAnnotation && oAnnotation["Measures"]) {
			return oAnnotation["Measures"].map(function(oMeasure) {
				return oMeasure["PropertyPath"];
			});
		}
		return [];
	};

	Util.getSortOrders = function(oModel, sEntitySet) {
		var oMetaModel = oModel.getMetaModel();
		var oEntityType = oMetaModel.getODataEntityType(oMetaModel.getODataEntitySet(sEntitySet).entityType);
		var oAnnotation = oEntityType["com.sap.vocabularies.UI.v1.PresentationVariant"];
		if (oAnnotation && oAnnotation["SortOrder"]) {
			return oAnnotation["SortOrder"].map(function(oSortOrder) {
				return {
					path: oSortOrder["Property"]["PropertyPath"],
					descending: JSON.parse(oSortOrder["Descending"]["Bool"])
				};
			});
		}
		return [];
	};

	Util.getGroupBy = function(oModel, sEntitySet) {
		var oMetaModel = oModel.getMetaModel();
		var oEntityType = oMetaModel.getODataEntityType(oMetaModel.getODataEntitySet(sEntitySet).entityType);
		var oAnnotation = oEntityType["com.sap.vocabularies.UI.v1.PresentationVariant"];
		if (oAnnotation && oAnnotation["GroupBy"]) {
			return oAnnotation["GroupBy"].map(function(oGroupBy) {
				return oGroupBy["PropertyPath"];
			});
		}
		return [];
	};

	Util.getFilters = function(oModel, sEntitySet) {
		var oMetaModel = oModel.getMetaModel();
		var oSignMap = {
			"UI.SelectionRangeSignType/I": "I",
			"UI.SelectionRangeSignType/E": "E"
		};
		var oOperatorMap = {
			"UI.SelectionRangeOptionType/EQ": FilterOperator.EQ,
			"UI.SelectionRangeOptionType/BT": FilterOperator.BT,
			// "UI.SelectionRangeOptionType/CP": FilterOperator.EQ
			"UI.SelectionRangeOptionType/LE": FilterOperator.LE,
			"UI.SelectionRangeOptionType/GE": FilterOperator.GE,
			"UI.SelectionRangeOptionType/NE": FilterOperator.NE,
			// "UI.SelectionRangeOptionType/NB": FilterOperator.EQ
			// "UI.SelectionRangeOptionType/NP": FilterOperator.EQ
			"UI.SelectionRangeOptionType/GT": FilterOperator.GT,
			"UI.SelectionRangeOptionType/LT": FilterOperator.LT
		};
		var oEntityType = oMetaModel.getODataEntityType(oMetaModel.getODataEntitySet(sEntitySet).entityType);
		var oAnnotation = oEntityType["com.sap.vocabularies.UI.v1.SelectionVariant"];
		if (oAnnotation && oAnnotation["SelectOptions"]) {
			return oAnnotation["SelectOptions"].map(function(oSelectOption) {
				return {
					path: oSelectOption["PropertyName"]["PropertyPath"],
					value1: oSelectOption["Ranges"][0]["Low"]["String"],
					operation: oOperatorMap[oSelectOption["Ranges"][0]["Option"]["EnumMember"]],
					sign: oSignMap[oSelectOption["Ranges"][0]["Sign"]["EnumMember"]]
				};
			});
		}
		return [];
	};

	Util.getTypeOfProperty = function(oPropertyType) {
		switch (oPropertyType) {
			case "Edm.Boolean":
				return "boolean";
			case "Edm.Time":
				return "time";
			case "Edm.String":
				return "string";
			case "Edm.Decimal":
				return "numeric";
			case "Edm.DateTime":
				return "date";
			default:
				return null;
		}
	};

	Util.startMockServer = function(oData) {
		if (this.oServer) {
			throw "an instance of a MockServer is still active. Please stop first the running one before another can be started";
		}
		this.oServer = new MockServer({
			rootUri: oData.rootUri
		});
		this.oServer.simulate(oData.metadataUrl, oData.mockdataSettings);
		this.oServer.start();
	};

	Util.stopMockServer = function() {
		this.oServer.stop();
	};

	return Util;
}, /* bExport= */true);
