/*** List Report Actions ***/
sap.ui.define(
	["sap/ui/test/matchers/PropertyStrictEquals", "sap/ui/test/matchers/AggregationFilled", "sap/ui/test/actions/Press",
	 "sap/suite/ui/generic/template/integration/ManageProducts_new/utils/OpaDataStore"],

	function (PropertyStrictEquals, AggregationFilled, Press, OpaDataStore) {

		return function (prefix, viewName, viewNamespace) {

			return {
				/* BUTTON PRESS ON PAGE */
				iClickTheButton: function (buttonText) {
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

				/* BUTTON PRESS ON TABLE TOOLBAR */
				iClickTheButtonInTheSmartTableToolbar: function (buttonText) {
					return this.waitFor({
						controlType: "sap.ui.comp.smarttable.SmartTable",
						success: function (aControl) {
							var aCustomToolbarContent = aControl[0].getCustomToolbar().getContent();
							var iCustomToolbarContentLength = aCustomToolbarContent.length;
							for (var i = 0; i < iCustomToolbarContentLength; i++) {
								if (aCustomToolbarContent[i].getMetadata().getName() === "sap.m.Button" && aCustomToolbarContent[i].getText() === buttonText) {
									aCustomToolbarContent[i].firePress();
									break;
								}

								if (i === iCustomToolbarContentLength - 1) {
									notOk(true, "The " + buttonText + "button could not be found");
								}
							}
						},
						errorMessage: "The Smart Table is not rendered correctly"
					});
				},

				/* CLICK ON ITEM ON TABLE */
				iClickTheItemInTheTable: function(iIndex) {
					return this.iClickTheItemInAnyTable(iIndex, prefix, viewName, viewNamespace); // Common.js
				},

				/* SELECT ITEMS ON TABLE */
				iSelectItemsInTheTable: function (aItemIndex) {
					return this.waitFor({
						id: prefix + "responsiveTable",
						viewName: viewName,
						viewNamespace: viewNamespace,
						matchers: [
							new AggregationFilled({
								name: "items"
							})
						],
						actions: function(oTable) {
							var aTableItems = oTable.getItems();
							for (var i = 0; i < aItemIndex.length; i++) {
								oTable.setSelectedItem(aTableItems[aItemIndex[i]]);
							}
							oTable.fireSelectionChange({
								listItems: 	oTable.getSelectedItems(),
								selected: true
							});
						},
						errorMessage: "The Smart Table is not rendered correctly"
					});
				},
				
				iClickOnACellInTheTable: function (iRow, sColumnIdentifiedByColumnTitle) {
					return this.waitFor({
						id: prefix + "responsiveTable",
						viewName: viewName,
						viewNamespace: viewNamespace,
						matchers: [
							new AggregationFilled({
								name: "items"
							})
						],
						actions: function(oTable) {
							//find the right column
							var aTableColumns = oTable.getColumns();
							var iMarkedColumn = -1;
							for (var i = 0; i < aTableColumns.length; i++) {
								var oTableColumn = aTableColumns[i];
								var oHeader = oTableColumn.getHeader();
								var sText = oHeader && oHeader.getText && oHeader.getText();
								if (sText === sColumnIdentifiedByColumnTitle){
									iMarkedColumn = i;									
									break;
								}
							}	
							if (iMarkedColumn > 0){
								var aTableItems = oTable.getItems();
								var oTableItem = aTableItems[iRow];
								var aCells = oTableItem.getCells();
								var oCell = aCells[iMarkedColumn];
								if (oCell.firePress) {
									oCell.firePress();
								}
							}
						},
						errorMessage: "Couldn't click on a link in the table."
					});
				},
				
				/* DE-SELECT ITEMS ON TABLE */
				iDeselectItemsInTheTable: function (aItemIndex) {
					return this.waitFor({
						id: prefix + "responsiveTable",
						viewName: viewName,
						viewNamespace: viewNamespace,
						matchers: [
							new AggregationFilled({
								name: "items"
							})
						],
						actions: function(oTable) {
							var aTableItems = oTable.getItems();
							for (var i = 0; i < aItemIndex.length; i++) {
								oTable.setSelectedItem(aTableItems[aItemIndex[i]], false);
							}
						},
						errorMessage: "The Smart Table is not rendered correctly"
					});
				},
				
				/* SELECT ITEM WITH DRAFT STATUS ON TABLE */
				iSelectAnItemWithDraftStatus: function (status) {
					return this.waitFor({
						id: prefix + "responsiveTable",
						viewName: viewName,
						viewNamespace: viewNamespace,
						matchers: [
							new AggregationFilled({
								name: "items"
							})
						],
						actions: function (oTable) {
							var aItems = oTable.getItems(),
								oModel = aItems[0].getModel();

							for (var i = 0; i < aItems.length; i++) {
								var oEntity = oModel.getProperty(aItems[i].getBindingContext().getPath());

								if (status === "Draft" && !oEntity.IsActiveEntity) {
									oTable.setSelectedItem(aItems[i]);
									OpaDataStore.setData("selectedItems", [{
										item: aItems[i],
										draftStatus: status
									}]);
									break;
								}
								else if (status === "Unsaved Changes" && oEntity.HasDraftEntity) {
									sLockedBy = oModel.getProperty("/" + oEntity.DraftAdministrativeData.__ref).InProcessByUserDescription;
									if (sLockedBy === "") {
										oTable.setSelectedItem(aItems[i]);
										OpaDataStore.setData("selectedItems", [{
											item: aItems[i],
											draftStatus: status
										}]);
										break;
									}
								}
								else if (status === "Locked" && oEntity.HasDraftEntity) {
									sLockedBy = oModel.getProperty("/" + oEntity.DraftAdministrativeData.__ref).InProcessByUserDescription;
									if (sLockedBy !== "") {
										oTable.setSelectedItem(aItems[i]);
										OpaDataStore.setData("selectedItems", [{
											item: aItems[i],
											draftStatus: status
										}]);
										break;
									}
								}
							}
						},
						errorMessage: "The Smart Table is not rendered correctly"
					});
				},

				/* DEPRECATED - Use the new function from the testLibrary */
				/* SET FILTER ON SMART FILTER BAR */
				/*
				iSetTheFilter: function(searchFieldName, value) {
					return this.waitFor({
						controlType: "sap.ui.comp.smartfilterbar.SmartFilterBar",
						viewName: viewName,
						viewNamespace: viewNamespace,
						success: function (aControl) {
							var oSmartFilterBar, oHorizontalLayout;
							var aSmartFilterBarContent, aVerticalLayout;

							oSmartFilterBar = aControl[0];
							aSmartFilterBarContent = oSmartFilterBar.getContent();
							for (var i = 0; i < aSmartFilterBarContent.length; i++) {
								if (oHorizontalLayout = aSmartFilterBarContent[i].getMetadata().getName() === "sap.ui.layout.HorizontalLayout") {
									oHorizontalLayout = aSmartFilterBarContent[i];
									break;
								}
							}

							if (!oHorizontalLayout || oHorizontalLayout.getContent().length < 1) {
								notOk("The Smart Filter Bar was not rendered correctly");
								return;
							}

							aVerticalLayout = oHorizontalLayout.getContent();
							for (var i = 0; i < aVerticalLayout.length; i++) {
								var oVerticalLayout = aVerticalLayout[i].getContent();
								var sSearchFieldLabel = oVerticalLayout[0].getText();
								var oSearchFieldControl = oVerticalLayout[1];
								if (sSearchFieldLabel === searchFieldName) {
									if (typeof value === "string") {
										oSearchFieldControl.setValue(value);
									}
									else if (typeof value === "number") {
										oSearchFieldControl.setSelectedIndex(value);
									}
									break;
								}
							}
						},
						errorMessage: "The Smart Filter Bar was not found"
					});
				},
				*/

				/* WAIT FOR WARNING DIALOG AND PRESS CONFIRMATION BUTTON */
				iWaitForADialogAndPressTheConfirmationButton: function () {
					return this.waitFor({
						controlType: "sap.m.Dialog",
						viewName: viewName,
						viewNamespace: viewNamespace,
						matchers: [
							new PropertyStrictEquals({
								name: "state",
								value: "Warning"
							})
						],
						actions: function (oDialog) {
							oDialog.getBeginButton().firePress();
						},
						errorMessage: "The Dialog is not rendered correctly"
					});
				},
				
				/* WAIT FOR ERROR DIALOG AND PRESS CLOSE BUTTON */
				iWaitForAnErrorDialogAndPressTheCloseButton: function () {
					return this.waitFor({
						controlType: "sap.m.Dialog",
						viewName: viewName,
						viewNamespace: viewNamespace,
						matchers: [
							new PropertyStrictEquals({
								name: "state",
								value: "Error"
							})
						],
						actions: function (oDialog) {
							oDialog.getBeginButton().firePress();
						},
						errorMessage: "The Dialog is not rendered correctly"
					});
				},
				
				/* SET AN ITEM TO NOT DELETABLE (BY UPDATING DELETABLE-PATH) */
				iSetItemsToNotDeletableInTheTable: function (aItemIndex) {
					return this.waitFor({
						id: prefix + "responsiveTable",
						viewName: viewName,
						viewNamespace: viewNamespace,
						matchers: [
							new AggregationFilled({
								name: "items"
							})
						],
						actions: function(oControl) {
							var oModel = oControl.getModel();
							var aTableItems = oControl.getItems();
							for (var i = 0; i < aItemIndex.length; i++) {
								var sPath = aTableItems[aItemIndex[i]].getBindingContext().getPath();
								oModel.setProperty(sPath + "/Delete_mc", false);
							}
						},
						errorMessage: "The Smart Table is not rendered correctly"
					});
				},
				
				iClickSmartTableSettingButton: function() {
					var SettingsButton = null;
					return this.waitFor({
						controlType: "sap.m.Button",
						check: function(aButtons) {
							for (var i=0; i < aButtons.length; i++ ){
								var sIcon = aButtons[i].getIcon();
								if (sIcon === "sap-icon://action-settings") {
									SettingsButton = aButtons[i];
									return true;
								} else if (sIcon === "sap-icon://overflow") {
									aButtons[i].firePress();
									return false;
								}
							}
							return false;
						},
						success: function() {
							SettingsButton.$().trigger("tap");
						},
						errorMessage: "Did not find the 'Setting' button."
					});
				},
				
				iClickOnDialogButton: function (sButton) {
					var oButton = null;
					return this.waitFor({
						controlType: "sap.m.Button",
						check: function (aButtons) {
							for (var i = 0; i < aButtons.length; i++) {
								var sText = aButtons[i].getText();
								if (sText === sButton) {
									oButton = aButtons[i];
									return true;
								}
							}
							return false;
						},
						success: function () {
							oButton.$().trigger("tap");
						},
						errorMessage: "Did not find the " + sButton + " Button."
					});
				}
			};
		};
});
