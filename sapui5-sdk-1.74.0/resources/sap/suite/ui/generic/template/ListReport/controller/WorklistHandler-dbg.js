sap.ui.define(["sap/ui/base/Object", "sap/base/util/extend"], function(BaseObject, extend) {
		"use strict";

		/*
		 * This helper class handles Worklist functionality in the List Report.
		 * this class is created in onInit of the ListReport controller.
		 *
		 * That controller forwards all tasks
		 * connected to the worklist feature to this instance.
		 * Worklist feature can be switched on through settings in the manifest.
		 *
		 */

		// oState is used as a channel to transfer data with the controller. Properties oSmartTable and oIappStateHandler are used
		// oController is the controller of the enclosing ListReport
		// oTemplateUtils are the template utils as passed to the controller implementation

		function getMethods(oState, oController, oTemplateUtils) {
		/*Worklist related functionality*/

		// this function restores the state of worklist app if there is a search string present.
		// since the search field is custom field, all the functionalities like setting the value back to the field
		// and rebinding the table have to be done explicitly
		function fnRestoreWorklistStateFromIappState() {
			var oWorklistState = oState.oWorklistData.oWorklistSavedData ? oState.oWorklistData.oWorklistSavedData : {};
			if (oState.sNavType === "initial") {
				oState.oSmartFilterbar.setSuppressSelection(false);
			}
			if (oWorklistState.searchString) {
				fnFetchAndSaveWorklistSearchField();
				oState.oWorklistData.oSearchField.setValue(oWorklistState.searchString);
				oState.oWorklistData.bVariantDirty = false;
				oState.oWorklistData.oSearchField.fireSearch();
				return;
			}
			oState.oSmartFilterbar.search();
			oState.oIappStateHandler.changeIappState(true,true);
		}

		// since searchfield is custom field in worklist and is present in table toolbar, in this function we get the searchfield
		// and store in oState. This searchfield will be used for setting and getting the searchtext when restoring the page state.
		function fnFetchAndSaveWorklistSearchField() {
			var oSmartTable = oState.oSmartTable;
			var aTableToolbarContent = oSmartTable.getCustomToolbar().getContent();
			for (var index in aTableToolbarContent) {
				if (aTableToolbarContent[index].getId().indexOf("SearchField") > -1) {
					oState.oWorklistData.oSearchField = aTableToolbarContent[index];
					break;
				}
			}
		}

		// this function checks if there is any search string available in worklist apps before opening any personalization dialogs
		// it fetches the search string and adds it to worklist object which later gets saved in internal app state
		function fnCheckSearchOnTableAction() {
			var oSearchFieldText = oState.oWorklistData.oSearchField.getValue() || "";
			if (oSearchFieldText) {
				oState.oSmartTable.data("allowSearchWorkListLight", true);
			}
			oState.oWorklistData.oWorklistState = {
				"searchString" : oSearchFieldText
			};
		}

		// this function rebinds worklist table sets the page variant to dirty when there is any change in searchfield
		function fnWorklistRebindTableOnSearch(oEvent) {
			var oPageVariant = oController.byId("template::PageVariant");
			if (oPageVariant) {
				if (oEvent && oEvent.getId() === "liveChange" || (!oState.oWorklistData.bVariantDirty)) {
					// set variant dirty for all cases when search string is applied except
					// when saved variant is applied
					oPageVariant.currentVariantSetModified(true);
				}
			}
			oState.oWorklistData.bVariantDirty = true;
			//change the value to true when it is made false during applying variant. This is done so that, when user enters a new string
			// the variant will be dirty again.
			oState.oSmartTable.rebindTable();
			oState.oIappStateHandler.changeIappState(true, true);
		}

		// this function opens personalisation dialog w.r.t to the button that is clicked.
		function fnOpenWorklistPersonalisation(oEvent) {
			fnCheckSearchOnTableAction();
			var oSmartTable = oState.oSmartTable;
			var sDialogName = oEvent.getSource().getIcon().split("//");
			sDialogName = sDialogName[sDialogName.length - 1];
			if (oSmartTable && sDialogName) {
				switch (sDialogName) {
					case "sort" : oSmartTable.openPersonalisationDialog("Sort");
					break;
					case "filter" : oSmartTable.openPersonalisationDialog("Filter");
					break;
					case "group-2" : oSmartTable.openPersonalisationDialog("Group");
					break;
					case "action-settings" : oSmartTable.openPersonalisationDialog("Columns");
					break;
				}
			}
		}

		// this function performs search related functionality when worklist search is fired
		function fnPerformWorklistSearch(oEvent) {
			fnFetchAndSaveWorklistSearchField();
			fnCheckSearchOnTableAction();
			oState.oSmartTable.data("searchString", oEvent.getSource().getValue());
			fnWorklistRebindTableOnSearch(oEvent);
		}

		// public instance methods
		return {
			openWorklistPersonalisation: fnOpenWorklistPersonalisation,
			performWorklistSearch: fnPerformWorklistSearch,
			restoreWorklistStateFromIappState: fnRestoreWorklistStateFromIappState,
			fetchAndSaveWorklistSearchField: fnFetchAndSaveWorklistSearchField

		};
	}

		return BaseObject.extend("sap.suite.ui.generic.template.ListReport.controller.WorklistHandler", {
			constructor: function(oState, oController, oTemplateUtils) {
				extend(this, getMethods(oState, oController, oTemplateUtils));
		}
	});
});
