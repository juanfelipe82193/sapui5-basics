/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

// ------------------------------------------------------------------------------------------------------------
// This class handles inner app navigation for Smart Template based apps.
// The class exposes its services in two ways:
// 1. There is a public API providing the navigation methods navigateToRoot, navigateToContext, navigateToMessagePage, and navigateBack
//    to Template developers and even Breakout developers.
// 2. A richer object oNavigationControllerProxy is created (see constructor) which is used by the core classes of the SmartTemplate framework.
//    This object allows more detailed interaction with navigation.

// Moreover, this class is responsible for handling the route matched events occuring within a Smart Template based App.

// Within this class we differentiate between a number of different scenarios for navigation/url-changes:
// 1. A state change is a change of the url which does not lead to a new route, but just modifies the encoding of the internal state of one view in the
//    url. Whenever a route matched event occurs it is first checked, whether this corresponds to a state change.
//    If this is true, we do not consider it as a navigation and all further handling of the url within this class is stopped.
//    It is assumed that the state change is totally controlled by the component that has initiated the state change.
//    Note that agents might register themselves as possible state changers via sap.suite.ui.generic.template.lib.Application.registerStateChanger.
//    A new url is passed to the registered state changers one after the other (method isStateChange). If any of those returns true the processing
//    of the url is stopped.
// 2. Illegal urls: The user enters a url which belongs to this App but not to a legal route. This is not considered as a navigation.
// 3. Back navigation: Back navigation can be triggered by the user pressing the browser-back button (then we have no control), the user pressing the
//    back button within the App, or programmatically (e.g. after cancelling an action).
// 4. Programmatic (forward) navigation: The program logic often demands the navigation to be triggerd programmatically. Such navigation is always forwarded to
//    function fnNavigate. Note that this function automatically performs a back navigation, when the navigation target is the same as the last history entry.
//    Note that it is also possible to navigate programmatically to the MessagePage. However, this does not change the url and is therefore not considered as navigation.
// 5. Manual navigation: The user can navigate inside the running App by modifying the url manually (more probable: by selecting a bookmark/history entry
//    which leads to some other place within the App). Note that in this case the navigation may be totally uncontrolled within the App.
// 6. Follow-up navigation: In some cases a navigation directly triggers another navigation. For the user only one navigation step is performed although the url changes several times.
//    In principle there are two scenarios for the follow-up navigation:
//    a) The url-change is performed programmatically. The target url is 'nearly' identical with a url contained in the history.
//       This means that these two urls only differ regarding query parameters representing the state of the ui
//       In this case we try to perform the navigation as a (possibly multiple) backward navigation followed by a (replacing) forward navigation.
//       The follow-up forward navigation is already prepared before the backward navigation is triggered.
//       The decision whether such a follow-up navigation is really needed will be done, when the route-matched event is processed.
//    b) The need for follow-up navigation is detected when a route-matched event is processed. In this case the url-change may have been performed programmatically
//       or manually. This case, e.g. applies when the url points to a draft which has meanwhile been activated.
// 7. Pseudo navigation: The url is not changed, but the set of views to be displayed changes. This can happen, when the message page is displayed or when the
//    user changes the size of the browser in an FCL-based App.
//
// We also use the notion of 'logical navigation steps'.
// Cases 3, 4, and 5 are considered to be logical navigation steps.
// 2 is no logical navigation step, but will be forwarded to 7 (message page displayed).
// State changes (1), follow-up navigation (6), and pseudo navigation (7) will not create a new logical navigation step. However, they will be used to update the information
// current logical navigation step.
// ------------------------------------------------------------------------------------------------------------
sap.ui.define(["sap/ui/base/Object",
	"sap/ui/core/ComponentContainer",
	"sap/ui/core/routing/HashChanger",
	"sap/ui/core/routing/History",
	"sap/ui/core/library",
	"sap/suite/ui/generic/template/lib/ProcessObserver",
	"sap/suite/ui/generic/template/lib/routingHelper",
	"sap/suite/ui/generic/template/lib/TemplateComponent",
	"sap/suite/ui/generic/template/lib/testableHelper",
	"sap/ui/fl/ControlPersonalizationAPI",
	"sap/base/Log",
	"sap/base/util/merge",
	"sap/base/util/extend",
	"sap/base/util/isEmptyObject",
	"sap/base/util/UriParameters"
], function(BaseObject, ComponentContainer, HashChanger, History, coreLibrary,ProcessObserver, routingHelper,
	TemplateComponent, testableHelper, ControlPersonalizationAPI, Log, merge, extend, isEmptyObject, UriParameters) {
	"use strict";
	// shortcut for sap.ui.core.routing.HistoryDirection
	var HistoryDirection = coreLibrary.routing.HistoryDirection;
	var oHistory = History.getInstance();

	var oCrossAppNavigator = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");

	function removeQueryInRouteName(sRouteName) {
		// remove query in sRouteName
		var checkForQuery = sRouteName.substring(sRouteName.length - 5, sRouteName.length);
		if (checkForQuery === "query") {
			return sRouteName.substring(0, sRouteName.length - 5);
		}
		return sRouteName;
	}


	// Private static methods

	// The part of the url specifying in detail the target within the App is called the hash. Note that this hash sometimes comes with a leading "/", sometimes without. Both
	// representations are equivalent. This function creates a normalized representation (always containing the leading "/"). Below this representation is called "normalized hash".
	function fnNormalizeHash(sHash) {
		if (sHash.indexOf("/") === 0){
			return sHash;
		}
		return "/" + sHash;
	}

	function fnAppStates2ParString(oAppStates){
		var sDelimiter = "";
		var sRet = "";
		var aPars = Object.keys(oAppStates).sort();
		aPars.forEach(function(sPar){
			var vValue = oAppStates[sPar];
			if (Array.isArray(vValue)){
				var aValues = vValue.sort();
				for (var i = 0; i < aValues.length; i++){
					var sValue = aValues[i];
					sRet = sRet + sDelimiter + sPar + "=" + sValue;
					sDelimiter = "&";
				}
			} else {
				sRet = sRet + sDelimiter + sPar + "=" + vValue;
				sDelimiter = "&";
			}
		});
		return sRet;
	}

	function fnConcatPathAndPars(sPath, sPars){
		sPath = sPath || "";
		// use "?" or "/?" as delimiter, depending on whether sPath already ends with a "/"
		var sDelim = (sPath.charAt(sPath.length - 1) === "/") ? "?" : "/?";
		return sPath + (sPars ? sDelim + sPars : "");
	}

	function fnConcatPathAndAppStates(sPath, oAppStates){
		var sPars = fnAppStates2ParString(oAppStates);
		return fnConcatPathAndPars(sPath, sPars);
	}

	/*
	 * Creates a new ComponentContainer with template from routing configuration
	 * @param {Object}oAppComponentg - the application component
	 * @param {Object} oRouteConfig - the route configuration
	 * @returns {sap.ui.core.ComponentContainer} instance of the component container
	 */
	function fnCreateComponentInstance(oTemplateContract, oRouteConfig, fnComponentCreateResolve) {
		var oTreeNode = oTemplateContract.mRoutingTree[oRouteConfig.name];
		var sTemplate = oRouteConfig.template;
		var sEntitySet = oRouteConfig.entitySet;
		var iViewLevel = oTreeNode.level;
		var iObserverIndex = -1;
		if (oTemplateContract.oFlexibleColumnLayoutHandler){
			iObserverIndex = iViewLevel < 3 ? iViewLevel : 0;
		}
		var oNavigationObserver = iObserverIndex < 0 ? oTemplateContract.oNavigationObserver : oTemplateContract.aNavigationObservers[iObserverIndex];
		var oHeaderLoadingObserver = new ProcessObserver();
		var oLoadingObserverParent = iObserverIndex < 0 ? oTemplateContract.oHeaderLoadingObserver : oTemplateContract.aHeaderLoadingObservers[iObserverIndex];
		oLoadingObserverParent.addObserver(oHeaderLoadingObserver);
		var oPreprocessorsData = {};
		var oSettings = {
			appComponent: oTemplateContract.oAppComponent,
			isLeaf: !oRouteConfig.pages || !oRouteConfig.pages.length,
			entitySet: sEntitySet,
			navigationProperty: oRouteConfig.navigationProperty,
			componentData: {
				registryEntry: {
					oAppComponent: oTemplateContract.oAppComponent,
					componentCreateResolve: fnComponentCreateResolve,
					route: oRouteConfig.name,
					routeConfig: oRouteConfig,
					viewLevel: oTreeNode.level,
					routingSpec: oRouteConfig.routingSpec,
					oNavigationObserver: oNavigationObserver,
					oHeaderLoadingObserver: oHeaderLoadingObserver,
					preprocessorsData: oPreprocessorsData
				}
			}
		};

		if (oRouteConfig.component.settings) {
			// consider component specific settings from app descriptor
			extend(oSettings, oRouteConfig.component.settings);
		}

		var oComponentContainer;
		// Note: settings are passed to Component and to ComponentContainer. This has to be revisited.
		oTemplateContract.oAppComponent.runAsOwner(function() {
			try {
				var oComponentPromise = sap.ui.core.Component.create({
					name: sTemplate,
					settings: oSettings,
					handleValidation: true,
					manifest: true
				});

				var oLoadedPromise;

				oComponentContainer = new ComponentContainer({
					propagateModel: true,
					width: "100%",
					height: "100%",
					settings: oSettings
				});

				oLoadedPromise = oComponentPromise.then(function(oComponent) {
					oComponentContainer.setComponent(oComponent);
					var oTreeNode = oTemplateContract.mRoutingTree[oRouteConfig.name];
					oTreeNode.componentId = oComponent.getId();
					return oComponentContainer;
				});


				// add the 'loaded' function to make the component container behave the same as a view
				oComponentContainer.loaded = function() {
					return oLoadedPromise;
				};
			} catch (e) {
				throw new Error("Component " + sTemplate + " could not be loaded");
			}
		});
		return oComponentContainer;
	}

	// Definition of instance methods
	function getMethods(oTemplateContract, oNavigationControllerProxy) {

		/* support templating QUnit tests */
		testableHelper.testable(fnCreateComponentInstance, "fnCreateComponentInstance");

		var isInitialNavigation = !oCrossAppNavigator || oCrossAppNavigator.isInitialNavigation();

		var mMessagePageParams = {};
		// oCurrentHash contains some information about the current navigation state. A new instance is created for each logical navigation step (when the url is caught).
		// The old instance is pushed onto aPreviousHashes (see below) at this moment.
		var oCurrentHash = { // The initial instance represents the time before the app was started.
			iHashChangeCount: 0, // the value of this property is increased with each logical navigation step. It is used to identify the logical navigation steps.
			backTarget: 0,   // the hashChangeCount of the logical navigation step that will be reached via back navigation. Value of 0 means, that back will leave the app.
			aCurrentKeys: [], // an array of length viewLevel + 1 (viewLevel being the current hierarchy level) containing the hierarchical key
			componentsDisplayed: Object.create(null) // a map which maps routes onto a number indicating their 'display state' of the corresponding template component:
									// * 1: Component is currently visible
									// * 2: Component is logically shown with this url, but not physically (this applies for the end column of an FCL which has been hidden
									//      due to use of ThreeColumnsBeginExpandedEndHidden or ThreeColumnsMidExpandedEndHidden layout)
									// * 3: Component would be shown with this url, but is hidden due to current browser size and orientation (only relevant in FCL)
									// * 4: Component is logically shown by this route, but not by this url. This applies for second or first column in FCL whic are not shown due to
									//      the current layout on this device. On desktop this only happens, when a fullscreen layout is chosen. On other devices it might also apply to other layouts.
									// * 5: Component is logically shown, but has been replaced by an error page.
									// * 6: Component is logically shown, but an error page is shown in a previous column (only relevant in FCL)
		};
		// The following properties are added to the currentHash during runtime
		// - oEvent           A copy of the route-matched event that was used to come here. The initial instance of oCurrentHash can be identified by the fact that this property is faulty.
		// - hash:            The (normalized) hash of the current url
		// - targetHash:      If the logical step is navigated away via fnNavigate: (normalized) hash that is navigated to
		// - LeaveByBack:     Information whether the logical navigation step was left via back functionality
		// - LeaveByReplace   Information whether the logical navigation step was removed from history
		// - backwardingInfo: This property is truthy in case the logical step was left via a 'complex' back navigation.
		//                    A complex back navigation can navigate more then one step back and it can be followed by a follow-up
		//                    forward navigation (in order to adjust state)
		//                    backwardingInfo contains the following properties
		//					  * count: number of back navigations that is performed at once. Note that complex back navigations always end within the navigation history of this app.
		//				      * targetHash: The (normalized) hash that finally should be reached
		// - forwardingInfo:  This property is only set temporarily. It is added (in fnHandleRouteMatched) in the following cases
		//                    * If oCurrentHash.backwardingInfo is truthy, a new logical navigation step is started. Therefore, a new instance for oCurrentHash
		//                      is created. Property targetHash is copied from backwardingInfo of the previous instance into
		//                      forwardingInfo of the new instance.
		//                      Moreover, properties bIsProgrammatic and bIsBack of forwardingInfo are set to true and properties componentsDisplayed and iHashChangeCount are set to the same value as
		//                      in the enclosing oCurrentHash.
		//                    * The current url points to a context that is not valid anymore. Method ContextBookkeeping.getAlternativeContextPromise has delivered
		//                      (a Promise to) an alternative context which should be navigated to. In this case only properties bIsProgrammatic, bIsBack, and
		//                      iHashChangeCount are set. bIsProgrammatic contains information whether the logical navigation was triggered programmatically.
		//                      bIsBack contains the information whether the logical navigation step was reached by backward navigation.
		//                      componentsDisplayed is set to the same value as in the enclosing oCurrentHash.
		//                    The property is removed again when the final physical navigation step of a logical navigation step has been performed.

		var aPreviousHashes = []; // array of previous instances of oCurrentHash. Length is always be identical to oCurrentHash.iHashChangeCount. iHashChangeCount of each entry is equal to its position.

		var oActivationPromise = Promise.resolve(); // Enables to wait for the end of the current activation of all components

		/* get all pages that may be created for functional testing */
		function fnGetAllPages() {
			var oRouter = oNavigationControllerProxy.oRouter,
				oTargets = oRouter.getTargets()._mTargets,
				aAllPages = [];

			Object.keys(oTargets).forEach(function(sTargetKey) {
				var oTarget = oTargets[sTargetKey],
					oOptions = oTarget._oOptions,
					oRoute = oRouter.getRoute(oOptions.viewName),
					oConfig = oRoute && oRoute._oConfig;
				if (oConfig && (!oConfig.navigation || !oConfig.navigation.display)) {
					aAllPages.push({
						oConfig: oConfig
					});
				}
			});
			return aAllPages;
		}

		/* get configurations of all pages defined in the manifest in QUnit tests */
		testableHelper.testable(fnGetAllPages, "fnGetAllPages");

		/* create page(s) of an application for testing result of templating or view creation */
		function fnCreatePages(vPages /* optional array or single object of page configurations as created in fnGetAllPages */) {
			var aPages = vPages || fnGetAllPages();
			if (!Array.isArray(aPages)) {
				aPages = [aPages];
			}
			aPages.forEach(function(oPage) {
				oPage.oComponentContainer = fnCreateComponentInstance(oTemplateContract, oPage.oConfig, function(){} );
			});

			return aPages;
		}

		/* support templating all pages in QUnit tests */
		testableHelper.testable(fnCreatePages, "fnCreatePages");

		function getRootComponentPromise(){
			// Make sure that the loading of the root component starts
			var oViews = oNavigationControllerProxy.oRouter.getViews();
			oViews.getView({
				viewName: "root"
			});
			return oTemplateContract.mRouteToTemplateComponentPromise.root;
		}

		function getAppTitle(){
			return oNavigationControllerProxy.oAppComponent.getManifestEntry("sap.app").title;
		}

		// This method returns a setHierarchyPromise.
		// When this Promise is resolved, some parameter information has been added to mAppStates
		// More precisely, the key(s) having been added are parameter names that are used to store state information of the component within the url
		// The corresponding value for such a parameter is an array that contains all possible values for this parameter
		// sPath may be faulty, which means, that the binding path for the corresponding component has not changed.
		// Otherwise sPath denotes the binding path that will be used for the component.
		// Edge case: sComponentId is faulty, then a resolved Promise is returned
		function getApplicableStateForComponentAddedPromise(sComponentId, sPath, mAppStates){
			var oComponentRegistryEntry = sComponentId && oTemplateContract.componentRegistry[sComponentId];
			var getUrlParameterInfo = oComponentRegistryEntry && oComponentRegistryEntry.methods.getUrlParameterInfo;
			return getUrlParameterInfo ? oComponentRegistryEntry.viewRegistered.then(function(){
				var sPathNormalized = sPath && fnNormalizeHash(sPath); // if sPath is faulty the same holds for sPathNormalized. Otherwise sPathNormalized will be the normalized version of sPath.
				return getUrlParameterInfo(sPathNormalized, oCurrentHash.componentsDisplayed[oComponentRegistryEntry.route] === 1).then(function(mNewPars){
					extend(mAppStates, mNewPars);
				});
			}) : Promise.resolve();
		}

		function fnAddUrlParameterInfoForRoute(sRoute, mAppStates, sPath) {
			var oTreeNode = oTemplateContract.mRoutingTree[sRoute];
			return getApplicableStateForComponentAddedPromise(oTreeNode.componentId, sPath, mAppStates);
		}

		function fnSetTitleForComponent(isAppTitlePrefered, oTitleProvider){
			var sTitle;
			if (!isAppTitlePrefered && oTitleProvider instanceof TemplateComponent){
				var oRegistryEntry = oTitleProvider && oTemplateContract.componentRegistry[oTitleProvider.getId()];
				var fnGetTitle = oRegistryEntry && oRegistryEntry.methods.getTitle;
				sTitle = fnGetTitle && fnGetTitle();
			} else if (!isAppTitlePrefered && oTitleProvider && oTitleProvider.title){
				sTitle = oTitleProvider.title;
			}
			sTitle = sTitle || getAppTitle();

			oTemplateContract.oShellServicePromise.then(function (oShellService) {
				oShellService.setTitle(sTitle);
			}).catch(function() {
				Log.warning("No ShellService available");
			});
		}

		// This method is called when all views have been set to their places
		function fnAfterActivationImpl(oTitleProvider){
			var aPageDataLoadedPromises = [oTemplateContract.oPagesDataLoadedObserver.getProcessFinished(true)];
			var oActiveComponent = null;
			var iCurrentHashCount = oCurrentHash.iHashChangeCount;
			delete oCurrentIdentity.componentsDisplayed; // from now on we rely on the entry in oCurrentHash
			var maxActiveViewLevel = -1;
			for (var sComponentId in oTemplateContract.componentRegistry){
				var oRegistryEntry = oTemplateContract.componentRegistry[sComponentId];
				var oMessageButtonHelper = oRegistryEntry.oControllerUtils && oRegistryEntry.oControllerUtils.oServices.oTemplateCapabilities.oMessageButtonHelper;
				var bIsActive = oCurrentHash.componentsDisplayed[oRegistryEntry.route] === 1;
				var oTemplatePrivateModel = oRegistryEntry.utils.getTemplatePrivateModel();
				oTemplatePrivateModel.setProperty("/generic/isActive", bIsActive);
				if (bIsActive){
					aPageDataLoadedPromises.push(oRegistryEntry.oViewRenderedPromise);
					if (oRegistryEntry.viewLevel > maxActiveViewLevel){
						maxActiveViewLevel = oRegistryEntry.viewLevel;
						oActiveComponent = oRegistryEntry.oComponent;
					}
				} else {
					oRegistryEntry.utils.suspendBinding();
				}
				if (oMessageButtonHelper){
					oMessageButtonHelper.setEnabled(bIsActive);
				}
			}

			var isAppTitlePrefered = oTemplateContract.oFlexibleColumnLayoutHandler && oTemplateContract.oFlexibleColumnLayoutHandler.isAppTitlePrefered();
			fnSetTitleForComponent(isAppTitlePrefered, oTitleProvider || oActiveComponent);

			Promise.all(aPageDataLoadedPromises).then(function(){
				if (iCurrentHashCount === oCurrentHash.iHashChangeCount && isEmptyObject(mMessagePageParams)){
					oTemplateContract.oAppComponent.firePageDataLoaded();
				}
			});
		}

		// Default call
		var fnAfterActivation = fnAfterActivationImpl.bind(null, null); // do not pass a TitleProvider/forward to fnAfterActivationImpl

		function getAncestorTreeNodePath(oTreeNode, iUpToLevel){
			var aRet = [];
			for (var oNode = oTreeNode; oNode.level >= iUpToLevel; oNode = oTemplateContract.mRoutingTree[oNode.parentRoute]){
				aRet.push(oNode);
			}
			return aRet.reverse();
		}

		function fnDeterminePathForKeys(oTreeNode, aKeys, bForRoute){
			if (oTreeNode.level === 0) {
				return null;
			}
			var sPath = bForRoute ? oTreeNode.pattern : oTreeNode.contextPath;
			if (!sPath){
				return null;
			}
			if (sPath.indexOf("/") !== 0) {
				sPath = "/" + sPath;
			}
			for (var i = 1; i <= oTreeNode.level; i++){
				sPath = sPath.replace("{keys" + i + "}", aKeys[i]);
			}
			return sPath;
		}

		// Start: navigation methods
		var oRoutingOptions; // this object is truthy while a navigation is going on
		var oCurrentIdentity;
		var oLinksToUpperLayer;

		// Allow setting the current idfentity by unit tests
		testableHelper.testable(function(oIdentity){
			oCurrentIdentity = oIdentity;
			aPreviousHashes.push(oCurrentHash);
			oCurrentHash = {
				backTarget: 0,
				componentsDisplayed: Object.create(null)
			};
		}, "setCurrentIdentity");

		function getCurrentIdentity(){
			return oCurrentIdentity;
		}

		function areParameterValuesEqual(vValue1, vValue2){
			if (Array.isArray(vValue1) && vValue1.length < 2){
				vValue1 = vValue1[0];
			}
			if (Array.isArray(vValue2) && vValue2.length < 2){
				vValue2 = vValue2[0];
			}
			if (Array.isArray(vValue1)){
				if (Array.isArray(vValue2)){
					if (vValue1.length === vValue2.length){
						vValue1 = vValue1.sort();
						vValue2 = vValue2.sort();
						return vValue1.every(function(sValue, i){
							return sValue === vValue2[i];
						});
					}
					return false;
				}
				return false;
			}
			return vValue2 === vValue1;
		}

		function isIdentityReached(oIdentity){
			if (!oCurrentIdentity || oCurrentIdentity.treeNode !== oIdentity.treeNode){
				return false;
			}
			for (var oAncestralNode = oIdentity.treeNode; oAncestralNode.level > 0; oAncestralNode = oTemplateContract.mRoutingTree[oAncestralNode.parentRoute]){
				if (!oAncestralNode.noKey && oIdentity.keys[oAncestralNode.level] !== oCurrentIdentity.keys[oAncestralNode.level]){
					return false;
				}
			}
			if (isEmptyObject(oIdentity.appStates) !== isEmptyObject(oCurrentIdentity.appStates)){
				return false;
			}
			if (isEmptyObject(oIdentity.appStates)){
				return true;
			}
			var oUnion = extend(Object.create(null), oIdentity.appStates, oCurrentIdentity.appStates);
			for (var sPar in oUnion){
				if (!areParameterValuesEqual(oIdentity.appStates[sPar], oCurrentIdentity.appStates[sPar])){
					return false;
				}
			}
			return true;
		}

		// Helper method for fnNavigateToRoute
		// The target route information is assumed to be contained in oRoutingOptions

		function fnGetRouterInput(oTreeNode, aKeys, mAppStates){
			var oParameters = Object.create(null);
			for (var oAncestralNode = oTreeNode; oAncestralNode.level > 0; oAncestralNode = oTemplateContract.mRoutingTree[oAncestralNode.parentRoute]){
				if (!oAncestralNode.noKey){
					oParameters["keys" + oAncestralNode.level] = aKeys[oAncestralNode.level];
				}
			}
			var bIsQuery = !isEmptyObject(mAppStates);
			var sEffectiveRoute = oTreeNode.sRouteName + (bIsQuery ? "query" : "");
			if (bIsQuery){
				oParameters["query"] = mAppStates;
			}
			return {
				route: sEffectiveRoute,
				parameters: oParameters
			};
		}

		// This method assumes that oRoutingOptions represents the target of the navigation and navigates there either via a forward- or a replace-navigation (depending on bReplace)
		function fnNavigateToRouteImpl(bReplace){
			var oRouterInput = fnGetRouterInput(oRoutingOptions.identity.treeNode, oRoutingOptions.identity.keys, oRoutingOptions.identity.appStates);
			oNavigationControllerProxy.oRouter.navTo(oRouterInput.route, oRouterInput.parameters, bReplace);
		}

		// This method assumes that oRoutingOptions represents the target of the navigation and sets the specified display mode for the navigation targets
		function fnSetDisplayMode(iDisplayMode){
			if (!iDisplayMode || !oRoutingOptions.identity){
				return;
			}
			var fnSet = function(bIsAlreadyVisible, oComponent, sComponentId){
				sComponentId = oComponent ? oComponent.getId() : sComponentId;
				var oRegistryEntry = oTemplateContract.componentRegistry[sComponentId];
				(oRegistryEntry.methods.presetDisplayMode || Function.prototype)(iDisplayMode, bIsAlreadyVisible);
			};
			for (var oTreeNode = oRoutingOptions.identity.treeNode; oTreeNode; oTreeNode = oTreeNode.parentRoute && oTemplateContract.mRoutingTree[oTreeNode.parentRoute]){
				if (oTreeNode.componentId){
					fnSet(oCurrentHash.componentsDisplayed[oTreeNode.sRouteName] === 1, null, oTreeNode.componentId);
				} else {
					oTemplateContract.mRouteToTemplateComponentPromise[oTreeNode.sRouteName].then(fnSet.bind(null, false));
				}
				if (oTreeNode.fCLLevel === 0 || oTreeNode.fCLLevel === 3){ // only preset additional nodes if they may be displayed within the FCL
					break;
				}
			}
		}

		//  new navigation. Should replace old navigation logic.
		//  oOptions is optional. If it is not provided we assume that oRoutingOptions is already set and should contain the correct value.
		//  However, in this case mode is taken as 1.
		//  This is the follow-up navigation scenario.
		//  properties of oOptions:
		// - identity
		//   ~ treeNode : the treeNode that is navigated to
		//   ~ keys     : array of keys for the route
		//   ~ appStates: map of app states
		// - mode: integer. Possible values:
		//         negative value: Do as many steps back. Then (if necessary) do a replace to reach the final identity.
		//         0: forward navigation
		//         1: replace navigation
		// - displayMode: Expected mode for the target display: 0 = unknown, 1 = display, 2 = edit, 4 = add, 6 = change (edit or add)
		function fnNavigateToRoute(oOptions){
			var iMode;
			if (oOptions){
				if (oRoutingOptions || (oCurrentIdentity && oCurrentIdentity.preset)){ // still another navigation going on -> route matched will be called anyway
					oRoutingOptions = { // reassign the running navigation to the new identity
						identity: oOptions.identity,
						followUpNeeded: true
					};
					fnSetDisplayMode(oOptions.displayMode);
					return;
				}
				if (oOptions.identity && isIdentityReached(oOptions.identity)){ // target identity already reached -> no navigation needed
					return;
				}
				iMode = oOptions.mode;
				oRoutingOptions = oOptions;
				fnSetDisplayMode(oOptions.displayMode);
				delete oRoutingOptions.displayMode;
			} else {
				iMode = 1;
			}
			oRoutingOptions.followUpNeeded = iMode < 0;
			oTemplateContract.oBusyHelper.setBusyReason("HashChange", true);
			oRoutingOptions.displayMode = 0;
			if (iMode < 0){
				window.history.go(iMode);
			} else {
				fnNavigateToRouteImpl(iMode === 1);
			}
		}

		function setTextForTreeNode(oTreeNode, sText){
			oTreeNode.text = ((oTreeNode.headerTitle !== sText) && sText) || "";
			if (oLinksToUpperLayer && oLinksToUpperLayer.linkInfos.length > oTreeNode.level){
				oLinksToUpperLayer.adjustNavigationHierarchy();
			}
		}

		function fnCreateLinkInfoForNode(oTreeNode, aAppStatePromises){
			var mAppStates = Object.create(null);
			var sBindingPath = fnDeterminePathForKeys(oTreeNode, oCurrentIdentity.keys);
			if (oTemplateContract.oFlexibleColumnLayoutHandler){
				oTemplateContract.oFlexibleColumnLayoutHandler.adaptBreadCrumbUrlParameters(mAppStates, oTreeNode);
			}
			var oRet = {
				treeNode: oTreeNode
			};
			var oAppStatePromise = getApplicableStateForComponentAddedPromise(oTreeNode.componentId, sBindingPath, mAppStates).then(function(){
				var oRouterInput = fnGetRouterInput(oTreeNode, oCurrentIdentity.keys, mAppStates);
				oRet.fullLink = oNavigationControllerProxy.oRouter.getURL(oRouterInput.route, oRouterInput.parameters);
			});
			aAppStatePromises.push(oAppStatePromise);
			oRet.navigate = function(iDisplayMode){
				oTemplateContract.oBusyHelper.setBusy(oAppStatePromise.then(function(){
					var oNewIdentity = {
						treeNode: oTreeNode,
						keys: oCurrentIdentity.keys.slice(0, oTreeNode.level + 1),
						appStates: mAppStates
					};
					fnNavigateToIdentity(oNewIdentity, false, iDisplayMode);
				}));
			};
			oRet.adaptBreadCrumbLink = function(oLink){
				oAppStatePromise.then(function(){
					var sHash = oNavigationControllerProxy.oHashChanger.hrefForAppSpecificHash ? oNavigationControllerProxy.oHashChanger.hrefForAppSpecificHash(oRet.fullLink) : "#/" + oRet.fullLink;
					oLink.setHref(sHash);
				});
				// Abuse the breadcrumb link to get the text for the navigation menu
				var fnLinkToInfo = function(){
					setTextForTreeNode(oTreeNode, oLink.getText());
				};
				if (!oRet.bLinkAttached){ // in FCL scenarios links from several detail pages might register. Use only one
					oRet.bLinkAttached = true;
					var oTextBindingInfo = oLink.getBindingInfo("text") || {};
					oTextBindingInfo.events = {
						change: fnLinkToInfo
					};
				}
				var oCurrentBinding = oLink.getElementBinding();
				var sCurrentBindingPath = oCurrentBinding && oCurrentBinding.getPath();
				if (sCurrentBindingPath === sBindingPath){
					fnLinkToInfo();
				} else {
					oLink.bindElement({
						path: sBindingPath,
						canonicalRequest: !oTemplateContract.bCreateRequestsCanonical // either we or the framework must set the requests to be canonical
					});
				}
			};
			return oRet;
		}

		function fnLinkInfoToHierachyEntry(sCurrentIntent, oLinkInfo){
			var oRet = {
				title: oLinkInfo.treeNode.headerTitle || "",
				icon: oLinkInfo.treeNode.titleIconUrl || "",
				subtitle: oLinkInfo.treeNode.text,
				intent: sCurrentIntent + oLinkInfo.fullLink
			};
			return oRet;
		}

		function fnSetLinksToUpperLayer(){
			var aLinkInfo = [];
			var aAppStatePromises = [];
			var bIncludeSelfLink = oTemplateContract.oFlexibleColumnLayoutHandler && oTemplateContract.oFlexibleColumnLayoutHandler.hasNavigationMenuSelfLink(oCurrentIdentity);
			for (var oTreeNode = bIncludeSelfLink ? oCurrentIdentity.treeNode : oTemplateContract.mRoutingTree[oCurrentIdentity.treeNode.parentRoute]; oTreeNode; oTreeNode = oTemplateContract.mRoutingTree[oTreeNode.parentRoute]){
				var oLinkInfo = fnCreateLinkInfoForNode(oTreeNode, aAppStatePromises);
				aLinkInfo[oTreeNode.level] = oLinkInfo;
			}
			var oAllAppStatesPromise = Promise.all(aAppStatePromises);
			var sLocationHash = location.hash;
			var indexOfQM = sLocationHash.indexOf("?");
			var sDelimiter = (indexOfQM !== -1 && indexOfQM < sLocationHash.indexOf("&")) ? "?" : "&";
			var sCurrentIntent = sLocationHash.split(sDelimiter)[0] + "&/";
			var fnAdjustNavigationHierarchy = function(){
				oTemplateContract.oShellServicePromise.then(function(oShellService){
					oShellService.setHierarchy([]);
					oAllAppStatesPromise.then(function(){
						var aHierarchy = [];
						for (var i = aLinkInfo.length - 1; i >= 0; i--){
							aHierarchy.push(fnLinkInfoToHierachyEntry(sCurrentIntent, aLinkInfo[i]));
						}
						oShellService.setHierarchy(aHierarchy);
					});
				}).catch(function() {
					Log.warning("No ShellService available");
				});
			};
			oLinksToUpperLayer = {
				linkInfos: aLinkInfo,
				adjustNavigationHierarchy: fnAdjustNavigationHierarchy
			};
			fnAdjustNavigationHierarchy();
		}

		function getLinksToUpperLayers(){
			return oLinksToUpperLayer.linkInfos;
		}


		function fnFillCurrentIdentity(oEvent){
			var oPreviousIdentity = oCurrentIdentity;
			if (oRoutingOptions && oRoutingOptions.identity && !oRoutingOptions.followUpNeeded){
				oCurrentIdentity = oRoutingOptions.identity;
			} else {
				oCurrentIdentity = Object.create(null);
				var oRouteConfig = oEvent.getParameter("config");
				var sRoute = removeQueryInRouteName(oRouteConfig.name);
				oCurrentIdentity.treeNode = oTemplateContract.mRoutingTree[sRoute];
				var oArguments = oEvent.getParameter("arguments");
				oCurrentIdentity.appStates = oArguments["?query"] || Object.create(null);
				oCurrentIdentity.keys = [""];
				for (var oCurrentNode = oCurrentIdentity.treeNode; oCurrentNode.level > 0; oCurrentNode = oTemplateContract.mRoutingTree[oCurrentNode.parentRoute]){
					oCurrentIdentity.keys[oCurrentNode.level] = oCurrentNode.noKey ? "" : oArguments["keys" + oCurrentNode.level];
				}
			}
			oCurrentIdentity.previousIdentity = oPreviousIdentity;
			oCurrentIdentity.componentsDisplayed = Object.create(null);
			oCurrentIdentity.componentsDisplayed[oCurrentIdentity.treeNode.sRouteName] = 1;
			fnSetLinksToUpperLayer();
		}

		function fnNavigateByExchangingQueryParam(sQueryParam, vValue){
			var oOptions = {
				identity: {
					treeNode: oCurrentIdentity.treeNode,
					keys: oCurrentIdentity.keys,
					appStates: extend(Object.create(null), oCurrentIdentity.appStates)
				},
				mode: 1
			};
			if (Array.isArray(vValue) && vValue.length < 2){
				vValue = vValue[0];
			}
			if (vValue){
				oOptions.identity.appStates[sQueryParam] = vValue;
			} else {
				delete oOptions.identity.appStates[sQueryParam];
			}
			fnNavigateToRoute(oOptions);
		}

		var oSpecialDraftCancellationInfo;

		// This method navigates to the specified context. Thereby, the entity specified by this context must either belong to a root level entity set or its parent must be part of the
		// navigation hierarchy defined by the current identity.
		// optional parameters:
		// iDisplayMode: as described in fnNavigateToRoute
		// oContextInfo: an object as specified by class ContextBookkeeping. If this parameter specified a new create draft, then we consider the current identity as entry point for this draft.
		// This might be evaluated for back navigation when the corresponding draft is canceled.
		function fnNavigateToSubContext(oContext, bReplace, iDisplayMode, oContextInfo){
			if (!oContext){
				fnNavigateToRoot(bReplace);
				return;
			}
			var oTargetIdentityPromise = getTargetIdentityPromiseForContext(null, oContext, true, true);
			oTemplateContract.oBusyHelper.setBusy(oTargetIdentityPromise.then(function(oTargetIdentity){
				oTargetIdentity.appStates = Object.create(null);
				var oAppStatePromise;
				if (oTargetIdentity.treeNode.fCLLevel === 0 || oTargetIdentity.treeNode.fCLLevel === 3){
					var sBindingPath = fnDeterminePathForKeys(oTargetIdentity.treeNode, oTargetIdentity.keys);
					oAppStatePromise = getApplicableStateForComponentAddedPromise(oTargetIdentity.treeNode.componentId, sBindingPath, oTargetIdentity.appStates);
				} else {
					oAppStatePromise = oTemplateContract.oFlexibleColumnLayoutHandler.getAppStatesPromiseForNavigation(oCurrentIdentity, oTargetIdentity);
				}
				// if oContext represents a newly created create draft we store the current navigation state as the state to navigate to in case this draft will be cancelled.
				if (!bReplace && oContextInfo && oContextInfo.bIsCreate && oContextInfo.bIsDraft && !oContextInfo.bIsDraftModified){
					oSpecialDraftCancellationInfo = {
						index: aPreviousHashes.length,
						path: oContext.getPath(),
						identity: oTargetIdentity,
						displayMode: getCurrentDisplayMode()
					};
				}
				return oAppStatePromise.then(function(){
					fnNavigateToIdentity(oTargetIdentity, bReplace, iDisplayMode);
				});
			}));
		}

		function getSpecialDraftCancelPromise(oContext){
			if (!oSpecialDraftCancellationInfo || oSpecialDraftCancellationInfo.path !== oContext.getPath()){
				return null;
			}
			// check whether navigation was only below the draft which is cancelled
			var oTestHash;
			var fnDiffer = function(sKey, i){
				return sKey !== oTestHash.identity.keys[i];
			};
			for (var i = oSpecialDraftCancellationInfo.index + 1; i < aPreviousHashes.length; i++){
				oTestHash = aPreviousHashes[i]; // one navigation step in between
				if (oTestHash.identity.treeNode.level < oSpecialDraftCancellationInfo.identity.treeNode.level || oSpecialDraftCancellationInfo.identity.keys.some(fnDiffer)){
					return null; // this was a navigation step which was not a child of the cancelled draft
				}
			}
			var iSteps = 0; // the number of steps we need to go back to come to the original object
			for (var oHash = oCurrentHash; oHash.iHashChangeCount !== oSpecialDraftCancellationInfo.index; oHash = aPreviousHashes[oHash.backTarget]){
				if (oHash.iHashChangeCount < oSpecialDraftCancellationInfo.index){
					return null; // it is not possible to get back to the target object via back navigation
				}
				iSteps--;
			}
			var oIdentityBefore = aPreviousHashes[oSpecialDraftCancellationInfo.index].identity; // this is our target object, but the appStates may have changed
			var oTargetIdentity = {
				treeNode: oIdentityBefore.treeNode,
				keys: oIdentityBefore.keys,
				appStates: Object.create(null)
			};
			var fnRet = fnNavigateToRoute.bind(null, { // this function describes the desired navigation
				identity: oTargetIdentity,
				mode: iSteps,
				displayMode: oSpecialDraftCancellationInfo.displayMode
			});
			if (oIdentityBefore.treeNode.fCLLevel === 0 || oIdentityBefore.treeNode.fCLLevel === 3){
				extend(oTargetIdentity.appStates, oIdentityBefore.appStates);
				return Promise.resolve(fnRet);
			}
			return oTemplateContract.oFlexibleColumnLayoutHandler.getSpecialDraftCancelPromise(oCurrentIdentity, oIdentityBefore, oTargetIdentity.appStates).then(function(){
				return fnRet;
			});
		}

		// This method is called, when we switch from active to inactive or the other way around
		// oSiblingContext is the target context. It is assumed that we are currently displaying its sibling (and in FCL possibly descendants of that).
		// The method returns a Promise that resolves to a function that should be used for navigating to the sibling
		function getSwitchToSiblingPromise(oSiblingContext, iDisplayMode){
			var oTarget = routingHelper.determineNavigationPath(oSiblingContext);
			var oTargetIdentity = { // the identity to be used for navigation. Will be filled below
					keys: ["", oTarget.key],
					appStates: Object.create(null)
			};
			var fnRet = fnNavigateToIdentity.bind(null, oTargetIdentity, true, iDisplayMode); // The navigation function the Promise which is returned will resolve to
			if (oCurrentIdentity.treeNode.level === 1){ // no child pages open -> navigation is easy
				oTargetIdentity.treeNode = oCurrentIdentity.treeNode;
				extend(oTargetIdentity.appStates, oCurrentIdentity.appStates);
				return Promise.resolve(fnRet);
			}
			var aTreeNodes = getAncestorTreeNodePath(oCurrentIdentity.treeNode, 2); // an array of the nodes from level 2 on which are currently visible
			var aSiblingKeysPromises = aTreeNodes.map(function(oTreeNode){ // an array of Promises corresponding to aTreeNodes. The Promises resolve to the keys to be used for that tree node (resp true if no key is needed and undefined if the corresponding column needs to be closed)
				if (oTreeNode.noKey){
					return Promise.resolve(true);
				}
				if (!oTreeNode.isDraft){
					return Promise.resolve(oCurrentIdentity.keys[oTreeNode.level]);
				}
				var sContextPath = fnDeterminePathForKeys(oTreeNode, oCurrentIdentity.keys);
				var oSiblingPromise = oTemplateContract.oApplicationProxy.getSiblingPromise(sContextPath);
				return oSiblingPromise.then(function(oSiblingContext){
					oTarget = routingHelper.determineNavigationPath(oSiblingContext, oTreeNode.navigationProperty);
					return oTarget.key;
				}, Function.prototype);
			});
			var oAllSiblingKeysPromises = Promise.all(aSiblingKeysPromises);
			return oAllSiblingKeysPromises.then(function(aKeys){
				var oTargetNode = oTemplateContract.mEntityTree[oTarget.entitySet];
				for (var j = 0; aKeys[j]; j++){
					oTargetNode = aTreeNodes[j];
					oTargetIdentity.keys.push(oTargetNode.noKey ? "" : aKeys[j]);
				}
				oTargetIdentity.treeNode = oTargetNode;
				if (oTargetNode === oCurrentIdentity.treeNode){ // no columns need to be closed -> navigate by leaving appStates as is
					extend(oTargetIdentity.appStates, oCurrentIdentity.appStates);
					return fnRet;
				}
				var oAppStatePromise = oTemplateContract.oFlexibleColumnLayoutHandler.getAppStatesPromiseForColumnClose(oTargetNode, oTargetIdentity.appStates);
				return oAppStatePromise.then(function(){
					return fnRet;
				});
			});
		}

		function getIdentitiesEquivalentPromise(oHistoricIdentity, oNewIdentity){
			if ((oHistoricIdentity && oHistoricIdentity.treeNode) !== oNewIdentity.treeNode){
				return Promise.resolve(false);
			}
			if (oTemplateContract.oFlexibleColumnLayoutHandler && !oTemplateContract.oFlexibleColumnLayoutHandler.areIdentitiesLayoutEquivalent(oHistoricIdentity, oNewIdentity)){
				return Promise.resolve(false);
			}
			var bKeysEqual = true;
			var sCompareRoute = oHistoricIdentity.treeNode.sRouteName;
			for (var oCurrentNode = oHistoricIdentity.treeNode; oCurrentNode.level > 0; oCurrentNode = oTemplateContract.mRoutingTree[oCurrentNode.parentRoute]){
				var bKeyEqual = oCurrentNode.noKey || oHistoricIdentity.keys[oCurrentNode.level] === oNewIdentity.keys[oCurrentNode.level];
				if (!bKeyEqual && oCurrentNode.noOData){
					return Promise.resolve(false);
				}
				bKeysEqual = bKeysEqual && bKeyEqual;
				if (oCurrentNode.noOData){
					sCompareRoute = oCurrentNode.parentRoute;
				}
			}
			if (bKeysEqual){
				return Promise.resolve(true);
			}
			// If keys are not equal they may still define the same object in draft scenarios
			var oCompareNode = oTemplateContract.mRoutingTree[sCompareRoute];
			var aHistoricCompareKeys = oHistoricIdentity.keys.slice(0, oCompareNode.level + 1);
			var aNewCompareKeys = oNewIdentity.keys.slice(0, oCompareNode.level + 1);
			var sHistoricContextPath = fnDeterminePathForKeys(oCompareNode, aHistoricCompareKeys);
			var sNewContextPath = fnDeterminePathForKeys(oCompareNode, aNewCompareKeys);
			return oTemplateContract.oApplicationProxy.areTwoKnownPathesIdentical(sHistoricContextPath, sNewContextPath, oCompareNode.level === 1);
		}

		function fnNavigateToIdentity(oNewIdentity, bReplace, iDisplayMode){
			var oCandidateHash = aPreviousHashes[oCurrentHash.backTarget];
			var iCandidateCount = -1;
			if (oNewIdentity.treeNode.level === 0 || (oTemplateContract.oFlexibleColumnLayoutHandler && oNewIdentity.treeNode.fCLLevel === 0)){
				for (; oCandidateHash.backTarget > 0 && oCandidateHash.identity.treeNode.level > oNewIdentity.treeNode.level; iCandidateCount--){
					oCandidateHash = aPreviousHashes[oCandidateHash.backTarget];
				}
			}
			var oIdentitiesEquivalentPromise = getIdentitiesEquivalentPromise(oCandidateHash && oCandidateHash.identity, oNewIdentity);
			var oRet = oIdentitiesEquivalentPromise.then(function(bEquivalent){
				var iMode = bEquivalent ? iCandidateCount : (0 + !!bReplace);
				var oOptions = {
					identity: oNewIdentity,
					mode: iMode,
					displayMode: iDisplayMode
				};
				fnNavigateToRoute(oOptions);
			});
			oTemplateContract.oBusyHelper.setBusy(oRet);
			return oRet;
		}

		// This method returns a Promise that resolves to a partial identity for navigation. More precisely, the object the Promise resolves to contains properties treeNode and keys, but not appStates.
		// If it is not possible to determine this result the returned Promise is rejected.
		// oSourceNode is either the treeNode contained in oCurrentIdentity or one of its ancestors. If it is not provided the first case is assumed.
		// oNavigationContext is an instance of sap.ui.model.Context. It identifies the target instance of the navigation. More precisely, the entity set of the navigation context determines
		// the target tree node. The data of the context determine the last entry in the keys-array of the target. The preceeding entries in the keys-array still need to be derived from the current identity.
		// Therefore, the target tree node must be a child of oSourceNode or one of is ancestors.
		// Actually, bConsiderParentNodes specifies whether the ancestors of oSourceNode need to be considered, too.
		// If bWithNavProperty is true, then the entity set defined by oNavigationContext might not necessarily be identical to the entity set of the target node. It might be, that the entity set of the target node
		// only can be reached via a to 1-association from the entity set of oNavigationContext. However, in this case the corresponding navigation property must have been configured as property 'navigationProperty'
		// in the pages definition of the target node/page. Currently, this is only supported for the scenario that the target node has level 1.
		function getTargetIdentityPromiseForContext(oSourceNode, oNavigationContext, bWithNavProperty, bConsiderParentNodes){
			if (!oNavigationContext){ // special case that no navigation context is provided. Navigate to root page in this scenario.
				return bConsiderParentNodes ? Promise.resolve({
					treeNode: oTemplateContract.mRoutingTree["root"],
					keys: [""]
				}) : Promise.reject();
			}
			oSourceNode = oSourceNode || oCurrentIdentity.treeNode;
			var oNavigationInfo = routingHelper.determineNavigationPath(oNavigationContext);
			// First check whether the entitySet in oNavigationInfo directly specifies oSourceNode or one of its children as target node
			var oTargetTreeNode = (oSourceNode.level && oSourceNode.entitySet === oNavigationInfo.entitySet) ? oSourceNode : oSourceNode.children.indexOf(oNavigationInfo.entitySet) >= 0 && oTemplateContract.mEntityTree[oNavigationInfo.entitySet];
			if (oTargetTreeNode){ // if target node has already been identified keys can easily be adapted
				var aTargetKeys = oCurrentIdentity.keys.slice(0, oTargetTreeNode.level);
				aTargetKeys.push(oNavigationInfo.key);
				return Promise.resolve({
					treeNode: oTargetTreeNode,
					keys: aTargetKeys
				});
			}
			if (bWithNavProperty){ // Check for special logic described above. Any child node of oSourceNode which specifies a to 1 association from the entity set in oNavigationContext is considered as target
				var oModel = oTemplateContract.oAppComponent.getModel();
				var oMetaModel = oModel.getMetaModel();
				var oEntitySet = oMetaModel.getODataEntitySet(oNavigationInfo.entitySet);
				var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
				var sNavigationProperty; // will be set to the navigation property to be used in case there is one
				var bCanNavigateViaNavigationProperty = oSourceNode.children.some(function(sChildEntitySet){
					var oChildNode = oTemplateContract.mEntityTree[sChildEntitySet];
					sNavigationProperty = oChildNode.navigationProperty;
					if (!sNavigationProperty){
						return false;
					}
					var oNavigationProperty = oMetaModel.getODataAssociationEnd(oEntityType, sNavigationProperty);
					return !!oNavigationProperty && oNavigationProperty.multiplicity.endsWith("1");
				});
				if (bCanNavigateViaNavigationProperty){ // if a navigation property has been found
					return new Promise(function(fnResolve, fnReject){
						oModel.createBindingContext(sNavigationProperty, oNavigationContext, null, function(oTargetContext) { // translate the given navigation context into a navigation context fitting to the target node
							var oNavPromise = oTargetContext && getTargetIdentityPromiseForContext(oSourceNode, oTargetContext, false); // execute with the translated context
							if (oNavPromise){
								oNavPromise.then(fnResolve, fnReject);
							} else {
								fnReject();
							}
						});
					});
				}
			}
			if (bConsiderParentNodes && oSourceNode.level > 0){ // if no solution could be found yet recusrively try the same with the parent node
				var oParentNode = oTemplateContract.mRoutingTree[oSourceNode.parentRoute];
				return getTargetIdentityPromiseForContext(oParentNode, oNavigationContext, bWithNavProperty, true);
			}
			return Promise.reject();
		}

		// This function fills an appState promise for navigating to an ancestor or to a descendant of the current identity.
		// oTargetTreeNode the ancestor od descendant of the current identity
		// mAppStates: The map to be filled
		// aKeys: Only needed when navigating to a descendant. In this case it should be the keys of the target.
		// Returns a Promise that is resolved when mAppStates is filled.
		function getAppStatePromiseForUpDownNavigation(oTargetTreeNode, mAppStates, aKeys){
			if (oTargetTreeNode.fCLLevel === 0 || oTargetTreeNode.fCLLevel === 3){
				var sPath = aKeys && fnDeterminePathForKeys(oTargetTreeNode, aKeys);
				return getApplicableStateForComponentAddedPromise(oTargetTreeNode.componentId, sPath, mAppStates);
			}
			return oTemplateContract.oFlexibleColumnLayoutHandler[(oTargetTreeNode.level > oCurrentIdentity.treeNode.level) ? "getAppStatesPromiseForColumnOpen" : "getAppStatesPromiseForColumnClose"](oTargetTreeNode, mAppStates, aKeys);
		}

		// Perform the navigation after activation. oActiveContext might be faulty. In this case the navigation should take us to the root page.
		// Otherwise we should be taken to the active object page. All sub-object pages should be closed (sine it is currently not possible to keep them open reliably).
		function fnNavigateAfterActivation(oActiveContext){
			var oTargetIdentityPromise = getTargetIdentityPromiseForContext(oTemplateContract.mRoutingTree["root"], oActiveContext, false, true);
			oTemplateContract.oBusyHelper.setBusy(oTargetIdentityPromise.then(function(oTargetIdentity){
				oTargetIdentity.appStates = Object.create(null);
				var oOptions;
				if (oTargetIdentity.treeNode === oCurrentIdentity.treeNode){ // just reuse old appStates
					Object.assign(oTargetIdentity.appStates, oCurrentIdentity.appStates);
					oOptions = {
						identity: oTargetIdentity,
						mode: 1,
						displayMode: 1
					};
					fnNavigateToRoute(oOptions);
					return null;
				}
				// If we reach this point we know that the target node is different from the current node. There ar two possible scenarios for this:
				// 1. Close main object page according to manifest setting
				// 2. Close sub object page columns in FCL
				var oAppStatePromise = getAppStatePromiseForUpDownNavigation(oTargetIdentity.treeNode, oTargetIdentity.appStates);
				return oAppStatePromise.then(fnNavigateToIdentity.bind(null, oTargetIdentity, true, 1));
			}));
		}

		// Assumption: oCurrentIdentity represents a view level which is higher then the view level specified by iTargetViewLevel.
		// Now all entities which have higher level are deleted -> Navigate to the last parent which still exists.
		// Preferably this is done via back navigation. If this is not possible we leave the app via one more back step (if the app has been reached via cross app navigation) or we try a cleanup and do a replace navigation.
		function fnNavigateUpAfterDeletion(iTargetViewLevel){
			var oCandidateHash; // a previous hash that might be reached via back navigation
			var iCandidateCount = 0; // the number of back steps needed to reach oCandidateHash
			for (oCandidateHash = oCurrentHash; oCandidateHash.backTarget > 0 && (!oCandidateHash.identity || oCandidateHash.identity.treeNode.level > iTargetViewLevel); iCandidateCount++){
				oCandidateHash = aPreviousHashes[oCandidateHash.backTarget];
			}
			// Now oCandidateHash is the first entry in history which corresponds to a view level which is not higher themn the target level.
			// If such history entry does not exist oCandidateHash is the first entry in history.
			// For this second case there are two subcases: iCandidateCount === 0 <-> there is no history
			// oCandidateHash.identity.treeNode.level > iTargetViewLevel <-> The loop above was ended because we came to the end of the history without detecting an entry with the target level (or lower)
			// In both subcases we would like to go back to the previous app, if it exists which means if isInitialNavigation is false.
			if (!isInitialNavigation && (iCandidateCount === 0 || oCandidateHash.identity.treeNode.level > iTargetViewLevel)){
				window.history.go(-iCandidateCount - 1); // leave the app
				return;
			}
			var iMode = -iCandidateCount || 1; // The mode used for navigating to the target. If we found at least one step back we will do it. Otherwise we navigate via replace.
			// Now identify where we are going to navigate to
			var oTargetNode = getAncestralNode(iTargetViewLevel); // the target node to navigate to. This is just the ancestor of the current node having the target level.
			var oTargetIdentity = { // the identity we want to navigate to
				treeNode: oTargetNode,
				keys: oCurrentIdentity.keys.slice(0, oTargetNode.level + 1),
				appStates: Object.create(null) // still to be filled
			};
			// fill the app states
			var oNavigationPromise = getAppStatePromiseForUpDownNavigation(oTargetIdentity.treeNode, oTargetIdentity.appStates).then(function(){
				// appStates have been filled asynchronously.
				// Until now we have only identified the number of steps back which lead to the given target tree level. However, there might be navigation steps which
				// have stayed on the target level but only changed the FCL layout (fullscreen versus multi-column). In this case we go back until we either
				// come to a layout which is equivalent to the target layout or we would leave the target tree node.
				if (iMode < 0 && (oTargetIdentity.treeNode.fCLLevel === 1 || oTargetIdentity.treeNode.fCLLevel === 2) && oCandidateHash.identity.treeNode === oTargetIdentity.treeNode){
					for (; oCandidateHash.backTarget > 0 && !oTemplateContract.oFlexibleColumnLayoutHandler.areIdentitiesLayoutEquivalent(oCandidateHash.identity, oTargetIdentity); iMode--){
						oCandidateHash = aPreviousHashes[oCandidateHash.backTarget];
						if (oCandidateHash.identity.treeNode !== oTargetIdentity.treeNode){
							break;
						}
					}
				}
				var oOptions = {
					identity: oTargetIdentity,
					mode: iMode,
					displayMode: oTargetIdentity.treeNode.isDraft ? 6 : 1
				};
				fnNavigateToRoute(oOptions);
			});
			oTemplateContract.oBusyHelper.setBusy(oNavigationPromise);
		}

		function getCurrentDisplayMode(){
			var oCurrentRegistryEntry = oTemplateContract.componentRegistry[oCurrentIdentity.treeNode.componentId];
			var oTemplatePrivateModel = oCurrentRegistryEntry.utils.getTemplatePrivateModel();
			var iDisplayMode = oTemplatePrivateModel.getProperty("/objectPage/displayMode") || 0;
			return iDisplayMode;
		}

		function fnNavigateToChildNode(oTargetTreeNode, bWithKey, sKey, bReplace, iDisplayMode){
			var aKeys = oCurrentIdentity.keys.slice(0, oTargetTreeNode.level);
			aKeys.push(bWithKey ? sKey : "");
			var mAppStates = Object.create(null);
			var oAppStatePromise = getAppStatePromiseForUpDownNavigation(oTargetTreeNode, mAppStates, aKeys);
			oTemplateContract.oBusyHelper.setBusy(oAppStatePromise.then(function(){
				var oIdentity = {
					treeNode: oTargetTreeNode,
					keys: aKeys,
					appStates: mAppStates
				};
				fnNavigateToIdentity(oIdentity, bReplace, iDisplayMode);
			}));
		}

		// This method allows to navigate to a child from a given tree node
		// - oTreeNode: The node from which the navigation starts. It must beidentical or an ancestor of oCurrentIdentity.treeNode
		// - sChildSpec: the (logical) navigation property which leads from oTreeNode to the target
		//   More precisely: If the target has been defined with a routingSpec sChildSpec should be the route name defined within this routingSpec
		//   Otherwise:
		//   * if oTreeNode is the root sChildSpec should be the target entity set
		//   * if oTreeNode is not the root sChildSpec should be the navigationProperty from the current identity to the child
		// - sEmbedded: if this is truthy the navigation is trigered by an embedded component which is specified by this key.
		//   In this case the children specified within this embedded component are also considered
		// - sKey: The additional key which is needed for the new hierarchy level (if the new level requires a key)
		// - bReplace: If this is truthy the navigation is done as a replace navigation
		function fnNavigateToChild(oTreeNode, sChildSpec, sEmbedded, sKey, bReplace){
			var sRouteName;
			var bWithKey = true;
			for (var i = 0; i < oTreeNode.children.length && !sRouteName; i++){
				var sChild = oTreeNode.children[i];
				var oChildNode = oTemplateContract.mEntityTree[sChild];
				if (oChildNode[oTreeNode.level ? "navigationProperty" : "sRouteName"] === sChildSpec){
					sRouteName = oChildNode.sRouteName;
					bWithKey = !oChildNode.noKey;
				}
			}
			var oEmbeddedComponent = !sRouteName && sEmbedded && oTreeNode.embeddedComponents[sEmbedded];
			if (oEmbeddedComponent){
				for (var j = 0; j < oEmbeddedComponent.pages.length && !sRouteName; j++){
					var oPage = oEmbeddedComponent.pages[j];
					if (oPage.navigationProperty === sChildSpec){
						sRouteName = oTreeNode.sRouteName + "/" + sEmbedded + "/" + sChildSpec;
						bWithKey = !(oPage.routingSpec && oPage.routingSpec.noKey);
					}
				}
			}
			if (sRouteName){
				var oTargetTreeNode = oTemplateContract.mRoutingTree[sRouteName];
				fnNavigateToChildNode(oTargetTreeNode, bWithKey, sKey, bReplace, getCurrentDisplayMode());
			}
		}

		// iReplaceMode: 1 -> bReplace = true, -1 -> bReplace = false, 0 -> determine according to current FCL state
		//
		function fnNavigateFromNodeAccordingToContext(oSourceNode, oNavigationContext, iDisplayMode, iReplaceMode){
			var oTargetIdentityPromise = getTargetIdentityPromiseForContext(oSourceNode, oNavigationContext, true, false);
			oTemplateContract.oBusyHelper.setBusy(oTargetIdentityPromise.then(function(oTargetIdentity){
				var bReplace = iReplaceMode ? iReplaceMode > 0 :  !!oTemplateContract.oFlexibleColumnLayoutHandler && !oTemplateContract.oFlexibleColumnLayoutHandler.isNewHistoryEntryRequired(oSourceNode);
				oTargetIdentity.appStates = Object.create(null);
				var oAppStatePromise = getAppStatePromiseForUpDownNavigation(oTargetIdentity.treeNode, oTargetIdentity.appStates, oTargetIdentity.keys);
				return oAppStatePromise.then(fnNavigateToIdentity.bind(null, oTargetIdentity, bReplace, iDisplayMode));
			}));
		}

		// returns the information whether the app has started a navigation which is not yet finished.
		// Note: Only navigation using the fnNavigateToRoute option will be considered
		function isNavigating(){
			return !!oRoutingOptions;
		}

		function fnNavigateBack(iSteps){
			Log.info("Navigate back");
			if (oCurrentHash.backTarget && fnNormalizeHash(oHistory.getPreviousHash() || "") !== fnNormalizeHash(oCurrentHash.hash)){
				oTemplateContract.oBusyHelper.setBusyReason("HashChange", true);
			}
			// If oCurrentHash contains a forwardingInfo this back navigation is part of a complex back navigation.
			// In this case oCurrentHash already represents the target hash (which was created when the complex navigation started).
			// Otherwise oCurrentHash still represents the source hash. In this case we notify that the hash was left via back navigation.
			oCurrentHash.LeaveByBack = !oCurrentHash.forwardingInfo;
			if (oCurrentHash.LeaveByBack){
				oCurrentHash.backSteps = iSteps;
			}
			window.history.go(-iSteps);
		}

		/*
		 * Sets/Replaces the hash via the router/hash changer
		 * @param {string} sHash - the hash string
		 * @param {boolean} bReplace - whether the hash should be replaced
		 * @param {boolean} bKeepVariantId - keep variant id in URL (save/edit/cancel case)
		 */
		function fnNavigate(sHash, bReplace, iTargetLevel, bKeepVariantId) {
			var bObjectPageDynamicHeaderTitleWithVM = oTemplateContract.oAppComponent.getObjectPageHeaderType() === "Dynamic" && oTemplateContract.oAppComponent.getObjectPageVariantManagement() === "VendorLayer";
			var bVendorLayer;
			var oUriParameters = new UriParameters(window.location.href);
			if (oUriParameters.mParams["sap-ui-layer"]) {
				var aUiLayer = oUriParameters.mParams["sap-ui-layer"];
				for (var i = 0; i < aUiLayer.length; i++) {
					if (aUiLayer[i].toUpperCase() === "VENDOR") {
						bVendorLayer = true;
						break;
					}
				}
			}
			sHash = fnNormalizeHash(sHash || "");
			Log.info("Navigate to hash: " + sHash);
			if (sHash === oCurrentHash.hash){
				Log.info("Navigation suppressed since hash is the current hash");
				return; // ignore navigation that does nothing
			}
			oCurrentHash.targetHash = sHash;
			if (oCurrentHash.backTarget && fnNormalizeHash(oHistory.getPreviousHash() || "") === sHash){
				fnNavigateBack(1);
				return;
			}
			if (oCurrentHash.oEvent) {
				var iCurrentLevel = oCurrentHash.oEvent.getParameter("config").viewLevel;
			}
			if (bObjectPageDynamicHeaderTitleWithVM && bVendorLayer) {
				if (!bKeepVariantId) {
					if (!oTemplateContract.oFlexibleColumnLayoutHandler) {
						ControlPersonalizationAPI.clearVariantParameterInURL();
					} else {
						if (iCurrentLevel >= iTargetLevel) {
							if (iTargetLevel === 1) {
								ControlPersonalizationAPI.clearVariantParameterInURL();
							} else if (iTargetLevel === 2) {
								var oRegistryEntry;
								for ( var sComponentId in oTemplateContract.componentRegistry) {
									if (oTemplateContract.componentRegistry[sComponentId].viewLevel === 2) {
										oRegistryEntry = oTemplateContract.componentRegistry[sComponentId];
										break;
									}
								}
								var oSubObjectPageVariantManagementControl = oRegistryEntry.oController.byId("template::ObjectPage::ObjectPageVariant");
								ControlPersonalizationAPI.clearVariantParameterInURL(oSubObjectPageVariantManagementControl);
							}
						}
					}
				}
			}
			oTemplateContract.oBusyHelper.setBusyReason("HashChange", true);
			oCurrentHash.LeaveByReplace = bReplace;
			if (bReplace) {
				oNavigationControllerProxy.oHashChanger.replaceHash(sHash);
			} else {
				oNavigationControllerProxy.oHashChanger.setHash(sHash);
			}
		}

		function fnNavigateToParStringPromise(sPath, oParStringPromise, iTargetLevel, bReplace, oBackwardingInfo, bKeepVariantId){
			var oRet = oParStringPromise.then(function(sPars){
				sPath = fnConcatPathAndPars(sPath, sPars);
				if (oBackwardingInfo){
					oCurrentHash.backwardingInfo = {
						count: oBackwardingInfo.count,
						index: oBackwardingInfo.index,
						targetHash: fnNormalizeHash(sPath)
					};
					fnNavigateBack(oBackwardingInfo.count);
				} else {
					fnNavigate(sPath, bReplace, iTargetLevel, bKeepVariantId);
				}
				return sPath;
			});
			oTemplateContract.oBusyHelper.setBusy(oRet);
			return oRet;
		}

		// Returns information about the number of steps back that needs to be performed to back to viewLevel = 0 (the root)
		// In case there is no ViewLevel 0 object, method will behave based on the bIncludeAncestorComponent argument. If this
		// param is passed as true method will return backward navigation with number of back steps needed for navigating to a
		// complete different object in history or backward navigation will contain the number of steps one have to perform to
		// go out of this app which ideally should be the ancestor component/page.
		// @Param {boolean} bIncludeAncestorComponent - If true indicates that caller is interested in
		// 		finding the RootComponent or the ancestor component/page before launching the Root Object Page
		// @Param {string} sHashToSkip - Hash of the object whose ancestor component (which was not the object with this hash or its
		// sub objects of the same)	needs to be found
		// @Return {JSON} - Return object with backward information.
		// 		count - Number of back steps needed
		// 		index - Index in aPreviousHashes pointing to the corresponding target step
		// 		routeName - In case the object is found in the aPreviousHases. In case component is started by cross app, value will be undefined
		// 	Return value will be null if there is no View Level 0 Component in the aPreviousHash array, if called with
		// argument bIncludeAncestorComponent false
		function getBackToRootInfo(bIncludeAncestorComponent, sHashToSkip){
			var iCount, index, oBackwardingInfo, oHash, oConfig, iViewLevel;
			iCount = 0;
			index = oCurrentHash.iHashChangeCount;
			oBackwardingInfo = null;
			for (oHash = oCurrentHash; oHash.oEvent; iCount++){
				oConfig = oHash.oEvent.getParameter("config");
				iViewLevel = oConfig ? oConfig.viewLevel : -1;
				// In case the Navigation to detail page has come from LR/ALP method will find one of the back target
				// is View Level zero object and returns the BackNavigationInfo. one instance of View Level 1 detail page (SalesOrder 512)
				// could have been also launched by another instance of View Level 1 detail page (Sales Order 634). In such a case
				// the oHash.hash will not start with sHashToSkip and whenever such a case is found (means when SO 634 is found in history)
				// and the method is called with bIncludeAncestorComponent true, returns the current information as BackNavigationInfo
				if (iViewLevel === 0 || (bIncludeAncestorComponent && fnNormalizeHash(oHash.hash).indexOf(sHashToSkip) !== 0)) {
					oBackwardingInfo = {
						count: iCount,
						index: index,
						routeName: oConfig ? oConfig.name : undefined
					};
					break;
				}

				if (oHash.backTarget === 0){
					// The aPreviousHash array has been parsed and view component at level 0 or an ancestor is not found.
					// Check whether method is called with bIncludeAncestorComponent true, then return the backward count
					// as one more than the current which should load the previous url used by the browser.
					if (bIncludeAncestorComponent) {
						oBackwardingInfo = {
							count: iCount + 1,
							index: index,
							routeName: undefined
						};
					}
					break;
				}

				index = oHash.backTarget;
				oHash = aPreviousHashes[index];
			}

			return oBackwardingInfo;
		}

		// Returns information whether the specified navigation should be performed by one or more back navigations.
		// If this is not the case a faulty object is returned.
		// Otherwise an object is returned which contains two attributes:
		// count: number of back steps needed
		// index: index in aPreviousHashes pointing to the corresponding target step
		function fnGetBackwardingInfoForTarget(bReplace, sPath, iTargetLevel){
			if (iTargetLevel === 0){
				return getBackToRootInfo();
			}
			var oPreviousHash = aPreviousHashes[oCurrentHash.backTarget];
			return oPreviousHash && oPreviousHash.hash && fnNormalizeHash(oPreviousHash.hash.split("?")[0]) === fnNormalizeHash(sPath) && {
				count: 1,
				index: oCurrentHash.backTarget
			};
		}

		// Navigates to the root page. Thereby it restores the iappstate the root page was left (if we have already been there)
		function fnNavigateToRoot(bReplace) {
			if (oCurrentIdentity.treeNode.level === 0){
				return;
			}
			var oTargetIdentity = {
				treeNode: oTemplateContract.mRoutingTree["root"],
				keys: [""],
				appStates: Object.create(null)
			};
			var oAppStatePromise = oTemplateContract.oFlexibleColumnLayoutHandler ? oTemplateContract.oFlexibleColumnLayoutHandler.getAppStatesPromiseForColumnClose(oTargetIdentity.treeNode, oTargetIdentity.appStates) : fnAddUrlParameterInfoForRoute("root", oTargetIdentity.appStates);
			oAppStatePromise.then(fnNavigateToIdentity.bind(null, oTargetIdentity, bReplace));
			oTemplateContract.oBusyHelper.setBusy(oAppStatePromise);
		}

		function getTargetComponentPromises(oTarget){
			var sRouteName = oTemplateContract.mEntityTree[oTarget.entitySet].sRouteName;
			var oComponentPromise = oTemplateContract.mRouteToTemplateComponentPromise[sRouteName];
			return [oComponentPromise];
		}

		// This method is called before a navigation to a context is executed.
		// aTargetComponentPromises is an array of Promises. Each of these Promises will be resolved to a component which will be displayed in the target of the navigation.
		// If this component provides method presetDisplayMode this method will be called in order to preset the given displayMode for this component as early as possible.
		function fnPresetDisplayMode(aTargetComponentPromises, iDisplayMode){
			var mComponentsDisplayed = oCurrentHash.componentsDisplayed; // store the reference. fnPreset will be called asynchronously. At that point in time oCurrentHash might already represent the new logical navigation step
			var fnPreset = function(oComponent){
				var oRegistryEntry = oTemplateContract.componentRegistry[oComponent.getId()];
				(oRegistryEntry.methods.presetDisplayMode || Function.prototype)(iDisplayMode, mComponentsDisplayed[oRegistryEntry.route] === 1);
			};
			for (var i = 0; i < aTargetComponentPromises.length; i++){
				var oTargetPromise = aTargetComponentPromises[i];
				oTargetPromise.then(fnPreset);
			}
		}

		function getTargetLevel(oTarget) {
			var oTargetTreeNode = oTarget && oTemplateContract.mEntityTree[oTarget.entitySet];
			var iTargetLevel = oTargetTreeNode ? oTargetTreeNode.level : 1;
			return iTargetLevel;
		}


		function fnAddSuffixToCurrentHash(sSuffix, iViewLevel){
			var aParts = oTemplateContract.oApplicationProxy.getHierarchySectionsFromCurrentHash();
			var sRet = sSuffix;
			for (var i = iViewLevel - 2; i >= 0; i--){
				sRet = aParts[i] + "/" + sRet;
			}
			return "/" + sRet;
		}

		function fnNavigateToPath(sRoute, sPath, iTargetLevel, bReplace, bKeepVariantId){
			var oAppStates = {};
			var oFCLPromise = oTemplateContract.oFlexibleColumnLayoutHandler && oTemplateContract.oFlexibleColumnLayoutHandler.getFCLAppStatesPromise(sRoute, oAppStates);
			var oTargetPromise = fnAddUrlParameterInfoForRoute(sRoute, oAppStates, sPath);
			var oParStringPromise = (oFCLPromise ? Promise.all([oFCLPromise, oTargetPromise]) : oTargetPromise).then(fnAppStates2ParString.bind(null, oAppStates));
			var oBackwardingInfo = fnGetBackwardingInfoForTarget(bReplace, sPath, iTargetLevel);
			var oNavigationPromise = fnNavigateToParStringPromise(sPath, oParStringPromise, iTargetLevel, bReplace, oBackwardingInfo, bKeepVariantId);
			oTemplateContract.oBusyHelper.setBusy(oNavigationPromise);
			return oNavigationPromise;
		}

		// vTargetContext is either a string or an object. Only in the second case sNavigationProperty may be used.
		function fnNavigateToContextImpl(vTargetContext, sNavigationProperty, bReplace, iDisplayMode, oQuery, bKeepVariantId) {
			var sPath;
			var iTargetLevel, sRoute, aParts;
			var aTargetComponentPromises = [];
			if (typeof vTargetContext === "string"){
				sPath = vTargetContext;
				var sNormalizedPath = fnNormalizeHash(sPath);
				if (sNormalizedPath === "/"){
					iTargetLevel = 0;
				} else {
					aParts = sNormalizedPath.split("/");
					iTargetLevel = aParts.length - 1;
				}
				switch (iTargetLevel){
					case 0: sRoute = "root";
						break;
					case 1: sRoute = aParts[1].split("(")[0];
						break;
					default:
						sRoute = "";
						var sSlash = "";
						for (var i = 0; i < iTargetLevel; i++){
							var sPart = aParts[i + 1];
							var iIndex = sPart.indexOf("(");
							if (iIndex > 0){
								sPart = sPart.substring(0, iIndex);
							}
							sRoute = sRoute + sSlash + sPart;
							sSlash = "/";
						}
						sRoute = sRoute.replace("---", "/"); // for embedded components
				}
			} else {
			// get the navigation path from binding context
				var oTarget = routingHelper.determineNavigationPath(vTargetContext, sNavigationProperty);
				iTargetLevel = getTargetLevel(oTarget);
				sPath = oTarget.path;
				aTargetComponentPromises = getTargetComponentPromises(oTarget);
				sRoute = oTemplateContract.mEntityTree[oTarget.entitySet].sRouteName;
			}
			if (sNavigationProperty) {
				sPath = fnAddSuffixToCurrentHash(sPath, iTargetLevel);
			}
			fnPresetDisplayMode(aTargetComponentPromises, iDisplayMode || 0);
			// navigate to context
			if (oQuery){
				sPath = fnConcatPathAndAppStates(sPath, oQuery);
				fnNavigate(sPath, bReplace, iTargetLevel ,bKeepVariantId);
				return Promise.resolve(sPath);
			} else {
				return fnNavigateToPath(sRoute, sPath, iTargetLevel, bReplace, bKeepVariantId);
			}
		}

		function fnNavigateToContext(vTargetContext, sNavigationProperty, bReplace, iDisplayMode, bKeepVariantId) {
			return fnNavigateToContextImpl(vTargetContext, sNavigationProperty, bReplace, iDisplayMode, undefined, bKeepVariantId);
		}

		function setVisibilityOfRoute(sRoute, iVisibility){
			oCurrentHash.componentsDisplayed[sRoute] = iVisibility;
			var oTreeNode = oTemplateContract.mRoutingTree[sRoute];
			var sComponentId = oTreeNode.componentId;
			if (sComponentId){
				var oRegistryEntry = oTemplateContract.componentRegistry[sComponentId];
				var oTemplatePrivateModel = oRegistryEntry.utils.getTemplatePrivateModel();
				oTemplatePrivateModel.setProperty("/generic/isActive", iVisibility === 1);
			}
		}

		function fnTransferMessageParametersToGlobalModelAndDisplayMessage(mParameters) {
			var sEntitySet, sText, oEntitySet, oEntityType, oHeaderInfo, sIcon = null,
				oMetaModel, sDescription;
			if (mParameters) {
				sEntitySet = mParameters.entitySet;
				sText = mParameters.text;
				sIcon = mParameters.icon;
				sDescription = mParameters.description;
			}

			if (sEntitySet) {
				oMetaModel = oTemplateContract.oAppComponent.getModel().getMetaModel();
				if (oMetaModel) {
					oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
					oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
					oHeaderInfo = oEntityType["com.sap.vocabularies.UI.v1.HeaderInfo"];
				}
				if (oHeaderInfo && oHeaderInfo.TypeImageUrl && oHeaderInfo.TypeImageUrl.String) {
					sIcon = oHeaderInfo.TypeImageUrl.String;
				}
			}

			oTemplateContract.oTemplatePrivateGlobalModel.setProperty("/generic/messagePage", {
				text: sText,
				icon: sIcon,
				description: sDescription
			});

			if (oTemplateContract.oFlexibleColumnLayoutHandler){
				oTemplateContract.oFlexibleColumnLayoutHandler.displayMessagePage(mParameters, oCurrentHash.componentsDisplayed);
			} else {
				var oTargets = oNavigationControllerProxy.oRouter.getTargets();
				oTargets.display("messagePage");
				for (var sRoute in oCurrentHash.componentsDisplayed){ // there should only be one match
					setVisibilityOfRoute(sRoute, 5); // mark the component as being replaced by an error page
				}
			}
			fnAfterActivationImpl(mParameters);
		}

		function fnShowStoredMessage(){
			if (!isEmptyObject(mMessagePageParams)){
				var mParameters = null;
				for (var i = 0; !mParameters; i++){
					mParameters = mMessagePageParams[i];
				}
				mMessagePageParams = {};
				fnTransferMessageParametersToGlobalModelAndDisplayMessage(mParameters);
			}
		}

		function fnNavigateToMessagePage(mParameters) {
			if (oNavigationControllerProxy.oTemplateContract.oFlexibleColumnLayoutHandler){
				mParameters.viewLevel = mParameters.viewLevel || 0;
				mMessagePageParams[mParameters.viewLevel] = mParameters;
				var oLoadedFinishedPromise = Promise.all([oActivationPromise, oNavigationControllerProxy.oTemplateContract.oPagesDataLoadedObserver.getProcessFinished(true)]);
				oLoadedFinishedPromise.then(fnShowStoredMessage);
				oLoadedFinishedPromise.then(oTemplateContract.oBusyHelper.setBusyReason.bind(null, "HashChange", false));
				return;
			}
			fnTransferMessageParametersToGlobalModelAndDisplayMessage(mParameters);
			oTemplateContract.oBusyHelper.setBusyReason("HashChange", false);
		}

		// End: Navigation methods

		function getActiveComponents(){
			var aRet = [];
			var mCompentsDisplayed = oCurrentIdentity.componentsDisplayed || oCurrentHash.componentsDisplayed;
			for (var sComponentId in oTemplateContract.componentRegistry){
				var oRegistryEntry = oTemplateContract.componentRegistry[sComponentId];
				if (mCompentsDisplayed[oRegistryEntry.route] === 1){ // component is currently active
					aRet.push(sComponentId);
				}
			}
			return aRet;
		}

		function getAllComponents() {
			var aRet = [];
			for (var sComponentId in oTemplateContract.componentRegistry){
				aRet.push(sComponentId);
			}
			return aRet;
		}

		function getCurrentKeys(iViewLevel){
			return oCurrentIdentity.keys.slice(0, iViewLevel + 1);
		}

		function getCurrentHash(iToLevel){
			var sRet = "";
			var sHash = oCurrentHash.hash;
			var aParts = sHash.split("/");
			var sDelim = "";
			for (var i = 0; i <= iToLevel; i++){
				sRet = sRet + sDelim + aParts[i];
				sDelim = "/";
			}
			return sRet;
		}

		function getActivationInfo(){
			return oCurrentHash;
		}


		// get the ancestral node of the current node with the given level
		function getAncestralNode(iTargetLevel){
			var oRet = oCurrentIdentity.treeNode;
			for (; oRet.level > iTargetLevel;){
				oRet = oTemplateContract.mRoutingTree[oRet.parentRoute];
			}
			return oRet;
		}

		// Start: Handling url-changes

		/*
		 * calls onActivate on the specified view, if it exists
		 * @param {Object} oView - the view
		 * @param {string} sPath - the path in the model
		 * @param {boolean} bDelayedActivate - optional boolean flag, true if activate is (re-)triggered delayed
		 */
		function fnActivateOneComponent(sPath, oActivationInfo, oComponent) {
			var sComponentId = oComponent.getId();
			var oRegistryEntry = oTemplateContract.componentRegistry[sComponentId];
			var sRoute = oRegistryEntry.route;
			var iCurrentActivity = oActivationInfo.componentsDisplayed[sRoute];
			var bIsComponentCurrentlyActive = iCurrentActivity === 1;
			oCurrentHash.componentsDisplayed[sRoute] = 1;
			// trigger onActivate on the component instance
			// if Component is assembled without TemplateAssembler it could be that oComponent.onActivate is undefined
			// e.g. an application has an own implementation of Component
			// however, we do not consider this as a relevant case anymore - just keeping the comment in case any app breaks here
			var oRet = oComponent.onActivate(sPath, bIsComponentCurrentlyActive) || Promise.resolve();
			return Promise.all([oRet, oRegistryEntry.viewRegistered]).then(function(){
				oRegistryEntry.aKeys = getCurrentKeys(oRegistryEntry.viewLevel);
			});
		}

		/*
		 * calls onActivate on the specified view, if it exists. Only used in the Non-FCL case
		 * @param {Object} oView - the view
		 * @param {string} sPath - the path in the model
		 * @param {boolean} bDelayedActivate - optional boolean flag, true if activate is (re-)triggered delayed
		 */
		function fnActivateComponent(sPath, oActivationInfo, oComponent) {
			return fnActivateOneComponent(sPath, oActivationInfo, oComponent).then(fnAfterActivation);
		}

		function fnAdaptPaginatorInfoAfterNavigation(oTreeNode, bIsProgrammatic, bIsBack){
			var oNewPaginatorInfo = {};
			if (bIsProgrammatic || bIsBack){
				var iViewLevel = oTreeNode.level;
				for (var iLevel = 0; iLevel < iViewLevel; iLevel++){
					oNewPaginatorInfo[iLevel] = oTemplateContract.oPaginatorInfo[iLevel];
				}
			}
			oTemplateContract.oPaginatorInfo = oNewPaginatorInfo;
		}

		function fnGetAlternativeContextPromise(sPath){
			return oTemplateContract.oApplicationProxy.getAlternativeContextPromise(sPath);
		}

		function fnHandleBeforeRouteMatched(oEvent){
			fnFillCurrentIdentity(oEvent);
			oCurrentIdentity.preset = true;
			if (oTemplateContract.oFlexibleColumnLayoutHandler){
				oTemplateContract.oFlexibleColumnLayoutHandler.handleBeforeRouteMatched(oCurrentIdentity);
			}
		}

		// This handler is registered at the route matched event of the router. It is thus called whenever the url changes within the App (if the new url is legal)
		function fnHandleRouteMatchedImpl(oEvent) {
			if (oRoutingOptions && oRoutingOptions.followUpNeeded && oRoutingOptions.identity && !isIdentityReached(oRoutingOptions.identity)){
				fnNavigateToRoute(); // execute the follow-up navigation
				return;
			}
			oTemplateContract.oBusyHelper.setBusyReason("HashChange", false);
			var iViewLevel = oCurrentIdentity.treeNode.level;
			var sHash = fnNormalizeHash(oNavigationControllerProxy.oHashChanger.getHash() || "");
			Log.info("Route matched with hash " + sHash);
			var oPreviousHash; // will be oCurrentHash soon
			if (oCurrentHash.backwardingInfo){   // then this is the back step of a 'complex back navigation'
				// Store oCurrentHash in aPreviousHashes and create a new instance of oCurrentHash for the newly started logical navigation step
				oPreviousHash = oCurrentHash;
				oPreviousHash.identity = oCurrentIdentity.previousIdentity;
				delete oCurrentIdentity.previousIdentity;
				aPreviousHashes.push(oPreviousHash);
				var iNewHashChangeCount = oPreviousHash.iHashChangeCount + 1;
				oCurrentHash = {
					iHashChangeCount: iNewHashChangeCount,
					forwardingInfo: {
						bIsProgrammatic: true,
						bIsBack: true,
						iHashChangeCount: iNewHashChangeCount,
						targetHash: oPreviousHash.backwardingInfo.targetHash,
						componentsDisplayed: oPreviousHash.componentsDisplayed
					},
					backTarget: aPreviousHashes[oPreviousHash.backwardingInfo.index].backTarget,
					componentsDisplayed: Object.create(null)
				};
			}
			if (oCurrentHash.forwardingInfo && oCurrentHash.forwardingInfo.targetHash && oCurrentHash.forwardingInfo.targetHash !== sHash){ // This can be either, because we are processing a follow-up of a complex back navigation or we are processing a follow-up navigation to an alternative context
				oCurrentHash.hash = sHash;
				var sTargetHash = oCurrentHash.forwardingInfo.targetHash;
				delete oCurrentHash.forwardingInfo.targetHash; // the targetHash will be reached with next physical navigation step -> remove the property
				fnNavigate(sTargetHash, true);
				return; // fnHandleRouteMatched will be called with the new url, so leave further processing to that call
			}
			// State changers may identify the hash change as something which can be handled by them internally. In this case we do not need to run the whole mechanism.
			// Since isStateChange is allowed to have side-effects we call all StateChangers.
			var bIsStateChange = false;
			for (var i = 0; i < oTemplateContract.aStateChangers.length; i++){
				var oStateChanger = oTemplateContract.aStateChangers[i];
				if (oStateChanger.isStateChange(oCurrentIdentity.appStates)){
					bIsStateChange = true;
				}
			}

			if (bIsStateChange){
				oRoutingOptions = null;
				oCurrentHash.hash = sHash;
				return;
			}
			// When we come here, then we can be sure that:
			// - if oCurrentHash contains a forwardingInfo, we have reached the targetHash
			// - the url-change was not triggered by a state changer.
			// At this point in time oCurrentHash may still represent the previous logical navigation step or already represent the current logical navigation step.
			// These two scenarios can be distinguished via property forwardingInfo of oCurrentHash. If this property is faulty the first option applies.
			oTemplateContract.oTemplatePrivateGlobalModel.setProperty("/generic/routeLevel", iViewLevel);
			// oActivationInfo is an object that will be passed to helper functions that deal with follow-up activities.
			// It contains the following properties:
			// - iHashChangeCount the current hashChangeCount
			// - bIsProgrammatic  information whether the logical navigation was triggered programmatically
			// - bIsBack          information whether the logical navigation step was reached by backward navigation
			// - componentsDisplayed: Map that contains information about the components currently displayed (see oCurrentHash)
			var oActivationInfo = oCurrentHash.forwardingInfo; // If there is a forwardingInfo it already provides the required properties
			delete oCurrentHash.forwardingInfo;
			if (!oActivationInfo){ // then we have to create oActivationInfo AND a new instance for oCurrentHash
				oActivationInfo = {
					componentsDisplayed: oCurrentHash.componentsDisplayed
				};
				var iPreviousHashChangeCount = oCurrentHash.iHashChangeCount;
				oActivationInfo.iHashChangeCount = iPreviousHashChangeCount + 1;
				var sDirection = oHistory.getDirection();
				if (oRoutingOptions){
					oActivationInfo.bIsProgrammatic = !!oRoutingOptions.identity;
					oActivationInfo.bIsBack = oRoutingOptions.mode < 0;
					if (oActivationInfo.bIsBack){
						oCurrentHash.backSteps = 0 - oRoutingOptions.mode;
					}
					oActivationInfo.bIsForward = !oActivationInfo.bIsBack && (sDirection === HistoryDirection.Forwards);
					oCurrentHash.LeaveByReplace = oRoutingOptions.mode === 1;
				} else {
					oActivationInfo.bIsProgrammatic = (sHash === oCurrentHash.targetHash);
					oActivationInfo.bIsBack = !!(oCurrentHash.LeaveByBack || (!oActivationInfo.bIsProgrammatic && (sDirection === HistoryDirection.Backwards)));
					oActivationInfo.bIsForward = !oActivationInfo.bIsBack && (sDirection === HistoryDirection.Forwards);
					oCurrentHash.LeaveByReplace = oActivationInfo.bIsProgrammatic && oCurrentHash.LeaveByReplace;
				}
				oCurrentHash.LeaveByBack = oActivationInfo.bIsBack;
				oPreviousHash = oCurrentHash;
				oPreviousHash.identity = oCurrentIdentity.previousIdentity;
				delete oCurrentIdentity.previousIdentity;
				aPreviousHashes.push(oPreviousHash);
				oCurrentHash = {
					iHashChangeCount: oActivationInfo.iHashChangeCount,
					componentsDisplayed: Object.create(null)
				};
				// identify the back target
				if (oPreviousHash.LeaveByReplace){
					oCurrentHash.backTarget = oPreviousHash.backTarget; // url is replaced  -> back target remains unchanged
				} else if (oActivationInfo.bIsBack){
					var iBackTarget = oPreviousHash.backTarget;
					for (var iSteps = oPreviousHash.backSteps || 1; iSteps > 0; iSteps--){
						iBackTarget = aPreviousHashes[iBackTarget].backTarget;
					}
					oCurrentHash.backTarget = iBackTarget;
				} else {
					oCurrentHash.backTarget = iPreviousHashChangeCount;	// last url is back target
				}
			}
			oRoutingOptions = null;
			oCurrentHash.oEvent = oEvent;
			oCurrentHash.hash = sHash;

			// During back navigation the link we are navigating to might have been made obsolete during the runtime of the App. This would happen in the following cases:
			// - Link points to a draft, but the draft has been activated or cancelled meanwhile.
			// - Link points to an active entity. Meanwhile, a own draft for this active entity exists, and needs to be redirected to draft.
			// - Link points to an object which has been deleted meanwhile.
			// Whereas we cannot do anything in the third case (thus, a message page will be displayed then), in the first two cases we want to
			// automatically forward the user to the correct instance.
			// In order to achieve this, we use method fnGetAlternativeContextPromise which may provide an alternative context to navigate to.
			// However, there are two limitations for that:
			// - In general the functionality only covers activation/cancellation/draft-creation actions which have been performed within this session.
			//   These actions have been registered within class ContextBookkeeping.
			// - For hashes pointing to item level (viewLevel > 1) it is currently not possible to determine the alternative path. Therefore, the determination
			//   whether an alternative context is required is done on root object level. Thus, the root object is navigated to, if one of the cases above is
			//   discovered.
			// fnAfterAlternateContextIsFound is executed after the alternate context is found.

			var fnAfterAlternateContextIsFound = function(oAlternativeContextInfo){
				var oKeys = oEvent.getParameter("arguments");
				if (oAlternativeContextInfo){ // then one of the cases described above occurs
					var oQuery = oKeys["?query"]; // We want to navigate to another context, but the query parameters should stay the same
					oCurrentHash.forwardingInfo = oActivationInfo; // Note: This is the second scenario for forwardingInfo as described in the comment for oCurrentHash (see above)
					fnNavigateToContextImpl(oAlternativeContextInfo.context, null, true, oAlternativeContextInfo.iDisplayMode, oQuery || {}); // Navigate to the other context
					return; // note that fnHandleRouteMatched will be called again
				}
				// When we reach this point, the logical navigation step has reached its final url.
				// Now we have to adapt the state of the application
				fnAdaptPaginatorInfoAfterNavigation(oCurrentIdentity.treeNode, oActivationInfo.bIsProgrammatic, oActivationInfo.bIsBack);

				if (oTemplateContract.oFlexibleColumnLayoutHandler){
					oActivationPromise = oTemplateContract.oFlexibleColumnLayoutHandler.handleRouteMatched(oActivationInfo);
				} else {
					if (iViewLevel === 0 || oActivationInfo.bIsBack || !oActivationInfo.bIsProgrammatic){
						oTemplateContract.oApplicationProxy.setEditableNDC(false);
					}

					var oComponentPromise = oTemplateContract.mRouteToTemplateComponentPromise[oCurrentIdentity.treeNode.sRouteName];
					oActivationPromise = oComponentPromise.then(function(oComponent){
						return fnActivateComponent(fnDeterminePathForKeys(oCurrentIdentity.treeNode, oCurrentIdentity.keys), oActivationInfo, oComponent);
					});
				}
				oTemplateContract.oBusyHelper.setBusy(oActivationPromise);
			};

			if (oActivationInfo.bIsBack) {
				// sTestPath is the path for which we check, whether one of the cases described above, occurs. As discussed above we
				//  must use the path pointing to the root.
				var sTestPath = fnDeterminePathForKeys(getAncestralNode(1), oCurrentIdentity.keys);
				oTemplateContract.oBusyHelper.setBusy(fnGetAlternativeContextPromise(sTestPath).then(fnAfterAlternateContextIsFound));
			} else {
				fnAfterAlternateContextIsFound();
			}
		}

		// This handler is registered at the route matched event of the router. It is thus called whenever the url changes within the App (if the new url is legal)
		function fnHandleRouteMatched(oEvent) {
			if (oCurrentIdentity && oCurrentIdentity.preset){
				delete oCurrentIdentity.preset;
			} else {
				fnFillCurrentIdentity(oEvent);
			}
			oEvent = merge({}, oEvent); // as this handler works asynchronously and events are pooled by UI5, we create a defensive copy
			var oImplPromise = oTemplateContract.oStatePreserversAvailablePromise.then(fnHandleRouteMatchedImpl.bind(null, oEvent), oTemplateContract.oBusyHelper.setBusyReason.bind(null, "HashChange", false));
			oTemplateContract.oBusyHelper.setBusy(oImplPromise);
			fnUpdateParentModelsWithContext();
		}

		// Event handler fired by router when no matching route is found
		function fnHandleBypassed() {
			oCurrentIdentity = {
				appStates: Object.create(null),
				keys: []
			};
			fnNavigateToMessagePage({
				title: oTemplateContract.getText("ST_ERROR"),
				text:  oTemplateContract.getText("ST_GENERIC_UNKNOWN_NAVIGATION_TARGET"),
				description: ""
			});
		}

		function fnUpdateParentModelsWithContext() {
			var oRoutingTree, oParentNode, sParentComponent, oParentComponent, sContextPath, oParentPrivModel, sCanonicalPattern;
			var oWorkingNode = oCurrentIdentity.treeNode;
			var sParentRoute = oWorkingNode.parentRoute;
			while (sParentRoute) {
				//Loop for all the parent components until you reach root component
				oRoutingTree = oTemplateContract.mRoutingTree;
				oParentNode = oRoutingTree[sParentRoute];
				sParentComponent = oParentNode.componentId;
				oParentComponent = oTemplateContract.componentRegistry[sParentComponent];
				if (!oParentComponent) {
					return;
				}
				oParentPrivModel = oParentComponent.utils.getTemplatePrivateModel();
				//Update the parent model with the context path
				sCanonicalPattern = "/" + oWorkingNode.entitySet + "({keys" + oWorkingNode.level + "})";
				sContextPath = fnDetermineCanonicalPathForKeys(oWorkingNode, sCanonicalPattern, oCurrentIdentity.keys);
				oParentPrivModel.setProperty("/generic/currentActiveChildContext", sContextPath);
				//Repeat for Parent Components
				oWorkingNode = oParentNode;
				sParentRoute = oWorkingNode.parentRoute; //Breaks when it reaches LR's parent i.e, parentRoute=""
			}
		}

		function fnDetermineCanonicalPathForKeys(oTreeNode, sPath, aKeys){
			if (oTreeNode.level === 0) {
				return null;
			}
			if (sPath.indexOf("/") !== 0) {
				sPath = "/" + sPath;
			}
			for (var i = 1; i <= oTreeNode.level; i++){
				sPath = sPath.replace("{keys" + i + "}", aKeys[i]);
			}
			return sPath;
		}

		if (oTemplateContract.sRoutingType === "f"){
			oNavigationControllerProxy.oRouter.attachBeforeRouteMatched(fnHandleBeforeRouteMatched);
		}

		oNavigationControllerProxy.oRouter.attachRouteMatched(fnHandleRouteMatched);

		oNavigationControllerProxy.oRouter.attachBypassed(fnHandleBypassed);

		// End: Handling url-changes

		// Expose methods via NavigationController proxy
		oNavigationControllerProxy.concatPathAndAppStates = fnConcatPathAndAppStates;
		oNavigationControllerProxy.navigate = fnNavigate;
		oNavigationControllerProxy.navigateBack = fnNavigateBack.bind(null, 1);
		oNavigationControllerProxy.activateOneComponent = fnActivateOneComponent;
		oNavigationControllerProxy.afterActivation = fnAfterActivation;
		oNavigationControllerProxy.addUrlParameterInfoForRoute = fnAddUrlParameterInfoForRoute;
		oNavigationControllerProxy.getApplicableStateForComponentAddedPromise = getApplicableStateForComponentAddedPromise;
		oNavigationControllerProxy.setVisibilityOfRoute = setVisibilityOfRoute;
		oNavigationControllerProxy.getActiveComponents = getActiveComponents;
		oNavigationControllerProxy.getAllComponents = getAllComponents;
		oNavigationControllerProxy.getRootComponentPromise = getRootComponentPromise;
		oNavigationControllerProxy.getActivationInfo = getActivationInfo;
		oNavigationControllerProxy.getCurrentKeys = getCurrentKeys;
		oNavigationControllerProxy.getCurrentHash = getCurrentHash;
		oNavigationControllerProxy.getAppTitle = getAppTitle;
		oNavigationControllerProxy.navigateByExchangingQueryParam = fnNavigateByExchangingQueryParam;
		oNavigationControllerProxy.navigateToSubContext = fnNavigateToSubContext;
		oNavigationControllerProxy.getSwitchToSiblingPromise = getSwitchToSiblingPromise;
		oNavigationControllerProxy.getSpecialDraftCancelPromise = getSpecialDraftCancelPromise;
		oNavigationControllerProxy.getCurrentIdentity = getCurrentIdentity;
		oNavigationControllerProxy.navigateToIdentity = fnNavigateToIdentity;
		oNavigationControllerProxy.navigateAfterActivation = fnNavigateAfterActivation;
		oNavigationControllerProxy.navigateUpAfterDeletion = fnNavigateUpAfterDeletion;
		oNavigationControllerProxy.navigateToChild = fnNavigateToChild;
		oNavigationControllerProxy.navigateFromNodeAccordingToContext = fnNavigateFromNodeAccordingToContext;
		oNavigationControllerProxy.isNavigating = isNavigating;
		oNavigationControllerProxy.getLinksToUpperLayers = getLinksToUpperLayers;
		oNavigationControllerProxy.setTextForTreeNode = setTextForTreeNode;
		oNavigationControllerProxy.determinePathForKeys = fnDeterminePathForKeys;

		// to allow AppComponent to trigger retemplating - for designtime tools only
		oNavigationControllerProxy.createComponentInstance = fnCreateComponentInstance;

		return {
			/**
			* Navigates to the root view.
			*
			* @public
			* @param {boolean} bReplace If this is true the navigation/hash will be replaced
			*/
			navigateToRoot: fnNavigateToRoot,

			/**
			 * Navigates to the specified context.
			 *
			 * @public
			 * @param {Object} oTargetContext - The context to navigate to (or null - e.g. when the navigationProperty should be appended to the current path)
			 * @param {string} sNavigationProperty - The navigation property
			 * @param {boolean} bReplace If this is true the navigation/hash will be replaced
			 */
			navigateToContext: fnNavigateToContext,
			/**
			 * Navigates to the message page and shows the specified content.
			 *
			 * @public
			 * @param {Object} mParameters - The parameters for message page
			 */
			navigateToMessagePage: fnNavigateToMessagePage,

			/**
			 * Navigate back
			 *
			 * @public
			 */
			navigateBack: fnNavigateBack.bind(null, 1)
		};
	}

	function constructor(oNavigationController, oTemplateContract){
		var oNavigationControllerProxy = {
			oAppComponent: oTemplateContract.oAppComponent,
			oRouter: oTemplateContract.oAppComponent.getRouter(),
			oTemplateContract: oTemplateContract,
			oHashChanger: HashChanger.getInstance(),
			mRouteToComponentResolve: {}
		};

		oTemplateContract.oNavigationControllerProxy = oNavigationControllerProxy;
		var oFinishedPromise = new Promise(function(fnResolve){
			// remark: In case of inbound navigation with edit-mode and an existing draft, this promise will be resolved
			// before the initialization is actually finished.
			// This is necessary to be able to show the unsavedChanges-Dialog
			oNavigationControllerProxy.fnInitializationResolve = fnResolve;
		});
		oTemplateContract.oBusyHelper.setBusy(oFinishedPromise);
		extend(oNavigationController, getMethods(oTemplateContract, oNavigationControllerProxy));
		extend(oNavigationControllerProxy, oNavigationController);
		// TODO: this has to be clarified and fixed
		oNavigationControllerProxy.oRouter._oViews._getViewWithGlobalId = function(oView) {
			/*
			 * check, whether the component for the given viewname has already been created
			 * by searching in componentRegistry - if yes, just return the existing one
			 * (instead of a view, also a component container can be returned)
			 */
			oView.viewName = oView.name || oView.viewName;
			for (var key in oTemplateContract.componentRegistry){
				if (oTemplateContract.componentRegistry[key].route === oView.viewName){
					return oTemplateContract.componentRegistry[key].oComponent.getComponentContainer();
				}
			}

			var oRoute = oNavigationControllerProxy.oRouter.getRoute(oView.viewName);
			var oContainer;
			if (oRoute && oRoute._oConfig) {
				oContainer = fnCreateComponentInstance(oTemplateContract, oRoute._oConfig, oNavigationControllerProxy.mRouteToComponentResolve[oView.viewName]);
			} else {
				oContainer = sap.ui.view({
					viewName: oView.viewName,
					type: oView.type,
					height: "100%"
				});
			}
			if (oView.viewName === "root") {
				oTemplateContract.rootContainer = oContainer;
			}

			return oContainer.loaded();
		};
		routingHelper.startupRouter(oNavigationControllerProxy);
	}

	/*
	 * Handles all navigation and routing-related tasks for the application.
	 *
	 * @class The NavigationController class creates and initializes a new navigation controller with the given
	 *        {@link sap.suite.ui.generic.template.lib.AppComponent AppComponent}.
	 * @param {sap.suite.ui.generic.template.lib.AppComponent} oAppComponent The AppComponent instance
	 * @public
	 * @extends sap.ui.base.Object
	 * @version 1.74.0
	 * @since 1.30.0
	 * @alias sap.suite.ui.generic.template.lib.NavigationController
	 */
	var NavigationController = BaseObject.extend("sap.suite.ui.generic.template.lib.NavigationController", {
		metadata: {
			library: "sap.suite.ui.generic.template"
		},
		constructor: function(oTemplateContract) {
			// inherit from base object.
			BaseObject.apply(this, arguments);
			testableHelper.testableStatic(constructor, "NavigationController")(this, oTemplateContract);
		}
	});

	NavigationController._sChanges = "Changes";
	return NavigationController;
});
