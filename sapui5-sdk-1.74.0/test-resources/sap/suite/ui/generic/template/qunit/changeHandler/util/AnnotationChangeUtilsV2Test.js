/**
 * tests for the sap.suite.ui.generic.template.changeHandler.util.AnnotationChangeUtilsV2
 */
sap.ui.define([
		"testUtils/sinonEnhanced",
		"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2"
	],
	function(sinon, AnnotationHandler) {
		"use strict";


		QUnit.test("AnnotationHandler exists", function() {
			assert.notEqual(AnnotationHandler, "undefined", "The AnnotationHandler object exists.");
		});

		QUnit.test("The function createAnnotationChangeContent creates the change command content", function() {
			// Arrange
			var oAnnotationChangeContent, oAnnotation, sTargetType, sAnnotationTerm;

			oAnnotation = {foo: "bar"};
			sTargetType = "entityType";
			sAnnotationTerm = "term";

			// Act
			oAnnotationChangeContent = AnnotationHandler.createAnnotationChangeContent(oAnnotation, sTargetType, sAnnotationTerm);

			// Assert
			var oTargetAnnotation = oAnnotationChangeContent[sTargetType];
			assert.deepEqual(oAnnotationChangeContent, {"entityType": {"term": {"foo": "bar"}}}, "The target type that has been passed as a parameter is properly set as a new property of annotations.");
			assert.deepEqual(oTargetAnnotation, {"term": {"foo": "bar"}}, "The annotation term is used as key.");
			assert.deepEqual(oTargetAnnotation[sAnnotationTerm], oAnnotation, "The annotation object that has been passed as a parameter is correctly added as a target annotation.");
		});

		QUnit.module("The function updateAnnotationProperty", {
			beforeEach: function() {
				this.oCreateProperty = sinon.spy(AnnotationHandler, "_createProperty");
			},

			afterEach: function() {
				this.oCreateProperty.restore();
			}
		});

		QUnit.test("updates an existing property of type PrimitiveType", function() {
			// Arrange
			var oAnnotation = {
					Value: {
						Path: "Product"
					}
				},
				oPropertyContent = {
					propertyName: "Value",
					propertyType: "Path",
					propertyValue: "Supplier"

				},
				oExpected = {
					Value: {
						Path: "Supplier"
					}
				};

			// Act
			var oResult = AnnotationHandler.updateAnnotationProperty(oAnnotation, oPropertyContent);

			// Assert
			assert.equal(this.oCreateProperty.calledOnce, true, "The update of the property is triggered.");
			assert.ok(this.oCreateProperty.calledWith(oPropertyContent.propertyType, oPropertyContent.propertyValue),
				"The function _createProperty has been called with the right parameters.");
			assert.deepEqual(oResult, oExpected, "The updated property was returned");
		});

		QUnit.test("creates a non existing property of type PrimitiveType", function() {
			// Arrange
			var oAnnotation = {},
				oPropertyContent = {
					propertyName: "Label",
					propertyType: "String",
					propertyValue: "My Label"
				},
				oExpected = {
					Label: {
						String: "My Label"
					}
				};

			// Act
			var oResult = AnnotationHandler.updateAnnotationProperty(oAnnotation, oPropertyContent);

			// Assert
			assert.equal(this.oCreateProperty.calledOnce, true, "The update of the property is triggered.");
			assert.ok(this.oCreateProperty.calledWith(oPropertyContent.propertyType, oPropertyContent.propertyValue),
				"The function _createProperty has been called with the right parameters.");
			assert.deepEqual(oResult, oExpected, "A new property was created");
		});

		QUnit.test("updates an existing property of type EnumType", function() {
			// Arrange
			var oAnnotation = {
					CriticalityRepresentation: {
						EnumMember: "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithIcon"
					}
				},
				oPropertyContent = {
					propertyName: "CriticalityRepresentation",
					propertyType: "EnumMember",
					propertyValue: "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon"
				},
				oExpected = {
					CriticalityRepresentation: {
						EnumMember: "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon"
					}
				};

			// Act
			var oResult = AnnotationHandler.updateAnnotationProperty(oAnnotation, oPropertyContent);

			// Assert
			assert.equal(this.oCreateProperty.calledOnce, true, "The update of the property is triggered.");
			assert.ok(this.oCreateProperty.calledWith(oPropertyContent.propertyType, oPropertyContent.propertyValue),
				"The function _createProperty has been called with the right parameters.");
			assert.deepEqual(oResult, oExpected, "The updated property was returned");
		});

		QUnit.test("creates a non existing property of type EnumType", function() {
			// Arrange
			var oAnnotation = {},
				oPropertyContent = {
					propertyName: "CriticalityRepresentation",
					propertyType: "EnumMember",
					propertyValue: "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon"
				},
				oExpected = {
					CriticalityRepresentation: {
						EnumMember: "com.sap.vocabularies.UI.v1.CriticalityRepresentationType/WithoutIcon"
					}
				};

			// Act
			var oResult = AnnotationHandler.updateAnnotationProperty(oAnnotation, oPropertyContent);

			// Assert
			assert.equal(this.oCreateProperty.calledOnce, true, "The update of the property is triggered.");
			assert.ok(this.oCreateProperty.calledWith(oPropertyContent.propertyType, oPropertyContent.propertyValue),
				"The function _createProperty has been called with the right parameters.");
			assert.deepEqual(oResult, oExpected, "A new property was created");
		});

		QUnit.test("updates a property of an applicable annotation term", function() {
			// Arrange
			var oAnnotation = {
					"com.sap.vocabularies.UI.v1.Importance": {
						EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
					}
				},
				oPropertyContent = {
					propertyName: "com.sap.vocabularies.UI.v1.Importance",
					propertyType: "EnumMember",
					propertyValue: "com.sap.vocabularies.UI.v1.ImportanceType/Medium"

				},
				oExpected = {
					"com.sap.vocabularies.UI.v1.Importance": {
						EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
					}
				};

			// Act
			var oResult = AnnotationHandler.updateAnnotationProperty(oAnnotation, oPropertyContent);

			// Assert
			assert.equal(this.oCreateProperty.calledOnce, true, "The update of the property is triggered.");
			assert.ok(this.oCreateProperty.calledWith(oPropertyContent.propertyType, oPropertyContent.propertyValue),
				"The function _createProperty has been called with the right parameters.");
			assert.deepEqual(oResult, oExpected, "The updated property was returned");
		});

		QUnit.test("creates a non existing applicable annotation term", function() {
			// Arrange
			var oAnnotation = {},
				oPropertyContent = {
					propertyName: "com.sap.vocabularies.UI.v1.Importance",
					propertyType: "EnumMember",
					propertyValue: "com.sap.vocabularies.UI.v1.ImportanceType/Medium"

				},
				oExpected = {
					"com.sap.vocabularies.UI.v1.Importance": {
						EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/Medium"
					}
				};

			// Act
			var oResult = AnnotationHandler.updateAnnotationProperty(oAnnotation, oPropertyContent);

			// Assert
			assert.equal(this.oCreateProperty.calledOnce, true, "The update of the property is triggered.");
			assert.ok(this.oCreateProperty.calledWith(oPropertyContent.propertyType, oPropertyContent.propertyValue),
				"The function _createProperty has been called with the right parameters.");
			assert.deepEqual(oResult, oExpected, "A new property was created");
		});

		QUnit.test("updates an existing property of type PropertyPath", function() {
			// Arrange
			var oAnnotation = {
					PropertyPath: "Product"
				},
				oPropertyContent = {
					propertyName: "PropertyPath",
					propertyType: "PropertyPath",
					propertyValue: "Supplier"

				},
				oExpected = {
					PropertyPath: "Supplier"
				};

			// Act
			var oResult = AnnotationHandler.updateAnnotationProperty(oAnnotation, oPropertyContent);

			// Assert
			assert.deepEqual(oResult, oExpected, "The updated property was returned");
		});

		QUnit.test("updates an existing property of type PropertyPath as part of a virtual property", function() {
			// Arrange
			var oAnnotation = {
					Measure: {
						PropertyPath: "Product"
					}
				},
				oPropertyContent = {
					propertyName: "Measure",
					propertyType: "PropertyPath",
					propertyValue: "Supplier"

				},
				oExpected = {
					Measure: {
						PropertyPath: "Supplier"
					}
				};

			// Act
			var oResult = AnnotationHandler.updateAnnotationProperty(oAnnotation, oPropertyContent);

			// Assert
			assert.deepEqual(oResult, oExpected, "The updated property was returned");
		});

		QUnit.test("creates a non existing property of type PropertyType", function() {
			// Arrange
			var oAnnotation = {},
				oPropertyContent = {
					propertyName: "PropertyPath",
					propertyType: "PropertyPath",
					propertyValue: "Supplier"

				},
				oExpected = {
					PropertyPath: "Supplier"
				};

			// Act
			var oResult = AnnotationHandler.updateAnnotationProperty(oAnnotation, oPropertyContent);

			// Assert
			assert.equal(this.oCreateProperty.calledOnce, true, "The update of the property is triggered.");
			assert.ok(this.oCreateProperty.calledWith(oPropertyContent.propertyType, oPropertyContent.propertyValue),
				"The function _createProperty has been called with the right parameters.");
			assert.deepEqual(oResult, oExpected, "A new property was created");
		});

		QUnit.test("does nothing if there is no key with the property name in the annotation and the change type is an expression type", function() {
			// Arrange
			var oResult,
				oPropertyContent = {
					changeType: "expression"
				};

			// Act
			oResult = AnnotationHandler.updateAnnotationProperty({}, oPropertyContent);

			// Assert
			assert.equal(this.oCreateProperty.notCalled, true, "The addition of a new property is not triggered.");
			assert.equal(oResult, null, "The function returns null.");
		});

		QUnit.module("The function _createProperty", {});

		QUnit.test("_createProperty: The property object is created with property type and property value", function() {
			// Arrange
			var sPropertyType, sPropertyValue, oProperty;

			sPropertyValue = "bar";
			sPropertyType = "SpecialType";

			// Act
			oProperty = AnnotationHandler._createProperty(sPropertyType, sPropertyValue);

			// Assert
			assert.notEqual(oProperty, "undefined", "There is a new created property object.");
			assert.strictEqual(oProperty[sPropertyType], sPropertyValue, "The property value has been set as value to the property type key.");
		});

		QUnit.test("changes the property type to EnumMember if it originally is EnumType", function() {
			// Arrange
			var sPropertyType, oProperty;
			sPropertyType = "EnumType";

			// Act
			oProperty = AnnotationHandler._createProperty(sPropertyType, "");

			// Assert
			assert.notEqual(oProperty.EnumMember, "undefined", "The key EnumMember exists in the annotation property.");
		});
	});
