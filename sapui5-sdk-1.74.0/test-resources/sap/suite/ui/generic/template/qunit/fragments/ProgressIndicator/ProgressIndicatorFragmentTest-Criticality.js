sap.ui.require(
	[],
	function() {
		"use strict";
		// "sap/ui/generic/app/navigation/service/Error",
		// Error,
		//var xmlWrapperView;
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
		sap.ui.getCore().getModel();

		module("Criticality Tests");

		test("Criticality is enum member", function() {
			var done = assert.async();
			var sTestCaseId = "criticality-is-enum-member";
			sFragmentId = "ProgressIndicator-" + sTestCaseId;
			sAnnotationsPath = "annotations-" + sTestCaseId + ".xml";
			oViewSettings.id = "myWrapperView-" + sTestCaseId;
			oViewSettings.path = "/Projects('001')";

			var oPromise = loadModel(sAnnotationsPath);

			oPromise.then(function(){
				createView(oViewSettings);
				var xmlWrapperView = sap.ui.getCore().byId(oViewSettings.id);
				oModel = sap.ui.getCore().getModel();

				xmlFragment = xmlWrapperView.getContent()[0];
				ok(xmlFragment, "Fragment is instantiated");

				var oItems = xmlFragment.getItems();
				var sExpectedCriticality = sap.ui.core.ValueState.Error;
				var i = 2;
				var oElement = oItems[i];
				ok(oElement instanceof sap.m.ProgressIndicator,  "Element " + i + " is a ProgressIndicator");

				var sExpectedPropertyBindingPath;
				equals(oElement.getBindingPath("state"), sExpectedPropertyBindingPath, "Property Criticality is not bound to the property in the model: '" + sExpectedPropertyBindingPath + "'");

				equals(oElement.getProperty("state"), sExpectedCriticality, "Property Criticality is set with the default value: '" + sExpectedCriticality + "'")

				xmlWrapperView.destroy();

				done();
			});
		});

		test("Criticality is path and type is enum member", function() {
			var done = assert.async();
			var sTestCaseId = "criticality-is-path-and-type-is-enum-member";
			sFragmentId = "ProgressIndicator-" + sTestCaseId;
			sAnnotationsPath = "annotations.xml";
			oViewSettings.id = "myWrapperView-" + sTestCaseId;
			oViewSettings.path = "/Projects('001')";

			var oPromise = loadModel(sAnnotationsPath);

			oPromise.then(function(){
				createView(oViewSettings);
				var xmlWrapperView = sap.ui.getCore().byId(oViewSettings.id);
				oModel = sap.ui.getCore().getModel();

				xmlFragment = xmlWrapperView.getContent()[0];
				ok(xmlFragment, "Fragment is instantiated");

				var oItems = xmlFragment.getItems();
				var sExpectedCriticality = sap.ui.core.ValueState.Error;
				var i = 2;
				var oElement = oItems[i];
				ok(oElement instanceof sap.m.ProgressIndicator,  "Element " + i + " is a ProgressIndicator");

				var sExpectedPropertyBindingPath = "State";
				equals(oElement.getBindingPath("state"), sExpectedPropertyBindingPath, "Property Criticality is not bound to the property in the model: '" + sExpectedPropertyBindingPath + "'");

				//equals(oElement.getProperty("state"), sExpectedCriticality, "Property Criticality is set with the right value: '" + sExpectedCriticality + "'")

				xmlWrapperView.destroy();

				done();
			});
		});

		test("Criticality is path and type is enum index value", function() {
			var done = assert.async();
			var sTestCaseId = "criticality-is-path-and-type-is-enum-index-value";
			sFragmentId = "ProgressIndicator-" + sTestCaseId;
			sAnnotationsPath = "annotations.xml";
			oViewSettings.id = "myWrapperView-" + sTestCaseId;
			oViewSettings.path = "/Projects('002')";

			var oPromise = loadModel(sAnnotationsPath);

			oPromise.then(function(){
				createView(oViewSettings);
				var xmlWrapperView = sap.ui.getCore().byId(oViewSettings.id);
				oModel = sap.ui.getCore().getModel();

				xmlFragment = xmlWrapperView.getContent()[0];
				ok(xmlFragment, "Fragment is instantiated");

				var oItems = xmlFragment.getItems();
				var sExpectedCriticality = sap.ui.core.ValueState.Success;
				var i = 2;
				var oElement = oItems[i];
				ok(oElement instanceof sap.m.ProgressIndicator,  "Element " + i + " is a ProgressIndicator");

				var sExpectedPropertyBindingPath = "State";
				equals(oElement.getBindingPath("state"), sExpectedPropertyBindingPath, "Property Criticality is not bound to the property in the model: '" + sExpectedPropertyBindingPath + "'");

				//equals(oElement.getProperty("state"), sExpectedCriticality, "Property Criticality is set with the right value: '" + sExpectedCriticality + "'")

				xmlWrapperView.destroy();

				done();
			});
		});

		module("Criticality - Negative Tests");

		test("Criticality is a string", function() {
			var done = assert.async();
			var sTestCaseId = "criticality-is-string-and-type-is-string"
			sFragmentId = "ProgressIndicator-" + sTestCaseId;
			sAnnotationsPath = "annotations-" + sTestCaseId + ".xml";
			oViewSettings.id = "myWrapperView-" + sTestCaseId;
			oViewSettings.path = "/Projects('001')";

			var oPromise = loadModel(sAnnotationsPath);

			oPromise.then(function(){
				createView(oViewSettings);
				var xmlWrapperView = sap.ui.getCore().byId(oViewSettings.id);
				oModel = sap.ui.getCore().getModel();

				xmlFragment = xmlWrapperView.getContent()[0];
				ok(xmlFragment, "Fragment is instantiated");

				var oItems = xmlFragment.getItems();
				var sExpectedCriticality = sap.ui.core.ValueState.None;
				var i = 2;
				var oElement = oItems[i];
				ok(oElement instanceof sap.m.ProgressIndicator,  "Element " + i + " is a ProgressIndicator");

				var sExpectedPropertyBindingPath;
				equals(oElement.getBindingPath("state"), sExpectedPropertyBindingPath, "Property Criticality is not bound to the property in the model: '" + sExpectedPropertyBindingPath + "'");

				equals(oElement.getProperty("state"), sExpectedCriticality, "Property Criticality is set with the default value: '" + sExpectedCriticality + "'")

				xmlWrapperView.destroy();

				done();
			});
		});

		test("Criticality is an enum index value", function() {
			var done = assert.async();
			var sTestCaseId = "criticality-is-enum-index-value"
			sFragmentId = "ProgressIndicator-" + sTestCaseId;
			sAnnotationsPath = "annotations-" + sTestCaseId + ".xml";
			oViewSettings.id = "myWrapperView-" + sTestCaseId;
			oViewSettings.path = "/Projects('001')";

			var oPromise = loadModel(sAnnotationsPath);

			oPromise.then(function(){
				createView(oViewSettings);
				var xmlWrapperView = sap.ui.getCore().byId(oViewSettings.id);
				oModel = sap.ui.getCore().getModel();

				xmlFragment = xmlWrapperView.getContent()[0];
				ok(xmlFragment, "Fragment is instantiated");

				var oItems = xmlFragment.getItems();
				var sExpectedCriticality = sap.ui.core.ValueState.None;
				var i = 2;
				var oElement = oItems[i];
				ok(oElement instanceof sap.m.ProgressIndicator,  "Element " + i + " is a ProgressIndicator");

				var sExpectedPropertyBindingPath;
				equals(oElement.getBindingPath("state"), sExpectedPropertyBindingPath, "Property Criticality is not bound to the property in the model: '" + sExpectedPropertyBindingPath + "'");

				equals(oElement.getProperty("state"), sExpectedCriticality, "Property Criticality is set with the default value: '" + sExpectedCriticality + "'")

				xmlWrapperView.destroy();

				done();
			});
		});

		test("Criticality is a path and type is neither enum member nor enum index value", function() {
			var done = assert.async();
			var sTestCaseId = "criticality-is-path-and-type-is-string"
			sFragmentId = "ProgressIndicator-" + sTestCaseId;
			sAnnotationsPath = "annotations.xml";
			oViewSettings.id = "myWrapperView-" + sTestCaseId;
			oViewSettings.path = "/Projects('003')";

			var oPromise = loadModel(sAnnotationsPath);

			oPromise.then(function(){
				createView(oViewSettings);
				var xmlWrapperView = sap.ui.getCore().byId(oViewSettings.id);
				oModel = sap.ui.getCore().getModel();

				xmlFragment = xmlWrapperView.getContent()[0];
				ok(xmlFragment, "Fragment is instantiated");

				var oItems = xmlFragment.getItems();
				var sExpectedCriticality = sap.ui.core.ValueState.None;
				var i = 2;
				var oElement = oItems[i];
				ok(oElement instanceof sap.m.ProgressIndicator,  "Element " + i + " is a ProgressIndicator");

				var sExpectedPropertyBindingPath = "State";
				equals(oElement.getBindingPath("state"), sExpectedPropertyBindingPath, "Property Criticality is bound to the property in the model: '" + sExpectedPropertyBindingPath + "'");

				equals(oElement.getState(), sExpectedCriticality, "Property Criticality is set with the right value: '" + sExpectedCriticality + "'");

				xmlWrapperView.destroy();

				done();
			});

		});

});
