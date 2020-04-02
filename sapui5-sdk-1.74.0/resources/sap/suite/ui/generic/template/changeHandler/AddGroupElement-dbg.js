sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
	"sap/suite/ui/generic/template/changeHandler/generic/AddElement",
	"sap/base/util/deepExtend"
], function(
	Utils,
	AnnotationChangeUtils,
	AddElement,
	deepExtend
) {
	"use strict";

	/**
	 * Change handler for adding a group element in a SmartForm group.
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 * @experimental
	 */
	var DATAFIELD = "com.sap.vocabularies.UI.v1.DataField";
	var IMPORTANCE = "com.sap.vocabularies.UI.v1.Importance";
	var IMPORTANCEHIGH = "com.sap.vocabularies.UI.v1.ImportanceType/High";
	var FIELDGROUP = "com.sap.vocabularies.UI.v1.FieldGroup";
	var fnTemplatingInfo = {};
	var oControlsToBeAdded = {};
	var AddGroupElement = {};

	var fnHandleSpecificAddAction = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		var oEntityType = {};
		var oAnnotations = {};
		var oAnnotationsOld = {};
		var sAnnotation = "";
		var aDataFields = [];
		var mContent = {};
		var mChanges = {};
		var oGroup = mPropertyBag.modifier.bySelector(oSpecificChangeInfo.parentId, mPropertyBag.appComponent);
		var oParentSelector = mPropertyBag.modifier.getSelector(oSpecificChangeInfo.parentId, mPropertyBag.appComponent);
		var oMetaModel = Utils.getMetaModel(oSpecificChangeInfo, mPropertyBag);
		var oTemplData = Utils.getTemplatingInfo(oGroup);

		oEntityType = oMetaModel.getODataEntityType(oTemplData.target);
		sAnnotation = (oTemplData.value.indexOf("/") > 0) ? oTemplData.value.split("/")[1].substr(1) : oTemplData.value.substr(1);
		oAnnotations = oEntityType[sAnnotation];
		oAnnotationsOld = JSON.parse(JSON.stringify(oAnnotations));
		aDataFields = (sAnnotation.indexOf(FIELDGROUP) >= 0) ? oAnnotations.Data : oAnnotations;
		var oNewFieldProperty = oEntityType.property.find(function(obj) {
			return obj.name === oSpecificChangeInfo.bindingPath;
		});
		var oNewField = {
				Value: {
					Path: oSpecificChangeInfo.bindingPath
				},
				RecordType: DATAFIELD,
				EdmType: oNewFieldProperty && oNewFieldProperty.type
			};
		oNewField[IMPORTANCE] = {
				EnumMember: IMPORTANCEHIGH
		};
		aDataFields.splice(oSpecificChangeInfo.index, 0, oNewField);
		mContent = AnnotationChangeUtils.createCustomAnnotationTermChange(oTemplData.target, oAnnotations , oAnnotationsOld , sAnnotation);

		mContent.targetIndex = oSpecificChangeInfo.index;
		mContent.parentElementId = oGroup.getId();
		mContent.oParentSelector = oParentSelector;
		mContent.bindingPath = oSpecificChangeInfo.bindingPath;
		mContent.oAnnotation = oNewField;
		mContent.oEntityType = oEntityType;
		mContent.sAnnotation = sAnnotation;

		mChanges = AnnotationChangeUtils.createCustomChanges(mContent);

		mChanges.noRefreshOnChange = true;
		var sRootControlId = Utils.getComponent(oGroup).getRootControl().getId();
		var sGroupElementId = sRootControlId + sap.suite.ui.generic.template.js.AnnotationHelper.getStableIdPartFromFacet(Utils.getTemplatingInfo(oGroup).annotationContext) + "::" + sap.suite.ui.generic.template.js.AnnotationHelper.getStableIdPartFromDataField(oNewField) + "::GroupElement";
		var sSmartFieldId = sRootControlId + sap.suite.ui.generic.template.js.AnnotationHelper.getStableIdPartFromFacet(Utils.getTemplatingInfo(oGroup).annotationContext) + "::" + sap.suite.ui.generic.template.js.AnnotationHelper.getStableIdPartFromDataField(oNewField) + "::SmartField";
		var sBindingPath = mContent.bindingPath;
		fnTemplatingInfo[sBindingPath] = function(oElement) {
			var oTemplData = {
				"sap.ui.dt": {
					annotation: {
						annotation: sAnnotation,
						annotationContext: oNewField,
						path: sAnnotation + "/Data/" + oSpecificChangeInfo.index,
						target: oEntityType.namespace + "." + oEntityType.name,
						value: oSpecificChangeInfo.bindingPath
					}
				}
			};
			var oCustomData = new sap.ui.core.CustomData({"key": "sap-ui-custom-settings", "value": oTemplData});
			oElement.addCustomData(oCustomData);
		};

		oControlsToBeAdded[sBindingPath] = {
			oControl: {
				sId: sGroupElementId,
				type: "GroupElement",
				iTargetIndex: oSpecificChangeInfo.index,
				insertFunction: "insertGroupElement", // insertGroupElement is the function to insert GroupElements in Group control
				fnTemplatingInfo: fnTemplatingInfo[sBindingPath],
				oChild: {
					oControl: {
						sId: sSmartFieldId,
						type: "SmartField",
						mSettings: {
							value: "{" + oSpecificChangeInfo.bindingPath + "}"
						},
						insertFunction: "insertElement"	// insertElement is the function to insert Elements(SmartFields) in Group Element control
					}
				}
			}
		};

		deepExtend(oChange.getContent(), mChanges);
	};

	// This method is added just for testing purpose
	AddGroupElement.getControlsToBeAdded = function() {
		return oControlsToBeAdded;
	};

	AddGroupElement.applyChange = function (oChange, oControl, mPropertyBag) {
		var sBindingPath = oChange.getContent().customChanges[0].bindingPath;
		AddElement.applyChange(oChange, oControl, mPropertyBag, oControlsToBeAdded[sBindingPath]);
		delete oControlsToBeAdded[sBindingPath];
	};

	AddGroupElement.revertChange = function(oChange, oControl, mPropertyBag) {
		//write revert change logic
	};

	AddGroupElement.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		oSpecificChangeInfo.custom = {};
		oSpecificChangeInfo.custom.fnGetAnnotationIndex = Utils.getIndexFromInstanceMetadataPath;
		fnHandleSpecificAddAction(oChange, oSpecificChangeInfo, mPropertyBag);
	};
	return AddGroupElement;
},
/* bExport= */true);
