/**
 * tests for the sap.suite.ui.generic.template.ListReport.AnnotationHelper.js and in particular for the SmartChart in multi-tab mode
 */
sap.ui.define([ "sap/ui/model/json/JSONModel",
				 "testUtils/sinonEnhanced",
				 "sap/suite/ui/generic/template/ListReport/AnnotationHelper",
				"sap/suite/ui/generic/template/lib/testableHelper"
				 ], function(JSONModel, sinon, AnnotationHelper, testableHelper){
	"use strict";

	var sandbox; // sinon sandbox
	var oItabItem = {};
	var aSubPages = [];
	var sChartEntitySet;
	var oQuickVariantSelectionX = {};
	
	module("test checkIfChartNavigationIsEnabled", {
		setup : fnCommonSetUp,
		teardown: fnCommonTeardown
	});

	function fnCommonSetUp() {
		this.oAnnotationHelper = AnnotationHelper;
	}

	function fnCommonTeardown() {
		this.oAnnotationHelper = null;
		oItabItem = {};
		aSubPages = [];
		oQuickVariantSelectionX = {};
	}

	function fnPrepareTestDataForChartNavi(bDifferentEntitySets, bTestExternalNavi) {
		oItabItem.entitySet = "entitySetTab1";
		oItabItem.showItemNavigationOnChart = true;
		var oSubPageExtNavi1 = {
			entitySet : "entitySetTab1",
			navigation: {
				display: {
					path: "somePath",
					target: "someTarget"
				}
			}
		};

		var oSubPageExtNavi2 = {
				entitySet : "entitySetTab2",
				navigation: {
					display: {
						path: "somePath",
						target: "someTarget"
					}
				}
			};

		var oSubPageIntNavi1 = {
				entitySet : "entitySetTab1",
				navigation: {
					create: {
						path: "somePath",
						target: "someTarget"
					}
				}
			};

		var oSubPageIntNavi2 = {
				entitySet : "entitySetTab2"
			};

		if (bTestExternalNavi) {
			aSubPages.push(oSubPageExtNavi1);
			aSubPages.push(oSubPageExtNavi2);
		} else {
			aSubPages.push(oSubPageIntNavi1);
			aSubPages.push(oSubPageIntNavi2);
		}

		sChartEntitySet = "ChartEntitySet";
		oQuickVariantSelectionX.variants = {
			1: {
				key: "1",
				annotationPath: "someSelectionVariantPath"
			},
			2: {
				key: "2",
				annotationPath: "someSelectionVariantPath"
			}
		};

		if (bDifferentEntitySets) {
			oQuickVariantSelectionX.variants[1].entitySet = "entitySetTab1";
			oQuickVariantSelectionX.variants[2].entitySet = "entitySetTab2";
		}
	}

	test("test with showItemNavigationOnChart = false, one entitySet, internal navigation", function() {
		fnPrepareTestDataForChartNavi(false, false);
		oItabItem.showItemNavigationOnChart = false;
		var bNaviEnabled = this.oAnnotationHelper.checkIfChartNavigationIsEnabled(oItabItem, aSubPages, sChartEntitySet, oQuickVariantSelectionX);
		assert.ok(!bNaviEnabled, "Navi should be disabled for showItemNavigationOnChart = false with one entitySet");
	});

	test("test with showItemNavigationOnChart = false, one entitySet, external navigation", function() {
		fnPrepareTestDataForChartNavi(false, true);
		oItabItem.showItemNavigationOnChart = false;
		var bNaviEnabled = this.oAnnotationHelper.checkIfChartNavigationIsEnabled(oItabItem, aSubPages, sChartEntitySet, oQuickVariantSelectionX);
		assert.ok(!bNaviEnabled, "Navi should be disabled for showItemNavigationOnChart = false with one entitySet");
	});

	test("test with showItemNavigationOnChart = false, different entitySets, internal navigation", function() {
		fnPrepareTestDataForChartNavi(true, false);
		oItabItem.showItemNavigationOnChart = false;
		var bNaviEnabled = this.oAnnotationHelper.checkIfChartNavigationIsEnabled(oItabItem, aSubPages, sChartEntitySet, oQuickVariantSelectionX);
		assert.ok(!bNaviEnabled, "Navi should be disabled for showItemNavigationOnChart = false with different entitySets");
	});

	test("test with showItemNavigationOnChart = false, different entitySets, external navigation", function() {
		fnPrepareTestDataForChartNavi(true, true);
		oItabItem.showItemNavigationOnChart = false;
		var bNaviEnabled = this.oAnnotationHelper.checkIfChartNavigationIsEnabled(oItabItem, aSubPages, sChartEntitySet, oQuickVariantSelectionX);
		assert.ok(!bNaviEnabled, "Navi should be disabled for showItemNavigationOnChart = false with different entitySets");
	});

	test("test external navigation with one entitySet", function() {
		fnPrepareTestDataForChartNavi(false, true);
		oItabItem.showItemNavigationOnChart = true;
		var bNaviEnabled = this.oAnnotationHelper.checkIfChartNavigationIsEnabled(oItabItem, aSubPages, sChartEntitySet, oQuickVariantSelectionX);
		assert.ok(bNaviEnabled, "external navi should be supported ");
	});

	test("test external navigation with different entitySets", function() {
		fnPrepareTestDataForChartNavi(true, true);
		oItabItem.showItemNavigationOnChart = true;
		var bNaviEnabled = this.oAnnotationHelper.checkIfChartNavigationIsEnabled(oItabItem, aSubPages, sChartEntitySet, oQuickVariantSelectionX);
		assert.ok(bNaviEnabled, "external navi should be supported ");
	});

	test("test internal navigation with one entitySet", function() {
		fnPrepareTestDataForChartNavi(false, false);
		oItabItem.showItemNavigationOnChart = true;
		var bNaviEnabled = this.oAnnotationHelper.checkIfChartNavigationIsEnabled(oItabItem, aSubPages, sChartEntitySet, oQuickVariantSelectionX);
		assert.ok(bNaviEnabled, "internal navi should be supported ");
	});

	test("test internal navigation with different entitySets", function() {
		fnPrepareTestDataForChartNavi(false, false);
		oItabItem.showItemNavigationOnChart = true;
		var bNaviEnabled = this.oAnnotationHelper.checkIfChartNavigationIsEnabled(oItabItem, aSubPages, sChartEntitySet, oQuickVariantSelectionX);
		assert.ok(bNaviEnabled, "internal navi should be not supported with different entitySets ");
	});

});
