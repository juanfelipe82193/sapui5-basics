sap.ui.define(["./SampleNameProvider", "sap/ui/core/mvc/Controller", "./mockserver/MockServerInitializer"], function(SampleNameProvider, Controller, MockServerInitializer) {
	return Controller.extend(SampleNameProvider.getQualifiedName() + ".Controller", {
		
		_oFeedComponent: null,
		
		/**
		 * This method is call as many times as subclasses are initialized. It's
		 * important to initialize static methods only once.
		 */
		onInit: function() {
			var oMockServerInitializer = new MockServerInitializer("test-resources/sap/collaboration/demokit/sample/" + SampleNameProvider.getName() + "/mockserver/");
			oMockServerInitializer.initializeMockServers(["jam", "smi"]);

			// Set group feed settings for Business Object mode
			var oSettings = {
					feedSources : {
						mode: sap.collaboration.FeedType.BusinessObjectGroups,
						data: {
							appContext: "UDBO",
							odataServicePath: "/sap/opu/odata/sap/ZMCN_TEST_SERVICE_1_SRV/",
							collection: "TestSet",
							key: "'BO-FOR-SMI-TESTING'",
							name: "BO-FOR-SMI-TESTING"
						}
					}
			};
				
			// Create group feed component
			this._oFeedComponent = sap.ui.getCore().createComponent({
				name:"sap.collaboration.components.feed",
				id:"feed_component_bo",
				settings: oSettings
			});

			oMockServerInitializer.initializeMockData(this._oFeedComponent);
			
			// Add group feed component to container
			this.getView()._FeedComponentContainer.setComponent(this._oFeedComponent);
			this.getView()._FeedComponentContainer.setHeight("800px");
		}
	});
}, /* bExport= */ true);