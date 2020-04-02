sap.ui.define(["sap/ui/base/Object",
	"sap/base/Log",
	"sap/suite/ui/generic/template/js/AnnotationHelper",
	"sap/base/util/extend",
	"sap/base/util/isEmptyObject"
], function(BaseObject, Log, AnnotationHelper, extend, isEmptyObject) {
	"use strict";

	var CONTEXT_FAILED = {
		isPreliminary: function(){
			return false;
		}
	};  // constant indicating that reading failed

	function getMethods(oComponent, oComponentRegistryEntry) {

		// oTreeNode contains the routing information about this component
		var oTreeNode = oComponentRegistryEntry.oTemplateContract.mRoutingTree[oComponentRegistryEntry.route];
		// This promise if resolved when the element binding for the header data have been read. Note that the promise
		// stored in this variable is replaced each time the function fnRebindHeaderData is called, unless the last Promise has not been resolved, yet.
		// Thus, the promise allways represents the loading of the currently relevant header data.
		var oHeaderDataAvailablePromise;

		var fnHeaderDataAvailableResolve; // function to resolve the Promise (or null if it is resolved)

		var oContextToAdaptTo;  // a context for an element binding that is still waiting to be analyzed

		var fnBusyResolve;
		var bIsDataLoading = false;

		var aCurrentKeys = [];

		// bIsDraftEnabled Ses initialized ondemand. In case entityset is draft enabled will hold true else false.
		// Will be undefined in case not initialized.
		var bIsDraftEnabled;

		// Registry for the event handling facility (see fnAttach, fnDetach, and fnFire)
		var aEventHandlerRegistry = [];

		// returns the binding context for this component if it is a create binding context which fits to the given binding path. Otherwise a (the outdated) create binding context is removed.
		function retrieveNonDraftCreateContext(sBindingPath){
			if (oTreeNode.createNonDraftInfo && oTreeNode.createNonDraftInfo.bindingPath === sBindingPath){
				return oTreeNode.createNonDraftInfo.createContext;
			}
			// Delete outdated info (if it exists)
			delete oTreeNode.createNonDraftInfo;
			return null;
		}

		// returns the binding path of this component if it is in the non-draft create mode. Otherwise a faulty value.
		function getNonDraftCreateBindingPath(){
			return (oTreeNode.createNonDraftInfo && oComponent.getComponentContainer().getBindingContext() === oTreeNode.createNonDraftInfo.createContext) ? oTreeNode.createNonDraftInfo.createBindingPath : null;
		}

		function getTemplatePrivateModel() {
			return oComponent.getModel("_templPriv");
		}

		function getViewLevel(){
			return getTemplatePrivateModel().getProperty("/generic/viewLevel");
		}

		function getPreprocessorsData(){
			return oComponentRegistryEntry.preprocessorsData;
		}

		function getParameterModelForTemplating(){
			return oComponentRegistryEntry.oParameterModel; // prepared by method createXMLView() in TemplateComponent
		}

		function getODataLoadFailedTexts() {
			var oRB = oComponent.getModel("i18n").getResourceBundle();
			return {
				dataLoadFailedTitle: oRB.getText("ST_ERROR"),
				dataLoadFailedText: oRB.getText("ST_GENERIC_ERROR_LOAD_DATA_TEXT")
			};
		}

		function fnAttach(sTemplate, sEvent, fnFunction) {
			if (typeof fnFunction !== "function") {
				throw new Error("Event handler must be a function");
			}
			aEventHandlerRegistry.push({
				template: sTemplate,
				event: sEvent,
				handler: fnFunction
			});
		}

		function fnDetach(sTemplate, sEvent, fnFunction) {
			for (var i = aEventHandlerRegistry.length; i--; ) {
				if (aEventHandlerRegistry[i].handler === fnFunction && aEventHandlerRegistry[i].event === sEvent && aEventHandlerRegistry[i].template ===
					sTemplate) {
					aEventHandlerRegistry.splice(i, 1);
				}
			}
		}

		function fnFire(sTemplate, sEvent, oEvent) {
			for (var i = 0; i < aEventHandlerRegistry.length; i++) {
				if (aEventHandlerRegistry[i].event === sEvent && aEventHandlerRegistry[i].template === sTemplate) {
					aEventHandlerRegistry[i].handler(oEvent);
				}
			}
		}

		function getTemplateName(oController) {
			return oController.getMetadata().getName();
		}

		function isComponentActive(){
			return oComponentRegistryEntry.oApplication.isComponentActive(oComponent);
		}

		// returns a Promise that is already resolved if we are not in a navigation process for the container for this component. Otherwise it is resolved when the navigation process has finished.
		function getNavigationFinishedPromise(){
			return oComponentRegistryEntry.oNavigationObserver.getProcessFinished(true);
		}

		function fnPageDataLoadedOnNavigation(oContext, bCallReuseCallbacks){
			var oNavigationFinishedPromise = getNavigationFinishedPromise();
			oNavigationFinishedPromise.then(function() {
				if (isComponentActive()){
					if (bCallReuseCallbacks){
						fnCallPathUnchangedReuseCallbacks(true);
					}

					fnFire(getTemplateName(oComponentRegistryEntry.oController), "PageDataLoaded", {
						context: oContext
					});

					if (isDraftEnabled()) {
						// FE requests the DraftSibling on this occasion as the expectation is that UI is interactive
						// and following operations are completed
						// 	1. Header & Section data requests are completed
						// 	2. Navigation is completed
						// 	3. All the listners registered on the PageDataLoaded event is notified
						// FE request the sibling entity details in a promise and UI thread continue without waiting for the response.
						var oActiveEntity = oContext.getObject();
						if (!oActiveEntity.IsActiveEntity) {
							// Try getting the sibling entity only if the context is draft context
							oComponentRegistryEntry.oApplication.getDraftSiblingPromise(oContext);
						}
					}
				}
			});
		}

		function fnPreparePageDataLoaded() {
			oHeaderDataAvailablePromise.then(function(oContext) {
				if (oContext) {
					fnPageDataLoadedOnNavigation(oContext);
				}
			});
		}

		function fnStartBusy(){
			oComponentRegistryEntry.oHeaderLoadingObserver.startProcess();
			if (!fnBusyResolve){
				var oBusyPromise = new Promise(function(fnResolve){
					fnBusyResolve = fnResolve;
				});
				oComponentRegistryEntry.oApplication.getBusyHelper().setBusy(oBusyPromise);
			}
		}

		// creates a new oHeaderDataAvailablePromise if the old one was already resolved
		function fnNewDataAvailablePromise(){
			if (!fnHeaderDataAvailableResolve) { // the current HeaderDataAvailablePromise was already resolved -> create a new one
				oHeaderDataAvailablePromise = new Promise(function(fnResolve) {
					fnHeaderDataAvailableResolve = fnResolve;
				});
			}
		}
		if (oTreeNode.contextPath) {
		  fnNewDataAvailablePromise();
		} else {
		  oHeaderDataAvailablePromise = Promise.resolve();
		}

		function fnDataRequested(oEvent) {
			Log.info("Request header data", oEvent.getSource().getPath(), "Class sap.suite.ui.generic.template.lib.ComponentUtils");
			bIsDataLoading = true;
			fnNewDataAvailablePromise();
			if (!oComponent.getComponentContainer().getElementBinding().isSuspended()) {
				fnStartBusy();
			}
		}

		function fnEndBusy(){
			if (fnBusyResolve){
				fnBusyResolve();
				fnBusyResolve = null;
			}
			oComponentRegistryEntry.oHeaderLoadingObserver.stopProcess();
		}

		function getReadContext(oEvent){
			var oRet = oEvent.getSource().getBoundContext();
			if (oRet) {
				return oRet;
			}
			if (oComponent.getComponentContainer().getElementBinding().isSuspended()) {
				oRet = null;
			} else {
				oRet = CONTEXT_FAILED;
			}
			fnUnbind();
			return oRet;
		}

		function fnNavigateToDataLoadedFailedPage(){
			var oDataLoadFailedTexts = getODataLoadFailedTexts();
			var oNavigationController = oComponent.getAppComponent().getNavigationController();
			oNavigationController.navigateToMessagePage({
				title: oDataLoadFailedTexts.dataLoadFailedTitle,
				text: oDataLoadFailedTexts.dataLoadFailedText,
				description: "",
				viewLevel: getViewLevel()
			});
		}

		function fnAdaptToContext(){
			bIsDataLoading = false;
			if (!oContextToAdaptTo){
				return;
			}
			if (oContextToAdaptTo === CONTEXT_FAILED){
				fnNavigateToDataLoadedFailedPage();
				fnUnbind();
			} else if (!oComponent.getComponentContainer().getElementBinding().isSuspended()) {
				(oComponentRegistryEntry.methods.updateBindingContext || Function.prototype)();
				if (fnHeaderDataAvailableResolve) {
					fnHeaderDataAvailableResolve(oContextToAdaptTo);
				}
			} else {
				return;
			}
			fnHeaderDataAvailableResolve = null;
			oContextToAdaptTo = null;
		}

		function fnDataReceived(oEvent){
			Log.info("Received header data", oEvent.getSource().getPath(), "Class sap.suite.ui.generic.template.lib.ComponentUtils");
			fnEndBusy();
			if (bIsDataLoading){ // otherwise this has already been handled by the Change-Handler
				oContextToAdaptTo = getReadContext(oEvent);
			}
			fnAdaptToContext();
		}

		function fnChange(oEvent) {
			var oContext = getReadContext(oEvent);
			if (oContext && oContext.isPreliminary()){
				return;
			}
			oContextToAdaptTo = oContext;
			fnAdaptToContext();
			oComponentRegistryEntry.oHeaderLoadingObserver.stopProcess();
		}

		// Note: This method is called by fnBindComponent only.
		// Therefore it is ensured, that oComponentRegistryEntry.viewRegistered is already resolved, when this method is called.
		function fnRebindHeaderData(sBindingPath) {
			var oParameter = {
				createPreliminaryContext: true,
				canonicalRequest: !oComponentRegistryEntry.oTemplateContract.bCreateRequestsCanonical // either we or the framework must set the requests to be canonical
			};
			var oPreprocessorsData = getPreprocessorsData();
			if (oPreprocessorsData.rootContextExpand && oPreprocessorsData.rootContextExpand.length) {
				oParameter.expand = oPreprocessorsData.rootContextExpand.join(",");
			}
			oComponentRegistryEntry.oHeaderLoadingObserver.startProcess();
			//In case the component needs to prepare anything
			if (oComponentRegistryEntry.methods.beforeRebind) {
				oComponentRegistryEntry.methods.beforeRebind();
			}
			fnNewDataAvailablePromise();
			oContextToAdaptTo = null;
			oComponent.getComponentContainer().bindElement({
				path: sBindingPath,
				events: {
					dataRequested: fnDataRequested,
					dataReceived: fnDataReceived,
					change: fnChange
				},
				parameters: oParameter,
				batchGroupId: "Changes", // get navigation controller constant?
				changeSetId: "Changes"
			});
			//In case the component needs to reset anything
			if (oComponentRegistryEntry.methods.afterRebind) {
				oComponentRegistryEntry.methods.afterRebind();
			}
		}

		function fnUnbind(){
			fnNewDataAvailablePromise(); // old HeadrDataAvailablePromise points to outdated data
			var oComponentContainer = oComponent.getComponentContainer();
			oComponentContainer.unbindElement();
			oContextToAdaptTo = null;
			bIsDataLoading = false;
			fnEndBusy();
		}

		// Refreshes the content of aCurrentKeys and returns whether this was necessary.
		function fnCompareKeysAndStoreNewOnes(){
			var aNewKeys = getCurrentKeys();
			var bNoDifferenz = (aNewKeys.length === aCurrentKeys.length);
			for (var i = 0; i < aNewKeys.length && bNoDifferenz; i++){
				bNoDifferenz = aNewKeys[i] === aCurrentKeys[i];
			}
			aCurrentKeys = aNewKeys;
			return !bNoDifferenz;
		}

		function fnCallPathUnchangedReuseCallbacks(bUnconditional){
			oComponentRegistryEntry.reuseComponentsReady.then(function(mReuseComponentProxies){
				for (var sKey in mReuseComponentProxies){
					mReuseComponentProxies[sKey].pathUnchangedCallBack(bUnconditional);
				}
			});
		}

		function fnExecuteForAllReuseComponents(mReuseComponentProxies, fnFunction){
			var oRet = Object.create(null);
			for (var sKey in mReuseComponentProxies){
				var oProxy = mReuseComponentProxies[sKey];
				oRet[sKey] = fnFunction(oProxy, sKey);
			}
			return oRet;
		}

		function fnSetInitialVisibilityOfEmbeddedComponents(){
			var oTemplatePrivateModel = getTemplatePrivateModel();
			for (var sKey in oComponentRegistryEntry.routeConfig.embeddedComponents){
				var bHiddenByDefault = !!oComponentRegistryEntry.routeConfig.embeddedComponents[sKey].hiddenByDefault;
				oTemplatePrivateModel.setProperty("/generic/embeddedComponents/" + sKey + "/hidden", bHiddenByDefault);
			}
		}

		// Note: This method is called by TemplateComponent.onActivate. The definition can be found in class TemplateAssembler.
		// There it is ensured that oComponentRegistryEntry.viewRegistered is already resolved, when this method is called.
		function fnBindComponent(sBindingPath, bIsComponentCurrentlyActive) {
			var bAreKeysDifferent = fnCompareKeysAndStoreNewOnes();
			if (bAreKeysDifferent && !bIsComponentCurrentlyActive){
				fnSetInitialVisibilityOfEmbeddedComponents();
			}
			if (!sBindingPath){
				if (oComponentRegistryEntry.routingSpec && oComponentRegistryEntry.routingSpec.noOData){
					fnPageDataLoadedOnNavigation(null, bAreKeysDifferent);
				}
				return;
			}
			var oComponentContainer = oComponent.getComponentContainer();
			if (!oComponentContainer){
				return;
			}
			var oNonDraftCreateContext = retrieveNonDraftCreateContext(sBindingPath);
			if (oNonDraftCreateContext) {
				fnUnbind();
				if (fnHeaderDataAvailableResolve){
					fnHeaderDataAvailableResolve(oNonDraftCreateContext);
					fnHeaderDataAvailableResolve = null;
				} else {
					oHeaderDataAvailablePromise = Promise.resolve(oNonDraftCreateContext);
				}
				if (!bIsComponentCurrentlyActive){
					fnPreparePageDataLoaded();
				}
				oComponentContainer.setBindingContext(oNonDraftCreateContext);
				Promise.all([oComponentRegistryEntry.oViewRenderedPromise, oComponentRegistryEntry.viewRegistered]).then(fnCallPathUnchangedReuseCallbacks.bind(null, true));
			} else {
				var oElementBinding = oComponentContainer.getElementBinding();
				if (oElementBinding){
					if (oElementBinding.getPath() === sBindingPath) {
						/*
						* component is already bound to this object - no rebound to avoid that 1:1, 1:N and expands are read
						* again
						*/
						if (oElementBinding.isSuspended()) {
							oElementBinding.resume();
							fnAdaptToContext();
						}
						if (bIsDataLoading){
							fnStartBusy();
						}
						oComponentRegistryEntry.oApplication.getBusyHelper().getUnbusy().then(fnCallPathUnchangedReuseCallbacks.bind(null, bAreKeysDifferent && oComponentRegistryEntry.routingSpec.noOData));
						if (!bIsComponentCurrentlyActive){
							fnPreparePageDataLoaded();
						}
						return;
					} else if (!bIsComponentCurrentlyActive){
						fnUnbind();
					}
				}
				// set the UI model to not editable / enabled as long as the binding data is read
				var oUIModel = oComponent.getModel("ui");
				oUIModel.setProperty("/enabled", false);
				oUIModel.setProperty("/editable", false);
				// and read the header data if necessary
				fnRebindHeaderData(sBindingPath);

				fnPreparePageDataLoaded();
			}
		}

		function fnRefreshBindingUnconditional(){
			var oElementBinding = oComponent.getComponentContainer().getElementBinding();
			if (oElementBinding) {
				oComponent.getModel().invalidateEntry(oElementBinding.getBoundContext());
				if (oElementBinding.isSuspended()){ // component is currently invisible
					fnUnbind();
				} else { // component is currently visible
					oElementBinding.refresh(true); // trigger reload of data
				}
			}
		}

		function fnRefreshBinding(bUnconditional) {
			bUnconditional = bUnconditional || oComponent.getIsRefreshRequired();
			if (bUnconditional || !isEmptyObject(oComponentRegistryEntry.mRefreshInfos)) {
				(oComponentRegistryEntry.methods.refreshBinding || Function.prototype)(bUnconditional, oComponentRegistryEntry.mRefreshInfos);
				oComponent.setIsRefreshRequired(false);
				oComponentRegistryEntry.mRefreshInfos = Object.create(null);
			}
			fnCallPathUnchangedReuseCallbacks(bUnconditional);
		}

		// This function will be called before any draft transfer (that is edit/cancel/save in a draft base app is called).
		// oTransferEnded is a Promise that will be resolved/rejected as soon as this draft transfer has finished sucessfully/unsuccessfully
		function onBeforeDraftTransfer(oTransferEnded){
			if (isDraftEnabled()){
				var oComponentContainer = oComponent.getComponentContainer();
				var oElementBinding = oComponentContainer.getElementBinding();
				if (oElementBinding && !oElementBinding.isSuspended()){
					oElementBinding.suspend(); // suspend the binding to supress any refresh operation which is done during the activation process
					oTransferEnded.catch(function(){ // if the transfer process has failed the binding needs to be reactivated, since it is now active again
						oElementBinding.resume();
					});
				}
			}
		}


		function fnSuspendBinding(){
			var oComponentContainer = oComponent.getComponentContainer();
			if (getNonDraftCreateBindingPath()){
				oComponentContainer.setBindingContext();
				delete oTreeNode.createNonDraftInfo;
				return;
			}
			var oElementBinding = oComponentContainer.getElementBinding();
			if (oElementBinding && !oElementBinding.isSuspended()){ // suspend element bindings of inactive components
				// if there are validation messages remove the binding. This also removes the validation messages, such that they are not visible on the next page
				if (oComponentRegistryEntry.oTemplateContract.oValidationMessageBinding.getLength()){
					fnUnbind();
				} else {
					oElementBinding.suspend();
				}
				fnEndBusy();
			}
		}

		function registerContext(oContext){
			var iViewLevel = getViewLevel();
			return oComponentRegistryEntry.oApplication.registerContext(oContext, iViewLevel, oComponent.getEntitySet());
		}

		function getBreadCrumbInfo(){
			return oComponentRegistryEntry.oApplication.getBreadCrumbInfo(oComponent.getEntitySet());
		}

		function getCurrentKeys(){
			return oComponentRegistryEntry.oApplication.getCurrentKeys(getViewLevel());
		}

		function getCommunicationObject(iLevel){
			return oComponentRegistryEntry.oApplication.getCommunicationObject(oComponent, iLevel);
		}

		function fnNavigateRoute(sRouteName, sKey, sEmbeddedKey, bReplace){
			oComponentRegistryEntry.oTemplateContract.oNavigationControllerProxy.navigateToChild(oTreeNode, sRouteName, sEmbeddedKey, sKey, bReplace);
		}

		function fnNavigateAccordingToContext(oNavigationContext, iDisplayMode, iReplaceMode){
			oComponentRegistryEntry.oTemplateContract.oNavigationControllerProxy.navigateFromNodeAccordingToContext(oTreeNode, oNavigationContext, iDisplayMode, iReplaceMode);
		}

		function getTitleFromTreeNode(){
			var sEntitySet = oComponent.getEntitySet();
			var oTreeNode = oComponentRegistryEntry.oTemplateContract.mEntityTree[sEntitySet];
			return oTreeNode.headerTitle;
		}

		// set the object title into the tree node
		function setText(sText){
			oComponentRegistryEntry.oTemplateContract.oNavigationControllerProxy.setTextForTreeNode(oTreeNode, sText);
		}

		function isDraftEnabled() {
			if (bIsDraftEnabled === undefined) {
				var sEntitySet = oComponent.getEntitySet();
				var oTreeNode = oComponentRegistryEntry.oTemplateContract.mEntityTree[sEntitySet];
				bIsDraftEnabled = !!(oTreeNode && oTreeNode.isDraft);
			}

			return bIsDraftEnabled;
		}

		// get the path to the root of the currently edited draft
		function getDraftRootPath(){
			if (isDraftEnabled()){
				var aSections = oComponentRegistryEntry.oApplication.getHierarchySectionsFromCurrentHash();
				return "/" + aSections[0];
			}
		}

		function isODataBased(){
			return !(oComponentRegistryEntry.routingSpec && oComponentRegistryEntry.routingSpec.noOData);
		}

		function getHeaderDataAvailablePromise(){
			return oHeaderDataAvailablePromise;
		}

		// get the paginator info relevant for me
		function getPaginatorInfo(){
			return oComponentRegistryEntry.oTemplateContract.oPaginatorInfo[getViewLevel() - 1];
		}

		// set the paginator info. This is done either for the children (when navigating to an item) or for my own level
		// (this is used to modify the paginator buttons, when they are used for navigation).
		function setPaginatorInfo(oPaginatorInfo, bForChildren){
			var iViewLevel = getViewLevel();
			if (!bForChildren){
				iViewLevel--;
			}
			oComponentRegistryEntry.oTemplateContract.oPaginatorInfo[iViewLevel] = oPaginatorInfo;
		}

		function onVisibilityChangeOfReuseComponent(bIsGettingVisible, oComponentContainer){
			oComponentRegistryEntry.reuseComponentsReady.then(function(mReuseComponentProxies){
				var oEmbeddedComponent = oComponentContainer.getComponentInstance();
				for (var sReuseComponentId in mReuseComponentProxies){
					if (oEmbeddedComponent === mReuseComponentProxies[sReuseComponentId].component){
						var oTemplatePrivateModel = getTemplatePrivateModel();
						oTemplatePrivateModel.setProperty("/generic/embeddedComponents/" + sReuseComponentId + "/isInVisibleArea", bIsGettingVisible);
						return;
					}
				}
			});
		}

		// Adds a property oStatePreserverPromise to the view proxy object. This is a Promise that resolves to the StatePreserver instance that is used for this class.
		// It relies on the getCurrentState and applyState methods which are already available in the view proxy and adds functionality for the Reuse Components.
		function setStatePreserverPromise(oViewProxy){
			oViewProxy.oStatePreserverPromise = oComponentRegistryEntry.reuseComponentsReady.then(function(mReuseComponentProxies){
				var oSettings = {
					appStateName: encodeURI("sap-iapp-state-" + oComponentRegistryEntry.routeConfig.entitySet),
					getCurrentState: function(){
						var oRet = oViewProxy.getCurrentState ? oViewProxy.getCurrentState() : Object.create(null);
						var fnAddReuseInfo = function(oProxy, sKey){
							if (oProxy.component.stGetCurrentState){
								var oTempState = oProxy.component.stGetCurrentState();
								for (var sCustomKey in oTempState){
									oRet["$embeddedComponent$" + sKey.length + "$" + sKey + "$" + sCustomKey] = oTempState[sCustomKey];
								}
							}
						};
						fnExecuteForAllReuseComponents(mReuseComponentProxies, fnAddReuseInfo);
						return oRet;
					},
					applyState: function(oState, bIsSameAsLast){
						var oViewState = Object.create(null);
						var oEmbeddedStates = Object.create(null);
						for (var sKey in oState){
							if (sKey.indexOf("$embeddedComponent$") === 0){ // entry belongs to a reuse component
								var sInnerKey = sKey.substring(19); // strip the prefix
								var iOffset = sInnerKey.indexOf("$");
								var iEmbeddedKeyLength = Number(sInnerKey.substring(0, iOffset));
								var sEmbeddedKey = sInnerKey.substring(iOffset + 1, iOffset + iEmbeddedKeyLength + 1);
								var oEmbeddedState = oEmbeddedStates[sEmbeddedKey];
								if (!oEmbeddedState){
									oEmbeddedState = Object.create(null);
									 oEmbeddedStates[sEmbeddedKey] = oEmbeddedState;
								}
								var sCustomKey = sInnerKey.substring(iOffset + iEmbeddedKeyLength + 2);
								oEmbeddedState[sCustomKey] = oState[sKey];
							} else {
								oViewState[sKey] = oState[sKey];
							}
						}
						(oViewProxy.applyState || Function.prototype)(oViewState, bIsSameAsLast);
						var fnApplyReuseInfo = function(oProxy, sMyKey){
							if (oProxy.component.stApplyState){
								oProxy.component.stApplyState(oEmbeddedStates[sMyKey] || Object.create(null), bIsSameAsLast);
							}
						};
						Promise.all([oComponentRegistryEntry.oViewRenderedPromise, oHeaderDataAvailablePromise]).then(fnExecuteForAllReuseComponents.bind(null, mReuseComponentProxies, fnApplyReuseInfo));
					},
					oComponent: oComponent
				};
				var oStatePreserver = oComponentRegistryEntry.oApplication.getStatePreserver(oSettings);
				oComponentRegistryEntry.oApplication.registerStateChanger(oStatePreserver.getAsStateChanger());
				return oStatePreserver;
			});
			oComponentRegistryEntry.oTemplateContract.oStatePreserversAvailablePromise = Promise.all([oComponentRegistryEntry.oTemplateContract.oStatePreserversAvailablePromise, oViewProxy.oStatePreserverPromise]);
		}

		function getFclProxy() {
			var oFlexibleColumnLayoutHandler = oComponentRegistryEntry.oTemplateContract.oFlexibleColumnLayoutHandler;
			return oFlexibleColumnLayoutHandler ? oFlexibleColumnLayoutHandler.getFclProxy(oTreeNode) : {
				handleDataReceived: oTreeNode.level ? null : Function.prototype,
				isListAndFirstEntryLoadedOnStartup: oTreeNode.level ? null : Function.prototype
			};
		}

		// returns the settings from the manifest
		function getSettings(){
			return oTreeNode.page.component.settings || {};
		}

		function fnRegisterUnsavedDataCheckFunction(fnHasUnsavedData){
			oComponentRegistryEntry.aUnsavedDataCheckFunctions = oComponentRegistryEntry.aUnsavedDataCheckFunctions || [];
			oComponentRegistryEntry.aUnsavedDataCheckFunctions.push(fnHasUnsavedData);
		}

		return {
			setEditableNDC: function(bIsEditable) {
				oComponentRegistryEntry.oApplication.setEditableNDC(bIsEditable);
			},
			getEditableNDC: function() {
				return oComponentRegistryEntry.oApplication.getEditableNDC();
			},

			getBusyHelper: function() {
				return oComponentRegistryEntry.oApplication.getBusyHelper();
			},

			getNonDraftCreateBindingPath: getNonDraftCreateBindingPath,

			attach: function(oController, sEvent, fnFunction) {
				fnAttach(getTemplateName(oController), sEvent, fnFunction);
			},
			detach: function(oController, sEvent, fnFunction) {
				fnDetach(getTemplateName(oController), sEvent, fnFunction);
			},
			fire: function(oController, sEvent, oEvent) {
				fnFire(getTemplateName(oController), sEvent, oEvent);
			},

			// temporary solution
			isListReportTemplate: function(){
				return AnnotationHelper.isListReportTemplate(oComponentRegistryEntry.routeConfig);
			},

			getPreprocessorsData: getPreprocessorsData,
			getParameterModelForTemplating: getParameterModelForTemplating,
			bindComponent: fnBindComponent,
			refreshBinding: fnRefreshBinding,
			refreshBindingUnconditional: fnRefreshBindingUnconditional,
			suspendBinding: fnSuspendBinding,
			getTemplatePrivateModel: getTemplatePrivateModel,
			registerContext: registerContext,
			getViewLevel: getViewLevel,
			getBreadCrumbInfo: getBreadCrumbInfo,
			getCurrentKeys: getCurrentKeys,
			getDraftRootPath: getDraftRootPath,
			getCommunicationObject: getCommunicationObject,
			navigateRoute: fnNavigateRoute,
			navigateAccordingToContext: fnNavigateAccordingToContext,
			getTitleFromTreeNode: getTitleFromTreeNode,
			setText: setText,
			onBeforeDraftTransfer: onBeforeDraftTransfer,
			isDraftEnabled: isDraftEnabled,
			isODataBased: isODataBased,
			isComponentActive: isComponentActive,
			navigateToDataLoadedFailedPage: fnNavigateToDataLoadedFailedPage,
			getHeaderDataAvailablePromise: getHeaderDataAvailablePromise,
			getPaginatorInfo: getPaginatorInfo,
			setPaginatorInfo: setPaginatorInfo,
			onVisibilityChangeOfReuseComponent: onVisibilityChangeOfReuseComponent,
			getNavigationFinishedPromise: getNavigationFinishedPromise,
			setStatePreserverPromise: setStatePreserverPromise,
			unbind: fnUnbind,
			getFclProxy: getFclProxy,
			getSettings: getSettings,
			registerUnsavedDataCheckFunction: fnRegisterUnsavedDataCheckFunction
		};
	}

	return BaseObject.extend("sap.suite.ui.generic.template.lib.ComponentUtils", {
		constructor: function(oComponent, oComponentRegistryEntry) {
			extend(this, getMethods(oComponent, oComponentRegistryEntry));
		}
	});
});
