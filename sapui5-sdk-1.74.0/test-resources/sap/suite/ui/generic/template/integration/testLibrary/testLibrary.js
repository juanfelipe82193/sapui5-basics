sap.ui.define(["sap/ui/test/Opa5",
		"sap/suite/ui/generic/template/integration/testLibrary/ListReport/pages/actions/ListReportActions",
		"sap/suite/ui/generic/template/integration/testLibrary/ListReport/pages/assertions/ListReportAssertions",
		"sap/suite/ui/generic/template/integration/testLibrary/ObjectPage/pages/actions/ObjectPageActions",
		"sap/suite/ui/generic/template/integration/testLibrary/ObjectPage/pages/assertions/ObjectPageAssertions",
		"sap/suite/ui/generic/template/integration/testLibrary/ObjectPage/pages/actions/AnalyticalListPageActions",
		"sap/suite/ui/generic/template/integration/testLibrary/ObjectPage/pages/assertions/AnalyticalListPageAssertions",
		"sap/suite/ui/generic/template/integration/testLibrary/utils/ApplicationSettings"
	],

	function(Opa5, ListReportActions, ListReportAssertions, ObjectPageActions, ObjectPageAssertions, AnalyticalListPageActions, AnalyticalListPageAssertions, ApplicationSettings) {
		"use strict";

		var VIEWNAMELR = "ListReport";
		var VIEWNAMESPACELR = "sap.suite.ui.generic.template.ListReport.view.";
		var VIEWNAMEOP = "Details";
		var VIEWNAMESPACEOP = "sap.suite.ui.generic.template.ObjectPage.view.";
		var VIEWNAMEALP = "AnalyticalListPage";
		var VIEWNAMESPACEALP = "sap.suite.ui.generic.template.AnalyticalListPage.view.";

		Opa5.createPageObjects({
			onTheGenericListReport: {
				actions: ListReportActions(VIEWNAMELR, VIEWNAMESPACELR),
				assertions: ListReportAssertions(VIEWNAMELR, VIEWNAMESPACELR)
			},
			onTheGenericObjectPage: {
				actions: ObjectPageActions(VIEWNAMEOP, VIEWNAMESPACEOP),
				assertions: ObjectPageAssertions(VIEWNAMEOP, VIEWNAMESPACEOP)
			},
			onTheGenericAnalyticalListPage: {
				actions: AnalyticalListPageActions(VIEWNAMEALP, VIEWNAMESPACEALP),
				assertions: AnalyticalListPageAssertions(VIEWNAMEALP, VIEWNAMESPACEALP)
			}
		});
	}
);