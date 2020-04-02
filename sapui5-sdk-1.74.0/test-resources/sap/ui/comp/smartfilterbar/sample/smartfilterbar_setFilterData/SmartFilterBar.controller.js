sap.ui.define([
	'sap/ui/model/odata/ODataUtils', 'sap/ui/model/odata/v2/ODataModel', 'sap/ui/core/mvc/Controller', 'sap/m/MessageToast', 'sap/ui/generic/app/navigation/service/SelectionVariant', 'sap/ui/comp/state/UIState', 'sap/ui/comp/filterbar/VariantConverterFrom'

], function (ODataUtils, ODataModel, Controller, MessageToast, SelectionVariant, UIState, VariantConverterFrom) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartfilterbar_setFilterData.SmartFilterBar", {

		onInit: function () {
			var oModel = new ODataModel("/foo", true);
			this.getView().setModel(oModel);

			this._oFilterBar = this.getView().byId("smartFilterBar");
			this._oOutputParam = this.getView().byId("outputAreaUrl");
			this._oOutputFilters = this.getView().byId("outputAreaFilters");
			this._oOutputDataSuite = this.getView().byId("outputAreaDataSuite");
			this._oOutputValueTexts = this.getView().byId("outputAreaValueTexts");
			this._outputAreaToSelectionVariant = this.getView().byId("outputAreaToSelectionVariant");
			this._outputAreaFromSelectionVariant = this.getView().byId("outputAreaFromSelectionVariant");
			this._oStatusText = this.getView().byId("statusText");
			this._oToggleUTCButton = this.getView().byId("toggleUTC");
			this._bStrictMode = true;
		},


		onSearchForFilters: function (oEvent) {
			MessageToast.show("Search triggered with filters: '" + oEvent.getParameters().newValue);
		},

		_printFilters: function (aFilters) {

			if (aFilters.length == 0) {
				return "";
			}

			var oFilterProvider = this._oFilterBar._oFilterProvider;

			var sText = ODataUtils._createFilterParams(aFilters, oFilterProvider._oParentODataModel.oMetadata, oFilterProvider._oMetadataAnalyser._getEntityDefinition(oFilterProvider.sEntityType));

			return sText ? decodeURI(sText) : "";
		},

		onSearch: function (oEvent) {
			MessageToast.show("Search triggered");

			var sParamBinding = this._oFilterBar.getAnalyticBindingPath();
			this._oOutputParam.setText(decodeURIComponent(sParamBinding));

			var sFilters = this._printFilters(this._oFilterBar.getFilters());

			this._oOutputFilters.setText(decodeURIComponent(sFilters));
		},

		onClear: function (oEvent) {
			MessageToast.show("Clear pressed!");
		},

		onRestore: function (oEvent) {
			MessageToast.show("Restore pressed!");
		},

		onCancel: function (oEvent) {
			MessageToast.show("Cancel pressed!");
		},

		onBeforeRebindTable: function (oEvent) {

			var oAnalyticalBinding = this._oFilterBar.getAnalyticBindingPath();
			this._oTable.setTableBindingPath(oAnalyticalBinding);
		},

		onCreateToSelectionVariant: function () {

			var sTextAreaText = this._oOutputDataSuite.getValue();

			this._outputAreaToSelectionVariant.setValue("");
			this._outputAreaFromSelectionVariant.setValue("");
			if (sTextAreaText) {
				var oSelVariant = new SelectionVariant(sTextAreaText.replace(/\s+/g, ''));

				this._outputAreaToSelectionVariant.setValue(oSelVariant.toJSONString());
			}
		},

		onGetFilterData: function (oEvent) {
			this.getView().byId("outputAreaFilterData").setValue(JSON.stringify(this._oFilterBar.getFilterData(), null, '  '));
		},

		onSetFilterData: function (oEvent) {
			var oFilterData = JSON.parse(this.getView().byId("outputAreaFilterData").getValue());
			this._oFilterBar.setFilterData(oFilterData);
		},

		onAssignedFiltersChanged: function (oEvent) {
			if (this._oFilterBar) {
				var sText = this._oFilterBar.retrieveFiltersWithValuesAsText();
				this._oStatusText.setText(sText);
			}
		},

		onInitialized: function (oEvent) {
			// set initial UTC switch state
			var bUtc = !!this._oFilterBar._oFilterProvider._oDateFormatSettings["UTC"];
			this.getView().byId("UtcModeSwitch").setState(bUtc);
		},

		onShowAllFilterFields: function (oEvent) {
			var aFilterGroupItems = this._oFilterBar.getFilterGroupItems();
			for (var i = aFilterGroupItems.length - 1; i > -1; --i) {
				aFilterGroupItems[i].setVisibleInFilterBar(true);
			}
		},

		onUtcModeChange: function (oEvent) {
			var bSwitchState = oEvent.getParameters()['state'];
			this._oFilterBar._oFilterProvider._oDateFormatSettings["UTC"] = bSwitchState;
		}
	});
});
