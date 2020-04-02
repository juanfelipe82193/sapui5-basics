sap.ui.define(["sap/ui/test/Opa5", "sap/suite/ui/generic/template/integration/SalesOrderNonDraft/pages/Common",
				"sap/suite/ui/generic/template/integration/SalesOrderNonDraft/pages/actions/ObjectPageActions",
				"sap/suite/ui/generic/template/integration/SalesOrderNonDraft/pages/assertions/ObjectPageAssertions"],

	function(Opa5, Common, ObjectPageActions, ObjectPageAssertions) {
		"use strict";

		var VIEWNAME = "Details";
		var VIEWNAMESPACE = "sap.suite.ui.generic.template.ObjectPage.view.";
		var PREFIX_ID = "STTA_SO_ND::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_SO_SalesOrder_ND--";

		var SALESORDER_ENTITY_TYPE = "STTA_SALES_ORDER_ND_SRV_01.STTA_C_SO_SalesOrder_NDType";
		var SALESORDER_ENTITY_SET = "STTA_C_SO_SalesOrder_ND";

		Opa5.createPageObjects({
			onTheObjectPage: {
				baseClass: Common,
				actions: ObjectPageActions(PREFIX_ID, VIEWNAME, VIEWNAMESPACE),
				assertions: ObjectPageAssertions(PREFIX_ID, VIEWNAME, VIEWNAMESPACE)
			}
		});
	}
);
