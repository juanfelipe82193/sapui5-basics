sap.ui.define([
	"sap/ui/core/util/MockServer",
	"sap/ui/base/Object",
	"sap/base/Log"
], function(MockServer, Object, Log) {
	"use strict";
	var oMockServer;
	var sMockServerPath;

	return Object.extend("mockserver.MockServerRunner", {
		/**
		 * Initializes the mock server.
		 * You can configure the delay with the URL parameter "serverDelay".
		 * The local mock data in this folder is returned instead of the real data for testing.
		 * @public
		 */

		metadata: {
			publicMethods: ["init"]
		},

		init: function() {
			// create
			oMockServer = new MockServer({
				rootUri: "/"
			});

			sMockServerPath = sap.ui.require.toUrl("mockserver");

			oMockServer.simulate(sMockServerPath + "/metadata.xml", {
				sMockdataBaseUrl: sMockServerPath + "/mockdata"
			});

			oMockServer.start();

			Log.info("Mock Server Initialized");
		}

	});

});
