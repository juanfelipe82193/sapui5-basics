sap.ui.define([
	'sap/ui/core/UIComponent', 'sap/ui/fl/FakeLrepConnectorLocalStorage'
], function(UIComponent, FakeLrepConnectorLocalStorage) {
	"use strict";

	return UIComponent.extend("sap.ui.demo.smartControls.Component", {
		metadata: {
			manifest: "json"
		},
		init: function() {
			FakeLrepConnectorLocalStorage.enableFakeConnector(jQuery.sap.getModulePath("sap.ui.demo.smartControls.lrep.component-test-changes") + ".json");
			UIComponent.prototype.init.apply(this, arguments);
		},
		destroy: function() {
			FakeLrepConnectorLocalStorage.disableFakeConnector();
			UIComponent.prototype.destroy.apply(this, arguments);
		}
	});

});
