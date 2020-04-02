sap.ui.define(["sap/ui/test/Opa5",
	"sap/suite/ui/generic/template/integration/SalesOrderMultiEntitySets/pages/Common",
	"sap/suite/ui/generic/template/integration/SalesOrderMultiEntitySets/pages/actions/ObjectPageActions",
	"sap/suite/ui/generic/template/integration/SalesOrderMultiEntitySets/pages/assertions/ObjectPageAssertions"],

	function(Opa5, Common, ObjectPageActions, ObjectPageAssertions) {
		"use strict";

		var VIEWNAME = "Details";
		var VIEWNAMESPACE = "sap.suite.ui.generic.template.ObjectPage.view.";
		var OP_PREFIX_ID = "SOMULTIENTITY::sap.suite.ui.generic.template.ObjectPage.view.Details::C_STTA_SalesOrder_WD_20--";

		var SALESORDER_ENTITY_TYPE = "STTA_SALES_ORDER_WD_20_SRV.C_STTA_SalesOrder_WD_20Type";
		var SALESORDER_ENTITY_SET = "C_STTA_SalesOrder_WD_20";

		console.log ( "OPA5::ObjectPage::CONSTANTS "
				+ " VIEWNAME: " + VIEWNAME
				+ " VIEWNAMESPACE: " + VIEWNAMESPACE
				+ " OP_PREFIX_ID: " + OP_PREFIX_ID
				+ " SALESORDER_ENTITY_TYPE: " + SALESORDER_ENTITY_TYPE
				+ " SALESORDER_ENTITY_SET: " + SALESORDER_ENTITY_SET
		);

		Opa5.createPageObjects({
			onTheObjectPage: {
				baseClass: Common,
				actions: ObjectPageActions(OP_PREFIX_ID, VIEWNAME, VIEWNAMESPACE),
				assertions: ObjectPageAssertions(OP_PREFIX_ID, VIEWNAME, VIEWNAMESPACE)
			}
		});
	}
);
