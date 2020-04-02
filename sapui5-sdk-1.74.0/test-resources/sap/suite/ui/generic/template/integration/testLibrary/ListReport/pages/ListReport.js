sap.ui.define(["sap/ui/test/Opa5",
                "sap/suite/ui/generic/template/integration/testLibrary/ListReport/pages/actions/ListReportActions",
                "sap/suite/ui/generic/template/integration/testLibrary/ListReport/pages/assertions/ListReportAssertions",
                "sap/suite/ui/generic/template/integration/testLibrary/utils/ApplicationSettings",
                "sap/suite/ui/generic/template/integration/testLibrary/utils/Common"],

	function(Opa5, ListReportActions, ListReportAssertions, ApplicationSettings, Common) {
		"use strict";

		Opa5.extendConfig({
			arrangements: new Common(),
			viewNamespace: "sap.suite.ui.generic.template.integration.utils.Common",
			autoWait: true,
			appParams: {
				"sap-ui-animation": false
			}
		});

		var VIEWNAMELR = "ListReport";
		var VIEWNAMESPACELR = "sap.suite.ui.generic.template.ListReport.view.";

		Opa5.createPageObjects({
			onTheGenericListReport: {
				baseClass: Common,
				actions: ListReportActions(VIEWNAMELR, VIEWNAMESPACELR),
				assertions: ListReportAssertions(VIEWNAMELR, VIEWNAMESPACELR)
			}
		});
	}
);
