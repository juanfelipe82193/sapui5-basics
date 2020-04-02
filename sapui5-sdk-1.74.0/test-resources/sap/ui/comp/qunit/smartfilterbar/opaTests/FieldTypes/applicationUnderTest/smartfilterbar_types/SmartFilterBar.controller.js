sap.ui.define([
	'sap/ui/model/odata/ODataUtils', 'sap/ui/model/odata/v2/ODataModel', 'sap/ui/core/mvc/Controller', 'sap/m/MessageToast', 'sap/ui/generic/app/navigation/service/SelectionVariant', 'sap/ui/comp/state/UIState', 'sap/ui/comp/filterbar/VariantConverterFrom', 'sap/ui/model/Filter'

], function(ODataUtils, ODataModel, Controller, MessageToast, SelectionVariant, UIState, VariantConverterFrom, Filter) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartfilterbar_types.SmartFilterBar", {

		onInit: function() {
			// Change the date format to one of the ABAP date formats
			// id of the ABAP data format (one of '1','2','3','4','5','6','7','8','9','A','B','C')
			//sap.ui.getCore().getConfiguration().getFormatSettings().setLegacyDateFormat("A");

			var oModel = new ODataModel("/foo", true);
			this.getView().setModel(oModel);

			this._oFilterBar = this.getView().byId("smartFilterBar");
			this._oOutputParam = this.getView().byId("outputAreaUrl");
			this._oOutputFilters = this.getView().byId("outputAreaFilters");
			this._oOutputDataSuite = this.getView().byId("outputAreaDataSuite");
			this._oOutputValueTexts = this.getView().byId("outputAreaValueTexts");
			this._outputAreaToSelectionVariant = this.getView().byId("outputAreaToSelectionVariant");
			this._outputAreaFromSelectionVariant = this.getView().byId("outputAreaFromSelectionVariant");
			this._outputAreaFilterProviderOData = this.getView().byId("filterProviderOdata");
			this._outputAreagetFilterData = this.getView().byId("outputAreagetFilterData");
			this._oStatusText = this.getView().byId("statusText");
			this._oToggleUTCButton = this.getView().byId("toggleUTC");
			this._bStrictMode = true;
		},

		_getUiState: function() {
			var oUIState = this._oFilterBar.getUiState();
			var oDataSuite = oUIState.getSelectionVariant();
			var oValueTexts = oUIState.getValueTexts();

			return {
				selectionVariant: JSON.stringify(oDataSuite),
				valueTexts: JSON.stringify(oValueTexts)
			};
		},

		_setUiState: function(oData, sValueTexts) {

			var oUiState = new UIState({
				selectionVariant: oData,
				valueTexts: JSON.parse(sValueTexts)
			});

			var oParameter = {
				strictMode: this._bStrictMode,
				replace: true
			};

			this._oFilterBar.setUiState(oUiState, oParameter);
		},

		onSearchForFilters: function(oEvent) {
			MessageToast.show("Search triggered with filters: '" + oEvent.getParameters().newValue);
		},

		_printFilters: function(aFilters) {

			if (aFilters.length == 0) {
				return "";
			}

			var oFilterProvider = this._oFilterBar._oFilterProvider;

			var sText = ODataUtils._createFilterParams(aFilters, oFilterProvider._oParentODataModel.oMetadata, oFilterProvider._oMetadataAnalyser._getEntityDefinition(oFilterProvider.sEntityType));

			return sText ? decodeURI(sText) : "";
		},

		onSearch: function(oEvent) {
			MessageToast.show("Search triggered");

			var sParamBinding = this._oFilterBar.getAnalyticBindingPath();
			this._oOutputParam.setText(decodeURIComponent(sParamBinding));

			var sFilters = this._printFilters(this._oFilterBar.getFilters());

			this._oOutputFilters.setText(decodeURIComponent(sFilters));

			var oDataSuite = this._getUiState();
			// this._oOutputDataSuite.setValue(oDataSuite.selectionVariant);
			this._oOutputDataSuite.setValue(JSON.stringify(JSON.parse(oDataSuite.selectionVariant), null, '  '));
			this._oOutputValueTexts.setValue(oDataSuite.valueTexts ? JSON.stringify(JSON.parse(oDataSuite.valueTexts), null, '  ') : "");

			this._outputAreaToSelectionVariant.setValue("");
			// this._outputAreaFromSelectionVariant.setValue("");

			this._outputAreaFilterProviderOData.setValue(JSON.stringify(this._oFilterBar._oFilterProvider.oModel.oData, null, '  '));
			this._outputAreagetFilterData.setValue(JSON.stringify(this._oFilterBar.getFilterData(), null, '  '));
		},

		onClear: function(oEvent) {
			MessageToast.show("Clear pressed!");
		},

		onRestore: function(oEvent) {
			MessageToast.show("Restore pressed!");
		},

		onCancel: function(oEvent) {
			MessageToast.show("Cancel pressed!");
		},

		onBeforeRebindTable: function(oEvent) {

			var oAnalyticalBinding = this._oFilterBar.getAnalyticBindingPath();
			this._oTable.setTableBindingPath(oAnalyticalBinding);
		},

		onCreateToSelectionVariant: function() {

			var sTextAreaText = this._oOutputDataSuite.getValue();

			this._outputAreaToSelectionVariant.setValue("");
			this._outputAreaFromSelectionVariant.setValue("");
			if (sTextAreaText) {
				var oSelVariant = new SelectionVariant(sTextAreaText.replace(/\s+/g, ''));

				this._outputAreaToSelectionVariant.setValue(JSON.stringify(oSelVariant.toJSONObject(), null, '  '));
			}
		},

		onSetFilterData: function() {
			this._oFilterBar.setFilterData(this._oFilterBar.getFilterData());
			//this._oFilterBar.setFilterData(JSON.parse(this._outputAreagetFilterData.getValue()));
		},

		onSetFilterDataAsString: function() {
			this._oFilterBar.setFilterDataAsString(this._outputAreagetFilterData.getValue());
		},

		onCreatetFromSelectionVariant: function() {
			var sPayload;
			var oUiState = {};
			var sTextAreaText = this._outputAreaToSelectionVariant.getValue();

			this._outputAreaFromSelectionVariant.setValue("");
			if (sTextAreaText) {
				var oSelVariant = JSON.parse(sTextAreaText);

				oUiState.SelectionVariant = oSelVariant;
				if (oSelVariant.Parameters) {
					oUiState.Parameters = oSelVariant.Parameters;
				}
				if (oSelVariant.SelectOptions) {
					oUiState.SelectOptions = oSelVariant.SelectOptions;
				}

				var sValueTexts = this._oOutputValueTexts.getValue();
				this._setUiState(oUiState.SelectionVariant, sValueTexts ? sValueTexts : null);

				oUiState = this._getUiState();

				var oConverter = new VariantConverterFrom();
				var oContent = oConverter.convert(oUiState.selectionVariant, this._oFilterBar, this._bStrictMode);
				if (oContent && oContent.payload) {
					sPayload = UIState.enrichWithValueTexts(oContent.payload, JSON.parse(sValueTexts ? sValueTexts : null));
				}

				this._outputAreaFromSelectionVariant.setValue(JSON.stringify(JSON.parse(sPayload), null, '  '));

//				if (oUiState.selectionVariant !== this._oOutputDataSuite.getValue()) {
//					this._outputAreaFromSelectionVariant.setValueState("Error");
//				} else {
//					this._outputAreaFromSelectionVariant.setValueState("None");
//				}

			}
		},

		onAssignedFiltersChanged: function(oEvent) {
			if (this._oFilterBar) {
				var sText = this._oFilterBar.retrieveFiltersWithValuesAsText();
				this._oStatusText.setText(sText);
			}
		},

		onInitialized: function(oEvent) {
			// set initial UTC switch state
			var bUtc = !!this._oFilterBar._oFilterProvider._oDateFormatSettings["UTC"];
			this.getView().byId("UtcModeSwitch").setState(bUtc);
		},

		onShowAllFilterFields: function(oEvent) {
			var aFilterGroupItems = this._oFilterBar.getFilterGroupItems();
			for (var i = aFilterGroupItems.length - 1; i > -1; --i) {
				aFilterGroupItems[i].setVisibleInFilterBar(true);
			}
		},

		onUtcModeChange: function(oEvent) {
			var bSwitchState = oEvent.getParameters()['state'];
			this._oFilterBar._oFilterProvider._oDateFormatSettings["UTC"] = bSwitchState;
		}
	});
});
