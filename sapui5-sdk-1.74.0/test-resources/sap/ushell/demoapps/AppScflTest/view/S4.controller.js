jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");

sap.ca.scfld.md.controller.BaseDetailController.extend("AppScflTest.view.S4", {

	// global view parameters
	sOrigin : "",
	sPONumber : "",
	sItemNumber : "",
	aItemNumbers : null,

	onInit : function() {
		this.oRouter.attachRoutePatternMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "POItem") {
				this.sOrigin = oEvent.getParameter("arguments").origin;
				this.sPONumber = oEvent.getParameter("arguments").ponumber;
				this.sItemNumber = oEvent.getParameter("arguments").poitemnumber;
				var oParams = oEvent.getParameter("arguments")["?params"];
				this.aItemNumbers = (oParams && oParams.navitems) ? oParams.navitems.split(",") : null;
				this.getData();
				this.initButtons();
			}
		}, this);
	},

	getData : function() {
		this.getView().bindElement("/POItemDetailDatas(SAP__Origin='" + this.sOrigin + "',ItemNumber='" + this.sItemNumber + "',PONumber='" + this.sPONumber + "')?$expand=Accountings,PricingConditions,POItemDocFlows");
	},

	initButtons : function() {
		this.oHeaderFooterOptions = {
			onBack : jQuery.proxy(this.goBack, this),
			oUpDownOptions : {
				sI18NDetailTitle : "XTIT_POItemWithCounter",
				iPosition : 0,
				iCount : 0,
				fSetPosition : jQuery.proxy(this.setPosition, this)
			}
		};
		if (this.aItemNumbers)
			for (var i = 0; i < this.aItemNumbers.length; i++)
				if (this.aItemNumbers[i] === this.sItemNumber) {
					this.oHeaderFooterOptions.oUpDownOptions.iPosition = i;
					this.oHeaderFooterOptions.oUpDownOptions.iCount = this.aItemNumbers.length; // success indicator
					break;
				}
		this.setHeaderFooterOptions(this.oHeaderFooterOptions);
	},

	setPosition : function (iNewPosition) {
		if ( (iNewPosition >= 0) && (iNewPosition < this.aItemNumbers.length ) ) {
			this.sItemNumber = this.aItemNumbers[iNewPosition];
			this.oRouter.navTo("POItem", {
				origin: this.sOrigin,
				ponumber: this.sPONumber,
				poitemnumber: this.sItemNumber,
				params : {"navitems" : this.aItemNumbers.join() }
			}, true); // no entry in the browser history
		}
	},

	goToDocFlow : function(oEvent) {
		var oItem = oEvent.getSource();
		var sPath = oItem.getBindingContext().getPath();
		var oProperty = this.getView().getModel().getProperty(sPath);

		if (AppScflTest.util.Conversions.getDocType(oProperty.DocumentType) === DOC_TYPE_GOODSRECEIPT) {
			this.oRouter.navTo("GoodsReceipt", {
				origin : oProperty.SAP__Origin,
				year : oProperty.Year,
				docid : oProperty.DocumentId,
				params : {
					"docitem" : oProperty.DocumentItem,
					"doctype" : oProperty.DocumentTypeName
				}
			}, false);
		}
		else if (AppScflTest.util.Conversions.getDocType(oProperty.DocumentType) === DOC_TYPE_INVOICE) {
			this.oRouter.navTo("Invoice", {
				origin : oProperty.SAP__Origin,
				year : oProperty.Year,
				docid : oProperty.DocumentId,
				params : {
					"docitem" : oProperty.DocumentItem,
					"doctype" : oProperty.DocumentTypeName
				}
			}, false);
		}
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