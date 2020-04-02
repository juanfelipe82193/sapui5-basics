sap.ui.require(
	["sap/ui/model/json/JSONModel"],
	function(JSONModel) {
		"use strict";
		// "sap/ui/generic/app/navigation/service/Error",
		// Error,
		var xmlFragment;
		var sFragmentId = "myFragment";
		
		var loadModel = function(){
			//load model

			var oModel = new JSONModel();
			oModel.loadData("./model/UseCases.json");
		    sap.ui.getCore().setModel(oModel, "model");
		};
		
		module("Basic Tests",{
			beforeEach: function(){
				loadModel();
				xmlFragment = sap.ui.xmlfragment("sap.suite.ui.generic.template.fragments.ProgressIndicator");
				xmlFragment.placeAt("content");
			},
			afterEach: function(){
				xmlFragment.destroy();
			}
		});
	
		test("Test Progress Indicator Fragment", function() {
			ok(xmlFragment, "Fragment is instantiated");

			var oLayoutContent = xmlFragment.getContent();
			ok(xmlFragment instanceof sap.ui.layout.VerticalLayout, "The fragment is a VerticalLayout");
			ok(oLayoutContent, "The layout has content");
			
			var expectedElementCount = 2;
			equals(oLayoutContent.length, expectedElementCount , "The layout has elements as expected:" + expectedElementCount);
			
			var oElement = oLayoutContent[0];
			ok(oElement instanceof sap.m.Label, "The first element of the layout is a Label");
			oElement = oLayoutContent[1];
			ok(oElement instanceof sap.m.ProgressIndicator, "The second element of the layout is a ProgressIndicator");
			
		});
		
});
