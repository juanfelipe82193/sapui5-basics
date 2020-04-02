/* eslint-disable consistent-return */
/* global QUnit */
sap.ui.define(["sap/ui/thirdparty/sinon", "sap/fe/macros/form/FormHelper", "sap/base/Log", "sap/ui/thirdparty/sinon-qunit"], function(
	sinon,
	FormHelper,
	Log
) {
	"use strict";
	// var sandbox = sinon.sandbox.create();

	QUnit.module("Unit Test for checkIfCollectionFacetNeedsToBeRendered");
	QUnit.test("Unit test to check checkIfCollectionFacetNeedsToBeRendered with partOfPreview", function(assert) {
		[
			{
				collectionFacet: {
					$Type: "com.sap.vocabularies.UI.v1.CollectionFacet",
					Facets: [
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"@com.sap.vocabularies.UI.v1.PartOfPreview": true
						},
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"@com.sap.vocabularies.UI.v1.PartOfPreview": true
						},
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"@com.sap.vocabularies.UI.v1.PartOfPreview": false
						}
					]
				},
				partOfPreview: "true",
				bExpectedValue: true,
				sMessage:
					"ReferenceFacets with 'com.sap.vocabularies.UI.v1.PartOfPreview' as 'true' for some ReferenceFacet, and as 'false' for others"
			},
			{
				collectionFacet: {
					$Type: "com.sap.vocabularies.UI.v1.CollectionFacet",
					Facets: [
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"@com.sap.vocabularies.UI.v1.PartOfPreview": true
						},
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"@com.sap.vocabularies.UI.v1.PartOfPreview": true
						},
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"@com.sap.vocabularies.UI.v1.PartOfPreview": false
						}
					]
				},
				partOfPreview: "false",
				bExpectedValue: true,
				sMessage:
					"ReferenceFacets with 'com.sap.vocabularies.UI.v1.PartOfPreview' as 'false' for some ReferenceFacets, and as 'true' for others"
			},
			{
				collectionFacet: {
					$Type: "com.sap.vocabularies.UI.v1.CollectionFacet",
					Facets: [
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet"
						},
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet"
						},
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"@com.sap.vocabularies.UI.v1.PartOfPreview": false
						}
					]
				},
				partOfPreview: "true",
				bExpectedValue: true,
				sMessage:
					"ReferenceFacets with 'com.sap.vocabularies.UI.v1.PartOfPreview' as 'false' for one ReferenceFacet, and not available for others"
			},
			{
				collectionFacet: {
					$Type: "com.sap.vocabularies.UI.v1.CollectionFacet",
					Facets: [
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet"
						},
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet"
						},
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet"
						}
					]
				},
				partOfPreview: "false",
				bExpectedValue: false,
				sMessage: "all ReferenceFacets without 'com.sap.vocabularies.UI.v1.PartOfPreview'"
			},
			{
				collectionFacet: {
					$Type: "com.sap.vocabularies.UI.v1.CollectionFacet",
					Facets: [
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"@com.sap.vocabularies.UI.v1.PartOfPreview": false
						},
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"@com.sap.vocabularies.UI.v1.PartOfPreview": false
						},
						{
							$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
							"@com.sap.vocabularies.UI.v1.PartOfPreview": false
						}
					]
				},
				partOfPreview: "true",
				bExpectedValue: false,
				sMessage: "all ReferenceFacets with 'com.sap.vocabularies.UI.v1.PartOfPreview' as 'false'"
			},
			{
				collectionFacet: {
					$Type: "com.sap.vocabularies.UI.v1.CollectionFacet",
					Facets: []
				},
				partOfPreview: "false",
				bExpectedValue: false,
				sMessage: "no ReferenceFacets"
			},
			{
				collectionFacet: {
					$Type: "com.sap.vocabularies.UI.v1.CollectionFacet",
					Facets: []
				},
				partOfPreview: "true",
				bExpectedValue: false,
				sMessage: "no ReferenceFacets"
			}
		].forEach(function(oProperty) {
			var actualValue = FormHelper.checkIfCollectionFacetNeedsToBeRendered(oProperty.collectionFacet, oProperty.partOfPreview);
			assert.equal(
				actualValue,
				oProperty.bExpectedValue,
				"Unit test to check checkIfCollectionFacetNeedsToBeRendered with partOfPreview: " +
					oProperty.partOfPreview +
					" and collectionFacet with " +
					oProperty.sMessage +
					" : ok"
			);
		});
	});

	QUnit.module("Unit Test for resolveAnnotationPathForForm");
	QUnit.test("Unit test to check resolveAnnotationPathForForm for fomrs with navigation", function(assert) {
		[
			{
				annotationPath: "to_supplier/@com.sap.vocabularies.UI.v1.FieldGroup#F1",
				path: "/Products/$Type/@com.sap.vocabularies.UI.v1.Facets/2/Target/$AnnotationPath",
				bExpectedValue: "/Products/$NavigationPropertyBinding/to_supplier/@com.sap.vocabularies.UI.v1.FieldGroup#F1",
				sAnnotationPathMessage: "with annotationPath containing navigation"
			},
			{
				annotationPath: "to_supplier/to_department/@com.sap.vocabularies.UI.v1.Identification",
				path: "/Products/$Type/@com.sap.vocabularies.UI.v1.Facets/2/Target/$AnnotationPath",
				bExpectedValue:
					"/Products/$NavigationPropertyBinding/to_supplier/$NavigationPropertyBinding/to_department/@com.sap.vocabularies.UI.v1.Identification",
				sAnnotationPathMessage: "with annotationPath containing multiple navigations"
			},
			{
				annotationPath: "@com.sap.vocabularies.UI.v1.Identification",
				path: "/Products/$Type/@com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target/$AnnotationPath",
				bExpectedValue: "/Products/$Type/@com.sap.vocabularies.UI.v1.Facets/0/Facets/0/Target/$AnnotationPath",
				sAnnotationPathMessage: "with annotationPath not containing navigation"
			}
		].forEach(function(oProperty) {
			var oContext = {
				getObject: function() {
					return oProperty.annotationPath;
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
			var actualValue = FormHelper.resolveAnnotationPathForForm(oContext);
			assert.equal(
				actualValue,
				oProperty.bExpectedValue,
				"Unit test to check resolveAnnotationPathForForm " + oProperty.sAnnotationPathMessage + " : ok"
			);
		});
	});
});
