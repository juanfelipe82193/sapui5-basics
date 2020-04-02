sap.ui.define([
	'sap/ui/core/UIComponent', 'sap/ui/fl/FakeLrepConnectorLocalStorage'
], function(UIComponent, FakeLrepConnectorLocalStorage) {
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartfilterbar_dialog.Component", {
		metadata: {
			rootView: {
				"viewName": "sap.ui.comp.sample.smartfilterbar_dialog.SmartFilterBar",
				"type": "XML",
				"async": true
			},
			dependencies: {
				libs: [
					"sap.m", "sap.ui.comp"
				]
			},
			config: {
				sample: {
					stretch: true,
					files: [
						"SmartFilterBar.view.xml", "SmartFilterBar.controller.js", "mockserver/VL_SH_H_CATEGORY.json", "mockserver/VL_FV_XFELD.json", "mockserver/ZEPM_C_SALESORDERITEMQUERYResults.json", "mockserver/ZEPM_C_SALESORDERITEMQUERY.json", "mockserver/metadata.xml"
					]
				}
			}
		},
		init: function() {
			FakeLrepConnectorLocalStorage.enableFakeConnector(jQuery.sap.getModulePath("sap.ui.comp.sample.smartfilterbar_dialog.mockserver.component-test-changes") + ".json");

			UIComponent.prototype.init.apply(this, arguments);
		},
		destroy: function() {
			FakeLrepConnectorLocalStorage.disableFakeConnector();
			UIComponent.prototype.destroy.apply(this, arguments);
		}
	});

});
