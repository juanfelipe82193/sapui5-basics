sap.ui.define(["sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils", "sap/base/util/extend", "sap/base/util/isEmptyObject"],
	function(Utils, extend, isEmptyObject) {
		"use strict";

		var oAnnotationChangeHandler = {

			/**
			 * Pushes the changes from createCustomAnnotationTermChange to the customChanges array
			 * @param {object} oCustomChanges Result of createCustomAnnotationTermChange method
			 *
			 * @return {object} The object containing the new custom changes
			 * @public
			 */
			createCustomChanges: function(oCustomChanges) {
				var aCustomChanges = [];
				aCustomChanges.push(oCustomChanges);

				return {
					"customChanges": aCustomChanges
				};
			},

			/**
			 * Creates a custom change object that can be added to the customChange section of a UI change's
			 * annotation term change.
			 *
			 * @param {string} sTarget The annotation target (entitySet or entityType)
			 * @param {object} oNewAnnotation The new annotation term value
			 * @param {object} oOldAnnotation The old annotation term value
			 * @param {string} sAnnotationTerm The target annotation term
			 *
			 * @returns {object} The object containing the new custom change data
			 * @public
			 */
			createCustomAnnotationTermChange: function(sTarget, oNewAnnotation, oOldAnnotation, sAnnotationTerm) {

				var oCommandOldContent,
					oCommandNewContent;

				if (oNewAnnotation && !isEmptyObject(oNewAnnotation)) {
					oCommandNewContent = this.createAnnotationChangeContent(
						oNewAnnotation,
						sTarget,
						sAnnotationTerm
					);
				}

				if (oOldAnnotation && !isEmptyObject(oOldAnnotation)) {
					oCommandOldContent = this.createAnnotationChangeContent(
						oOldAnnotation,
						sTarget,
						sAnnotationTerm
					);
				}

				return {
					changeType: "annotationTermChange",
					content: {
						newValue: oCommandNewContent,
						oldValue: oCommandOldContent
					}
				};
			},

			/**
			 * Creates the inner content of an annotation change
			 *
			 * @param {object} oAnnotation The annotation object
			 * @param {string} sTarget The annotation target (entitySet or entityType)
			 * @param {string} sAnnotationTerm The target annotation term
			 *
			 * @returns {object} The annotation change content
			 * @public
			 */
			createAnnotationChangeContent: function(oAnnotation, sTarget, sAnnotationTerm) {
				var oChangeCommandContent = {};

				var oAnnotationContent = {};
				oAnnotationContent[sAnnotationTerm] = oAnnotation;
				oChangeCommandContent[sTarget] = oAnnotationContent;

				return oChangeCommandContent;
			},

			/**
			 * Updates the annotation property with a new type/value or adds a new annotation property.
			 *
			 * @param {object} oAnnotation The annotation object
			 * @param {object} oPropertyContent The content of the property containing name, type, value, and changeType
			 *
			 * @returns {object} The updated annotation object
			 * @public
			 */
			updateAnnotationProperty: function(oAnnotation, oPropertyContent) {
				var oAnnotationCopy = extend({}, oAnnotation),
					oProperty = oAnnotationCopy[oPropertyContent.propertyName];
				if (oPropertyContent.changeType === "expression" && !oProperty) {
					return null;
				}
				if (oAnnotationCopy[oPropertyContent.propertyType]) {
					// Simples type, update directly
					oAnnotationCopy[oPropertyContent.propertyType] = oPropertyContent.propertyValue;
				} else if (oAnnotationCopy[oPropertyContent.propertyName]) {
					oAnnotationCopy[oPropertyContent.propertyName] = this._createProperty(oPropertyContent.propertyType, oPropertyContent.propertyValue);
				} else if (oPropertyContent.propertyType === "PropertyPath") {
					// Dealing with inline collections
					oAnnotationCopy = this._createProperty(oPropertyContent.propertyType, oPropertyContent.propertyValue);
				} else {
					// create a non-existing property for the annotation
					oAnnotationCopy[oPropertyContent.propertyName] = this._createProperty(oPropertyContent.propertyType, oPropertyContent.propertyValue);
				}

				return oAnnotationCopy;
			},

			/**
			 * Creates a property object using the property type and property value.
			 *
			 * @param {string} sPropertyType The annotation property type
			 * @param {string} sPropertyValue The annotation property value
			 * @returns {object} The new property object
			 * @private
			 */
			_createProperty: function(sPropertyType, sPropertyValue) {
				var oProperty = {};
				if (sPropertyType === "EnumType") {
					sPropertyType = "EnumMember";
				}
				oProperty[sPropertyType] = sPropertyValue;

				return oProperty;
			},

			/**
			 * Returns all existing annotations for a given sAnnotationTerm that targets the main entityType of the
			 * component which owns the given control.
			 *
			 * @param {object} oControl The SAPUI5 control
			 * @param {object} sAnnotationTerm The annotation term
			 * @returns {object[]} The annotations' object from the ODataMetaModel
			 * @public
			 */
			//
			getExistingAnnotationsOfEntityType: function(oControl, sAnnotationTerm) {
				var oComponent = Utils.getComponent(oControl);
				var oEntityType = Utils.getODataEntityType(oComponent);

				return oEntityType[sAnnotationTerm] ? oEntityType[sAnnotationTerm] : [];
			}

		};

		return oAnnotationChangeHandler;
	});
