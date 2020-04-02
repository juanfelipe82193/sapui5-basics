sap.ui.define(["sap/ui/test/Opa5", 
				"sap/suite/ui/generic/template/integration/SalesOrderItemAggregation/pages/Common",
				"sap/suite/ui/generic/template/integration/SalesOrderItemAggregation/pages/actions/ListReportActions",
				"sap/suite/ui/generic/template/integration/SalesOrderItemAggregation/pages/assertions/ListReportAssertions",
				"sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaModel"],

	function(Opa5, Common, ListReportActions, ListReportAssertions, OpaModel) {
		"use strict";

		var VIEWNAME = "ListReport";
		var VIEWNAMESPACE = "sap.suite.ui.generic.template.ListReport.view.";
		var PREFIX_ID = "SOITMAGGR::sap.suite.ui.generic.template.ListReport.view.ListReport::STTA_C_SO_ItemAggr--";

		var SALESORDER_ENTITY_TYPE = "STTA_SALES_ORDER_ITEM_AGGR_SRV.STTA_C_SO_ItemAggrType";
		var SALESORDER_ENTITY_SET = "STTA_C_SO_ItemAggr";

		console.log ( "OPA5::ListReport::CONSTANTS " 
				+ " VIEWNAME: " + VIEWNAME
				+ " VIEWNAMESPACE: " + VIEWNAMESPACE
				+ " PREFIX_ID: " + PREFIX_ID
				+ " SALESORDER_ENTITY_TYPE: " + SALESORDER_ENTITY_TYPE
				+ " SALESORDER_ENTITY_SET: " + SALESORDER_ENTITY_SET
		);
		
		var oPromise = new Promise(function(resolve){
			OpaModel.metaModel.loaded().then(function(){
				var oEntityType = OpaModel.getEntityType(SALESORDER_ENTITY_TYPE);
				var oEntitySet = OpaModel.getEntitySet(SALESORDER_ENTITY_SET);

				Opa5.createPageObjects({
					onTheListReportPage: {
						baseClass: Common,
						actions: ListReportActions(PREFIX_ID, VIEWNAME, VIEWNAMESPACE),
						assertions: ListReportAssertions(PREFIX_ID, VIEWNAME, VIEWNAMESPACE, oEntityType, oEntitySet)
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