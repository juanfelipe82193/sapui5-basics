sap.ui.define(["sap/ui/model/json/JSONModel"],
	function (JSONModel) {
		"use strict";
		return {
			"template": {},
			"demokit": {
				"sample.analytical.list.page.ext": new JSONModel("test-resources/sap/suite/ui/generic/template/demokit/sample.analytical.list.page.ext/webapp/manifest.json"),
				"sample.analytical.list.page": new JSONModel("test-resources/sap/suite/ui/generic/template/demokit/sample.analytical.list.page/webapp/manifest.json"),
				"sample.analytical.list.page.settings": new JSONModel("test-resources/sap/suite/ui/generic/template/demokit/sample.analytical.list.page.settings/webapp/manifest.json"),
				"sample.analytical.list.page.with.params": new JSONModel("test-resources/sap/suite/ui/generic/template/demokit/sample.analytical.list.page.with.params/webapp/manifest.json"),
				"sample.analytical.list.page.treetable": new JSONModel("test-resources/sap/suite/ui/generic/template/demokit/sample.analytical.list.page.treetable/webapp/manifest.json")
			}
		}
	}
);