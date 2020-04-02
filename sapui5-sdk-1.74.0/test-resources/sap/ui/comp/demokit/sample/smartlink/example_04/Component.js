/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
	'jquery.sap.global', 'sap/ui/core/UIComponent', 'sap/ui/model/odata/v2/ODataModel', 'sap/ui/core/util/MockServer', 'sap/ui/comp/navpopover/FakeFlpConnector', 'sap/ui/fl/FakeLrepConnectorLocalStorage', 'sap/ui/comp/navpopover/SemanticObjectController'
], function(jQuery, UIComponent, ODataModel, MockServer, FakeFlpConnector, FakeLrepConnectorLocalStorage, SemanticObjectController) {
	"use strict";

	var Component = UIComponent.extend("sap.ui.comp.sample.smartlink.example_04.Component", {
		metadata: {
			rootView: {
				"viewName": "sap.ui.comp.sample.smartlink.example_04.Example",
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
					files: [
						"Example.view.xml", "Example.controller.js", "mockserver/metadata.xml", "mockserver/ProductCollection.json"
					]
				}
			}
		},

		init: function() {
			SemanticObjectController.destroyDistinctSemanticObjects();
			FakeLrepConnectorLocalStorage.disableFakeConnector();
			FakeFlpConnector.disableFakeConnector();

			FakeFlpConnector.enableFakeConnector({
				'demokit_smartlink_example_04_SemanticObjectName': {
					links: [
						{
							action: "displayFactSheet",
							intent: "?demokit_smartlink_example_04_SemanticObjectName01#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
							text: "FactSheet"
						}, {
							action: "anyAction02",
							intent: "?demokit_smartlink_example_04_SemanticObjectName02#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
							text: "Change Material Costs",
							tags: [
								"superiorAction"
							]
						}, {
							action: "anyAction03",
							intent: "?demokit_smartlink_example_04_SemanticObjectName03#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Display Material Costs"
						}
					]
				}
			});
			FakeLrepConnectorLocalStorage.enableFakeConnector();

			this.oMockServer = new MockServer({
				rootUri: "demokit.smartlink.example_04/"
			});

			this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartlink/example_04/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smartlink/example_04/mockserver/");
			this.oMockServer.start();

			// create and set ODATA Model
			this.oModel = new sap.ui.model.odata.ODataModel("demokit.smartlink.example_04", true);
			this.setModel(this.oModel);

			UIComponent.prototype.init.apply(this, arguments);
		},

		exit: function() {
			FakeFlpConnector.disableFakeConnector();
			FakeLrepConnectorLocalStorage.disableFakeConnector();
			this.oMockServer.stop();
			this.oModel.destroy();
		}
	});

	return Component;
});
