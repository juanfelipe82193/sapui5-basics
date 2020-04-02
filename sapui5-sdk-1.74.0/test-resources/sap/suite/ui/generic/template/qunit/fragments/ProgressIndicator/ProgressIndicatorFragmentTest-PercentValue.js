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

		module("Percent Value Tests");

		test("UoM is a string and is '%'", function() {
			var done = assert.async();
			var sTestCaseId = "uom-is-string-and-is-percent";
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
				var iExpectedPercentValue = 20;
				var i = 2;
				var oElement = oItems[i];
				ok(oElement instanceof sap.m.ProgressIndicator,  "Element " + i + " is a ProgressIndicator");

				var sExpectedPropertyBindingPath = "Progress";
				equals(oElement.getBindingPath("percentValue"), sExpectedPropertyBindingPath, "Property percent value is bound correctly to the property in the model: '" + sExpectedPropertyBindingPath + "'");

				xmlWrapperView.destroy();

				done();
			});
		});

		test("UoM is a string and is not '%'", function() {
			var done = assert.async();
			var sTestCaseId = "uom-is-string-and-is-not-percent";
			sFragmentId = "ProgressIndicator-" + sTestCaseId;
			sAnnotationsPath = "annotations-" + sTestCaseId + ".xml";
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
				var iExpectedPercentValue = 20;
				var i = 2;
				var oElement = oItems[i];
				ok(oElement instanceof sap.m.ProgressIndicator,  "Element " + i + " is a ProgressIndicator");

				var sExpectedPropertyBindingPath = "Progress";
				equals(oElement.getBindingPath("percentValue"), sExpectedPropertyBindingPath, "Property percent value is bound correctly to the property in the model: '" + sExpectedPropertyBindingPath + "'");

				xmlWrapperView.destroy();

				done();
			});
		});

		test("UoM is a path and is '%'", function() {
			var done = assert.async();
			var sTestCaseId = "uom-is-path-and-is-percent";
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
				var iExpectedPercentValue = 20;
				var i = 2;
				var oElement = oItems[i];
				ok(oElement instanceof sap.m.ProgressIndicator,  "Element " + i + " is a ProgressIndicator");

				var sExpectedPropertyBindingPath = "UoM";
				equals(oElement.getBindingPath("percentValue"), sExpectedPropertyBindingPath, "Property percent value is bound correctly to the property in the model: '" + sExpectedPropertyBindingPath + "'");

				xmlWrapperView.destroy();

				done();
			});
		});

		test("UoM is a path and is not '%'", function() {
			var done = assert.async();
			var sTestCaseId = "uom-is-path-and-is-not-percent";
			sFragmentId = "ProgressIndicator-" + sTestCaseId;
			sAnnotationsPath = "annotations-" + sTestCaseId + ".xml";
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
				var iExpectedPercentValue = 20;
				var i = 2;
				var oElement = oItems[i];
				ok(oElement instanceof sap.m.ProgressIndicator,  "Element " + i + " is a ProgressIndicator");

				var sExpectedPropertyBindingPath = "UoM";
				equals(oElement.getBindingPath("percentValue"), sExpectedPropertyBindingPath, "Property percent value is bound correctly to the property in the model: '" + sExpectedPropertyBindingPath + "'");

				xmlWrapperView.destroy();

				done();
			});
		});

		test("UoM is not provided", function() {
			var done = assert.async();
			var sTestCaseId = "uom-is-not-provided";
			sFragmentId = "ProgressIndicator-" + sTestCaseId;
			sAnnotationsPath = "annotations-" + sTestCaseId + ".xml";
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
				var iExpectedPercentValue = 20;
				var i = 2;
				var oElement = oItems[i];
				ok(oElement instanceof sap.m.ProgressIndicator,  "Element " + i + " is a ProgressIndicator");

				var sExpectedPropertyBindingPath = "Progress";
				equals(oElement.getBindingPath("percentValue"), sExpectedPropertyBindingPath, "Property percent value is bound correctly to the property in the model: '" + sExpectedPropertyBindingPath + "'");

				xmlWrapperView.destroy();

				done();
			});
		});

		test("Target is Decimal", function(){
			var done = assert.async();
			var sTestCaseId = "uom-is-path-and-is-not-percent-and-target-is-decimal";
			sFragmentId = "ProgressIndicator-" + sTestCaseId;
			sAnnotationsPath = "annotations-" + sTestCaseId + ".xml";
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
				var iExpectedPercentValue = 20;
				var i = 2;
				var oElement = oItems[i];
				ok(oElement instanceof sap.m.ProgressIndicator,  "Element " + i + " is a ProgressIndicator");

				var sExpectedPropertyBindingPath = "UoM";
				equals(oElement.getBindingPath("percentValue"), sExpectedPropertyBindingPath, "Property percent value is bound correctly to the property in the model: '" + sExpectedPropertyBindingPath + "'");

				xmlWrapperView.destroy();

				done();
			});
		});

		module("Percent Value Negative Tests");

		test("Value is not provided", function(){
			var done = assert.async();
			var sTestCaseId = "value-is-not-provided";
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
				var iExpectedPercentValue = 20;
				var i = 2;
				var oElement = oItems[i];
				ok(oElement instanceof sap.m.ProgressIndicator,  "Element " + i + " is a ProgressIndicator");

				var sExpectedPropertyBindingPath;
				equals(oElement.getBindingPath("percentValue"), sExpectedPropertyBindingPath, "Property percent value is bound correctly to the property in the model: '" + sExpectedPropertyBindingPath + "'");

				xmlWrapperView.destroy();

				done();
			});
		});

		test("Value is path and is undefined", function(){
			var done = assert.async();
			var sTestCaseId = "value-is-path-and-is-undefined";
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
				var iExpectedPercentValue = 20;
				var i = 2;
				var oElement = oItems[i];
				ok(oElement instanceof sap.m.ProgressIndicator,  "Element " + i + " is a ProgressIndicator");

				var sExpectedPropertyBindingPath = "Undefined";
				equals(oElement.getBindingPath("percentValue"), sExpectedPropertyBindingPath, "Property percent value is bound correctly to the property in the model: '" + sExpectedPropertyBindingPath + "'");

				xmlWrapperView.destroy();

				done();
			});
		});

		/*
		 * This should be caught by the service validator
		test("Negative Test: UoM is neither String nor Path", function() {
			var done = assert.async();
			var sTestCaseId = "uom-is-neither-string-nor-path";
			sFragmentId = "ProgressIndicator-" + sTestCaseId;
			sAnnotationsPath = "annotations-" + sTestCaseId + ".xml";
			oViewSettings.id = "myWrapperView-" + sTestCaseId;
			oViewSettings.path = "/Projects('002')";

			var oPromise = loadModel(sAnnotationsPath);

			oPromise.done(function(){
				createView(oViewSettings);
				var xmlWrapperView = sap.ui.getCore().byId(oViewSettings.id);
				oModel = sap.ui.getCore().getModel();

				xmlFragment = xmlWrapperView.getContent()[0];
				ok(xmlFragment, "Fragment is instantiated");

				var oItems = xmlFragment.getItems();
				var iExpectedPercentValue = 20;
				var i = 2;
				var oElement = oItems[i];
				ok(oElement instanceof sap.m.ProgressIndicator,  "Element " + i + " is a ProgressIndicator");

				var sExpectedPropertyBindingPath;
				equals(oElement.getBindingPath("percentValue"), sExpectedPropertyBindingPath, "Property percent value is bound correctly to the property in the model: '" + sExpectedPropertyBindingPath + "'");

				xmlWrapperView.destroy();

				done();
			});
		});
		*/
});
