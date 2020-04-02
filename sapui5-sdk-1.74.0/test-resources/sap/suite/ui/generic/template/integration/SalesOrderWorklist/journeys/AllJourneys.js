sap.ui.define([
		"sap/ui/test/Opa5",
		"sap/suite/ui/generic/template/integration/SalesOrderWorklist/pages/Common",
		"sap/ui/test/opaQunit", //Don't move this item up or down, this will break everything!
		"sap/suite/ui/generic/template/integration/SalesOrderWorklist/pages/ListReport",
		"sap/suite/ui/generic/template/integration/SalesOrderWorklist/pages/ObjectPage",
		"sap/suite/ui/generic/template/integration/testLibrary/ListReport/pages/ListReport",
		"sap/suite/ui/generic/template/integration/testLibrary/ObjectPage/pages/ObjectPage",
		"sap/suite/ui/generic/template/integration/SalesOrderWorklist/journeys/ListReport/Worklist"
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
						appId: 'sttasalesorderwklt',
						entitySet: 'C_STTA_SalesOrder_WD_20'
					}
				}
			}
		});

		QUnit.start();
	}
);
