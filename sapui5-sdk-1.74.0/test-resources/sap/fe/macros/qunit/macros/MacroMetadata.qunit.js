/* global QUnit sap */
sap.ui.define(
	[
		"sap/ui/model/resource/ResourceModel",
		"sap/ui/model/json/JSONModel",
		"sap/fe/macros/macroLibrary",
		"sap/fe/test/TemplatingTestUtils",
		"./metadata/simpleMetadata"
		/* All controls that must be loaded for the tests */
	],
	function(ResourceModel, JSONModel, macroLibrary, TemplatingTestUtils, simpleMetadata) {
		"use strict";

		var oResourceModel = new ResourceModel({ bundleName: "sap.ui.mdc.messagebundle", async: true });

		return oResourceModel._oPromise.then(function() {
			/* Define all fragment tests in this array */
			var aSimpleMetadataFragmentTests = [
				{
					sFragmentName: "sap.fe.macros.fragments.FilterFieldMacro",
					sDescription: "idPrefix/vhIdPrefix defined",
					mModels: {
						"sap.ui.mdc.i18n": oResourceModel,
						"setup": new JSONModel({
							idPrefix: "MY_PREFIX",
							vhIdPrefix: "MY_VH_PREFIX"
						})
					},
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								//Currently needs a DataField.Value for PropertyQuatity -> PropertyUnit via @Unit
								"property": "/someEntitySet/@com.sap.vocabularies.UI.v1.SelectionFields/0/$PropertyPath",
								"entitySet": "/someEntitySet"
							},
							oExpectedResultsPerTest: {
								"UnitTest::FilterField": {
									"id": "MY_PREFIX::PropertyString",
									"dataType": "Edm.String",
									"fieldHelp": "MY_VH_PREFIX::PropertyString"
								}
							}
						},
						{
							mBindingContexts: {
								"property": "/someEntitySet/@com.sap.vocabularies.UI.v1.SelectionFields/1/$PropertyPath",
								"entitySet": "/someEntitySet"
							},
							oExpectedResultsPerTest: {
								"UnitTest::FilterField": {
									"id": "MY_PREFIX::PropertyBoolean",
									"dataType": "Edm.Boolean",
									"fieldHelp": undefined
								}
							}
						},
						{
							mBindingContexts: {
								"property": "/someEntitySet/@com.sap.vocabularies.UI.v1.SelectionFields/1/$PropertyPath"
							},
							sExpectedException: "sap.fe.macros.FilterField: Required metadataContext 'entitySet' is missing"
						}
					]
				},
				{
					sFragmentName: "sap.fe.macros.fragments.FilterFieldMacroMissingID",
					sDescription: "idPrefix/vhIdPrefix NOT defined",
					mModels: {
						"sap.ui.mdc.i18n": oResourceModel,
						"setup": new JSONModel({})
					},
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								//Currently needs a DataField.Value for PropertyQuatity -> PropertyUnit via @Unit
								"property": "/someEntitySet/@com.sap.vocabularies.UI.v1.SelectionFields/0/$PropertyPath",
								"entitySet": "/someEntitySet"
							},
							oExpectedResultsPerTest: {
								"UnitTest::FilterField": {
									"id": "FF::PropertyString",
									"dataType": "Edm.String",
									"fieldHelp": "FFVH::PropertyString"
								}
							}
						},
						{
							mBindingContexts: {
								"property": "/someEntitySet/@com.sap.vocabularies.UI.v1.SelectionFields/1/$PropertyPath",
								"entitySet": "/someEntitySet"
							},
							oExpectedResultsPerTest: {
								"UnitTest::FilterField": {
									"id": "FF::PropertyBoolean",
									"dataType": "Edm.Boolean",
									"fieldHelp": undefined
								}
							}
						}
					]
				}
			];

			TemplatingTestUtils.testFragments(
				QUnit,
				"Value Help Fragment with Simple Metadata",
				simpleMetadata,
				aSimpleMetadataFragmentTests,
				true
			);
		});
	}
);
