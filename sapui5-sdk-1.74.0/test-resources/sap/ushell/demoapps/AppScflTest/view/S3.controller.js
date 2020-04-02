jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("AppScflTest.util.Dialog");

sap.ca.scfld.md.controller.BaseDetailController.extend("AppScflTest.view.S3", {

	// global view parameters
	sOrigin : "",
	sPONumber : "",

	onInit: function() {
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "PODetail") {
				this.sOrigin = oEvent.getParameter("arguments").origin;
				this.sPONumber = oEvent.getParameter("arguments").ponumber;
				this.getView().bindElement("/PODetailedDatas(SAP__Origin='" + this.sOrigin + "',PONumber='" + this.sPONumber + "')?$expand=POItems");
			}
		}, this);
		this.oHeaderFooterOptions = {
			sI18NDetailTitle : "XTIT_PurchaseOrderItems",
		};
		if (jQuery.device.is.phone)
			this.oHeaderFooterOptions.onBack =  jQuery.proxy(this.goBack, this);
		this.setHeaderFooterOptions(this.oHeaderFooterOptions);
	},

	goToItemDetail : function(oEvent) {
		var oItem = oEvent.getSource();
		var oModel = this.getView().getModel();
		var sItemPath = oItem.getBindingContext().getPath();
		var oItemProperty = oModel.getProperty(sItemPath);

		var aItemNumbers = new Array();
		if (this.oApplicationFacade.isMock()) {
			// ultra ugly kludge but we have ECC today, Saturday 8 pm, and miles to go before I sleep
			aItemNumbers.push("00010");
			aItemNumbers.push("00020");
			aItemNumbers.push("00030");
			aItemNumbers.push("00040");
		}
		else {
			var aItemPaths = oModel.getProperty("POItems", oItem.getParent().getBindingContext());
			for (var i = 0; i < aItemPaths.length; i++) {
				var sPOItemnumber = aItemPaths[i].match(/ItemNumber='(\w+)'/)[1];
				if (sPOItemnumber)
					aItemNumbers.push(sPOItemnumber);
			}
		}
		this.oRouter.navTo("POItem", {
			origin: oItemProperty.SAP__Origin,
			ponumber: oItemProperty.PONumber,
			poitemnumber: oItemProperty.ItemNumber,
			params : {"navitems" : aItemNumbers.join() }
		}, false);
	},

	showSupplierBusinessCard : function(oEvent) {
		var sTitle = this.oApplicationFacade.getResourceBundle().getText("XFLD_SupplierInfo");
		var sSupplierId = this.oApplicationFacade.getODataModel().getProperty("SupplierID", this.getView().getBindingContext());
		AppScflTest.util.Dialog.showSupplierBusinessCard(sTitle, sSupplierId, oEvent.getParameters().domRef, this.sOrigin, this.oApplicationFacade );
	},

	btnIconTabBar : function(oEvent) {
		var sButtonId = oEvent.mParameters.selectedItem.sId.match(/--(\w+)$/)[1];
		switch (sButtonId) {
		case "btnOrdered":
			this.byId("TableHeader").setText(this.oApplicationFacade.getResourceBundle().getText("XCAP_OrderedItems"));
			this.filterList( "OrderedDate" , function(str){ return str != ""; } );
			break;
		case "btnDelivered":
			this.byId("TableHeader").setText(this.oApplicationFacade.getResourceBundle().getText("XCAP_DeliveredItems"));
			this.filterList( "DeliveredDate" , function(str){ return str != ""; } );
			break;
		case "btnInvoiced":
			this.byId("TableHeader").setText(this.oApplicationFacade.getResourceBundle().getText("XCAP_InvoicedItems"));
			this.filterList( "InvoicedDate" , function(str){ return str != ""; } );
			break;
		case "btnPaid":
			this.byId("TableHeader").setText(this.oApplicationFacade.getResourceBundle().getText("XCAP_PaidItems"));
			this.filterList( "SplCondPaid" , function(str){ return str == "2" || str == "3"; } );
			break;
		}
	},

	filterList : function(sFieldName, isVisible) {
		var list = this.byId("Items").getItems();
		if (list)
			$.each(list, function(keyL, valueL) {
				var sFieldValue = valueL.getBindingContext().getModel().getProperty(valueL.getBindingContext().getPath() + "/" + sFieldName);
				valueL.setVisible(isVisible(sFieldValue));
			});
	},

	goBack : function(oEvent) {
		var sDir = sap.ui.core.routing.History.getInstance().getDirection(""); // dummy call to identify deep link situation
		if (sDir && sDir !== "Unknown") {
			window.history.go(-1);
		} else {
			this.oRouter.navTo("master", {}, true);
		}
	}

});