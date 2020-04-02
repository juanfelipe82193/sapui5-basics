sap.ui.define(["sap/ui/test/Opa5",
				"sap/suite/ui/generic/template/integration/testLibrary/ObjectPage/pages/actions/ObjectPageActions",
                "sap/suite/ui/generic/template/integration/testLibrary/ObjectPage/pages/assertions/ObjectPageAssertions",
                "sap/suite/ui/generic/template/integration/testLibrary/utils/ApplicationSettings",
                "sap/suite/ui/generic/template/integration/testLibrary/utils/Common"],

	function(Opa5, ObjectPageActions, ObjectPageAssertions, ApplicationSettings, Common) {
		"use strict";

		Opa5.extendConfig({
			arrangements: new Common(),
			viewNamespace: "sap.suite.ui.generic.template.integration.utils.Common",
			autoWait: true,
			appParams: {
				"sap-ui-animation": false
			}
		});

		var VIEWNAMEOP = "Details";
		var VIEWNAMESPACEOP = "sap.suite.ui.generic.template.ObjectPage.view.";

		Opa5.createPageObjects({
			onTheGenericObjectPage: {
				baseClass: Common,
				actions: ObjectPageActions(VIEWNAMEOP, VIEWNAMESPACEOP),
				assertions: ObjectPageAssertions(VIEWNAMEOP, VIEWNAMESPACEOP)
			}
		});
	}
);
