/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// Provides FilterController
sap.ui.define([
	'./BaseController',
	'sap/m/library',
	'sap/ui/comp/library',
	'./Util',
	'sap/ui/comp/filterbar/VariantConverterTo',
	'sap/ui/comp/filterbar/VariantConverterFrom',
	'sap/base/util/merge'

], function(
	BaseController,
	MLibrary,
	CompLibrary,
	Util,
	VariantConverterTo,
	VariantConverterFrom,
	merge
) {
	"use strict";

	/**
	 * The FilterController can be used to...
	 *
	 * @class Table Personalization Controller
	 * @extends sap.ui.comp.personalization.BaseController
	 * @author SAP
	 * @version 1.25.0-SNAPSHOT
	 * @private
	 * @alias sap.ui.comp.personalization.FilterController
	 */
	var FilterController = BaseController.extend("sap.ui.comp.personalization.FilterController", /** @lends sap.ui.comp.personalization.FilterController.prototype */ {
		constructor: function(sId, mSettings) {
			BaseController.apply(this, arguments);
			this.setType(MLibrary.P13nPanelType.filter);
			this.setItemType(MLibrary.P13nPanelType.filter + "Items");
		},
		metadata: {
			events: {
				afterFilterModelDataChange: {}
			}
		}
	});

	FilterController.prototype.setTable = function(oTable) {
		BaseController.prototype.setTable.apply(this, arguments);
	};

	FilterController.prototype.getColumn2Json = function(oColumn, sColumnKey, iIndex) {
		// This is not complete but the best we can do - problem is that the filter is not extractable from other table instances.
		if (this.getTableType() !== CompLibrary.personalization.TableType.AnalyticalTable && this.getTableType() !== CompLibrary.personalization.TableType.Table && this.getTableType() !== CompLibrary.personalization.TableType.TreeTable) {
			return null;
		}
		if (!Util.isFilterable(oColumn)) {
			return null;
		}
		if (!oColumn.getFiltered || (oColumn.getFiltered && !oColumn.getFiltered())) {
			return null;
		}
		return {
			columnKey: sColumnKey,
			exclude: false,
			operation: oColumn.getFilterOperator(),
			value1: oColumn.getFilterValue(),
			value2: "" // The Column API does not provide method for 'value2'
		};
	};

	FilterController.prototype.getColumn2JsonTransient = function(oColumn, sColumnKey, sText, sTooltip) {
		if (!Util.isFilterable(oColumn)) {
			return null;
		}

		var aValues;
		if (this.getTableType() === CompLibrary.personalization.TableType.AnalyticalTable || this.getTableType() === CompLibrary.personalization.TableType.Table || this.getTableType() === CompLibrary.personalization.TableType.TreeTable) {
			if (Util.getColumnType(oColumn) === "boolean") {
				aValues = Util._getCustomProperty(oColumn, "values");
			}

			return {
				columnKey: sColumnKey,
				text: sText,
				tooltip: sTooltip,
				maxLength: Util._getCustomProperty(oColumn, "maxLength"),
				precision: Util._getCustomProperty(oColumn, "precision"),
				scale: Util._getCustomProperty(oColumn, "scale"),
				type: Util.getColumnType(oColumn),
				typeInstance: Util._getCustomProperty(oColumn, "typeInstance"),
				values: aValues,
				nullable: Util._getCustomProperty(oColumn, "nullable")
			};
		}
		if (this.getTableType() === CompLibrary.personalization.TableType.ResponsiveTable) {
			if (Util.getColumnType(oColumn) === "boolean") {
				aValues = Util._getCustomProperty(oColumn, "values");
			}

			return {
				columnKey: sColumnKey,
				text: sText,
				tooltip: sTooltip,
				maxLength: Util._getCustomProperty(oColumn, "maxLength"),
				precision: Util._getCustomProperty(oColumn, "precision"),
				scale: Util._getCustomProperty(oColumn, "scale"),
				type: Util.getColumnType(oColumn),
				typeInstance: Util._getCustomProperty(oColumn, "typeInstance"),
				values: aValues,
				nullable: Util._getCustomProperty(oColumn, "nullable")
			};
		}
		if (this.getTableType() === CompLibrary.personalization.TableType.ChartWrapper) {
			return {
				columnKey: sColumnKey,
				text: sText,
				tooltip: sTooltip,
				maxLength: Util._getCustomProperty(oColumn, "maxLength"),
				precision: Util._getCustomProperty(oColumn, "precision"),
				scale: Util._getCustomProperty(oColumn, "scale"),
				type: Util.getColumnType(oColumn),
				typeInstance: Util._getCustomProperty(oColumn, "typeInstance"),
				values: aValues,
				nullable: Util._getCustomProperty(oColumn, "nullable")
			};
		}
	};

	FilterController.prototype.handleIgnore = function(oJson, iIndex) {
		oJson.sort.sortItems.splice(iIndex, 1);
	};

	FilterController.prototype.syncJson2Table = function(oJson) {
		var oColumnKey2ColumnMap = this.getColumnMap();
		var oColumnKey2ColumnMapUnfiltered = merge({}, oColumnKey2ColumnMap);

		this.fireBeforePotentialTableChange();

		if (this.getTableType() === CompLibrary.personalization.TableType.AnalyticalTable || this.getTableType() === CompLibrary.personalization.TableType.Table || this.getTableType() === CompLibrary.personalization.TableType.TreeTable) {
			oJson.filter.filterItems.forEach(function(oFilterItem) {
				var oColumn = oColumnKey2ColumnMap[oFilterItem.columnKey];
				if (oColumn) {
					if (!oColumn.getFiltered()) {
						oColumn.setFiltered(true);
					}
					delete oColumnKey2ColumnMapUnfiltered[oFilterItem.columnKey];
				}
			});

			for (var sColumnKey in oColumnKey2ColumnMapUnfiltered) {
				var oColumn = oColumnKey2ColumnMapUnfiltered[sColumnKey];
				if (oColumn && oColumn.getFiltered()) {
					oColumn.setFiltered(false);
				}
			}
		}

		this.fireAfterPotentialTableChange();
	};

	FilterController.prototype.getDataSuiteFormat2Json = function(oDataSuiteFormat) {
		var oJson = this.createControlDataStructure();

		if (!oDataSuiteFormat.SelectOptions || !oDataSuiteFormat.SelectOptions.length) {
			return oJson;
		}
		oJson.filter.filterItems = oDataSuiteFormat.SelectOptions.map(function(oSelectOption) {
			var oConvertedOption = VariantConverterFrom.convertOption(oSelectOption.Ranges[0].Option, oSelectOption.Ranges[0].Low);
			return {
				columnKey: oSelectOption.PropertyName,
				exclude: (oSelectOption.Ranges[0].Sign === "E"),
				operation: oConvertedOption.op,
				value1: oConvertedOption.v,
				value2: oSelectOption.Ranges[0].High
			};
		});
		return oJson;
	};
	/**
	 * Creates property <code>SelectOptions</code> in <code>oDataSuiteFormat</code> object if at least one filter item exists. The <code>SelectOptions</code> contains the current PersistentData snapshot.
	 * @param {object} oDataSuiteFormat Structure of Data Suite Format
	 */
	FilterController.prototype.getDataSuiteFormatSnapshot = function(oDataSuiteFormat) {
		var oControlDataTotal = this.getUnionData(this.getControlDataInitial(), this.getControlData());
		if (!oControlDataTotal.filter || !oControlDataTotal.filter.filterItems || !oControlDataTotal.filter.filterItems.length) {
			return;
		}
		oControlDataTotal.filter.filterItems.forEach(function(oFilterItem) {
			var aRanges = VariantConverterTo.addRangeEntry(oDataSuiteFormat, oFilterItem.columnKey);
			VariantConverterTo.addRanges(aRanges, [
				oFilterItem
			]);
		});
	};

	FilterController.prototype.getPanel = function(oPayload) {
		// Note: in the time where controller gets the panel all table columns are present (also missing columns).
		// Note: in case that all filterable columns are excluded we nevertheless have to create the panel for the case that some filterable columns will be included.
		if (!Util.hasFilterableColumns(this.getColumnMap())) {
			return null;
		}
		if (oPayload && oPayload.column) {
			var sColumnKey = Util.getColumnKey(oPayload.column);
			if (sColumnKey) {
				var oJson = this.getTransientData();
				oJson.filter.filterItems.forEach(function(oItem) {
					oItem["isDefault"] = oItem.columnKey === sColumnKey;
				});
			}
		}

		return new Promise(function(resolve) {
			// Dynamically load panel once it is needed
			sap.ui.require([
				'sap/m/P13nFilterPanel', 'sap/m/P13nItem', 'sap/m/P13nAnyFilterItem', 'sap/ui/comp/providers/ValueListProvider'
			], function(P13nFilterPanel, P13nItem, P13nAnyFilterItem, ValueListProvider) {
				var oPanel = new P13nFilterPanel({
					containerQuery: true,
					enableEmptyOperations: true,
					items: {
						path: "$sapmP13nPanel>/transientData/filter/filterItems",
						template: new P13nItem({
							columnKey: '{$sapmP13nPanel>columnKey}',
							text: "{$sapmP13nPanel>text}",
							tooltip: "{$sapmP13nPanel>tooltip}",
							maxLength: "{$sapmP13nPanel>maxLength}",
							precision: "{$sapmP13nPanel>precision}",
							scale: "{$sapmP13nPanel>scale}",
							type: "{$sapmP13nPanel>type}",
							typeInstance: "{$sapmP13nPanel>typeInstance}",
							isDefault: "{$sapmP13nPanel>isDefault}",
							values: "{$sapmP13nPanel>values}",
							nullable: "{$sapmP13nPanel>nullable}"
						})
					},
					filterItems: {
						path: "$sapmP13nPanel>/controlDataReduce/filter/filterItems",
						template: new P13nAnyFilterItem({
							key: "{$sapmP13nPanel>key}",
							columnKey: "{$sapmP13nPanel>columnKey}",
							exclude: "{$sapmP13nPanel>exclude}",
							operation: "{$sapmP13nPanel>operation}",
							value1: "{$sapmP13nPanel>value1}",
							value2: "{$sapmP13nPanel>value2}"
						})
					},
					beforeNavigationTo: this.setModelFunction(),
					filterItemChanged: function(oEvent) {
						var sReason = oEvent.getParameter("reason");
						var iIndex = oEvent.getParameter("index");
						var oItem = oEvent.getParameter("itemData");
						var oControlDataReduce = this.getControlDataReduce();

						if (oItem && sReason === "added") {
							if (iIndex > -1) {
								oControlDataReduce.filter.filterItems.splice(iIndex, 0, oItem);
							} else {
								oControlDataReduce.filter.filterItems.push(oItem);
							}
						}

						// Note: as long as P13nFilterPanel updates the 'filterItem' aggregation we do not need to update the model item
						// if (sReason === "updated") {
						// 	oControlDataReduce[that.getType()][that.getItemType()].splice(iIndex, 1, oItem);
						// }

						if (sReason === "removed" && iIndex > -1) {
							oControlDataReduce[this.getType()][this.getItemType()].splice(iIndex, 1);
						}

						this.setControlDataReduce2Model(oControlDataReduce);
						this.fireAfterPotentialModelChange({
							json: oControlDataReduce
						});
					}.bind(this)
				});
				var fnSuggestCallback = function(oControl, sFieldName) {
					var oColumnKey2ColumnMap = this.getColumnMap(true);
					var oColumn = oColumnKey2ColumnMap[sFieldName];
					var sFullyQualifiedFieldName = Util._getCustomProperty(oColumn, "fullName");

					if (sFullyQualifiedFieldName) {
						oControl.setShowSuggestion(true);
						oControl.setFilterSuggests(false);
						oControl.setModel(this.getTable().getModel()); // the control which should show suggest need the model from the table assigned

						return new ValueListProvider({
							fieldName: sFieldName,
							control: oControl,
							model: this.getTable().getModel(),
							maxLength: Util._getCustomProperty(oColumn, "maxLength"),

							resolveInOutParams: false,
							loadAnnotation: true,
							fullyQualifiedFieldName: sFullyQualifiedFieldName,

							aggregation: "suggestionRows",
							typeAheadEnabled: true,
							enableShowTableSuggestionValueHelp: false
						});
					}
				}.bind(this);

				oPanel._oIncludeFilterPanel._fSuggestCallback = fnSuggestCallback;
				oPanel._oExcludeFilterPanel._fSuggestCallback = fnSuggestCallback;

				// Enable enhanced exclude operations
				oPanel._enableEnhancedExcludeOperations();

				return resolve(oPanel);
			}.bind(this));
		}.bind(this));
	};

	/**
	 * Operations on filter are processed sometime directly at the table and sometime not. In case that something has been changed via Personalization
	 * Dialog the consumer of the Personalization Dialog has to apply filtering at the table. In case that filter has been changed via user
	 * interaction at table, the change is instantly applied at the table.
	 */
	FilterController.prototype.getChangeType = function(oPersistentDataBase, oPersistentDataCompare) {
		if (!oPersistentDataCompare || !oPersistentDataCompare.filter || !oPersistentDataCompare.filter.filterItems) {
			return CompLibrary.personalization.ChangeType.Unchanged;
		}

		if (oPersistentDataCompare && oPersistentDataCompare.filter && oPersistentDataCompare.filter.filterItems) {
			oPersistentDataCompare.filter.filterItems.forEach(function(oFilterItem) {
				delete oFilterItem.key;
				delete oFilterItem.source;
			});
		}
		if (oPersistentDataBase && oPersistentDataBase.filter && oPersistentDataBase.filter.filterItems) {
			oPersistentDataBase.filter.filterItems.forEach(function(oFilterItem) {
				delete oFilterItem.key;
				delete oFilterItem.source;
			});
		}
		var bIsDirty = JSON.stringify(oPersistentDataBase.filter.filterItems) !== JSON.stringify(oPersistentDataCompare.filter.filterItems);

		return bIsDirty ? CompLibrary.personalization.ChangeType.ModelChanged : CompLibrary.personalization.ChangeType.Unchanged;
	};

	/**
	 * Result is XOR based difference = CurrentModelData - oPersistentDataCompare
	 *
	 * @param {object} oPersistentDataCompare JSON object. Note: if sortItems is [] then it means that all sortItems have been deleted
	 * @returns {object} JSON object or null
	 */
	FilterController.prototype.getChangeData = function(oPersistentDataBase, oPersistentDataCompare) {
		if (!oPersistentDataBase || !oPersistentDataBase.filter || !oPersistentDataBase.filter.filterItems) {
			return this.createControlDataStructure();
		}

		if (oPersistentDataCompare && oPersistentDataCompare.filter && oPersistentDataCompare.filter.filterItems) {
			oPersistentDataCompare.filter.filterItems.forEach(function(oFilterItem) {
				delete oFilterItem.key;
				delete oFilterItem.source;
			});
		}
		if (oPersistentDataBase && oPersistentDataBase.filter && oPersistentDataBase.filter.filterItems) {
			oPersistentDataBase.filter.filterItems.forEach(function(oFilterItem) {
				delete oFilterItem.key;
				delete oFilterItem.source;
			});
		}

		if (!oPersistentDataCompare || !oPersistentDataCompare.filter || !oPersistentDataCompare.filter.filterItems) {
			return {
				filter: Util.copy(oPersistentDataBase.filter)
			};
		}

		if (JSON.stringify(oPersistentDataBase.filter.filterItems) !== JSON.stringify(oPersistentDataCompare.filter.filterItems)) {
			return {
				filter: Util.copy(oPersistentDataBase.filter)
			};
		}
		return null;
	};

	/**
	 * @param {object} oJsonBase: JSON object to which different properties from JSON oJson are added
	 * @param {object} oJson: JSON object from where the different properties are added to oJsonBase. Note: if filterItems
	 *        is [] then it means that all filterItems have been deleted
	 * @returns {object} JSON object as union result of oJsonBase and oJson
	 */
	FilterController.prototype.getUnionData = function(oJsonBase, oJson) {
		if (!oJson || !oJson.filter || !oJson.filter.filterItems) {
			return {
				filter: Util.copy(oJsonBase.filter)
			};
		}

		return {
			filter: Util.copy(oJson.filter)
		};
	};

	/**
	 * Cleans up before destruction.
	 *
	 * @private
	 */
	FilterController.prototype.exit = function() {
		BaseController.prototype.exit.apply(this, arguments);
	};

	return FilterController;

});
