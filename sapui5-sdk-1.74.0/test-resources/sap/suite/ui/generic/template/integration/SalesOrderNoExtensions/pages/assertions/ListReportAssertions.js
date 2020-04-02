/*** List Report assertions ***/
sap.ui.define(
	["sap/ui/test/Opa5",
	 "sap/ui/test/matchers/PropertyStrictEquals",
	 "sap/ui/test/matchers/AggregationFilled",
	 "sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/utils/OpaResourceBundle",
	 "sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/utils/OpaModel",
	 "sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/utils/OpaManifest",
	 "sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/utils/OpaDataStore"],

	function (Opa5, PropertyStrictEquals, AggregationFilled, OpaResourceBundle, OpaModel, OpaManifest, OpaDataStore) {

	return function (prefix, viewName, viewNamespace, entityType, entitySet) {

		return {
			theSmartTableIsVisible: function() {
				console.log ( "OPA5::ListReportAssertions::theSmartTableIsVisible ");
				return this.waitFor({
					controlType: "sap.ui.comp.smarttable.SmartTable",
					success: function() {
						Opa5.assert.ok(true, "The Smart Table is shown correctly on the List Report");
					},
					errorMessage: "The Smart Table couldn´t be found on the List Report"
				});
			},

			theSalesOrdersAreLoadedInTheSmartTable: function() {
				console.log ( "OPA5::ListReportAssertions::theSalesOrdersAreLoadedInTheSmartTable ");
				return this.waitFor({
					controlType: "sap.m.Table",
					matchers: [
						new AggregationFilled({
							name: "items"
						}), function(oTable) {
							var oContext;
							if (oTable.getItems()[0]) {
								oContext = oTable.getItems()[0].getBindingContext();
							}
							return !!oContext;
						}
					],
					success: function(oTable) {
						var oFirstItem = oTable[0].getItems()[0].getBindingContext().getPath();
						firstProduct = oTable[0].getItems()[0].getBindingContext().getObject(oFirstItem);
						Opa5.assert.notEqual(oTable[0].getItems().length, 0, "Sales Orders are loaded in the Smart Table");
					},
					errorMessage: "Sales Orders were not loaded into the Smart Table"
				});
			},

			/**
			* Check for the visibility of the FIRST Group Header. Presence of the same proves that the Grouping is correct.
			* @param {String} sGroupHeaderLabel The exact label of the FIRST Group Header in the List Report Table. ex: "Sales Order ID: 500000000"
			* @throws {Error} Throws an error if the First Group Header does not match the expected Label
			*/
			theGroupHeaderListItemIsDisplayed: function(sGroupHeaderLabel) {
				return this.waitFor({
					id: prefix+"responsiveTable",
					matchers: function (oNode){
					           return oNode.getItems()[0].getTitle() ===sGroupHeaderLabel;
				},
					success: function() {
						Opa5.assert.ok(true, "The Group Header '"+sGroupHeaderLabel+"' is rendered correctly");
					},
					errorMessage: "The Group Header '"+sGroupHeaderLabel+"' is not rendered correctly"
				});
			},

			/**
			* Check for the visibility of the Column List Item. Presence of the same proves that the Grouping is correct and the Item is displayed.
			* @param {String} slistItemText The exact label of the FIRST Column List Item in the List Report Table. ex: "500000000"
			* @throws {Error} Throws an error if the First Column List Item does not match the expected Label
			*/
			theColumnListItemInTableIsDisplayed: function(slistItemText) {
				return this.waitFor({
					controlType: "sap.m.ColumnListItem",
					matchers: function (oColumnListItem){
					 				return (oColumnListItem.getCells()[0].getItems()[0].getText() === slistItemText)
										|| (oColumnListItem.getCells()[0].getItems()[0].getTitle() === slistItemText);
					},
					success: function() {
						Opa5.assert.ok(true, "The Column List Item '"+slistItemText+"' under the Table Group Header is rendered correctly");
					},
					errorMessage: "The Column List Item '"+slistItemText+"' under the Table Group Header is not rendered correctly"
				});
			},

			theSmartVariantManagementIsRendered: function() {
				return this.waitFor({
					controlType: "sap.ui.comp.smartvariants.SmartVariantManagement",
					success: function() {
						Opa5.assert.ok(true, "The Smart Variant management is rendered correctly");
					},
					errorMessage: "The Smart Variant management is not rendered correctly"
				});
			},

			theCorrectSmartVariantIsSelected: function(sText) {
				return this.waitFor({
					controlType: "sap.m.Title",
					matchers: new PropertyStrictEquals({
						name: "text",
						value: sText
					}),
					success: function() {
						Opa5.assert.ok(true, "The Name of the selected Variant is "+sText);
					},
					errorMessage: "The Name of the selected Variant is NOT "+sText
				});
			},

			theSmartTableShouldLoadCorrectData: function(sExpectedText) {
				return this.waitFor({
					controlType: "sap.m.Title",
					viewName: viewName,
					viewNamespace: viewNamespace,
					matchers: [
						new PropertyStrictEquals({
							name: "text",
							value: "Sales Orders ("+sExpectedText+")"
						})
					],
					success: function(oControl) {
						Opa5.assert.ok(true, "The table has the right number of items: " + sExpectedText);
					},
					errorMessage: "The Smart Table is not rendered correctly"
				});
			},

			iShouldSeeTheCorrectTextForISOCurrencyCode: function(iLine, sExpectedText) {
				return this.waitFor({
					id: prefix+"responsiveTable",
					matchers: [
						new AggregationFilled({
							name: "items"
						})
					],
					actions: function(oControl) {
						var aTableItems = oControl.getItems();
						var sText = aTableItems[iLine].getCells()[6].getText();
						Opa5.assert.equal(sText, sExpectedText, "Text of ISO Currency Code (" + sText + ") is as expected (" + sExpectedText + ")");
					},
					errorMessage: "The Smart Table is not rendered correctly"
				});
			},

			iShouldSeeTheNavigatedRowHighlighted: function(sId, iRowIndex, bExpectedHighlight) {
				return this.waitFor({
					id: sId,
					actions: function(oTable) {
						var bHighlighted = oTable.getItems()[iRowIndex].getNavigated();
						Opa5.assert.equal(bHighlighted, bExpectedHighlight, "The Row Item Highlight for the item at index: "+iRowIndex+" is "+bExpectedHighlight+" which is correct");
					},
					errorMessage: "The row item Highlight is incorrect"
				});
			}
		}
	};
});
