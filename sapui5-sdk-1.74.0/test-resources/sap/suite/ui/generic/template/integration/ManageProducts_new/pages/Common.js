sap.ui.define(['sap/ui/test/Opa5', "sap/ui/test/matchers/AggregationFilled",
               "sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaDataStore",
               "sap/ui/test/actions/Press"],
	function(Opa5, AggregationFilled, OpaDataStore, Press) {
		"use strict";
		var sUrl = "test-resources/sap/suite/ui/generic/template/demokit/flpSandbox.html?serverDelay=50&responderOn=true&sap-ui-language=en_US&sap-theme=sap_belize";
		return Opa5.extend("sap.suite.ui.generic.template.opa.ManageProducts.pages.Common", {
			iStartTheListReport: function(oOptions) {
				return this.iStartMyAppInAFrame("test-resources/sap/suite/ui/generic/template/demokit/demokit.html?serverDelay=0&responderOn=true&demoApp=sttaproducts&sap-ui-language=en_US");
			},
			iStartTheListReportInFlpSandbox: function(oOptions) {
				var flpApps = "&flpApps=EPMProduct-manage_st,EPMManageProduct-displayFactSheet";
				return this.iStartMyAppInAFrame(sUrl + flpApps + "#EPMProduct-manage_st");
			},
			iStartTheExtNav_TK_CallonNonExistingObject: function(oOptions) {
				var flpApps = "&flpApps=EPMProduct-manage_st";
				return this.iStartMyAppInAFrame(sUrl + flpApps + "#EPMProduct-manage_st?Product=XX-4711&DraftUUID=guid'00000000-0000-0000-0000-000000000000'&IsActiveEntity=true");
			},
			iStartTheExtNav_SK_CallonNonExistingObject: function(oOptions) {
				var flpApps = "&flpApps=EPMProduct-manage_st";
				return this.iStartMyAppInAFrame(sUrl + flpApps + "#EPMProduct-manage_st?ProductForEdit=XX-4711");
			},

			iStartTheExtNav_TK_CallonExistingActiveObject: function(oOptions) {
				var flpApps = "&flpApps=EPMProduct-manage_st";
				var sFullUrl = sUrl + flpApps + "#EPMProduct-manage_st?Product=HT-1000&DraftUUID=guid'00000000-0000-0000-0000-000000000000'&IsActiveEntity=true"
				var sManifest = oOptions && oOptions.manifest;
				if (sManifest){
					sFullUrl = sFullUrl + "&manifest=" + sManifest;
				}
				return this.iStartMyAppInAFrame(sFullUrl);
			},
			iStartTheExtNav_SK_CallonExistingActiveObject: function(oOptions) {
				var flpApps = "&flpApps=EPMProduct-manage_st";
				return this.iStartMyAppInAFrame(sUrl + flpApps + "#EPMProduct-manage_st?ProductForEdit=HT-1001");
			},
			iStartTheExtNav_TK_CallonExistingActiveObjectButAlsoDraftExist: function(oOptions) {
				var flpApps = "&flpApps=EPMProduct-manage_st";
				return this.iStartMyAppInAFrame(sUrl + flpApps + "#EPMProduct-manage_st?Product=HT-1022&DraftUUID=guid'00000000-0000-0000-0000-000000000000'&IsActiveEntity=true");
			},
			iStartTheExtNav_SK_CallonExistingActiveObjectButAlsoDraftExist: function(oOptions) {
				var flpApps = "&flpApps=EPMProduct-manage_st";
				return this.iStartMyAppInAFrame(sUrl + flpApps + "#EPMProduct-manage_st?ProductForEdit=HT-1022");
			},

			iStartTheExtNav_TK_CallonExistingDraftObjectButAlsoActiveExist: function(oOptions) {
				var flpApps = "&flpApps=EPMProduct-manage_st";
				return this.iStartMyAppInAFrame(sUrl + flpApps + "#EPMProduct-manage_st?Product=HT-1022&DraftUUID=guid'00505691-2ec5-1ed7-87ef-84874c501bd9'&IsActiveEntity=false");
			},

			iStartTheExtNav_TK_CallonExistingDraftObjectButAlsoActiveExist_LegacyDraftUUID: function(oOptions) {
				var flpApps = "&flpApps=EPMProduct-manage_st";
				return this.iStartMyAppInAFrame(sUrl + flpApps + "#EPMProduct-manage_st?Product=HT-1022&DraftUUID=00505691-2ec5-1ed7-87ef-84874c501bd9&IsActiveEntity=false");
			},

			iStartTheExtNav_TK_CallonOldWrongDraftObjectButAlsoActiveExist: function(oOptions) {
				var flpApps = "&flpApps=EPMProduct-manage_st";
				return this.iStartMyAppInAFrame(sUrl + flpApps + "#EPMProduct-manage_st?Product=HT-1022&DraftUUID=guid'11111111-2222-3333-4444-555555555555'&IsActiveEntity=false");
			},

			iStartTheExtNav_TK_CallonNewDraftObjectAndActiveNotExist: function(oOptions) {
				var flpApps = "&flpApps=EPMProduct-manage_st";
				return this.iStartMyAppInAFrame(sUrl + flpApps + "#EPMProduct-manage_st?Product=&DraftUUID=guid'00505691-2ec5-1ee7-858b-801a0b28e932'&IsActiveEntity=false");
			},

			iStartTheExtNav_SK_CallonNewDraftObjectAndActiveNotExist: function(oOptions) {
				var flpApps = "&flpApps=EPMProduct-manage_st";
				return this.iStartMyAppInAFrame(sUrl + flpApps + "#EPMProduct-manage_st?ProductForEdit=EPM-023666");
			},

			iStartTheExtNav_SK_CallonNewDraft_SKEmpty_ObjectAndActiveNotExist: function(oOptions) {
				var flpApps = "&flpApps=EPMProduct-manage_st";
				return this.iStartMyAppInAFrame(sUrl + flpApps + "#EPMProduct-manage_st?ProductForEdit=");
			},

			iStartTheExtNav_CREATE_Call: function(oOptions) {
				var flpApps = "&flpApps=EPMProduct-manage_st";
				return this.iStartMyAppInAFrame(sUrl + flpApps + "#EPMProduct-manage_st?mode=create");
			},

			iStartTheExtNav_EDIT_TK_CallonExistingActiveObject: function(oOptions) {
				var flpApps = "&flpApps=EPMProduct-manage_st";
				return this.iStartMyAppInAFrame(sUrl + flpApps + "#EPMProduct-manage_st?preferredMode=edit&Product=HT-1010&DraftUUID=00000000-0000-0000-0000-000000000000&IsActiveEntity=true");
			},

			iStartTheExtNav_EDIT_SK_CallonExistingActiveObject: function(oOptions) {
				var flpApps = "&flpApps=EPMProduct-manage_st";
				return this.iStartMyAppInAFrame(sUrl + flpApps + "#EPMProduct-manage_st?preferredMode=edit&ProductForEdit=EPM-023666");
			},

			iStartTheExtNav_EDIT_TK_CallonExistingActiveObjectButForeignDraftExist: function(oOptions) {
				var flpApps = "&flpApps=EPMProduct-manage_st";
				return this.iStartMyAppInAFrame(sUrl + flpApps + "#EPMProduct-manage_st?preferredMode=edit&Product=HT-1030&DraftUUID=00000000-0000-0000-0000-000000000000&IsActiveEntity=true");
			},

			iStartTheObjectPage: function(sManifest) {
				var sOpaFrame = "test-resources/sap/suite/ui/generic/template/demokit/demokit.html?serverDelay=0&responderOn=true&sap-ui-language=en_US&demoApp=sttaproducts&sap-ui-layer=VENDOR";
				if (sManifest) {
					sOpaFrame = sOpaFrame + "&manifest=" + sManifest; //&manifest=manifestDynamicHeaderInFCL
				}
				sOpaFrame = sOpaFrame + "#/STTA_C_MP_Product(Product='HT-1000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)";
				return this.iStartMyAppInAFrame(sOpaFrame);
			},

			iStartTheObjectPageWithChange: function(sManifest) {
				var sOpaFrame = "test-resources/sap/suite/ui/generic/template/demokit/demokit.html?serverDelay=0&responderOn=true&sap-ui-language=en_US&withChange=true&demoApp=sttaproducts&sap-ui-layer=VENDOR";
				if (sManifest) {
					sOpaFrame = sOpaFrame + "&manifest=" + sManifest; //&manifest=manifestDynamicHeaderInFCL
				}
				sOpaFrame = sOpaFrame + "#/STTA_C_MP_Product(Product='HT-1000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)";
				return this.iStartMyAppInAFrame(sOpaFrame);
			},


			iStartTheExtNav_TK_CallonExistingActiveObject_LegacyDraftUUID: function(oOptions) {
				var flpApps = "&flpApps=EPMProduct-manage_st";
				return this.iStartMyAppInAFrame(sUrl + flpApps + "#EPMProduct-manage_st?Product=HT-1001&DraftUUID=guid'00000000000000000000000000000000'&IsActiveEntity=true");
			},

			iTeardownMyApp: function() {
				OpaDataStore.clearData();
				return this.iTeardownMyAppFrame();
			},

			iLookAtTheScreen: function() {
				return this;
			},

			iClickTheButtonWithId: function(sId, sButtonText) {
			 	return this.waitFor({
			 		id: sId,
			 		success: function (oButton) {
			 			oButton.firePress();
			 		},
			 		errorMessage: "The " + sButtonText + " button could not be found"
			 	});
			},

			// click an item in the SmartTable - will navigate to Object Page
			iClickTheItemInAnyTable: function(iIndex, sPrefix, sViewName, sViewNamespace) {
				return this.waitFor({
					id: sPrefix + "responsiveTable",
					viewName: sViewName,
					viewNamespace: sViewNamespace,
					matchers: [
						new AggregationFilled({
							name: "items"
						})
					],
					actions: function(oControl) {
						var oItem = oControl.getItems()[iIndex];
						OpaDataStore.setData("tableItems",  oControl.getItems());

						// store item data from List Report to Object page
						OpaDataStore.setData("navContextPath", oItem.getBindingContext().getPath());
						OpaDataStore.setData("selectedItem", oItem);

						oControl.fireItemPress({listItem:oItem});
					},
					errorMessage: "The Smart Table is not rendered correctly"
				});
			},

			theSmLiQvPopoverOpensAndContainsExtraContent: function(sFieldGroupName) {
				return this.waitFor({
					controlType: "sap.m.Popover",
					matchers: [
						function (oPopover) {
							var bResult = false;
							var oNavigationPopover = oPopover.getContent()[0];
							var oContent = oNavigationPopover && oNavigationPopover.getItems()[1];
							var aControls = oContent && oContent.getContent(); //
							for(var i = 0; i < aControls.length; i++){
								//for a field group
								//aControls contains 0 = NewTitleArea, 1 SmartForm, 2 SmartForm
								var oControl = aControls[i];
								oControl = oControl && oControl.getItems && oControl.getItems() && oControl.getItems()[0]; //needed for VBox
								var sControlName = oControl && oControl.getMetadata && oControl.getMetadata() && oControl.getMetadata()._sClassName;
								if (sControlName === "sap.ui.comp.smartform.SmartForm"){
									var aGroups = oControl && oControl.getGroups();
									var oGroup = aGroups[0];
									if (oGroup && oGroup.getTitle && oGroup.getTitle() === sFieldGroupName){
										bResult = true;
										break;
									}
								}
								//for a contact
								if (sControlName === "sap.m.VBox" ){
									var vbox = oControl.getItems() && oControl.getItems()[0];
									var oLabel = vbox && vbox.getItems()[0];
									var sText = oLabel && oLabel.getHtmlText();

									if (sText && sText.indexOf(sFieldGroupName) > -1 ){
										bResult = true;
										break;
									}
								}
							}
/*
							var oForm = oContent && oContent.getContent()[1];
							var aGroups = oForm && oForm.getGroups();
							//check for the labels of the groups
							for(var i = 0; i < aGroups.length; i++){
								var oGroup = aGroups[i];
								if (oGroup && oGroup.getTitle && oGroup.getTitle() === sFieldGroupName){
									bResult = true;
									break;
								}
							}*/
							return bResult;
						}
					],
					success: function (aControl) {
						ok(true, "The SmLiQvPopover is opened with content");
					},
					errorMessage: "The SmLiQvPopover is not rendered correctly"
				});
			},

			iClickTheTitleAreaLinkOnTheSmLiQvPopover: function() {
				return this.waitFor({
					controlType: "sap.m.Popover",
					actions: function (oPopover) {
							var oNavigationPopover = oPopover.getContent()[0];
							var oContent = oNavigationPopover && oNavigationPopover.getItems()[1];
							var oTitle = oContent.byId("title");
							if (oTitle && oTitle.firePress) {
								oTitle.firePress();
							}
					},
					errorMessage: "Couldn't click on a link in the SmLiQvPopover."
				});
			}

		});
	}
);
