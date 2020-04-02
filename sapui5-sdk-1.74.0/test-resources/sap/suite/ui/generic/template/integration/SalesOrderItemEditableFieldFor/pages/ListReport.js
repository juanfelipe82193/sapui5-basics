sap.ui.define(["sap/ui/test/Opa5", "sap/suite/ui/generic/template/integration/SalesOrderItemEditableFieldFor/pages/assertions/ListReportAssertions"], function(Opa5, ListReportAssertions) {
	"use strict";

	var VIEWNAME = "ListReport";
	var VIEWNAMESPACE = "sap.suite.ui.generic.template.ListReport.view.";
	var PREFIX_ID = "SalesOrderItemEditableFieldFor::sap.suite.ui.generic.template.ListReport.view.ListReport::C_STTA_SalesOrderItem_WD_20--";

	Opa5.createPageObjects({
		onTheListReportPage: {
			assertions: ListReportAssertions(PREFIX_ID, VIEWNAME, VIEWNAMESPACE)
		}
	});
});
