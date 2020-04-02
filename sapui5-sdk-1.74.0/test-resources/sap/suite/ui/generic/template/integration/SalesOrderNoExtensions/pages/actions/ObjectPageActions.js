/*** Object Page Report actions ***/
sap.ui.define(
	["sap/ui/test/matchers/PropertyStrictEquals",
	 "sap/ui/test/matchers/AggregationFilled", 
	 "sap/ui/test/actions/Press"],
	function (PropertyStrictEquals, AggregationFilled, Press) {

		return function (prefix, viewName, viewNamespace) {

			return {
				/* WAIT FOR OBJECT PAGE TO LOAD */
				iWaitForTheObjectPageToLoad: function () {
					var sId = "SOwoExt::sap.suite.ui.generic.template.ObjectPage.view.Details::C_STTA_SalesOrder_WD_20";
					console.log ( "OPA5::ObjectPageActions::iWaitForTheObjectPageToLoad " + " sId: " + sId);
					return this.waitFor({
						id: sId,
						matchers: function (oView) {
							var oComponentContainer = oView.getParent().getComponentContainer();
							var oAppComponent = oComponentContainer.getParent();
							return !oAppComponent.getBusy();
						},
						errorMessage: "Object Page not loaded"
					});
				},
				iWaitForTheObjectPage2ToLoad: function () {
					var sId = "SOwoExt::sap.suite.ui.generic.template.ObjectPage.view.Details::C_STTA_SalesOrderItem_WD_20"; 
					console.log ( "OPA5::ObjectPageActions::iWaitForTheObjectPage2ToLoad" + " sId:" + sId );
					return this.waitFor({
						id: sId,
						matchers: function (oView) {
							var oComponentContainer = oView.getParent().getComponentContainer();
							var oAppComponent = oComponentContainer.getParent();
							return !oAppComponent.getBusy();
						},
						errorMessage: "Object Page 2 not loaded"
					});
				},
				iWaitForTheObjectPage3ToLoad: function () {
					var sId = "SOwoExt::sap.suite.ui.generic.template.ObjectPage.view.Details::C_STTA_SalesOrderItem_WD_20"; 
					console.log ( "OPA5::ObjectPageActions::iWaitForTheObjectPage3ToLoad" + " sId:" + sId );
					return this.waitFor({
						id: sId,
						matchers: function (oView) {
							var oComponentContainer = oView.getParent().getComponentContainer();
							var oAppComponent = oComponentContainer.getParent();
							return !oAppComponent.getBusy();
						},
						errorMessage: "Object Page 3 not loaded"
					});
				},
				/* PRESS ON GENERIC BUTTONS */
				iClickTheApplyButton: function() {
					var sButtonID = "SOwoExt::sap.suite.ui.generic.template.ObjectPage.view.Details::C_STTA_SalesOrderItem_WD_20--footerObjectPage" + "BackTo"; 
					var sButtonName = "Apply";
					//<button id="SOwoExt::sap.suite.ui.generic.template.ObjectPage.view.Details::C_STTA_SalesOrderItem_WD_20--footerObjectPageBackTo" data-sap-ui="SOwoExt::sap.suite.ui.generic.template.ObjectPage.view.Details::C_STTA_SalesOrderItem_WD_20--footerObjectPageBackTo" aria-describedby="__text8" class="sapMBarChild sapMBtn sapMBtnBase sapMBtnInverted"><span id="SOwoExt::sap.suite.ui.generic.template.ObjectPage.view.Details::C_STTA_SalesOrderItem_WD_20--footerObjectPageBackTo-inner" class="sapMBtnEmphasized sapMBtnHoverable sapMBtnInner sapMBtnText sapMFocusable"><span class="sapMBtnContent" id="SOwoExt::sap.suite.ui.generic.template.ObjectPage.view.Details::C_STTA_SalesOrderItem_WD_20--footerObjectPageBackTo-content">Apply</span></span></button>
					console.log ( "OPA5::ObjectPageActions::iClickTheApplyButton" + " sButtonID: " + sButtonID + " sButtonName: " + sButtonName);
					return this.iClickTheButtonWithId(sButtonID , sButtonName);
				},
				/* BUTTON PRESS ON PAGE */
				iClickTheButton: function (buttonText) {
					console.log ( "OPA5::ObjectPageActions::iClickTheButton" + " buttonText: " + buttonText + " viewName: " + viewName + " viewNamespace " + viewNamespace);
					return this.waitFor({
						controlType: "sap.m.Button",
						viewName: viewName,
						viewNamespace: viewNamespace,
						matchers: [
							new PropertyStrictEquals({
								name: "text",
								value: buttonText
							})
						],
						actions: new Press(),
						errorMessage: "The button cannot be clicked"
					});
				},
				
				/* CLICK ON ITEM ON TABLE */
				iClickTheItemInTheTable: function(iIndex) {
					var sPrefix = prefix + "to_Item::com.sap.vocabularies.UI.v1.LineItem::";
					console.log ( "OPA5::ObjectPageActions::iClickTheItemInTheTable" + " iIndex: " + iIndex + " prefix: " + prefix + " viewName: " + viewName + " viewNamespace: " + viewNamespace); 
					return this.iClickTheItemInAnyTable(iIndex, sPrefix, viewName, viewNamespace); // Common.js
				},				
				/* CLICK ON ITEM ON TABLE */
				//SOwoExt::sap.suite.ui.generic.template.ObjectPage.view.Details::C_STTA_SalesOrderItem_WD_20--to_SalesOrderItemSL::com.sap.vocabularies.UI.v1.LineItem::responsiveTable-tblBody
				iClickTheItemInTheTableSL: function(iIndex) {
					var sPrefix = prefix + "to_SalesOrderItemSL::com.sap.vocabularies.UI.v1.LineItem::";
					console.log ( "OPA5::ObjectPageActions::iClickTheItemInTheTable" + " iIndex: " + iIndex + " prefix: " + prefix + " viewName: " + viewName + " viewNamespace: " + viewNamespace); 
					return this.iClickTheItemInAnyTable(iIndex, sPrefix, viewName, viewNamespace); // Common.js
				},
				iClickOnALink: function (sName) {
					return this.waitFor({
						controlType: "sap.m.Link",
						autoWait: false,
						matchers: [
							new PropertyStrictEquals({
								name: "text",
								value: sName
							}), function () {
							return true;
						}
						],
						viewName: viewName,
						viewNamespace: viewNamespace,
						actions: new Press(),
						errorMessage: "Link: '" + sName + "' not found"
					});
				},
		
				
				iMockTransientMessagesInTheMessageModel: function () {
					return this.waitFor({
						controlType: "sap.m.Dialog",
						id: "__component0-appContent--messageDialog",
						
						success: function (oDialog) {
							
						var ErrorMsg = new sap.ui.core.message.Message({
								message: "New Error Message",
								description: "Error Message",
								type: sap.ui.core.MessageType.Error,
								target: '',
								persistent: true
						});
						
						var WarningMsg = new sap.ui.core.message.Message({
								message: "New Warning Message",
								description: "Warning Message",
								type: sap.ui.core.MessageType.Warning,
								target: '',
								persistent: true
						});
						
						var InfoMsg = new sap.ui.core.message.Message({
								message: "New Information Message",
								description: "Warning Message",
								type: sap.ui.core.MessageType.Information,
								target: '',
								persistent: true
						});
											
						var oModel = oDialog.getModel("settings").getData();
						oModel.messages.push(ErrorMsg);
						oModel.messages.push(WarningMsg);
						oModel.messages.push(InfoMsg);
						oDialog.getModel("settings").setData(oModel);
						},						          
					});
				},
				
				iclickOntheErrorMessageToNavigateToDetailErrorScreen: function (sMessageTitle) {
					return this.waitFor({
						controlType: "sap.m.MessageListItem",
						matchers: [
							new PropertyStrictEquals({
								name: "title",
								value: sMessageTitle
							})
						],
						actions: new Press(),
						errorMessage: "No message with title "+sMessageTitle+" is rendered"
					});
				},
				
				iNavigateBackFromDetailErrorsToListError: function () {
					this.NavigateByClickingOnIcon("sap-icon://nav-back");
				},
				
				iclickOntheErrorMessageSegmentedButtonToFilterOutErrorsByType: function (sMessageType) {
					this.NavigateByClickingOnIcon("sap-icon://message-"+sMessageType);
				},
				
				NavigateByClickingOnIcon: function (sIconUrl) {
					return this.waitFor({
						controlType: "sap.m.Button",
						matchers: [
							new PropertyStrictEquals({
								name: "icon",
								value: sIconUrl
							})
						],
						actions: new Press(),
						errorMessage: "Navigation Using Icon URL "+sIconUrl+" is not possible"
					});
				}
			};
		};
});
