/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2016 SAP SE. All rights reserved
 */
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require("sap.apf.testhelper.modelerUIHelper");
(function() {
	'use strict';
	var oModelerInstance, oNavigationTargetView, spyOnConfigEditorSetIsUnsaved, spyOnInit, setDetailDataSpy;
	var spyOnNavTargetGetSemanticObj, spyOnNavTargetGetAction, spyOnNavTargetSetSemanticObj, spyOnNavTargetSetAction, spyOnUpdateSelectedNode, spyOnUpdateTitleAndBreadCrumb, spyOnSetNavigationTargetName;
	var spyOnNavTargetSetGlobal, spyOnNavTargetSetStepSpecific, spyOnGetAllAvailableSemanticObjects, spyOnGetSemanticActions, spyOnSetTextOfTextPool, oTextPool, spyOnSetTitleKey;
	var oInputControl = new sap.m.Input({
		showSuggestion : true,
		suggestionItems : {
			path : '/Objects',
			template : new sap.ui.core.Item({
				key : '{key}',
				text : '{name}'
			})
		}
	});
	function _getAllAvailableSemanticObjectsStub(callBackFn) {
		var aSemanticObjects = [ {
			id : "FioriApplication"
		}, {
			id : "APFI2ANav"
		}, {
			id : "Account"
		} ];
		var messageObject;
		callBackFn(aSemanticObjects, messageObject);
	}
	function _getOriginalTranslationIndependantKeyAsText(resourceKey, parameters) {
		var text = resourceKey;
		if (parameters) {
			parameters.foreach(function(parameter) {
				text = text + " {" + parameter + "}";
			});
		}
		return text;
	}
	function _getSemanticActionsStub(args) {
		var oSemanticActionsForFioriApplication = {
			semanticActions : [ {
				id : "executeAPFConfiguration",
				text : "Execute APF Configuration"
			}, {
				id : "analyzeKPIDetails",
				text : "Analyze KPI Details"
			} ]
		};
		var oSemanticActionsForAPFI2ANav = {
			semanticActions : [ {
				id : "analyzeKPIDetails",
				text : "Analyze KPI Details"
			}, {
				id : "launchNavTarget",
				text : "Detailed Analysis"
			} ]
		};
		var oSemanticActionsForUserInputSemanticObj = {
			semanticActions : []
		};
		var oDeferredForSemanticActions = new jQuery.Deferred();
		if (args === "FioriApplication") {
			oDeferredForSemanticActions.resolve(oSemanticActionsForFioriApplication);
		} else if (args === "APFI2ANav") {
			oDeferredForSemanticActions.resolve(oSemanticActionsForAPFI2ANav);
		} else if (args === "Account" || args === "UserInputSemanticObject") {
			oDeferredForSemanticActions.resolve(oSemanticActionsForUserInputSemanticObj);
		}
		return oDeferredForSemanticActions.promise();
	}
	function _instantiateView(sId, assert) {
		var oNavigationTargetController = new sap.ui.controller("sap.apf.modeler.ui.controller.navigationTarget");
		spyOnInit = sinon.spy(oNavigationTargetController, "onInit");
		setDetailDataSpy = sinon.spy(oNavigationTargetController, "setDetailData");
		spyOnGetAllAvailableSemanticObjects = sinon.stub(oModelerInstance.modelerCore, "getAllAvailableSemanticObjects", _getAllAvailableSemanticObjectsStub);
		spyOnGetSemanticActions = sinon.stub(oModelerInstance.modelerCore, "getSemanticActions", _getSemanticActionsStub);
		var oView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.navigationTarget",
			type : sap.ui.core.mvc.ViewType.XML,
			controller : oNavigationTargetController,
			viewData : {
				updateSelectedNode : oModelerInstance.updateSelectedNode,
				updateTitleAndBreadCrumb : oModelerInstance.updateTitleAndBreadCrumb,
				oConfigurationHandler : oModelerInstance.configurationHandler,
				oConfigurationEditor : oModelerInstance.configurationEditorForUnsavedConfig,
				getText : _getOriginalTranslationIndependantKeyAsText,
				getAllAvailableSemanticObjects : spyOnGetAllAvailableSemanticObjects,
				getSemanticActions : spyOnGetSemanticActions,
				createMessageObject : oModelerInstance.modelerCore.createMessageObject,
				putMessage : oModelerInstance.modelerCore.putMessage,
				setNavigationTargetName : oModelerInstance.setNavigationTargetName,
				oParams : {
					name : "navigationTarget",
					arguments : {
						configId : oModelerInstance.tempUnsavedConfigId,
						navTargetId : sId
					}
				}
			}
		});
		assert.strictEqual(spyOnInit.calledOnce, true, "then navigation target onInit function is called and view is initialized in setup module");
		assert.strictEqual(setDetailDataSpy.calledOnce, true, "then navigation target setDetailData function is called in initial setup");
		assert.strictEqual(spyOnGetAllAvailableSemanticObjects.calledOnce, true, "then all semantic objects are fetched");
		return oView;
	}
	function _oEventStub(sSemanticObject) {
		return {
			getSource : function() {
				return oInputControl;
			},
			getParameter : function(parameterName) {
				var sParameterName;
				if (parameterName === "suggestValue") {
					sParameterName = "navTarget";
				} else {
					sParameterName = sSemanticObject;
				}
				return sParameterName;
			}
		};
	}
	function _getInfoToUpdateSelectedNode(id, oNavTarget, sDescription) {
		return {
			id : id,
			icon : oNavTarget.isGlobal() ? "sap-icon://overview-chart" : "sap-icon://pushpin-off",
			name : sDescription
		};
	}
	function _getDataToUpdateNavTargetName(id, sDescription) {
		return {
			key : id,
			value : sDescription
		};
	}
	QUnit.module("Test for navigation target with semantic object and action from list", {
		beforeEach : function(assert) {
			var done = assert.async();//Stop the tests until modeler instance is got
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				oTextPool = oModelerInstance.configurationHandler.getTextPool();
				spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
				spyOnNavTargetGetSemanticObj = sinon.spy(oModelerInstance.firstNavigationtarget, "getSemanticObject");
				spyOnNavTargetGetAction = sinon.spy(oModelerInstance.firstNavigationtarget, "getAction");
				spyOnNavTargetSetSemanticObj = sinon.spy(oModelerInstance.firstNavigationtarget, "setSemanticObject");
				spyOnNavTargetSetAction = sinon.spy(oModelerInstance.firstNavigationtarget, "setAction");
				spyOnNavTargetSetGlobal = sinon.spy(oModelerInstance.firstNavigationtarget, "setGlobal");
				spyOnSetTitleKey = sinon.spy(oModelerInstance.firstNavigationtarget, "setTitleKey");
				spyOnNavTargetSetStepSpecific = sinon.spy(oModelerInstance.firstNavigationtarget, "setStepSpecific");
				spyOnSetTextOfTextPool = sinon.spy(oTextPool, "setTextAsPromise");
				//instantiate the view
				oNavigationTargetView = _instantiateView(oModelerInstance.firstNavigationTargetId, assert);
				assert.strictEqual(spyOnGetSemanticActions.calledOnce, true, "then semantic actions for a particular semantic object fetched");
				spyOnUpdateSelectedNode = sinon.spy(oNavigationTargetView.getViewData(), "updateSelectedNode");
				spyOnUpdateTitleAndBreadCrumb = sinon.spy(oNavigationTargetView.getViewData(), "updateTitleAndBreadCrumb");
				spyOnSetNavigationTargetName = sinon.spy(oNavigationTargetView.getViewData(), "setNavigationTargetName");
				done();//Start the test once modeler instance is got and setup is done
			});
		},
		afterEach : function() {
			oModelerInstance.configurationEditorForUnsavedConfig.setIsUnsaved.restore();
			oModelerInstance.modelerCore.getAllAvailableSemanticObjects.restore();
			oModelerInstance.modelerCore.getSemanticActions.restore();
			oTextPool.setTextAsPromise.restore();
			oModelerInstance.reset();
			sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
			oNavigationTargetView.destroy();
		}
	});
	QUnit.test("When Navigation Target is initialized", function(assert) {
		//arrange
		var divToPlaceNavigationTarget = document.createElement("div");
		divToPlaceNavigationTarget.setAttribute('id', 'contentOfNT');
		document.body.appendChild(divToPlaceNavigationTarget);
		oNavigationTargetView.placeAt("contentOfNT");
		sap.ui.getCore().applyChanges();
		//assert
		assert.ok(oNavigationTargetView, "then Navigation target view exists");
		//navigation target sub view assert
		assert.ok(oNavigationTargetView.byId("idContextMappingView"), "then Navigation target Context Mapping View is instantiated");
		assert.strictEqual(spyOnNavTargetGetSemanticObj.callCount, 4, "then getSemanticObject function is called 4 times for existing navigation target");
		assert.strictEqual(spyOnNavTargetGetAction.callCount, 4, "then getAction function is called 4 times for existing navigation target");
		//navigation target semantic object field asserts
		assert.strictEqual(oNavigationTargetView.byId("idSemanticObjectField").getValue(), "FioriApplication", "then Semantic object is set from list for existing navigation target");
		assert.strictEqual(oNavigationTargetView.byId("idSemanticObjectLabel").getRequired(), true, "then semantic object label is set as mandatory");
		//navigation target action fields field asserts
		assert.strictEqual(oNavigationTargetView.byId("idActionField").getValue(), "executeAPFConfiguration", "then Action is set from list of actions for the semantic object");
		assert.strictEqual(oNavigationTargetView.byId("idActionLabel").getRequired(), true, "then action label is set as mandatory");
		//navigation target description field asserts
		assert.strictEqual(spyOnSetTitleKey.called, false, "then setTitleKey is not called for default title");
		assert.strictEqual(oNavigationTargetView.byId("idDescriptionLabel").getText(), "navigationTargetTitle (default)", "then text default is aligned with description label");
		assert.strictEqual(oNavigationTargetView.byId("idDescription").getValue(), "Execute APF Configuration", "then Description is set as action text on init for existing navigation target");
		assert.strictEqual(oNavigationTargetView.byId("idNavigationTargetTypeField").getSelectedKey(), "globalNavTargets", "then Navigation target type is set");
		assert.strictEqual(oNavigationTargetView.byId("idAssignedStepsLabel").getVisible(), false, "then Assigned step label is not visible");
		assert.strictEqual(oNavigationTargetView.byId("idAssignedStepsCombo").getVisible(), false, "then Assigned step combo is not visible");
		document.body.removeChild(document.getElementById('contentOfNT'));
	});
	QUnit.test("When title of navigation target is changed", function(assert) {
		//arrange
		var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.NAVTARGET_TITLE;
		var oNavTargetInfoForChange = _getInfoToUpdateSelectedNode(oModelerInstance.firstNavigationTargetId, oModelerInstance.firstNavigationtarget, "title2");
		//action
		oNavigationTargetView.byId("idDescription").setValue("title2");
		oNavigationTargetView.getController().handleChangeForTitleText();
		//assert
		assert.strictEqual(oNavigationTargetView.byId("idDescriptionLabel").getText(), "navigationTargetTitle", "then default is removed from description label text");
		assert.strictEqual(spyOnSetTextOfTextPool.calledWith("title2", oTranslationFormat), true, "then setText is called for change of title");
		assert.strictEqual(spyOnSetTitleKey.calledOnce, true, "then setTitleKey is called once to set the title key");
		assert.strictEqual(spyOnSetTitleKey.calledWith("title2"), true, "then setTitleKey is called on change of title");
		assert.strictEqual(spyOnUpdateSelectedNode.calledWith(oNavTargetInfoForChange), true, "then the tree node is updated");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWith("navigationTarget" + ": " + "title2"), true, "then the title and breadcrumb is updated");
		assert.strictEqual(oModelerInstance.firstNavigationtarget.getTitleKey(), "title2", "then the title is set to the navigation target object");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(spyOnSetNavigationTargetName.calledOnce, true, "THEN navigation target name was set in configuration list");
		assert.deepEqual(spyOnSetNavigationTargetName.getCall(0).args[0].value, "title2", "THEN update of navigatíon target was called with expected title");
	});
	QUnit.test("When title of navigation target is emptied", function(assert) {
		//arrange
		var oNavTargetInfoForChange = _getInfoToUpdateSelectedNode(oModelerInstance.firstNavigationTargetId, oModelerInstance.firstNavigationtarget, "Execute APF Configuration");
		//action
		oNavigationTargetView.byId("idDescription").setValue("");
		oNavigationTargetView.getController().handleChangeForTitleText();
		//assert
		assert.strictEqual(oNavigationTargetView.byId("idDescriptionLabel").getText(), "navigationTargetTitle (default)", "then default is removed from description label text");
		assert.strictEqual(spyOnSetTextOfTextPool.called, false, "then setText is not called for change of title");
		assert.strictEqual(spyOnSetTitleKey.calledOnce, true, "then setTitleKey is called once to set the title key");
		assert.strictEqual(spyOnSetTitleKey.calledWith(undefined), true, "then setTitleKey is called on change of title");
		assert.strictEqual(spyOnUpdateSelectedNode.calledWith(oNavTargetInfoForChange), true, "then the tree node is updated with default title");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWith("navigationTarget" + ": " + "Execute APF Configuration"), true, "then the title and breadcrumb is updated with default Label");
		assert.strictEqual(oModelerInstance.firstNavigationtarget.getTitleKey(), undefined, "then the title is set as undefined to the navigation target object");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.calledOnce, true, "then configuration editor is set to unsaved");
		assert.strictEqual(spyOnSetNavigationTargetName.calledOnce, true, "THEN navigation target name was set in configuration list");
		assert.deepEqual(spyOnSetNavigationTargetName.getCall(0).args[0].value, "Execute APF Configuration", "THEN update of navigatíon target was called with expected title");
	});
	QUnit.test("When suggestions are triggered for title of Navigation Target", function(assert) {
		//arrange
		var oTranslationFormat = sap.apf.modeler.ui.utils.TranslationFormatMap.NAVTARGET_TITLE;
		var oSuggestionTextHandler = new sap.apf.modeler.ui.utils.SuggestionTextHandler(oTextPool);
		var oSuggestionTextHandlerStub = sinon.stub(sap.apf.modeler.ui.utils, "SuggestionTextHandler", function() {
			return oSuggestionTextHandler;
		});
		var spyOnManageSuggestionTexts = sinon.spy(oSuggestionTextHandler, "manageSuggestionTexts");
		var oEvt = _oEventStub();
		//act 
		oNavigationTargetView.getController().handleChangeForTitleText();
		oNavigationTargetView.getController().handleSuggestions(oEvt);
		//assert
		assert.strictEqual(spyOnManageSuggestionTexts.calledOnce, true, "then suggestions are fetched from SuggestionTextHandler");
		assert.strictEqual(spyOnManageSuggestionTexts.calledWith(oEvt, oTranslationFormat), true, "then suggestions are fetched from SuggestionTextHandler for the correct event and translation format");
		//clean up
		spyOnManageSuggestionTexts.restore();
		oSuggestionTextHandlerStub.restore();
	});
	QUnit.test("When navigation target view data has to be reset", function(assert) {
		//arrangement
		var spyOnGetNavTarget = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "getNavigationTarget");
		var spyFireEvent = sinon.spy(oNavigationTargetView, "fireEvent");
		//action
		oNavigationTargetView.getController().updateSubViewInstancesOnReset(oNavigationTargetView.getViewData().oConfigurationEditor);
		//assertions
		assert.strictEqual(spyOnGetNavTarget.calledOnce, true, "then navigation target object is fetched after reset");
		assert.strictEqual(spyFireEvent.calledWith(sap.apf.modeler.ui.utils.CONSTANTS.events.UPDATESUBVIEWINSTANCESONRESET), true, "then navigation target context mapping view is updated with new instances of editor and navigation target objects");
		//cleanup
		oModelerInstance.configurationEditorForUnsavedConfig.getNavigationTarget.restore();
	});
	QUnit.test("When semantic object value is changed and semantic object and action is from the list", function(assert) {
		//arrangement
		oNavigationTargetView.byId("idSemanticObjectField").setSelectedKey("APFI2ANav");
		var oNavTargetInfoForChange = _getInfoToUpdateSelectedNode(oModelerInstance.firstNavigationTargetId, oModelerInstance.firstNavigationtarget, "Analyze KPI Details");
		var navTargetData = _getDataToUpdateNavTargetName(oModelerInstance.firstNavigationTargetId, "Analyze KPI Details");
		//action
		oNavigationTargetView.getController().handleChangeSemanticObjectValue(_oEventStub("APFI2ANav"));
		//assertions
		assert.strictEqual(oNavigationTargetView.byId("idSemanticObjectField").getValue(), "APFI2ANav", "then Semantic object is changed for existing navigation target");
		assert.strictEqual(oNavigationTargetView.byId("idActionField").getValue(), "analyzeKPIDetails", "then First action is set from list of actions for the changed semantic object");
		assert.strictEqual(oNavigationTargetView.byId("idDescription").getValue(), "Analyze KPI Details", "then Description is set as action text");
		assert.strictEqual(oNavigationTargetView.byId("idDescriptionLabel").getText(), "navigationTargetTitle (default)", "then text default is aligned with description label");
		assert.strictEqual(spyOnSetTitleKey.calledOnce, true, "then setTitleKey is called once to reset the title key");
		assert.strictEqual(spyOnSetTitleKey.calledWith(undefined), true, "then setTitleKey is called to reset the user specified title");
		assert.strictEqual(spyOnNavTargetSetSemanticObj.calledOnce, true, "then setSemanticObject function is called once");
		assert.strictEqual(spyOnNavTargetSetSemanticObj.calledWith("APFI2ANav"), true, "then setSemanticObject function is called with correct arguments");
		assert.strictEqual(spyOnNavTargetGetSemanticObj.callCount, 5, "then getSemanticObject function is called 5 times");
		assert.strictEqual(spyOnNavTargetGetAction.callCount, 6, "then getAction for changed semantic object is called 6 times");
		assert.strictEqual(spyOnUpdateSelectedNode.calledWith(oNavTargetInfoForChange), true, "then the tree node is updated");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWith("navigationTarget" + ": " + "Analyze KPI Details"), true, "then the title and breadcrumb is updated correctly");
		assert.strictEqual(spyOnSetNavigationTargetName.calledWith(navTargetData), true, "then updated navigation target name is set correctly on to the tree");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavigationTargetView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
	});
	QUnit.test("When semantic object value is changed and semantic object is present in list and there are no available actions for that semantic object", function(assert) {
		//arrangement
		oNavigationTargetView.byId("idSemanticObjectField").setSelectedKey("Account");
		var oNavTargetInfoForChange = _getInfoToUpdateSelectedNode(oModelerInstance.firstNavigationTargetId, oModelerInstance.firstNavigationtarget, "Account");
		var navTargetData = _getDataToUpdateNavTargetName(oModelerInstance.firstNavigationTargetId, "Account");
		//action
		oNavigationTargetView.getController().handleChangeSemanticObjectValue(_oEventStub("Account"));
		//assertions
		assert.strictEqual(oNavigationTargetView.byId("idSemanticObjectField").getValue(), "Account", "then Semantic object is changed");
		assert.strictEqual(oNavigationTargetView.byId("idActionField").getValue(), "", "then action field is set to empty since no actions are available for that Semantic object");
		assert.strictEqual(oNavigationTargetView.byId("idDescription").getValue(), "Account", "then Description is set same as semantic object");
		assert.strictEqual(oNavigationTargetView.byId("idDescriptionLabel").getText(), "navigationTargetTitle (default)", "then text default is aligned with description label");
		assert.strictEqual(spyOnSetTitleKey.calledOnce, true, "then setTitleKey is called once to reset the title key");
		assert.strictEqual(spyOnSetTitleKey.calledWith(undefined), true, "then setTitleKey is called to reset the user specified title");
		assert.strictEqual(spyOnNavTargetSetSemanticObj.calledOnce, true, "then setSemanticObject function is called once");
		assert.strictEqual(spyOnNavTargetSetSemanticObj.calledWith("Account"), true, "then setSemanticObject function is called with correct arguments");
		assert.strictEqual(spyOnNavTargetGetSemanticObj.callCount, 6, "then getSemanticObject function is called 6 times");
		assert.strictEqual(spyOnNavTargetGetAction.callCount, 5, "then getAction for changed semantic object is called 5 times");
		assert.strictEqual(spyOnUpdateSelectedNode.calledWith(oNavTargetInfoForChange), true, "then the tree node is updated");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWith("navigationTarget" + ": " + "Account"), true, "then the title and breadcrumb is updated correctly");
		assert.strictEqual(spyOnSetNavigationTargetName.calledWith(navTargetData), true, "then updated navigation target name is set correctly on to the tree");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavigationTargetView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
	});
	QUnit.test("When semantic object value is changed and semantic object is an user input", function(assert) {
		//arrangement
		oNavigationTargetView.byId("idSemanticObjectField").setValue("UserInputSemanticObject");
		var oNavTargetInfoForChange = _getInfoToUpdateSelectedNode(oModelerInstance.firstNavigationTargetId, oModelerInstance.firstNavigationtarget, "UserInputSemanticObject");
		var navTargetData = _getDataToUpdateNavTargetName(oModelerInstance.firstNavigationTargetId, "UserInputSemanticObject");
		//action
		oNavigationTargetView.getController().handleChangeSemanticObjectValue(_oEventStub("UserInputSemanticObject"));
		//assertions
		assert.strictEqual(oNavigationTargetView.byId("idSemanticObjectField").getValue(), "UserInputSemanticObject", "Semantic object is changed for existing navigation target");
		assert.strictEqual(oNavigationTargetView.byId("idActionField").getValue(), "", "Action is set to empty as user input semantic object does not have any actions");
		assert.strictEqual(oNavigationTargetView.byId("idDescription").getValue(), "UserInputSemanticObject", "Description is set as the semantic object when semantic object is not from the list");
		assert.strictEqual(oNavigationTargetView.byId("idDescriptionLabel").getText(), "navigationTargetTitle (default)", "then text default is aligned with description label");
		assert.strictEqual(spyOnSetTitleKey.calledOnce, true, "then setTitleKey is called once to reset the title key");
		assert.strictEqual(spyOnSetTitleKey.calledWith(undefined), true, "then setTitleKey is called to reset the user specified title");
		assert.strictEqual(spyOnNavTargetSetSemanticObj.calledOnce, true, "then setSemanticObject function is called once");
		assert.strictEqual(spyOnNavTargetSetSemanticObj.calledWith("UserInputSemanticObject"), true, "then setSemanticObject function is called with correct arguments");
		assert.strictEqual(spyOnNavTargetGetSemanticObj.callCount, 6, "then getSemanticObject function is called 6 times");
		assert.strictEqual(spyOnNavTargetGetAction.callCount, 5, "then getAction for changed semantic object is called 5 times");
		assert.strictEqual(spyOnUpdateSelectedNode.calledWith(oNavTargetInfoForChange), true, "then the tree node is updated");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWith("navigationTarget" + ": " + "UserInputSemanticObject"), true, "then the title and breadcrumb is updated correctly");
		assert.strictEqual(spyOnSetNavigationTargetName.calledWith(navTargetData), true, "then updated navigation target name is set correctly on to the tree");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavigationTargetView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
	});
	QUnit.test("When semantic object value is changed and it is set to empty", function(assert) {
		//arrangement
		oNavigationTargetView.byId("idSemanticObjectField").setValue("");
		//action
		oNavigationTargetView.getController().handleChangeSemanticObjectValue(_oEventStub(""));
		//assertions
		assert.strictEqual(oNavigationTargetView.byId("idSemanticObjectField").getValue(), "", "Semantic object is changed and set to empty");
		assert.strictEqual(oNavigationTargetView.byId("idActionField").getValue(), "executeAPFConfiguration", "Action is not changed and remains the same as before");
		assert.strictEqual(oNavigationTargetView.byId("idDescription").getValue(), "Execute APF Configuration", "Description is not changed and remains the same as before");
		assert.strictEqual(oNavigationTargetView.byId("idDescriptionLabel").getText(), "navigationTargetTitle (default)", "then text default is aligned with description label");
		assert.strictEqual(spyOnSetTitleKey.calledOnce, true, "then setTitleKey is called once to reset the title key");
		assert.strictEqual(spyOnSetTitleKey.calledWith(undefined), true, "then setTitleKey is called to reset the user specified title");
		assert.strictEqual(spyOnNavTargetSetSemanticObj.calledOnce, false, "then setSemanticObject function is not called");
		assert.strictEqual(spyOnNavTargetGetSemanticObj.callCount, 4, "then getSemanticObject function is called 4 times");
		assert.strictEqual(spyOnNavTargetGetAction.callCount, 4, "then getAction for changed semantic object is called 4 times");
		assert.strictEqual(spyOnUpdateSelectedNode.called, false, "then the tree node is not updated and remains same as before");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.called, false, "then the title and breadcrumb is not updated and remains same as before");
		assert.strictEqual(spyOnSetNavigationTargetName.called, false, "then setNavigationTargetName is not called");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavigationTargetView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
	});
	QUnit.test("When action is changed from existing list of actions", function(assert) {
		//arrangement
		var oNavTargetInfoForChange = _getInfoToUpdateSelectedNode(oModelerInstance.firstNavigationTargetId, oModelerInstance.firstNavigationtarget, "Analyze KPI Details");
		var navTargetData = _getDataToUpdateNavTargetName(oModelerInstance.firstNavigationTargetId, "Analyze KPI Details");
		oNavigationTargetView.byId("idActionField").setSelectedKey("analyzeKPIDetails");
		//action
		oNavigationTargetView.getController().handleChangeofAction(_oEventStub("analyzeKPIDetails"));
		//assertions
		assert.strictEqual(oNavigationTargetView.byId("idDescription").getValue(), "Analyze KPI Details", "then Action text is set as description for changed action present in the list");
		assert.strictEqual(oNavigationTargetView.byId("idDescriptionLabel").getText(), "navigationTargetTitle (default)", "then text default is aligned with description label");
		assert.strictEqual(spyOnSetTitleKey.calledOnce, true, "then setTitleKey is called once to reset the title key");
		assert.strictEqual(spyOnSetTitleKey.calledWith(undefined), true, "then setTitleKey is called to reset the user specified title");
		assert.strictEqual(spyOnNavTargetSetAction.calledOnce, true, "then setAction function is called once");
		assert.strictEqual(spyOnNavTargetGetAction.callCount, 7, "then getAction function is called 7 times");
		assert.strictEqual(spyOnNavTargetGetSemanticObj.callCount, 4, "then getSemanticObject function is called 4 times");
		assert.strictEqual(spyOnUpdateSelectedNode.calledWith(oNavTargetInfoForChange), true, "then the tree node is updated");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWith("navigationTarget" + ": " + "Analyze KPI Details"), true, "then the title and breadcrumb is updated correctly");
		assert.strictEqual(spyOnSetNavigationTargetName.calledWith(navTargetData), true, "then updated navigation target name is set correctly on to the tree");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavigationTargetView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
	});
	QUnit.test("When action is changed and it is not present in the list of available actions for a particular semantic object(USER ACTION)", function(assert) {
		//arrangement
		var oNavTargetInfoForChange = _getInfoToUpdateSelectedNode(oModelerInstance.firstNavigationTargetId, oModelerInstance.firstNavigationtarget, "FioriApplication");
		var navTargetData = _getDataToUpdateNavTargetName(oModelerInstance.firstNavigationTargetId, "FioriApplication");
		oNavigationTargetView.byId("idActionField").setValue("User Action");
		//action
		oNavigationTargetView.getController().handleChangeofAction(_oEventStub("User Action"));
		//assertions
		assert.strictEqual(oNavigationTargetView.byId("idDescription").getValue(), "FioriApplication", "then Semantic object is set as description");
		assert.strictEqual(oNavigationTargetView.byId("idDescriptionLabel").getText(), "navigationTargetTitle (default)", "then text default is aligned with description label");
		assert.strictEqual(spyOnSetTitleKey.calledOnce, true, "then setTitleKey is called once to reset the title key");
		assert.strictEqual(spyOnSetTitleKey.calledWith(undefined), true, "then setTitleKey is called to reset the user specified title");
		assert.strictEqual(spyOnNavTargetSetAction.calledOnce, true, "then setAction function is called once");
		assert.strictEqual(spyOnNavTargetGetAction.callCount, 7, "then getAction function is called 7 times");
		assert.strictEqual(spyOnNavTargetGetSemanticObj.callCount, 5, "then getSemanticObject function is called 5 times");
		assert.strictEqual(spyOnUpdateSelectedNode.calledWith(oNavTargetInfoForChange), true, "then the tree node is updated");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWith("navigationTarget" + ": " + "FioriApplication"), true, "then the title and breadcrumb is updated correctly");
		assert.strictEqual(spyOnSetNavigationTargetName.calledWith(navTargetData), true, "then updated navigation target name is set correctly on to the tree");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavigationTargetView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
	});
	QUnit.test("When action is changed and set to empty", function(assert) {
		//arrangement
		var oNavTargetInfoForChange = _getInfoToUpdateSelectedNode(oModelerInstance.firstNavigationTargetId, oModelerInstance.firstNavigationtarget, "FioriApplication");
		var navTargetData = _getDataToUpdateNavTargetName(oModelerInstance.firstNavigationTargetId, "FioriApplication");
		oModelerInstance.firstNavigationtarget.setAction("");
		//action
		oNavigationTargetView.getController().handleChangeofAction(_oEventStub(""));
		//assertions
		assert.strictEqual(oNavigationTargetView.byId("idDescription").getValue(), "FioriApplication", "then Semantic object is set as description when action is set as empty");
		assert.strictEqual(oNavigationTargetView.byId("idDescriptionLabel").getText(), "navigationTargetTitle (default)", "then text default is aligned with description label");
		assert.strictEqual(spyOnSetTitleKey.calledOnce, true, "then setTitleKey is called once to reset the title key");
		assert.strictEqual(spyOnSetTitleKey.calledWith(undefined), true, "then setTitleKey is called to reset the user specified title");
		assert.strictEqual(spyOnNavTargetSetAction.calledOnce, true, "then setAction function is called only once for test arrangement");
		assert.strictEqual(spyOnNavTargetGetAction.callCount, 5, "then getAction function is called 5 times");
		assert.strictEqual(spyOnNavTargetGetSemanticObj.callCount, 5, "then getSemanticObject function is called 5 times");
		assert.strictEqual(spyOnUpdateSelectedNode.calledWith(oNavTargetInfoForChange), true, "then the tree node is updated");
		assert.strictEqual(spyOnUpdateTitleAndBreadCrumb.calledWith("navigationTarget" + ": " + "FioriApplication"), true, "then the title and breadcrumb is updated correctly");
		assert.strictEqual(spyOnSetNavigationTargetName.calledWith(navTargetData), true, "then updated navigation target name is set correctly on to the tree");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavigationTargetView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
	});
	QUnit.test("WHEN use dynamic parameters is selected or deselected", function(assert){
		oModelerInstance.unsavedStepWithoutFilterMapping.addNavigationTarget(oModelerInstance.firstNavigationTargetId);
		var navTarget = oModelerInstance.configurationEditorForUnsavedConfig.getNavigationTarget(oModelerInstance.firstNavigationTargetId);
		assert.equal(navTarget.getUseDynamicParameters(), false, "THEN use dynamic parameters is not set");
		
		oNavigationTargetView.byId("idUseDynamicParametersCheckBox").setSelected(true);
		oNavigationTargetView.getController().handleChangeForUseDynamicParameters();
		assert.equal(navTarget.getUseDynamicParameters(), true, "THEN use dynamic parameters are set in the model");
		
		oNavigationTargetView.byId("idUseDynamicParametersCheckBox").setSelected(false);
		oNavigationTargetView.getController().handleChangeForUseDynamicParameters();
		assert.equal(navTarget.getUseDynamicParameters(), false, "THEN use dynamic parameters are not set in the model");
	});
	QUnit.test("WHEN help button of the dynamic parameters is pressed", function(assert){
		var button = oNavigationTargetView.byId("idDisplayHelpAboutDynamicParameters");
		var stub = sinon.stub(sap.m.MessageBox, "show", function(messageText, settings){
			assert.equal(messageText, "explanationOfDynamicParameters", "THEN message as expected");
			assert.equal(settings.title, "titleDynamicParameters", "THEN title set");
			assert.deepEqual(settings.actions, [sap.m.MessageBox.Action.CLOSE], "THEN actions as expected");
		});
		//press the info button
		button.firePress();
		assert.equal(stub.calledOnce, true, "THEN info box with explanation about has been called");
		stub.restore();
	});
	QUnit.test("When navigation target type is changed to step specific", function(assert) {
		//arrangement
		oModelerInstance.unsavedStepWithoutFilterMapping.addNavigationTarget(oModelerInstance.firstNavigationTargetId);
		oNavigationTargetView.byId("idNavigationTargetTypeField").setSelectedKey("stepSpecific");
		var expectedOutput = [ {
			stepKey : oModelerInstance.firstHierarchicalStepId,
			stepName : "Hierarchical Step"
		}, {
			stepKey : oModelerInstance.stepIdUnsavedWithoutFilterMapping,
			stepName : "step A"
		}, {
			stepKey : oModelerInstance.stepIdUnsavedWithFilterMapping,
			stepName : "step B"
		}, {
			stepKey : oModelerInstance.hierarchicalStepWithFilterId,
			stepName : "Hierarchical Step With required property"
		}, {
			stepKey : oModelerInstance.hierarchicalStepWithFilterForNotAvailable,
			stepName : "Hierarchical Step With not available property"
		} ];
		var aSelectedKeys = [ oModelerInstance.stepIdUnsavedWithoutFilterMapping ];
		//action
		oNavigationTargetView.getController().handleChangeOfNavigationTargetType();
		//assertions
		assert.strictEqual(spyOnNavTargetSetStepSpecific.calledOnce, true, "then setStepSpecific function is called once");
		assert.strictEqual(oNavigationTargetView.byId("idNavigationTargetTypeField").getSelectedKey(), "stepSpecific", "then Navigation target type is changed to step specific");
		assert.strictEqual(oModelerInstance.firstNavigationtarget.isGlobal(), false, "then Navigation target is step specific");
		assert.strictEqual(oNavigationTargetView.byId("idAssignedStepsLabel").getVisible(), true, "then Assigned step label is visible");
		assert.strictEqual(oNavigationTargetView.byId("idAssignedStepsCombo").getVisible(), true, "then Assigned step combo is visible");
		assert.strictEqual(oNavigationTargetView.byId("idAssignedStepsCombo").getModel().getData().Objects.length, expectedOutput.length, "then assigned steps combobox is populated with steps available in editor");
		assert.deepEqual(oNavigationTargetView.byId("idAssignedStepsCombo").getSelectedKeys(), aSelectedKeys, "then correct steps are selected in the combo box");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavigationTargetView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
	});
	QUnit.test("When navigation target type is changed to global", function(assert) {
		//arrangement
		oModelerInstance.unsavedStepWithoutFilterMapping.addNavigationTarget(oModelerInstance.firstNavigationTargetId);
		assert.deepEqual(oModelerInstance.configurationEditorForUnsavedConfig.getStepsAssignedToNavigationTarget(oModelerInstance.firstNavigationTargetId).length, 1, "then initially navigation target is assigned to one of the steps");
		assert.deepEqual(oModelerInstance.configurationEditorForUnsavedConfig.getStepsAssignedToNavigationTarget(oModelerInstance.firstNavigationTargetId), [ oModelerInstance.stepIdUnsavedWithoutFilterMapping ],
				"then navigation target is assigned to Step-1");
		oNavigationTargetView.byId("idAssignedStepsCombo").setSelectedKeys(oModelerInstance.stepIdUnsavedWithoutFilterMapping);
		oNavigationTargetView.getController().handleChangeForAssignedSteps();
		oNavigationTargetView.byId("idNavigationTargetTypeField").setSelectedKey(oModelerInstance.modelerCore.getText("globalNavTargets"));
		//action
		oNavigationTargetView.getController().handleChangeOfNavigationTargetType();
		//assertions
		assert.strictEqual(spyOnNavTargetSetGlobal.calledOnce, true, "then setGlobal function is called once");
		assert.strictEqual(oNavigationTargetView.byId("idNavigationTargetTypeField").getSelectedKey(), oModelerInstance.modelerCore.getText("globalNavTargets"), "then Navigation target type is changed to global");
		assert.strictEqual(oModelerInstance.firstNavigationtarget.isGlobal(), true, "then Navigation target is set to global");
		assert.strictEqual(oNavigationTargetView.byId("idAssignedStepsLabel").getVisible(), false, "then Assigned step label is invisible");
		assert.strictEqual(oNavigationTargetView.byId("idAssignedStepsCombo").getVisible(), false, "then Assigned step combo is invisible");
		assert.deepEqual(oModelerInstance.configurationEditorForUnsavedConfig.getStepsAssignedToNavigationTarget(oModelerInstance.firstNavigationTargetId).length, 0, "then there are no steps assigned to this navigation target");
		assert.deepEqual(oModelerInstance.configurationEditorForUnsavedConfig.getStepsAssignedToNavigationTarget(oModelerInstance.firstNavigationTargetId), [], "then navigation target has been removed from Step-1");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavigationTargetView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
	});
	QUnit.test("When steps assigned to a navigation target are changed", function(assert) {
		//arrangement
		oNavigationTargetView.byId("idAssignedStepsCombo").setSelectedKeys(oModelerInstance.stepIdUnsavedWithoutFilterMapping);
		//action
		oNavigationTargetView.getController().handleChangeForAssignedSteps();
		//assertions
		assert.deepEqual(oNavigationTargetView.byId("idAssignedStepsCombo").getSelectedKeys(), oModelerInstance.configurationEditorForUnsavedConfig.getStepsAssignedToNavigationTarget(oModelerInstance.firstNavigationTargetId),
				"Step is selected in assigned step combo");
		assert.strictEqual(spyOnConfigEditorSetIsUnsaved.called, true, "then configuration editor is set to unsaved");
		assert.strictEqual(oNavigationTargetView.getViewData().oConfigurationEditor.isSaved(), false, "then configuration editor is set to unsaved state");
	});
	QUnit.test("When navigation target is in valid state fetch getValidationState", function(assert) {
		//assertion
		assert.strictEqual(oNavigationTargetView.getController().getValidationState(), true, "then navigation target is in valid state");
	});
	QUnit.test("When navigation target is not in valid state fetch getValidationState", function(assert) {
		//action
		oNavigationTargetView.byId("idSemanticObjectField").setValue("");
		//assertion
		assert.strictEqual(oNavigationTargetView.getController().getValidationState(), false, "then navigation target is not in valid state");
	});
	QUnit.test("When navigation target view is destroyed", function(assert) {
		//arrangement
		var spyDestroyOfContextMappingView = sinon.spy(oNavigationTargetView.byId("idContextMappingView"), "destroy");
		//action
		oNavigationTargetView.destroy();
		//assertion
		assert.strictEqual(spyDestroyOfContextMappingView.calledOnce, true, "then destroy is called on navTargetContextmMapping view");
	});
	QUnit.module("Test for a Navigation Target for which semantic object and action is an user input", {
		beforeEach : function(assert) {
			var done = assert.async();//Stop the tests until modeler instance is got
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
				spyOnNavTargetGetSemanticObj = sinon.spy(oModelerInstance.secondNavigationtarget, "getSemanticObject");
				spyOnNavTargetGetAction = sinon.spy(oModelerInstance.secondNavigationtarget, "getAction");
				spyOnNavTargetSetSemanticObj = sinon.spy(oModelerInstance.secondNavigationtarget, "setSemanticObject");
				spyOnNavTargetSetAction = sinon.spy(oModelerInstance.secondNavigationtarget, "setAction");
				//instantiate the view
				oNavigationTargetView = _instantiateView(oModelerInstance.secondNavigationTargetId, assert);
				assert.strictEqual(spyOnGetSemanticActions.calledOnce, true, "then service to fetch semantic actions for User input SO is called once which is resolved by empty array");
				done();//Start the test once modeler instance is got and setup is done
			});
		},
		afterEach : function() {
			oModelerInstance.configurationEditorForUnsavedConfig.setIsUnsaved.restore();
			oModelerInstance.modelerCore.getAllAvailableSemanticObjects.restore();
			oModelerInstance.modelerCore.getSemanticActions.restore();
			oModelerInstance.reset();
			sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
			oNavigationTargetView.destroy();
		}
	});
	QUnit.test("When Navigation Target is initialized", function(assert) {
		//assert
		assert.ok(oNavigationTargetView, "then Navigation target view exists");
		//navigation target sub view assert
		assert.ok(oNavigationTargetView.byId("idContextMappingView"), "then Navigation target Context Mapping View is instantiated");
		assert.strictEqual(spyOnNavTargetGetSemanticObj.callCount, 5, "then getSemanticObject function is called 5 times for user input semantic object and action");
		assert.strictEqual(spyOnNavTargetGetAction.callCount, 3, "then getAction function is called 3 times for user input semantic object and action");
		//navigation target semantic object field asserts
		assert.strictEqual(oNavigationTargetView.byId("idSemanticObjectField").getValue(), "UserInputSemanticObject", "then User input semantic object is set on init for existing navigation target");
		assert.strictEqual(oNavigationTargetView.byId("idSemanticObjectLabel").getRequired(), true, "then semantic object label is set as mandatory");
		assert.strictEqual(oNavigationTargetView.byId("idSemanticObjectField").getModel().getData().Objects.length, 3, "then semantic object field model is populated correctly");
		//navigation target action fields field asserts
		assert.strictEqual(oNavigationTargetView.byId("idActionField").getValue(), "UserAction", "then User input action is set for the user input semantic object for existing navigation target");
		assert.strictEqual(oNavigationTargetView.byId("idActionLabel").getRequired(), true, "then action label is set as mandatory");
		//navigation target description field asserts
		assert.strictEqual(oNavigationTargetView.byId("idDescription").getValue(), "UserInputSemanticObject", "then Description is set same as user input semantic object ");
		assert.strictEqual(oNavigationTargetView.byId("idNavigationTargetTypeField").getSelectedKey(), "stepSpecific", "then Navigation target type is set");
		assert.strictEqual(oNavigationTargetView.byId("idAssignedStepsLabel").getVisible(), true, "then Assigned step label is visible");
		assert.strictEqual(oNavigationTargetView.byId("idAssignedStepsCombo").getVisible(), true, "then Assigned step combo is visible");
	});
	QUnit.module("Test for a Navigation Target which is new", {
		beforeEach : function(assert) {
			var done = assert.async();//Stop the tests until modeler instance is got
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				oModelerInstance = modelerInstance;
				spyOnConfigEditorSetIsUnsaved = sinon.spy(oModelerInstance.configurationEditorForUnsavedConfig, "setIsUnsaved");
				//instantiate the view
				oNavigationTargetView = _instantiateView("newNavigationTarget", assert);
				assert.strictEqual(spyOnGetSemanticActions.calledOnce, false, "then actions for a new navigation target are not fetched since SO is undefined");
				done();//Start the test once modeler instance is got and setup is done
			});
		},
		afterEach : function() {
			oModelerInstance.configurationEditorForUnsavedConfig.setIsUnsaved.restore();
			oModelerInstance.modelerCore.getAllAvailableSemanticObjects.restore();
			oModelerInstance.modelerCore.getSemanticActions.restore();
			oModelerInstance.reset();
			sap.apf.testhelper.modelerUIHelper.destroyModelerInstance();
			oNavigationTargetView.destroy();
		}
	});
	QUnit.test("When Navigation Target is initialized", function(assert) {
		//arrange
		var divToPlaceNavigationTarget = document.createElement("div");
		divToPlaceNavigationTarget.setAttribute('id', 'contentOfNT');
		document.body.appendChild(divToPlaceNavigationTarget);
		oNavigationTargetView.placeAt("contentOfNT");
		sap.ui.getCore().applyChanges();
		//assert
		assert.ok(oNavigationTargetView, "then Navigation target view exists");
		//navigation target sub view assert
		assert.ok(oNavigationTargetView.byId("idContextMappingView"), "then Navigation target Context Mapping View is instantiated");
		//navigation target semantic object field asserts
		assert.strictEqual(oNavigationTargetView.byId("idSemanticObjectField").getValue(), "", "Semantic object is set as empty for a new navigation target");
		assert.strictEqual(oNavigationTargetView.byId("idSemanticObjectLabel").getRequired(), true, "then semantic object label is set as mandatory");
		assert.strictEqual(oNavigationTargetView.byId("idSemanticObjectField").getModel().getData().Objects.length, 3, "then semantic object field model is populated correctly");
		//navigation target action fields field asserts
		assert.equal(oNavigationTargetView.byId("idActionField").getValue(), "", "Action is set as empty for new navigation target");
		assert.strictEqual(oNavigationTargetView.byId("idActionLabel").getRequired(), true, "then action label is set as mandatory");
		assert.strictEqual(oNavigationTargetView.byId("idActionField").getModel().getData().Objects.length, 0, "then action field is not populated unless semantic object from list is chosen");
		//navigation target description field asserts
		assert.strictEqual(oNavigationTargetView.byId("idDescription").getValue(), "", "then Description is set as empty for a new navigation target");
		assert.strictEqual(oNavigationTargetView.byId("idNavigationTargetTypeField").getSelectedKey(), "globalNavTargets", "then Navigation target type is set");
		assert.strictEqual(oNavigationTargetView.byId("idAssignedStepsLabel").getVisible(), false, "then Assigned step label is not visible");
		assert.strictEqual(oNavigationTargetView.byId("idAssignedStepsCombo").getVisible(), false, "then Assigned step combo is not visible");
		document.body.removeChild(document.getElementById('contentOfNT'));
	});
}());