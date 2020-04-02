sap.ui.define(["sap/ui/test/Opa5",
		"sap/suite/ui/generic/template/integration/AnalyticalListPage/pages/Common",
		"sap/ui/test/opaQunit", //Don't move this item up or down, this will break everything!
		"sap/suite/ui/generic/template/integration/AnalyticalListPage/pages/Main",
		"sap/suite/ui/generic/template/integration/AnalyticalListPage/pages/TableExtension",
		"sap/suite/ui/generic/template/integration/AnalyticalListPage/pages/ChartExtension",
		"sap/suite/ui/generic/template/integration/AnalyticalListPage/pages/VisualFilterDialog",
		"sap/suite/ui/generic/template/integration/AnalyticalListPage/pages/FilterBarExtension",
		"sap/suite/ui/generic/template/integration/testLibrary/AnalyticalListPage/pages/AnalyticalListPage",
		"sap/suite/ui/generic/template/integration/AnalyticalListPage/MainJourney",
		"sap/suite/ui/generic/template/integration/AnalyticalListPage/SmartTableJourney",
		"sap/suite/ui/generic/template/integration/AnalyticalListPage/SmartChartJourney"
	],
	function (Opa5, Common) {
		"use strict";

		Opa5.extendConfig({
			arrangements: new Common(),
			autoWait: true,
			appParams: {
				"sap-ui-animation": false
			},
			testLibs: {
				fioriElementsTestLibrary: {
					Common: {
						appId: 'analytics2',
						entitySet: 'ZCOSTCENTERCOSTSQUERY0020'
					}
				}
			}
		});

		QUnit.start();
	}
);
