/*** Object Page Assertions ***/
sap.ui.define(
	["sap/ui/test/Opa5",
	 "sap/ui/test/matchers/PropertyStrictEquals",
	 "sap/ui/test/matchers/AggregationFilled"],

		function (Opa5, PropertyStrictEquals, AggregationFilled) {

		return function (prefix, viewName, viewNamespace) {

			return {
			/************************************************
				 NAVIGATION ASSERTIONS
				 *************************************************/
				// check if the Object Page context is correct by:
				// i. finding the Oject Page Layout by control type
				// ii. get the Entity Set of OP and validate it. 
				thePageContextShouldBeCorrect: function(selection) {
					return this.waitFor({
						controlType: "sap.uxap.ObjectPageLayout",
						viewName: viewName,
						viewNamespace: viewNamespace,
						autoWait: true,
						success: function(oControl) {
							var sControlPath = oControl[0].getBindingContext().getPath();
							var sOPEntitySet = sControlPath.substr(1,sControlPath.indexOf("(")-1);
							var sEntitySet1 = "I_AIVS_Confirm_Status";
							var sEntitySet2 = "C_STTA_SalesOrder_WD_20";
							var sEntitySet3 = "C_STTA_SO_BPAContact";
							switch (selection) {
								case 1:
									QUnit.strictEqual(sOPEntitySet, sEntitySet1, "The Object Page is correct");
									break;
								case 2:
									QUnit.strictEqual(sOPEntitySet, sEntitySet2, "The Object Page is correct");
									break;
								case 3:
									QUnit.strictEqual(sOPEntitySet, sEntitySet3, "The Object Page is correct");
									break;
								default:
							}
						},
						errorMessage: "The Object Page does not have the correct context"
					});
				},
				subObjectPageContextShouldBeCorrect: function() {
					return this.waitFor({
						controlType: "sap.m.Table",
						success: function(oTable) {
							var bFound = false;
							var sEntitySet= "C_STTA_SalesOrderItemSL_WD_20";
							var sSubObjectES = "";

							for (var i = 0; i < oTable.length; i++) {
								sSubObjectES = oTable[i].getParent().getEntitySet();
								if (sSubObjectES === sEntitySet) {
									bFound = true;
									Opa5.assert.ok(true, "The Sub Object Page is correct");
									break;
								}
							}
							
							if (!bFound) {
								Opa5.assert.notOk(true, "The Sub Object Page does not have the correct context");
							}
						},
						errorMessage: "The Sub Object Page does not have the correct context"
					});
				},				
			};
		};
	}
);
