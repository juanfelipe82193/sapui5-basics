sap.ui.define(["sap/ui/model/resource/ResourceModel"],
	function (ResourceModel) {
		"use strict";
		return {
			"template": {
				"AnalyticalListPage": new ResourceModel({
					bundleUrl: "resources/sap/suite/ui/generic/template/AnalyticalListPage/i18n/i18n.properties"
				}),
			},
			"demokit": {
				"sample.analytical.list.page.ext": {
					"i18n": new ResourceModel({
						bundleUrl: "test-resources/sap/suite/ui/generic/template/demokit/sample.analytical.list.page.ext/webapp/i18n/i18n.properties"
					})
				},
				"sample.analytical.list.page": {
					"i18n": new ResourceModel({
						bundleUrl: "test-resources/sap/suite/ui/generic/template/demokit/sample.analytical.list.page/webapp/i18n/i18n.properties"
					})
				},
				"sample.analytical.list.page.settings": {
					"i18n": new ResourceModel({
						bundleUrl: "test-resources/sap/suite/ui/generic/template/demokit/sample.analytical.list.page.settings/webapp/i18n/i18n.properties"
					})
				},
				"sample.analytical.list.page.with.params": {
					"i18n": new ResourceModel({
						bundleUrl: "test-resources/sap/suite/ui/generic/template/demokit/sample.analytical.list.page.with.params/webapp/i18n/i18n.properties"
					})
				},
				"sample.analytical.list.page.treetable": {
					"i18n": new ResourceModel({
						bundleUrl: "test-resources/sap/suite/ui/generic/template/demokit/sample.analytical.list.page.treetable/webapp/i18n/AnalyticalListPage/STTA_C_MP_Product/i18n.properties"
					})
				}
			}
		};
	}
);