/*
 * tests for the sap.suite.ui.generic.template.AnalyticalListPage.util.AnnotationHelper
 */
/* global QUnit module sap */
sap.ui.define(
	["testUtils/sinonEnhanced", "sap/suite/ui/generic/template/AnalyticalListPage/util/AnnotationHelper", "sap/ui/model/json/JSONModel", "sap/suite/ui/generic/template/lib/AjaxHelper"],
	function(sinon, ALPHelper, JSONModel, AjaxHelper) {
		"use strict";
		var sMetaModelUrl = "test-resources/sap/suite/ui/generic/template/qunit/AnalyticalListPage/util/testdata/MetaModel.json",
			oMetaModel = AjaxHelper.syncGetJSON(sMetaModelUrl).data,
			oMetaJSONModel = new JSONModel(oMetaModel),
			oParameter = {
				entitySet: "ZCOSTCENTERCOSTSQUERY0020",
				settings: {
					"qualifier": "_MainContent",
					"chartPresentationQualifier": "Donut"
				}
			},
			oContext = {},
			oWorkingContext = {},
			oSandbox;

		module("Test ALP AnnotationHelper Function createWorkingContext", {
			setup: function() {
				oSandbox = sinon.sandbox.create();
				oSandbox.stub(oMetaJSONModel, "getODataEntitySet", function() {
					return oMetaJSONModel.getObject("/dataServices/schema/0/entityContainer/0/entitySet/0");
				});
				oSandbox.stub(oMetaJSONModel, "getODataEntityType", function() {
					return oMetaJSONModel.getObject("/dataServices/schema/0/entityType/0");
				});
				oSandbox.stub(oContext, "getObject", function() {
					return oParameter;
				});
				oSandbox.stub(oContext, "getModel", function() {
					return {
						getProperty: function() {
							return oMetaJSONModel;
						},
						setProperty: function(dummy, woCo) {
							oWorkingContext = woCo;
						}
					};
				});
			},
			teardown: function() {
				oSandbox.restore();
			}
		});

		/**
		 * Test cases for PresentationVariant MainContent given in application descriptor
		 */
		QUnit.test("Test check if an exception is raised for a wrong (non-existing) qualifier", function(assert) {
			//Default context is set for PresentationVariant _MainContent
			//This qualifier doesn't exist
			var bCaughtException = false;
			try {
				ALPHelper.createWorkingContext(oContext);
			} catch (e) {
				bCaughtException = true;
			}
			assert.ok(bCaughtException, "A wrong qualifier successfully caused a javascript exception");
		});


		QUnit.test("Test check if LineItem comes from MainContent PresentationVariant and Chart annotations are from Donut PresentationVariant", function(assert) {
			//Fix the wrong qualifier _MainContent -> MainContent
			oParameter.settings.qualifier = oParameter.settings.qualifier.slice(1);
			//Default context is set for PresentationVariant MainContent
			ALPHelper.createWorkingContext(oContext);
			//Result is given in oWorkingContext
			assert.equal(oWorkingContext.lineItemQualifier, "fromPresentationVariantMainContent", "Uses LineItem annotation from PresentationVariant MainContent");
			assert.equal(oWorkingContext.chartQualifier, "Donut", "Uses Chart annotation from PresentationVariant Donut");
		});


		QUnit.test("Test check if LineItem and Chart annotations are from PresentationVariant MainContent", function(assert) {
			// remove the chartPresentationQualifier and test the deault use cases
			delete oParameter.settings.chartPresentationQualifier;
			//Default context is set for PresentationVariant MainContent
			ALPHelper.createWorkingContext(oContext);
			//Result is given in oWorkingContext
			assert.equal(oWorkingContext.lineItemQualifier, "fromPresentationVariantMainContent", "Uses LineItem annotation from PresentationVariant MainContent");
			assert.equal(oWorkingContext.chartQualifier, "fromPresentationVariantMainContent", "Uses Chart annotation from PresentationVariant MainContent");
		});

		QUnit.test("Test check if LineItem and Chart annotations are from default PresentationVariant", function(assert) {
			//Default context is set to no PresentationVariantQualifier so should use default PresentationVariant
			delete oParameter.settings.qualifier;
			ALPHelper.createWorkingContext(oContext);
			//Result is given in oWorkingContext
			assert.equal(oWorkingContext.lineItemQualifier, "fromDefaultPresentationVariant", "Uses LineItem annotation from default PresentationVariant");
			assert.equal(oWorkingContext.chartQualifier, "fromDefaultPresentationVariant", "Uses Chart annotation from default PresentationVariant");
		});

		QUnit.test("Test check if LineItem and Chart annotations are from default PresentationVariant", function(assert) {
			//Default remove default PresentationVariant from annotations
			delete oMetaJSONModel.getObject("/dataServices/schema/0/entityType/0")["com.sap.vocabularies.UI.v1.PresentationVariant"];
			ALPHelper.createWorkingContext(oContext);
			//Result is given in oWorkingContext
			assert.equal(oWorkingContext.lineItemQualifier, "", "Uses default LineItem annotation as no PresentationVariant was specified");
			assert.equal(oWorkingContext.chartQualifier, "", "Uses Chart annotation annotation as no PresentationVariant was specified");
		});

	}
);
