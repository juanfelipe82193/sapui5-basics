sap.ui.define(["sap/ui/test/Opa5", "sap/suite/ui/generic/template/integration/Common/Common",
				"sap/suite/ui/generic/template/integration/ManageProductsTreeTable/pages/actions/ObjectPageActions",
				"sap/suite/ui/generic/template/integration/ManageProductsTreeTable/pages/assertions/ObjectPageAssertions"],

	function(Opa5, Common, ObjectPageActions, ObjectPageAssertions) {
		"use strict";

		var VIEWNAME = "Details";
		var VIEWNAMESPACE = "sap.suite.ui.generic.template.ObjectPage.view.";
		var PREFIX_ID = "STTAMP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--";

		Opa5.createPageObjects({
			onTheObjectPage: {
				baseClass: Common,
				actions: ObjectPageActions(PREFIX_ID, VIEWNAME, VIEWNAMESPACE),
				assertions: ObjectPageAssertions(PREFIX_ID, VIEWNAME, VIEWNAMESPACE)
			}
		});
	}
);
