/* global QUnit */
sap.ui.define([
	"sap/ui/thirdparty/sinon",
	"sap/fe/macros/StableIdHelper",
	"sap/ui/thirdparty/sinon-qunit"
],
function (sinon, StableIdHelper) {
	"use strict";
	QUnit.module("Stable Id", {});

	QUnit.test("generate stable id with constants", function (assert) {
		[{
			aIdParts: ['filterBar'],
			sId: 'filterBar'
		},{
			aIdParts: ['template', 'filterBar'],
			sId: 'template::filterBar'
		},{
			aIdParts: ['template', 'table', 'column'],
			sId: 'template::table::column'
		}].forEach(function (oElement) {
			assert.equal(StableIdHelper.generate(oElement.aIdParts), oElement.sId, 'Correct Id generated.');
		});
	});

	QUnit.test("generate stable id with constants and special characters", function (assert) {
		[{
			aIdParts: ['template/filterBar'],
			sId: 'template::filterBar'
		},{
			aIdParts: ['template/table/column'],
			sId: 'template::table::column'
		},{
			aIdParts: ['template#table@column'],
			sId: 'template::table::column'
		},{
			aIdParts: ['/template/filterBar/'],
			sId: 'template::filterBar'
		},{
			aIdParts: ['@template/table/column@'],
			sId: 'template::table::column'
		},{
			aIdParts: ['#template#table@column#'],
			sId: 'template::table::column'
		}].forEach(function (oElement) {
			assert.equal(StableIdHelper.generate(oElement.aIdParts), oElement.sId, 'Correct Id generated.');
		});
	});

	QUnit.test("generate parameterized stable id from Reference Facet", function (assert) {
		[{
			oParameter: {
				Facet: {
					$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
					Label: "Assigned Persons",
					Target: {
						$AnnotationPath: "_PersAssign/@com.sap.vocabularies.UI.v1.LineItem"
					}
				}
			},
			sId: 'section::_PersAssign::com.sap.vocabularies.UI.v1.LineItem'
		}, {
			oParameter: {
				Facet: {
					$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
					Label: "Assigned Persons",
					Target: {
						$AnnotationPath: "_PersAssign/@com.sap.vocabularies.UI.v1.LineItem"
					},
					ID: {
						String: "PersAssign"
					}
				}
			},
			sId: 'section::PersAssign'
		}].forEach(function (oElement) {
			assert.equal(StableIdHelper.generate(['section', oElement.oParameter]), oElement.sId, 'Correct Id generated.');
		});
	});
	QUnit.test("multiple back to back occurrences of separator (::) should be combined into one", function (assert) {
		[{
			oParameter: {
				Facet: {
					$Type: "com.sap.vocabularies.UI.v1.ReferenceFacet",
					Label: "Assigned Persons",
					Target: {
						$AnnotationPath: "_PersAssign/@@@/@com.sap.vocabularies.UI.v1.LineItem"
					}
				}
			},
			sId: 'section::_PersAssign::com.sap.vocabularies.UI.v1.LineItem'
		}].forEach(function (oElement) {
			assert.equal(StableIdHelper.generate(['section', oElement.oParameter]), oElement.sId, 'Correct Id generated.');
		});
	});
	QUnit.test("generate parameterized stable id from Collection Facet", function (assert) {
		[{
			oParameter: {
				Facet: {
					$Type: "com.sap.vocabularies.UI.v1.CollectionFacet",
					Label: "General Info Facet Label",
					ID: 'GeneralInformation'
				}
			},
			sId: 'section::GeneralInformation'
		}].forEach(function (oElement) {
			assert.equal(StableIdHelper.generate(['section', oElement.oParameter]), oElement.sId, 'Correct Id generated.');
		});
	});

	QUnit.test("Stable Id helper should throw an error", function (assert) {
		[{
			aId: ['Hello=)*&^'],
			sError: 'Hello=)*&^ - Stable Id could not be generated due to insufficient information.'
		},{
			aId: ['Stable Id'],
			sError: 'Stable Id - Spaces are not allowed in ID parts.'
		}].forEach(function(oElement) {
			assert.throws(
				function() { StableIdHelper.generate(oElement.aId); },
				function(sError) { return sError === oElement.sError; },
				'Appropriate error thrown'
			);
		});
	});

});
