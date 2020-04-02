/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */

/**
* @class configuration
* @memberOf sap.apf.modeler.ui.controller
* @name configuration
* @description controller for view.configuration
*/
jQuery.sap.require("sap.apf.modeler.ui.utils.textPoolHelper"); //must be decomposed into two classes
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/apf/modeler/ui/utils/nullObjectChecker",
	"sap/apf/modeler/ui/utils/viewValidator",
	"sap/apf/modeler/ui/utils/constants"
], function(BaseController, nullObjectChecker, ViewValidator, constants) {
	"use strict";

	//Sets static texts in UI
	function _setDisplayText(oController) {
		oController.byId("idConfigurationBasicData").setText(oController.textReader("configurationData"));
		oController.byId("idConfigTitleLabel").setText(oController.textReader("configTitle"));
		oController.byId("idConfigTitle").setPlaceholder(oController.textReader("newConfiguration"));
		oController.byId("idConfigurationIdLabel").setText(oController.textReader("configurationId"));
		if (oController.coreApi.showSemanticObject()) {
			oController.byId("idSemanticObjectLabel").setText(oController.textReader("semanticObject"));
		}
		oController.byId("idNoOfCategoriesLabel").setText(oController.textReader("noOfCategories"));
		oController.byId("idNoOfStepsLabel").setText(oController.textReader("noOfSteps"));
		oController.byId("idFilterTypeData").setText(oController.textReader("filterType"));
		oController.byId("idFilterTypeLabel").setText(oController.textReader("type"));
		oController.byId("smartFilterBar").setText(oController.textReader("smartFilterBar"));
		oController.byId("facetFilter").setText(oController.textReader("configuredFilters"));
		oController.byId("none").setText(oController.textReader("noFilters"));
		oController.byId("idAriaPropertyForFilterRadioGp").setText(oController.textReader("type"));
	}
	// sets the total categories
	function _setTotalCategories(oController) {
		if (!oController.configuration) {
			return;
		}
		oController.byId("idNoOfCategories").setValue(oController.configurationEditor.getCategories().length);
	}
	// sets the total steps
	function _setTotalSteps(oController) {
		if (!oController.configuration) {
			return;
		}
		oController.byId("idNoOfSteps").setValue(oController.configurationEditor.getSteps().length);
	}
	// sets the title of configuration object
	function _setConfigurationTitle(oController) {
		if (!oController.configuration) {
			return;
		}
		oController.byId("idConfigTitle").setValue(oController.configuration.AnalyticalConfigurationName);
	}
	// sets the configuration id of the configuration object
	function _setConfigurationId(oController) {
		// set the id of the configuration only when it is saved configuration
		if (!oController.configuration) {
			return;
		}
		if (oController.configuration.AnalyticalConfiguration.indexOf(constants.configurationObjectTypes.ISNEWCONFIG) === -1) {
			oController.byId("idConfigurationId").setValue(oController.configuration.AnalyticalConfiguration);
		}
	}
	// sets the semantic object
	function _setSemanticObject(oController) {
		var applicationObject = oController.applicationHandler.getApplication(oController.params.arguments.appId);
		if (applicationObject) {
			oController.byId("idSemanticObject").setValue(applicationObject.SemanticObject);
		}
	}
	// sets the filter option type
	function _setFilterOptionType(oController) {
		var sFilterOptionType;
		if (oController.configuration) {
			sFilterOptionType = Object.keys(oController.configurationEditor.getFilterOption())[0];
			oController.byId("idFilterTypeRadioGroup").setEnabled(true);
			oController.byId("idFilterTypeRadioGroup").setSelectedButton(oController.byId(sFilterOptionType));
		}
	}
	// Called on initialization to create a new configuration object
	function _retrieveConfigurationObject(oController) {
		if (oController.params && oController.params.arguments && oController.params.arguments.configId) {
			oController.configuration = oController.configurationHandler.getConfiguration(oController.params.arguments.configId);
		}
		if (oController.configuration) {
			oController.configurationEditor = oController.getView().getViewData().oConfigurationEditor;
		}
	}
	// updates the bread crumb with current config title
	function _updateBreadCrumbOnConfigurationChange(oController, sConfigTitle) {
		var sTitle = oController.textReader("configuration") + ": " + sConfigTitle;
		oController.getView().getViewData().updateTitleAndBreadCrumb(sTitle);
	}
	// updates the bread crumb with current config title
	function _updateApplicationTitle(oController, sConfigTitle) {
		var oTextPool = oController.configurationHandler.getTextPool();
		var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.APPLICATION_TITLE;
		oTextPool.setTextAsPromise(sConfigTitle, oTranslationFormat).done(function(sApplicationTitleId){
			oController.configurationEditor.setApplicationTitle(sApplicationTitleId);
		});
	}
	// Updates the tree node (configuration) with given configuration title
	function _updateTreeNodeOnConfigurationChange(oController, sConfigTitle, sConfigId) {
		var context = {
			appId : oController.params.arguments.appId
		};
		var configInfo = {
			name : sConfigTitle
		};
		if (sConfigId) { // new configuration scenario
			configInfo.id = sConfigId;
			context.configId = sConfigId;
			oController.getView().getViewData().updateSelectedNode(configInfo, context);
		} else { // update configuration scenario
			oController.getView().getViewData().updateSelectedNode(configInfo);
		}
	}
	// updates the filter option type in the config editor
	function _updateFilterOptionType(oController) {
		var oFilterOptionType = {};
		var sFilterOption = oController.byId("idFilterTypeRadioGroup").getSelectedButton().getCustomData()[0].getValue();
		oFilterOptionType[sFilterOption] = true;
		oController.configurationEditor.setFilterOption(oFilterOptionType);
		oController.configurationEditor.setIsUnsaved();
	}
	return BaseController.extend("sap.apf.modeler.ui.controller.configuration", {
		// Called on initialization of the view.
		// Sets the static texts for all controls in UI.
		// Prepares dependecies.
		onInit : function() {
			var oController = this;
			var oViewData = oController.getView().getViewData();
			oController.applicationHandler = oViewData.oApplicationHandler;
			oController.configurationHandler = oViewData.oConfigurationHandler;
			oController.textReader = oViewData.getText;
			oController.params = oViewData.oParams;
			this.coreApi = oViewData.oCoreApi;
			this.viewValidatorForConfig = new ViewValidator(oController.getView());
			_setDisplayText(oController);
			if (!this.coreApi.showSemanticObject()) {
				oController.byId("idSemanticObjectLabel").setVisible(false);
				oController.byId("idSemanticObject").setVisible(false);
			}
			_retrieveConfigurationObject(oController);
			oController.setDetailData();
			this.viewValidatorForConfig.addField("idConfigTitle");
		},
		//sets the focus on first element in the object
		onAfterRendering : function() {
			var oController = this;
			if (oController.getView().byId("idConfigTitle").getValue().length === 0) {
				oController.getView().byId("idConfigTitle").focus();
			}
		},
		// Sets dynamic texts for controls
		setDetailData : function() {
			var oController = this;
			_setSemanticObject(oController);
			_setConfigurationId(oController);
			_setConfigurationTitle(oController);
			_setTotalCategories(oController);
			_setTotalSteps(oController);
			_setFilterOptionType(oController);
		},
		// Updates configuration object and config editor on reset
		updateSubViewInstancesOnReset : function(oConfigEditor) {
			this.configurationEditor = oConfigEditor;
		},
		// Handler for change event on configuration Title input control
		handleChangeDetailValue : function() {
			var oController = this;
			var sConfigTitle = oController.byId("idConfigTitle").getValue().trim();
			var configObj;
			if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sConfigTitle)) {
				configObj = {
					AnalyticalConfigurationName : sConfigTitle
				};
				if (oController.params && oController.params.arguments && oController.params.arguments.configId && (oController.params.arguments.configId.indexOf("newConfig") === -1)) {
					oController.configurationHandler.setConfiguration(configObj, oController.params.arguments.configId);
					_updateTreeNodeOnConfigurationChange(oController, sConfigTitle);
				} else {
					var sTempConfigId = oController.configurationHandler.setConfiguration(configObj);
					oController.configuration = oController.configurationHandler.getConfiguration(sTempConfigId);
					if (!oController.configurationEditor) {
						oController.configurationHandler.loadConfiguration(sTempConfigId, function(configurationEditor) {
							oController.configurationEditor = configurationEditor;
						});
					}
					_updateTreeNodeOnConfigurationChange(oController, sConfigTitle, sTempConfigId);
				}
				_updateApplicationTitle(oController, sConfigTitle);
				_updateBreadCrumbOnConfigurationChange(oController, sConfigTitle);
				oController.configuration = configObj;
			}
			oController.configurationEditor.setIsUnsaved();
		},
		handleChangeForFilterType : function() {
			var oController = this, oFilterOptionChangeDialog;
			if (!oController.configurationEditor.isDataLostByFilterOptionChange()) {
				_updateFilterOptionType(oController);
				oController.getView().getViewData().updateTree(); // Updates the tree structure according to chosen filter option type
			} else {
				oFilterOptionChangeDialog = new sap.ui.xmlfragment("idFilterOptionChangeFragment", "sap.apf.modeler.ui.fragment.dialogWithTwoButtons", oController);
				oFilterOptionChangeDialog.setState(sap.ui.core.ValueState.Warning);
				oFilterOptionChangeDialog.setTitle(oController.textReader("warning"));
				sap.ui.core.Fragment.byId("idFilterOptionChangeFragment", "idLabelForDialog").setText(oController.textReader("filterOptionChangeMessage"));
				sap.ui.core.Fragment.byId("idFilterOptionChangeFragment", "idBeginButtonForDialog").setText(oController.textReader("continue"));
				sap.ui.core.Fragment.byId("idFilterOptionChangeFragment", "idEndButtonForDialog").setText(oController.textReader("cancel"));
				oFilterOptionChangeDialog.open();
			}
		},
		handleBeginButtonDialogWithTwoButtons : function() {
			var oController = this;
			_updateFilterOptionType(oController);
			oController.getView().getViewData().updateTree(); // Updates the tree structure according to chosen filter option type
			sap.ui.core.Fragment.byId("idFilterOptionChangeFragment", "idDialogWithTwoButtons").destroy();
		},
		handleCancel : function() {
			var oController = this;
			_setFilterOptionType(oController);
			sap.ui.core.Fragment.byId("idFilterOptionChangeFragment", "idDialogWithTwoButtons").destroy();
		},
		// Getter for getting the current validation state of sub view
		getValidationState : function() {
			return this.viewValidatorForConfig.getValidationState();
		}
	});
}, true /* export to global, remove when all usages use define*/);
