/*** List Report actions ***/
sap.ui.define(
	["sap/ui/test/matchers/PropertyStrictEquals",
	 "sap/ui/test/matchers/AggregationFilled",
	 "sap/ui/test/actions/Press",
	 "sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/utils/OpaDataStore",
	 "sap/ui/test/actions/EnterText"],

	function (PropertyStrictEquals, AggregationFilled, Press, OpaDataStore, EnterText) {

		return function (prefix, viewName, viewNamespace) {

			return {
				/* CLICK ON ITEM ON TABLE */
				iClickTheItemInTheTable: function(iIndex) {
					console.log ( "OPA5::ListReportActions::iClickTheItemInTheTable" + " iIndex: " + iIndex + " prefix: " + prefix + " viewName: " + viewName + " viewNamespace: " + viewNamespace);
					return this.iClickTheItemInAnyTable(iIndex, prefix, viewName, viewNamespace); // Common.js
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

				/* WAIT FOR DIALOG AND PRESS CANCEL BUTTON */
				iWaitForADialogAndPressTheCancelButton: function () {
					return this.waitFor({
						controlType: "sap.m.Dialog",
						autoWait: true,
						matchers: [
							function (oDialog) {
								var aButtons = oDialog.getButtons();
								for(var i = 0; i<aButtons.length; i++){
									var oButton = aButtons[i];
									if (oButton.getText() === "Cancel"){
										return true;
									}
								}
								return false;
							}
						],
						actions: function (oDialog) {
							oDialog.getEndButton().firePress();
						},
						errorMessage: "The Dialog is not rendered correctly"
					});
				},

				iClickOnSmartVariantManagementSelection: function () {
					return this.waitFor({
						id: prefix+"template::PageVariant-trigger",
						viewName: viewName,
						viewNamespace: viewNamespace,

						actions: new Press(),
						errorMessage: "The Smart Variant management cannot be clicked"
					});
				},
				
				iNameTheVariantWhileSaving: function (sText) {
					return this.waitFor({
						controlType: "sap.m.Input",
						viewName: viewName,
						viewNamespace: viewNamespace,

						actions: [new EnterText({ text: sText })]
						          
					});
				},
				
				iSelectTheVariantFromMyViews: function (sVariantName) {
					return this.waitFor({
						controlType: "sap.ui.comp.variants.VariantItem",
						matchers: [
									new PropertyStrictEquals({
										name: "text",
										value: sVariantName
									})
								],
						actions: new Press(),
						errorMessage: "The Variant cannot be Selected"
					});
				}				
			};
		};
});
