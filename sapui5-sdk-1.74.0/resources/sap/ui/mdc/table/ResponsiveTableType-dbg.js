/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"./TableTypeBase", "../library"
], function(TableTypeBase, library) {
	"use strict";

	var InnerTable, InnerColumn, InnerRow;
	var GrowingMode = library.GrowingMode;
	var RowAction = library.RowAction;

	/**
	 * Constructor for a new ResponsiveTableType.
	 *
	 * @param {string} [sId] ID for the new object, generated automatically if no ID is given
	 * @param {object} [mSettings] initial settings for the new object
	 * @class The table type info base class for the metadata driven table.
	 *        <h3><b>Note:</b></h3>
	 *        The control is experimental and the API/behaviour is not finalised and hence this should not be used for productive usage.
	 * @extends sap.ui.mdc.table.TableTypeBase
	 * @author SAP SE
	 * @constructor The API/behaviour is not finalised and hence this control should not be used for productive usage.
	 * @private
	 * @experimental
	 * @since 1.65
	 * @alias sap.ui.mdc.table.ResponsiveTableType
	 * @ui5-metamodel This element also will be described in the UI5 (legacy) designtime metamodel
	 */

	var ResponsiveTableType = TableTypeBase.extend("sap.ui.mdc.table.ResponsiveTableType", {
		metadata: {
			properties: {
				/**
				 * See sap.ui.mdc.GrowingMode<br>
				 * Defaults to Basic --> meaning only growing is enabled on ResponsiveTable
				 */
				growingMode: {
					type: "sap.ui.mdc.GrowingMode",
					defaultValue: GrowingMode.Basic
				}
			}
		}
	});

	ResponsiveTableType.prototype.updateRelevantTableProperty = function(oTable, sProperty, vValue) {
		if (oTable && oTable.isA("sap.m.Table") && sProperty === "growingMode") {
			oTable.setGrowingScrollToLoad(vValue === GrowingMode.Scroll);
		}
	};

	ResponsiveTableType.updateDefault = function(oTable) {
		if (oTable) {
			oTable.setGrowing(true);
			oTable.setGrowingScrollToLoad(false);
		}
	};

	/* Below APIs are used during table creation */

	ResponsiveTableType.loadTableModules = function() {
		if (!InnerTable) {
			return new Promise(function(resolve, reject) {
				sap.ui.require([
					"sap/m/Table", "sap/m/Column", "sap/m/ColumnListItem"
				], function(ResponsiveTable, ResponsiveColumn, ColumnListItem) {
					InnerTable = ResponsiveTable;
					InnerColumn = ResponsiveColumn;
					InnerRow = ColumnListItem;
					resolve();
				}, function() {
					reject("Failed to load some modules");
				});
			});
		} else {
			return Promise.resolve();
		}
	};

	ResponsiveTableType.createTable = function(sId, mSettings) {
		return new InnerTable(sId, mSettings);
	};

	ResponsiveTableType.createColumn = function(sId, mSettings) {
		return new InnerColumn(sId, mSettings);
	};

	ResponsiveTableType.createTemplate = function(sId, mSettings) {
		return new InnerRow(sId, mSettings);
	};

	ResponsiveTableType.updateSelection = function(oTable) {
		oTable._oTable.setMode(TableTypeBase.getSelectionMode(oTable));
	};

	ResponsiveTableType.updateNavigation = function(oTable) {
		oTable._oTemplate.setType(RowAction.Navigation);
	};

	ResponsiveTableType.updateRowAction = function(oTable, bNavigation) {
		oTable._oTemplate.setType("Active");
		if (bNavigation) {
			this.updateNavigation(oTable);
		}
	};

	return ResponsiveTableType;
});
