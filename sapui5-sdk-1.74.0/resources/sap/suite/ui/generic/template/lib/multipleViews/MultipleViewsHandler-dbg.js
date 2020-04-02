sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/model/Filter",
	"sap/suite/ui/generic/template/lib/multipleViews/MultipleTablesModeHelper",
	"sap/suite/ui/generic/template/lib/multipleViews/SingleTableModeHelper",
	"sap/ui/generic/app/navigation/service/SelectionVariant",
	"sap/suite/ui/generic/template/lib/MetadataAnalyser",
	"sap/base/Log",
	"sap/suite/ui/generic/template/lib/testableHelper",
	"sap/base/util/extend",
	"sap/base/security/encodeURL",
	"sap/ui/comp/util/DateTimeUtil",
	"sap/base/util/isEmptyObject"
], function(BaseObject, Filter, MultipleTablesModeHelper, SingleTableModeHelper, SelectionVariant, MetadataAnalyser, Log, testableHelper, extend, encodeURL, DateTimeUtil, isEmptyObject) {
	"use strict";

	// This class handles one instance of the multiple views feature. This means that it covers one "logical" occurance of a table/chart possessing multiple "views"
	// can be switched by the user via a suitable "switching facility" (e.g. table tabs).
	// Note that each of these views can be identified by a key.
	// Technically, there are two ways to achieve this:
	// 1. Exactly one smart control is used to implement this. Whenever the views are switched this control is reconfigured.
	// 2. Each view is implemented via a separate smart control. Whenever the views are switched the corresponding control is set to visible and all other controls are set to invisible.
	// Note that the second possibility is much more flexible, since it allows to mix the implementing controls (tables and charts) and even use different entity sets for each control.
	// 1 is called "Single views mode", 2 is called "Multiple views mode"
	// Parameters:
	// - oTemplateUtils: The utilities for the view that hosts the multiple view
	// - oController: The controller of the view that hosts the multiple view
	// - oConfiguration: Configuration of this class (also callbacks) containing floorplan specific logic. This contains the following properties:
	//   + manifestSettings: the settings from the manifest defining the multiple views
	//   + pathInTemplatePrivateModel: a prefix for the pathes of all properties in TemplatePrivateModel being connected with this multiple views instance
	//   + smartControl: In Single views mode this is the (smart) control which implements the corresponding multiple views. In Multiple views mode this is faulty.
	//   + getSmartControl: a function that returns the smartControl for a given key (only needed if smartControl is faulty)
	//   + switchingControl: the control which is used to switch between the views. It must possess a getItems() method.
	//   + getSearchValue : optional function to retrive current value of the search field
	//   + smartFilterBar : optional smartFilterBar which is present only in the list report
	//   +	isDataToBeShown : function tells whether to retrieve data
	// + adaptRefreshRequestMode: optional function to adapt the refresh request
	function getMethods(oController, oTemplateUtils, oConfiguration) {
		// maps the keys of the switching facility to meta information about the corresponding view. This meta information contains the following properties:
		var mSwitchingKeyToViewMeta = Object.create(null);
		// - smartControl: The smart table/chart implementing the view
		// templateSortOder : TODO
		// selectedTabText : returns the custom text of the icon tab header
		// getPath : function to get bindingpath for either table or chart
		// templateSortOrder : stores the sorting order
		// getPath function that return the path of the control
		// selectionVariantFilters : stores the selectionVariant Filters for the smartcontrtol
		// numberofUpdates : count for number of updates
		// updateStartFunction : function that starts the busy indicator and increments the update count
		// updateSuccessFunction: function that does processing of count after function call is done
		// updateErrorFunction : function that shows the error , if an error is encountered
		// implementingHelperAttributes : holds the attributes of implementing helper which is either single or multi mode
		//             1. ignoredLabels : contains all the labels of the ignored filters fnHandlerForNonMultiFilters will store the ignoredLabels and pass on
		//             2.entityTypeProperty: contains the entity property of the implementing helper ( fnGetImplementingHelperAttributes will return the property)
		var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel(); // the template private model used to transfer data between javascript and UI
		// more doc
		var sPathToItems = oConfiguration.pathInTemplatePrivateModel + "/items";
		// more doc
		var sPathToSelectedKey = oConfiguration.pathInTemplatePrivateModel + "/selectedKey";
		oTemplatePrivateModel.setProperty(oConfiguration.pathInTemplatePrivateModel, Object.create(null));
		oTemplatePrivateModel.setProperty(sPathToItems, Object.create(null));

		var oImplementingHelper = new (oConfiguration.smartControl ? SingleTableModeHelper : MultipleTablesModeHelper)(oController, oTemplateUtils, oConfiguration);
		oTemplatePrivateModel.setProperty(oConfiguration.pathInTemplatePrivateModel + "/mode", oImplementingHelper.getMode());

		var iDefaultDelayMs = oTemplateUtils.oServices.oApplication.getBusyHelper().getBusyDelay();
		var oModel = oController.getOwnerComponent().getModel();
		var sDefaultSelectedKey;
		var bShowCounts;

		// changes over the time frequently
		var sSelectedKey;

		// var oModel = oController.getView().getModel();
		function fnUpdateCounts() {
			if (bShowCounts) {
				var sSearchValue = oConfiguration.getSearchValue && oConfiguration.getSearchValue();
				var oSearch = sSearchValue ? {
					search: sSearchValue
				} : {};
				for (var sKey in mSwitchingKeyToViewMeta) {
					var oViewMeta =  mSwitchingKeyToViewMeta[sKey];
					var sPath = oViewMeta.getPath();
					oViewMeta.numberOfUpdates++; // start a new update call
					oViewMeta.updateStartFunction(oViewMeta.numberOfUpdates); // set counter busy
					oModel.read(sPath + "/$count", {
						urlParameters: oSearch,
						filters: oViewMeta.getFiltersForCount(),
						groupId: "updateMultipleViewsItemsCounts", // send the requests for all count updates in one batch request
						success: oViewMeta.updateSuccessFunction.bind(null, oViewMeta.numberOfUpdates), // bind the success handler to the current request
						error: oViewMeta.errorFunction.bind(null, oViewMeta.numberOfUpdates) // bind the error handler to the current request
					});
				}
			}
		}

		/*
		 * Resolves the path for a parameterized entityset
		 * @param {object} oEntitySet - object containing current entityset information
		 * @param {object} oParameterInfo - object containing parameter info
		 * @return {string} sPath - resolved path used to fetch count
		 */
		function fnResolveParameterizedEntitySet(oEntitySet, oParameterInfo) {
			var sPath = "";
			var aParameters = oParameterInfo["parameters"];

			if (!oParameterInfo || !oParameterInfo.entitySetName || !oParameterInfo.navPropertyName || aParameters.length < 1) {
				sPath = "/" + oEntitySet.name;
				return sPath;
			}

			var aFilterParams = oConfiguration.smartFilterbar && oConfiguration.smartFilterbar.getAnalyticalParameters();
			if (aFilterParams && aFilterParams.length > 0) {
				//Read the parameters from the smartfilterbar and build the binding path
				var oUiState = oConfiguration.smartFilterbar && oConfiguration.smartFilterbar.getUiState({
					allFilters: false
				});
				var sSelectionVariant = oUiState ? JSON.stringify(oUiState.getSelectionVariant()) : "{}";
				var oSelectionVariant = new SelectionVariant(sSelectionVariant);
				var aApplicableParams = [];
				//For each parameter in the parameter set, check if it is present in the filterparams.
				aParameters.forEach(function(sParam) {
					aFilterParams.forEach(function(oFilterParam) {
						if (oFilterParam && (oFilterParam.name === sParam)){
							var sParameterName = oFilterParam.name;
							//To get the current value of the parameter
							// refactoring if required: need to check if sSelectionVariant is empty object
							var sValue = oSelectionVariant.getParameter(sParameterName);
							//Fix BCP : 1970602412 Count is not being update in case of parameterized entityset having date as a parameter.
							if (oFilterParam.type === 'Edm.DateTime') {
								sValue = new Date(sValue);
								sValue = DateTimeUtil.localToUtc(sValue);
								sValue = encodeURL(oFilterParam.control.getModel().formatValue(sValue, oFilterParam.type));
								aApplicableParams.push(sParameterName + '=' + sValue);
							} else {
								aApplicableParams.push(sParameterName + '=' + "'" + sValue + "'");
							}
						}
					});
				});
				sPath = '/' + oParameterInfo.entitySetName + '(' + aApplicableParams.join(',') + ')/' + oParameterInfo.navPropertyName;
			} else {
				sPath = "/" + oEntitySet.name;
				Log.error("SelectionParameters", "There are no parameters to resolve");
				return sPath;
			}
			return sPath;
		}

		function fnGetPath(oSmartControl) {
			var sBindingPath;
			var sTableEntitySet = oSmartControl.getEntitySet();
			if (oConfiguration.smartFilterbar && oConfiguration.smartFilterbar.getConsiderAnalyticalParameters && oConfiguration.smartFilterbar.getConsiderAnalyticalParameters()) {
				var oMetaModel = oModel.getMetaModel();
				var oEntitySet = oMetaModel.getODataEntitySet(sTableEntitySet);
				var oMetadataAnalyser = new MetadataAnalyser(oController);
				var oParameterInfo = oMetadataAnalyser.getParametersByEntitySet(sTableEntitySet);
				sBindingPath = fnResolveParameterizedEntitySet(oEntitySet, oParameterInfo);
				return sBindingPath;
			}
			var sTableOrChartBindingPath = oSmartControl.getTableBindingPath ? oSmartControl.getTableBindingPath() : oSmartControl.getChartBindingPath();
			sBindingPath = sTableOrChartBindingPath ? sTableOrChartBindingPath : "/" + sTableEntitySet;
			// add binding context of the page (if there is one) to the binding path
			var oBindingContext = oSmartControl.getBindingContext();
			return oBindingContext ? oBindingContext.getPath() + '/' + sBindingPath : sBindingPath;
		}

		function getSelectionVariantFilters(oSmartControl, oCustomData) {
			var oMetaModel = oModel.getMetaModel();
			var sEntitySet = oSmartControl.getEntitySet();
			var oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
			var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
			var aSelectionVariantFilters = [], oSelectionVariantPath;
			var sSelectionVariantPath = oCustomData.variantAnnotationPath;
			if (sSelectionVariantPath) {
				var oVariant = oEntityType[sSelectionVariantPath];
				if (!oVariant) {
					return [];
				}
				if (!oVariant.SelectOptions && oVariant.SelectionVariant) {
					// for SelectionPresentationVariants, make sure to refer to SelectionVariant
					oVariant = oVariant.SelectionVariant;
					if (oVariant.Path) {
						// resolve reference to SelectionVariant via path
						sSelectionVariantPath = oVariant.Path.split("@")[1];
						oVariant = sSelectionVariantPath && oEntityType[sSelectionVariantPath];
					}
				}
				if (oVariant.AnnotationPath) {
					oSelectionVariantPath = oVariant.AnnotationPath.split("@")[1];
					oVariant = oEntityType[oSelectionVariantPath];
				}
				for (var i in oVariant.SelectOptions) {
					if (oVariant.SelectOptions[i].PropertyName) {
						var sPath = oVariant.SelectOptions[i].PropertyName.PropertyPath;
						for (var j in oVariant.SelectOptions[i].Ranges) {
							var oOperator = oVariant.SelectOptions[i].Ranges[j].Option;
							oOperator.EnumMember = oOperator.EnumMember.replace("com.sap.vocabularies.UI.v1.SelectionRangeOptionType/", "");
							var oValueLow = oVariant.SelectOptions[i].Ranges[j].Low;
							var oValueHigh = oVariant.SelectOptions[i].Ranges[j].High;
							var sKeyLow = Object.keys(oValueLow)[0];
							if (oValueHigh) {
								var sKeyHigh = Object.keys(oValueHigh)[0];
								aSelectionVariantFilters.push(new Filter(sPath, oOperator.EnumMember, oValueLow[sKeyLow], oValueHigh[sKeyHigh]));
							} else {
								aSelectionVariantFilters.push(new Filter(sPath, oOperator.EnumMember, oValueLow[sKeyLow]));
							}
						}
					}
				}
			}
			return aSelectionVariantFilters;
		}


		function fnHasEntitySet(sEntitySet){
			for (var sKey in mSwitchingKeyToViewMeta) {
				var oViewMeta =  mSwitchingKeyToViewMeta[sKey];
				if (oViewMeta.smartControl.getEntitySet() === sEntitySet){
					return true;
				}
			} return false;
		}

		function fnOnRebindContentControl(oBindingParams, aFiltersFromSmartTable) {
			// Array.slice to make a copy of the array
			var aFilters = oBindingParams.filters.slice(0);
			var oCurrentViewMeta = fnGetCurrentViewMeta();
			// not for the counts, this is for the table or the chart
			oBindingParams.filters = fnAdaptFiltersToItem(oBindingParams.filters, oCurrentViewMeta, aFiltersFromSmartTable, false);
			if (bShowCounts) {
				for (var sKey in mSwitchingKeyToViewMeta) {
					var oViewMeta =  mSwitchingKeyToViewMeta[sKey];
					fnPrepareMetaForUpdateCount(aFilters, oViewMeta, aFiltersFromSmartTable);
				}
			}

		}

		function fnPrepareMetaForUpdateCount(aFilters, oViewMeta, aFiltersFromSmartTable){
			oViewMeta.getFiltersForCount = function () {
				// this one is to get the counts
				return fnAdaptFiltersToItem(aFilters, oViewMeta, aFiltersFromSmartTable, true);
			};
		}

		function fnAdaptFiltersToItem(aFilters, oViewMeta, aFiltersFromSmartTable, bForCount) {
			if (oImplementingHelper.getFiltersAdaptedFromItem) {
				aFilters = oImplementingHelper.getFiltersAdaptedFromItem(aFilters, oViewMeta, aFiltersFromSmartTable, bForCount);
			}
			return aFilters.concat(oViewMeta.selectionVariantFilters);
		}

		function fnGetCurrentViewMeta() {
			return mSwitchingKeyToViewMeta[sSelectedKey]; // return metadata of selected item
		}

		function fnFormatMessageStrip(aIgnoredFilters,  sSelectedKey) {
			return oImplementingHelper.formatMessageStrip(aIgnoredFilters, sSelectedKey);
		}

		function fnGetSelectedKey(){
			return sSelectedKey;
		}

		function fnSetSelectedKey(sSelectedKey){
			oTemplatePrivateModel.setProperty(sPathToSelectedKey, sSelectedKey || sDefaultSelectedKey);
		}


		function fnGetContentForIappState(){
			return oImplementingHelper.getContentForIappState(sSelectedKey);
		}

		function fnFormatItemTextForMultipleView(oItemDataModel) {
			var sFormatedValue;
			if (!oItemDataModel) {
				return "";
			}
			if (oItemDataModel.state === "error") {
				return oTemplateUtils.oCommonUtils.getText("SEG_BUTTON_ERROR", oItemDataModel.text); // originally the text was for segmented button only but is now used for all texts with multiple views
			}
			if (oItemDataModel.state === "" || oItemDataModel.state === "busy") {
				var oIntegerInstance = sap.ui.core.format.NumberFormat.getIntegerInstance({
					groupingEnabled: true
				});
				sFormatedValue = oIntegerInstance.format(oItemDataModel.count);
			}
			// originally the text was for segmented button only but is now used for all texts with multiple views
			return oTemplateUtils.oCommonUtils.getText("SEG_BUTTON_TEXT", [oItemDataModel.text, oItemDataModel.state === "busyLong" ? "..." : sFormatedValue]);
		}

		function fnRestoreFromIappState(oState) {
			sSelectedKey = oImplementingHelper.getSelectedKeyAndRestoreFromIappState(oState);
			if (mSwitchingKeyToViewMeta[sSelectedKey]){
				oTemplatePrivateModel.setProperty(sPathToSelectedKey, sSelectedKey);
			}
		}

		function fnDetermineSortOrder() {
			return mSwitchingKeyToViewMeta[sSelectedKey].templateSortOrder;
		}

		function fnRefreshOperationOnCurrentSmartControl(iRequest){
			var oCurrentViewMeta = fnGetCurrentViewMeta();
			var bIsSmartTable = oTemplateUtils.oCommonUtils.isSmartTable(oCurrentViewMeta.smartControl);
			if (iRequest !== 2){ // rebind needed
				oCurrentViewMeta.smartControl[bIsSmartTable ? "rebindTable" : "rebindChart"]();
			}
			if (iRequest > 1){ // refresh needed
				if (bIsSmartTable){
					oTemplateUtils.oCommonUtils.refreshModel(oCurrentViewMeta.smartControl);
					oTemplateUtils.oCommonUtils.refreshSmartTable(oCurrentViewMeta.smartControl);
				} else {
					// todo ?
				}
			}
		}

		// Perform a refresh operation (refresh or rebind) on a subset of the given tabs.
		// Only performs the action if multiple views are active. Then it returns true.
		// Otherwise it returns false.
		// iRequest: 1 = rebind, 2 = refresh, 3 = both
		// vTabKey: If it is truthy, then it is either a tab key or an array of tab keys. In this case only the specified tab keys are affected.
		// mEntitySets: Only considered when vTabKey is faulty. Then, if mEntitySets is truthy it is expected to be a map that has entity sets as keys.
		//              Only those tabs are affected by this call that are bound to an entity set that is mapped onto a truthy value in this map.
		// If vTabKey and mEntitySets are both faulty, all tabs are affected
		function fnRefreshOperation(iRequest, vTabKey, mEntitySets){
			var bIsTabKeyArray = Array.isArray(vTabKey);
			var bIsComponentVisible = oTemplateUtils.oComponentUtils.isComponentActive();
			if ((bIsTabKeyArray && vTabKey.length === 0) || (mEntitySets && isEmptyObject(mEntitySets))){
				return;
			}
			oImplementingHelper.refreshOperation(iRequest, vTabKey, mEntitySets, sSelectedKey, bIsTabKeyArray, bIsComponentVisible, fnRefreshOperationOnCurrentSmartControl);
		}

		function fnSetActiveButtonState() {
			var oCurrentViewMeta = fnGetCurrentViewMeta();
			return oImplementingHelper.setActiveButtonState(oCurrentViewMeta);
		}

		function fnRestoreActiveButtonState() {
			var oCurrentViewMeta = fnGetCurrentViewMeta();
			return oImplementingHelper.restoreActiveButtonState && oImplementingHelper.restoreActiveButtonState(oCurrentViewMeta);
		}

		function fnSetControlVariant(sChartVariantId, sTableVariantId, sPageVariantId) {
			if (oImplementingHelper.setControlVariant) {
				oImplementingHelper.setControlVariant(sChartVariantId, sTableVariantId, sPageVariantId);
			}
		}

		function fnGetCustomDataText(oElement, sPathToTheItem, oModelEntry, oViewMeta) {
			return oTemplateUtils.oCommonUtils.getCustomDataText(oElement)
				.then(function(sText) {
					oModelEntry.text = sText;
					oViewMeta.text = sText;
					return {
						modelEntry: oModelEntry,
						pathToTheItem: sPathToTheItem
					};
				});
		}

		function fnSetCustomDataText(oResult) {
			oTemplatePrivateModel.setProperty(oResult.pathToTheItem, oResult.modelEntry);
		}

		// refactor: remove init in all files
		(function() { // constructor coding encapsulated in order to reduce scope of helper variables


			testableHelper.testable(function(){
				return oImplementingHelper;
			}, "getImplementingHelper");
			testableHelper.testable(function(){
				return bShowCounts;
			}, "getShowCounts");
			testableHelper.testable(function(){
				return mSwitchingKeyToViewMeta[sSelectedKey];
			}, "getCurrentViewMeta");


			// collect meta information for each view and store it in mSwitchingKeyToViewMeta

			var fnUpdateFunction = function(oViewMeta, sState, iNumberOfUpdates, iNewCount) {
				if (oViewMeta.numberOfUpdates !== iNumberOfUpdates) { // this is the response for an outdated request
					return;
				}
				var sPathToTheItem = sPathToItems + "/" + oViewMeta.switchingKey;
				var oModelEntry = extend({}, oTemplatePrivateModel.getProperty(sPathToTheItem)); // must create a new instance. Otherwise UI5 will not recognize the change
				if (!oModelEntry.state && sState == "busy") {
					setTimeout(function() {
						if (oTemplatePrivateModel.getProperty(sPathToTheItem).state === "busy") {
							oModelEntry = extend({}, oTemplatePrivateModel.getProperty(sPathToTheItem)); // must create a new instance. Otherwise UI5 will not recognize the change
							oModelEntry.state = "busyLong";
							oTemplatePrivateModel.setProperty(sPathToTheItem, oModelEntry); // Note that this will trigger the call of formatItemTextForMultipleView
						}
					}, iDefaultDelayMs);
				}
				oModelEntry.state = sState; // update the state
				if (!sState) { // determination was successfull -> update the count
					oModelEntry.count = iNewCount;
				}
				oTemplatePrivateModel.setProperty(sPathToTheItem, oModelEntry); // Note that this will trigger the call of formatItemTextForMultipleView
			};

			var aSwitchingItems = oConfiguration.switchingControl.getItems();
			for (var i = 0; i < aSwitchingItems.length; i++){
				var oSwitchingItem = aSwitchingItems[i];
				var sSwitchingItemKey = oSwitchingItem.getKey();
				if ( i === 0 ){
					// first item selected
					sDefaultSelectedKey = sSwitchingItemKey;
				}
				var oViewMeta = {
					smartControl: oConfiguration.smartControl || oConfiguration.getSmartControl(sSwitchingItemKey),
					switchingKey: sSwitchingItemKey
				};
				var oCustomDataHost = oImplementingHelper.getCustomDataHost(oViewMeta.smartControl, oSwitchingItem);
				var oCustomData = oTemplateUtils.oCommonUtils.getElementCustomData(oCustomDataHost);
				var sPathToTheItem = sPathToItems + "/" + oViewMeta.switchingKey;
				var oModelEntry = Object.create(null);
				oModelEntry.text = oCustomData.text;
				oModelEntry.count = 0; // at initialization 0 will be displayed as counter everywhere
				oModelEntry.state = "";
				oModelEntry.facetId = oConfiguration.sectionKey;
				fnGetCustomDataText(oCustomDataHost, sPathToTheItem, oModelEntry, oViewMeta).then(fnSetCustomDataText);
				oViewMeta.templateSortOrder = oCustomData.TemplateSortOrder;
				oViewMeta.getPath = fnGetPath.bind(null, oViewMeta.smartControl);
				oViewMeta.selectionVariantFilters = getSelectionVariantFilters(oViewMeta.smartControl, oCustomData);
				oViewMeta.numberOfUpdates = 0;
				oViewMeta.updateStartFunction = fnUpdateFunction.bind(null, oViewMeta, "busy");
				oViewMeta.updateSuccessFunction = fnUpdateFunction.bind(null, oViewMeta, "");
				oViewMeta.errorFunction = fnUpdateFunction.bind(null, oViewMeta, "error");
				// oViewMeta.getFilters = fnGetFilters.bind(null, oViewMeta);
				mSwitchingKeyToViewMeta[sSwitchingItemKey] = oViewMeta;
			}

			if (oImplementingHelper.init) {
				oImplementingHelper.init(mSwitchingKeyToViewMeta, fnRefreshOperation, fnGetCurrentViewMeta);
			}

			// only for the case where its not defined in manifest
			// if the confiugration is not present for different entity sets the defaults showcount is true else false
			// by default the different entity sets show count is true, should be explicity set to showCounts to false if we dont want count to be displayed
			if (oConfiguration.manifestSettings.showCounts === undefined) {
				bShowCounts = oImplementingHelper.getDefaultShowCounts();
			} else {
				bShowCounts = oConfiguration.manifestSettings.showCounts;
			}
			fnSetSelectedKey();
			sSelectedKey = oTemplatePrivateModel.getProperty(sPathToSelectedKey);
			// register for change of the tabs
			var oBinding = oTemplatePrivateModel.bindProperty(sPathToSelectedKey);
			oBinding.attachChange(function(oChangeEvent) {
				var sNewKey = oChangeEvent.getSource().getValue();
				if (sNewKey === sSelectedKey) {
					return;
				}
				sSelectedKey = sNewKey;
				if (oImplementingHelper.onSelectedKeyChanged) {
					oImplementingHelper.onSelectedKeyChanged(sNewKey);
				}
				var bDataToBeShown = oConfiguration.isDataToBeShown();
				var iRequest = oImplementingHelper.getRefreshMode(sSelectedKey);
				if (oConfiguration.adaptRefreshRequestMode) {
					iRequest = oConfiguration.adaptRefreshRequestMode(iRequest);
					if (bDataToBeShown && iRequest > 0){
						fnRefreshOperationOnCurrentSmartControl(iRequest);
					} else {
						// need to update the toolbar button visibility here as the delete button would not be updated otherwise
						// see BCP:1770601204
						var oSmartControl = fnGetCurrentViewMeta().smartControl;
						oTemplateUtils.oCommonUtils.setEnabledToolbarButtons(oSmartControl);
					}
				}
				oConfiguration.appStateChange();
			});
		})();

		// public instance methods
		return {
			updateCounts: fnUpdateCounts,
			refreshOperation: fnRefreshOperation,
			onRebindContentControl: fnOnRebindContentControl,
			formatMessageStrip: fnFormatMessageStrip,
			getSelectedKey: fnGetSelectedKey,
			setSelectedKey: fnSetSelectedKey,
			getContentForIappState: fnGetContentForIappState,
			restoreFromIappState: fnRestoreFromIappState,
			formatItemTextForMultipleView: fnFormatItemTextForMultipleView,
			determineSortOrder: fnDetermineSortOrder,
			setActiveButtonState: fnSetActiveButtonState,
			restoreActiveButtonState: fnRestoreActiveButtonState,
			setControlVariant: fnSetControlVariant,
			hasEntitySet: fnHasEntitySet
		};
	}

	return BaseObject.extend("sap.suite.ui.generic.template.lib.multipleViews.MultipleViewsHandler", {
		constructor: function(oController, oTemplateUtils, oConfiguration) {
			extend(this, getMethods(oController, oTemplateUtils, oConfiguration));
		}
	});
});
