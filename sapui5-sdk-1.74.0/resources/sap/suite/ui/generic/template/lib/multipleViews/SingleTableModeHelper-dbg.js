sap.ui.define([
	"sap/ui/base/Object",
	"sap/base/util/extend"
],
function(BaseObject, extend) {
	"use strict";
	/*
	 * This class is a helper class for the generic class XltipleViewsHandler. More, precisely an instance of
	 * this class is created in the constructor of that class in case, that the single table mode of the multiple views feature
	 * has been switched on.
	 * The mode can be switched on and configured via the quickVariantSelection.variants section in the manifest.
	 */

	// oController is the controller of the enclosing ListReport
	// oTemplateUtils are the template utils as passed to the controller implementation
	function getMethods(oController, oTemplateUtils) {

		// In single table mode the customData containing the specific information for each view are contained in the corresponding item of the switching control
		function getCustomDataHost(oSmartControl, oSwitchingItem){
			return oSwitchingItem;
		}

		function getDefaultShowCounts(){
			return false;
		}

		function fnGetSelectedKeyAndRestoreFromIappState(oState) {
			return oState && oState.selectedKey;
		}

		function fnGetContentForIappState(sSelectedKey) {
			return {
				selectedKey: sSelectedKey
			};
		}

		function fnRefreshOperation(iRequest, vTabKey, mEntitySets, sCurrentKey, bIsTabKeyArray, bIsComponentVisible, fnRefreshOperationOnCurrentSmartControl) {
			if (bIsTabKeyArray ? vTabKey.indexOf(sCurrentKey) < 0 : (vTabKey && vTabKey !== sCurrentKey)){
				return; // refresh only required for a non-visible tab. This will happen anyway, when changing to this tab
			}
			if (bIsComponentVisible){
				fnRefreshOperationOnCurrentSmartControl(iRequest);
			} else {
				oController.getOwnerComponent().setIsRefreshRequired(true);
			}
		}

		function fnGetMode() {
			return "single";
		}

		function fnGetRefreshMode(sNewKey) {
			// for single table mode for every switch of tabs we need to refresh
			return 3;
		}

		// public instance methods
		return {
			getCustomDataHost: getCustomDataHost,
			getDefaultShowCounts: getDefaultShowCounts,
			getContentForIappState: fnGetContentForIappState,
			getSelectedKeyAndRestoreFromIappState : fnGetSelectedKeyAndRestoreFromIappState,
			refreshOperation: fnRefreshOperation,
			getMode: fnGetMode,
			getRefreshMode: fnGetRefreshMode
		};
	}

	return BaseObject.extend("sap.suite.ui.generic.template.ListReport.controller.SingleTableModeHelper", {
		constructor: function(oController, oTemplateUtils) {
			extend(this, getMethods(oController, oTemplateUtils));
		}
	});
});
