/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// Provides CustomController
sap.ui.define([
	'sap/ui/comp/library',
	'sap/ui/comp/personalization/BaseController',
	'sap/m/P13nPanel',
	'sap/base/util/merge'

], function(
	CompLibrary,
	BaseController,
	P13nPanel,
	merge
) {
	"use strict";

	// P13nPanel extention
	var CustomPanel = P13nPanel.extend("sap.m.CustomPanel", {
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

	/**
	 * The CustomController can be used to...
	 *
	 * @class Table Personalization Controller
	 * @extends sap.ui.comp.personalization.BaseController
	 * @author SAP
	 * @version 1.25.0-SNAPSHOT
	 * @private
	 * @alias sap.ui.comp.personalization.CustomController
	 */
	var CustomController = BaseController.extend("test.sap.ui.comp.personalization.CustomController", /** @lends sap.ui.comp.personalization.CustomController.prototype */
	{
		constructor: function(sId, mSettings) {
			BaseController.apply(this, arguments);
			this.setType("customColumns");
			this.setItemType("customColumnsItems");
		}
	});

	CustomController.prototype.getColumn2Json = function(oColumn, sColumnKey, iIndex) {
		return oColumn.getVisible() ? sColumnKey : null;
	};
	CustomController.prototype.getColumn2JsonTransient = function(oColumn, sColumnKey, sText, sTooltip) {
		return {
			columnKey: sColumnKey,
			text: sText
		};
	};
	CustomController.prototype.syncJson2Table = function(oJson) {
		var oTable = this.getTable();
		var oColumnKey2ColumnMap = this.getColumnMap();

		// Apply order
		var aColumnKeysOrdered = merge([], oJson.customColumns.customColumnsItems);
		this.getColumnKeys().forEach(function(sColumnKey) {
			if (aColumnKeysOrdered.indexOf(sColumnKey) < 0) {
				aColumnKeysOrdered.push(sColumnKey);
			}
		});
		aColumnKeysOrdered.forEach(function(sColumnKey, iIndex) {
			oColumnKey2ColumnMap[sColumnKey].setOrder(iIndex);
		});

		// Apply visibility
		for ( var sColumnKey in oColumnKey2ColumnMap) {
			oColumnKey2ColumnMap[sColumnKey].setVisible(oJson.customColumns.customColumnsItems.indexOf(sColumnKey) > -1, true);
		}
		oTable.invalidate();
	};
	CustomController.prototype.getPanel = function() {
		var that = this;
		return new Promise(function(resolve) {
			// Dynamically load panel once it is needed
			sap.ui.require([
				'sap/m/MultiComboBox', 'sap/ui/core/Item'
			], function(MultiComboBox, Item) {
				return resolve(new CustomPanel({
					type: "customColumns",
					title: "MyColumns",
					titleLarge: "Custom Definition of Columns Properties",
					beforeNavigationTo: that.setModelFunction(),
					content: new MultiComboBox({
						items: {
							path: "$sapmP13nPanel>/transientData/customColumns/customColumnsItems",
							template: new Item({
								key: "{$sapmP13nPanel>columnKey}",
								text: "{$sapmP13nPanel>text}"
							})
						},
						selectedKeys: {
							path: "$sapmP13nPanel>/controlDataReduce/customColumns/customColumnsItems"
						}
					})
				}));
			});
		});
	};
	CustomController.prototype.getChangeType = function(oPersistentDataBase, oPersistentDataCompare) {
		if (!oPersistentDataCompare || !oPersistentDataCompare.customColumns || !oPersistentDataCompare.customColumns.customColumnsItems) {
			return CompLibrary.personalization.ChangeType.Unchanged;
		}
		var bIsDirty = JSON.stringify(oPersistentDataBase.customColumns.customColumnsItems) !== JSON.stringify(oPersistentDataCompare.customColumns.customColumnsItems);

		return bIsDirty ? CompLibrary.personalization.ChangeType.ModelChanged : CompLibrary.personalization.ChangeType.Unchanged;
	};
	CustomController.prototype.getChangeData = function(oPersistentDataBase, oPersistentDataCompare) {
		if (!oPersistentDataBase || !oPersistentDataBase.customColumns || !oPersistentDataBase.customColumns.customColumnsItems) {
			return {
				customColumns: {
					customColumnsItems: []
				}
			};
		}

		if (!oPersistentDataCompare || !oPersistentDataCompare.customColumns || !oPersistentDataCompare.customColumns.customColumnsItems) {
			return {
				customColumns: merge([], oPersistentDataBase.customColumns)
			};
		}

		if (JSON.stringify(oPersistentDataBase.customColumns.customColumnsItems) !== JSON.stringify(oPersistentDataCompare.customColumns.customColumnsItems)) {
			return {
				customColumns: merge([], oPersistentDataBase.customColumns)
			};
		}
		return null;
	};
	CustomController.prototype.getUnionData = function(oPersistentDataBase, oPersistentDataCompare) {
		if (!oPersistentDataCompare || !oPersistentDataCompare.customColumns || !oPersistentDataCompare.customColumns.customColumnsItems) {
			return {
				customColumns: merge([], oPersistentDataBase.customColumns)
			};
		}
		return {
			customColumns: merge([], oPersistentDataBase.customColumns)
		};
	};

	return CustomController;

}, /* bExport= */true);