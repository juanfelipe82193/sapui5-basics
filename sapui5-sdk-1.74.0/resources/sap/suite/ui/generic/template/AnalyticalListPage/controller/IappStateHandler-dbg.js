sap.ui.define(["sap/ui/base/Object",
	"sap/ui/generic/app/navigation/service/SelectionVariant",
	"sap/ui/Device",
	"sap/ui/comp/state/UIState",
	"sap/ui/core/mvc/ControllerExtension",
	"sap/base/Log",
	"sap/base/util/deepEqual",
	"sap/base/util/extend",
	"sap/base/util/deepExtend"
], function(BaseObject, SelectionVariant, Device, UIState, ControllerExtension, Log, deepEqual, extend, deepExtend) {
	"use strict";

	function getMethods(oState, oController, oNavigationHandler) {

		//decleration
		var customDataPropertyName  = "sap.suite.ui.generic.template.customData";
		var genericDataPropertyName = "sap.suite.ui.generic.template.genericData";
		var dataPropertyNameExtension = "sap.suite.ui.generic.template.extensionData";
		var FILTER_MODE_VISUAL      = "visual";
		var FILTER_MODE_COMPACT     = "compact";
		var oParseNavigationPromise;
		var bIsTransferringUrlStateToPageState = false,
		bIsSearchTriggeredByStartUp = false,
		_fnStartUpPromise = null,
		_oStartUpSelectionVariant;
		var oStoringInformation = null;
		var sAppStateKeyInUrl = null;
		var oRealizedAppState = { // this object contains information which can be derived from url
			appStateKey: "",      // it represents the last url-state which has been adopted by the UI
			urlParams: {}
			//LR is storing some additional information like table variant id in this object, in ALP it is not required
		};
		var INITIAL_NAVIGATION_CONTEXT = {};

		/**
		 * This function return the URL parameter info
		 * @return {promise}
		 */
		function getUrlParameterInfo(){
			return oParseNavigationPromise.then(function(){
				if (oRealizedAppState.appStateKey){
					return {
						"sap-iapp-state": [oRealizedAppState.appStateKey]
					};
				}
				return oRealizedAppState.urlParams;
			});
		}
		function fnRestoreGenericFilterState(oGenericData) {
			if (oGenericData && oGenericData.editStateFilter !== undefined) {
				var oEditStateFilter = oController.byId("editStateFilter");
				if (oEditStateFilter) {
					oEditStateFilter.setSelectedKey((oGenericData.editStateFilter === null) ? 0 : oGenericData.editStateFilter);
				}
			}
			var oTemplatePrivate = oState.oController.getOwnerComponent().getModel("_templPriv");
			if (oGenericData.chartVariantId && oState.oSmartChart) {
				oState.oSmartChart.setCurrentVariantId(oGenericData.chartVariantId);
			}
			if (oGenericData.filterMode) {
				oTemplatePrivate.setProperty('/alp/filterMode', oGenericData.filterMode);
				oState.filterBarController.handleFilterSwitch(oGenericData.filterMode);
			} else {
				fnSetDefaultFilter();
			}
			if (oGenericData.contentView) {
				((Device.system.phone || Device.system.tablet && !Device.system.desktop) && oGenericData.contentView === "charttable") ? oTemplatePrivate.setProperty('/alp/contentView', "chart") : oTemplatePrivate.setProperty('/alp/contentView', oGenericData.contentView);
			}
			if (oGenericData.autoHide) {
				oTemplatePrivate.setProperty('/alp/autoHide', oGenericData.autoHide);
				//TODO RC Do we need to refresh table binding to change the highlight / filter behaviour
			}
		}

		// method is responsible for retrieving state for all extensions.
		// More precisely, oExtensionData is a map Extension-namespace -> state that has been stored by the corresponding extension.
		// This method enables each extension to restore its state accordingly.
		function fnRestoreExtensionFilterState(oExtensionData){
			if (!oExtensionData){
				return; // the app-state does not contain state information for extensions
			}
			var bIsAllowed = true; // check for synchronous calls
			// the following function will be passed to all extensions. It gives them the possibility to retrieve their state.
			// Therefore, they must identify themselves via their instance of ControllerExtension.
			var fnGetAppStateData = function(oControllerExtension){
				if (!(oControllerExtension instanceof ControllerExtension)){
					throw new Error("State must always be retrieved with respect to a ControllerExtension");
				}
				var sExtensionId = oControllerExtension.getMetadata().getNamespace();
				if (!bIsAllowed){
					throw new Error("State must always be restored synchronously");
				}
				return oExtensionData[sExtensionId];
			};
			oController.templateBaseExtension.restoreExtensionAppStateData(fnGetAppStateData);
			bIsAllowed = false;
		}

		// This method is responsible for restoring the data which have been stored via getFilterState.
		// However, it must be taken care of data which have been stored with another (historical) format.
		// Therefore, it is checked whether oCustomAndGenericData possesses two properties with the right names.
		// If this is this case it is assumed that the data have been stored according to curreent logic. Otherwise, it is
		// assumed that the data have been stored with the current logic. Otherwise, it is assumed that the properties have been
		// stored with a logic containing only custom properties (with possible addition of _editStateFilter).
		function fnRestoreFilterStateData(oCustomAndGenericData) {
			oCustomAndGenericData = oCustomAndGenericData || {};
			if (oCustomAndGenericData.hasOwnProperty(customDataPropertyName) && oCustomAndGenericData.hasOwnProperty(genericDataPropertyName)) {
				fnRestoreGenericFilterState(oCustomAndGenericData[genericDataPropertyName]);
				fnRestoreCustomFilterState(oCustomAndGenericData[customDataPropertyName]);
				fnRestoreExtensionFilterState(oCustomAndGenericData[dataPropertyNameExtension]);
			} else { // historic format. May still have property _editStateFilter which was used generically.
				if (oCustomAndGenericData._editStateFilter !== undefined) {
					fnRestoreGenericFilterState({
						editStateFilter: oCustomAndGenericData._editStateFilter
					});
					delete oCustomAndGenericData._editStateFilter;
				}
				fnSetDefaultFilter();
				fnRestoreCustomFilterState(oCustomAndGenericData);
			}
		}


		function fnRestoreFilterState(oCustomAndGenericData) {

			if (oState.oSmartFilterbar.isPending()) {
				var fnSmartFilterBarPendingChange = function(oEvt) {
					var oParams = oEvt.getParameters();
					if (!oParams.pendingValue) {
						oState.oSmartFilterbar.detachPendingChange(fnSmartFilterBarPendingChange);
						fnRestoreFilterStateData(oCustomAndGenericData);
					}
				};
				oState.oSmartFilterbar.attachPendingChange(fnSmartFilterBarPendingChange);
			} else {
				fnRestoreFilterStateData(oCustomAndGenericData);

			}


		}

		/**
		 * This function set the default filter
		 * @return {void}
		 */
		function fnSetDefaultFilter() {
			var oTemplatePrivate = oState.oController.getOwnerComponent().getModel("_templPriv"),
				defaultFilterMode = oState.oSmartFilterbar.isCurrentVariantStandard() ? oState.oController.getOwnerComponent().getDefaultFilterMode() : oTemplatePrivate.getProperty('/alp/filterMode');
			//Default to Visual filter mode when incorrect value is given for defaultFilterMode in App descriptor
			if (!(defaultFilterMode === FILTER_MODE_VISUAL || defaultFilterMode === FILTER_MODE_COMPACT)) {
				Log.error("Defaulting to Visual filter due to incorrect value of defaultFilterMode in App descriptor");
				defaultFilterMode = FILTER_MODE_VISUAL;
			}
			//If the App Developer wants to hide Visual Filter, switch to Compact Filter
			if (defaultFilterMode === FILTER_MODE_VISUAL && oState.hideVisualFilter) {
				Log.error("Visual filter is hidden defaulting to compact");
				defaultFilterMode = FILTER_MODE_COMPACT;
			}
			oState.filterBarController.setDefaultFilter(defaultFilterMode);
		}
		function handleVariantIdPassedViaURLParams(oNewUrlParameters) {
			var bSmartVariantManagement = oState.oController.getOwnerComponent().getProperty('smartVariantManagement');

			if (bSmartVariantManagement) {
				var sPageVariantId = oNewUrlParameters['sap-ui-fe-variant-id'];
				if (sPageVariantId && sPageVariantId[0]) {
					oState.oSmartFilterbar.getSmartVariant().setCurrentVariantId(sPageVariantId[0]);
				}
			} else {
				var aPageVariantId = oNewUrlParameters['sap-ui-fe-variant-id'],
					aFilterBarVariantId = oNewUrlParameters['sap-ui-fe-filterbar-variant-id'],
					aChartVariantId = oNewUrlParameters['sap-ui-fe-chart-variant-id'],
					aTableVariantId = oNewUrlParameters['sap-ui-fe-table-variant-id'];

				applyControlVariantId(aFilterBarVariantId && aFilterBarVariantId[0], aChartVariantId && aChartVariantId[0], aTableVariantId && aTableVariantId[0], aPageVariantId && aPageVariantId[0]);
			}
		}
		function applyControlVariantId(sFilterBarVariantId, sChartVariantId, sTableVariantId, sPageVariantId) {
			if (sFilterBarVariantId || sPageVariantId) {
				oState.oSmartFilterbar.getSmartVariant().setCurrentVariantId(sFilterBarVariantId || sPageVariantId);
			}
			if (oState.oSmartChart && (sChartVariantId || sPageVariantId)) {
				oState.oSmartChart.attachAfterVariantInitialise(function (oEvent) {
					oState.oSmartChart.setCurrentVariantId(sChartVariantId || sPageVariantId);
				});
				// incase the control variant is already initialized
				oState.oSmartChart.setCurrentVariantId(sChartVariantId || sPageVariantId);
			}
			if (oState.oSmartTable && (sTableVariantId || sPageVariantId)) {
				oState.oSmartTable.attachAfterVariantInitialise(function (oEvent) {
					oState.oSmartTable.setCurrentVariantId(sTableVariantId || sPageVariantId);
				});
				// incase the control variant is already initialized
				oState.oSmartTable.setCurrentVariantId(sTableVariantId || sPageVariantId);
			}
		}
		/**
		 * This function resolve the app state promise
		 * @param  {object} oAppData       app data
		 * @param  {object} oURLParameters url parameters
		 * @param  {string} sNavType       navigation type
		 * @return {void}
		 */
		function resolveAppStatePromise (oAppData, oURLParameters, sNavType) {
			oState.oSmartFilterbar.setSuppressSelection(false);
			var sAppStateKey = oAppData.appStateKey || "";
			//Make sure that no two resolve functions are executing at the same time.
			if (bIsTransferringUrlStateToPageState){
				return;
			}
			sAppStateKeyInUrl = sAppStateKey;
			bIsTransferringUrlStateToPageState = true;
			var oNewUrlParameters = (!sAppStateKey && oURLParameters) || {};
			if (oNewUrlParameters) {
				handleVariantIdPassedViaURLParams(oNewUrlParameters);
			}
			if (sNavType !== sap.ui.generic.app.navigation.service.NavType.initial) {
				var bHasOnlyDefaults = oAppData && oAppData.bNavSelVarHasDefaultsOnly;
				var oSelectionVariant = new SelectionVariant(oAppData.selectionVariant);
				//storing navigation context object in global variable
				INITIAL_NAVIGATION_CONTEXT = JSON.parse(oAppData.selectionVariant);
				if ((oSelectionVariant.getSelectOptionsPropertyNames().indexOf("DisplayCurrency") === -1) && (oSelectionVariant.getSelectOptionsPropertyNames().indexOf("P_DisplayCurrency") === -1) && (oSelectionVariant.getParameterNames().indexOf("P_DisplayCurrency") === -1)) {
					addDisplayCurrency(oSelectionVariant, oAppData);
				}
				if ((!bHasOnlyDefaults || oState.oSmartFilterbar.isCurrentVariantStandard())) {
					var oStartupObject = {
						selectionVariant : oSelectionVariant
					};
					//Call the extension to modify selectionVariant for NavType !== iAppState as iAppState would have the modified SV values and no need to modify them again.
					if (sNavType !== sap.ui.generic.app.navigation.service.NavType.iAppState) {
						oState.oController.modifyStartupExtension(oStartupObject);
					}
					applySelectionProperties(oStartupObject.selectionVariant);
					updateSmartFilterBar(oStartupObject.selectionVariant);
				} else {
					var oSelectionVariantFromSFB = new SelectionVariant(JSON.stringify(oState.oSmartFilterbar.getUiState().getSelectionVariant())),
						oCustomDataFromSFB = oSelectionVariantFromSFB.getSelectOption("sap.suite.ui.generic.template.customData"),
						oGenericDataFromSFB = oSelectionVariantFromSFB.getSelectOption("sap.suite.ui.generic.template.genericData");
					fnAddOrRemoveCustomAndGenericData(oSelectionVariantFromSFB, oCustomDataFromSFB, oGenericDataFromSFB, true);
					var oStartupObject = {
						selectionVariant : oSelectionVariantFromSFB
					};
					oState.oController.modifyStartupExtension(oStartupObject);
					fnAddOrRemoveCustomAndGenericData(oStartupObject.selectionVariant, oCustomDataFromSFB, oGenericDataFromSFB, false);
					if (!deepEqual(oStartupObject.selectionVariant, new SelectionVariant(JSON.stringify(oState.oSmartFilterbar.getUiState().getSelectionVariant())))) {
						applySelectionProperties(oStartupObject.selectionVariant);
						updateSmartFilterBar(oStartupObject.selectionVariant);
					}
				}
				if (oAppData.tableVariantId && oState.oSmartTable) {
					oState.oSmartTable.setCurrentVariantId(oAppData.tableVariantId);
				}
				//in case of visual filter mode triggering the merge
				var oTemplatePrivate = oState.oController.getOwnerComponent().getModel("_templPriv");
				if ( sNavType === sap.ui.generic.app.navigation.service.NavType.xAppState && oTemplatePrivate.getProperty('/alp/filterMode') === FILTER_MODE_VISUAL) {
					triggerMerge();
				}
				if (oAppData.customData) {
					fnRestoreFilterState(oAppData.customData);
				} else {
					fnSetDefaultFilter();
				}
				if (!bHasOnlyDefaults) {
					oState.oSmartFilterbar.checkSearchAllowed(oState);
					if (oState.oController.getView().getModel("_templPriv").getProperty("/alp/searchable")) {
						bIsSearchTriggeredByStartUp = true;
						oState.oSmartFilterbar.search();
					}

				} else {
					if (oState.oSmartFilterbar.isLiveMode() || oState.oSmartFilterbar.isCurrentVariantExecuteOnSelectEnabled()) {
						oState.oSmartFilterbar.checkSearchAllowed(oState);
						if (oState.oController.getView().getModel("_templPriv").getProperty("/alp/searchable")) {
							bIsSearchTriggeredByStartUp = true;
						}
					}
				}
				oRealizedAppState = {
					appStateKey: sAppStateKey,
					urlParams: oNewUrlParameters
				};
			} else {
				var oSelectionVariant = new SelectionVariant(JSON.stringify(oState.oSmartFilterbar.getUiState().getSelectionVariant())),
					oCustomDataFromSFB = oSelectionVariant.getSelectOption("sap.suite.ui.generic.template.customData"),
					oGenericDataFromSFB = oSelectionVariant.getSelectOption("sap.suite.ui.generic.template.genericData");
				fnAddOrRemoveCustomAndGenericData(oSelectionVariant, oCustomDataFromSFB, oGenericDataFromSFB, true);
				var oStartupObject = {
					selectionVariant : oSelectionVariant
				};
				oState.oController.modifyStartupExtension(oStartupObject);
				fnAddOrRemoveCustomAndGenericData(oStartupObject.selectionVariant, oCustomDataFromSFB, oGenericDataFromSFB, false);
				if (!deepEqual(oStartupObject.selectionVariant, new SelectionVariant(JSON.stringify(oState.oSmartFilterbar.getUiState().getSelectionVariant())))) {
					applySelectionProperties(oStartupObject.selectionVariant);
					updateSmartFilterBar(oStartupObject.selectionVariant);
				}
				if (oState.oSmartFilterbar.isLiveMode() || oState.oSmartFilterbar.isCurrentVariantExecuteOnSelectEnabled()) { //on initial load for live mode application, we need to wait till search is triggered to resolve the startup promise
					 oState.oSmartFilterbar.checkSearchAllowed(oState);
					if (oState.oController.getView().getModel("_templPriv").getProperty("/alp/searchable")) {
						bIsSearchTriggeredByStartUp = true;
					}
				}
				fnSetDefaultFilter();
			}
			fnUpdateSVFB();
			oStoringInformation = null;
			if (!bIsSearchTriggeredByStartUp) {
				fnResolveStartUpPromise();
			} else {
				bIsTransferringUrlStateToPageState = false;
			}
		}
		/*
		The function is to add / remove Custom and Generic data from the SelectOptions of SV
		@param {object} Selection Variant
		@param {object} oCustomDataFromSFB
		@param {object} oGenericDataFromSFB
		@param {boolean} bRemove
		*/
		function fnAddOrRemoveCustomAndGenericData(oSelectionVariant, oCustomDataFromSFB, oGenericDataFromSFB, bRemove) {
			if (bRemove) {
				if (oCustomDataFromSFB) {
					oSelectionVariant.removeSelectOption("sap.suite.ui.generic.template.customData");
				}
				if (oGenericDataFromSFB) {
					oSelectionVariant.removeSelectOption("sap.suite.ui.generic.template.genericData");
				}
			} else {
				if (oCustomDataFromSFB) {
					oSelectionVariant.massAddSelectOption("sap.suite.ui.generic.template.customData", oCustomDataFromSFB);
				}
				if (oGenericDataFromSFB) {
					oSelectionVariant.massAddSelectOption("sap.suite.ui.generic.template.genericData", oGenericDataFromSFB);
				}
			}
		}
		/*
		The function is to add default values in Display Currency parameter if it is not there in the Selection Variant
                @param {object} Selection Variant
`		@param {object} App data
		*/
		function addDisplayCurrency(oSelectionVariant, oAppData) {
			var mandatoryFilterItems = oState.oSmartFilterbar.determineMandatoryFilterItems(),
			displayCurrency;
			for (var item = 0; item < mandatoryFilterItems.length; item++) {
				if (mandatoryFilterItems[item].getName().indexOf("P_DisplayCurrency") !== -1) {
					if (oAppData.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency") && oAppData.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")[0].Low) {
						displayCurrency = oAppData.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")[0].Low;
					}
					if (displayCurrency) {
						oSelectionVariant.addParameter("P_DisplayCurrency", displayCurrency);
					}
					if (oState.alr_visualFilterBar && displayCurrency) {
						oState.alr_visualFilterBar.setDisplayCurrency(displayCurrency);
					}
					break;
				}
			}
		}
		/**
		 * This function return the filter state
		 * @return {object} filter state
		 */
		function getFilterState() {
			var oCustomAndGenericData = {};
			oCustomAndGenericData[customDataPropertyName] = {};
			var oTemplatePrivate = oState.oController.getOwnerComponent().getModel("_templPriv");
			var chartInfoObj = oState.chartController && extend({}, oState.chartController._chartInfo);
			//deleting the chartSelection object because saving it is causing a circular object error. Will have to check once chart provides the api to apply these selections on init
			if (chartInfoObj && chartInfoObj.chartSelection) {
				delete chartInfoObj.chartSelection;
			}
			//Adding chartVariantId , filterMode and containerView to the generic data
			//because of the limitation of NavigationHandler
			oCustomAndGenericData[genericDataPropertyName] = {
				chartVariantId: oState.oSmartChart && oState.oSmartChart.getCurrentVariantId(),
				filterMode: oTemplatePrivate.getProperty('/alp/filterMode'),
				contentView: oTemplatePrivate.getProperty('/alp/contentView'),
				autoHide: oTemplatePrivate.getProperty('/alp/autoHide'),
				chartInfo: chartInfoObj
			};
			var oEditStateFilter = oController.byId("editStateFilter");
			if (oEditStateFilter) {
				oCustomAndGenericData[genericDataPropertyName].editStateFilter = oEditStateFilter.getSelectedKey();
			}
			// extension is responsible for retrieving custom filter state. The method has a more generic name
			// for historical reasons (change would be incompatible).
			oController.getCustomAppStateDataExtension(oCustomAndGenericData[customDataPropertyName]);

			// all extensions to add their custom state
			var oExtensionData; // collects all extension state information (as map extension-namespace -> state). Initialized on demand
			var bIsAllowed = true; // check for synchronous calls
			// the following function will be passed to all extensions. It gives them the possibility to provide their state as oAppState
			// Therefore, they must identify themselves via their instance of ControllerExtension.
			var fnSetAppStateData = function(oControllerExtension, oAppState){
				if (!(oControllerExtension instanceof ControllerExtension)){
					throw new Error("State must always be set with respect to a ControllerExtension");
				}
				if (!bIsAllowed){
					throw new Error("State must always be provided synchronously");
				}
				if (oAppState){ // faulty app-state information will not be stored
					oExtensionData = oExtensionData || Object.create(null);
					var sExtensionId = oControllerExtension.getMetadata().getNamespace(); // extension is identified by its namespace
					oExtensionData[sExtensionId] = oAppState;
				}
			};
			oController.templateBaseExtension.provideExtensionAppStateData(fnSetAppStateData);
			bIsAllowed = false;
			if (oExtensionData){
				oCustomAndGenericData[dataPropertyNameExtension] = oExtensionData;
			}

			return oCustomAndGenericData;
		}

		//It is used to return Initial navigation context that is being passed to the target application
		function getInitialNavigationContext() {
			return INITIAL_NAVIGATION_CONTEXT;
		}

		/**
		 * This function return the current app state
		 * @return {object} app state
		 */
		function getCurrentAppState() {
			/*
			 * Special handling for selection fields, for which defaults are defined: If a field is visible in the
			 * SmartFilterBar and the user has cleared the input value, the field is not included in the selection
			 * variant, which is returned by getDataSuiteFormat() of the SmartFilterBar. But since it was cleared by
			 * purpose, we have to store the selection with the value "", in order to set it again to an empty value,
			 * when restoring the selection after a back navigation. Otherwise, the default value would be set.
			 */
			var oSelectionVariant = oState.oSmartFilterbar.getUiState({
				allFilters : false
			}).getSelectionVariant();
			var aVisibleFields = oController.getVisibleSelectionsWithDefaults();
			for (var i = 0; i < aVisibleFields.length; i++) {
				if (!oSelectionVariant.getValue(aVisibleFields[i])) {
					oSelectionVariant.addSelectOption(aVisibleFields[i], "I", "EQ", "");
				}
			}
			//If variant is dirty and if the selection variant has id, making the same empty. For the filters to be applied correctly.
			if (oState.oController.byId('template::PageVariant').currentVariantGetModified() && oSelectionVariant.SelectionVariantID){
				oSelectionVariant.SelectionVariantID = "";
			}
			return {
				selectionVariant:  JSON.stringify(oSelectionVariant),
				tableVariantId: oState.oSmartTable && oState.oSmartTable.getCurrentVariantId(),
				customData: getFilterState()
			};
		}
		/**
		 * This method is responsible for retrieving custom filter state. The correspomding extension-method has a more generic name
		 * for historical reasons (change would be incompatible).
		 */
		function fnRestoreCustomFilterState(oCustomData) {
			oController.restoreCustomAppStateDataExtension(oCustomData || {});
		}

		/**
		 * This function trigger the merge
		 * @return {void}
		 */
		function triggerMerge() {
			var oCompactFilterData = deepExtend({}, oState.oSmartFilterbar.getFilterData(true)),
			filterModel = oState.oController.getOwnerComponent().getModel("_filter");
			filterModel.setData(oCompactFilterData);
			oState.filterBarController._updateFilterLink();
		}
		/**
		 * This function update the smart filter bar
		 * @param  {object} oSelectionVariant
		 * @return {void}
		 */
		function updateSmartFilterBar(oSelectionVariant) {
			// A default variant could be loaded.
			// Do not clear oSmartFilterbar.clearVariantSelection and oSmartFilterbar.clear due to BCP 1680012595 is not valid anymore
			// with BCP 1670406892 it was made clear that both clear are needed when this GIT change 1941921 in navigation handler is available
			oState.oSmartFilterbar.clearVariantSelection();
			oState.oSmartFilterbar.clear();
			// oSelectionVariant object is used in place of oAppData.selectionVariant
			// because we add a Parameter to the SelectionVariant if user settings
			// specify a DisplayCurrency.
			_oStartUpSelectionVariant = oSelectionVariant;
			fnSetFiltersUsingUIState(oSelectionVariant.toJSONObject() , true , false);
		}
		/**
		 * This function apply selection properties to the smart filter bar
		 * @param  {object} oSelectionVariant
		 * @return {void}
		 */
		function applySelectionProperties(oSelectionVariant) {
			var aSelectionVariantProperties = oSelectionVariant.getParameterNames().concat(oSelectionVariant.getSelectOptionsPropertyNames());
			for (var i = 0; i < aSelectionVariantProperties.length; i++) {
				oState.oSmartFilterbar.addFieldToAdvancedArea(aSelectionVariantProperties[i]);
			}
			// add filters to visual filter basic area if not already added
			if (oState.alr_visualFilterBar && oState.bVisualFilterInitialised) {
				oState.alr_visualFilterBar.addVisualFiltersToBasicArea(aSelectionVariantProperties);
			}
		}
		function fnStoreCurrentAppStateAndAdjustURL() {
			if (oState._bIsStartingUp) {
				return;
			}
			if (bIsTransferringUrlStateToPageState) {
				return;
			}
			// oCurrentAppState is optional
			// - nothing, if NavigationHandler not available
			// - adjusts URL immediately
			// - stores appState for this URL (asynchronously)
			var oCurrentAppState  = getCurrentAppState();
			// currently NavigationHandler raises an exception when ushellContainer is not available, should be changed
			// by
			// Denver
			try {
				//storage information object
				oStoringInformation =  oNavigationHandler.storeInnerAppStateWithImmediateReturn(oCurrentAppState);
			} catch (err) {
				Log.error("AnalyticalListPage.fnStoreCurrentAppStateAndAdjustURL: " + err);
			}
			if (oStoringInformation instanceof sap.ui.generic.app.navigation.service.NavError) {
				oStoringInformation = null;
				return;
			}
			//LR is using replaceHash function of NavigationHandler to update the key.
			//LR’s logic is creating the navigation promise and triggering the resolve function on every app state change
			//For ALP that logic will create performance issue. So using a different logic
			if (oStoringInformation && sAppStateKeyInUrl !== oStoringInformation.appStateKey) {
				//No need to wait for oStoringInformation.promise, app state is directly accessible from oStoringInformation object
				oRealizedAppState.appStateKey = oStoringInformation.appStateKey;
			}
		}
		function fnCheckToLaunchDialog() {
			var oTemplatePrivate = oState.oController.getOwnerComponent().getModel("_templPriv");
			if (oTemplatePrivate.getProperty('/alp/filterMode') === FILTER_MODE_VISUAL) {
				if (oState.alr_visualFilterBar && oState.alr_visualFilterBar.bIsInitialised && oTemplatePrivate.getProperty("/alp/searchable") === false) { //If missing mandatory or parameters
					oState.oSmartFilterbar.showFilterDialog();
				}
			}
		}
		function fnCheckMandatory(){
			//check if smartfilterbar is searchable only after it has been initialized.
			if (oState.oSmartFilterbar.isInitialised()) {
				oState.oSmartFilterbar.checkSearchAllowed(oState);
			}
		}
		function fnUpdateSVFB() {
			// set filter model so that default values (user settings etc.) can also be accounted for
			var filterModel = oState.oController.getOwnerComponent().getModel("_filter");
			filterModel.setData(deepExtend({}, oState.oSmartFilterbar.getFilterData(true)));
			oState.filterBarController._updateFilterLink();
		}
		 /* This function calls the setUiState API to set the Ui State
		 * @param  {string} sSelectionVariant -  Selection variant object converted into JSON string
		 * @param {boolean} bReplace -  Property bReplace decides whether to replace existing filter data
                 * @param {boolean} bStrictMode - Defines the filter/parameter determination, based on the name.
		 */
		function fnSetFiltersUsingUIState(sSelectionVariant, bReplace, bStrictMode) {
			var oUiState = new UIState({
				selectionVariant : sSelectionVariant
				});
			oState.oSmartFilterbar.setUiState(oUiState, {
				replace: bReplace,
				strictMode: bStrictMode
			});
        }
		function onSmartFilterBarInitialise(oEvent){
			oParseNavigationPromise  = oNavigationHandler.parseNavigation();
		}
		function onSmartFilterBarInitialized(){
			try {
				var oRet = new Promise(function(fnResolve, fnReject){//not added fnResolve and fnReject
					_fnStartUpPromise = fnResolve;
					oParseNavigationPromise.done(resolveAppStatePromise);
					oParseNavigationPromise.fail(fnReject);
				});
				return oRet;

			} catch (oException) {
				fnOnError();
			}
		}
		function fnResolveStartUpPromise() {
			bIsTransferringUrlStateToPageState = false;
			_fnStartUpPromise();
		}
		function fnGetStartUpSelectionVariant() {
			return _oStartUpSelectionVariant;
		}
		/*
		* Method to update VF config and bindings.
		* Scenario 1: App state promise is resolved before VF is initialised - Function not called in onSmartFilterBarInitialized but called later in the initialized event of VFBar
		* Scenario 2: VFBar is initialised first - Hence bStartUp=true. Hence function will not be called in initialized event of VFBar. Function would get called only after app state promise is resolved.
		*/
		function fnUpdateVisualFilterBar(bNotUpdatable) {
			// add filter to the advanced area in case it is preset in the navigation context
			if (!bNotUpdatable) {
				var oSelectionVariant = oState.oIappStateHandler.fnGetStartUpSelectionVariant();
				if (oSelectionVariant) {
					var aSelectionVariantProperties = oSelectionVariant.getParameterNames().concat(oSelectionVariant.getSelectOptionsPropertyNames());
					oState.alr_visualFilterBar.addVisualFiltersToBasicArea(aSelectionVariantProperties);
				}
			}
			//Update Binding in chart Items in Smart Visual Filter Bar
			oState.alr_visualFilterBar.updateVisualFilterBindings(true);
			//launch filter dialog only in standard variant. in case of a custom variant, the check to launch dialog is
			//executed after variant load.
			if (oState.oSmartFilterbar.isCurrentVariantStandard()) {
				oState.oIappStateHandler.fnCheckMandatory();
				// If filter mode is visual and if mandatory fields/params are not filled launch CompactFilter Dialog
				oState.oIappStateHandler.fnCheckToLaunchDialog();
			}
		}
		function fnOnError() {
			// In case the app is launched outside of launch pad the navigation promise will throw exception
			// Set Default filter when app state fails (if filter mode is visual) and if mandatory fields/params are not filled launch CompactFilter Dialog
			fnSetDefaultFilter();
			fnUpdateSVFB();
			//visual filter config and bindings must be updated after vf has been initialised
			if (oState.alr_visualFilterBar && oState.alr_visualFilterBar.bIsInitialised) {
				oState.oIappStateHandler.fnUpdateVisualFilterBar(true);
			}
		}
		return {
			getFilterState: getFilterState,
			fnCheckMandatory: fnCheckMandatory,
			fnCheckToLaunchDialog: fnCheckToLaunchDialog,
			getCurrentAppState: getCurrentAppState,
			fnUpdateSVFB: fnUpdateSVFB,
			fnSetDefaultFilter: fnSetDefaultFilter,
			fnRestoreFilterState: fnRestoreFilterState,
			getUrlParameterInfo: getUrlParameterInfo,
			onSmartFilterBarInitialise: onSmartFilterBarInitialise,
			onSmartFilterBarInitialized: onSmartFilterBarInitialized,
			fnStoreCurrentAppStateAndAdjustURL: fnStoreCurrentAppStateAndAdjustURL,
			fnSetFiltersUsingUIState: fnSetFiltersUsingUIState,
			fnResolveStartUpPromise: fnResolveStartUpPromise,
			fnGetStartUpSelectionVariant: fnGetStartUpSelectionVariant,
			fnUpdateVisualFilterBar: fnUpdateVisualFilterBar,
			fnOnError: fnOnError,
			getInitialNavigationContext: getInitialNavigationContext
		};
	}
	return BaseObject.extend("sap.suite.ui.generic.template.AnalyticalListPage.controller.IappStateHandler", {
		constructor: function(oState, oController, oNavigationHandler) {
			extend(this, getMethods(oState, oController, oNavigationHandler));
		}
	});
});
