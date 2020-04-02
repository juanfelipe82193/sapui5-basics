/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */

sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/m/Table',
	'sap/m/Column',
	'sap/m/ColumnListItem',
	'sap/m/Text',
	'sap/m/Input',
	'sap/ui/core/Icon',
	'sap/apf/modeler/ui/utils/helper',
	'sap/apf/modeler/ui/utils/nullObjectChecker',
	'sap/apf/modeler/ui/utils/optionsValueModelBuilder',
	'sap/ui/model/Filter'
], function(BaseController, Table, Column, ColumnListItem, Text, Input, Icon, helper, nullObjectChecker, optionsValueModelBuilder, Filter) {
	"use strict";

	function _setDisplayText(oController) {
		var getText = oController.coreApi.getText;
		oController.byId("idAppPage").setTitle(getText("configModelerTitle"));
		oController.byId("idAppTitle").setText(getText("applicationOverview"));
		oController.byId("idAppNumberTitle").setText(getText("applications"));
		oController.byId("idDescriptionLabel").setText(getText("description"));
		if (oController.coreApi.showSemanticObject()) {
			oController.byId("idSemanticObjectLabel").setText(getText("semanticObject"));
		}
		oController.byId("idImportButton").setText(getText("import"));
		oController.byId("idImportButton").setTooltip(getText("importConfig"));
		oController.byId("idNewButton").setText(getText("new"));
		oController.byId("idNewButton").setTooltip(getText("newApplication"));

		oController.byId("idEditIcon").setTooltip(getText("editApplication"));
		oController.byId("idDeleteIcon").setTooltip(getText("deleteApplication"));
		oController.byId("idTextpoolCleanupIcon").setTooltip(getText("textCleanUp"));
		oController.byId("idAriaPropertyForDelete").setText(getText("ariaTextForDeleteIcon"));
		oController.byId("idAriaPropertyForEdit").setText(getText("ariaTextForEditIcon"));
		oController.byId("idAriaPropertyForTextpoolCleanup").setText(getText("ariaTextForTextpoolCleanupIcon"));
	}
	function _setDeleteConfirmationDialogText(oController) {
		var getText = oController.coreApi.getText;
		sap.ui.core.Fragment.byId("idDeleteConfirmationFragment", "idDeleteConfirmation").setTitle(getText("confirmation"));
		sap.ui.core.Fragment.byId("idDeleteConfirmationFragment", "idDeleteButton").setText(getText("deleteButton"));
		sap.ui.core.Fragment.byId("idDeleteConfirmationFragment", "idCancelButtonDialog").setText(getText("cancel"));
	}
	function _updateAppList(oController) {
		var applications = oController.applicationHandler.getList();
		oController.byId("idAppCount").setText("(" + applications.length + ")");
		var aAppDetails = [];
		applications.forEach(function(application) {
			var oAppDetails = {};
			oAppDetails.id = application.Application;
			oAppDetails.description = application.ApplicationName;
			oAppDetails.semanticObject = application.SemanticObject;
			aAppDetails.push(oAppDetails);
		});
		var oModel = optionsValueModelBuilder.prepareModel(aAppDetails, aAppDetails.length);
		oController.byId("idApplicationTable").setModel(oModel);
		if (oController.actualQuery !== "") {
			oController.filterValues(oController.actualQuery);
		}
	}
	function _showSuccessMessageToast(oController, sMsgCode) {
		var oMessageObject = oController.coreApi.createMessageObject({
			code : sMsgCode
		});
		oController.coreApi.putMessage(oMessageObject);
	}
	function _attachEvents(oController) {
		oController.byId("idApplicationTable").attachEvent("addNewAppEvent", oController.handleAdditionOfNewApp.bind(oController));
		oController.byId("idApplicationTable").attachEvent("updateAppListEvent", oController.handleAppListUpdate.bind(oController));
	}
	//Dependent dialogs are instantiated through this method. Eg- Add newApp,importFiles,importDeliveredContent Dialog
	function _instantiateDialogView(oController, sViewName) {
		var oViewData, oView;
		oViewData = {
			oParentControl : oController.byId("idApplicationTable"),
			oCoreApi : oController.coreApi
		};
		oView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view." + sViewName,
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : oViewData
		});
		oController.getView().addDependent(oView);
	}
	//Opens confirmation dialogs. Eg - delete confirmation dialog, unsavedData confirmation dialog
	function _openDialog(oController, oDialog, key, oCustomData) {
		oController.getView().addDependent(oDialog);
		var sMsg = new Text({
			text : oController.coreApi.getText(key)
		});
		oDialog.removeAllContent();
		oDialog.addContent(sMsg);
		oDialog.addAriaDescribedBy(sMsg);
		if (oCustomData) {
			oDialog.removeAllCustomData();
			oDialog.addCustomData(oCustomData);
		}
		oDialog.open();
	}
	function _setHeightAndWidth(oController) {
		var scrollContainer = oController.byId("idAppListScrollContainer");
		var oApplicationTable = oController.byId("idApplicationTable");
		var viewInstance = oController.getView();
		oApplicationTable.addEventDelegate({
			onAfterRendering : function() { //Set the height and width of scroll container
				var height = jQuery(window).height();
				var appTitleBar = jQuery(viewInstance.byId("idAppTitle").getDomRef()).height();
				var appToolbar = jQuery(viewInstance.byId("idApplicationToolbar").getDomRef()).height();
				var header = jQuery(viewInstance.byId("idAppPage").getDomRef()).find("header").height();
				var footer = jQuery(viewInstance.byId("idAppPage").getDomRef()).find("footer").height();
				var offsetHeight;
				if (appTitleBar > 0) { //If onAfterRendering happens before the UI is rendered on the DOM
					appTitleBar = appTitleBar + 80;
					offsetHeight = appTitleBar + appToolbar + header + footer + 25;
				} else {//Fall back if rendered DOM element has height defined as 0 or undefined
					offsetHeight = 232; //Setting constant calculated value
				}
				//Set Initial Height and Width
				scrollContainer.setHeight(height - offsetHeight + "px");
				scrollContainer.setWidth("100%");
				helper.onResize(function() {
					if (jQuery(viewInstance.getDomRef()).css("display") === "block") {
						height = jQuery(viewInstance.byId("idAppPage").getDomRef()).height();
						scrollContainer.setHeight(height - offsetHeight + "px");
						scrollContainer.setWidth("100%");
					}
				});
				sap.ui.core.UIComponent.getRouterFor(oController).attachRoutePatternMatched(function(oEvent) {
					if (oEvent.getParameter("name") === "applicationList") {
						height = jQuery(viewInstance.getDomRef()).height();
						scrollContainer.setHeight(height - offsetHeight + "px");
						scrollContainer.setWidth("100%");
					}
				});
			}
		});
	}
	function _openImportMenu(oController, oEvent) {
		var importDeliveredContent = new sap.m.StandardListItem({
			title : oController.coreApi.getText("importDeliveredContent"),
			type : sap.m.ListType.Active,
			press : function() {
				_instantiateDialogView(oController, "importDeliveredContent");
			}
		});
		var importFiles = new sap.m.StandardListItem({
			title : oController.coreApi.getText("importFiles"),
			type : sap.m.ListType.Active,
			press : function() {
				_instantiateDialogView(oController, "importFiles");
			}
		});
		var oPopover = new sap.m.Popover({
			placement : sap.m.PlacementType.Top,
			showHeader : false
		});
		var oActionListItem = new sap.m.List({
			items : [ importDeliveredContent, importFiles ]
		});
		oPopover.addContent(oActionListItem);
		oPopover.openBy(oEvent.getSource());
	}

	return BaseController.extend("sap.apf.modeler.ui.controller.applicationList", {
		onInit : function() {
			var oController = this;
			this.actualQuery = "";
			var oComponent = oController.getOwnerComponent();
			if (nullObjectChecker.checkIsNotUndefined(oComponent)) {
				oController.coreApi = oComponent.oCoreApi;
				if (!this.coreApi.showSemanticObject()) {
					this.hideSemanticObjectColumn();
				}
				_attachEvents(this);
				_setDisplayText(oController);
				oController.coreApi.getApplicationHandler(function(applicationHandler, messageObject) {
					oController.applicationHandler = applicationHandler;
					if (oController.applicationHandler && !nullObjectChecker.checkIsNotUndefined(messageObject)) {
						_updateAppList(oController);
					} else {
						oController.showMessage("11508", messageObject);
					}
				});
			}
			_setHeightAndWidth(oController);
		},
		showMessage : function(messageNumber, previousMessageObject) {
			var oMessageObject = this.coreApi.createMessageObject({
				code : messageNumber
			});
			if (previousMessageObject) {
				oMessageObject.setPrevious(previousMessageObject);
			}
			this.coreApi.putMessage(oMessageObject);
		},
		hideSemanticObjectColumn : function() {
			this.byId("idSemanticObjectColumn").setVisible(false);
		},
		handleAddNewAppPress : function() {
			var oController = this;
			if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(oController.applicationHandler)) {
				_instantiateDialogView(oController, "newApplication");
			} else {
				oController.showMessage("11509");
			}
		},
		handleListItemPress : function(evt) { //handler for navigation in application list
			var oController = this, bindingContext;
			bindingContext = evt.getParameter("listItem").getBindingContext().getPath().split("/")[2];
			sap.ui.core.UIComponent.getRouterFor(oController).navTo("configurationList", {
				appId : oController.byId("idApplicationTable").getModel().getData().Objects[bindingContext].id
			});
		},
		handleTextpoolCleanupPress : function(evt) {
			var textpoolCleanupDialog;
			var applicationId =  evt.getSource().getBindingContext().getObject().id;
			var customData = new sap.ui.core.CustomData({
				value : {
					applicationId : applicationId
				}
			});
			var getText = this.coreApi.getText;
			textpoolCleanupDialog = sap.ui.xmlfragment("idTextpoolCleanupConfirmationFragment", "sap.apf.modeler.ui.fragment.textpoolCleanupConfirmationDialog", this);
			textpoolCleanupDialog.setTitle(getText("confirmation"));
			textpoolCleanupDialog.getButtons()[0].setText(getText("ok"));
			textpoolCleanupDialog.getButtons()[1].setText(getText("cancel"));
			_openDialog(this, textpoolCleanupDialog, "textpoolCleanupConfirmation", customData);
		},
		handleConfirmTextpoolCleanup : function(evt) {
			var oController = this;
			var appId = sap.ui.core.Fragment.byId("idTextpoolCleanupConfirmationFragment", "idTextpoolCleanupConfirmation").getCustomData()[0].getValue().applicationId;
			oController.coreApi.getConfigurationHandler(appId, function(configurationHandler) {
				var oTextPool = configurationHandler.getTextPool();
				oController.coreApi.getUnusedTextKeys(appId, function(aUnusedTexts, msgObj) {
					if (!nullObjectChecker.checkIsNotUndefined(msgObj)) {
						oTextPool.removeTexts(aUnusedTexts, appId, function(msgObj) {
							if (!nullObjectChecker.checkIsNotUndefined(msgObj)) {
								oController.showMessage("11511");
							} else {
								oController.showMessage("11507", msgObj);
							}
							oController.closeTextpoolCleanupConfirmationDialog();
						});
					} else {
						oController.showMessage("11506", msgObj);
						oController.closeTextpoolCleanupConfirmationDialog();
					}
				});
			});
		},
		closeTextpoolCleanupConfirmationDialog : function() {
			sap.ui.core.Fragment.byId("idTextpoolCleanupConfirmationFragment", "idTextpoolCleanupConfirmation").destroy();
		},
		handleCancelTextpoolCleanup : function(evt) {
			this.closeTextpoolCleanupConfirmationDialog();
		},
		handleEditPress : function(evt) {
			var applicationData, viewData;
			if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(this.applicationHandler)) {
				applicationData = evt.getSource().getBindingContext().getObject();
				viewData = {
					parentControl : this.byId("idApplicationTable"),
					coreApi : this.coreApi,
					applicationData : applicationData
				};
				sap.ui.view({
					viewName : "sap.apf.modeler.ui.view.editApplication",
					type : sap.ui.core.mvc.ViewType.XML,
					viewData : viewData,
					async : true
				}).loaded().then(function(view){
					this.getView().addDependent(view);
				}.bind(this));
			}
		},
		handleDeletePress : function(evt) {
			var oController = this, oDeleteConfirmationDialog;
			var sPath = evt.getSource().getBindingContext().getPath().split("/")[2];
			var customData = new sap.ui.core.CustomData({
				value : {
					removeId : this.byId("idApplicationTable").getModel().getData().Objects[sPath].id,
					sPath : sPath
				}
			});
			oDeleteConfirmationDialog = sap.ui.xmlfragment("idDeleteConfirmationFragment", "sap.apf.modeler.ui.fragment.deleteConfirmationDialog", oController);
			_setDeleteConfirmationDialogText(oController);
			_openDialog(oController, oDeleteConfirmationDialog, "deleteApp", customData);
		},
		handleConfirmDeletion : function() {
			var oController = this;
			var removeId = sap.ui.core.Fragment.byId("idDeleteConfirmationFragment", "idDeleteConfirmation").getCustomData()[0].getValue().removeId;
			if (nullObjectChecker.checkIsNotUndefined(removeId)) {
				oController.applicationHandler.removeApplication(removeId, function(oResponse, oMetadata, msgObj) {
					if (!nullObjectChecker.checkIsNotUndefined(msgObj) && (typeof oResponse === "string")) {
						_updateAppList(oController);
						_showSuccessMessageToast(oController, "11510");
					} else {
						oController.showMessage("11501", msgObj);
					}
					oController.closeDialog();
				});
			}
		},
		closeDialog : function() {
			sap.ui.core.Fragment.byId("idDeleteConfirmationFragment", "idDeleteConfirmation").destroy();
		},
		handleNavigationWithSave : function() {
			var oController = this;
			oController.handleSavePress();
			sap.ui.core.Fragment.byId("idUnsavedDataConfirmationFragment", "idMessageDialog").destroy();
		},
		handleNavigationWithoutSave : function() {
			sap.ui.core.Fragment.byId("idUnsavedDataConfirmationFragment", "idMessageDialog").destroy();
		},
		handlePreventNavigation : function() {
			sap.ui.core.Fragment.byId("idUnsavedDataConfirmationFragment", "idMessageDialog").destroy();
		},
		handleImportPress : function(oEvent) {
			if (this.coreApi.isVendorContentAvailable()) {
				_openImportMenu(this, oEvent);
			} else {
				_instantiateDialogView(this, "importFiles");
			}
		},
		handleSavePress : function() {
			var oController = this, updateAppArr = [], appList, tableData, j;
			appList = oController.applicationHandler.getList();
			tableData = oController.byId("idApplicationTable").getModel().getData().Objects;
			for(j = 0; j < appList.length; j++) {
				if (tableData[j].description !== appList[j].ApplicationName || tableData[j].semanticObject !== appList[j].SemanticObject) {
					updateAppArr.push(tableData[j]);
				}
			}
			updateAppArr.forEach(function(app) {
				var updatedAppObject = {
					ApplicationName : app.description,
					SemanticObject : app.semanticObject
				};
				oController.applicationHandler.setAndSave(updatedAppObject, function(oResponse, oMetadata, msgObj) {
					if (nullObjectChecker.checkIsNotUndefined(msgObj)) {
						oController.showMessage("11500", msgObj);
					}
				}, app.id);
			});
		},
		handleNavigationToConfigurationList : function(oEvt) {
			var oController = this;
			var mParameters = {
					listItem : sap.ui.getCore().byId(oEvt.currentTarget.id).getParent(),
					srcControl : oController.byId("idApplicationTable")
			};
			oController.byId("idApplicationTable").fireItemPress(mParameters);
		},
		handleAdditionOfNewApp : function(oEvent) {
			var oController = this, applicationId, aAppData, i, index = 0, oItems;
			applicationId = oEvent.getParameter("appId");
			_updateAppList(oController);
			aAppData = oController.byId('idApplicationTable').getModel().getData().Objects;
			_showSuccessMessageToast(oController, "11512");
			oController.byId('idApplicationTable').rerender();
			for(i = 0; i < aAppData.length; i++) {
				if (aAppData[i].id === applicationId) {
					index = i;
					break;
				}
			}
			oItems = oController.byId('idApplicationTable').getItems();
			if (oItems.length) {
				var appTableItemDOM = oItems[index].getDomRef();
				if (appTableItemDOM) {
					appTableItemDOM.scrollIntoView();
				}
			}
			if (this.actualQuery !== "") {
				this.filterValues(this.actualQuery);
			}
		},
		handleAppListUpdate : function() {
			var oController = this;
			_updateAppList(oController);
		},
		handleNavBack : function() {
			window.history.go(-1);
		},
		onSearch : function(event) {
			var query = event.getParameters().newValue;
			this.actualQuery = query;
			this.filterValues(query);
		},
		filterValues : function(query) {
			var filters = [];
			if (query && query.length > 0) {
				var filter = new Filter("description", sap.ui.model.FilterOperator.Contains, query);
				filters.push(filter);
			}
			// update list binding
			var table = this.byId("idApplicationTable");
			var binding = table.getBinding("items");
			binding.filter(filters, "Objects");
		}
	});
});