sap.ui.define(["sap/ui/base/Object",
	"sap/ui/Device",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/ActionSheet",
	"sap/m/Dialog",
	"sap/m/Popover",
	"sap/suite/ui/generic/template/lib/deletionHelper",
	"sap/suite/ui/generic/template/lib/routingHelper",
	"sap/suite/ui/generic/template/lib/SaveScenarioHandler",
	"sap/suite/ui/generic/template/lib/ContextBookkeeping",
	"sap/suite/ui/generic/template/lib/CRUDHelper",
	"sap/suite/ui/generic/template/lib/StatePreserver",
	"sap/suite/ui/generic/template/lib/testableHelper",
	"sap/base/Log",
	"sap/ui/core/syncStyleClass",
	"sap/base/util/extend"
	],
	function(BaseObject, Device, JSONModel, MessageToast, ActionSheet, Dialog, Popover, deletionHelper,
		routingHelper, SaveScenarioHandler, ContextBookkeeping, CRUDHelper, StatePreserver, testableHelper,
		Log, syncStyleClass, extend) {
		"use strict";

		var sContentDensityClass = (testableHelper.testableStatic(function(bTouch, oBody) {
			var sCozyClass = "sapUiSizeCozy",
				sCompactClass = "sapUiSizeCompact";
				if (oBody && (oBody.classList.contains(sCozyClass) || oBody.classList.contains(sCompactClass))) { // density class is already set by the FLP
					return "";
			} else {
				return bTouch ? sCozyClass : sCompactClass;
			}
		}, "Application_determineContentDensityClass")(Device.support.touch, document.body));

		function getContentDensityClass() {
			return sContentDensityClass;
		}

		// defines a dependency from oControl to a parent
		function fnAttachControlToParent(oControl, oParent) {
			syncStyleClass(sContentDensityClass, oParent, oControl);
			oParent.addDependent(oControl);
		}

		// Expose selected private static functions to unit tests
		/* eslint-disable */
		var fnAttachControlToParent = testableHelper.testableStatic(fnAttachControlToParent, "Application_attachControlToParent");
		/* eslint-enable */

		/* An instance of this class represents a Smart Template based application. Thus, there is a one-to-one relationship between
		 * instances of this class and instances of sap.suite.ui.generic.template.lib.AppComponent.
		 * However, this class is only used inside the sap.suite.ui.generic.template.lib package. It is not accessible to template developers
		 * or breakout developers.
		 * Instances of this class are generated in sap.suite.ui.generic.template.lib.TemplateAssembler.
		 * Note that TemplateAssembler also possesses a reference to the instance of this class which represents the app currently
		 * running.
		 * oTemplateContract: An object which is used for communication between this class and the AppComponent and its helper classes.
		 *                    See documentation of AppComponent for more details.
		 * Note that this class injects its api to these classes into the template contract object.
		 * Currently this class supports two use cases:
		 * 1. For non-draft apps it contains the information whether the app is currently in display or in edit state (methods set/getEditableNDC)
		 * 2. A 'navigation' model is supported. Thereby, we consider navigation to take place each time a route name or a route pattern is changed (but not when only the parameters added to the route are changed)
		 */
		function getMethods(oTemplateContract) {

			var oContextBookkeeping = new ContextBookkeeping(oTemplateContract.oAppComponent);
			var bEtagsAvailable;
			var mNavigationProperties = Object.create(null);   // filled on demand

			function isComponentActive(oComponent){
				var aActiveComponents = oTemplateContract.oNavigationControllerProxy.getActiveComponents();
				return aActiveComponents.indexOf(oComponent.getId()) >= 0;
			}

			var bIsWaitingForSideEffectExecution = false;

			function fnAddSideEffectPromise(oPromise){
				oTemplateContract.fnAddSideEffectPromise(oPromise);
			}

			// Executes fnFunction as soon as all side-effects have been executed.
			function fnPerformAfterSideEffectExecution(fnFunction, bBusyCheck){

				if (bIsWaitingForSideEffectExecution){
					return;   // do not let two operation wait for side effect execution
				}
				var aRunningSideEffectExecutions = oTemplateContract.aRunningSideEffectExecutions.filter(function(oEntry){return !!oEntry;});
				if (aRunningSideEffectExecutions.length){
					bIsWaitingForSideEffectExecution = true;
					Promise.all(aRunningSideEffectExecutions).then(function(){
						bIsWaitingForSideEffectExecution = false;
						fnPerformAfterSideEffectExecution(fnFunction, bBusyCheck);
					});
				} else if (!(bBusyCheck && oTemplateContract.oBusyHelper.isBusy())){
					fnFunction();
				}
			}

			function fnMakeBusyAware(oControl) {
				var sOpenFunction;
				if (oControl instanceof Dialog) {
					sOpenFunction = "open";
				} else if (oControl instanceof Popover || oControl instanceof ActionSheet) {
					sOpenFunction = "openBy";
				}
				if (sOpenFunction) {
					var fnOpenFunction = oControl[sOpenFunction];
					oControl[sOpenFunction] = function() {
						var myArguments = arguments;
						fnPerformAfterSideEffectExecution(function(){
							if (!oTemplateContract.oBusyHelper.isBusy()) { // suppress dialogs while being busy
								oTemplateContract.oBusyHelper.getUnbusy().then(function() { // but the busy dialog may still not have been removed
									fnOpenFunction.apply(oControl, myArguments);
								});
							}
						});
					};
				}
			}

			var mFragmentStores = {};

			function getDialogFragmentForView(oView, sName, oFragmentController, sModel, fnOnFragmentCreated) {
				oView = oView || oTemplateContract.oNavigationHost;
				var sViewId = oView.getId();
				var mFragmentStore = mFragmentStores[sViewId] || (mFragmentStores[sViewId] = {});
				var oFragment = mFragmentStore[sName];
				if (!oFragment) {
					oFragment = sap.ui.xmlfragment(sViewId, sName, oFragmentController);
					fnAttachControlToParent(oFragment, oView);
					var oModel;
					if (sModel) {
						oModel = new JSONModel();
						oFragment.setModel(oModel, sModel);
					}
					(fnOnFragmentCreated || Function.prototype)(oFragment, oModel);
					mFragmentStore[sName] = oFragment;
					fnMakeBusyAware(oFragment);
				}
				return oFragment;
			}

			function getOperationEndedPromise() {
				return new Promise(function(fnResolve) {
					oTemplateContract.oNavigationObserver.getProcessFinished(true).then(function(){
						oTemplateContract.oBusyHelper.getUnbusy().then(fnResolve);
					});
				});
			}

			function fnOnBackButtonPressed(){
				oTemplateContract.oDataLossHandler.performIfNoDataLoss(function(){
					oTemplateContract.oNavigationControllerProxy.navigateBack();
				}, Function.prototype);
			}

			var bIsEditable = false;

			function setEditableNDC(isEditable) {
				if (bIsEditable && !isEditable){
					var oModel = oTemplateContract.oAppComponent.getModel();
					oModel.resetChanges();
				}
				bIsEditable = isEditable;
			}

			function fnRegisterNonDraftCreateContext(sEntitySet, sBindingPath, oCreateContext){
				var oTreeNode = oTemplateContract.mEntityTree[sEntitySet];
				var sContextPath = oCreateContext.getPath();
				var sVirtualKeyString = sContextPath.substring(sContextPath.lastIndexOf("("));
				var sBindingPathPrefix = oTemplateContract.bCreateRequestsCanonical ? ("/" + sEntitySet) : sBindingPath;
				oTreeNode.createNonDraftInfo = {
					bindingPath: sBindingPathPrefix + sVirtualKeyString,
					createBindingPath: sBindingPath + sVirtualKeyString,
					createContext: oCreateContext
				};
			}

			// Returns a create context for the specified entity set which is already filled with the given predefined values
			function createNonDraft(sEntitySet, vPredefinedValues) {
				return CRUDHelper.createNonDraft("/" + sEntitySet, oTemplateContract.oAppComponent.getModel(), setEditableNDC, fnRegisterNonDraftCreateContext.bind(null, sEntitySet), vPredefinedValues, mustRequireRequestsCanonical());
			}

			// This function will be called before any draft transfer (that is edit/cancel/save in a draft base app is called).
			// oTransferEnded is a Promise that will be resolved/rejected as soon as this draft transfer has finished sucessfully/unsuccessfully
			function onBeforeDraftTransfer(oTransferEnded){
				var aActiveComponents = oTemplateContract.oNavigationControllerProxy.getActiveComponents();
				for (var i = 0; i < aActiveComponents.length; i++){
					var oRegistryEntry = oTemplateContract.componentRegistry[aActiveComponents[i]];
					oRegistryEntry.utils.onBeforeDraftTransfer(oTransferEnded);
				}
			}

			// Public method that is called, when the activation of oContext is started. oActivationPromise must be a RemovalPromise like described in draftRemovalStarted
			function activationStarted(oContext, oActivationPromise) {
				onBeforeDraftTransfer(oActivationPromise);
				oContextBookkeeping.activationStarted(oContext, oActivationPromise);

			}

			// Public method that is called, when the cancellation of oContext is started. oCancellationPromise must be a RemovalPromise like described in draftRemovalStarted
			function cancellationStarted(oContext, oCancellationPromise) {
				onBeforeDraftTransfer(oCancellationPromise);
				oContextBookkeeping.cancellationStarted(oContext, oCancellationPromise);
			}

			// Public method called when the user has started an editing procedure (of a draft based object)
			// oContext: the context of the object to be edited
			// oEditingPromise: A promise that behaves as the Promise returned by function editEntity of CRUDManager
			function editingStarted(oContext, oEditingPromise) {
				onBeforeDraftTransfer(oEditingPromise);
				oContextBookkeeping.editingStarted(oContext, oEditingPromise);
			}

			function fnRegisterStateChanger(oStateChanger){
				oTemplateContract.aStateChangers.push(oStateChanger);
			}

			// Note: This is the prepareDeletion-method exposed by the ApplicationProxy
			// The prepareDeletion-method of Application is actually the same as the prepareDeletion-method of deletionHelper.
			// That method internally calls the prepareDeletion-method of ApplicationProxy (i.e. this function).
			function fnPrepareDeletion(sPath, oPromise){
				oPromise.then(function(){
					oContextBookkeeping.adaptAfterObjectDeleted(sPath);
				});
			}

			function fnBuildSections(sEntitySet, bOnlyEntitySetNames, aSections){
				var oTreeNode = oTemplateContract.mEntityTree[sEntitySet];
				var sNewEntry;
				if (oTreeNode.navigationProperty && oTreeNode.parent){
					sNewEntry = bOnlyEntitySetNames ? oTreeNode.entitySet : oTreeNode.navigationProperty;
				} else {
					sNewEntry = sEntitySet;
				}
				if (aSections.indexOf(sNewEntry) < 0){
					aSections.unshift(sNewEntry);
					if (oTreeNode.navigationProperty && oTreeNode.parent){
						fnBuildSections(oTreeNode.parent, bOnlyEntitySetNames, aSections);
					}
				}
			}

			function getSections(sEntitySet, bOnlyEntitySetNames){
				var aRet = [];
				fnBuildSections(sEntitySet, bOnlyEntitySetNames, aRet);
				return aRet;
			}

			function getBreadCrumbInfo(sEntitySet){
				var aSections = getSections(sEntitySet);
				// remove the last one - this is the current shown section
				aSections.pop();
				var sPath = "";
				var delimiter = "";
				var aRet = [];
				for (var i = 0; i < aSections.length; i++){
					sPath = sPath + delimiter + aSections[i];
					aRet.push(sPath);
					delimiter = "/";
				}
				return aRet;
			}

			function getHierarchySectionsFromCurrentHash(){
				var sHash = oTemplateContract.oNavigationControllerProxy.oHashChanger.getHash();
						// remove query part if there's one
				var	sPath = sHash.split("?")[0];
				var aSections = sPath.split("/");

				if (aSections[0] === "" || aSections[0] === "#") {
					// Path started with a / - remove first section
					aSections.splice(0, 1);
				}
				return aSections;
			}

			function getLinksToUpperLayers(){
				return oTemplateContract.oNavigationControllerProxy. getLinksToUpperLayers();
			}

			function getResourceBundleForEditPromise(){
				var aActiveComponents = oTemplateContract.oNavigationControllerProxy.getActiveComponents();
				var iMinViewLevel = 0;
				var oComponent;
				for (var i = 0; i < aActiveComponents.length; i++){
					var oRegistryEntry = oTemplateContract.componentRegistry[aActiveComponents[i]];
					if (oRegistryEntry.viewLevel > 0 && (iMinViewLevel === 0 || oRegistryEntry.viewLevel < iMinViewLevel)){
						iMinViewLevel = oRegistryEntry.viewLevel;
						oComponent = oRegistryEntry.oComponent;
					}
				}
				var oComponentPromise = oComponent ? Promise.resolve(oComponent) : oTemplateContract.oNavigationControllerProxy.getRootComponentPromise();
				return oComponentPromise.then(function(oComp){
					return oComp.getModel("i18n").getResourceBundle();
				});
			}

			function getAppTitle() {
				return oTemplateContract.oNavigationControllerProxy.getAppTitle();
			}

			function getCurrentKeys(iViewLevel){
				return oTemplateContract.oNavigationControllerProxy.getCurrentKeys(iViewLevel);
			}

			function getPathForViewLevelOneIfVisible() {
				for (var sComponentId in oTemplateContract.componentRegistry){
					var oRegistryEntry = oTemplateContract.componentRegistry[sComponentId];
					if (oRegistryEntry.viewLevel === 1) {
						if (isComponentActive(oRegistryEntry.oComponent)) {
							var oElementBinding = oRegistryEntry.oComponent.getComponentContainer().getElementBinding();
							return oElementBinding && oElementBinding.getPath();
						} else {
							return null;
						}
					}
				}
				return null;
			}

			var oGlobalObject;
			function getCommunicationObject(oComponent, iLevel){
				var i = iLevel || 0;
				if (i > 0){
					// This is only allowed for ReuseComponents, which is not handled here
					return null;
				}
				var sEntitySet = oComponent.getEntitySet();
				var oTreeNode = oTemplateContract.mEntityTree[sEntitySet];
				var oRet = oTreeNode && oTreeNode.communicationObject;
				for (; i < 0 && oRet; ){
					oTreeNode = oTemplateContract.mEntityTree[oTreeNode.parent];
					if (oTreeNode.communicationObject !== oRet){
						i++;
						oRet = oTreeNode.communicationObject;
					}
				}
				if (i < 0 || oRet){
					return oRet;
				}
				oGlobalObject = oGlobalObject || {};
				return oGlobalObject;
			}

			function getForwardNavigationProperty(iViewLevel){
				for (var sKey in oTemplateContract.mEntityTree) {
					if (oTemplateContract.mEntityTree[sKey].navigationProperty && (oTemplateContract.mEntityTree[sKey].level === iViewLevel + 1)) {
						return oTemplateContract.mEntityTree[sKey].navigationProperty;
					}
				}
			}

			function getMaxColumnCountInFCL(){
				return oTemplateContract.oFlexibleColumnLayoutHandler ? oTemplateContract.oFlexibleColumnLayoutHandler.getMaxColumnCountInFCL() : false;
			}

			// This method is called when a draft modification is done. It enables all interested active components to mark their draft as modified
			function fnMarkCurrentDraftAsModified(){
				// All active components get the chance to declare one path as the path to be marked as modified
				var aActiveComponents = oTemplateContract.oNavigationControllerProxy.getActiveComponents();
				for (var i = 0; i < aActiveComponents.length; i++){
					var sComponentId = aActiveComponents[i];
					var oRegistryEntry = oTemplateContract.componentRegistry[sComponentId];
					var sModifiedPath = oRegistryEntry.methods.currentDraftModified && oRegistryEntry.methods.currentDraftModified();
					if (sModifiedPath){
						oContextBookkeeping.markDraftAsModified(sModifiedPath);
					}
				}
			}

			/*
			 * Check if entity sets (service) used are etag enabled
			 *
			 *@returns {boolean} return true to skip the model refresh, when:
								a) at least one entity set is etag enabled
								b) model does not contain any contexts yet
			 *@private
			*/

			function fnCheckEtags() {
				if (bEtagsAvailable !== undefined) {
					return bEtagsAvailable;
				}
				var oEntity, sEtag, oContext, sEntitySet, sPath, oEntitySet, bEmptyModel = true;
				var oModel = oTemplateContract.oAppComponent.getModel();
				var oMetaModel = oModel.getMetaModel();
				//This will be improved. Waiting for an official model API to get contexts
				var mContexts = oModel.mContexts;
				for (oContext in mContexts) {
					bEmptyModel = false;
					sPath = mContexts[oContext].sPath;
					sEntitySet = sPath && sPath.substring(1, sPath.indexOf('('));
					oEntitySet = sEntitySet && oMetaModel.getODataEntitySet(sEntitySet);
					if (oEntitySet) {
						oEntity = oModel.getProperty(sPath);
						sEtag = oEntity && oModel.getETag(undefined, undefined, oEntity) || null;
						if (sEtag) {
							bEtagsAvailable = true;
							return bEtagsAvailable;
						}
					}
				}
				// if mContexts is an empty object, return true but do not alter bEtagsAvailable
				if (bEmptyModel) {
					return true;
				}
				bEtagsAvailable = false;
				return bEtagsAvailable;
			}

			function fnRefreshAllComponents(mExceptions) {
				var i, sId, oRegistryEntry;
				var aAllComponents = oTemplateContract.oNavigationControllerProxy.getAllComponents(); // get all components
				for (i = 0; i < aAllComponents.length; i++) {
					sId = aAllComponents[i];
					if (!mExceptions || !mExceptions[sId]){
						oRegistryEntry = oTemplateContract.componentRegistry[sId];
						oRegistryEntry.utils.refreshBinding(true);
					}
				}
			}

			function setStoredTargetLayoutToFullscreen(iLevel){
				if (oTemplateContract.oFlexibleColumnLayoutHandler){
					oTemplateContract.oFlexibleColumnLayoutHandler.setStoredTargetLayoutToFullscreen(iLevel);
				}
			}

			// Call this function, when paginator info is no longer reliable due to some cross navigation
			function fnInvalidatePaginatorInfo(){
				oTemplateContract.oPaginatorInfo = {};
			}

			function getStatePreserver(oSettings){
				return new StatePreserver(oTemplateContract, oSettings);
			}

			function getSaveScenarioHandler(oController, oCommonUtils){
				return new SaveScenarioHandler(oTemplateContract, oController, oCommonUtils);
			}

			// returns meta data of the specified navigation property for the specified entity set if it exists. Otherwise it returns a faulty value.
			function getNavigationProperty(sEntitySet, sNavProperty){
				var mMyNavigationProperties = mNavigationProperties[sEntitySet];
				if (!mMyNavigationProperties){
					mMyNavigationProperties = Object.create(null);
					mNavigationProperties[sEntitySet] = mMyNavigationProperties;
					var oModel = oTemplateContract.oAppComponent.getModel();
					var oMetaModel = oModel.getMetaModel();
					var oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
					var oEntityType = oEntitySet && oMetaModel.getODataEntityType(oEntitySet.entityType);
					var aNavigationProperty = (oEntityType && oEntityType.navigationProperty) || [];
					for (var i = 0; i < aNavigationProperty.length; i++){
						var oNavigationProperty = aNavigationProperty[i];
						mMyNavigationProperties[oNavigationProperty.name] = oNavigationProperty;
					}
				}
				return mMyNavigationProperties[sNavProperty];
			}

			function fnSwitchToDraft(oDraftContext){
				var oSwitchToSiblingPromise = oTemplateContract.oNavigationControllerProxy.getSwitchToSiblingPromise(oDraftContext, 2);
				oTemplateContract.oBusyHelper.setBusy(oSwitchToSiblingPromise.then(function(fnNavigate){
					fnNavigate();
				}));
			}

			// returns a Promise that resolves to a function that
			// performs the navigation which has to be done after cancelling a draft
			// the returned function itself returns a Promise which is resolved as soon as the navigation has been started
			function getNavigateAfterDraftCancelPromise(oContext){
				var oSpecialPromise = oTemplateContract.oNavigationControllerProxy.getSpecialDraftCancelPromise(oContext);
				if (oSpecialPromise){
					return oSpecialPromise;
				}
				var oSiblingPromise = oContextBookkeeping.getDraftSiblingPromise(oContext);
				return oSiblingPromise.then(function(oActive){
					var oActiveObject = oActive && oActive.getObject();
					var bIsActiveEntity = oActiveObject && oActiveObject.IsActiveEntity;
					if (!bIsActiveEntity){ // create draft
						return Promise.resolve(deletionHelper.getNavigateAfterDeletionOfCreateDraft(oTemplateContract));
					}
					return oTemplateContract.oNavigationControllerProxy.getSwitchToSiblingPromise(oActive, 1).then(function(fnNavigate){
						return function(){
							// The active context is invalidated as the DraftAdministrativeData of the context(the active context) has changed after draft deletion.
							// This is done to keep the DraftAdministrativeData of the record updated.
							var oModel = oActive.getModel();
							oModel.invalidateEntry(oActive);
							return fnNavigate();
						};
					});
				});
			}

			function fnNavigateAfterActivation(oActiveContext){
				oTemplateContract.oNavigationControllerProxy.navigateAfterActivation(oActiveContext);
			}

			function fnNavigateToSubContext(oContext, bReplace, iDisplayMode, oContextInfo){
				oTemplateContract.oNavigationControllerProxy.navigateToSubContext(oContext, bReplace, iDisplayMode, oContextInfo);
			}

			function needsToSuppressTechnicalStateMessages(){
				return !oTemplateContract.bCreateRequestsCanonical;
			}

			// returns the information whether we must set the createRequestsCanonical flag for all requests
			function mustRequireRequestsCanonical(){
				return !oTemplateContract.bCreateRequestsCanonical; // this is the fact if we do not do it ourselves
			}

			oTemplateContract.oApplicationProxy = { // inject own api for AppComponent into the Template Contract. Other classes (NavigationController, BusyHelper) will call these functions accordingly.
				getDraftSiblingPromise: oContextBookkeeping.getDraftSiblingPromise,
				getSiblingPromise: oContextBookkeeping.getSiblingPromise,
				getAlternativeContextPromise: oContextBookkeeping.getAlternativeContextPromise,
				getPathOfLastShownDraftRoot: oContextBookkeeping.getPathOfLastShownDraftRoot,
				areTwoKnownPathesIdentical: oContextBookkeeping.areTwoKnownPathesIdentical,

				getResourceBundleForEditPromise: getResourceBundleForEditPromise,

				getHierarchySectionsFromCurrentHash: getHierarchySectionsFromCurrentHash,
				getContentDensityClass: getContentDensityClass,
				setEditableNDC: setEditableNDC,
				registerNonDraftCreateContext: fnRegisterNonDraftCreateContext,
				getDialogFragment: getDialogFragmentForView.bind(null, null),
				destroyView: function(sViewId){
					delete mFragmentStores[sViewId];
				},
				markCurrentDraftAsModified: fnMarkCurrentDraftAsModified,
				prepareDeletion: fnPrepareDeletion,
				performAfterSideEffectExecution: fnPerformAfterSideEffectExecution,
				onBackButtonPressed: fnOnBackButtonPressed,
				mustRequireRequestsCanonical: mustRequireRequestsCanonical
			};

			return {
				setEditableNDC: setEditableNDC,
				registerNonDraftCreateContext: fnRegisterNonDraftCreateContext,
				getEditableNDC: function() {
					return bIsEditable;
				},
				createNonDraft: createNonDraft,
				getContentDensityClass: getContentDensityClass,
				attachControlToParent: fnAttachControlToParent,
				getDialogFragmentForView: getDialogFragmentForView,
				getBusyHelper: function() {
					return oTemplateContract.oBusyHelper;
				},
				addSideEffectPromise: fnAddSideEffectPromise,
				performAfterSideEffectExecution: fnPerformAfterSideEffectExecution,
				isComponentActive: isComponentActive,
				showMessageToast: function() {
					var myArguments = arguments;
					var fnMessageToast = function() {
						Log.info("Show message toast");
						MessageToast.show.apply(MessageToast, myArguments);
					};
					Promise.all([getOperationEndedPromise(true), oTemplateContract.oBusyHelper.getUnbusy()]).then(fnMessageToast);
				},
				registerStateChanger: fnRegisterStateChanger,
				getDraftSiblingPromise: oContextBookkeeping.getDraftSiblingPromise,
				registerContext: oContextBookkeeping.registerContext,
				activationStarted: activationStarted,
				cancellationStarted: cancellationStarted,
				editingStarted: editingStarted,
				getBreadCrumbInfo: getBreadCrumbInfo,
				getSections: getSections,
				getHierarchySectionsFromCurrentHash: getHierarchySectionsFromCurrentHash,
				getLinksToUpperLayers: getLinksToUpperLayers,
				getAppTitle: getAppTitle,
				getCurrentKeys: getCurrentKeys,
				getPathForViewLevelOneIfVisible: getPathForViewLevelOneIfVisible,
				getCommunicationObject: getCommunicationObject,
				getForwardNavigationProperty: getForwardNavigationProperty,
				getMaxColumnCountInFCL: getMaxColumnCountInFCL,
				markCurrentDraftAsModified: fnMarkCurrentDraftAsModified,
				checkEtags: fnCheckEtags,
				refreshAllComponents: fnRefreshAllComponents,
				getIsDraftModified: oContextBookkeeping.getIsDraftModified,
				prepareDeletion: deletionHelper.prepareDeletion.bind(null, oTemplateContract),
				setStoredTargetLayoutToFullscreen: setStoredTargetLayoutToFullscreen,
				invalidatePaginatorInfo: fnInvalidatePaginatorInfo,
				getStatePreserver: getStatePreserver,
				getSaveScenarioHandler: getSaveScenarioHandler,
				getNavigationProperty: getNavigationProperty,
				switchToDraft: fnSwitchToDraft,
				getNavigateAfterDraftCancelPromise: getNavigateAfterDraftCancelPromise,
				navigateAfterActivation: fnNavigateAfterActivation,
				navigateToSubContext: fnNavigateToSubContext,
				onBackButtonPressed: fnOnBackButtonPressed,
				needsToSuppressTechnicalStateMessages: needsToSuppressTechnicalStateMessages,
				mustRequireRequestsCanonical: mustRequireRequestsCanonical
			};
		}

		return BaseObject.extend("sap.suite.ui.generic.template.lib.Application", {
			constructor: function(oTemplateContract) {
				extend(this, getMethods(oTemplateContract));
			}
		});
	});
