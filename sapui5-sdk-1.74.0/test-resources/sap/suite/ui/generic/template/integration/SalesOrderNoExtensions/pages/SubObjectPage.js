sap.ui.define(["sap/ui/test/Opa5",
		"sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/pages/Common",
		"sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/pages/actions/SubObjectPageActions",
		"sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/pages/assertions/SubObjectPageAssertions",
		"sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/utils/OpaModel"],

	function(Opa5, Common, SubObjectPageActions, SubObjectPageAssertions, OpaModel) {
		"use strict";

		var VIEWNAME = "Details";
		var VIEWNAMESPACE = "sap.suite.ui.generic.template.ObjectPage.view.";
		var PREFIX_ID = "SOwoExt::sap.suite.ui.generic.template.ObjectPage.view.Details::C_STTA_SalesOrderItem_WD_20--";

		var SALESORDERITEM_ENTITY_TYPE = "STTA_SALES_ORDER_WD_20_SRV.C_STTA_SalesOrderItem_WD_20Type";
		var SALESORDERITEM_ENTITY_SET = "C_STTA_SalesOrderItem_WD_20";

		console.log ( "OPA5::ObjectPage::CONSTANTS "
			+ " VIEWNAME: " + VIEWNAME
			+ " VIEWNAMESPACE: " + VIEWNAMESPACE
			+ " OP2_PREFIX_ID: " + PREFIX_ID
			+ " SALESORDERITEM_ENTITY_TYPE: " + SALESORDERITEM_ENTITY_TYPE
			+ " SALESORDERITEM_ENTITY_SET: " + SALESORDERITEM_ENTITY_SET
		);

		var oPromise = new Promise(function(resolve){
			OpaModel.metaModel.loaded().then(function(){
				var oSALESORDERITEM_ENTITY_TYPE = OpaModel.getEntityType(SALESORDERITEM_ENTITY_TYPE);
				var oSALESORDERITEM_ENTITY_SET = OpaModel.getEntitySet(SALESORDERITEM_ENTITY_SET);
				Opa5.createPageObjects({
					onTheSubObjectPage: {
						baseClass: Common,
						actions: SubObjectPageActions(PREFIX_ID, VIEWNAME, VIEWNAMESPACE),
						assertions: SubObjectPageAssertions(PREFIX_ID, VIEWNAME, VIEWNAMESPACE, oSALESORDERITEM_ENTITY_TYPE, oSALESORDERITEM_ENTITY_SET)
					}
				});
				resolve();
			});
		});

		return {
			CreatePageObjectPromise: oPromise
		};
	}
);
