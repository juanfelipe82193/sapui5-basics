/* global QUnit sap */
sap.ui.define(
	[
		"sap/ui/model/resource/ResourceModel",
		"sap/ui/model/json/JSONModel",
		"sap/fe/test/TemplatingTestUtils",
		"./metadata/simpleMetadata"
		/* All controls that must be loaded for the tests */
	],
	function(ResourceModel, JSONModel, TemplatingTestUtils, simpleMetadata) {
		"use strict";

		var oResourceModel = new ResourceModel({
			bundleName: "sap.ui.mdc.messagebundle",
			async: true
		});

		return oResourceModel._oPromise.then(function() {
			/* Define all fragment tests in this array */
			var aSimpleMetadataFragmentTests = [
				{
					sFragmentName: "sap.fe.macros.FormContainer",
					sDescription: "Without NavigationProperty",
					mModels: {
						"sap.ui.mdc.i18n": oResourceModel,
						//For macro fragements we need to simulate the this model
						"this": new JSONModel({
							"id": "formContainerId",
							"idPrefix": "somePrefix",
							"title": "Form Container Title",
							"navigationPath": "",
							"visibilityPath": ""
						})
					},
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								"dataFieldCollection": "/someEntitySet/@com.sap.vocabularies.UI.v1.Identification",
								"entitySet": "/someEntitySet"
							},
							oExpectedResultsPerTest: {
								"formC": {
									"id": "formContainerId",
									"title": "Form Container Title",
									"binding": "",
									"visible": "true"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.macros.FormContainer",
					sDescription: "With NavigationProperty",
					mModels: {
						"sap.ui.mdc.i18n": oResourceModel,
						//For macro fragements we need to simulate the this model
						"this": new JSONModel({
							"id": "formContainerId",
							"idPrefix": "somePrefix",
							"title": "Form Container Title",
							"navigationPath": "_some2ndEntity",
							"visibilityPath": "Property2Boolean"
						})
					},
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								"dataFieldCollection":
									"/someEntitySet/$NavigationPropertyBinding/_some2ndEntity/@com.sap.vocabularies.UI.v1.Identification",
								"entitySet": "/some2ndEntitySet"
							},
							oExpectedResultsPerTest: {
								"formC": {
									"id": "formContainerId",
									"title": "Form Container Title",
									"binding": "{ path : '_some2ndEntity' }",
									"visible": "{= !${Property2Boolean} }"
								}
							}
						}
					]
				}
			];

			TemplatingTestUtils.testFragments(
				QUnit,
				"FormContainer Fragment with Simple Metadata",
				simpleMetadata,
				aSimpleMetadataFragmentTests
			);
		});
	}
);
