sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/demoapps/rta/fiorielements/formatter/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter"

], function(Controller, formatter, Filter, FilterOperator, Sorter) {
	"use strict";
	return Controller.extend("sap.ui.demoapps.rta.fiorielements.ext.view.Default", {
		formatter: formatter,

		onInit: function() {
			this._mDialogs = {};
			this.aMessageFilters = [];
			this.oSBTable = this.oView.byId("storageBinTable");
		},

		onOpenSortDialog: function() {
			var sFullFragmentName = "sap.ui.demoapps.rta.fiorielements.ext.view.SortDialog",
				oDialog = this._mDialogs[sFullFragmentName];
			if (!oDialog) {
				this._mDialogs[sFullFragmentName] = oDialog = sap.ui.xmlfragment(sFullFragmentName, this);
				this.oView.addDependent(oDialog);
			}
			oDialog.open();
		},

		onSortDialogConfirmed: function(oEvent) {
			var mParams = oEvent.getParameters(),
				sSortPath = mParams.sortItem.getKey(),
				oTableBinding = this.byId("storageBinTable").getBinding("items");
			if (oTableBinding) {
				oTableBinding.sort(new Sorter(sSortPath, mParams.sortDescending));
			}
		},

		getMessageFilter: function() {
			//The message filters are used by the message model to find the messages that refere to the currently shown entities.
			//Therefore the new binding context has to be known in order to build the correct filters.
			//When getMessageFilter is called the new binding context might not yet be known -> A promise is returned which is
			//resolved when the context ist set (that is when the "change" event of the binding of aggregation "items" is triggered)
			//Please note:
			//1. One filter is added for each entry of the storage bin table. This is necessary because the filter only works with
			//	absolute bindig paths for each entity - relative paths like "/Product("ABC")/to_storageBin" are not allowed.
			//2. Mapping messages to table entries is problematic when e.g. a growing list does not show all items -> not all filters#
			//   can be created or when items of the list can be added or deleted.
			//   In this example such cases can not occur so it is save to provide message filter functionallity
			$.sap.log.error("getMessageFilter called");
			return new Promise(function(resolve) {
				var aMsgFilter = [],
					aItems = null;
				var fnOnChange = function() {
					// is called when the binding context changes
					// builds the filters for message filtering as soon as the new context is available
					this.aMessageFilters.length = 0;
					aItems = this.oSBTable.getAggregation("items");
					if (aItems) {
						aItems.forEach(
							function(oListItem) {
								aMsgFilter.push(new Filter({
									path: "target",
									operator: FilterOperator.StartsWith,
									value1: oListItem.getBindingContextPath()
								}));
							});
					}
					resolve(aMsgFilter);
				};
				var oItmBinding = this.oSBTable.getBinding("items");
				oItmBinding.attachEventOnce("change", fnOnChange, this);
			}.bind(this));
		}
	});
});
