/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/dvl/GraphicsCore",
	"sap/ui/vk/dvl/Viewport",
	"sap/ui/vk/StepNavigation",
	"sap/ui/vk/Viewer",
	"sap/ui/vk/ContentResource"
], function(
	jQuery,
	GraphicsCore,
	Viewport,
	StepNavigation,
	Viewer,
	ContentResource
) {
	"use strict";

	/*
		Methods tested:
			setScene
			playStep
			getStep
			getNextStep
			getPreviousStep
			getProceduresAndSteps
	*/

	var testSetSceneAndGraphicsCore = function(stepNavigation, scene, graphicsCore) {
		QUnit.test("setScene", function(assert) {
			assert.deepEqual(stepNavigation._scene, scene, "The scene has been set successfully.");
		});
	};

	var testStepMethods = function(proceduresAndSteps, nextStep, relativeStep, previousStep) {

		var expectedProceduresAndSteps = {
			"sceneId": "s0000000000527b60",
			"hasThumbnails": true,
			"procedures": [ {
				"name": "Procedure",
				"id": "i0000000300000000",
				"steps": [ {
					"name": "Step 1",
					"id": "i0000000300000001",
					"description": "sdfsdfsfds",
					"thumbnailData": "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",
					"thumbnailType": "png"
				}, {
					"name": "Step 2",
					"id": "i0000000300000002",
					"description": "step2222222222222222222222222",
					"thumbnailData": "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",
					"thumbnailType": "png"
				}, {
					"name": "Step 3",
					"id": "i0000000300000003",
					"description": "dasdsadasdas",
					"thumbnailData": "iVBORw0KGgoAAAANSUhEUgAAAFAAAAA8CAIAAAB+RarbAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsTAAALEwEAmpwYAAAELklEQVRoge1az2sbRxh93+zMrrTWypf0EmKHkh8Hl0JaQ3NuLzkFcsg1PfVvaP6CQm4999JrDT6UXgoJpITiBmTHMcG0xFZaCIZtZTckSFaxVqudHqYaT2VFWim70mrtd/p25pvle/vefDsrRMvLy0SEUwPOOZdSAjgltDnnXEVSytPAmVuWpS9OA+f/EQaQe3sfW9pEjqXuVTj36K+wQhRFABhjE6wndQxSWE3lzN5nln4LctO9zxQehlnf0uMoPBl7z8/Px08uFAoxM0dWWCNVqT3Pcxyn1WoBKJfL9XodgOM4AFqtlg70rK5kwBLHcer1+jvt4fQ4M8ZUieqyXC7rKT1ozgZBYNt2EASFQkEHAE4OvmvTSsnejuO0221FA0AQBADm5uaazaZt20KIdrutMlWsCtBlmPX0DI5vaROJS01EnHNdor65ehBCiDAMARSLxTAMwzBUI2qVCtTCnkHOeXZfS4qSqtUMisUiACGEzhRCcM5brZbiojP7IhmFFRI8exORVkJXaJZ6clBv6U6no5b3DZJUOMGzNxHpxzcgGFAGUfHWrTuAlFLu7GxWq1tqKqOWJiL91DSxkwG6z1f3Th1UKr/cvPm5vhu6/TVJS5uY2Nl7QH9mjKQkQJ47d3539+l/nSybCnc6naE5WjdTQBOPH99XQRS19ZK0FNYYb0vHIawZnqRarf5x7963agMfHPy5tva9GrdtexIKT+XTslr99erVDwAQRWpECGFZVuoKa4wkteu6psgXvPDOzrqK92588t1vzuDlnFu67XEuXNdF9wU20T0cn3NPVZ++38BXT1W8cHtZv3LfBiGE7//u+y+khOvaZv6km9Z49u7JH1rz0tLS4eHf3bVFM39yljYxaicjItz+WF8uliP/H3tAPufcdft/IWf0tdQDAu19+YOUAKRz9LK2+/DKlWuXLl2TUgJyc/P+gwc/3r37tZRSSvn6de3Zs4e2/d7165+pke3tR/X6gbrVdBRWiH/2/qYSfPEhEUFK1I4KnPNKZePy5Y8AAGRZnDHWtQwxxvb3DziPtIk4t47P3lNUOP7Z2+RDxCzLunhxwTx7EqkEAiQRY4w9f75tJFjHnyIzYWnLYuvrPwGQEm/e1BzH8v2XGxuPlMlfvdpjjJ48+RmAlLLTaS4uLuzvN7a21lSPjKIjTZNWVlamR+QYQ7u379dU4HlznlfquWw0DhuNJiABeF7J80q+/1c3oeR5JX0fWl1dTYlDNjHNptUXaf/uncU9nOrZO3MKa6QkdRYV1kiDc6YJIwV7Z9fSJhKUOusKJ47ZUFghkd+9Z0nhRH73niXCiWCWLG1i7O59pvCsYdQtnQeFR7L3zCusEVPqPCisEYdzrggjhr3zY2kTA6TOm8JDkU+FFfqevfOscN+zd54J90WeLW1Cd2+K8+eCPOFfjeXigOGzeakAAAAASUVORK5CYII=",
					"thumbnailType": "png"
				}, {
					"name": "Step 4",
					"id": "i0000000300000004",
					"description": "dsddas jkh   jkdashkdjhsakjhdkjs a sasaassa\r\n",
					"thumbnailData": "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",
					"thumbnailType": "png"
				}, {
					"name": "Step 5",
					"id": "i0000000300000005",
					"description": "dsadsa",
					"thumbnailData": "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",
					"thumbnailType": "png"
				} ]
			} ],
			"portfolios": []
		};

		QUnit.test("getProceduresAndSteps", function(assert) {
			assert.ok(proceduresAndSteps.hasThumbnails, "The current procedures and steps have thumbnails.");
			assert.strictEqual(proceduresAndSteps.procedures.length, 1, "The current procedures array has the length of 1.");

			assert.strictEqual(proceduresAndSteps.procedures[0].name, expectedProceduresAndSteps.procedures[0].name, "The current procedures are named 'Procedure'.");
			assert.strictEqual(proceduresAndSteps.procedures[0].steps[0].name, expectedProceduresAndSteps.procedures[0].steps[0].name, "The first step is named 'Step 1'.");
			assert.strictEqual(proceduresAndSteps.procedures[0].steps[0].description, expectedProceduresAndSteps.procedures[0].steps[0].description, "The first step description matches expectations.");
			assert.strictEqual(proceduresAndSteps.procedures[0].steps[0].thumbnailData, expectedProceduresAndSteps.procedures[0].steps[0].thumbnailData, "The first step thumbnailData matches expectations.");
			assert.strictEqual(proceduresAndSteps.procedures[0].steps[0].thumbnailType, expectedProceduresAndSteps.procedures[0].steps[0].thumbnailType, "The first step thumbnailType matches expectations.");

			assert.strictEqual(proceduresAndSteps.procedures[0].steps[4].name, expectedProceduresAndSteps.procedures[0].steps[4].name, "The last step is named 'Step 5'.");
			assert.strictEqual(proceduresAndSteps.procedures[0].steps[4].description, expectedProceduresAndSteps.procedures[0].steps[4].description, "The last step description matches expectations.");
			assert.strictEqual(proceduresAndSteps.procedures[0].steps[4].thumbnailData, expectedProceduresAndSteps.procedures[0].steps[4].thumbnailData, "The last step thumbnailData matches expectations.");
			assert.strictEqual(proceduresAndSteps.procedures[0].steps[4].thumbnailType, expectedProceduresAndSteps.procedures[0].steps[4].thumbnailType, "The last step thumbnailType matches expectations.");
		});

		var expectedNextStep = {
			"name": "Step 1",
			"description": "sdfsdfsfds",
			"thumbnailData": "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",
			"thumbnailType": "png"
		};

		QUnit.test("getNextStep", function(assert) {
			assert.strictEqual(expectedNextStep.name, nextStep.name, "The next step name matches the expect one.");
			assert.strictEqual(expectedNextStep.description, nextStep.description, "The next step description matches the expect one.");
			assert.strictEqual(expectedNextStep.thumbnailData, nextStep.thumbnailData, "The next step thumbnailData matches the expect one.");
			assert.strictEqual(expectedNextStep.thumbnailType, nextStep.thumbnailType, "The next step thumbnailType matches the expect one.");
		});

		QUnit.test("getStep", function(assert) {
			assert.strictEqual(relativeStep.name, "Step 3", "The step returned by the getStep method is 'Step 3'.");
		});

		QUnit.test("getPreviousStep", function(assert) {
			assert.strictEqual(previousStep.name, "Step 2", "The previous step is 'Step 2'.");
		});
	};

	var contentResource1 = new ContentResource({
		source: "test-resources/sap/ui/vk/qunit/media/nodes_boxes_with_steps.vds",
		sourceType: "vds",
		sourceId: "abc"
	});

	var contentResource2 = new ContentResource({
		source: "test-resources/sap/ui/vk/qunit/media/nodes_boxes.vds",
		sourceType: "vds",
		sourceId: "abc"
	});

	var viewer = new Viewer({
		width: "100%",
		height: "300px",
		showStepNavigationThumbnails: true,
		enableStepNavigation: true,
		showStepNavigation: true,
		enableSceneTree: false,
		showSceneTree: false,
		runtimeSettings: { totalMemory: 16777216 }
	});
	viewer.placeAt("content");

	var createStandaloneStepNavigation = function(stepNavTestsDone) {
		var viewport = new Viewport().placeAt("content");
		var stepNavigation = new StepNavigation().placeAt("content");

		GraphicsCore.create({ totalMemory: 16777216 }, {
			antialias: true,
			alpha: true,
			premultipliedAlpha: false
		}).then(function(graphicsCore) {
			graphicsCore.loadContentResourcesAsync([ contentResource1 ], function(sourcesFailedToLoad) {
				if (!sourcesFailedToLoad) {
					var scene = graphicsCore.buildSceneTree([ contentResource1 ]);

					viewport.setGraphicsCore(graphicsCore);
					viewport.setScene(scene);

					stepNavigation.setScene(scene);

					testSetSceneAndGraphicsCore(jQuery.extend(true, {}, stepNavigation), scene, graphicsCore);

					var proceduresAndSteps = stepNavigation.getProceduresAndSteps();
					var nextStep = stepNavigation.getNextStep();
					setTimeout(function() {
						stepNavigation.playStep(nextStep.id, true, false);
						// getStep retrieves the relative step of the current step.
						// The current step is #1 so we expect to get step #3.
						var relativeStep = stepNavigation.getStep(2);
						stepNavigation.playStep(relativeStep.id, true, false);
						var previousStep = stepNavigation.getPreviousStep();
						testStepMethods(proceduresAndSteps, nextStep, relativeStep, previousStep);
						stepNavTestsDone();
					}, 500);
				}
			});
		});
	};

	QUnit.test("Test loading scene", function(assertMain) {
		var viewerDone = assertMain.async();

		var testThumbnailsExist = function(listOfThumbnails) {
			QUnit.test("jQuery selector should find thumbnails for the current steps", function(assert) {
				assert.equal(listOfThumbnails.length, 5, "The current step navigation displays 5 step thumbnails");
			});
		};

		var testThumbnailsDoNotExist = function(listOfThumbnails) {
			QUnit.test("jQuery selector should not find any thumbnails for the current steps", function(assert) {
				assert.equal(listOfThumbnails.length, 0, "The current step navigation doesn't display any step thumbnails");
			});
		};

		var firstPass = true;

		// VDS file load error handler
		viewer.attachSceneLoadingFailed(function(event) {
			assertMain.ok(false, "Viewer scene loading failed.");
			viewerDone();
		});

		// VDS file load successfuly handler
		viewer.attachSceneLoadingSucceeded(function(event) {
			assertMain.ok(true, "Viewer scene loading succeeded.");
			if (firstPass) {
				setTimeout(function() {
					// Find all items with class "sapVizKitStepNavigationStepItem"
					testThumbnailsExist(jQuery(".sapVizKitStepNavigationStepItem"));

					// Remove first file and initiate loading of the second file
					viewer.destroyContentResources();
					viewer.addContentResource(contentResource2);
					firstPass = false;
				}, 500);
			} else {
				setTimeout(function() {
					// Find all items with class "sapVizKitStepNavigationStepItem"
					testThumbnailsDoNotExist(jQuery(".sapVizKitStepNavigationStepItem"));
					viewerDone();
				}, 500);
			}
		});

		viewer.addContentResource(contentResource1);
	});

	QUnit.test("Standalone StepNavigation", function(assert) {
		var stepNavTestsDone = assert.async();
		createStandaloneStepNavigation(stepNavTestsDone);
		assert.ok(true, "All good");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
