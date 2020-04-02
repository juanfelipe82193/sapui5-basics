/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.require("sap.apf.demokit.app.helper.contextMediator");
(function() {
	"use strict";
	var oView, oApi, sSelectedCurrency, sDisplayCurrencyFilterId;
	/**
	 * Add the selected currency to the path if boolean is true on initialization
	 * Later updates the path context filter with currently selected currency value
	 * */
	function _setFilter(bIsOnInit) {
		var oFilter = oApi.createFilter();
		var oFilterOrExp = oFilter.getTopAnd().addOr();
		oFilterOrExp.addExpression({
			name : "P_DisplayCurrency",
			operator : "EQ",
			value : sSelectedCurrency
		});
		if (bIsOnInit) {
			sDisplayCurrencyFilterId = oApi.addPathFilter(oFilter);
		} else {
			oApi.updatePathFilter(sDisplayCurrencyFilterId, oFilter);
		}
		oApi.selectionChanged(true);
	}
	sap.ui.controller("sap.apf.demokit.app.controls.controller.reportingCurrency", {
		onInit : function() {
			// Store the references of view and oApi.
			oView = this.getView();
			oApi = this.getView().oApi;
			//Adds compact mode when application runs in desktop
			if (sap.ui.Device.system.desktop) {
				oView.addStyleClass("sapUiSizeCompact");
			}
			// Prepare dataset and model for select dialog list of currencies.
			this.aDataset = [];
			this.oModel = new sap.ui.model.json.JSONModel(this.aDataset);
			oView.oDialog.setModel(this.oModel);
			// Default Currency in case there is no smartBusiness context.
			oApi.getApplicationConfigProperties().done(function(configProperties) {
				sSelectedCurrency = configProperties.defaultReportingCurrency;
				// Pass the default currency to the context.
				// Might get overridden by smartBusiness Context if available.
				var bIsOnInit = true; // Boolean to differentiate between add and update of filter
				_setFilter(bIsOnInit);
			});
			// Register a listener for 'sap.apf.contextChanged' event.
			var oContextMediator = sap.apf.demokit.app.helper.ContextMediator.getInstance(oApi);
			oContextMediator.onContextChange(this.contextChanged.bind(this));
		},
		/**
		 * Trigger request to populate currency list.
		 * Creates Data set and update the bindings when data is ready.
		 * */
		_populateMasterList : function() {
			var self = this;
			oApi.getPropertyValuesOfExternalContext('SAPClient').then(function(terms) {
				var sapClient = terms[0].Low;
				var oRequestConfiguration = {
					"type" : "request",
					"id" : "requestCurrencyInitialStep",
					"service" : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata",
					"entityType" : "CurrencyQuery",
					"selectProperties" : [ "Currency", "CurrencyShortName" ]
				};
				var oRequest = oApi.createReadRequest(oRequestConfiguration);
				var filter = oApi.createFilter();
				var filterOrExp = filter.getTopAnd().addOr();
				filterOrExp.addExpression({
					name : "SAPClient",
					operator : "EQ",
					value : sapClient
				});
				oRequest.send(filter, function(aData, oMetadata, oMessage) {
					if (!oMessage && aData && aData.length) {
						self.aDataset = [];
						aData.forEach(function(oDataRow) {
							self.aDataset.push({
								key : oDataRow.Currency,
								text : oDataRow.CurrencyShortName ? (oDataRow.Currency + " - " + oDataRow.CurrencyShortName) : oDataRow.Currency,
								selected : (oDataRow.Currency === sSelectedCurrency)
							});
						});
						self.oModel.setData(self.aDataset);
					} else {
						var oMessageObj = oApi.createMessageObject({
							code : "12003",
							aParameters : [ oApi.getTextNotHtmlEncoded("reportingCurrency") ]
						});
						oApi.putMessage(oMessageObj);
					}
				});
			});
		},
		/**
		 * Listener for 'sap.apf.contextChanged' event.
		 * Fetches the filter from path Context and updates the binding.
		 * */
		contextChanged : function() {
			var oFilter = oApi.getPathFilter(sDisplayCurrencyFilterId);
			sSelectedCurrency = oFilter.getInternalFilter().getFilterTerms()[0].getValue();
			this._populateMasterList();
			this.oModel.updateBindings();
		},
		/**
		 * Handler for 'Confirm' press on select dialog.
		 * update the currency filter.
		 * */
		onConfirmPress : function(oEvt) {
			var self = this;
			var oSelectedItem = oEvt.getParameter('selectedItem');
			sSelectedCurrency = oSelectedItem.getBindingContext().getProperty("key");
			this.aDataset.forEach(function(oDataset) {
				oDataset.selected = false;
				if (oDataset.key === sSelectedCurrency) {
					oDataset.selected = true;
				}
			});
			_setFilter();
			this._applySearchFilters([]);
		},
		/**
		 * Handler for 'liveChange' and 'search' events on select dialog.
		 * */
		doSearchItems : function(oEvt) {
			var sValue = oEvt.getParameter("value");
			var oFilter = new sap.ui.model.Filter("text", sap.ui.model.FilterOperator.Contains, sValue);
			this._applySearchFilters([ oFilter ]);
		},
		/**
		 * Handler for 'cancel' press on select dialog.
		 * */
		onCancelPress : function() {
			this._applySearchFilters([]);
			return;
		},
		/**
		 * update the filter with passed argument.
		 * pass an empty array to clear the filter.
		 * */
		_applySearchFilters : function(aFilters) {
			var oBinding = oView.oDialog.getBinding("items");
			oBinding.filter(aFilters, false);
			this.oModel.updateBindings();
		}
	});
}());