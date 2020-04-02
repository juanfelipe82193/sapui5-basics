sap.ui.require(
	[],
	function() {
		"use strict";
		// "sap/ui/generic/app/navigation/service/Error",
		// Error,
		var xmlFragment;
		var oViewSettings = {
			id: "myWrapperView",
			name: "tests.FragmentWrapper",
			path: "/Projects('001')"
		};
		var sAnnotationsPath = "annotations.xml";
		var oSettings = {
			annotationsPath: sAnnotationsPath,
			viewSettings: oViewSettings
		};

		var sFragmentId = "myProgressIndicator";
		var oModel;

		module("Aria Tests",{
			beforeEach: function(){
			},
			afterEach: function(){
				//xmlWrapperView.destroy();
			}
		});


		test("Aria", function(assert) {
			var done = assert.async();

			sAnnotationsPath = "annotations.xml";
			oViewSettings = {
				id: "myWrapperView",
				name: "tests.FragmentWrapper",
				path: "/Projects('001')"
			};

			var oPromise = loadModel(sAnnotationsPath);

			oPromise.then(function(){
				createView(oViewSettings);
				var xmlWrapperView = sap.ui.getCore().byId(oViewSettings.id);

				xmlFragment = xmlWrapperView.getContent()[0];
				ok(xmlFragment, "Fragment is instantiated");

				var oItems = xmlFragment.getItems();
				ok(xmlFragment instanceof sap.m.VBox, "The fragment is a VBox");
				ok(oItems, "The VBox has items");

				var expectedElementCount = 4;
				equals(oItems.length, expectedElementCount , "The layout has elements as expected:" + expectedElementCount);

				var i = 0;
				var oElement = oItems[i];
				ok(oElement instanceof sap.m.Title, "Element " + i + " is a Title");
				i++;

				var oElement = oItems[i];
				ok(oElement instanceof sap.m.Label, "Element " + i + " is a Label");
				i++

				oElement = oItems[i];
				ok(oElement instanceof sap.m.ProgressIndicator,  "Element " + i + " is a ProgressIndicator");
				i++

				var oElement = oItems[i];
				ok(oElement instanceof sap.m.Label, "Element " + i + " is a Label");

				xmlWrapperView.destroy();

				ok(false);

				done();
			});
		});


});
