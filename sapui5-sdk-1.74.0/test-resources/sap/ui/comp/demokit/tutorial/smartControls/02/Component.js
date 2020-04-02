sap.ui.define([
	'sap/ui/core/UIComponent'
],
function (UIComponent) {
	"use strict";

	var Component = UIComponent.extend("sap.ui.comp.tutorial.smartControls.02.Component", {

		metadata: {
			config: {
				sample: {
					iframe: "webapp/index.html",
					stretch: true,
					files: [
						"webapp/localService/metadata.xml",
						"webapp/localService/mockdata/Products.json",
						"webapp/localService/mockdata/Currency.json",
						"webapp/localService/mockserver.js",
						"webapp/lrep/component-test-changes.json",
						"webapp/Component.js",
						"webapp/index.html",
						"webapp/initMockServer.js",
						"webapp/manifest.json",
						"webapp/SmartFieldWithValueHelp.controller.js",
						"webapp/SmartFieldWithValueHelp.view.xml"
					]
				}
			}
		}
	});

	return Component;

});
