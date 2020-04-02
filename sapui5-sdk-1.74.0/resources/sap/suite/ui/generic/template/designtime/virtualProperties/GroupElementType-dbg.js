sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
	"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
	"sap/base/util/extend",
	"sap/base/util/deepExtend",
	"sap/base/util/isEmptyObject"
], function(Utils, AnnotationChangeUtils, DesigntimeUtils, extend, deepExtend, isEmptyObject) {
	"use strict";

	var GroupElementType = {},

		DATAFIELDFORANNOTATION = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation",
		DATAFIELD = "com.sap.vocabularies.UI.v1.DataField",
		DATAFIELDWITHURL = "com.sap.vocabularies.UI.v1.DataFieldWithUrl",
		INTENTBASEDNAV = "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation",
		DATAFIELDWITHNAVPATH = "com.sap.vocabularies.UI.v1.DataFieldWithNavigationPath",
		FIELDGROUP = "com.sap.vocabularies.UI.v1.FieldGroup",
		CONTACT = "com.sap.vocabularies.Communication.v1.Contact",
		ADDRESS = "com.sap.vocabularies.Communication.v1.Address",
		GROUP_ELEMENT_TYPE_DATAFIELD = "Datafield",
		GROUP_ELEMENT_TYPE_CONTACT = "Contact",
		GROUP_ELEMENT_TYPE_ADDRESS = "Address",
		GROUP_ELEMENT_TYPE_INTENTBASEDNAV = "DataFieldWithIntentBasedNavigation",
		GROUP_ELEMENT_TYPE_DATAFIELDWITHURL = "DatafieldWithUrl",
		GROUP_ELEMENT_TYPE_DATAFIELDWITHNAVPATH = "DataFieldWithNavigationPath";

	GroupElementType.getGroupElementRecord = function (oElement) {
		var oTempInfo = Utils.getTemplatingInfo(oElement);
		if (oTempInfo && oTempInfo.annotationContext) {
			return oTempInfo.annotationContext;
		}
	};

	/**
	 * Create a new group element object.
	 *
	 * @param {string} sRecordType The type of the group record
	 * @param {object} oOldRecord Old record of the group with its content
	 * @returns {object} The new group element record
	 * @public
	 */
	GroupElementType.createNewRecord = function(sRecordType, oOldRecord) {

		var sProperty,
			oAbstractRecordTemplate = {
				Criticality: {},
				CriticalityRepresentation: {},
				IconUrl: {}
			},
			oRecordTemplate = {};
		oRecordTemplate[DATAFIELD] = extend({}, oAbstractRecordTemplate,
			{
				Label: {},
				Value: {}
			});
		oRecordTemplate[DATAFIELDWITHURL] = extend({}, oAbstractRecordTemplate,
			{
				Label: {},
				Value: {Path: ""},
				Url: {Path: ""}
			});
		oRecordTemplate[DATAFIELDFORANNOTATION] = extend({}, oAbstractRecordTemplate,
			{
				Label: {String: ""},
				Target: {AnnotationPath: ""}
			});
		oRecordTemplate[INTENTBASEDNAV] = extend({}, oAbstractRecordTemplate,
			{
				Label: {},
				SemanticObject: {String: "Semantic_Object"},
				Action: {},
				Value: {}
			});
		oRecordTemplate[DATAFIELDWITHNAVPATH] = extend({}, oAbstractRecordTemplate,
			{
				Label: {},
				Value: {Path: ""},
				Target: {NavigationPropertyPath: ""}
			});

		var oNewRecord = {
			"com.sap.vocabularies.UI.v1.Importance": {
				"EnumMember": "com.sap.vocabularies.UI.v1.ImportanceType/High"
			},
			"RecordType": sRecordType,
			"EdmType": "Edm.String"
		};
		deepExtend(oNewRecord, oRecordTemplate[sRecordType]);
		for (sProperty in oNewRecord) {
			if (sProperty !== "RecordType" && sProperty !== "Target" && oOldRecord && oOldRecord[sProperty]) {
				extend(oNewRecord[sProperty], oOldRecord[sProperty]);
			}
			if (isEmptyObject(oNewRecord[sProperty])) {
				delete oNewRecord[sProperty];
			}
		}
		return oNewRecord;
	};

	/**
	 * Retrieves a list of possible values of the group element type, e.g. for filling a drop-down in the UI.
	 *
	 * @param {object} oElement The UI5 element (in overlay mode)
	 * @returns {object} An object comprising the values (as a technical key) and their labels (displayName)
	 * @public
	 */
	GroupElementType.getGroupElementTypeValues = function() {
		var oValues = {   //default values that are relevant for all field types
			Datafield: {
				displayName: "Data Field"
			},
			DatafieldWithUrl: {
				displayName: "Data Field with URL"
			},
			Contact: {
				displayName: "Contact"
			},
			Address: {
				displayName: "Address"
			},
			DataFieldWithIntentBasedNavigation: {
				displayName: "Intent Based Navigation"
			},
			DataFieldWithNavigationPath: {
				displayName: "DataField with Navigation Path"
			}
		};
		return oValues;
	};

	/**
	 * Retrieves the current value of the group element record type from
	 * various annotations.
	 *
	 * @param {object} oElement The UI5 element (in overlay mode)
	 * @returns {string} The technical key of the group element type, as comprised in the list of possible values
	 * @public
	 */
	GroupElementType.getGroupElementType = function(oElement) {
		var oRecord = GroupElementType.getGroupElementRecord(oElement);
		var sGroupElementType;

		if (oRecord) {
			switch (oRecord.RecordType) {
				case DATAFIELDFORANNOTATION:
					var sAnnotationPath = oRecord.Target.AnnotationPath;
					if (sAnnotationPath) {
						if (oRecord.Target.AnnotationPath.indexOf(CONTACT) > -1) {
							sGroupElementType = GROUP_ELEMENT_TYPE_CONTACT;
						} else if (oRecord.Target.AnnotationPath.indexOf(ADDRESS) > -1) {
							sGroupElementType = GROUP_ELEMENT_TYPE_ADDRESS;
						}
					}
					break;
				case INTENTBASEDNAV:
					sGroupElementType = GROUP_ELEMENT_TYPE_INTENTBASEDNAV;
					break;
				case DATAFIELD:
					sGroupElementType = GROUP_ELEMENT_TYPE_DATAFIELD;
					break;
				case DATAFIELDWITHURL:
					sGroupElementType = GROUP_ELEMENT_TYPE_DATAFIELDWITHURL;
					break;
				case DATAFIELDWITHNAVPATH:
					sGroupElementType = GROUP_ELEMENT_TYPE_DATAFIELDWITHNAVPATH;
					break;
				default:
					break;
			}
		}
		return sGroupElementType;
	};

	/**
	 * Updates the value of the record type for a given group element by updating
	 * different annotations
	 *
	 * @param {object} oGroupElement The group element control (in overlay mode)
	 * @param {string} sNewGroupElementType The new value for the group element type
	 * @param {object} oChange The UI Change (of Run-Time Adaptation)
	 *
	 * @returns{object} The change content, comprising old an new values of the group element but also
	 *                  the implicitly changed annotations.
	 * @public
	 */
	GroupElementType.setGroupElementType = function(oGroupElement, sNewGroupElementType, oChange) {

		oChange.noRefreshOnChange = true;
		oChange.delayRefresh = false;

		var sOldValueType = GroupElementType.getGroupElementType(oGroupElement);
		if (sOldValueType === sNewGroupElementType) {
			return;
		}
		var sRecordType = "";
		var oMetaModel = {};
		var oEntityType = {};
		var oAnnotations = [];
		var oAnnotationsOld = [];
		var sAnnotation = "";
		var aDataFields = [];
		var iAnnotationIndex = -1;
		var oCustomChange = {};
		var aCustomChanges = [];
		var oTemplData = {};
		var sFullTerm = "";

		var oModel = oGroupElement.getModel();
		oMetaModel = oModel && oModel.getMetaModel();
		oTemplData = Utils.getTemplatingInfo(oGroupElement);
		oEntityType = oMetaModel.getODataEntityType(oTemplData.target);
		sAnnotation = oTemplData.annotation;
		oAnnotations = oEntityType[sAnnotation];
		oAnnotationsOld = JSON.parse(JSON.stringify(oAnnotations));
		aDataFields = (sAnnotation.indexOf(FIELDGROUP) >= 0) ? oAnnotations.Data : oAnnotations;
		iAnnotationIndex = Utils.getIndexFromInstanceMetadataPath(oGroupElement);
		if (iAnnotationIndex === -1) {
			throw "invalid index for old group element";
		}

		oChange.refreshPropertiesPane = true;

		switch (sNewGroupElementType) {
			case GROUP_ELEMENT_TYPE_DATAFIELD:
				sRecordType = DATAFIELD;
				break;
			case GROUP_ELEMENT_TYPE_DATAFIELDWITHURL:
				sRecordType = DATAFIELDWITHURL;
				break;
			case GROUP_ELEMENT_TYPE_INTENTBASEDNAV:
				sRecordType = INTENTBASEDNAV;
				break;
			case GROUP_ELEMENT_TYPE_CONTACT:
				sFullTerm = GroupElementType.fixQualifierForNewGroupElement(oGroupElement, aDataFields, CONTACT, undefined);
				var oContact = DesigntimeUtils.createNewContact();
				oCustomChange = AnnotationChangeUtils.createCustomAnnotationTermChange(oTemplData.target, oContact, {}, sFullTerm);
				aCustomChanges.push(oCustomChange);
				sRecordType = DATAFIELDFORANNOTATION;
				break;
			case GROUP_ELEMENT_TYPE_ADDRESS:
				sFullTerm = GroupElementType.fixQualifierForNewGroupElement(oGroupElement, aDataFields, ADDRESS, undefined);
				var oAddress = DesigntimeUtils.createNewAddress();
				oCustomChange = AnnotationChangeUtils.createCustomAnnotationTermChange(oTemplData.target, oAddress, {}, sFullTerm);
				aCustomChanges.push(oCustomChange);
				sRecordType = DATAFIELDFORANNOTATION;
				break;
			case GROUP_ELEMENT_TYPE_DATAFIELDWITHNAVPATH:
				sRecordType = DATAFIELDWITHNAVPATH;
				break;
			default:
				break;
		}

		if (!sRecordType) {
			return;
		}

		var oOldRecord = GroupElementType.getGroupElementRecord(oGroupElement);
		var oNewRecord = GroupElementType.createNewRecord(sRecordType, oOldRecord);
		switch (sNewGroupElementType) {
			case GROUP_ELEMENT_TYPE_CONTACT:
				if (!oNewRecord.Label.String) {
					oNewRecord.Label.String = "New Contact";
				}
				oNewRecord.Target.AnnotationPath = "@" + sFullTerm;
				break;
			case GROUP_ELEMENT_TYPE_ADDRESS:
				if (!oNewRecord.Label.String) {
					oNewRecord.Label.String = "New Address";
				}
				oNewRecord.Target.AnnotationPath = "@" + sFullTerm;
				break;
			case GROUP_ELEMENT_TYPE_INTENTBASEDNAV:
				oNewRecord.SemanticObject.String = oNewRecord.SemanticObject.String + "_" + parseInt(iAnnotationIndex, 10);
				break;
			default:
				break;
		}
		var oNewTemplData = {
			"annotation": sAnnotation,
			"annotationContext": oNewRecord,
			"path": oTemplData.path,
			"target": oEntityType.namespace + "." + oEntityType.name,
			"value": oNewRecord.Value && oNewRecord.Value.Path || oNewRecord.Target &&  oNewRecord.Target.AnnotationPath
		};
		//set instance-specific metadata
		oGroupElement.data("sap-ui-custom-settings")["sap.ui.dt"].annotation = oNewTemplData;

		//Prepare annotation term change
		aDataFields.splice(iAnnotationIndex, 1, oNewRecord);
		oCustomChange = AnnotationChangeUtils.createCustomAnnotationTermChange(oTemplData.target, oAnnotations , oAnnotationsOld , sAnnotation);
		aCustomChanges.push(oCustomChange);

		return aCustomChanges;
	};

	/**
	 * Determines the "right" (i.e. the first non-existing) qualifier for a term.
	 *
	 * @param {sap.m.Column} oGroupElement The group element (in overlay mode)
	 * @param {object} aDataFields Datafield records in the group where oGroupElement exists.
	 * @param {string} sTerm Annotation term name
	 * @param {string} sBasicQualifier Default qualifier
	 * @returns {string} Full qualifier for the annotation term
	 */
	GroupElementType.fixQualifierForNewGroupElement = function(oGroupElement, aDataFields, sTerm, sBasicQualifier) {
		var iCurrentIndex = Utils.getIndexFromInstanceMetadataPath(oGroupElement);
		var sFullTerm = DesigntimeUtils.fixQualifierForAnnotationPath(aDataFields, sTerm, sBasicQualifier, iCurrentIndex);
		return sFullTerm;

	};

	return GroupElementType;
});
