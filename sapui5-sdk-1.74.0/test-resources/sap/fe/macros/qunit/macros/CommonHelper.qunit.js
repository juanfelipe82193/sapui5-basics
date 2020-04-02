/* eslint-disable consistent-return */
/* global QUnit */
sap.ui.define(["sap/fe/macros/CommonHelper"], function(CommonHelper) {
	"use strict";
	QUnit.module("Unit Test for getEditMode");

	QUnit.test("Unit test to check getEditMode ", function(assert) {
		[
			{
				sEditMode: "Display",
				expectedValue: "Display",
				sMessage: "with EditMode as harcoded value (ReadOnly, Diasbled, Display)"
			},
			{
				sDataFieldType: "com.sap.vocabularies.UI.v1.DataFieldWithUrl",
				sEditMode: "Editable",
				expectedValue: "Display",
				sMessage: "with DataField type as DataFieldWithUrl"
			},
			{
				oAnnotations: {
					"@com.sap.vocabularies.Common.v1.SemanticObject": "AnySemanticObject"
				},
				sEditMode: "{ui>/editable}",
				expectedValue: "Display",
				sMessage:
					"with semantic object(Link) configured without ValueList/ValueListMapping/ValueListReferences/ValueListWithFixedValues"
			},
			{
				oAnnotations: {
					"@com.sap.vocabularies.Common.v1.SemanticObject": "AnySemanticObject",
					"@com.sap.vocabularies.Common.v1.ValueList": {
						"$Type": "com.sap.vocabularies.Common.v1.ValueListType",
						"Parameters": []
					}
				},
				sEditMode: "{ui>/editable}",
				expectedValue: "{ui>/editable}",
				sMessage: "with semantic object(Link) configured with ValueList"
			},
			{
				oAnnotations: {
					"@com.sap.vocabularies.Common.v1.SemanticObject": "AnySemanticObject",
					"@com.sap.vocabularies.Common.v1.ValueListMapping": {
						"$Type": "com.sap.vocabularies.Common.v1.ValueListMappingType",
						"Parameters": []
					}
				},
				sEditMode: "{ui>/editable}",
				expectedValue: "{ui>/editable}",
				sMessage: "with semantic object(Link) configured with ValueListMapping"
			},
			{
				oAnnotations: {
					"@com.sap.vocabularies.Common.v1.SemanticObject": "AnySemanticObject",
					"@com.sap.vocabularies.Common.v1.ValueListReferences": "some url to fetch value list"
				},
				sEditMode: "{ui>/editable}",
				expectedValue: "{ui>/editable}",
				sMessage: "with semantic object(Link) configured with ValueListReferences"
			},
			{
				oAnnotations: {
					"@com.sap.vocabularies.Common.v1.SemanticObject": "AnySemanticObject",
					"@com.sap.vocabularies.Common.v1.ValueListWithFixedValues": {}
				},
				sEditMode: "{ui>/editable}",
				expectedValue: "{ui>/editable}",
				sMessage: "with semantic object(Link) configured with ValueListWithFixedValues"
			},
			{
				oAnnotations: {
					"@Org.OData.Core.V1.Computed": true
				},
				oDraft: "@com.sap.vocabularies.Common.v1.DraftRoot",
				sEditMode: "Editable",
				expectedValue: "Display",
				sMessage: "with computed as true and is a draft service"
			},
			{
				oAnnotations: {
					"@Org.OData.Core.V1.Computed": true
				},
				oDraft: "@com.sap.vocabularies.Common.v1.DraftRoot",
				sEditMode: "{ui>/editable}",
				sCreateMode: "false",
				sParentControl: "Form",
				expectedValue: "{= ${ui>/editable} === 'Editable' ? 'ReadOnly' : 'Display'}",
				sMessage: "with computed as true and editmode as a binding"
			},
			{
				oAnnotations: {
					"@Org.OData.Core.V1.Immutable": true,
					"@com.sap.vocabularies.Common.v1.FieldControl": {
						$Path: "height"
					}
				},
				oDraft: "@com.sap.vocabularies.Common.v1.DraftRoot",
				oFieldControl: "{height}",
				sEditMode: "{ui>/editable}",
				sCreateMode: "true",
				sParentControl: "Form",
				expectedValue: "{= !%{IsActiveEntity} && !%{HasActiveEntity} ? (${height} === '0'? Disabled : ${height} === '1'? ReadOnly : ${ui>/editable}) : ${ui>/editable} === 'Editable' ? $true? 'Editable' : 'ReadOnly'  : 'Display'}",
				sMessage: "with immutable as true and editmode as a binding (for inapplicable values of fieldControl)"
			},
			{
				oAnnotations: {
					"@Org.OData.Core.V1.Immutable": true
				},
				oDraft: "@com.sap.vocabularies.Common.v1.DraftRoot",
				sEditMode: "Editable",
				expectedValue: "{= !%{IsActiveEntity} && !%{HasActiveEntity} ?'Editable' : 'Display'}",
				sMessage: "with Immutable as true and is a draft service"
			},
			{
				oAnnotations: {
					"@Org.OData.Core.V1.Computed": {
						Bool: "false"
					}
				},
				oDraft: "@com.sap.vocabularies.Common.v1.DraftRoot",
				sEditMode: "{ui>/editable}",
				expectedValue: "{ui>/editable}",
				sMessage: "with Computed as false and is a draft service"
			},
			{
				oAnnotations: {
					"@Org.OData.Core.V1.Immutable": {
						Bool: "false"
					}
				},
				oDraft: "@com.sap.vocabularies.Common.v1.DraftRoot",
				sEditMode: "{ui>/editable}",
				expectedValue: "{= !%{IsActiveEntity} && !%{HasActiveEntity} ? 'Display' : ${ui>/editable}}",
				sMessage: "with Immutable as false and is a draft service"
			},
			{
				oAnnotations: {
					"@com.sap.vocabularies.Common.v1.FieldControl": {
						$EnumMember: "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly"
					}
				},
				oDraft: "@com.sap.vocabularies.Common.v1.DraftNode",
				sEditMode: "Editable",
				oFieldControl: "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly",
				expectedValue: "{= !%{IsActiveEntity} && !%{HasActiveEntity} ?'ReadOnly' : 'Display'}",
				sMessage: "with FieldControl as EnumMember and is a draft service"
			},
			{
				oAnnotations: {
					"@com.sap.vocabularies.Common.v1.FieldControl": {
						$Path: "height"
					}
				},
				oDraft: "@com.sap.vocabularies.Common.v1.DraftNode",
				sEditMode: "{ui>/editable}",
				oFieldControl: "{height}",
				expectedValue: "{= ${height} === '0' ? 'Display' :${height} === '1' ? 'Display' :${ui>/editable}}",
				sMessage: "with FieldControl as Path and is a draft service"
			},
			{
				oAnnotations: {},
				oDraft: "@com.sap.vocabularies.Common.v1.DraftNode",
				sEditMode: "{ui>/editable}",
				expectedValue: "{ui>/editable}",
				sMessage: "without any annotated restrictions"
			},
			{
				isRatingIndicator: true,
				expectedValue: "{= ${ui>/editable} === 'Editable'}",
				sMessage: "with rating indicator without any annotations and not draft"
			},
			{
				oAnnotations: {
					"@Org.OData.Core.V1.Computed": true
				},
				oDraft: "@com.sap.vocabularies.Common.v1.DraftRoot",
				isRatingIndicator: true,
				expectedValue: false,
				sMessage: "with rating indicator and with computed true and draft"
			},
			{
				oAnnotations: {
					"@Org.OData.Core.V1.Immutable": true
				},
				oDraft: "@com.sap.vocabularies.Common.v1.DraftRoot",
				isRatingIndicator: true,
				expectedValue: "{= !%{IsActiveEntity} && !%{HasActiveEntity} ?${ui>/editable} === 'Editable' : false}",
				sMessage: "with rating indicator and with immutable true and draft"
			},
			{
				oAnnotations: {
					"@com.sap.vocabularies.Common.v1.FieldControl": {
						$EnumMember: "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly"
					}
				},
				oDraft: "@com.sap.vocabularies.Common.v1.DraftNode",
				oFieldControl: "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly",
				isRatingIndicator: true,
				expectedValue: "{= !%{IsActiveEntity} && !%{HasActiveEntity} ?${ui>/editable} === 'Editable' : false}",
				sMessage: "with rating indicator and with FieldControl as EnumMember and is a draft service"
			},
			{
				oAnnotations: {
					"@com.sap.vocabularies.Common.v1.FieldControl": {
						$Path: "height"
					}
				},
				oDraft: "@com.sap.vocabularies.Common.v1.DraftNode",
				oFieldControl: "{height}",
				isRatingIndicator: true,
				expectedValue: "{= ${height} === '0' ? false :${height} === '1' ? false :${ui>/editable} === 'Editable'}",
				sMessage: "with rating indicator and with FieldControl as Path and is a draft service"
			},
			{
				sSampleSize: "40",
				isRatingIndicator: true,
				expectedValue: false,
				sMessage: "with rating indicator and with sample size"
			}
		].forEach(function(oProperty) {
			var actualValue = CommonHelper.getEditMode(
				oProperty.oAnnotations,
				oProperty.sDataFieldType,
				oProperty.oFieldControl,
				oProperty.oDraft,
				oProperty.sEditMode,
				oProperty.sCreateMode,
				oProperty.sParentControl,
				oProperty.isRatingIndicator,
				oProperty.sSampleSize
			);
			assert.equal(actualValue, oProperty.expectedValue, "Unit test to check getEditMode " + oProperty.sMessage + ":  ok");
		});
	});

	function getContext(oProperty) {
		return {
			getObject: function(param) {
				return oProperty.objectParam === param ? oProperty.retValue : "";
			},
			getPath: function() {
				return oProperty.path;
			},
			getMetadata: function() {
				return {
					getName: function() {
						return "sap.ui.model.Context";
					}
				};
			}
		};
	}

	QUnit.module("Unit Test for getTargetCollection");
	QUnit.test("Unit test to check getTargetCollection", function(assert) {
		[
			{
				path: "/Products/$Type/@com.sap.vocabularies.UI.v1.Facets/2/Target/$AnnotationPath",
				aNavigationPaths: "to_supplier",
				objectParam: "",
				retValue: "",
				bExpectedValue: "/Products/$NavigationPropertyBinding/to_supplier",
				sAnnotationPathMessage: "with annotationPath containing navigation"
			},
			{
				path: "/Products/@com.sap.vocabularies.UI.v1.Facets/2/Target/$AnnotationPath",
				aNavigationPaths: "to_supplier/$NavigationPropertyBinding/to_department",
				objectParam: "",
				retValue: "",
				bExpectedValue: "/Products/$NavigationPropertyBinding/to_supplier/$NavigationPropertyBinding/to_department",
				sAnnotationPathMessage: "with annotationPath containing multiple navigations"
			},
			{
				path: "/Products/$Type/@com.sap.vocabularies.UI.v1.Facets/2/Target/$AnnotationPath",
				aNavigationPaths: "to_supplier/$NavigationPropertyBinding/to_department",
				objectParam: "$kind",
				retValue: "EntitySet",
				bExpectedValue: "/Products/$Type/@com.sap.vocabularies.UI.v1.Facets/2/Target/$AnnotationPath",
				sAnnotationPathMessage: "with annotationPath containing multiple navigations"
			},
			{
				path: "/Products/$Type/to_supplier",
				aNavigationPaths: undefined,
				objectParam: "",
				retValue: "",
				bExpectedValue: "/Products/$NavigationPropertyBinding/to_supplier",
				sAnnotationPathMessage: "with annotationPath without navigations"
			},
			{
				path: "/Products",
				aNavigationPaths: undefined,
				objectParam: "$kind",
				retValue: "EntitySet",
				bExpectedValue: "/Products",
				sAnnotationPathMessage: "with annotationPath without navigations from List Report"
			}
		].forEach(function(oProperty) {
			var oContext = getContext(oProperty);
			var actualValue = CommonHelper.getTargetCollection(oContext, oProperty.aNavigationPaths);
			assert.equal(
				actualValue,
				oProperty.bExpectedValue,
				"Unit test to check getTargetCollection " + oProperty.sAnnotationPathMessage + " : ok"
			);
		});
	});

	QUnit.module("Unit Test for Hidden annotation / field visibility in ActionDialog");
	QUnit.test("Unit test to check isVisible()", function(assert) {
		[
			{
				oTarget: undefined,
				oInterface: {
					context: {
						getPath: function() {
							return "dummyPath";
						},
						getModel: function() {
							// oModel
							return {
								getObject: function(path) {
									// oAnnotations
									return {
										"@com.sap.vocabularies.UI.v1.Hidden": {
											$Path: "IsActiveEntity"
										}
									};
								}
							};
						}
					}
				},
				sExpectedValue: "{= !${IsActiveEntity} }",
				sMessage: "with UI.Hidden annotation from path IsActiveEntity"
			},
			{
				oTarget: undefined,
				oInterface: {
					context: {
						getPath: function() {
							return "dummyPath";
						},
						getModel: function() {
							return {
								getObject: function(path) {
									return {
										"@com.sap.vocabularies.UI.v1.Hidden": {
											$Path: "HasDraftEntity"
										}
									};
								}
							};
						}
					}
				},
				sExpectedValue: "{= !${HasDraftEntity} }",
				sMessage: "with UI.Hidden annotation from path HasDraftEntity"
			},
			{
				oTarget: undefined,
				oInterface: {
					context: {
						getPath: function() {
							return "dummyPath";
						},
						getModel: function() {
							return {
								getObject: function(path) {
									return {
										"@com.sap.vocabularies.UI.v1.Hidden": true
									};
								}
							};
						}
					}
				},
				sExpectedValue: false,
				sMessage: "with UI.Hidden annotation true"
			},
			{
				oTarget: undefined,
				oInterface: {
					context: {
						getPath: function() {
							return "dummyPath";
						},
						getModel: function() {
							return {
								getObject: function(path) {
									return {
										"@com.sap.vocabularies.UI.v1.Hidden": false
									};
								}
							};
						}
					}
				},
				sExpectedValue: true,
				sMessage: "with UI.Hidden annotation false"
			},
			{
				oTarget: undefined,
				oInterface: {
					context: {
						getPath: function() {
							return "dummyPath";
						},
						getModel: function() {
							return {
								getObject: function(path) {
									return {
										"@com.sap.vocabularies.UI.v1.Hidden": undefined
									};
								}
							};
						}
					}
				},
				sExpectedValue: true,
				sMessage: "without UI.Hidden annotation (undefined)"
			}
		].forEach(function(oProperty) {
			var actualValue = CommonHelper.isVisible(oProperty.oTarget, oProperty.oInterface);
			assert.equal(actualValue, oProperty.sExpectedValue, "Unit test to check isVisible() " + oProperty.sMessage + " : ok");
		});
	});

	QUnit.module("Unit Test for ReadOnly annotation / field editibility in ActionDialog");
	QUnit.test("Unit test to check getParameterEditMode()", function(assert) {
		[
			{
				oTarget: undefined,
				oInterface: {
					context: {
						getPath: function() {
							return "dummyPath";
						},
						getModel: function() {
							// oModel
							return {
								getObject: function(path) {
									// oAnnotations
									return {
										"@com.sap.vocabularies.Common.v1.Label": "Availability"
									};
								}
							};
						}
					}
				},
				sExpectedValue: sap.ui.mdc.EditMode.Editable,
				sMessage: "without ReadOnly annotation"
			},
			/*
			 * Applies to CDS:
			 * @Common.FieldControl: #ReadOnly
			 */
			{
				oTarget: undefined,
				oInterface: {
					context: {
						getPath: function() {
							return "dummyPath";
						},
						getModel: function() {
							return {
								getObject: function(path) {
									return {
										"@com.sap.vocabularies.Common.v1.FieldControl": {
											$EnumMember: "com.sap.vocabularies.Common.v1.FieldControlType/ReadOnly"
										}
									};
								}
							};
						}
					}
				},
				sExpectedValue: sap.ui.mdc.EditMode.ReadOnly,
				sMessage: "with annotation FieldControl: #ReadOnly"
			},
			/*
			 * Applies to CDS:
			 * FieldControl with path, example:
			 * @Common.FieldControl: HasDraftEntity
			 */
			{
				oTarget: undefined,
				oInterface: {
					context: {
						getPath: function() {
							return "dummyPath";
						},
						getModel: function() {
							return {
								getObject: function(path) {
									return {
										"@com.sap.vocabularies.Common.v1.FieldControl": {
											$Path: "HasDraftEntity"
										}
									};
								}
							};
						}
					}
				},
				sExpectedValue: "{= %{HasDraftEntity} ? 'ReadOnly' : 'Editable' }",
				sMessage: "with path HasDraftEntity annotation from FieldControl"
			},
			{
				oTarget: undefined,
				oInterface: {
					context: {
						getPath: function() {
							return "dummyPath";
						},
						getModel: function() {
							return {
								getObject: function(path) {
									return {
										"@Org.OData.Core.V1.Computed": true
									};
								}
							};
						}
					}
				},
				sExpectedValue: sap.ui.mdc.EditMode.ReadOnly,
				sMessage: "with annotation @Core.Computed: true"
			},
			{
				oTarget: undefined,
				oInterface: {
					context: {
						getPath: function() {
							return "dummyPath";
						},
						getModel: function() {
							return {
								getObject: function(path) {
									return {
										"@Org.OData.Core.V1.Computed": false
									};
								}
							};
						}
					}
				},
				sExpectedValue: sap.ui.mdc.EditMode.Editable,
				sMessage: "with annotation @Core.Computed: false"
			},
			{
				oTarget: undefined,
				oInterface: {
					context: {
						getPath: function() {
							return "dummyPath";
						},
						getModel: function() {
							return {
								getObject: function(path) {
									return {
										"@Org.OData.Core.V1.Immutable": true
									};
								}
							};
						}
					}
				},
				sExpectedValue: sap.ui.mdc.EditMode.ReadOnly,
				sMessage: "with annotation @Core.Immutable: true"
			},
			{
				oTarget: undefined,
				oInterface: {
					context: {
						getPath: function() {
							return "dummyPath";
						},
						getModel: function() {
							return {
								getObject: function(path) {
									return {
										"@Org.OData.Core.V1.Immutable": false
									};
								}
							};
						}
					}
				},
				sExpectedValue: sap.ui.mdc.EditMode.Editable,
				sMessage: "with annotation @Core.Immutable: false"
			}
		].forEach(function(oProperty) {
			var actualValue = CommonHelper.getParameterEditMode(oProperty.oTarget, oProperty.oInterface);
			assert.equal(
				actualValue,
				oProperty.sExpectedValue,
				"Unit test to check getParameterEditMode() " + oProperty.sMessage + " : ok"
			);
		});
	});
});
