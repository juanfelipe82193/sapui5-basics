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

	return UIComponent.extend("applicationUnderTestContactAnnotation.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {
			SemanticObjectController.destroyDistinctSemanticObjects();
			FakeLrepConnectorLocalStorage.disableFakeConnector();
			FakeFlpConnector.disableFakeConnector();

			FakeFlpConnector.enableFakeConnector({
				'applicationUnderTestContactAnnotation_SemanticObject': {
					links: [
						{
							action: "action_01",
							intent: "?applicationUnderTestContactAnnotation_SemanticObject_01#link",
							text: "Alpha",
							tags: [
								"superiorAction"
							]
						}, {
							action: "action_02",
							intent: "?applicationUnderTestContactAnnotation_SemanticObject_02#link",
							text: "Beta",
							tags: [
								"superiorAction"
							]
						}
					]
				}
			});
			FakeLrepConnectorLocalStorage.enableFakeConnector();

			this.oMockServer = new MockServer({
				rootUri: "/mockserver/"
			});
			this.oMockServer.simulate("./mockserver/metadata.xml", "./mockserver/");
			this.oMockServer.start();

			// call the base component's init function and create the App view
			UIComponent.prototype.init.apply(this, arguments);
		},

		destroy: function() {
			this.oMockServer.stop();
			FakeLrepConnectorLocalStorage.disableFakeConnector();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		}
	});
});
