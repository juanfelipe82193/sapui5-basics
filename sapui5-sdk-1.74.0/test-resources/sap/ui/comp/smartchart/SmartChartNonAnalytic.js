sap.ui.require([
	"sap/m/Shell",
	"sap/ui/core/ComponentContainer",
	"sap/ui/core/util/MockServer",
	'sap/ui/fl/FakeLrepConnectorLocalStorage'
], function (Shell, ComponentContainer, MockServer, FakeLrepConnectorLocalStorage) {
	"use strict";

	// Start Mockserver and Fake-LREP
	var oMockServer = new MockServer({
		rootUri: "/my/mock/data/"
	});
	oMockServer.simulate("mockserverNonAnalytic/metadata.xml", "mockserverNonAnalytic/");
	oMockServer.start();

	FakeLrepConnectorLocalStorage.enableFakeConnector();

	// initialize the UI component
	new Shell("myShell", {
		app: new ComponentContainer({
			height: "100%",
			component: sap.ui.component({
				name: "test.sap.ui.comp.smartchart",
				id: "myComponent"
			})
		})
	}).placeAt("content");
});