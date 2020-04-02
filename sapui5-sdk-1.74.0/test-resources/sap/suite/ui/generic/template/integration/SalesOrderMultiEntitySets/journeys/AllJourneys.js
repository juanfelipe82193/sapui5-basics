sap.ui.define(["sap/ui/test/Opa5",
                "sap/suite/ui/generic/template/integration/SalesOrderMultiEntitySets/pages/Common",
				"sap/ui/test/opaQunit", //Don't move this item up or down, this will break everything!
				"sap/suite/ui/generic/template/integration/SalesOrderMultiEntitySets/journeys/ListReport/MultiEntitySets",
				"sap/suite/ui/generic/template/integration/SalesOrderMultiEntitySets/journeys/ListReport/MultiEntitySetsFCL",
				"sap/suite/ui/generic/template/integration/SalesOrderMultiEntitySets/journeys/ObjectPage/ObjectPageAndSubObjectPageNavigation"
                ],
	function (Opa5, Common) {
		"use strict";

		Opa5.extendConfig({
			arrangements: new Common(),
			autoWait: true,
			timeout: 30,
			appParams: {
				"sap-ui-animation": false
			},
			testLibs: {
				fioriElementsTestLibrary: {
					Common: {
						appId: 'SOMULTIENTITY',
						entitySet: 'C_STTA_SalesOrder_WD_20'
					}
				}
			}
		});

		QUnit.start();
	}
);
