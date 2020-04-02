sap.ui.define([
	"sap/ui/base/Object",
	"sap/suite/ui/generic/template/js/StableIdHelper",
	"sap/suite/ui/generic/template/lib/multipleViews/MultipleViewsHandler",
	"sap/base/util/extend"
], function(BaseObject, StableIdHelper, MultipleViewsHandler, extend) {
	"use strict";

	// This helper class handles multiple views in the Object Page.
	// For each section which supports the multiple views feature it instantiates an instance of
	// sap.suite.ui.generic.template.lib.multipleViews.MultipleViewsHandler which implements the main part of the logic.
	// This class only contains the glue code which is used to adapt the services provided by this generic class to the requirements of the Object Page.

	// oController is the controller of the enclosing ListReport
	// oTemplateUtils are the template utils as passed to the controller implementation
	// fnStateChanged is a function that should be called, when the storable state changes
	function getMethods(oController, oTemplateUtils, fnStateChanged) {
		// Begin: Instance variables
		var mGenericMultipleViewsHandlers = Object.create(null); // maps the ids of the sections containing multiple views on the corresponding generic multiple views handler
		var mSmartControlToGenericMultipleViewHandlers = Object.create(null);
		function onDataRequested(sSmartControlId){
			var oGenericMultipleViewsHandler =  fnGetGenericMultipleViewsHandler(sSmartControlId);
			if (oGenericMultipleViewsHandler) {
				oGenericMultipleViewsHandler.updateCounts();
			}
		}

		function onRebindContentControl(sSmartControlId, oBindingParams){
			var oGenericMultipleViewsHandler = fnGetGenericMultipleViewsHandler(sSmartControlId);
			if (oGenericMultipleViewsHandler) {
				oGenericMultipleViewsHandler.onRebindContentControl(oBindingParams);
			}
		}

		// returns an undefined value if the smartcontrolid doesn't use mutlipleview feature
		function fnGetGenericMultipleViewsHandler(sSmartControlId) {
			return mSmartControlToGenericMultipleViewHandlers[sSmartControlId];
		}

		function fnGetSearchValue(oSmartControl) {
			var oInfoObject = oTemplateUtils.oCommonUtils.getControlInformation(oSmartControl, null, true);
			return oInfoObject && oInfoObject.searchField && oInfoObject.searchField.getValue();
		}

		function fnGetCurrentState(){
			var mMultipleViewState; // maps the ids of the side controls that currently show side content onto true. Faulty, if no such control exists
			for (var sSectionKey in mGenericMultipleViewsHandlers) {
				var oMultipleViewHandler = mGenericMultipleViewsHandlers[sSectionKey];
				var sSelectedKey = oMultipleViewHandler.getSelectedKey();
				mMultipleViewState = mMultipleViewState || Object.create(null);
				mMultipleViewState[sSectionKey] = sSelectedKey;
			}
			return mMultipleViewState && {
				data: mMultipleViewState,
				lifecycle: {
					permanent: true,
					pagination: true
				}
			};
		}

		function fnApplyState(oState, bIsSameAsLast) {
			if (bIsSameAsLast) {
				return;
			}
			for (var sSectionKey in mGenericMultipleViewsHandlers) {
				var oMultipleViewHandler = mGenericMultipleViewsHandlers[sSectionKey];
				var sSelectedKey =  oState && oState[sSectionKey];
				oMultipleViewHandler.setSelectedKey(sSelectedKey);
			}
		}
		function fnGetSmartControl(sSectionKey) {
			var sIdForSmartTableInFacet = StableIdHelper.getStableId({
				type: "ObjectPageTable",
				subType: "SmartTable",
				sFacet: sSectionKey
			});
			return oController.byId(sIdForSmartTableInFacet);
		}

		function fnFormatItemTextForMultipleView(oItem) {
			var sFacetId = oItem.facetId;
			var sSmartControl = fnGetSmartControl(sFacetId);
			var oGenericMultipleViewsHandler = fnGetGenericMultipleViewsHandler(sSmartControl.getId());
			if (!oGenericMultipleViewsHandler) {
				return null;
			}
			return oGenericMultipleViewsHandler.formatItemTextForMultipleView(oItem);
		}

		(function() { // constructor coding encapsulated in order to reduce scope of helper variables
			var mManifestSections = oController.getOwnerComponent().getSections();
			for (var sSectionKey in mManifestSections) { // loop over all sections specified in the manifest
				var oManifestSection = mManifestSections[sSectionKey];
				if (oManifestSection.quickVariantSelection){ // this section has a multiple views
					var oSmartControl = fnGetSmartControl(sSectionKey);
					var sStableIdForSegmentedButton = StableIdHelper.getStableId({
						type: "ObjectPageTable",
						subType: "SegmentedButton",
						sFacet: sSectionKey
					});
					var sStableIdForVariantSelection = StableIdHelper.getStableId({
						type: "ObjectPageTable",
						subType: "VariantSelection",
						sFacet: sSectionKey
					});
					var oSwitchingControl = oController.byId(sStableIdForSegmentedButton) || oController.byId(sStableIdForVariantSelection);
					var oConfiguration = {
						manifestSettings: oManifestSection.quickVariantSelection,
						pathInTemplatePrivateModel: "/objectPage/multipleViews",
						smartControl: oSmartControl,
						sectionKey: sSectionKey,
						switchingControl: oSwitchingControl,
						appStateChange: fnStateChanged,
						isDataToBeShown: function () {
							return true;
						},
						adaptRefreshRequestMode: function(iRefreshRequest) {
							return iRefreshRequest;
						}
					};
					oConfiguration.getSearchValue = fnGetSearchValue.bind(null, oSmartControl);
					var oTemplatePrivateModel = oTemplateUtils.oComponentUtils.getTemplatePrivateModel();
					if (!oTemplatePrivateModel.getProperty(oConfiguration.pathInTemplatePrivateModel)) {
						oTemplatePrivateModel.setProperty(oConfiguration.pathInTemplatePrivateModel, Object.create(null));
					}
					oConfiguration.pathInTemplatePrivateModel = "/objectPage/multipleViews/" + sSectionKey;
					var oGenericMultipleViewsHandler = new MultipleViewsHandler(oController, oTemplateUtils, oConfiguration);
					mGenericMultipleViewsHandlers[sSectionKey] = oGenericMultipleViewsHandler;
					mSmartControlToGenericMultipleViewHandlers[oSmartControl.getId()] = oGenericMultipleViewsHandler;
				}
			}
		})();

		// public instance methods
		return {
			onDataRequested: onDataRequested,
			onRebindContentControl: onRebindContentControl,
			getCurrentState: fnGetCurrentState,
			applyState: fnApplyState,
			formatItemTextForMultipleView: fnFormatItemTextForMultipleView
		};
	}

	return BaseObject.extend("sap.suite.ui.generic.template.ObjectPage.controller.MultipleViewsHandler", {
		constructor: function(oController, oTemplateUtils, fnStateChanged) {
			extend(this, getMethods(oController, oTemplateUtils, fnStateChanged));
		}
	});
});
