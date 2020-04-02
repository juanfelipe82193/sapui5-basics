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
						bundleUrl: "test-resources/sap/suite/ui/generic/template/demokit/sample.stta.manage.products/webapp/i18n/i18n.properties"
					}),
					ListReport: new ResourceModel({
						bundleUrl: "test-resources/sap/suite/ui/generic/template/demokit/sample.stta.manage.products/webapp/i18n/ListReport/STTA_C_MP_Product/i18n.properties"
					}),
					ObjectPage: {
						STTA_C_MP_Product: new ResourceModel({
							bundleUrl: "test-resources/sap/suite/ui/generic/template/demokit/sample.stta.manage.products/webapp/i18n/ObjectPage/STTA_C_MP_Product/i18n.properties"
						}),
						STTA_C_MP_ProductText: new ResourceModel({
							bundleUrl: "test-resources/sap/suite/ui/generic/template/demokit/sample.stta.manage.products/webapp/i18n/ObjectPage/STTA_C_MP_ProductText/i18n.properties"
						})
					}
				}
			}
		};
	}
);