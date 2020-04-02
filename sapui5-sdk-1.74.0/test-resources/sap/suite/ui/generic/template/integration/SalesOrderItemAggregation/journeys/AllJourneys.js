sap.ui.define(["sap/ui/test/Opa5",
                "sap/suite/ui/generic/template/integration/SalesOrderItemAggregation/pages/Common",
                "sap/suite/ui/generic/template/integration/SalesOrderItemAggregation/pages/ListReport",
                "sap/suite/ui/generic/template/integration/SalesOrderItemAggregation/pages/ObjectPage",
                "sap/ui/test/opaQunit", //Don't move this item up or down, this will break everything!
                "sap/suite/ui/generic/template/integration/testLibrary/ListReport/pages/ListReport",
                "sap/suite/ui/generic/template/integration/testLibrary/ObjectPage/pages/ObjectPage",
                "sap/suite/ui/generic/template/integration/SalesOrderItemAggregation/journeys/ListReport/ItemAggregation"
                ],
	function (Opa5, Common, ListReport, ObjectPage) {
		"use strict";

		Opa5.extendConfig({
			arrangements: new Common(),
			autoWait: true,
			appParams: {
				"sap-ui-animation": false
			},
			timeout: 30,
			testLibs: {
				fioriElementsTestLibrary: {
					Common: {
						appId: 'SOITMAGGR',
						entitySet: 'STTA_C_SO_ItemAggr'
					}
				}
			}
		});

		var aPromises = [];
		aPromises.push(ListReport.CreatePageObjectPromise);
		aPromises.push(ObjectPage.CreatePageObjectPromise);
		Promise.all(aPromises).then(function(){
			QUnit.start();
		});
	}
);
