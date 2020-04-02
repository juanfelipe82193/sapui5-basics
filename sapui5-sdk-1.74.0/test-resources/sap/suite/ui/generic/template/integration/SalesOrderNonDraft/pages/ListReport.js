sap.ui.define(["sap/ui/test/Opa5", "sap/suite/ui/generic/template/integration/SalesOrderNonDraft/pages/Common",
				"sap/suite/ui/generic/template/integration/SalesOrderNonDraft/pages/actions/ListReportActions",
				"sap/suite/ui/generic/template/integration/SalesOrderNonDraft/pages/assertions/ListReportAssertions"],

	function(Opa5, Common, ListReportActions, ListReportAssertions) {
		"use strict";

		var VIEWNAME = "ListReport";
		var VIEWNAMESPACE = "sap.suite.ui.generic.template.ListReport.view.";
		var PREFIX_ID = "STTA_SO_ND::sap.suite.ui.generic.template.ListReport.view.ListReport::STTA_C_SO_SalesOrder_ND--";

		var SALESORDER_ENTITY_TYPE = "STTA_SALES_ORDER_ND_SRV_01.STTA_C_SO_SalesOrder_NDType";
		var SALESORDER_ENTITY_SET = "STTA_C_SO_SalesOrder_ND";

		Opa5.createPageObjects({
			onTheListReportPage: {
				baseClass: Common,
				actions: ListReportActions(PREFIX_ID, VIEWNAME, VIEWNAMESPACE),
				assertions: ListReportAssertions(PREFIX_ID, VIEWNAME, VIEWNAMESPACE)
			}
		});
	}
);
