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

		module("Header Facet Wrapper",{
			beforeEach: function(){
			},
			afterEach: function(){
				//xmlWrapperView.destroy();
			}
		});

		test("The EntityType is annotated correctly so it can be rendered in the Object Page Header", function(){
			var done = assert.async();
			sAnnotationsPath = "annotations.xml";
			var oPromise = loadModel(sAnnotationsPath);
			oViewSettings = {
				id: "myProgressIndicatorHeaderFacetWrapperView",
				name: "tests.HeaderFacetWrapper",
				path: "/Projects('001')"
			};

			oPromise.then(function(){
				createView(oViewSettings);

				var xmlWrapperView = sap.ui.getCore().byId(oViewSettings.id);
				ok(xmlWrapperView, "Wrapper view is instantiated");

				oModel = sap.ui.getCore().getModel();
				var oMetaModel = oModel.getMetaModel();
				var oMetaModelData = oMetaModel.oModel.getData();
				var oEntityType = oMetaModelData.dataServices.schema[0].entityType[1];

				var aHeaderFacets = oEntityType['com.sap.vocabularies.UI.v1.HeaderFacets'];
				ok(aHeaderFacets, "The Entity Type contains HeaderFacets");

				var oReferenceFacet = aHeaderFacets[0];
				ok(oReferenceFacet, "The Header Facet Array has an element");
				equal(oReferenceFacet.RecordType, 'com.sap.vocabularies.UI.v1.ReferenceFacet', 'The Record Type is a ReferenceFacet');

				var oDataPoint = oEntityType['com.sap.vocabularies.UI.v1.DataPoint#Progress'];
				ok(oDataPoint, "Is a DataPoint and the Qualifier is 'Progress'");

				xmlWrapperView.destroy();

				done();
			});
		});

		module("Test Layout",{
			beforeEach: function(){
			},
			afterEach: function(){
				//xmlWrapperView.destroy();
			}
		});

		test("Happy path (all properties are annotated and resolve to path)", function(assert) {
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

				done();
			});
		});

		test("Properties resolve to String", function(assert) {
			var done = assert.async();
			var sTestCaseId = "layout-properties-resolve-to-string";
			sFragmentId = "ProgressIndicator-" + sTestCaseId;
			sAnnotationsPath = "annotations-" + sTestCaseId + ".xml";
			oViewSettings.id = "myWrapperView-" + sTestCaseId;
			oViewSettings.path = "/Projects('001')";

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

				done();
			});
		});

		/*
		test("Properties resolve to empty String", function() {
			ok(false);
		});

		test("Properties resolve to empty Path", function() {
			ok(false);
		});

		test("Properties for SubHeader not annotated", function() {
			ok(false);
		});

		test("Properties for Footer not annotated", function() {
			ok(false);
		});

		test("Properties for SubHeader and Footer not annotated", function() {
			var done = assert.async();

			sAnnotationsPath = "annotations-no-subheader-no-footer.xml";
			oViewSettings.id = "myWrapperView2";
			oViewSettings.path = "/Projects('002')";

			var oPromise = loadModel(sAnnotationsPath);

			oPromise.then(function(){
				createView(oViewSettings);
				var xmlWrapperView = sap.ui.getCore().byId(oViewSettings.id);

				xmlFragment = xmlWrapperView.getContent()[0];
				ok(xmlFragment, "Fragment is instantiated");

				var oItems = xmlFragment.getItems();
				ok(xmlFragment instanceof sap.m.VBox, "The fragment is a VBox");
				ok(oItems, "The VBox has items");

				var expectedElementCount = 2;
				equals(oItems.length, expectedElementCount , "The layout has elements as expected:" + expectedElementCount);

				var i = 0;
				var oElement = oItems[i];
				ok(oElement instanceof sap.m.Title, "Element " + i + " is a Title");

				i++;
				oElement = oItems[i];
				ok(oElement instanceof sap.m.ProgressIndicator,  "Element " + i + " is a ProgressIndicator");

				ok(false);

				//xmlWrapperView.destroy();

				done();
			});
		});
		*/
});
