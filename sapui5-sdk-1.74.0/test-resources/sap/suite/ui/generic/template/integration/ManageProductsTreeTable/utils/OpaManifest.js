sap.ui.define(["sap/ui/model/json/JSONModel"],
	function (JSONModel) {
		"use strict";

		var oManifestModel = new JSONModel();
		oManifestModel.loadData("test-resources/sap/suite/ui/generic/template/demokit/sample.stta.prod.man.treetable.products/webapp/manifest.json", null, false); // for OPA tests it should be ok use synchronous loading

		return {
			"template": {},
			"demokit": {
				"sample.stta.prod.man.treetable": oManifestModel
			}
		}
	}
);