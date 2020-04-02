jQuery.sap.require("sap.ca.scfld.md.controller.ScfldMasterController");
jQuery.sap.require("AppScflTest.util.Conversions");

sap.ca.scfld.md.controller.ScfldMasterController.extend("AppScflTest.view.S2", {

	// global view parameters
	sFilterSearchText : "",
	sFilterHistory : "90",
	sFilterAlerts : "",

	oListItemTemplate : null,

	sGroupBy : "NONE",

	oSorterBySupplier : new sap.ui.model.Sorter("SupplierName", false, true),

	oSorterByStatus : new sap.ui.model.Sorter("Status", false, true),

	oSorter : null,

	onInit : function() {
		AppScflTest.util.Conversions.oResourceBundle = this.oApplicationFacade.getResourceBundle();

		this.initHeaderFooterOptions();
		this.updateFilterUI();
		var oModel = new sap.ui.model.json.JSONModel({}); //this.oApplicationFacade.getODataModel();
		if (oModel) {
//			oModel.setCountSupported(false);
//			oModel.setSizeLimit(50);
			this.oListItemTemplate = this.getList().getItems()[0].clone();
			this.getData();
		}
	},

	getData : function() {
		var oList = this.getList();
		oList.bindAggregation("items", {
			path : "/POLists",
			template : this.oListItemTemplate,
//			filters :  this.createFilters(),
			sorter : this.createSorters()
		});
		this.registerMasterListBind(oList);
	},

	applyFilters : function() {
		this.getList().getBinding("items").filter(this.createFilters(), sap.ui.model.FilterType.Application);
		//this.getData(); //alternative
	},

	applySorters : function() {
		this.getList().getBinding("items").sort(this.createSorters(), sap.ui.model.FilterType.Application);
		//this.getData(); //alternative
	},

	createFilters : function() {
		var aFilters = [];
		if (this.sFilterSearchText) {
			var oFilter = new sap.ui.model.odata.Filter("SearchText", [ {
				operator : "EQ",
				value1 : this.sFilterSearchText
			} ]);
			aFilters.push(oFilter);
		}
		if ( this.sFilterHistory && isFinite(this.sFilterHistory) ) {
			var dNow = new Date();
			dNow.setDate(dNow.getDate() - this.sFilterHistory);
			var yyyy = dNow.getFullYear().toString();
			var mm = (dNow.getMonth() + 1).toString();
			var dd = dNow.getDate().toString();
			var sDateFilter = yyyy + (mm[1] ? mm : "0" + mm[0]) + (dd[1] ? dd : "0" + dd[0]);
			var oFilterDays = new sap.ui.model.odata.Filter("CreatedAt", [ {
				operator : "GT",
				value1 : sDateFilter
			} ]);
			aFilters.push(oFilterDays);
		}
		if (this.sFilterAlerts) {
			var oFilterAlerts1 = new sap.ui.model.odata.Filter("DeliveryErrorIndicator", [ {
				operator : "EQ",
				value1 : this.sFilterAlerts
			} ]);
			aFilters.push(oFilterAlerts1);
			var oFilterAlerts2 = new sap.ui.model.odata.Filter("ConfErrorIndicator", [ {
				operator : "EQ",
				value1 : this.sFilterAlerts
			} ]);
			aFilters.push(oFilterAlerts2);
		}
		return aFilters;
	},

	createSorters : function() {
		var aSorters = [];
		if (this.oSorter) {
			aSorters.push(this.oSorter);
		}
		return aSorters;
	},


	isLiveSearch : function() {
		return false;
	},

	isBackendSearch : function() {
		return true;
	},

	applyBackendSearchPattern : function(sFilterPattern, oBinding) {
		this.sFilterSearchText = sFilterPattern;
		this.updateFilterUI();
//		this.applyFilters();
	},

	getDetailRouteName : function() {
		return "PODetail";
	},

	getDetailNavigationParameters : function(oListItem) {
		if (oListItem) {
			var oBindingContext = oListItem.getBindingContext();
			if (oBindingContext) {
				var oProperty = this.getView().getModel().getProperty(oBindingContext.getPath());
				return {
					ponumber : oProperty.PONumber,
					origin : oProperty.SAP__Origin
				};
			}
		}
	},

	getBindingContextPathFor : function (oArguments) {
		return "/POLists(SAP__Origin='" + oArguments.origin + "',PONumber='" + oArguments.ponumber + "')";
	},

	initHeaderFooterOptions : function() {
		this.oHeaderFooterOptions = {
			sI18NMasterTitle : "MASTER_TITLE",
			oGroupOptions : {
				aGroupItems : [{
					text : "No Grouping",
					key : "GROUP:NONE"
				}, {
					text : "Group by Supplier",
					key : "GROUP:SUPPLIER"
				}, {
					text : "Group by Status",
					key : "GROUP:STATUS"
				}],
				sSelectedItemKey : "GROUP:NONE",
				onGroupSelected : jQuery.proxy(this.onGroupSelected, this)
			},
			oFilterOptions : {
				aFilterItems : [
					this.createFilterDescriptor("", ""),
					this.createFilterDescriptor("90", ""),
					this.createFilterDescriptor("30", ""),
					this.createFilterDescriptor("7", ""),
					this.createFilterDescriptor("", "X"),
					this.createFilterDescriptor("90", "X"),
					this.createFilterDescriptor("30", "X"),
					this.createFilterDescriptor("7", "X")
				],
				sSelectedItemKey : "FILTER:" + this.sFilterHistory + ":" + this.sFilterAlerts,
				onFilterSelected : jQuery.proxy(this.onFilterSelected, this)
			}
		};
	},

	onGroupSelected : function(sKey) {
		switch (sKey) {
			case "GROUP:NONE":
				this.oSorter = null;
				break;
			case "GROUP:SUPPLIER":
				this.oSorter = this.oSorterBySupplier;
				break;
			case "GROUP:STATUS":
				this.oSorter = this.oSorterByStatus;
				break;
			default:
				return;
		}
		this.oHeaderFooterOptions.oGroupOptions.sSelectedItemKey = sKey;
		this.applySorters();
	},

	onFilterSelected : function(sKey) {
		var match = sKey.match(/FILTER:(\d*):(\w*)/);
		if (match) {
			this.sFilterHistory = match[1];
			this.sFilterAlerts = match[2];
			this.updateFilterUI();
			this.applyFilters();
		}
	},

	getHeaderFooterOptions : function() {
		return this.oHeaderFooterOptions;
	},

	createFilterText: function(sHistory, sAlerts) {
		if (sHistory) {
			if (sAlerts) {
				return this.oApplicationFacade.getResourceBundle().getText( "XFLD_Last_N_Days_with_alerts", [sHistory]);
            } else {
				return this.oApplicationFacade.getResourceBundle().getText( "XFLD_Last_N_Days", [sHistory]);
            }
		} else {
			if (sAlerts) {
				return this.oApplicationFacade.getResourceBundle().getText( "XFLD_All_with_alerts");
            } else {
				return this.oApplicationFacade.getResourceBundle().getText("XFLD_All");
            }
        }
	},

	createFilterDescriptor: function(sHistory, sAlerts) {
		return {
			text : this.createFilterText(sHistory, sAlerts),
			key : "FILTER:" + sHistory + ":" + sAlerts
		};
	},

	updateFilterUI : function(oEvent) {
		// set info bar text
		var oLabel = this.byId("FilterInfoText");
		if (oLabel) {
			oLabel.setText(this.oApplicationFacade.getResourceBundle().getText("XFLD_Filter") + ": " + this.createFilterText(this.sFilterHistory, this.sFilterAlerts));
        }
		// set info bar visibility
		var oInfoBar = this.byId("FilterInfoBar");
		if (oInfoBar) {
			oInfoBar.setVisible(!!(this.sFilterHistory || this.sFilterAlerts));
        }
		oInfoBar = this.byId("AdditionalHeader");
		if (oInfoBar) {
			oInfoBar.setVisible(!!this.sFilterSearchText.match(/e{1}g{2}/i));
        }
		// update filter options in header footer
		this.oHeaderFooterOptions.oFilterOptions.sSelectedItemKey = "FILTER:" + this.sFilterHistory + ":" + this.sFilterAlerts;
	},

	pressFilterInfoBar : function(oEvent) {
		this.sFilterHistory = "";
		this.sFilterAlerts = "";
		this.updateFilterUI();
		this.applyFilters();
	}

});
