/*** List Report assertions ***/
sap.ui.define(
	["sap/ui/test/matchers/PropertyStrictEquals",
	"sap/ui/test/matchers/AggregationFilled",
	"sap/suite/ui/generic/template/integration/testLibrary/utils/ApplicationSettings"],

	function (PropertyStrictEquals, AggregationFilled, ApplicationSettings) {

	return function (prefix, viewName, viewNamespace) {

		return {
			/* your local ListReport assertions (OPA tests) */


			/**
			* Check for the visibility of the result chart
			*/
			theResultChartIsVisible: function() {
				return this.waitFor({
					controlType: "sap.ui.comp.smartchart.SmartChart",
					success: function() {
						QUnit.ok(true, "The result Smart Chart is shown correctly on the List Report tab");
					},
					errorMessage: "The SmartChart couldn´t be found on the List Report tab"
				});
			},

			/**
			 * Check for the different entity sets for table
			 */
			theEntitySetOfTheTableIsCorrect: function(iTabIndex) {
			return this.waitFor({
				controlType: "sap.m.Table",
				success: function(oTable) {
					switch (iTabIndex) {
						case 1:
							QUnit.strictEqual(oTable[0].getParent().getEntitySet(), "C_STTA_SalesOrder_WD_20", "The entity set is correct");
							break;
						case 2:
							QUnit.strictEqual(oTable[0].getParent().getEntitySet(), "C_STTA_SalesOrderItem_WD_20", "The entity set is correct");
							break;
						case 4:
							QUnit.strictEqual(oTable[0].getParent().getEntitySet(), "C_STTA_SalesOrderItemSL_WD_20", "The entity set is correct");
							break;
						default:
					}
				},
				errorMessage: "The Table couldn´t be found on the List Report tab"
			});
		},

			/**
			 * Check for the different entity sets for chart
			 */
			theEntitySetOfTheChartIsCorrect: function(iTabIndex) {
			return this.waitFor({
				controlType: "sap.ui.comp.smartchart.SmartChart",
				success: function(aNodes) {
					switch (iTabIndex) {
						case 3:
							QUnit.strictEqual(aNodes[0].getEntitySet(), "C_STTA_SalesOrderItem_WD_20", "The entity set is correct");
							break;
						case 5:
							QUnit.strictEqual(aNodes[0].getEntitySet(), "C_STTA_SalesOrderItemSL_WD_20", "The entity set is correct");
							break;
						default:
					}
				},
				errorMessage: "The SmartChart couldn´t be found on the List Report tab"
			});
		},

			/**
			 * Check the number of items loaded in the ListReport
			 */
			theResultListContainsTheCorrectNumberOfItems: function(iTabIndex, iItems) {
				var aMatchers = [
					new AggregationFilled({
						name: "items"
					})
				];
				var fnSuccess = function(oControl) {
					var actualItems = oControl.getItems();
					QUnit.equal(actualItems.length, iItems, "All the " + iItems + " items are present in the result list");
				};
				return this.iWaitForResponsiveTableInListReport(aMatchers, fnSuccess, iTabIndex);
			},

			iWaitForResponsiveTableInListReport: function(aMatchers, fnSuccess, iTabIndex) {
				var oAppParams = ApplicationSettings.getAppParameters();
				return this.waitFor({
					id: oAppParams.LRPrefixID + "--responsiveTable-" + iTabIndex,
					viewName: viewName,
					viewNamespace: viewNamespace,
					matchers: aMatchers,
					success: fnSuccess,
					errorMessage: "The Responsive Table is not rendered correctly"
				});
			},

			/**
			 * Check a field within the responsive table for correct values.
			 */
			theResultListFieldHasTheCorrectValue: function (iTabIndex, oItem) {
				var oAppParams = ApplicationSettings.getAppParameters();
				return this.waitFor({
					id: oAppParams.LRPrefixID + "--responsiveTable-" + iTabIndex,
					viewName: viewName,
					viewNamespace: viewNamespace,
					matchers: [
						new AggregationFilled({
							name: "items"
						})
					],
					actions: function(oControl) {
						var aTableItems = oControl.getItems();
						var nValue = aTableItems[oItem.Line].getBindingContext().getProperty(oItem.Field);
						QUnit.equal(nValue, oItem.Value, "Checking field " + oItem.Field + " with value " + nValue);
					},
					errorMessage: "The Responsive Table is not rendered correctly"
				});
			},

		/**
			 * Check if the custom Data for Chart in the third tab is set correctly
			 */
			theCustomDataIsSetForChart: function() {
				var aCustomData;
				return this.waitFor({
					controlType: "sap.ui.comp.smartchart.SmartChart",
					check: function(aNodes) {
						if (aNodes[0].getId().indexOf("listReport-3") > 0) {
							return true;
						} else {
							return false;
						}
					},
					success: function(aNodes) {
						aCustomData = aNodes[0].getCustomData();
						for (var i in aCustomData) {
							if (aCustomData[i].getProperty("key") === "presentationVariantQualifier") {
								QUnit.strictEqual(aCustomData[i].getProperty("value"), "VAR3", "presentationVariantQualifier is set correctly");
							} else if (aCustomData[i].getProperty("key") === "chartQualifier") {
								QUnit.strictEqual(aCustomData[i].getProperty("value"), "Chart1", "chartQualifier is set correctly");
							} else if (aCustomData[i].getProperty("key") === "variantAnnotationPath") {
								QUnit.strictEqual(aCustomData[i].getProperty("value"), "com.sap.vocabularies.UI.v1.SelectionPresentationVariant#VAR3", "variantAnnotationPath is set correctly");
							} else if (aCustomData[i].getProperty("key") === "text") {
								QUnit.strictEqual(aCustomData[i].getProperty("value"), "Sales Order Items Chart", "text is set correctly");
							}
						}
					},
					errorMessage: "The SmartChart with could not be found "
				});
			},

			/**
			 * Check if message strip is visible
			 */
			theUnAppliedFilterMessageIsVisible: function() {
				return this.waitFor({
					controlType: "sap.m.MessageStrip",
					success: function(oControl) {
						QUnit.equal(oControl[0].getVisible(),true,"Message about unapplied filter is visible");
					},
					errorMessage: "Message about unapplied filter is not visible"
				});
			},

			/**
			 * Check if correct message about filters is displayed in message strip
			 */
			theMessageStripHasCorrectMessage: function(sMessage) {
				return this.waitFor({
					controlType: "sap.m.MessageStrip",
					success: function(oControl) {
						QUnit.equal(oControl[0].getText(),sMessage,"Correct Message about UnApplied Filter is displayed");
					},
					errorMessage: "incorrect Message about UnApplied Filter is displayed"
				});
			},

			theActiveButtonHasCorrectLabel: function(sLabel, tab) {
				return this.waitFor({
						id: prefix + "activeStateToggle-" + tab,
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function(oControl) {
							QUnit.equal(oControl.getText(),sLabel,"Correct State of Active Button is displayed");
						},
						errorMessage: "The Active Button is not rendered correctly"
					});
			}
		};
	};
});
