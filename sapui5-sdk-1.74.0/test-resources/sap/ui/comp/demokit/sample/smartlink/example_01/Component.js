/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/core/util/MockServer',
	'sap/ui/comp/navpopover/FakeFlpConnector',
	'sap/ui/fl/FakeLrepConnectorLocalStorage',
	'sap/ui/comp/navpopover/SemanticObjectController'

], function(
	UIComponent,
	MockServer,
	FakeFlpConnector,
	FakeLrepConnectorLocalStorage,
	SemanticObjectController
) {
	"use strict";

	var Component = UIComponent.extend("sap.ui.comp.sample.smartlink.example_01.Component", {
		metadata: {
			rootView: {
				"viewName": "sap.ui.comp.sample.smartlink.example_01.Example",
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
						"Example.view.xml", "Example.controller.js", "mockserver/metadata.xml", "mockserver/ProductCollection.json", "formatter.js"
					]
				}
			}
		},

		init: function() {
			SemanticObjectController.destroyDistinctSemanticObjects();
			FakeLrepConnectorLocalStorage.disableFakeConnector();
			FakeFlpConnector.disableFakeConnector();

			FakeFlpConnector.enableFakeConnector({
				'demokit_smartlink_example_01_SemanticObjectName': {
					links: [
						{
							action: "displayFactSheet",
							intent: "?demokit_smartlink_example_01_SemanticObjectName#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
							text: "FactSheet of Name"
						}, {
							action: "anyAction",
							intent: "?demokit_smartlink_example_01_SemanticObjectName_01#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Specific Details of Name 'A'",
							tags: [
								"superiorAction"
							]
						}, {
							action: "anyAction",
							intent: "?demokit_smartlink_example_01_SemanticObjectName_02#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Specific Details of Name 'B'"
						}, {
							action: "anyAction",
							intent: "?demokit_smartlink_example_01_SemanticObjectName_03#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Specific Details of Name 'C'"
						}, {
							action: "anyAction",
							intent: "?demokit_smartlink_example_01_SemanticObjectName_04#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Specific Details of Name 'D'"
						}, {
							action: "anyAction",
							intent: "?demokit_smartlink_example_01_SemanticObjectName_05#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Specific Details of Name 'E'"
						}, {
							action: "anyAction",
							intent: "?demokit_smartlink_example_01_SemanticObjectName_06#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Specific Details of Name 'F'"
						}, {
							action: "anyAction",
							intent: "?demokit_smartlink_example_01_SemanticObjectName_07#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Specific Details of Name 'G'"
						}, {
							action: "anyAction",
							intent: "?demokit_smartlink_example_01_SemanticObjectName_08#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Specific Details of Name 'H'"
						}, {
							action: "anyAction",
							intent: "?demokit_smartlink_example_01_SemanticObjectName_09#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Specific Details of Name 'I'"
						}, {
							action: "anyAction",
							intent: "?demokit_smartlink_example_01_SemanticObjectName_10#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Specific Details of Name 'J'"
						}, {
							action: "anyAction",
							intent: "?demokit_smartlink_example_01_SemanticObjectName_11#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Specific Details of Name 'K'"
						}
					]
				},
				'demokit_smartlink_example_01_SemanticObjectPrice': {
					links: [
						{
							action: "displayFactSheet",
							intent: "?demokit_smartlink_example_01_SemanticObjectPrice01#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
							text: "FactSheet of Price"
						}, {
							action: "anyAction",
							intent: "?demokit_smartlink_example_01_SemanticObjectPrice02#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Price",
							tags: [
								"superiorAction"
							]
						}
					]
				}
			});
			FakeLrepConnectorLocalStorage.enableFakeConnector();

			this.oMockServer = new MockServer({
				rootUri: "demokit.smartlink.example_01/"
			});

			this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartlink/example_01/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smartlink/example_01/mockserver/");
			this.oMockServer.start();

			// create and set ODATA Model
			this.oModel = new sap.ui.model.odata.ODataModel("demokit.smartlink.example_01", true);
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
