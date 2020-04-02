sap.ui.define(["sap/ui/test/Opa5",
                "sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/pages/Common",
                "sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/pages/ListReport",
                "sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/pages/ObjectPage",
                "sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/pages/SubObjectPage",
                "sap/ui/test/opaQunit", //Don't move this item up or down, this will break everything!
                "sap/suite/ui/generic/template/integration/testLibrary/ListReport/pages/ListReport",
                "sap/suite/ui/generic/template/integration/testLibrary/ObjectPage/pages/ObjectPage",
				"sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/journeys/ObjectPage/CRUDJourney",
				"sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/journeys/ObjectPage/CRUDJourney2"
				],
	function (Opa5, Common, ListReport, ObjectPage, SubObjectPage) {
		"use strict";

		Opa5.extendConfig({
			arrangements: new Common(),
			autoWait: true,
			//visible: false,
			timeout: 30,
			extensions: ["sap/ui/core/support/RuleEngineOpaExtension"],
			appParams: {
				"sap-ui-support": "true,silent",
				"sap-ui-animation": false
			},
			testLibs: {
				fioriElementsTestLibrary: {
					Common: {
						appId: 'SOwoExt',
						entitySet: 'C_STTA_SalesOrder_WD_20'
					}
				}
			}
		});

		var aPromises = [];
		aPromises.push(ListReport.CreatePageObjectPromise);
		aPromises.push(ObjectPage.CreatePageObjectPromise);
		aPromises.push(SubObjectPage.CreatePageObjectPromise);
		Promise.all(aPromises).then(function(){
			QUnit.start();
		});
	}
);
