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

	var Component = UIComponent.extend("sap.ui.comp.sample.smartlink.example_08.Component", {
		metadata: {
			manifest: "json",
			rootView: {
				"viewName": "sap.ui.comp.sample.smartlink.example_08.Example",
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
						"Example.view.xml",
						"Example.controller.js",
						"manifest.json",
						"mockserver/metadata.xml",
						"mockserver/ProductCollection.json",
						"mockserver/SupplierCollection.json"
					]
				}
			}
		},

		init: function() {
			SemanticObjectController.destroyDistinctSemanticObjects();
			FakeLrepConnectorLocalStorage.disableFakeConnector();
			FakeFlpConnector.disableFakeConnector();

			FakeFlpConnector.enableFakeConnector({
				'demokit_smartlink_example_08_SemanticObjectName': {
					links: [
						{
							action: "displayFactSheet",
							intent: "?demokit_smartlink_example_08_SemanticObjectName#/sample/sap.ui.comp.sample.smartlink.factSheetPage/preview",
							text: "FactSheet of Product",
							subTitle: "sub title of factsheet",
							shortTitle: "additionla info"
						}, {
							action: "action_01",
							intent: "?demokit_smartlink_example_08_SemanticObjectName_01#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Generate Project Settlement Rules",
							tags: [
								"superiorAction"
							],
							subTitle: "Most important rules",
							shortTitle: "only settlement known"
						}, {
							action: "action_02",
							intent: "?demokit_smartlink_example_08_SemanticObjectName_02#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Project Actual Cost Line Items",
							subTitle: "It is not about 'LineItem' annotation"
						}, {
							action: "action_03",
							intent: "?demokit_smartlink_example_08_SemanticObjectName_03#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Project Builder"
						}, {
							action: "action_04",
							intent: "?demokit_smartlink_example_08_SemanticObjectName_04#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Project Builder - Change Project"
						}, {
							action: "action_05",
							intent: "?demokit_smartlink_example_08_SemanticObjectName_05#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Project Builder - Display Project"
						}, {
							action: "action_06",
							intent: "?demokit_smartlink_example_08_SemanticObjectName_06#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Project Definition Overview"
						}, {
							action: "action_07",
							intent: "?demokit_smartlink_example_08_SemanticObjectName_07#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Project 'Solid Lobster'"
						}, {
							action: "action_08",
							intent: "?demokit_smartlink_example_08_SemanticObjectName_08#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Project 'Deserted Tire'"
						}, {
							action: "action_09",
							intent: "?demokit_smartlink_example_08_SemanticObjectName_09#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Project 'Timely Crayon'"
						}, {
							action: "action_10",
							intent: "?demokit_smartlink_example_08_SemanticObjectName_10#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Project 'Lost Street'"
						}, {
							action: "action_11",
							intent: "?demokit_smartlink_example_08_SemanticObjectName_11#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Project 'Confidential Yellow Crystal'"
						}, {
							action: "action_12",
							intent: "?demokit_smartlink_example_08_SemanticObjectName_12#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Project 'Teal Harsh Firecracker'"
						}, {
							action: "action_13",
							intent: "?demokit_smartlink_example_08_SemanticObjectName_13#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Project 'Pink Tombstone'"
						}, {
							action: "action_14",
							intent: "?demokit_smartlink_example_08_SemanticObjectName_14#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Project 'Lone Venus'"
						}, {
							action: "action_15",
							intent: "?demokit_smartlink_example_08_SemanticObjectName_15#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Project 'Rusty Trendy'"
						}, {
							action: "action_16",
							intent: "?demokit_smartlink_example_08_SemanticObjectName_16#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Project 'Reborn Hammer'"
						}, {
							action: "action_17",
							intent: "?demokit_smartlink_example_08_SemanticObjectName_17#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Project 'Silver Artificial'"
						}, {
							action: "action_18",
							intent: "?demokit_smartlink_example_08_SemanticObjectName_18#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Project 'Cold Butter'"
						}, {
							action: "action_19",
							intent: "?demokit_smartlink_example_08_SemanticObjectName_19#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Project 'Electron Remote'"
						}, {
							action: "action_20",
							intent: "?demokit_smartlink_example_08_SemanticObjectName_20#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show Project 'Worthy Doorstop'"
						}
					]
				},
				'demokit_smartlink_example_08_SemanticObjectSupplierId': {
					links: [
						{
							action: "action_01",
							intent: "?demokit_smartlink_example_08_SemanticObjectSupplierId_01#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show SupplierId",
							tags: [
								"superiorAction"
							]
						}, {
							action: "action_02",
							intent: "?demokit_smartlink_example_08_SemanticObjectSupplierId_02#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show favorite SupplierId"
						}, {
							action: "action_03",
							intent: "?demokit_smartlink_example_08_SemanticObjectSupplierId_03#/sample/sap.ui.comp.sample.smartlink.productPage/preview",
							text: "Show extra SupplierId"
						}
					]
				}
			});
			FakeLrepConnectorLocalStorage.enableFakeConnector();

			this.oMockServer = new MockServer({
				rootUri: "demokit.smartlink.example_08/"
			});

			this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartlink/example_08/mockserver/metadata.xml", "test-resources/sap/ui/comp/demokit/sample/smartlink/example_08/mockserver/");
			this.oMockServer.start();

			// create and set ODATA Model
			this.oModel = new ODataModel("demokit.smartlink.example_08", true);
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
