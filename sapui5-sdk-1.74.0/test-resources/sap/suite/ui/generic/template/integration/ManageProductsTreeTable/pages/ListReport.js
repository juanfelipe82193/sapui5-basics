sap.ui.define(["sap/ui/test/Opa5", "sap/suite/ui/generic/template/integration/Common/Common",
				"sap/suite/ui/generic/template/integration/ManageProductsTreeTable/pages/actions/ListReportActions",
				"sap/suite/ui/generic/template/integration/ManageProductsTreeTable/pages/assertions/ListReportAssertions"],

	function(Opa5, Common, ListReportActions, ListReportAssertions) {
		"use strict";

		var VIEWNAME = "ListReport";
		var VIEWNAMESPACE = "sap.suite.ui.generic.template.ListReport.view.";
		var PREFIX_ID = "STTAMPTT::sap.suite.ui.generic.template.ListReport.view.ListReport::STTA_C_MP_Product--";

		Opa5.createPageObjects({
			onTheListReportPage: {
				baseClass: Common,
				actions: ListReportActions(PREFIX_ID, VIEWNAME, VIEWNAMESPACE),
				assertions: ListReportAssertions(PREFIX_ID, VIEWNAME, VIEWNAMESPACE)
			}
		});
	}
);
