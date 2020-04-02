/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// ----------------------------------------------------------------
// Utility class used by smart controls for multi-currency scenario
// ----------------------------------------------------------------
sap.ui.define([
	"sap/m/List",
	"sap/m/ResponsivePopover",
	"sap/m/CustomListItem",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/syncStyleClass",
	"sap/base/util/merge"
], function(
	List,
	ResponsivePopover,
	CustomListItem,
	Filter,
	FilterOperator,
	syncStyleClass,
	merge
) {
	"use strict";

	/**
	 * Utility class used by smart controls for multi-currency scenario
	 *
	 * @private
	 * @experimental This module is only for internal/experimental use!
	 */
	var MultiCurrencyUtil = {
		/**
		 * returns true/false based on whether multi-currency "*" value is present for currency
		 *
		 * @private
		 * @param {string} sCurrency - The currency value
		 * @returns {function} whether there are multiple currencies - "*"
		 */
		isMultiCurrency: function(sCurrency) {
			return sCurrency === "*";
		},
		openMultiCurrencyPopover: function(oEvent, mAdditionalParams) {
			var oSmartTable = sap.ui.getCore().byId(mAdditionalParams.smartTableId);
			var oAnalyticalTable = oSmartTable.getTable();
			var oBinding = oAnalyticalTable.getBinding("rows");
			var sCurrency = mAdditionalParams.currency;
			var sCurrencyUnit = mAdditionalParams.unit;
			var oCurrencyTemplate = mAdditionalParams.template;
			var oAnalyticalInfoForColumn, sDimension;
			// no binding or currency or unit --> return
			if (!oBinding || !sCurrency || !sCurrencyUnit) {
				return;
			}

			var oLink = oEvent.getSource();
			// The link is inside a container (e.g. VBox), get this layout container control in order to get the row and finally the analytical info
			var oLayout = oLink.getParent();
			if (mAdditionalParams.additionalParent) {
				oLayout = oLayout.getParent();
			}
			// via the row, we can get the analytical information
			var oAnalyticalInfo = oAnalyticalTable.getAnalyticalInfoOfRow(oLayout.getParent());
			if (!oAnalyticalInfo) {
				return;
			}
			// prepare filter statement, select and title

			var i, aFilters = [], aSelect = [
				// always request amount and currency
				sCurrency, sCurrencyUnit
			], sTitle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_MULTI_TOTAL_TITLE") || "Total";

			// Add any application filters already present on the binding (these should be the ones already processed by SmartTable)
			if (oBinding.aApplicationFilter) {
				aFilters = [].concat(oBinding.aApplicationFilter);
			}
			// Get custom query parameters (e.g. "search" from the parent binding and apply it here!)
			var mBindingInfo = oAnalyticalTable.getBindingInfo("rows");
			var mCustomParameters = (mBindingInfo && mBindingInfo.parameters && mBindingInfo.parameters.custom) ? merge({}, mBindingInfo.parameters.custom) : undefined;

			// Grand Total --> do nothing as we already add Currency and unit to the Select clause
			if (oAnalyticalInfo.groupTotal || oAnalyticalInfo.group) {
				// Group Total / Group Header
				var aGroupedColumns = oAnalyticalInfo.groupedColumns;

				for (i = 0; i < aGroupedColumns.length; i++) {
					sDimension = sap.ui.getCore().byId(aGroupedColumns[i]).getLeadingProperty();
					if (!sDimension) {
						continue;
					}
					// Get Analytical Info for column --> in order to determine/use the proper dimensionProperty!
					// When grouping is done on text column, the actual grouping happens on the dimension (code) property and not the text
					oAnalyticalInfoForColumn = oBinding.getAnalyticalInfoForColumn(sDimension);
					if (oAnalyticalInfoForColumn) {
						sDimension = oAnalyticalInfoForColumn.dimensionPropertyName;
					}
					if (sDimension) {
						aFilters.push(new Filter(sDimension, FilterOperator.EQ, oAnalyticalInfo.context.getProperty(sDimension)));
					}
				}
				sTitle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_MULTI_GROUP_TITLE") || "Subtotal";
			} else if (!oAnalyticalInfo.grandTotal) {
				// Line item that contains multiple currencies
				var aProperties = Object.getOwnPropertyNames(oBinding.getDimensionDetails());
				for (i = 0; i < aProperties.length; i++) {
					aFilters.push(new Filter(aProperties[i], FilterOperator.EQ, oAnalyticalInfo.context.getProperty(aProperties[i])));
				}
				sTitle = sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp").getText("SMARTTABLE_MULTI_GROUP_TITLE") || "Subtotal";
			}

			var oDetailsTemplate = oCurrencyTemplate.clone(); // clone the original currency template
			oDetailsTemplate.unbindProperty("visible"); // necessary for the details list

			// create popover
			var sPopoverId = mAdditionalParams.smartTableId + "-multiUnitPopover", oPopover, oDetailsList;
			oPopover = sap.ui.getCore().byId(sPopoverId);
			if (!oPopover) {
				oDetailsList = new List(sPopoverId + "-detailsList", {
					showSeparators: "None",
					ariaLabelledBy: sPopoverId + "-title"
				});
				oDetailsList.addStyleClass("sapUiContentPadding sapUiCompMultiCurrency");

				oPopover = new ResponsivePopover(sPopoverId, {
					content: oDetailsList
				});
				syncStyleClass("sapUiSizeCompact", oAnalyticalTable, oPopover);
				oAnalyticalTable.addDependent(oPopover);
			}
			if (!oDetailsList) {
				oDetailsList = sap.ui.getCore().byId(sPopoverId + "-detailsList");
			}

			// Update the Popover content and bind the result list
			oPopover.setTitle(sTitle);
			oPopover.setPlacement(oAnalyticalInfo.grandTotal ? "VerticalPreferredTop" : "VerticalPreferredBottom");
			oDetailsList.bindItems({
				path: oBinding.getPath(),
				filters: aFilters,
				parameters: {
					select: aSelect.join(","),
					custom: mCustomParameters
				},
				templateShareable: false,
				template: new CustomListItem({
					content: [
						oDetailsTemplate
					]
				})
			});
			oPopover.openBy(oLink);
		}
	};

	return MultiCurrencyUtil;

}, /* bExport= */true);
