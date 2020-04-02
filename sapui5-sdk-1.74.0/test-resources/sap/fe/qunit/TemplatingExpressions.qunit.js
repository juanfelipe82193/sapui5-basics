/* global QUnit sap */
sap.ui.define(
	[
		"sap/ui/model/resource/ResourceModel",
		"sap/ui/model/json/JSONModel",
		"sap/fe/test/TemplatingTestUtils",
		"./test/simpleMetadata",
		"./test/iteloMetadata",
		"./test/musicDraftMetadata",
		/* All controls that must be loaded for the tests */
		"sap/m/RatingIndicator"
	],
	function(ResourceModel, JSONModel, TemplatingTestUtils, simpleMetadata, iteloMetadata, musicDraftMetadata) {
		"use strict";

		var oResourceModel = new ResourceModel({ bundleName: "sap.fe.templates.messagebundle", async: true });
		return oResourceModel._oPromise.then(function() {
			/* Define all fragment tests in this array */
			var aSimpleMetadataFragmentTests = [
				{
					sFragmentName: "sap.fe.templates.ObjectPage.view.fragments.HeaderRatingIndicator",
					mModels: {
						"sap.fe.i18n": oResourceModel
					},
					fileType: "fragment",
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								"dataPoint": "/someEntitySet/@com.sap.vocabularies.UI.v1.DataPoint#noTargetValue"
							},
							oExpectedResultsPerTest: {
								"a": {
									"text": "{PropertyInt16} out of 5"
								}
							}
						},
						{
							mBindingContexts: {
								"dataPoint": "/someEntitySet/@com.sap.vocabularies.UI.v1.DataPoint#withTargetValueStatic"
							},
							oExpectedResultsPerTest: {
								"a": {
									"text": "{PropertyInt16} out of 5"
								}
							}
						},
						{
							mBindingContexts: {
								"dataPoint": "/someEntitySet/@com.sap.vocabularies.UI.v1.DataPoint#withTargetValueDynamic"
							},
							oExpectedResultsPerTest: {
								"a": {
									"text": "{PropertyInt16} out of {PropertyInt32}"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.templates.ListReport.ListReport",
					mModels: {
						"sap.fe.i18n": oResourceModel,
						"manifest": new JSONModel({ "sap.app": { appSubTitle: "Sample Title", title: "Sample Title1" }, async: true }),
						"viewData": new JSONModel({ "variantManagement": "None" })
					},
					fileType: "view",
					tests: [
						{
							mBindingContexts: {
								entitySet: "/someEntitySet",
								entitySetPath: "/someEntitySet",
								collection: "/someEntitySet/someNamespace.someEntityType",
								visualizationPath: "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem"
							},
							oExpectedResultsPerTest: {
								"listReportTitleTest": {
									"text": "Sample Title"
								},
								"TablePropertyExpressionTest": {
									"selectionMode": "Multi"
								},
								"listReportFooterTest": {
									"showFooter": "false"
								},
								"listReportFilterBarTest": {
									"id": "fe::fb::someEntitySet",
									"listBindingNames": "fe::table::someEntitySet::LineItem",
									"draftEditStateModelName": ""
								},
								"listReportOverflowToolbarTest": {
									"id": "fe::lr::footer::someEntitySet"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.templates.ObjectPage.ObjectPage",
					mModels: {
						"sap.fe.i18n": oResourceModel
					},
					fileType: "view",
					tests: [
						{
							mBindingContexts: {
								entitySet: "/someEntitySet",
								entitySetPath: "/someEntitySet",
								viewData: "/someEntitySet"
							},
							oExpectedResultsPerTest: {
								"objectPageLayoutTest": {
									"showFooter": "true",
									"showHeaderContent": "{= !(${ui>/editable} === 'Editable') }",
									"binding":
										"{path:'', parameters:{$$ownRequest:true,$$patchWithoutSideEffects:true},events : {dataRequested: '.handlers.onDataRequested', dataReceived : '.handlers.onDataReceived'}}",
									"id": "fe::op"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.templates.ObjectPage.view.fragments.HeaderProgressIndicator",
					mModels: {
						"sap.fe.i18n": oResourceModel
					},
					fileType: "fragment",
					tests: [
						{
							mBindingContexts: {
								"dataPoint": "/someEntitySet/@com.sap.vocabularies.UI.v1.DataPoint#HelpfulCount"
							},
							oExpectedResultsPerTest: {
								"a": {
									"displayValue": "{PropertyInt16} of {PropertyInt32}",
									"percentValue":
										"{= ((${PropertyInt32} > 0) ? ((${PropertyInt16} > ${PropertyInt32}) ? 100 : ((${PropertyInt16} < 0) ? 0 : (${PropertyInt16} / ${PropertyInt32} * 100))) : 0) }"
								},
								"b": {
									"text": "Property of Type Int16"
								}
							}
						},
						{
							mBindingContexts: {
								"dataPoint": "/someEntitySet/@com.sap.vocabularies.UI.v1.DataPoint#HelpfulTotal"
							},
							oExpectedResultsPerTest: {
								"a": {
									"displayValue": "{PropertyInt16} of {PropertyInt32}",
									"percentValue":
										"{= ((${PropertyInt32} > 0) ? ((${PropertyInt16} > ${PropertyInt32}) ? 100 : ((${PropertyInt16} < 0) ? 0 : (${PropertyInt16} / ${PropertyInt32} * 100))) : 0) }"
								},
								"b": {
									"text": "Property of Type Int16"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.templates.controls.ViewSwitchContainer.Table",
					mModels: {
						"sap.fe.i18n": oResourceModel,
						"viewData": new JSONModel({
							viewLevel: 0,
							navigation: {
								"_SingleNavigationProperty": {
									detail: {
										route: "somePage"
									}
								},
								"_NavProp1/_NavProp2": {
									detail: {
										route: "someOtherPage"
									}
								}
							}
						})
					},
					fileType: "fragment",
					tests: [
						{
							description: "Internal navigation via single navigation property to draft root",
							//test specific model data
							mModels: {
								"metaPath": new JSONModel({
									navigationPath: {
										get: function() {
											return "_SingleNavigationProperty";
										}
									}
								})
							},
							// TEST: With delete restriction & no LineItem conatining a DataFieldForAction/DataFieldForIntentBasedNavigation
							mBindingContexts: {
								collection: "/draftRootEntitySet",
								visualizationPath: "/draftRootEntitySet/@com.sap.vocabularies.UI.v1.LineItem"
							},
							oExpectedResultsPerTest: {
								"TablePropertyExpressionTest": {
									"rowPress":
										".routing.navigateForwardToContext(${$parameters>bindingContext}, { targetPath: '_SingleNavigationProperty', editable : !${$parameters>bindingContext}.getProperty('IsActiveEntity')})"
								}
							}
						},
						{
							description: "Internal navigation via single navigation property to draft node",
							//test specific model data
							mModels: {
								"metaPath": new JSONModel({
									navigationPath: {
										get: function() {
											return "_SingleNavigationProperty";
										}
									}
								})
							},
							// TEST: With delete restriction & no LineItem conatining a DataFieldForAction/DataFieldForIntentBasedNavigation
							mBindingContexts: {
								collection: "/draftNodeEntitySet",
								visualizationPath: "/draftNodeEntitySet/@com.sap.vocabularies.UI.v1.LineItem"
							},
							oExpectedResultsPerTest: {
								"TablePropertyExpressionTest": {
									"rowPress":
										".routing.navigateForwardToContext(${$parameters>bindingContext}, { targetPath: '_SingleNavigationProperty', editable : !${$parameters>bindingContext}.getProperty('IsActiveEntity')})"
								}
							}
						},
						{
							description: "Internal navigation via single navigation property",
							//test specific model data
							mModels: {
								"metaPath": new JSONModel({
									navigationPath: {
										get: function() {
											return "_SingleNavigationProperty";
										}
									}
								})
							},
							// TEST: With delete restriction & no LineItem conatining a DataFieldForAction/DataFieldForIntentBasedNavigation
							mBindingContexts: {
								collection: "/deleteRestrictedEntitySet",
								visualizationPath: "/deleteRestrictedEntitySet/@com.sap.vocabularies.UI.v1.LineItem"
							},
							oExpectedResultsPerTest: {
								"TablePropertyExpressionTest": {
									"rowPress":
										".routing.navigateForwardToContext(${$parameters>bindingContext}, { targetPath: '_SingleNavigationProperty', editable : undefined})"
								}
							}
						},
						{
							description: "Internal navigation via mulitiple navigation properies",
							//test specific model data
							mModels: {
								"metaPath": new JSONModel({
									navigationPath: {
										get: function() {
											return "_NavProp1/_NavProp2";
										}
									}
								})
							},
							// TEST: With delete restriction & no LineItem conatining a DataFieldForAction/DataFieldForIntentBasedNavigation
							mBindingContexts: {
								collection: "/deleteRestrictedEntitySet",
								visualizationPath: "/deleteRestrictedEntitySet/@com.sap.vocabularies.UI.v1.LineItem"
							},
							oExpectedResultsPerTest: {
								"TablePropertyExpressionTest": {
									"rowPress":
										".routing.navigateForwardToContext(${$parameters>bindingContext}, { targetPath: '_NavProp1/_NavProp2', editable : undefined})"
								}
							}
						},
						{
							description: "No navigation as routing in manifest didn't declare it for a navigationProperty",
							//test specific model data
							mModels: {
								"metaPath": new JSONModel({
									navigationPath: {
										get: function() {
											return "_navPropWithoutRouteInViewData";
										}
									}
								})
							},
							// TEST: With delete restriction & no LineItem conatining a DataFieldForAction/DataFieldForIntentBasedNavigation
							mBindingContexts: {
								collection: "/deleteRestrictedEntitySet",
								visualizationPath: "/deleteRestrictedEntitySet/@com.sap.vocabularies.UI.v1.LineItem"
							},
							oExpectedResultsPerTest: {
								"TablePropertyExpressionTest": {
									"rowPress": undefined
								}
							}
						},
						{
							// TEST: With delete restriction & no LineItem conatining a DataFieldForAction/DataFieldForIntentBasedNavigation
							mBindingContexts: {
								collection: "/deleteRestrictedEntitySet",
								visualizationPath: "/deleteRestrictedEntitySet/@com.sap.vocabularies.UI.v1.LineItem",
								annotationPath: "/deleteRestrictedEntitySet/@com.sap.vocabularies.UI.v1.LineItem",
								targetCollection: "/deleteNotRestrictedEntitySet"
							},
							oExpectedResultsPerTest: {
								"TablePropertyExpressionTest": {
									"selectionMode": "None"
								}
							}
						},
						{
							// TEST: Without delete restriction to check selection mode for LR Table
							mBindingContexts: {
								collection: "/deleteNotRestrictedEntitySet",
								visualizationPath: "/deleteRestrictedEntitySet/@com.sap.vocabularies.UI.v1.LineItem",
								annotationPath: "/deleteRestrictedEntitySet/@com.sap.vocabularies.UI.v1.LineItem",
								targetCollection: "/deleteNotRestrictedEntitySet"
							},
							oExpectedResultsPerTest: {
								"TablePropertyExpressionTest": {
									"selectionMode": "Multi"
								}
							}
						},
						{
							// TEST: With delete restriction & LineItem conatining a dataFieldForAction
							mBindingContexts: {
								collection: "/dataFieldForActionEntitySet/someNamespace.dataFieldForActionEntityType",
								visualizationPath: "/dataFieldForActionEntitySet/@com.sap.vocabularies.UI.v1.LineItem",
								annotationPath: "/dataFieldForActionEntitySet/@com.sap.vocabularies.UI.v1.LineItem"
							},
							oExpectedResultsPerTest: {
								"TablePropertyExpressionTest": {
									"selectionMode": "Multi"
								}
							}
						},
						{
							// TEST: With delete restriction & LineItem conatining a DataFieldForIntentBasedNavigation
							mBindingContexts: {
								collection: "/dataFieldForIntentBasedNavigationSet/someNamespace.dataFieldForIntentBasedNavigationType",
								visualizationPath: "/dataFieldForIntentBasedNavigationSet/@com.sap.vocabularies.UI.v1.LineItem",
								annotationPath: "/dataFieldForIntentBasedNavigationSet/@com.sap.vocabularies.UI.v1.LineItem"
							},
							oExpectedResultsPerTest: {
								"TablePropertyExpressionTest": {
									"selectionMode": "{= ${ui>/editable} === 'Editable' ? 'Multi' : 'None'}"
								}
							}
						},
						{
							// TEST: Without delete restriction
							mBindingContexts: {
								collection: "/someEntitySet/someNamespace.someEntityType",
								visualizationPath: "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem",
								annotationPath: "/someEntitySet/@com.sap.vocabularies.UI.v1.LineItem"
							},
							oExpectedResultsPerTest: {
								"TablePropertyExpressionTest": {
									"selectionMode": "{= ${ui>/editable} === 'Editable' ? 'Multi' : 'None'}"
								}
							}
						}
					]
				},
				{
					sFragmentName: "sap.fe.core.controls.ActionParameterDialog",
					mModels: {},
					fileType: "fragment",
					tests: [
						{
							mBindingContexts: {
								entitySet: "/someEntitySet",
								action: "/someEntitySet/someNamespace.someCollectionBoundAction1/@$ui5.overload/0",
								actionName: "/someEntitySet/someNamespace.someCollectionBoundAction1"
							},
							oExpectedResultsPerTest: {
								"ActionParameterDialogLabelExpressionTest": {
									"text": "some label 1"
								},
								"ActionParameterDialogFieldExpressionTest": {
									"required": "true",
									"display": "Value",
									"value":
										"{path:'someParameter1',type:'sap.ui.model.odata.type.String',constraints:{'maxLength':4,'nullable':false},formatOptions:{'parseKeepsEmptyString':true}}",
									"fieldHelp": "someNamespace.someCollectionBoundAction1::someParameter1"
								},
								"ActionParameterDialogValuehelpExpressionTest": {
									"noDialog": "false",
									"id": "someNamespace.someCollectionBoundAction1::someParameter1"
								}
							}
						},
						{
							mBindingContexts: {
								entitySet: "/someEntitySet",
								action: "/someEntitySet/someNamespace.someCollectionBoundAction2/@$ui5.overload/0",
								actionName: "/someEntitySet/someNamespace.someCollectionBoundAction2"
							},
							oExpectedResultsPerTest: {
								"ActionParameterDialogLabelExpressionTest": {
									"text": "some label 2"
								},
								"ActionParameterDialogFieldExpressionTest": {
									"required": "false",
									"display": "Value",
									"value":
										"{path:'someParameter2',type:'sap.ui.model.odata.type.String',constraints:{'maxLength':4},formatOptions:{'parseKeepsEmptyString':true}}",
									"change": ".handleChange($event, 'someParameter2')",
									"valueState": "{paramsModel>/$valueState/someParameter2}",
									"valueStateText": "{paramsModel>/$valueStateText/someParameter2}",
									"fieldHelp": "someNamespace.someCollectionBoundAction2::someParameter2"
								},
								"ActionParameterDialogValuehelpExpressionTest": {
									"noDialog": "true",
									"id": "someNamespace.someCollectionBoundAction2::someParameter2"
								}
							}
						},
						// {
						// 	mBindingContexts: {
						// 		entitySet: "/someEntitySet",
						// 		action: "/someEntitySet/someNamespace.someCollectionBoundAction3/@$ui5.overload/0",
						// 		actionName: "/someEntitySet/someNamespace.someCollectionBoundAction3"
						// 	},
						// 	oExpectedResultsPerTest: {
						// 		"ActionParameterDialogLabelExpressionTest": {},
						// 		"ActionParameterDialogFieldExpressionTest": {},
						// 		"ActionParameterDialogValuehelpExpressionTest": {}
						// 	}
						// },
						{
							mBindingContexts: {
								entitySet: "/someEntitySet",
								action: "/someNamespace.someUnboundAction1/0",
								actionName: "/someNamespace.someUnboundAction1"
							},
							oExpectedResultsPerTest: {
								"ActionParameterDialogLabelExpressionTest": {
									"text": "some label"
								},
								"ActionParameterDialogFieldExpressionTest": {
									"required": "false",
									"display": "Value",
									"value":
										"{path:'someParameter',type:'sap.ui.model.odata.type.String',constraints:{'maxLength':4},formatOptions:{'parseKeepsEmptyString':true}}",
									"change": ".handleChange($event, 'someParameter')",
									"valueState": "{paramsModel>/$valueState/someParameter}",
									"valueStateText": "{paramsModel>/$valueStateText/someParameter}",
									"fieldHelp": "someNamespace.someUnboundAction1::someParameter"
								},
								"ActionParameterDialogValuehelpExpressionTest": {
									"noDialog": "true",
									"id": "someNamespace.someUnboundAction1::someParameter"
								}
							}
						}
					]
				}
			];

			TemplatingTestUtils.testFragments(QUnit, "Simple Metadata", simpleMetadata, aSimpleMetadataFragmentTests);

			var aIteloFragmentTests = [
				{
					sFragmentName: "sap.fe.templates.ObjectPage.view.fragments.HeaderRatingIndicator",
					mModels: {
						"sap.fe.i18n": oResourceModel
					},
					fileType: "fragment",
					/* tests is an array as you may test the same expression against different annotation examples */
					tests: [
						{
							mBindingContexts: {
								"dataPoint": "/Products/@com.sap.vocabularies.UI.v1.DataPoint#averageRating"
							},
							oExpectedResultsPerTest: {
								"a": {
									"text": "{averageRating} out of 5"
								}
							}
						}
					]
				}
			];

			TemplatingTestUtils.testFragments(QUnit, "Itelo Metadata", iteloMetadata, aIteloFragmentTests);
		});
	}
);
