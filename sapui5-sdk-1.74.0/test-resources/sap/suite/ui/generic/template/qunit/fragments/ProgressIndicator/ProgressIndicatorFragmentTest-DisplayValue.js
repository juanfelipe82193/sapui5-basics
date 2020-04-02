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

		module("Display Value Tests");

		test("UoM is a string and is '%'", function() {
			var done = assert.async();
			var sTestCaseId = "uom-is-string-and-is-percent"
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

				//get resource bundle
				//get key for %
				var sExpectedDisplayValuePattern = new RegExp("^.*%$","g");
				var sExpectedDisplayValue = "20%";

				//ok(oElement.getProperty("displayValue").match(sExpectedDisplayValuePattern), "Display Property has the expected format");
				//equals(oElement.getProperty("displayValue"), sExpectedDisplayValue);
				xmlWrapperView.destroy();

				done();
			});
		});

		test("UoM is a string and is not '%'", function() {
			var done = assert.async();
			var sTestCaseId = "uom-is-string-and-is-not-percent"
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

				var sExpectedDisplayValuePattern = new RegExp("^.*GB$","g");
				var sExpectedDisplayValue = "20%";

				//ok(oElement.getProperty("displayValue").match(sExpectedDisplayValuePattern), "Display Property has the expected format");
				//equals(oElement.getProperty("displayValue"), sExpectedDisplayValue);

				xmlWrapperView.destroy();

				done();
			});
		});

		test("UoM is a path and is '%'", function() {
			var done = assert.async();
			var sTestCaseId = "uom-is-path-and-is-percent"
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
			var sTestCaseId = "uom-is-path-and-is-not-percent"
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

		test("UoM is a path and is not '%' and TargetValue is Decimal", function() {
			var done = assert.async();
			var sTestCaseId = "uom-is-path-and-is-not-percent-and-target-is-decimal"
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
			var sTestCaseId = "uom-is-not-provided"
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

				var sExpectedPropertyBindingPath = "Progress";
				equals(oElement.getBindingPath("percentValue"), sExpectedPropertyBindingPath, "Property percent value is bound correctly to the property in the model: '" + sExpectedPropertyBindingPath + "'");

				xmlWrapperView.destroy();

				done();
			});
		});

		/*
		module("Test Annotation Helper - Display Value", {
			beforeEach: function(){

			},
			afterEach: function(){

			}
		});

		test("Display Value when UoM is %", function(){
			var oItems = xmlFragment.getItems();
			var oProgressIndicator = oItems[2];
			var sDisplayValue = oProgressIndicator.getDisplayValue();
			ok(sDisplayValue, "Display Value is present");
			ok(sDisplayValue.match(/%$/g), "Display Value is %");
			var iExpectedParts = 2;
			equal(sDisplayValue.split(" ").length, iExpectedParts, "Expected number of parts: " + iExpectedParts);
		});
		*/

		/*
		test("Display Value when UoM is not %", function(){
			var oItems = xmlFragment.getItems();
			var oProgressIndicator = oItems[2];
			var sDisplayValue = oProgressIndicator.getDisplayValue();
			ok(sDisplayValue, "Display Value is present");
			ok(!sDisplayValue.match(/%$/g), "Display Value is not %");
			var iExpectedParts = 4;
			equal(sDisplayValue.split(" ").length, iExpectedParts, "Expected number of parts: " + iExpectedParts);
		});

		test("Display Value when UoM is not provided", function(){
			var oItems = xmlFragment.getItems();
			var oProgressIndicator = oItems[2];
			var sDisplayValue = oProgressIndicator.getDisplayValue();
			ok(sDisplayValue, "Display Value is present");
			var iExpectedParts = 3;
			equal(sDisplayValue.split(" ").length, iExpectedParts, "Expected number of parts: " + iExpectedParts);
		});
		*/

});
