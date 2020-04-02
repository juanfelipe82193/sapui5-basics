sap.ui.define([
	"sap/ui/core/UIComponent", 'sap/ui/comp/navpopover/FakeFlpConnector', 'sap/ui/fl/FakeLrepConnectorLocalStorage', 'sap/ui/comp/navpopover/SemanticObjectController'
], function(UIComponent, FakeFlpConnector, FakeLrepConnectorLocalStorage, SemanticObjectController) {
	"use strict";

	return UIComponent.extend("test.sap.ui.comp.smartchart.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			SemanticObjectController.destroyDistinctSemanticObjects();
			FakeLrepConnectorLocalStorage.disableFakeConnector();
			FakeFlpConnector.disableFakeConnector();

			FakeFlpConnector.enableFakeConnector({
				'smartchart01_SemanticObjectCategory': {
					links: [
						{
							action: "displayFactSheet",
							intent: "?smartchart01_SemanticObjectCategory_01#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
							text: "FactSheet of Category"
						}, {
							action: "anyAction_02",
							intent: "?smartchart01_SemanticObjectCategory_02#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Category",
							tags: [
								"superiorAction"
							]
						}, {
							action: "anyAction_03",
							intent: "?smartchart01_SemanticObjectCategory_03#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Favorite Category"
						}
					]
				},
				'smartchart01_SemanticObjectName': {
					links: [
						{
							action: "displayFactSheet",
							intent: "?smartchart01_SemanticObjectName_01#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
							text: "FactSheet of Name"
						}, {
							action: "anyAction_02",
							intent: "?smartchart01_SemanticObjectName_02#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Name",
							tags: [
								"superiorAction"
							]
						}, {
							action: "anyAction_03",
							intent: "?smartchart01_SemanticObjectName_03#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Favorite Name"
						}
					]
				}
			});
			FakeLrepConnectorLocalStorage.enableFakeConnector();

			UIComponent.prototype.init.apply(this, arguments);
		}

	});
});
