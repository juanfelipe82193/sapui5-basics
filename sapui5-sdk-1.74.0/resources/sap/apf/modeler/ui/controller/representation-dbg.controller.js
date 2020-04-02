/*!
* SAP APF Analysis Path Framework
*
* (c) Copyright 2012-2014 SAP SE. All rights reserved
*/
sap.ui.define([
	"sap/apf/modeler/ui/utils/representationHandler",
	"sap/apf/ui/utils/constants",
	"sap/apf/core/constants",
	"sap/apf/modeler/ui/utils/nullObjectChecker",
	"sap/apf/modeler/ui/utils/optionsValueModelBuilder",
	"sap/apf/modeler/ui/utils/sortDataHandler",
	"sap/apf/modeler/ui/utils/representationBasicDataHandler",
	"sap/apf/modeler/ui/utils/stepPropertyMetadataHandler",
	"sap/apf/ui/utils/representationTypesHandler",
	"sap/apf/modeler/ui/utils/viewValidator",
	"sap/ui/core/mvc/Controller"
], function(RepresentationHandler, uiConstants, coreConstants, nullObjectChecker, optionsValueModelBuilder, SortDataHandler,
			RepresentationBasicDataHandler, StepPropertyMetadataHandler, RepresentationTypesHandler, ViewValidator,
			MvcController
){
	'use strict';
	var oParams,
		oCoreApi,
		oConfigurationEditor,
		oRepresentation, // reference to the parent representation
		oParentStep,
		oRepresentationTypeHandler,
		oStepPropertyMetadataHandler,
		oRepresentationHandler,
		oRepresentationBasicDataHandler,
		oSortDataHandler;
	var oLabelDisplayOptions = coreConstants.representationMetadata.labelDisplayOptions;
	function _setDisplayText(oController) {
		oController.byId("idVisualization").setText(oCoreApi.getText("visualization"));
		oController.byId("idChartTypeLabel").setText(oCoreApi.getText("chartType"));
		oController.byId("idChartTypeLabel").setTooltip(oCoreApi.getText("chartType"));
		oController.byId("idBasicData").setText(oCoreApi.getText("basicData"));
		oController.byId("idSorting").setText(oCoreApi.getText("sorting"));
		oController.byId("idChartType").setValueStateText(oCoreApi.getText("modeler.ui.representation.invalidChartTypeError"));
	}
	function _updateTreeNode(oController, sRepresentationTypeText) {
		var oRepnInfo;
		var oIconForRepn = oRepresentationTypeHandler.getPictureOfRepresentationType(oRepresentation.getRepresentationType());
		var aStepCategories = oConfigurationEditor.getCategoriesForStep(oParentStep.getId());
		if (aStepCategories.length === 1) {//In case the step of representation is only assigned to one category
			oRepnInfo = {
				id : oRepresentation.getId(),
				icon : oIconForRepn
			};
			if (sRepresentationTypeText) {
				oRepnInfo.name = sRepresentationTypeText;
			}
			oController.getView().getViewData().updateSelectedNode(oRepnInfo);
		} else {
			oController.getView().getViewData().updateTree();
		}
	}
	// Updates the title and bread crumb with new chart type
	function _updateBreadCrumb(oController, sRepresentationTypeText) {
		var sTitle = oCoreApi.getText("representation") + ": " + sRepresentationTypeText;
		oController.getView().getViewData().updateTitleAndBreadCrumb(sTitle);
	}
	function _updateRepresentationType(sRepresentationType) {
		oRepresentation.setRepresentationType(sRepresentationType);
		var sAlternateRepresentationType = "TableRepresentation";
		if (sRepresentationType === uiConstants.representationTypes.TABLE_REPRESENTATION || sRepresentationType === uiConstants.representationTypes.TREE_TABLE_REPRESENTATION) {
			sAlternateRepresentationType = undefined;
		}
		oRepresentation.setAlternateRepresentationType(sAlternateRepresentationType); // set alternate representation for charts
	}
	function _setDefaultStateOfDimensionAsPromise(sRepresentationType) {
		var bIsKindUsed;
		var deferred = jQuery.Deferred();
		oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(oEntityTypeMetadata) {//new
			var dimensionProperties = oStepPropertyMetadataHandler.getDimensionsProperties(oEntityTypeMetadata);
			var aDefaultDimensionKinds = oRepresentationTypeHandler.getKindsForDimensionPropertyType(sRepresentationType);
			aDefaultDimensionKinds.forEach(function(sKind, nIndex) {
				bIsKindUsed = false;
				var bIsTextPropertyPresent;
				var sDefaultLabelDisplayOption;
				var sDefaultDimension = dimensionProperties[nIndex];
				if (oRepresentation.getDimensions().length !== 0) {
					if (oRepresentation.getDimensions()[nIndex]) {
						if (oRepresentation.getDimensionKind(oRepresentation.getDimensions()[nIndex])) {
							bIsKindUsed = true;
						}
					}
				}
				if (!bIsKindUsed && sDefaultDimension) {
					bIsTextPropertyPresent = oStepPropertyMetadataHandler.hasTextPropertyOfDimension(oEntityTypeMetadata, sDefaultDimension);
					sDefaultLabelDisplayOption = bIsTextPropertyPresent ? oLabelDisplayOptions.KEY_AND_TEXT : oLabelDisplayOptions.KEY;
					oRepresentation.addDimension(sDefaultDimension);
					oRepresentation.setLabelDisplayOption(sDefaultDimension, sDefaultLabelDisplayOption);
					oRepresentation.setDimensionKind(sDefaultDimension, sKind);
				}
			});
			deferred.resolve();
		});
		return deferred.promise();
	}
	function _getNodeIdForHierarchicalProperty(oEntityTypeMetadata) {
		var bIsTextPropertyPresent;
		var sService = oStepPropertyMetadataHandler.oStep.getService();
		var sEntitySet = oStepPropertyMetadataHandler.oStep.getEntitySet();
		var sHierarchyProperty = oStepPropertyMetadataHandler.oStep.getHierarchyProperty();
		oConfigurationEditor.getHierarchyNodeIdAsPromise(sService, sEntitySet, sHierarchyProperty).done(function(sNodeId) {
			bIsTextPropertyPresent = oStepPropertyMetadataHandler.hasTextPropertyOfDimension(oEntityTypeMetadata, sNodeId);
		});
		return bIsTextPropertyPresent;
	}
	function _setDefaultStateOfHierarchyDisplayOptionAsPromise(sRepresentationType) {
		var bIsTextPropertyPresent, sDefaultLabelDisplayOption;
		var deferred = jQuery.Deferred();
		oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(oEntityTypeMetadata) {//new
			var sSelectedProperty = oStepPropertyMetadataHandler.getHierarchicalProperty();
			if (sSelectedProperty && (oRepresentation.getHierarchyPropertyLabelDisplayOption() === undefined)) {
				bIsTextPropertyPresent = _getNodeIdForHierarchicalProperty(oEntityTypeMetadata);
				sDefaultLabelDisplayOption = bIsTextPropertyPresent ? oLabelDisplayOptions.TEXT : oLabelDisplayOptions.KEY;
				oRepresentation.setHierarchyPropertyLabelDisplayOption(sDefaultLabelDisplayOption);
			}
			deferred.resolve();
		});
		return deferred.promise();
	}
	function _setDefaultStateOfMeasureAsPromise(sRepresentationType) {
		var deferred = jQuery.Deferred(), measures, bIsKindUsed;
		var aDefaultMeasureKinds;
		var index = 0;
		oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(oEntityTypeMetadata) {
			aDefaultMeasureKinds = oRepresentationTypeHandler.getKindsForMeasurePropertyType(sRepresentationType);
			measures = oStepPropertyMetadataHandler.getMeasures(oEntityTypeMetadata);
			aDefaultMeasureKinds.forEach(function(sKind) {
				var defaultCountForKind = oRepresentationTypeHandler.getDefaultCountForRepresentationKind(sRepresentationType, sKind);
				for (var i = 0; i < defaultCountForKind; i++){
					bIsKindUsed = false;
					var sDefaultMeasure = measures[index];
					if (oRepresentation.getMeasures().length !== 0) {
						if (oRepresentation.getMeasures()[index]) {
							if (oRepresentation.getMeasureKind(oRepresentation.getMeasures()[index])) {
								bIsKindUsed = true;
							}
						}
					}
					if (!bIsKindUsed && sDefaultMeasure) {
						oRepresentation.addMeasure(sDefaultMeasure);
						oRepresentation.setMeasureKind(sDefaultMeasure, sKind);
					}
					index++;
				}
			});
			deferred.resolve();
		});
		return deferred.promise();
	}
	function _setDefaultStateForRepnAsPromise(sRepresentationType) {//new
		var deferred = jQuery.Deferred();
		var sDefaultProperty, aDefaultPropertyKind;
		if (sRepresentationType === "TableRepresentation") {
			//Property
			if (oRepresentation.getProperties().length === 0) {
				aDefaultPropertyKind = oRepresentationTypeHandler.getKindsForPropertyType(sRepresentationType);
				sDefaultProperty = oStepPropertyMetadataHandler.getProperties()[0];
				oRepresentation.addProperty(sDefaultProperty);
				oRepresentation.setPropertyKind(sDefaultProperty, aDefaultPropertyKind[0]);
				deferred.resolve();
			} else {
				deferred.resolve();
			}
		} else if (sRepresentationType === "TreeTableRepresentation") {
			_setDefaultStateOfHierarchyDisplayOptionAsPromise(sRepresentationType).done(function() {
				deferred.resolve();
			});
		} else {
			_setDefaultStateOfDimensionAsPromise(sRepresentationType).done(function() {
				_setDefaultStateOfMeasureAsPromise(sRepresentationType).done(function() {
					deferred.resolve();
				});
			});
		}
		return deferred.promise();
	}
	function _retrieveStepObject() {
		if (oParams && oParams.arguments && oParams.arguments.stepId) {
			oParentStep = oConfigurationEditor.getStep(oParams.arguments.stepId);
		}
	}
	function _retrieveDefaultRepresentationtype() {
		var sDefaultRepresentationType = oCoreApi.getRepresentationTypes()[0].id;
		if (oParentStep.getType() === "hierarchicalStep") {
			sDefaultRepresentationType = "TreeTableRepresentation";
		}
		return sDefaultRepresentationType;
	}
	// Called on initialization to create a new representation or retrieve existing representation
	function _retrieveOrCreateRepnObjectAsPromise(oController) {
		var sRepresentationType;
		var deferred = jQuery.Deferred();
		if (oParams && oParams.arguments && oParams.arguments.representationId) {
			oRepresentation = oParentStep.getRepresentation(oParams.arguments.representationId);
		}
		if (!nullObjectChecker.checkIsNotUndefined(oRepresentation)) {
			oRepresentation = oParentStep.createRepresentation();
			sRepresentationType = _retrieveDefaultRepresentationtype();
			_updateRepresentationType(sRepresentationType);
			_updateTreeNode(oController, oCoreApi.getText(sRepresentationType));
			oConfigurationEditor.setIsUnsaved();
			_setDefaultStateForRepnAsPromise(sRepresentationType).done(function() {
				return deferred.resolve();
			});
		} else {
			sRepresentationType = oRepresentation.getRepresentationType();
			_performCompatabilityAsPromise().done(function() {
				_setDefaultStateForRepnAsPromise(sRepresentationType).done(function() {
					return deferred.resolve();
				});
			});
		}
		return deferred.promise();
	}
	function _insertPreviewButton(oController) {
		var oPreviewButton = new sap.m.Button({
			id : oController.createId("idPreviewButton"),
			text : oCoreApi.getText("preview"),
			press : oController.handlePreviewButtonPress.bind(oController)
		});
		var oFooter = oController.getView().getViewData().oFooter;
		oFooter.addContentRight(oPreviewButton);
	}
	function _instantiateCornerTexts(oController) {
		var oTextPool = oController.getView().getViewData().oConfigurationHandler.getTextPool();
		var oViewData = {
			oTextReader : oCoreApi.getText,
			oConfigurationEditor : oConfigurationEditor,
			oTextPool : oTextPool,
			oParentObject : oRepresentation,
			oParentStep : oParentStep,
			oRepresentationTypeHandler : oRepresentationTypeHandler
		};
		var representationCornerTextController = new sap.ui.controller("sap.apf.modeler.ui.controller.representationCornerTexts");
		var oView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.cornerTexts",
			type : sap.ui.core.mvc.ViewType.XML,
			id : oController.createId("representationCornerTexts"),
			viewData : oViewData,
			controller : representationCornerTextController
		});
		oController.byId("idCornerTextsVBox").insertItem(oView);
		oController.getView().attachEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.representation.SETCHARTICON, oView.getController().setChartIcon.bind(oView.getController()));
	}
	function _clearRepresentationBasicData() {
		oRepresentation.getDimensions().forEach(function(sDimension) {
			oRepresentation.removeDimension(sDimension);
		});
		oRepresentation.getMeasures().forEach(function(sMeasure) {
			oRepresentation.removeMeasure(sMeasure);
		});
	}
	function _performCompatabilityForTable() {
		var aDimensions, aMeasures;
		if (oRepresentation.getRepresentationType() === "TableRepresentation") {
			aDimensions = oRepresentation.getDimensions();
			aMeasures = oRepresentation.getMeasures();
			aDimensions.forEach(function(sProperty) {
				oRepresentation.addProperty(sProperty);
				oRepresentation.setPropertyTextLabelKey(sProperty, oRepresentation.getDimensionTextLabelKey(sProperty));
				oRepresentation.setPropertyKind(sProperty, coreConstants.representationMetadata.kind.COLUMN);
				oConfigurationEditor.setIsUnsaved();
			});
			aMeasures.forEach(function(sProperty) {
				oRepresentation.addProperty(sProperty);
				oRepresentation.setPropertyTextLabelKey(sProperty, oRepresentation.getMeasureTextLabelKey(sProperty));
				oRepresentation.setPropertyKind(sProperty, coreConstants.representationMetadata.kind.COLUMN);
				oConfigurationEditor.setIsUnsaved();
			});
			_clearRepresentationBasicData();
		}
	}
	function _setDefaultLabelDisplayOptionAsPromise(sDimension) {
		var isTextPropertyPresent;
		oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(oEntityTypeMetadata) {
			isTextPropertyPresent = oStepPropertyMetadataHandler.hasTextPropertyOfDimension(oEntityTypeMetadata, sDimension);
			if (isTextPropertyPresent) {
				oRepresentation.setLabelDisplayOption(sDimension, oLabelDisplayOptions.KEY_AND_TEXT);
			} else {
				oRepresentation.setLabelDisplayOption(sDimension, oLabelDisplayOptions.KEY);
			}
			oConfigurationEditor.setIsUnsaved();
		});
	}
	function _performCompatabilityForLabelDisplayOptionAsPromise() {
		var deferred = jQuery.Deferred();
		oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(oEntityTypeMetadata) {
			oRepresentation.getDimensions().forEach(function(sDimension) {
				if (oRepresentation.getLabelDisplayOption(sDimension) === undefined) {
					_setDefaultLabelDisplayOptionAsPromise(sDimension);
				}
			});
			deferred.resolve();
		});
		return deferred.promise();
	}
	function _performCompatabilityAsPromise() {
		_performCompatabilityForTable();
		return _performCompatabilityForLabelDisplayOptionAsPromise();
	}
	function _instantiateSubViewsAsPromise(oController) {
		oSortDataHandler.instantiateRepresentationSortData();
		_instantiateCornerTexts(oController);
		return oRepresentationBasicDataHandler.instantiateBasicDataAsPromise();
	}
	function updateValidationState(oController){
		if (!oController.getValidationState()){
			if(oController.byId("idChartType").getValueState("None")){
				setTimeout(function() {
					oController.byId("idChartType").setValueState("Error");
				}, 1);
			}
		} else {
			oController.byId("idChartType").setValueState("None");
		}
	}
	var constructor = MvcController.extend("sap.apf.modeler.ui.controller.representation", {
	// sap.ui.controller("sap.apf.modeler.ui.controller.representation", {
		/** @description Implicit parameter injected with the following members
			createMessageObject:ƒ (config)
			getAllAvailableSemanticObjects:ƒ (fnCallback)
			getCalatogServiceUri:ƒ ()
			getEntityTypeMetadataAsPromise:ƒ (sAbsolutePathToServiceDocument, sEntityType)
			getNavigationTargetName:ƒ ()
			getRepresentationTypes:ƒ ()
			getSemanticActions:ƒ (semanticObjectID)
			getText:ƒ (sRessourceKey, aParameters)
			oApplicationHandler: sap.apf.modeler.core.ApplicationHandler
			oConfigurationEditor: sap.apf.modeler.core.ConfigurationEditor
			oConfigurationHandler: sap.apf.modeler.core.ConfigurationHandler
			oCoreApi: sap.apf.modeler.core.Instance
			oParams:
				arguments: {
					appId: "57FCA36EC3D350DEE10000000A442AF5",
					configId: "57FCA36EC3D350DEE10000000A442AF4",
					categoryId: "Category-9",
					stepId: "Step-18",
					representationId: "Step-18-Representation-3"
				}
				name:"representation"
			oTitleBreadCrumbController:constructor {mEventRegistry: {…}, setTitleForDetailPage: ƒ, _sapui_Extensions: Array(0), oView: f}
			putMessage:ƒ (oMessage)
			setNavigationTargetName:ƒ ()
			updateConfigTree:ƒ ()
			updateSelectedNode:ƒ ()
			updateTitleAndBreadCrumb:ƒ ()
			updateTree:ƒ ()
		 * @parameter {Object} viewData via getView().getViewData()
		 * @function aka constructor function called by UI5
		 */
		onInit : function() {
			var oController = this;
			oController.promiseControllerIsCreated = new Promise(function(resolve) {
				var oViewData = oController.getView().getViewData();
				oCoreApi = oViewData.oCoreApi;
				oParams = oViewData.oParams;
				oConfigurationEditor = oViewData.oConfigurationEditor;
				oRepresentationTypeHandler = new RepresentationTypesHandler();
				oController.oViewValidator = new ViewValidator(oController.getView());
				_setDisplayText(oController);
				_retrieveStepObject();
				if (oParentStep.getType() !== "hierarchicalStep") {
					_insertPreviewButton(oController);
				}
				oStepPropertyMetadataHandler = new sap.apf.modeler.ui.utils.StepPropertyMetadataHandler(oCoreApi, oParentStep);
				_retrieveOrCreateRepnObjectAsPromise(oController).then(function() {
					oRepresentationHandler = new RepresentationHandler(oRepresentation, oRepresentationTypeHandler, oCoreApi.getText);
					oRepresentationBasicDataHandler = new RepresentationBasicDataHandler(oController.getView(), oStepPropertyMetadataHandler, oRepresentationHandler, oController.oViewValidator);
					oSortDataHandler = new SortDataHandler(oController.getView(), oRepresentation, oStepPropertyMetadataHandler, oCoreApi.getText);
					_instantiateSubViewsAsPromise(oController).then(function(){
						oController.setDetailData();
						resolve();
					});
				});
			});
		},
		promiseControllerIsCreated : null,
		setDetailData : function() {
			var oController = this;
			oController._setChartType();
		},
		handleChangeForChartType : function(oEvent) {
			var oController = this;
			var sNewRepresentationType = oEvent.getParameter("selectedItem").getKey();
			var sRepnTypeText = oCoreApi.getText(sNewRepresentationType);
			var sOldRepresentationType = oRepresentation.getRepresentationType();
			_updateRepresentationType(sNewRepresentationType);
			_updateTreeNode(oController, sRepnTypeText);
			_updateBreadCrumb(oController, sRepnTypeText);
			if (!oRepresentationTypeHandler.isChartTypeSimilar(sOldRepresentationType, sNewRepresentationType)) {
				oController.getView().fireEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.REMOVEALLPROPERTIESFROMPARENTOBJECT);
				_clearRepresentationBasicData();
				_setDefaultStateForRepnAsPromise(sNewRepresentationType).done(function() {
					oRepresentationBasicDataHandler.instantiateBasicDataAsPromise().then(function(){
						updateValidationState(oController);
					});
					oController.getView().fireEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.representation.SETCHARTICON);
					oConfigurationEditor.setIsUnsaved();
				});
			} else {
				oRepresentationBasicDataHandler.instantiateBasicDataAsPromise().then(function(){
					updateValidationState(oController);
				});
				oController.getView().fireEvent(sap.apf.modeler.ui.utils.CONSTANTS.events.representation.SETCHARTICON);
				oConfigurationEditor.setIsUnsaved();
			}
		},
		handlePreviewButtonPress : function() {
			var oController = this;
			var oPreviewContentDetails = {
				oParentStep : oParentStep,
				oRepresentation : oRepresentation,
				oConfigurationHandler : oController.getView().getViewData().oConfigurationHandler,
				oCoreApi : oCoreApi,
				oRepresentationHandler : oRepresentationHandler,
				oStepPropertyMetadataHandler : oStepPropertyMetadataHandler,
				oRepresentationTypeHandler : oRepresentationTypeHandler
			};
			sap.ui.view({
				id : oController.createId("idPreviewContentView"),
				viewName : "sap.apf.modeler.ui.view.previewContent",
				type : sap.ui.core.mvc.ViewType.XML,
				viewData : oPreviewContentDetails
			});
		},
		onExit : function() {
			var oController = this;
			oController.getView().getViewData().oFooter.removeContentRight(oController.byId("idPreviewButton"));
			oRepresentationBasicDataHandler.destroyBasicData();
			oSortDataHandler.destroySortData();
			oController.byId("idCornerTextsVBox").destroyItems();
		},
		getValidationState : function(){
			return this.oViewValidator.getValidationState();
		},
		_setChartType : function() {
			var oController = this;
			oStepPropertyMetadataHandler.getEntityTypeMetadataAsPromise().done(function(oEntityTypeMetadata) {
				var oModelForChartType;
				var dimensions = oStepPropertyMetadataHandler.getDimensionsProperties(oEntityTypeMetadata);
				var measures = oStepPropertyMetadataHandler.getMeasures(oEntityTypeMetadata);
				var aValidRepresentationTypes = oController._getAnnotatedChartTypes(
						oRepresentationTypeHandler.aRepresentationTypes, oStepPropertyMetadataHandler.getRepresentationTypesArray(), dimensions, measures, oCoreApi);
				oModelForChartType = optionsValueModelBuilder.prepareModel(aValidRepresentationTypes);
				oController.byId("idChartType").setModel(oModelForChartType);
				oController.byId("idChartType").setSelectedKey(oRepresentation.getRepresentationType());
				updateValidationState(oController);
			});
		},
		/**
		 * @private
		 * @description Get cloned list of all chart types, those currently not applicable get annotated.
		 * @param {Object[]} aRepresentationTypes A static list of definitions of chart type
		 * @param {Object[]} aChartTypes A list of chart type for later selection in a value help
		 * @param {Object[]} aDimensions
		 * @param {Object[]} aMeasures
		 * @param {Object} coreApi
		 * @private
		 */
		_getAnnotatedChartTypes : function(aRepresentationTypes, aChartTypes, aDimensions, aMeasures, oCoreApi){
			function findRepresentation(aRepTypes, sChartType){
				var result;
				aRepTypes.forEach(function(repType){
					if (repType["id"] === sChartType){
						result = repType;
					}
				});
				return result;
			}
			var aChartTypesCloned = jQuery.extend(true, [], aChartTypes);
			aChartTypesCloned.forEach(function(oChartType){
				var minDimensions = 0, minMeasures = 0;
				var oValidRepTypeMetadata = findRepresentation(aRepresentationTypes, oChartType.key);
				if (oValidRepTypeMetadata.metadata && oValidRepTypeMetadata.id !== "TableRepresentation" && oValidRepTypeMetadata.id !== "TreeTableRepresentation"){
					oValidRepTypeMetadata.metadata.dimensions.supportedKinds.forEach(function(supportedKind){
						minDimensions += parseInt(supportedKind.min, 10);
					});
					oValidRepTypeMetadata.metadata.measures.supportedKinds.forEach(function(supportedKind){
						minMeasures += parseInt(supportedKind.min, 10);
					});
					if (aDimensions.length < minDimensions || aMeasures.length < minMeasures){
						oChartType.name = oCoreApi.getText("modeler.ui.representation.invalidChartTypes", [oChartType.name]);
					}
				}
			});
			return aChartTypesCloned;
		}
	});
	return constructor;
}, true /*GLOBAL_EXPORT*/);