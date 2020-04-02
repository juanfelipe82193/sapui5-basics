sap.ui.define(["sap/ui/base/Object",
	"sap/ui/core/mvc/ControllerExtension",
	"sap/ui/generic/app/navigation/service/NavError",
	"sap/ui/generic/app/navigation/service/SelectionVariant",
	"sap/ui/comp/state/UIState",
	"sap/base/Log",
	"sap/base/util/deepEqual",
	"sap/base/util/extend"
], function(BaseObject, ControllerExtension, NavError, SelectionVariant, UIState, Log, deepEqual, extend) {
	"use strict";

		// Constants which are used as property names for storing custom filter data and generic filter data
		var dataPropertyNameCustom = "sap.suite.ui.generic.template.customData",
			dataPropertyNameExtension = "sap.suite.ui.generic.template.extensionData",
			dataPropertyNameGeneric = "sap.suite.ui.generic.template.genericData";

		// variant contexts which should not lead to change the iappstate
		var aIrrelevantVariantLoadContext = ["INIT", "DATA_SUITE", "CANCEL", "RESET", "SET_VM_ID"];

	function fnNullify(oObject) {
		if (oObject) {
			for (var sProp in oObject) {
				oObject[sProp] = null;
			}
		}
	}

	function fnNotEqual(oObject1, oObject2){
		var aKeys1 = Object.keys(oObject1);
		if (aKeys1.length !== Object.keys(oObject2).length){
			return true;
		}
		for (var i = 0; i < aKeys1.length; i++){
			var sKey = aKeys1[i];
			var aPar1 = oObject1[sKey];
			var aPar2 = oObject2[sKey];
			if (aPar1.length !== aPar2.length){
				return true;
			}
			for (var j = 0; j < aPar1.length; j++){
				if (aPar1[j] !== aPar2[j]){
					return true;
				}
			}
		}
		return false;
	}

	function fnLogInfo(sMessage, vDetails){
		if (sap.ui.support) { //only if support assistant is loaded
			var iLevel = Log.getLevel();
			if (iLevel < Log.Level.INFO) {
				Log.setLevel(Log.Level.INFO);
			}
		}
		var sDetails;
		if (typeof vDetails === "string"){
			sDetails = vDetails;
		} else {
			sDetails = "";
			var sDelim = "";
			for (var sKey in vDetails){
				sDetails = sDetails + sDelim + sKey + ": " + vDetails[sKey];
				sDelim = "; ";
			}
		}
		Log.info(sMessage, sDetails, "sap.suite.ui.generic.template.ListReport.controller.IappStateHandler");
	}

	function getMethods(oState, oController, oTemplateUtils) {

		var oNavigationHandler = oTemplateUtils.oCommonUtils.getNavigationHandler();
		var bSmartVariantManagement = oController.getOwnerComponent().getSmartVariantManagement();
		var oRealizedAppState = { // this object contains information which can be derived from url
			appStateKey: "",      // it represents the last url-state which has been adopted by the UI
			urlParams: {},
			selectionVariant: "",
			tableVariantId: ""
		};

		var bIsTransferringUrlStateToPageState = false;

		var fnNotifyRealizedAppStateConsistent = null; // when this variable is not null a url has been caught which has not yet been adopted.
		                                       // In this case it is a function that should be called when the adoption has been performed successfully.
		var oAppStateIsSetPromise = Promise.resolve(); // A Promise that is resolved when the current url and the content of oRealizedAppState are consistent
		                                               // Otherwise the Promise will be resolved as soon as this is again the case
		var bDataAreShownInTable = false;
		var bAppStateDirty = false;  // this property is true, when some url-relevant change has been performed by the user which has not yet been transferred to the url.
		var oEditStateFilter = oController.byId("editStateFilter");
		var bIsAutoBinding;

		var oStoringInformation = null; // when this parameter is not null a change of the url has been triggered which is not yet reflected in oRealizedAppState.
		                                // In this case it contains a property appStateKey which contains the appStateKey which has been put into the url
		var sAppStateKeyInUrl = null; // the appstateKey which is currently in the url. It is (normally) updated in function isStateChange.

		oState.oSmartFilterbar.setSuppressSelection(true);

		var getByDefaultNonVisibleCustomFilterNames = (function(){
			var aNonVisibleCustomFilterNames;
			return function(){
				aNonVisibleCustomFilterNames = aNonVisibleCustomFilterNames || oState.oSmartFilterbar.getNonVisibleCustomFilterNames();
				return aNonVisibleCustomFilterNames;
			};
		})();

		function areDataShownInTable(){
			return bDataAreShownInTable;
		}

		function getPageState() {
			var oCustomAndGenericData = {}; // object to be returned by this function

			// first determine the generic information
			// Determine information about visible custom filters
			var aVisibleCustomFieldNames = [];
			var aByDefaultNonVisibleCustomFilterNames = getByDefaultNonVisibleCustomFilterNames();
			for (var i = 0; i < aByDefaultNonVisibleCustomFilterNames.length; i++){ // loop over all custom fields which are not visible in filterbar by default
				var sName = aByDefaultNonVisibleCustomFilterNames[i];
				if (oState.oSmartFilterbar.isVisibleInFilterBarByName(sName)){ // custom field is visible in filterbar now
					aVisibleCustomFieldNames.push(sName);
				}
			}
			var oGenericData = {
				suppressDataSelection: !bDataAreShownInTable,
				visibleCustomFields: aVisibleCustomFieldNames
			};
			oCustomAndGenericData[dataPropertyNameGeneric] = oGenericData;
			if (oEditStateFilter) {
				oGenericData.editStateFilter = oEditStateFilter.getSelectedKey();
				var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
				var bActiveStateFilter = oTemplatePrivateModel.getProperty("/listReport/activeObjectEnabled");
				oGenericData.activeStateFilter = bActiveStateFilter;
			}
			var sSelectedKeyPropertyName = oState.oMultipleViewsHandler.getSelectedKeyPropertyName();
			if (sSelectedKeyPropertyName) {
				var oTableViewData = oState.oMultipleViewsHandler.getContentForIappState();
				if (oTableViewData){
					oGenericData[sSelectedKeyPropertyName] = oTableViewData.state;
				}
			} 

			// search related data is saved in both iappstate and variant, adding it to custom data here to save state of worklist
			if (oState.oWorklistData.bWorkListEnabled) {
				var sSearchString = oState.oWorklistData.oSearchField ? oState.oWorklistData.oSearchField.getValue() : "";
				var oWorklistState = {
					"searchString": sSearchString
				};
				oGenericData.Worklist = oWorklistState;
			}

			// second allow classical break-outs to add their custom state
			var oCustomData = {};
			oCustomAndGenericData[dataPropertyNameCustom] = oCustomData;
			oController.getCustomAppStateDataExtension(oCustomData);

			// thirdallow all extensions to add their custom state
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

		function getCurrentAppState() {
			/*
			 * Special handling for selection fields, for which defaults are defined: If a field is visible in the
			 * SmartFilterBar and the user has cleared the input value, the field is not included in the selection
			 * variant, which is returned by getDataSuiteFormat() of the SmartFilterBar. But since it was cleared by
			 * purpose, we have to store the selection with the value "", in order to set it again to an empty value,
			 * when restoring the selection after a back navigation. Otherwise, the default value would be set.
			 */
			var sCurrentSelectionVariant = JSON.stringify(oState.oSmartFilterbar.getUiState().getSelectionVariant());
			//var sCurrentSelectionVariant = oState.oSmartFilterbar.getDataSuiteFormat();
			var oSelectionVariant = new SelectionVariant(sCurrentSelectionVariant);
			var aVisibleFields = oController.getVisibleSelectionsWithDefaults();
			for (var i = 0; i < aVisibleFields.length; i++) {
				if (!oSelectionVariant.getValue(aVisibleFields[i])) {
					oSelectionVariant.addSelectOption(aVisibleFields[i], "I", "EQ", "");
				}
			}

			//If variant is dirty and if the selection variant has id, making the same empty for the filters to be applied correctly.
			if (oController.byId('template::PageVariant') && oController.byId('template::PageVariant').currentVariantGetModified() && oSelectionVariant.getID()){
				oSelectionVariant.setID("");
			}

			/*State saving for worklist application*/
			if (oState.oWorklistData.bWorkListEnabled) {
				var oSearchField = oState.oWorklistData.oSearchField ? oState.oWorklistData.oSearchField.getValue() : "";
				oSelectionVariant.addSelectOption("Worklist.SearchField","I","EQ",oSearchField);
			}

			var oRet = {
				selectionVariant: oSelectionVariant.toJSONString(),
				tableVariantId: (!bSmartVariantManagement && oState.oSmartTable.getCurrentVariantId()) || "",
				customData: getPageState()
			};
			return oRet;
		}

		// This method is called when the app state has potentially changed, such that the url must be adopted.
		// bAppStateDirty tells us, whether there is really an open change
		function fnStoreCurrentAppStateAndAdjustURL() {
			// - nothing, if ushellContainer not available
			// - adjusts URL immediately
			// - stores appState for this URL (asynchronously)

			fnLogInfo("fnStoreCurrentAppStateAndAdjustURL called", {
				bAppStateDirty: bAppStateDirty,
				bDataAreShownInTable: bDataAreShownInTable
			});
			if (!bAppStateDirty){
				return;
			}

			bAppStateDirty = false;

			try {
				oStoringInformation = oNavigationHandler.storeInnerAppStateWithImmediateReturn(getCurrentAppState(), true);
			} catch (err){ // happens e.g. in voter. Would better be handled by Denver
				Log.error("ListReport.fnStoreCurrentAppStateAndAdjustURL: " + err);
				return;
			}

			if (oStoringInformation instanceof NavError){
				bAppStateDirty = true;
				oStoringInformation = null;
				return;
			}
			oStoringInformation.promise.fail(function(oError){
				Log.error("ListReport.fnStoreCurrentAppStateAndAdjustURL: Error when persisting appState" + oError);
			});
			fnLogInfo("Result received from storeInnerAppStateWithImmediateReturn", {
				appStateKey: oStoringInformation.appStateKey,
				sAppStateKeyInUrl: sAppStateKeyInUrl
			});
			if (sAppStateKeyInUrl === oStoringInformation.appStateKey){
				oStoringInformation = null;	// if the appstateKey does not reflect a new state, nothing needs to be done -> oStoringInformation should be cleared already here
			} else { // if the appstateKey really represents a new state set it to hash
				fnLogInfo("Call NavigationHandler.replaceHash", {
					appStateKey: oStoringInformation.appStateKey
				});
				oNavigationHandler.replaceHash(oStoringInformation.appStateKey);
			}
		}

		function fnRestoreGenericFilterState(oGenericData, bApplySearchIfConfigured) {
			var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
			if (oGenericData && oGenericData.editStateFilter !== undefined) {
				if (oEditStateFilter) {
					oEditStateFilter.setSelectedKey((oGenericData.editStateFilter === null) ? 0 : oGenericData.editStateFilter);
					oTemplatePrivateModel.setProperty("/listReport/vDraftState", (oGenericData.editStateFilter === null) ? 0 : oGenericData.editStateFilter);
				}
				oTemplatePrivateModel.setProperty("/listReport/activeObjectEnabled", !!oGenericData.activeStateFilter);
				oState.oMultipleViewsHandler.restoreActiveButtonState(oGenericData);
			}
			// Restore information about visible custom filters
			var aVisibleCustomFields = oGenericData && oGenericData.visibleCustomFields;
			if (aVisibleCustomFields && aVisibleCustomFields.length > 0){
				var aItems = oState.oSmartFilterbar.getAllFilterItems();
				for (var i = 0; i < aItems.length; i++){
					var oItem = aItems[i];
					var sName = oItem.getName();
					if (aVisibleCustomFields.indexOf(sName) !== -1){
						oItem.setVisibleInFilterBar(true);
					}
				}
			}
			bDataAreShownInTable = bApplySearchIfConfigured && !(oGenericData && oGenericData.suppressDataSelection);
			// In worklist, search is called at a different place
			if (bDataAreShownInTable && !oState.oWorklistData.bWorkListEnabled){
				oState.oSmartFilterbar.search();
				//collapse header in case of bookmark or if iappstate is preserved on load of LR
				collapseLRHeaderonLoad(bDataAreShownInTable);
			}
		}

		function handleVariantIdPassedViaURLParams(oNewUrlParameters,bSmartVariantManagement) {
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

			if (oState.oSmartTable && (sTableVariantId || sPageVariantId)) {
				oState.oSmartTable.attachAfterVariantInitialise(function (oEvent) {
					oState.oSmartTable.setCurrentVariantId(sTableVariantId || sPageVariantId);
				});
				// incase the control variant is already initialized
				oState.oSmartTable.setCurrentVariantId(sTableVariantId || sPageVariantId);
			}

			oState.oMultipleViewsHandler.setControlVariant(sChartVariantId, sTableVariantId, sPageVariantId);
		}

		// method is responsible for retrieving custom filter state. The corresponding extension-method has a more generic name
		// for historical reasons (change would be incompatible).
		function fnRestoreCustomFilterState(oCustomData) {
			oController.restoreCustomAppStateDataExtension(oCustomData || {});
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

		// This method is responsible for restoring the data which have been stored via getPageState.
		// However, it must be taken care of data which have been stored with another (historical) format.
		// Therefore, it is checked whether oCustomAndGenericData possesses two properties with the right names.
		// If this is this case it is assumed that the data have been stored according to curreent logic. Otherwise, it is
		// assumed that the data have been stored with the current logic. Otherwise, it is assumed that the properties have been
		// stored with a logic containing only custom properties (with possible addition of _editStateFilter).
		function fnRestorePageState(oCustomAndGenericData, bApplySearchIfConfigured) {
			oCustomAndGenericData = oCustomAndGenericData || {};
			if (oCustomAndGenericData.hasOwnProperty(dataPropertyNameCustom) && oCustomAndGenericData.hasOwnProperty(dataPropertyNameGeneric)) {
				fnRestoreExtensionFilterState(oCustomAndGenericData[dataPropertyNameExtension]);
				fnRestoreCustomFilterState(oCustomAndGenericData[dataPropertyNameCustom]);
				fnRestoreGenericFilterState(oCustomAndGenericData[dataPropertyNameGeneric], bApplySearchIfConfigured);
			} else {
				// historic format. May still have property _editStateFilter which was used generically.
				if (oCustomAndGenericData._editStateFilter !== undefined) {
					fnRestoreGenericFilterState({
						editStateFilter: oCustomAndGenericData._editStateFilter
					});
					delete oCustomAndGenericData._editStateFilter;
				}
				fnRestoreCustomFilterState(oCustomAndGenericData);
			}

			oState.oSmartFilterbar.fireFilterChange();
		}

		// returns a Promise which resolves to an iAppstate-parameter-value pair
		function getUrlParameterInfo(){
			return oAppStateIsSetPromise.then(function(){
				if (oRealizedAppState.appStateKey){
					return {
						"sap-iapp-state": oRealizedAppState.appStateKey
					};
				}
				return { };
			});
		}

		function setDataShownInTable(bDataAreShown) {
			var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
			oTemplatePrivateModel.setProperty("/generic/bDataAreShownInTable", bDataAreShown);
		}

		// This method is called when some filters or settings are changed (bFilterOrSettingsChange = true) or the data selection for the table is triggered (bDataAreShown = true).
		// It is responsible for:
		// - triggering the creation of a new appState if neccessary
		// - setting global variable bDataAreShownInTable up to date
		function changeIappState(bFilterOrSettingsChange, bDataAreShown){
			fnLogInfo("changeIappState called", {
				bFilterOrSettingsChange: bFilterOrSettingsChange,
				bDataAreShown: bDataAreShown,
				bDataAreShownInTable: bDataAreShownInTable,
				bIsTransferringUrlStateToPageState: bIsTransferringUrlStateToPageState,
				bAppStateDirty: bAppStateDirty
			});
			setDataShownInTable(bDataAreShown);
			if (bIsTransferringUrlStateToPageState){ // the changes are caused by ourselves adopting to the url. So the url needs not to be updated.
				return;
			}
			// if no settings are changed and the data shown state does not change we do not have to do anything (this is the case when the user presses 'Go' and the table is already filled).
			if (bFilterOrSettingsChange || bDataAreShown !== bDataAreShownInTable){
				bDataAreShownInTable = bDataAreShown;
				// Now we have to ensure that the new appstate is set (and put to the url). Therefore, two things have to be done:
				// - bAppStateDirty must be set to true
				// - fnStoreCurrentAppStateAndAdjustURL must be called
				// if bAppStateDirty is already true, we know that fnStoreCurrentAppStateAndAdjustURL is already registered for later execution -> nothing to do
				if (!bAppStateDirty){
					bAppStateDirty = true;
					// if filterbar dialog is open we do not call fnStoreCurrentAppStateAndAdjustURL directly. It has been registered at the filter dialog close event.
					if (!oState.oSmartFilterbar.isDialogOpen()){
						// If we are still in the process of evaluating an iappState in the url trigger the new appstate directly. Otherwise postpone it till the end of the thread.
						// Thus, when several filters are changed in one thread, fnStoreCurrentAppStateAndAdjustURL will only be called once.
						if (fnNotifyRealizedAppStateConsistent){
							fnStoreCurrentAppStateAndAdjustURL();
						} else {
							setTimeout(fnStoreCurrentAppStateAndAdjustURL, 0);
						}
					}
				}
			}
		}

		/*
		The function is to add default values in Display Currency parameter if it is not there in the Selection Variant
        @param {object} Selection Variant
`		@param {object} App data
		*/
		function addDisplayCurrency(oAppData) {
			var aMandatoryFilterItems = oState.oSmartFilterbar.determineMandatoryFilterItems(),
			sDisplayCurrency;
			for (var item = 0; item < aMandatoryFilterItems.length; item++) {
				if (aMandatoryFilterItems[item].getName().indexOf("P_DisplayCurrency") !== -1) {
					if (oAppData.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency") && oAppData.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")[0] && oAppData.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")[0].Low) {
						sDisplayCurrency = oAppData.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")[0].Low;
						if (sDisplayCurrency) {
							oAppData.oSelectionVariant.addParameter("P_DisplayCurrency", sDisplayCurrency);
						}
					}
					break;
				}
			}
		}

		// This method is called asynchronously from fnParseUrlAndApplyAppState as soon as the appstate-information from the url has been parsed completely.
		// First we check whether the parsed Appstate is still the one which is currently in the url. This is done by comparing
		// the AppStateKey contained in parameter oAppData with sAppStateKeyInUrl. If they are not equal we do not have to deal with this case.
		// Note that there is one exception: During startup due to the order of initialization we do not have sAppStateKeyInUrl set
		// when this function is called. Therefore, the method also does its job, when sAppStateKeyInUrl is still null.
		// Moreover, note that there are two main scenarios in which this method can be called.
		// 1. The AppState in the url has been changed by fnStoreCurrentAppStateAndAdjustURL. This can be detected by oStoringInformation
		// being present and containing the same AppStateKey as oAppData. In this case only oRealizedAppState needs to be adapted.
		// 2. The AppState has been changed by a new url being set (via navigation, bookmarking...). In this case the state of the list (filters,...)
		// needs to be adapted.
		function fnAdaptToAppState(oAppData, oURLParameters, sNavType){
			fnLogInfo("fnAdaptToAppState called", {
				sNavType: sNavType,
				sAppStateKeyInUrl: sAppStateKeyInUrl,
				sAppStateKey: oAppData.appStateKey,
				storingInformationAppStateKey: oStoringInformation && oStoringInformation.appStateKey
			});
			oState.oSmartFilterbar.setSuppressSelection(false);
			oState.sNavType = sNavType;
			var sAppStateKey = oAppData.appStateKey || "";
			if (bIsTransferringUrlStateToPageState){
				return;
			}
			if (sAppStateKeyInUrl === null){ // startup case
				sAppStateKeyInUrl = sAppStateKey;
			} else if (sAppStateKey !== sAppStateKeyInUrl){ // sAppStateKey is already outdated
				return;
			}
			var oNewUrlParameters = (!sAppStateKey && oURLParameters) || {};
			handleVariantIdPassedViaURLParams(oNewUrlParameters,bSmartVariantManagement);
			bIsTransferringUrlStateToPageState = true;
			var sSelectionVariant =  oAppData.selectionVariant || "";
			var sTableVariantId = (!bSmartVariantManagement && oAppData.tableVariantId) || "";
			var oSelectionVariant = oAppData.oSelectionVariant || "";
			//oStartupObject to be passed to the extension where urlParameters and selectedQuickVariantSelectionKey are optional
			var oStartupObject = {
				selectionVariant: oSelectionVariant,
				urlParameters: oURLParameters,
				selectedQuickVariantSelectionKey: ""
			};
			var oSFBSelectionVariant = new SelectionVariant(JSON.stringify(oState.oSmartFilterbar.getUiState().getSelectionVariant()));
			var oSFBSelectionVariantCopy = JSON.parse(JSON.stringify(oSFBSelectionVariant));
			var oCustomDataFromSFB = oSFBSelectionVariant.getSelectOption(dataPropertyNameCustom);
			var oGenericDataFromSFB = oSFBSelectionVariant.getSelectOption(dataPropertyNameGeneric);
			if ((oRealizedAppState.appStateKey !== sAppStateKey ||
				oRealizedAppState.selectionVariant !== sSelectionVariant ||
				oRealizedAppState.tableVariantId !== sTableVariantId ||
				fnNotEqual(oRealizedAppState.urlParams, oNewUrlParameters)) && sNavType !== sap.ui.generic.app.navigation.service.NavType.initial) {
				if (!oStoringInformation || oStoringInformation.appStateKey !== sAppStateKey){
					var bHasOnlyDefaults = oAppData && oAppData.bNavSelVarHasDefaultsOnly;
					if ((oAppData.oSelectionVariant.getSelectOptionsPropertyNames().indexOf("DisplayCurrency") === -1) && (oAppData.oSelectionVariant.getSelectOptionsPropertyNames().indexOf("P_DisplayCurrency") === -1) && (oAppData.oSelectionVariant.getParameterNames().indexOf("P_DisplayCurrency") === -1)) {
						addDisplayCurrency(oAppData);
					}
					// if there is a navigation from external application to worklist,
					// the filters from external application should not be applied since the worklist does not show smartfilterbar
					// and there is no way for the user to modify the applied filters. Hence not applying the filters only if it is worklist
					if (!oState.oWorklistData.bWorkListEnabled) {
						// Call the extension to modify selectionVariant or set tab for NavType !== iAppState as iAppState would have the modified SV values
						// or saved selected tab and hence there is no need to modify them again
						if (!bHasOnlyDefaults || oState.oSmartFilterbar.isCurrentVariantStandard()) {
							// given variant has only default values (set by user in FLP), and variant (already loaded) is not user specific
							// => default values have to be added without removing existing values (but overriding them if values for the same filter exist)
							// in case of modify extension, if given variant has only defalut values, if these values are modified through extension,
							// then they will be replaced in the filterbar accordingly
							oStartupObject.selectionVariant = oAppData.oSelectionVariant;
							if (sNavType !== sap.ui.generic.app.navigation.service.NavType.iAppState) {
								oController.modifyStartupExtension(oStartupObject);
								fnApplySelectionVariantToSFB(oStartupObject.selectionVariant, oRealizedAppState, sSelectionVariant, true);
							} else {
								fnApplySelectionVariantToSFB(oStartupObject.selectionVariant, oRealizedAppState, sSelectionVariant, !bHasOnlyDefaults);
							}
						} else {
							// if oAppData selection variant is not present, then use filter bar's variant
							fnAddOrRemoveCustomAndGenericData(oSFBSelectionVariant, oCustomDataFromSFB, oGenericDataFromSFB, true);
							oStartupObject.selectionVariant = oSFBSelectionVariant;
							oController.modifyStartupExtension(oStartupObject);
							fnAddOrRemoveCustomAndGenericData(oStartupObject.selectionVariant, oCustomDataFromSFB, oGenericDataFromSFB, false);
							// only if the extension modifies the selection variant, then set it to smart filter bar again
							if (!deepEqual(JSON.parse(JSON.stringify(oStartupObject.selectionVariant)), oSFBSelectionVariantCopy)) {
								fnApplySelectionVariantToSFB(oStartupObject.selectionVariant, oRealizedAppState, sSelectionVariant, true);
							}
						}
					}
					if (sTableVariantId !== oRealizedAppState.tableVariantId) {
						oState.oSmartTable.setCurrentVariantId(sTableVariantId);
					}
					// in case of navigation with URL parameters but no xAppState, no CustomData is provided
					oAppData.customData = oAppData.customData || {};

					var sSelectedKeyPropertyName = oState.oMultipleViewsHandler.getSelectedKeyPropertyName();
					if (sSelectedKeyPropertyName && oAppData.customData[dataPropertyNameGeneric] && oAppData.customData[dataPropertyNameGeneric][sSelectedKeyPropertyName]) {
						oState.oMultipleViewsHandler.restoreFromIappState(oAppData.customData[dataPropertyNameGeneric][sSelectedKeyPropertyName]);
					}
					if (oState.oWorklistData.bWorkListEnabled) {
						// null check done as fix for incident 1870150212
						oState.oWorklistData.oWorklistSavedData = oAppData.customData[dataPropertyNameGeneric] && oAppData.customData[dataPropertyNameGeneric]["Worklist"] ? oAppData.customData[dataPropertyNameGeneric]["Worklist"] : {};
						// restore the state of worklist from IappState
						oState.oWorklistHandler.restoreWorklistStateFromIappState();
					}
					fnRestorePageState(oAppData.customData, true);
				}
				oRealizedAppState = {
					appStateKey: sAppStateKey,
					urlParams: oNewUrlParameters,
					selectionVariant: sSelectionVariant,
					tableVariantId: sTableVariantId
				};
			}
			// this condition is used to modify selection variant when sNavType is initial.
			if (sNavType !== sap.ui.generic.app.navigation.service.NavType.iAppState) {
				//not moving this to a common place due to expected changes
				if (sNavType === sap.ui.generic.app.navigation.service.NavType.initial) {
					// do not expose generic and custom data through ext for modification
					fnAddOrRemoveCustomAndGenericData(oSFBSelectionVariant, oCustomDataFromSFB, oGenericDataFromSFB, true);
					oStartupObject.selectionVariant = oSFBSelectionVariant;
					oController.modifyStartupExtension(oStartupObject);
					// if custom or generic data exist, add it back to selection variant
					fnAddOrRemoveCustomAndGenericData(oStartupObject.selectionVariant, oCustomDataFromSFB, oGenericDataFromSFB, false);
					if (!deepEqual(JSON.parse(JSON.stringify(oStartupObject.selectionVariant)), oSFBSelectionVariantCopy)) {
						fnApplySelectionVariantToSFB(oStartupObject.selectionVariant, oRealizedAppState, sSelectionVariant, true);
					}
				}

				oState.oMultipleViewsHandler.handleStartUpObject(oStartupObject);
			}
			if (fnNotifyRealizedAppStateConsistent){
				fnNotifyRealizedAppStateConsistent();
				fnNotifyRealizedAppStateConsistent = null;
			}

			// If the NavType is iAppState the question of automated data selection is already settled.
			// Otherwise it must be done now. Note that automatisms have been disabled during startup
			// However, if bDataAreShownInTable is already true, the data have already been selected and nothing needs to be done anymore.
			// This is the case in FCL scenarios, when navigating from an automatically filled list to a detail.
			// Treat Worklist differently
			if (oState.oWorklistData.bWorkListEnabled) {
				if (sNavType === "initial" && oState.oSmartFilterbar.isCurrentVariantStandard()) {
					oState.oWorklistHandler.restoreWorklistStateFromIappState();
				}
			} else if (sNavType !== sap.ui.generic.app.navigation.service.NavType.iAppState && !bDataAreShownInTable){
				// If the app is reached via cross-app navigation by UX decision the data should be shown immediately
				var bIsCrossAppNavigation = (sNavType === sap.ui.generic.app.navigation.service.NavType.xAppState
					|| sNavType === sap.ui.generic.app.navigation.service.NavType.URLParams) && !oAppData.bNavSelVarHasDefaultsOnly;
				bDataAreShownInTable = bIsCrossAppNavigation || oState.bLoadListAndFirstEntryOnStartup || bIsAutoBinding || oState.oSmartFilterbar.isCurrentVariantExecuteOnSelectEnabled() || oState.oMultipleViewsHandler.getEnableAutoBinding();
				setDataShownInTable(bDataAreShownInTable);
				if (bDataAreShownInTable){
					oState.oSmartFilterbar.search();
					//collapse header if execute on select is checked or enableautobinding is set
					collapseLRHeaderonLoad(bDataAreShownInTable);
				}
			}
			oStoringInformation = null;
			bIsTransferringUrlStateToPageState = false;
		}

		function fnParseUrlAndApplyAppState(){
			if (!fnNotifyRealizedAppStateConsistent){
				oAppStateIsSetPromise = new Promise(function(fnResolve){
					fnNotifyRealizedAppStateConsistent = fnResolve;
				});
			}
			var oRet = new Promise(function(fnResolve, fnReject){
				var sAppStateToAnalyze = sAppStateKeyInUrl;
				var oParseNavigationPromise = oNavigationHandler.parseNavigation();
				oParseNavigationPromise.done(function(oAppData, oURLParameters, sNavType){
					fnAdaptToAppState(oAppData, oURLParameters, sNavType);
					fnResolve();
				});
				oParseNavigationPromise.fail(function(oNavError, oURLParameters, sNavType){
						/* Parsing app state has failed, so we cannot set the correct state
						 * But at least we should get into a consistent state again, so the user can continue using the app
						 */
						Log.warning(oNavError.getErrorCode(), "app state could not be parsed - continuing with empty state", "sap.suite.ui.generic.template.ListReport.controller.IappStateHandler");
						fnAdaptToAppState({
							appStateKey: sAppStateToAnalyze
						}, oURLParameters, sap.ui.generic.app.navigation.service.NavType.initial); // Use NavType initial, as this will enforce selection in case auto-binding is true.
						fnResolve();
					});
			});
			return oRet;
		}

		function onBeforeSFBVariantFetch(){
			/* new event, that is - unless the old onBeforeSFBVariantSave - also called also before the adapt filter 
			 * dialog opens. In all other cases, both events are called, so no need to implement onBeforeSFBVariantSave
			 * anymore
			 */
			var oFilterData = oState.oSmartFilterbar.getFilterData();
			// workaround since getFilterData() does not provide the content of the search field:
			var sSearchFieldValue, oBasicSearchField = oState.oSmartFilterbar.getBasicSearchControl();
			if (oBasicSearchField && oBasicSearchField.getValue){
				sSearchFieldValue = oBasicSearchField.getValue();
			}
			var oCurrentAppState = getCurrentAppState();
			oFilterData._CUSTOM = oCurrentAppState.customData;
			oState.oSmartFilterbar.setFilterData(oFilterData, true);
			if (sSearchFieldValue){ // the previous statement has blanked the content of the search field -> reset it to the stored value
				oBasicSearchField.setValue(sSearchFieldValue);
			}
			oState.oSmartFilterbar.fireFilterChange();
		}

		function onAfterSFBVariantSave(){
			changeIappState(true, bDataAreShownInTable);
		}

		function onAfterSFBVariantLoad(oEvent) {
			var sContext = oEvent.getParameter("context");
			var oData = oState.oSmartFilterbar.getFilterData();
			if (oData._CUSTOM !== undefined) {
				if (oState.oWorklistData.bWorkListEnabled) {
					var oCustomData = oData._CUSTOM[dataPropertyNameGeneric]["Worklist"];
					// if worklist data is saved in variant, then it should be applied to
					// searchfield and table rebinding has to be done to restore the state of the app
					oState.oSmartFilterbar.setSuppressSelection(false);
					oState.oWorklistData.oSearchField.setValue(oCustomData.searchString);
					oState.oWorklistData.oSearchField.fireSearch();
				} else {
					fnRestorePageState(oData._CUSTOM);
				}
			} else {
				// make sure that the custom data are nulled for the STANDARD variant
				var oCustomAndGenericData = getPageState();
				fnNullify(oCustomAndGenericData[dataPropertyNameCustom]);
				fnNullify(oCustomAndGenericData[dataPropertyNameGeneric]);
				fnRestorePageState(oCustomAndGenericData);
			}
			// store navigation context
			if (aIrrelevantVariantLoadContext.indexOf(sContext) < 0) {
				bDataAreShownInTable = oEvent.getParameter("executeOnSelect");
				changeIappState(true, bDataAreShownInTable);
			}
		}

		function onAfterTableVariantSave() {
			if (!bSmartVariantManagement){
				changeIappState(true, bDataAreShownInTable);
			}
		}

		function onAfterApplyTableVariant() {
			if (!bSmartVariantManagement){
				changeIappState(true, bDataAreShownInTable);
			}
		}

		// This method is called by the NavigationController when a new url is caught. It is the task of this method to provide the information, whether
		// the url change is just an appstate-change which can be handled by this class alone. In this case whole route-matched logic would not be started.
		// Whether this is the case is found out by checking whether oStoringInformation is currently truthy and contains the same AppStateKey as the url.
		// If this is the case we direrctly call fnParseUrlAndApplyAppState. Otherwise, it will be called later via the ComponentActivate.
		// Anyway we use this method to keep sAppStateKeyInUrl up to date.
		function isStateChange(mAppStates){
			sAppStateKeyInUrl = mAppStates["sap-iapp-state"] || "";
			if (oStoringInformation){
				if (oStoringInformation.appStateKey !== sAppStateKeyInUrl){
					Log.error("ListReport.fnStoreCurrentAppStateAndAdjustURL: Got AppstateKey " + sAppStateKeyInUrl + " expected " + oStoringInformation.appStateKey);
					return false;
				}
				fnParseUrlAndApplyAppState();
				return true;
			}
			return false;
		}

		function onSmartFilterBarInitialise(){
			bIsAutoBinding = oState.oSmartTable.getEnableAutoBinding();
			oState.oSmartFilterbar.attachFiltersDialogClosed(fnStoreCurrentAppStateAndAdjustURL);
		}

		//collapse dynamic header if data is preloaded in LR on launch
		function collapseLRHeaderonLoad(bDataAreShownInTable){
			var oTemplatePrivateModel = oController.getOwnerComponent().getModel("_templPriv");
			if (bDataAreShownInTable) {
				// if data is shown, collapse header
				oTemplatePrivateModel.setProperty("/listReport/isHeaderExpanded", false);
			} else {
				// if no data is shown on load, expand header
				oTemplatePrivateModel.setProperty("/listReport/isHeaderExpanded", true);
			}
		}

		/* This function calls the setUiState API of smartfilterbar to set the Ui State
		 * @param  {object} oSelectionVariant -  Selection variant object
		 * @param {boolean} bReplace -  Property bReplace decides whether to replace existing filter data
                 * @param {boolean} bStrictMode - Defines the filter/parameter determination, based on the name.
		*/
		function fnSetFiltersUsingUIState(oSelectionVariant, bReplace, bStrictMode) {
			var oUiState = new UIState({
				selectionVariant : oSelectionVariant
				});
			oState.oSmartFilterbar.setUiState(oUiState, {
				replace: bReplace,
				strictMode: bStrictMode
			});
        }

        /*
		The function is to add / remove Custom and Generic data from the SelectOptions of SV
		@param {object} Selection Variant
		@param {object} oCustomDataFromSFB
		@param {object} oGenericDataFromSFB
		@param {boolean} bRemove
		*/
		function fnAddOrRemoveCustomAndGenericData(oSelectionVariant, oCustomDataFromSFB, oGenericDataFromSFB, bRemove) {
			// modify selection variant only if valid generic and custom data objects are available
			if (oSelectionVariant && (oCustomDataFromSFB || oGenericDataFromSFB)) {
				if (bRemove) {
					oSelectionVariant.removeSelectOption(dataPropertyNameCustom);
					oSelectionVariant.removeSelectOption(dataPropertyNameGeneric);
				} else {
					oSelectionVariant.massAddSelectOption(dataPropertyNameCustom, oCustomDataFromSFB);
					oSelectionVariant.massAddSelectOption(dataPropertyNameGeneric, oGenericDataFromSFB);
				}
			}
		}

		/**
		 * This function apply selection properties to the smart filter bar
		 * @param  {object} oSelectionVariant
		 * @param  {object} oRealizedAppState
		 * @param  {string} sSelectionVariant
		 * @return {void}
		 */
		function applySelectionProperties(oSelectionVariant, oRealizedAppState, sSelectionVariant) {
			// even when the nav type is initial, due to modifystartup extension,new fields can be added to smartfilterbar
			if (oSelectionVariant && (oRealizedAppState.selectionVariant !== sSelectionVariant || oState.sNavType === "initial")){
				var aSelectionVariantProperties = oSelectionVariant.getParameterNames().concat(
					oSelectionVariant.getSelectOptionsPropertyNames());
				for (var i = 0; i < aSelectionVariantProperties.length; i++) {
					oState.oSmartFilterbar.addFieldToAdvancedArea(aSelectionVariantProperties[i]);
				}
			}
		}

		// map property values for property with name sFirstProperty to values for property with name sSecondProperty in oSelectionVariant
		function fnAlignSelectOptions(oSelectionVariant, sFirstProperty, sSecondProperty){
			if (oSelectionVariant.getParameter(sFirstProperty) && !oSelectionVariant.getParameter(sSecondProperty)){
				oSelectionVariant.addParameter(sSecondProperty, oSelectionVariant.getParameter(sFirstProperty));
			}
			if (oSelectionVariant.getSelectOption(sFirstProperty) && !oSelectionVariant.getSelectOption(sSecondProperty)){
				var aSelectOption = oSelectionVariant.getSelectOption(sFirstProperty);
				aSelectOption.forEach(function(oSelectOption){
					oSelectionVariant.addSelectOption(sSecondProperty, oSelectOption.Sign, oSelectOption.Option, oSelectOption.Low, oSelectOption.High);
				});
			}
		}

		function fnMapEditableFieldFor(oSelectionVariant){
			var oMetaModel = oController.getOwnerComponent().getModel().getMetaModel();
			var sEntitySet = oController.getOwnerComponent().getEntitySet();
			var oEntityType = oMetaModel.getODataEntityType(oMetaModel.getODataEntitySet(sEntitySet).entityType);
			oEntityType.property.forEach(function(oProperty){
				if (oProperty["com.sap.vocabularies.Common.v1.EditableFieldFor"]){
					var sKeyProperty = oProperty["com.sap.vocabularies.Common.v1.EditableFieldFor"].String;
					var sForEditProperty = oProperty.name;
					// map key fields to corresponding for edit properties to provide values in SFB (without mapping in FLP)
					fnAlignSelectOptions(oSelectionVariant, sKeyProperty, sForEditProperty);
					// and vice versa if field is mapped in FLP (formerly recommended), but original field used in SFB (never recommended)
					fnAlignSelectOptions(oSelectionVariant, sForEditProperty, sKeyProperty);
				}
			});
		}

		function fnApplySelectionVariantToSFB(oSelectionVariant, oRealizedAppState, sSelectionVariant, bReplace){
			fnMapEditableFieldFor(oSelectionVariant);
			applySelectionProperties(oSelectionVariant, oRealizedAppState, sSelectionVariant);
			fnSetFiltersUsingUIState(oSelectionVariant.toJSONObject(), bReplace, /* bStrictMode = */ false);
		}



		// Make the getCurrentAppState function available for others via the oState object
		oState.getCurrentAppState = getCurrentAppState;

		return {
			areDataShownInTable: areDataShownInTable,
			parseUrlAndApplyAppState: fnParseUrlAndApplyAppState,
			getUrlParameterInfo: getUrlParameterInfo,
			changeIappState: changeIappState,
			onSmartFilterBarInitialise: onSmartFilterBarInitialise,
			onBeforeSFBVariantFetch: onBeforeSFBVariantFetch,
			onAfterSFBVariantSave: onAfterSFBVariantSave,
			onAfterSFBVariantLoad: onAfterSFBVariantLoad,
			onAfterTableVariantSave: onAfterTableVariantSave,
			onAfterApplyTableVariant: onAfterApplyTableVariant,
			isStateChange: isStateChange
		};
	}

	return BaseObject.extend("sap.suite.ui.generic.template.ListReport.controller.IappStateHandler", {
		constructor: function(oState, oController, oTemplateUtils) {
			extend(this, getMethods(oState, oController, oTemplateUtils));
		}
	});
});
