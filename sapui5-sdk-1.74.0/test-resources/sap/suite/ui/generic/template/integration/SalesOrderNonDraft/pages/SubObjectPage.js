sap.ui.define(["sap/ui/test/Opa5", "sap/suite/ui/generic/template/integration/SalesOrderNonDraft/pages/Common",
				"sap/suite/ui/generic/template/integration/SalesOrderNonDraft/pages/actions/SubObjectPageActions",
				"sap/suite/ui/generic/template/integration/SalesOrderNonDraft/pages/assertions/SubObjectPageAssertions"],

	function(Opa5, Common, SubObjectPageActions, SubObjectPageAssertions) {
		"use strict";

		var VIEWNAME = "Details";
		var VIEWNAMESPACE = "sap.suite.ui.generic.template.ObjectPage.view.";
		var PREFIX_ID = "STTA_SO_ND::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_SO_SalesOrderItem_ND--";

		var SALESORDER_ENTITY_TYPE = "STTA_SALES_ORDER_ND_SRV_01.STTA_C_SO_SalesOrderItem_NDType";
		var SALESORDER_ENTITY_SET = "STTA_C_SO_SalesOrderItem_ND";

		Opa5.createPageObjects({
			onTheSubObjectPage: {
				baseClass: Common,
				actions: SubObjectPageActions(PREFIX_ID, VIEWNAME, VIEWNAMESPACE),
				assertions: SubObjectPageAssertions(PREFIX_ID, VIEWNAME, VIEWNAMESPACE)
			}
		});
	}
);
