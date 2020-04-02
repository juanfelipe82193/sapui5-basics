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
					// Testing EditMode: 'Display'
					sFragmentName: "sap.fe.macros.Form",
					sDescription: "general form with editable false",
					mModels: {
						"sap.ui.mdc.i18n": oResourceModel,
						//For macro fragements we need to simulate the this model
						"this": new JSONModel({
							"id": "formId",
							"idPrefix": "somePrefix",
							"formTitle": "Title",
							"editMode": "Display"
						})
					},
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							// Testing Collection Facet
							mBindingContexts: {
								"facet": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/0/",
								"entitySet": "/someEntitySet"
							},
							oExpectedResultsPerTest: {
								"form": {
									"id": "formId",
									"editable": "false",
									"visible": "true"
								}
							}
						},
						{
							// Testing Reference Facet
							mBindingContexts: {
								"facet": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/1/",
								"entitySet": "/someEntitySet"
							},
							oExpectedResultsPerTest: {
								"form": {
									"id": "formId",
									"editable": "false",
									"visible": "true"
								}
							}
						}
					]
				},
				{
					// Testing EditMode: 'Editable'
					sFragmentName: "sap.fe.macros.Form",
					sDescription: "general form with editable true",
					mModels: {
						"sap.ui.mdc.i18n": oResourceModel,
						//For macro fragements we need to simulate the this model
						"this": new JSONModel({
							"id": "formId",
							"idPrefix": "somePrefix",
							"formTitle": "Title",
							"editMode": "Editable",
							"useFormContainerLabels": "true"
						})
					},
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							// Testing Collection Facet
							mBindingContexts: {
								"facet": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/0/",
								"entitySet": "/someEntitySet"
							},
							oExpectedResultsPerTest: {
								"form": {
									"id": "formId",
									"editable": "true",
									"visible": "true"
								}
							}
						},
						{
							// Testing Reference Facet
							mBindingContexts: {
								"facet": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/1/",
								"entitySet": "/someEntitySet"
							},
							oExpectedResultsPerTest: {
								"form": {
									"id": "formId",
									"editable": "true",
									"visible": "true"
								}
							}
						}
					]
				},
				{
					// Testing EditMode as binding
					sFragmentName: "sap.fe.macros.Form",
					sDescription: "general form with editable property from runtime model",
					mModels: {
						"sap.ui.mdc.i18n": oResourceModel,
						//For macro fragements we need to simulate the this model
						"this": new JSONModel({
							"id": "formId",
							"idPrefix": "somePrefix",
							"formTitle": "Title",
							"editMode": "{ui>editMode}"
						})
					},
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							// Testing Collection Facet
							mBindingContexts: {
								"facet": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/0/",
								"entitySet": "/someEntitySet"
							},
							oExpectedResultsPerTest: {
								"form": {
									"id": "formId",
									"editable": "{= %{ui>editMode} === 'Editable' }",
									"visible": "true"
								}
							}
						},
						{
							// Testing Reference Facet
							mBindingContexts: {
								"facet": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/1/",
								"entitySet": "/someEntitySet"
							},
							oExpectedResultsPerTest: {
								"form": {
									"id": "formId",
									"editable": "{= %{ui>editMode} === 'Editable' }",
									"visible": "true"
								}
							}
						}
					]
				},
				{
					// Testing Form with FormContainer having navigation to another entitySet.
					sFragmentName: "sap.fe.macros.Form",
					sDescription: "general form with editable property from runtime model and form container",
					mModels: {
						"sap.ui.mdc.i18n": oResourceModel,
						//For macro fragements we need to simulate the this model
						"this": new JSONModel({
							"id": "formId",
							"idPrefix": "somePrefix",
							"formTitle": "Title",
							"editMode": "{ui>editMode}",
							"useFormContainerLabels": "true"
						})
					},
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							// Testing Collection Facet
							mBindingContexts: {
								"facet": "/someEntitySet/$Type/@com.sap.vocabularies.UI.v1.Facets/2/",
								"entitySet": "/someEntitySet"
							},
							oExpectedResultsPerTest: {
								"form": {
									"id": "formId",
									"editable": "{= %{ui>editMode} === 'Editable' }",
									"visible": "true",
									"title": "Title"
								},
								"formC": {
									"id": "formId::_some2ndEntity::com.sap.vocabularies.UI.v1.Identification::FormC",
									"title": "Second Entity",
									"binding": "{ path : '_some2ndEntity' }",
									"visible": "{= !${Property2Boolean} }"
								}
							}
						}
					]
				},
				{
					// Testing Form with FormContainer.
					sFragmentName: "sap.fe.macros.Form",
					sDescription: "general form with editable property from runtime model and form container with navigation",
					mModels: {
						"sap.ui.mdc.i18n": oResourceModel,
						//For macro fragements we need to simulate the this model
						"this": new JSONModel({
							"id": "formId",
							"idPrefix": "somePrefix",
							"formTitle": "Title",
							"editMode": "{ui>editMode}",
							"partOfPreview": "false"
						})
					},
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							// Testing Collection Facet
							mBindingContexts: {
								"facet": "/someEntitySet/@com.sap.vocabularies.UI.v1.Facets/3/",
								"entitySet": "/someEntitySet"
							},
							oExpectedResultsPerTest: {
								"form": {
									"id": "formId",
									"editable": "{= %{ui>editMode} === 'Editable' }",
									"visible": "true",
									"title": "Title"
								},
								"formC": {
									"id": "formId::com.sap.vocabularies.UI.v1.Identification::FormC",
									"title": "",
									"binding": "",
									"visible": "true"
								}
							}
						}
					]
				}
			];

			TemplatingTestUtils.testFragments(
				QUnit,
				"Form Fragment with Simple Metadata",
				simpleMetadata,
				aSimpleMetadataFragmentTests,
				true
			);
		});
	}
);
