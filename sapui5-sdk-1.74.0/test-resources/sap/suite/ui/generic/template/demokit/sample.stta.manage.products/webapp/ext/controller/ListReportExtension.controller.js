sap.ui.define("STTA_MP.ext.controller.ListReportExtension", [
	"sap/ui/generic/app/navigation/service/NavigationHandler",
	"sap/ui/comp/smartfilterbar/SmartFilterBar",
	"sap/m/ComboBox",
	"sap/ui/model/Filter",
	"sap/m/Input",
	"sap/m/Dialog",
	"sap/ui/core/message/Message",
	"sap/ui/core/MessageType",
	"sap/m/Text",
	"sap/m/MessageBox",
	"sap/ui/comp/smartfield/SmartField",
	"sap/ui/comp/smartfield/SmartLabel",
	"sap/ui/layout/form/SimpleForm"
], function(NavigationHandler, SmartFilterBar, ComboBox, Filter, Input, Dialog, Message, MessageType, Text, 
		MessageBox, SmartField, SmartLabel, SimpleForm) {
	"use strict";
	return {
		onInit: function() {
			var oController = this;
			var oNavigationHandler = new NavigationHandler(oController);
				var oParseNavigationPromise = oNavigationHandler.parseNavigation();
				oParseNavigationPromise.done(function(oAppData, oURLParameters, sNavType) {
				});
		},
		onInitSmartFilterBarExtension: function() {
			// the custom field in the filter bar might have to be
			// bound to a custom data model
			// if a value change in the field shall trigger a follow
			// up action, this method is the place to define and
			// bind an event handler to the field
		},	
		onListNavigationExtension: function(oEvent) {
			var oNavigationController = this.extensionAPI.getNavigationController();
			var oBindingContext = oEvent.getSource().getBindingContext();
			var oObject = oBindingContext.getObject();
	
			// for  laser printers  we trigger external navigation for all others we use internal navigation
			if (oObject.ProductCategory === "Laser Printers") {
				oNavigationController.navigateExternal("EPMProductManage");
				//oNavigationController.navigateExternal("EPMSalesOrderDisplayBuPa");
			} else {
				// return false to trigger the default internal navigation
				return false;
			}
			// return true is necessary to prevent further default navigation
			return true;
		},	
		adaptNavigationParameterExtension: function(oSelectionVariant, oObjectInfo) {
			if (oObjectInfo.semanticObject === "EPMProduct") {
				oSelectionVariant.removeParameter("DraftUUID");
			} else if (oObjectInfo.semanticObject === "EPMManageProduct") {
				oSelectionVariant.removeParameter("Price");
			}
		},	
		onBeforeRebindTableExtension: function(oEvent) {
			// usually the value of the custom field should have an
			// effect on the selected data in the table. So this is
			// the place to add a binding parameter depending on the
			// value in the custom field.
			var oBindingParams = oEvent.getParameter("bindingParams");
			oBindingParams.parameters = oBindingParams.parameters || {};
	
			var oSmartTable = oEvent.getSource();
			var oSmartFilterBar = this.byId(oSmartTable.getSmartFilterId());
			if (oSmartFilterBar instanceof SmartFilterBar) {
				var oCustomControl = oSmartFilterBar.getControlByKey("CustomPriceFilter");
				if (oCustomControl instanceof ComboBox) {
					var vCategory = oCustomControl.getSelectedKey();
					switch (vCategory) {
						case "0" :
							oBindingParams.filters.push(new Filter("Price", "LE", "100"));
							break;
						case "1" :
							oBindingParams.filters.push(new Filter("Price", "BT", "100", "500"));
							break;
						case "2" :
							oBindingParams.filters.push(new Filter("Price", "BT", "500", "1000"));
							break;
						case "3" :
							oBindingParams.filters.push(new Filter("Price", "GT", "1000"));
							break;
						default :
							break;
					}
				}
				var oCustomControlWeight = oSmartFilterBar.getControlByKey("Weight");
				if (oCustomControlWeight instanceof ComboBox) {
					var vTShirtSize = oCustomControlWeight.getSelectedKey();
					switch (vTShirtSize) {
						case "0" :
							oBindingParams.filters.push(new Filter("Weight", "LE", "1"));
							break;
						case "1" :
							oBindingParams.filters.push(new Filter("Weight", "BT", "1", "2"));
							break;
						case "2" :
							oBindingParams.filters.push(new Filter("Weight", "BT", "2", "3"));
							break;
						case "3" :
							oBindingParams.filters.push(new Filter("Weight", "GT", "3"));
							break;
						default :
							break;
					}
				}
			}
		},
		getCustomAppStateDataExtension: function(oCustomData) {
			// the content of the custom field shall be stored in
			// the app state, so that it can be restored later again
			// e.g. after a back navigation. The developer has to
			// ensure, that the content of the field is stored in
			// the object that is returned by this method.
			// Example:
			var oComboBox = this.byId("CustomPriceFilter-combobox");
			if (oComboBox) {
				oCustomData.CustomPriceFilter = oComboBox.getSelectedKey();
			}
			var oTShirtSizeComboBox = this.byId("Weight-combobox");
			if (oTShirtSizeComboBox) {
				oCustomData.sTShirtSizeFilter = oTShirtSizeComboBox.getSelectedKey();
			}
		},	
		restoreCustomAppStateDataExtension: function(oCustomData) {
			// in order to to restore the content of the custom
			// field in the filter bar e.g. after a back navigation,
			// an object with the content is handed over to this
			// method and the developer has to ensure, that the
			// content of the custom field is set accordingly
			// also, empty properties have to be set
			// Example:
	//		debugger;
			if (oCustomData.CustomPriceFilter !== undefined) {
				if (this.byId("CustomPriceFilter-combobox")) {
					this.byId("CustomPriceFilter-combobox").setSelectedKey(oCustomData.CustomPriceFilter);
				}
			}
			if (oCustomData.sTShirtSizeFilter !== undefined) {
				if (this.byId("Weight-combobox")) {
					this.byId("Weight-combobox").setSelectedKey(oCustomData.sTShirtSizeFilter);
				}
			}
		},	
		// PoC: Create with parameters
		onCreateWithParameters: function(oEvent) {	
			var that = this;	
			var oInputField = new Input();	
			var oParameterDialog = new Dialog({
				title: "Create new product from existing product...",
				content: [oInputField],
				beginButton: new Button({
					text: "OK",
					press: function() {
						var mParameters = {
							"Product": oInputField.getValue(),
							"DraftUUID": "00000000-0000-0000-0000-000000000000",
							"IsActiveEntity": true
						};
						that.triggerAction(mParameters);
						oParameterDialog.close();
					}
				}),
				endButton: new Button({
					text: "Cancel",
					press: function() {
						oParameterDialog.close();
					}
				}),
				afterClose: function() {
					oParameterDialog.destroy();
				}
			});
	
			oParameterDialog.open();
		},	
		triggerAction: function(mParams) {
			var oApi = this.extensionAPI;
			var oNavController = oApi.getNavigationController();
	
			var oPromise = oApi.invokeActions("STTA_PROD_MAN/STTA_C_MP_ProductCopy", [], mParams);	
			oPromise.then(function(aResponse) {
				if (aResponse[0] && aResponse[0].response) {
					var oResponseContext = aResponse[0].response.context;
					if (oResponseContext) {
						oNavController.navigateInternal(oResponseContext);
					}
				}
			}).catch(function(aErr) {
				if (aErr[0] && aErr[0].error && aErr[0].error.response) {
					MessageBox.error(aErr[0].error.response.message, {});
				}
			});
		},	
		// extensions for custom action breakout scenario
		//
		// SCENARIO 1: custom action without function import
		//
		// IMPORTANT:
		// Note that this example implementation is only a preliminary PoC until there is an official Smart Templates API.
		// Therefore, the functions currently used in the example implementation are not to be used in productive coding.
		//
		onChangePrice: function(oEvent) {
			var oMesssageManager = sap.ui.getCore().getMessageManager();
			var oTable = oEvent.getSource().getParent().getParent().getParent().getTable();
			var oExtensionAPI = this.extensionAPI;
			var oModel = this.getView().getModel();
			var aContext = oExtensionAPI.getSelectedContexts(oTable);
			var oPreconditionPromise = oExtensionAPI.securedExecution(function() {
				return new Promise(function(fnResolve, fnReject) {
					var sMessage = "";
					if (aContext.length !== 1) {
						sMessage = "Please select exactly one  item";
					}
					if (sMessage) {
						var oMessage = new Message({
							message: sMessage,
							processor: oModel,
							persistent: true,
							type: MessageType.Error,
							target: ""
						});
						oMesssageManager.addMessages(oMessage);
						fnReject();
					} else {
						fnResolve();
					}
				});
			});
			oPreconditionPromise.then(this._showChangePricePopup.bind(this, aContext[0]));
		},	
		_showChangePricePopup: function(oContext) {
			var oModel = this.getView().getModel();	
			var oField = new Input();
	
			var oParameterDialog = new Dialog({
				title: "Change Price",
				content: [
					new Text({
						text: "New Price "
					}), oField
				],
				beginButton: new Button({
					text: "OK",
					press: function() {
						var sInput = oField.getValue();
						var oExtensionAPI = this.extensionAPI;
						oParameterDialog.close();
						// mParameters has optional property actionLabel which app developer can specify if wants the title of the message pop-up same as the action which was executed.
						var mParameters = {
							"sActionLabel": "Custom Text"
						};
						oExtensionAPI.securedExecution(function() {
							var oBackendExecution = this._executePriceChange(sInput, oContext);
							return new Promise(function(fnResolve, fnReject) {
								oBackendExecution.then(function() {
									sap.ui.require(["sap/ui/core/message/Message", "sap/ui/core/MessageType"], function(Message, MessageType) {
										var oMessage = new Message({
											message: "Price set to " + sInput,
											processor: oModel,
											persistent: true,
											type: MessageType.Success,
											target: oContext.getPath()
										});
										var oMesssageManager = sap.ui.getCore().getMessageManager();
										oMesssageManager.addMessages(oMessage);
										fnResolve();
									});
								}, fnReject);
							});
						}.bind(this), mParameters);
					}.bind(this)
				}),
				endButton: new Button({
					text: "Cancel",
					press: function() {
						oParameterDialog.close();
					}
				}),
				afterClose: function() {
					oParameterDialog.destroy();
				}
			});
			oParameterDialog.open();
		},	
		// This function simulates a function that performs a backend call lasting 2.5 seconds.
		// The function returns a Promise that is resolved/rejected when the backend call succeedss/fails
		// Thereby the backend call fails, when the new price is identical to the current price. In this case we simulate that the backend calls fails
		// with an error message and that UI5 puts this error message into the MessageModel automatically.
		_executePriceChange: function(sNewPrice, oContext) {
			var oModel = this.getView().getModel();
			return new Promise(function(fnResolve, fnReject) {
				var oMessage;
				var oMesssageManager = sap.ui.getCore().getMessageManager();
				if (oContext.getObject().Price === sNewPrice) {
					oMessage = new Message({
						message: "Price must be changed",
						processor: oModel,
						persistent: true,
						type: MessageType.Error,
						target: oContext.getPath()
					});
					oMesssageManager.addMessages(oMessage);
					fnReject();
				} else {
					if (!sNewPrice) {
						oMessage = new Message({
							message: "Price reset",
							processor: oModel,
							persistent: true,
							type: MessageType.Success,
							target: oContext.getPath()
						});
						oMesssageManager.addMessages(oMessage);
					}
					fnResolve();
				}
			});
		},	
		//
		// SCENARIO 2: custom action on function import
		//
		// IMPORTANT:
		// Note that this example implementation is only a preliminary PoC until there is an official Smart Templates API.
		// Therefore, the functions currently used in the example implementation are not to be used in productive coding.
		//
		onCopyWithNewSupplier: function(oEvent) {
			var that = this;
			var oModel = this.getView().getModel();
	
			var oTable = oEvent.getSource().getParent().getParent().getParent().getTable();
			var aContext = this.extensionAPI.getSelectedContexts(oTable);
			if (aContext.length > 1) {
				MessageBox.error("Multi selection is currently not supported", {});
			} else {
				if (aContext.length === 0) {
					MessageBox.error("Please select an item", {});
				} else {
					var oContext = aContext[0];
					var oSelectedObject = oContext.getObject();
	
					var oForm = new SimpleForm({
						editable: true
					});
	
					var sParameterLabel = "Supplier";
					var sBinding = "{Supplier}";
	//				var sEdmType = 'Edm.String';
	
					var oField = new SmartField({
						value: sBinding
					});
					var sLabel = new SmartLabel();
	
					sLabel.setText(sParameterLabel);
					sLabel.setLabelFor(oField);
	
					oForm.addContent(sLabel);
					oForm.addContent(oField);
	
					var oParameterDialog = new Dialog({
						title: "Copy with new Supplier",
						content: [oForm],
						beginButton: new Button({
							text: "OK",
							press: function() {
								try {
									var mParameters = {
										urlParameters: {
											"ProductDraftUUID": oSelectedObject.ProductDraftUUID,
											"ActiveProduct": oSelectedObject.ActiveProduct,
											"Supplier": oField.getValue()
										}
									};
									that.getTransactionController().invokeAction("STTA_PROD_MAN.STTA_PROD_MAN_Entities/STTA_C_MP_ProductCopywithparams", oContext, mParameters).then(function(oResponse) {
										that.refreshView();
										that.handleSuccess(oResponse);
									}, function(oError) {
										that.handleError(oError, {
											context: oContext
										});
									});
								} catch (ex) {
									// ToDo: remove message and close() as soon as the TransactionController is available for ListReport
									MessageBox.error("TransactionController for ListReport currently not supported - action cannot be completed", {});
									oParameterDialog.close();
									that.handleError(ex, {
										context: oContext
									});
								}
								that.getTransactionController().resetChanges();
								oParameterDialog.close();
							}
						}),
						endButton: new Button({
							text: "Cancel",
							press: function() {
								// ToDo: activate resetChanges as soon as the TransactionController is available for ListReport
								//that.getTransactionController().resetChanges();
								oParameterDialog.close();
							}
						}),
						afterClose: function() {
							oParameterDialog.destroy();
						}
					});
	
					oParameterDialog.setModel(oModel);
					oParameterDialog.setBindingContext(oContext);
					oParameterDialog.open();
				}
			}
		},
		//
		// SCENARIO 3: "Plus" button performing a create after reading data from a popup
		//
		// IMPORTANT:
		// Note that this example implementation is only a preliminary PoC until there is an official Smart Templates API.
		// Therefore, the functions currently used in the example implementation are not to be used in productive coding.
		//
		onPressPlus: function(oEvent) {
	//		var oTable = oEvent.getSource().getParent().getParent().getTable();
			var aContext = this.extensionAPI.getSelectedContexts();
			var oContext = aContext[0];
			this._showPlusPopup(oContext);
			//MessageBox.success("Plus was pressed", {});
		},	
		_showPlusPopup: function(oContext) {	
			var oModel = this.getView().getModel();	
			var oField = new SmartField({
				value: "{Price}"
			});
	
			var oParameterDialog = new Dialog({
				title: "New Price",
				content: [
					new Text({
						text: "Price "
					}), oField
				],
				beginButton: new Button({
					text: "OK",
					press: function() {
						//that.getTransactionController().triggerSubmitChanges();
						oParameterDialog.close();
					}
				}),
				endButton: new Button({
					text: "Cancel",
					press: function() {
						//that.getTransactionController().resetChanges();
						oParameterDialog.close();
					}
				}),
				afterClose: function() {
					oParameterDialog.destroy();
				}
			});
	
			oParameterDialog.setModel(oModel);
			oParameterDialog.setBindingContext(oContext);
			oParameterDialog.open();
		},	
		onSaveAsTileExtension: function(oShareInfo) {
			oShareInfo.serviceUrl = "";
		},	
		onGlobalAction: function(oEvent){
			MessageBox.success("Global Action triggered", {});
		},
	
		// example for modifying startup parameters
		// modifyStartupExtension: function(oStartupObject) {
		// 	oSelectionVariant = oStartupObject.selectionVariant;
		// 	if (oSelectionVariant) {
		// 		oSelectionVariant.removeSelectOption("TaxAmount");
		// 	}
		// }
	};
});
