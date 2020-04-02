sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/m/SearchField'
], function(Controller, ODataModel, SearchField) {
	"use strict";

	return Controller.extend("sap.ui.comp.sample.smartfilterbar.example1.SmartFilterBar", {

		_smartFilterBar: null,

		onInit: function() {
			var oModel = new ODataModel("/MockDataService", true);
			this.getView().setModel(oModel);

			this._smartFilterBar = this.getView().byId("smartFilterBar");

			if (this._smartFilterBar) {
				this._smartFilterBar.attachFilterChange(function(oEvent) {
				});

				var oBasicSearchField = new SearchField();
				oBasicSearchField.attachLiveChange(function(oEvent) {
					this.getView().byId("smartFilterBar").fireFilterChange(oEvent);
				}.bind(this));

				this._smartFilterBar.setBasicSearch(oBasicSearchField);
			}
		},

		toggleUpdateMode: function() {
			var oButton = this.getView().byId("toggleUpdateMode");

			if (!this._smartFilterBar || !oButton) {
				return;
			}

			var bLiveMode = this._smartFilterBar.getLiveMode();
			if (bLiveMode) {
				oButton.setText("Change to 'LiveMode'");
			} else {
				oButton.setText("Change to 'ManualMode'");
			}

			this._smartFilterBar.setLiveMode(!bLiveMode);
		},

		_setButtonText: function() {
			var oButton = this.getView().byId("toggleUpdateMode");

			if (!this._smartFilterBar || !oButton) {
				return;
			}

			var bLiveMode = this._smartFilterBar.getLiveMode();
			if (bLiveMode) {
				oButton.setText("Change to 'LiveMode'");
			} else {
				oButton.setText("Change to 'ManualMode'");
			}
		},

		onAfterVariantLoad: function(oEvent) {
			if (this._smartFilterBar) {

				var oData = this._smartFilterBar.getFilterData();
				var oCustomFieldData = oData["_CUSTOM"];
				if (oCustomFieldData) {

					var oCtrl = this._smartFilterBar.determineControlByName("MyOwnFilterField");

					if (oCtrl) {
						oCtrl.setSelectedKey(oCustomFieldData.MyOwnFilterField);
					}
				}
			}
		},

		onBeforeVariantSave: function(oEvent) {
			if (oEvent.getParameter("context") === "STANDARD") {
				this._updateCustomFilter();
			}
		},

		onBeforeVariantFetch: function(oEvent) {
			this._updateCustomFilter();
		},

		_updateCustomFilter: function() {
			if (this._smartFilterBar) {

				var oCtrl = this._smartFilterBar.determineControlByName("MyOwnFilterField");

				if (oCtrl) {
					this._smartFilterBar.setFilterData({
						_CUSTOM: {
							MyOwnFilterField: oCtrl.getSelectedKey()
						}
					});
				}
			}
		}
	});
});