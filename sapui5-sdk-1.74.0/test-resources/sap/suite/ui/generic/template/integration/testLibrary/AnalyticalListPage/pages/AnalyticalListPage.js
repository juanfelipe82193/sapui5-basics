sap.ui.define(["sap/ui/test/Opa5",
                "sap/suite/ui/generic/template/integration/testLibrary/AnalyticalListPage/pages/actions/AnalyticalListPageActions",
                "sap/suite/ui/generic/template/integration/testLibrary/AnalyticalListPage/pages/assertions/AnalyticalListPageAssertions",
                "sap/suite/ui/generic/template/integration/testLibrary/utils/ApplicationSettings",
                "sap/suite/ui/generic/template/integration/testLibrary/utils/Common"],

	function(Opa5, AnalyticalListPageActions, AnalyticalListPageAssertions, ApplicationSettings, Common) {
		"use strict";

		Opa5.extendConfig({
			arrangements: new Common(),
			viewNamespace: "sap.suite.ui.generic.template.integration.utils.Common",
			autoWait: true,
			appParams: {
				"sap-ui-animation": false
			}
		});

		var VIEWNAMEALP = "AnalyticalListPage";
		var VIEWNAMESPACEALP = "sap.suite.ui.generic.template.AnalyticalListPage.view.";

		Opa5.createPageObjects({
			onTheGenericAnalyticalListPage: {
				baseClass: Common,
				actions: AnalyticalListPageActions(VIEWNAMEALP, VIEWNAMESPACEALP),
				assertions: AnalyticalListPageAssertions(VIEWNAMEALP, VIEWNAMESPACEALP)
			}
		});
	}
);
