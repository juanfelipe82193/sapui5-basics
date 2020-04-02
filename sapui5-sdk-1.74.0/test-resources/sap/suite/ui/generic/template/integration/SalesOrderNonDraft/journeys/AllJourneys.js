sap.ui.define([
		"sap/ui/test/Opa5",
		"sap/suite/ui/generic/template/integration/SalesOrderNonDraft/pages/Common",
		"sap/suite/ui/generic/template/integration/SalesOrderNonDraft/pages/ListReport",
		"sap/suite/ui/generic/template/integration/SalesOrderNonDraft/pages/ObjectPage",
		"sap/suite/ui/generic/template/integration/SalesOrderNonDraft/pages/SubObjectPage",
		"sap/suite/ui/generic/template/integration/testLibrary/ListReport/pages/ListReport",
		"sap/suite/ui/generic/template/integration/testLibrary/ObjectPage/pages/ObjectPage",
		"sap/suite/ui/generic/template/integration/SalesOrderNonDraft/journeys/ListReport/ListReportAndObjectPageNavigation",
		"sap/suite/ui/generic/template/integration/SalesOrderNonDraft/journeys/ListReport/ListReportAndCreateObjectPageNavigation",
		"sap/suite/ui/generic/template/integration/SalesOrderNonDraft/journeys/ListReport/ListReportAndObjectPageDataLossNavigation",
		"sap/suite/ui/generic/template/integration/SalesOrderNonDraft/journeys/ObjectPage/CRUDJourney",
		"sap/suite/ui/generic/template/integration/SalesOrderNonDraft/journeys/SubObjectPage/SubObjectPageRendering",
		"sap/suite/ui/generic/template/integration/SalesOrderNonDraft/journeys/ObjectPage/ObjectPageRendering",
		"sap/suite/ui/generic/template/integration/SalesOrderNonDraft/journeys/ObjectPage/BeforeDeleteExtension",
		"sap/suite/ui/generic/template/integration/SalesOrderNonDraft/journeys/ObjectPage/ObjectPageSingleSectionSingleTable",
		"sap/suite/ui/generic/template/integration/SalesOrderNonDraft/journeys/ObjectPage/ObjectPageSingleSectionSingleResponsiveTable"
	],
	function (Opa5, Common) {
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
						appId: 'STTA_SO_ND',
						entitySet: 'STTA_C_SO_SalesOrder_ND'
					}
				}
			}
		});

		QUnit.start();
	}
);
