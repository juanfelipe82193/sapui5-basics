sap.ui.define(["sap/ui/test/Opa5", 
	"sap/suite/ui/generic/template/integration/SalesOrderItemAggregation/pages/Common",
	"sap/suite/ui/generic/template/integration/SalesOrderItemAggregation/pages/actions/ObjectPageActions",
	"sap/suite/ui/generic/template/integration/SalesOrderItemAggregation/pages/assertions/ObjectPageAssertions",
	"sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaModel"],

	function(Opa5, Common, ObjectPageActions, ObjectPageAssertions, OpaModel) {
		"use strict";

		var VIEWNAME = "Details";
		var VIEWNAMESPACE = "sap.suite.ui.generic.template.ObjectPage.view.";
		var PREFIX_ID = "SOITMAGGR::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_SO_ItemAggr--";
		
		var SALESORDER_ENTITY_TYPE = "STTA_SALES_ORDER_ITEM_AGGR_SRV.STTA_C_SO_ItemAggrType";
		var SALESORDER_ENTITY_SET = "STTA_C_SO_ItemAggr";
		
		console.log ( "OPA5::ObjectPage::CONSTANTS " 
				+ " VIEWNAME: " + VIEWNAME
				+ " VIEWNAMESPACE: " + VIEWNAMESPACE
				+ " OP_PREFIX_ID: " + PREFIX_ID
				+ " SALESORDER_ENTITY_TYPE: " + SALESORDER_ENTITY_TYPE
				+ " SALESORDER_ENTITY_SET: " + SALESORDER_ENTITY_SET
		);
		
		var oPromise = new Promise(function(resolve){
			OpaModel.metaModel.loaded().then(function(){
				var oEntityType = OpaModel.getEntityType(SALESORDER_ENTITY_TYPE);
				var oEntitySet = OpaModel.getEntitySet(SALESORDER_ENTITY_SET);

				Opa5.createPageObjects({
					onTheObjectPage: {
						baseClass: Common,
						actions: ObjectPageActions(PREFIX_ID, VIEWNAME, VIEWNAMESPACE),
						assertions: ObjectPageAssertions(PREFIX_ID, VIEWNAME, VIEWNAMESPACE, oEntityType, oEntitySet)
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
