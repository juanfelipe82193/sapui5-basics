sap.ui.define(["sap/suite/ui/generic/template/js/AnnotationHelper"],
	function (AnnotationHelper) {
		module("Test methods to check funtion determineTableMultiSelect", {

			setup: function () {
				this.oAnnotationHelper = AnnotationHelper;
			},

			teardown: function () {
				this.oAnnotationHelper = null;
			},

			oFacet: {
				Label: {
					String: "{@i18n>@ProductDescriptions}"
				},
				Target: {
					AnnotationPath: "to_ProductText/@com.sap.vocabularies.UI.v1.LineItem"
				},
				RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet"
			}
		});

		test("Method to test if Table is rendered with MultiSelect option", function () {
			var oAnnotationHelper = this.oAnnotationHelper;
			var oFacet = this.oFacet;
			var oSectionsTrue = {
				"to_ProductText::com.sap.vocabularies.UI.v1.LineItem": {
					multiSelect: true,
					createMode: "inline",
					entitySet: "STTA_C_MP_ProductSalesPrice",
					navigationProperty: "to_ProductSalesPrice"
				}
			};
			var oSectionsUndefined = {
				"to_ProductText::com.sap.vocabularies.UI.v1.LineItem": {
					createMode: "inline",
					entitySet: "STTA_C_MP_ProductSalesPrice",
					navigationProperty: "to_ProductSalesPrice"
				}
			};
			var oSectionsFalse = {
				"to_ProductText::com.sap.vocabularies.UI.v1.LineItem": {
					multiSelect: false,
					createMode: "inline",
					entitySet: "STTA_C_MP_ProductSalesPrice",
					navigationProperty: "to_ProductSalesPrice"
				}
			};

			var bExpectedExpression = false;
			var bExpression = oAnnotationHelper.getMultiSelectForTable(oFacet, oSectionsUndefined, undefined);
			equals(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);

			var bExpectedExpression = true;
			var bExpression = oAnnotationHelper.getMultiSelectForTable(oFacet, oSectionsTrue, undefined);
			equals(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);

			var bExpectedExpression = false;
			var bExpression = oAnnotationHelper.getMultiSelectForTable(oFacet, oSectionsFalse, undefined);
			equals(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);

			var bExpectedExpression = true;
			var bExpression = oAnnotationHelper.getMultiSelectForTable(oFacet, oSectionsUndefined, true);
			equals(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);

			var bExpectedExpression = true;
			var bExpression = oAnnotationHelper.getMultiSelectForTable(oFacet, oSectionsTrue, true);
			equals(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);

			var bExpectedExpression = false;
			var bExpression = oAnnotationHelper.getMultiSelectForTable(oFacet, oSectionsFalse, true);
			equals(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);

			var bExpectedExpression = false;
			var bExpression = oAnnotationHelper.getMultiSelectForTable(oFacet, oSectionsUndefined, false);
			equals(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);

			var bExpectedExpression = true;
			var bExpression = oAnnotationHelper.getMultiSelectForTable(oFacet, oSectionsTrue, false);
			equals(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);

			var bExpectedExpression = false;
			var bExpression = oAnnotationHelper.getMultiSelectForTable(oFacet, oSectionsFalse, false);
			equals(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);
		});
});


