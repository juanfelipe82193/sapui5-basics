sap.ui.define(["sap/ui/model/resource/ResourceModel"],
	function (ResourceModel) {
		"use strict";
		
		return {
			template: {
				ListReport: new ResourceModel({
					bundleUrl: "../../../../../../../../sap/suite/ui/generic/template/ListReport/i18n/i18n.properties"
				}),
				ObjectPage: new ResourceModel({
					bundleUrl: "../../../../../../../../sap/suite/ui/generic/template/ObjectPage/i18n/i18n.properties"
				})
			},
			demokit: {
				stta_manage_products: {
					i18n: new ResourceModel({
						bundleUrl: "test-resources/sap/suite/ui/generic/template/demokit/sample.stta.sales.order.tabletabs/webapp/i18n/i18n.properties"
					}),
					ListReport: new ResourceModel({
						bundleUrl: "test-resources/sap/suite/ui/generic/template/demokit/sample.stta.sales.order.tabletabs/webapp/i18n/ListReport/C_STTA_SalesOrder_WD_20/i18n.properties"
					}),
					ObjectPage: {
						C_STTA_SalesOrder_WD_20: new ResourceModel({
							bundleUrl: "test-resources/sap/suite/ui/generic/template/demokit/sample.stta.sales.order.tabletabs/webapp/i18n/ObjectPage/C_STTA_SalesOrder_WD_20/i18n.properties"
						}),
						C_STTA_SalesOrderItem_WD_20: new ResourceModel({
							bundleUrl: "test-resources/sap/suite/ui/generic/template/demokit/sample.stta.sales.order.tabletabs/webapp/i18n/ObjectPage/C_STTA_SalesOrderItem_WD_20/i18n.properties"
						})
					}
				}
			}
		};
	}
);