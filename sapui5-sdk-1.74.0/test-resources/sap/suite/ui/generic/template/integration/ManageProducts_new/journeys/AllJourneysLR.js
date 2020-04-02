sap.ui.define(["sap/ui/test/Opa5",
				"sap/suite/ui/generic/template/integration/ManageProducts_new/pages/Common",
				"sap/suite/ui/generic/template/integration/ManageProducts_new/pages/ListReport",
                "sap/suite/ui/generic/template/integration/ManageProducts_new/pages/ObjectPage",
                "sap/ui/test/opaQunit", //Don't move this item up or down, this will break everything!
				"sap/suite/ui/generic/template/integration/testLibrary/ListReport/pages/ListReport",
				"sap/suite/ui/generic/template/integration/testLibrary/ObjectPage/pages/ObjectPage",
				"sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/ListReport/ListReportRendering",
				"sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/ListReport/ListReportAndObjectPageNavigation",
				"sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/ListReport/ListReportFilter",
				"sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/ListReport/ListReportDelete",
				"sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/ListReport/ListReportActions"
        		],
	function (Opa5, Common, ListReport, ObjectPage) {
		"use strict";

		Opa5.extendConfig({
			arrangements: new Common(),
			viewNamespace: "sap.suite.ui.generic.template.demokit",
			autoWait: true,
			appParams: {
				"sap-ui-animation": false
			},
			timeout: 60,
			testLibs: {
				fioriElementsTestLibrary: {
					Common: {
						appId: 'STTA_MP',
						entitySet: 'STTA_C_MP_Product'
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
