sap.ui.define([
		"sap/ui/test/Opa5",
		"sap/suite/ui/generic/template/integration/SalesOrderSegButtons/pages/Common",
		"sap/ui/test/opaQunit", //Don't move this item up or down, this will break everything!
		"sap/suite/ui/generic/template/integration/SalesOrderSegButtons/pages/ListReport",
		"sap/suite/ui/generic/template/integration/SalesOrderSegButtons/pages/ObjectPage",
		"sap/suite/ui/generic/template/integration/testLibrary/ListReport/pages/ListReport",
		"sap/suite/ui/generic/template/integration/testLibrary/ObjectPage/pages/ObjectPage",
		"sap/suite/ui/generic/template/integration/SalesOrderSegButtons/journeys/ListReport/SegmentedButton",
		"sap/suite/ui/generic/template/integration/SalesOrderSegButtons/journeys/ObjectPage/FlexibleColumnLayoutNavigation",
		"sap/suite/ui/generic/template/integration/SalesOrderSegButtons/journeys/ObjectPage/FlexibleColumnLayoutMidColumnFullScreenNavigation",
		"sap/suite/ui/generic/template/integration/SalesOrderSegButtons/journeys/ObjectPage/FlexibleColumnLayoutObjectPageOnly",
		"sap/suite/ui/generic/template/integration/SalesOrderSegButtons/journeys/ObjectPage/ObjectPageWithSingleSection",
		"sap/suite/ui/generic/template/integration/SalesOrderSegButtons/journeys/ObjectPage/SegmentedButton",
		"sap/suite/ui/generic/template/integration/SalesOrderSegButtons/journeys/Canvas/CanvasExtenionAPI"
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
						appId: 'ManageSalesOrderWithSegButtons',
						entitySet: 'C_STTA_SalesOrder_WD_20'
					}
				}
			}
		});

		QUnit.start();
	}
);
