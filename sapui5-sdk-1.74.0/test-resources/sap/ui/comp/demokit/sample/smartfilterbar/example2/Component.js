sap.ui.define([
	'sap/ui/core/UIComponent', 'sap/ui/fl/FakeLrepConnectorLocalStorage'
], function(UIComponent, FakeLrepConnectorLocalStorage) {
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smartfilterbar.example2.Component", {

		_oMockServer: null,

		metadata: {
			rootView: {
				"viewName": "sap.ui.comp.sample.smartfilterbar.example2.SmartFilterBar",
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
						"SmartFilterBar.view.xml", "SmartFilterBar.controller.js", "../mockserver/LineItemsSet.json", "../mockserver/metadata.xml", "../mockserver/VL_SH_H_T001.json"
					]
				}
			}
		},
		init: function() {
			FakeLrepConnectorLocalStorage.enableFakeConnector();
			UIComponent.prototype.init.apply(this, arguments);
		},
		destroy: function() {
			FakeLrepConnectorLocalStorage.disableFakeConnector();
			UIComponent.prototype.destroy.apply(this, arguments);
		}
	});
});
