/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
		"sap/ui/fl/changeHandler/MoveControls",
		"sap/base/util/deepExtend"
	], function (
	Utils,
	AnnotationChangeUtils,
	MoveControls,
	deepExtend
	) {
		"use strict";
		/**
		 * Generic change handler for moving an elements.
		 *
		 * @alias sap.suite.ui.generic.template.changeHandler.MoveElements
		 * @author SAP SE
		 * @version 1.74.0
		 */

		var MoveElements = {},
			IMPORTANCE = "com.sap.vocabularies.UI.v1.Importance",
			IMPORTANCEHIGH = "com.sap.vocabularies.UI.v1.ImportanceType/High",
			IMPORTANCELOW = "com.sap.vocabularies.UI.v1.ImportanceType/Low";

		/**
		 * Moves an element from one aggregation to another.
		 *
		 * @param {sap.ui.fl.Change} oChange change object with instructions to be applied on the control map
		 * @param {sap.ui.core.Control} oRelevantContainer control that matches the change selector for applying the change, which is the source of the move
		 * @param {object} mPropertyBag - map of properties
		 * @param {object} mPropertyBag.view - xml node representing a ui5 view
		 * @param {string} [mPropertyBag.sourceAggregation] - name of the source aggregation. Overwrites the aggregation from the change. Can be provided by a custom ChangeHandler, that uses this ChangeHandler
		 * @param {string} [mPropertyBag.targetAggregation] - name of the target aggregation. Overwrites the aggregation from the change. Can be provided by a custom ChangeHandler, that uses this ChangeHandler
		 * @param {sap.ui.core.util.reflection.BaseTreeModifier} mPropertyBag.modifier - modifier for the controls
		 * @param {sap.ui.core.UIComponent} mPropertyBag.appComponent - appComopnent
		 * @return {boolean} Returns true if change could be applied, otherwise undefined
		 * @public
		 * @function
		 * @name sap.ui.fl.changeHandler.MoveControls#applyChange
		 */
		MoveElements.applyChange = function (oChange, oControl, mPropertyBag) {
			// default change handler for moving controls
			// TODO: if needed, we could allow passing/calling other change handlers here
			MoveControls.applyChange(oChange, oControl, mPropertyBag);
		};

		/**
		 * Completes the change by adding change handler specific content.
		 *
		 * @param {sap.ui.fl.Change} oChange change object to be completed
		 * @param {object} mSpecificChangeInfo as an empty object since no additional attributes are required for this operation
		 * @param {object} mPropertyBag - map of properties
		 * @param {sap.ui.core.UiComponent} mPropertyBag.appComponent component in which the change should be applied
		 * @public
		 * @function
		 * @name sap.ui.fl.changeHandler.MoveControls#completeChangeContent
		 */
		MoveElements.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
			var aElements;
			var oMetaModel = Utils.getMetaModel(oSpecificChangeInfo, mPropertyBag);
			var oOwningElement = mPropertyBag.modifier.bySelector(oSpecificChangeInfo.source.id, mPropertyBag.appComponent);

			if (oSpecificChangeInfo.source.aggregation === 'groups') {
				aElements = oOwningElement.getGroups();
			} else {
				aElements = oOwningElement.getAggregation(oSpecificChangeInfo.source.aggregation) || (oOwningElement.getActions && oOwningElement.getActions());
			}

			if (!Utils.isReveal) {
				aElements.splice(oSpecificChangeInfo.movedElements[0].sourceIndex, 0, aElements.splice(oSpecificChangeInfo.movedElements[0].targetIndex,
					1)[0]);
			}
			var oUISourceElement = aElements[oSpecificChangeInfo.movedElements[0].sourceIndex];
			var oUITargetElement = aElements[oSpecificChangeInfo.movedElements[0].targetIndex];

			//START - Object Page Header Action Button
			var iTargetIndex = oSpecificChangeInfo.movedElements[0].targetIndex;
			var iEditIndex, iDeleteIndex, iRelatedAppsIndex;
			var sRootIdPrefix = Utils.getComponent(oOwningElement).getRootControl().getId();
			aElements.some(function (oEntry, i) {
				if (oEntry && oEntry.getId && oEntry.getId() === sRootIdPrefix + "--edit") {
					iEditIndex = i;
				}
				if (oEntry && oEntry.getId && oEntry.getId() === sRootIdPrefix + "--delete") {
					iDeleteIndex = i;
				}
				if (oEntry && oEntry.getId && oEntry.getId() === sRootIdPrefix + "--relatedApps") {
					iRelatedAppsIndex = i;
				}
			});
			// END

			var oRelevantSourceElement = oUISourceElement;
			//var oRelevantTargetElement = oUITargetElement; // not needed so far
			/*
             * for some cases (e.g. smart filter bar), we need to map the UI element (e.g. VerticalLayout)
             * to the technically relevant element (e.g. controlConfiguration) holding the annotation-relevant information
             */
			if (oSpecificChangeInfo.custom.fnGetRelevantElement) {
				oRelevantSourceElement = oSpecificChangeInfo.custom.fnGetRelevantElement(oUISourceElement);
				//oRelevantTargetElement = oSpecificChangeInfo.custom.fnGetRelevantElement(oUITargetElement);
			}

			var mContent = {},
				sEntityType = "",
				oEntityType = {},
				aAnnotations = [],
				aAnnotationsOld = [],
				sAnnotation = "",
				oTemplData = Utils.getTemplatingInfo(oRelevantSourceElement);
			if (oTemplData && oTemplData.target && oTemplData.annotation) {
				if (oOwningElement.getId().indexOf("ObjectPage") > -1 && oOwningElement.getId().indexOf("LineItem") > -1) {
					var sEntitySet = oOwningElement.getParent().getEntitySet();
					sEntityType = oOwningElement.getParent().getModel().getMetaModel().getODataEntitySet(sEntitySet).entityType;
				} else {
					sEntityType = oTemplData.target;
				}
				oEntityType = oMetaModel.getODataEntityType(sEntityType);
				sAnnotation = oTemplData.annotation;
				aAnnotations = oEntityType[sAnnotation];
			} else {
				// no instance-specific metadata exist => data comes from the calling change handler
				if (oOwningElement.getId().indexOf("ObjectPage") > -1 && oOwningElement.getId().indexOf("LineItem") > -1) {
					var sEntitySet = oOwningElement.getParent().getEntitySet();
					sEntityType = oOwningElement.getParent().getModel().getMetaModel().getODataEntitySet(sEntitySet).entityType;
				} else {
						sEntityType = Utils.getEntityType(oOwningElement);
				}
				oEntityType = oMetaModel.getODataEntityType(sEntityType);
				sAnnotation = oSpecificChangeInfo.custom.annotation;
				aAnnotations = oEntityType[sAnnotation];
			}
			aAnnotationsOld = JSON.parse(JSON.stringify(aAnnotations));

			// setOrder is needed for table column
			// TODO try to find better solution than this if-statement
			if (oUISourceElement && oUISourceElement.setOrder) {
				oUISourceElement.setOrder(oSpecificChangeInfo.movedElements[0].targetIndex);
			}

			if (Utils.isReveal) {
				Utils.isReveal = false;
			} else {
				aElements.splice(oSpecificChangeInfo.movedElements[0].targetIndex, 0, (aElements.splice(oSpecificChangeInfo.movedElements[0].sourceIndex,
					1))[0]);
			}
			if (oSpecificChangeInfo.custom.fnPerformCustomMove) {
				var oParentSourceElement = mPropertyBag.modifier.bySelector(oSpecificChangeInfo.source.id, mPropertyBag.appComponent);
				var oParentTargetElement = mPropertyBag.modifier.bySelector(oSpecificChangeInfo.target.id, mPropertyBag.appComponent);
				var iAnnotationSourceIndex = oSpecificChangeInfo.movedElements[0].sourceIndex;
				var iAnnotationTargetIndex = oSpecificChangeInfo.movedElements[0].targetIndex;
				oSpecificChangeInfo.custom.fnPerformCustomMove(oParentSourceElement, oParentTargetElement, iAnnotationSourceIndex,
					iAnnotationTargetIndex, aAnnotations);
			} else {
				var iAnnotationSourceIndex = oSpecificChangeInfo.custom.fnGetAnnotationIndex(oUISourceElement, aAnnotations);
				var iAnnotationTargetIndex = oSpecificChangeInfo.custom.fnGetAnnotationIndex(oUITargetElement, aAnnotations);
				// START Object Page Header Action Button
				var iIndex = iEditIndex || iDeleteIndex || iRelatedAppsIndex;
				if (iIndex) {
					if (iTargetIndex < iIndex) {
						aAnnotations[iAnnotationSourceIndex][IMPORTANCE] = {
							EnumMember: IMPORTANCEHIGH
						};
					} else {
						aAnnotations[iAnnotationSourceIndex][IMPORTANCE] = {
							EnumMember: IMPORTANCELOW
						};
					}
				}
				//aAnnotations.splice(iAnnotationTargetIndex, 0, aAnnotations.splice(iAnnotationSourceIndex, 1)[0]);
				// MoveElements inside specific element. For example, groupElement in a group, group in a formGroup.
				if (typeof (oSpecificChangeInfo.custom.elements) === "undefined") {
					oSpecificChangeInfo.custom.elements = aAnnotations;
				}
				oSpecificChangeInfo.custom.elements.splice(iAnnotationTargetIndex, 0, oSpecificChangeInfo.custom.elements.splice(iAnnotationSourceIndex, 1)[0]);
			}

			if (oSpecificChangeInfo.custom.MoveConcreteElement) {
				// do whatever the original change does (if concrete change handler is passed)
				oSpecificChangeInfo.custom.MoveConcreteElement.completeChangeContent(oChange, oSpecificChangeInfo, mPropertyBag);
			}
			if (iAnnotationSourceIndex >= 0 && iAnnotationTargetIndex >= 0) {
				var mContent = AnnotationChangeUtils.createCustomAnnotationTermChange(sEntityType, aAnnotations, aAnnotationsOld, sAnnotation);
				var mChanges = AnnotationChangeUtils.createCustomChanges(mContent);
				deepExtend(oChange.getContent(), mChanges);
			}
		};

		return MoveElements;
	},
	/* bExport= */
	true);
