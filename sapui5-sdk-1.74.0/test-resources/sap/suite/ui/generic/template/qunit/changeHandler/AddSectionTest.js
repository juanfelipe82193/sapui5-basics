/**
 * tests for the sap.suite.ui.generic.template.changeHandler.AddSection
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/AddSection",
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2"
],
function(AddSection, ChangeHandlerUtils, AnnotationChangeHandler) {
	"use strict";

	QUnit.module("AddSection applyChange Test Module");

	QUnit.test("ApplyChange", function(assert) {
		var fnRevertChange = AddSection.applyChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "applyChange method exists for AddSection action");
	});

	QUnit.module("AddSection revertChange Test Module");

	QUnit.test("RevertChange", function(assert) {
		var fnRevertChange = AddSection.revertChange;
		assert.ok(fnRevertChange && typeof fnRevertChange === "function", "revertChange method exists for AddSection action");
	});

	QUnit.module("AddSection completeChangeContent Test Module", {

		beforeEach: function() {
			this.oContent = {};
			this.oChange = {
				getContent: function() {
					return this.oContent;
				}.bind(this)
			};
			this.oPropertyBag = {
				modifier: {
					bySelector: function() {
						return {
							getSections: function() {
								return [{id :"Section1"},
										{id :"Section2"}];
							}
						};
					}
				},
				appComponent: {}
			};

			var oMetaModel = {
				getODataEntityType: function() {}
			};

			this.aFieldGroupNew = {
				Data: [{
					Label: {String: "New Field"},
					RecordType: "com.sap.vocabularies.UI.v1.DataField",
					Value: {Path: ""}
				}],
				RecordType: "com.sap.vocabularies.UI.v1.FieldGroupType"
			};

			this.aOldFacetsTerm = [
				{
					ID: {String: "AnnotatedSection1"},
					RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"
				},
				{
					ID: {String: "AnnotatedSection2"},
					RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet"
				}];

			this.oGetMetaModelStub = sinon.stub(ChangeHandlerUtils, "getMetaModel").returns(oMetaModel);
			this.oGetComponentStub = sinon.stub(ChangeHandlerUtils, "getComponent");
			this.oGetODataEntitySetStub = sinon.stub(ChangeHandlerUtils, "getODataEntitySet").returns({entityType: "STTA_PROD_MAN.STTA_C_MP_ProductType"});
			this.oCreateFieldGroupTermStub = sinon.stub(ChangeHandlerUtils, "createFieldGroupTerm").returns("com.sap.vocabularies.UI.v1.FieldGroup#RTAGroup1");
			this.oCreateAnnotationTermChangeStub = sinon.stub(AnnotationChangeHandler, "createCustomAnnotationTermChange").returns(this.oContent);
			this.oCreateCustomChangesStub = sinon.stub(AnnotationChangeHandler, "createCustomChanges");
			this.getExistingAnnotationsOfEntityType = sinon.stub(AnnotationChangeHandler, "getExistingAnnotationsOfEntityType").returns(this.aOldFacetsTerm); 
		},
		afterEach: function() {
			this.oContent = null;
			this.oChange = null;
			this.oSpecificChangeInfo = null;
			this.oPropertyBag = null;

			this.oGetMetaModelStub.restore();
			this.oGetComponentStub.restore();
			this.oGetODataEntitySetStub.restore();
			this.oCreateFieldGroupTermStub.restore();
			this.oCreateAnnotationTermChangeStub.restore();
			this.oCreateCustomChangesStub.restore();
			this.getExistingAnnotationsOfEntityType.restore();
		}
	});

	QUnit.test("CompleteChangeContent case 1", function(assert) {
		//Arrange
		this.aFacetsTerm = [
			{
				ID: {String: "AnnotatedSection1"},
				RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"
			},
			{
				ID: {String: "AnnotatedSection2"},
				RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet"
			},
			{
				Label: {String: "New Section"},
				ID: {String: "id-1556178170442-175"},
				RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
				Facets: [{
					Label: {String: "New Group"},
					RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
					Target: {AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup#RTAGroup1"}
				}]
			}];
		this.oSpecificChangeInfo = {
			index: 2,
			parentId: "pageLayoutId",
			newControlId: "STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--id-1556178170442-175",
			newLabel: "New: Section"
		};
		var aOldFacets = this.aOldFacetsTerm.slice();

		//Act
		AddSection.completeChangeContent(this.oChange, this.oSpecificChangeInfo, this.oPropertyBag);
		var aFacetParams = this.oCreateAnnotationTermChangeStub.firstCall.args;
		var aFieldGroupParams = this.oCreateAnnotationTermChangeStub.secondCall.args;

		//Assert
		assert.deepEqual(aFacetParams[0], "STTA_PROD_MAN.STTA_C_MP_ProductType", "sEntityType parameter of createCustomAnnotationTermChange for facets is correct.");
		assert.deepEqual(aFacetParams[1], this.aFacetsTerm, "aFacets parameter of createCustomAnnotationTermChange for facets is correct.");
		assert.deepEqual(aFacetParams[2], aOldFacets, "aOldFacets parameter of createCustomAnnotationTermChange for facets is correct.");
		assert.deepEqual(aFacetParams[3], "com.sap.vocabularies.UI.v1.Facets",	"FACETS parameter of createCustomAnnotationTermChange for facets is correct.");

		assert.deepEqual(aFieldGroupParams[0], "STTA_PROD_MAN.STTA_C_MP_ProductType", "sEntityType parameter of createCustomAnnotationTermChange for fieldgroup is correct.");
		assert.deepEqual(aFieldGroupParams[1], this.aFieldGroupNew, "oFieldGroup[sFieldGroupTerm] parameter of createCustomAnnotationTermChange for fieldgroup is correct.");
		assert.deepEqual(aFieldGroupParams[2], {}, "Old fieldgroup parameter of createCustomAnnotationTermChange for fieldgroup is correct.");
		assert.deepEqual(aFieldGroupParams[3], "com.sap.vocabularies.UI.v1.FieldGroup#RTAGroup1", "sFieldGroupTerm parameter of createCustomAnnotationTermChange for fieldgroup is correct.");

	});

	QUnit.test("CompleteChangeContent case 2", function(assert) {
		//Arrange
		this.aFacetsTerm = [
			{
				Label: {String: "New Section"},
				ID: {String: "id-1556178170442-175"},
				RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
				Facets: [{
					Label: {String: "New Group"},
					RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
					Target: {AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup#RTAGroup1"}
				}]
			},
			{
				ID: {String: "AnnotatedSection1"},
				RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"
			},
			{
				ID: {String: "AnnotatedSection2"},
				RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet"
			}];

		this.oSpecificChangeInfo = {
			index: 0,
			parentId: "pageLayoutId",
			newControlId: "STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--id-1556178170442-175",
			newLabel: "New: Section"
		};
		var aOldFacets = this.aOldFacetsTerm.slice();

		//Act
		AddSection.completeChangeContent(this.oChange, this.oSpecificChangeInfo, this.oPropertyBag);
		var aFacetParams = this.oCreateAnnotationTermChangeStub.firstCall.args;

		//Assert
		assert.deepEqual(aFacetParams[0], "STTA_PROD_MAN.STTA_C_MP_ProductType", "sEntityType parameter of createCustomAnnotationTermChange for facets is correct.");
		assert.deepEqual(aFacetParams[1], this.aFacetsTerm, "aFacets parameter of createCustomAnnotationTermChange for facets is correct.");
		assert.deepEqual(aFacetParams[2], aOldFacets, "aOldFacets parameter of createCustomAnnotationTermChange for facets is correct.");
		assert.deepEqual(aFacetParams[3], "com.sap.vocabularies.UI.v1.Facets",	"FACETS parameter of createCustomAnnotationTermChange for facets is correct.");

	});

	QUnit.test("CompleteChangeContent case 3", function(assert) {
		//Arrange
		this.aFacetsTerm = [
			{
				ID: {String: "AnnotatedSection1"},
				RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet"
			},
			{
				Label: {String: "New Section"},
				ID: {String: "id-1556178170442-175"},
				RecordType: "com.sap.vocabularies.UI.v1.CollectionFacet",
				Facets: [{
					Label: {String: "New Group"},
					RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet",
					Target: {AnnotationPath: "@com.sap.vocabularies.UI.v1.FieldGroup#RTAGroup1"}
				}]
			},
			{
				ID: {String: "AnnotatedSection2"},
				RecordType: "com.sap.vocabularies.UI.v1.ReferenceFacet"
			}];

		this.oGetIndexFromInstanceMetadataPathStub = sinon.stub(ChangeHandlerUtils, "getIndexFromInstanceMetadataPath").returns(0);
		this.oSpecificChangeInfo = {
			index: 1,
			parentId: "pageLayoutId",
			newControlId: "STTA_MP::sap.suite.ui.generic.template.ObjectPage.view.Details::STTA_C_MP_Product--id-1556178170442-175",
			newLabel: "New: Section"
		};
		var aOldFacets = this.aOldFacetsTerm.slice();

		//Act
		AddSection.completeChangeContent(this.oChange, this.oSpecificChangeInfo, this.oPropertyBag);
		var aFacetParams = this.oCreateAnnotationTermChangeStub.firstCall.args;

		//Assert
		assert.deepEqual(aFacetParams[0], "STTA_PROD_MAN.STTA_C_MP_ProductType", "sEntityType parameter of createCustomAnnotationTermChange for facets is correct.");
		assert.deepEqual(aFacetParams[1], this.aFacetsTerm, "aFacets parameter of createCustomAnnotationTermChange for facets is correct.");
		assert.deepEqual(aFacetParams[2], aOldFacets, "aOldFacets parameter of createCustomAnnotationTermChange for facets is correct.");
		assert.deepEqual(aFacetParams[3], "com.sap.vocabularies.UI.v1.Facets",	"FACETS parameter of createCustomAnnotationTermChange for facets is correct.");

		// Clean Up
		this.oGetIndexFromInstanceMetadataPathStub.restore();
	});
})