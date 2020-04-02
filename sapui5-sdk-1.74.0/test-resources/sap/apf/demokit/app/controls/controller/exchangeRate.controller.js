jQuery.sap.require("sap.apf.demokit.app.helper.contextMediator");
(function() {
	"use strict";
	var mDatasets, oView, oApi, sExchangeRateDateFilterId, sExchangeRateTypeFilterId, mModels;
	/**
	 * Add the selected values to the path if boolean is true on initialization
	 * Later updates the filters with selected values.
	 * */
	function _setFilters(bIsOnInit) {
		_updateExchangeRateFilter(bIsOnInit);
		_updateDateFilter(bIsOnInit);
		oApi.selectionChanged(true);
	}
	/**
	 * Adds the exchange rate filter type to the path on initialization
	 * Later updates Exchange Rate Filter with selected type.
	 * */
	function _updateExchangeRateFilter(bIsOnInit) {
		var oFilter = oApi.createFilter();
		var orExpression = oFilter.getTopAnd().addOr();
		orExpression.addExpression({
			name : "P_ExchangeRateType",
			operator : "EQ",
			value : mDatasets.oExchangeRateDataset.sSelectedExchangeRateKey
		});
		if (bIsOnInit) {
			sExchangeRateTypeFilterId = oApi.addPathFilter(oFilter);
		} else {
			oApi.updatePathFilter(sExchangeRateTypeFilterId, oFilter);
		}
	}
	/**
	 * Adds the exchange rate filter date to the path on initialization
	 * Later updates Exchange Rate Date Filter with selected date value.
	 * */
	function _updateDateFilter(bIsOnInit) {
		var sSelectedDateTypeKey = mDatasets.oDateTypeDataset.sSelectedDateType;
		var sSelectedDate = null;
		if (sSelectedDateTypeKey === "postingDate") {
			sSelectedDate = "00000000";
		} else {
			sSelectedDate = _convertToFilterDateFormat(mDatasets.oDateDataset.sSelectedDate);
		}
		var oFilter = oApi.createFilter();
		var orExpression = oFilter.getTopAnd().addOr();
		orExpression.addExpression({
			name : "P_ExchangeRateDate",
			operator : "EQ",
			value : sSelectedDate
		});
		if (bIsOnInit) {
			sExchangeRateDateFilterId = oApi.addPathFilter(oFilter);
		} else {
			oApi.updatePathFilter(sExchangeRateDateFilterId, oFilter);
		}
	}
	/**
	 * Utility function to convert date to UI format
	 * 20140101 --> Jan 01, 2014
	 * */
	function _convertToUIDateFormat(sDate) {
		var sYear = sDate.slice(0, 4);
		var sMonth = sDate.slice(4, 6);
		var sDay = sDate.slice(6, 8);
		return sYear + "." + sMonth + "." + sDay;
	}
	/**
	 * Utility function to convert date to filter format.
	 * 20140101 --> 2014.01.01
	 * */
	function _convertToFilterDateFormat(sDate) {
		var oDate = new Date(sDate);
		var sYear = oDate.getFullYear().toString();
		var sMonth = (oDate.getMonth() + 1).toString();
		if (sMonth.length === 1) {
			sMonth = "0" + sMonth;
		}
		var sDay = oDate.getDate().toString();
		if (sDay.length === 1) {
			sDay = "0" + sDay;
		}
		var sFormattedDate = sYear + sMonth + sDay;
		return sFormattedDate;
	}
	sap.ui.controller("sap.apf.demokit.app.controls.controller.exchangeRate", {
		onInit : function() {
			// Store references of view and oApi.
			var oController = this;
			oView = this.getView();
			oApi = this.getView().oApi;
			//Adds compact mode when application runs in desktop
			if (sap.ui.Device.system.desktop) {
				oView.addStyleClass("sapUiSizeCompact");
			}
			// A map of all data sets used. 
			oApi.getApplicationConfigProperties().done(function(configProperties) {
				mDatasets = {
					oExchangeRateDataset : {
						aExchangeRateTypes : [],
						sSelectedExchangeRateKey : configProperties.defaultExchangeRateType
					// Default Value.
					},
					oDateTypeDataset : {
						aDateTypes : [ {
							text : oApi.getTextNotHtmlEncoded("postingDate"),
							key : "postingDate"
						}, {
							text : oApi.getTextNotHtmlEncoded("keyDateKey"),
							key : "keyDate"
						} ],
						sSelectedDateType : "postingDate" // Default Value.
					},
					oDateDataset : {
						sSelectedDate : ""
					}
				};
				// A map of all models used.
				mModels = {
					oExchangeRateModel : new sap.ui.model.json.JSONModel(mDatasets.oExchangeRateDataset),
					oDateTypeModel : new sap.ui.model.json.JSONModel(mDatasets.oDateTypeDataset),
					oDateModel : new sap.ui.model.json.JSONModel(mDatasets.oDateDataset)
				};
				// Set models on respective controllers.
				oView.oExchangeRateDropdown.setModel(mModels.oExchangeRateModel);
				oView.oDateTypeDropdown.setModel(mModels.oDateTypeModel);
				oView.oDatePicker.setModel(mModels.oDateModel);
				// Pass the default filters to the context.
				// Might get overridden by smartBusiness Context if available.
				var bIsOnInit = true; // Boolean to differentiate between add and update of filter
				_setFilters(bIsOnInit);
			});
			// Attach a listener to 'sap.apf.contextChanged' event.
			var oContextMediator = sap.apf.demokit.app.helper.ContextMediator.getInstance(oApi);
			oContextMediator.onContextChange(this.contextChanged.bind(this));
		},
		/**
		 * Trigger request to fetch exchange Rate Type list.
		 * Creates the data set and update the bindings.
		 * */
		_populateMasterContent : function() {
			var self = this;
			oApi.getPropertyValuesOfExternalContext('SAPClient').then(function(terms) {
				var sapClient = terms[0].Low;
				var oRequestConfiguration = {
					"type" : "request",
					"id" : "requestExchangeRateInitialStep",
					"service" : "/sap/hba/apps/wca/dso/s/odata/wca.xsodata",
					"entityType" : "ExchangeRateQuery",
					"selectProperties" : [ "ExchangeRateType", "ExchangeRateTypeName" ]
				};
				var oRequest = oApi.createReadRequest(oRequestConfiguration);
				var filter = oApi.createFilter();
				var filterOrExp = filter.getTopAnd().addOr();
				filterOrExp.addExpression({
					name : "SAPClient",
					operator : "EQ",
					value : sapClient
				});
				oRequest.send(filter, function(aData, oMetadata, oMessage) { // TODO  Check if dummy filter can be avoided.
					if (!oMessage && aData && aData.length) {
						mDatasets.oExchangeRateDataset.aExchangeRateTypes = [];
						aData.forEach(function(oDataRow) {
							mDatasets.oExchangeRateDataset.aExchangeRateTypes.push({
								key : oDataRow.ExchangeRateType,
								text : oDataRow.ExchangeRateTypeName ? (oDataRow.ExchangeRateType + " - " + oDataRow.ExchangeRateTypeName) : oDataRow.ExchangeRateType
							});
						});
						mModels.oExchangeRateModel.updateBindings();
					} else {
						var oMessageObj = oApi.createMessageObject({
							code : "12003",
							aParameters : [ oApi.getTextNotHtmlEncoded("P_ExchangeRateType") ]
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
			var oFilter = oApi.getPathFilter(sExchangeRateTypeFilterId);
			var sSelectedExchangeRateKey = oFilter.getInternalFilter().getFilterTerms()[0].getValue();
			this._populateMasterContent();
			mDatasets.oExchangeRateDataset.sSelectedExchangeRateKey = sSelectedExchangeRateKey;
			mModels.oExchangeRateModel.updateBindings();
			oFilter = oApi.getPathFilter(sExchangeRateDateFilterId);
			var sSelectedDate = oFilter.getInternalFilter().getFilterTerms()[0].getValue();
			switch (sSelectedDate) {
				case "00000000":
					this._selectPostingDate();
					break;
				default:
					this._selectKeyDate();
					mDatasets.oDateDataset.sSelectedDate = _convertToUIDateFormat(sSelectedDate);
					mModels.oDateModel.updateBindings();
			}
		},
		/**
		 * Handler for 'OK' press on dialog.
		 * Updates the filters and closes the dialog.
		 * */
		handleOkPress : function() {
			if (oView.oDatePicker.getValueState() === sap.ui.core.ValueState.None) {
				_setFilters();
				oView.oDialog.close();
			}
		},
		handleChangeForDatePicker : function(oEvent) {
			var bValid = oEvent.getParameter("valid");
			if (bValid === true) {
				oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
			}
		},
		/**
		 * Handler for 'cancel' press on dialog.
		 * Restore the initial state of the dialog.
		 * */
		handleCancelPress : function() {
			oView.oDatePicker.setValueState(sap.ui.core.ValueState.None);
			this._restoreInitialState();
			oView.oDialog.close();
		},
		/**
		 * Listener for 'beforeOpen' event of dialog.
		 * Saves the initial state of the dialog which will be restored at the time of 'cancel' press.
		 * */
		handleDialogOpen : function() {
			this._saveInitialState();
			if (mModels.oDateTypeModel.getData().sSelectedDateType === "postingDate") {
				oView.hideDatePicker();
			} else {
				oView.showDatePicker();
			}
		},
		/**
		 * Set 'Posting Date' as date type.
		 * Hides the date picker.
		 * */
		_selectPostingDate : function() {
			mDatasets.oDateTypeDataset.sSelectedDateType = "postingDate";
			mModels.oDateTypeModel.updateBindings();
			oView.hideDatePicker();
		},
		/**
		 * Set 'Key Date/Dynamic Date' as date type.
		 * Shows the date picker.
		 * */
		_selectKeyDate : function() {
			mDatasets.oDateTypeDataset.sSelectedDateType = "keyDate";
			mModels.oDateTypeModel.updateBindings();
			oView.showDatePicker();
		},
		/**
		 * Stores the state of dialog (data set) in an instance variable.
		 * */
		_saveInitialState : function() {
			this.aInitialDatasets = [];
			var i = null;
			for(i in mModels) {
				if (mModels.hasOwnProperty(i)) {
					var oDataset = jQuery.extend(true, {}, mModels[i].getData());
					this.aInitialDatasets.push(oDataset);
				}
			}
		},
		/**
		 * Restore the data sets value from the initial state instance variable.
		 * */
		_restoreInitialState : function() {
			var i = null, j = 0;
			for(i in mDatasets) {
				if (mDatasets.hasOwnProperty(i)) {
					mDatasets[i] = this.aInitialDatasets[j++];
				}
			}
			j = 0;
			for(i in mModels) {
				if (mModels.hasOwnProperty(i)) {
					mModels[i].setData(this.aInitialDatasets[j++]);
				}
			}
		}
	});
}());