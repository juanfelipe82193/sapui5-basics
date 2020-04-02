/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/core/util/MockServer',
	'sap/ui/comp/navpopover/FakeFlpConnector',
	'sap/ui/fl/FakeLrepConnectorLocalStorage',
	'sap/ui/comp/navpopover/SemanticObjectController'
], function(UIComponent, ODataModel, MockServer, FakeFlpConnector, FakeLrepConnectorLocalStorage, SemanticObjectController) {
	"use strict";

	var Component = UIComponent.extend("sap.ui.comp.sample.smartlink.example_09.Component", {
		metadata: {
			rootView: {
				"viewName": "sap.ui.comp.sample.smartlink.example_09.Example",
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
				'demokit_smartlink_example_09_SemanticObjectNameAdditional': {
					links: [
						{
							action: "displayFactSheet",
							intent: "?demokit_smartlink_example_09_SemanticObjectNameAdditional_00#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
							text: "Additional: FactSheet of Name"
						}, {
							action: "anyAction",
							intent: "?demokit_smartlink_example_09_SemanticObjectNameAdditional_01#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Additional: Show Name",
							tags: [
								"superiorAction"
							]
						}
					]
				},
				'demokit_smartlink_example_09_SemanticObjectNameAdditional2': {
					links: [
						{
							action: "displayFactSheet",
							intent: "?demokit_smartlink_example_09_SemanticObjectNameAdditional2_00#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
							text: "Additional2: FactSheet of Name"
						}, {
							action: "anyAction",
							intent: "?demokit_smartlink_example_09_SemanticObjectNameAdditional2_01#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Additional2: Show Name",
							tags: [
								"superiorAction"
							]
						}
					]
				},
				'demokit_smartlink_example_09_SemanticObjectProductId': {
					links: [
						{
							action: "displayFactSheet",
							intent: "?demokit_smartlink_example_09_SemanticObjectProductId_00#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
							text: "FactSheet of ProductID"
						}, {
							action: "anyAction",
							intent: "?demokit_smartlink_example_09_SemanticObjectProductId_01#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show ProductId",
							tags: [
								"superiorAction"
							]
						}
					]
				}
			});
			FakeLrepConnectorLocalStorage.enableFakeConnector();

			this.oMockServer = new MockServer({
				rootUri: "demokit.smartlink.example_09/"
			});

			this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartlink/example_09/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smartlink/example_09/mockserver/");
			this.oMockServer.start();

			// create and set ODATA Model
			this.oModel = new ODataModel("demokit.smartlink.example_09", true);
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
