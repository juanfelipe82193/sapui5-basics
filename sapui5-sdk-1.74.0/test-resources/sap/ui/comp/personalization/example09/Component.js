sap.ui.define([
	'sap/ui/core/library',
	'sap/ui/core/UIComponent',
	'sap/ui/fl/FakeLrepConnectorLocalStorage',
	'sap/m/App'
], function(coreLibrary, UIComponent, FakeLrepConnectorLocalStorage, App) {
	"use strict";

	return UIComponent.extend("root.Component", {
		metadata: {
			manifest: "json"
		},
		createContent: function() {

			// Init LRep for VariantManagement (we have to fake the connection to LRep in order to be independent from backend)
			FakeLrepConnectorLocalStorage.enableFakeConnector();

			return new App({
				pages: sap.ui.view({
					id: "IDViewExample09",
					viewName: "root.Example",
					type: coreLibrary.mvc.ViewType.XML
				})
			});
		}
	});
});
