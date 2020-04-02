sap.ui.define([
		"sap/ui/test/Opa5",
		"sap/suite/ui/generic/template/integration/SalesOrderTableTabs/pages/Common",
		"sap/suite/ui/generic/template/integration/SalesOrderTableTabs/pages/ListReport",
		"sap/suite/ui/generic/template/integration/SalesOrderTableTabs/pages/ObjectPage",
		"sap/ui/test/opaQunit", //Don't move this item up or down, this will break everything!
		"sap/suite/ui/generic/template/integration/SalesOrderTableTabs/journeys/ListReport/IconTabFilter"
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
						appId: 'ManageSalesOrderWithTableTabs',
						entitySet: 'C_STTA_SalesOrder_WD_20'
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
