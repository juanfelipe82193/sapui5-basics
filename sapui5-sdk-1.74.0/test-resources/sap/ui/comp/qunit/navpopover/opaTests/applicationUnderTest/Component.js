sap.ui.define([
	'sap/ui/core/UIComponent',
	'sap/ui/comp/navpopover/FakeFlpConnector',
	'sap/ui/fl/FakeLrepConnectorLocalStorage',
	'sap/ui/core/util/MockServer',
	'sap/ui/comp/navpopover/SemanticObjectController'

], function(
	UIComponent,
	FakeFlpConnector,
	FakeLrepConnectorLocalStorage,
	MockServer,
	SemanticObjectController
) {
	"use strict";

	return UIComponent.extend("applicationUnderTest.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			SemanticObjectController.destroyDistinctSemanticObjects();
			FakeLrepConnectorLocalStorage.disableFakeConnector();
			FakeFlpConnector.disableFakeConnector();

			FakeFlpConnector.enableFakeConnector({
				'applicationUnderTest_SemanticObjectName': {
					links: [
						{
							action: "displayFactSheet",
							intent: "?applicationUnderTest_SemanticObjectName_01#link",
							text: "FactSheet of Name"
						}, {
							action: "action_02",
							intent: "?applicationUnderTest_SemanticObjectName_02#link",
							text: "Name Link2",
							tags: [
								"superiorAction"
							]
						}, {
							action: "action_03",
							intent: "?applicationUnderTest_SemanticObjectName_03#link",
							text: "Name Link3"
						}, {
							action: "action_04",
							intent: "?applicationUnderTest_SemanticObjectName_04#link",
							text: "Name Link4 (unavailable)",
							tags: [
								"superiorAction"
							]
						}
					]
				},
				'applicationUnderTest_SemanticObjectProductId': {
					links: [
						{
							action: "displayFactSheet",
							intent: "?applicationUnderTest_SemanticObjectProductId_01#link",
							text: "FactSheet of ProductId"
						}, {
							action: "action_02",
							intent: "?applicationUnderTest_SemanticObjectProductId_02#link",
							text: "ProductId Link2",
							tags: [
								"superiorAction"
							]
						}, {
							action: "action_03",
							intent: "?applicationUnderTest_SemanticObjectProductId_03#link",
							text: "ProductId Link3"
						}, {
							action: "action_04",
							intent: "?applicationUnderTest_SemanticObjectName_04#link",
							text: "Name Link4 (unavailable)"
						}
					]
				},
				'applicationUnderTest_SemanticObjectCategory': {
					links: [
						{
							action: "displayFactSheet",
							intent: "?applicationUnderTest_SemanticObjectCategory_01#link",
							text: "FactSheet of Category"
						}, {
							action: "action_02",
							intent: "?applicationUnderTest_SemanticObjectCategory_02#link",
							text: "Category Link2",
							tags: [
								"superiorAction"
							]
						}, {
							action: "action_03",
							intent: "?applicationUnderTest_SemanticObjectCategory_03#link",
							text: "Category Link3"
						}, {
							action: "action_04",
							intent: "?applicationUnderTest_SemanticObjectCategory_04#link",
							text: "Category Link4"
						}, {
							action: "action_05",
							intent: "?applicationUnderTest_SemanticObjectCategory_05#link",
							text: "Category Link5"
						}, {
							action: "action_06",
							intent: "?applicationUnderTest_SemanticObjectCategory_06#link",
							text: "Category Link6"
						}, {
							action: "action_07",
							intent: "?applicationUnderTest_SemanticObjectCategory_07#link",
							text: "Category Link7"
						}, {
							action: "action_08",
							intent: "?applicationUnderTest_SemanticObjectCategory_08#link",
							text: "Category Link8"
						}, {
							action: "action_09",
							intent: "?applicationUnderTest_SemanticObjectCategory_09#link",
							text: "Category Link9"
						}, {
							action: "action_10",
							intent: "?applicationUnderTest_SemanticObjectCategory_10#link",
							text: "Category Link10"
						}, {
							action: "action_11",
							intent: "?applicationUnderTest_SemanticObjectCategory_11#link",
							text: "Category Link11"
						}, {
							action: "action_13",
							intent: "?applicationUnderTest_SemanticObjectName_13#link",
							text: "Name Link13 (unavailable)"
						}, {
							action: "action_12",
							intent: "?applicationUnderTest_SemanticObjectCategory_12#link",
							text: "Category Link12"
						}, {
							action: "action_14",
							intent: "?applicationUnderTest_SemanticObjectName_14#link",
							text: "Name Link14 (unavailable)"
						}
					]
				}
			});
			FakeLrepConnectorLocalStorage.enableFakeConnector();

			this.oMockServer = new MockServer({
				rootUri: "/mockserver/"
			});
			this.oMockServer.simulate(
				"./mockserver/metadata.xml",
				"./mockserver/");
			this.oMockServer.start();

			// call the base component's init function and create the App view
			UIComponent.prototype.init.apply(this, arguments);
		},

		destroy: function() {
			this.oMockServer.stop();
			this.oMockServer.destroy();
			FakeLrepConnectorLocalStorage.disableFakeConnector();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		}
	});
});