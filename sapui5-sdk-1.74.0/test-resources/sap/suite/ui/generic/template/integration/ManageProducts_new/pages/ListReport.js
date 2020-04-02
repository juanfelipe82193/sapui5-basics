sap.ui.define(["sap/ui/test/Opa5", "sap/suite/ui/generic/template/integration/ManageProducts_new/pages/Common",
				"sap/suite/ui/generic/template/integration/ManageProducts_new/pages/actions/ListReportActions", "sap/suite/ui/generic/template/integration/ManageProducts_new/pages/assertions/ListReportAssertions",
                "sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaModel"],

	function(Opa5, Common, ListReportActions, ListReportAssertions,	OpaModel) {
		"use strict";

		var VIEWNAME = "ListReport";
		var VIEWNAMESPACE = "sap.suite.ui.generic.template.ListReport.view.";
		var PREFIX_ID = "STTA_MP::sap.suite.ui.generic.template.ListReport.view.ListReport::STTA_C_MP_Product--";
		var PRODUCT_ENTITY_TYPE = "STTA_PROD_MAN.STTA_C_MP_ProductType";
		var PRODUCT_ENTITY_SET = "STTA_C_MP_Product";

		var oPromise = new Promise(function(resolve){
			OpaModel.metaModel.loaded().then(function(){
				var oProductEntityType = OpaModel.getEntityType(PRODUCT_ENTITY_TYPE);
				var oProductEntitySet = OpaModel.getEntitySet(PRODUCT_ENTITY_SET);

				Opa5.createPageObjects({
					onTheListReportPage: {
						baseClass: Common,
						actions: ListReportActions(PREFIX_ID, VIEWNAME, VIEWNAMESPACE),
						assertions: ListReportAssertions(PREFIX_ID, VIEWNAME, VIEWNAMESPACE, oProductEntityType, oProductEntitySet)
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
