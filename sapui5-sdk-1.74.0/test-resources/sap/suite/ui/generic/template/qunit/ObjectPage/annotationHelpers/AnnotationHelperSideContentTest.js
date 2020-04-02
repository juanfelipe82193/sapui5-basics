/*
 * tests for the sap.suite.ui.generic.template.ObjectPage.annotationHelpers.AnnotationHelperSideContent
 */

sap.ui.define([
	"sap/suite/ui/generic/template/ObjectPage/annotationHelpers/AnnotationHelperSideContent"
], function(AnnotationHelperSideContent) {
	"use strict";
	
	module("All tests", {
	});	

	QUnit.test("Check getSideContentExtensionPoint function", function() {
		var oFacet = {
				Label:{String:"{@i18n>@SalesData}"},
				RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
				Target:{AnnotationPath:"to_ProductSalesData/@com.sap.vocabularies.UI.v1.Chart"}
		};
		var sEntitySet = "STTA_C_MP_Product";
		var oManifestExtend = {
			"BeforeMainContent|STTA_C_MP_Product|to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart":{
				"className": "sap.ui.core.Fragment",
				"fragmentName": "STTA_MP.ext.fragments.SideContentExtension",
				"type": "XML"
			}
		};
		var sExtensionPoint = "BeforeMainContent|STTA_C_MP_Product|to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart";
		var result = AnnotationHelperSideContent.getSideContentExtensionPoint(sEntitySet, oFacet, oManifestExtend);
		assert.equal(result, sExtensionPoint, "Extension point fetched correctly" );
		
		oFacet = {
				Label:{String:"{@i18n>@SalesRevenue}"},
				RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
				Target:{AnnotationPath:"to_ProductSalesData/@com.sap.vocabularies.UI.v1.LineItem"}
		};
		
		sExtensionPoint = false;
		result = AnnotationHelperSideContent.getSideContentExtensionPoint(sEntitySet, oFacet, oManifestExtend);
		assert.equal(result, sExtensionPoint, "Extension point fetched correctly" );
		
	});

	QUnit.test("Check getSideContentPosition function", function() {
		var sEntitySet = "STTA_C_MP_Product";
		var oManifestExtend = {
			"BeforeMainContent|STTA_C_MP_Product|to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart":{
				"className": "sap.ui.core.Fragment",
				"fragmentName": "STTA_MP.ext.fragments.SideContentExtension",
				"type": "XML"
			},
			"AfterMainContent|STTA_C_MP_Product|to_ProductSalesData::com.sap.vocabularies.UI.v1.LineItem":{
				"className": "sap.ui.core.Fragment",
				"fragmentName": "STTA_MP.ext.fragments.SideContentExtension",
				"type": "XML"
			}
		};
		var oFacet = {
				Label:{String:"{@i18n>@SalesData}"},
				RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
				Target:{AnnotationPath:"to_ProductSalesData/@com.sap.vocabularies.UI.v1.Chart"}
		};
		
		var result = AnnotationHelperSideContent.getSideContentPosition(sEntitySet, oFacet, oManifestExtend);
		assert.equal(result, "Begin", "Extension point position fetched correctly" );
		
		oFacet = {
				Label:{String:"{@i18n>@SalesRevenue}"},
				RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
				Target:{AnnotationPath:"to_ProductSalesData/@com.sap.vocabularies.UI.v1.LineItem"}
		};
		result = AnnotationHelperSideContent.getSideContentPosition(sEntitySet, oFacet, oManifestExtend);
		assert.equal(result, "End", "Extension point position fetched correctly" );
	});

	QUnit.test("Check getEqualSplit function", function() {
		var sEntitySet = "STTA_C_MP_Product";
		var oManifestExtend = {
			"BeforeMainContent|STTA_C_MP_Product|to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart":{
				"className": "sap.ui.core.Fragment",
				"fragmentName": "STTA_MP.ext.fragments.SideContentExtension",
				"type": "XML",
				"equalSplit":true
			},
			"AfterMainContent|STTA_C_MP_Product|to_ProductSalesData::com.sap.vocabularies.UI.v1.LineItem":{
				"className": "sap.ui.core.Fragment",
				"fragmentName": "STTA_MP.ext.fragments.SideContentExtension",
				"type": "XML"
			}
		};
		var oFacet = {
				Label:{String:"{@i18n>@SalesData}"},
				RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
				Target:{AnnotationPath:"to_ProductSalesData/@com.sap.vocabularies.UI.v1.Chart"}
		};

		var bResult = AnnotationHelperSideContent.getEqualSplitValue(sEntitySet, oFacet, oManifestExtend);
		assert.equal(bResult, true , "equalSplit property is set correctly when defined as true" );

		oManifestExtend["BeforeMainContent|STTA_C_MP_Product|to_ProductSalesData::com.sap.vocabularies.UI.v1.Chart"].equalSplit = false;

		var bResult = AnnotationHelperSideContent.getEqualSplitValue(sEntitySet, oFacet, oManifestExtend);
		assert.equal(bResult, false , "equalSplit property is set correctly when defined as false" );

		oFacet = {
				Label:{String:"{@i18n>@SalesRevenue}"},
				RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
				Target:{AnnotationPath:"to_ProductSalesData/@com.sap.vocabularies.UI.v1.LineItem"}
		};
		bResult = AnnotationHelperSideContent.getEqualSplitValue(sEntitySet, oFacet, oManifestExtend);
		assert.equal(bResult, false, "equalSplit property is set correctly when not defined");
	});
});
