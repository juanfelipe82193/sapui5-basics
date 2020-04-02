sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/designtime/utils/DesigntimeUtils",
	"sap/base/util/extend",
	"sap/base/util/deepExtend",
	"sap/base/util/isEmptyObject"
], function(AnnotationChangeUtils, ChangeHandlerUtils, DesigntimeUtils, extend, deepExtend, isEmptyObject) {
	"use strict";

	var DeterminingActionType = {};
	var DATAFIELDFORACTION = "com.sap.vocabularies.UI.v1.DataFieldForAction";
	var DATAFIELDFORIBN = "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation";

	var DETERMINING_FOR_ACTION = "DataFieldForAction";
	var DETERMINING_FOR_IBN = "DataFieldForIntentBasedNavigation";

	/**
	 * Retrieves a list of possible values of virtual property determiningActionType, e.g. for filling a drop-down in the UI.
	 *
	 * @returns {object} An object comprising the values (as a technical key) and their labels (displayName)
	 * @public
	 */
	DeterminingActionType.getActionTypeValues = function() {
		return {
			DataFieldForAction: {
				displayName: "DataField For Action"
			},
			DataFieldForIntentBasedNavigation: {
				displayName: "DataField For IBN"
			}
		};
	};

	/**
	 * Retrieves the current value of virtual property DeterminingActionType
	 * @param {object} oElement The SAP UI5 element
	 * @returns {string}
	 */
	DeterminingActionType.get = function(oElement) {
		var oTempInfo = ChangeHandlerUtils.getTemplatingInfo(oElement);
		var oRecord = oTempInfo && oTempInfo.annotationContext;
		var sDeterminingActionType;
		if (oRecord) {
			switch (oRecord.RecordType) {
				case DATAFIELDFORACTION:
					sDeterminingActionType = DETERMINING_FOR_ACTION;
					break;
				case DATAFIELDFORIBN:
					sDeterminingActionType = DETERMINING_FOR_IBN;
					break;
				default:
					break;
			}
		}
		return sDeterminingActionType;
	};

	/**
	 * Creates a new annotation collection record for an action on the footer bar
	 * @param {string} sRecordType Record type
	 * @param {object} oOldRecord Old record where the new record should be placed before
	 * @returns {{Determining: {Bool: string}, RecordType: *, "com.sap.vocabularies.UI.v1.Importance": {EnumMember: string}}}
	 */
	DeterminingActionType.createNewRecordForFooterAction = function(sRecordType, oOldRecord) {
		var sProperty,
			oAbstractRecordTemplate = {
				Label: {},
				Action: {}
			},
			oRecordTemplate = {};
		if (sRecordType === DATAFIELDFORACTION) {
			oRecordTemplate[DATAFIELDFORACTION] = extend({}, oAbstractRecordTemplate,
				{
					InvocationGrouping: {
						EnumMember: "com.sap.vocabularies.UI.v1.OperationGroupingType/Isolated"
					}
				});
		} else {
			oRecordTemplate[DATAFIELDFORIBN] = extend({}, oAbstractRecordTemplate,
				{
					SemanticObject: {String: ""}
				});
		}
		var oNewRecord = {
			"com.sap.vocabularies.UI.v1.Importance": {
				EnumMember: "com.sap.vocabularies.UI.v1.ImportanceType/High"
			},
			RecordType: sRecordType,
			Determining: {Bool: "true"}
		};
		deepExtend(oNewRecord, oRecordTemplate[sRecordType]);
		for (sProperty in oNewRecord) {
			if (sProperty !== "Determining" && sProperty !== "RecordType" && oOldRecord[sProperty]) {
				extend(oNewRecord[sProperty], oOldRecord[sProperty]);
			}
			if (isEmptyObject(oNewRecord[sProperty])) {
				delete oNewRecord[sProperty];
			}
		}
		return oNewRecord;
	};

	/**
	 * Sets the value of virtual property DeterminingActionType
	 * @param {object} oActionElement
	 * @param {string} sNewActionElementType
	 * @param {object} oChange The UI Change (of Run-Time Adaptation)
	 * @returns {*}
	 */
	DeterminingActionType.set = function(oActionElement, sNewActionElementType, oChange) {
		if (oChange) {
			oChange.noRefreshOnChange = true;
			oChange.delayRefresh = false;
		}

		var sOldValueType = DeterminingActionType.get(oActionElement);
		if (sOldValueType === sNewActionElementType) {
			return;
		}

		var sRecordType = "";
		var oMetaModel = {};
		var oTemplData = {};
		var oEntityType = {};
		var aAnnotations = [];
		var aAnnotationsOld = [];
		var sAnnotation = "";
		var iAnnotationIndex = -1;
		var oCustomChange = {};
		var aCustomChanges = [];

		switch (sNewActionElementType) {
			case DETERMINING_FOR_ACTION:
				sRecordType = DATAFIELDFORACTION;
				break;
			case DETERMINING_FOR_IBN:
				sRecordType = DATAFIELDFORIBN;
				break;
			default:
				break;
		}
		if (!sRecordType) {
			if (oChange) {
				oChange.refreshPropertiesPane = true;
			}
			return;
		}
		var oModel = oActionElement.getModel();
		oMetaModel = oModel && oModel.getMetaModel();
		oTemplData = ChangeHandlerUtils.getTemplatingInfo(oActionElement);
		oEntityType = oMetaModel.getODataEntityType(oTemplData.target);
		sAnnotation = oTemplData.annotation;
		aAnnotations = oEntityType[sAnnotation];
		aAnnotationsOld = JSON.parse(JSON.stringify(aAnnotations));
		iAnnotationIndex = ChangeHandlerUtils.getIndexFromInstanceMetadataPath(oActionElement);
		if (iAnnotationIndex === -1) {
			if (oChange) {
				oChange.refreshPropertiesPane = false;
			}
			throw "invalid index for old determining action";
		}
		if (oChange) {
			oChange.refreshPropertiesPane = true;
		}
		var oOldRecord = oTemplData && oTemplData.annotationContext;
		var oNewRecord = DeterminingActionType.createNewRecordForFooterAction(sRecordType, oOldRecord);
		var oNewTemplData = {
			"annotation": sAnnotation,
			"annotationContext": oNewRecord,
			"path": oTemplData.path,
			"target": oEntityType.namespace + "." + oEntityType.name,
			"value": oTemplData.value
		};
		//set instance-specific metadata
		oActionElement.data("sap-ui-custom-settings")["sap.ui.dt"].annotation = oNewTemplData;

		//Prepare annotation term change
		aAnnotations.splice(iAnnotationIndex, 1, oNewRecord);
		oCustomChange = AnnotationChangeUtils.createCustomAnnotationTermChange(oTemplData.target, aAnnotations , aAnnotationsOld , sAnnotation);
		aCustomChanges.push(oCustomChange);

		return aCustomChanges;
	};



	return DeterminingActionType;
});
