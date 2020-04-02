sap.ui.define([
	"sap/suite/ui/generic/template/js/AnnotationHelper",
	"sap/suite/ui/generic/template/changeHandler/js/AnnotationHelperForDesignTime",
	"sap/base/util/deepExtend"
], function (AnnotationHelper, AnnotationHelperForDesignTime, deepExtend) {
	"use strict";

	var OBJECT_PAGE = "sap.suite.ui.generic.template.ObjectPage.view.Details";
	var LINEITEM = "com.sap.vocabularies.UI.v1.LineItem";
	var DATAFIELDFORANNOTATION = "com.sap.vocabularies.UI.v1.DataFieldForAnnotation";
	var DATAFIELDFORACTION = "com.sap.vocabularies.UI.v1.DataFieldForAction";
	var INTENTBASEDNAV = "com.sap.vocabularies.UI.v1.DataFieldWithIntentBasedNavigation";
	var FORINTENTBASEDNAV = "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation";
	var FIELDGROUP = "com.sap.vocabularies.UI.v1.FieldGroup";
	var IDENTIFICATION = "com.sap.vocabularies.UI.v1.Identification";
	var SELECTIONFIELDS = "com.sap.vocabularies.UI.v1.SelectionFields";
	var REFERENCE_FACET = "com.sap.vocabularies.UI.v1.ReferenceFacet";
	var COLLECTION_FACET = "com.sap.vocabularies.UI.v1.CollectionFacet";
	var ChangeHandlerUtils = {};
	var oMetaModel; // MetaModel mit Fortschreibung der Änderung an Annotations

	// TODO check if old reveal/revert logic is correct or can be improved
	ChangeHandlerUtils.isReveal = false;
	ChangeHandlerUtils.isRevert = false;

	ChangeHandlerUtils.getMetaModel = function (oSpecificChangeInfo, mPropertyBag) {
		if (oMetaModel) {
			return oMetaModel;
		}
		oMetaModel = {};
		var sId = (oSpecificChangeInfo.source && oSpecificChangeInfo.source.id) || oSpecificChangeInfo.parentId // for addColumn, source.id does not exist, so use parentId (to be verified)
			|| (oSpecificChangeInfo.removedElement && oSpecificChangeInfo.removedElement.id) // for removeFilterItem, source.id does not exist, so use removedElement.id (to be verified)
			|| (oSpecificChangeInfo.selector && oSpecificChangeInfo.selector.id); // for addToolbarActionButton, use selector.id (settings handler workaround)
		deepExtend(oMetaModel, mPropertyBag.modifier.bySelector(sId, mPropertyBag.appComponent).getModel().getMetaModel());
		return oMetaModel;
	};

	/**
	 * Retrieves the UIComponent component from a given ManagedObject instance
	 *
	 * @param {sap.ui.core.ManagedObject} oManagedObject The managed object
	 * @returns {sap.ui.core.UIComponent}  The UI5 component of the element
	 * @public
	 */
	ChangeHandlerUtils.getComponent = function (oManagedObject) {
		var oComponent;

		while (oManagedObject) {
			if (oManagedObject instanceof sap.ui.core.mvc.View) {
				oComponent = oManagedObject.getController().getOwnerComponent();
				break;
			} else if (oManagedObject instanceof sap.ui.core.UIComponent) {
				oComponent = oManagedObject;
				break;
			}
			if (oManagedObject.getParent) {
				oManagedObject = oManagedObject.getParent();
			} else {
				break;
			}
		}
		return oComponent;
	};

	/**
	 * Retrieves the OData entity set of a given SAPUI5 component from the MetaModel
	 *
	 * @param {sap.ui.core.UIComponent} oComponent The SAPUI5 component
	 * @returns {string} The name of the entity set
	 * @public
	 */
	ChangeHandlerUtils.getODataEntitySet = function (oComponent) {
		var oModel = oComponent.getModel();
		var sEntitySet = oModel && oComponent.getEntitySet && oComponent.getEntitySet();
		var oMetaModel = oModel && oModel.getMetaModel();

		return sEntitySet && oMetaModel.getODataEntitySet(sEntitySet);
	};

	/**
	 * Retrieves the OData entity type of the given element (or a parent element), as registered in the MetaModel
	 *
	 * @param {sap.ui.core.UIComponent} oElement The SAPUI5 component
	 * @returns {string} The name of the entityType
	 * @public
	 */
	ChangeHandlerUtils.getEntityType = function (oElement) {
		var sEntityType;
		if (oElement) {
			if (oElement.getEntityType) {
				sEntityType = oElement.getEntityType();
			} else {
				var oComponent = ChangeHandlerUtils.getComponent(oElement);
				var sEntitySet = oComponent && oComponent.getEntitySet();
				var oMetaModel = oElement.getModel().getMetaModel();
				var oEntitySet = sEntitySet && oMetaModel && oMetaModel.getODataEntitySet(sEntitySet);
				sEntityType = oEntitySet && oEntitySet.entityType;
			}
		}

		return sEntityType;
	};

	/**
	 * Retrieves the OData entityType object of a given SAPUI5 element from the MetaModel
	 *
	 * @param {sap.ui.core.ManagedObject} oManagedObject The SAPUI5 ManagedObject
	 * @returns {object} oDataEntityType The entity type object
	 * @public
	 */
	ChangeHandlerUtils.getODataEntityType = function (oManagedObject) {
		var oDataEntityType;
		if (oManagedObject) {
			var oComponent = ChangeHandlerUtils.getComponent(oManagedObject);
			var sEntitySet = oComponent && oComponent.getEntitySet && oComponent.getEntitySet();
			var oModel = oManagedObject.getModel();
			var oCurrentMetaModel = oModel && oModel.getMetaModel();

			if (oCurrentMetaModel) {
				var oEntitySet = oCurrentMetaModel.getODataEntitySet(sEntitySet);
				var sEntityType = oEntitySet && oEntitySet.entityType;
				oDataEntityType = oCurrentMetaModel.getODataEntityType(sEntityType);
				// Determine navigation entity set in case of controls in Object Page.
				if (oManagedObject.getId().indexOf(OBJECT_PAGE) > -1) {
					var sElementName = oManagedObject.getMetadata && oManagedObject.getMetadata().getElementName && oManagedObject.getMetadata().getElementName();
					switch (sElementName) {
					case "sap.ui.comp.smarttable.SmartTable":
					case "sap.m.Table":
					case "sap.m.Column":
						var oSmartTable = AnnotationHelper.getSmartTableControl(oManagedObject);
						var sNavigationPath = oSmartTable && oSmartTable.getTableBindingPath();
						if (sNavigationPath) {
							oDataEntityType = AnnotationHelper.getRelevantDataForAnnotationRecord(oCurrentMetaModel, sNavigationPath + '/', oDataEntityType).entityType;
						}
						break;
					case "sap.ui.comp.smartform.GroupElement":
						var aDeepPathArray = oManagedObject.getBindingContext().sDeepPath.split('/');
						//get the association from deeppath
						var sFormNavigationPath = aDeepPathArray[aDeepPathArray.length - 1];
						//Get relevant Annotation only if association esists
						if (oModel.getMetaModel().getODataAssociationEnd(oDataEntityType, sFormNavigationPath)) {
							oDataEntityType = AnnotationHelper.getRelevantDataForAnnotationRecord(oCurrentMetaModel, sFormNavigationPath + '/',
								oDataEntityType).entityType;
						}
						break;
					default:
						break;
					}
				}
			}
		}
		return oDataEntityType;
	};
	/**
	 * Determines the UI.ReferenceFacet (group) and UI.CollectionFacet (form) record in the UI.Facets term for a given Group element.
	 *
	 * @param {String} sGroupId The string formed from Group element's id to uniquely identify corresponding annotation term.
	 * @param {Object[]} aFacets The UI.Facets annotation term.
	 * @returns {Object} The corresponding UI.ReferenceFacet (oGroup) and UI.CollectionFacet (oForm) record.
	 * @public
	 */
	ChangeHandlerUtils.getSmartFormGroupInfo = function (sGroupId, aFacets) {
		var oFacet, oFormInfo, sId;
		for (var i = 0; i < aFacets.length; i++) {
			oFacet = aFacets[i];
			if (oFacet && oFacet.Facets) {
				oFormInfo = ChangeHandlerUtils.getSmartFormGroupInfo(sGroupId, oFacet.Facets);
				if (oFormInfo) {
					return oFormInfo;
				}
			} else if (oFacet && oFacet.Target && oFacet.Target.AnnotationPath &&
				(oFacet.Target.AnnotationPath.indexOf(FIELDGROUP) >= 0) ||
				(oFacet.Target.AnnotationPath.indexOf(IDENTIFICATION) >= 0)) {
				sId = (oFacet.ID && oFacet.ID.String) || oFacet.Target.AnnotationPath;
				if (sId === sGroupId) {
					return {
						aForm: aFacets,
						oGroup: oFacet
					};
				}
			}
		}
	};

	/**
	 * Determines the UI.CollectionFacet record in the UI.Facets term for a given SmartForm element.
	 *
	 * @param {String} sSmartFormId The string formed from SmartForm element's id to uniquely identify corresponding annotation term.
	 * @param {Object[]} aFacets The UI.Facets annotation term.
	 * @returns {Object} The corresponding UI.CollectionFacet record.
	 * @public
	 */
	ChangeHandlerUtils.getCollectionFacet = function (sSmartFormId, aFacets) {
		var oFacet;
		for (var i = 0; i < aFacets.length; i++) {
			oFacet = aFacets[i];
			if (oFacet && oFacet.ID && oFacet.ID.String === sSmartFormId) {
				return oFacet;
			} else if (oFacet && oFacet.Facets) {
				var oCollectionFacet = ChangeHandlerUtils.getCollectionFacet(sSmartFormId, oFacet.Facets);
				if (oCollectionFacet) {
					return oCollectionFacet;
				}
			}
		}
	};

	/**
	 * Creates the collection facet with the reference facet given as a parameter
	 *
	 * @param {Object}  reference facet or collection facet with which collection facet should be initialized
	 * @return {Object} Initialiased with prameter passed
	 */
	ChangeHandlerUtils.createCollectionFacets = function (oNewFacets, sLabel) {
		var oNewCollectionFacet = {
			"Label": {
				"String": sLabel
			},
			"ID": {
				"String": "com.sap.vocabularies.UI.v1.CollectionFacet_" + AnnotationHelperForDesignTime.getNextIdSuffix(true)
			},
			"Facets": oNewFacets,
			"RecordType": "com.sap.vocabularies.UI.v1.CollectionFacet"
		};

		return oNewCollectionFacet;
	};

	/**
	 * Creates the basic annotation data for a new Field Group
	 *
	 *  @param {Object} oLineItemRecord The line item record.
	 * @returns {object} The new field group
	 * @public
	 */
	ChangeHandlerUtils.createNewFieldGroup = function (oLineItemRecord) {

		return {
			"Data": [{
				"Value": {
					"Path": oLineItemRecord.Value ? oLineItemRecord.Value.Path : ""
				},
				"RecordType": "com.sap.vocabularies.UI.v1.DataField"
			}],
			"RecordType": "com.sap.vocabularies.UI.v1.FieldGroupType"
		};
	};

	/**
	 * Dynamically creates the ID of the new field group being added with prefix RTAGroup
	 *
	 * @param {Object} Entity Type
	 * @returns {String} The generated field group ID.
	 * @public
	 */
	ChangeHandlerUtils.createFieldGroupTerm = function (oEntityType) {
		var sFieldGroupTerm = "com.sap.vocabularies.UI.v1.FieldGroup#RTAGroup";
		var iMaxValue = -1;
		for (var i in oEntityType) {
			if (i.indexOf(sFieldGroupTerm) > -1 && i.indexOf("RTAGroup") > -1) {
				var sIndex = i.substring(sFieldGroupTerm.length);
				var iIndex = parseInt(sIndex, 10);
				iMaxValue = Math.max(iIndex, iMaxValue);
			}
		}
		iMaxValue++;
		return sFieldGroupTerm + iMaxValue;
	};

	/**
	 * Retrieves the control configuration from the vertical layout that is associated with a selection field
	 *
	 * @param {sap.ui.layout.VerticalLayout} oVerticalLayout The instance of SAP UI5 VerticalLayout
	 * @returns {object} The control configurations of the smart filterbar that corresponds to the given vertical layout
	 * @public
	 */
	ChangeHandlerUtils.getSmartFilterBarControlConfiguration = function (oVerticalLayout) {
		var sId = oVerticalLayout.getContent()[0].getId();
		var sFilterKey = sId.substring(sId.lastIndexOf("-") + 1);
		var oSmartFilterBar = ChangeHandlerUtils.findSmartFilterBar(oVerticalLayout);
		var oCtrlConf = oSmartFilterBar.getControlConfiguration().filter(function (ctrlConf) {
			return ctrlConf.getKey() === sFilterKey;
		})[0];
		return oCtrlConf;
	};

	/**
	 * Retrieves the SmartFilterBar control for a given (child) element
	 *
	 * @param {sap.ui.core.Element} oElement The SAP UI5 element
	 * @returns {sap.ui.comp.smartfilterbar.SmartFilterBar} The SmartFilterBar
	 * @public
	 */
	ChangeHandlerUtils.findSmartFilterBar = function (oElement) {
		if (!oElement) {
			return;
		}
		if (oElement.getMetadata().getName() === "sap.ui.comp.smartfilterbar.SmartFilterBar") {
			return oElement;
		} else {
			return ChangeHandlerUtils.findSmartFilterBar(oElement.getParent());
		}
	};

	/**
	 Determines the index of a control in oDataModel
	 @param {object[]} oControl Control whose index has to be determined
	 @returns {integer} The index of the control in the ODataMetaModel
	 */
	ChangeHandlerUtils.getIndexFromInstanceMetadataPath = function (oControl) {
		var iRecordIndex = -1;
		var oTemplInfo = ChangeHandlerUtils.getTemplatingInfo(oControl);
		if (oTemplInfo && oTemplInfo.path) {
			iRecordIndex = parseInt(oTemplInfo.path.substring(oTemplInfo.path.lastIndexOf("/") + 1), 10);
		}
		return iRecordIndex;
	};

	/**
	 * Tests if the section contains more than one subsection
	 * @param {object[]} model of Section Annotation
	 * return {boolean} true if section has more than one subsection, false otherwise
	 */
	ChangeHandlerUtils.fnIsSubsectionsPresent = function (oFacet) {
		return (oFacet.RecordType === COLLECTION_FACET && oFacet.Facets[0].RecordType === COLLECTION_FACET && oFacet.Facets.length);
	};

	/**
	 * Performs the custom code implementation of ADD subsection control
	 * @param {sap.ui.core.Element} Instance of Parent Section Control
	 * @param {object[]} model of Annotations.
	 * @param {int} position of target .
	 * Perform Add action for the subsection control
	 */

	ChangeHandlerUtils.fnAddSubSection = function (oParentControl, aAnnotations, iTargetIndex) {
		var sFieldGroupTerm = "com.sap.vocabularies.UI.v1.FieldGroup#RTAGroup" + AnnotationHelperForDesignTime.getNextIdSuffix(true);
		var oNewReferenceFacet = {
			"Label": {
				"String": "New Group"
			},
			"Target": {
				"AnnotationPath": "@" + sFieldGroupTerm
			},
			"RecordType": REFERENCE_FACET
		};

		var aFacet = [];
		var iAnnotationIndex = ChangeHandlerUtils.getIndexFromInstanceMetadataPath(oParentControl);
		if (!ChangeHandlerUtils.fnIsSubsectionsPresent(aAnnotations[iAnnotationIndex])) {
			if (aAnnotations[iAnnotationIndex].RecordType === REFERENCE_FACET) {
				aFacet.push(aAnnotations[iAnnotationIndex]);
				var oExistingFacets = ChangeHandlerUtils.createCollectionFacets(aFacet, "New SubSection");
			} else {
				var oExistingFacets = aAnnotations[iAnnotationIndex];
			}
			var oNewFacetForCollectionFacet = ChangeHandlerUtils.createCollectionFacets([oNewReferenceFacet], "New Subsection");
			var ResultantFacet = [oExistingFacets, oNewFacetForCollectionFacet];
			var oNewCollectionFacet = ChangeHandlerUtils.createCollectionFacets(ResultantFacet, aAnnotations[iAnnotationIndex].Label.String);
			aAnnotations.splice(iAnnotationIndex, 1, oNewCollectionFacet);
		} else {
			var ResultantFacet = [oNewReferenceFacet];
			var oNewCollectionFacet = ChangeHandlerUtils.createCollectionFacets(ResultantFacet, "New SubSection");
			aAnnotations[iAnnotationIndex].Facets.splice(iTargetIndex, 0, oNewCollectionFacet);

		}

		return sFieldGroupTerm;
	};
	/**
	 * Performs the custom code implementation of Move subsection Control
	 * @param {sap.ui.core.Element} Instance of Subsection Control
	 * @param {object[]} model of Annotations.
	 * Perform Move action for the subsection control
	 */

	ChangeHandlerUtils.fnMoveSubSection = function (oUISourceSection, oUITargeSection, iAnnotationSourceIndex, iAnnotationTargetIndex,
		aAnnotations) {
		var iSourceSectionIndex = ChangeHandlerUtils.getIndexFromInstanceMetadataPath(oUISourceSection);
		var iTargetSectionIndex = ChangeHandlerUtils.getIndexFromInstanceMetadataPath(oUITargeSection);
		var aFacet = [];
		if (!ChangeHandlerUtils.fnIsSubsectionsPresent(aAnnotations[iTargetSectionIndex])) {
			if (aAnnotations[iTargetSectionIndex].RecordType === REFERENCE_FACET) {
				aFacet.push(aAnnotations[iTargetSectionIndex]);
			} else {
				for (var oFacet in aAnnotations[iTargetSectionIndex].Facets) {
					aFacet.push(aAnnotations[iTargetSectionIndex].Facets[oFacet]);
				}
			}
			if (aFacet[0].RecordType === REFERENCE_FACET) {
				var oTargetCollectionFacet = ChangeHandlerUtils.createCollectionFacets(aFacet, aAnnotations[iTargetSectionIndex].Label.String);
				if (aAnnotations[iSourceSectionIndex].Facets) {
					var oSourceCollectionFacet = aAnnotations[iSourceSectionIndex].Facets[iAnnotationSourceIndex];
				} else {
					var oSourceCollectionFacet = ChangeHandlerUtils.createCollectionFacets([aAnnotations[iSourceSectionIndex]], aAnnotations[
						iSourceSectionIndex].Label.String);
				}
				var oResultantCollectionFacet = [oTargetCollectionFacet];
				oResultantCollectionFacet.splice(iAnnotationTargetIndex, 0, oSourceCollectionFacet);
			} else {
				var oSourceCollectionFacet = aAnnotations[iSourceSectionIndex].Facets[iAnnotationSourceIndex];
				var oResultantCollectionFacet = [oSourceCollectionFacet];
				for (var oFacet in aFacet) {
					oResultantCollectionFacet.push(aFacet[oFacet]);
				}
			}
			var oNewCollectionFacet = ChangeHandlerUtils.createCollectionFacets(oResultantCollectionFacet, aAnnotations[iTargetSectionIndex].Label
				.String);
			aAnnotations.splice(iTargetSectionIndex, 1, oNewCollectionFacet);
			if (!aAnnotations[iSourceSectionIndex].Facets || !aAnnotations[iSourceSectionIndex].Facets.length) {
				aAnnotations.splice(iSourceSectionIndex, 1);
			} else {
				aAnnotations[iSourceSectionIndex].Facets.splice(iAnnotationSourceIndex, 1);
				if (aAnnotations[iSourceSectionIndex].Facets && !aAnnotations[iSourceSectionIndex].Facets.length) {
					aAnnotations.splice(iSourceSectionIndex, 1);
				}
			}
		} else if (aAnnotations[iSourceSectionIndex].RecordType === REFERENCE_FACET) {
			var oRefFacet = aAnnotations[iSourceSectionIndex];
			var oResultantFacet = ChangeHandlerUtils.createCollectionFacets([oRefFacet], aAnnotations[iSourceSectionIndex].Label.String);
			aAnnotations[iTargetSectionIndex].Facets.splice(iAnnotationTargetIndex, 0, oResultantFacet);
			aAnnotations.splice(iSourceSectionIndex, 1);
		} else {
			if (aAnnotations[iSourceSectionIndex].Facets[0].RecordType === REFERENCE_FACET) {
				aAnnotations[iTargetSectionIndex].Facets.splice(iAnnotationTargetIndex, 0, aAnnotations.splice(iSourceSectionIndex, 1)[0]);
			} else {
				aAnnotations[iTargetSectionIndex].Facets.splice(iAnnotationTargetIndex, 0, aAnnotations[iSourceSectionIndex].Facets.splice(
					iAnnotationSourceIndex, 1)[0]);
				if (aAnnotations[iSourceSectionIndex].Facets && !aAnnotations[iSourceSectionIndex].Facets.length) {
					aAnnotations.splice(iSourceSectionIndex, 1);
				}
			}
		}
	};
	/**
	 * Performs the custom code implementation of remove subsection contorl
	 * @param {sap.ui.core.Element} Instance of Subsection Control
	 * @param {object[]} model of Annotations.
	 * Perform Remove action for the subsection control
	 */

	ChangeHandlerUtils.fnRemoveSubSection = function (oRemovedSubSection, aAnnotations) {
		var oParentSection = oRemovedSubSection.getParent();
		// Find out index from where subsection annotation should be removed
		var iAnnotationIndex = ChangeHandlerUtils.getIndexFromInstanceMetadataPath(oRemovedSubSection);
		if (iAnnotationIndex >= 0) {
			var iSectionIndex = ChangeHandlerUtils.getIndexFromInstanceMetadataPath(oParentSection);
			aAnnotations[iSectionIndex].Facets.splice(iAnnotationIndex, 1);
		}
	};

	/**
	 Returns the UI header facets within the header content.
	 @param {object} oControl Header content control
	 @returns {object[]} List of header facet controls.
	 */
	ChangeHandlerUtils.getUIHeaderFacets = function (oControl) {
		var aUiHeaderFacets = [];
		switch (oControl.getMetadata().getElementName()) {
		case "sap.uxap.ObjectPageHeaderContent":
			aUiHeaderFacets = oControl.getContent();
			break;
		case "sap.m.FlexBox":
			aUiHeaderFacets = oControl.getItems();
			break;
		}
		return aUiHeaderFacets;
	};

	/**
	 Determines the index of a header facet in oDataModel
	 @param {object} oHeader Header facet whose index has to be determined
	 @param {object[]} aAnnotations Header facets in the oDataModel.
	 @param {object[]} aUiHeaderFacets UI header facets.
	 @param {integer} iIndex The index of the header in the UI.
	 @returns {integer} The index of the headers in the ODataMetaModel
	 */
	ChangeHandlerUtils.getHeaderFacetIndex = function (oHeader, aAnnotations, aUiHeaderFacets, iIndex) {
		if (oHeader && oHeader.getMetadata().getElementName() === "sap.m.VBox") {
			if (ChangeHandlerUtils.getTemplatingInfo(oHeader)) {
				return ChangeHandlerUtils.getIndexFromInstanceMetadataPath(oHeader);
			} else {
				if (oHeader.getId().indexOf("AfterImageExtension") > -1) {
					return 0;
				}
				if (!aUiHeaderFacets) {
					aUiHeaderFacets = ChangeHandlerUtils.getUIHeaderFacets(oHeader.getParent());
				}
				if (!iIndex) {
					for (var i = 0; i < aUiHeaderFacets.length; i++) {
						if (aUiHeaderFacets[i].getId() === oHeader.getId()) {
							iIndex = i;
							break;
						}
					}
				}
				if (oHeader.getId().indexOf("BeforeReferenceExtension") > -1) {
					return ChangeHandlerUtils.getHeaderFacetIndex(aUiHeaderFacets[iIndex + 1], aAnnotations, aUiHeaderFacets, iIndex + 1);
				} else if (oHeader.getId().indexOf("AfterReferenceExtension") > -1) {
					return ChangeHandlerUtils.getHeaderFacetIndex(aUiHeaderFacets[iIndex - 1], aAnnotations, aUiHeaderFacets, iIndex - 1);
				} else { // ReplaceReferenceExtension scenario.
					var oFacet,
						iAnnotatedFacetIndex = aAnnotations.length - 1;
					for (var i = iIndex; i < aUiHeaderFacets.length; i++) {
						oFacet = aUiHeaderFacets[i + 1];
						if (oFacet && ChangeHandlerUtils.getTemplatingInfo(oFacet)) {
							iAnnotatedFacetIndex = ChangeHandlerUtils.getIndexFromInstanceMetadataPath(oFacet) - 1;
							break;
						}
					}
					return iAnnotatedFacetIndex;
				}
			}
		} else {
			return -1;
		}
	};

	/**
	 * Transforms the array of custom data objects into one object with key/value pairs
	 * @param {sap.ui.core.Element} oElement The SAP UI5 element
	 * @returns {object} Object comprising all custom data as key/value pairs
	 * @public
	 */
	ChangeHandlerUtils.getCustomDataObject = function (oElement) {
		var aCustomData = oElement.getCustomData(),
			oCustomData = {};
		if (!aCustomData) {
			return;
		}
		for (var i = 0; i < aCustomData.length; i++) {
			oCustomData[aCustomData[i].getKey()] = aCustomData[i].getValue();
		}
		return oCustomData;
	};

	/**
	 * Retrieves the Group element collection from the ODataMetaModel for a given element.
	 *
	 * @param {sap.ui.core.Element} oElement The SAP UI5 element
	 * @returns {object[]} The list of records of the group element collection
	 * @public
	 */
	ChangeHandlerUtils.getGroupElements = function (oElement, oTemplData) {
		var sGroupElementQualifier = oTemplData.annotation;
		var oEntityType = ChangeHandlerUtils.getODataEntityType(oElement);
		var oEntity = oEntityType && oEntityType[sGroupElementQualifier];
		return oEntity['Data'] || oEntity;
	};

	/**
	 * Determines the index of a Group Element in the ODataMetaModel.
	 *
	 * @param {object} oElement - group element
	 * @param {object[]} aGroupElements The list of elements of the line Group Element collection
	 * @returns {integer} The index of the record in the ODataMetaModel
	 * @public
	 */
	ChangeHandlerUtils.getGroupElementRecordIndex = function (oElement, aGroupElementsData) {
		if (!oElement || !aGroupElementsData) {
			return;
		}
		var oTemplData = ChangeHandlerUtils.getTemplatingInfo(oElement);
		var annotationContext = oTemplData.annotationContext;
		var iRecordIndex = -1;
		if (annotationContext && aGroupElementsData && aGroupElementsData.length > 0) {
			for (var i = 0; i < aGroupElementsData.length; i++) {
				//If RecordType present then must match to that present in annotation
				if (annotationContext.RecordType && (!aGroupElementsData[i].RecordType || (aGroupElementsData[i].RecordType !== annotationContext.RecordType))) {
					continue;
				}
				//if Action present it must match to that present in annotation
				if (annotationContext.Action && annotationContext.Action.String && (!aGroupElementsData[i].Action || aGroupElementsData[i].Action.String !==
						annotationContext.Action.String)) {
					continue;
				}
				if (annotationContext.Action && annotationContext.Action.Path && (!aGroupElementsData[i].Action || aGroupElementsData[i].Action.Path !==
						annotationContext.Action.Path)) {
					continue;
				}
				//If SemanticObject present then must match to that present in annotation
				if (annotationContext.SemanticObject && annotationContext.SemanticObject.String && (!aGroupElementsData[i].SemanticObject || (
						aGroupElementsData[i].SemanticObject.String !== annotationContext.SemanticObject.String))) {
					continue;
				}
				if (annotationContext.SemanticObject && annotationContext.SemanticObject.Path && (!aGroupElementsData[i].SemanticObject || (
						aGroupElementsData[i].SemanticObject.Path !== annotationContext.SemanticObject.Path))) {
					continue;
				}
				//If Target present then must match to that present in annotation
				if (annotationContext.Target && annotationContext.Target.AnnotationPath && (!aGroupElementsData[i].Target || (aGroupElementsData[i].Target
						.AnnotationPath !== annotationContext.Target.AnnotationPath))) {
					continue;
				}
				//If Value present then must match to that present in annotation
				if (annotationContext.Value && annotationContext.Value.Path && (!aGroupElementsData[i].Value || (aGroupElementsData[i].Value.Path !==
						annotationContext.Value.Path))) {
					continue;
				}
				//If all items match then
				iRecordIndex = i;
				break;
			}
		}
		return iRecordIndex;
	};

	/**
	 * Retrieves the lineItem collection from the ODataMetaModel for a given element.
	 *
	 * @param {sap.ui.core.Element} oElement The SAP UI5 element
	 * @returns {object[]} The list of records of the line item collection
	 * @public
	 */
	ChangeHandlerUtils.getLineItems = function (oElement) {
		var oEntityType;
		var sLineItem = LINEITEM;
		if (oElement.getId().indexOf(OBJECT_PAGE) > -1) { //Control in Object Page
			oElement = AnnotationHelper.getSmartTableControl(oElement);
			var sLineItemQualifier = AnnotationHelper.getLineItemQualifier(oElement.getCustomData());
			sLineItem = sLineItemQualifier ? sLineItem + "#" + sLineItemQualifier : sLineItem;
		}
		//var oComponent = ChangeHandlerUtils.getComponent(oElement);
		oEntityType = ChangeHandlerUtils.getODataEntityType(oElement);
		return oEntityType && oEntityType[sLineItem];
	};

	/**
	 * Determines the index of a lineItem record in the ODataMetaModel for a given table column.
	 *
	 * @param {sap.m.Column} oColumn Column of a List Report table
	 * @param {object[]} aLineItems The list of records of the line item collection
	 *                  (can be determined by calling getLineItems before)
	 * @returns {integer} The index of the record in the ODataMetaModel
	 * @public
	 */
	ChangeHandlerUtils.getLineItemRecordIndex = function (oColumn, aLineItems) {
		if (!oColumn) {
			return;
		}
		if (!aLineItems) {
			aLineItems = ChangeHandlerUtils.getLineItems(oColumn);
		}
		if (!aLineItems) {
			return;
		}
		var iRecordIndex = -1,
			i,
			oP13nValue = oColumn.data("p13nData");

		if (!oP13nValue || !aLineItems || aLineItems.length === 0) {
			return iRecordIndex;
		}
		if (!oP13nValue.columnKey || oP13nValue.columnKey.search("template::") === -1) {
			// it is no template, take columnKey as is
			for (i = 0; i < aLineItems.length; i++) {
				if (aLineItems[i].Value && aLineItems[i].Value.Path === oP13nValue.leadingProperty) {
					return i;
				}
			}
			return iRecordIndex;
		}
		var aTemplate = oP13nValue.columnKey.split("::");
		switch (aTemplate[1]) {
		case "DataFieldForAction":
			for (i = 0; i < aLineItems.length; i++) {
				if (aLineItems[i].RecordType === DATAFIELDFORACTION && aLineItems[i].Action.String === aTemplate[2]) {
					return i;
				}
			}
			break;
		case "DataFieldForAnnotation":
			for (i = 0; i < aLineItems.length; i++) {
				if (aLineItems[i].RecordType === DATAFIELDFORANNOTATION && aLineItems[i].Target && aLineItems[i].Target.AnnotationPath && aLineItems[
						i].Target.AnnotationPath.replace("@", "") === aTemplate[2]) {
					return i;
				}
			}
			break;
		case "DataFieldWithIntentBasedNavigation":
			for (i = 0; i < aLineItems.length; i++) {
				if (aLineItems[i].RecordType === INTENTBASEDNAV && aLineItems[i].SemanticObject.String === aTemplate[2] && aLineItems[i].Action.String ===
					aTemplate[3]) {
					return i;
				}
			}
			break;
		case "DataFieldForIntentBasedNavigation":
			for (i = 0; i < aLineItems.length; i++) {
				if (aLineItems[i].RecordType === FORINTENTBASEDNAV && aLineItems[i].SemanticObject.String === aTemplate[2] && aLineItems[i].Action.String ===
					aTemplate[3] && aLineItems[i].Inline && aLineItems[i].Inline.Bool === "true") {
					return i;
				}
			}
			break;
		default:
			for (i = 0; i < aLineItems.length; i++) {
				if (aLineItems[i].Value && aLineItems[i].Value.Path === oP13nValue.leadingProperty) {
					return i;
				}
			}
			break;
		}
		return iRecordIndex;
	};

	/**
	 * Determines the index of a lineItem record in the ODataMetaModel for a given table toolbar button.
	 *
	 * @param {sap.m.Button} oButton Button of a List Report table toolbar
	 * @param {object[]} aLineItems The list of records of the line item collection
	 *                  (can be determined by calling getLineItems before)
	 * @returns {integer} The index of the record in the ODataMetaModel
	 * @public
	 */
	ChangeHandlerUtils.getLineItemRecordIndexForButton = function (oButton, aLineItems) {
		if (!aLineItems) {
			aLineItems = ChangeHandlerUtils.getLineItems(oButton);
		}
		if (!aLineItems) {
			return;
		}
		var oCustomData = ChangeHandlerUtils.getCustomDataObject(oButton),
			lineItemIndex = -1,
			oEntry;

		for (var i = 0; i < aLineItems.length; ++i) {
			oEntry = aLineItems[i];
			if (oEntry.RecordType === DATAFIELDFORACTION &&
				oEntry.Action && oEntry.Action.String === oCustomData.Action ||
				oEntry.RecordType === FORINTENTBASEDNAV &&
				oEntry.Action && oEntry.Action.String === oCustomData.Action &&
				oEntry.SemanticObject && oEntry.SemanticObject.String === oCustomData.SemanticObject) {

				lineItemIndex = i;
				break;
			}
		}

		return lineItemIndex;
	};

	/**
	 * Returns the selector for the actual filter element
	 *
	 * @param { string } sRemovedElementId - The id of the verticalLayout of the filter element
	 * @param { mPropertyBag } mPropertyBag - Propertybag of the filter element
	 * @returns { oSelector } The selector of the child filter element.
	 */
	ChangeHandlerUtils.getRemoveElementSelector = function (sRemovedElementId, mPropertyBag) {
		var sChildRemovedElementId = mPropertyBag.modifier.bySelector(sRemovedElementId, mPropertyBag.appComponent).getContent()[1].sId;
		return mPropertyBag.modifier.getSelector(sChildRemovedElementId, mPropertyBag.appComponent);
	};

	/**
	 * Determines the index of a record in the annotations for a given selection field.
	 *
	 * @param {sap.ui.layout.VerticalLayout} oVerticalLayout The selection field, represented by the selectable element which is the vertical layout.
	 * @param {array} aAnnotations - List of annotations.
	 * @returns {integer} The index of the record in the ODataMetaModel
	 * @public
	 */
	ChangeHandlerUtils.getRecordIndexForSelectionFieldFromAnnotation = function (oVerticalLayout, aAnnotations) {
		var iTargetIndex = 0;
		var aElements = sap.ui.getCore().byId(oVerticalLayout.sId).getContent()[0].getHeader().getContent()[0].getContent()[0].getContent();
		var iOffset = this.index >= aElements.length ? 1 : 0;
		var oElement = aElements[this.index - iOffset];
		var oTemplData = ChangeHandlerUtils.getTemplatingInfo(ChangeHandlerUtils.getSmartFilterBarControlConfiguration(oElement));
		if (oTemplData && oTemplData.annotation === SELECTIONFIELDS) {
			aAnnotations.some(function (oEntry, i) {
				if (oEntry.PropertyPath === oTemplData.value) {
					iTargetIndex = i + iOffset;
					return true;
				}
			});
		}
		return iTargetIndex;
	};

	/**
	 * Determines the index of a record in the ODataMetaModel for a given selection field.
	 *
	 * @param {sap.ui.layout.VerticalLayout} oVerticalLayout The selection field, represented by the selectable
	 * element which is the vertical layout.
	 * @returns {integer} The index of the record in the ODataMetaModel
	 * @public
	 */
	ChangeHandlerUtils.getRecordIndexForSelectionField = function (oVerticalLayout) {
		var iTargetIndex = -1,
			sEntityType = oVerticalLayout.getParent().getParent().getEntityType(),
			oMetaModel = oVerticalLayout.getModel().getMetaModel(),
			oEntityType = oMetaModel.getODataEntityType(sEntityType),
			aSelectionFields = oEntityType && oEntityType[SELECTIONFIELDS];

		var oTemplData = ChangeHandlerUtils.getTemplatingInfo(ChangeHandlerUtils.getSmartFilterBarControlConfiguration(oVerticalLayout));
		if (oTemplData && oTemplData.annotation === SELECTIONFIELDS) {
			aSelectionFields.some(function (oEntry, i) {
				if (oEntry.PropertyPath === oTemplData.value) {
					iTargetIndex = i;
					return true;
				}
			});
		}
		return iTargetIndex;
	};

	/**
	 * Determines the record of a lineItem collection in the ODataMetaModel for a given toolbar button.
	 *
	 * @param {object} oButton Toolbar button of a List Report table
	 * @returns {object} The record of the ODataMetaModel
	 * @public
	 */
	ChangeHandlerUtils.getLineItemRecordForButton = function (oButton) {
		// goal: to be generalized, to work for any type of collection
		var aLineItems = ChangeHandlerUtils.getLineItems(oButton);
		if (!aLineItems) {
			return;
		}
		var iLineItemRecordIndex = ChangeHandlerUtils.getLineItemRecordIndexForButton(oButton, aLineItems);
		return aLineItems[iLineItemRecordIndex];
	};

	/**
	 * Determines the record of a lineItem collection in the ODataMetaModel for a given table column.
	 *
	 * @param {sap.m.Column} oColumn Column of a List Report table
	 * @returns {object} The record of the ODataMetaModel
	 * @public
	 */
	ChangeHandlerUtils.getLineItemRecordForColumn = function (oColumn) {
		// goal: to be generalized, to work for any type of collection
		var aLineItems = ChangeHandlerUtils.getLineItems(oColumn);
		if (!aLineItems) {
			return;
		}
		var iLineItemRecordIndex = ChangeHandlerUtils.getLineItemRecordIndex(oColumn, aLineItems);
		return aLineItems[iLineItemRecordIndex];
	};

	/**
	 * Retrieves the templating info object (if existant) for an element.
	 * The templating info is contained in an element's custom data.
	 * This object is currently only available for a controlConfiguration element in the SmartFilterBar.
	 *
	 * @param {object} oElement The UI5 element
	 * @returns {object} The templating info object
	 * @public
	 */
	ChangeHandlerUtils.getTemplatingInfo = function (oElement) {
		// goal: to be generalized, to work for any type of collection
		var oTemplData, vTemplData;
		if (oElement) {
			vTemplData = oElement.data("sap-ui-custom-settings") && oElement.data("sap-ui-custom-settings")["sap.ui.dt"] && oElement.data(
				"sap-ui-custom-settings")["sap.ui.dt"].annotation;
			if (vTemplData && typeof (vTemplData) === "string") {
				oTemplData = JSON.parse(vTemplData);
			}
		}
		return oTemplData || vTemplData;
	};

	/**
	 * Retrieves the property of a column from the p13n data
	 *
	 * @param {sap.m.Column} oColumn The instance of sap.m.Column
	 * @returns {string} The property that is represented by the column
	 * @public
	 */
	ChangeHandlerUtils.getPropertyOfColumn = function (oColumn) {
		var oP13nValue = oColumn.data("p13nData"),
			sProperty = oP13nValue && oP13nValue.leadingProperty;

		return sProperty;
	};

	/**
	 * Retrieves the ODataPath of a given element.
	 * The ODataPath is needed for addressing the element in the ODataMetamodel.
	 * The function delegates to specific functions of the designtime when needed
	 *
	 * @param {object} oOverlay The element overlay
	 * @param {object} oAnnotation (optional) The specific annotation definition from the designtime metadata
	 *                 Optional, as we consider the annotation from the instance specific metadata first.
	 *                 oAnnotation will be added afterwards, if passed, and if the annotation has a target.
	 * @returns {string} The OData path
	 * @public
	 */
	ChangeHandlerUtils.getODataPath = function (oOverlay, oAnnotation) {

		var sODataPath,
			iTargetIndex = -1,
			oCommonInstanceData,
			oElement = oOverlay.getElement(),
			oMetaModel = oElement.getModel().getMetaModel(),
			oDesigntimeMetadata = oOverlay.getDesignTimeMetadata() && oOverlay.getDesignTimeMetadata().getData();

		if (oDesigntimeMetadata && typeof oDesigntimeMetadata.getCommonInstanceData === "function") {
			oCommonInstanceData = oDesigntimeMetadata.getCommonInstanceData(oElement);
		}
		if (!oCommonInstanceData) {
			if (!oAnnotation || !oAnnotation.target) {
				return;
			}
			for (var i = 0; i < oAnnotation.target.length; i++) {
				if (oAnnotation.target[i] === "EntityType") {
					iTargetIndex = i;
					break;
				} else if (oAnnotation.target[i] === "EntitySet") {
					iTargetIndex = i;
					// don't break but further look for EntityType
				}
			}
			if (iTargetIndex > -1) {
				var sEntityType = ChangeHandlerUtils.getEntityType(oElement);

				if (!oMetaModel.getODataEntityType) {
					return;
				}
				var oEntityType = oMetaModel.getODataEntityType(sEntityType);

				switch (oAnnotation.target[iTargetIndex]) {
				case "EntityType":
					sODataPath = oEntityType && oEntityType.namespace + "." + oEntityType.name;
					break;
				case "EntitySet":
					var oComponent = ChangeHandlerUtils.getComponent(oElement);
					var oEntitySet = ChangeHandlerUtils.getODataEntitySet(oComponent);
					var sEntitySet = oEntitySet && oEntitySet.name;
					sODataPath = oEntityType && oEntityType.namespace + "." + sEntitySet;
					break;
				default:
					return; // we need instance specific metadata here!
				}
			}
		} else {
			sODataPath = oCommonInstanceData.target;
		}
		if (sODataPath && oAnnotation && oAnnotation.target) {
			sODataPath += "/" + oAnnotation.namespace + "." + oAnnotation.annotation;
		}
		return sODataPath;
	};

	/**
	 * Determines the EntityType from a given AnnotationPath.
	 *
	 * @param {object} oElement The SAPUI5 Element.
	 * @param {string} sAnnotationPath The AnnotationPath.
	 * @returns {object} The EntityType object.
	 * @public
	 */

	ChangeHandlerUtils.getEntityTypeFromAnnotationPath = function (oElement, sAnnotationPath) {
		var oEntityType;
		if (!oElement || !sAnnotationPath) {
			return oEntityType;
		}
		var oMetaModel = oElement.getModel() && oElement.getModel().getMetaModel();

		if (!oMetaModel) {
			return oEntityType;
		}
		oEntityType = ChangeHandlerUtils.getODataEntityType(oElement);
		// Consider navigation paths
		if (sAnnotationPath.search("/") > -1) {
			oEntityType = AnnotationHelper.getRelevantDataForAnnotationRecord(oMetaModel, sAnnotationPath, oEntityType).entityType;
		}
		return oEntityType;
	};

	/**
	 * Cleanup and Rebind the table structure so that UI State API correctly updates the property panel
	 * It handles updation of Outline pane in case of move / remove for both UI Table and Responsive Table.
	 *
	 * @param {oTable} oTable is instance of Table on which the move or remove operation is being performed upon.
	 **/

	ChangeHandlerUtils.fnAdaptTableStructures = function (oTable) {
		var oBindingInfo = oTable.getBindingInfo("items");
		var aOrderedColumns = oTable.getColumns(true);
		if (oBindingInfo && oBindingInfo.template) {
			var oTemplate = oBindingInfo.template;
			var aTemplateCells = oTemplate.getCells();
			if (aTemplateCells.length === aOrderedColumns.length) {
				// Bring the cells in the rows template to the right order
				var aCells = [];
				for (var i = 0; i < aOrderedColumns.length; i++) {
					aCells.push(aTemplateCells[oTable.indexOfColumn(aOrderedColumns[i])]);
				}
				// Cleanup the existing state
				oBindingInfo.template = null; // Remove the template from the bindinginfo before unbind to be able to reuse it later
				oTable.unbindItems();
				oTable.removeAllColumns();
				oTemplate.removeAllCells();
				// Apply the new state
				for (var i = 0; i < aOrderedColumns.length; i++) {
					if (aOrderedColumns[i].getVisible()) {
						oTable.addColumn(aOrderedColumns[i]);
						oTemplate.addCell(aCells[i]);
					}
				}
				// Initialze the binding again
				oBindingInfo.template = oTemplate;
				oTable.bindItems(oBindingInfo, oBindingInfo.model);
				return;
			}
		}
		throw new Error("Unsupported Operation");
	};

	//TODO - This method should be moved to another metadata library. Rohit sinha is currently working on this
	/**
	 * returns the field to be displayed in add pop up for entity set.
	 * sType would be used to be differentiated between filter and table mode. Currently it's not implemented.
	 * @param {object} oControl The SAPUI5 Element.
	 * @param {string} sType - represents either table or filter.
	 * @returns {array} Returns array of items for the custom popup.
	 *
	 * @public
	 **/

	ChangeHandlerUtils.getPropertiesForCustomPopUp = function (oControl, sType) {
		if (!oControl || !sType) {
			return [];
		}
		var oComponent = ChangeHandlerUtils.getComponent(oControl);
		var oEntityType = ChangeHandlerUtils.getODataEntityType(oComponent);
		var aProperty = oEntityType.property;
		var aPopUpData = [];
		switch (sType) {
		case 'table':
			oControl = oControl.getParent();
			aProperty.map(function (oProperty) {
				if (!oProperty["com.sap.vocabularies.UI.v1.Hidden"] || oProperty["com.sap.vocabularies.UI.v1.Hidden"].Bool === 'false') {
					var aVisualization = oControl.getUiState().getPresentationVariant().Visualizations;
					var aShownColumn = aVisualization[0].Content;
					var sProperty = oProperty.name;
					var bPropertyPresent = aShownColumn.some(function (oShownProperty) {
						return oShownProperty.Value === sProperty;
					});
					if (!bPropertyPresent) {
						aPopUpData.push(oProperty);
					}
				}
			});
			break;
		case 'filter':
			aProperty.map(function (oProperty) {
				if ((!oProperty["com.sap.vocabularies.UI.v1.Hidden"] || oProperty["com.sap.vocabularies.UI.v1.Hidden"].Bool === 'false') && (!oProperty["sap:filterable"] || !(oProperty["sap:filterable"] === 'false'))) {
					aPopUpData.push(oProperty);
				}
			});
			break;
		}
		return aPopUpData;
	};

	return ChangeHandlerUtils;
});
