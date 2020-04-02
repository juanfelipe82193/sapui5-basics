sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/Device",
	"sap/ui/model/Filter",
	"sap/suite/ui/generic/template/lib/testableHelper",
	"sap/base/util/extend"
], function(BaseObject, Device, Filter, testableHelper, extend) {
	"use strict";
	/*
	 * This class is a helper class for the generic class XltipleViewsHandler. More, precisely an instance of
	 * this class is created in the constructor of that class in case, that the multiple table mode of the multiple views feature
	 * has been switched on.
	 * The mode can be switched on and configured via the quickVariantSelectionX.variants section in the manifest.
	 * You can have either a SmartTable or a SmartChart per a tab.
	 * We check under the corresponding SelectionPresentationVariant/PresentationVariant/Vizualizations or PresentationVariant/Vizualizations the first entry in the collection.
	 *  If it is a UI.LineItem then a corresponding SmartTable will be generated. If it is a UI.Chart then a SmartChart is displayed.
	 */

	// This function performs an analysis on a filterable vFilter.
	// Thereby, a filterable is either an instance of Filter or an array of filterables.
	// fnHandlerForNonMultiFilters is a function that receives an instance of Filter, which is not a multi filter and returns
	// either an instance of Filter or null.
	// This function returns a filterable (or null) by applying fnHandlerForNonMultiFilters recursvely to all non-multi filters contained in vFilter.
	// Thereby, all non-multi filters for which fnHandlerForNonMultiFilters returns null are eliminated.
	// All other non-multi filters are replaced by their image under fnHandlerForNonMultiFilters.
	// In particular: When fnHandlerForNonMultiFilters returns null for all these non-multi filters, then this function returns
	// an empty array (when vFilter was an array) resp. null (when vFilter was an instance of Filter).
	// If fnHandlerForNonMultiFilters acts as identity function on all non-multi filters recursively contained in vFilter then this function acts as identity on vFilter.
	function fnHandleUnapplicableFilters(vFilter, fnHandlerForNonMultiFilters){
		// first handle the case that vFilter is an array of filterables
		if (Array.isArray(vFilter)){
			var bOriginalOk = true; // remains true as long as no entry of vFilter has been identified which needs to be modified by this function
			var aAlternativeFilters; // is used as soon as one entry in vFilter needs to be modified
			for (var i = 0; i < vFilter.length; i++){
				var oFilter = fnHandleUnapplicableFilters(vFilter[i], fnHandlerForNonMultiFilters);
				if (bOriginalOk){ // up to index i-1 no need for modofication was found
					if (oFilter === vFilter[i]){ // index i needs not to be modified, too
						continue;
					}
					bOriginalOk = false; // index i is the first one which shows a need for modification
					aAlternativeFilters = vFilter.slice(0, i); // create a copy which contains the first i-1 entries
				}
				if (oFilter){ // when this point is reached a modofication has been found -> add oFilter to aAlternativeFilters if applicable
					aAlternativeFilters.push(oFilter);
				}
			}
			return bOriginalOk ? vFilter : aAlternativeFilters; // if no modification is needed return the original, otherwise the copy
		}
		// if this point is reached vFilter is an instance of Filter
		if (vFilter.aFilters){ // if vFilter is a multiple filter perform a recursive analysis of the contained filters
			var aNewFilters = fnHandleUnapplicableFilters(vFilter.aFilters, fnHandlerForNonMultiFilters);
			if (aNewFilters === vFilter.aFilters){ // if nothing is modified return the original filter
				return vFilter;
			}
			if (aNewFilters.length === 0){ // all filters have been removed -> return null
				return null;
			}
			if (aNewFilters.length === 1){ // only one filter is left -> this filter can replace the original filter
				return aNewFilters[0];
			}
			return new Filter({ // return a new multi filter with the same operator and the new ingredients
				filters: aNewFilters,
				and: vFilter.bAnd
			});
		}
		return fnHandlerForNonMultiFilters(vFilter); // non-multi filters are directly handled by fnHandlerForNonMultiFilters
	}
	// oController is the controller of the enclosing ListReport
	// oTemplateUtils are the template utils as passed to the controller implementation
	// oConfiguration contains all the configuration information
	function getMethods(oController, oTemplateUtils, oConfiguration) {
		// initialized in fnInit
		var mSwitchingKeyToViewMeta;
		var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
		var sPathInModel = oConfiguration.pathInTemplatePrivateModel + '/implementingHelper';
		var sIgnoredFiltersPath = sPathInModel + "/ignoredFilters";
		oTemplatePrivateModel.setProperty(sPathInModel, {ignoredFilters: []});
		// In multiple table mode the customData containing the specific information for each view are contained in the corresponding smart control

		function fnGetCustomDataHost(oSmartControl, oSwitchingItem){
			return oSmartControl;
		}

		function fnGetDefaultShowCounts(){
			var sFirstEntitySet;
			for (var sSwitchingKey in mSwitchingKeyToViewMeta) {
				var oViewMeta = mSwitchingKeyToViewMeta[sSwitchingKey];
				var sEntitySet = oViewMeta.smartControl.getEntitySet();
				if (sFirstEntitySet && sFirstEntitySet !== sEntitySet) {
					// for different entity set showcount should be true
					return true;
				}
				sFirstEntitySet = sEntitySet;
			}
			return false;
		}

		function fnGetFiltersAdaptedFromItem(aFilters, oViewMeta, aFiltersFromSmartTable, bForCount){
			//	If bForCounts is true ignore the filters coming from the table settings,
			// since the counts should not be influenced by these filters, which are located hierarchically below the counts
			if (aFiltersFromSmartTable && bForCount) {
				fnRemoveTableSettingsFromFilters(aFilters, aFiltersFromSmartTable);
			}
			var oSmartFilterBar = oConfiguration.smartFilterBar;
			if (!oSmartFilterBar) {
				return aFilters;
			}
			var aSmartFilterBarFilters = oSmartFilterBar.getFilters();

			if (aSmartFilterBarFilters.length < 1) {
				if (!bForCount) {
					oTemplatePrivateModel.setProperty(sIgnoredFiltersPath, []);
					// storing all the ignored filters of selected tab
					oViewMeta.implementingHelperAttributes.ignoredLabels = [];
				}
				return aFilters;
			}
			var mIgnoredFilters = !bForCount && Object.create(null);

			aSmartFilterBarFilters = fnCleanupIrrelevantFilters(oViewMeta, aSmartFilterBarFilters, mIgnoredFilters);

			return aSmartFilterBarFilters.concat(aFilters);
		}

		/*
		 * returns the property name of the path
		 * the path can be a simple one like 'adress' or contain navigation properties like 'adress/street'
		 */
		function getPropertyName(sPath) {
			var aParts, sPropertyName;
			if (sPath.indexOf("/") !== -1) { // sPath contains at least one navigation property
				aParts = sPath.split("/");
				sPropertyName = aParts.pop(); // the last one will be the property name
			} else {
				sPropertyName = sPath;
			}
			return sPropertyName;
		}

		function fnCleanupIrrelevantFilters(oViewMeta, aSmartFilterBarFilters, mIgnoredFilters) {
			var oSmartControl = oViewMeta.smartControl;
			var oMetaModel = oSmartControl.getModel().getMetaModel();
			var oEntityType = oTemplateUtils.oCommonUtils.getMetaModelEntityType(oSmartControl);
			var aNavProperties = oEntityType.navigationProperty;

			var fnHandlerForNonMultiFilters = function(oFilter) {
				var sPath = oFilter.sPath;
				var bFound = false;

				var sFilterPropertyName = getPropertyName(sPath);
				var aEntityProperties = getEntityTypePropertiesOfPath(sPath, oSmartControl, oMetaModel, oEntityType, aNavProperties, oViewMeta);
				/* eslint-disable no-loop-func */
				// check if the filter field is part of the entity type
				aEntityProperties.some(function(oProperty) {
					var oHiddenProperty;
					if (oProperty.name === sFilterPropertyName) {
						// Additionally check whether the property is not marked as hidden
						oHiddenProperty = oProperty["com.sap.vocabularies.UI.v1.Hidden"];
						bFound = oHiddenProperty ? oHiddenProperty.Bool !== "true" : true;
						return bFound;
					}
					return false;
				});
				if (bFound) {
					return oFilter;
				}
				if (mIgnoredFilters) {
					mIgnoredFilters[sPath] = true;
				}
				return null;
			};


			var aRet = fnHandleUnapplicableFilters(aSmartFilterBarFilters, fnHandlerForNonMultiFilters);
			// populate the message strip
			if (mIgnoredFilters) {
				var aIgnoredFilters = Object.keys(mIgnoredFilters);
				var aIgnoredLabels = aIgnoredFilters.map(function(sPath) {
					var oProperty = fnGetFilterProperty(sPath, oViewMeta.smartControl);
					return oProperty["sap:label"] ? oProperty["sap:label"] : oProperty.name;
				});
				oTemplatePrivateModel.setProperty(sIgnoredFiltersPath, aIgnoredLabels);
				// storing all the ignored filters of selected tab
				oViewMeta.implementingHelperAttributes.ignoredLabels = aIgnoredLabels;
			}
			return aRet;
		}
		/*
		 * function returns all entity set properties to the given path
		 * the path can be just a property name, then the properties of the current entity set are returned
		 * the path can be a navigation property like navProp1/navProp2/navProp3/.../property
		 */
		function getEntityTypePropertiesOfPath(sPath, oSmartControl, oMetaModel, oEntityType, aNavProperties, oViewMeta) {
			var aParts, sNavProperty, bFound, oAssociationEnd, aEntityProperties;
			if (sPath.indexOf("/") !== -1) { // sPath contains at least one navigation property
				aParts = sPath.split("/");
				for (var i = 0; i < aParts.length - 1; i++) { // loop over the navigation properties, the last element of the aParts is the property name so do not consider it
					sNavProperty = aParts[i];
					for (var j in aNavProperties) {
						if (aNavProperties[j].name === sNavProperty) {
							bFound = true;
							break;
						}
					}
					if (!bFound) {
						return []; // the navigation property is not present in the current entity type so no need to check further
					}
					oAssociationEnd = oMetaModel.getODataAssociationEnd(oEntityType, sNavProperty);
					oEntityType = oAssociationEnd && oMetaModel.getODataEntityType(oAssociationEnd.type);
					aNavProperties = oEntityType && oEntityType.navigationProperty;
				}
				aEntityProperties = oEntityType && oEntityType.property;
			} else {
				// need to check in debugger
				aEntityProperties = oViewMeta.implementingHelperAttributes.entityTypeProperty;
			}
			return aEntityProperties;
		}

		function fnRemoveTableSettingsFromFilters(aFiltersToBeRemovedFrom, aFiltersToBeRemoved) {
			for (var i in aFiltersToBeRemoved) {
				var oFilterToBeRemoved = aFiltersToBeRemoved[i];
				for (var j = aFiltersToBeRemovedFrom.length; j--; j >= 0) {
					if (JSON.stringify(aFiltersToBeRemovedFrom[j]) === JSON.stringify(oFilterToBeRemoved)) {
						aFiltersToBeRemovedFrom.splice(j, 1);
						break;
					}
				}
			}
		}

		function fnGetImplementingHelperAttributes(oViewMeta) {
			var oEntityType = oTemplateUtils.oCommonUtils.getMetaModelEntityType(oViewMeta.smartControl);
			return {
				entityTypeProperty: oEntityType.property,
				dirtyState: 0,
				activeObjectEnabled: false
			};
		}

		function fnInit(mSwitchingKeyToViewMetaTmp, fnRefreshOperation, getCurrentViewMeta) {
			mSwitchingKeyToViewMeta = mSwitchingKeyToViewMetaTmp;
			for (var sKey in mSwitchingKeyToViewMeta) {
				var oViewMeta = mSwitchingKeyToViewMeta[sKey];
				oViewMeta.implementingHelperAttributes = fnGetImplementingHelperAttributes(oViewMeta);
				if (oConfiguration.smartFilterBar) {
					// register for the go button trigger
					oConfiguration.smartFilterBar.attachSearch(function(oEvent) {
						// refresh everything
						fnRefreshOperation(3);
					});
				}
			}
			if (oConfiguration.pathToActiveObjectEnabled) {
				var oBinding = oTemplatePrivateModel.bindProperty(oConfiguration.pathToActiveObjectEnabled);
				oBinding.attachChange(function(oEvent) {
					var oCurrentViewMeta = getCurrentViewMeta();
					oCurrentViewMeta.implementingHelperAttributes.activeObjectEnabled = oTemplatePrivateModel.getProperty(oConfiguration.pathToActiveObjectEnabled);
				});
			}
		}

		function fnFormatMessageStrip(aIgnoredLabels, sSelectedKey) {
			// at the time of start up no item is selected
			if (!sSelectedKey) {
				return "";
			}
			var sFinalMessage = "";
			var sSelectedTabText = mSwitchingKeyToViewMeta[sSelectedKey].text;
			if (aIgnoredLabels && aIgnoredLabels.length > 0) {
				if ((Device.system.tablet || Device.system.phone) && !Device.system.desktop) {
					if (aIgnoredLabels.length > 1) {
						// TODO: move message text to model
						sFinalMessage = oTemplateUtils.oCommonUtils.getText("MESSAGE_MULTIPLE_VALUES_S_FORM", [aIgnoredLabels.join(", "), sSelectedTabText]);
					} else {
						sFinalMessage = oTemplateUtils.oCommonUtils.getText("MESSAGE_SINGLE_VALUE_S_FORM", [aIgnoredLabels[0], sSelectedTabText]);
					}
				} else if (aIgnoredLabels.length > 1) {
					sFinalMessage = oTemplateUtils.oCommonUtils.getText("MESSAGE_MULTIPLE_VALUES_L_FORM", [aIgnoredLabels.join(", "), sSelectedTabText]);
				} else {
					sFinalMessage = oTemplateUtils.oCommonUtils.getText("MESSAGE_SINGLE_VALUE_L_FORM", [aIgnoredLabels[0], sSelectedTabText]);
				}
			}
			return sFinalMessage;
		}

		/**
		 * This method returns filter property from which label cab be identified which is not applied to that entity set to be displayed on message strip.
		 * @param  {string} sPropertyName -  filter name for which label should be identified
		 * @param  {object} oSmartControl - selected table or chart
		 * @return {string} oUnappliedProperty - Property that is not applied in filter
		 */
		function fnGetFilterProperty(sPropertyName, oSmartControl) {
			var oUnappliedProperty;
			var aEntityProperties = findOtherEntityProperties(oSmartControl);
			for (var sKey in aEntityProperties) {
				oUnappliedProperty = fnGetFilterPropertyLabel(aEntityProperties[sKey], sPropertyName);
				if (oUnappliedProperty) {
					break;
				}
			}
			return oUnappliedProperty;
		}

		function fnGetFilterPropertyLabel(aEntityProperties, sPropertyName) {
			return aEntityProperties.filter(function(oProperty) {
				return oProperty.name === sPropertyName;
			})[0];
		}

		/**
		 * Since the unapplied filter is not part of the entity set of the selected tab,
		 * we should get all the properties of all entity sets in order to find the label of the unapplied filter
		 * @param  {object} oControl - selected table or chart
		 * @return {array} aProperty - all properties of other entity sets
		 */
		function findOtherEntityProperties(oControl) {
			var  aProperties = [];
			for (var sKey in mSwitchingKeyToViewMeta) {
				var oViewMeta = mSwitchingKeyToViewMeta[sKey];
				if (oViewMeta.smartControl !== oControl) {
					aProperties.push(oViewMeta.implementingHelperAttributes.entityTypeProperty);
				}
			}
			return aProperties;
		}


		function fnOnSelectedKeyChanged(sNewKey) {
			var oViewMeta = mSwitchingKeyToViewMeta[sNewKey];
			var aNewIgnoredFilters = oViewMeta.implementingHelperAttributes.ignoredLabels || [];
			oTemplatePrivateModel.setProperty(sIgnoredFiltersPath, aNewIgnoredFilters);
			if (oConfiguration.pathToActiveObjectEnabled) {
				oTemplatePrivateModel.setProperty(oConfiguration.pathToActiveObjectEnabled, oViewMeta.implementingHelperAttributes.activeObjectEnabled);
			}
		}

		function fnGetSelectedKeyAndRestoreFromIappState(oState) {
			var oTmpTable, sVariantId;
			if (oState) {
				if (oState.tableVariantIds) {
					for (var sKey in  mSwitchingKeyToViewMeta) {
						oTmpTable = mSwitchingKeyToViewMeta[sKey].smartControl;
						sVariantId = oState.tableVariantIds[oTmpTable.getId()];
						if (sVariantId) {
							oTmpTable.setCurrentVariantId(sVariantId);
						}
					}
				}
				if (oConfiguration.pathToActiveObjectEnabled && oState.mEditButtonState) {
					for (var sIndex in  mSwitchingKeyToViewMeta) {
						// to make it boolean
						mSwitchingKeyToViewMeta[sIndex].implementingHelperAttributes.activeObjectEnabled = !!oState.mEditButtonState[sIndex];
					}
				}
				fnOnSelectedKeyChanged(oState.selectedTab);
				return oState.selectedTab;
			}
			return null;
		}


		function fnGetContentForIappState(sSelectedKey) {
			var sKey, oTmpTable, oVariantsIds = {};
			for (sKey in mSwitchingKeyToViewMeta) {
				oTmpTable = mSwitchingKeyToViewMeta[sKey].smartControl;
				oVariantsIds[oTmpTable.getId()] = oTmpTable.getCurrentVariantId() || "";
			}
			var oRet = {
				selectedTab: sSelectedKey,
				tableVariantIds: oVariantsIds
			};
			if (oConfiguration.pathToActiveObjectEnabled) {
				var mEditButtonState = Object.create(null);
				for (var sIndex in  mSwitchingKeyToViewMeta) {
					mEditButtonState[sIndex] =  mSwitchingKeyToViewMeta[sIndex].implementingHelperAttributes.activeObjectEnabled;
				}
				oRet.mEditButtonState = mEditButtonState;
			}
			return oRet;
		}

		// iRequest: 1 = rebind table use the new filter values, 2 = refresh - makes a call, 3 = both
		function fnRefreshOperation(iRequest, vTabKey, mEntitySets, sSelectedKey, bIsTabKeyArray, bIsComponentVisible, fnRefreshOperationOnCurrentSmartControl) {

			var fnRefreshOperationOnKey = function(sKey){
				if (sKey === sSelectedKey && bIsComponentVisible){ // if the tab is currently visible perform the operation immediately
					fnRefreshOperationOnCurrentSmartControl(iRequest);
					return;
				}
				// If the tab is currently not visible refresh its dirty state
				var oViewMeta = mSwitchingKeyToViewMeta[sKey];
				if (oViewMeta.implementingHelperAttributes.dirtyState > 0 && oViewMeta.implementingHelperAttributes.dirtyState !== iRequest){
					oViewMeta.implementingHelperAttributes.dirtyState = 3;
				} else {
					oViewMeta.implementingHelperAttributes.dirtyState = iRequest;
				}
			};

			if (vTabKey){
				if (bIsTabKeyArray){
					vTabKey.forEach(fnRefreshOperationOnKey);
					return;
				}
				fnRefreshOperationOnKey(vTabKey);
				return;
			}
			for (var sKey in  mSwitchingKeyToViewMeta){
				if (!mEntitySets || mEntitySets[mSwitchingKeyToViewMeta[sKey].smartControl.getEntitySet()]){
					fnRefreshOperationOnKey(sKey);
				}
			}
		}


		function fnGetMode() {
			return "multi";
		}


		function fnGetRefreshMode(sNewKey) {
			var oViewMeta = mSwitchingKeyToViewMeta[sNewKey];
			var iMode = oViewMeta.implementingHelperAttributes.dirtyState;
			// we rely on the caller is now refreshing according to the dirty state
			oViewMeta.implementingHelperAttributes.dirtyState = 0;
			return iMode;
		}

		function fnSetActiveButtonState(oViewMeta) {
			var oSmartControl = oViewMeta.smartControl;
			var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
			var oCustomData = fnGetActiveButtonStateCustomData(oSmartControl);
			var bActiveButtonState = JSON.parse(oCustomData.getValue());
			if (oCustomData) {
				oSmartControl.removeCustomData(oCustomData);
			}
			oSmartControl.addCustomData(new sap.ui.core.CustomData({
				"key": "activeButtonTableState",
				"value": !bActiveButtonState
			}));
			oTemplatePrivateModel.setProperty("/listReport/activeObjectEnabled", !bActiveButtonState);
		}

		function fnGetActiveButtonStateCustomData(oSmartControl) {
			var oControlCustomData;
			var aControlCustomData = oSmartControl.getCustomData();
			for (var index = 0; index < aControlCustomData.length; index++) {
				if (aControlCustomData[index].getKey() && aControlCustomData[index].getKey() === "activeButtonTableState") {
					oControlCustomData = aControlCustomData[index];
					break;
				}
			}
			return oControlCustomData;
		}


		function fnRestoreActiveButtonState(oViewMeta) {
			var oSmartControl = oViewMeta.smartControl;
			var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
			var bActiveButtonState = oTemplatePrivateModel.getProperty("/listReport/activeObjectEnabled");
			var oCustomData = fnGetActiveButtonStateCustomData(oSmartControl);
			if (oCustomData) {
				oSmartControl.removeCustomData(oCustomData);
			}
			oSmartControl.addCustomData(new sap.ui.core.CustomData({
				"key": "activeButtonTableState",
				"value": bActiveButtonState
			}));
		}

		function fnSetControlVariant(sChartVariantId, sTableVariantId, sPageVariantId){
			for (var sKey in  mSwitchingKeyToViewMeta) {
				var control = mSwitchingKeyToViewMeta[sKey].smartControl;
				if ((sTableVariantId || sPageVariantId) && control.getTable){
					control.setCurrentVariantId(sTableVariantId || sPageVariantId);
				} else if ((sChartVariantId || sPageVariantId) && control.getChart){
					control.setCurrentVariantId(sChartVariantId || sPageVariantId);
				}
			}
		}

		var fnCleanupIrrelevantFilters = testableHelper.testable(fnCleanupIrrelevantFilters, "fnCleanupIrrelevantFilters");
		// public instance methods
		return {
			init: fnInit,
			getCustomDataHost: fnGetCustomDataHost,
			getDefaultShowCounts: fnGetDefaultShowCounts,
			getFiltersAdaptedFromItem: fnGetFiltersAdaptedFromItem,
			formatMessageStrip: fnFormatMessageStrip,
			onSelectedKeyChanged: fnOnSelectedKeyChanged,
			getContentForIappState: fnGetContentForIappState,
			getSelectedKeyAndRestoreFromIappState: fnGetSelectedKeyAndRestoreFromIappState,
			refreshOperation: fnRefreshOperation,
			getMode: fnGetMode,
			getRefreshMode: fnGetRefreshMode,
			setActiveButtonState: fnSetActiveButtonState,
			restoreActiveButtonState: fnRestoreActiveButtonState,
			getActiveButtonStateCustomData: fnGetActiveButtonStateCustomData,
			setControlVariant: fnSetControlVariant
		};
	}

	return BaseObject.extend("sap.suite.ui.generic.template.lib.multipleViews.MultipleTablesModeHelper", {
		constructor: function(oController, oTemplateUtils, oConfiguration) {
			extend(this, getMethods(oController, oTemplateUtils, oConfiguration));
		}
	});
});
