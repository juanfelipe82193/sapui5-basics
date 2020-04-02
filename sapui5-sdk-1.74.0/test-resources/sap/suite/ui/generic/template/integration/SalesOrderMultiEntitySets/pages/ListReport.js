sap.ui.define(["sap/ui/test/Opa5",
				"sap/suite/ui/generic/template/integration/SalesOrderMultiEntitySets/pages/Common",
				"sap/suite/ui/generic/template/integration/SalesOrderMultiEntitySets/pages/actions/ListReportActions",
				"sap/suite/ui/generic/template/integration/SalesOrderMultiEntitySets/pages/assertions/ListReportAssertions"],

	function(Opa5, Common, ListReportActions, ListReportAssertions) {
		"use strict";

		var VIEWNAME = "ListReport";
		var VIEWNAMESPACE = "sap.suite.ui.generic.template.ListReport.view.";
		var PREFIX_ID = "SOMULTIENTITY::sap.suite.ui.generic.template.ListReport.view.ListReport::C_STTA_SalesOrder_WD_20--";

		var SALESORDER_ENTITY_TYPE = "STTA_SALES_ORDER_WD_20_SRV.C_STTA_SalesOrder_WD_20Type";
		var SALESORDER_ENTITY_SET = "C_STTA_SalesOrder_WD_20";

		console.log ( "OPA5::ListReport::CONSTANTS "
				+ " VIEWNAME: " + VIEWNAME
				+ " VIEWNAMESPACE: " + VIEWNAMESPACE
				+ " PREFIX_ID: " + PREFIX_ID
				+ " SALESORDER_ENTITY_TYPE: " + SALESORDER_ENTITY_TYPE
				+ " SALESORDER_ENTITY_SET: " + SALESORDER_ENTITY_SET
		);


		Opa5.createPageObjects({
			onTheListReportPage: {
				baseClass: Common,
				actions: ListReportActions(PREFIX_ID, VIEWNAME, VIEWNAMESPACE),
				assertions: ListReportAssertions(PREFIX_ID, VIEWNAME, VIEWNAMESPACE)
			}
		});
	}
);
