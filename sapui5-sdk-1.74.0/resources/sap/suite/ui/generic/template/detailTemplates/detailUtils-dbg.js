sap.ui.define(["sap/base/Log", "sap/ui/core/routing/HashChanger", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", 
	"sap/suite/ui/generic/template/extensionAPI/NavigationController", "sap/suite/ui/generic/template/lib/MessageButtonHelper", "sap/suite/ui/generic/template/lib/testableHelper",
	"sap/suite/ui/generic/template/detailTemplates/DiscardEditHandler", "sap/suite/ui/generic/template/detailTemplates/PaginatorButtonsHelper",
	"sap/suite/ui/generic/template/ObjectPage/extensionAPI/DraftTransactionController", "sap/suite/ui/generic/template/ObjectPage/extensionAPI/NonDraftTransactionController",
	"sap/m/DraftIndicator"],
	function(Log, HashChanger, Filter, FilterOperator, NavigationController, MessageButtonHelper, testableHelper, DiscardEditHandler, PaginatorButtonsHelper, DraftTransactionController, NonDraftTransactionController) {
		"use strict";

		var DraftIndicatorState = sap.m.DraftIndicatorState; // namespace cannot be imported by sap.ui.define
		
		var oPersistentFilter = new Filter({
			path: "persistent",
			operator: FilterOperator.EQ,
			value1: false
		}); // exclude all messages that are persistent for frontend (i.e. transient for backend)

		function getComponentBase(oComponent, oComponentUtils, oViewProxy){
			function init(){
				var oTemplatePrivateModel = oComponentUtils.getTemplatePrivateModel();
				oTemplatePrivateModel.setProperty("/objectPage", {
					displayMode: 0, // possible values are explained in the documentation of fnNavigateToRoute in lib.NavigationController
					headerInfo: { // contains information about title and subtitle of the page
						objectTitle: "",
						objectSubtitle: ""
					}
				});
				oComponentUtils.setStatePreserverPromise(oViewProxy);
			}

			function onActivate(sBindingPath, bIsComponentCurrentlyActive) {
				// preliminary: in draft case maybe on first time property is not set
				if (!oComponentUtils.isDraftEnabled()){
					var oUIModel = oComponent.getModel("ui");
					var oTemplatePrivateModel = oComponentUtils.getTemplatePrivateModel();
					var sNonDraftCreateBindingPath = oComponentUtils.getNonDraftCreateBindingPath();
					var bCreateMode = !!sNonDraftCreateBindingPath;
					oUIModel.setProperty("/createMode", bCreateMode);
					if (sNonDraftCreateBindingPath || oComponentUtils.getEditableNDC()) {
						oUIModel.setProperty("/editable", true);
						oTemplatePrivateModel.setProperty("/objectPage/displayMode", bCreateMode ? 4 : 2);
						if (bCreateMode){
							sBindingPath = sNonDraftCreateBindingPath;
						}
					} else {
						oUIModel.setProperty("/editable", false);
						oTemplatePrivateModel.setProperty("/objectPage/displayMode", 1);
					}
				}
				(oViewProxy.onComponentActivate || Function.prototype)(sBindingPath, bIsComponentCurrentlyActive);
			}

			// This method is called when a new binding context has been retrieved for this Component.
			// If the entity is draft enabled this happens whenever a different instance is displayed or the edit status changes.
			// If the entity is not draft enabled this only happens when a different instance is displayed.
			// It does not happen when changing to edit mode or creating a new instance. In this case the adjustment of the JSON models is already done in onActivate.
			function updateBindingContext() {
				var oBindingContext = oComponent.getBindingContext();
				var oContextInfo = oComponentUtils.registerContext(oBindingContext);
				// set draft status to blank according to UI decision
				var oTemplatePrivateGlobal = oComponent.getModel("_templPrivGlobal");
				oTemplatePrivateGlobal.setProperty("/generic/draftIndicatorState", DraftIndicatorState.Clear);
				(oViewProxy.applyHeaderContextToSmartTablesDynamicColumnHide || Function.prototype)(oBindingContext);

				var oUIModel = oComponent.getModel("ui");
				var bIsEditable;
				var oTemplatePrivateModel = oComponentUtils.getTemplatePrivateModel();
				if (oContextInfo.bIsDraft) {
					bIsEditable = true;
					oUIModel.setProperty("/enabled", true);
					oTemplatePrivateModel.setProperty("/objectPage/displayMode", oContextInfo.bIsCreate ? 4 : 2);
				} else {
					bIsEditable = oComponentUtils.getEditableNDC();
					oTemplatePrivateModel.setProperty("/objectPage/displayMode", bIsEditable ? 2 : 1);
					// enable the buttons
					oUIModel.setProperty("/enabled", true);
				}
				oUIModel.setProperty("/createMode", oContextInfo.bIsCreate);
				oUIModel.setProperty("/editable", bIsEditable);
			}

			// This method is called by the framework, when some saving action has been observed. In this case it returns the context path for the
			// current draft root (if we are in draft mode).  This will cause this draft to be marked as modified.
			function fnCurrentDraftModified(){
				return oComponentUtils.getDraftRootPath();
			}

			function fnNavigateUp(){
				oViewProxy.navigateUp();
			}

			function getUrlParameterInfo(sPath, bAlreadyVisible) {
				return oViewProxy.oStatePreserverPromise.then(function(oStatePreserver){
					return oStatePreserver.getUrlParameterInfo(sPath, bAlreadyVisible);
				});
			}

			// checks whether this view has a reason to prevent saving. If yes a message is returned
			function getMessageFilters(bOnlyValidation){
				return 	oViewProxy.getMessageFilters(bOnlyValidation);
			}

			function getScrollFunction(aControlIds){
				return oViewProxy.getScrollFunction && oViewProxy.getScrollFunction(aControlIds);
			}

			return {
				init: init,
				onActivate: onActivate,
				getTitle: oComponentUtils.getTitleFromTreeNode,
				updateBindingContext: updateBindingContext,
				currentDraftModified: fnCurrentDraftModified,
				navigateUp: fnNavigateUp,
				getUrlParameterInfo: getUrlParameterInfo,
				getMessageFilters: getMessageFilters,
				getScrollFunction: getScrollFunction
			};
		}

		function getControllerBase(oViewProxy, oTemplateUtils, oController){

			var oControllerBase;

			var oPaginatorButtonsHelper; // initialized in onInit, if needed

			var oHashChanger; // initialized on first use
			function fnGetHashChangerInstance() {
				return oHashChanger || HashChanger.getInstance();
			}

			// this method is called, when the editablity status is changed
			function setEditable(bIsEditable) {
				var bIsNonDraft = !oTemplateUtils.oComponentUtils.isDraftEnabled();
				// Setting editable to false is done immidiately
				// Setting editable to true is (in draft case) postponed until the header data are read (method updateBindingContext).
				if (bIsNonDraft || !bIsEditable){
					var oUIModel = oController.getView().getModel("ui");
					oUIModel.setProperty("/editable", bIsEditable);
				}
				if (bIsNonDraft) {
					oTemplateUtils.oComponentUtils.setEditableNDC(bIsEditable);
				}
			}

			function fnOnBack() {
				oTemplateUtils.oServices.oApplication.onBackButtonPressed();
			}

			function fnAdaptLinksToUpperLevels(){
				var aLinkInfos = oTemplateUtils.oServices.oApplication.getLinksToUpperLayers();
				var iViewLevel = oTemplateUtils.oComponentUtils.getViewLevel();
				var iDisplayMode;
				if (oTemplateUtils.oComponentUtils.isDraftEnabled()){
					var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
					iDisplayMode = oTemplatePrivateModel.getProperty("/objectPage/displayMode");
				} else {
					iDisplayMode = 1;
				}
				oViewProxy.navigateUp = aLinkInfos[iViewLevel - 1].navigate.bind(null, iDisplayMode);
				var aBreadCrumbs = oViewProxy.aBreadCrumbs;
				var iLength = aBreadCrumbs ? aBreadCrumbs.length : 0;
				for (var i = 0; i < iLength; i++){
					var oLink = aBreadCrumbs[i];
					var oLinkInfo = aLinkInfos[i + 1]; // offset 1 because aLinkInfos also contains entry for root, aBreadCrumbs not
					oLinkInfo.adaptBreadCrumbLink(oLink);
					var oLinkInfoObject = oTemplateUtils.oCommonUtils.getControlInformation(oLink, function(oInfoObject){

					});
					oLinkInfoObject.navigate = oLinkInfo.navigate.bind(null, iDisplayMode);
				}
			}

			function getApplyChangesPromise(oControl){
				var oContext = oControl.getBindingContext();
				var sHash = fnGetHashChangerInstance().getHash();
				return oTemplateUtils.oServices.oApplicationController.propertyChanged(sHash, oContext);
			}

			function fnNavigateUp(){
				oViewProxy.navigateUp();
			}

			// Event handler for the Apply button. Only visible in draft scenarios and not on the object root.
			function fnApplyAndUpImpl(oControl) {
				var oBusyHelper = oTemplateUtils.oServices.oApplication.getBusyHelper();
				var oUIModel = oController.getView().getModel("ui");
				var oTemplatePrivateGlobalModel = oController.getOwnerComponent().getModel("_templPrivGlobal");
				var oApplyPromise = getApplyChangesPromise(oControl).then(function(oReponse){
					if (!oControllerBase.fclInfo.isContainedInFCL || oTemplatePrivateGlobalModel.getProperty("/generic/FCL/isVisuallyFullScreen")){
						fnNavigateUp();
					}
					//the toast is shown independent of FCL
					//the next statement should not be deleted but a comment!!
//						oTemplateUtils.oServices.oApplication.showMessageToast(oTemplateUtils.oCommonUtils.getText("ST_CHANGES_APPLIED"));
				}, function(){
					oBusyHelper.getUnbusy().then(function(oReponse){
						if (!oControllerBase.fclInfo.isContainedInFCL || oTemplatePrivateGlobalModel.getProperty("/generic/FCL/isVisuallyFullScreen")) {
							oTemplateUtils.oCommonUtils.processDataLossTechnicalErrorConfirmation(function() {
								fnNavigateUp();
								oUIModel.setProperty("/enabled", true); //in case you leave the page set this
							}, Function.prototype, oControllerBase.state);
						} else {
						//if the UI show FCL, one object next to the other, then another popup is needed
							oTemplateUtils.oCommonUtils.processDataLossTechnicalErrorConfirmation(Function.prototype, Function.prototype, oControllerBase.state, "StayOnPage");
						}
					});
				});
				oBusyHelper.setBusy(oApplyPromise);
			}

			// Event handler for the Apply button. Only visible in draft scenarios and not on the object root.
			function fnApplyAndUp(oEvent) {
				var oControl = oEvent.getSource();
				oControllerBase.state.saveScenarioHandler.handleSaveScenario(2, fnApplyAndUpImpl.bind(null, oControl));
			}

			var oDiscardEditHandler; // singleton, initialized on demand
			function fnCancel(oCancelButton){ // note that oCancelButton is optional
				oDiscardEditHandler = oDiscardEditHandler || new DiscardEditHandler(oController, oTemplateUtils, oViewProxy, oControllerBase.state);
				return oDiscardEditHandler.discardEdit(oCancelButton);
			}

			function onShowMessages() {
				oControllerBase.state.messageButtonHelper.toggleMessagePopover();
			}

			function getMessageFilters(bOnlyValidation){
				return oControllerBase.state.messageButtonHelper && oControllerBase.state.messageButtonHelper.getMessageFilters(bOnlyValidation);
			}

			function getNavigationControllerFunction(){
				var oNavigationController;
				return function(){
					oNavigationController = oNavigationController || new NavigationController(oTemplateUtils, oController, oControllerBase.state);
					return oNavigationController;
				};
			}

			function getTransactionControllerFunction() {
				var oTransactionController;
				return function(){
					if (!oTransactionController) {
						var Class = oTemplateUtils.oComponentUtils.isDraftEnabled() ? DraftTransactionController : NonDraftTransactionController;
						oTransactionController = new Class(oTemplateUtils, oController, oControllerBase.state);
					}
					return oTransactionController;
				};
			}

			function handleShowNextObject(){
				oPaginatorButtonsHelper.handleShowNextObject();
			}

			function handleShowPrevObject(){
				oPaginatorButtonsHelper.handleShowPrevObject();
			}

			// Expose selected private functions to unit tests
			/* eslint-disable */
			var fnGetHashChangerInstance = testableHelper.testable(fnGetHashChangerInstance, "getHashChangerInstance");
			var fnAdaptLinksToUpperLevels = testableHelper.testable(fnAdaptLinksToUpperLevels, "adaptLinksToUpperLevels");
			/* eslint-enable */

			oControllerBase = {
				onInit: function(oRequiredControls, fnPrepareAllMessagesForNavigation, messageSorter, getGroupTitle){
					if (!oRequiredControls || oRequiredControls.footerBar){
						var bIsODataBased = oTemplateUtils.oComponentUtils.isODataBased();
						var oMessageButtonHost = {
							controller: oController,
							prepareAllMessagesForNavigation: fnPrepareAllMessagesForNavigation,
							messageSorter:messageSorter,
							getGroupTitle:getGroupTitle
						};
						oControllerBase.state.messageButtonHelper = new MessageButtonHelper(oTemplateUtils, oMessageButtonHost, bIsODataBased);
						if (!oTemplateUtils.oComponentUtils.isDraftEnabled()){ // in the non-draft case prepare logic to remove all state messages when changing from edit to display mode (there are scenarios in which the message model will not do the job)
							var oUiModel = oController.getOwnerComponent().getModel("ui");
							var oEditableBinding = oUiModel.bindProperty("/editable");
							var oMessageManager = sap.ui.getCore().getMessageManager();
							var oMessageModel = oMessageManager.getMessageModel();
							oEditableBinding.attachChange(function(){
								if (!oEditableBinding.getValue()){
									var oContextFilter = oControllerBase.state.messageButtonHelper.getContextFilter();
									var oMessageBinding = oMessageModel.bindList("/", null, null, [oContextFilter, oPersistentFilter]);
									var aContexts = oMessageBinding.getContexts();
									var aMessages = aContexts.map(function(oContext){
										return oContext.getObject();
									});
									oMessageManager.removeMessages(aMessages);
								}
							});
						}
						oControllerBase.state.saveScenarioHandler = oTemplateUtils.oServices.oApplication.getSaveScenarioHandler(oController, oTemplateUtils.oCommonUtils);
						oTemplateUtils.oServices.oTemplateCapabilities.oMessageButtonHelper = oControllerBase.state.messageButtonHelper;
						oControllerBase.state.onCancel = fnCancel;
					}
					if (!oRequiredControls || oRequiredControls.paginatorButtons){
						oPaginatorButtonsHelper = new PaginatorButtonsHelper(oControllerBase, oController, oTemplateUtils);
					}
					oViewProxy.getScrollFunction = function(aControlIds){
						var sControlId = oTemplateUtils.oCommonUtils.getPositionableControlId(aControlIds);
						return sControlId && oTemplateUtils.oCommonUtils.focusControl.bind(null, sControlId);
					};
				},
				handlers: {
					handleShowNextObject: handleShowNextObject,
					handleShowPrevObject: handleShowPrevObject,
					onShowMessages: onShowMessages,
					applyAndUp: fnApplyAndUp,
					onSave: function(){
						Log.error("Save for this floorplan not implemented yet"); // fallback, currently for canvas
					},
					onBack: fnOnBack
				},
				extensionAPI: {
					getNavigationControllerFunction: getNavigationControllerFunction,
					getTransactionControllerFunction: getTransactionControllerFunction
				},
				fclInfo: {
					isContainedInFCL: false
				},
				state: {},
				onComponentActivate: function(sBindingPath, bIsComponentCurrentlyActive){
					if (oControllerBase.state.messageButtonHelper){
						oControllerBase.state.messageButtonHelper.adaptToContext(sBindingPath);
					}
					fnAdaptLinksToUpperLevels();
					// set visibility of up/down buttons
					if (oPaginatorButtonsHelper){
                        oPaginatorButtonsHelper.computeAndSetVisibleParamsForNavigationBtns();
					}
					oViewProxy.oStatePreserverPromise.then(function(oStatePreserver){
						oStatePreserver.applyAppState(sBindingPath, bIsComponentCurrentlyActive);
					});
				}
			};

			oViewProxy.navigateUp = fnNavigateUp;
			oViewProxy.setEditable = setEditable;
			oViewProxy.getMessageFilters = getMessageFilters;

			var oFclProxy = oTemplateUtils.oComponentUtils.getFclProxy();
			if (oFclProxy.oActionButtonHandlers){
				oControllerBase.handlers.fclActionButtonHandlers = oFclProxy.oActionButtonHandlers;
				oControllerBase.fclInfo.isContainedInFCL = true;
			}
			oControllerBase.stateChanged = function(){
				oViewProxy.oStatePreserverPromise.then(function(oStatePreserver){
					oStatePreserver.stateChanged();
				});
			};
			return oControllerBase;
		}

		return {
			getComponentBase: getComponentBase,
			getControllerBase: getControllerBase
		};
	});
