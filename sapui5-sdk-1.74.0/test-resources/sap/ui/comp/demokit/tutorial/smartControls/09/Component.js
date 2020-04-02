sap.ui.define([
	'sap/ui/core/UIComponent'
], function(UIComponent) {
	"use strict";

	var Component = UIComponent.extend("sap.ui.comp.tutorial.smartControls.09.Component", {

		metadata: {
			config: {
				sample: {
					iframe: "webapp/index.html",
					files: [
						"webapp/localService/metadata.xml",
						"webapp/localService/mockdata/Products.json",
						"webapp/localService/mockserver.js",
						"webapp/shellMock/UShellCrossApplicationNavigationMock.js",
						"webapp/lrep/component-test-changes.json",
						"webapp/Component.js",
						"webapp/index.html",
						"webapp/initMockServer.js",
						"webapp/manifest.json",
						"webapp/img/HT-1052.jpg",
						"webapp/SmartChart.controller.js",
						"webapp/SmartChart.view.xml"
					],
					stretch: true
				}
			}
		}
	});

	return Component;

});
