sap.ui.jsview("sap.apf.demokit.app.controls.view.exchangeRate", {
	getControllerName : function() {
		return "sap.apf.demokit.app.controls.controller.exchangeRate";
	},
	createContent : function(oController) {
		// Store references.
		var self = this;
		this.oApi = this.getViewData().oApi;
		// Exchange Rate Label.
		var oExchangeRateLabel = new sap.m.Label({
			text : this.oApi.getTextNotHtmlEncoded("P_ExchangeRateType"),
			tooltip : {
				visible : false
			},
			design : sap.m.LabelDesign.Bold
		});
		// Exchange Rate Drop down
		var oExchangeRateDropdown = new sap.m.Select({
			width : "100%",
			items : {
				path : "/aExchangeRateTypes",
				template : new sap.ui.core.ListItem({
					key : '{key}',
					text : '{text}'
				})
			},
			selectedKey : "{/sSelectedExchangeRateKey}"
		});
		// Exchange Rate Content Holder.
		var oExchangeRateContent = new sap.ui.layout.VerticalLayout({
			width : "80%",
			content : [ oExchangeRateLabel, oExchangeRateDropdown ]
		}).addStyleClass("dropdownLayout");
		// Date Type Label.
		var oDateTypeLabel = new sap.m.Label({
			text : self.oApi.getTextNotHtmlEncoded("P_ExchangeRateDate"),
			tooltip : {
				visible : false
			},
			design : sap.m.LabelDesign.Bold
		});
		// Date Picker.
		var oDatePicker = new sap.m.DatePicker({
			placeholder : self.oApi.getTextNotHtmlEncoded("enterDate") + "(dd.mm.yyyy)",
			width : "100%",
			enabled : false,
			editable : false,
			value : '{/sSelectedDate}',
			valueFormat : 'dd.MM.yyyy',
			displayFormat : 'dd.MM.yyyy',
			change : oController.handleChangeForDatePicker.bind(oController)
		});
		// Date Type Drop down.
		var oDateTypeDropdown = new sap.m.Select({
			width : "100%",
			items : {
				path : "/aDateTypes",
				template : new sap.ui.core.Item({
					text : "{text}",
					key : "{key}"
				})
			},
			selectedKey : "{/sSelectedDateType}",
			change : function(oEvt) {
				var oSelectedItem = oEvt.getParameter('selectedItem');
				if (oSelectedItem.getKey() === "keyDate") {
					self.showDatePicker();
				} else {
					self.hideDatePicker();
				}
			}
		});
		// Date Type Content Holder.
		var oDateTypeContent = new sap.ui.layout.VerticalLayout({
			width : "80%",
			content : [ oDateTypeLabel, oDateTypeDropdown ]
		}).addStyleClass("dropdownLayout");
		// Dialog Content Holder.
		var oDialogContent = new sap.ui.layout.VerticalLayout({
			width : "100%",
			content : [ oExchangeRateContent, oDateTypeContent ]
		}).addStyleClass("exchangeRateLayout");
		// Dialog.
		var oDialog = new sap.m.Dialog({
			type : sap.m.DialogType.Standard,
			title : this.oApi.getTextNotHtmlEncoded("exchangeRateSettings"),
			content : oDialogContent,
			beginButton : new sap.m.Button({
				text : self.oApi.getTextNotHtmlEncoded("ok"),
				press : oController.handleOkPress.bind(oController)
			}),
			endButton : new sap.m.Button({
				text : self.oApi.getTextNotHtmlEncoded("cancel"),
				press : oController.handleCancelPress.bind(oController)
			}),
			beforeOpen : oController.handleDialogOpen.bind(oController)
		});
		// Button on press of which dialog will open.
		var oButton = new sap.m.Button({
			text : this.oApi.getTextNotHtmlEncoded("exchangeRate"),
			type : "Transparent",
			width : "100%",
			press : function() {
				if(sap.ui.Device.system.desktop) {   
					oDialog.addStyleClass("sapUiSizeCompact");
				}
				oDialog.setInitialFocus(oDialog);
				oDialog.open();
			}
		});
		// Revealing/Exposing necessary controls to the controller by hosting them on view instance.
		jQuery.extend(this, {
			oExchangeRateDropdown : oExchangeRateDropdown,
			oDateTypeDropdown : oDateTypeDropdown,
			oDatePicker : oDatePicker,
			oDateTypeContent : oDateTypeContent,
			oDialog : oDialog
		});
		return oButton;
	},
	/**
	 * Displays Date Picker control by adding it into the view.
	 * */
	showDatePicker : function() {
		this.oDateTypeContent.addContent(this.oDatePicker);
		this.oDatePicker.setEnabled(true);
		this.oDatePicker.setEditable(true);
	},
	/**
	 * Hides Date Picker control by removing it from the view.
	 * */
	hideDatePicker : function() {
		this.oDateTypeContent.removeContent(this.oDatePicker);
		this.oDatePicker.setEnabled(false);
		this.oDatePicker.setEditable(false);
	}
});