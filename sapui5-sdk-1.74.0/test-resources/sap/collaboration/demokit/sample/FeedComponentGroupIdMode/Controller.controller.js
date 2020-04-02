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

			// Set group feed settings for Group ID mode
			var oSettings = {
					feedSources : {
						mode: sap.collaboration.FeedType.GroupIds,
						data: [
						       "pOvkwKPy8PsOL7eZDqAdu8",
						       "5dU33eYANzCGYuz6nGRsSQ"
						       ]
					}
			};

			// Create group feed component
			this._oFeedComponent = sap.ui.getCore().createComponent({
				name:"sap.collaboration.components.feed",
				id:"feed_component",
				settings: oSettings
			});
			
			oMockServerInitializer.initializeMockData(this._oFeedComponent);

			// Add group feed component to container
			this.getView()._FeedComponentContainer.setComponent(this._oFeedComponent);
			this.getView()._FeedComponentContainer.setHeight("800px");
		}
	});
}, /* bExport= */ true);