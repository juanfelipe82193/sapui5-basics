/**
 * tests for the sap.suite.ui.generic.template.designtime.virtualProperties.SectionType.js
 */

sap.ui.define([
		"sap/suite/ui/generic/template/designtime/virtualProperties/SectionType"
	],
	function(SectionType) {
		"use strict";

		QUnit.dump.maxDepth = 20;

		/***************************************************/
		QUnit.module("The function getSectionTypeValues");

		QUnit.test("getSectionTypeValues", function() {
			// Arrange
			var oExpectedValue = {
				SmartForm: {
					displayName: "Smart Form"
				},
				SmartTable: {
					displayName: "Smart Table"
				},
				SmartChart: {
					displayName: "Smart Chart"
				},
				Contact: {
					displayName: "Contact"
				},
				Address: {
					displayName: "Address"
				}
			};

			// Act
			var oActualValue = SectionType.getSectionTypeValues();

			// Assert
			assert.deepEqual(oActualValue, oExpectedValue , "returns expected values");
		});
	});